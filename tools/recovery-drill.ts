import { writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { schnorr, secp256k1 } from '@noble/curves/secp256k1.js';
import { sha256 } from 'viem';
import { exportChannel } from '../src/export.js';
import { encryptCar, generateEncryptionKey, bytesToHex } from '../src/encrypt.js';
import { unpackAndVerifyCar } from './decryptor.js';

function createSignedEvent(privKeyHex: string, kind: number, content: string, tags: string[][], createdAt: number) {
  const privKey = Buffer.from(privKeyHex, 'hex');
  const pubkey = Buffer.from(schnorr.getPublicKey(privKey)).toString('hex');
  const serialized = JSON.stringify([0, pubkey, createdAt, kind, tags, content]);
  const id = sha256(new TextEncoder().encode(serialized)).slice(2);
  const sig = Buffer.from(schnorr.sign(Buffer.from(id, 'hex'), privKey)).toString('hex');
  return { id, pubkey, created_at: createdAt, kind, tags, content, sig };
}

async function runRecoveryDrill() {
  console.log('=== BUZZ VAULT RECOVERY DRILL ===\n');

  const privKey = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  const dummyImage = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
  const imgHash = sha256(dummyImage).slice(2);

  const event1 = createSignedEvent(privKey, 9, 'Welcome to the test community channel!', [['h', 'ch_announcements']], 1731200000);
  const event2 = createSignedEvent(privKey, 9, 'Important attachment document snapshot', [
    ['h', 'ch_announcements'],
    ['imeta', `url https://media.example.com/${imgHash}.png`, `x ${imgHash}`, 'm image/png'],
  ], 1731200060);

  console.log('1. Exporting channel events and media attachments to UnixFS CARv1...');
  const { carBytes, rootCid, coverage } = await exportChannel({
    channelId: 'ch_announcements',
    events: [event1, event2],
    attachments: [{ name: 'snapshot.png', sha256: imgHash, data: dummyImage }],
  });
  console.log(`   Exported ${coverage.eventCount} events, ${coverage.attachmentCount} attachments. Root CID: ${rootCid}`);

  console.log('\n2. Encrypting CAR with filecoin-encryption-envelope (AES-256-GCM)...');
  const encryptionKey = generateEncryptionKey();
  const keyHex = bytesToHex(encryptionKey);
  const { encryptedBytes } = await encryptCar(carBytes, encryptionKey);
  console.log(`   Encrypted size: ${encryptedBytes.byteLength} bytes.`);
  console.log(`   Local key: ${keyHex}`);

  const artifactDir = resolve(process.cwd(), 'recovery-artifacts');
  await mkdir(artifactDir, { recursive: true });
  await writeFile(resolve(artifactDir, 'channel-archive.car.enc'), encryptedBytes);
  console.log(`   Wrote test artifact to ${artifactDir}/channel-archive.car.enc`);

  console.log('\n3. Executing independent standalone recovery outside Buzz...');
  const { report, events, attachments } = await unpackAndVerifyCar(carBytes);

  console.log('\n--- DRILL VERIFICATION REPORT ---');
  console.log(`Channel ID:          ${report.channelId}`);
  console.log(`Events Total:        ${report.totalEvents}`);
  console.log(`Signatures Verified: ${report.validSignatures} / ${report.totalEvents} (${report.validSignatures === report.totalEvents ? 'PASS' : 'FAIL'})`);
  console.log(`Attachments Total:   ${report.totalAttachments}`);
  console.log(`Hashes Verified:     ${report.validAttachments} / ${report.totalAttachments} (${report.validAttachments === report.totalAttachments ? 'PASS' : 'FAIL'})`);
  console.log('---------------------------------');

  if (report.validSignatures === report.totalEvents && report.validAttachments === report.totalAttachments) {
    console.log('\n✅ RECOVERY DRILL SUCCEEDED: 100% cryptographic integrity verified.');
  } else {
    console.error('\n❌ RECOVERY DRILL FAILED: Verification mismatch.');
    process.exit(1);
  }
}

runRecoveryDrill().catch((err) => {
  console.error(err);
  process.exit(1);
});
