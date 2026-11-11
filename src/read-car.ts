import { CarReader } from '@ipld/car';
import { unixfs } from '@helia/unixfs';
import type { NostrEvent } from './export.js';
import type { SealManifest } from './seal.js';

// Reads a plaintext seal CAR back into its events and manifest
export async function readSealCar(carBytes: Uint8Array): Promise<{ events: NostrEvent[]; manifest: SealManifest | null }> {
  const reader = await CarReader.fromBytes(carBytes);
  const [root] = await reader.getRoots();
  if (!root) throw new Error('CAR has no roots');
  const blocks = new Map<string, Uint8Array>();
  for await (const block of reader.blocks()) blocks.set(block.cid.toString(), block.bytes);
  const blockstore = {
    async *get(cid: any) {
      const b = blocks.get(cid.toString());
      if (!b) throw new Error(`Missing block ${cid}`);
      yield b;
    },
    async *getBlocks(cids: any) {
      for await (const cid of cids) {
        const b = blocks.get(cid.toString());
        if (b) yield b;
      }
    },
    async put(cid: any, bytes: Uint8Array) {
      blocks.set(cid.toString(), bytes);
      return cid;
    },
    async has(cid: any) {
      return blocks.has(cid.toString());
    },
  };
  const fs = unixfs({ blockstore: blockstore as any });
  const text = async (path: string) => {
    const chunks: Uint8Array[] = [];
    for await (const c of fs.cat(path as any)) chunks.push(c);
    const out = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
    let off = 0;
    for (const c of chunks) {
      out.set(c, off);
      off += c.length;
    }
    return new TextDecoder().decode(out);
  };
  let events: NostrEvent[] = [];
  let manifest: SealManifest | null = null;
  for await (const entry of fs.ls(root.toString() as any)) {
    if (entry.name === 'events.ndjson') events = (await text(entry.path)).split('\n').filter(Boolean).map((l) => JSON.parse(l));
    if (entry.name === 'manifest.json') manifest = JSON.parse(await text(entry.path));
  }
  return { events, manifest };
}
