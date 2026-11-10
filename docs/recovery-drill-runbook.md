# Buzz Vault — Recovery Drill Runbook

## 1. Overview
Buzz Vault creates encrypted, provable channel archives of Buzz community channels (signed Nostr kind 9 events plus media attachments) stored across endorsed Filecoin Onchain Cloud storage providers (SPs) on Calibration testnet.

A core promise of Buzz Vault is **independent recoverability**: even if the Buzz desktop client, local profile, or relay servers are completely offline or unavailable, a community owner can take their encrypted archive file, their device-local key, and open/verify everything outside Buzz.

---

## 2. Archive Specification
An archive file is an AES-256-GCM encrypted envelope (`.car.enc`) containing an unencrypted CARv1 (Content Addressable Archive) file. Inside the CAR is a standard UnixFS directory containing:
```text
/
├── manifest.json      # Coverage manifest with event range, counts, attachment hashes, and audit head
├── events.ndjson      # Signed kind 9 Nostr events, 1 per line, preserving all signatures intact
└── attachments/       # Raw binary media attachments addressed by SHA-256 hash or original filename
```

---

## 3. Recovery Procedures (Outside Buzz)

### Option A: Static Web Decryptor (`tools/decryptor.html`)
The static decryptor has zero network dependencies and executes entirely in the browser using the Web Cryptography API and client-side UnixFS parsers.

1. Open `tools/decryptor.html` directly in any modern web browser (`file:///.../tools/decryptor.html`).
2. Drag and drop the `.car.enc` file downloaded from the Filecoin PDP SP retrieval URL (or select via file picker).
3. Paste the 32-byte hex encryption key (from the community owner's session or saved backup).
4. Click **"Decrypt & Verify Archive"**.
5. The decryptor unpacks the CARv1 blockstore, audits every cryptographic signature and hash, and displays:
   - Channel metadata and coverage statistics.
   - Chronological message feed with author pubkeys.
   - Media attachments rendered in-browser with download links.

---

### Option B: Node / TypeScript CLI (`tools/decryptor.ts`)
For automated or headless recovery environments:

```bash
# Syntax: npx tsx tools/decryptor.ts <archive.car.enc> <keyHex> [--out <output-dir>]
npx tsx tools/decryptor.ts ./recovery-artifacts/channel-archive.car.enc 0123...cdef --out ./restored-channel
```

**Output artifacts:**
- `./restored-channel/manifest.json`: Verification metadata and channel coverage.
- `./restored-channel/events.json`: Fully verified Nostr events with `validSignature: true`.
- `./restored-channel/media/*`: Verified attachment blobs matching their SHA-256 hashes.

---

## 4. Verification Drill Results

A live test run of the recovery drill was executed with simulated community events and image attachments:

```text
=== BUZZ VAULT RECOVERY DRILL ===

1. Exporting channel events and media attachments to UnixFS CARv1...
   Exported 2 events, 1 attachments. Root CID: bafybeic...
2. Encrypting CAR with filecoin-encryption-envelope (AES-256-GCM)...
   Encrypted size: 1,482 bytes.
   Local key: 32-byte AES-GCM CEK.
3. Executing independent standalone recovery outside Buzz...

--- DRILL VERIFICATION REPORT ---
Channel ID:          ch_announcements
Events Total:        2
Signatures Verified: 2 / 2 (PASS)
Attachments Total:   1
Hashes Verified:     1 / 1 (PASS)
---------------------------------

✅ RECOVERY DRILL SUCCEEDED: 100% cryptographic integrity verified.
```

---

## 5. Security & Isolation Notes
1. **Zero Secret Leakage:** The symmetric encryption key is never transmitted to storage providers, relays, or log files.
2. **Deterministic Signatures:** Preserving Nostr event signatures ensures non-repudiation; anyone can verify the messages were authored by their original Nostr keys.
3. **Double Verification:** Attachment blobs are verified against both the manifest `imeta` declaration and their raw byte SHA-256 hashes.
