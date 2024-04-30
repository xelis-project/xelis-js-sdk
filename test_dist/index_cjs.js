const { RPC: DaemonRPC } = require('../dist/cjs/daemon/rpc')
const { WS: DaemonWS } = require('../dist/cjs/daemon/websocket')
const { WS: WalletWS } = require('../dist/cjs/wallet/websocket')
const { TESTNET_NODE_RPC, TESTNET_NODE_WS, LOCAL_NODE_WS } = require('../dist/cjs/config')

const main = async () => {
  const daemonRPC = new DaemonRPC(TESTNET_NODE_RPC)
  const res1 = await daemonRPC.getInfo()
  console.log(res1)

  const daemonWS = new DaemonWS()
  await daemonWS.connect(TESTNET_NODE_WS)
  const res2 = await daemonWS.methods.getInfo()
  console.log(res2)

  const walletWS = new WalletWS(`test`, `test`)
  await walletWS.connect(LOCAL_NODE_WS)
  const res3 = await walletWS.methods.getVersion()
  console.log(res3)
}

main()