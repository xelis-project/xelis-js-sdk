import fs from 'fs'
import { parseJSON } from './parse_json'

test(`parseJsonPerf`, () => {
  // load data using fs instead of import or fix-esm will hang
  const bigData = fs.readFileSync(`./src/rpc/parse_json/test_data.txt`, `utf-8`)
  console.time()
  let data = parseJSON(bigData)
  console.timeEnd()
  console.time()
  data = JSON.parse(bigData)
  console.timeEnd()
})

test(`bigNumber`, () => {
  const test = `{ "nonce": 234905872304968723405968730498576039485, "nbr": 23452, "nonce_string": "234905872304968723405968730498576039485" }`
  let data = parseJSON(test) as any
  console.log(data, data["nonce"], data["nbr"])
  data = JSON.parse(test)
  console.log(data, data["nonce"], data["nbr"])
})