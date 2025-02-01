import { WSRPC } from '../rpc/websocket'
import { ApplicationData } from '../wallet/types'
import { DaemonMethods } from '../daemon/websocket'
import { WalletMethods } from '../wallet/websocket'

export class WS extends WSRPC {
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
    return this.rawCall(0, data)
  }
}

export default WS
