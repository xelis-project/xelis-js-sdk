import React, { DependencyList, PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { to } from 'await-to-js'
import { CloseEvent, ErrorEvent, MessageEvent, } from 'ws'

import DaemonWS from '../daemon/websocket'
import { RPCEvent } from '../daemon/types'

export const INITIATING = -1

const daemon = new DaemonWS()

const Context = createContext<NodeSocket>({
  err: undefined,
  daemon,
  readyState: INITIATING
})

interface NodeSocket {
  daemon: DaemonWS
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

  useEffect(() => {
    const connect = async () => {
      setErr(undefined)
      const [err, _] = await to(daemon.connect(endpoint))
      if (err) setErr(err)
    }

    connect()
  }, [endpoint])

  useEffect(() => {
    if (!timeout) return
    daemon.timeout = timeout
  }, [timeout])

  useEffect(() => {
    if (!daemon.socket) return
    setReadyState(daemon.socket.readyState)

    const onOpen = () => {
      if (!daemon.socket) return
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
  }, [daemon.socket])

  return <Context.Provider value={{ daemon, err, readyState }}>
    {children}
  </Context.Provider>
}

interface NodeSocketSubscribeProps<T> {
  event: RPCEvent
  onLoad: () => void
  onData: (msgEvent: MessageEvent, data?: T, err?: Error | undefined) => void
}

export const useNodeSocketSubscribe = ({ event, onLoad, onData }: NodeSocketSubscribeProps<any>, dependencies: DependencyList) => {
  const nodeSocket = useNodeSocket()

  useEffect(() => {
    if (nodeSocket.readyState !== WebSocket.OPEN) return
    if (typeof onLoad === `function`) onLoad()

    let closeEvent: () => void
    const listen = async () => {
      closeEvent = await nodeSocket.daemon.listenEvent(event, onData)
    }

    listen()
    return () => {
      closeEvent && closeEvent()
    }
  }, [nodeSocket, ...dependencies])
}

export const useNodeSocket = () => useContext(Context)
export default useNodeSocket
