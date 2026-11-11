import type { AddedTool, BuzzClient, AddedToolContext, AddedToolReply, Host } from '@buzz/author';
import { exportChannel } from './export.js';
import { encryptCar, hexToBytes } from './encrypt.js';
import { loadSeals } from './seal.js';
import { readSealCar } from './read-car.js';
import { verifyAll } from './verify.js';
import { uploadArchiveWithSynapse } from './upload.js';
import { formatReceiptMessage } from './receipt.js';
import { loadSession } from './connect.js';

export function createVaultArchiveTool(host?: Host): AddedTool {
  return {
    name: 'vault_archive',
    description: 'Archive community channel messages and attachments to Filecoin onchain storage with local encryption.',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: {
          type: 'string',
          description: 'The channel ID to archive. Defaults to the current conversation channel.',
        },
        encryptionKeyHex: {
          type: 'string',
          description: 'Optional 32-byte hex encryption key. If omitted, uses the stored session key.',
        },
      },
    },
    async call(client: BuzzClient, context: AddedToolContext, args: Record<string, unknown>): Promise<AddedToolReply> {
      const channelId = (args?.channelId as string) || context?.channel;
      if (!channelId) {
        throw new Error('No channel specified for vault_archive');
      }

      const rawEvents = await client.query([
        { kinds: [9], '#h': [channelId] },
      ]);
      const events = [...rawEvents].sort((a, b) => a.created_at - b.created_at);

      const attachments: Array<{ name: string; sha256: string; data: Uint8Array }> = [];
      const seenHashes = new Set<string>();

      for (const ev of events) {
        for (const tag of ev.tags) {
          if (tag[0] === 'imeta') {
            let url = '';
            let hash = '';
            for (let i = 1; i < tag.length; i++) {
              const part = tag[i];
              if (part.startsWith('url ')) url = part.slice(4).trim();
              else if (part.startsWith('x ')) hash = part.slice(2).trim();
              else if (part.startsWith('http://') || part.startsWith('https://')) url = part;
            }
            if (url && hash && !seenHashes.has(hash)) {
              seenHashes.add(hash);
              try {
                const media = await client.media(url);
                const bytes = await client.read(media.path);
                attachments.push({
                  name: hash,
                  sha256: hash,
                  data: bytes,
                });
              } catch {
                // Best effort download for attachments
              }
            }
          }
        }
      }

      const exportResult = await exportChannel({
        channelId,
        events,
        attachments,
      });

      const session = loadSession();
      const keyHex = (args?.encryptionKeyHex as string) || session?.sessionPrivateKey;
      if (!keyHex) {
        throw new Error('No encryption key or active Filecoin session found. Connect or import session in Settings first.');
      }

      const keyBytes = hexToBytes(keyHex);
      const encryptResult = await encryptCar(exportResult.carBytes, keyBytes);

      if (!host) {
        throw new Error('Host service is not available for upload');
      }
      if (!session) {
        throw new Error('No active Filecoin session found. Paste or connect session in Settings first.');
      }

      const uploadResult = await uploadArchiveWithSynapse(encryptResult.encryptedBytes, {
        host,
        sessionPrivateKey: session.sessionPrivateKey,
        ownerAddress: session.ownerAddress,
        copies: 2,
      });

      const receiptContent = formatReceiptMessage({
        channelId,
        coverage: exportResult.coverage,
        rootCid: exportResult.rootCid,
        upload: uploadResult,
      });

      await client.publish({
        kind: 9,
        content: receiptContent,
        tags: [['h', channelId]],
      });

      return `Channel ${channelId} successfully archived to Filecoin!\nPiece CID: ${uploadResult.pieceCid}\nData Set ID: ${uploadResult.dataSetId ?? 'pending'}\nEvents: ${exportResult.coverage.eventCount}\nAttachments: ${exportResult.coverage.attachmentCount}\nReceipt posted to channel.`;
    },
  };
}

// Lets any agent fetch and verify a sealed turn by piece CID, from the SP that holds it
export function createVaultTurnGetTool(host: Host): AddedTool {
  return {
    name: 'vault_turn_get',
    description: 'Fetch a sealed agent turn from Filecoin by piece CID, verify every message signature, and return the transcript.',
    inputSchema: {
      type: 'object',
      properties: {
        pieceCid: { type: 'string', description: 'Piece CID from a Buzz Vault seal card.' },
        url: { type: 'string', description: 'Optional retrieval URL if the seal is not in this device\'s index.' },
      },
      required: ['pieceCid'],
    },
    async call(_client: BuzzClient, _context: AddedToolContext, args: Record<string, unknown>): Promise<AddedToolReply> {
      const pieceCid = String(args.pieceCid ?? '');
      const record = loadSeals().find((s) => s.pieceCid === pieceCid);
      const urls = [args.url, ...(record?.retrievalUrls ?? [])].filter((u): u is string => typeof u === 'string' && u.length > 0);
      if (urls.length === 0) return `No retrieval URL known for ${pieceCid}; pass url.`;
      if (!host.requestBytes) return 'This host cannot read bytes.';
      let bytes: Uint8Array | undefined;
      for (const url of urls) {
        try {
          const res = await host.requestBytes({ url, maxBytes: 16 * 1024 * 1024, timeoutMs: 30000 });
          if (res.status === 200 && res.body.byteLength > 0) {
            bytes = res.body;
            break;
          }
        } catch {
          // try the next copy
        }
      }
      if (!bytes) return `Could not fetch ${pieceCid} from ${urls.length} known copies.`;
      const { events, manifest } = await readSealCar(bytes);
      const { results, allValid } = verifyAll(events);
      const lines = events.map((e) => `[${new Date(e.created_at * 1000).toISOString()}] ${e.pubkey.slice(0, 8)}: ${e.content}`);
      return [
        `Sealed turn by ${manifest?.agent ?? 'unknown agent'}: ${events.length} events, ${results.filter((r) => r.signatureValid).length} signatures valid${allValid ? '' : ' (SOME INVALID)'}.`,
        ...lines,
      ].join('\n');
    },
  };
}
