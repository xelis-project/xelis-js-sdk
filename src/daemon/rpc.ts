import {
  Balance, Block, TopoHeightStartEndParams, GetInfoResult,
  GetLastBalanceResult, P2PStatusResult, RPCMethod, RPCResponse, Transaction, BalanceParams
} from './types'

class RPC {
  endpoint: string
  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async fetch<T>(method: RPCMethod, params?: any): Promise<RPCResponse<T>> {
    try {
      const body = JSON.stringify({ id: 1, jsonrpc: '2.0', method: method, params })
      const res = await fetch(this.endpoint, { method: `POST`, body })

      if (res.ok) {
        const data = await res.json()
        return Promise.resolve(data)
      } else {
        return Promise.reject(new Error(`${res.status} - ${res.statusText}`))
      }
    } catch (err) {
      return Promise.reject(err)
    }
  }

  getInfo() {
    return this.fetch<GetInfoResult>(RPCMethod.GetInfo)
  }

  getHeight() {
    return this.fetch<number>(RPCMethod.GetHeight)
  }

  getTopoHeight() {
    return this.fetch<number>(RPCMethod.GetTopoHeight)
  }

  getStableHeight() {
    return this.fetch<number>(RPCMethod.GetStableHeight)
  }

  getBlockTemplate(address: string) {
    return this.fetch<string>(RPCMethod.GetBlockTemplate, { address })
  }

  getBlockAtTopoHeight(topoHeight: number) {
    return this.fetch<Block>(RPCMethod.GetBlockAtTopoHeight, { topoheight: topoHeight })
  }

  getBlocksAtHeight(height: number) {
    return this.fetch<Block[]>(RPCMethod.GetBlocksAtHeight, { height })
  }

  getBlockByHash(hash: string) {
    return this.fetch<Block>(RPCMethod.GetBlockByHash, { hash })
  }

  getTopBlock() {
    return this.fetch<Block>(RPCMethod.GetTopBlock)
  }

  getNonce(address: string) {
    return this.fetch<number>(RPCMethod.GetNonce, { address })
  }

  getLastBalance(params: BalanceParams) {
    return this.fetch<GetLastBalanceResult>(RPCMethod.GetLastBalance, params)
  }

  getBalanceAtTopoHeight(params: BalanceParams) {
    return this.fetch<Balance>(RPCMethod.GetBalanceAtTopoHeight, params)
  }

  getAssets() {
    return this.fetch<string[]>(RPCMethod.GetAssets)
  }

  countTransactions() {
    return this.fetch<number>(RPCMethod.CountTransactions)
  }

  getTips() {
    return this.fetch<string[]>(RPCMethod.GetTips)
  }

  p2pStatus() {
    return this.fetch<P2PStatusResult>(RPCMethod.P2PStatus)
  }

  getDAGOrder(params: TopoHeightStartEndParams) {
    return this.fetch<string[]>(RPCMethod.GetDAGOrder, params)
  }

  getMemPool() {
    return this.fetch<Transaction[]>(RPCMethod.GetMempool)
  }

  getTransaction(hash: string) {
    return this.fetch<Transaction>(RPCMethod.GetTransaction, { hash })
  }

  getTransactions(txHashes: string[]) {
    return this.fetch<Transaction[]>(RPCMethod.GetTransactions, { tx_hashes: txHashes })
  }

  getBlocks(params: TopoHeightStartEndParams) {
    return this.fetch<Block[]>(RPCMethod.GetBlocks, params)
  }
}

export default RPC
