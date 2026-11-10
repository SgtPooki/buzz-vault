import { unixfs } from '@helia/unixfs';
import { CarWriter } from '@ipld/car';
import toBuffer from 'it-to-buffer';

export interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: readonly (readonly string[])[] | string[][];
  content: string;
  sig: string;
  [key: string]: unknown;
}

export interface AttachmentMetadata {
  sha256: string;
  url?: string;
  name?: string;
  size?: number;
  mimeType?: string;
  dim?: string;
}

export interface AttachmentBlob {
  sha256: string;
  data: Uint8Array;
  name?: string;
  path?: string;
  url?: string;
  size?: number;
  mimeType?: string;
  dim?: string;
}

export interface CoverageManifest {
  channelId: string;
  exportedAt: number;
  eventCount: number;
  oldestCreatedAt: number | null;
  newestCreatedAt: number | null;
  attachmentCount: number;
  attachments: Array<{
    sha256: string;
    url?: string;
    name?: string;
    size?: number;
    mimeType?: string;
  }>;
  auditHead?: string | null;
}

export interface SessionPageResult {
  events: readonly NostrEvent[];
  relayCount?: number;
}

export interface SessionReader {
  readPage(
    filters: readonly Record<string, unknown>[],
    settings?: Record<string, unknown>
  ): Promise<SessionPageResult>;
}

export interface ExportChannelOptions {
  channelId: string;
  session?: SessionReader;
  events?: readonly NostrEvent[];
  attachments?: readonly AttachmentBlob[];
  auditHead?: string | null;
  pageSize?: number;
  exportedAt?: number;
  signal?: AbortSignal;
}

export interface ExportResult {
  carBytes: Uint8Array;
  rootCid: string;
  coverage: CoverageManifest;
}

export function serializeEventsToNdjson(events: readonly NostrEvent[]): string {
  if (events.length === 0) return '';
  return events.map((event) => JSON.stringify(event)).join('\n') + '\n';
}

export function parseImetaTag(tag: readonly string[]): AttachmentMetadata | null {
  if (!tag || tag[0] !== 'imeta') return null;

  const metadata: AttachmentMetadata = { sha256: '' };
  const entries: Array<[string, string]> = [];
  let i = 1;

  while (i < tag.length) {
    const item = tag[i];
    if (typeof item !== 'string') {
      i++;
      continue;
    }
    const spaceIdx = item.indexOf(' ');
    if (spaceIdx > 0) {
      entries.push([item.slice(0, spaceIdx).trim(), item.slice(spaceIdx + 1).trim()]);
      i++;
    } else {
      entries.push([item.trim(), tag[i + 1]?.trim() ?? '']);
      i += 2;
    }
  }

  for (const [key, val] of entries) {
    const k = key.toLowerCase();
    if (k === 'x' || k === 'sha256' || k === 'hash') {
      metadata.sha256 = val.toLowerCase();
    } else if (k === 'url') {
      metadata.url = val;
    } else if (k === 'm' || k === 'mime' || k === 'type') {
      metadata.mimeType = val;
    } else if (k === 'size') {
      const parsedSize = parseInt(val, 10);
      if (!Number.isNaN(parsedSize)) metadata.size = parsedSize;
    } else if (k === 'dim') {
      metadata.dim = val;
    } else if (k === 'name' || k === 'filename') {
      metadata.name = val;
    }
  }

  if (!metadata.sha256 && metadata.url) {
    const hexMatch = metadata.url.match(/([a-fA-F0-9]{64})/);
    if (hexMatch) {
      metadata.sha256 = hexMatch[1].toLowerCase();
    }
  }

  if (!metadata.name && metadata.url) {
    try {
      const urlPath = metadata.url.startsWith('http')
        ? new URL(metadata.url).pathname
        : metadata.url;
      const lastSlash = urlPath.lastIndexOf('/');
      const basename = lastSlash >= 0 ? urlPath.slice(lastSlash + 1) : urlPath;
      if (basename) metadata.name = basename;
    } catch {
      // ignore url parse failure
    }
  }

  if (!metadata.sha256) return null;
  return metadata;
}

