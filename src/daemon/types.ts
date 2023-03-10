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

export interface Block {
  block_type: string
  cumulative_difficulty: number
  supply: number
  difficulty: number
  reward: number
  extra_nonce: string
  hash: string
  height: number
  miner_tx: {
    owner: string
    signature: null
    variant: string
  }
  miner: string
  nonce: number
  tips: string[]
  topoheight: number
  total_fees: number
  total_size_in_bytes: number
  txs_hashes: string[]
}

export interface BalanceParams {
  address: string
  asset: string
}

export interface Balance {
  balance: number
  previous_topoheight: number
}

export interface GetLastBalanceResult {
  topoheight: number,
  balance: Balance
}

export interface P2PStatusResult {
  best_height: number
  max_peers: number
  our_height: number
  peer_count: number
  peer_id: number
  tag?: string
}

export interface TopoHeightStartEndParams {
  start_topoheight?: number
  end_topoheight?: number
}

export interface RPCEventResult {
  event: string
}

export interface Transaction {
  hash: string
  blocks: string[],
  data: {
    Transfer: {
      amount: number
      asset: string
      extra_data: any
      to: string
    }[]
  }
  fee: number
  nonce: number
  owner: string
  signature: string
}

export enum RPCMethod {
  GetInfo = 'get_info',
  GetHeight = 'get_height',
  GetTopoHeight = 'get_topoheight',
  GetStableHeight = 'get_stableheight',
  GetBlockTemplate = 'get_block_template',
  GetBlockAtTopoHeight = 'get_block_at_topoheight',
  GetBlocksAtHeight = 'get_blocks_at_height',
  GetBlockByHash = 'get_block_by_hash',
  GetTopBlock = 'get_top_block',
  GetNonce = 'get_nonce',
  GetLastBalance = 'get_last_balance',
  GetBalanceAtTopoHeight = 'get_balance_at_topoheight',
  GetAssets = 'get_assets',
  CountTransactions = 'count_transactions',
  GetTips = 'get_tips',
  P2PStatus = 'p2p_status',
  GetDAGOrder = 'get_dag_order',
  GetMempool = 'get_mempool',
  GetTransaction = 'get_transaction',
  GetTransactions = 'get_transactions',
  GetBlocks = 'get_blocks'
}

export enum RPCEvent {
  NewBlock = `NewBlock`,
  TransactionAddedInMempool = `TransactionAddedInMempool`,
  TransactionExecuted = `TransactionExecuted`,
  BlockOrdered = `BlockOrdered`,
}