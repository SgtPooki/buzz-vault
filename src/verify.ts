import { schnorr } from '@noble/curves/secp256k1.js';
import { sha256, toHex, hexToBytes as viemHexToBytes, stringToBytes } from 'viem';

const bytesToHex = (b: Uint8Array) => toHex(b).slice(2);
const hexToBytes = (h: string) => viemHexToBytes(`0x${h}`);
const utf8ToBytes = (s: string) => stringToBytes(s);
import type { NostrEvent } from './export.js';

export interface VerifyResult {
  id: string;
  idMatches: boolean;
  signatureValid: boolean;
}

// NIP-01: id is sha256 over the canonical [0, pubkey, created_at, kind, tags, content] array
export function nip01Id(event: Pick<NostrEvent, 'pubkey' | 'created_at' | 'kind' | 'tags' | 'content'>): string {
  const canonical = JSON.stringify([0, event.pubkey, event.created_at, event.kind, event.tags, event.content]);
  return sha256(utf8ToBytes(canonical)).slice(2);
}

export function verifyEvent(event: NostrEvent): VerifyResult {
  const id = nip01Id(event);
  const idMatches = id === event.id;
  let signatureValid = false;
  try {
    signatureValid = idMatches && schnorr.verify(hexToBytes(event.sig), hexToBytes(event.id), hexToBytes(event.pubkey));
  } catch {
    signatureValid = false;
  }
  return { id: event.id, idMatches, signatureValid };
}

export function verifyAll(events: readonly NostrEvent[]): { results: VerifyResult[]; allValid: boolean } {
  const results = events.map(verifyEvent);
  return { results, allValid: results.every((r) => r.idMatches && r.signatureValid) };
}
