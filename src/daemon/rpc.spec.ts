import to from 'await-to-js'

import { LOCAL_NODE_RPC, MAINNET_NODE_RPC, TESTNET_NODE_RPC } from '../config'
import DaemonRPC from './rpc'

const TESTNET_ADDR = `xet:rsdm79np9eqar7cg5jy9sdhwas74l4ml5enaasmae8jtjcvpr3vqqnlpysy`
const MAINNET_ADDR = `xel:fpkjnmq4j04g05r3gy2gw9jmcqzn96slpukrmkepgyfanstqusrqqne5udz`

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

  test('GetTransaction', async () => {
    const daemonRPC = new DaemonRPC(MAINNET_NODE_RPC)

    const [err, res] = await to(daemonRPC.getTransaction(`de76d2447b91d93565e679de9bfb6f8361d0f3fd21b7e7fbaee9b36c98723b2c`))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('IsAccountRegistered', async () => {
    const daemonRPC = new DaemonRPC(MAINNET_NODE_RPC)

    const [err, res] = await to(daemonRPC.isAccountRegistered({
      address: MAINNET_ADDR,
      in_stable_height: true
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('GetMempoolCache', async () => {
    const daemonRPC = new DaemonRPC(MAINNET_NODE_RPC)

    const [err, res] = await to(daemonRPC.getMempoolCache(`xel:aj5fza64zg0x75shr6y8wren5733hfuemrq3vk9eztwntvcdasjqq5z78lj`))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('GetDifficulty', async () => {
    const daemonRPC = new DaemonRPC(MAINNET_NODE_RPC)

    const [err, res] = await to(daemonRPC.getDifficulty())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('ValidateAddress', async () => {
    const daemonRPC = new DaemonRPC(MAINNET_NODE_RPC)

    const [err, res] = await to(daemonRPC.validateAddress({
      address: MAINNET_ADDR,
      allow_integrated: false
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res).toBeTruthy()
  })
})