import to from 'await-to-js'

import { TESTNET_NODE_WS } from '../config/nodes'
import DaemonRPC from './rpc'

describe('RPC', () => {
  test('GetInfo', async () => {
    const daemonRPC = new DaemonRPC(TESTNET_NODE_WS)

    const [err, res] = await to(daemonRPC.getInfo())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })
})