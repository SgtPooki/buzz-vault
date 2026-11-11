import type { Host, HostByteSend, HostRequest, HostRequestOnceOptions, HostResponse } from '@buzz/author';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installHostFetchShim } from '../src/upload.js';

describe('upload module - fetch shim', () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('routes JSON POST and binary PUT through host with correct sequence', async () => {
    const requestedCalls: HostRequest[] = [];
    const sentBytesCalls: Array<{ bytes: Uint8Array; input: HostByteSend; options: HostRequestOnceOptions }> = [];

    const mockHost: Host = {
      request: vi.fn().mockImplementation(async (req: HostRequest) => {
        requestedCalls.push(req);
        if (req.url.endsWith('/pdp/piece')) {
          return {
            status: 200,
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ uploadUrl: 'https://sp-calib.example.com/pdp/piece/upload/123' }),
          } as HostResponse;
        }
        return { status: 200, headers: {}, body: 'OK' } as HostResponse;
      }),
      sendBytesOnce: vi.fn().mockImplementation(async (bytes: Uint8Array, input: HostByteSend, options: HostRequestOnceOptions) => {
        sentBytesCalls.push({ bytes, input, options });
        return {
          status: 204,
          headers: {},
          body: '',
        } as HostResponse;
      }),
    };

    const declaredOrigins = ['https://declared-api.example.com'];
    const uninstall = installHostFetchShim(mockHost, declaredOrigins);

    try {
      // 1. JSON POST to non-declared SP origin routes to host.request
      const jsonRes = await fetch('https://sp-calib.example.com/pdp/piece', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size: 2048 }),
      });

      expect(jsonRes.status).toBe(200);
      const jsonData = await jsonRes.json();
      expect(jsonData.uploadUrl).toBe('https://sp-calib.example.com/pdp/piece/upload/123');
      expect(mockHost.request).toHaveBeenCalledTimes(1);
      expect(requestedCalls[0]).toEqual({
        url: 'https://sp-calib.example.com/pdp/piece',
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ size: 2048 }),
      });

      // 2. Binary PUT to non-declared SP upload URL routes to host.sendBytesOnce
      const payloadBytes = new Uint8Array([0xca, 0xfe, 0xba, 0xbe]);
      const uploadRes = await fetch('https://sp-calib.example.com/pdp/piece/upload/123', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/vnd.ipld.car' },
        body: payloadBytes,
      });

      expect(uploadRes.status).toBe(204);
      expect(mockHost.sendBytesOnce).toHaveBeenCalledTimes(1);
      expect(sentBytesCalls[0].bytes).toEqual(payloadBytes);
      expect(sentBytesCalls[0].input).toEqual({
        url: 'https://sp-calib.example.com/pdp/piece/upload/123',
        method: 'PUT',
        contentType: 'application/vnd.ipld.car',
      });
      expect(sentBytesCalls[0].options.callId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    } finally {
      uninstall();
    }

    // After uninstall, original fetch is restored
    expect(globalThis.fetch).toBe(originalFetch);
  });

  it('bypasses host shim for declared origins and passes through to native fetch', async () => {
    const mockHost: Host = {
      request: vi.fn(),
      sendBytesOnce: vi.fn(),
    };

    const nativeFetchMock = vi.fn().mockResolvedValue(new Response('native-response', { status: 200 }));
    globalThis.fetch = nativeFetchMock;

    const declaredOrigins = ['https://declared.example.com'];
    const uninstall = installHostFetchShim(mockHost, declaredOrigins);

    try {
      const res = await fetch('https://declared.example.com/data');
      expect(res.status).toBe(200);
      expect(await res.text()).toBe('native-response');
      expect(nativeFetchMock).toHaveBeenCalled();
      expect(mockHost.request).not.toHaveBeenCalled();
      expect(mockHost.sendBytesOnce).not.toHaveBeenCalled();
    } finally {
      uninstall();
    }
  });

  it('throws error when host does not support sendBytesOnce on binary upload', async () => {
    const mockHost: Host = {
      request: vi.fn(),
    };

    const uninstall = installHostFetchShim(mockHost, []);
    try {
      await expect(
        fetch('https://sp.example.com/upload', {
          method: 'PUT',
          body: new Uint8Array([1, 2, 3]),
        })
      ).rejects.toThrow('Host does not support sendBytesOnce primitive');
    } finally {
      uninstall();
    }
  });
});

it('fetch shim passes non-HTTP schemes (Tauri IPC) to native fetch', async () => {
  const { installHostFetchShim } = await import('../src/upload');
  const native = globalThis.fetch;
  const calls: string[] = [];
  globalThis.fetch = (async (input: any) => { calls.push(String(input)); return new Response('ok'); }) as any;
  const host: any = { request: async () => { throw new Error('must not route ipc'); }, sendBytesOnce: async () => { throw new Error('must not route ipc'); } };
  const uninstall = installHostFetchShim(host, []);
  try {
    await fetch('ipc://localhost/plugin_host_request', { method: 'POST', body: new Uint8Array([1]) });
    expect(calls).toEqual(['ipc://localhost/plugin_host_request']);
  } finally {
    uninstall();
    globalThis.fetch = native;
  }
});

it('fetch shim sends a bodiless Request through host.request and a Blob PUT through sendBytesOnce', async () => {
  const { installHostFetchShim } = await import('../src/upload');
  const native = globalThis.fetch;
  const requests: any[] = [];
  const sends: any[] = [];
  const host: any = {
    request: async (r: any) => { requests.push(r); return { status: 201, headers: { Location: '/pdp/piece/uploads/abc' }, body: '' }; },
    sendBytesOnce: async (b: Uint8Array, s: any) => { sends.push({ len: b.length, ...s }); return { status: 204, headers: {}, body: '' }; },
  };
  const uninstall = installHostFetchShim(host, []);
  try {
    const created = await fetch(new Request('https://sp.example/pdp/piece/uploads', { method: 'POST' }));
    expect(created.status).toBe(201);
    expect(requests[0]).toMatchObject({ method: 'POST', url: 'https://sp.example/pdp/piece/uploads' });
    expect(requests[0].body).toBeUndefined();
    const put = await fetch('https://sp.example/pdp/piece/uploads/abc', { method: 'PUT', body: new Blob([new Uint8Array([1, 2, 3])]), headers: { 'Content-Type': 'application/octet-stream' } });
    expect(put.status).toBe(204);
    expect(sends[0]).toMatchObject({ len: 3, method: 'PUT', contentType: 'application/octet-stream' });
    await fetch('https://sp.example/pdp/piece/uploads/abc', { method: 'POST', body: '{"pieceCid":"x"}', headers: { 'Content-Type': 'application/json' } });
    expect(requests[1].body).toBe('{"pieceCid":"x"}');
    expect(sends).toHaveLength(1);
  } finally {
    uninstall();
    globalThis.fetch = native;
  }
});
