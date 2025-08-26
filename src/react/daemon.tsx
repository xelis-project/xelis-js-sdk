import React, { DependencyList, PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { CloseEvent, ErrorEvent, MessageEvent, } from 'ws'

import DaemonWS from '../daemon/websocket'
import { RPCEvent } from '../daemon/types'

export const INITIATING = -1

const Context = createContext<NodeSocket>({
  err: undefined,
  daemon: undefined,
  readyState: INITIATING
})

interface NodeSocket {
  daemon?: DaemonWS
  err?: Error
  readyState: number
}

interface NodeSocketProviderProps {
  endpoint: string
  timeout?: number
}

export const NodeSocketProvider = (props: PropsWithChildren<NodeSocketProviderProps>) => {
  const { children, endpoint, timeout } = props

  const [readyState, setReadyState] = useState<number>(INITIATING)
  const [err, setErr] = useState<Error | undefined>()
  const [daemon, setDaemon] = useState<DaemonWS>()

  useEffect(() => {
    const daemon = new DaemonWS(endpoint)
    setDaemon(daemon)
    return () => daemon.socket.close()
  }, [endpoint])

  useEffect(() => {
    if (!timeout) return
    if (daemon) daemon.callTimeout = timeout
  }, [timeout])

  useEffect(() => {
    if (!daemon) return
    setReadyState(daemon.socket.readyState)

    const onOpen = () => {
      setReadyState(daemon.socket.readyState)
      setErr(undefined)
    }

    const onClose = (event: CloseEvent) => {
      if (!daemon.socket) return
      setReadyState(daemon.socket.readyState)
      setErr(new Error(event.reason))
    }

    const onError = (err: ErrorEvent) => {
      if (!daemon.socket) return
      setReadyState(daemon.socket.readyState)
      setErr(new Error(err.message))
    }

    daemon.socket.addEventListener(`open`, onOpen)
    daemon.socket.addEventListener(`close`, onClose)
    daemon.socket.addEventListener(`error`, onError)

    return () => {
      if (!daemon.socket) return
      daemon.socket.removeEventListener(`open`, onOpen)
      daemon.socket.removeEventListener(`close`, onClose)
      daemon.socket.removeEventListener(`error`, onError)
    }
  }, [daemon])

  return <Context.Provider value={{ daemon, err, readyState }}>
    {children}
  </Context.Provider>
}

interface NodeSocketSubscribeProps<T> {
  event: RPCEvent
  onLoad: () => void
  onData: (event?: MessageEvent, data?: T, err?: Error | undefined) => void
}

export const useNodeSocketSubscribe = ({ event, onLoad, onData }: NodeSocketSubscribeProps<any>, dependencies: DependencyList) => {
  const nodeSocket = useNodeSocket()

  useEffect(() => {
    if (!nodeSocket.daemon) return;
    if (nodeSocket.readyState !== WebSocket.OPEN) return
    if (typeof onLoad === `function`) onLoad()

    nodeSocket.daemon.listen(event, onData)
    return () => {
      if (!nodeSocket.daemon) return;
      nodeSocket.daemon.closeListener(event, onData)
    }
  }, [nodeSocket, ...dependencies])
}

export const useNodeSocket = () => useContext(Context)
export default useNodeSocket
