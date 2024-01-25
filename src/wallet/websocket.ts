import { WS as BaseWS } from '../lib/websocket'

import { GetAssetParams, Transaction } from '../daemon/types'

import {
  BuildTransactionParams, BuildTransactionResult, GetAddressParams,
  ListTransactionParams, SplitAddressParams, SplitAddressResult, RPCMethod
} from './types'

class WS extends BaseWS {
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

  getAddress(params?: GetAddressParams) {
    return this.dataCall<string>(RPCMethod.GetAddress, params)
  }

  rescan() {
    return this.dataCall<void>(RPCMethod.Rescan)
  }

  splitAddress(params: SplitAddressParams) {
    return this.dataCall<SplitAddressResult>(RPCMethod.SplitAddress, params)
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
    return this.dataCall<Transaction>(RPCMethod.GetTransaction, { hash })
  }

  buildTransaction(params: BuildTransactionParams) {
    return this.dataCall<BuildTransactionResult>(RPCMethod.BuildTransaction, params)
  }

  listTransactions(params?: ListTransactionParams) {
    return this.dataCall<Transaction[]>(RPCMethod.GetTransaction, params)
  }

  isOnline() {
    return this.dataCall<boolean>(RPCMethod.IsOnline)
  }
}

export default WS
