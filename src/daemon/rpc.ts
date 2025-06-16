import { RPCMethod } from './types'
import * as types from './types'

import { HttpRPC } from '../rpc/http'

export class RPC extends HttpRPC {
  getVersion() {
    return this.request<string>(RPCMethod.GetVersion)
  }

  getHeight() {
    return this.request<number>(RPCMethod.GetHeight)
  }

  getTopoheight() {
    return this.request<number>(RPCMethod.GetTopoheight)
  }

  getPrunedTopoheight() {
    return this.request<number>(RPCMethod.GetPrunedTopoheight)
  }

  getInfo() {
    return this.request<types.GetInfoResult>(RPCMethod.GetInfo)
  }

  getDifficulty() {
    return this.request<types.GetDifficultyResult>(RPCMethod.GetDifficulty)
  }

  getTips() {
    return this.request<string[]>(RPCMethod.GetTips)
  }

  getDevFeeThresholds() {
    return this.request<types.DevFee[]>(RPCMethod.GetDevFeeThresholds)
  }

  getSizeOnDisk() {
    return this.request<types.DiskSize>(RPCMethod.GetSizeOnDisk)
  }

  getStableHeight() {
    return this.request<number>(RPCMethod.GetStableHeight)
  }

  getStableTopoheight() {
    return this.request<number>(RPCMethod.GetStableTopoheight)
  }

  getHardForks() {
    return this.request<types.HardFork[]>(RPCMethod.GetHardForks)
  }

  getBlockAtTopoheight(params: types.GetBlockAtTopoheightParams) {
    return this.request<types.Block>(RPCMethod.GetBlockAtTopoheight, params)
  }

  getBlocksAtHeight(params: types.GetBlocksAtHeightParams) {
    return this.request<types.Block[]>(RPCMethod.GetBlocksAtHeight, params)
  }

  getBlockByHash(params: types.GetBlockByHashParams) {
    return this.request<types.Block>(RPCMethod.GetBlockByHash, params)
  }

  getTopBlock(params?: types.GetTopBlockParams) {
    return this.request<types.Block>(RPCMethod.GetTopBlock, params)
  }

  getBalance(params: types.GetBalanceParams) {
    return this.request<types.GetBalanceResult>(RPCMethod.GetBalance, params)
  }

  getStableBalance(params: types.GetBalanceParams) {
    return this.request<types.GetStableBalanceResult>(RPCMethod.GetStableBalance, params)
  }

  hasBalance(params: types.HasBalanceParams) {
    return this.request<types.HasBalanceResult>(RPCMethod.HasBalance, params)
  }

  getBalanceAtTopoheight(params: types.GetBalanceAtTopoheightParams) {
    return this.request<types.VersionedBalance>(RPCMethod.GetBalanceAtTopoheight, params)
  }

  getNonce(params: types.GetNonceParams) {
    return this.request<types.GetNonceResult>(RPCMethod.GetNonce, params)
  }

  hasNonce(params: types.HasNonceParams) {
    return this.request<types.HasNonceResult>(RPCMethod.HasNonce, params)
  }

  getNonceAtTopoheight(params: types.GetNonceAtTopoheightParams) {
    return this.request<types.VersionedNonce>(RPCMethod.GetNonceAtTopoheight, params)
  }

  getAsset(params: types.GetAssetParams) {
    return this.request<types.AssetData>(RPCMethod.GetAsset, params)
  }

  getAssets(params: types.GetAssetsParams) {
    return this.request<string[]>(RPCMethod.GetAssets, params)
  }

  countAssets() {
    return this.request<number>(RPCMethod.CountAssets)
  }

  countTransactions() {
    return this.request<number>(RPCMethod.CountTransactions)
  }

  countAccounts() {
    return this.request<number>(RPCMethod.CountAccounts)
  }

  countContracts() {
    return this.request<number>(RPCMethod.CountContracts)
  }

  submitTransaction(hexData: string) {
    return this.request<boolean>(RPCMethod.SubmitTransaction, { data: hexData })
  }

  getTransationExecutor(hash: string) {
    return this.request<types.GetTransactionExecutorResult>(RPCMethod.GetTransactionExecutor, { hash })
  }

  getTransaction(hash: string) {
    return this.request<types.TransactionResponse>(RPCMethod.GetTransaction, { hash })
  }

  getTransactions(txHashes: string[]) {
    return this.request<types.TransactionResponse[]>(RPCMethod.GetTransactions, { tx_hashes: txHashes })
  }

  isTxExecutedInBlock(params: types.IsTxExecutedInBlockParams) {
    return this.request<boolean>(RPCMethod.IsTxExecutedInBlock, params)
  }

  p2pStatus() {
    return this.request<types.P2PStatusResult>(RPCMethod.P2PStatus)
  }

  getPeers() {
    return this.request<types.GetPeersResult>(RPCMethod.GetPeers)
  }

