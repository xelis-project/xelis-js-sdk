# XELIS-JS-SDK

Xelis software development kit for JS.

## Install

Install library with NPM.

`npm i @xelis/sdk`

## Usage

Import library and start working :).

Use Daemon HTTP RPC connection.

```js
// ESM
import { TESTNET_NODE_RPC } from '@xelis/sdk/config'
import DaemonRPC from '@xelis/sdk/daemon/rpc'
// CommonJS
// const { TESTNET_NODE_RPC } = require('@xelis/sdk/config')
// const { RPC: DaemonRPC } = require('@xelis/sdk/daemon/rpc')

const main = async () => {
  const daemon = new DaemonRPC(TESTNET_NODE_RPC)
  const info = await daemon.getInfo()
  console.log(info)
}

main()
```

Use Daemon WebSocket RPC connection.

```js
// ESM
import { TESTNET_NODE_WS } from '@xelis/sdk/config'
import DaemonWS from '@xelis/sdk/daemon/websocket'
// CommonJS
// const { TESTNET_NODE_RPC } = require('@xelis/sdk/config')
// const { WS: DaemonWS } = require('@xelis/sdk/daemon/websocket')

const main = async () => {
  const daemon = new DaemonWS()
  await daemon.connect(TESTNET_NODE_WS)
  const info = await daemon.methods.getInfo()
  console.log(info)
}

main()
```

Use Wallet WebSocket RPC connection.

```js
// ESM
import { LOCAL_WALLET_WS } from '@xelis/sdk/config'
import DaemonWS from '@xelis/sdk/wallet/websocket'
// CommonJS
// const { LOCAL_WALLET_WS } = require('@xelis/sdk/config')
// const { WS: WalletWS } = require('@xelis/sdk/wallet/websocket')

const main = async () => {
  const wallet = new WalletWS(`test`, `test`) // username, password
  await wallet.connect(LOCAL_WALLET_WS)
  const address = await wallet.methods.getAddress()
  console.log(address)
}

main()
```

Use XSWD protocol.

```js
// ESM
import { LOCAL_XSWD_WS } from '@xelis/sdk/config'
import XSWD from '@xelis/sdk/xswd/websocket'
// CommonJS
// const { LOCAL_XSWD_WS } = require('@xelis/sdk/config')
// const { WS: XSWD } = require('@xelis/sdk/xswd/websocket')

const main = async () => {
  const xswd = new XSWD()
  await xswd.connect(LOCAL_XSWD_WS)
  const info = await xswd.daemon.getInfo()
  console.log(info)
  const address = await xswd.wallet.getAddress()
  console.log(address)
}

main()
```
