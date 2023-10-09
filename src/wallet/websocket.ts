import { WS as BaseWS } from '../lib/websocket'

import { Transaction } from '../daemon/types'

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

  splitAddress(params: SplitAddressParams) {
    return this.dataCall<SplitAddressResult>(RPCMethod.SplitAddress, params)
  }

  getBalance(asset?: string) {
    return this.dataCall<number>(RPCMethod.GetBalance, { asset })
  }

  getTrackedAssets() {
    return this.dataCall<string[]>(RPCMethod.GetTrackedAssets)
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
}

export default WS
