export interface GetInfoResult {
  height: number
  topoheight: number
  stableheight: number
  pruned_topoheight?: number
  top_block_hash: string
  circulating_supply: number
  burned_supply: number
  maximum_supply: number
  difficulty: string
  block_time_target: number // in seconds
  average_block_time: number
  block_reward: number
  dev_reward: number
  miner_reward: number
  mempool_size: number
  version: string
  network: string
}

export interface Block {
  hash: string
  topoheight?: number
  block_type: BlockType
  difficulty: string
  supply?: number
  reward?: number
  dev_reward?: number
  miner_reward?: number
  cumulative_difficulty: string
  total_fees?: number // is null if include_txs is false
  total_size_in_bytes: number
  version: number
  tips: string[]
  timestamp: number // in milliseconds
  height: number
  nonce: number
  extra_nonce: string
  miner: string
  txs_hashes: string[]
  transactions?: Transaction[] // if include_txs is true in params
}

export interface GetBalanceParams {
  address: string
  asset: string
}

export interface GetBalanceAtTopoheightParams {
  address: string
  asset: string
  topoheight: number
}

export interface GetStableBalanceResult {
  stable_topoheight: number
  stable_block_hash: string
  version: VersionedBalance
}

export interface GetNonceParams {
  address: string
}

export interface VersionedNonce {
  nonce: number
  previous_topoheight?: number
}

export interface GetNonceResult {
  version: VersionedNonce
  topoheight: number
}

export interface GetNonceAtTopoheightParams {
  address: string
  topoheight: number
}

export interface EncryptedBalance {
  commitment: number[]
  handle: number[]
}

export enum BalanceType {
  Input = `input`,
  Output = `output`,
  Both = `both`
}

export interface VersionedBalance {
  balance_type: BalanceType
  final_balance: EncryptedBalance
  output_balance?: EncryptedBalance
  previous_topoheight?: number
}

export interface GetBalanceResult {
  version: VersionedBalance
  topoheight: number
}

export interface P2PStatusResult {
  peer_count: number
  tag?: string
  peer_id: string
  our_topoheight: number
  best_topoheight: number
  median_topoheight: number
  max_peers: number
}

export interface TopoheightRangeParams {
  start_topoheight?: number
  end_topoheight?: number
}

export interface HeightRangeParams {
  start_height?: number
  end_height?: number
}

export interface TimedDirection {
  in?: { received_at: number }
  out?: { sent_at: number }
  both?: { received_at: number, sent_at: number }
}

export interface Peer {
  id: string
  addr: string
  local_port: number
  tag?: string
  version: string
  top_block_hash: string
  topoheight: number
  height: number
  last_ping: number // in seconds
  pruned_topoheight?: number
  peers: { [addr: string]: TimedDirection }
  cumulative_difficulty: string
  connected_on: number // in seconds
}

export interface BlockOrdered {
  topoheight: number
  block_hash: string
  block_type: string
}

export interface BlockOrphaned {
  block_hash: string
  old_topoheight: number
}

export interface StableHeightChanged {
  previous_stable_height: number
  new_stable_height: number
}

export interface Proof {
  Y_0: number[]
  Y_1: number[]
  z_r: number[]
  z_x: number[]
}

export interface EqProof {
  Y_0: number[]
  Y_1: number[]
  Y_2: number[]
  z_r: number[]
  z_s: number[]
  z_x: number[]
}

export interface Transfer {
  asset: string
  destination: string
  extra_data?: any
  commitment: number[]
  sender_handle: number[]
  receiver_handle: number[]
  ct_validity_proof: Proof
}

export interface Burn {
  asset: string
  amount: number
}

export interface MultiSigPayload {
  participants: string[]
  threshold: number
}

export interface ContractDeposit {
  public: number
  // TODO: private
}

export interface InvokeContractPayload {
  contract: string
  deposits: { [hash: string]: ContractDeposit }
  chunk_id: number
  max_gas: number
  parameters: number[][]
}

export interface InvokeConstructorPayload {
  max_gas: number
  deposits: { [hash: string]: ContractDeposit }
}

