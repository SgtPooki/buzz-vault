import type { Context, HostByteSend, HostRequestOnceOptions, HostResponse } from '@buzz/author';
import { calculate as calculatePieceCid } from '@filoz/synapse-core/piece';

declare module '@buzz/author' {
  interface Host {
    sendBytesOnce?: (
      bytes: Uint8Array,
      input: HostByteSend,
      options: HostRequestOnceOptions
    ) => Promise<HostResponse>;
  }
}

export const CALIBRATION_ENDORSED_SP_ENDPOINTS: readonly string[] = [
  'https://calib2.ezpdpz.net',
  'https://pdp-m2.reiers.io',
  'https://pdp.stax-infra.com',
];

export interface UploadPieceOptions {
  callId: string;
}

export interface CliSpawnOptions {
  sessionPrivateKey: string;
  walletAddress: string;
}

export interface CliUploadResult {
  pieceCid?: string;
  dataSetId?: string;
  transactionHash?: string;
  rawStdout: string;
}

export interface VaultReceiptData {
  pieceCid: string;
  rootCid?: string;
  dataSetId?: string;
  txHash?: string;
  providers: string[];
  retrievalUrls: string[];
  timestamp: number;
}

export interface UploadArchiveOptions {
  providers?: string[];
  targetCopies?: number;
  rootCid?: string;
  callIdPrefix?: string;
}

export interface UploadArchiveResult {
  pieceCid: string;
  providers: string[];
  receipt: VaultReceiptData;
}

export async function computeSha256(bytes: Uint8Array): Promise<string> {
  const hashBuf = await globalThis.crypto.subtle.digest('SHA-256', bytes as unknown as BufferSource);
  return Array.from(new Uint8Array(hashBuf), (b) => b.toString(16).padStart(2, '0')).join('');
}

// Upload raw CAR bytes to a storage provider using the Host sendBytesOnce primitive
export async function uploadPieceWithHost(
  ctx: Context,
  spBaseUrl: string,
  bytes: Uint8Array,
  options: UploadPieceOptions
): Promise<HostResponse> {
  if (typeof ctx.host?.sendBytesOnce !== 'function') {
    throw new Error('ctx.host.sendBytesOnce is not supported by current Buzz host');
  }
  const url = spBaseUrl;
  const res = await ctx.host.sendBytesOnce(
    bytes,
    { url, method: 'PUT', contentType: 'application/vnd.ipld.car' },
    { callId: options.callId }
  );
  if (res.status >= 400) {
    throw new Error(`Upload failed with status ${res.status}: ${res.body}`);
  }
  return res;
}

// Parse stdout emitted by filecoin-pin add command
export function parseCliAddStdout(stdout: string): CliUploadResult {
  const pieceCid = stdout.match(/(?:piece\s*cid|pieceCid)[:=\s]+([a-zA-Z0-9]+)/i)?.[1];
  const dataSetId = stdout.match(/(?:data\s*set\s*id|dataset\s*id|dataSetId)[:=\s]+([0-9]+)/i)?.[1];
  const transactionHash =
    stdout.match(/(?:transaction(?:\s*hash)?|tx(?:\s*hash)?|txHash)[:=\s]+(0x[a-fA-F0-9]{64})/i)?.[1] ??
    stdout.match(/\b(0x[a-fA-F0-9]{64})\b/)?.[1];

  return {
    pieceCid,
    dataSetId,
    transactionHash,
    rawStdout: stdout,
  };
}

// Fallback upload via host.saveBytes and host.spawn('pin', ['add', ...])
export async function uploadWithCliSpawn(
  ctx: Context,
  carBytes: Uint8Array,
  options: CliSpawnOptions
): Promise<CliUploadResult> {
  if (typeof ctx.host?.saveBytes !== 'function' || typeof ctx.host?.spawn !== 'function') {
    throw new Error('ctx.host.saveBytes and ctx.host.spawn are required for CLI spawn upload');
  }

  const sha256 = await computeSha256(carBytes);
  const saved = await ctx.host.saveBytes(carBytes, { sha256 });

  let stdout = '';
  let stderr = '';

  const proc = await ctx.host.spawn('pin', {
    args: ['add', saved.path, '--network', 'calibration'],
    env: {
      SESSION_KEY: options.sessionPrivateKey,
      WALLET_ADDRESS: options.walletAddress,
    },
    onStdout: (chunk: string) => {
      stdout += chunk;
    },
    onStderr: (chunk: string) => {
      stderr += chunk;
    },
  });

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    throw new Error(`pin process exited with code ${exitCode}: ${stderr || stdout}`);
  }

  return parseCliAddStdout(stdout);
}

// Multi-copy orchestrator coordinating upload to multiple endorsed SPs
export async function uploadArchiveToProviders(
  ctx: Context,
  carBytes: Uint8Array,
  options?: UploadArchiveOptions
): Promise<UploadArchiveResult> {
  const targetCopies = options?.targetCopies ?? 2;
  const availableProviders = options?.providers ?? CALIBRATION_ENDORSED_SP_ENDPOINTS;
  const targetProviders = availableProviders.slice(0, targetCopies);
  const pieceCidObj = await calculatePieceCid(carBytes);
  const pieceCid = pieceCidObj.toString();
  const successfulProviders: string[] = [];
  const callIdPrefix = options?.callIdPrefix ?? `vault-upload-${Date.now()}`;

  for (let i = 0; i < targetProviders.length; i++) {
    const spUrl = targetProviders[i];
    const callId = `${callIdPrefix}-${i}`;
    try {
      await uploadPieceWithHost(ctx, spUrl, carBytes, { callId });
      successfulProviders.push(spUrl);
    } catch {
      // Continue attempting remaining providers
    }
  }

  if (successfulProviders.length === 0) {
    throw new Error('Failed to upload archive to any storage provider');
  }

  const receipt: VaultReceiptData = {
    pieceCid,
    rootCid: options?.rootCid,
    providers: successfulProviders,
    retrievalUrls: successfulProviders.map((sp) => `${sp.replace(/\/+$/, '')}/piece/${pieceCid}`),
    timestamp: Date.now(),
  };

  return {
    pieceCid,
    providers: successfulProviders,
    receipt,
  };
}