  getMemPool(params?: types.GetMempoolParams) {
    return this.request<types.GetMempoolResult>(RPCMethod.GetMempool, params)
  }

  getMempoolSummary(params?: types.GetMempoolParams) {
    return this.request<types.GetMempoolSummaryResult>(RPCMethod.GetMempoolSummary, params)
  }

  getMempoolCache(address: String) {
    return this.request<types.GetMempoolCacheResult>(RPCMethod.GetMempoolCache, { address })
  }

  getEstimatedFeeRates() {
    return this.request<types.FeeRatesEstimated>(RPCMethod.GetEstimatedFeeRates)
  }

  getDAGOrder(params?: types.TopoheightRangeParams) {
    return this.request<string[]>(RPCMethod.GetDAGOrder, params)
  }

  getBlocksRangeByTopoheight(params: types.TopoheightRangeParams) {
    return this.request<types.Block[]>(RPCMethod.GetBlocksRangeByTopoheight, params)
  }

  getBlocksRangeByHeight(params: types.HeightRangeParams) {
    return this.request<types.Block[]>(RPCMethod.GetBlocksRangeByHeight, params)
  }

  getAccountHistory(params: types.GetAccountHistoryParams) {
    return this.request<types.AccounHistory[]>(RPCMethod.GetAccountHistory, params)
  }

  getAccountAssets(address: string) {
    return this.request<string[]>(RPCMethod.GetAccountAssets, { address })
  }

  getAccounts(params: types.GetAccountsParams) {
    return this.request<string[]>(RPCMethod.GetAccounts, params)
  }

  isAccountRegistered(params: types.IsAccountRegisteredParams) {
    return this.request<boolean>(RPCMethod.IsAccountRegistered, params)
  }

  getAccountRegistrationTopoheight(address: String) {
    return this.request<Number>(RPCMethod.GetAccountRegistrationTopoheight, { address })
  }

  validateAddress(params: types.ValidateAddressParams) {
    return this.request<types.ValidateAddressResult>(RPCMethod.ValidateAddress, params)
  }

  splitAddress(params: types.SplitAddressParams) {
    return this.request<types.SplitAddressResult>(RPCMethod.SplitAddress, params)
  }

  extractKeyFromAddress(params: types.ExtractKeyFromAddressParams) {
    return this.request<string | number[]>(RPCMethod.ExtractKeyFromAddress, params)
  }

  makeIntegratedAddress(params: types.MakeIntegratedAddressParams) {
    return this.request<string>(RPCMethod.MakeIntegratedAddress, params)
  }

  decryptExtraData(params: types.DecryptExtraDataParams) {
    return this.request(RPCMethod.DecryptExtraData, params)
  }

  getMultisigAtTopoheight(params: types.GetMutilsigAtTopoheightParams) {
    return this.request<types.GetMutilsigAtTopoheightResult>(RPCMethod.GetMultisigAtTopoheight, params)
  }

  getMultisig(params: types.GetMultisigParams) {
    return this.request<types.GetMultisigResult>(RPCMethod.GetMultisig, params)
  }

  hasMultisig(params: types.HasMultisigParams) {
    return this.request<boolean>(RPCMethod.HasMultisig, params)
  }

  hasMultisigAtTopoheight(params: types.HasMultisigAtTopoheightParams) {
    return this.request<boolean>(RPCMethod.HasMultisigAtTopoheight, params)
  }

  getContractOutputs(params: types.GetContractOutputsParams) {
    return this.request<types.ContractOutput[]>(RPCMethod.GetContractOutputs, params)
  }

  getContractModule(params: types.GetContractModuleParams) {
    return this.request<types.GetContractModuleResult>(RPCMethod.GetContractModule, params)
  }

  getContractData(params: types.GetContractModuleParams) {
    return this.request(RPCMethod.GetContractData, params)
  }

  getContractDataAtTopoheight(params: types.GetContractDataAtTopoheightParams) {
    return this.request(RPCMethod.GetContractDataAtTopoheight, params)
  }

  getContractBalance(params: types.GetContractBalanceParams) {
    return this.request<types.GetContractBalanceResult>(RPCMethod.GetContractBalance, params)
  }

  getContractBalanceAtTopoheight(params: types.GetContractBalanceAtTopoheightParams) {
    return this.request<types.GetContractBalanceAtTopoheightResult>(RPCMethod.GetContractBalanceAtTopoheight, params)
  }

  getBlockTemplate(address: string) {
    return this.request<types.GetBlockTemplateResult>(RPCMethod.GetBlockTemplate, { address })
  }

  getMinerWork(params: types.GetMinerWorkParams) {
    return this.request<types.GetMinerWorkResult>(RPCMethod.GetMinerWork, params)
  }

  submitBlock(params: types.SubmitBlockParams) {
    return this.request<boolean>(RPCMethod.SubmitBlock, params)
  }
}

export default RPC
