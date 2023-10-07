import {
  Balance, Block, TopoHeightRangeParams, GetInfoResult, HeightRangeParams,
  GetLastBalanceResult, P2PStatusResult, RPCMethod, RPCResponse, Transaction, GetLastBalanceParams,
  GetBalanceAtTopoHeightParams, GetAccountsParams, GetBlockAtTopoHeightParams, GetBlockByHashParams,
  GetBlocksAtHeightParams, GetTopBlockParams
} from './types'

class RPC {
  endpoint: string
  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async post<T>(method: RPCMethod, params?: any): Promise<RPCResponse<T>> {
    try {
      const body = JSON.stringify({ id: 1, jsonrpc: '2.0', method: method, params })
      const res = await fetch(this.endpoint, { method: `POST`, body })

      if (res.ok) {
        const data = await res.json() as RPCResponse<T>

        if (data.error) {
          return Promise.reject(new Error(data.error.message))
        }

        return Promise.resolve(data)
      } else {
        return Promise.reject(new Error(`${res.status} - ${res.statusText}`))
      }
    } catch (err) {
      return Promise.reject(err)
    }
  }

  getVersion() {
    return this.post<string>(RPCMethod.GetVersion)
  }

  getInfo() {
    return this.post<GetInfoResult>(RPCMethod.GetInfo)
  }

  getHeight() {
    return this.post<number>(RPCMethod.GetHeight)
  }

  getTopoHeight() {
    return this.post<number>(RPCMethod.GetTopoHeight)
  }

  getStableHeight() {
    return this.post<number>(RPCMethod.GetStableHeight)
  }

  getBlockTemplate(address: string) {
    return this.post<string>(RPCMethod.GetBlockTemplate, { address })
  }

  getBlockAtTopoHeight(params: GetBlockAtTopoHeightParams) {
    return this.post<Block>(RPCMethod.GetBlockAtTopoHeight, params)
  }

  getBlocksAtHeight(params: GetBlocksAtHeightParams) {
    return this.post<Block[]>(RPCMethod.GetBlocksAtHeight, params)
  }

  getBlockByHash(params: GetBlockByHashParams) {
    return this.post<Block>(RPCMethod.GetBlockByHash, params)
  }

  getTopBlock(params: GetTopBlockParams) {
    return this.post<Block>(RPCMethod.GetTopBlock, params)
  }

  getNonce(address: string) {
    return this.post<number>(RPCMethod.GetNonce, { address })
  }

  getLastBalance(params: GetLastBalanceParams) {
    return this.post<GetLastBalanceResult>(RPCMethod.GetLastBalance, params)
  }

  getBalanceAtTopoHeight(params: GetBalanceAtTopoHeightParams) {
    return this.post<Balance>(RPCMethod.GetBalanceAtTopoHeight, params)
  }

  getAssets() {
    return this.post<string[]>(RPCMethod.GetAssets)
  }

  countTransactions() {
    return this.post<number>(RPCMethod.CountTransactions)
  }

  countAssets() {
    return this.post<number>(RPCMethod.CountAssets)
  }

  getTips() {
    return this.post<string[]>(RPCMethod.GetTips)
  }

  p2pStatus() {
    return this.post<P2PStatusResult>(RPCMethod.P2PStatus)
  }

  getDAGOrder(params: TopoHeightRangeParams) {
    return this.post<string[]>(RPCMethod.GetDAGOrder, params)
  }

  getMemPool() {
    return this.post<Transaction[]>(RPCMethod.GetMempool)
  }

  getTransaction(hash: string) {
    return this.post<Transaction>(RPCMethod.GetTransaction, { hash })
  }

  getTransactions(txHashes: string[]) {
    return this.post<Transaction[]>(RPCMethod.GetTransactions, { tx_hashes: txHashes })
  }

  getBlocksRangeByTopoheight(params: TopoHeightRangeParams) {
    return this.post<Block[]>(RPCMethod.GetBlocksRangeByTopoheight, params)
  }

  getBlocksRangeByHeight(params: HeightRangeParams) {
    return this.post<Block[]>(RPCMethod.GetBlocksRangeByHeight, params)
  }

  getAccounts(params: GetAccountsParams) {
    return this.post<string[]>(RPCMethod.GetAccounts, params)
  }

  submitBlock(blockTemplate: string) {
    return this.post<boolean>(RPCMethod.SubmitBlock, { block_template: blockTemplate })
  }

  submitTransaction(hexData: string) {
    return this.post<boolean>(RPCMethod.SubmitTransaction, { data: hexData })
  }
}

export default RPC
