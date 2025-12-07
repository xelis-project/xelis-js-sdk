import { WSRPC } from '../rpc/websocket'
import { MessageEvent } from 'ws'
import * as daemonTypes from '../daemon/types'
import { RPCMethod, RPCEvent } from './types'
import * as types from './types'
import { Element } from '../data/element'

export interface WalletEventsData {
  [RPCEvent.NewTopoheight]: { params: null, returnType: types.NewTopoheightResult }
  [RPCEvent.NewAsset]: { params: null, returnType: daemonTypes.AssetWithData }
  [RPCEvent.NewTransaction]: { params: null, returnType: types.TransactionEntry }
  [RPCEvent.BalanceChanged]: { params: null, returnType: types.BalanceChangedResult }
  [RPCEvent.Rescan]: { params: null, returnType: types.RescanResult }
  [RPCEvent.HistorySynced]: { params: null, returnType: types.HistorySyncedResult }
  [RPCEvent.Online]: { params: null, returnType: void }
  [RPCEvent.Offline]: { params: null, returnType: void }
  [RPCEvent.SyncError]: { params: null, returnType: types.SyncError }
  [RPCEvent.TrackAsset]: { params: null, returnType: types.TrackAsset }
  [RPCEvent.UntrackAsset]: { params: null, returnType: types.UntrackAsset }
}

export class WalletMethods {
  ws: WSRPC
  prefix: string

  constructor(ws: WSRPC, prefix: string = "") {
    this.ws = ws
    this.prefix = prefix
  }

  dataCall<T>(method: string, params?: any): Promise<T> {
    return this.ws.dataCall(this.prefix + method, params)
  }

  removeListener<K extends keyof WalletEventsData>(event: K, params: WalletEventsData[K]["params"], listener: (data?: WalletEventsData[K]["returnType"], err?: Error) => void) {
    let eventObj = this.prefix + event as any
    if (params) eventObj = { [eventObj]: params }
    this.ws.removeListener(event, listener)
  }

  addListener<K extends keyof WalletEventsData>(event: K, params: WalletEventsData[K]["params"], listener: (data?: WalletEventsData[K]["returnType"], err?: Error) => void) {
    let eventObj = this.prefix + event as any
    if (params) eventObj = { [eventObj]: params }
    this.ws.addListener(eventObj, listener)
  }

  getVersion() {
    return this.dataCall<string>(RPCMethod.GetVersion)
  }

  getNetwork() {
    return this.dataCall<string>(RPCMethod.GetNetwork)
  }

  getNonce() {
    return this.dataCall<number>(RPCMethod.GetNonce)
  }

  getTopoheight() {
    return this.dataCall<number>(RPCMethod.GetTopoheight)
  }

  getAddress(params: types.GetAddressParams = {}) {
    return this.dataCall<string>(RPCMethod.GetAddress, params)
  }

  splitAddress(params: daemonTypes.SplitAddressParams) {
    return this.dataCall<daemonTypes.SplitAddressResult>(RPCMethod.SplitAddress, params)
  }

  rescan(params: types.RescanParams) {
    return this.dataCall<boolean>(RPCMethod.Rescan, params)
  }

  getBalance(asset: string) {
    return this.dataCall<number>(RPCMethod.GetBalance, { asset })
  }

  hasBalance(asset: string) {
    return this.dataCall<daemonTypes.HasBalanceResult>(RPCMethod.HasBalance, { asset })
  }

  getTrackedAssets() {
    return this.dataCall<string[]>(RPCMethod.GetTrackedAssets)
  }

  getAssetPrecision(params: daemonTypes.GetAssetParams) {
    return this.dataCall<number>(RPCMethod.GetAssetPrecision, params)
  }

  getAssets() {
    return this.dataCall<{ [key: string]: types.Asset }>(RPCMethod.GetAssets)
  }

  getAsset(params: daemonTypes.GetAssetParams) {
    return this.dataCall<types.Asset>(RPCMethod.GetAsset, params)
  }

  getTransaction(hash: string) {
    return this.dataCall<types.TransactionEntry>(RPCMethod.GetTransaction, { hash })
  }

