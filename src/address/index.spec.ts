import Address from './'

var MAINNET_ADDR = "xel:ys4peuzztwl67rzhsdu0yxfzwcfmgt85uu53hycpeeary7n8qvysqmxznt0"

test(`AddrFromString`, () => {
  let address = Address.fromString(MAINNET_ADDR)
  console.log(address)
  let addrString = address.format()
  if (MAINNET_ADDR !== addrString) throw ""
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

test(`AddrFromData`, () => {
  let data = [36, 42, 28, 240, 66, 91, 191, 175, 12, 87, 131, 120, 242, 25, 34, 118,
    19, 180, 44, 244, 231, 41, 27, 147, 1, 206, 122, 50, 122, 103, 3, 9, 0]
  let addr = new Address(data, `xel`)
  let addrString = addr.format()
  if (addrString !== MAINNET_ADDR) throw ""
})