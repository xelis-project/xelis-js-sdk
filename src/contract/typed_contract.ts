import { 
  VMParameter, 
  createContractInvocation,
  ContractInvocationParams,
  typeRegistry,
  defineEnum,
  defineStruct,
  createVMParameter
} from './xvm_serializer';

// Enhanced type definitions for better TypeScript support
export interface ABIParam {
  name: string;
  type: string;
  optional?: boolean;
  default?: any;
}

export interface ABIEntry {
  entry_id: number;
  name: string;
  outputs?: string | string[];
  params: ABIParam[];
  type: 'entry';
  description?: string;
}

export interface InternalType {
  name: string;
  kind: 'struct' | 'enum';
  fields?: Array<{ name: string; type: string }>;
  variants?: Array<{
    name: string;
    fields: Array<{ name: string; type: string }>;
  }>;
}

export type ABI = {
  data: ABIEntry[];
  version: string;
  internal_types?: InternalType[];
};

// Type mapping for parameters
type ParamType<T extends string> = 
  T extends 'Hash' ? string :
  T extends 'Address' ? string :
  T extends 'PublicKey' ? string :
  T extends 'Blob' ? string :
  T extends 'String' | 'string' ? string :
  T extends 'Boolean' | 'boolean' | 'bool' ? boolean :
  T extends 'U256' | 'u256' ? bigint | number :
  T extends 'U128' | 'u128' ? bigint | number :
  T extends 'U64' | 'u64' ? bigint | number :
  T extends 'U32' | 'u32' ? number :
  T extends 'U16' | 'u16' ? number :
  T extends 'U8' | 'u8' ? number :
  
  // Arrays - Person[] becomes any[], u64[] becomes (bigint|number)[]
  T extends `${infer Inner}[]` ? Array<ParamType<Inner>> :
  
  // Optionals - optional<Person> becomes any | null
  T extends `optional<${infer Inner}>` ? ParamType<Inner> | null | undefined :
  
  // Maps - map<Address, Permission> becomes Record<string, any>
  T extends `map<${infer K}, ${infer V}>` ? 
    ParamType<K> extends string | number | symbol 
      ? Record<ParamType<K>, ParamType<V>>
      : Record<string, ParamType<V>> :
    
  // TODO Ranges - range<u64> becomes object (structure unknown)
  // T extends `range<${infer Inner}>` ? { start: ParamType<Inner>; end: ParamType<Inner> } :
  
  // Tuples - (string, u64) would need parser, fallback to any for now
  T extends `(${string})` ? any[] :
  
  any;

type ExtractParams<T extends ABIEntry> = {
  [K in T['params'][number] as K['name']]: K extends { optional: true } 
    ? ParamType<K['type']> | undefined
    : ParamType<K['type']>
} & {
  maxGas?: number;
  deposits?: Record<string, number | bigint>;
};

type MethodFromEntry<T extends ABIEntry> = (
  params: ExtractParams<T>
) => Record<string, any>;

type MethodsFromABI<T extends ABI> = {
  [K in T['data'][number] as K['name']]: MethodFromEntry<K>
};

/**
 * Strongly typed contract class
 */
export class TypedContract<T extends ABI> {
  public readonly address: string;
  public readonly abi: T;
  private readonly methods: Map<string, ABIEntry>;

  constructor(address: string, abi: T) {
    this.address = address;
    this.abi = abi;
    this.methods = new Map();

    this.register_internal_types();

    for (const entry of abi.data) {
      if (entry.type === 'entry') {
        this.methods.set(entry.name, entry);
      }
    }

    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }

        if (typeof prop === 'string' && target.methods.has(prop)) {
          return (params: any) => target.invokeUnsafe(prop, params);
        }

