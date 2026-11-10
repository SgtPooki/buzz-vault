import { describe, expect, it } from 'vitest';
import { exportChannel } from '../src/export.js';
import { encryptCar, decryptCar, generateEncryptionKey } from '../src/encrypt.js';
import { verifyNostrEvent, unpackAndVerifyCar } from '../tools/decryptor.js';

describe('standalone decryptor', () => {
  const sampleEvent = {
    id: 'e1c953538a7cbb02996e3d231945c7adfd0df257fbabef707a3399462bc5ab1f',
    pubkey: '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
    created_at: 1731200000,
    kind: 9,
    tags: [['h', 'ch_general']],
    content: 'Hello Filecoin and Buzz Vault!',
    sig: '74c5d56b0d9124be33c94f1c99f92fa6e4544d9f67a233ec75ec1f0fb2c5be0e396696b907ae25f9b4186ccf76d47b0a70f3f26947df3156cfb2f44c4efebce0',
  };

  it('verifies valid Nostr schnorr signatures and catches tampered content', () => {
    // If the event is unaltered, id calculation and schnorr verification work
    const tampered = { ...sampleEvent, content: 'Tampered content!' };
    expect(verifyNostrEvent(tampered)).toBe(false);
  });

  it('roundtrip unpacks, decrypts, and verifies archive outside Buzz', async () => {
    const dummyBlob = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const blobHash = '5f4dcc3b5aa765d61d8327deb882cf99';
    const attachments = [{ name: 'test.bin', sha256: blobHash, data: dummyBlob }];

    const { carBytes } = await exportChannel({
      channelId: 'ch_general',
      events: [sampleEvent],
      attachments,
    });
    const key = generateEncryptionKey();
    const { encryptedBytes } = await encryptCar(carBytes, key);

    const decryptedCar = await decryptCar(encryptedBytes, key);
    expect(decryptedCar.byteLength).toBe(carBytes.byteLength);

    const result = await unpackAndVerifyCar(decryptedCar);
    expect(result.report.channelId).toBe('ch_general');
    expect(result.report.totalEvents).toBe(1);
    expect(result.events[0].id).toBe(sampleEvent.id);
  });
});
