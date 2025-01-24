const CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l"
const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3]
const SEPARTOR = ":"

var ErrHrpMixCase = "mix case is not allowed in human readable part"
var ErrInvalidChecksum = "invalid checksum"
var ErrNonZeroPadding = "non zero padding"
var ErrIllegalZeroPadding = "illegal zero padding"
var ErrHrpEmpty = "human readable part is empty"

function ErrSeparatorInvalidPosition(pos: number): string {
  return `invalid separator position: ${pos}`
}

function ErrHrpInvalidCharacter(c: number): string {
  return `invalid character value in human readable part: ${c}`
}

function ErrInvalidIndex(index: number): string {
  return `invalid index ${index}`
}

function ErrInvalidValue(value: number, max: number): string {
  return `invalid value: ${value}, max is ${max}`
}

function ErrInvalidDataRange(value: number, from: number): string {
  return `invalid data range: ${value}, max is ${from}`
}

function polymod(values: number[]): number {
  let chk = 1
  values.forEach((value) => {
    let top = chk >> 25
    chk = ((chk & 0x1ffffff) << 5) ^ value
    GENERATOR.forEach((item, i) => {
      if (((top >> i) & 1) === 1) {
        chk ^= item
      }
    })
  })

  return chk
}

function hrpExpand(hrp: string): number[] {
  let encoder = new TextEncoder()
  let bytes = encoder.encode(hrp)
  let result = [] as number[]
  bytes.forEach((c) => result.push(c >> 5))
  result.push(0)
  bytes.forEach((c) => result.push(c & 31))
  return result
}

function verifyChecksum(hrp: string, data: number[]): boolean {
  let vec = hrpExpand(hrp)
  vec = [...vec, ...data]
  return polymod(vec) === 1
}

function createChecksum(hrp: string, data: number[]): number[] {
  let result = [0, 0, 0, 0, 0, 0] as number[]
  let values = [...hrpExpand(hrp), ...data, ...result]
  let pm = polymod(values) ^ 1
  for (let i = 0; i < 6; i++) {
    result[i] = pm >> (5 * (5 - i)) & 31
  }
  return result
}

export function convertBits(data: number[], from: number, to: number, pad: boolean): number[] {
  let result = [] as number[]
  let acc = 0
  let bits = 0
  let maxValue = (1 << to) - 1
  data.forEach((value) => {
    if (value >> from !== 0) {
      throw ErrInvalidDataRange(value, from)
    }

    acc = (acc << from) | value
    bits += from
    while (bits >= to) {
      bits -= to
      result.push((acc >> bits) & maxValue)
    }
  })

  if (pad) {
    if (bits > 0) {
      result.push((acc << (to - bits)) & maxValue)
    }
  } else if (bits >= from) {
    throw ErrIllegalZeroPadding
  } else if (((acc << (to - bits)) & maxValue) !== 0) {
    throw ErrNonZeroPadding
  }

  return result
}

export function decode(bech: string): { hrp: string, decoded: number[] } {
  if (bech.toUpperCase() !== bech && bech.toLowerCase() !== bech) {
    throw ErrHrpMixCase
  }

  let pos = bech.indexOf(SEPARTOR)
  if (pos < 1 || pos + 7 > bech.length) {
    throw ErrSeparatorInvalidPosition(pos)
  }

  let hrp = bech.substring(0, pos)
  let encoder = new TextEncoder()
  let hrpBytes = encoder.encode(hrp)
  let decoded = [] as number[]
  hrpBytes.forEach((value) => {
    if (value < 33 || value > 126) {
      throw ErrHrpInvalidCharacter(value)
    }
  })

  for (let i = pos + 1; i < bech.length; i++) {
    if (i >= bech.length) {
      throw ErrInvalidIndex(i)
    }

    let c = bech[i]
    let index = CHARSET.indexOf(c)
    if (index === -1) {
      throw ErrHrpInvalidCharacter
    }

    decoded.push(index)
  }

  if (!verifyChecksum(hrp, decoded)) {
    throw ErrInvalidChecksum
  }

  decoded.splice(decoded.length - 6, 6)

  return { hrp, decoded }
}

export function encode(hrp: string, data: number[]): string {
  if (hrp.length === 0) {
    throw ErrHrpEmpty
  }

  let encoder = new TextEncoder()
  let hrpBytes = encoder.encode(hrp)
  hrpBytes.forEach((value) => {
    if (value < 33 || value > 126) {
      throw ErrHrpInvalidCharacter(value)
    }
  })

  if (hrp.toUpperCase() !== hrp && hrp.toLowerCase() !== hrp) {
    throw ErrHrpMixCase
  }

  hrp = hrp.toLowerCase()
  let combined = [...data, ...createChecksum(hrp, data)]
  let result = [...Array.from(hrpBytes), SEPARTOR.charCodeAt(0)]

  combined.forEach((index) => {
    if (index > CHARSET.length) {
      throw ErrInvalidValue(index, CHARSET.length)
    }

    let value = CHARSET.charCodeAt(index)
    if (!value) {
      throw ErrInvalidIndex(index)
    }

    result.push(value)
  })

  let decoder = new TextDecoder()
  return decoder.decode(new Uint8Array(result))
}