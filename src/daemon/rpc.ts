import { RPCMethod } from './types'
import * as types from './types'

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
    return this.post<types.GetInfoResult>(RPCMethod.GetInfo)
  }

  getDifficulty() {
    return this.post<types.GetDifficultyResult>(RPCMethod.GetDifficulty)
  }

  getTips() {
    return this.post<string[]>(RPCMethod.GetTips)
  }

  getDevFeeThresholds() {
    return this.post<types.DevFee[]>(RPCMethod.GetDevFeeThresholds)
  }

  getSizeOnDisk() {
    return this.post<types.DiskSize>(RPCMethod.GetSizeOnDisk)
  }

  getStableHeight() {
    return this.post<number>(RPCMethod.GetStableHeight)
  }

  getStableTopoheight() {
    return this.post<number>(RPCMethod.GetStableTopoheight)
  }

  getHardForks() {
    return this.post<types.HardFork[]>(RPCMethod.GetHardForks)
  }

  getBlockAtTopoheight(params: types.GetBlockAtTopoheightParams) {
    return this.post<types.Block>(RPCMethod.GetBlockAtTopoheight, params)
  }

  getBlocksAtHeight(params: types.GetBlocksAtHeightParams) {
    return this.post<types.Block[]>(RPCMethod.GetBlocksAtHeight, params)
  }

  getBlockByHash(params: types.GetBlockByHashParams) {
    return this.post<types.Block>(RPCMethod.GetBlockByHash, params)
  }

  getTopBlock(params?: types.GetTopBlockParams) {
    return this.post<types.Block>(RPCMethod.GetTopBlock, params)
  }

  getBalance(params: types.GetBalanceParams) {
    return this.post<types.GetBalanceResult>(RPCMethod.GetBalance, params)
  }

  getStableBalance(params: types.GetBalanceParams) {
    return this.post<types.GetStableBalanceResult>(RPCMethod.GetStableBalance, params)
  }

  hasBalance(params: types.HasBalanceParams) {
    return this.post<types.HasBalanceResult>(RPCMethod.HasBalance, params)
  }

  getBalanceAtTopoheight(params: types.GetBalanceAtTopoheightParams) {
    return this.post<types.VersionedBalance>(RPCMethod.GetBalanceAtTopoheight, params)
  }

  getNonce(params: types.GetNonceParams) {
    return this.post<types.GetNonceResult>(RPCMethod.GetNonce, params)
  }

  hasNonce(params: types.HasNonceParams) {
    return this.post<types.HasNonceResult>(RPCMethod.HasNonce, params)
  }

  getNonceAtTopoheight(params: types.GetNonceAtTopoheightParams) {
    return this.post<types.VersionedNonce>(RPCMethod.GetNonceAtTopoheight, params)
  }

  getAsset(params: types.GetAssetParams) {
    return this.post<types.AssetData>(RPCMethod.GetAsset, params)
  }

  getAssets(params: types.GetAssetsParams) {
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

  countContracts() {
    return this.post<number>(RPCMethod.CountContracts)
  }

  submitTransaction(hexData: string) {
    return this.post<boolean>(RPCMethod.SubmitTransaction, { data: hexData })
  }

  getTransationExecutor(hash: string) {
    return this.post<types.GetTransactionExecutorResult>(RPCMethod.GetTransactionExecutor, { hash })
  }

  getTransaction(hash: string) {
    return this.post<types.TransactionResponse>(RPCMethod.GetTransaction, { hash })
  }

  getTransactions(txHashes: string[]) {
    return this.post<types.TransactionResponse[]>(RPCMethod.GetTransactions, { tx_hashes: txHashes })
  }

  isTxExecutedInBlock(params: types.IsTxExecutedInBlockParams) {
    return this.post<boolean>(RPCMethod.IsTxExecutedInBlock, params)
  }

  p2pStatus() {
    return this.post<types.P2PStatusResult>(RPCMethod.P2PStatus)
  }

  getPeers() {
    return this.post<types.GetPeersResult>(RPCMethod.GetPeers)
  }

  getMemPool() {
    return this.post<types.TransactionResponse[]>(RPCMethod.GetMempool)
  }

  getMempoolCache(address: String) {
    return this.post<types.GetMempoolCacheResult>(RPCMethod.GetMempoolCache, { address })
  }

  getEstimatedFeeRates() {
    return this.post<types.FeeRatesEstimated>(RPCMethod.GetEstimatedFeeRates)
  }

  getDAGOrder(params?: types.TopoheightRangeParams) {
    return this.post<string[]>(RPCMethod.GetDAGOrder, params)
  }

  getBlocksRangeByTopoheight(params: types.TopoheightRangeParams) {
    return this.post<types.Block[]>(RPCMethod.GetBlocksRangeByTopoheight, params)
  }

  getBlocksRangeByHeight(params: types.HeightRangeParams) {
    return this.post<types.Block[]>(RPCMethod.GetBlocksRangeByHeight, params)
  }

  getAccountHistory(params: types.GetAccountHistoryParams) {
    return this.post<types.AccounHistory[]>(RPCMethod.GetAccountHistory, params)
  }

  getAccountAssets(address: string) {
    return this.post<string[]>(RPCMethod.GetAccountAssets, { address })
  }

  getAccounts(params: types.GetAccountsParams) {
    return this.post<string[]>(RPCMethod.GetAccounts, params)
  }

  isAccountRegistered(params: types.IsAccountRegisteredParams) {
    return this.post<boolean>(RPCMethod.IsAccountRegistered, params)
  }

  getAccountRegistrationTopoheight(address: String) {
    return this.post<Number>(RPCMethod.GetAccountRegistrationTopoheight, { address })
  }

  validateAddress(params: types.ValidateAddressParams) {
    return this.post<types.ValidateAddressResult>(RPCMethod.ValidateAddress, params)
  }

  splitAddress(params: types.SplitAddressParams) {
    return this.post<types.SplitAddressResult>(RPCMethod.SplitAddress, params)
  }

  extractKeyFromAddress(params: types.ExtractKeyFromAddressParams) {
    return this.post<string | number[]>(RPCMethod.ExtractKeyFromAddress, params)
  }

  makeIntegratedAddress(params: types.MakeIntegratedAddressParams) {
    return this.post<string>(RPCMethod.MakeIntegratedAddress, params)
  }

  decryptExtraData(params: types.DecryptExtraDataParams) {
    return this.post(RPCMethod.DecryptExtraData, params)
  }

  getMultisigAtTopoheight(params: types.GetMutilsigAtTopoheightParams) {
    return this.post<types.GetMutilsigAtTopoheightResult>(RPCMethod.GetMultisigAtTopoheight, params)
  }

  getMultisig(params: types.GetMultisigParams) {
    return this.post<types.GetMultisigResult>(RPCMethod.GetMultisig, params)
  }

  hasMultisig(params: types.HasMultisigParams) {
    return this.post<boolean>(RPCMethod.HasMultisig, params)
  }

  hasMultisigAtTopoheight(params: types.HasMultisigAtTopoheightParams) {
    return this.post<boolean>(RPCMethod.HasMultisigAtTopoheight, params)
  }

  getContractOutputs(params: types.GetContractOutputsParams) {
    return this.post<types.ContractOutput[]>(RPCMethod.GetContractOutputs, params)
  }

  getContractModule(params: types.GetContractModuleParams) {
    return this.post<types.GetContractModuleResult>(RPCMethod.GetContractModule, params)
  }

  getContractData(params: types.GetContractModuleParams) {
    return this.post(RPCMethod.GetContractData, params)
  }

  getContractDataAtTopoheight(params: types.GetContractDataAtTopoheightParams) {
    return this.post(RPCMethod.GetContractDataAtTopoheight, params)
  }

  getContractBalance(params: types.GetContractBalanceParams) {
    return this.post<types.GetContractBalanceResult>(RPCMethod.GetContractBalance, params)
  }

  getContractBalanceAtTopoheight(params: types.GetContractBalanceAtTopoheightParams) {
    return this.post<types.GetContractBalanceAtTopoheightResult>(RPCMethod.GetContractBalanceAtTopoheight, params)
  }

  getBlockTemplate(address: string) {
    return this.post<types.GetBlockTemplateResult>(RPCMethod.GetBlockTemplate, { address })
  }

  getMinerWork(params: types.GetMinerWorkParams) {
    return this.post<types.GetMinerWorkResult>(RPCMethod.GetMinerWork, params)
  }

  submitBlock(params: types.SubmitBlockParams) {
    return this.post<boolean>(RPCMethod.SubmitBlock, params)
  }
}

export default RPC
