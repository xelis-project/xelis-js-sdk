import * as daemonTypes from '../daemon/types'

export interface GetAddressParams {
  integrated_data?: string
}

export interface FeeBuilder {
  multiplier?: number
  value?: number
}

export interface MultiSigBuilder {
  participants: string[]
  threshold: number
}

export interface ContractDepositBuilder {
  amount: number
  private: boolean
}

export interface DeployContractInvokeBuilder {
  max_gas: number
  deposits: { [key: string]: ContractDepositBuilder }
}

export interface DeployContractBuilder {
  module: string
  invoke?: DeployContractInvokeBuilder
}

export interface InvokeContractBuilder {
  contract: string
  max_gas: number
  entry_id: number
  parameters: any[]
  deposits: { [key: string]: ContractDepositBuilder }
}

export interface TransferBuilder {
  destination: string
  asset: string
  amount: number
  extra_data?: any
}

export interface SignerId {
  id: number
  private_key: number[]
}

export interface BuildTransactionParams {
  transfers?: TransferBuilder[]
  burn?: daemonTypes.Burn
  multi_sig?: MultiSigBuilder
  invoke_contract?: InvokeContractBuilder
  deploy_contract?: DeployContractBuilder
  fee?: FeeBuilder
  nonce?: number
  tx_version?: number
  broadcast: boolean
  tx_as_hex: boolean
  signers?: SignerId[]
}

export interface BuildTransactionOfflineParams extends BuildTransactionParams {
  nonce: number
  reference: daemonTypes.Reference
}

export interface TransactionResponse extends daemonTypes.Transaction {
  txt_as_hex?: string
}

export interface SignatureId {
  id: number
  signature: string
}

export interface MultiSig {
  signatures: { [id: number]: SignatureId }
}

export interface UnsignedTransaction {
  version: number
  source: string
  data: daemonTypes.TransactionData
  fee: number
  nonce: number
  source_commitments: daemonTypes.SourceCommitment[]
  reference: daemonTypes.Reference
  range_proof: number[]
  multisig?: MultiSig
}

export interface UnsignedTransactionResponse extends UnsignedTransaction {
  hash: string
  threshold: number
  tx_as_hex?: string
}

export interface ListTransactionParams {
  min_topoheight?: number
  max_topoheight?: number
  address?: string
  accept_incoming?: boolean
  accept_outgoing?: boolean
  accept_coinbase?: boolean
  accept_burn?: boolean
}

export interface Signature {
  s: number[]
  e: number[]
}

export interface Coinbase {
  reward: number
}

export interface PlaintextExtraData {
  shared_key: string
  data: any
}

export interface TransferOut {
  amount: number
  asset: string
  destination: string
  extra_data: PlaintextExtraData | null
}

export interface TransferIn {
  asset: string
  amount: number
  extra_data?: PlaintextExtraData | null
}

export interface Incoming {
  from: string
  transfers: TransferIn[]
}

export interface Outgoing {
  transfers: TransferOut
  fees: number
  nonce: number
}

export interface TransactionEntry {
  hash: string
  topoheight: number
  outgoing: Outgoing | null
  incoming: Incoming | null
  burn: daemonTypes.Burn | null
  coinbase: Coinbase | null
}

export interface RescanParams {
  until_topoheight?: number
  auto_reconnect: boolean
}

export interface SetOnlineModeParams {
  daemon_address: string
  auto_reconnect: boolean
}

export interface EstimateFeesParams {
  transfers?: TransferBuilder[]
  burn?: daemonTypes.Burn
  multi_sig?: MultiSigBuilder
  invoke_contract?: InvokeContractBuilder
  deploy_contract?: string
}

export interface BalanceChangedResult {
  asset: string
  balance: number
}

export interface NewTopoheightResult {
  topoheight: number
}

export interface RescanResult {
  start_topoheight: number
}

export interface Asset {
  decimals: number
  name: string
  max_supply: number | null
}

export interface EstimateExtraDataSizeParams {
  destinations: string[]
}

export interface EstimateExtraDataSizeResult {
  size: number
}

export interface NetworkInfoResult extends daemonTypes.GetInfoResult {
  connected_to: string
}

export enum TxRole {
  Sender = "sender",
  Receiver = "receiver"
}

export interface DecryptExtraDataParams {
  extra_data: number[]
  role: TxRole
}

export interface CompressedCiphertext {
  commitment: number[]
  handle: number[]
}

export interface PlaintextCiphertext {
  shared_key: string
  data: any
}

export interface DecryptCiphertextParams {
  ciphertext: CompressedCiphertext
}

export interface SignUnsignedTransactionParams {
  hash: string
  signer_id: number
}

