import to from 'await-to-js'

import { DEV_NODE_WS, TESTNET_NODE_WS } from '../config/nodes'
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

  const timeout = 30000
  test.skip('Subscribe [NewBlock]', () => {
    return new Promise(async (resolve, reject) => {
      const daemonWS = new DaemonWS(DEV_NODE_WS)
      const [err] = await to(daemonWS.connect())
      expect(err).toBeNull()

      const done = (err?: any) => {
        daemonWS.socket.close()
        if (err) return reject(err)
        resolve(null)
      }

      const unsubscribe = await daemonWS.onNewBlock(async (newBlock, msgEvent) => {
        console.log(newBlock)
        if (unsubscribe) await unsubscribe()
        daemonWS.socket.close()
        done()
      }).catch(err => done(err))
    })
  }, timeout)
})