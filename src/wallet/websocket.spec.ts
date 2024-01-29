import to from 'await-to-js'

import { LOCAL_WALLET_WS } from '../config'
import WalletWS from './websocket'

describe('WS', () => {
  test('GetAddress', async () => {
    const daemonWS = new WalletWS(`test`, `test`)
    const [err] = await to(daemonWS.connect(LOCAL_WALLET_WS))
    expect(err).toBeNull()
    const [err2, res] = await to(daemonWS.getAddress())
    expect(err2).toBeNull()

    console.log(res)
    expect(res)

    daemonWS.close()
  })
})