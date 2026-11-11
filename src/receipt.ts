import type { Context } from '@buzz/author';
import type { CoverageManifest } from './export.js';
import type { RealUploadResult } from './upload.js';

export interface PostReceiptOptions {
  channelId: string;
  coverage: CoverageManifest;
  rootCid: string;
  upload: RealUploadResult;
}

const day = (secs: number | null, fallback: string): string =>
  secs ? new Date(secs * 1000).toISOString().split('T')[0] : fallback;

// Formats a verified receipt from real upload results
export function formatReceiptMessage(options: PostReceiptOptions): string {
  const { coverage, rootCid, upload } = options;
  const providers = upload.providers.map((p) => `  - Provider ${p}`).join('\n');
  return [
    '🔒 **Buzz Vault: Channel Archive Saved to Filecoin**',
    '',
    `• **Piece CID:** \`${upload.pieceCid}\``,
    `• **Root CID:** \`${upload.rootCid ?? rootCid}\``,
    upload.dataSetId ? `• **Data Set ID:** ${upload.dataSetId}` : '',
    upload.txHash ? `• **Transaction Hash:** \`${upload.txHash}\`` : '',
    `• **Coverage:** ${coverage.eventCount} messages (${day(coverage.oldestCreatedAt, 'start')} to ${day(coverage.newestCreatedAt, 'now')}), ${coverage.attachmentCount} attachments`,
    providers ? `• **Providers (${upload.providers.length} copies):**\n${providers}` : '',
    `• **PDP Proof Status:** ${upload.proofStatus ?? 'upload accepted, proving pending'}`,
    upload.retrievalUrls && upload.retrievalUrls[0] ? `• **Retrieval:** ${upload.retrievalUrls[0]}` : '',
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
  return session.messages.send(options.channelId, formatReceiptMessage(options));
}
