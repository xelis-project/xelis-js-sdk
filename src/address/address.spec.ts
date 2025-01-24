import Address from './address'

var MAINNET_ADDR = "xel:ys4peuzztwl67rzhsdu0yxfzwcfmgt85uu53hycpeeary7n8qvysqmxznt0"

test(`AddrFromString`, () => {
  let address = Address.fromString(MAINNET_ADDR)
  console.log(address)
  console.log(address.format())
  if (MAINNET_ADDR !== address.format()) {

  }
})