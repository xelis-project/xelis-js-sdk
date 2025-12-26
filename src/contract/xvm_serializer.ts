export interface VMParameter {
  type: string;
  value: any;
}

// Known opaque types that need special wrapping
const OPAQUE_TYPES = new Set(['Hash', 'Address', 'PublicKey', 'Blob']);

// Type validation and conversion helpers
const TYPE_VALIDATORS = {
  'u256': (v: any) => {
    const num = typeof v === 'bigint' ? v : BigInt(v);
    if (num < 0n) throw new Error(`Value ${v} cannot be negative for u256`);
    return Number(num)
  },
  'u128': (v: any) => {
    const num = typeof v === 'bigint' ? v : BigInt(v);
    if (num < 0n) throw new Error(`Value ${v} cannot be negative for u128`);
    return Number(num)
  },
  'u64': (v: any) => {
    const num = typeof v === 'bigint' ? v : BigInt(v);
    if (num < 0n || num > 0xFFFFFFFFFFFFFFFFn) {
      throw new Error(`Value ${v} is out of range for u64`);
    }
    return Number(num)
  },
  'u32': (v: any) => {
    const num = Number(v);
    if (num < 0 || num > 0xFFFFFFFF || !Number.isInteger(num)) {
      throw new Error(`Value ${v} is not a valid u32`);
    }
    return num;
  },
  'u16': (v: any) => {
    const num = Number(v);
    if (num < 0 || num > 0xFFFF || !Number.isInteger(num)) {
      throw new Error(`Value ${v} is not a valid u16`);
    }
    return num;
  },
  'u8': (v: any) => {
    const num = Number(v);
    if (num < 0 || num > 255 || !Number.isInteger(num)) {
      throw new Error(`Value ${v} is not a valid u8`);
    }
    return num;
  },
  'boolean': (v: any) => Boolean(v),
  'string': (v: any) => String(v),
  'Hash': (v: any) => {
    const str = String(v);
    if (!/^[0-9a-fA-F]{64}$/.test(str)) {
      throw new Error(`Value ${v} is not a valid 64-character hex hash`);
    }
    return str;
  },
  'Address': (v: any) => {
    const str = String(v);
    // TODO validate
    return str;
  },
  'PublicKey': (v: any) => {
    const str = String(v);
    // TODO validate
    return str;
  },
  'Blob': (v: any) => {
    const str = String(v);
    // TODO validate
    return str;
  }
} as const;

export type ValidationType = keyof typeof TYPE_VALIDATORS;

/**
 * Creates a VM-compatible parameter object
 * @param value - The value to wrap
 * @param type - The type string (e.g., 'u64', 'Hash', 'string')
 * @param validate - Whether to validate and convert the value (default: true)
 */
export function createVMPrimitive(
  value: any, 
  type: ValidationType, 
  validate: boolean = true
): VMParameter {
  let processed_value = value;
  
  // Validate and convert value if requested
  if (validate && TYPE_VALIDATORS[type]) {
    try {
      processed_value = TYPE_VALIDATORS[type](value);
    } catch (error) {
      throw new Error(`Failed to create VM parameter for type ${type}: ${error}`);
    }
  }
  
  // Handle opaque types (Hash, Address, PublicKey)
  if (OPAQUE_TYPES.has(type)) {
    return {
      type: "primitive",
      value: {
        type: "opaque",
        value: {
          type: type,
          value: processed_value
        }
      }
    };
  }
  
  // Handle regular types
  return {
    type: "primitive",
    value: {
      type: type,
      value: processed_value
    }
  };
}

/**
 * Serialize an array of values
 */
export function serialize_array(items: any[], item_type: string): VMParameter {
  const serialized_items = items.map(item => createVMParameter(item, item_type));
  
  return {
    type: "array",
    value: serialized_items
  };
}

/**
 * Serialize a map
 */
export function serialize_map(
  map: Record<string, any>,
  keyType: string,
  valueType: string
): VMParameter {
  const entries: [VMParameter, VMParameter][] = [];
  
  for (const [key, value] of Object.entries(map)) {
    const serialized_key = createVMParameter(key, keyType);
    const serialized_value = createVMParameter(value, valueType);
    entries.push([serialized_key, serialized_value]);
  }
  
  return {
    type: "map",
    value: entries
  };
}

/**
 * Serialize an optional value
 */
export function serialize_optional(value: any, inner_type: string): VMParameter {
  if (value === null || value === undefined) {
    return {
      type: "option",
      value: null
    };
  }
  
  return {
    type: "option",
    value: createVMParameter(value, inner_type)
  };
}

/**
 * Convenience functions for common types
 */
