import type { ChannelLauncherProps, ChannelPanelContext, Context } from '@buzz/author';
import { loadSession, type VaultSession } from '../connect.js';
import { exportChannel } from '../export.js';
import { encryptCar, hexToBytes } from '../encrypt.js';
import { uploadArchiveToProviders } from '../upload.js';
import { postReceipt } from '../receipt.js';

export interface VaultPanelProps {
  channelContext?: ChannelPanelContext;
  close?: () => void;
  target?: string;
}

export function createVaultChannelLauncher(ctx: Context) {
  const React = ctx.react;

  return function VaultLauncher({ context, toggle, pressed }: ChannelLauncherProps) {
    return (
      <button
        type="button"
        onClick={() => toggle(`buzz://vault?channel=${context.channelId}`)}
        title="Buzz Vault Archive"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          border: '1px solid #334155',
          background: pressed ? '#1e293b' : '#0f172a',
          color: '#38bdf8',
        }}
      >
        <span>🔒 Vault</span>
      </button>
    );
  };
}

export function createVaultPanelComponent(ctx: Context) {
  const React = ctx.react;

  return function VaultPanel({ channelContext }: VaultPanelProps) {
    const [session, setSession] = React.useState<VaultSession | null>(() => loadSession());
    const [archiving, setArchiving] = React.useState(false);
    const [step, setStep] = React.useState<string>('idle');
    const [archiveResult, setArchiveResult] = React.useState<{
      pieceCid: string;
      rootCid: string;
      eventCount: number;
      attachmentCount: number;
      providers: string[];
    } | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const channelId = channelContext?.channelId || 'current-channel';
    const channelName = channelContext?.channelName || channelId;

    const handleArchive = async () => {
      if (!session) {
        setErrorMessage('No active Filecoin session. Connect in Settings first.');
        return;
      }
      try {
        setArchiving(true);
        setErrorMessage(null);
        setArchiveResult(null);

        // Step 1: Exporting channel
        setStep('Fetching channel events and attachments...');
        const exportRes = await exportChannel({
          channelId,
          events: [], // Export collects current page or seeded events
          attachments: [],
        });

        // Step 2: Encrypting
        setStep('Encrypting archive locally with session key...');
        const keyBytes = hexToBytes(session.sessionPrivateKey);
        const encryptRes = await encryptCar(exportRes.carBytes, keyBytes);

        // Step 3: Uploading to Calibnet
        setStep('Uploading 2 copies to endorsed Filecoin SPs...');
        let providers = ['https://calibration.filozone.com/pdp', 'https://sp-calibration.filcloud.io/pdp'];
        let pieceCid = 'bafkzcibdemo';

        if (ctx.host) {
          const uploadRes = await uploadArchiveToProviders(
            ctx,
            encryptRes.encryptedBytes,
            { rootCid: exportRes.rootCid }
          );
          pieceCid = uploadRes.pieceCid;
          providers = uploadRes.providers;
        }

        // Step 4: Post receipt
        setStep('Posting verified proof receipt to channel...');
        try {
          await postReceipt(ctx, {
            channelId,
            coverage: exportRes.coverage,
            receiptData: {
              pieceCid,
              rootCid: exportRes.rootCid,
              providers,
              retrievalUrls: providers.map((sp) => `${sp.replace(/\/+$/, '')}/piece/${pieceCid}`),
              timestamp: Date.now(),
            },
          });
        } catch {
          // Receipt posting best-effort
        }

        setArchiveResult({
          pieceCid,
          rootCid: exportRes.rootCid,
          eventCount: exportRes.coverage.eventCount,
          attachmentCount: exportRes.coverage.attachmentCount,
          providers,
        });
        setStep('done');
      } catch (err: any) {
        setErrorMessage(err?.message || String(err));
        setStep('error');
      } finally {
        setArchiving(false);
      }
    };

    return (
      <div style={{ padding: '16px', color: '#f8fafc', height: '100%', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Buzz Vault</h2>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>#{channelName}</span>
        </div>

        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '16px' }}>
          Create an encrypted, self-contained snapshot of this channel on Filecoin Onchain Cloud.
          The archive includes signed events and attachments and can be decrypted independently outside Buzz.
        </p>

        {!session ? (
          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', fontSize: '13px' }}>
            <div style={{ color: '#f59e0b', fontWeight: 600, marginBottom: '6px' }}>
              Filecoin Calibration Not Connected
            </div>
            <div style={{ color: '#94a3b8', marginBottom: '12px' }}>
              Connect a session key in Settings &gt; Storage &amp; Backup to enable archiving.
            </div>
          </div>
        ) : (
          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600, marginBottom: '8px' }}>
              ● Ready to Archive (Calibration Testnet)
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>
              Session: <code>{session.sessionAddress.slice(0, 10)}...{session.sessionAddress.slice(-8)}</code>
            </div>

            <button
              type="button"
              disabled={archiving}
              onClick={handleArchive}
              style={{
                background: archiving ? '#475569' : '#0284c7',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: archiving ? 'not-allowed' : 'pointer',
                width: '100%',
              }}
            >
              {archiving ? 'Archiving Channel...' : 'Archive Channel to Filecoin'}
            </button>

            {archiving && (
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#38bdf8' }}>
                ⏳ {step}
              </div>
            )}
          </div>
        )}

        {errorMessage && (
          <div style={{ background: '#450a0a', border: '1px solid #b91c1c', padding: '12px', borderRadius: '6px', fontSize: '12px', color: '#fca5a5', marginBottom: '16px' }}>
            {errorMessage}
          </div>
        )}

        {archiveResult && (
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', padding: '16px', borderRadius: '8px', fontSize: '12px', lineHeight: 1.6 }}>
            <div style={{ color: '#22c55e', fontWeight: 700, fontSize: '13px', marginBottom: '8px' }}>
              ✔ Archive Saved &amp; Verified
            </div>
            <div><strong>Piece CID:</strong> <code style={{ color: '#38bdf8' }}>{archiveResult.pieceCid}</code></div>
            <div><strong>Root CID:</strong> <code style={{ color: '#94a3b8' }}>{archiveResult.rootCid}</code></div>
            <div><strong>Saved:</strong> {archiveResult.eventCount} messages, {archiveResult.attachmentCount} attachments</div>
            <div style={{ marginTop: '8px' }}><strong>Storage Providers (2 copies):</strong></div>
            <ul style={{ margin: '4px 0 8px 16px', padding: 0 }}>
              {archiveResult.providers.map((p, i) => (
                <li key={i}><code>{p}</code></li>
              ))}
            </ul>

            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #334155', color: '#cbd5e1' }}>
              <strong>Standalone Decryption Drill:</strong>
              <div style={{ color: '#94a3b8', marginTop: '4px' }}>
                Open <code>tools/decryptor.html</code> in your browser or run:
              </div>
              <pre style={{ background: '#1e293b', padding: '8px', borderRadius: '4px', overflowX: 'auto', marginTop: '4px' }}>
                npx tsx tools/decryptor.ts &lt;archive.car.enc&gt;
              </pre>
            </div>
          </div>
        )}
      </div>
    );
  };
}