export interface DeployContractPayload {
  module: Module
  invoke: InvokeConstructorPayload | null
}

export interface TransactionData {
  transfers: Transfer[] | null
  burn: Burn | null
  multi_sig: MultiSigPayload | null
  invoke_contract: InvokeContractPayload | null
  deploy_contract: DeployContractPayload | null
}

export interface SourceCommitment {
  commitment: number[]
  proof: EqProof
  asset: string
}

export interface Reference {
  hash: string
  topoheight: number
}

export interface Transaction {
  hash: string
  version: number
  source: string
  data: TransactionData
  fee: number
  nonce: number
  source_commitments: SourceCommitment[]
  range_proof: number[]
  reference: Reference
  signature: string
  size: number
}

export interface TransactionExecuted {
  tx_hash: string,
  block_hash: string,
  topoheight: number,
}

export interface GetAssetsParams {
  skip?: number
  maximum?: number
}

export interface GetAccountsParams {
  skip?: number
  maximum?: number
  minimum_topoheight?: number
  maximum_topoheight?: number
}

export interface GetBlockAtTopoheightParams {
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
  incoming_flow?: boolean
  outgoing_flow?: boolean
}

export interface AccountHistory {
  topoheight: number
  hash: string
  block_timestamp: number // in milliseconds
  // AccountHistoryType
  dev_fee?: { reward: number }
  mining?: { reward: number }
  burn?: { amount: number }
  outgoing?: { to: string }
  incoming?: { from: string }
  multi_sig?: {
    participants: string[]
    threshold: number
  }
  invoke_contract?: {
    contract: string
    chunk_id: number
  }
  deploy_contract?: {}
}

export interface PeerPeerListUpdated {
  peer_id: string
  peerlist: string[]
}

