import {
  AddPiecesPermission,
  CreateDataSetPermission,
  getExpirations,
} from '@filoz/synapse-core/session-key'
import {
  encodeAbiParameters,
  isAddress,
  toEventSelector,
  type Address,
  type Hex,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildAuthorizeUrl,
  clearSession,
  generateSessionKeypair,
  loadSession,
  parseSessionEnv,
  saveSession,
  STORAGE_KEY,
  watchAuthorization,
  type VaultSession,
  type WatchAuthorizationOptions,
  type WatchAuthorizationProgressEvent,
} from '../src/connect.js'

// Mock getExpirations while preserving original session-key exports
vi.mock('@filoz/synapse-core/session-key', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@filoz/synapse-core/session-key')>()
  return { ...actual, getExpirations: vi.fn() }
})

const OWNER: Address = '0x00000000000000000000000000000000000000aa'
const OTHER_OWNER: Address = '0x00000000000000000000000000000000000000ab'
const SESSION: Address = '0x00000000000000000000000000000000000000bb'
const OTHER_SESSION: Address = '0x00000000000000000000000000000000000000cc'
const REGISTRY: Address = '0x518411c2062E119Aaf7A8B12A2eDf9a939347655'
const FUTURE = BigInt(Math.floor(Date.now() / 1000) + 86400)
const LATER = FUTURE + 3600n

const TOPIC = toEventSelector('AuthorizationsUpdated(address,address,uint256,bytes32[],string)')

function authorizationLog(identity: Address, signer: Address, permissions: Hex[]): Record<string, unknown> {
  const data = encodeAbiParameters(
    [{ type: 'address' }, { type: 'uint256' }, { type: 'bytes32[]' }, { type: 'string' }],
    [signer, FUTURE, permissions, 'buzz-vault']
  )
  return {
    address: REGISTRY,
    topics: [TOPIC, `0x000000000000000000000000${identity.slice(2)}`],
    data,
    blockNumber: '0x50',
    transactionHash: `0x${'1'.repeat(64)}`,
    transactionIndex: '0x0',
    blockHash: `0x${'2'.repeat(64)}`,
    logIndex: '0x0',
    removed: false,
  }
}

function createFakeClient(schedule: (Record<string, unknown>[] | Error)[], head = '0x64') {
  const calls: { method: string; params?: unknown }[] = []
  let call = 0
  const client = {
    request: vi.fn(async (args: { method: string; params?: unknown }) => {
      calls.push(args)
      if (args.method === 'eth_blockNumber') return head
      if (args.method === 'eth_getLogs') {
        const answer = schedule[Math.min(call, schedule.length - 1)] ?? []
        call += 1
        if (answer instanceof Error) throw answer
        return answer
      }
      throw new Error(`unexpected ${args.method}`)
    }),
  }
  return { client: client as any, calls }
}

async function runWatch(options: WatchAuthorizationOptions) {
  const pending = watchAuthorization(options)
  pending.catch(() => undefined)
  await vi.runAllTimersAsync()
  return pending
}

