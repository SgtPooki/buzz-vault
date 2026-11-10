import type { Context } from '@buzz/author';
import {
  loadSession,
  saveSession,
  clearSession,
  generateSessionKeypair,
  buildAuthorizeUrl,
  watchAuthorization,
  type VaultSession,
} from '../connect.js';

export function createSettingsCardComponent(ctx: Context) {
  const React = ctx.react;

  return function VaultSettingsCard() {
    const [session, setSession] = React.useState<VaultSession | null>(() => loadSession());
    const [authorizing, setAuthorizing] = React.useState(false);
    const [authUrl, setAuthUrl] = React.useState<string | null>(null);
    const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

    const handleConnect = async () => {
      try {
        setAuthorizing(true);
        setStatusMessage('Generating device-local session key...');
        const kp = generateSessionKeypair();
        const url = buildAuthorizeUrl(kp.address);
        setAuthUrl(url);
        setStatusMessage('Authorize in Filecoin Console, then return here...');

        const result = await watchAuthorization({
          sessionAddress: kp.address,
          onProgress: (ev) => {
            if (ev.type === 'watch:tick') {
              setStatusMessage(`Waiting for authorization (${Math.round(ev.data.remainingMs / 1000)}s)...`);
            }
          },
        });

        if (result.status === 'granted' && result.owner) {
          const newSession: VaultSession = {
            sessionPrivateKey: kp.privateKey,
            sessionAddress: kp.address,
            ownerAddress: result.owner,
            expiry: Number(result.expiry ?? 0n),
            network: 'calibration',
          };
          saveSession(newSession);
          setSession(newSession);
          setAuthorizing(false);
          setAuthUrl(null);
          setStatusMessage(null);
        } else {
          setStatusMessage('Authorization timed out or was not granted.');
          setAuthorizing(false);
        }
      } catch (err: any) {
        setStatusMessage(`Error: ${err?.message || String(err)}`);
        setAuthorizing(false);
      }
    };

    const handleDisconnect = () => {
      clearSession();
      setSession(null);
      setAuthUrl(null);
      setStatusMessage(null);
    };

    const handleExportKey = () => {
      if (!session) return;
      const json = JSON.stringify(session, null, 2);
      navigator.clipboard.writeText(json);
      alert('Session key details copied to clipboard!');
    };

    return (
      <div style={{ padding: '16px', color: '#f8fafc', maxWidth: '640px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
          Filecoin Calibration Vault
        </h3>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '16px' }}>
          Save encrypted, verifiable channel archives directly to Filecoin storage providers.
        </p>

        {session ? (
          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ height: '8px', width: '8px', borderRadius: '50%', background: '#22c55e' }} />
              <strong style={{ fontSize: '14px' }}>Connected to Filecoin Calibration</strong>
            </div>

            <div style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
              <div><strong>Owner:</strong> <code style={{ color: '#38bdf8' }}>{session.ownerAddress}</code></div>
              <div><strong>Session Key:</strong> <code style={{ color: '#38bdf8' }}>{session.sessionAddress}</code></div>
              <div style={{ color: '#94a3b8', marginTop: '4px' }}>
                <em>Scoped permissions: <code>createDataSet</code>, <code>addPieces</code> (Device-local)</em>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleExportKey}
                style={{
                  background: '#334155',
                  color: '#f8fafc',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Copy Key JSON
              </button>
              <button
                type="button"
                onClick={handleDisconnect}
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Disconnect Session
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px' }}>
            <p style={{ fontSize: '14px', marginBottom: '16px' }}>
              Connect a Filecoin session key to enable channel archiving.
            </p>

            {authorizing && authUrl ? (
              <div style={{ marginBottom: '16px' }}>
                <a
                  href={authUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-block',
                    background: '#2563eb',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '14px',
                    marginBottom: '8px',
                  }}
                >
                  Open Filecoin Console to Authorize ↗
                </a>
                {statusMessage && (
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>{statusMessage}</div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConnect}
                style={{
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: 500,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Generate Session Key & Connect
              </button>
            )}

            {statusMessage && !authorizing && (
              <div style={{ marginTop: '12px', fontSize: '13px', color: '#ef4444' }}>
                {statusMessage}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
}
