import { describe, expect, it, vi } from 'vitest';
import { CarReader } from '@ipld/car';
import { unixfs } from '@helia/unixfs';
import toBuffer from 'it-to-buffer';
import {
  exportChannel,
  serializeEventsToNdjson,
  parseImetaTag,
  collectAttachments,
  generateCoverageManifest,
  buildCar,
  fetchChannelEvents,
  type NostrEvent,
  type AttachmentBlob,
  type SessionReader,
} from '../src/export.js';

describe('Buzz Vault export module', () => {
  const sampleEvent1: NostrEvent = {
    id: 'b1a2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    pubkey: '1111111111111111111111111111111111111111111111111111111111111111',
    created_at: 1700000000,
    kind: 9,
    tags: [
      ['h', 'channel-alpha'],
      ['imeta', 'url https://buzz.community/media/aaa111.png', 'm image/png', 'x aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'size 4096', 'dim 800x600'],
    ],
    content: 'Hello world in channel alpha!',
    sig: 'sig11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
  };

  const sampleEvent2: NostrEvent = {
    id: 'f9e8d7c6b5a43210fedcba9876543210fedcba9876543210fedcba9876543210',
    pubkey: '2222222222222222222222222222222222222222222222222222222222222222',
    created_at: 1700000500,
    kind: 9,
    tags: [
      ['h', 'channel-alpha'],
      ['imeta', 'url https://buzz.community/media/bbb222.pdf', 'm application/pdf', 'sha256 bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 'size 8192'],
    ],
    content: 'Second message in channel alpha',
    sig: 'sig22222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222',
  };

  describe('1. Event paging and NDJSON serialization', () => {
    it('serializes events to NDJSON preserving all fields, signatures, and IDs intact', () => {
      const events = [sampleEvent1, sampleEvent2];
      const ndjson = serializeEventsToNdjson(events);

      const lines = ndjson.trim().split('\n');
      expect(lines).toHaveLength(2);

      const parsed1 = JSON.parse(lines[0]);
      expect(parsed1.id).toBe(sampleEvent1.id);
      expect(parsed1.pubkey).toBe(sampleEvent1.pubkey);
      expect(parsed1.created_at).toBe(sampleEvent1.created_at);
      expect(parsed1.kind).toBe(9);
      expect(parsed1.tags).toEqual(sampleEvent1.tags);
      expect(parsed1.content).toBe(sampleEvent1.content);
      expect(parsed1.sig).toBe(sampleEvent1.sig);

      const parsed2 = JSON.parse(lines[1]);
      expect(parsed2.id).toBe(sampleEvent2.id);
      expect(parsed2.sig).toBe(sampleEvent2.sig);
    });

    it('returns empty string when serializing empty events array', () => {
      expect(serializeEventsToNdjson([])).toBe('');
    });

    it('pages session.readPage until exhausted and handles deduplication', async () => {
      const mockReadPage = vi.fn()
        .mockResolvedValueOnce({
          events: [sampleEvent2],
          relayCount: 2,
        })
        .mockResolvedValueOnce({
          events: [sampleEvent1],
          relayCount: 2,
        })
        .mockResolvedValueOnce({
          events: [],
          relayCount: 0,
        });

      const session: SessionReader = { readPage: mockReadPage };
      const events = await fetchChannelEvents(session, 'channel-alpha', { pageSize: 2 });

      expect(mockReadPage).toHaveBeenCalledTimes(3);
      expect(events).toHaveLength(2);
      expect(events[0].id).toBe(sampleEvent1.id);
      expect(events[1].id).toBe(sampleEvent2.id);

      const secondCallFilter = mockReadPage.mock.calls[1][0][0];
      expect(secondCallFilter.until).toBe(sampleEvent2.created_at);
      expect(secondCallFilter.before_id).toBe(sampleEvent2.id);
    });

    it('supports pre-fetched events as initial seed or direct source', async () => {
      const result = await exportChannel({
        channelId: 'channel-alpha',
        events: [sampleEvent2, sampleEvent1],
      });

      expect(result.coverage.eventCount).toBe(2);
      expect(result.coverage.oldestCreatedAt).toBe(1700000000);
      expect(result.coverage.newestCreatedAt).toBe(1700000500);
    });
  });

  describe('2. Attachment handling and coverage manifest', () => {
    it('parses imeta tags in both space-delimited and paired formats', () => {
      const tag1 = ['imeta', 'url /media/photo.jpg', 'm image/jpeg', 'x 1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'size 2048', 'dim 1920x1080'];
      const meta1 = parseImetaTag(tag1);
      expect(meta1).toEqual({
        sha256: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        url: '/media/photo.jpg',
        name: 'photo.jpg',
        mimeType: 'image/jpeg',
        size: 2048,
        dim: '1920x1080',
      });

      const tag2 = ['imeta', 'url', '/media/doc.pdf', 'sha256', 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890', 'm', 'application/pdf', 'size', '5000'];
      const meta2 = parseImetaTag(tag2);
      expect(meta2?.sha256).toBe('abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890');
      expect(meta2?.mimeType).toBe('application/pdf');
      expect(meta2?.size).toBe(5000);
    });

    it('extracts sha256 from URL when not explicit in imeta tag', () => {
      const hash = '3b5d5c7e8f90123456789abcdef0123456789abcdef0123456789abcdef01234';
      const tag = ['imeta', `url /media/${hash}.png`, 'm image/png'];
      const meta = parseImetaTag(tag);
      expect(meta?.sha256).toBe(hash);
      expect(meta?.name).toBe(`${hash}.png`);
    });

    it('collects and deduplicates attachments across events and merges pre-fetched blobs', () => {
      const duplicateAttachmentEvent: NostrEvent = {
        ...sampleEvent1,
        id: 'dup1',
        created_at: 1700000100,
      };

      const blob: AttachmentBlob = {
        sha256: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        data: new Uint8Array([1, 2, 3, 4]),
        name: 'custom-name.png',
      };

      const attachments = collectAttachments([sampleEvent1, duplicateAttachmentEvent, sampleEvent2], [blob]);
      expect(attachments).toHaveLength(2);

      const merged = attachments.find((a) => a.sha256 === blob.sha256);
      expect(merged?.size).toBe(4);
      expect(merged?.name).toBe('custom-name.png');
    });

    it('generates accurate coverage manifest including time range and counts', () => {
      const attachments = collectAttachments([sampleEvent1, sampleEvent2]);
      const manifest = generateCoverageManifest(
        'channel-alpha',
        [sampleEvent1, sampleEvent2],
        attachments,
        { auditHead: 'head-tx-123', exportedAt: 1700001000000 }
      );

      expect(manifest).toEqual({
        channelId: 'channel-alpha',
        exportedAt: 1700001000000,
        eventCount: 2,
        oldestCreatedAt: 1700000000,
        newestCreatedAt: 1700000500,
        attachmentCount: 2,
        attachments: [
          {
            sha256: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            url: 'https://buzz.community/media/aaa111.png',
            name: 'aaa111.png',
            size: 4096,
            mimeType: 'image/png',
          },
          {
            sha256: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
            url: 'https://buzz.community/media/bbb222.pdf',
            name: 'bbb222.pdf',
            size: 8192,
            mimeType: 'application/pdf',
          },
        ],
        auditHead: 'head-tx-123',
      });
    });

    it('handles coverage manifest with 0 events', () => {
      const manifest = generateCoverageManifest('empty-channel', [], []);
      expect(manifest.eventCount).toBe(0);
      expect(manifest.oldestCreatedAt).toBeNull();
      expect(manifest.newestCreatedAt).toBeNull();
      expect(manifest.attachmentCount).toBe(0);
      expect(manifest.attachments).toEqual([]);
      expect(manifest.auditHead).toBeNull();
    });
  });

  describe('3. In-memory UnixFS CAR packing and verification', () => {
    it('builds a valid CAR in memory without Node fs dependencies', async () => {
      const files = [
        { path: 'test.txt', content: new TextEncoder().encode('Hello in-memory CAR') },
      ];
      const { carBytes, rootCid } = await buildCar(files);

      expect(carBytes).toBeInstanceOf(Uint8Array);
      expect(carBytes.length).toBeGreaterThan(0);
      expect(typeof rootCid).toBe('string');
      expect(rootCid.startsWith('bafy')).toBe(true);

      const reader = await CarReader.fromBytes(carBytes);
      const roots = await reader.getRoots();
      expect(roots).toHaveLength(1);
      expect(roots[0].toString()).toBe(rootCid);
    });

    it('creates CAR pack containing events.ndjson, manifest.json, and attachments', async () => {
      const attachmentBytes = new Uint8Array([10, 20, 30, 40, 50]);
      const blob: AttachmentBlob = {
        sha256: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        data: attachmentBytes,
        name: 'photo.png',
      };

      const result = await exportChannel({
        channelId: 'channel-alpha',
        events: [sampleEvent1, sampleEvent2],
        attachments: [blob],
        auditHead: 'head-456',
      });

      expect(result.carBytes).toBeInstanceOf(Uint8Array);
      expect(result.rootCid).toBeDefined();
      expect(result.coverage.eventCount).toBe(2);
      expect(result.coverage.attachmentCount).toBe(2);

      const reader = await CarReader.fromBytes(result.carBytes);
      const roots = await reader.getRoots();
      expect(roots[0].toString()).toBe(result.rootCid);

      const blocksMap = new Map<string, Uint8Array>();
      for await (const block of reader.blocks()) {
        blocksMap.set(block.cid.toString(), block.bytes);
      }
      expect(blocksMap.size).toBeGreaterThan(0);

      const fs = unixfs({
        blockstore: {
          async *get(cid) {
            const block = blocksMap.get(cid.toString());
            if (!block) throw new Error(`Missing block ${cid}`);
            yield block;
          },
          async put(cid, bytes) {
            blocksMap.set(cid.toString(), bytes);
            return cid;
          },
          async has(cid) {
            return blocksMap.has(cid.toString());
          },
        },
      });

      const rootEntries: Array<{ name: string; path: string }> = [];
      for await (const item of fs.ls(result.rootCid)) {
        rootEntries.push({ name: item.name, path: item.path });
      }

      const fileNames = rootEntries.map((e) => e.name);
      expect(fileNames).toContain('events.ndjson');
      expect(fileNames).toContain('manifest.json');
      expect(fileNames).toContain('attachments');

      const eventsEntry = rootEntries.find((e) => e.name === 'events.ndjson');
      expect(eventsEntry).toBeDefined();
      const eventChunks: Uint8Array[] = [];
      for await (const chunk of fs.cat(eventsEntry!.path)) {
        eventChunks.push(chunk);
      }
      const eventsText = new TextDecoder().decode(await toBuffer(eventChunks));
      const parsedEvents = eventsText.trim().split('\n').map((l) => JSON.parse(l));
      expect(parsedEvents).toHaveLength(2);
      expect(parsedEvents[0].id).toBe(sampleEvent1.id);
      expect(parsedEvents[0].sig).toBe(sampleEvent1.sig);
      expect(parsedEvents[1].id).toBe(sampleEvent2.id);
      expect(parsedEvents[1].sig).toBe(sampleEvent2.sig);

      const manifestEntry = rootEntries.find((e) => e.name === 'manifest.json');
      expect(manifestEntry).toBeDefined();
      const manifestChunks: Uint8Array[] = [];
      for await (const chunk of fs.cat(manifestEntry!.path)) {
        manifestChunks.push(chunk);
      }
      const manifestObj = JSON.parse(new TextDecoder().decode(await toBuffer(manifestChunks)));
      expect(manifestObj.channelId).toBe('channel-alpha');
      expect(manifestObj.eventCount).toBe(2);
      expect(manifestObj.auditHead).toBe('head-456');

      const attachmentsEntry = rootEntries.find((e) => e.name === 'attachments');
      expect(attachmentsEntry).toBeDefined();
      const attachmentSubEntries: Array<{ name: string; path: string }> = [];
      for await (const item of fs.ls(attachmentsEntry!.path)) {
        attachmentSubEntries.push({ name: item.name, path: item.path });
      }
      expect(attachmentSubEntries.map((e) => e.name)).toContain('photo.png');

      const photoEntry = attachmentSubEntries.find((e) => e.name === 'photo.png');
      const photoChunks: Uint8Array[] = [];
      for await (const chunk of fs.cat(photoEntry!.path)) {
        photoChunks.push(chunk);
      }
      const photoData = await toBuffer(photoChunks);
      expect(photoData).toEqual(attachmentBytes);
    });
  });
});
