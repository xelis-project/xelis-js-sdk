export interface GetInfoResult {
  block_time_target: number
  difficulty: number
  height: number
  mempool_size: number
  circulating_supply: number
  maximum_supply: number
  stableheight: number
  top_block_hash: string
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
  miner: string
  nonce: number
  tips: string[]
  topoheight: number
  total_fees: number // is null if include_txs is false
  total_size_in_bytes: number
  transactions?: Transaction[] // if include_txs is true in params
  txs_hashes: string[]
  version: number
}

export interface GetLastBalanceParams {
  address: string
  asset: string
}

export interface GetBalanceAtTopoHeightParams {
  address: string
  asset: string
  topoheight: number
}

export interface GetNonceParams {
  address: string
  topoheight: number
}

export interface GetNonceResult {
  nonce: number
  previous_topoheight: number
  topoheight: number
}

export interface Balance {
  balance: number
  previous_topoheight: number
}

export interface GetLastBalanceResult {
  topoheight: number
  balance: Balance
}

export interface P2PStatusResult {
  peer_count: number
  tag?: string
  peer_id: number
  our_topoheight: number
  best_topoheight: number
  max_peers: number
}

export interface TopoHeightRangeParams {
  start_topoheight?: number
  end_topoheight?: number
}

export interface HeightRangeParams {
  start_height?: number
  end_height?: number
}

export interface RPCEventResult {
  event: string
}

export interface Peer {
  id: number
  addr: string
  tag: string
  version: string
  top_block_hash: string
  topoheight: number
  height: number
  last_ping: number
  pruned_topoheight: number
  peers: string[]
  cumulative_difficulty: number
}

export interface BlockOrdered {
  topoheight: number
  block_hash: string
  block_type: string
}

export interface Transfer {
  amount: number
  asset: string
  extra_data?: any
  to: string
}

export interface TransactionData {
  transfers: Transfer[]
  burn: {
    asset: string
    amount: number
  }
  call_contract: {
    contract: string
    // assets
    // params
  }
  deploy_contract: string
}

export interface Transaction {
  hash: string
  blocks: string[]
  data: TransactionData
  fee: number
  nonce: number
  owner: string
  signature: string
  first_seen?: number
}

export interface GetAccountsParams {
  skip?: number
  maximum?: number
  minimum_topoheight?: number
  maximum_topoheight?: number
}

export interface GetBlockAtTopoHeightParams {
  topoheight: number
  include_txs?: boolean
}

export interface GetBlocksAtHeightParams {
  height: number
  include_txs?: boolean
}

export interface GetBlockByHashParams {
  hash: string
  include_txs?: boolean
}

export interface GetTopBlockParams {
  include_txs?: boolean
}

export interface GetAccountHistoryParams {
  address: string
  asset?: string
  minimum_topoheight?: number
  maximum_topoheight?: number
}

export interface AccounHistory {
  topoheight: number
  block_timestamp: number
  hash: string
  mining?: { reward: number }
  burn?: { amount: number }
  outgoing?: { amount: number }
  incoming?: { amount: number }
}

export interface PeerPeerListUpdated {
  peer_id: number
  peerlist: string[]
}

export interface PeerPeerDisconnected {
  peer_id: number
  peer_addr: string
}

export interface DevFee {
  fee_percentage: number
  height: number
}

export interface DiskSize {
  size_bytes: number
  size_formatted: string
}

export enum RPCMethod {
  GetVersion = 'get_version',
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
  CountAssets = 'count_assets',
  CountTransactions = 'count_transactions',
  GetTips = 'get_tips',
  P2PStatus = 'p2p_status',
  GetDAGOrder = 'get_dag_order',
  GetMempool = 'get_mempool',
  GetTransaction = 'get_transaction',
  GetTransactions = 'get_transactions',
  GetBlocksRangeByTopoheight = 'get_blocks_range_by_topoheight',
  GetBlocksRangeByHeight = 'get_blocks_range_by_height',
  GetAccounts = 'get_accounts',
  SubmitBlock = 'submit_block',
  SubmitTransaction = 'submit_transaction',
  CountAccounts = 'count_accounts',
  GetAccountHistory = 'get_account_history',
  GetAccountAssets = 'get_account_assets',
  GetPeers = 'get_peers',
  GetDevFeeThresholds = 'get_dev_fee_thresholds',
  GetSizeOnDisk = 'get_size_on_disk'
}

export enum RPCEvent {
  NewBlock = `NewBlock`,
  TransactionAddedInMempool = `TransactionAddedInMempool`,
  TransactionExecuted = `TransactionExecuted`,
  BlockOrdered = `BlockOrdered`,
  PeerConnected = `PeerConnected`,
  PeerDisconnected = `PeerDisconnected`,
  PeerPeerListUpdated = `PeerPeerListUpdated`,
  PeerPeerDisconnected = `PeerPeerDisconnected`,
  PeerStateUpdated = `PeerStateUpdated`
}