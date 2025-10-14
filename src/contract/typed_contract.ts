import { 
  VMParameter, 
  createVMParameter, 
  ValidationType,
  createContractInvocation,
  ContractInvocationParams 
} from './xvm_serializer';

// Enhanced type definitions for better TypeScript support
export interface ABIParam {
  name: string;
  type: string;
  optional?: boolean;
  default?: any;
}

export interface ABIEntry {
  chunk_id: number;
  name: string;
  outputs?: string | string[];
  params: ABIParam[];
  type: 'entry' | 'view';
  description?: string;
}

export type ABI = {
  data: ABIEntry[],
  version: string
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
  any;

// Extract parameter types from ABI entry
type ExtractParams<T extends ABIEntry> = {
  [K in T['params'][number] as K['name']]: K extends { optional: true } 
    ? ParamType<K['type']> | undefined
    : ParamType<K['type']>
} & {
  maxGas?: number;
  deposits?: Record<string, number | bigint>;
};

// Generate method type from ABI entry
type MethodFromEntry<T extends ABIEntry> = (
  params: ExtractParams<T>
) => Record<string, any>;

// Generate all methods from ABI
type MethodsFromABI<T extends ABI> = {
  [K in T['data'][number] as K['name']]: MethodFromEntry<K>
};

// Convert ABI type to validator type
function normalizeType(abiType: string): ValidationType {
  const typeMap: Record<string, ValidationType> = {
    'Hash': 'Hash',
    'Address': 'Address',
    'PublicKey': 'PublicKey',
    'Blob': 'Blob',
    'u256': 'u256',
    'u128': 'u128',
    'u64': 'u64',
    'u32': 'u32',
    'u16': 'u16',
    'u8': 'u8',
    'boolean': 'boolean',
    'bool': 'boolean',
    'string': 'string',
    'String': 'string',
    'Boolean': 'boolean',
    'U256': 'u256',
    'U128': 'u128',
    'U64': 'u64',
    'U32': 'u32',
    'U16': 'u16',
    'U8': 'u8'
  };
  
  const normalized = typeMap[abiType];
  if (!normalized) {
    throw new Error(`Unknown ABI type: ${abiType}`);
  }
  return normalized;
}

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

    // Initialize methods
    for (const entry of abi.data) {
      if (entry.type === 'entry') {
        console.log("new method", entry.name)

        this.methods.set(entry.name, entry);
      }
    }

    // Return a Proxy to handle dynamic method calls
    return new Proxy(this, {
      get(target, prop, receiver) {
        // If it's a known property/method, return it
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        }

        // If it's a string property that matches a method name, create dynamic method
        if (typeof prop === 'string' && target.methods.has(prop)) {
          return (params: any) => target.invokeUnsafe(prop, params);
        }

        return undefined;
      }
    }) as any;
  }

  /**
   * Internal method to invoke contract functions
   */
  public invokeUnsafe(methodName: string, params: any = {}): Record<string, any> {
    const entry = this.methods.get(methodName);
    
    if (!entry) {
      throw new Error(`Method '${methodName}' not found in contract ABI`);
    }

    // Extract special parameters
    const { maxGas, deposits, ...methodParams } = params;

    // Build parameter list according to ABI
    const parameters: VMParameter[] = [];
    
    for (const abiParam of entry.params) {
      const value = methodParams[abiParam.name];
      
      // Check if parameter is required
      if (value === undefined && !abiParam.optional) {
        if (abiParam.default !== undefined) {
          methodParams[abiParam.name] = abiParam.default;
        } else {
          throw new Error(`Missing required parameter '${abiParam.name}' for method '${methodName}'`);
        }
      }

      if (value !== undefined) {
        try {
          const normalizedType = normalizeType(abiParam.type);
          const vmParam = createVMParameter(value, normalizedType);
          parameters.push(vmParam);
        } catch (error) {
          throw new Error(`Invalid parameter '${abiParam.name}' for method '${methodName}': ${error}`);
        }
      }
    }

    // Create the contract invocation
    const invocationParams: ContractInvocationParams = {
      contract: this.address,
      chunkId: entry.chunk_id,
      parameters,
      maxGas: maxGas || 200000000
    };

    if (deposits && Object.keys(deposits).length > 0) {
      invocationParams.deposits = deposits;
    }

    return createContractInvocation(invocationParams);
  }

  /**
   * Type-safe invoke method
   */
  public invoke<K extends T['data'][number]['name']>(
    methodName: K,
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
    return this.invokeUnsafe(methodName, params);
  }

  /**
   * Get list of available methods
   */
  public getMethods(): string[] {
    return Array.from(this.methods.keys());
  }

  /**
   * Get method signature information
   */
  public getMethodSignature(methodName: string): ABIEntry | undefined {
    return this.methods.get(methodName);
  }

  /**
   * Generate TypeScript interface for the contract
   */
  public generateInterface(): string {
    const lines: string[] = [
      `interface ${this.constructor.name}Methods {`
    ];

    for (const [name, entry] of this.methods) {
      const params = entry.params.map(p => {
        const optional = p.optional ? '?' : '';
        return `    ${p.name}${optional}: ${this.getTypeScriptType(p.type)};`;
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

  private getTypeScriptType(abiType: string): string {
    const typeMap: Record<string, string> = {
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
    
    return typeMap[abiType] || 'any';
  }
}

/**
 * Create a typed contract instance with full TypeScript support
 */
export function createTypedContract<T extends ABI>(
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
  private readonly contractName: string;

  constructor(abi: T, contractName: string = 'Contract') {
    this.abi = abi;
    this.contractName = contractName;
  }

  /**
   * Create a new contract instance at the specified address
   */
  public at(address: string): TypedContract<T> & MethodsFromABI<T> {
    return createTypedContract(address, this.abi);
  }

  /**
   * Get the ABI
   */
  public getABI(): T {
    return this.abi;
  }

  /**
   * Generate TypeScript definitions for this contract
   */
  public generateTypeDefinitions(): string {
    const contract = new TypedContract('0x0', this.abi);
    return contract.generateInterface();
  }
}

/**
 * Utility to validate ABI structure
 */
export function validateABI(abi: any): abi is ABI {
  if (!Array.isArray(abi)) {
    return false;
  }

  for (const entry of abi) {
    if (typeof entry !== 'object' || !entry) {
      return false;
    }

    if (typeof entry.chunk_id !== 'number') {
      return false;
    }

    if (typeof entry.name !== 'string') {
      return false;
    }

    if (!Array.isArray(entry.params)) {
      return false;
    }

    if (entry.type !== 'entry' && entry.type !== 'view') {
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
export async function createContractFromJSON(
  address: string,
  abiPath: string
): Promise<TypedContract<ABI> & MethodsFromABI<ABI>> {
  const response = await fetch(abiPath);
  const abi = await response.json();
  
  if (!validateABI(abi.data)) {
    throw new Error('Invalid ABI structure');
  }
  
  return createTypedContract(address, abi);
}
