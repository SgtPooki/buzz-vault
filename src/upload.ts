import type { Context, Host, HostByteSend, HostRequest, HostRequestOnceOptions, HostResponse } from '@buzz/author';
import { fromSecp256k1 } from '@filoz/synapse-core/session-key';
import { calibration, Synapse } from '@filoz/synapse-sdk';
import { custom, getAddress, webSocket, type Address, type Hex } from 'viem';
import { DEFAULT_CALIBRATION_WS_RPC } from './connect.js';

declare module '@buzz/author' {
  interface Host {
    sendBytesOnce?: (
      bytes: Uint8Array,
      input: HostByteSend,
      options: HostRequestOnceOptions
    ) => Promise<HostResponse>;
  }
}

export interface RealUploadResult {
  pieceCid: string;
  rootCid?: string;
  dataSetId?: string;
  txHash?: string;
  providers: string[];
  retrievalUrls: string[];
  proofStatus: string;
}

export interface SynapseUploadOptions {
  host: Host;
  sessionPrivateKey: Hex;
  ownerAddress: Address;
  copies?: number;
  metadata?: Record<string, string>;
  onProgress?: (bytesUploaded: number) => void;
}

// Installs a global fetch shim routing non-declared origins through the patched host
export function installHostFetchShim(host: Host, networkOrigins: readonly string[] = []): () => void {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async function hostFetchShim(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const urlString =
      typeof input === 'string'
        ? input
        : input instanceof URL
        ? input.toString()
        : input.url;
    const url = new URL(urlString);

    const isDeclaredOrigin = networkOrigins.some((orig) => {
      try {
        return new URL(orig).origin === url.origin;
      } catch {
        return orig === url.origin;
      }
    });

    if (isDeclaredOrigin && typeof originalFetch === 'function') {
      return originalFetch(input, init);
    }

    const method = (
      init?.method ||
      (input instanceof Request ? input.method : 'GET')
    ).toUpperCase();

    const headers: Record<string, string> = {};
    if (init?.headers) {
      const h = new Headers(init.headers);
      h.forEach((val, key) => {
        headers[key] = val;
      });
    } else if (input instanceof Request && input.headers) {
      input.headers.forEach((val, key) => {
        headers[key] = val;
      });
    }

    let bodyData: any = init?.body;
    if (!bodyData && input instanceof Request) {
      try {
        bodyData = await input.arrayBuffer();
      } catch {
        // body might be empty or consumed
      }
    }

    const isBinaryBody =
      bodyData instanceof Uint8Array ||
      bodyData instanceof ArrayBuffer ||
      (typeof (globalThis as any).Buffer !== 'undefined' && (globalThis as any).Buffer.isBuffer(bodyData));

    if (isBinaryBody && (method === 'PUT' || method === 'POST')) {
      if (typeof host.sendBytesOnce !== 'function') {
        throw new Error('Host does not support sendBytesOnce primitive');
      }
      const bytes =
        bodyData instanceof Uint8Array ? bodyData : new Uint8Array(bodyData);
      const contentType =
        headers['content-type'] ||
        headers['Content-Type'] ||
        'application/octet-stream';
      const callId = `vault-fetch-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;

      const res = await host.sendBytesOnce(
        bytes,
        {
          url: urlString,
          method: method as 'PUT' | 'POST',
          contentType,
        },
        { callId }
      );

      const responseBody =
        res.status === 204 || res.status === 205 || res.status === 304
          ? null
          : res.body;

      return new Response(responseBody, {
        status: res.status,
        headers: new Headers(res.headers),
      });
    }

    let bodyString: string | undefined = undefined;
    if (bodyData) {
      if (typeof bodyData === 'string') {
        bodyString = bodyData;
      } else {
        bodyString = new TextDecoder().decode(bodyData);
      }
    }

    const res = await host.request({
      url: urlString,
      method: method as any,
      headers,
      ...(bodyString !== undefined ? { body: bodyString } : {}),
    });

    const responseBody =
      res.status === 204 || res.status === 205 || res.status === 304
        ? null
        : res.body;

    return new Response(responseBody, {
      status: res.status,
      headers: new Headers(res.headers),
    });
  };

  return () => {
    globalThis.fetch = originalFetch;
  };
}

// Builds a Synapse client for calibration using WebSocket RPC and session key
export async function createSynapseClient(sessionPrivateKey: Hex, ownerAddress: Address): Promise<Synapse> {
  const chain = calibration;
  const rpcUrl = DEFAULT_CALIBRATION_WS_RPC;
  const transport = webSocket(rpcUrl);

  const sessionKey = fromSecp256k1({
    privateKey: sessionPrivateKey,
    root: getAddress(ownerAddress),
    chain,
    transport,
  });
  await sessionKey.syncExpirations();

  const resolved = transport({ chain, retryCount: 0 });
  const customTransport = custom({ request: resolved.request });

  return await Synapse.create({
    account: getAddress(ownerAddress),
    chain,
    source: 'buzz-vault',
    transport: customTransport,
    sessionKey,
    requiredPermissions: [],
  });
}

// Uploads encrypted CAR bytes to Filecoin Calibration via Synapse SDK through the host fetch shim
export async function uploadArchiveWithSynapse(
  carBytes: Uint8Array,
  options: SynapseUploadOptions
): Promise<RealUploadResult> {
  const uninstallShim = installHostFetchShim(options.host);
  try {
    const synapse = await createSynapseClient(
      options.sessionPrivateKey,
      options.ownerAddress
    );

    let recordedTxHash: string | undefined;

    const result = await synapse.storage.upload(carBytes, {
      copies: options.copies ?? 2,
      pieceMetadata: options.metadata,
      callbacks: {
        onProgress: options.onProgress,
        onPiecesAdded: (tx) => {
          recordedTxHash = tx;
        },
      },
    });

    const pieceCid = result.pieceCid.toString();
    const successfulCopies = result.copies.filter(
      (c) => c && c.providerId !== undefined
    );

    const dataSetId = successfulCopies[0]?.dataSetId?.toString();
    const providers = successfulCopies.map((c) => c.providerId.toString());
    const retrievalUrls = successfulCopies.map((c) => c.retrievalUrl).filter(Boolean);

    return {
      pieceCid,
      dataSetId,
      txHash: recordedTxHash,
      providers,
      retrievalUrls,
      proofStatus: 'upload accepted, proving pending',
    };
  } finally {
    uninstallShim();
  }
}
