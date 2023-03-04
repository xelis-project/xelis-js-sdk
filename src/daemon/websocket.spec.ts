import to from 'await-to-js'

import { DEV_NODE_WS, TESTNET_NODE_WS } from '../config/nodes'
import { RPCEvent } from './types'
import DaemonWS from './websocket'

describe('WS', () => {
  test('GetInfo', async () => {
    const daemonWS = new DaemonWS(DEV_NODE_WS)
    const [err] = await to(daemonWS.connect())
    expect(err).toBeNull()
    const [err2, info] = await to(daemonWS.getInfo())
    expect(err2).toBeNull()

    console.log(info)
    expect(info)

    daemonWS.socket.close()
  })

  test('Reconnect', async () => {
    const daemonWS = new DaemonWS(DEV_NODE_WS)
    const [err] = await to(daemonWS.connect())
    expect(err).toBeNull()

    console.log('Reconnecting to testnet...')
    await daemonWS.reconnect(TESTNET_NODE_WS)
    daemonWS.socket.close()
    expect(true)
  })

  const timeout = 40000
  test('Listen [NewBlock]', () => {
    return new Promise(async (resolve, reject) => {
      const daemonWS = new DaemonWS(DEV_NODE_WS)
      const [err] = await to(daemonWS.connect())
      expect(err).toBeNull()

      const doneTest = (err?: any) => {
        daemonWS.socket.close()
        if (err) return reject(err)
        resolve(null)
      }

      const closeListen = await daemonWS.onNewBlock(async (newBlock, msgEvent) => {
        console.log(newBlock)
        if (closeListen) await closeListen()
        doneTest()
      }).catch(err => doneTest(err))
    })
  }, timeout)

  test('Multi Listen', () => {
    return new Promise(async (resolve, reject) => {
      const daemonWS = new DaemonWS(DEV_NODE_WS)
      const [err] = await to(daemonWS.connect())
      expect(err).toBeNull()

      let count = 3

      const doneTest = async (err?: any) => {
        if (err) return reject(err)
        count--
        if (count === 0) {
          const [err] = await to(daemonWS.closeAllListens(RPCEvent.NewBlock))
          if (err) return reject(err)

          daemonWS.socket.close()
          resolve(null)
        }
      }

      for (let i = 0; i < count; i++) {
        daemonWS.onNewBlock(async (newBlock, msgEvent) => {
          console.log(newBlock)
          doneTest()
        }).catch(err => doneTest(err))
      }
    })
  }, timeout)
})