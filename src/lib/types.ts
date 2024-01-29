export interface RPCRequest {
  id: number | null
  jsonrpc: string
  method: string
  params: string
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
