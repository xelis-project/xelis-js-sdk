import { Base64 } from 'js-base64'

import { GetAssetParams, HasBalanceResult, TransactionData } from '../daemon/types.js'

import {
  RPCMethod, GetAddressParams, SplitAddressParams, SplitAddressResult,
  BuildTransactionParams, BuildTransactionResult, ListTransactionParams,
  Signature, TransactionEntry
} from './types.js'

import { RPC as BaseRPC } from '../lib/rpc.js'
import { RPCResponse } from '../lib/types.js'

export class RPC extends BaseRPC {
  auth: string

  constructor(endpoint: string, username: string, password: string) {
    super(endpoint)
    const authValue = Base64.encode(`${username}:${password}`)
    this.auth = `Basic ${authValue}`
  }

  async post<T>(method: string, params?: any): Promise<RPCResponse<T>> {
    const headers = new Headers()
    headers.set(`Authorization`, this.auth)
    return super.post(method, params, headers)
  }

  getVersion() {
    return this.post<string>(RPCMethod.GetVersion)
  }

  getNetwork() {
    return this.post<string>(RPCMethod.GetNetwork)
  }

  getNonce() {
    return this.post<number>(RPCMethod.GetNonce)
  }

  getTopoheight() {
    return this.post<number>(RPCMethod.GetTopoheight)
  }

  getAddress(params: GetAddressParams = {}) {
    return this.post<string>(RPCMethod.GetAddress, params)
  }

  splitAddress(params: SplitAddressParams) {
    return this.post<SplitAddressResult>(RPCMethod.SplitAddress, params)
  }

  rescan() {
    return this.post<void>(RPCMethod.Rescan)
  }

  getBalance(asset?: string) {
    return this.post<number>(RPCMethod.GetBalance, { asset })
  }

  hasBalance(asset?: string) {
    return this.post<HasBalanceResult>(RPCMethod.HasBalance, { asset })
  }

  getTrackedAssets() {
    return this.post<string[]>(RPCMethod.GetTrackedAssets)
  }

  getAssetPrecision(params: GetAssetParams) {
    return this.post<number>(RPCMethod.GetAssetPrecision, params)
  }

  getTransaction(hash: string) {
    return this.post<TransactionEntry>(RPCMethod.GetTransaction, { hash })
  }

  buildTransaction(params: BuildTransactionParams) {
    return this.post<BuildTransactionResult>(RPCMethod.BuildTransaction, params)
  }

  listTransactions(params?: ListTransactionParams) {
    return this.post<TransactionEntry[]>(RPCMethod.ListTransactions, params)
  }

  isOnline() {
    return this.post<boolean>(RPCMethod.IsOnline)
  }

  signData(data: any) {
    return this.post<Signature>(RPCMethod.SignData, data)
  }

  estimateFees(txData: TransactionData) {
    return this.post<number>(RPCMethod.EstimateFees, { tx_type: txData })
  }
}

export default RPC
