import { Element } from './element'
import { Value, ValueType } from './value'
import losslessJSON from 'lossless-json'

test(`TestElementValue`, () => {
  let value = new Value(ValueType.String, "Hello world")
  let element = Element.value(value!)

  let data = element.toBytes()
  let newElement = Element.fromBytes(data)
  let obj = element.toObject()
  let jsonObj = JSON.stringify(obj)
})

test(`TestValueNew`, () => {
  let str = Value.new("hello")
  if (str.vType !== ValueType.String) throw ""

  let u8 = Value.new(10)
  if (u8.vType !== ValueType.U8) throw ""

  let u16 = Value.new(34523)
  if (u16.vType !== ValueType.U16) throw ""

  let u32 = Value.new(3452305469)
  if (u32.vType !== ValueType.U32) throw ""

  let u64 = Value.new(BigInt("3452305469567567456"))
  if (u64.vType !== ValueType.U64) throw ""

  let u128 = Value.new(BigInt("2093458230498572039452039485702938475"))
  if (u128.vType !== ValueType.U128) throw ""

  let blob = Value.new([1, 2, 3, 4, 5])
  if (blob.vType !== ValueType.Blob) throw ""

  let hash = Value.new(new Uint8Array([185, 77, 39, 185, 147, 77, 62, 8, 165, 46, 82, 215, 218, 125, 171, 250, 196, 132, 239, 227, 122, 83, 128, 238, 144, 136, 247, 172, 226, 239, 205, 233]))
  if (hash.vType !== ValueType.Hash) throw ""

  let bool = Value.new(true)
  if (bool.vType !== ValueType.Bool) throw ""
})

test(`TestElementArray`, async () => {
  let encoder = new TextEncoder()
  let data = encoder.encode("hello world")
  let hashBuf = await crypto.subtle.digest("SHA-256", data)
  let hash = new Uint8Array(hashBuf)

  let element = Element.array([
    Element.value(new Value(ValueType.String, "Hello world")),
    Element.value(new Value(ValueType.U8, 34)),
    Element.value(new Value(ValueType.U16, 34523)),
    Element.value(new Value(ValueType.U32, 3452305469)),
    Element.value(new Value(ValueType.U64, BigInt("3452305469567567456"))),
    Element.value(new Value(ValueType.U128, BigInt("2093458230498572039452039485702938475"))),
    Element.value(new Value(ValueType.Hash, hash)),
    Element.value(new Value(ValueType.Blob, [0, 1, 2, 3, 4, 5]))
  ])

  let bytes = element.toBytes()
  let newElement = Element.fromBytes(bytes)
  let obj = element.toObject()
  let jsonObj = losslessJSON.stringify(obj)
  // let jsonObj = JSON.stringify(obj)
})

test(`TestElementFields`, () => {
  let fields = new Map<Value, Element>()
  fields.set(Value.new("hello"), Element.v("world"))
  let element = Element.fields(fields)
  let obj = element.toObject()
  let jsonObj = JSON.stringify(obj)
})