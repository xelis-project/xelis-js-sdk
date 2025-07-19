import { ClientOptions, MessageEvent } from 'ws'
import WebSocket from 'isomorphic-ws'
import { ClientRequestArgs } from 'http'
import { to } from 'await-to-js'

import { RPCRequest, RPCResponse } from './types'
import { parseJSON } from './parse_json/parse_json'

interface EventData {
  id?: number
  listeners: ((msgEvent: MessageEvent) => void)[]
  unsubscribeTimeoutId?: any
}

export type EventWithParams = { [event: string]: {} }
export type EventKey = string | EventWithParams
export type IdRefObj = { id?: number }

export class WSRPC {
  endpoint: string
  socket?: WebSocket
  timeout: number
  unsubscribeSuspense: number
  reconnectOnConnectionLoss: boolean
  maxConnectionTries: number
  options?: ClientOptions | ClientRequestArgs

  connectionTries = 0
  methodIdIncrement = 0

  private events: Map<EventKey, EventData>

  constructor(options?: ClientOptions | ClientRequestArgs) {
    this.endpoint = ""
    this.timeout = 15000 // default to 15s
    this.events = new Map()
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

    this.events = new Map()
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

  private clearEvent(event: EventKey) {
    const eventData = this.events.get(event)
    if (eventData) {
      eventData.listeners.forEach(listener => {
        this.socket && this.socket.removeEventListener(`message`, listener)
      })

      this.events.delete(event)
    }
  }

  async closeAllListens(event: EventKey) {
    if (this.events.has(event)) {
      const [err, _] = await to(this.dataCall<boolean>(`unsubscribe`, { notify: event }))
      if (err) return Promise.reject(err)
      this.clearEvent(event)
    }

    return Promise.resolve()
  }

  async listenEvent<T>(event: EventKey, onData: (msgEvent: MessageEvent, data?: T, err?: Error) => void) {
    const onMessage = (msgEvent: MessageEvent) => {
      const eventData = this.events.get(event)
      if (eventData && typeof msgEvent.data === `string`) {
        try {
          const data = parseJSON(msgEvent.data) as RPCResponse<any>
          if (data.id === eventData.id) {
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

    let eventData = this.events.get(event)
    if (eventData) {
      if (eventData.unsubscribeTimeoutId) {
        // clear timeout to unsubscribe 
        // because we got a new registered event and want to cancel the pending unsubscribe grace period
        clearTimeout(eventData.unsubscribeTimeoutId)
      }

      eventData.listeners.push(onMessage)
    } else {
      // important if multiple listenEvent are called without await at least we store listener before getting id
      // avoid trying to subscribe the same event multiple times
      this.events.set(event, { listeners: [onMessage] })

      let idRefObject = {} as IdRefObj
      const [err, _] = await to(this.dataCall<boolean>(`subscribe`, { notify: event }, idRefObject))
      if (err) {
        this.clearEvent(event)
        return Promise.reject(err)
      }

      let eventData = this.events.get(event)
      if (eventData) eventData.id = idRefObject.id
    }

    this.socket && this.socket.addEventListener(`message`, onMessage)

    const closeListen = () => {
      const eventData = this.events.get(event)
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
          // we use a grace period to unsubscribe (mostly because of react useEffect and avoid unecessary subscribe)
          eventData.unsubscribeTimeoutId = setTimeout(async () => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
              this.dataCall<boolean>(`unsubscribe`, { notify: event })
            }

            this.events.delete(event)
          }, this.unsubscribeSuspense)
        }
      }

      this.socket && this.socket.removeEventListener(`message`, onMessage)
      return Promise.resolve()
    }

    return Promise.resolve(closeListen)
  }

  batchCall(requests: RPCRequest[]): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      let id = this.methodIdIncrement++
      requests.forEach((request) => {
        request.id = id
        request.jsonrpc = "2.0"
      })

      const data = JSON.stringify(requests)
      const [err, res] = await to(this.rawCall<RPCResponse<any>[]>(id, data))
      if (err) return reject(err)

      let items = [] as any[]
      res.forEach((v) => {
        if (v.error) {
          items.push(new Error(v.error.message))
        } else {
          items.push(v.result)
        }
      })

      return resolve(items)
    })
  }

  rawCall<T>(id: number, body: string): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.socket) return reject(new Error(`Socket is not initialized.`))
      if (this.socket.readyState !== WebSocket.OPEN) return reject(new Error(`Can't send msg. Socket is not opened.`))

      let timeoutId: any = null
      const onMessage = (msgEvent: MessageEvent) => {
        if (typeof msgEvent.data === `string`) {
          const data = parseJSON(msgEvent.data)

          if (data.error && data.error.message) {
            return reject(new Error(data.error.message))
          }

          if (Array.isArray(data) && data.length > 0 && data[0].id === id) {
            //@ts-ignore
            return resolve(data)
          }
          
          if (data.id === id) {
            return resolve(data)
          } 
          
          if (data.id === null && id === 0) {
            // special case with xswd sending first call will return null id
            return resolve(data)
          }

          reject(new Error("invalid data"))
        }
      }

      this.socket.addEventListener(`message`, onMessage)

      if (this.timeout > 0) {
        timeoutId = setTimeout(() => {
          this.socket && this.socket.removeEventListener(`message`, onMessage)
          reject(new Error(`timeout`))
        }, this.timeout)
      }

      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(body)
      }
    })
  }

  dataCall<T>(method: string, params?: any, idRefObj?: IdRefObj): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const id = this.methodIdIncrement++
      if (idRefObj) idRefObj.id = id
      const request = { id, jsonrpc: `2.0`, method } as RPCRequest
      if (params) request.params = params
      const data = JSON.stringify(request)

      const [err, res] = await to(this.rawCall<RPCResponse<T>>(id, data))
      if (err) return reject(err)
      if (res.error) {
        return reject(res.error.message)
      }

      return resolve(res.result)
    })
  }
}
