import { to } from 'await-to-js'

import { MAINNET_NODE_RPC, TESTNET_NODE_RPC } from '../config'
import DaemonRPC from './rpc'

const TESTNET_ADDR = `xet:rsdm79np9eqar7cg5jy9sdhwas74l4ml5enaasmae8jtjcvpr3vqqnlpysy`
const MAINNET_ADDR = `xel:fpkjnmq4j04g05r3gy2gw9jmcqzn96slpukrmkepgyfanstqusrqqne5udz`

describe('DaemonRPC', () => {
  test(`getInfo`, async () => {
    const daemonRPC = new DaemonRPC(TESTNET_NODE_RPC)

    const [err, res] = await to(daemonRPC.getInfo())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getBlockTemplate', async () => {
    const daemonRPC = new DaemonRPC(TESTNET_NODE_RPC)

    const [err, res] = await to(daemonRPC.getBlockTemplate(TESTNET_ADDR))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getBlockByHash', async () => {
    const daemonRPC = new DaemonRPC(MAINNET_NODE_RPC)

    const [err, res] = await to(daemonRPC.getBlockByHash({ hash: `452d2dbecb7023322e7f4737a65ea3bdaad29a55c5e93e39cc1a253d91fa8f36` }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getTransaction', async () => {
    const daemonRPC = new DaemonRPC(MAINNET_NODE_RPC)

    const [err, res] = await to(daemonRPC.getTransaction(`de76d2447b91d93565e679de9bfb6f8361d0f3fd21b7e7fbaee9b36c98723b2c`))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('isAccountRegistered', async () => {
    const daemonRPC = new DaemonRPC(MAINNET_NODE_RPC)

    const [err, res] = await to(daemonRPC.isAccountRegistered({
      address: MAINNET_ADDR,
      in_stable_height: true
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getMempoolCache', async () => {
    const daemonRPC = new DaemonRPC(MAINNET_NODE_RPC)

    const [err, res] = await to(daemonRPC.getMempoolCache(`xel:aj5fza64zg0x75shr6y8wren5733hfuemrq3vk9eztwntvcdasjqq5z78lj`))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getDifficulty', async () => {
    const daemonRPC = new DaemonRPC(MAINNET_NODE_RPC)

    const [err, res] = await to(daemonRPC.getDifficulty())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('validateAddress', async () => {
    const daemonRPC = new DaemonRPC(MAINNET_NODE_RPC)

    const [err, res] = await to(daemonRPC.validateAddress({
      address: MAINNET_ADDR,
      allow_integrated: false
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res).toBeTruthy()
  })

  test('extractKeyFromAddress', async () => {
    const daemonRPC = new DaemonRPC(MAINNET_NODE_RPC)

    const [err, res] = await to(daemonRPC.extractKeyFromAddress({
      address: MAINNET_ADDR,
      as_hex: true
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })
})