export const VMParam = {
  hash: (value: string) => createVMPrimitive(value, 'Hash'),
  address: (value: string) => createVMPrimitive(value, 'Address'),
  public_key: (value: string) => createVMPrimitive(value, 'PublicKey'),
  blob: (value: string) => createVMPrimitive(value, 'Blob'),
  u64: (value: number | bigint) => createVMPrimitive(value, 'u64'),
  u32: (value: number) => createVMPrimitive(value, 'u32'),
  u16: (value: number) => createVMPrimitive(value, 'u16'),
  u8: (value: number) => createVMPrimitive(value, 'u8'),
  string: (value: string) => createVMPrimitive(value, 'string'),
  boolean: (value: boolean) => createVMPrimitive(value, 'boolean'),
};

// ============================================================================
// Custom Type System (Structs & Enums)
// ============================================================================

/**
 * A type that knows how to serialize itself to VMParameter
 */
export interface SerializableType {
  readonly name: string;
  to_VMParameter(value: any): VMParameter;
}

/**
 * Enum variant schema
 */
export interface EnumVariantSchema {
  name: string;
  fields: Array<{ name: string; type: string }>;
}

/**
 * Struct field schema
 */
export interface StructFieldSchema {
  name: string;
  type: string;
}

/**
 * Define an enum type from ABI schema
 */
export function defineEnum(
  name: string,
  variants: EnumVariantSchema[]
): SerializableType {
  const variantNames = variants.map(v => v.name);

  return {
    name,
    // NEW: mark kind & expose a matcher
    // (safe to add; SerializableType is duck-typed)
    // @ts-ignore - widen at runtime
    kind: 'enum',
    // @ts-ignore
    hasVariant: (vn: string) => variantNames.includes(vn),

    to_VMParameter(value: any): VMParameter {
      const variant_index = variants.findIndex(v => v.name === value.type);
      if (variant_index === -1) {
        throw new Error(`Unknown variant '${value.type}' for enum '${name}'`);
      }

      const variant = variants[variant_index];

      const expected_fields = new Set(variant.fields.map(f => f.name));
      expected_fields.add('type');

      for (const key of Object.keys(value)) {
        if (!expected_fields.has(key)) {
          throw new Error(
            `Unknown field '${key}' for variant '${value.type}' of enum '${name}'. ` +
            `Expected fields: ${Array.from(expected_fields).filter(f => f !== 'type').join(', ')}`
          );
        }
      }

      const params: VMParameter[] = [
        VMParam.u8(variant_index)
      ];

      for (const field_schema of variant.fields) {
        const field_value = value[field_schema.name];
        if (field_value === undefined) {
          throw new Error(`Missing field '${field_schema.name}' for variant '${value.type}' of enum '${name}'`);
        }
        params.push(createVMParameter(field_value, field_schema.type));
      }

      return { type: "object", value: params };
    }
  };
}

/**
 * Define a struct type from ABI schema
 */
export function defineStruct(
  name: string,
  fields: StructFieldSchema[]
): SerializableType {
  return {
    name,
    // NEW: mark kind for structs
    // @ts-ignore
    kind: 'struct',

    to_VMParameter(value: any): VMParameter {
      const expected_fields = new Set(fields.map(f => f.name));

      for (const key of Object.keys(value)) {
        if (!expected_fields.has(key)) {
          throw new Error(
            `Unknown field '${key}' for struct '${name}'. ` +
            `Expected fields: ${Array.from(expected_fields).join(', ')}`
          );
        }
      }

      const params: VMParameter[] = [];

      for (const field_schema of fields) {
        const field_value = value[field_schema.name];
        if (field_value === undefined) {
          throw new Error(`Missing field '${field_schema.name}' for struct '${name}'`);
        }
        params.push(createVMParameter(field_value, field_schema.type));
      }

      return { type: "object", value: params };
    }
  };
}

/**
 * Type registry - simple Map for custom types
 */
class TypeRegistry {
  private types = new Map<string, SerializableType>();

  register(definition: SerializableType): SerializableType {
    this.types.set(definition.name, definition);
    return definition;
  }

  get(name: string): SerializableType | undefined {
    return this.types.get(name);
  }

  has(name: string): boolean {
    return this.types.has(name);
  }

  clear(): void {
    this.types.clear();
  }

  all(): Iterable<SerializableType> {
    return this.types.values();
  }
}

export const typeRegistry = new TypeRegistry();

/**
 * Enhanced parameter creation that handles both primitive and custom types
 * @param value - The value to serialize
 * @param type - The type string (primitive or custom type name)
 * @param validate - Whether to validate primitive values (default: true)
 */
