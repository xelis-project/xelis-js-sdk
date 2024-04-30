import to from 'await-to-js'

import { LOCAL_NODE_RPC } from '../config'
import DaemonRPC from './rpc'

describe('RPC', () => {
  test('GetInfo', async () => {
    const daemonRPC = new DaemonRPC(LOCAL_NODE_RPC)

    const [err, res] = await to(daemonRPC.getInfo())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })
})