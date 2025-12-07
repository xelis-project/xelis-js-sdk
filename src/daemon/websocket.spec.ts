import { to } from 'await-to-js'

import { LOCAL_NODE_WS, MAINNET_NODE_WS } from '../config'
import { RPCEvent, RPCMethod } from './types'
import DaemonWS from './websocket'
import { RPCRequest } from '../rpc/types'

describe('DaemonWS', () => {
  test('getInfo', async () => {
    const daemonWS = new DaemonWS(MAINNET_NODE_WS)
    daemonWS.socket.addEventListener(`open`, async () => {
      const [err1, res] = await to(daemonWS.methods.getInfo())
      expect(err1).toBeNull()

      console.log(res)
      expect(res)

      daemonWS.socket.close()
    })
  })

  const timeout = 40000
  test('listen_NewBlock', () => {
    return new Promise(async (resolve, reject) => {
      const daemonWS = new DaemonWS(MAINNET_NODE_WS)
      daemonWS.socket.addEventListener(`open`, async () => {
        const doneTest = (err?: any) => {
          daemonWS.socket.close()
          if (err) return reject(err)
          resolve(null)
        }

        daemonWS.methods.addListener(RPCEvent.NewBlock, null, async (data, err) => {
          console.log(data)
          doneTest(err)
        })
      })
    })
  }, timeout)

  test('listen_InvokeContract', () => {
    return new Promise(async (resolve, reject) => {
      const daemonWS = new DaemonWS(MAINNET_NODE_WS)
      daemonWS.socket.addEventListener(`open`, async () => {
        const doneTest = (err?: any) => {
          daemonWS.socket.close()
          if (err) return reject(err)
          resolve(null)
        }

        daemonWS.methods.addListener(RPCEvent.InvokeContract, { contract: "32c5ccae542846696b0cd7f40949023219e123adca44d123d14d467ae8761f83" }, async (data, err) => {
          console.log(data)
          doneTest(err)
        })
      })
    })
  })

  test('multi_listen', () => {
    return new Promise(async (resolve, reject) => {
      const daemonWS = new DaemonWS(MAINNET_NODE_WS)
      daemonWS.socket.addEventListener(`open`, async () => {
        let count = 3

        const doneTest = async (err?: any) => {
          if (err) return reject(err)
          count--
          if (count === 0) {
            daemonWS.socket.close()
            resolve(null)
          }
        }

        for (let i = 0; i < count; i++) {
          daemonWS.methods.addListener(RPCEvent.NewBlock, null, async (data, err) => {
            console.log(data)
            doneTest(err)
          })
        }
      })
    })
  }, timeout)

  test('check_invalid_event', async () => {
    const daemonWS = new DaemonWS(MAINNET_NODE_WS)

    daemonWS.socket.addEventListener(`open`, async () => {
      daemonWS.addListener(`asdasd`, async (data, err) => {

      }).catch((err) => {
        expect(err).toBeDefined()
        daemonWS.socket.close()
      })
    })
  })

  test(`batchRequest`, async () => {
    const daemonWS = new DaemonWS(MAINNET_NODE_WS)
    daemonWS.socket.addEventListener(`open`, async () => {
      const requests = [
        { method: RPCMethod.GetTopoheight },
        { method: RPCMethod.GetInfo },
        { method: "invalid" }
      ] as RPCRequest[]

      const [err1, res] = await to(daemonWS.batchCall(requests))
      console.log(err1, res)
      expect(err1).toBeNull()
    })
  })
})