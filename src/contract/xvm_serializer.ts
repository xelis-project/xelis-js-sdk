export interface VMParameter {
  type: string;
  value: any;
}

// Known opaque types that need special wrapping
const OPAQUE_TYPES = new Set(['Hash', 'Address', 'PublicKey', 'Blob' /** TODO */]);

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
export function createVMParameter(
  value: any, 
  type: ValidationType, 
  validate: boolean = true
): VMParameter {
  let processedValue = value;
  
  // Validate and convert value if requested
  if (validate && TYPE_VALIDATORS[type]) {
    try {
      processedValue = TYPE_VALIDATORS[type](value);
    } catch (error) {
      throw new Error(`Failed to create VM parameter for type ${type}: ${error}`);
    }
  }
  
  // Handle opaque types (Hash, Address, PublicKey)
  if (OPAQUE_TYPES.has(type)) {
    return {
      type: "default",
      value: {
        type: "opaque",
        value: {
          type: type,
          value: processedValue
        }
      }
    };
  }
  
  // Handle regular types
  return {
    type: "default",
    value: {
      type: type,
      value: processedValue
    }
  };
}

/**
 * Convenience functions for common types
 */
export const vmParam = {
  hash: (value: string) => createVMParameter(value, 'Hash'),
  address: (value: string) => createVMParameter(value, 'Address'),
  publicKey: (value: string) => createVMParameter(value, 'PublicKey'),
  blob: (value: string) => createVMParameter(value, 'Blob'),
  u64: (value: number | bigint) => createVMParameter(value, 'u64'),
  u32: (value: number) => createVMParameter(value, 'u32'),
  u16: (value: number) => createVMParameter(value, 'u16'),
  u8: (value: number) => createVMParameter(value, 'u8'),
  string: (value: string) => createVMParameter(value, 'string'),
  boolean: (value: boolean) => createVMParameter(value, 'boolean'),
};

/**
 * Creates a deposits object for contract calls
 * @param deposits - Object mapping token hashes to amounts
 */
export function createDeposits(deposits: Record<string, number | bigint>): Record<string, { amount: number | bigint }> {
  const result: Record<string, { amount: number | bigint }> = {};
  
  for (const [tokenHash, amount] of Object.entries(deposits)) {
    // Validate hash format
    if (!/^[0-9a-fA-F]{64}$/.test(tokenHash)) {
      throw new Error(`Invalid token hash format: ${tokenHash}`);
    }
    
    result[tokenHash] = { amount };
  }
  
  return result;
}

/**
 * Creates a contract invocation object
 */
export interface ContractInvocationParams {
  contract: string;
  chunkId: number;
  parameters?: VMParameter[];
  deposits?: Record<string, number | bigint>;
  maxGas?: number;
}

export function createContractInvocation(params: ContractInvocationParams): Record<string, any> {
  const {
    contract,
    chunkId,
    parameters = [],
    deposits,
    maxGas = 200000000
  } = params;
  
  const result: any = {
    invoke_contract: {
      contract,
      max_gas: maxGas,
      chunk_id: chunkId,
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
  const { bytecode, hasConstructor = false, maxGas = 200000000 } = params;
  
  const result: any = {
    deploy_contract: {
      module: bytecode,
      ...(hasConstructor && { invoke: { max_gas: maxGas } })
    }
  };
  
  return result;
}