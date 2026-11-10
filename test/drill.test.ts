import { describe, expect, it } from 'vitest';
import { schnorr, secp256k1 } from '@noble/curves/secp256k1.js';
import { sha256 } from 'viem';
import { exportChannel } from '../src/export.js';
import { encryptCar, decryptCar, generateEncryptionKey, bytesToHex } from '../src/encrypt.js';
import { unpackAndVerifyCar } from '../tools/decryptor.js';

describe('recovery drill end-to-end verification', () => {
  function createSignedEvent(privKeyHex: string, kind: number, content: string, tags: string[][], createdAt: number) {
    const privKey = Buffer.from(privKeyHex, 'hex');
    const pubkey = Buffer.from(schnorr.getPublicKey(privKey)).toString('hex');
    const serialized = JSON.stringify([0, pubkey, createdAt, kind, tags, content]);
    const id = sha256(new TextEncoder().encode(serialized)).slice(2);
    const sig = Buffer.from(schnorr.sign(Buffer.from(id, 'hex'), privKey)).toString('hex');
    return { id, pubkey, created_at: createdAt, kind, tags, content, sig };
  }

  it('performs full export, encrypt, decrypt, unpack, and signature/hash audit', async () => {
    const privKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    const dummyImage = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
    const imgHash = sha256(dummyImage).slice(2);

    const event1 = createSignedEvent(privKey, 9, 'Welcome to the test community channel!', [['h', 'ch_announcements']], 1731200000);
    const event2 = createSignedEvent(privKey, 9, 'Important attachment document snapshot', [
      ['h', 'ch_announcements'],
      ['imeta', `url https://media.example.com/${imgHash}.png`, `x ${imgHash}`, 'm image/png'],
    ], 1731200060);

    const { carBytes, rootCid, coverage } = await exportChannel({
      channelId: 'ch_announcements',
      events: [event1, event2],
      attachments: [{ name: 'snapshot.png', sha256: imgHash, data: dummyImage }],
    });
    expect(coverage.eventCount).toBe(2);
    expect(coverage.attachmentCount).toBe(1);

    const encryptionKey = generateEncryptionKey();
    const { encryptedBytes } = await encryptCar(carBytes, encryptionKey);
    expect(encryptedBytes.byteLength).toBeGreaterThan(0);

    const decryptedCar = await decryptCar(encryptedBytes, encryptionKey);
    expect(decryptedCar.byteLength).toBe(carBytes.byteLength);

    const { report, events, attachments } = await unpackAndVerifyCar(decryptedCar);
    expect(report.channelId).toBe('ch_announcements');
    expect(report.totalEvents).toBe(2);
    expect(report.validSignatures).toBe(2);
    expect(report.invalidSignatures).toBe(0);
    expect(report.totalAttachments).toBe(1);
    expect(report.validAttachments).toBe(1);
    expect(report.invalidAttachments).toBe(0);
  });
});