export interface FinalizeUnsignedTransactionParams {
  unsigned: string
  signatures: SignatureId[]
  broadcast: boolean
  tx_as_hex: boolean
}

export interface HistorySyncedResult {
  topoheight: number
}

export interface GetMatchingKeysParams {
  tree: string
  query?: Query
}

export interface CountMatchingKeysParams {
  tree: string
  key?: Query
  value?: Query
}

export interface GetValueFromKeyParams {
  tree: string
  key: any
}

export interface StoreParams {
  tree: string
  key: any
  value: any
}

export interface DeleteParams {
  tree: string
  key: any
}

export interface HasKeyParams {
  tree: string
  key: any
}

export interface QueryDBParams {
  tree: string
  key?: Query
  value?: Query
  return_on_first: boolean
}

export interface QueryResult {
  entries: { [key: string]: any }
  next?: number
}

export enum ValueType {
  Bool = 0,
  String = 1,
  U8 = 2,
  U16 = 3,
  U32 = 4,
  U64 = 5,
  U128 = 6,
  Hash = 7,
  Blob = 8
}

export enum ElementType {
  Value = 0,
  Array = 1,
  Fields = 2
}

export interface QueryAtKey {
  key: any
  query?: Query
}

export interface QueryNumber {
  greater?: number
  greater_or_equal?: number
  lesser?: number
  lesser_or_equal?: number
}

export interface QueryPosition {
  position: number
  query?: Query
}

export interface QueryElement {
  has_key?: QueryAtKey
  at_key?: QueryAtKey
  len?: QueryNumber
  contains_element?: any
  at_position?: QueryPosition
  element_type?: ElementType
}

export interface QueryValue extends QueryNumber {
  equal?: any
  starts_with?: any
  ends_width?: any
  contains_value?: any
  is_of_type?: ValueType
  matches?: string
}

export interface Query extends QueryValue, QueryElement {
  not?: Query
  and?: Query[]
  or?: Query[]
}

export interface SearchTransactionResult {
  transaction: TransactionEntry
  index?: number
  is_raw_search: boolean
}

export interface SyncError {
  message: string
}

export interface TrackAsset {
  asset: string
}

export interface UntrackAsset {
  asset: string
}

export enum RPCMethod {
  GetVersion = 'get_version',
  GetNetwork = 'get_network',
  GetNonce = 'get_nonce',
  GetTopoheight = 'get_topoheight',
  GetAddress = 'get_address',
  SplitAddress = 'split_address',
  Rescan = 'rescan',
  GetBalance = 'get_balance',
  HasBalance = 'has_balance',
  GetTrackedAssets = 'get_tracked_assets',
  GetAssetPrecision = 'get_asset_precision',
  GetAssets = 'get_assets',
  GetAsset = 'get_asset',
  GetTransaction = 'get_transaction',
  SearchTransaction = 'search_transaction', // TODO
  DumpTransaction = 'dump_transaction', // TODO
  BuildTransaction = 'build_transaction',
  BuildTransactionOffline = 'build_transaction_offline',
  BuildUnsignedTransaction = 'build_unsigned_transaction',
  FinalizeUnsignedTransaction = 'finalize_unsigned_transaction',
  SignUnsignedTransaction = 'sign_unsigned_transaction',
  ClearTxCache = 'clear_tx_cache',
  ListTransactions = 'list_transactions',
  IsOnline = 'is_online',
  SetOnlineMode = 'set_online_mode',
  SetOfflineMode = 'set_offline_mode',
  SignData = 'sign_data',
  EstimateFees = 'estimate_fees',
  EstimateExtraDataSize = 'estimate_extra_data_size',
  NetworkInfo = 'network_info',
  DecryptExtraData = 'decrypt_extra_data',
  DecryptCiphertext = 'decrypt_ciphertext',
  GetMatchingKeys = 'get_matching_keys',
  CountMatchingEntries = 'count_matching_entries',
  GetValueFromKey = 'get_value_from_key',
  Store = 'store',
  Delete = 'delete',
  DeleteTreeEntries = 'delete_tree_entries',
  HasKey = 'has_key',
  QueryDB = 'query_db'
}

export enum RPCEvent {
  NewTopoheight = 'new_topoheight',
  NewAsset = 'new_asset',
  NewTransaction = 'new_transaction',
  BalanceChanged = 'balance_changed',
  Rescan = 'rescan',
  HistorySynced = 'history_synced',
  Online = 'online',
  Offline = 'offline',
  SyncError = 'sync_error',
  TrackAsset = 'track_asset',
  UntrackAsset = 'untrack_asset'
}
