import { sessionKeyRegistry } from '@filoz/synapse-core/abis'
import { calibration } from '@filoz/synapse-core/chains'
import {
  AddPiecesPermission,
  CreateDataSetPermission,
  extractLoginEvent,
  getExpirations,
  type Expirations,
  type Permission,
} from '@filoz/synapse-core/session-key'
import {
  type Address,
  type Chain,
  type Client,
  createPublicClient,
  getAbiItem,
  getAddress,
  type Hex,
  isAddressEqual,
  type Log,
  type PublicClient,
  toEventSelector,
  type Transport,
  webSocket,
} from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

export const DEFAULT_CONSOLE_URL = 'https://pay.filecoin.cloud'
export const DEFAULT_CHAIN_ID = 314159
export const DEFAULT_SCOPES = ['createDataSet', 'addPieces']
export const DEFAULT_CALIBRATION_WS_RPC = 'wss://wss.calibration.node.glif.io/apigw/lotus/rpc/v1'
export const DEFAULT_WATCH_DEADLINE_MS = 5 * 60 * 1000
export const DEFAULT_WATCH_INTERVAL_MS = 5000
export const MAX_CONSECUTIVE_POLL_FAILURES = 3
export const STORAGE_KEY = 'buzz-vault:session:v1'

export const CONSOLE_NETWORK_SLUG: Record<number, string> = {
  314: 'mainnet',
  314159: 'calibration',
}

const AUTHORIZATIONS_UPDATED_TOPIC = toEventSelector(
  getAbiItem({ abi: sessionKeyRegistry, name: 'AuthorizationsUpdated' })
)

export interface SessionKeypair {
  privateKey: Hex
  address: Address
}

export interface VaultSession {
  sessionPrivateKey: Hex
  sessionAddress: Address
  ownerAddress: Address
  expiry: number
  network: 'calibration'
}

export type WatchAuthorizationProgressEvent =
  | { type: 'watch:tick'; data: { remainingMs: number } }
  | { type: 'watch:ownerFound'; data: { owner: Address } }
  | { type: 'watch:error'; data: { error: unknown } }

export interface WatchAuthorizationOptions {
  client?: Client<Transport, Chain, any, any, any>
  sessionAddress: Address
  registryAddress?: Address
  permissions?: readonly Permission[]
  fromBlock?: bigint
  owner?: Address
  deadlineMs?: number
  pollIntervalMs?: number
  onProgress?: (event: WatchAuthorizationProgressEvent) => void
}

export interface ScopeGrants {
  status: 'granted' | 'partial' | 'none'
  owner: Address
  expiry?: bigint
  granted: Permission[]
  missing: Permission[]
}

export interface WatchAuthorizationResult {
  status: 'granted' | 'partial' | 'none' | 'timeout'
  owner?: Address
  expiry?: bigint
  granted: Permission[]
  missing: Permission[]
}

interface WatchState {
  owner: Address | undefined
  eventSeen: boolean
  last: WatchAuthorizationResult
  anySuccess: boolean
  consecutiveFailures: number
  lastError: unknown
}

// Generates a fresh secp256k1 keypair using viem
export function generateSessionKeypair(): SessionKeypair {
  const privateKey = generatePrivateKey()
  const account = privateKeyToAccount(privateKey)
  return { privateKey, address: account.address }
}

// Builds the canonical console setup URL with lowercased session address and buzz-vault utm
export function buildAuthorizeUrl(
  consoleUrlOrAddress: string,
  sessionAddress?: string,
  scopeIds: string[] = DEFAULT_SCOPES,
  chainId: number = DEFAULT_CHAIN_ID
): string {
  let consoleUrl = consoleUrlOrAddress
  let address = sessionAddress
  if (!address) {
    address = consoleUrlOrAddress
    consoleUrl = DEFAULT_CONSOLE_URL
  }
  const cleanBase = consoleUrl.replace(/\/+$/, '')
  const network = CONSOLE_NETWORK_SLUG[chainId]
  const networkParam = network ? `&network=${network}` : ''
  const scopesParam = scopeIds.length > 0 ? `&scopes=${scopeIds.join(',')}` : ''
  return `${cleanBase}/console/setup?authorize=${address.toLowerCase()}${scopesParam}${networkParam}&utm_source=buzz-vault`
}

