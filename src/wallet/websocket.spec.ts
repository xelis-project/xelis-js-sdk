import to from 'await-to-js'

import { LOCAL_WALLET_WS } from '../config.js'
import WalletWS from './websocket.js'

describe('WS', () => {
  test('GetAddress', async () => {
    const walletWS = new WalletWS(`test`, `test`)
    const [err] = await to(walletWS.connect(LOCAL_WALLET_WS))
    expect(err).toBeNull()
    const [err2, res] = await to(walletWS.methods.getAddress())
    expect(err2).toBeNull()

    console.log(res)
    expect(res)

    walletWS.close()
  })
})