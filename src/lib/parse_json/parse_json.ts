import JSONbig from 'json-bigint'

// do not use JSON.parse() or we loose precision on big numbers
// for ex: the API returns the nonce as a number instead of a string and JSON.parse() is rounding the number because of overflow
// instead we will return any BigInt as a string and avoid precision loss

// NOTE: Previously was using lossless-json with isSafeNumber, but its too slow for big json data

export const parseJSON = (data: string) => {
  return JSONbig({ storeAsString: true }).parse(data)
}