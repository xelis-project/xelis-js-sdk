export const DAEMON_RPC_PORT = `8080`
export const WALLET_RPC_PORT = `8081`
export const XSWD_PORT = `44325`

export const MAINNET_NODE_URL = `node.xelis.io`
export const TESTNET_NODE_URL = `testnet-node.xelis.io`
export const LOCAL_NODE_URL = `127.0.0.1:${DAEMON_RPC_PORT}`

export const MAINNET_NODE_RPC = `https://${MAINNET_NODE_URL}/json_rpc`
export const TESTNET_NODE_RPC = `https://${TESTNET_NODE_URL}/json_rpc`
export const LOCAL_NODE_RPC = `http://${LOCAL_NODE_URL}/json_rpc`

export const MAINNET_NODE_WS = `wss://${MAINNET_NODE_URL}/json_rpc`
export const TESTNET_NODE_WS = `wss://${TESTNET_NODE_URL}/json_rpc`
export const LOCAL_NODE_WS = `ws://${LOCAL_NODE_URL}/json_rpc`

export const LOCAL_WALLET_URL = `127.0.0.1:${WALLET_RPC_PORT}`
export const LOCAL_WALLET_RPC = `http://${LOCAL_WALLET_URL}/json_rpc`
export const LOCAL_WALLET_WS = `ws://${LOCAL_WALLET_URL}/json_rpc`

export default {
  MAINNET_NODE_URL, TESTNET_NODE_URL,
  MAINNET_NODE_RPC, TESTNET_NODE_RPC, LOCAL_NODE_RPC,
  MAINNET_NODE_WS, TESTNET_NODE_WS, LOCAL_NODE_WS,
  DAEMON_RPC_PORT, WALLET_RPC_PORT, XSWD_PORT,
  LOCAL_WALLET_URL, LOCAL_WALLET_RPC, LOCAL_WALLET_WS
}