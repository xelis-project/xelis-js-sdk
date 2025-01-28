import { parseJSON } from './parse_json'
import { RPCResponse } from './types'

export class RPC {
  endpoint: string
  timeout: number
  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.timeout = 3000
  }

  async request<T>(method: string, params?: any, headers?: Headers): Promise<T> {
    try {
      const controller = new AbortController()
      const body = JSON.stringify({ id: 1, jsonrpc: '2.0', method: method, params })

      const timeoutId = setTimeout(() => {
        controller.abort()
      }, this.timeout)

      headers = headers || new Headers()
      headers.set(`Content-Type`, `application/json`)
      const res = await fetch(this.endpoint, {
        headers,
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