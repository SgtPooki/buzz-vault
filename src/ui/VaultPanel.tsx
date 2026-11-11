import type { ChannelLauncherProps, ChannelPanelContext, Context } from '@buzz/author';
import { loadSession, type VaultSession } from '../connect.js';
import { exportChannel, fetchChannelEvents, type NostrEvent } from '../export.js';
import { encryptCar, hexToBytes } from '../encrypt.js';
import { uploadArchiveWithSynapse, type RealUploadResult } from '../upload.js';
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
      dataSetId?: string;
      txHash?: string;
      eventCount: number;
      attachmentCount: number;
      providers: string[];
      retrievalUrls: string[];
    } | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const channelId = channelContext?.channelId || 'current-channel';
    const channelName = channelContext?.channelName || channelId;

    const handleArchive = async () => {
      if (!session) {
        setErrorMessage('No active Filecoin session. Connect or import in Settings first.');
        return;
      }
      if (!ctx.host) {
        setErrorMessage('Host service is not available.');
        return;
      }

      try {
        setArchiving(true);
        setErrorMessage(null);
        setArchiveResult(null);

        // Step 1: Fetch channel events from relay session
        setStep('Fetching channel events from relay...');
        const relaySession = ctx.relay?.snapshot?.()?.session;
        let events: NostrEvent[] = [];
        if (relaySession) {
          events = await fetchChannelEvents(relaySession, channelId);
        }

        // Step 2: Build CAR
        setStep('Packing events and manifest into UnixFS CAR...');
        const exportRes = await exportChannel({
          channelId,
          events,
          attachments: [],
        });

        // Step 3: Encrypt CAR
        setStep('Encrypting archive locally with session key (AES-256-GCM)...');
        const keyBytes = hexToBytes(session.sessionPrivateKey);
        const encryptRes = await encryptCar(exportRes.carBytes, keyBytes);

        // Step 4: Upload via Synapse SDK through host fetch shim
        setStep('Uploading to Filecoin Calibration storage providers...');
        const uploadRes = await uploadArchiveWithSynapse(encryptRes.encryptedBytes, {
          host: ctx.host,
          sessionPrivateKey: session.sessionPrivateKey,
          ownerAddress: session.ownerAddress,
          copies: 2,
        });

        // Step 5: Post verifiable receipt to channel
        setStep('Posting verified proof receipt to channel...');
        try {
          await postReceipt(ctx, {
            channelId,
            coverage: exportRes.coverage,
            rootCid: exportRes.rootCid,
            upload: uploadRes,
          });
        } catch {
          // Receipt posting is best-effort
        }

        setArchiveResult({
          pieceCid: uploadRes.pieceCid,
          rootCid: exportRes.rootCid,
          dataSetId: uploadRes.dataSetId,
          txHash: uploadRes.txHash,
          eventCount: exportRes.coverage.eventCount,
          attachmentCount: exportRes.coverage.attachmentCount,
          providers: uploadRes.providers,
          retrievalUrls: uploadRes.retrievalUrls,
        });
        setStep('done');
      } catch (err: any) {
        const chain: string[] = [];
        for (let e: any = err; e && chain.length < 6; e = e.cause) chain.push(e?.message || String(e));
        console.warn('[vault] archive failed', chain.join(' | '));
        setErrorMessage(chain.join(' | '));
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

        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '12px' }}>
          Create an encrypted snapshot of this channel on Filecoin Onchain Cloud.
        </p>

        <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '10px 12px', fontSize: '12px', color: '#94a3b8', marginBottom: '16px', lineHeight: 1.4 }}>
          <strong>Capture Scope:</strong> The panel captures all channel events and attachment hashes. For full attachment binary preservation, use the <code>vault_archive</code> agent tool.
        </div>

        {!session ? (
          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', fontSize: '13px' }}>
            <div style={{ color: '#f59e0b', fontWeight: 600, marginBottom: '6px' }}>
              Filecoin Calibration Not Connected
            </div>
            <div style={{ color: '#94a3b8', marginBottom: '12px' }}>
              Paste your <code>session.env</code> in Settings &gt; Storage &amp; Backup to enable archiving.
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
              ✔ Archive Saved
            </div>
            <div><strong>Piece CID:</strong> <code style={{ color: '#38bdf8' }}>{archiveResult.pieceCid}</code></div>
            <div><strong>Root CID:</strong> <code style={{ color: '#94a3b8' }}>{archiveResult.rootCid}</code></div>
            {archiveResult.dataSetId && <div><strong>Data Set ID:</strong> <code>{archiveResult.dataSetId}</code></div>}
            {archiveResult.txHash && <div><strong>Transaction Hash:</strong> <code>{archiveResult.txHash}</code></div>}
            <div><strong>Saved:</strong> {archiveResult.eventCount} messages, {archiveResult.attachmentCount} attachments</div>
            {archiveResult.providers.length > 0 && (
              <>
                <div style={{ marginTop: '8px' }}><strong>Storage Providers ({archiveResult.providers.length} copies):</strong></div>
                <ul style={{ margin: '4px 0 8px 16px', padding: 0 }}>
                  {archiveResult.providers.map((p, i) => (
                    <li key={i}>Provider <code>{p}</code></li>
                  ))}
                </ul>
              </>
            )}

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
