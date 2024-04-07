import { WS as BaseWS } from '../lib/websocket.js'
import { ApplicationData } from '../wallet/types.js'
import { DaemonMethods } from '../daemon/websocket.js'
import { WalletMethods } from '../wallet/websocket.js'

export class WS extends BaseWS {
  daemon: DaemonMethods
  wallet: WalletMethods

  constructor() {
    super()
    this.timeout = 0
    this.daemon = new DaemonMethods(this, "node.")
    this.wallet = new WalletMethods(this, "wallet.") 
  }

  authorize(app: ApplicationData) {
    const data = JSON.stringify(app)
    return this.call("", {}, data)
  }
}

export default WS
