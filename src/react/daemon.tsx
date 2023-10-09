import React, { DependencyList, PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import to from 'await-to-js'
import { MessageEvent } from 'ws'

import DaemonWS from '../daemon/websocket'
import { RPCEvent } from '../lib/types'

const daemon = new DaemonWS()

const Context = createContext<NodeSocket>({
  connected: false,
  err: null,
  loading: false,
  daemon,
})

interface NodeSocket {
  daemon: DaemonWS
  loading: boolean
  err: any
  connected: boolean
}

interface NodeSocketProviderProps {
  endpoint: string
}

export const NodeSocketProvider = (props: PropsWithChildren<NodeSocketProviderProps>) => {
  const { children, endpoint } = props

  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [err, setErr] = useState<any>()

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const [err, res] = await to(daemon.connect(endpoint))
      if (err) setErr(err)
      else setConnected(true)
      setLoading(false)

      daemon.onError((err) => {
        setErr(err)
        setConnected(false)
      })

      daemon.onClose(() => {
        setConnected(false)
      })
    }

    load()
  }, [endpoint])

  return <Context.Provider value={{ daemon, loading, err, connected }}>
    {children}
  </Context.Provider>
}

interface NodeSocketSubscribeProps<T> {
  event: RPCEvent
  onConnected: () => void
  onData: (msgEvent: MessageEvent, data?: T, err?: Error | undefined) => void
}

export const useNodeSocketSubscribe = ({ event, onConnected, onData }: NodeSocketSubscribeProps<any>, dependencies: DependencyList) => {
  const nodeSocket = useNodeSocket()

  useEffect(() => {
    if (!nodeSocket.connected) return
    if (typeof onConnected === `function`) onConnected()

    let closeEvent: () => void
    const listen = async () => {
      if (!nodeSocket.daemon) return
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
