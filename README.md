# XELIS-JS-SDK

Xelis software developnment kit for JS.

## Usage

Install library with NPM

`npm install xelis-js-sdk`

Import library and start working :)

```js
import { DEV_NODE_RPC } from 'xelis-js-sdk/config/nodes'
import DaemonRPC from 'xelis-js-sdk/daemon/rpc'
// const DaemonRPC = require(`xelis-js-sdk/daemon/rpc`).default

const main = async () => {
  const daemonRPC = new DaemonRPC(DEV_NODE_RPC)
  const info = await daemonRPC.getInfo()
}

main()
```
