import { Value, ValueReader, ValueWriter } from "./value"

export enum ElementType {
  Value = 0,
  Array = 1,
  Fields = 2
}

export class Element {
  value?: Value
  array?: Element[]
  fields?: Map<Value, Element>

  constructor() { }

  static v(data: any) {
    let element = new Element()
    element.value = Value.new(data)
    return element
  }

  static value(value: Value) {
    let element = new Element()
    element.value = value
    return element
  }

  static array(arr: Element[]) {
    let element = new Element()
    element.array = arr
    return element
  }

  static fields(fields: Map<Value, Element>) {
    let element = new Element()
    element.fields = fields
    return element
  }

  validate(): ElementType {
    let count = 0
    let eType: ElementType = 0

    if (this.value) {
      count++
      eType = ElementType.Value
    }

    if (this.array) {
      count++
      eType = ElementType.Array
    }

    if (this.fields) {
      count++
      eType = ElementType.Fields
    }

    if (count > 1) {
      throw "only one field (Value, Array, or Fields) must be set"
    }

    return eType
  }

  static fromBytes(data: Uint8Array) {
    let reader = new ValueReader(data)
    return reader.read()
  }

  toBytes(): Uint8Array {
    let writer = new ValueWriter()
    writer.write(this)
    return new Uint8Array(writer.data)
  }

  toObject(): {} {
    let vType = this.validate()

    switch (vType) {
      case ElementType.Value:
        return this.value!.data
      case ElementType.Array:
        let arr = [] as any[]
        this.array!.forEach((item) => {
          arr.push(item.toObject())
        })
        return arr
      case ElementType.Fields:
        let obj = {} as any
        this.fields!.forEach((item, key) => {
          obj[key.data] = item.toObject()
        })
        return obj
    }
  }
}