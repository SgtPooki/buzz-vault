import type { Context, HostByteSend, HostProcess, HostRequestOnceOptions, HostResponse } from '@buzz/author';
import { describe, expect, it, vi } from 'vitest';
import {
  CALIBRATION_ENDORSED_SP_ENDPOINTS,
  computeSha256,
  parseCliAddStdout,
  uploadArchiveToProviders,
  uploadPieceWithHost,
  uploadWithCliSpawn,
} from '../src/upload';

describe('upload module', () => {
  it('exposes calibration endorsed SP endpoints', () => {
    expect(CALIBRATION_ENDORSED_SP_ENDPOINTS.length).toBeGreaterThanOrEqual(2);
    expect(CALIBRATION_ENDORSED_SP_ENDPOINTS[0]).toBe('https://calib2.ezpdpz.net');
  });

  describe('uploadPieceWithHost', () => {
    it('dispatches sendBytesOnce with correct payload and options', async () => {
      const sendBytesOnce = vi.fn().mockResolvedValue({
        status: 200,
        headers: {},
        body: 'OK',
      } as HostResponse);

      const mockCtx = {
        host: {
          sendBytesOnce,
        },
      } as unknown as Context;

      const spUrl = 'https://calibration.filozone.com/pdp';
      const testBytes = new Uint8Array([1, 2, 3, 4, 5]);
      const res = await uploadPieceWithHost(mockCtx, spUrl, testBytes, { callId: 'call-123' });

      expect(res.status).toBe(200);
      expect(sendBytesOnce).toHaveBeenCalledTimes(1);
      expect(sendBytesOnce).toHaveBeenCalledWith(
        testBytes,
        {
          url: spUrl,
          method: 'PUT',
          contentType: 'application/vnd.ipld.car',
        },
        { callId: 'call-123' }
      );
    });

    it('throws error when upload response status is 4xx or 5xx', async () => {
      const sendBytesOnce = vi.fn().mockResolvedValue({
        status: 500,
        headers: {},
        body: 'Internal Server Error',
      } as HostResponse);

      const mockCtx = {
        host: {
          sendBytesOnce,
        },
      } as unknown as Context;

      await expect(
        uploadPieceWithHost(mockCtx, 'https://calibration.filozone.com/pdp', new Uint8Array([1]), { callId: 'c1' })
      ).rejects.toThrow('Upload failed with status 500: Internal Server Error');
    });

    it('throws error when host does not support sendBytesOnce', async () => {
      const mockCtx = {
        host: {},
      } as unknown as Context;

      await expect(
        uploadPieceWithHost(mockCtx, 'https://calibration.filozone.com/pdp', new Uint8Array([1]), { callId: 'c1' })
      ).rejects.toThrow('ctx.host.sendBytesOnce is not supported');
    });
  });

  describe('computeSha256', () => {
    it('computes expected sha256 hex', async () => {
      const bytes = new TextEncoder().encode('hello world');
      const hash = await computeSha256(bytes);
      expect(hash).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
    });
  });

  describe('parseCliAddStdout', () => {
    it('parses typical filecoin-pin add output', () => {
      const sampleStdout = `
Network: Calibration

Add Details
  File: /tmp/vault.car
  Size: 1.50 MiB
  Root CID: bafybeic52i6a57g3z3v4b7egh24p6tky6g2yq7dzn7r65f4o7y3wqu3wtu

Filecoin Storage
  Piece CID: bafkzcibcaabbccddeeff00112233445566778899aabbccddeeff001122334455
  Piece Size: 2.00 MiB
  Explorer: https://pdp.filecoin.cloud/calibration/piece/bafkzcibcaabbccddeeff00112233445566778899aabbccddeeff001122334455

Copies
  [Primary] Provider 12
    Data Set ID: 4096
    Piece ID: 101
    Retrieval URL: https://sp1.example.com/piece/bafkzcibcaabbccddeeff00112233445566778899aabbccddeeff001122334455

Transaction: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
`;

      const result = parseCliAddStdout(sampleStdout);
      expect(result.pieceCid).toBe('bafkzcibcaabbccddeeff00112233445566778899aabbccddeeff001122334455');
      expect(result.dataSetId).toBe('4096');
      expect(result.transactionHash).toBe('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
    });

    it('handles alternative stdout formats gracefully', () => {
      const minimalStdout = 'pieceCid: bafkzcibctest dataSetId: 99 txHash: 0x' + 'a'.repeat(64);
      const result = parseCliAddStdout(minimalStdout);

      expect(result.pieceCid).toBe('bafkzcibctest');
      expect(result.dataSetId).toBe('99');
      expect(result.transactionHash).toBe('0x' + 'a'.repeat(64));
    });

    it('returns undefined for missing fields', () => {
      const result = parseCliAddStdout('Nothing useful here');
      expect(result.pieceCid).toBeUndefined();
      expect(result.dataSetId).toBeUndefined();
      expect(result.transactionHash).toBeUndefined();
    });
  });

  describe('uploadWithCliSpawn', () => {
    it('saves bytes and invokes pin add with session key env', async () => {
      const saveBytes = vi.fn().mockResolvedValue({
        path: '/tmp/managed/car-123.car',
        size: 5,
        sha256: 'somehash',
        expiresAt: Date.now() + 60000,
      });

      const sampleStdout = `
Filecoin Storage
  Piece CID: bafkzcibcspawn123
Copies
  [Primary] Provider 1
    Data Set ID: 555
Transaction: 0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff
`;

      const spawn = vi.fn().mockImplementation((id: string, options: any) => {
        options.onStdout?.(sampleStdout);
        const proc: HostProcess = {
          write: vi.fn(),
          end: vi.fn(),
          kill: vi.fn(),
          exited: Promise.resolve(0),
        };
        return Promise.resolve(proc);
      });

      const mockCtx = {
        host: {
          saveBytes,
          spawn,
        },
      } as unknown as Context;

      const result = await uploadWithCliSpawn(mockCtx, new Uint8Array([1, 2, 3]), {
        sessionPrivateKey: '0xprivkey123',
        walletAddress: '0xwallet456',
      });

      expect(saveBytes).toHaveBeenCalledTimes(1);
      expect(spawn).toHaveBeenCalledTimes(1);
      expect(spawn).toHaveBeenCalledWith('pin', {
        args: ['add', '/tmp/managed/car-123.car', '--network', 'calibration'],
        env: {
          SESSION_KEY: '0xprivkey123',
          WALLET_ADDRESS: '0xwallet456',
        },
        onStdout: expect.any(Function),
        onStderr: expect.any(Function),
      });

      expect(result.pieceCid).toBe('bafkzcibcspawn123');
      expect(result.dataSetId).toBe('555');
      expect(result.transactionHash).toBe('0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff');
    });

    it('throws error when pin process exits with non-zero code', async () => {
      const saveBytes = vi.fn().mockResolvedValue({ path: '/tmp/car.car' });
      const spawn = vi.fn().mockImplementation((id: string, options: any) => {
        options.onStderr?.('Insufficient funds for storage');
        const proc: HostProcess = {
          write: vi.fn(),
          end: vi.fn(),
          kill: vi.fn(),
          exited: Promise.resolve(1),
        };
        return Promise.resolve(proc);
      });

      const mockCtx = {
        host: {
          saveBytes,
          spawn,
        },
      } as unknown as Context;

      await expect(
        uploadWithCliSpawn(mockCtx, new Uint8Array([1]), {
          sessionPrivateKey: '0xpriv',
          walletAddress: '0xaddr',
        })
      ).rejects.toThrow('pin process exited with code 1: Insufficient funds');
    });
  });

  describe('uploadArchiveToProviders', () => {
    it('uploads to target copies and returns receipt', async () => {
      const sendBytesOnce = vi.fn().mockResolvedValue({
        status: 200,
        headers: {},
        body: 'OK',
      } as HostResponse);

      const mockCtx = {
        host: {
          sendBytesOnce,
        },
      } as unknown as Context;

      const dummyCar = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
      const result = await uploadArchiveToProviders(mockCtx, dummyCar, {
        targetCopies: 2,
        rootCid: 'bafybeirootcidtest',
        callIdPrefix: 'test-call',
      });

      expect(sendBytesOnce).toHaveBeenCalledTimes(2);
      expect(result.providers).toHaveLength(2);
      expect(result.providers).toEqual([
        'https://calib2.ezpdpz.net',
        'https://pdp-m2.reiers.io',
      ]);
      expect(result.pieceCid).toMatch(/^bafk/);
      expect(result.receipt.pieceCid).toBe(result.pieceCid);
      expect(result.receipt.rootCid).toBe('bafybeirootcidtest');
      expect(result.receipt.retrievalUrls).toHaveLength(2);
      expect(result.receipt.retrievalUrls[0]).toContain('/piece/' + result.pieceCid);
    });

    it('throws when all providers fail', async () => {
      const sendBytesOnce = vi.fn().mockRejectedValue(new Error('Network error'));
      const mockCtx = {
        host: {
          sendBytesOnce,
        },
      } as unknown as Context;

      await expect(
        uploadArchiveToProviders(mockCtx, new Uint8Array([1, 2, 3]))
      ).rejects.toThrow('Failed to upload archive to any storage provider');
    });
  });
});
