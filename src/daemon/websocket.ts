import { MessageEvent } from 'ws'
import { RPCMethod, RPCEvent } from './types'
import * as types from './types'
import { WSRPC } from '../rpc/websocket'

export interface DaemonEventsData {
  [RPCEvent.NewBlock]: types.Block
  [RPCEvent.BlockOrdered]: types.BlockOrdered
  [RPCEvent.BlockOrphaned]: types.BlockOrphaned
  [RPCEvent.StableHeightChanged]: types.StableHeightChanged
  [RPCEvent.StableTopoHeightChanged]: types.StableTopoHeightChanged
  [RPCEvent.TransactionOrphaned]: types.TransactionResponse
  [RPCEvent.TransactionAddedInMempool]: types.MempoolTransactionSummary
  [RPCEvent.TransactionExecuted]: types.TransactionExecuted
  [RPCEvent.InvokeContract]: types.InvokeContract
  [RPCEvent.ContractTransfer]: types.ContractTransfer
  [RPCEvent.ContractEvent]: types.ContractEvent
  [RPCEvent.DeployContract]: types.NewContract
  [RPCEvent.NewAsset]: types.AssetWithData
  [RPCEvent.PeerConnected]: types.Peer
  [RPCEvent.PeerDisconnected]: string
  [RPCEvent.PeerStateUpdated]: types.Peer
  [RPCEvent.PeerPeerListUpdated]: types.PeerPeerListUpdated
  [RPCEvent.PeerPeerDisconnected]: types.PeerPeerDisconnected
  [RPCEvent.NewBlockTemplate]: types.GetBlockTemplateResult
}

export class DaemonMethods {
  ws: WSRPC
  prefix: string

  constructor(ws: WSRPC, prefix: string = "") {
    this.ws = ws
    this.prefix = prefix
  }

  dataCall<T>(method: string, params?: any): Promise<T> {
    return this.ws.dataCall(this.prefix + method, params)
  }

  closeListener<K extends keyof DaemonEventsData>(event: K, listener: (data?: DaemonEventsData[K], err?: Error) => void) {
    this.ws.closeListener(event, listener)
  }

  listen<K extends keyof DaemonEventsData>(event: K, listener: (data?: DaemonEventsData[K], err?: Error) => void) {
    this.ws.listen(this.prefix + event, listener)
  }

  getVersion() {
    return this.dataCall<string>(RPCMethod.GetVersion)
  }

  getHeight() {
    return this.dataCall<number>(RPCMethod.GetHeight)
  }

  getTopoheight() {
    return this.dataCall<number>(RPCMethod.GetTopoheight)
  }

  getPrunedTopoheight() {
    return this.dataCall<number>(RPCMethod.GetPrunedTopoheight)
  }

  getInfo() {
    return this.dataCall<types.GetInfoResult>(RPCMethod.GetInfo)
  }

  getDifficulty() {
    return this.dataCall<types.GetDifficultyResult>(RPCMethod.GetDifficulty)
  }

  getTips() {
    return this.dataCall<string[]>(RPCMethod.GetTips)
  }

  getDevFeeThresholds() {
    return this.dataCall<types.DevFee[]>(RPCMethod.GetDevFeeThresholds)
  }

  getSizeOnDisk() {
    return this.dataCall<types.DiskSize>(RPCMethod.GetSizeOnDisk)
  }

  getStableHeight() {
    return this.dataCall<number>(RPCMethod.GetStableHeight)
  }

  getStableTopoheight() {
    return this.dataCall<number>(RPCMethod.GetStableTopoheight)
  }

  getHardForks() {
    return this.dataCall<types.HardFork[]>(RPCMethod.GetHardForks)
  }

  getBlockAtTopoheight(params: types.GetBlockAtTopoheightParams) {
    return this.dataCall<types.Block>(RPCMethod.GetBlockAtTopoheight, params)
  }

  getBlocksAtHeight(params: types.GetBlocksAtHeightParams) {
    return this.dataCall<types.Block[]>(RPCMethod.GetBlocksAtHeight, params)
  }

  getBlockByHash(params: types.GetBlockByHashParams) {
    return this.dataCall<types.Block>(RPCMethod.GetBlockByHash, params)
  }

  getTopBlock(params: types.GetTopBlockParams) {
    return this.dataCall<types.Block>(RPCMethod.GetTopBlock, params)
  }

