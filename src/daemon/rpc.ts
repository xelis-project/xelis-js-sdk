import { GetInfoResult } from './types'

class RPC {
  endpoint: string
  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async fetch<T>(method: string, params?: any): Promise<T> {
    try {
      const body = JSON.stringify({ id: 1, jsonrpc: '2.0', method: method, params })
      const res = await fetch(this.endpoint, { method: `POST`, body })

      if (res.ok) {
        const data = await res.json()
        return Promise.resolve(data.result)
      } else {
        return Promise.reject(new Error(`${res.status} - ${res.statusText}`))
      }
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async getInfo() {
    return this.fetch<GetInfoResult>(`get_info`)
  }
}

export default RPC