describe('connect module', () => {
  describe('keypair generation', () => {
    it('produces valid secp256k1 key and matching address', () => {
      const pair = generateSessionKeypair()
      expect(pair.privateKey).toMatch(/^0x[0-9a-fA-F]{64}$/)
      expect(isAddress(pair.address)).toBe(true)
      const derived = privateKeyToAccount(pair.privateKey)
      expect(derived.address).toBe(pair.address)
    })

    it('generates distinct keys across calls', () => {
      const pair1 = generateSessionKeypair()
      const pair2 = generateSessionKeypair()
      expect(pair1.privateKey).not.toBe(pair2.privateKey)
      expect(pair1.address).not.toBe(pair2.address)
    })
  })

  describe('buildAuthorizeUrl', () => {
    it('produces valid calibration URL with lowercased address and correct parameters', () => {
      const sessionAddr = '0xABCDEF1234567890abcdef1234567890ABCDEF12'
      const url = buildAuthorizeUrl('https://pay.filecoin.cloud', sessionAddr)
      expect(url).toBe(
        'https://pay.filecoin.cloud/console/setup?authorize=0xabcdef1234567890abcdef1234567890abcdef12&scopes=createDataSet,addPieces&network=calibration&utm_source=buzz-vault'
      )
    })

    it('strips trailing slashes from console base URL', () => {
      const sessionAddr = '0x00000000000000000000000000000000000000bb'
      const url = buildAuthorizeUrl('https://pay.filecoin.cloud/', sessionAddr)
      expect(url).toBe(
        'https://pay.filecoin.cloud/console/setup?authorize=0x00000000000000000000000000000000000000bb&scopes=createDataSet,addPieces&network=calibration&utm_source=buzz-vault'
      )
    })

    it('supports custom scopes and network', () => {
      const sessionAddr = '0x00000000000000000000000000000000000000bb'
      const url = buildAuthorizeUrl('https://pay.filecoin.cloud', sessionAddr, ['createDataSet'], 314)
      expect(url).toBe(
        'https://pay.filecoin.cloud/console/setup?authorize=0x00000000000000000000000000000000000000bb&scopes=createDataSet&network=mainnet&utm_source=buzz-vault'
      )
    })

    it('supports shorthand invocation with address only', () => {
      const sessionAddr = '0x1234567890123456789012345678901234567890'
      const url = buildAuthorizeUrl(sessionAddr)
      expect(url).toBe(
        'https://pay.filecoin.cloud/console/setup?authorize=0x1234567890123456789012345678901234567890&scopes=createDataSet,addPieces&network=calibration&utm_source=buzz-vault'
      )
    })
  })

  describe('watchAuthorization', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.mocked(getExpirations).mockReset()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('finds owner from matching event and returns granted status', async () => {
      const { client } = createFakeClient([
        [],
        [authorizationLog(OTHER_OWNER, OTHER_SESSION, []), authorizationLog(OWNER, SESSION, [])],
      ])
      vi.mocked(getExpirations).mockResolvedValue({
        [CreateDataSetPermission]: FUTURE,
        [AddPiecesPermission]: LATER,
      })
      const progress: WatchAuthorizationProgressEvent[] = []

      const result = await runWatch({
        client,
        sessionAddress: SESSION,
        registryAddress: REGISTRY,
        permissions: [CreateDataSetPermission, AddPiecesPermission],
        fromBlock: 42n,
        deadlineMs: 2000,
        pollIntervalMs: 1,
        onProgress: (p) => progress.push(p),
      })

      expect(result.status).toBe('granted')
      expect(result.owner?.toLowerCase()).toBe(OWNER.toLowerCase())
      expect(result.expiry).toBe(LATER)
      expect(result.granted).toEqual([CreateDataSetPermission, AddPiecesPermission])
      expect(result.missing).toEqual([])
      expect(progress.some((e) => e.type === 'watch:ownerFound' && e.data.owner.toLowerCase() === OWNER.toLowerCase())).toBe(true)
    })

    it('returns partial status when only some scopes are active', async () => {
      const { client } = createFakeClient([[authorizationLog(OWNER, SESSION, [])]])
      vi.mocked(getExpirations).mockResolvedValue({
        [CreateDataSetPermission]: FUTURE,
        [AddPiecesPermission]: 0n,
      })

      const result = await runWatch({
        client,
        sessionAddress: SESSION,
        registryAddress: REGISTRY,
        permissions: [CreateDataSetPermission, AddPiecesPermission],
        fromBlock: 42n,
        deadlineMs: 2000,
        pollIntervalMs: 1,
      })

      expect(result.status).toBe('partial')
      expect(result.owner?.toLowerCase()).toBe(OWNER.toLowerCase())
      expect(result.granted).toEqual([CreateDataSetPermission])
      expect(result.missing).toEqual([AddPiecesPermission])
    })

    it('returns timeout status when no authorization event appears before deadline', async () => {
      const { client } = createFakeClient([[]])

      const result = await runWatch({
        client,
        sessionAddress: SESSION,
        registryAddress: REGISTRY,
        permissions: [CreateDataSetPermission, AddPiecesPermission],
        fromBlock: 42n,
        deadlineMs: 20,
        pollIntervalMs: 5,
      })

      expect(result.status).toBe('timeout')
      expect(result.owner).toBeUndefined()
      expect(result.granted).toEqual([])
      expect(result.missing).toEqual([CreateDataSetPermission, AddPiecesPermission])
    })

    it('handles renewal flow directly when owner is provided', async () => {
      const { client } = createFakeClient([])
      vi.mocked(getExpirations).mockResolvedValue({
        [CreateDataSetPermission]: FUTURE,
        [AddPiecesPermission]: FUTURE,
      })

      const result = await runWatch({
        client,
        sessionAddress: SESSION,
        registryAddress: REGISTRY,
        permissions: [CreateDataSetPermission, AddPiecesPermission],
        owner: OWNER,
        deadlineMs: 2000,
        pollIntervalMs: 1,
      })

      expect(result.status).toBe('granted')
      expect(result.owner?.toLowerCase()).toBe(OWNER.toLowerCase())
    })
  })

  describe('session storage helpers', () => {
    const memory = new Map<string, string>()

    beforeEach(() => {
      memory.clear()
      const mockStorage = {
        getItem: (k: string) => memory.get(k) ?? null,
        setItem: (k: string, v: string) => memory.set(k, String(v)),
        removeItem: (k: string) => memory.delete(k),
        clear: () => memory.clear(),
        key: (i: number) => Array.from(memory.keys())[i] ?? null,
        get length() {
          return memory.size
        },
      }
      vi.stubGlobal('localStorage', mockStorage)
    })

    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('saves, loads, and clears session correctly', () => {
      const session: VaultSession = {
        sessionPrivateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        sessionAddress: '0x00000000000000000000000000000000000000bb',
        ownerAddress: '0x00000000000000000000000000000000000000aa',
        expiry: 1700000000,
        network: 'calibration',
      }

      expect(loadSession()).toBeNull()
      saveSession(session)
      expect(memory.has(STORAGE_KEY)).toBe(true)

      const loaded = loadSession()
      expect(loaded).toEqual(session)

      clearSession()
      expect(loadSession()).toBeNull()
      expect(memory.has(STORAGE_KEY)).toBe(false)
    })

    it('returns null on invalid or corrupted session data', () => {
      memory.set(STORAGE_KEY, 'not-json')
      expect(loadSession()).toBeNull()

      memory.set(STORAGE_KEY, JSON.stringify({ invalid: true }))
      expect(loadSession()).toBeNull()
    })

    it('parses session.env text and extracts correct credentials', () => {
      const envText = `
# Exported session
SESSION_KEY="0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
WALLET_ADDRESS=0x44f08D1beFe61255b3C3A349C392C560FA333759
NETWORK=calibration
SCOPES=createDataSet,addPieces,encrypt
      `
      const parsed = parseSessionEnv(envText)
      expect(parsed.sessionPrivateKey).toBe('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef')
      expect(parsed.ownerAddress).toBe('0x44f08D1beFe61255b3C3A349C392C560FA333759')
      expect(parsed.network).toBe('calibration')
      expect(parsed.sessionAddress).toBeDefined()
    })

    it('throws error when required fields are missing or network is invalid', () => {
      expect(() => parseSessionEnv('NETWORK=calibration')).toThrow('Missing SESSION_KEY')
      expect(() =>
        parseSessionEnv(
          'SESSION_KEY=0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef\nNETWORK=calibration'
        )
      ).toThrow('Missing WALLET_ADDRESS')
      expect(() =>
        parseSessionEnv(
          'SESSION_KEY=0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef\nWALLET_ADDRESS=0x44f08D1beFe61255b3C3A349C392C560FA333759\nNETWORK=mainnet'
        )
      ).toThrow('Expected NETWORK=calibration')
    })
  })
})
