export const NODE_URL = `node.xelis.io`
export const TESTNET_NODE_URL = `testnet-node.xelis.io`

export const NODE_RPC = `https://${NODE_URL}/json_rpc`
export const TESTNET_NODE_RPC = `https://${TESTNET_NODE_URL}/json_rpc`

export const NODE_WS = `wss://${NODE_URL}/json_rpc`
export const TESTNET_NODE_WS = `wss://${TESTNET_NODE_URL}/json_rpc`

export const DAEMON_RPC_PORT = `8080`
export const WALLET_RPC_PORT = `8081`
export const XSWD_PORT = `44325`

export default {
  NODE_URL, TESTNET_NODE_URL,
  NODE_RPC, TESTNET_NODE_RPC,
  NODE_WS, TESTNET_NODE_WS,
  DAEMON_RPC_PORT, WALLET_RPC_PORT, XSWD_PORT
}