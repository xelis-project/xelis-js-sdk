import { WS as BaseWS } from '../lib/websocket'
import { MessageEvent } from 'ws'

import { AssetWithData, GetAssetParams, RPCEventResult, SplitAddressParams, SplitAddressResult } from '../daemon/types'

import {
  BuildTransactionParams, BuildTransactionResult, GetAddressParams,
  ListTransactionParams, RPCMethod, Signature, RescanParams, SetOnlineModeParams, EstimateFeesParams,
  RPCEvent, TransactionEntry, BalanceChangedResult, NewTopoheightResult, RescanResult
} from './types'

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

  onNewTopoheight(onData: (msgEvent: MessageEvent, data?: NewTopoheightResult & RPCEventResult, err?: Error) => void) {
    return this.ws.listenEvent(RPCEvent.NewTopoheight, onData)
  }

  onNewAsset(onData: (msgEvent: MessageEvent, data?: AssetWithData & RPCEventResult, err?: Error) => void) {
    return this.ws.listenEvent(RPCEvent.NewAsset, onData)
  }

  onNewTransaction(onData: (msgEvent: MessageEvent, data?: TransactionEntry & RPCEventResult, err?: Error) => void) {
    return this.ws.listenEvent(RPCEvent.NewTransaction, onData)
  }

  onBalanceChanged(onData: (msgEvent: MessageEvent, data?: BalanceChangedResult & RPCEventResult, err?: Error) => void) {
    return this.ws.listenEvent(RPCEvent.BalanceChanged, onData)
  }

  onRescan(onData: (msgEvent: MessageEvent, data?: RescanResult & RPCEventResult, err?: Error) => void) {
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

  getAddress(params: GetAddressParams = {}) {
    return this.dataCall<string>(RPCMethod.GetAddress, params)
  }

  splitAddress(params: SplitAddressParams) {
    return this.dataCall<SplitAddressResult>(RPCMethod.SplitAddress, params)
  }

  rescan(params: RescanParams) {
    return this.dataCall<boolean>(RPCMethod.Rescan, params)
  }

  getBalance(asset?: string) {
    return this.dataCall<number>(RPCMethod.GetBalance, { asset })
  }

  getTrackedAssets() {
    return this.dataCall<string[]>(RPCMethod.GetTrackedAssets)
  }

  getAssetPrecision(params: GetAssetParams) {
    return this.dataCall<number>(RPCMethod.GetAssetPrecision, params)
  }

  getTransaction(hash: string) {
    return this.dataCall<TransactionEntry>(RPCMethod.GetTransaction, { hash })
  }

  buildTransaction(params: BuildTransactionParams) {
    return this.dataCall<BuildTransactionResult>(RPCMethod.BuildTransaction, params)
  }

  listTransactions(params?: ListTransactionParams) {
    return this.dataCall<TransactionEntry[]>(RPCMethod.GetTransaction, params)
  }

  isOnline() {
    return this.dataCall<boolean>(RPCMethod.IsOnline)
  }

  signData(data: any) {
    return this.dataCall<Signature>(RPCMethod.SignData, data)
  }

  estimateFees(params: EstimateFeesParams) {
    return this.dataCall<number>(RPCMethod.EstimateFees, params)
  }

  setOnlineMode(params: SetOnlineModeParams) {
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
