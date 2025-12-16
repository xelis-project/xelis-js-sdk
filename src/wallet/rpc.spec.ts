import { to } from 'await-to-js'
import { Element } from '../data/element'

import { LOCAL_WALLET_RPC, XELIS_ASSET } from '../config'
import WalletRPC from './rpc'

const walletRPC = new WalletRPC(LOCAL_WALLET_RPC, `test`, `test`)

describe('WalletRPC', () => {
  test('getVersion', async () => {
    const [err, res] = await to(walletRPC.getVersion())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getNetwork', async () => {
    const [err, res] = await to(walletRPC.getNetwork())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getNonce', async () => {
    const [err, res] = await to(walletRPC.getNonce())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getTopoheight', async () => {
    const [err, res] = await to(walletRPC.getTopoheight())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getAddress', async () => {
    const [err, res] = await to(walletRPC.getAddress())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('splitAddress', async () => {
    const [err, res] = await to(walletRPC.splitAddress({
      address: `xet:6eadzwf5xdacts6fs4y3csmnsmy4mcxewqt3xyygwfx0hm0tm32szqsrqyzkjar9d4esyqgpq4ehwmmjvsqqypgpq45x2mrvduqqzpthdaexceqpq4mk7unywvqsgqqpq4yx2mrvduqqzp2hdaexceqqqyzxvun0d5qqzp2cg4xyj5ct5udlg`
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getBalance', async () => {
    const [err, res] = await to(walletRPC.getBalance())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('hasBalance', async () => {
    const [err, res] = await to(walletRPC.hasBalance())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getTrackedAssets', async () => {
    const [err, res] = await to(walletRPC.getTrackedAssets())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getAssetPrecision', async () => {
    const [err, res] = await to(walletRPC.getAssetPrecision({
      asset: XELIS_ASSET
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('getTransaction', async () => {
    const [err, res] = await to(walletRPC.getTransaction(`381edf117446514852eace4e48e641d072d285e9c610662e21d2ae5a1cc0367a`))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('buildTransaction', async () => {
    const [err, res] = await to(walletRPC.buildTransaction({
      broadcast: false,
      tx_as_hex: true,
      transfers: [{
        amount: 0,
        asset: XELIS_ASSET,
        destination: `xet:6eadzwf5xdacts6fs4y3csmnsmy4mcxewqt3xyygwfx0hm0tm32sqxdy9zk`
      }],
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('buildTransactionFeeBuilder', async () => {
    const [err, res] = await to(walletRPC.buildTransaction({
      broadcast: false,
      tx_as_hex: true,
      transfers: [{
        amount: 0,
        asset: XELIS_ASSET,
        destination: `xet:6eadzwf5xdacts6fs4y3csmnsmy4mcxewqt3xyygwfx0hm0tm32sqxdy9zk`
      }],
      fee: { extra: { multiplier: 2 } },
      base_fee: { fixed: 1000 }
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('transferTransaction', async () => {
    const [err, res] = await to(walletRPC.buildTransaction({
      broadcast: true,
      tx_as_hex: true,
      transfers: [{
        amount: 100,
        asset: XELIS_ASSET,
        destination: `xet:6eadzwf5xdacts6fs4y3csmnsmy4mcxewqt3xyygwfx0hm0tm32sqxdy9zk`
      }],
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('burnTransaction', async () => {
    const [err, res] = await to(walletRPC.buildTransaction({
      broadcast: true,
      tx_as_hex: true,
      burn: {
        amount: 500,
        asset: XELIS_ASSET
      }
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('deploySmartContractTransaction', async () => {
    // hello world smart contract
    const [err, res] = await to(walletRPC.buildTransaction({
      broadcast: true,
      tx_as_hex: true,
      deploy_contract: {
        module: "0200081868656c6c6f20776f726c642066726f6d20696e766f6b65210004000000000000000000010a000000182b010001001402"
      }
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('deploySmartContractWithConstructor', async () => {
    // hello world smart contract
    const [err, res] = await to(walletRPC.buildTransaction({
      broadcast: true,
      tx_as_hex: true,
      deploy_contract: {
        module: "0300081d68656c6c6f20776f726c642066726f6d20636f6e7374727563746f72210004000000000000000000081868656c6c6f20776f726c642066726f6d20696e766f6b652100020a000000182b010001001403000a000200182b010001001402",
        invoke: {
          max_gas: 5000000,
          deposits: {
            "0000000000000000000000000000000000000000000000000000000000000000": {
              amount: 100000000,
              private: false
            }
          }
        }
      }
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('deplySmartContractAsset', async () => {
    // hello world smart contract
    const [err, res] = await to(walletRPC.buildTransaction({
      broadcast: true,
      tx_as_hex: true,
      deploy_contract: {
        module: "0602020001010004000009184e72a0000004000000000000000000080948617368506f77657200080248500001080004000009184e72a00000013c000000020000000100000200000300000400010000186c010201000101000005001876010718d20118260000050001010018720118c90107000100140300",
        invoke: {
          max_gas: 100000000,
          deposits: {
            "0000000000000000000000000000000000000000000000000000000000000000": {
              amount: 100000000,
              private: false
            }
          }
        }
      }
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('invokeSmartContractMint', async () => {
    // hello world smart contract
    const [err, res] = await to(walletRPC.buildTransaction({
      broadcast: true,
      tx_as_hex: true,
      invoke_contract: {
        contract: "4ee56bf69a18c03b5e5ee68f92a8bf73c0ba97801832dcf573231efaadc8548e",
        entry_id: 1,
        deposits: {},
        max_gas: 1000000,
        parameters: [{
          type: "primitive",
          value: { type: "u64", value: "1000" }
        }],
        permission: "none"
      }
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('invokeSmartContractTransaction', async () => {
    // hello world smart contract
    const [err, res] = await to(walletRPC.buildTransaction({
      broadcast: true,
      tx_as_hex: true,
      invoke_contract: {
        contract: "16d69521a8b66e3098251d87e9e7e2ed430bac44d0bc56bc881d9bbfe2569297",
        entry_id: 0,
        deposits: {},
        max_gas: 1000,
        parameters: [],
        permission: "none"
      }
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('listTransactions', async () => {
    const [err, res] = await to(walletRPC.listTransactions())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('isOnline', async () => {
    const [err, res] = await to(walletRPC.isOnline())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('estimateFees', async () => {
    const [err, res] = await to(walletRPC.estimateFees({
      transfers: [{
        amount: 0,
        asset: XELIS_ASSET,
        destination: `xet:6eadzwf5xdacts6fs4y3csmnsmy4mcxewqt3xyygwfx0hm0tm32sqxdy9zk`
      }]
    }))
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })

  test('signData', async () => {
    let data = Element.v("hello world")

    const [err, publicKey] = await to(walletRPC.getAddress())
    expect(err).toBeNull()

    const [err2, sig] = await to(walletRPC.signData(data))
    expect(err2).toBeNull()
  })
})