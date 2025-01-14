import { MessageEvent } from 'ws'

import {
  Block, GetInfoResult, RPCEvent, RPCMethod, GetPeersResult,
  RPCEventResult, TopoheightRangeParams, P2PStatusResult,
  GetBalanceAtTopoheightParams, GetBalanceResult, HeightRangeParams, BlockOrdered,
  GetBalanceParams, GetAccountsParams, GetBlockAtTopoheightParams, GetBlockByHashParams,
  GetBlocksAtHeightParams, GetTopBlockParams, GetNonceParams, GetNonceResult, GetAccountHistoryParams,
  AccounHistory, Peer, PeerPeerListUpdated, PeerPeerDisconnected, DevFee, DiskSize, AssetWithData, AssetData,
  GetAssetParams, HasBalanceParams, HasBalanceResult, IsTxExecutedInBlockParams, BlockOrphaned, VersionedBalance,
  StableHeightChanged, HasNonceResult, HasNonceParams, TransactionResponse,
  IsAccountRegisteredParams, GetMempoolCacheResult, GetDifficultyResult, ValidateAddressParams,
  ExtractKeyFromAddressParams, SubmitBlockParams, GetMinerWorkParams, GetMinerWorkResult,
  ValidateAddressResult, TransactionExecuted, GetStableBalanceResult, GetAssetsParams,
  SplitAddressParams, SplitAddressResult, HardFork, GetTransactionExecutorResult, GetNonceAtTopoheightParams,
  VersionedNonce, FeeRatesEstimated, MakeIntegratedAddressParams, DecryptExtraDataParams
} from './types'

import { WS as BaseWS } from '../lib/websocket'

export class DaemonMethods {
  ws: BaseWS
  prefix: string

  constructor(ws: BaseWS, prefix: string = "") {
    this.ws = ws
    this.prefix = prefix
  }

  async listenEvent<T>(event: string, onData: (msgEvent: MessageEvent, data?: T, err?: Error) => void) {
    return this.ws.listenEvent(this.prefix + event, onData)
  }

  dataCall<T>(method: string, params?: any): Promise<T> {
    return this.ws.dataCall(this.prefix + method, params)
  }

  onNewBlock(onData: (msgEvent: MessageEvent, data?: Block & RPCEventResult, err?: Error) => void) {
    return this.listenEvent(RPCEvent.NewBlock, onData)
  }

  onTransactionAddedInMempool(onData: (msgEvent: MessageEvent, data?: TransactionResponse & RPCEventResult, err?: Error) => void) {
    return this.listenEvent(RPCEvent.TransactionAddedInMempool, onData)
  }

  onTransactionExecuted(onData: (msgEvent: MessageEvent, data?: TransactionExecuted & RPCEventResult, err?: Error) => void) {
    return this.listenEvent(RPCEvent.TransactionExecuted, onData)
  }

  onBlockOrdered(onData: (msgEvent: MessageEvent, data?: BlockOrdered & RPCEventResult, err?: Error) => void) {
    return this.listenEvent(RPCEvent.BlockOrdered, onData)
  }

  onPeerConnected(onData: (msgEvent: MessageEvent, data?: Peer & RPCEventResult, err?: Error) => void) {
    return this.listenEvent(RPCEvent.PeerConnected, onData)
  }

  onPeerDisconnected(onData: (msgEvent: MessageEvent, data?: number & RPCEventResult, err?: Error) => void) {
    return this.listenEvent(RPCEvent.PeerDisconnected, onData)
  }

  onPeerPeerListUpdated(onData: (msgEvent: MessageEvent, data?: PeerPeerListUpdated & RPCEventResult, err?: Error) => void) {
    return this.listenEvent(RPCEvent.PeerPeerListUpdated, onData)
  }

  onPeerPeerDisconnected(onData: (msgEvent: MessageEvent, data?: PeerPeerDisconnected & RPCEventResult, err?: Error) => void) {
    return this.listenEvent(RPCEvent.PeerPeerDisconnected, onData)
  }

