import bigData from './test_data'
import { parseJSON } from './parse_json'

test(`parseJsonPerf`, () => {
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