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

  static fromBytes(data: number[]) {
    let reader = new ValueReader(data)
    return reader.read()
  }

  toBytes(): number[] {
    let writer = new ValueWriter()
    writer.write(this)
    return writer.data
  }
}