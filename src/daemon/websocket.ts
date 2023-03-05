import { WebSocket, MessageEvent } from 'ws'
import to from 'await-to-js'

import {
  RPCRequest, Block, RPCResponse, GetInfoResult, RPCEvent, RPCMethod,
  RPCEventResult, Transaction, TopoHeightStartEndParams, P2PStatusResult, Balance,
  BalanceParams, GetLastBalanceResult
} from './types'

function createRequestMethod(method: string, params?: any): { data: string, id: number } {
  const id = Date.now()
  const request = { id: id, jsonrpc: `2.0`, method } as RPCRequest
  if (params) request.params = params
  const data = JSON.stringify(request)
  return { data, id }
}

interface EventData {
  id?: number
  listeners: ((msgEvent: MessageEvent) => void)[]
}

class WS {
  endpoint: string
  socket!: WebSocket
  timeout: number
  private events: Record<string, EventData>

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.timeout = 3000
    this.events = {}
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.endpoint)

      this.socket.addEventListener(`open`, resolve)
      this.socket.addEventListener(`close`, reject)
      this.socket.addEventListener(`error`, reject)
    })
  }

  reconnect(newEndpoint?: string) {
    if (newEndpoint) this.endpoint = newEndpoint

    if (this.socket.readyState !== WebSocket.CLOSED) {
      this.socket.close()
    }

    return this.connect()
  }

  private clearEvent(event: RPCEvent) {
    this.events[event].listeners.forEach(listener => {
      this.socket.removeEventListener(`message`, listener)
    })

    Reflect.deleteProperty(this.events, event)
  }

  async closeAllListens(event: RPCEvent) {
    if (this.events[event]) {
      const [err, res] = await to(this.call<boolean>(`unsubscribe`, { notify: event }))
      if (err) return Promise.reject(err)
      if (res.error) return Promise.reject(res.error.message)
      this.clearEvent(event)
    }

    return Promise.resolve()
  }

  async listenEvent<T>(event: RPCEvent, onMsg: (result: T, msgEvent: MessageEvent) => void) {
    const onMessage = (msgEvent: MessageEvent) => {
      if (this.events[event]) {
        const { id } = this.events[event]
        if (typeof msgEvent.data === `string`) {
          const data = JSON.parse(msgEvent.data) as RPCResponse<any>
          if (typeof data.result === `object` && data.id === id) {
            onMsg(data.result, msgEvent)
          }
        }
      }
    }

    if (this.events[event]) {
      this.events[event].listeners.push(onMessage)
    } else {
      // important if multiple listenEvent are called without await atleast we store listener before getting id
      this.events[event] = { listeners: [onMessage] }
      const [err, res] = await to(this.call<boolean>(`subscribe`, { notify: event }))
      if (err) {
        this.clearEvent(event)
        return Promise.reject(err)
      }

      if (res.error) {
        this.clearEvent(event)
        return Promise.reject(res.error.message)
      }

      this.events[event].id = res.id
    }

    this.socket.addEventListener(`message`, onMessage)

    const closeListen = async () => {
      if (this.events[event] && this.events[event].listeners.length === 1) {
        // this is the last listen callback so we unsubscribe from daemon ws
        const [err, _] = await to(this.call<boolean>(`unsubscribe`, { notify: event }))
        if (err) return Promise.reject(err)
        Reflect.deleteProperty(this.events, event)
      }

      this.socket.removeEventListener(`message`, onMessage)
      return Promise.resolve()
    }

    return Promise.resolve(closeListen)
  }

  onNewBlock(onMsg: (data: Block & RPCEventResult, msgEvent: MessageEvent) => void) {
    return this.listenEvent(RPCEvent.NewBlock, onMsg)
  }

  onTransactionAddedInMempool(onMsg: (data: Transaction & RPCEventResult, msgEvent: MessageEvent) => void) {
    return this.listenEvent(RPCEvent.TransactionAddedInMempool, onMsg)
  }

  onTransactionExecuted(onMsg: (data: Transaction & RPCEventResult, msgEvent: MessageEvent) => void) {
    return this.listenEvent(RPCEvent.TransactionExecuted, onMsg)
  }

  onBlockOrdered(onMsg: (data: any & RPCEventResult, msgEvent: MessageEvent) => void) {
    return this.listenEvent(RPCEvent.BlockOrdered, onMsg)
  }

  call<T>(method: string, params?: any): Promise<RPCResponse<T>> {
    return new Promise((resolve, reject) => {
      const { data, id } = createRequestMethod(method, params)

      let timeoutId: any = null
      const onMessage = (msgEvent: MessageEvent) => {
        if (typeof msgEvent.data === `string`) {
          const data = JSON.parse(msgEvent.data) as RPCResponse<T>
          if (data.id === id) {
            clearTimeout(timeoutId)
            this.socket.removeEventListener(`message`, onMessage)
            resolve(data)
          }
        }
      }

      // make sure you listen before sending data
      this.socket.addEventListener(`message`, onMessage) // we don't use { once: true } option because of timeout feature

      timeoutId = setTimeout(() => {
        this.socket.removeEventListener(`message`, onMessage)
        reject(`timeout`)
      }, this.timeout)

      this.socket.send(data)
    })
  }

  getInfo() {
    return this.call<GetInfoResult>(RPCMethod.GetInfo)
  }

  getHeight() {
    return this.call<number>(RPCMethod.GetHeight)
  }

  getTopoHeight() {
    return this.call<number>(RPCMethod.GetTopoHeight)
  }

  getStableHeight() {
    return this.call<number>(RPCMethod.GetStableHeight)
  }

  getBlockTemplate(address: string) {
    return this.call<string>(RPCMethod.GetBlockTemplate, { address })
  }

  getBlockAtTopoHeight(topoHeight: number) {
    return this.call<Block>(RPCMethod.GetBlockAtTopoHeight, { topoheight: topoHeight })
  }

  getBlocksAtHeight(height: number) {
    return this.call<Block[]>(RPCMethod.GetBlocksAtHeight, { height })
  }

  getBlockByHash(hash: string) {
    return this.call<Block>(RPCMethod.GetBlockByHash, { hash })
  }

  getTopBlock() {
    return this.call<Block>(RPCMethod.GetTopBlock)
  }

  getNonce(address: string) {
    return this.call<number>(RPCMethod.GetNonce, { address })
  }

  getLastBalance(params: BalanceParams) {
    return this.call<GetLastBalanceResult>(RPCMethod.GetLastBalance, params)
  }

  getBalanceAtTopoHeight(params: BalanceParams) {
    return this.call<Balance>(RPCMethod.GetBalanceAtTopoHeight, params)
  }

  getAssets() {
    return this.call<string[]>(RPCMethod.GetAssets)
  }

  countTransactions() {
    return this.call<number>(RPCMethod.CountTransactions)
  }

  getTips() {
    return this.call<string[]>(RPCMethod.GetTips)
  }

  p2pStatus() {
    return this.call<P2PStatusResult>(RPCMethod.P2PStatus)
  }

  getDAGOrder(params: TopoHeightStartEndParams) {
    return this.call<string[]>(RPCMethod.GetDAGOrder, params)
  }

  getMemPool() {
    return this.call<Transaction[]>(RPCMethod.GetMempool)
  }

  getTransaction(hash: string) {
    return this.call<Transaction>(RPCMethod.GetTransaction, { hash })
  }

  getTransactions(txHashes: string[]) {
    return this.call<Transaction[]>(RPCMethod.GetTransactions, { tx_hashes: txHashes })
  }

  getBlocks(params: TopoHeightStartEndParams) {
    return this.call<Block[]>(RPCMethod.GetBlocks, params)
  }
}

export default WS