export function collectAttachments(
  events: readonly NostrEvent[],
  blobs?: readonly AttachmentBlob[]
): AttachmentMetadata[] {
  const map = new Map<string, AttachmentMetadata>();

  for (const event of events) {
    if (!event.tags) continue;
    for (const tag of event.tags) {
      if (Array.isArray(tag) && tag[0] === 'imeta') {
        const meta = parseImetaTag(tag);
        if (meta && meta.sha256) {
          const existing = map.get(meta.sha256);
          if (!existing) {
            map.set(meta.sha256, meta);
          } else {
            map.set(meta.sha256, {
              ...existing,
              url: existing.url ?? meta.url,
              name: existing.name ?? meta.name,
              size: existing.size ?? meta.size,
              mimeType: existing.mimeType ?? meta.mimeType,
              dim: existing.dim ?? meta.dim,
            });
          }
        }
      }
    }
  }

  if (blobs) {
    for (const blob of blobs) {
      const sha256 = blob.sha256.toLowerCase();
      const existing = map.get(sha256);
      map.set(sha256, {
        sha256,
        url: blob.url ?? existing?.url,
        name: blob.name ?? existing?.name,
        size: blob.size ?? blob.data.byteLength ?? existing?.size,
        mimeType: blob.mimeType ?? existing?.mimeType,
        dim: blob.dim ?? existing?.dim,
      });
    }
  }

  return [...map.values()];
}

export function generateCoverageManifest(
  channelId: string,
  events: readonly NostrEvent[],
  attachments: readonly AttachmentMetadata[],
  options: { auditHead?: string | null; exportedAt?: number } = {}
): CoverageManifest {
  let oldestCreatedAt: number | null = null;
  let newestCreatedAt: number | null = null;

  for (const event of events) {
    if (typeof event.created_at === 'number') {
      if (oldestCreatedAt === null || event.created_at < oldestCreatedAt) {
        oldestCreatedAt = event.created_at;
      }
      if (newestCreatedAt === null || event.created_at > newestCreatedAt) {
        newestCreatedAt = event.created_at;
      }
    }
  }

  return {
    channelId,
    exportedAt: options.exportedAt ?? Date.now(),
    eventCount: events.length,
    oldestCreatedAt,
    newestCreatedAt,
    attachmentCount: attachments.length,
    attachments: attachments.map((att) => ({
      sha256: att.sha256,
      ...(att.url ? { url: att.url } : {}),
      ...(att.name ? { name: att.name } : {}),
      ...(att.size !== undefined ? { size: att.size } : {}),
      ...(att.mimeType ? { mimeType: att.mimeType } : {}),
    })),
    auditHead: options.auditHead ?? null,
  };
}

export async function buildCar(
  files: Array<{ path: string; content: Uint8Array }>
): Promise<{ carBytes: Uint8Array; rootCid: string }> {
  const blocks = new Map<string, { cid: any; bytes: Uint8Array }>();
  const blockstore = {
    async *get(cid: any) {
      const b = blocks.get(cid.toString());
      if (!b) throw new Error(`Block not found: ${cid}`);
      yield b.bytes;
    },
    async put(cid: any, bytes: Uint8Array) {
      blocks.set(cid.toString(), { cid, bytes });
      return cid;
    },
    async has(cid: any) {
      return blocks.has(cid.toString());
    },
  };

  const fs = unixfs({ blockstore });
  const entries: Array<{ cid: any; path?: string }> = [];

  for await (const entry of fs.addAll(files, { wrapWithDirectory: true })) {
    entries.push({ cid: entry.cid, path: entry.path });
  }

  const rootEntry = entries[entries.length - 1];
  if (!rootEntry) {
    throw new Error('Failed to create UnixFS root');
  }
  const rootCid = rootEntry.cid;

  const { writer, out } = CarWriter.create([rootCid]);
  const chunks: Uint8Array[] = [];
  const writerPromise = (async () => {
    for await (const chunk of out) {
      chunks.push(chunk);
    }
  })();

  const rootBlock = blocks.get(rootCid.toString());
  if (rootBlock) {
    await writer.put(rootBlock);
  }

  for (const [cidStr, block] of blocks) {
    if (cidStr !== rootCid.toString()) {
      await writer.put(block);
    }
  }

  await writer.close();
  await writerPromise;

  const carBytes = await toBuffer(chunks);
  return {
    carBytes,
    rootCid: rootCid.toString(),
  };
}

