import to from 'await-to-js'

import { LOCAL_XSWD_WS } from '../config'
import XSWD from '../xswd/websocket'
import { ApplicationData } from './types'

describe('WS', () => {
  test(`XSWD`, async () => {
    const xswd = new XSWD()
    const [err] = await to(xswd.connect(LOCAL_XSWD_WS))
    expect(err).toBeNull()

    const app = {
      id: "9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08",
      name: "Test App",
      description: "This is a test app.",
      permissions: new Map()
    } as ApplicationData

    const [err2, res2] = await to(xswd.authorize(app))
    expect(err2).toBeNull()

    console.log(res2)
    expect(res2)

    const [err3, res3] = await to(xswd.wallet.getAddress())
    expect(err3).toBeNull()

    console.log(res3)
    expect(res3)

    const [err4, res4] = await to(xswd.daemon.getInfo())
    expect(err4).toBeNull()

    console.log(res4)
    expect(res4)


    xswd.close()
  }, 10000)
})