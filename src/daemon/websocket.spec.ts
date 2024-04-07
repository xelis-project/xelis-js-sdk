import to from 'await-to-js'

import { LOCAL_NODE_WS } from '../config.js'
import { RPCEvent } from './types.js'
import DaemonWS from './websocket.js'

describe('WS', () => {
  test('GetInfo', async () => {
    const daemonWS = new DaemonWS()
    const [err] = await to(daemonWS.connect(LOCAL_NODE_WS))
    expect(err).toBeNull()
    const [err2, res] = await to(daemonWS.methods.getInfo())
    expect(err2).toBeNull()

    console.log(res)
    expect(res)

    daemonWS.close()
  })

  test('Reconnect', async () => {
    const daemonWS = new DaemonWS()
    const [err] = await to(daemonWS.connect(LOCAL_NODE_WS))
    expect(err).toBeNull()

    console.log('Reconnecting to testnet...')
    await daemonWS.connect(LOCAL_NODE_WS)
    daemonWS.close()
    expect(true)
  })

  const timeout = 40000
  test('Listen [NewBlock]', () => {
    return new Promise(async (resolve, reject) => {
      const daemonWS = new DaemonWS()
      const [err] = await to(daemonWS.connect(LOCAL_NODE_WS))
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

  test('Multi Listen', () => {
    return new Promise(async (resolve, reject) => {
      const daemonWS = new DaemonWS()
      const [err] = await to(daemonWS.connect(LOCAL_NODE_WS))
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

  test('Check invalid event', async () => {
    const daemonWS = new DaemonWS()
    const [err] = await to(daemonWS.connect(LOCAL_NODE_WS))
    expect(err).toBeNull()

    //@ts-ignore
    const [err2, _] = await to(daemonWS.listenEvent(`asdasd`, async (result, msgEvent) => { }))
    expect(err2).toBeDefined()
    daemonWS.close()
  })
})