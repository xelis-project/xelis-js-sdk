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

export interface InvokeContractBuilder {
  contract: string
  max_gas: number
  chunk_id: number
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
  deploy_contract?: string
  fee?: FeeBuilder
  nonce?: number
  tx_version?: number
  broadcast: boolean
  tx_as_hex: boolean
  signers?: SignerId[]
}

export interface BuildTransactionResult extends daemonTypes.Transaction {
  txt_as_hex?: string
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
  BuildTransaction = 'build_transaction',
  BuildTransactionOffline = 'build_transaction_offline', // TODO
  BuildUnsignedTransaction = 'build_unsigned_transaction', // TODO
  FinalizeUnsignedTransaction = 'finalize_unsigned_transaction', // TODO
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
  GetMatchingKeys = 'get_matching_keys', // TODO
  CountMatchingEntries = 'count_matching_entries', // TODO
  GetValueFromKey = 'get_value_from_key', // TODO
  Store = 'store', // TODO
  Delete = 'delete', // TODO
  DeleteTreeEntries = 'delete_tree_entries', // TODO
  HasKey = 'has_key', // TODO
  QueryDB = 'query_db' // TODO
}

export enum RPCEvent {
  NewTopoheight = 'new_topoheight',
  NewAsset = 'new_asset',
  NewTransaction = 'new_transaction',
  BalanceChanged = 'balance_changed',
  Rescan = 'rescan',
  HistorySynced = 'history_synced',
  Online = 'online',
  Offline = 'offline'
}

export enum Permission {
  Ask = 0,
  AcceptAlways = 1,
  DenyAlways = 2
}

export interface ApplicationData {
  id: string
  name: string
  description: string
  url?: string
  permissions: Map<string, Permission>
  signature?: string
}