import {
  Balance, Block, TopoHeightRangeParams, GetInfoResult, HeightRangeParams,
  GetBalanceResult, P2PStatusResult, RPCMethod, Transaction, GetBalanceParams,
  GetBalanceAtTopoHeightParams, GetAccountsParams, GetBlockAtTopoHeightParams, GetBlockByHashParams,
  GetBlocksAtHeightParams, GetTopBlockParams, GetNonceResult, GetNonceParams, GetAccountHistoryParams,
  AccounHistory, Peer, DevFee, DiskSize, HasBalanceParams, HasBalanceResult, AssetData, IsTxExecutedInBlockParams, GetAssetParams
} from './types'

import { RPC as BaseRPC } from '../lib/rpc'

export class RPC extends BaseRPC {
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

  getNonce(params: GetNonceParams) {
    return this.post<GetNonceResult>(RPCMethod.GetNonce, params)
  }

  getBalance(params: GetBalanceParams) {
    return this.post<GetBalanceResult>(RPCMethod.GetBalance, params)
  }

  hasBalance(params: HasBalanceParams) {
    return this.post<HasBalanceResult>(RPCMethod.HasBalance, params)
  }

  getBalanceAtTopoHeight(params: GetBalanceAtTopoHeightParams) {
    return this.post<Balance>(RPCMethod.GetBalanceAtTopoHeight, params)
  }

  getAsset(params: GetAssetParams) {
    return this.post<AssetData>(RPCMethod.GetAsset, params)
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

  countAccounts() {
    return this.post<number>(RPCMethod.CountAccounts)
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

  getAccountHistory(params: GetAccountHistoryParams) {
    return this.post<AccounHistory[]>(RPCMethod.GetAccountHistory, params)
  }

  getAccountAssets(address: string) {
    return this.post<string[]>(RPCMethod.GetAccountAssets, { address })
  }

  getPeers() {
    return this.post<Peer[]>(RPCMethod.GetPeers)
  }

  getDevFeeThresholds() {
    return this.post<DevFee[]>(RPCMethod.GetDevFeeThresholds)
  }

  getSizeOnDisk() {
    return this.post<DiskSize>(RPCMethod.GetSizeOnDisk)
  }

  isTxExecutedInBlock(params: IsTxExecutedInBlockParams) {
    return this.post<boolean>(RPCMethod.IsTxExecutedInBlock, params)
  }
}

export default RPC
