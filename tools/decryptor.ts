import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, basename } from 'node:path';
import { CarReader } from '@ipld/car';
import { CID } from 'multiformats/cid';
import { unixfs } from '@helia/unixfs';
import toBuffer from 'it-to-buffer';
import { sha256, toHex } from 'viem';
import { schnorr } from '@noble/curves/secp256k1.js';
import { decryptCar, hexToBytes } from '../src/encrypt.js';
import type { CoverageManifest } from '../src/export.js';

export interface VerifiedEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
  validSignature: boolean;
}

export interface VerificationReport {
  channelId: string;
  totalEvents: number;
  validSignatures: number;
  invalidSignatures: number;
  totalAttachments: number;
  validAttachments: number;
  invalidAttachments: number;
  events: VerifiedEvent[];
}

export function serializeNostrEventForHash(event: {
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
}): string {
  return JSON.stringify([0, event.pubkey, event.created_at, event.kind, event.tags, event.content]);
}

export function verifyNostrEvent(event: any): boolean {
  try {
    const serialized = serializeNostrEventForHash(event);
    const hash = sha256(new TextEncoder().encode(serialized)).slice(2);
    if (hash !== event.id) return false;
    return schnorr.verify(hexToBytes(event.sig), hexToBytes(event.id), hexToBytes(event.pubkey));
  } catch {
    return false;
  }
}

export async function unpackAndVerifyCar(
  carBytes: Uint8Array
): Promise<{ manifest: CoverageManifest; events: VerifiedEvent[]; attachments: Map<string, Uint8Array>; report: VerificationReport }> {
  const reader = await CarReader.fromBytes(carBytes);
  const roots = await reader.getRoots();
  if (roots.length === 0) {
    throw new Error('CAR has no roots');
  }

  const blocksMap = new Map<string, Uint8Array>();
  for await (const block of reader.blocks()) {
    blocksMap.set(block.cid.toString(), block.bytes);
  }

  const blockstore = {
    async *get(cid: any) {
      const b = blocksMap.get(cid.toString());
      if (!b) throw new Error(`Missing block ${cid}`);
      yield b;
    },
    async *getBlocks(cids: any) {
      for await (const cid of cids) {
        const block = blocksMap.get(cid.toString());
        if (block) yield block;
      }
    },
    async put(cid: any, bytes: Uint8Array) {
      blocksMap.set(cid.toString(), bytes);
      return cid;
    },
    async has(cid: any) {
      return blocksMap.has(cid.toString());
    },
  };

  const fs = unixfs({ blockstore: blockstore as any });

  let manifestText = '';
  let eventsText = '';
  const attachments = new Map<string, Uint8Array>();

  for await (const entry of fs.ls(roots[0].toString() as any)) {
    if (entry.name === 'manifest.json') {
      const chunks: Uint8Array[] = [];
      for await (const chunk of fs.cat(entry.path)) chunks.push(chunk);
      manifestText = new TextDecoder().decode(await toBuffer(chunks));
    } else if (entry.name === 'events.ndjson') {
      const chunks: Uint8Array[] = [];
      for await (const chunk of fs.cat(entry.path)) chunks.push(chunk);
      eventsText = new TextDecoder().decode(await toBuffer(chunks));
    } else if (entry.name === 'attachments') {
      for await (const attEntry of fs.ls(entry.path as any)) {
        const chunks: Uint8Array[] = [];
        for await (const chunk of fs.cat(attEntry.path)) chunks.push(chunk);
        attachments.set(attEntry.name, await toBuffer(chunks));
      }
    }
  }

  if (!manifestText) throw new Error('Missing manifest.json in archive');
  if (!eventsText) throw new Error('Missing events.ndjson in archive');

  const manifest: CoverageManifest = JSON.parse(manifestText);
  const lines = eventsText.trim().split('\n').filter(Boolean);
  const events: VerifiedEvent[] = [];

  let validSignatures = 0;
  let invalidSignatures = 0;

  for (const line of lines) {
    const ev = JSON.parse(line);
    const valid = verifyNostrEvent(ev);
    if (valid) validSignatures++;
    else invalidSignatures++;
    events.push({ ...ev, validSignature: valid });
  }

  let validAttachments = 0;
  let invalidAttachments = 0;

  for (const att of manifest.attachments) {
    const blob = attachments.get(att.sha256) ?? (att.name ? attachments.get(att.name) : undefined);
    if (blob) {
      const computedHash = sha256(blob).slice(2);
      if (computedHash === att.sha256) validAttachments++;
      else invalidAttachments++;
    }
  }

  const report: VerificationReport = {
    channelId: manifest.channelId,
    totalEvents: events.length,
    validSignatures,
    invalidSignatures,
    totalAttachments: manifest.attachments.length,
    validAttachments,
    invalidAttachments,
    events,
  };

  return { manifest, events, attachments, report };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node tools/decryptor.js <encrypted-car-path> <hex-key> [--out <output-dir>]');
    process.exit(1);
  }

  const [inputPath, hexKey, ...rest] = args;
  const outDirIndex = rest.indexOf('--out');
  const outDir = outDirIndex !== -1 ? rest[outDirIndex + 1] : resolve(process.cwd(), 'recovered-vault');

  console.log(`Reading archive from: ${inputPath}`);
  const encryptedBytes = await readFile(resolve(inputPath));
  const key = hexToBytes(hexKey);

  console.log('Decrypting envelope with symmetric key...');
  const carBytes = await decryptCar(encryptedBytes, key);
  console.log(`Decrypted ${carBytes.byteLength} bytes of CARv1.`);

  console.log('Verifying Nostr signatures and attachment SHA-256 hashes...');
  const { manifest, events, attachments, report } = await unpackAndVerifyCar(carBytes);

  console.log('\n--- VERIFICATION REPORT ---');
  console.log(`Channel ID:          ${report.channelId}`);
  console.log(`Total Events:        ${report.totalEvents}`);
  console.log(`Valid Signatures:    ${report.validSignatures} / ${report.totalEvents}`);
  console.log(`Total Attachments:   ${report.totalAttachments}`);
  console.log(`Verified Hashes:     ${report.validAttachments} / ${report.totalAttachments}`);
  console.log('---------------------------\n');

  await mkdir(outDir, { recursive: true });
  await writeFile(resolve(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  await writeFile(
    resolve(outDir, 'events.json'),
    JSON.stringify(events, null, 2)
  );

  const mediaDir = resolve(outDir, 'media');
  await mkdir(mediaDir, { recursive: true });
  for (const [name, blob] of attachments.entries()) {
    await writeFile(resolve(mediaDir, name), blob);
  }

  console.log(`Successfully recovered and verified archive into: ${outDir}`);
}

if (process.argv[1] && basename(process.argv[1]).includes('decryptor')) {
  main().catch((err) => {
    console.error('Decryption/Verification failed:', err);
    process.exit(1);
  });
}