export interface PeerPeerDisconnected {
  peer_id: string
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

export interface AssetData {
  topoheight: number
  decimals: number
}

export interface AssetWithData {
  asset: string
  data: AssetData
}

export interface HasBalanceParams {
  address: string
  asset: string
  topoheight?: number
}

export interface HasBalanceResult {
  exists: boolean
}

export interface HasNonceResult {
  exists: boolean
}

export interface IsTxExecutedInBlockParams {
  tx_hash: string
  block_hash: string
}

export interface GetAssetParams {
  asset: string
}

export interface GetPeersResult {
  peers: Peer[]
  total_peers: number
  hidden_peers: number
}

export enum BlockType {
  Sync = 'Sync',
  Normal = 'Normal',
  Side = 'Side',
  Orphaned = 'Orphaned'
}

export interface GetBlockTemplateResult {
  template: string
  height: number
  topoheight: number
  difficulty: string
  algorithm: string
}

export interface HasNonceParams {
  address: string
  topoheight?: number
}

export interface IsAccountRegisteredParams {
  address: string
  in_stable_height: boolean
}

export interface GetMempoolCacheResult {
  min: number
  max: number
  txs: string[]
  balances: Map<string, string>
}

export interface GetDifficultyResult {
  difficulty: string
  hashrate: string
  hashrate_formatted: string
}

export interface ValidateAddressParams {
  address: string
  allow_integrated: boolean
}

export interface ValidateAddressResult {
  is_integrated: boolean
  is_valid: boolean
}

export interface ExtractKeyFromAddressParams {
  address: string
  as_hex: boolean
}

export interface SubmitBlockParams {
  block_template: string
  miner_work?: string
}

export interface GetMinerWorkParams {
  template: string
  address?: string
}

export interface GetMinerWorkResult {
  miner_work: string
  algorithm: string
  height: number
  difficulty: string
  topoheight: number
}

export interface SplitAddressParams {
  address: string
}

export interface SplitAddressResult {
  address: string
  integrated_data: string
}

export interface HardFork {
  height: number
  version: number
  changelog: string
  version_requirement: string | null
}

export interface GetTransactionExecutorResult {
  block_topoheight: number
  block_timestamp: number
  block_hash: string
}

export interface FeeRatesEstimated {
  low: number
  medium: number
  high: number
  default: number
}

export interface MakeIntegratedAddressParams {
  address: string
  integrated_data: any
}

export interface DecryptExtraDataParams {
  shared_key: number[]
  extra_data: number[]
}

export interface GetMutilsigAtTopoheightParams {
  address: string
  topoheight: number
}

export interface HasMultisigAtTopoheightParams {
  address: string
  topoheight: number
}

export interface GetMutilsigAtTopoheightResult {
  state: string
}

export interface GetMultisigParams {
  address: string
}

export interface GetMultisigResult {
  state: string
  topoheight: number
}

export interface HasMultisigParams {
  address: string
  topoheight?: number
}

export interface GetContractOutputsParams {
  transaction: string
}

export interface GetContractModuleParams {
  contract: string
}

export interface GetContractDataPrams {
  contract: string
  key: any
}

export interface GetContractDataAtTopoheightParams {
  contract: string
  key: any
  topoheight: number
}

export interface GetContractBalanceParams {
  contract: string
  asset: string
}

export interface GetContractBalanceAtTopoheightParams {
  contract: string
  asset: string
  topoheight: number
}

export interface Chunk {
  instructions: number[]
}

export type Access = "all" | "internal" | { "hook": { id: number } } | "entry"

export interface Module {
  chunks: (Chunk | Access)[]
  constants: any[]
  entry_chunk_ids: number[]
}

export interface GetContractModuleResult {
  previous_topoheight: number | null
  data: Module | null
}

export interface GetContractDataResult {
  previous_topoheight: number | null
  data: any | null
}

export interface GetContractBalanceAtTopoheightResult {
  data: number
  previous_topoheight: number | null
}

export interface GetContractBalanceResult {
  topoheight: number
  amount: number
  previous_topoheight: number | null
}

export interface ContractOutputRefundGas {
  amount: number
}

export interface ContractOutputTransfer {
  amount: number
  asset: string
  destination: string
}

export interface ContractOutputExitCode {
  exit_code: number
}

export interface ContractOutputRefundDeposits { }

export type ContractOutput =
  | ContractOutputRefundGas
  | ContractOutputTransfer
  | ContractOutputExitCode
  | ContractOutputRefundDeposits

export interface TransactionResponse extends Transaction {
  in_mempool: boolean
  blocks?: string[]
  executed_in_block?: string
  first_seen?: number // in seconds
}

export interface GetMempoolParams {
  maximum?: number
  skip?: number
}

export interface GetMempoolResult {
  total: number
  transactions: TransactionResponse[]
}

export interface MempoolTransactionSummary {
  hash: string
  source: string
  fee: number
  first_seen: number
  size: number
}

export interface GetMempoolSummaryResult {
  total: number
  transactions: MempoolTransactionSummary[]
}

export interface StableTopoHeightChanged {
  previous_stable_topoheight: number
  new_stable_topoheight: number
}

export interface InvokeContractParams {
  contract: string
}
export interface InvokeContract {
  block_hash: string
  tx_hash: string
  topoheight: number
  contract_outputs: ContractOutput[]
}

export interface NewContract {
  contract: string
  block_hash: string
  topoheight: number
}

export interface GetP2pBlockPropagationParams {
  hash: string
  outgoing: boolean
  incoming: boolean
}

export interface P2pBlockPropagationResult {
  peers: { [id: string]: TimedDirection }
  first_seen?: number
  processing_at?: number
}

export interface ContractTransfer {
  asset: string
  amount: number
  block_hash: string
  topoheight: number
}

export interface ContractEvent {
  data: any
}

export enum RPCMethod {
  GetVersion = "get_version",
  GetHeight = "get_height",
  GetTopoheight = "get_topoheight",
  GetPrunedTopoheight = "get_pruned_topoheight",
  GetInfo = "get_info",
  GetDifficulty = "get_difficulty",
  GetTips = "get_tips",
  GetDevFeeThresholds = "get_dev_fee_thresholds",
  GetSizeOnDisk = "get_size_on_disk",

