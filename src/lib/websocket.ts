import { ClientOptions, MessageEvent } from 'ws'
import WebSocket from 'isomorphic-ws'
import { ClientRequestArgs } from 'http'
import { to } from 'await-to-js'

import { RPCRequest, RPCResponse } from './types'
import { parseData } from './parse_data'

interface EventData {
  id?: number
  listeners: ((msgEvent: MessageEvent) => void)[]
  unsubscribeTimeoutId?: any
}

export class WS {
  endpoint: string
  socket?: WebSocket
  timeout: number
  unsubscribeSuspense: number
  reconnectOnConnectionLoss: boolean
  maxConnectionTries: number
  options?: ClientOptions | ClientRequestArgs

  connectionTries = 0
  methodIdIncrement = 0

  private events: Record<string, EventData>

  constructor(options?: ClientOptions | ClientRequestArgs) {
    this.endpoint = ""
    this.timeout = 15000 // default to 15s
    this.events = {}
    this.unsubscribeSuspense = 1000
    this.maxConnectionTries = 3
    this.reconnectOnConnectionLoss = true
    this.options = options
  }

  connect(endpoint: string) {
    // force disconnect if already connected
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close()
    }

    this.events = {}
    this.connectionTries = 0
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(endpoint, this.options)
      this.endpoint = endpoint

      this.socket.addEventListener(`open`, (event) => {
        resolve(event)
      })

      this.socket.addEventListener(`close`, (event) => {
        if (this.reconnectOnConnectionLoss && !event.wasClean) {
          this.tryReconnect()
          reject(new Error(`Unhandled close. Reconnecting...`))
        } else {
          reject(event)
        }
      })

      this.socket.addEventListener(`error`, (err) => {
        reject(err)
      })
    })
  }

  tryReconnect() {
    this.connectionTries++

    if (this.connectionTries > this.maxConnectionTries) {
      return
    }

    this.socket = new WebSocket(this.endpoint, this.options)

    this.socket.addEventListener(`open`, () => {
      this.connectionTries = 0
    })

    this.socket.addEventListener(`close`, (event) => {
      this.tryReconnect()
    })
  }

  close() {
    if (!this.socket) return
    this.socket.close()
  }

  private clearEvent(event: string) {
    this.events[event].listeners.forEach(listener => {
      this.socket && this.socket.removeEventListener(`message`, listener)
    })

    Reflect.deleteProperty(this.events, event)
  }

  async closeAllListens(event: string) {
    if (this.events[event]) {
      const [err, _] = await to(this.call<boolean>(`unsubscribe`, { notify: event }))
      if (err) return Promise.reject(err)
      this.clearEvent(event)
    }

    return Promise.resolve()
  }

  async listenEvent<T>(event: string, onData: (msgEvent: MessageEvent, data?: T, err?: Error) => void) {
    const onMessage = (msgEvent: MessageEvent) => {
      if (this.events[event]) {
        const { id } = this.events[event]
        if (typeof msgEvent.data === `string`) {
          try {
            const data = parseData(msgEvent.data) as RPCResponse<any>
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
      // important if multiple listenEvent are called without await at least we store listener before getting id
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

        // no more listener so we unsubscribe from daemon websocket if socket still open
        if (listeners.length === 0) {
          if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            // we use a grace period to unsubscribe (mostly because of react useEffect and avoid unecessary subscribe)
            this.events[event].unsubscribeTimeoutId = setTimeout(async () => {
              this.call<boolean>(`unsubscribe`, { notify: event })
              Reflect.deleteProperty(this.events, event)
            }, this.unsubscribeSuspense)
          } else {
            // socket is closed so we don't send unsubscribe and no grace period delete right away
            Reflect.deleteProperty(this.events, event)
          }
        }
      }

      this.socket && this.socket.removeEventListener(`message`, onMessage)
      return Promise.resolve()
    }

    return Promise.resolve(closeListen)
  }

  call<T>(method: string, params?: any, overwriteData?: string): Promise<RPCResponse<T>> {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(new Error(`Socket is not initialized.`))
      if (this.socket.readyState !== WebSocket.OPEN) return reject(new Error(`Can't send msg. Socket is not opened.`))

      let requestMethod = this.createRequestMethod(method, params)
      // for XSWD we want to send the application data without request method wrapping
      if (overwriteData) {
        requestMethod.id = null
        requestMethod.data = overwriteData
      }

      let timeoutId: any = null
      const onMessage = (msgEvent: MessageEvent) => {
        if (typeof msgEvent.data === `string`) {
          const data = parseData(msgEvent.data) as RPCResponse<T>
          if (data.id === requestMethod.id) {
            clearTimeout(timeoutId)
            this.socket && this.socket.removeEventListener(`message`, onMessage)
            if (data.error) return reject(new Error(data.error.message))
            else resolve(data)
          }
        }
      }

      // make sure you listen before sending data
      this.socket && this.socket.addEventListener(`message`, onMessage) // we don't use { once: true } option because of timeout feature

      if (this.timeout > 0) {
        timeoutId = setTimeout(() => {
          this.socket && this.socket.removeEventListener(`message`, onMessage)
          reject(new Error(`timeout`))
        }, this.timeout)
      }

      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(requestMethod.data)
      }
    })
  }

  dataCall<T>(method: string, params?: any): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const [err, res] = await to(this.call<T>(method, params))
      if (err) return reject(err)
      return resolve(res.result)
    })
  }

  createRequestMethod(method: string, params?: any): { data: string, id: number | null } {
    const id = this.methodIdIncrement++
    const request = { id: id, jsonrpc: `2.0`, method } as RPCRequest
    if (params) request.params = params
    const data = JSON.stringify(request)
    return { data, id }
  }
}
