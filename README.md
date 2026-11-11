# Buzz Vault

> **Encrypted, verifiable channel archiving to Filecoin Onchain Cloud for Block's Buzz desktop client.**

Buzz Vault is a desktop plugin for [Buzz](https://github.com/block/buzz) (Block’s open-source, Nostr-based collaboration app) that lets community owners take cryptographically signed, encrypted snapshots of channel history and media attachments, preserve them across independent decentralized storage providers (SPs) on Filecoin, and audit or open them completely outside Buzz.

---

## The Problem: Ephemeral Chat and Vendor Lock-in

Whether running on centralized platforms (Slack, Discord) or federated protocols (Nostr relays), team and community communication faces fundamental data persistence risks:

1. **Centralized Platform Rents & Lock-in:** Slack and Discord hold institutional knowledge hostage behind proprietary subscription tiers and retain the power to de-platform communities or delete historical archives.
2. **Relay Eviction & Data Loss:** In federated ecosystems like Nostr, relays are lightweight routing nodes, not permanent storage archives. Relays regularly prune event history to conserve disk space, drop offline, or lose external media attachments hosted on ephemeral image servers.
3. **Unverifiable History:** When backups are made, traditional exports are flat JSON files with no cryptographic proof of who authored what, when it occurred, or whether attachments were tampered with.

---

## What Buzz Vault Does

Buzz Vault bridges Block's Buzz communication client with Filecoin Onchain Cloud (`@filoz/synapse-sdk`):

- **Cryptographic Preservation:** Captures signed Nostr channel events (Kind 9) preserving original author Schnorr signatures intact. Every message is verifiable and non-repudiable.
- **Media Preservation:** Discovers inline attachments from event metadata (`imeta`), downloads the raw binary blobs, audits their SHA-256 hashes, and bundles them alongside messages.
- **Content-Addressable Packaging:** Packs the event stream, attachment tree, and coverage manifest into an IPLD/UnixFS CARv1 (Content Addressable Archive).
- **Client-Side Encryption:** Encrypts the CAR package locally on the user's machine using AES-256-GCM (`filecoin-encryption-envelope`) before any network transmission. Neither storage providers, relays, nor third parties can read community data.
- **Decentralized Storage:** Uploads redundant copies across independent Filecoin Calibration storage providers with onchain storage agreements and Proof of Data Possession (PDP).
- **Onchain Audit Receipt:** Posts a verifiable receipt message back into the channel with the Piece CID, root CID, transaction hash, and active storage providers.
- **Independent Recoverability (Zero Vendor Lock-in):** If Buzz servers, relays, or the desktop client ever disappear, a community owner can open the encrypted archive using a zero-dependency static web decryptor (`tools/decryptor.html`) or CLI without Buzz or Filecoin installed.

---

## How It Works

```mermaid
flowchart TD
    subgraph Buzz Desktop App
        A[Community Channel] -->|Fetch Events & Media| B[Export Module]
        B -->|Build UnixFS CAR| C[carBytes + Root CID]
        C -->|Local AES-256-GCM| D[Encrypted .car.enc]
        D -->|Fetch Shim| E[Host SendBytesOnce / Request]
    end

    subgraph Filecoin Onchain Cloud
        E -->|Lotus WebSocket RPC| F[Smart Contract Session Key]
        E -->|Upload Copies x2| G[Endorsed Storage Providers]
        G -->|PDP Proofs| H[Onchain Verifiable Storage]
    end

    subgraph Independent Recovery
        D -.->|Archive File + Local Key| I[Standalone Decryptor HTML/CLI]
        I -->|Audit Signatures & Hashes| J[Restored Feed & Media Outside Buzz]
    end
```

---

## Project Structure

```text
buzz-vault/
├── manifest.json            # Buzz plugin manifest declaring host capabilities
├── src/
│   ├── index.ts             # Plugin entry point (registers panel, agent tool, settings card)
│   ├── connect.ts           # Session key generation, console auth, and host file auto-detection
│   ├── export.ts            # Nostr event fetching, media bundling, and UnixFS CAR builder
│   ├── encrypt.ts           # AES-256-GCM envelope encryption via filecoin-encryption-envelope
│   ├── upload.ts            # Synapse SDK client and host fetch shim for binary PDP uploads
│   ├── receipt.ts           # Receipt formatting and channel publication
│   ├── agent-tool.ts        # 'vault_archive' agent tool for autonomous archiving
│   └── ui/
│       ├── SettingsCard.tsx # Filecoin connection UI (Console, File auto-detect, File upload, Paste)
│       └── VaultPanel.tsx   # Channel archive trigger and real-time status monitor
├── tools/
│   ├── decryptor.html       # Standalone zero-dependency web decryptor
│   ├── decryptor.ts         # Standalone CLI decryptor
│   └── recovery-drill.ts    # End-to-end cryptographic integrity verification drill
├── test/                    # Comprehensive Vitest test suite
└── buzz-app-host-upload.patch # Upstream patch adding dynamic upload primitive to Buzz host
```

---

## Getting Started

### Prerequisites

- Node.js >= 24
- `pnpm` >= 10
- Built version of Block's `buzzodz` CLI (from `buzz-app`)
- A funded Filecoin Calibration session (via [Filecoin Pay Console](https://pay.filecoin.cloud) or local `filecoin-pin`)

### 1. Build the Plugin

```bash
pnpm install
pnpm build
```

This compiles TypeScript and bundles the plugin into `dist/plugin.js` and `dist/manifest.json`.

### 2. Sideload into Buzz

```bash
buzzodz plugin install dist
buzzodz plugin list
```

Verify that `sgtpooki.buzz-vault` is listed as `enabled (external)`.

### 3. Connect to Filecoin Calibration

Open Buzz, navigate to **Settings -> Buzz Vault**. You have 3 connection options:

1. **Auto-Detect (Fastest):** If you have used `filecoin-pin` on your machine, Buzz Vault detects your local session at `~/Library/Application Support/filecoin-pin/session.env` and connects with a single click.
2. **Filecoin Console (Browser Wallet):** Click **"Connect with Filecoin Console"** to generate a session key and authorize via MetaMask / browser wallet on Calibration testnet.
3. **File Import / Paste:** Select or drag-and-drop an existing `session.env` file or paste its contents directly.

### 4. Archive a Channel

- **From the UI:** Open any community channel, open the Buzz Vault panel, and click **"Archive Channel to Filecoin"**.
- **Via Buzz AI Agents:** Ask any Buzz agent:
  > *"Archive channel #announcements to Filecoin with local encryption."*
  The agent will invoke the registered `vault_archive` tool, read attachments, build the archive, upload to Filecoin, and post the receipt back to the conversation.

---

## Independent Recovery Drill

To verify that archives can be decrypted and audited without Buzz:

```bash
pnpm exec tsx tools/recovery-drill.ts
```

This runs an automated end-to-end drill:
1. Generates Nostr channel events with valid Schnorr signatures and image attachments.
2. Exports to a UnixFS CARv1 archive.
3. Encrypts the CAR with a fresh AES-256-GCM key and writes it to disk.
4. Reads the encrypted file from disk, decrypts with `decryptCar`, unpacks blocks, and verifies 100% of cryptographic signatures and attachment hashes.

To inspect archives visually, open `tools/decryptor.html` in any web browser and load the `.car.enc` file with the hex key.

---

## Testing

```bash
pnpm test
```

Runs the 48-test vitest suite covering:
- Host fetch shimming and upload sequence dispatch.
- Session key parsing, registry log polling, and candidate path resolution.
- Nostr event serialization, `imeta` parsing, and CAR construction.
- Encryption envelopes and signature auditing.
- Receipt formatting with strict placeholder prohibition.

---

## License

Apache-2.0
