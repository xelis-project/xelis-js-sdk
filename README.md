# XELIS-JS-SDK

Xelis software development kit for JS.

## Usage

Install library with NPM

`npm i xelis-js-sdk`

Import library and start working :).

Use http/rpc connection.

```js
import { DEV_NODE_RPC } from 'xelis-js-sdk/config/nodes'
import DaemonRPC from 'xelis-js-sdk/daemon/rpc'
// const DaemonRPC = require(`xelis-js-sdk/daemon/rpc`).default

const main = async () => {
  const daemonRPC = new DaemonRPC(DEV_NODE_RPC)
  const info = await daemonRPC.getInfo()
  console.log(info)
}

main()
```

Use websocket connection.

```js
import { DEV_NODE_RPC } from 'xelis-js-sdk/config/nodes'
import DaemonWS from 'xelis-js-sdk/daemon/websocket'

const main = async () => {
  const daemonWS = new DaemonWS()
  await daemonWS.connect(DEV_NODE_RPC)
  const info = await daemonWS.getInfo()
  console.log(info)
}

main()
```
