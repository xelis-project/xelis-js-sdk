import to from 'await-to-js'

import { DEV_NODE_RPC } from '../config/nodes'
import DaemonRPC from './rpc'

describe('RPC', () => {
  test('GetInfo', async () => {
    const daemonRPC = new DaemonRPC(DEV_NODE_RPC)

    const [err, res] = await to(daemonRPC.getInfo())
    expect(err).toBeNull()
    
    console.log(res)
    expect(res)
  })
})