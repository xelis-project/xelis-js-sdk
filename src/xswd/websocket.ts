import { WSRPC } from '../rpc/websocket'
import { DaemonMethods } from '../daemon/websocket'
import { WalletMethods } from '../wallet/websocket'
import { ApplicationData } from './types'

export class WS extends WSRPC {
  daemon: DaemonMethods
  wallet: WalletMethods

  constructor(endpoint: string) {
    super(endpoint)

    this.callTimeout = 0; // xswd needs user input for confirmation - timeout should not be used
    this.daemon = new DaemonMethods(this, "node.")
    this.wallet = new WalletMethods(this, "wallet.") 
  }

  authorize(app: ApplicationData) {
    const data = JSON.stringify(app)
    return this.rawCall(0, data)
  }
}

export default WS
