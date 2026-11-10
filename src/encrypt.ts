import * as fee from 'filecoin-encryption-envelope';

export const CAR_CONTENT_TYPE = 'application/vnd.ipld.car';

export interface EncryptCarResult {
  encryptedBytes: Uint8Array;
  key: Uint8Array;
  keyHex: string;
}

export function generateEncryptionKey(): Uint8Array {
  return globalThis.crypto.getRandomValues(new Uint8Array(32));
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (clean.length % 2 !== 0) {
    throw new Error('Hex string must have an even length');
  }
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export async function encryptCar(carBytes: Uint8Array, key?: Uint8Array): Promise<EncryptCarResult> {
  const cek = key ?? generateEncryptionKey();
  const encryptedBytes = await fee.aesGcm.encrypt(carBytes, {
    cek,
    contentType: CAR_CONTENT_TYPE,
  });
  return {
    encryptedBytes,
    key: cek,
    keyHex: bytesToHex(cek),
  };
}

export async function decryptCar(encryptedBytes: Uint8Array, key: Uint8Array): Promise<Uint8Array> {
  return await fee.aesGcm.decrypt(encryptedBytes, key);
}
