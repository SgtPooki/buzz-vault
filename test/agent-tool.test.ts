import { describe, expect, it, vi } from 'vitest';
import { createVaultArchiveTool } from '../src/agent-tool.js';
import { generateEncryptionKey, bytesToHex } from '../src/encrypt.js';

describe('vault_archive agent tool', () => {
  it('has correct tool name and description schema', () => {
    const tool = createVaultArchiveTool();
    expect(tool.name).toBe('vault_archive');
    expect(tool.description).toContain('Filecoin');
    expect(tool.inputSchema).toBeDefined();
  });

  it('runs archive end-to-end with mocked client and host', async () => {
    const key = bytesToHex(generateEncryptionKey());
    const publishedEvents: any[] = [];

    const mockClient: any = {
      query: vi.fn().mockResolvedValue([
        {
          id: 'ev-1',
          pubkey: 'pub1',
          created_at: 1000,
          kind: 9,
          tags: [['h', 'ch-test'], ['imeta', 'url https://example.com/blob.png', 'x 1234abcd']],
          content: 'Hello with media',
          sig: 'sig1',
        },
      ]),
      media: vi.fn().mockResolvedValue({ path: '/tmp/blob.png' }),
      read: vi.fn().mockResolvedValue(new Uint8Array([10, 20, 30])),
      publish: vi.fn().mockImplementation((ev) => {
        publishedEvents.push(ev);
        return Promise.resolve({ ...ev, id: 'pub-ev-id' });
      }),
    };

    const mockHost: any = {
      sendBytesOnce: vi.fn().mockResolvedValue({ status: 200, headers: {}, body: 'OK' }),
    };

    const tool = createVaultArchiveTool(mockHost);
    const reply = await tool.call(mockClient, { channel: 'ch-test' }, { encryptionKeyHex: key });

    expect(mockClient.query).toHaveBeenCalledWith([{ kinds: [9], '#h': ['ch-test'] }]);
    expect(mockClient.media).toHaveBeenCalledWith('https://example.com/blob.png');
    expect(mockClient.read).toHaveBeenCalledWith('/tmp/blob.png');
    expect(mockHost.sendBytesOnce).toHaveBeenCalled();
    expect(publishedEvents).toHaveLength(1);
    expect(publishedEvents[0].content).toContain('Buzz Vault: Channel Archive Saved to Filecoin');
    expect(reply).toContain('Channel ch-test successfully archived');
  });
});
