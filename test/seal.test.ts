import { describe, expect, it } from 'vitest';
import { schnorr } from '@noble/curves/secp256k1.js';
import { toHex, hexToBytes as viemHexToBytes } from 'viem';
const bytesToHex = (b: Uint8Array) => toHex(b).slice(2);
const hexToBytes = (h: string) => viemHexToBytes(`0x${h}`);
import { nip01Id, verifyAll, verifyEvent } from '../src/verify.js';
import { buildSealFiles, formatSealCard, isSealable, turnEventIds, type LocalWork } from '../src/seal.js';
import { buildCar } from '../src/export.js';
import { readSealCar } from '../src/read-car.js';

const priv = hexToBytes('1'.repeat(64));
const pubkey = bytesToHex(schnorr.getPublicKey(priv));

function signed(content: string, created_at = 1_700_000_000) {
  const base = { pubkey, created_at, kind: 9, tags: [['h', 'chan']], content };
  const id = nip01Id(base);
  return { ...base, id, sig: bytesToHex(schnorr.sign(hexToBytes(id), priv)) };
}

const work: LocalWork = {
  scope: 's',
  agent: 'Atlas',
  channelId: 'chan',
  messageId: 'a'.repeat(64),
  threadRootId: 'a'.repeat(64),
  state: 'done',
  startedAt: 1,
  publishedMessageIds: ['b'.repeat(64), 'b'.repeat(64)],
};

describe('verify', () => {
  it('accepts a real signed event and rejects a tampered one', () => {
    const ev = signed('hello');
    expect(verifyEvent(ev)).toEqual({ id: ev.id, idMatches: true, signatureValid: true });
    const tampered = { ...ev, content: 'hellp' };
    expect(verifyEvent(tampered).idMatches).toBe(false);
    expect(verifyEvent(tampered).signatureValid).toBe(false);
    const forged = { ...ev, sig: ev.sig.replace(/^./, (c) => (c === '0' ? '1' : '0')) };
    expect(verifyEvent(forged).signatureValid).toBe(false);
    expect(verifyAll([ev, tampered]).allValid).toBe(false);
  });
});

describe('seal', () => {
  it('seals only finished, fully published work', () => {
    expect(isSealable(work)).toBe(true);
    expect(isSealable({ ...work, state: 'working' })).toBe(false);
    expect(isSealable({ ...work, publishing: 1 })).toBe(false);
    expect(isSealable({ ...work, publishedMessageIds: [] })).toBe(false);
  });

  it('collects the request and replies once, hex ids only', () => {
    expect(turnEventIds({ ...work, publishedMessageIds: ['b'.repeat(64), 'b'.repeat(64), 'not-hex'] })).toEqual(['a'.repeat(64), 'b'.repeat(64)]);
  });

  it('builds a manifest that counts verified signatures and round-trips through a CAR', async () => {
    const events = [signed('reply', 2), signed('request', 1)];
    const { files, manifest } = buildSealFiles(work, events);
    expect(manifest.signatures).toEqual({ verified: 2, total: 2 });
    expect(manifest.eventIds[0]).toBe(events[1].id);
    expect(files.map((f) => f.path)).toEqual(['events.ndjson', 'manifest.json']);
    const { carBytes } = await buildCar(files);
    const back = await readSealCar(carBytes);
    expect(back.events.map((e) => e.id)).toEqual(manifest.eventIds);
    expect(back.manifest?.agent).toBe('Atlas');
  });

  it('writes a card with no placeholders', () => {
    const events = [signed('x')];
    const { manifest } = buildSealFiles(work, events);
    const card = formatSealCard('Atlas', {
      manifest,
      rootCid: 'bafyroot',
      events,
      upload: { pieceCid: 'bafkzcibdabc123456789xyz', dataSetId: '52644', providers: ['9', '2'], retrievalUrls: ['https://sp/public/x'], proofStatus: 'pending' },
    });
    expect(card).toContain('Atlas finished');
    expect(card).toContain('1 signed messages verified');
    expect(card).toContain('data set 52644');
    expect(card).toContain('?piece=bafkzcibdabc123456789xyz');
    expect(card).not.toMatch(/demo|unknown|f01234|undefined|null/);
  });
});