        return undefined;
      }
    }) as any;
  }

  /**
   * Register all custom types from ABI
   */
  private register_internal_types(): void {
    if (!this.abi.internal_types) return;

    for (const type_def of this.abi.internal_types) {
      if (type_def.kind === 'enum' && type_def.variants) {
        typeRegistry.register(
          defineEnum(type_def.name, type_def.variants)
        );
      } else if (type_def.kind === 'struct' && type_def.fields) {
        typeRegistry.register(
          defineStruct(type_def.name, type_def.fields)
        );
      }
    }
  }

  /**
   * Helper to create struct values with positional arguments
   * Validates field types immediately
   * @param type_name - Name of the struct type
   * @param field_values - Field values in the order defined in ABI
   */
  public struct(type_name: string, ...field_values: any[]): any {
    const type_def = this.abi.internal_types?.find(
      t => t.name === type_name && t.kind === 'struct'
    );
    
    if (!type_def || !type_def.fields) {
      throw new Error(`Struct type '${type_name}' not found in contract ABI`);
    }

    if (field_values.length !== type_def.fields.length) {
      throw new Error(
        `Struct '${type_name}' expects ${type_def.fields.length} fields ` +
        `(${type_def.fields.map(f => f.name).join(', ')}), ` +
        `but got ${field_values.length}`
      );
    }

    const result: any = {};
    for (let i = 0; i < type_def.fields.length; i++) {
      const field = type_def.fields[i];
      const value = field_values[i];
      
      try {
        createVMParameter(value, field.type);
      } catch (error) {
        throw new Error(
          `Invalid value for field '${field.name}' (position ${i}) of struct '${type_name}': ${error}`
        );
      }
      
      result[field.name] = value;
    }

    return result;
  }

  /**
   * Helper to create enum values with positional arguments
   * Validates field types immediately
   * @param type_name - Name of the enum type
   * @param variant_name - Name of the variant
   * @param field_values - Field values in the order defined in ABI
   */
  public enum(type_name: string, variant_name: string, ...field_values: any[]): any {
    const type_def = this.abi.internal_types?.find(
      t => t.name === type_name && t.kind === 'enum'
    );
    
    if (!type_def || !type_def.variants) {
      throw new Error(`Enum type '${type_name}' not found in contract ABI`);
    }

    const variant = type_def.variants.find(v => v.name === variant_name);
    if (!variant) {
      const available = type_def.variants.map(v => v.name).join(', ');
      throw new Error(
        `Unknown variant '${variant_name}' for enum '${type_name}'. ` +
        `Available variants: ${available}`
      );
    }

    if (field_values.length !== variant.fields.length) {
      throw new Error(
        `Variant '${variant_name}' of enum '${type_name}' expects ${variant.fields.length} fields ` +
        `(${variant.fields.map(f => f.name).join(', ')}), ` +
        `but got ${field_values.length}`
      );
    }

    const result: any = { type: variant_name };
    for (let i = 0; i < variant.fields.length; i++) {
      const field = variant.fields[i];
      const value = field_values[i];
      
      try {
        createVMParameter(value, field.type);
      } catch (error) {
        throw new Error(
          `Invalid value for field '${field.name}' (position ${i}) of variant '${variant_name}' in enum '${type_name}': ${error}`
        );
      }
      
      result[field.name] = value;
    }

    return result;
  }

  /**
   * Internal method to invoke contract functions
   */
  public invokeUnsafe(method_name: string, params: any = {}): Record<string, any> {
    const entry = this.methods.get(method_name);
    
    if (!entry) {
      throw new Error(`Method '${method_name}' not found in contract ABI`);
    }

    const { maxGas, deposits, permission, ...method_params } = params;

    const parameters: VMParameter[] = [];
    
    for (const abi_param of entry.params) {
      const value = method_params[abi_param.name];
      
      if (value === undefined && !abi_param.optional) {
        if (abi_param.default !== undefined) {
          method_params[abi_param.name] = abi_param.default;
        } else {
          throw new Error(`Missing required parameter '${abi_param.name}' for method '${method_name}'`);
        }
      }

      if (value !== undefined) {
        try {
          const VMParam = createVMParameter(value, abi_param.type);
          parameters.push(VMParam);
        } catch (error) {
          throw new Error(`Invalid parameter '${abi_param.name}' for method '${method_name}': ${error}`);
        }
      }
    }

    const invocation_params: ContractInvocationParams = {
      contract: this.address,
      entry_id: entry.entry_id,
      parameters,
      permission,
      maxGas: maxGas || 50000000
    };

    if (deposits && Object.keys(deposits).length > 0) {
      invocation_params.deposits = deposits;
    }

    return createContractInvocation(invocation_params);
  }

  /**
   * Type-safe invoke method
   */
  public invoke<K extends T['data'][number]['name']>(
    method_name: K,
    params: K extends T['data'][number]['name'] 
      ? T['data'][number] extends infer E 
        ? E extends ABIEntry 
          ? E['name'] extends K 
            ? ExtractParams<E>
            : never
          : never
        : never
      : never
  ): Record<string, any> {
    return this.invokeUnsafe(method_name, params);
  }

  /**
   * Get list of available methods
   */
  public get_methods(): string[] {
    return Array.from(this.methods.keys());
  }

  /**
   * Get method signature information
   */
  public get_method_signature(method_name: string): ABIEntry | undefined {
    return this.methods.get(method_name);
  }

  /**
   * Generate TypeScript interface for the contract
   */
  public generate_interface(): string {
    const lines: string[] = [
      `interface ${this.constructor.name}Methods {`
    ];

    for (const [name, entry] of this.methods) {
      const params = entry.params.map(p => {
        const optional = p.optional ? '?' : '';
        return `    ${p.name}${optional}: ${this.get_typescript_type(p.type)};`;
      }).join('\n');

      lines.push(`  ${name}(params: {`);
      lines.push(params);
      lines.push('    maxGas?: number;');
      lines.push('    deposits?: Record<string, number | bigint>;');
      lines.push('  }): Record<string, any>;');
      lines.push('');
    }

    lines.push('}');
    return lines.join('\n');
  }

  private get_typescript_type(abi_type: string): string {
    const type_map: Record<string, string> = {
      'Hash': 'string',
      'Address': 'string',
      'PublicKey': 'string',
      'Blob': 'string',
      'String': 'string',
      'string': 'string',
      'Boolean': 'boolean',
      'boolean': 'boolean',
      'bool': 'boolean',
      'U256': 'bigint | number',
      'u256': 'bigint | number',
      'U128': 'bigint | number',
      'u128': 'bigint | number',
      'U64': 'bigint | number',
      'u64': 'bigint | number',
      'U32': 'number',
      'u32': 'number',
      'U16': 'number',
      'u16': 'number',
      'U8': 'number',
      'u8': 'number'
    };
    
    return type_map[abi_type] || 'any';
  }
}

