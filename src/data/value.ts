import { Element, ElementType } from "./element"

var MaxStringSize = 255
var ErrMaxStringSize = "string max limit is 255 bytes"
var MaxBlobSize = 65535
var ErrMaxBlobSize = "blob max size is 65535 bytes"


function ErrUnsupportedValue(value: Value) {
  return `unsupported value type ${value}`
}

function getUIntTypeByValue(value: number | bigint) {
  if (value < 0) throw "invalid uint number"
  if (value <= 0xFF) return ValueType.U8;
  if (value <= 0xFFFF) return ValueType.U16;
  if (value <= 0xFFFFFFFF) return ValueType.U32;
  if (value <= BigInt("0xFFFFFFFFFFFFFFFF")) return ValueType.U64;
  if (value <= BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")) return ValueType.U128;
  throw "unsupported uint"
}

export enum ValueType {
  Bool = 0,
  String = 1,
  U8 = 2,
  U16 = 3,
  U32 = 4,
  U64 = 5,
  U128 = 6,
  Hash = 7,
  Blob = 8
}

export class Value {
  vType: ValueType
  data: any

  constructor(vType: ValueType, data: any) {
    this.vType = vType
    this.data = data
  }

  static new(data: any): Value {
    if (typeof data === `string`) {
      return new Value(ValueType.String, data)
    } else if (typeof data === `boolean`) {
      return new Value(ValueType.Bool, data)
    } else if (Array.isArray(data)) {
      return new Value(ValueType.Blob, data)
    } else if (data instanceof Uint8Array && data.byteLength === 32) {
      return new Value(ValueType.Hash, data)
    } else if (typeof data === "number" || typeof data === "bigint") {
      let eType = getUIntTypeByValue(data)
      switch (eType) {
        case ValueType.U8:
          return new Value(ValueType.U8, data)
        case ValueType.U16:
          return new Value(ValueType.U16, data)
        case ValueType.U32:
          return new Value(ValueType.U32, data)
        case ValueType.U64:
          return new Value(ValueType.U64, data)
        case ValueType.U128:
          return new Value(ValueType.U128, data)
        default:
          throw "unsupported data type"
      }
    }

    throw "unsupported data type"
  }
}

export class ValueReader {
  data: number[]
  constructor(data: Uint8Array) {
    this.data = Array.from(data)
  }

  read(): Element {
    let eType = this.readByte()
    switch (eType) {
      case ElementType.Value:
        return Element.value(this.readValue())
      case ElementType.Array:
        let arrSize = this.readByte()
        let elements = [] as Element[]
        for (let i = 0; i < arrSize; i++) {
          elements.push(this.read())
        }
        return Element.array(elements)
      case ElementType.Fields:
        let fieldsSize = this.readByte()
        let map = new Map<Value, Element>()
        for (let i = 0; i < fieldsSize; i++) {
          map.set(this.readValue(), this.read())
        }
        return Element.fields(map)
      default:
        throw "invalid element type"
    }
  }

  readByte(): number {
    return this.data.splice(0, 1)[0]
  }

  readU16(): number {
    let arr = new Uint8Array(this.data.splice(0, 2))
    let view = new DataView(arr.buffer)
    return view.getUint16(0, false)
  }

  readU32(): number {
    let arr = new Uint8Array(this.data.splice(0, 4))
    let view = new DataView(arr.buffer)
    return view.getUint32(0, false)
  }

  readU64(): bigint {
    let arr = new Uint8Array(this.data.splice(0, 8))
    let view = new DataView(arr.buffer)
    return view.getBigUint64(0, false)
  }

  readU128(): bigint {
    let data = this.data.splice(0, 16)
    let value = BigInt(0)
    for (let i = 0; i < 16; i++) {
      value = (value << BigInt(8)) | BigInt(data[i])
    }

    return value
  }

  readString(): string {
    let size = this.readByte()
    let decoder = new TextDecoder()
    let data = new Uint8Array(this.data.splice(0, size))
    return decoder.decode(data)
  }

  readBool(): boolean {
    return this.readByte() === 1 ? true : false
  }

  readHash(): number[] {
    return this.data.splice(0, 32)
  }

  readBlob(): number[] {
    let size = this.readByte()
    return this.data.splice(0, size)
  }

  readValue(): Value {
    let vType = this.readByte()
    switch (vType) {
      case ValueType.U8:
        return new Value(vType, this.readByte())
      case ValueType.U16:
        return new Value(vType, this.readU16())
      case ValueType.U32:
        return new Value(vType, this.readU32())
      case ValueType.U64:
        return new Value(vType, this.readU64())
      case ValueType.U128:
        return new Value(vType, this.readU128())
      case ValueType.String:
        return new Value(vType, this.readString())
      case ValueType.Bool:
        return new Value(vType, this.readBool())
      case ValueType.Blob:
        return new Value(vType, this.readBlob())
      case ValueType.Hash:
        return new Value(vType, this.readHash())
      default:
        throw ""
    }
  }
}

export class ValueWriter {
  data: number[]

  constructor() {
    this.data = []
  }

  write(dataElement: Element) {
    let eType = dataElement.validate()

    switch (eType) {
      case ElementType.Value:
        this.writeU8(ElementType.Value)
        this.writeValue(dataElement.value!)
        break
      case ElementType.Array:
        this.writeU8(ElementType.Array)
        let array = dataElement.array!
        this.writeU8(array.length)
        array.forEach((element) => {
          this.write(element)
        })
        break
      case ElementType.Fields:
        this.writeU8(ElementType.Fields)
        let fields = dataElement.fields!
        this.writeU8(fields.size)
        fields.forEach((element, key) => {
          this.writeValue(key)
          this.write(element)
        })
        break
    }
  }

  appendData(data: Uint8Array) {
    this.data.push(...Array.from(data))
  }

  appendBuffer(buf: ArrayBuffer) {
    this.appendData(new Uint8Array(buf))
  }

  writeU8(value: number) {
    if (typeof value !== "number") {
      throw "value is not a number"
    }

    this.appendBuffer(new Uint8Array([value]))
  }

  writeU16(value: number) {
    if (typeof value !== "number") {
      throw "value is not a number"
    }

    let buf = new ArrayBuffer(2)
    let view = new DataView(buf)
    view.setUint16(0, value, false)
    this.appendBuffer(buf)
  }

  writeU32(value: number) {
    if (typeof value !== "number") {
      throw "value is not a number"
    }

    let buf = new ArrayBuffer(4)
    let view = new DataView(buf)
    view.setUint32(0, value, false)
    this.appendBuffer(buf)
  }

  writeU64(value: bigint) {
    if (typeof value !== "bigint") {
      throw "value is not a bigint"
    }

    let buf = new ArrayBuffer(8)
    let view = new DataView(buf)
    view.setBigUint64(0, value, false)
    this.appendBuffer(buf)
  }

  writeU128(value: BigInt) {
    if (typeof value !== "bigint") {
      throw "value is not a bigint"
    }

    let bytes = []
    for (let i = 0; i < 16; i++) {
      let byte = Number((value >> BigInt(8 * (15 - i))) & BigInt(0xFF))
      bytes.push(byte)
    }

    this.appendData(new Uint8Array(bytes))
  }

  writeString(value: string) {
    if (typeof value !== "string") {
      throw "value is not string"
    }

    let encoder = new TextEncoder()
    let data = encoder.encode(value)
    if (data.length > MaxStringSize) {
      throw ErrMaxStringSize
    }

    this.writeU8(data.length)
    this.appendData(data)
  }

  writeBool(value: boolean) {
    if (typeof value !== "boolean") {
      throw "value is not a boolean"
    }

    this.writeU8(value ? 1 : 0)
  }

  writeBlob(value: []) {
    this.writeU8(value.length)
    this.appendData(new Uint8Array(value))
  }

  writeHash(value: Uint8Array) {
    this.appendData(value)
  }

  writeValue(value: Value) {
    switch (value.vType) {
      case ValueType.Bool:
        this.writeU8(ValueType.Bool)
        this.writeBool(value.data)
        break
      case ValueType.String:
        this.writeU8(ValueType.String)
        this.writeString(value.data)
        break
      case ValueType.U8:
        this.writeU8(ValueType.U8)
        this.writeU8(value.data)
        break
      case ValueType.U16:
        this.writeU8(ValueType.U16)
        this.writeU16(value.data)
        break
      case ValueType.U32:
        this.writeU8(ValueType.U32)
        this.writeU32(value.data)
        break
      case ValueType.U64:
        this.writeU8(ValueType.U64)
        this.writeU64(value.data)
        break
      case ValueType.U128:
        this.writeU8(ValueType.U128)
        this.writeU128(value.data)
        break
      case ValueType.Blob:
        this.writeU8(ValueType.Blob)
        this.writeBlob(value.data)
        break
      case ValueType.Hash:
        this.writeU8(ValueType.Hash)
        this.writeHash(value.data)
        break
      default:
        throw ErrUnsupportedValue(value)
    }
  }
}