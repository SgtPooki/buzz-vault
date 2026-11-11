import type { Context, Host } from '@buzz/author';
import { buildCar, type NostrEvent } from './export.js';
import { loadSession } from './connect.js';
import { uploadArchiveWithSynapse, type RealUploadResult } from './upload.js';
import { verifyAll } from './verify.js';

export const VIEWER_URL = 'https://sgtpooki.github.io/buzz-vault/viewer.html';
const SEALED_KEY = 'buzz-vault:sealed:v1';
export const SEALS_KEY = 'buzz-vault:seals:v1';

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
  return [...new Set([w.messageId, ...(w.publishedMessageIds ?? [])])].filter((id) => /^[0-9a-f]{64}$/.test(id));
}

export function buildSealFiles(w: LocalWork, events: NostrEvent[]): { files: Array<{ path: string; content: Uint8Array }>; manifest: SealManifest } {
  const sorted = [...events].sort((a, b) => a.created_at - b.created_at || a.id.localeCompare(b.id));
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

export function formatSealCard(agent: string, r: SealResult): string {
  const { manifest: m, upload } = r;
  const sig = m.signatures.verified === m.signatures.total ? `${m.signatures.total} signed messages verified` : `${m.signatures.verified} of ${m.signatures.total} signatures verified`;
  const where = upload.dataSetId ? `Filecoin Calibration, data set ${upload.dataSetId}` : 'Filecoin Calibration';
  const src = upload.retrievalUrls[0] ? `&src=${encodeURIComponent(upload.retrievalUrls[0])}` : '';
  const open = `${VIEWER_URL}?piece=${upload.pieceCid}${src}`;
  return [
    `**${agent} finished** · ${sig} · saved on ${where} · ${upload.providers.length} copies`,
    `[Open result](${open}) · piece \`${upload.pieceCid.slice(0, 12)}…${upload.pieceCid.slice(-6)}\``,
  ].join('\n');
}

interface RelaySessionLike {
  readPage(filters: readonly any[], settings?: any): Promise<{ events: readonly any[] }>;
  messages: { send(channelId: string, content: string): Promise<string>; reply(channelId: string, rootId: string, content: string): Promise<string> };
  agentActivity: { activate(): () => void; subscribe(l: () => void): () => void; snapshot(): { local: readonly LocalWork[] } };
}

export async function sealTurn(session: RelaySessionLike, host: Host, w: LocalWork): Promise<SealResult> {
  const vault = loadSession();
  if (!vault) throw new Error('No Filecoin session; import session.env in Settings');
  const ids = turnEventIds(w);
  const page = await session.readPage([{ ids }], { limit: ids.length });
  const events = page.events.filter((e: any) => ids.includes(e.id)) as NostrEvent[];
  if (events.length === 0) throw new Error(`No events found for turn ${w.messageId}`);
  const { files, manifest } = buildSealFiles(w, events);
  const { carBytes, rootCid } = await buildCar(files);
  const upload = await uploadArchiveWithSynapse(carBytes, {
    host,
    sessionPrivateKey: vault.sessionPrivateKey,
    ownerAddress: vault.ownerAddress,
    copies: 2,
    metadata: { source: 'buzz-vault', scope: 'agent-turn', agent: w.agent },
  });
  rememberSeal({ pieceCid: upload.pieceCid, rootCid, dataSetId: upload.dataSetId, retrievalUrls: upload.retrievalUrls, agent: w.agent, channelId: w.channelId, requestId: w.messageId, sealedAt: manifest.sealedAt });
  return { manifest, rootCid, upload, events };
}

export interface SealRecord {
  pieceCid: string;
  rootCid: string;
  dataSetId?: string;
  retrievalUrls: string[];
  agent: string;
  channelId: string;
  requestId: string;
  sealedAt: string;
}

export function loadSeals(): SealRecord[] {
  try {
    return JSON.parse(localStorage.getItem(SEALS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function rememberSeal(record: SealRecord) {
  localStorage.setItem(SEALS_KEY, JSON.stringify([...loadSeals(), record].slice(-200)));
}

function loadSealed(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEALED_KEY) ?? '[]'));
  } catch {
    return new Set();
  }
}

function remember(sealed: Set<string>) {
  localStorage.setItem(SEALED_KEY, JSON.stringify([...sealed].slice(-500)));
}

// Zero-click trigger: seal every local agent turn the moment its harness reports done
export function watchAgentTurns(ctx: Context): () => void {
  const sealed = loadSealed();
  const inflight = new Set<string>();
  const startedAt = Date.now();
  let stop: (() => void) | undefined;

  const bind = () => {
    stop?.();
    stop = undefined;
    const session = (ctx as any).relay?.snapshot?.()?.session as RelaySessionLike | undefined;
    if (!session?.agentActivity) return;
    const release = session.agentActivity.activate();
    const unsubscribe = session.agentActivity.subscribe(() => {
      for (const w of session.agentActivity.snapshot().local ?? []) {
        const key = workKey(w);
        if (!isSealable(w) || w.startedAt < startedAt || sealed.has(key) || inflight.has(key)) continue;
        inflight.add(key);
        console.warn('[vault] sealing turn', w.agent, w.messageId.slice(0, 8));
        sealTurn(session, ctx.host, w)
          .then(async (r) => {
            sealed.add(key);
            remember(sealed);
            const card = formatSealCard(w.agent, r);
            const root = w.thread ? w.threadRootId : w.publishedMessageIds?.[w.publishedMessageIds.length - 1];
            if (root && /^[0-9a-f]{64}$/.test(root)) await session.messages.reply(w.channelId, root, card);
            else await session.messages.send(w.channelId, card);
            console.warn('[vault] sealed turn', w.agent, r.upload.pieceCid, r.upload.dataSetId ?? '');
          })
          .catch((err) => {
            const chain: string[] = [];
            for (let e: any = err; e && chain.length < 6; e = e.cause) chain.push(e?.message || String(e));
            console.warn('[vault] seal failed', w.agent, chain.join(' | '));
          })
          .finally(() => inflight.delete(key));
      }
    });
    stop = () => {
      unsubscribe();
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
