import { Transaction, GetAssetParams } from '../daemon/types'
import { Base64 } from 'js-base64'

import {
  RPCMethod, GetAddressParams, SplitAddressParams, SplitAddressResult,
  BuildTransactionParams, BuildTransactionResult, ListTransactionParams
} from './types'

import { RPC as BaseRPC } from '../lib/rpc'
import { RPCResponse } from '../lib/types'

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

  getNonce() {
    return this.post<number>(RPCMethod.GetNonce)
  }

  getTopoheight() {
    return this.post<number>(RPCMethod.GetTopoheight)
  }

  getAddress(params: GetAddressParams = {}) {
    return this.post<string>(RPCMethod.GetAddress, params)
  }

  rescan() {
    return this.post<void>(RPCMethod.Rescan)
  }

  splitAddress(params: SplitAddressParams) {
    return this.post<SplitAddressResult>(RPCMethod.SplitAddress, params)
  }

  getBalance(asset?: string) {
    return this.post<number>(RPCMethod.GetBalance, { asset })
  }

  getTrackedAssets() {
    return this.post<string[]>(RPCMethod.GetTrackedAssets)
  }

  getAssetPrecision(params: GetAssetParams) {
    return this.post<number>(RPCMethod.GetAssetPrecision, params)
  }

  getTransaction(hash: string) {
    return this.post<Transaction>(RPCMethod.GetTransaction, { hash })
  }

  buildTransaction(params: BuildTransactionParams) {
    return this.post<BuildTransactionResult>(RPCMethod.BuildTransaction, params)
  }

  listTransactions(params?: ListTransactionParams) {
    return this.post<Transaction[]>(RPCMethod.ListTransactions, params)
  }

  isOnline() {
    return this.post<boolean>(RPCMethod.IsOnline)
  }
}

export default RPC