// Creates the default WebSocket public client for calibration testnet
export function createDefaultPublicClient(url = DEFAULT_CALIBRATION_WS_RPC): PublicClient {
  return createPublicClient({
    chain: calibration,
    transport: webSocket(url),
  })
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function classifyScopes(
  permissions: readonly Permission[],
  expirations: Expirations
): Pick<WatchAuthorizationResult, 'granted' | 'missing' | 'expiry'> {
  const now = BigInt(Math.floor(Date.now() / 1000))
  const granted: Permission[] = []
  const missing: Permission[] = []
  let expiry: bigint | undefined
  for (const permission of permissions) {
    const value = expirations[permission] ?? 0n
    if (value > now) {
      granted.push(permission)
      if (expiry === undefined || value > expiry) {
        expiry = value
      }
    } else {
      missing.push(permission)
    }
  }
  return expiry === undefined ? { granted, missing } : { granted, missing, expiry }
}

function grantStatus(scopes: Pick<ScopeGrants, 'granted' | 'missing'>): ScopeGrants['status'] {
  if (scopes.missing.length === 0) return 'granted'
  if (scopes.granted.length === 0) return 'none'
  return 'partial'
}

// Reads scope expirations for owner and determines grant status
export async function readScopeGrants(options: {
  client: Client<Transport, Chain, any, any, any>
  sessionAddress: Address
  registryAddress: Address
  permissions: readonly Permission[]
  owner: Address
}): Promise<ScopeGrants> {
  const expirations = await getExpirations(options.client as any, {
    address: options.owner,
    sessionKeyAddress: options.sessionAddress,
    permissions: [...options.permissions],
    contractAddress: options.registryAddress,
  })
  const scopes = classifyScopes(options.permissions, expirations)
  return { status: grantStatus(scopes), owner: options.owner, ...scopes }
}

async function headBlock(client: Client<Transport, Chain, any, any, any>): Promise<bigint> {
  const result = await (client.request as any)({ method: 'eth_blockNumber' })
  return BigInt(result as string)
}

async function findOwnerInLogs(
  client: Client<Transport, Chain, any, any, any>,
  registryAddress: Address,
  sessionAddress: Address,
  fromBlock: bigint,
  toBlock: bigint
): Promise<{ owner?: Address }> {
  const logs = (await (client.request as any)({
    method: 'eth_getLogs',
    params: [
      {
        address: registryAddress,
        fromBlock: `0x${fromBlock.toString(16)}`,
        toBlock: `0x${toBlock.toString(16)}`,
        topics: [AUTHORIZATIONS_UPDATED_TOPIC],
      },
    ],
  })) as Log[]

  if (!Array.isArray(logs)) return {}

  for (const log of logs) {
    let event: ReturnType<typeof extractLoginEvent>
    try {
      event = extractLoginEvent([log])
    } catch {
      continue
    }
    if (isAddressEqual(event.args.signer, sessionAddress)) {
      return { owner: event.args.identity }
    }
  }
  return {}
}

function isNodeBehind(error: unknown): boolean {
  return /tipset height in future/i.test(error instanceof Error ? error.message : String(error))
}

async function pollOnce(
  options: {
    client: Client<Transport, Chain, any, any, any>
    sessionAddress: Address
    registryAddress: Address
    permissions: readonly Permission[]
    fromBlock?: bigint
    owner?: Address
    onProgress?: (event: WatchAuthorizationProgressEvent) => void
  },
  state: WatchState
): Promise<boolean> {
  const { client, sessionAddress, registryAddress, permissions, fromBlock } = options

  if (state.owner === undefined && fromBlock !== undefined) {
    const head = await headBlock(client)
    if (head < fromBlock) return false
    const scan = await findOwnerInLogs(client, registryAddress, sessionAddress, fromBlock, head)
    if (scan.owner !== undefined) {
      state.owner = scan.owner
      state.eventSeen = true
      options.onProgress?.({ type: 'watch:ownerFound', data: { owner: scan.owner } })
    }
  }

  if (state.owner === undefined) return false

  const grants = await readScopeGrants({
    client,
    sessionAddress,
    registryAddress,
    permissions,
    owner: state.owner,
  })

  state.last = grants.status === 'none' && !state.eventSeen ? { ...grants, status: 'timeout' } : grants
  return grants.status === 'granted' || (state.eventSeen && grants.status !== 'none')
}

async function pollTolerantly(
  options: {
    client: Client<Transport, Chain, any, any, any>
    sessionAddress: Address
    registryAddress: Address
    permissions: readonly Permission[]
    fromBlock?: bigint
    owner?: Address
    onProgress?: (event: WatchAuthorizationProgressEvent) => void
  },
  state: WatchState
): Promise<boolean> {
  try {
    const done = await pollOnce(options, state)
    state.anySuccess = true
    state.consecutiveFailures = 0
    return done
  } catch (error) {
    state.lastError = error
    if (isNodeBehind(error)) {
      state.anySuccess = true
      state.consecutiveFailures = 0
    } else {
      state.consecutiveFailures += 1
    }
    options.onProgress?.({ type: 'watch:error', data: { error } })
    return false
  }
}

function endpointDownError(lastError: unknown): Error {
  const reason = lastError instanceof Error ? lastError.message : String(lastError)
  return new Error(`The RPC endpoint failed ${MAX_CONSECUTIVE_POLL_FAILURES} polls in a row (${reason}).`, {
    cause: lastError,
  })
}

// Polls on-chain registry logs and expirations until authorization is detected or deadline expires
export async function watchAuthorization(
  options: WatchAuthorizationOptions
): Promise<WatchAuthorizationResult> {
  const client = options.client ?? createDefaultPublicClient()
  const registryAddress =
    options.registryAddress ?? (calibration.contracts.sessionKeyRegistry.address as Address)
  const permissions = options.permissions ?? [CreateDataSetPermission, AddPiecesPermission]
  const sessionAddress = options.sessionAddress
  const deadlineMs = options.deadlineMs ?? DEFAULT_WATCH_DEADLINE_MS
  const pollIntervalMs = options.pollIntervalMs ?? DEFAULT_WATCH_INTERVAL_MS
  const deadline = Date.now() + deadlineMs

  let fromBlock = options.fromBlock
  if (options.owner === undefined && fromBlock === undefined) {
    fromBlock = await headBlock(client)
  }

  const state: WatchState = {
    owner: options.owner,
    eventSeen: false,
    last: { status: 'timeout', granted: [], missing: [...permissions] },
    anySuccess: false,
    consecutiveFailures: 0,
    lastError: undefined,
  }

  for (;;) {
    const remainingMs = deadline - Date.now()
    if (remainingMs <= 0) break
    options.onProgress?.({ type: 'watch:tick', data: { remainingMs } })
    if (
      await pollTolerantly(
        {
          client,
          sessionAddress,
          registryAddress,
          permissions,
          fromBlock,
          owner: state.owner,
          onProgress: options.onProgress,
        },
        state
      )
    ) {
      return state.last
    }
    if (state.consecutiveFailures >= MAX_CONSECUTIVE_POLL_FAILURES) {
      throw endpointDownError(state.lastError)
    }
    await sleep(Math.min(pollIntervalMs, Math.max(0, deadline - Date.now())))
  }

  if (!state.anySuccess && state.lastError !== undefined) {
    throw state.lastError
  }
  return state.last
}

function getStorage(): Storage | undefined {
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      return localStorage
    }
  } catch {
    // ignore
  }
  return undefined
}

