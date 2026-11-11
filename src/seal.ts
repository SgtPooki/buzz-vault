import type { Context, Host } from '@buzz/author';
import { buildCar, type NostrEvent } from './export.js';
import { loadSession } from './connect.js';
import { uploadArchiveWithSynapse, type RealUploadResult } from './upload.js';
import { verifyAll } from './verify.js';

export const VIEWER_URL = 'https://sgtpooki.github.io/buzz-vault/viewer.html';
export const SEALS_KEY = 'buzz-vault:seals:v1';
const HEX64 = /^[0-9a-f]{64}$/;
const LIVE_BUFFER = 2000;

// The subset of a local agent work record the seal needs (src/features/agents/local-activity.ts)
export interface LocalWork {
  scope: string;
  agent: string;
  channelId: string;
  messageId: string;
  threadRootId: string;
  thread?: true;
  state: string;
  startedAt: number;
  publishing?: number;
  publishedMessageIds?: readonly string[];
  error?: string;
}

export interface SealManifest {
  version: 1;
  scope: 'agent-turn';
  agent: string;
  channelId: string;
  requestId: string;
  publishedMessageIds: string[];
  eventIds: string[];
  sealedAt: string;
  signatures: { verified: number; total: number };
  omitted: string[];
}

export interface SealRecord {
  key: string;
  pieceCid: string;
  rootCid: string;
  dataSetId?: string;
  retrievalUrls: string[];
  providers: string[];
  agent: string;
  channelId: string;
  requestId: string;
  sealedAt: string;
  signatures: { verified: number; total: number };
  cardPosted: boolean;
}

export interface SealResult {
  manifest: SealManifest;
  rootCid: string;
  upload: RealUploadResult;
  events: NostrEvent[];
}

export const workKey = (w: Pick<LocalWork, 'scope' | 'agent' | 'messageId'>) => `${w.scope}:${w.agent}:${w.messageId}`;

// A turn is sealable once its harness reports done and every published reply is acknowledged
export function isSealable(w: LocalWork): boolean {
  return w.state === 'done' && !w.publishing && (w.publishedMessageIds?.length ?? 0) > 0;
}

export function turnEventIds(w: LocalWork): string[] {
  return [...new Set([w.messageId, ...(w.publishedMessageIds ?? [])])].filter((id) => HEX64.test(id));
}

// Only the NIP-01 fields go into the public seal; host-side projection extras stay out
export function signedFields(e: any): NostrEvent {
  return { id: e.id, pubkey: e.pubkey, created_at: e.created_at, kind: e.kind, tags: e.tags, content: e.content, sig: e.sig };
}

export function buildSealFiles(w: LocalWork, events: NostrEvent[]): { files: Array<{ path: string; content: Uint8Array }>; manifest: SealManifest } {
  const sorted = events.map(signedFields).sort((a, b) => a.created_at - b.created_at || a.id.localeCompare(b.id));
  const { results } = verifyAll(sorted);
  const manifest: SealManifest = {
    version: 1,
    scope: 'agent-turn',
    agent: w.agent,
    channelId: w.channelId,
    requestId: w.messageId,
    publishedMessageIds: [...(w.publishedMessageIds ?? [])],
    eventIds: sorted.map((e) => e.id),
    sealedAt: new Date().toISOString(),
    signatures: { verified: results.filter((r) => r.idMatches && r.signatureValid).length, total: results.length },
    omitted: ['tool calls', 'filesystem changes', 'attachment bytes'],
  };
  const enc = new TextEncoder();
  const files = [
    { path: 'events.ndjson', content: enc.encode(sorted.map((e) => JSON.stringify(e)).join('\n') + '\n') },
    { path: 'manifest.json', content: enc.encode(JSON.stringify(manifest, null, 2)) },
  ];
  return { files, manifest };
}

export function viewerLink(pieceCid: string, retrievalUrls: readonly string[]): string {
  const src = retrievalUrls.map((u) => `&src=${encodeURIComponent(u)}`).join('');
  return `${VIEWER_URL}?piece=${pieceCid}${src}`;
}

export function formatSealCard(r: Pick<SealRecord, 'agent' | 'pieceCid' | 'dataSetId' | 'providers' | 'retrievalUrls' | 'signatures'>): string {
  const { signatures: s } = r;
  const sig = s.verified === s.total ? `${s.total} signed messages verified` : `${s.verified} of ${s.total} signatures verified`;
  const where = r.dataSetId ? `Filecoin Calibration, data set ${r.dataSetId}` : 'Filecoin Calibration';
  return [
    `**${r.agent} finished** · ${sig} · saved on ${where} · ${r.providers.length} copies`,
    `[Open result](${viewerLink(r.pieceCid, r.retrievalUrls)}) · piece \`${r.pieceCid.slice(0, 12)}…${r.pieceCid.slice(-6)}\``,
  ].join('\n');
}

export interface RelaySessionLike {
  readPage(filters: readonly any[], settings?: any): Promise<{ events: readonly any[] }>;
  subscribeLive?(listener: (batch: { events: readonly any[] }) => void): () => void;
  messages: { send(channelId: string, content: string): Promise<string>; reply(channelId: string, rootId: string, content: string): Promise<string> };
  agentActivity: { activate(): () => void; subscribe(l: () => void): () => void; snapshot(): { local?: readonly LocalWork[] } };
}

