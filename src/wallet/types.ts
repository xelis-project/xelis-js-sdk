import { TransactionData, Transaction } from '../daemon/types'

export interface GetAddressParams {
  integrated_data?: string
}

export interface SplitAddressParams {
  address: string
}

export interface SplitAddressResult {
  address: string
  integrated_data: string
}

export interface BuildTransactionParams {
  tx_type: TransactionData
  broadcast: boolean
  fee?: number
}

export interface BuildTransactionResult {
  hash: string
  data: Transaction
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

export enum RPCMethod {
  GetVersion = 'get_version',
  GetNetwork = 'get_network',
  GetNonce = 'get_nonce',
  GetTopoheight = 'get_topoheight',
  GetAddress = 'get_address',
  SplitAddress = 'split_address',
  Rescan = 'rescan',
  GetBalance = 'get_balance',
  GetTrackedAssets = 'get_tracked_assets',
  GetAssetPrecision = 'get_asset_precision',
  GetTransaction = 'get_transaction',
  BuildTransaction = 'build_transaction',
  ListTransactions = 'list_transactions',
  IsOnline = 'is_online',
  SignData = 'sign_data',
  EstimateFees = 'estimate_fees'
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