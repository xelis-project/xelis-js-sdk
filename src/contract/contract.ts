import {
  VMParameter,
  createVMParameter,
  ValidationType,
  createContractInvocation,
  ContractInvocationParams
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
  type: 'entry' | 'view';
}

export interface ABI {
  data: ABIEntry[],
  version: string
};

// Map common ABI types to TypeScript types
type TypeMapping = {
  'Hash': string;
  'Address': string;
  'PublicKey': string;
  'Blob': string;
  'u256': bigint | number;
  'u128': bigint | number;
  'u64': bigint | number;
  'u32': number;
  'u16': number;
  'u8': number;
  'boolean': boolean;
  'bool': boolean;
  'string': string;
  'String': string;
  'Boolean': boolean;
  'U64': bigint | number;
  'U32': number;
  'U16': number;
  'U8': number;
};

// Convert ABI type to our validator type
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

// Generic parameter object for contract calls
export interface ContractCallParams {
  [key: string]: any;
  maxGas?: number;
  deposits?: Record<string, number | bigint>;
}

// Base contract interface
export interface IContract {
  readonly address: string;
  readonly abi: ABI;
  invoke(methodName: string, params?: ContractCallParams): Record<string, any>;
}

// Type to generate method signatures from ABI
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

    // Parse ABI and set up methods map
    for (const entry of abi.data) {
      if (entry.type === 'entry') {
        this.methods.set(entry.name, entry);

        // Dynamically add method to the instance
        this.createDynamicMethod(entry);
      }
    }
  }

  /**
   * Creates a dynamic method on the contract instance
   */
  private createDynamicMethod(entry: ABIEntry): void {
    const methodName = entry.name;

    // Create a method that properly binds 'this'
    const method = (params?: ContractCallParams) => {
      return this.invoke(methodName, params);
    };

    // Add the method to the instance
    (this as any)[methodName] = method;
  }

  /**
   * Invoke a contract method by name
   * @param methodName - Name of the method from the ABI
   * @param params - Parameters for the method call
   */
  public invoke(methodName: string, params: ContractCallParams = {}): Record<string, any> {
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

      if (value === undefined) {
        throw new Error(`Missing required parameter '${abiParam.name}' for method '${methodName}'`);
      }

      try {
        const normalizedType = normalizeType(abiParam.type);
        const vmParam = createVMParameter(value, normalizedType);
        parameters.push(vmParam);
      } catch (error) {
        throw new Error(`Invalid parameter '${abiParam.name}' for method '${methodName}': ${error}`);
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
   * Validate parameters for a method without creating the transaction
   */
  public validateParams(methodName: string, params: ContractCallParams): boolean {
    const entry = this.methods.get(methodName);

    if (!entry) {
      throw new Error(`Method '${methodName}' not found in contract ABI`);
    }

    const { deposits, maxGas, ...methodParams } = params;

    // Check all required parameters are present
    for (const abiParam of entry.params) {
      if (!(abiParam.name in methodParams)) {
        throw new Error(`Missing required parameter '${abiParam.name}'`);
      }

      // Validate type
      try {
        const normalizedType = normalizeType(abiParam.type);
        createVMParameter(methodParams[abiParam.name], normalizedType, true);
      } catch (error) {
        throw new Error(`Invalid parameter '${abiParam.name}': ${error}`);
      }
    }

    // Check for extra parameters
    const expectedParams = new Set(entry.params.map(p => p.name));
    for (const key in methodParams) {
      if (!expectedParams.has(key)) {
        console.warn(`Warning: Unexpected parameter '${key}' for method '${methodName}'`);
      }
    }

    return true;
  }
}

/**
 * Helper function to create a typed contract instance
 * This provides better TypeScript support when the ABI is known at compile time
 */
export function createContract<T extends ABI>(
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
    return createContract(address, this.abi);
  }

  /**
   * Get the ABI
   */
  public getABI(): T {
    return this.abi;
  }
}