  getBalance(params: types.GetBalanceParams) {
    return this.dataCall<types.GetBalanceResult>(RPCMethod.GetBalance, params)
  }

  getStableBalance(params: types.GetBalanceParams) {
    return this.dataCall<types.GetStableBalanceResult>(RPCMethod.GetStableBalance, params)
  }

  hasBalance(params: types.HasBalanceParams) {
    return this.dataCall<types.HasBalanceResult>(RPCMethod.HasBalance, params)
  }

  getBalanceAtTopoheight(params: types.GetBalanceAtTopoheightParams) {
    return this.dataCall<types.VersionedBalance>(RPCMethod.GetBalanceAtTopoheight, params)
  }

  getNonce(params: types.GetNonceParams) {
    return this.dataCall<types.GetNonceResult>(RPCMethod.GetNonce, params)
  }

  hasNonce(params: types.HasNonceParams) {
    return this.dataCall<types.HasNonceResult>(RPCMethod.HasNonce, params)
  }

  getNonceAtTopoheight(params: types.GetNonceAtTopoheightParams) {
    return this.dataCall<types.VersionedNonce>(RPCMethod.GetNonceAtTopoheight, params)
  }

  getAsset(params: types.GetAssetParams) {
    return this.dataCall<types.AssetData>(RPCMethod.GetAsset, params)
  }

  getAssets(params?: types.GetAssetsParams) {
    return this.dataCall<string[]>(RPCMethod.GetAssets, params)
  }

  countAssets() {
    return this.dataCall<number>(RPCMethod.CountAssets)
  }

  countTransactions() {
    return this.dataCall<number>(RPCMethod.CountTransactions)
  }

  countAccounts() {
    return this.dataCall<number>(RPCMethod.CountAccounts)
  }

  countContracts() {
    return this.dataCall<number>(RPCMethod.CountContracts)
  }

  submitTransaction(hexData: string) {
    return this.dataCall<boolean>(RPCMethod.SubmitTransaction, { data: hexData })
  }

  getTransactionExecutor(hash: string) {
    return this.dataCall<types.GetTransactionExecutorResult>(RPCMethod.GetTransactionExecutor, { hash })
  }

  getTransaction(hash: string) {
    return this.dataCall<types.TransactionResponse>(RPCMethod.GetTransaction, { hash })
  }

  getTransactions(txHashes: string[]) {
    return this.dataCall<types.TransactionResponse[]>(RPCMethod.GetTransactions, { tx_hashes: txHashes })
  }

  isTxExecutedInBlock(params: types.IsTxExecutedInBlockParams) {
    return this.dataCall<boolean>(RPCMethod.IsTxExecutedInBlock, params)
  }

  p2pStatus() {
    return this.dataCall<types.P2PStatusResult>(RPCMethod.P2PStatus)
  }

  getPeers() {
    return this.dataCall<types.GetPeersResult>(RPCMethod.GetPeers)
  }

  getMemPool(params?: types.GetMempoolParams) {
    return this.dataCall<types.GetMempoolResult>(RPCMethod.GetMempool, params)
  }

  getMempoolSummary(params?: types.GetMempoolParams) {
    return this.dataCall<types.GetMempoolSummaryResult>(RPCMethod.GetMempoolSummary, params)
  }

  getMempoolCache(address: string) {
    return this.dataCall<types.GetMempoolCacheResult>(RPCMethod.GetMempoolCache, { address })
  }

  getEstimatedFeeRates() {
    return this.dataCall<types.FeeRatesEstimated>(RPCMethod.GetEstimatedFeeRates)
  }

  getDAGOrder(params: types.TopoheightRangeParams) {
    return this.dataCall<string[]>(RPCMethod.GetDAGOrder, params)
  }

  getBlocksRangeByTopoheight(params: types.TopoheightRangeParams) {
    return this.dataCall<types.Block[]>(RPCMethod.GetBlocksRangeByTopoheight, params)
  }

  getBlocksRangeByHeight(params: types.HeightRangeParams) {
    return this.dataCall<types.Block[]>(RPCMethod.GetBlocksRangeByHeight, params)
  }

  getAccountHistory(params: types.GetAccountHistoryParams) {
    return this.dataCall<types.AccounHistory[]>(RPCMethod.GetAccountHistory, params)
  }

