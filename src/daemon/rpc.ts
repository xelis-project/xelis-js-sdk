import {
  Block, TopoHeightRangeParams, GetInfoResult, HeightRangeParams,
  GetBalanceResult, P2PStatusResult, RPCMethod, GetBalanceParams,
  GetBalanceAtTopoHeightParams, GetAccountsParams, GetBlockAtTopoHeightParams, GetBlockByHashParams,
  GetBlocksAtHeightParams, GetTopBlockParams, GetNonceResult, GetNonceParams, GetAccountHistoryParams,
  AccounHistory, DevFee, DiskSize, HasBalanceParams, HasBalanceResult, AssetData, IsTxExecutedInBlockParams,
  GetAssetParams, GetPeersResult, GetBlockTemplateResult, VersionedBalance, VersionedNonce,
  GetNonceAtTopoheightParams, HasNonceParams, HasNonceResult, TransactionResponse,
  IsAccountRegisteredParams, GetMempoolCacheResult, GetDifficultyResult, ValidateAddressParams,
  ExtractKeyFromAddressParams
} from './types'

import { RPC as BaseRPC } from '../lib/rpc'

export class RPC extends BaseRPC {
  getVersion() {
    return this.post<string>(RPCMethod.GetVersion)
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
    return this.post<GetBlockTemplateResult>(RPCMethod.GetBlockTemplate, { address })
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

  submitBlock(blockTemplate: string) {
    return this.post<boolean>(RPCMethod.SubmitBlock, { block_template: blockTemplate })
  }

  getBalance(params: GetBalanceParams) {
    return this.post<GetBalanceResult>(RPCMethod.GetBalance, params)
  }

  hasBalance(params: HasBalanceParams) {
    return this.post<HasBalanceResult>(RPCMethod.HasBalance, params)
  }

  getBalanceAtTopoHeight(params: GetBalanceAtTopoHeightParams) {
    return this.post<VersionedBalance>(RPCMethod.GetBalanceAtTopoHeight, params)
  }

  getInfo() {
    return this.post<GetInfoResult>(RPCMethod.GetInfo)
  }

  getNonce(params: GetNonceParams) {
    return this.post<GetNonceResult>(RPCMethod.GetNonce, params)
  }

  hasNonce(params: HasNonceParams) {
    return this.post<HasNonceResult>(RPCMethod.HasNonce, params)
  }

  getNonceAtTopoheight(params: GetNonceAtTopoheightParams) {
    return this.post<VersionedNonce>(RPCMethod.GetNonceAtTopoheight, params)
  }

  getAsset(params: GetAssetParams) {
    return this.post<AssetData>(RPCMethod.GetAsset, params)
  }

  getAssets() {
    return this.post<string[]>(RPCMethod.GetAssets)
  }

  countAssets() {
    return this.post<number>(RPCMethod.CountAssets)
  }

  countAccounts() {
    return this.post<number>(RPCMethod.CountAccounts)
  }

  countTransactions() {
    return this.post<number>(RPCMethod.CountTransactions)
  }

  submitTransaction(hexData: string) {
    return this.post<boolean>(RPCMethod.SubmitTransaction, { data: hexData })
  }

  getTransaction(hash: string) {
    return this.post<TransactionResponse>(RPCMethod.GetTransaction, { hash })
  }

  p2pStatus() {
    return this.post<P2PStatusResult>(RPCMethod.P2PStatus)
  }

  getPeers() {
    return this.post<GetPeersResult>(RPCMethod.GetPeers)
  }

  getMemPool() {
    return this.post<TransactionResponse[]>(RPCMethod.GetMempool)
  }

  getTips() {
    return this.post<string[]>(RPCMethod.GetTips)
  }

  getDAGOrder(params: TopoHeightRangeParams) {
    return this.post<string[]>(RPCMethod.GetDAGOrder, params)
  }

  getBlocksRangeByTopoheight(params: TopoHeightRangeParams) {
    return this.post<Block[]>(RPCMethod.GetBlocksRangeByTopoheight, params)
  }

  getBlocksRangeByHeight(params: HeightRangeParams) {
    return this.post<Block[]>(RPCMethod.GetBlocksRangeByHeight, params)
  }

  getTransactions(txHashes: string[]) {
    return this.post<TransactionResponse[]>(RPCMethod.GetTransactions, { tx_hashes: txHashes })
  }

  getAccountHistory(params: GetAccountHistoryParams) {
    return this.post<AccounHistory[]>(RPCMethod.GetAccountHistory, params)
  }

  getAccountAssets(address: string) {
    return this.post<string[]>(RPCMethod.GetAccountAssets, { address })
  }

  getAccounts(params: GetAccountsParams) {
    return this.post<string[]>(RPCMethod.GetAccounts, params)
  }

  isTxExecutedInBlock(params: IsTxExecutedInBlockParams) {
    return this.post<boolean>(RPCMethod.IsTxExecutedInBlock, params)
  }

  getDevFeeThresholds() {
    return this.post<DevFee[]>(RPCMethod.GetDevFeeThresholds)
  }

  getSizeOnDisk() {
    return this.post<DiskSize>(RPCMethod.GetSizeOnDisk)
  }

  getAccountRegistrationTopoheight(address: String) {
    return this.post<Number>(RPCMethod.GetAccountRegistrationTopoheight, { address })
  }

  isAccountRegistered(params: IsAccountRegisteredParams) {
    return this.post<boolean>(RPCMethod.IsAccountRegistered, params)
  }

  getMempoolCache(address: String) {
    return this.post<GetMempoolCacheResult>(RPCMethod.GetMempoolCache, { address })
  }

  getDifficulty() {
    return this.post<GetDifficultyResult>(RPCMethod.GetDifficulty)
  }

  validateAddress(params: ValidateAddressParams) {
    return this.post<boolean>(RPCMethod.ValidateAddress, params)
  }

  extractKeyFromAddress(params: ExtractKeyFromAddressParams) {
    return this.post<string | number[]>(RPCMethod.ExtractKeyFromAddress, params)
  }
}

export default RPC
