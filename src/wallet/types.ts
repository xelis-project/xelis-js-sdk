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
  GetTransaction = 'get_transaction',
  BuildTransaction = 'build_transaction',
  ListTransactions = 'list_transactions',
  IsOnline = 'is_online',
  SetOnlineMode = 'set_online_mode',
  SetOfflineMode = 'set_offline_mode',
  SignData = 'sign_data',
  EstimateFees = 'estimate_fees'
}

export enum RPCEvent {
  NewTopoheight = 'new_topoheight',
  NewAsset = 'new_asset',
  NewTransaction = 'new_transaction',
  BalanceChanged = 'balance_changed',
  Rescan = 'rescan',
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