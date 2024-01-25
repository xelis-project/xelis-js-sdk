import { MessageEvent } from 'ws'

import {
  Block, GetInfoResult, RPCEvent, RPCMethod,
  RPCEventResult, Transaction, TopoHeightRangeParams, P2PStatusResult, Balance,
  GetBalanceAtTopoHeightParams, GetBalanceResult, HeightRangeParams, BlockOrdered,
  GetBalanceParams, GetAccountsParams, GetBlockAtTopoHeightParams, GetBlockByHashParams,
  GetBlocksAtHeightParams, GetTopBlockParams, GetNonceParams, GetNonceResult, GetAccountHistoryParams,
  AccounHistory, Peer, PeerPeerListUpdated, PeerPeerDisconnected, DevFee, DiskSize, AssetWithData, AssetData, GetAssetParams, HasBalanceParams, HasBalanceResult, IsTxExecutedInBlockParams
} from './types'

import { WS as BaseWS } from '../lib/websocket'

class WS extends BaseWS {
  onNewBlock(onData: (msgEvent: MessageEvent, data?: Block & RPCEventResult, err?: Error) => void) {
    return this.listenEvent(RPCEvent.NewBlock, onData)
  }

  onTransactionAddedInMempool(onData: (msgEvent: MessageEvent, data?: Transaction & RPCEventResult, err?: Error) => void) {
    return this.listenEvent(RPCEvent.TransactionAddedInMempool, onData)
  }

  onTransactionExecuted(onData: (msgEvent: MessageEvent, data?: Transaction & RPCEventResult, err?: Error) => void) {
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

  getVersion() {
    return this.dataCall<string>(RPCMethod.GetVersion)
  }

  getInfo() {
    return this.dataCall<GetInfoResult>(RPCMethod.GetInfo)
  }

  getHeight() {
    return this.dataCall<number>(RPCMethod.GetHeight)
  }

  getTopoHeight() {
    return this.dataCall<number>(RPCMethod.GetTopoHeight)
  }

  getStableHeight() {
    return this.dataCall<number>(RPCMethod.GetStableHeight)
  }

  getBlockTemplate(address: string) {
    return this.dataCall<string>(RPCMethod.GetBlockTemplate, { address })
  }

  getBlockAtTopoHeight(params: GetBlockAtTopoHeightParams) {
    return this.dataCall<Block>(RPCMethod.GetBlockAtTopoHeight, params)
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

  getNonce(params: GetNonceParams) {
    return this.dataCall<GetNonceResult>(RPCMethod.GetNonce, params)
  }

  getBalance(params: GetBalanceParams) {
    return this.dataCall<GetBalanceResult>(RPCMethod.GetBalance, params)
  }

  hasBalance(params: HasBalanceParams) {
    return this.dataCall<HasBalanceResult>(RPCMethod.HasBalance, params)
  }

  getBalanceAtTopoHeight(params: GetBalanceAtTopoHeightParams) {
    return this.dataCall<Balance>(RPCMethod.GetBalanceAtTopoHeight, params)
  }

  getAsset(params: GetAssetParams) {
    return this.dataCall<AssetData>(RPCMethod.GetAsset, params)
  }

  getAssets() {
    return this.dataCall<string[]>(RPCMethod.GetAssets)
  }

  countTransactions() {
    return this.dataCall<number>(RPCMethod.CountTransactions)
  }

  getTips() {
    return this.dataCall<string[]>(RPCMethod.GetTips)
  }

  p2pStatus() {
    return this.dataCall<P2PStatusResult>(RPCMethod.P2PStatus)
  }

  getDAGOrder(params: TopoHeightRangeParams) {
    return this.dataCall<string[]>(RPCMethod.GetDAGOrder, params)
  }

  getMemPool() {
    return this.dataCall<Transaction[]>(RPCMethod.GetMempool)
  }

  getTransaction(hash: string) {
    return this.dataCall<Transaction>(RPCMethod.GetTransaction, { hash })
  }

  getTransactions(txHashes: string[]) {
    return this.dataCall<Transaction[]>(RPCMethod.GetTransactions, { tx_hashes: txHashes })
  }

  getBlocksRangeByTopoheight(params: TopoHeightRangeParams) {
    return this.dataCall<Block[]>(RPCMethod.GetBlocksRangeByTopoheight, params)
  }

  getBlocksRangeByHeight(params: HeightRangeParams) {
    return this.dataCall<Block[]>(RPCMethod.GetBlocksRangeByHeight, params)
  }

  getAccounts(params: GetAccountsParams) {
    return this.dataCall<string[]>(RPCMethod.GetAccounts, params)
  }

  submitBlock(blockTemplate: string) {
    return this.dataCall<boolean>(RPCMethod.SubmitBlock, { block_template: blockTemplate })
  }

  submitTransaction(hexData: string) {
    return this.dataCall<boolean>(RPCMethod.SubmitTransaction, { data: hexData })
  }

  countAccounts() {
    return this.dataCall<number>(RPCMethod.CountAccounts)
  }

  getAccountHistory(params: GetAccountHistoryParams) {
    return this.dataCall<AccounHistory[]>(RPCMethod.GetAccountHistory, params)
  }

  getAccountAssets(address: string) {
    return this.dataCall<string[]>(RPCMethod.GetAccountAssets, { address })
  }

  getPeers() {
    return this.dataCall<Peer[]>(RPCMethod.GetPeers)
  }

  getDevFeeThresholds() {
    return this.dataCall<DevFee[]>(RPCMethod.GetDevFeeThresholds)
  }

  getSizeOnDisk() {
    return this.dataCall<DiskSize>(RPCMethod.GetSizeOnDisk)
  }

  isTxExecutedInBlock(params: IsTxExecutedInBlockParams) {
    return this.dataCall<boolean>(RPCMethod.IsTxExecutedInBlock, params)
  }
}

export default WS
