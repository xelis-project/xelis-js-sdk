import { decode, convertBits, encode } from "./bech32"

var PrefixAddress = "xel"
var TestnetPrefixAddress = "xet"
var ExtraDataLimit = 1024
var ErrIntegratedDataLimit = "invalid data in integrated address, maximum size reached"
var ErrInvalidNetworkPrefix = "invalid network prefix (xel or xet)"

class Address {
  publicKey: number[]
  isMainnet: boolean
  isIntegrated: boolean
  extraData: any

  constructor(data: number[], hrp: string) {
    this.isMainnet = hrp === PrefixAddress
    this.publicKey = data

    switch (data[32]) {
      case 0:
        this.isIntegrated = false
        break
      case 1:
        this.isIntegrated = true
        break
      default:
        throw "invalid address type"
    }
  }

  static fromString(addr: string): Address {
    let { hrp, decoded } = decode(addr)
    if (hrp !== PrefixAddress && hrp !== TestnetPrefixAddress) {
      throw ErrInvalidNetworkPrefix
    }

    let bits = convertBits(decoded, 5, 8, false)
    return new Address(bits, hrp)
  }

  static isValid(addr: string): boolean {
    try {
      Address.fromString(addr)
      return true
    } catch {
      return false
    }
  }

  format(): string {
    let bits = convertBits(this.publicKey, 8, 5, true)
    let hrp = PrefixAddress
    if (!this.isMainnet) {
      hrp = TestnetPrefixAddress
    }

    return encode(hrp, bits)
  }
}

export default Address
