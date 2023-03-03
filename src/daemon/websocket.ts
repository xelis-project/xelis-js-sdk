import { WebSocket, MessageEvent } from 'ws'

import { RPCRequest, NewBlockResult, RPCResponse, GetInfoResult } from './types'

import to from 'await-to-js'

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
  subscriptions: Record<string, number>

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.timeout = 3000
    this.subscriptions = {}
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

  async subscribe<T>(event: string, onMsg: (result: T, msgEvent: MessageEvent) => void): Promise<() => void> {
    return new Promise(async (resolve, reject) => {
      const onMessage = (msgEvent: MessageEvent) => {
        if (typeof msgEvent.data === `string`) {
          const data = JSON.parse(msgEvent.data)
          if (typeof data.result === `object` && data.result.event === event) {
            onMsg(data.result, msgEvent)
          }
        }
      }

      this.socket.addEventListener(`message`, onMessage)

      if (this.subscriptions[event]) {
        this.subscriptions[event]++
      } else {
        this.subscriptions[event] = 1
        const [err, _] = await to(this.call<boolean>(`subscribe`, { notify: event }))
        if (err) return reject(err)
      }

      const unsubscribe = async () => {
        return new Promise(async (resolve, reject) => {
          if (this.subscriptions[event] === 1) {
            const [err, _] = await to(this.call<boolean>(`unsubscribe`, { notify: event }))
            if (err) return reject(err)
          }

          this.subscriptions[event]--
          this.socket.removeEventListener(`message`, onMessage)
          resolve(null)
        })
      }

      return resolve(unsubscribe)
    })
  }

  onNewBlock(onMsg: (data: NewBlockResult, msgEvent: MessageEvent) => void) {
    return this.subscribe(`NewBlock`, onMsg)
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

      this.socket.addEventListener(`message`, onMessage)
    })
  }

  getInfo() {
    return this.call<GetInfoResult>(`get_info`)
  }
}

export default WS
