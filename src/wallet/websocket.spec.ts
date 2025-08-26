import { to } from 'await-to-js'

import { LOCAL_WALLET_WS } from '../config'
import WalletWS from './websocket'

describe('WalletWS', () => {
  test('getAddress', async () => {
    const walletWS = new WalletWS(LOCAL_WALLET_WS, `test`, `test`)
    walletWS.socket.addEventListener(`open`, async () => {
      const [err2, res] = await to(walletWS.methods.getAddress())
      expect(err2).toBeNull()

      console.log(res)
      expect(res)

      walletWS.socket.close()
    })
  })
})