  searchTransaction(hash: string) {
    return this.dataCall<types.SearchTransactionResult>(RPCMethod.SearchTransaction, { hash })
  }

  dumpTransaction(hash: string) {
    return this.dataCall<string>(RPCMethod.DumpTransaction, { hash })
  }

  buildTransaction(params: types.BuildTransactionParams) {
    return this.dataCall<types.TransactionResponse>(RPCMethod.BuildTransaction, params)
  }

  buildTransactionOffline(params: types.BuildTransactionOfflineParams) {
    return this.dataCall<types.TransactionResponse>(RPCMethod.BuildTransactionOffline, params)
  }

  buildUnsignedTransaction(params: types.BuildTransactionParams) {
    return this.dataCall<types.UnsignedTransactionResponse>(RPCMethod.BuildUnsignedTransaction, params)
  }

  signUnsignedTransaction(params: types.SignUnsignedTransactionParams) {
    return this.dataCall<types.SignatureId>(RPCMethod.SignUnsignedTransaction, params)
  }

  finalizeUnsignedTransaction(params: types.FinalizeUnsignedTransactionParams) {
    return this.dataCall<types.TransactionResponse>(RPCMethod.FinalizeUnsignedTransaction, params)
  }

  clearTxCache() {
    return this.dataCall<boolean>(RPCMethod.ClearTxCache)
  }

  listTransactions(params?: types.ListTransactionParams) {
    return this.dataCall<types.TransactionEntry[]>(RPCMethod.GetTransaction, params)
  }

  isOnline() {
    return this.dataCall<boolean>(RPCMethod.IsOnline)
  }

  setOnlineMode(params: types.SetOnlineModeParams) {
    return this.dataCall<boolean>(RPCMethod.SetOfflineMode, params)
  }

  setOfflineMode() {
    return this.dataCall<boolean>(RPCMethod.SetOfflineMode)
  }

  signData(data: Element) {
    return this.dataCall<string>(RPCMethod.SignData, data.toObject())
  }

  estimateFees(params: types.EstimateFeesParams) {
    return this.dataCall<number>(RPCMethod.EstimateFees, params)
  }

  estimateExtraDataSize(params: types.EstimateExtraDataSizeParams) {
    return this.dataCall<types.EstimateExtraDataSizeResult>(RPCMethod.EstimateExtraDataSize, params)
  }

  networkInfo() {
    return this.dataCall<types.NetworkInfoResult>(RPCMethod.NetworkInfo)
  }

  decryptExtraData(params: types.DecryptExtraDataParams) {
    return this.dataCall<types.PlaintextCiphertext>(RPCMethod.DecryptExtraData, params)
  }

  decryptCiphertext(params: types.DecryptCiphertextParams) {
    return this.dataCall<number>(RPCMethod.DecryptCiphertext, params)
  }

  getMatchingKeys(params: types.GetMatchingKeysParams) {
    return this.dataCall<any>(RPCMethod.GetMatchingKeys, params)
  }

  countMatchingEntries(params: types.CountMatchingKeysParams) {
    return this.dataCall<number>(RPCMethod.CountMatchingEntries, params)
  }

  getValueFromKey(params: types.GetValueFromKeyParams) {
    return this.dataCall<any>(RPCMethod.GetValueFromKey, params)
  }

  store(params: types.StoreParams) {
    return this.dataCall<boolean>(RPCMethod.Store, params)
  }

  delete(params: types.DeleteParams) {
    return this.dataCall<boolean>(RPCMethod.Delete, params)
  }

  deleteTreeEntries(tree: string) {
    return this.dataCall<boolean>(RPCMethod.DeleteTreeEntries, { tree })
  }

  hasKey(params: types.HasKeyParams) {
    return this.dataCall<boolean>(RPCMethod.HasKey, params)
  }

  queryDB(params: types.QueryDBParams) {
    return this.dataCall<types.QueryResult>(RPCMethod.QueryDB, params)
  }
}

export class WS extends WSRPC {
  methods: WalletMethods

  constructor(endpoint: string, username: string, password: string) {
    super(endpoint, { auth: `${username}:${password}` })
    this.methods = new WalletMethods(this)
  }
}

export default WS
