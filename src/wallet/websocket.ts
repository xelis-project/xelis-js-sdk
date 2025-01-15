import { WS as BaseWS } from '../lib/websocket'
import { MessageEvent } from 'ws'

import { RPCEventResult } from '../daemon/types'
import * as daemonTypes from '../daemon/types'
import { RPCMethod, RPCEvent } from './types'
import * as types from './types'

export class WalletMethods {
  ws: BaseWS
  prefix: string

  constructor(ws: BaseWS, prefix: string = "") {
    this.ws = ws
    this.prefix = prefix
  }

  dataCall<T>(method: string, params?: any): Promise<T> {
    return this.ws.dataCall(this.prefix + method, params)
  }

  onNewTopoheight(onData: (msgEvent: MessageEvent, data?: types.NewTopoheightResult & RPCEventResult, err?: Error) => void) {
    return this.ws.listenEvent(RPCEvent.NewTopoheight, onData)
  }

  onNewAsset(onData: (msgEvent: MessageEvent, data?: daemonTypes.AssetWithData & RPCEventResult, err?: Error) => void) {
    return this.ws.listenEvent(RPCEvent.NewAsset, onData)
  }

  onNewTransaction(onData: (msgEvent: MessageEvent, data?: types.TransactionEntry & RPCEventResult, err?: Error) => void) {
    return this.ws.listenEvent(RPCEvent.NewTransaction, onData)
  }

  onBalanceChanged(onData: (msgEvent: MessageEvent, data?: types.BalanceChangedResult & RPCEventResult, err?: Error) => void) {
    return this.ws.listenEvent(RPCEvent.BalanceChanged, onData)
  }

  onRescan(onData: (msgEvent: MessageEvent, data?: types.RescanResult & RPCEventResult, err?: Error) => void) {
    return this.ws.listenEvent(RPCEvent.Rescan, onData)
  }

  onOnline(onData: (msgEvent: MessageEvent, data?: RPCEventResult, err?: Error) => void) {
    return this.ws.listenEvent(RPCEvent.Online, onData)
  }

  onOffline(onData: (msgEvent: MessageEvent, data?: RPCEventResult, err?: Error) => void) {
    return this.ws.listenEvent(RPCEvent.Offline, onData)
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

  getBalance(asset?: string) {
    return this.dataCall<number>(RPCMethod.GetBalance, { asset })
  }

  getTrackedAssets() {
    return this.dataCall<string[]>(RPCMethod.GetTrackedAssets)
  }

  getAssetPrecision(params: daemonTypes.GetAssetParams) {
    return this.dataCall<number>(RPCMethod.GetAssetPrecision, params)
  }

  getTransaction(hash: string) {
    return this.dataCall<types.TransactionEntry>(RPCMethod.GetTransaction, { hash })
  }

  buildTransaction(params: types.BuildTransactionParams) {
    return this.dataCall<types.BuildTransactionResult>(RPCMethod.BuildTransaction, params)
  }

  listTransactions(params?: types.ListTransactionParams) {
    return this.dataCall<types.TransactionEntry[]>(RPCMethod.GetTransaction, params)
  }

  isOnline() {
    return this.dataCall<boolean>(RPCMethod.IsOnline)
  }

  signData(data: any) {
    return this.dataCall<types.Signature>(RPCMethod.SignData, data)
  }

  estimateFees(params: types.EstimateFeesParams) {
    return this.dataCall<number>(RPCMethod.EstimateFees, params)
  }

  setOnlineMode(params: types.SetOnlineModeParams) {
    return this.dataCall<boolean>(RPCMethod.SetOfflineMode, params)
  }

  setOfflineMode() {
    return this.dataCall<boolean>(RPCMethod.SetOfflineMode)
  }
}

export class WS extends BaseWS {
  methods: WalletMethods

  constructor(username: string, password: string) {
    super({ auth: `${username}:${password}` })
    this.methods = new WalletMethods(this)
  }
}

export default WS
