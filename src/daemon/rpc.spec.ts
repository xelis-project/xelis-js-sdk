import to from 'await-to-js'

import { LOCAL_NODE_RPC } from '../config.js'
import DaemonRPC from './rpc.js'

describe('RPC', () => {
  test('GetInfo', async () => {
    const daemonRPC = new DaemonRPC(LOCAL_NODE_RPC)

    const [err, res] = await to(daemonRPC.getInfo())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })
})