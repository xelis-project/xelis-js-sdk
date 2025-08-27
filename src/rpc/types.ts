export interface RPCRequest {
  id?: number
  jsonrpc?: string
  method: string
  params?: any
}

export interface RPCError {
  code: number
  message: string
}

export interface RPCResponse<T> {
  id: number
  result: T
  error?: RPCError
}
