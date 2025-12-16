import { Base64 } from 'js-base64'

import * as daemonTypes from '../daemon/types'
import { RPCMethod } from './types'
import * as types from './types'

import { HttpRPC } from '../rpc/http'
import { Element } from '../data/element'

export class RPC extends HttpRPC {
  constructor(endpoint: string, username: string, password: string) {
    super(endpoint)

    const authValue = Base64.encode(`${username}:${password}`)
    this.headers.set("Authorization", `Basic ${authValue}`)
  }

  getVersion() {
    return this.request<string>(RPCMethod.GetVersion)
  }

  getNetwork() {
    return this.request<string>(RPCMethod.GetNetwork)
  }

  getNonce() {
    return this.request<number>(RPCMethod.GetNonce)
  }

  getTopoheight() {
    return this.request<number>(RPCMethod.GetTopoheight)
  }

  getAddress(params: types.GetAddressParams = {}) {
    return this.request<string>(RPCMethod.GetAddress, params)
  }

  splitAddress(params: daemonTypes.SplitAddressParams) {
    return this.request<daemonTypes.SplitAddressResult>(RPCMethod.SplitAddress, params)
  }

  rescan(params: types.RescanParams) {
    return this.request<boolean>(RPCMethod.Rescan, params)
  }

  getBalance(asset?: string) {
    return this.request<number>(RPCMethod.GetBalance, { asset })
  }

  hasBalance(asset?: string) {
    return this.request<daemonTypes.HasBalanceResult>(RPCMethod.HasBalance, { asset })
  }

  getTrackedAssets() {
    return this.request<string[]>(RPCMethod.GetTrackedAssets)
  }

  getAssetPrecision(params: daemonTypes.GetAssetParams) {
    return this.request<number>(RPCMethod.GetAssetPrecision, params)
  }

  getAssets() {
    return this.request<{ [key: string]: types.Asset }>(RPCMethod.GetAssets)
  }

  getAsset(params: daemonTypes.GetAssetParams) {
    return this.request<types.Asset>(RPCMethod.GetAsset, params)
  }

  getTransaction(hash: string) {
    return this.request<types.TransactionEntry>(RPCMethod.GetTransaction, { hash })
  }

  searchTransaction(hash: string) {
    return this.request<types.SearchTransactionResult>(RPCMethod.SearchTransaction, { hash })
  }

  dumpTransaction(hash: string) {
    return this.request<string>(RPCMethod.DumpTransaction, { hash })
  }

  buildTransaction(params: types.BuildTransactionParams) {
    return this.request<types.TransactionResponse>(RPCMethod.BuildTransaction, params)
  }

  buildTransactionOffline(params: types.BuildTransactionOfflineParams) {
    return this.request<types.TransactionResponse>(RPCMethod.BuildTransactionOffline, params)
  }

  buildUnsignedTransaction(params: types.BuildTransactionParams) {
    return this.request<types.UnsignedTransactionResponse>(RPCMethod.BuildUnsignedTransaction, params)
  }

  signUnsignedTransaction(params: types.SignUnsignedTransactionParams) {
    return this.request<daemonTypes.SignatureId>(RPCMethod.SignUnsignedTransaction, params)
  }

  finalizeUnsignedTransaction(params: types.FinalizeUnsignedTransactionParams) {
    return this.request<types.TransactionResponse>(RPCMethod.FinalizeUnsignedTransaction, params)
  }

  clearTxCache() {
    return this.request<boolean>(RPCMethod.ClearTxCache)
  }

  listTransactions(params?: types.ListTransactionParams) {
    return this.request<types.TransactionEntry[]>(RPCMethod.ListTransactions, params)
  }

  isOnline() {
    return this.request<boolean>(RPCMethod.IsOnline)
  }

  setOnlineMode(params: types.SetOnlineModeParams) {
    return this.request<boolean>(RPCMethod.SetOnlineMode, params)
  }

  setOfflineMode() {
    return this.request<boolean>(RPCMethod.SetOfflineMode)
  }

  signData(data: Element) {
    return this.request<string>(RPCMethod.SignData, data.toObject())
  }

  estimateFees(params: types.EstimateFeesParams) {
    return this.request<number>(RPCMethod.EstimateFees, params)
  }

  estimateExtraDataSize(params: types.EstimateExtraDataSizeParams) {
    return this.request<types.EstimateExtraDataSizeResult>(RPCMethod.EstimateExtraDataSize, params)
  }

  networkInfo() {
    return this.request<types.NetworkInfoResult>(RPCMethod.NetworkInfo)
  }

  decryptExtraData(params: types.DecryptExtraDataParams) {
    return this.request<types.PlaintextCiphertext>(RPCMethod.DecryptExtraData, params)
  }

  decryptCiphertext(params: types.DecryptCiphertextParams) {
    return this.request<number>(RPCMethod.DecryptCiphertext, params)
  }

  getMatchingKeys(params: types.GetMatchingKeysParams) {
    return this.request<any>(RPCMethod.GetMatchingKeys, params)
  }

  countMatchingEntries(params: types.CountMatchingKeysParams) {
    return this.request<number>(RPCMethod.CountMatchingEntries, params)
  }

  getValueFromKey(params: types.GetValueFromKeyParams) {
    return this.request<any>(RPCMethod.GetValueFromKey, params)
  }

  store(params: types.StoreParams) {
    return this.request<boolean>(RPCMethod.Store, params)
  }

  delete(params: types.DeleteParams) {
    return this.request<boolean>(RPCMethod.Delete, params)
  }

  deleteTreeEntries(tree: string) {
    return this.request<boolean>(RPCMethod.DeleteTreeEntries, { tree })
  }

  hasKey(params: types.HasKeyParams) {
    return this.request<boolean>(RPCMethod.HasKey, params)
  }

  queryDB(params: types.QueryDBParams) {
    return this.request<types.QueryResult>(RPCMethod.QueryDB, params)
  }
}

export default RPC
