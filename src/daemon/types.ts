export interface RPCRequest {
  id: number
  jsonrpc: string
  method: string
  params: string
}

export interface RPCError {
  code: number
  message: string
}

export interface RPCResponse<T> {
  id: number
  result: T
  error: RPCError
}

export interface GetInfoResult {
  block_time_target: number
  difficulty: number
  height: number
  mempool_size: number
  native_supply: number
  stableheight: number
  top_hash: string
  version: string
  network: string
  topoheight: number
}

export interface NewBlockResult {
  block_type: string
  cumulative_difficulty: number
  difficulty: number
  event: string
  extra_nonce: string
  hash: string
  height: number
  miner: string
  nonce: number
  reward: number
  supply: number
  timestamp: number
  tips: string[]
  topoheight: number
  total_fees: number
  total_size_in_bytes: number
  txs_hashes: string[]
}
