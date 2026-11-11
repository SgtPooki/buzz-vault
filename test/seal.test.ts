import { describe, expect, it } from 'vitest';
import { schnorr } from '@noble/curves/secp256k1.js';
import { toHex, hexToBytes as viemHexToBytes } from 'viem';
const bytesToHex = (b: Uint8Array) => toHex(b).slice(2);
const hexToBytes = (h: string) => viemHexToBytes(`0x${h}`);
import { nip01Id, verifyAll, verifyEvent } from '../src/verify.js';
import { buildSealFiles, collectTurnEvents, formatSealCard, isSealable, sealAndPost, turnEventIds, SEALS_KEY, type LocalWork } from '../src/seal.js';
import { vi } from 'vitest';
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
    const card = formatSealCard({ agent: 'Atlas', pieceCid: 'bafkzcibdabc123456789xyz', rootCid: 'bafyroot', dataSetId: '52644', providers: ['9', '2'], retrievalUrls: ['https://sp/piece/x', 'https://sp2/public/x'], signatures: manifest.signatures });
    expect(card).toContain('src=https%3A%2F%2Fsp%2Fpiece%2Fx');
    expect(card).toContain('Atlas finished');
    expect(card).toContain('1 signed messages verified');
    expect(card).toContain('data set 52644');
    expect(card).toContain('?piece=bafkzcibdabc123456789xyz');
    expect(card).toContain('bafyroot https://sp/public/x');
    expect(card).not.toMatch(/demo|unknown|f01234|undefined|null/);
  });
});

describe('collectTurnEvents', () => {
  const reqId = 'a'.repeat(64), repId = 'b'.repeat(64);
  const w2: LocalWork = { ...work, messageId: reqId, threadRootId: reqId, publishedMessageIds: [repId] };
  const req = { ...signed('request', 1), id: reqId }, rep = { ...signed('reply', 2), id: repId };

  it('reads only the missing ids with the limit inside the filter, like the host demands', async () => {
    const readPage = vi.fn(async (filters: any[]) => {
      const f = filters[0];
      if (!(f.kinds === undefined && f.ids?.length)) throw new Error('Relay reads need valid kinds or event IDs');
      if (!Number.isInteger(f.limit) || f.limit < 1 || f.limit > 500) throw new Error('Relay read limit must be between 1 and 500');
      return { events: [{ ...rep, delivery: { local: true } }] };
    });
    const session: any = { readPage, messages: {}, agentActivity: {} };
    const events = await collectTurnEvents(session, w2, new Map([[reqId, req]]));
    expect(readPage).toHaveBeenCalledWith([{ ids: [repId], limit: 1 }]);
    expect(events.map((e) => e.id)).toEqual([reqId, repId]);
    expect(Object.keys(events[1])).not.toContain('delivery');
  });

  it('refuses a partial turn and unsigned events', async () => {
    const session: any = { readPage: async () => ({ events: [] }), messages: {}, agentActivity: {} };
    await expect(collectTurnEvents(session, w2, new Map([[reqId, req]]))).rejects.toThrow(/not yet readable/);
    const unsigned = new Map([[reqId, { ...req, sig: undefined }], [repId, rep]]);
    await expect(collectTurnEvents(session, w2, unsigned)).rejects.toThrow(/without signatures/);
  });
});

describe('sealAndPost', () => {
  it('uploads once and retries only the card after a failed post', async () => {
    const store: Record<string, string> = {};
    (globalThis as any).localStorage = { getItem: (k: string) => store[k] ?? null, setItem: (k: string, v: string) => { store[k] = v; }, removeItem: (k: string) => { delete store[k]; } };
    store['buzz-vault:session:v1'] = JSON.stringify({ sessionPrivateKey: '0x' + '2'.repeat(64), sessionAddress: '0x' + '3'.repeat(40), ownerAddress: '0x' + '4'.repeat(40), expiry: 9e12, network: 'calibration' });
    const upload = await import('../src/upload.js');
    const up = vi.spyOn(upload, 'uploadArchiveWithSynapse').mockResolvedValue({ pieceCid: 'bafkzcibdxyz', dataSetId: '1', providers: ['9', '2'], retrievalUrls: ['https://sp/public/bafkzcibdxyz'], proofStatus: 'pending' });
    const reqId = 'a'.repeat(64), repId = 'b'.repeat(64);
    const w2: LocalWork = { ...work, messageId: reqId, threadRootId: reqId, publishedMessageIds: [repId] };
    const live = new Map([[reqId, { ...signed('request', 1), id: reqId }], [repId, { ...signed('reply', 2), id: repId }]]);
    const reply = vi.fn().mockRejectedValueOnce(new Error('relay down')).mockResolvedValue('card-id');
    const session: any = { readPage: async () => ({ events: [] }), messages: { reply, send: vi.fn() }, agentActivity: {} };
    await expect(sealAndPost(session, {} as any, w2, live)).rejects.toThrow('relay down');
    const r = await sealAndPost(session, {} as any, w2, live);
    expect(up).toHaveBeenCalledTimes(1);
    expect(reply).toHaveBeenCalledTimes(2);
    expect(reply.mock.calls[1][1]).toBe(reqId);
    expect(r.cardPosted).toBe(true);
    expect(JSON.parse(store[SEALS_KEY])).toHaveLength(1);
    up.mockRestore();
  });
});
