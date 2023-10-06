import { MessageEvent } from 'ws'
import WebSocket from 'isomorphic-ws'
import to from 'await-to-js'

import {
  RPCRequest, Block, RPCResponse, GetInfoResult, RPCEvent, RPCMethod,
  RPCEventResult, Transaction, TopoHeightRangeParams, P2PStatusResult, Balance,
  GetBalanceAtTopoHeightParams, GetLastBalanceResult, HeightRangeParams, BlockOrdered,
  GetLastBalanceParams, GetAccountsParams
} from './types'

function createRequestMethod(method: string, params?: any): { data: string, id: number } {
  const id = Math.floor(Date.now() * Math.random())
  const request = { id: id, jsonrpc: `2.0`, method } as RPCRequest
  if (params) request.params = params
  const data = JSON.stringify(request)
  return { data, id }
}

interface EventData {
  id?: number
  listeners: ((msgEvent: MessageEvent) => void)[]
  unsubscribeTimeoutId?: any
}

class WS {
  endpoint: string
  socket?: WebSocket
  timeout: number
  connected: boolean
  unsubscribeSuspense: number
  private events: Record<string, EventData>

  constructor() {
    this.endpoint = ""
    this.timeout = 3000
    this.connected = false
    this.events = {}
    this.unsubscribeSuspense = 1000
  }

  connect(endpoint: string) {
    if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
      this.socket.close()
    }

    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(endpoint)
      this.endpoint = endpoint

      this.socket.addEventListener(`open`, (event) => {
        this.connected = true
        resolve(event)
      })

      this.socket.addEventListener(`close`, () => {
        this.connected = false
        reject()
      })

      this.socket.addEventListener(`error`, (err) => {
        this.connected = false
        reject(err)
      })
    })
  }

  close(code?: number | undefined, data?: string | Buffer | undefined): void {
    this.socket && this.socket.close(code, data)
  }

  onClose(cb: (event: WebSocket.CloseEvent) => void) {
    if (!this.socket) return
    this.socket.addEventListener(`close`, (event) => {
      cb(event)
    })
  }

  onError(cb: (err: WebSocket.ErrorEvent) => void) {
    if (!this.socket) return
    this.socket.addEventListener(`error`, (err) => {
      cb(err)
    })
  }

  private clearEvent(event: RPCEvent) {
    this.events[event].listeners.forEach(listener => {
      this.socket && this.socket.removeEventListener(`message`, listener)
    })

    Reflect.deleteProperty(this.events, event)
  }

  async closeAllListens(event: RPCEvent) {
    if (this.events[event]) {
      const [err, _] = await to(this.call<boolean>(`unsubscribe`, { notify: event }))
      if (err) return Promise.reject(err)
      this.clearEvent(event)
    }

    return Promise.resolve()
  }

  async listenEvent<T>(event: RPCEvent, onData: (msgEvent: MessageEvent, data?: T, err?: Error) => void) {
    const onMessage = (msgEvent: MessageEvent) => {
      if (this.events[event]) {
        const { id } = this.events[event]
        if (typeof msgEvent.data === `string`) {
          try {
            const data = JSON.parse(msgEvent.data) as RPCResponse<any>
            if (data.id === id) {
              if (data.error) {
                onData(msgEvent, undefined, new Error(data.error.message))
              } else {
                onData(msgEvent, data.result, undefined)
              }
            }
          } catch {
            // can't parse json -- do nothing
          }
        }
      }
    }

    if (this.events[event]) {
      const { unsubscribeTimeoutId } = this.events[event]
      if (unsubscribeTimeoutId) {
        // clear timeout to unsubscribe 
        // because we got a new registered event and want to cancel the pending unsubscribe grace period
        clearTimeout(unsubscribeTimeoutId)
      }

      this.events[event].listeners.push(onMessage)
    } else {
      // important if multiple listenEvent are called without await atleast we store listener before getting id
      this.events[event] = { listeners: [onMessage] }
      const [err, res] = await to(this.call<boolean>(`subscribe`, { notify: event }))
      if (err) {
        this.clearEvent(event)
        return Promise.reject(err)
      }

      this.events[event].id = res.id
    }

    this.socket && this.socket.addEventListener(`message`, onMessage)

    const closeListen = () => {
      const eventData = this.events[event]
      if (eventData) {
        const listeners = eventData.listeners
        for (let i = 0; i < listeners.length; i++) {
          if (listeners[i] === onMessage) {
            listeners.splice(i, 1)
            break
          }
        }

        if (listeners.length === 0) {
          this.events[event].unsubscribeTimeoutId = setTimeout(async () => {
            // no more listener so we unsubscribe from daemon websocket
            this.call<boolean>(`unsubscribe`, { notify: event })
            Reflect.deleteProperty(this.events, event)
          }, this.unsubscribeSuspense)
        }
      }

      this.socket && this.socket.removeEventListener(`message`, onMessage)
      return Promise.resolve()
    }

    return Promise.resolve(closeListen)
  }

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

  call<T>(method: string, params?: any): Promise<RPCResponse<T>> {
    return new Promise((resolve, reject) => {
      const { data, id } = createRequestMethod(method, params)

      let timeoutId: any = null
      const onMessage = (msgEvent: MessageEvent) => {
        if (typeof msgEvent.data === `string`) {
          const data = JSON.parse(msgEvent.data) as RPCResponse<T>
          if (data.id === id) {
            clearTimeout(timeoutId)
            this.socket && this.socket.removeEventListener(`message`, onMessage)
            if (data.error) return reject(new Error(data.error.message))
            else resolve(data)
          }
        }
      }

      // make sure you listen before sending data
      this.socket && this.socket.addEventListener(`message`, onMessage) // we don't use { once: true } option because of timeout feature

      timeoutId = setTimeout(() => {
        this.socket && this.socket.removeEventListener(`message`, onMessage)
        reject(new Error(`timeout`))
      }, this.timeout)

      this.socket && this.socket.send(data)
    })
  }

  dataCall<T>(method: string, params?: any): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const [err, res] = await to(this.call<T>(method, params))
      if (err) return reject(err)
      return resolve(res.result)
    })
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

  getBlockAtTopoHeight(topoHeight: number) {
    return this.dataCall<Block>(RPCMethod.GetBlockAtTopoHeight, { topoheight: topoHeight })
  }

  getBlocksAtHeight(height: number) {
    return this.dataCall<Block[]>(RPCMethod.GetBlocksAtHeight, { height })
  }

  getBlockByHash(hash: string) {
    return this.dataCall<Block>(RPCMethod.GetBlockByHash, { hash })
  }

  getTopBlock() {
    return this.dataCall<Block>(RPCMethod.GetTopBlock)
  }

  getNonce(address: string) {
    return this.dataCall<number>(RPCMethod.GetNonce, { address })
  }

  getLastBalance(params: GetLastBalanceParams) {
    return this.dataCall<GetLastBalanceResult>(RPCMethod.GetLastBalance, params)
  }

  getBalanceAtTopoHeight(params: GetBalanceAtTopoHeightParams) {
    return this.dataCall<Balance>(RPCMethod.GetBalanceAtTopoHeight, params)
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
}

export default WS
