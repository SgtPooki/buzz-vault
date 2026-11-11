import type { Context } from '@buzz/author';
import {
  loadSession,
  saveSession,
  clearSession,
  parseSessionEnv,
  tryReadHostSessionEnv,
  generateSessionKeypair,
  buildAuthorizeUrl,
  watchAuthorization,
  DEFAULT_CONSOLE_URL,
  DEFAULT_SCOPES,
  DEFAULT_CHAIN_ID,
  type VaultSession,
  type SessionKeypair,
} from '../connect.js';

export function createSettingsCardComponent(ctx: Context) {
  const React = ctx.react;

  return function VaultSettingsCard() {
    const [session, setSession] = React.useState<VaultSession | null>(() => loadSession());
    const [detectedSession, setDetectedSession] = React.useState<VaultSession | null>(null);
    const [pastedEnv, setPastedEnv] = React.useState('');
    const [showPasteArea, setShowPasteArea] = React.useState(false);
    const [isConnecting, setIsConnecting] = React.useState(false);
    const [connectProgress, setConnectProgress] = React.useState<string | null>(null);
    const [activeAuthorizeUrl, setActiveAuthorizeUrl] = React.useState<string | null>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
    const abortRef = React.useRef<boolean>(false);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    // Check for existing filecoin-pin session on host upon loading
    React.useEffect(() => {
      let cancelled = false;
      if (!session && ctx.host?.readFile) {
        tryReadHostSessionEnv(ctx.host).then((detected) => {
          if (!cancelled && detected) {
            setDetectedSession(detected);
          }
        }).catch(() => {
          // host.readFile not available or files absent
        });
      }
      return () => {
        cancelled = true;
      };
    }, [session]);

    // Handle 1-click connect from auto-detected host file
    const handleUseDetectedSession = () => {
      if (!detectedSession) return;
      saveSession(detectedSession);
      setSession(detectedSession);
      setDetectedSession(null);
      setStatusMessage('Connected using local filecoin-pin session.');
    };

    // Handle Interactive Filecoin Console flow
    const handleConsoleConnect = async () => {
      try {
        setIsConnecting(true);
        abortRef.current = false;
        setStatusMessage(null);
        setConnectProgress('Generating session keypair...');

        const keypair: SessionKeypair = generateSessionKeypair();
        const authorizeUrl = buildAuthorizeUrl(
          DEFAULT_CONSOLE_URL,
          keypair.address,
          DEFAULT_SCOPES,
          DEFAULT_CHAIN_ID
        );
        setActiveAuthorizeUrl(authorizeUrl);

        try {
          window.open(authorizeUrl, '_blank');
        } catch {
          // Popup blocked or not supported
        }

        setConnectProgress('Authorize URL opened. Waiting for approval onchain...');

        const result = await watchAuthorization({
          sessionAddress: keypair.address,
          onProgress: (ev) => {
            if (abortRef.current) return;
            if (ev.type === 'watch:tick') {
              const secs = Math.ceil(ev.data.remainingMs / 1000);
              setConnectProgress(`Waiting for onchain approval... (${secs}s remaining)`);
            }
          },
        });

        if (abortRef.current) {
          setConnectProgress(null);
          return;
        }

        if (result.status === 'granted' && result.owner) {
          const newSession: VaultSession = {
            sessionPrivateKey: keypair.privateKey,
            sessionAddress: keypair.address,
            ownerAddress: result.owner,
            expiry: Number(result.expiry ?? 0n),
            network: 'calibration',
          };
          saveSession(newSession);
          setSession(newSession);
          setStatusMessage('Connected successfully via Filecoin Console!');
        } else {
          setStatusMessage(`Authorization timed out or incomplete (${result.status}).`);
        }
      } catch (err: any) {
        setStatusMessage(`Connection failed: ${err?.message || String(err)}`);
      } finally {
        setIsConnecting(false);
        setActiveAuthorizeUrl(null);
        setConnectProgress(null);
      }
    };

    const handleCancelConsoleConnect = () => {
      abortRef.current = true;
      setIsConnecting(false);
      setActiveAuthorizeUrl(null);
      setConnectProgress(null);
      setStatusMessage('Authorization cancelled.');
    };

    // Handle File Picker & Drag-and-Drop
    const handleFileRead = async (file: File) => {
      try {
        const text = await file.text();
        const parsed = parseSessionEnv(text);
        saveSession(parsed);
        setSession(parsed);
        setDetectedSession(null);
        setStatusMessage(`Session loaded from ${file.name}`);
      } catch (err: any) {
        setStatusMessage(`Failed to read file: ${err?.message || String(err)}`);
      }
    };

    const handleDrop = async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        await handleFileRead(file);
      }
    };

    // Handle Textarea Paste
    const handleImportText = () => {
      try {
        if (!pastedEnv.trim()) {
          setStatusMessage('Please paste the contents of session.env');
          return;
        }
        const imported = parseSessionEnv(pastedEnv);
        saveSession(imported);
        setSession(imported);
        setPastedEnv('');
        setDetectedSession(null);
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
          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 1. Detected filecoin-pin session banner */}
            {detectedSession && (
              <div style={{
                background: '#1e3a8a',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                padding: '14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#93c5fd' }}>⚡ Detected filecoin-pin Session</strong>
                    <div style={{ fontSize: '12px', color: '#bfdbfe', marginTop: '4px' }}>
                      Found local <code>session.env</code> for <code>{detectedSession.ownerAddress.slice(0, 10)}...{detectedSession.ownerAddress.slice(-8)}</code>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseDetectedSession}
                    style={{
                      background: '#3b82f6',
                      color: '#ffffff',
                      border: 'none',
                      padding: '7px 14px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Use Detected Session
                  </button>
                </div>
              </div>
            )}

            {/* 2. Primary Method: Console Authorization */}
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 6px 0' }}>Method 1: Filecoin Console</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 14px 0' }}>
                Generate a fresh session key and authorize in your browser using a Calibration wallet.
              </p>

              {isConnecting ? (
                <div>
                  <div style={{ fontSize: '13px', color: '#38bdf8', marginBottom: '8px' }}>
                    {connectProgress || 'Connecting...'}
                  </div>
                  {activeAuthorizeUrl && (
                    <div style={{ marginBottom: '12px', fontSize: '12px' }}>
                      <a href={activeAuthorizeUrl} target="_blank" rel="noreferrer" style={{ color: '#60a5fa' }}>
                        Click here if the authorization page did not open automatically
                      </a>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleCancelConsoleConnect}
                    style={{
                      background: '#475569',
                      color: '#f8fafc',
                      border: 'none',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleConsoleConnect}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Connect with Filecoin Console
                </button>
              )}
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <div style={{ flex: 1, height: '1px', background: '#334155' }} />
              <span>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#334155' }} />
            </div>

            {/* 3. Method 2 & 3: File Selection / Drag & Drop and Manual Paste */}
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 6px 0' }}>Method 2: Import session.env File</h4>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 12px 0' }}>
                Load an existing session file from <code>filecoin-pin</code>.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".env,text/plain"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileRead(file);
                }}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? '#3b82f6' : '#475569'}`,
                  borderRadius: '6px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: isDragging ? '#1e293b' : '#0f172a',
                  marginBottom: '12px',
                }}
              >
                <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
                  <strong>Click to select</strong> or drag and drop <code>session.env</code> here
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  Reads device-local <code>SESSION_KEY</code> and <code>WALLET_ADDRESS</code>
                </div>
              </div>

              {/* Method 3: Textarea Paste Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowPasteArea(!showPasteArea)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  {showPasteArea ? '− Hide manual paste' : '+ Or paste text manually'}
                </button>

                {showPasteArea && (
                  <div style={{ marginTop: '12px' }}>
                    <textarea
                      rows={4}
                      value={pastedEnv}
                      onChange={(e) => setPastedEnv(e.target.value)}
                      placeholder="SESSION_KEY=0x...&#10;WALLET_ADDRESS=0x...&#10;NETWORK=calibration"
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
                        marginBottom: '8px',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleImportText}
                      style={{
                        background: '#334155',
                        color: '#f8fafc',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      Import Text
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {statusMessage && (
          <div style={{ marginTop: '12px', fontSize: '13px', color: statusMessage.includes('fail') || statusMessage.includes('error') ? '#ef4444' : '#38bdf8' }}>
            {statusMessage}
          </div>
        )}
      </div>
    );
  };
}