/**
 * Create a typed contract instance with full TypeScript support
 */
export function create_typed_contract<T extends ABI>(
  address: string,
  abi: T
): TypedContract<T> & MethodsFromABI<T> {
  return new TypedContract(address, abi) as TypedContract<T> & MethodsFromABI<T>;
}

/**
 * Contract factory with strong typing
 */
export class TypedContractFactory<T extends ABI> {
  private readonly abi: T;
  private readonly contract_name: string;

  constructor(abi: T, contract_name: string = 'Contract') {
    this.abi = abi;
    this.contract_name = contract_name;
  }

  /**
   * Create a new contract instance at the specified address
   */
  public at(address: string): TypedContract<T> & MethodsFromABI<T> {
    return create_typed_contract(address, this.abi);
  }

  /**
   * Get the ABI
   */
  public get_abi(): T {
    return this.abi;
  }

  /**
   * Generate TypeScript definitions for this contract
   */
  public generate_type_definitions(): string {
    const contract = new TypedContract('0x0', this.abi);
    return contract.generate_interface();
  }
}

/**
 * Utility to validate ABI structure
 */
export function validate_abi(abi: any): abi is ABI {
  if (!abi || typeof abi !== 'object') {
    return false;
  }

  if (!Array.isArray(abi.data)) {
    return false;
  }

  for (const entry of abi.data) {
    if (typeof entry !== 'object' || !entry) {
      return false;
    }

    if (typeof entry.entry_id !== 'number') {
      return false;
    }

    if (typeof entry.name !== 'string') {
      return false;
    }

    if (!Array.isArray(entry.params)) {
      return false;
    }

    if (entry.type !== 'entry') {
      return false;
    }

    for (const param of entry.params) {
      if (typeof param.name !== 'string' || typeof param.type !== 'string') {
        return false;
      }
    }
  }

  return true;
}

/**
 * Helper to create a contract from JSON ABI
 */
export async function create_contract_from_json(
  address: string,
  abi_path: string
): Promise<TypedContract<ABI> & MethodsFromABI<ABI>> {
  const response = await fetch(abi_path);
  const abi = await response.json();
  
  if (!validate_abi(abi)) {
    throw new Error('Invalid ABI structure');
  }
  
  return create_typed_contract(address, abi);
}