export async function fetchChannelEvents(
  session: SessionReader,
  channelId: string,
  options: {
    pageSize?: number;
    signal?: AbortSignal;
    initialEvents?: readonly NostrEvent[];
  } = {}
): Promise<NostrEvent[]> {
  const limit = options.pageSize ?? 100;
  const allEvents: NostrEvent[] = [];
  const seenIds = new Set<string>();

  if (options.initialEvents) {
    for (const event of options.initialEvents) {
      if (!seenIds.has(event.id)) {
        seenIds.add(event.id);
        allEvents.push(event);
      }
    }
  }

  let cursor: { until?: number; before_id?: string } | undefined = undefined;

  if (allEvents.length > 0) {
    let oldest = allEvents[0];
    for (const e of allEvents) {
      if (
        e.created_at < oldest.created_at ||
        (e.created_at === oldest.created_at && e.id < oldest.id)
      ) {
        oldest = e;
      }
    }
    cursor = { until: oldest.created_at, before_id: oldest.id };
  }

  while (true) {
    options.signal?.throwIfAborted();
    const filter: Record<string, unknown> = {
      kinds: [9],
      '#h': [channelId],
      limit,
    };
    if (cursor?.until !== undefined) {
      filter.until = cursor.until;
      if (cursor.before_id !== undefined) {
        filter.before_id = cursor.before_id;
      }
    }

    const page = await session.readPage([filter], { signal: options.signal });
    const events = page?.events ?? [];
    if (events.length === 0) {
      break;
    }

    let addedCount = 0;
    let oldestInPage: NostrEvent | null = null;

    for (const event of events) {
      if (!seenIds.has(event.id)) {
        seenIds.add(event.id);
        allEvents.push(event);
        addedCount++;
      }
      if (
        !oldestInPage ||
        event.created_at < oldestInPage.created_at ||
        (event.created_at === oldestInPage.created_at && event.id < oldestInPage.id)
      ) {
        oldestInPage = event;
      }
    }

    if (addedCount === 0 || !oldestInPage) {
      break;
    }

    const relayCount = page.relayCount ?? events.length;
    if (relayCount < limit) {
      break;
    }

    cursor = { until: oldestInPage.created_at, before_id: oldestInPage.id };
  }

  allEvents.sort((a, b) => a.created_at - b.created_at || a.id.localeCompare(b.id));
  return allEvents;
}

export async function exportChannel(
  options: ExportChannelOptions
): Promise<ExportResult> {
  const { channelId, session, attachments = [], auditHead, pageSize, exportedAt, signal } = options;

  let events: NostrEvent[];
  if (session) {
    events = await fetchChannelEvents(session, channelId, {
      pageSize,
      signal,
      initialEvents: options.events,
    });
  } else if (options.events) {
    events = [...options.events];
    events.sort((a, b) => a.created_at - b.created_at || a.id.localeCompare(b.id));
  } else {
    throw new Error('Either session or events must be provided');
  }

  const collectedAttachments = collectAttachments(events, attachments);
  const coverage = generateCoverageManifest(channelId, events, collectedAttachments, {
    auditHead,
    exportedAt,
  });

  const ndjsonString = serializeEventsToNdjson(events);
  const manifestString = JSON.stringify(coverage, null, 2);

  const encoder = new TextEncoder();
  const files: Array<{ path: string; content: Uint8Array }> = [
    { path: 'events.ndjson', content: encoder.encode(ndjsonString) },
    { path: 'manifest.json', content: encoder.encode(manifestString) },
  ];

  for (const blob of attachments) {
    const filename = blob.path ?? (blob.name ? `attachments/${blob.name}` : `attachments/${blob.sha256}`);
    files.push({
      path: filename,
      content: blob.data,
    });
  }

  const { carBytes, rootCid } = await buildCar(files);

  return {
    carBytes,
    rootCid,
    coverage,
  };
}
