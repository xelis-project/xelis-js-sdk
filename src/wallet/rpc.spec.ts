import { to } from 'await-to-js'

import { LOCAL_WALLET_RPC } from '../config'
import WalletRPC from './rpc'

describe('WalletRPC', () => {
  test('getAddress', async () => {
    const walletRPC = new WalletRPC(LOCAL_WALLET_RPC, `test`, `test`)

    const [err, res] = await to(walletRPC.getAddress())
    expect(err).toBeNull()
    console.log(res)
    expect(res)
  })
})