  onPeerStateUpdated(onData: (msgEvent: MessageEvent, data?: Peer & RPCEventResult, err?: Error) => void) {
    return this.listenEvent(RPCEvent.PeerStateUpdated, onData)
  }

  onNewAsset(onData: (msgEvent: MessageEvent, data?: AssetWithData & RPCEventResult, err?: Error) => void) {
    return this.listenEvent(RPCEvent.NewAsset, onData)
  }

  onBlockOrphaned(onData: (msgEvent: MessageEvent, data?: BlockOrphaned & RPCEventResult, err?: Error) => void) {
    return this.listenEvent(RPCEvent.BlockOrphaned, onData)
  }

  onTransactionOrphaned(onData: (msgEvent: MessageEvent, data?: TransactionResponse & RPCEventResult, err?: Error) => void) {
    return this.listenEvent(RPCEvent.TransactionOrphaned, onData)
  }

  onStableHeightChanged(onData: (msgEvent: MessageEvent, data?: StableHeightChanged & RPCEventResult, err?: Error) => void) {
    return this.listenEvent(RPCEvent.StableHeightChanged, onData)
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
    return this.dataCall<GetInfoResult>(RPCMethod.GetInfo)
  }

  getDifficulty() {
    return this.dataCall<GetDifficultyResult>(RPCMethod.GetDifficulty)
  }

  getTips() {
    return this.dataCall<string[]>(RPCMethod.GetTips)
  }

  getDevFeeThresholds() {
    return this.dataCall<DevFee[]>(RPCMethod.GetDevFeeThresholds)
  }

  getSizeOnDisk() {
    return this.dataCall<DiskSize>(RPCMethod.GetSizeOnDisk)
  }

  getStableHeight() {
    return this.dataCall<number>(RPCMethod.GetStableHeight)
  }

  getStableTopoheight() {
    return this.dataCall<number>(RPCMethod.GetStableTopoheight)
  }

  getHardForks() {
    return this.dataCall<HardFork[]>(RPCMethod.GetHardForks)
  }

  getBlockAtTopoheight(params: GetBlockAtTopoheightParams) {
    return this.dataCall<Block>(RPCMethod.GetBlockAtTopoheight, params)
  }

  getBlocksAtHeight(params: GetBlocksAtHeightParams) {
    return this.dataCall<Block[]>(RPCMethod.GetBlocksAtHeight, params)
  }

  getBlockByHash(params: GetBlockByHashParams) {
    return this.dataCall<Block>(RPCMethod.GetBlockByHash, params)
  }

  getTopBlock(params: GetTopBlockParams) {
    return this.dataCall<Block>(RPCMethod.GetTopBlock, params)
  }

  getBalance(params: GetBalanceParams) {
    return this.dataCall<GetBalanceResult>(RPCMethod.GetBalance, params)
  }

  getStableBalance(params: GetBalanceParams) {
    return this.dataCall<GetStableBalanceResult>(RPCMethod.GetStableBalance, params)
  }

  hasBalance(params: HasBalanceParams) {
    return this.dataCall<HasBalanceResult>(RPCMethod.HasBalance, params)
  }

  getBalanceAtTopoheight(params: GetBalanceAtTopoheightParams) {
    return this.dataCall<VersionedBalance>(RPCMethod.GetBalanceAtTopoheight, params)
  }

  getNonce(params: GetNonceParams) {
    return this.dataCall<GetNonceResult>(RPCMethod.GetNonce, params)
  }

  hasNonce(params: HasNonceParams) {
    return this.dataCall<HasNonceResult>(RPCMethod.HasNonce, params)
  }

  getNonceAtTopoheight(params: GetNonceAtTopoheightParams) {
    return this.dataCall<VersionedNonce>(RPCMethod.GetNonceAtTopoheight, params)
  }

  getAsset(params: GetAssetParams) {
    return this.dataCall<AssetData>(RPCMethod.GetAsset, params)
  }

