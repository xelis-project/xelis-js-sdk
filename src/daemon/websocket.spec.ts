import { to } from 'await-to-js'

import { TESTNET_NODE_RPC } from '../config'
import { RPCEvent } from './types'
import DaemonWS from './websocket'

describe('DaemonWS', () => {
  test('getInfo', async () => {
    const daemonWS = new DaemonWS()
    const [err] = await to(daemonWS.connect(TESTNET_NODE_RPC))
    expect(err).toBeNull()
    const [err2, res] = await to(daemonWS.methods.getInfo())
    expect(err2).toBeNull()

    console.log(res)
    expect(res)

    daemonWS.close()
  })

  test('reconnect', async () => {
    const daemonWS = new DaemonWS()
    const [err] = await to(daemonWS.connect(TESTNET_NODE_RPC))
    expect(err).toBeNull()

    console.log('Reconnecting to testnet...')
    await daemonWS.connect(TESTNET_NODE_RPC)
    daemonWS.close()
    expect(true)
  })

  const timeout = 40000
  test('listen_NewBlock', () => {
    return new Promise(async (resolve, reject) => {
      const daemonWS = new DaemonWS()
      const [err] = await to(daemonWS.connect(TESTNET_NODE_RPC))
      expect(err).toBeNull()

      const doneTest = (err?: any) => {
        daemonWS.close()
        if (err) return reject(err)
        resolve(null)
      }

      const closeListen = await daemonWS.methods.onNewBlock(async (newBlock, msgEvent) => {
        console.log(newBlock)
        if (closeListen) await closeListen()
        doneTest()
      }).catch(err => doneTest(err))
    })
  }, timeout)

  test('multi_listen', () => {
    return new Promise(async (resolve, reject) => {
      const daemonWS = new DaemonWS()
      const [err] = await to(daemonWS.connect(TESTNET_NODE_RPC))
      expect(err).toBeNull()

      let count = 3

      const doneTest = async (err?: any) => {
        if (err) return reject(err)
        count--
        if (count === 0) {
          const [err] = await to(daemonWS.closeAllListens(RPCEvent.NewBlock))
          if (err) return reject(err)

          daemonWS.close()
          resolve(null)
        }
      }

      for (let i = 0; i < count; i++) {
        daemonWS.methods.onNewBlock(async (newBlock, msgEvent) => {
          console.log(newBlock)
          doneTest()
        }).catch(err => doneTest(err))
      }
    })
  }, timeout)

  test('check_invalid_event', async () => {
    const daemonWS = new DaemonWS()
    const [err] = await to(daemonWS.connect(TESTNET_NODE_RPC))
    expect(err).toBeNull()

    //@ts-ignore
    const [err2, _] = await to(daemonWS.listenEvent(`asdasd`, async (result, msgEvent) => { }))
    expect(err2).toBeDefined()
    daemonWS.close()
  })
})