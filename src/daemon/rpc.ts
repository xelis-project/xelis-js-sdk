import {
  Balance, Block, TopoHeightRangeParams, GetInfoResult, HeightRangeParams,
  GetLastBalanceResult, P2PStatusResult, DaemonRPCMethod, Transaction, GetLastBalanceParams,
  GetBalanceAtTopoHeightParams, GetAccountsParams, GetBlockAtTopoHeightParams, GetBlockByHashParams,
  GetBlocksAtHeightParams, GetTopBlockParams
} from '../lib/types'

import { RPC as BaseRPC } from '../lib/rpc'

class RPC extends BaseRPC {
  getVersion() {
    return this.post<string>(DaemonRPCMethod.GetVersion)
  }

  getInfo() {
    return this.post<GetInfoResult>(DaemonRPCMethod.GetInfo)
  }

  getHeight() {
    return this.post<number>(DaemonRPCMethod.GetHeight)
  }

  getTopoHeight() {
    return this.post<number>(DaemonRPCMethod.GetTopoHeight)
  }

  getStableHeight() {
    return this.post<number>(DaemonRPCMethod.GetStableHeight)
  }

  getBlockTemplate(address: string) {
    return this.post<string>(DaemonRPCMethod.GetBlockTemplate, { address })
  }

  getBlockAtTopoHeight(params: GetBlockAtTopoHeightParams) {
    return this.post<Block>(DaemonRPCMethod.GetBlockAtTopoHeight, params)
  }

  getBlocksAtHeight(params: GetBlocksAtHeightParams) {
    return this.post<Block[]>(DaemonRPCMethod.GetBlocksAtHeight, params)
  }

  getBlockByHash(params: GetBlockByHashParams) {
    return this.post<Block>(DaemonRPCMethod.GetBlockByHash, params)
  }

  getTopBlock(params: GetTopBlockParams) {
    return this.post<Block>(DaemonRPCMethod.GetTopBlock, params)
  }

  getNonce(address: string) {
    return this.post<number>(DaemonRPCMethod.GetNonce, { address })
  }

  getLastBalance(params: GetLastBalanceParams) {
    return this.post<GetLastBalanceResult>(DaemonRPCMethod.GetLastBalance, params)
  }

  getBalanceAtTopoHeight(params: GetBalanceAtTopoHeightParams) {
    return this.post<Balance>(DaemonRPCMethod.GetBalanceAtTopoHeight, params)
  }

  getAssets() {
    return this.post<string[]>(DaemonRPCMethod.GetAssets)
  }

  countTransactions() {
    return this.post<number>(DaemonRPCMethod.CountTransactions)
  }

  countAssets() {
    return this.post<number>(DaemonRPCMethod.CountAssets)
  }

  getTips() {
    return this.post<string[]>(DaemonRPCMethod.GetTips)
  }

  p2pStatus() {
    return this.post<P2PStatusResult>(DaemonRPCMethod.P2PStatus)
  }

  getDAGOrder(params: TopoHeightRangeParams) {
    return this.post<string[]>(DaemonRPCMethod.GetDAGOrder, params)
  }

  getMemPool() {
    return this.post<Transaction[]>(DaemonRPCMethod.GetMempool)
  }

  getTransaction(hash: string) {
    return this.post<Transaction>(DaemonRPCMethod.GetTransaction, { hash })
  }

  getTransactions(txHashes: string[]) {
    return this.post<Transaction[]>(DaemonRPCMethod.GetTransactions, { tx_hashes: txHashes })
  }

  getBlocksRangeByTopoheight(params: TopoHeightRangeParams) {
    return this.post<Block[]>(DaemonRPCMethod.GetBlocksRangeByTopoheight, params)
  }

  getBlocksRangeByHeight(params: HeightRangeParams) {
    return this.post<Block[]>(DaemonRPCMethod.GetBlocksRangeByHeight, params)
  }

  getAccounts(params: GetAccountsParams) {
    return this.post<string[]>(DaemonRPCMethod.GetAccounts, params)
  }

  submitBlock(blockTemplate: string) {
    return this.post<boolean>(DaemonRPCMethod.SubmitBlock, { block_template: blockTemplate })
  }

  submitTransaction(hexData: string) {
    return this.post<boolean>(DaemonRPCMethod.SubmitTransaction, { data: hexData })
  }
}

export default RPC
