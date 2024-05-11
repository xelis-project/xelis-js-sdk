import { parse, isSafeNumber } from 'lossless-json'

// do not use JSON.parse() or we loose precision on big numbers
// for ex: the API returns the nonce as a number instead of a string and JSON.parse() is rounding the number because of overflow
// instead we will return any big number as a string and avoid precision loss
export const parseData = (data: string) => {
  return parse(data, null, (value) => {
    if (isSafeNumber(value)) return parseFloat(value)
    return value
  })
}