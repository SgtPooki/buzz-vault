import { describe, expect, it, vi } from 'vitest';
import { formatReceiptMessage, postReceipt } from '../src/receipt.js';

describe('receipt module', () => {
  const mockCoverage = {
    channelId: 'ch_test_123',
    exportedAt: 1731276000,
    eventCount: 42,
    oldestCreatedAt: 1731200000,
    newestCreatedAt: 1731275000,
    attachmentCount: 3,
    attachments: [],
    auditHead: 'audit_head_abc',
  };

  const mockReceiptData = {
    pieceCid: 'baga6ea4seaqtestpiececid123',
    rootCid: 'bafybeirootcid456',
    providers: ['https://calibration.filozone.com/pdp', 'https://sp-calibration.filcloud.io/pdp'],
    retrievalUrl: 'https://calibration.filozone.com/pdp/piece/baga6ea4seaqtestpiececid123',
    size: 65536,
  };

  it('formats receipt message with Piece CID, Root CID, SPs, and coverage', () => {
    const message = formatReceiptMessage({
      channelId: 'ch_test_123',
      coverage: mockCoverage,
      receiptData: mockReceiptData,
    });

    expect(message).toContain('baga6ea4seaqtestpiececid123');
    expect(message).toContain('bafybeirootcid456');
    expect(message).toContain('42 messages');
    expect(message).toContain('3 attachments');
    expect(message).toContain('https://calibration.filozone.com/pdp');
  });

  it('posts receipt using ctx.relay session messages.send', async () => {
    const sendFn = vi.fn().mockResolvedValue('event_id_receipt');
    const mockCtx = {
      relay: {
        snapshot: () => ({
          session: {
            messages: {
              send: sendFn,
            },
          },
        }),
      },
    };

    const res = await postReceipt(mockCtx as any, {
      channelId: 'ch_test_123',
      coverage: mockCoverage,
      receiptData: mockReceiptData,
    });

    expect(res).toBe('event_id_receipt');
    expect(sendFn).toHaveBeenCalledWith('ch_test_123', expect.stringContaining('baga6ea4seaqtestpiececid123'));
  });
});
