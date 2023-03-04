import { WebSocket, MessageEvent } from 'ws'
import to from 'await-to-js'

import { RPCRequest, NewBlockResult, RPCResponse, GetInfoResult, RPCEvent, RPCMethod } from './types'

function createRequestMethod(method: string, params?: any): { data: string, id: number } {
  const id = Date.now() + Math.round((Math.random() * 9999))
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
      const [err, _] = await to(this.call<boolean>(`unsubscribe`, { notify: event }))
      if (err) return Promise.reject(err)
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
      this.events[event] = { listeners: [onMessage] } // important if multiple listenEvent are called without await atleast we store before getting id
      const [err, res] = await to(this.call<boolean>(`subscribe`, { notify: event }))
      if (err) {
        this.clearEvent(event)
        return Promise.reject(err)
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

  onNewBlock(onMsg: (data: NewBlockResult, msgEvent: MessageEvent) => void) {
    return this.listenEvent(RPCEvent.NewBlock, onMsg)
  }

  call<T>(method: string, params?: any): Promise<RPCResponse<T>> {
    return new Promise((resolve, reject) => {
      const { data, id } = createRequestMethod(method, params)
      this.socket.send(data)

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

      timeoutId = setTimeout(() => {
        this.socket.removeEventListener(`message`, onMessage)
        reject(`timeout`)
      }, this.timeout)

      this.socket.addEventListener(`message`, onMessage) // we don't use once option because of timeout feature
    })
  }

  getInfo() {
    return this.call<GetInfoResult>(RPCMethod.GetInfo)
  }
}

export default WS
