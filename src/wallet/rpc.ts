import {
  Transaction, WalletRPCMethod, GetAddressParams, SplitAddressParams, SplitAddressResult,
  BuildTransactionParams, BuildTransactionResult, ListTransactionParams
} from '../lib/types'

import { RPC as BaseRPC } from '../lib/rpc'

class RPC extends BaseRPC {
  getVersion() {
    return this.post<string>(WalletRPCMethod.GetVersion)
  }

  getNonce() {
    return this.post<number>(WalletRPCMethod.GetNonce)
  }

  getTopoheight() {
    return this.post<number>(WalletRPCMethod.GetTopoheight)
  }

  getAddress(params?: GetAddressParams) {
    return this.post<string>(WalletRPCMethod.GetAddress, params)
  }

  splitAddress(params: SplitAddressParams) {
    return this.post<SplitAddressResult>(WalletRPCMethod.SplitAddress, params)
  }

  getBalance(asset?: string) {
    return this.post<number>(WalletRPCMethod.GetBalance, { asset })
  }

  getTrackedAssets() {
    return this.post<string[]>(WalletRPCMethod.GetTrackedAssets)
  }

  getTransaction(hash: string) {
    return this.post<Transaction>(WalletRPCMethod.GetTransaction, { hash })
  }

  buildTransaction(params: BuildTransactionParams) {
    return this.post<BuildTransactionResult>(WalletRPCMethod.BuildTransaction, params)
  }

  listTransactions(params?: ListTransactionParams) {
    return this.post<Transaction[]>(WalletRPCMethod.ListTransactions, params)
  }
}

export default RPC
