const fs = require('fs')

// We need to create a package.json for explicitly setting the ESM folder has modern EcmaScript modules.

const main = () => {
  const data = JSON.stringify({
    "type": "module"
  })

  fs.writeFileSync('./dist/esm/package.json', data)
}

main()