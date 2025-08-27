import to from "await-to-js"
import { RPCRequest, RPCResponse } from "./types"
import { parseJSON } from "./parse_json/parse_json"
import { ClientOptions, MessageEvent } from 'ws'
import WebSocket from 'isomorphic-ws'
import { ClientRequestArgs } from 'http'

export type IdRefObj = { id?: number }

export type EventDataListener = (data?: any, err?: Error) => void

type EventData = {
  onMessage: (event: MessageEvent) => void
  listeners: EventDataListener[]
}

export class WSRPC {
  socket: WebSocket
  methodIdIncrement: number
  callTimeout: number
  events: Map<string, EventData>

  constructor(endpoint: string, options?: ClientOptions | ClientRequestArgs) {
    this.socket = new WebSocket(endpoint, options)
    this.methodIdIncrement = 0
    this.callTimeout = 3000
    this.events = new Map()
    this.socket.addEventListener(`close`, () => {
      this.events = new Map()
    })
  }

  async closeListener(event: string, listener: EventDataListener) {
    const eventData = this.events.get(event)
    if (eventData) {
      if (eventData.listeners.length > 1) {
        eventData.listeners = eventData.listeners.filter(l => l !== listener)
        this.events.set(event, eventData)
      } else {
        this.events.delete(event);
        this.socket.removeEventListener(`message`, eventData.onMessage)
        this.dataCall<boolean>(`unsubscribe`, { notify: event })
      }
    }
  }

  async listen(event: string, listener: EventDataListener) {
    const eventData = this.events.get(event)
    if (eventData) {
      eventData.listeners.push(listener)
      this.events.set(event, eventData)
    } else {
      let idRefObject = {} as IdRefObj
      this.dataCall<boolean>(`subscribe`, { notify: event }, idRefObject)

      const onMessage = (msgEvent: MessageEvent) => {
        const eventData = this.events.get(event) as EventData
        if (eventData && typeof msgEvent.data === `string`) {
          try {
            const data = parseJSON(msgEvent.data) as RPCResponse<any>

            // event result will contain an event parameter with the event name defined
            if (data.result["event"] === event && data.id === idRefObject.id) {
              eventData.listeners.forEach((listener) => {
                if (data.error) {
                  listener(undefined, new Error(data.error.message))
                } else {
                  listener(data.result, undefined)
                }
              })
            }
          } catch {
            // can't parse json -- do nothing
          }
        }
      }

      this.socket.addEventListener(`message`, onMessage)
      this.events.set(event, { onMessage, listeners: [listener] })
    }
  }

  rawCall<T>(id: number, body: string): Promise<T> {
    return new Promise((resolve, reject) => {
      if (this.socket.readyState !== WebSocket.OPEN) return reject(new Error(`Can't send msg. Socket is not opened.`))

      let timeoutId: any = null
      const onMessage = (msgEvent: MessageEvent) => {
        if (typeof msgEvent.data === `string`) {
          const data = parseJSON(msgEvent.data)

          const evaluate_data = () => {
            clearTimeout(timeoutId)
            this.socket.removeEventListener(`message`, onMessage)

            if (data.error && data.error.message) {
              reject(new Error(data.error.message))
              return
            }

            return resolve(data)
          }

          // this is for batch call we match the id with first item id
          if (Array.isArray(data) && data.length > 0 && data[0].id === id) {
            return evaluate_data()
          }

          // the msg id is matching so we can evaluate the data
          if (data.id === id) {
            return evaluate_data()
          }

          // special XSWD case - sending first call will return null id
          if (data.id === null && id === 0) {
            return evaluate_data()
          }
        }
      }

      this.socket.addEventListener(`message`, onMessage)

      if (this.callTimeout > 0) {
        timeoutId = setTimeout(() => {
          this.socket && this.socket.removeEventListener(`message`, onMessage)
          reject(new Error(`timeout`))
        }, this.callTimeout)
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

  batchCall(requests: RPCRequest[]): Promise<({} | Error)[]> {
    return new Promise(async (resolve, reject) => {
      let id = this.methodIdIncrement++
      requests.forEach((request) => {
        request.id = id
        request.jsonrpc = "2.0"
      })

      const data = JSON.stringify(requests)
      const [err, res] = await to(this.rawCall<RPCResponse<any>[]>(id, data))
      if (err) return reject(err)

      let items = [] as ({} | Error)[]
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
}