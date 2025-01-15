import { Base64 } from 'js-base64'

import * as daemonTypes from '../daemon/types'
import { RPCMethod } from './types'
import * as types from './types'

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

  getNetwork() {
    return this.post<string>(RPCMethod.GetNetwork)
  }

  getNonce() {
    return this.post<number>(RPCMethod.GetNonce)
  }

  getTopoheight() {
    return this.post<number>(RPCMethod.GetTopoheight)
  }

  getAddress(params: types.GetAddressParams = {}) {
    return this.post<string>(RPCMethod.GetAddress, params)
  }

  splitAddress(params: daemonTypes.SplitAddressParams) {
    return this.post<daemonTypes.SplitAddressResult>(RPCMethod.SplitAddress, params)
  }

  rescan(params: types.RescanParams) {
    return this.post<boolean>(RPCMethod.Rescan, params)
  }

  getBalance(asset?: string) {
    return this.post<number>(RPCMethod.GetBalance, { asset })
  }

  hasBalance(asset?: string) {
    return this.post<daemonTypes.HasBalanceResult>(RPCMethod.HasBalance, { asset })
  }

  getTrackedAssets() {
    return this.post<string[]>(RPCMethod.GetTrackedAssets)
  }

  getAssetPrecision(params: daemonTypes.GetAssetParams) {
    return this.post<number>(RPCMethod.GetAssetPrecision, params)
  }

  getAssets() {
    return this.post<{ [key: string]: types.Asset }>(RPCMethod.GetAssets)
  }

  getAsset(params: daemonTypes.GetAssetParams) {
    return this.post<types.Asset>(RPCMethod.GetAsset, params)
  }

  getTransaction(hash: string) {
    return this.post<types.TransactionEntry>(RPCMethod.GetTransaction, { hash })
  }

  buildTransaction(params: types.BuildTransactionParams) {
    return this.post<types.BuildTransactionResult>(RPCMethod.BuildTransaction, params)
  }

  clearTxCache() {
    return this.post<boolean>(RPCMethod.ClearTxCache)
  }

  listTransactions(params?: types.ListTransactionParams) {
    return this.post<types.TransactionEntry[]>(RPCMethod.ListTransactions, params)
  }

  isOnline() {
    return this.post<boolean>(RPCMethod.IsOnline)
  }

  signData(data: any) {
    return this.post<types.Signature>(RPCMethod.SignData, data)
  }

  estimateFees(params: types.EstimateFeesParams) {
    return this.post<number>(RPCMethod.EstimateFees, params)
  }

  estimateExtraDataSize(params: types.EstimateExtraDataSizeParams) {
    return this.post<types.EstimateExtraDataSizeResult>(RPCMethod.EstimateExtraDataSize, params)
  }

  setOnlineMode(params: types.SetOnlineModeParams) {
    return this.post<boolean>(RPCMethod.SetOnlineMode, params)
  }

  setOfflineMode() {
    return this.post<boolean>(RPCMethod.SetOfflineMode)
  }
}

export default RPC
