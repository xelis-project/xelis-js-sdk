import { RPC as DaemonRPC } from '../../dist/esm/daemon/rpc.js'
import { TESTNET_NODE_RPC } from '../../dist/esm/config.js'

const main = async () => {
  const daemon = new DaemonRPC(TESTNET_NODE_RPC)
  const res = await daemon.getInfo()
  console.log(res)
}

main()