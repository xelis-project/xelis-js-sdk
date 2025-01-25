import Address from './address'

var MAINNET_ADDR = "xel:ys4peuzztwl67rzhsdu0yxfzwcfmgt85uu53hycpeeary7n8qvysqmxznt0"

test(`AddrFromString`, () => {
  let address = Address.fromString(MAINNET_ADDR)
  console.log(address)
  console.log(address.format())
  if (MAINNET_ADDR !== address.format()) {

  }
})

test(`InvalidAddr`, () => {
  let isValid = Address.isValid(`xel:ys4peuzztwl67rzhsdu0yxfzwcfmgt85uu53hycpeeary7n8qvysqmxznt1`)
  if (isValid) throw ""

  let isValid2 = Address.isValid(MAINNET_ADDR)
  if (!isValid2) throw ""
})

test(`IntegratedAddr`, () => {
  let addr = Address.fromString(`xet:6eadzwf5xdacts6fs4y3csmnsmy4mcxewqt3xyygwfx0hm0tm32szqsrqyzkjar9d4esyqgpq4ehwmmjvsqqypgpq45x2mrvduqqzpthdaexceqpq4mk7unywvqsgqqpq4yx2mrvduqqzp2hdaexceqqqyzxvun0d5qqzp2cg4xyj5ct5udlg`)
  console.log(addr)
})