  getAssets(params?: GetAssetsParams) {
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

  submitTransaction(hexData: string) {
    return this.dataCall<boolean>(RPCMethod.SubmitTransaction, { data: hexData })
  }

  getTransactionExecutor(hash: string) {
    return this.dataCall<GetTransactionExecutorResult>(RPCMethod.GetTransactionExecutor, { hash })
  }

  getTransaction(hash: string) {
    return this.dataCall<TransactionResponse>(RPCMethod.GetTransaction, { hash })
  }

  getTransactions(txHashes: string[]) {
    return this.dataCall<TransactionResponse[]>(RPCMethod.GetTransactions, { tx_hashes: txHashes })
  }

  isTxExecutedInBlock(params: IsTxExecutedInBlockParams) {
    return this.dataCall<boolean>(RPCMethod.IsTxExecutedInBlock, params)
  }

  p2pStatus() {
    return this.dataCall<P2PStatusResult>(RPCMethod.P2PStatus)
  }

  getPeers() {
    return this.dataCall<GetPeersResult>(RPCMethod.GetPeers)
  }

  getMemPool() {
    return this.dataCall<TransactionResponse[]>(RPCMethod.GetMempool)
  }

  getMempoolCache(address: string) {
    return this.dataCall<GetMempoolCacheResult>(RPCMethod.GetMempoolCache, { address })
  }

  getEstimatedFeeRates() {
    return this.dataCall<FeeRatesEstimated>(RPCMethod.GetEstimatedFeeRates)
  }

  getDAGOrder(params: TopoheightRangeParams) {
    return this.dataCall<string[]>(RPCMethod.GetDAGOrder, params)
  }

  getBlocksRangeByTopoheight(params: TopoheightRangeParams) {
    return this.dataCall<Block[]>(RPCMethod.GetBlocksRangeByTopoheight, params)
  }

  getBlocksRangeByHeight(params: HeightRangeParams) {
    return this.dataCall<Block[]>(RPCMethod.GetBlocksRangeByHeight, params)
  }

  getAccountHistory(params: GetAccountHistoryParams) {
    return this.dataCall<AccounHistory[]>(RPCMethod.GetAccountHistory, params)
  }

  getAccountAssets(address: string) {
    return this.dataCall<string[]>(RPCMethod.GetAccountAssets, { address })
  }

  getAccounts(params: GetAccountsParams) {
    return this.dataCall<string[]>(RPCMethod.GetAccounts, params)
  }

  isAccountRegistered(params: IsAccountRegisteredParams) {
    return this.dataCall<boolean>(RPCMethod.IsAccountRegistered, params)
  }

  getAccountRegistrationTopoheight(address: String) {
    return this.dataCall<Number>(RPCMethod.GetAccountRegistrationTopoheight, { address })
  }

  validateAddress(params: ValidateAddressParams) {
    return this.dataCall<ValidateAddressResult>(RPCMethod.ValidateAddress, params)
  }

  splitAddress(params: SplitAddressParams) {
    return this.dataCall<SplitAddressResult>(RPCMethod.SplitAddress, params)
  }

  extractKeyFromAddress(params: ExtractKeyFromAddressParams) {
    return this.dataCall<string | number[]>(RPCMethod.ExtractKeyFromAddress, params)
  }

  makeIntegratedAddress(params: MakeIntegratedAddressParams) {
    return this.dataCall<string>(RPCMethod.MakeIntegratedAddress, params)
  }

  decryptExtraData(params: DecryptExtraDataParams) {
    return this.dataCall(RPCMethod.DecryptExtraData, params)
  }

  getBlockTemplate(address: string) {
    return this.dataCall<string>(RPCMethod.GetBlockTemplate, { address })
  }

  getMinerWork(params: GetMinerWorkParams) {
    return this.dataCall<GetMinerWorkResult>(RPCMethod.GetMinerWork, params)
  }

  submitBlock(params: SubmitBlockParams) {
    return this.dataCall<boolean>(RPCMethod.SubmitBlock, params)
  }
}

export class WS extends BaseWS {
  methods: DaemonMethods
  constructor() {
    super()
    this.methods = new DaemonMethods(this)
  }
}

export default WS