// Collects exactly the turn's signed events: live buffer first, relay read for the rest
export async function collectTurnEvents(session: RelaySessionLike, w: LocalWork, live: Map<string, any>): Promise<NostrEvent[]> {
  const ids = turnEventIds(w);
  const found = new Map<string, any>();
  for (const id of ids) if (live.has(id)) found.set(id, live.get(id));
  const missing = ids.filter((id) => !found.has(id));
  if (missing.length > 0) {
    const page = await session.readPage([{ ids: missing, limit: Math.min(missing.length, 500) }]);
    for (const e of page.events) if (missing.includes(e.id)) found.set(e.id, e);
  }
  const still = ids.filter((id) => !found.has(id));
  if (still.length > 0) throw new Error(`Turn events not yet readable: ${still.map((s) => s.slice(0, 8)).join(', ')}`);
  const events = ids.map((id) => signedFields(found.get(id)));
  const unsigned = events.filter((e) => !HEX64.test(e.id) || typeof e.sig !== 'string' || e.sig.length !== 128);
  if (unsigned.length > 0) throw new Error(`Events without signatures: ${unsigned.map((e) => e.id.slice(0, 8)).join(', ')}`);
  return events;
}

export async function sealTurn(session: RelaySessionLike, host: Host, w: LocalWork, live: Map<string, any> = new Map()): Promise<SealResult> {
  const vault = loadSession();
  if (!vault) throw new Error('No Filecoin session; import session.env in Settings');
  const events = await collectTurnEvents(session, w, live);
  const { files, manifest } = buildSealFiles(w, events);
  const { carBytes, rootCid } = await buildCar(files);
  const upload = await uploadArchiveWithSynapse(carBytes, {
    host,
    sessionPrivateKey: vault.sessionPrivateKey,
    ownerAddress: vault.ownerAddress,
    copies: 2,
    metadata: { source: 'buzz-vault', scope: 'agent-turn', agent: w.agent },
  });
  return { manifest, rootCid, upload, events };
}

export function loadSeals(): SealRecord[] {
  try {
    return JSON.parse(localStorage.getItem(SEALS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function saveSeal(record: SealRecord) {
  const rest = loadSeals().filter((s) => s.key !== record.key);
  localStorage.setItem(SEALS_KEY, JSON.stringify([...rest, record].slice(-200)));
}

async function postCard(session: RelaySessionLike, w: LocalWork, record: SealRecord) {
  const card = formatSealCard(record);
  // The host sets threadRootId to the request for channel work and to the thread root inside one
  if (HEX64.test(w.threadRootId)) await session.messages.reply(w.channelId, w.threadRootId, card);
  else await session.messages.send(w.channelId, card);
}

// One turn: upload once, then post the card; a failed card retries without re-uploading
export async function sealAndPost(session: RelaySessionLike, host: Host, w: LocalWork, live: Map<string, any>): Promise<SealRecord> {
  const key = workKey(w);
  let record = loadSeals().find((s) => s.key === key);
  if (!record) {
    const r = await sealTurn(session, host, w, live);
    record = {
      key,
      pieceCid: r.upload.pieceCid,
      rootCid: r.rootCid,
      dataSetId: r.upload.dataSetId,
      retrievalUrls: r.upload.retrievalUrls,
      providers: r.upload.providers,
      agent: w.agent,
      channelId: w.channelId,
      requestId: w.messageId,
      sealedAt: r.manifest.sealedAt,
      signatures: r.manifest.signatures,
      cardPosted: false,
    };
    saveSeal(record);
  }
  if (!record.cardPosted) {
    await postCard(session, w, record);
    record = { ...record, cardPosted: true };
    saveSeal(record);
  }
  return record;
}

// Zero-click trigger: seal every local agent turn the moment its harness reports done
export function watchAgentTurns(ctx: Context): () => void {
  const inflight = new Set<string>();
  const live = new Map<string, any>();
  let stop: (() => void) | undefined;

  const remember = (e: any) => {
    if (!e?.id) return;
    live.set(e.id, e);
    if (live.size > LIVE_BUFFER) live.delete(live.keys().next().value as string);
  };

  const scan = (session: RelaySessionLike) => {
    for (const w of session.agentActivity.snapshot().local ?? []) {
      const key = workKey(w);
      if (!isSealable(w) || inflight.has(key)) continue;
      if (loadSeals().some((s) => s.key === key && s.cardPosted)) continue;
      inflight.add(key);
      console.warn('[vault] sealing turn', w.agent, w.messageId.slice(0, 8));
      sealAndPost(session, ctx.host, w, live)
        .then((r) => console.warn('[vault] sealed turn', w.agent, r.pieceCid, r.dataSetId ?? ''))
        .catch((err) => {
          const chain: string[] = [];
          for (let e: any = err; e && chain.length < 6; e = e.cause) chain.push(e?.message || String(e));
          console.warn('[vault] seal failed', w.agent, chain.join(' | '));
        })
        .finally(() => inflight.delete(key));
    }
  };

  const bind = () => {
    stop?.();
    stop = undefined;
    const session = (ctx as any).relay?.snapshot?.()?.session as RelaySessionLike | undefined;
    if (!session?.agentActivity) return;
    const release = session.agentActivity.activate();
    const unsubscribe = session.agentActivity.subscribe(() => scan(session));
    const unlive = session.subscribeLive?.((batch) => batch.events.forEach(remember)) ?? (() => {});
    scan(session);
    stop = () => {
      unsubscribe();
      unlive();
      release();
    };
  };

  bind();
  const unwatch = (ctx as any).relay?.subscribe?.(bind) ?? (() => {});
  return () => {
    unwatch();
    stop?.();
  };
}
