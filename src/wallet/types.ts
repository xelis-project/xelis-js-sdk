import { Transaction } from '../daemon/types'

export interface GetAddressParams {
  integrated_data?: string
}

export interface FeeBuilder {
  multiplier?: number
  value?: number
}

export interface BuildTransactionParams {
  transfers: TransferOut[]
  burn?: TxBurn
  broadcast: boolean
  fee?: FeeBuilder
  tx_as_hex: boolean
}

export interface BuildTransactionResult extends Transaction {
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

export interface TxCoinbase {
  reward: number
}

export interface TxBurn {
  asset: string
  amount: number
}

export interface TransferIn {
  asset: string
  amount: number
  extra_data?: any
}

export interface TxIncoming {
  from: string
  transfers: TransferIn[]
}

export interface TransferOut {
  destination: string
  asset: string
  amount: number
  extra_data?: any
}

export interface TxOutgoing {
  transfers: TransferOut
  fees: number
  nonce: number
}

export interface TransactionEntry {
  hash: string
  topoheight: number
  entry: TxCoinbase | TxBurn | TxIncoming | TxOutgoing
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
  transfers: TransferOut[]
  burn?: TxBurn
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
  GetAssets = 'get_assets', // TODO
  GetAsset = 'get_asset', // TODO
  GetTransaction = 'get_transaction',
  BuildTransaction = 'build_transaction',
  BuildTransactionOffline = 'build_transaction_offline', // TODO
  BuildUnsignedTransaction = 'build_unsigned_transaction', // TODO
  FinalizeUnsignedTransaction = 'finalize_unsigned_transaction', // TODO
  ClearTxCache = 'clear_tx_cache', // TODO
  ListTransactions = 'list_transactions',
  IsOnline = 'is_online',
  SetOnlineMode = 'set_online_mode',
  SetOfflineMode = 'set_offline_mode',
  SignData = 'sign_data',
  EstimateFees = 'estimate_fees',
  EstimateExtraDataSize = 'estimate_extra_data_size', // TODO
  NetworkInfo = 'network_info', // TODO
  DecryptExtraData = 'decrypt_extra_data', // TODO
  DecryptCiphertext = 'decrypt_ciphertext', // TODO
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