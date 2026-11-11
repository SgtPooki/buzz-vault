import { describe, expect, it, vi } from 'vitest';
import { formatReceiptMessage, postReceipt } from '../src/receipt.js';
import type { RealUploadResult } from '../src/upload.js';

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

  const mockUploadResult: RealUploadResult = {
    pieceCid: 'baga6ea4seaqtestpiececid123',
    rootCid: 'bafybeirootcid456',
    dataSetId: '10042',
    txHash: '0x99887766554433221100aabbccddeeff99887766554433221100aabbccddeeff',
    providers: ['12', '14'],
    retrievalUrls: ['https://sp12.filcloud.io/pdp/piece/baga6ea4seaqtestpiececid123'],
    proofStatus: 'upload accepted, proving pending',
  };

  it('formats receipt message with real Piece CID, Root CID, SPs, and coverage', () => {
    const message = formatReceiptMessage({
      channelId: 'ch_test_123',
      coverage: mockCoverage,
      rootCid: 'bafybeirootcid456',
      upload: mockUploadResult,
    });

    expect(message).toContain('baga6ea4seaqtestpiececid123');
    expect(message).toContain('bafybeirootcid456');
    expect(message).toContain('10042');
    expect(message).toContain('0x99887766554433221100aabbccddeeff99887766554433221100aabbccddeeff');
    expect(message).toContain('42 messages');
    expect(message).toContain('3 attachments');
    expect(message).toContain('Provider 12');
    expect(message).toContain('Provider 14');
    expect(message).toContain('upload accepted, proving pending');
  });

  it('never contains placeholder or mocked strings in formatted receipt', () => {
    const message = formatReceiptMessage({
      channelId: 'ch_test_123',
      coverage: mockCoverage,
      rootCid: 'bafybeirootcid456',
      upload: mockUploadResult,
    });

    const forbiddenPlaceholders = [
      /bafk2bzaceunknown/i,
      /bafkzcibdemo/i,
      /\bf01234\b/i,
      /\bf05678\b/i,
      /\bdemo\b/i,
      /\bunknown\b/i,
    ];

    for (const pattern of forbiddenPlaceholders) {
      expect(message).not.toMatch(pattern);
    }
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
      rootCid: 'bafybeirootcid456',
      upload: mockUploadResult,
    });

    expect(res).toBe('event_id_receipt');
    expect(sendFn).toHaveBeenCalledWith('ch_test_123', expect.stringContaining('baga6ea4seaqtestpiececid123'));
  });
});
