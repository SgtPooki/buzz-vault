import type { Context } from '@buzz/author';
import {
  loadSession,
  saveSession,
  clearSession,
  parseSessionEnv,
  type VaultSession,
} from '../connect.js';

export function createSettingsCardComponent(ctx: Context) {
  const React = ctx.react;

  return function VaultSettingsCard() {
    const [session, setSession] = React.useState<VaultSession | null>(() => loadSession());
    const [pastedEnv, setPastedEnv] = React.useState('');
    const [statusMessage, setStatusMessage] = React.useState<string | null>(null);

    const handleImportSession = () => {
      try {
        if (!pastedEnv.trim()) {
          setStatusMessage('Please paste the contents of session.env');
          return;
        }
        const imported = parseSessionEnv(pastedEnv);
        saveSession(imported);
        setSession(imported);
        setPastedEnv('');
        setStatusMessage('Successfully imported session.env (device-local).');
      } catch (err: any) {
        setStatusMessage(`Import error: ${err?.message || String(err)}`);
      }
    };

    const handleDisconnect = () => {
      clearSession();
      setSession(null);
      setStatusMessage(null);
    };

    const handleExportKey = () => {
      if (!session) return;
      const json = JSON.stringify(session, null, 2);
      navigator.clipboard.writeText(json);
      alert('Session details copied to clipboard!');
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
            <h4 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 8px 0' }}>Import Calibration Session</h4>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>
              Paste the contents of your <code>session.env</code> file below. Only <code>SESSION_KEY</code>, <code>WALLET_ADDRESS</code>, and <code>NETWORK</code> are parsed and stored device-locally in localStorage.
            </p>

            <textarea
              rows={5}
              value={pastedEnv}
              onChange={(e) => setPastedEnv(e.target.value)}
              placeholder="Paste session.env contents here...&#10;SESSION_KEY=0x...&#10;WALLET_ADDRESS=0x...&#10;NETWORK=calibration"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '8px',
                fontFamily: 'monospace',
                fontSize: '12px',
                marginBottom: '12px',
              }}
            />

            <button
              type="button"
              onClick={handleImportSession}
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
              Import Session
            </button>
          </div>
        )}

        {statusMessage && (
          <div style={{ marginTop: '12px', fontSize: '13px', color: statusMessage.includes('error') ? '#ef4444' : '#38bdf8' }}>
            {statusMessage}
          </div>
        )}
      </div>
    );
  };
}
