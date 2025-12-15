import { 
  VMParameter, 
  createContractInvocation,
  ContractInvocationParams,
  typeRegistry,
  defineEnum,
  defineStruct,
  createVMParameter
} from './xvm_serializer';

// Type definitions based on ABI structure
export interface ABIParam {
  name: string;
  type: string;
}

export interface ABIEntry {
  chunk_id: number;
  name: string;
  outputs?: string;
  params: ABIParam[];
  type: 'entry';
}

export interface InternalType {
  name: string;
  kind: 'struct' | 'enum';
  fields?: Array<{ name: string; type: string }>; // For structs
  variants?: Array<{  // For enums
    name: string;
    fields: Array<{ name: string; type: string }>;
  }>;
}

export interface ABI {
  data: ABIEntry[];
  version: string;
  internal_types?: InternalType[];
}

export interface ContractCallParams {
  [key: string]: any;
  maxGas?: number;
  permission: string,
  deposits?: Record<string, number | bigint>;
}

export interface IContract {
  readonly address: string;
  readonly abi: ABI;
  invoke(method_name: string, params?: ContractCallParams): Record<string, any>;
}

type GenerateContractMethods<T extends ABI> = {
  [K in T['data'][number]['name']]: (params?: ContractCallParams) => Record<string, any>;
};

/**
 * Contract class that dynamically generates methods based on ABI
 */
export class Contract<T extends ABI = ABI> implements IContract {
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
        
        this.create_dynamic_method(entry);
      }
    }
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
   * Creates a dynamic method on the contract instance
   */
  private create_dynamic_method(entry: ABIEntry): void {
    const method_name = entry.name;
    
    const method = (params?: ContractCallParams) => {
      return this.invoke(method_name, params);
    };

    (this as any)[method_name] = method;
  }

  /**
   * Invoke a contract method by name
   * @param method_name - Name of the method from the ABI
   * @param params - Parameters for the method call
   */
  public invoke(method_name: string, params: ContractCallParams = { permission: "all" } ): Record<string, any> {
    const entry = this.methods.get(method_name);
    
    if (!entry) {
      throw new Error(`Method '${method_name}' not found in contract ABI`);
    }

    const { maxGas, deposits, permission, ...method_params } = params;

    const parameters: VMParameter[] = [];
    
    for (const abi_param of entry.params) {
      const value = method_params[abi_param.name];
      
      if (value === undefined) {
        throw new Error(`Missing required parameter '${abi_param.name}' for method '${method_name}'`);
      }

      try {
        const VMParam = createVMParameter(value, abi_param.type);
        parameters.push(VMParam);
      } catch (error) {
        throw new Error(`Invalid parameter '${abi_param.name}' for method '${method_name}': ${error}`);
      }
    }

    const invocation_params: ContractInvocationParams = {
      contract: this.address,
      chunk_id: entry.chunk_id,
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
   * Validate parameters for a method without creating the transaction
   */
  public validate_params(method_name: string, params: ContractCallParams): boolean {
    const entry = this.methods.get(method_name);
    
    if (!entry) {
      throw new Error(`Method '${method_name}' not found in contract ABI`);
    }

    const { deposits, maxGas, ...method_params } = params;

    for (const abi_param of entry.params) {
      if (!(abi_param.name in method_params)) {
        throw new Error(`Missing required parameter '${abi_param.name}'`);
      }

      try {
        createVMParameter(method_params[abi_param.name], abi_param.type, true);
      } catch (error) {
        throw new Error(`Invalid parameter '${abi_param.name}': ${error}`);
      }
    }

    const expected_params = new Set(entry.params.map(p => p.name));
    for (const key in method_params) {
      if (!expected_params.has(key)) {
        console.warn(`Warning: Unexpected parameter '${key}' for method '${method_name}'`);
      }
    }

    return true;
  }
}

/**
 * Helper function to create a typed contract instance
 * This provides better TypeScript support when the ABI is known at compile time
 */
export function create_contract<T extends ABI>(
  address: string, 
  abi: T
): Contract<T> & GenerateContractMethods<T> {
  return new Contract(address, abi) as Contract<T> & GenerateContractMethods<T>;
}

/**
 * Factory for creating multiple contracts with the same ABI
 */
export class ContractFactory<T extends ABI = ABI> {
  private readonly abi: T;

  constructor(abi: T) {
    this.abi = abi;
  }

  /**
   * Create a new contract instance at the specified address
   */
  public at(address: string): Contract<T> & GenerateContractMethods<T> {
    return create_contract(address, this.abi);
  }

  /**
   * Get the ABI
   */
  public get_abi(): T {
    return this.abi;
  }
}