export function createVMParameter(
  value: any,
  type: string,
  validate: boolean = true
): VMParameter {
  // Pass-through already-serialized parameters
  if (value && typeof value === 'object' && 'type' in value && 'value' in value) {
    return value as VMParameter;
  }

  // Arrays
  if (type.endsWith('[]')) {
    const inner_type = type.slice(0, -2);
    if (!Array.isArray(value)) {
      throw new Error(`Expected array for type ${type}, got ${typeof value}`);
    }
    return serialize_array(value, inner_type);
  }

  // Optionals
  if (type.startsWith('optional<') && type.endsWith('>')) {
    const inner_type = type.slice(9, -1);
    return serialize_optional(value, inner_type);
  }

  // Maps
  const map_match = type.match(/^map<(.+),\s*(.+)>$/);
  if (map_match) {
    const [, keyType, valueType] = map_match;
    if (typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`Expected object for type ${type}, got ${typeof value}`);
    }
    return serialize_map(value, keyType.trim(), valueType.trim());
  }

  // Generic enum/struct notations: enum<Foo>, struct<Bar>
  const enumGeneric = type.match(/^enum<\s*([^>]+)\s*>$/i);
  if (enumGeneric) {
    const realType = enumGeneric[1].trim();
    const custom = typeRegistry.get(realType);
    if (!custom) throw new Error(`Unregistered enum type: ${realType}`);
    return custom.to_VMParameter(value);
  }

  const structGeneric = type.match(/^struct<\s*([^>]+)\s*>$/i);
  if (structGeneric) {
    const realType = structGeneric[1].trim();
    const custom = typeRegistry.get(realType);
    if (!custom) throw new Error(`Unregistered struct type: ${realType}`);
    return custom.to_VMParameter(value);
  }

  // Preferred: named custom type
  const custom_type = typeRegistry.get(type);
  if (custom_type) {
    return custom_type.to_VMParameter(value);
  }

  // **Fix for ABI that says literally "enum"/"struct"**
  if (type === 'enum' && value && typeof value === 'object' && 'type' in value) {
    const variantName = (value as any).type;
    for (const t of typeRegistry.all()) {
      const anyT = t as any;
      if (anyT?.kind === 'enum' && typeof anyT.hasVariant === 'function' && anyT.hasVariant(variantName)) {
        return t.to_VMParameter(value);
      }
    }
    throw new Error(`Cannot resolve enum type for variant '${variantName}'. Is it registered?`);
  }

  if (type === 'struct') {
    // Best-effort: if your ABI truly says "struct" w/o a name, you’ll need a hint.
    // You can add your own resolution heuristic here if you have one.
    throw new Error(`Unknown struct subtype; ABI must specify struct<Foo> or a named type`);
  }

  // Primitive fallback
  if (type in TYPE_VALIDATORS) {
    return createVMPrimitive(value, type as ValidationType, validate);
  }

  console.error("[VMParam] unknown type", type, { value });
  throw new Error(`Unknown type: ${type}`);
}

// ============================================================================
// Contract Invocation Helpers
// ============================================================================

/**
 * Creates a deposits object for contract calls
 * @param deposits - Object mapping token hashes to amounts
 */
export function createDeposits(deposits: Record<string, number | bigint>): Record<string, { amount: number | bigint }> {
  const result: Record<string, { amount: number | bigint }> = {};
  
  for (const [token_hash, amount] of Object.entries(deposits)) {
    // Validate hash format
    if (!/^[0-9a-fA-F]{64}$/.test(token_hash)) {
      throw new Error(`Invalid token hash format: ${token_hash}`);
    }
    
    result[token_hash] = { amount };
  }
  
  return result;
}

/**
 * Creates a contract invocation object
 */
export interface ContractInvocationParams {
  contract: string;
  chunk_id: number;
  parameters?: VMParameter[];
  permission: string,
  deposits?: Record<string, number | bigint>;
  maxGas?: number;
}

export function createContractInvocation(params: ContractInvocationParams): Record<string, any> {
  const {
    contract,
    chunk_id,
    parameters = [],
    deposits,
    permission,
    maxGas = 50000000
  } = params;
  
  const result: any = {
    invoke_contract: {
      contract,
      max_gas: maxGas,
      entry_id: chunk_id,
      permission,
      parameters
    }
  };
  
  if (deposits && Object.keys(deposits).length > 0) {
    result.invoke_contract.deposits = createDeposits(deposits);
  }
  
  return result;
}

/**
 * Creates a contract deployment object
 */
export interface ContractDeploymentParams {
  bytecode: string;
  hasConstructor?: boolean;
  maxGas?: number;
}

export function createContractDeployment(params: ContractDeploymentParams): Record<string, any> {
  const { bytecode, hasConstructor = false, maxGas = 50000000 } = params;
  
  const result: any = {
    deploy_contract: {
      module: bytecode,
      ...(hasConstructor && { invoke: { max_gas: maxGas } })
    }
  };
  
  return result;
}