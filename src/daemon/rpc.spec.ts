import to from 'await-to-js'

import { LOCAL_NODE_RPC } from '../config'
import DaemonRPC from './rpc'

const TESTNET_ADDR = `xet:rsdm79np9eqar7cg5jy9sdhwas74l4ml5enaasmae8jtjcvpr3vqqnlpysy`

describe('RPC', () => {
  test('GetInfo', async () => {
    const daemonRPC = new DaemonRPC(LOCAL_NODE_RPC)

    const [err, res] = await to(daemonRPC.getInfo())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('GetBlockTemplate', async () => {
    const daemonRPC = new DaemonRPC(LOCAL_NODE_RPC)

    const [err, res] = await to(daemonRPC.getBlockTemplate(TESTNET_ADDR))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })
})