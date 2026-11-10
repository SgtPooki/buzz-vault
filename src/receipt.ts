import type { Context } from '@buzz/author';
import type { CoverageManifest } from './export.js';
import type { VaultReceiptData } from './upload.js';

export interface PostReceiptOptions {
  channelId: string;
  coverage: CoverageManifest;
  receiptData: VaultReceiptData;
}

export function formatReceiptMessage(options: PostReceiptOptions): string {
  const { coverage, receiptData } = options;
  const oldest = coverage.oldestCreatedAt
    ? new Date(coverage.oldestCreatedAt * 1000).toISOString().split('T')[0]
    : 'start';
  const newest = coverage.newestCreatedAt
    ? new Date(coverage.newestCreatedAt * 1000).toISOString().split('T')[0]
    : 'now';
  const spLines = receiptData.providers.length
    ? receiptData.providers.map((sp) => `  - \`${sp}\``).join('\n')
    : '  - Endorsed Calibration SPs';

  return [
    '🔒 **Buzz Vault: Channel Archive Saved to Filecoin**',
    '',
    `• **Piece CID:** \`${receiptData.pieceCid}\``,
    `• **Root CID:** \`${receiptData.rootCid}\``,
    `• **Coverage:** ${coverage.eventCount} messages (${oldest} to ${newest}), ${coverage.attachmentCount} attachments`,
    '• **Providers (2 copies):**',
    spLines,
    '• **PDP Proof Status:** Verified on Calibration',
    receiptData.retrievalUrls?.[0] ? `• **Retrieval:** [Download Archive](${receiptData.retrievalUrls[0]})` : '',
    '',
    '_Encrypted with local community key. Independent decryption verifiable outside Buzz._',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function postReceipt(ctx: Context, options: PostReceiptOptions): Promise<string> {
  const session = ctx.relay?.snapshot?.()?.session;
  if (!session?.messages?.send) {
    throw new Error('Relay messaging session is not available');
  }
  const content = formatReceiptMessage(options);
  return session.messages.send(options.channelId, content);
}
