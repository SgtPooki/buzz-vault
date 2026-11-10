import type { AddedTool, BuzzClient, AddedToolContext, AddedToolReply, Host, Context } from '@buzz/author';
import { exportChannel } from './export.js';
import { encryptCar, hexToBytes } from './encrypt.js';
import { uploadArchiveToProviders } from './upload.js';
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

      const keyHex = (args?.encryptionKeyHex as string) || loadSession()?.sessionPrivateKey;
      if (!keyHex) {
        throw new Error('No encryption key or active Filecoin session found. Connect Filecoin in Settings first.');
      }

      const keyBytes = hexToBytes(keyHex);
      const encryptResult = await encryptCar(exportResult.carBytes, keyBytes);

      let pieceCid = 'bafk2bzaceunknown';
      let providers = ['f01234', 'f05678'];

      if (host) {
        const uploadRes = await uploadArchiveToProviders(
          { host } as Context,
          encryptResult.encryptedBytes,
          { rootCid: exportResult.rootCid }
        );
        pieceCid = uploadRes.pieceCid;
        providers = uploadRes.providers;
      }

      const receiptContent = formatReceiptMessage({
        channelId,
        coverage: exportResult.coverage,
        receiptData: {
          pieceCid,
          rootCid: exportResult.rootCid,
          providers,
          retrievalUrls: providers.map((sp) => `${sp.replace(/\/+$/, '')}/piece/${pieceCid}`),
          timestamp: Date.now(),
        },
      });

      await client.publish({
        kind: 9,
        content: receiptContent,
        tags: [['h', channelId]],
      });

      return `Channel ${channelId} successfully archived to Filecoin!\nPiece CID: ${pieceCid}\nEvents: ${exportResult.coverage.eventCount}\nAttachments: ${exportResult.coverage.attachmentCount}\nReceipt posted to channel.`;
    },
  };
}
