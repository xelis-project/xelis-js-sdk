import { MessageEvent } from 'ws'

import {
  Block, GetInfoResult, RPCEvent, DaemonRPCMethod,
  RPCEventResult, Transaction, TopoHeightRangeParams, P2PStatusResult, Balance,
  GetBalanceAtTopoHeightParams, GetLastBalanceResult, HeightRangeParams, BlockOrdered,
  GetLastBalanceParams, GetAccountsParams, GetBlockAtTopoHeightParams, GetBlockByHashParams,
  GetBlocksAtHeightParams, GetTopBlockParams
} from '../lib/types'

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

  getVersion() {
    return this.dataCall<string>(DaemonRPCMethod.GetVersion)
  }

  getInfo() {
    return this.dataCall<GetInfoResult>(DaemonRPCMethod.GetInfo)
  }

  getHeight() {
    return this.dataCall<number>(DaemonRPCMethod.GetHeight)
  }

  getTopoHeight() {
    return this.dataCall<number>(DaemonRPCMethod.GetTopoHeight)
  }

  getStableHeight() {
    return this.dataCall<number>(DaemonRPCMethod.GetStableHeight)
  }

  getBlockTemplate(address: string) {
    return this.dataCall<string>(DaemonRPCMethod.GetBlockTemplate, { address })
  }

  getBlockAtTopoHeight(params: GetBlockAtTopoHeightParams) {
    return this.dataCall<Block>(DaemonRPCMethod.GetBlockAtTopoHeight, params)
  }

  getBlocksAtHeight(params: GetBlocksAtHeightParams) {
    return this.dataCall<Block[]>(DaemonRPCMethod.GetBlocksAtHeight, params)
  }

  getBlockByHash(params: GetBlockByHashParams) {
    return this.dataCall<Block>(DaemonRPCMethod.GetBlockByHash, params)
  }

  getTopBlock(params: GetTopBlockParams) {
    return this.dataCall<Block>(DaemonRPCMethod.GetTopBlock, params)
  }

  getNonce(address: string) {
    return this.dataCall<number>(DaemonRPCMethod.GetNonce, { address })
  }

  getLastBalance(params: GetLastBalanceParams) {
    return this.dataCall<GetLastBalanceResult>(DaemonRPCMethod.GetLastBalance, params)
  }

  getBalanceAtTopoHeight(params: GetBalanceAtTopoHeightParams) {
    return this.dataCall<Balance>(DaemonRPCMethod.GetBalanceAtTopoHeight, params)
  }

  getAssets() {
    return this.dataCall<string[]>(DaemonRPCMethod.GetAssets)
  }

  countTransactions() {
    return this.dataCall<number>(DaemonRPCMethod.CountTransactions)
  }

  getTips() {
    return this.dataCall<string[]>(DaemonRPCMethod.GetTips)
  }

  p2pStatus() {
    return this.dataCall<P2PStatusResult>(DaemonRPCMethod.P2PStatus)
  }

  getDAGOrder(params: TopoHeightRangeParams) {
    return this.dataCall<string[]>(DaemonRPCMethod.GetDAGOrder, params)
  }

  getMemPool() {
    return this.dataCall<Transaction[]>(DaemonRPCMethod.GetMempool)
  }

  getTransaction(hash: string) {
    return this.dataCall<Transaction>(DaemonRPCMethod.GetTransaction, { hash })
  }

  getTransactions(txHashes: string[]) {
    return this.dataCall<Transaction[]>(DaemonRPCMethod.GetTransactions, { tx_hashes: txHashes })
  }

  getBlocksRangeByTopoheight(params: TopoHeightRangeParams) {
    return this.dataCall<Block[]>(DaemonRPCMethod.GetBlocksRangeByTopoheight, params)
  }

  getBlocksRangeByHeight(params: HeightRangeParams) {
    return this.dataCall<Block[]>(DaemonRPCMethod.GetBlocksRangeByHeight, params)
  }

  getAccounts(params: GetAccountsParams) {
    return this.dataCall<string[]>(DaemonRPCMethod.GetAccounts, params)
  }

  submitBlock(blockTemplate: string) {
    return this.dataCall<boolean>(DaemonRPCMethod.SubmitBlock, { block_template: blockTemplate })
  }

  submitTransaction(hexData: string) {
    return this.dataCall<boolean>(DaemonRPCMethod.SubmitTransaction, { data: hexData })
  }
}

export default WS
