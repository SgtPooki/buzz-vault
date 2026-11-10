import { describe, expect, it } from 'vitest';
import {
  bytesToHex,
  decryptCar,
  encryptCar,
  generateEncryptionKey,
  hexToBytes,
} from '../src/encrypt';

describe('encrypt module', () => {
  it('generates a 32-byte random encryption key', () => {
    const key1 = generateEncryptionKey();
    const key2 = generateEncryptionKey();

    expect(key1).toBeInstanceOf(Uint8Array);
    expect(key1.byteLength).toBe(32);
    expect(key2.byteLength).toBe(32);
    expect(key1).not.toEqual(key2);
  });

  it('converts bytes to hex and back', () => {
    const key = generateEncryptionKey();
    const hex = bytesToHex(key);
    expect(hex).toMatch(/^[0-9a-f]{64}$/);

    const recovered = hexToBytes(hex);
    expect(recovered).toEqual(key);
  });

  it('rejects odd-length hex string', () => {
    expect(() => hexToBytes('12345')).toThrow('Hex string must have an even length');
  });

  it('encrypts CAR bytes with auto-generated key and decrypts successfully', async () => {
    const originalCar = new TextEncoder().encode('dummy-car-archive-content-0123456789');
    const result = await encryptCar(originalCar);

    expect(result.encryptedBytes).toBeInstanceOf(Uint8Array);
    expect(result.encryptedBytes.length).toBeGreaterThan(originalCar.length);
    expect(result.key.byteLength).toBe(32);
    expect(result.keyHex).toBe(bytesToHex(result.key));

    const decrypted = await decryptCar(result.encryptedBytes, result.key);
    expect(decrypted).toEqual(originalCar);
  });

  it('encrypts CAR bytes with an explicit key', async () => {
    const originalCar = new Uint8Array([10, 20, 30, 40, 50, 60, 70, 80]);
    const explicitKey = generateEncryptionKey();

    const result = await encryptCar(originalCar, explicitKey);
    expect(result.key).toEqual(explicitKey);
    expect(result.keyHex).toEqual(bytesToHex(explicitKey));

    const decrypted = await decryptCar(result.encryptedBytes, explicitKey);
    expect(decrypted).toEqual(originalCar);
  });

  it('fails decryption with an invalid key', async () => {
    const originalCar = new TextEncoder().encode('top-secret-channel-events');
    const result = await encryptCar(originalCar);

    const wrongKey = generateEncryptionKey();
    await expect(decryptCar(result.encryptedBytes, wrongKey)).rejects.toThrow();
  });

  it('fails decryption on corrupted ciphertext', async () => {
    const originalCar = new TextEncoder().encode('channel-export-ndjson');
    const result = await encryptCar(originalCar);

    const corrupted = new Uint8Array(result.encryptedBytes);
    corrupted[corrupted.length - 1] ^= 0xff;

    await expect(decryptCar(corrupted, result.key)).rejects.toThrow();
  });
});
