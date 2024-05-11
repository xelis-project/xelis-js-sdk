import { parseData } from './parse_data'
import { RPCResponse } from './types'

export class RPC {
  endpoint: string
  timeout: number
  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.timeout = 3000
  }

  async post<T>(method: string, params?: any, headers?: Headers): Promise<RPCResponse<T>> {
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
        const stringData = await res.text()
        const data = parseData(stringData) as RPCResponse<T>

        if (data.error) {
          return Promise.reject(new Error(data.error.message))
        }

        return Promise.resolve(data)
      } else {
        return Promise.reject(new Error(`${res.status} - ${res.statusText}`))
      }
    } catch (err) {
      console.log(err)
      return Promise.reject(err)
    }
  }
}