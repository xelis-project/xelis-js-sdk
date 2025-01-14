import {
  Block, TopoheightRangeParams, GetInfoResult, HeightRangeParams,
  GetBalanceResult, P2PStatusResult, RPCMethod, GetBalanceParams,
  GetBalanceAtTopoheightParams, GetAccountsParams, GetBlockAtTopoheightParams, GetBlockByHashParams,
  GetBlocksAtHeightParams, GetTopBlockParams, GetNonceResult, GetNonceParams, GetAccountHistoryParams,
  AccounHistory, DevFee, DiskSize, HasBalanceParams, HasBalanceResult, AssetData, IsTxExecutedInBlockParams,
  GetAssetParams, GetPeersResult, GetBlockTemplateResult, VersionedBalance, VersionedNonce,
  GetNonceAtTopoheightParams, HasNonceParams, HasNonceResult, TransactionResponse,
  IsAccountRegisteredParams, GetMempoolCacheResult, GetDifficultyResult, ValidateAddressParams,
  ExtractKeyFromAddressParams, SubmitBlockParams, GetMinerWorkParams, GetMinerWorkResult,
  ValidateAddressResult, GetStableBalanceResult, GetAssetsParams, SplitAddressParams, SplitAddressResult,
  HardFork, GetTransactionExecutorResult
} from './types'

import { RPC as BaseRPC } from '../lib/rpc'

export class RPC extends BaseRPC {
  getVersion() {
    return this.post<string>(RPCMethod.GetVersion)
  }

  getHeight() {
    return this.post<number>(RPCMethod.GetHeight)
  }

  getTopoheight() {
    return this.post<number>(RPCMethod.GetTopoheight)
  }

  getPrunedTopoheight() {
    return this.post<number>(RPCMethod.GetPrunedTopoheight)
  }

  getInfo() {
    return this.post<GetInfoResult>(RPCMethod.GetInfo)
  }

  getDifficulty() {
    return this.post<GetDifficultyResult>(RPCMethod.GetDifficulty)
  }

  getTips() {
    return this.post<string[]>(RPCMethod.GetTips)
  }

  getDevFeeThresholds() {
    return this.post<DevFee[]>(RPCMethod.GetDevFeeThresholds)
  }

  getSizeOnDisk() {
    return this.post<DiskSize>(RPCMethod.GetSizeOnDisk)
  }

  getStableHeight() {
    return this.post<number>(RPCMethod.GetStableHeight)
  }

  getStableTopoheight() {
    return this.post<number>(RPCMethod.GetStableTopoheight)
  }

  getHardForks() {
    return this.post<HardFork[]>(RPCMethod.GetHardForks)
  }

  getBlockAtTopoheight(params: GetBlockAtTopoheightParams) {
    return this.post<Block>(RPCMethod.GetBlockAtTopoheight, params)
  }

  getBlocksAtHeight(params: GetBlocksAtHeightParams) {
    return this.post<Block[]>(RPCMethod.GetBlocksAtHeight, params)
  }

  getBlockByHash(params: GetBlockByHashParams) {
    return this.post<Block>(RPCMethod.GetBlockByHash, params)
  }

  getTopBlock(params?: GetTopBlockParams) {
    return this.post<Block>(RPCMethod.GetTopBlock, params)
  }

  getBalance(params: GetBalanceParams) {
    return this.post<GetBalanceResult>(RPCMethod.GetBalance, params)
  }

  getStableBalance(params: GetBalanceParams) {
    return this.post<GetStableBalanceResult>(RPCMethod.GetStableBalance, params)
  }

  hasBalance(params: HasBalanceParams) {
    return this.post<HasBalanceResult>(RPCMethod.HasBalance, params)
  }

  getBalanceAtTopoheight(params: GetBalanceAtTopoheightParams) {
    return this.post<VersionedBalance>(RPCMethod.GetBalanceAtTopoheight, params)
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

  getAssets(params: GetAssetsParams) {
    return this.post<string[]>(RPCMethod.GetAssets, params)
  }

  countAssets() {
    return this.post<number>(RPCMethod.CountAssets)
  }

  countTransactions() {
    return this.post<number>(RPCMethod.CountTransactions)
  }

  countAccounts() {
    return this.post<number>(RPCMethod.CountAccounts)
  }

  submitTransaction(hexData: string) {
    return this.post<boolean>(RPCMethod.SubmitTransaction, { data: hexData })
  }

  getTransationExecutor(hash: string) {
    return this.post<GetTransactionExecutorResult>(RPCMethod.GetTransactionExecutor, { hash })
  }

  getTransaction(hash: string) {
    return this.post<TransactionResponse>(RPCMethod.GetTransaction, { hash })
  }

  getTransactions(txHashes: string[]) {
    return this.post<TransactionResponse[]>(RPCMethod.GetTransactions, { tx_hashes: txHashes })
  }

  isTxExecutedInBlock(params: IsTxExecutedInBlockParams) {
    return this.post<boolean>(RPCMethod.IsTxExecutedInBlock, params)
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

  getMempoolCache(address: String) {
    return this.post<GetMempoolCacheResult>(RPCMethod.GetMempoolCache, { address })
  }

  getDAGOrder(params?: TopoheightRangeParams) {
    return this.post<string[]>(RPCMethod.GetDAGOrder, params)
  }

  getBlocksRangeByTopoheight(params: TopoheightRangeParams) {
    return this.post<Block[]>(RPCMethod.GetBlocksRangeByTopoheight, params)
  }

  getBlocksRangeByHeight(params: HeightRangeParams) {
    return this.post<Block[]>(RPCMethod.GetBlocksRangeByHeight, params)
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

  isAccountRegistered(params: IsAccountRegisteredParams) {
    return this.post<boolean>(RPCMethod.IsAccountRegistered, params)
  }

  getAccountRegistrationTopoheight(address: String) {
    return this.post<Number>(RPCMethod.GetAccountRegistrationTopoheight, { address })
  }

  validateAddress(params: ValidateAddressParams) {
    return this.post<ValidateAddressResult>(RPCMethod.ValidateAddress, params)
  }

  splitAddress(params: SplitAddressParams) {
    return this.post<SplitAddressResult>(RPCMethod.SplitAddress, params)
  }

  extractKeyFromAddress(params: ExtractKeyFromAddressParams) {
    return this.post<string | number[]>(RPCMethod.ExtractKeyFromAddress, params)
  }

  getBlockTemplate(address: string) {
    return this.post<GetBlockTemplateResult>(RPCMethod.GetBlockTemplate, { address })
  }

  getMinerWork(params: GetMinerWorkParams) {
    return this.post<GetMinerWorkResult>(RPCMethod.GetMinerWork, params)
  }

  submitBlock(params: SubmitBlockParams) {
    return this.post<boolean>(RPCMethod.SubmitBlock, params)
  }
}

export default RPC
