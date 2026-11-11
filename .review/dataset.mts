import { createPublicClient, http } from 'viem';
import { calibration } from '@filoz/synapse-sdk';
const client = createPublicClient({ chain: calibration as any, transport: http() });
const c: any = (calibration as any).contracts;
console.log(Object.keys(c));
const verifier = c.pdp.address;
const abi = [
  { name: 'getNextPieceId', type: 'function', stateMutability: 'view', inputs: [{ name: 'setId', type: 'uint256' }], outputs: [{ type: 'uint256' }] },
  { name: 'getActivePieceCount', type: 'function', stateMutability: 'view', inputs: [{ name: 'setId', type: 'uint256' }], outputs: [{ type: 'uint256' }] },
  { name: 'getDataSetLeafCount', type: 'function', stateMutability: 'view', inputs: [{ name: 'setId', type: 'uint256' }], outputs: [{ type: 'uint256' }] },
] as const;
for (const fn of ['getNextPieceId', 'getActivePieceCount', 'getDataSetLeafCount'] as const) {
  try { console.log(fn, (await client.readContract({ address: verifier, abi, functionName: fn, args: [52644n] })).toString()); } catch (e: any) { console.log(fn, 'err', e.shortMessage ?? e.message); }
}
console.log('block', (await client.getBlockNumber()).toString(), 'verifier', verifier);
