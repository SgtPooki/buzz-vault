// @ts-nocheck: browser entry, DOM-typed by the page
import { readSealCar } from './read-car.js';
import { verifyAll } from './verify.js';
const q = new URLSearchParams(location.search);
const piece = q.get('piece');
const sources = q.getAll('src').filter((u) => /^https:\/\//.test(u));
const badge = document.getElementById('badge'), list = document.getElementById('list'), where = document.getElementById('where');
where.textContent = piece ? `piece ${piece}` : 'no piece CID in the URL';

async function fetchCar() {
  for (const src of sources) {
    try { const r = await fetch(src); if (r.ok) return { bytes: new Uint8Array(await r.arrayBuffer()), src }; } catch {}
  }
  throw new Error(sources.length ? 'no storage provider answered' : 'no provider URL in the link');
}
function render(events, manifest, src) {
  const results = verifyAll(events).results.map((r, i) => ({ e: events[i], ok: r.idMatches && r.signatureValid }));
  const good = results.filter((r) => r.ok).length;
  badge.className = 'badge ' + (good === results.length ? 'ok' : 'bad');
  badge.textContent = good === results.length ? `✓ ${good} of ${results.length} signatures verified on this device` : `✗ ${results.length - good} of ${results.length} signatures failed`;
  where.textContent = `${manifest?.agent ?? 'agent'} · ${manifest?.sealedAt ?? ''} · served by ${new URL(src).host}`;
  for (const { e, ok } of results) {
    const d = document.createElement('div'); d.className = 'msg';
    d.innerHTML = `<div class="meta"><span>${new Date(e.created_at * 1000).toLocaleString()}</span><span><code>${e.pubkey.slice(0, 8)}…</code></span><span class="${ok ? 'v' : 'x'}">${ok ? 'signature valid' : 'SIGNATURE INVALID'}</span></div><pre></pre>`;
    d.querySelector('pre').textContent = e.content;
    list.appendChild(d);
  }
}
try {
  const { bytes, src } = await fetchCar();
  const { events, manifest } = await readSealCar(bytes);
  if (!events.length) throw new Error('seal has no events.ndjson');
  render(events, manifest, src);
} catch (err) {
  badge.className = 'badge bad'; badge.textContent = `Could not open the seal: ${err.message}`;
}