  getAccountAssets(address: string) {
    return this.dataCall<string[]>(RPCMethod.GetAccountAssets, { address })
  }

  getAccounts(params: types.GetAccountsParams) {
    return this.dataCall<string[]>(RPCMethod.GetAccounts, params)
  }

  isAccountRegistered(params: types.IsAccountRegisteredParams) {
    return this.dataCall<boolean>(RPCMethod.IsAccountRegistered, params)
  }

  getAccountRegistrationTopoheight(address: String) {
    return this.dataCall<number>(RPCMethod.GetAccountRegistrationTopoheight, { address })
  }

  validateAddress(params: types.ValidateAddressParams) {
    return this.dataCall<types.ValidateAddressResult>(RPCMethod.ValidateAddress, params)
  }

  splitAddress(params: types.SplitAddressParams) {
    return this.dataCall<types.SplitAddressResult>(RPCMethod.SplitAddress, params)
  }

  extractKeyFromAddress(params: types.ExtractKeyFromAddressParams) {
    return this.dataCall<string | number[]>(RPCMethod.ExtractKeyFromAddress, params)
  }

  makeIntegratedAddress(params: types.MakeIntegratedAddressParams) {
    return this.dataCall<string>(RPCMethod.MakeIntegratedAddress, params)
  }

  decryptExtraData(params: types.DecryptExtraDataParams) {
    return this.dataCall(RPCMethod.DecryptExtraData, params)
  }

  getMultisigAtTopoheight(params: types.GetMutilsigAtTopoheightParams) {
    return this.dataCall<types.GetMutilsigAtTopoheightResult>(RPCMethod.GetMultisigAtTopoheight, params)
  }

  getMultisig(params: types.GetMultisigParams) {
    return this.dataCall<types.GetMultisigResult>(RPCMethod.GetMultisig, params)
  }

  hasMultisig(params: types.HasMultisigParams) {
    return this.dataCall<boolean>(RPCMethod.HasMultisig, params)
  }

  hasMultisigAtTopoheight(params: types.HasMultisigAtTopoheightParams) {
    return this.dataCall<boolean>(RPCMethod.HasMultisigAtTopoheight, params)
  }

  getContractOutputs(params: types.GetContractOutputsParams) {
    return this.dataCall<types.ContractOutput[]>(RPCMethod.GetContractOutputs, params)
  }

  getContractModule(params: types.GetContractModuleParams) {
    return this.dataCall<types.GetContractModuleResult>(RPCMethod.GetContractModule, params)
  }

  getContractData(params: types.GetContractModuleParams) {
    return this.dataCall(RPCMethod.GetContractData, params)
  }

  getContractDataAtTopoheight(params: types.GetContractDataAtTopoheightParams) {
    return this.dataCall(RPCMethod.GetContractDataAtTopoheight, params)
  }

  getContractBalance(params: types.GetContractBalanceParams) {
    return this.dataCall<types.GetContractBalanceResult>(RPCMethod.GetContractBalance, params)
  }

  getContractBalanceAtTopoheight(params: types.GetContractBalanceAtTopoheightParams) {
    return this.dataCall<types.GetContractBalanceAtTopoheightResult>(RPCMethod.GetContractBalanceAtTopoheight, params)
  }

  getContractAssets(params: types.GetContractBalanceParams) {
    return this.dataCall<string[]>(RPCMethod.GetContractAssets, params)
  }

  getP2PBlockPropagation(params: types.GetP2pBlockPropagationParams) {
    return this.dataCall<types.P2pBlockPropagationResult>(RPCMethod.GetP2PBlockPropagation, params)
  }

  getBlockTemplate(address: string) {
    return this.dataCall<string>(RPCMethod.GetBlockTemplate, { address })
  }

  getMinerWork(params: types.GetMinerWorkParams) {
    return this.dataCall<types.GetMinerWorkResult>(RPCMethod.GetMinerWork, params)
  }

  submitBlock(params: types.SubmitBlockParams) {
    return this.dataCall<boolean>(RPCMethod.SubmitBlock, params)
  }
}

export class WS extends WSRPC {
  methods: DaemonMethods
  constructor(endpoint: string) {
    super(endpoint)
    this.methods = new DaemonMethods(this)
  }
}

export default WS
