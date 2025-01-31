import { parseJSON } from './parse_json/parse_json'
import { RPCRequest, RPCResponse } from './types'

export class RPC {
  endpoint: string
  timeout: number
  headers: Headers

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.timeout = 3000
    this.headers = new Headers()
    this.headers.set(`Content-Type`, `application/json`)
  }

  async batchRequest(requests: RPCRequest[]): Promise<any | Error[]> {
    try {
      const controller = new AbortController()

      let id = 0
      requests.forEach((request) => {
        request.id = ++id
        request.jsonrpc = "2.0"
      })

      const body = JSON.stringify(requests)

      const timeoutId = setTimeout(() => {
        controller.abort()
      }, this.timeout)

      const res = await fetch(this.endpoint, {
        headers: this.headers,
        method: `POST`,
        body,
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      if (res.ok) {
        const jsonString = await res.text()

        let items = [] as any | Error[]
        const data = parseJSON(jsonString) as RPCResponse<any>[]
        data.forEach((item) => {
          if (item.error) {
            items.push(new Error(item.error.message))
          } else {
            items.push(item.result)
          }
        })

        return Promise.resolve(items)
      } else {
        return Promise.reject(new Error(`${res.status} - ${res.statusText}`))
      }
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async request<T>(method: string, params?: any): Promise<T> {
    try {
      const controller = new AbortController()
      const body = JSON.stringify({ id: 1, jsonrpc: '2.0', method: method, params })

      const timeoutId = setTimeout(() => {
        controller.abort()
      }, this.timeout)

      const res = await fetch(this.endpoint, {
        headers: this.headers,
        method: `POST`,
        body,
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      if (res.ok) {
        const jsonString = await res.text()
        const data = parseJSON(jsonString) as RPCResponse<T>

        if (data.error) {
          return Promise.reject(new Error(data.error.message))
        }

        return Promise.resolve(data.result)
      } else {
        return Promise.reject(new Error(`${res.status} - ${res.statusText}`))
      }
    } catch (err) {
      return Promise.reject(err)
    }
  }
}