// Persists the vault session into localStorage
export function saveSession(session: VaultSession): void {
  const storage = getStorage()
  if (!storage) {
    throw new Error('localStorage is not available')
  }
  storage.setItem(STORAGE_KEY, JSON.stringify(session))
}

// Retrieves the vault session from localStorage if present
export function loadSession(): VaultSession | null {
  const storage = getStorage()
  if (!storage) return null
  const raw = storage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const session = JSON.parse(raw) as VaultSession
    if (
      !session ||
      typeof session !== 'object' ||
      typeof session.sessionPrivateKey !== 'string' ||
      typeof session.sessionAddress !== 'string' ||
      typeof session.ownerAddress !== 'string' ||
      typeof session.expiry !== 'number' ||
      session.network !== 'calibration'
    ) {
      return null
    }
    return session
  } catch {
    return null
  }
}

// Clears the stored vault session from localStorage
export function clearSession(): void {
  const storage = getStorage()
  if (!storage) return
  storage.removeItem(STORAGE_KEY)
}

// Parses dotenv-style session.env text into a VaultSession object
export function parseSessionEnv(text: string): VaultSession {
  const lines = text.split('\n')
  const env: Record<string, string> = {}
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx !== -1) {
      const k = trimmed.slice(0, eqIdx).trim().toUpperCase()
      let v = trimmed.slice(eqIdx + 1).trim()
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1)
      }
      env[k] = v
    }
  }

  const sessionKey = (env.SESSION_KEY || env.SESSIONKEY) as Hex
  const walletAddress = (env.WALLET_ADDRESS || env.WALLETADDRESS || env.OWNER_ADDRESS || env.OWNER || env.ACCOUNT) as Address
  const network = (env.NETWORK || 'calibration').toLowerCase()

  if (!sessionKey) {
    throw new Error('Missing SESSION_KEY in session.env')
  }
  if (!walletAddress) {
    throw new Error('Missing WALLET_ADDRESS in session.env')
  }
  if (network !== 'calibration') {
    throw new Error(`Expected NETWORK=calibration, got ${network}`)
  }

  const account = privateKeyToAccount(sessionKey)
  return {
    sessionPrivateKey: sessionKey,
    sessionAddress: account.address,
    ownerAddress: getAddress(walletAddress),
    expiry: 0,
    network: 'calibration',
  }
}

// Tries reading session.env from standard filecoin-pin config directories via host.readFile
export async function tryReadHostSessionEnv(host?: { readFile?: (path: string) => Promise<Uint8Array> }): Promise<VaultSession | null> {
  if (!host?.readFile) return null;
  const paths = [
    '~/Library/Application Support/filecoin-pin/session.env',
    '~/.config/filecoin-pin/session.env',
  ];
  for (const p of paths) {
    try {
      const bytes = await host.readFile(p);
      if (bytes && bytes.length > 0) {
        const text = new TextDecoder().decode(bytes);
        return parseSessionEnv(text);
      }
    } catch {
      // Continue to next candidate path
    }
  }
  return null;
}


