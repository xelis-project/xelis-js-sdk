import { WS as BaseWS } from '../lib/websocket'

import { GetAssetParams, TransactionData } from '../daemon/types'

import {
  BuildTransactionParams, BuildTransactionResult, GetAddressParams,
  ListTransactionParams, SplitAddressParams, SplitAddressResult, RPCMethod, Signature, TransactionEntry
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

  rescan() {
    return this.dataCall<void>(RPCMethod.Rescan)
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

  estimateFees(txData: TransactionData) {
    return this.dataCall<number>(RPCMethod.EstimateFees, { tx_type: txData })
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
