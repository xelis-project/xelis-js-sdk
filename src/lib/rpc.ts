import { RPCResponse } from './types'

export class RPC {
  endpoint: string
  timeout: number
  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.timeout = 3000
  }

  async post<T>(method: string, params?: any): Promise<RPCResponse<T>> {
    try {
      const controller = new AbortController()
      const body = JSON.stringify({ id: 1, jsonrpc: '2.0', method: method, params })

      const timeoutId = setTimeout(() => {
        controller.abort()
      }, this.timeout)

      const res = await fetch(this.endpoint, {
        method: `POST`,
        body,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (res.ok) {
        const data = await res.json() as RPCResponse<T>

        if (data.error) {
          return Promise.reject(new Error(data.error.message))
        }

        return Promise.resolve(data)
      } else {
        return Promise.reject(new Error(`${res.status} - ${res.statusText}`))
      }
    } catch (err) {
      return Promise.reject(err)
    }
  }
}