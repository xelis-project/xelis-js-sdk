import { WS as BaseWS } from '../lib/websocket'

import {
  BuildTransactionParams, BuildTransactionResult, GetAddressParams,
  ListTransactionParams, SplitAddressParams, SplitAddressResult, Transaction, WalletRPCMethod
} from '../lib/types'

class WS extends BaseWS {
  getVersion() {
    return this.dataCall<string>(WalletRPCMethod.GetVersion)
  }

  getNetwork() {
    return this.dataCall<string>(WalletRPCMethod.GetNetwork)
  }

  getNonce() {
    return this.dataCall<number>(WalletRPCMethod.GetNonce)
  }

  getTopoheight() {
    return this.dataCall<number>(WalletRPCMethod.GetTopoheight)
  }

  getAddress(params?: GetAddressParams) {
    return this.dataCall<string>(WalletRPCMethod.GetAddress, params)
  }

  splitAddress(params: SplitAddressParams) {
    return this.dataCall<SplitAddressResult>(WalletRPCMethod.SplitAddress, params)
  }

  getBalance(asset?: string) {
    return this.dataCall<number>(WalletRPCMethod.GetBalance, { asset })
  }

  getTrackedAssets() {
    return this.dataCall<string[]>(WalletRPCMethod.GetTrackedAssets)
  }

  getTransaction(hash: string) {
    return this.dataCall<Transaction>(WalletRPCMethod.GetTransaction, { hash })
  }

  buildTransaction(params: BuildTransactionParams) {
    return this.dataCall<BuildTransactionResult>(WalletRPCMethod.BuildTransaction, params)
  }

  listTransactions(params?: ListTransactionParams) {
    return this.dataCall<Transaction[]>(WalletRPCMethod.GetTransaction, params)
  }
}

export default WS
