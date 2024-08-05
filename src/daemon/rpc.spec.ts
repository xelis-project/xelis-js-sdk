import { to } from 'await-to-js'

import { MAINNET_NODE_RPC, TESTNET_NODE_RPC, XELIS_ASSET } from '../config'
import DaemonRPC from './rpc'

const TESTNET_ADDR = `xet:rsdm79np9eqar7cg5jy9sdhwas74l4ml5enaasmae8jtjcvpr3vqqnlpysy`
const MAINNET_ADDR = `xel:fpkjnmq4j04g05r3gy2gw9jmcqzn96slpukrmkepgyfanstqusrqqne5udz`

const testnetDaemonRPC = new DaemonRPC(TESTNET_NODE_RPC)
// this node does not allow mining use testnet to tests mining funcs
const mainnetDaemonRPC = new DaemonRPC(MAINNET_NODE_RPC)

describe('DaemonRPC', () => {
  test(`getInfo`, async () => {
    const [err, res] = await to(testnetDaemonRPC.getInfo())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test(`getVersion`, async () => {
    const [err, res] = await to(testnetDaemonRPC.getVersion())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test(`getHeight`, async () => {
    const [err, res] = await to(testnetDaemonRPC.getHeight())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test(`getTopoheight`, async () => {
    const [err, res] = await to(testnetDaemonRPC.getTopoheight())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test(`getStableHeight`, async () => {
    const [err, res] = await to(testnetDaemonRPC.getStableHeight())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test(`getStableTopoheight`, async () => {
    const [err, res] = await to(testnetDaemonRPC.getStableTopoheight())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test(`getStableBalance`, async () => {
    const [err, res] = await to(mainnetDaemonRPC.getStableBalance({
      address: MAINNET_ADDR,
      asset: XELIS_ASSET
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getBlockTemplate', async () => {
    const [err, res] = await to(testnetDaemonRPC.getBlockTemplate(TESTNET_ADDR))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getBlockAtTopoheight', async () => {
    const [err, res] = await to(testnetDaemonRPC.getBlockAtTopoheight({
      topoheight: 0
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getBlocksAtHeight', async () => {
    const [err, res] = await to(testnetDaemonRPC.getBlocksAtHeight({
      height: 0
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getBlockByHash', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getBlockByHash({ hash: `452d2dbecb7023322e7f4737a65ea3bdaad29a55c5e93e39cc1a253d91fa8f36` }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getTopBlock', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getTopBlock())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getNonce', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getNonce({
      address: MAINNET_ADDR,
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getNonceAtTopoheight', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getNonceAtTopoheight({
      address: MAINNET_ADDR,
      topoheight: 153405
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('hasNonce', async () => {
    const [err, res] = await to(mainnetDaemonRPC.hasNonce({
      address: MAINNET_ADDR,
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getBalance', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getBalance({
      address: MAINNET_ADDR,
      asset: XELIS_ASSET
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('hasBalance', async () => {
    const [err, res] = await to(mainnetDaemonRPC.hasBalance({
      address: MAINNET_ADDR,
      asset: XELIS_ASSET
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getBalanceAtTopoheight', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getBalanceAtTopoheight({
      address: MAINNET_ADDR,
      asset: XELIS_ASSET,
      topoheight: 153405
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getAsset', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getAsset({
      asset: XELIS_ASSET
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getAssets', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getAssets({
      skip: 0,
      maximum: 10
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('countAssets', async () => {
    const [err, res] = await to(mainnetDaemonRPC.countAssets())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('countTransactions', async () => {
    const [err, res] = await to(mainnetDaemonRPC.countTransactions())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getTips', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getTips())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('p2pStatus', async () => {
    const [err, res] = await to(mainnetDaemonRPC.p2pStatus())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getDAGOrder', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getDAGOrder())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getMempool', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getMemPool())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getTransaction', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getTransaction(`de76d2447b91d93565e679de9bfb6f8361d0f3fd21b7e7fbaee9b36c98723b2c`))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getTransactions', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getTransactions([
      `de76d2447b91d93565e679de9bfb6f8361d0f3fd21b7e7fbaee9b36c98723b2c`
    ]))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getBlocksRangeByTopoheight', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getBlocksRangeByTopoheight({
      start_topoheight: 0,
      end_topoheight: 10
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getBlocksRangeByHeight', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getBlocksRangeByHeight({
      start_height: 0,
      end_height: 10
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getAccounts', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getAccounts({
      skip: 0,
      maximum: 10
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('countAccounts', async () => {
    const [err, res] = await to(mainnetDaemonRPC.countAccounts())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getAccountHistory', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getAccountHistory({
      address: MAINNET_ADDR
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getAccountAssets', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getAccountAssets(MAINNET_ADDR))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getPeers', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getPeers())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getDevFeeThresholds', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getDevFeeThresholds())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getSizeOnDisk', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getSizeOnDisk())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('isTxExecutedInBlock', async () => {
    const [err, res] = await to(mainnetDaemonRPC.isTxExecutedInBlock({
      block_hash: `000000001849d07bbb4165c8ba1d1fc472a0629f56895efb8689e06ce62b3ca8`,
      tx_hash: `6e4bbd77b305fb68e2cc7576b4846d2db3617e3cbc2eb851cb2ae69b879e9d0f`
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getAccountRegistrationTopoheight', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getAccountRegistrationTopoheight(MAINNET_ADDR))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('isAccountRegistered', async () => {
    const [err, res] = await to(mainnetDaemonRPC.isAccountRegistered({
      address: MAINNET_ADDR,
      in_stable_height: true
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getMempoolCache', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getMempoolCache(`xel:aj5fza64zg0x75shr6y8wren5733hfuemrq3vk9eztwntvcdasjqq5z78lj`))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getDifficulty', async () => {
    const [err, res] = await to(mainnetDaemonRPC.getDifficulty())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('validateAddress', async () => {
    const [err, res] = await to(mainnetDaemonRPC.validateAddress({
      address: MAINNET_ADDR,
      allow_integrated: false
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res).toBeTruthy()
  })

  test('extractKeyFromAddress', async () => {
    const [err, res] = await to(mainnetDaemonRPC.extractKeyFromAddress({
      address: MAINNET_ADDR,
      as_hex: true
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getMinerWork', async () => {
    const [err1, res1] = await to(testnetDaemonRPC.getBlockTemplate(TESTNET_ADDR))
    console.log(err1, res1)
    expect(err1).toBeNull()

    const [err2, res2] = await to(testnetDaemonRPC.getMinerWork({
      template: res1?.result.template!
    }))
    expect(err2).toBeNull()
    console.log(res2)
    expect(res2)
  })

  test('splitAddress', async () => {
    const [err1, res1] = await to(testnetDaemonRPC.splitAddress({ address: "xet:upqflhm65lmjtukavf4de93kphk4j990hw9x9hhrc8rwleduruhqzqqpqvcnydgd3plda" }))
    console.log(err1, res1)
    expect(err1).toBeNull()

    console.log(res1)
    expect(res1)
  })
})