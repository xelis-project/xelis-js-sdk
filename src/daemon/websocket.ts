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

class WS {
  endpoint: string
  socket!: WebSocket
  timeout: number
  private events: Record<string, ((msgEvent: MessageEvent) => void)[]>

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

  async closeAllListens(event: RPCEvent) {
    if (this.events[event]) {
      const [err, _] = await to(this.call<boolean>(`unsubscribe`, { notify: event }))
      if (err) return Promise.reject(err)

      this.events[event].forEach(onMsg => {
        this.socket.removeEventListener(`message`, onMsg)
      })

      Reflect.deleteProperty(this.events, event)
    }

    return Promise.resolve()
  }

  async listenEvent<T>(event: RPCEvent, onMsg: (result: T, msgEvent: MessageEvent) => void) {
    const onMessage = (msgEvent: MessageEvent) => {
      if (typeof msgEvent.data === `string`) {
        const data = JSON.parse(msgEvent.data)
        if (typeof data.result === `object` && data.result.event === event) {
          onMsg(data.result, msgEvent)
        }
      }
    }

    this.socket.addEventListener(`message`, onMessage)

    if (this.events[event]) {
      this.events[event].push(onMessage)
    } else {
      const [err, _] = await to(this.call<boolean>(`subscribe`, { notify: event }))
      if (err) return Promise.reject(err)

      this.events[event] = [onMessage]
    }

    const closeListen = async () => {
      if (this.events[event] && this.events[event].length === 1) {
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

  call<T>(method: string, params?: any): Promise<T> {
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
            resolve(data.result)
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
