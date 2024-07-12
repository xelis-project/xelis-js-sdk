import { to } from 'await-to-js'

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
})