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

  const x_place_contract = `180003000027100003000000640008016700030000000a0008015f00080163000300000000000805456d7074790008074d6178203130300008094e6f2063616c6c6572000802636300040000000000000000030002000003ffffffff00080f4e6f2076616c696420706978656c730007000007010003000000010004000000000000000100080c636f6d6d69745f696e64657800080b706978656c5f636f756e740008056f776e6572000802747300061c0200000201000100000000002c090f1b0000000101000000002c2214010b0200000100000001001f14010b0200000100000001001f1401220200000201000002000100000003001812011c0004001c0101000003001812011c1401110200000005000100000003001813011c1401fd026d0200000100001800000006002b0007001830010100001800000001002e00080018300118e901020100010100182500000900183001010100182600020200185b01020300184f01020400010300000a00185c01000b00182700020500000c00020600000d0002070001000011121601000002080001080006000000002d092a0f8e00000001080006010000002d230f9d0000000e6c0000000e9d0000000108000602000e002b0fb50000000e6c0000000eb5000000010700010800180100010800060017010001020900010800060117020001020a00010900010a0017030002020b00010600010b00181d01020c00010c00000d00182700020d00010d00010800180100010600010b00010d00181e01070e6c000000130107001800000208000108000006002b000f0018300101060018240102090001090011120c020000020a00010a003d020b00020c00010300010c00185c01020d00010d00000d00182700020e00010b001112f9010000020f00001000021000000600021100011100010e001800002c0fdd010000010e00011100150600010f00060029090fb0010000010e00011100150601010f00060129220fd1010000010e0001110015010f002f0110000011002f0edd0100000ed1010000011100001200300e7c0100000110002a0ff4010000010e00010f001801000ef40100000e6801000013010300010c00010e00185e01070e3a010000130107000102000104001851011903020a0001030001050017040001010a00185e0107010300000a000105000013001c185e01070014000105000015000108000016000102000017000104001851011b04020b00001300010b0018e301000b001402`;

  test('deploySmartContractTransaction', async () => {
    // hello world smart contract
    const [err, res] = await to(walletRPC.buildTransaction({
      broadcast: true,
      tx_as_hex: true,
      deploy_contract: {
        contract_version: "v1",
        module: x_place_contract // "0200081868656c6c6f20776f726c642066726f6d20696e766f6b65210004000000000000000000010a000000182b010001001402"
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
        contract_version: "v1",
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
        contract_version: "v1",
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