  GetStableHeight = "get_stable_height",
  GetStableTopoheight = "get_stable_topoheight",
  GetHardForks = "get_hard_forks",

  GetBlockAtTopoheight = "get_block_at_topoheight",
  GetBlocksAtHeight = "get_blocks_at_height",
  GetBlockByHash = "get_block_by_hash",
  GetTopBlock = "get_top_block",

  GetBalance = "get_balance",
  GetStableBalance = "get_stable_balance",
  HasBalance = "has_balance",
  GetBalanceAtTopoheight = "get_balance_at_topoheight",

  GetNonce = "get_nonce",
  HasNonce = "has_nonce",
  GetNonceAtTopoheight = "get_nonce_at_topoheight",

  GetAsset = "get_asset",
  GetAssets = "get_assets",

  CountAssets = "count_assets",
  CountAccounts = "count_accounts",
  CountTransactions = "count_transactions",
  CountContracts = "count_contracts",

  SubmitTransaction = "submit_transaction",
  GetTransactionExecutor = "get_transaction_executor",
  GetTransaction = "get_transaction",
  GetTransactions = "get_transactions",
  IsTxExecutedInBlock = "is_tx_executed_in_block",

  P2PStatus = "p2p_status",
  GetPeers = "get_peers",

  GetMempool = "get_mempool",
  GetMempoolSummary = "get_mempool_summary",
  GetMempoolCache = "get_mempool_cache",
  GetEstimatedFeeRates = "get_estimated_fee_rates",

  GetDAGOrder = "get_dag_order",
  GetBlocksRangeByTopoheight = "get_blocks_range_by_topoheight",
  GetBlocksRangeByHeight = "get_blocks_range_by_height",

  GetAccountHistory = "get_account_history",
  GetAccountAssets = "get_account_assets",
  GetAccounts = "get_accounts",
  IsAccountRegistered = "is_account_registered",
  GetAccountRegistrationTopoheight = "get_account_registration_topoheight",

  ValidateAddress = "validate_address",
  SplitAddress = "split_address",
  ExtractKeyFromAddress = "extract_key_from_address",
  MakeIntegratedAddress = "make_integrated_address",
  DecryptExtraData = "decrypt_extra_data",

  GetMultisigAtTopoheight = "get_multisig_at_topoheight",
  GetMultisig = "get_multisig",
  HasMultisig = "has_multisig",
  HasMultisigAtTopoheight = "has_multisig_at_topoheight",

  GetContractOutputs = "get_contract_outputs",
  GetContractModule = "get_contract_module",
  GetContractData = "get_contract_data",
  GetContractDataAtTopoheight = "get_contract_data_at_topoheight",
  GetContractBalance = "get_contract_balance",
  GetContractBalanceAtTopoheight = "get_contract_balance_at_topoheight",
  GetContractAssets = "get_contract_assets",

  GetP2PBlockPropagation = "get_p2p_block_propagation",

  GetBlockTemplate = "get_block_template",
  GetMinerWork = "get_miner_work",
  SubmitBlock = "submit_block"
}

export enum RPCEvent {
  NewBlock = 'new_block',
  BlockOrdered = 'block_ordered',
  BlockOrphaned = 'block_orphaned',
  StableHeightChanged = 'stable_height_changed',
  StableTopoHeightChanged = 'stable_topo_height_changed',
  TransactionOrphaned = 'transaction_orphaned',
  TransactionAddedInMempool = 'transaction_added_in_mempool',
  TransactionExecuted = 'transaction_executed',
  InvokeContract = 'invoke_contract',
  ContractTransfer = 'contract_transfer',
  ContractEvent = 'contract_event',
  DeployContract = 'deploy_contract',
  NewAsset = 'new_asset',
  PeerConnected = 'peer_connected',
  PeerDisconnected = 'peer_disconnected',
  PeerPeerListUpdated = 'peer_peer_list_updated',
  PeerStateUpdated = 'peer_state_updated',
  PeerPeerDisconnected = 'peer_peer_disconnected',
  NewBlockTemplate = 'new_block_template'
}
