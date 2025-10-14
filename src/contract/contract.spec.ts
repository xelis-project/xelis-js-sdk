import { Contract, createContract } from "./contract";
import { createTypedContract } from "./typed_contract";

// Sample ABIs for testing
const routerABI = [
  {
    chunk_id: 12,
    name: "addLiquidity",
    outputs: "u64",
    params: [
      { name: "token0Hash", type: "Hash" },
      { name: "token1Hash", type: "Hash" }
    ],
    type: "entry" as const
  },
  {
    chunk_id: 13,
    name: "removeLiquidity",
    outputs: "u64",
    params: [
      { name: "liquidityTokenHash", type: "Hash" }
    ],
    type: "entry" as const
  },
  {
    chunk_id: 14,
    name: "swap",
    outputs: "u64",
    params: [
      { name: "tokenInHash", type: "Hash" },
      { name: "tokenOutHash", type: "Hash" },
      { name: "amountOutMin", type: "u64" }
    ],
    type: "entry" as const
  }
];

const factoryABI = [
  {
    chunk_id: 1,
    name: "createToken",
    outputs: "Hash",
    params: [
      { name: "name", type: "string" },
      { name: "ticker", type: "string" },
      { name: "decimals", type: "u8" },
      { name: "supply", type: "u64" },
      { name: "mintable", type: "boolean" },
      { name: "maxSupply", type: "u64" },
      { name: "icon", type: "string" }
    ],
    type: "entry" as const
  },
  {
    chunk_id: 2,
    name: "mintTokens",
    outputs: "u64",
    params: [
      { name: "assetHash", type: "Hash" },
      { name: "mintAmount", type: "u64" }
    ],
    type: "entry" as const
  }
];

describe('Contract Class Tests', () => {
  const ROUTER_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';
  const FACTORY_ADDRESS = '0xabcdef1234567890abcdef1234567890abcdef12';

  describe('Basic Functionality', () => {
    test('should create contract instance with ABI', () => {
      const contract = new Contract(ROUTER_ADDRESS, routerABI);

      expect(contract.address).toBe(ROUTER_ADDRESS);
      expect(contract.abi).toEqual(routerABI);
      expect(contract.getMethods()).toContain('addLiquidity');
      expect(contract.getMethods()).toContain('removeLiquidity');
      expect(contract.getMethods()).toContain('swap');
    });

    test('should generate dynamic methods from ABI', () => {
      const contract = new Contract(ROUTER_ADDRESS, routerABI);

      // Check that dynamic methods exist
      expect(typeof (contract as any).addLiquidity).toBe('function');
      expect(typeof (contract as any).removeLiquidity).toBe('function');
      expect(typeof (contract as any).swap).toBe('function');

      // Check method metadata
      expect((contract as any).methods.get("addLiquidity")).toBeDefined();
      expect((contract as any).methods.get("addLiquidity").chunk_id).toBe(12);
    });
  });

  describe('Dynamic Method Invocation', () => {
    test('should call addLiquidity with deposits', () => {
      const contract = new Contract(ROUTER_ADDRESS, routerABI);
      const token0 = 'a'.repeat(64);
      const token1 = 'b'.repeat(64);

      const result = (contract as any).addLiquidity({
        token0Hash: token0,
        token1Hash: token1,
        deposits: {
          [token0]: 1000000,
          [token1]: 2000000
        },
        maxGas: 300000000
      });

      expect(result).toHaveProperty('invoke_contract');
      expect(result.invoke_contract.contract).toBe(ROUTER_ADDRESS);
      expect(result.invoke_contract.chunk_id).toBe(12);
      expect(result.invoke_contract.max_gas).toBe(300000000);
      expect(result.invoke_contract.parameters).toHaveLength(2);
      expect(result.invoke_contract.deposits).toBeDefined();
      expect(result.invoke_contract.deposits[token0]).toEqual({ amount: 1000000 });
      expect(result.invoke_contract.deposits[token1]).toEqual({ amount: 2000000 });
    });

    test('should call swap with correct parameters', () => {
      const contract = new Contract(ROUTER_ADDRESS, routerABI);
      const tokenIn = 'c'.repeat(64);
      const tokenOut = 'd'.repeat(64);

      const result = (contract as any).swap({
        tokenInHash: tokenIn,
        tokenOutHash: tokenOut,
        amountOutMin: 950000,
        deposits: {
          [tokenIn]: 1000000
        }
      });

      expect(result.invoke_contract.chunk_id).toBe(14);
      expect(result.invoke_contract.parameters).toHaveLength(3);
      expect(result.invoke_contract.parameters[2].value.value).toBe(950000);
      expect(result.invoke_contract.deposits[tokenIn]).toEqual({ amount: 1000000 });
    });
  });

  describe('Invoke Method', () => {
    test('should work with invoke method', () => {
      const contract = new Contract(ROUTER_ADDRESS, routerABI);
      const token0 = 'a'.repeat(64);
      const token1 = 'b'.repeat(64);

      const result = contract.invoke('addLiquidity', {
        token0Hash: token0,
        token1Hash: token1,
        deposits: {
          [token0]: 1000000,
          [token1]: 2000000
        }
      });

      expect(result.invoke_contract.chunk_id).toBe(12);
      expect(result.invoke_contract.parameters).toHaveLength(2);
    });

    test('should throw error for non-existent method', () => {
      const contract = new Contract(ROUTER_ADDRESS, routerABI);

      expect(() => {
        contract.invoke('nonExistentMethod', {});
      }).toThrow("Method 'nonExistentMethod' not found in contract ABI");
    });
  });

  describe('Typed Contract Creation', () => {
    test('should create typed router contract', () => {
      const router = createTypedContract(ROUTER_ADDRESS, routerABI);

      // TypeScript should recognize these methods
      const result = router.addLiquidity({
        token0Hash: 'a'.repeat(64),
        token1Hash: 'b'.repeat(64),
        deposits: {
          ['a'.repeat(64)]: 1000000,
          ['b'.repeat(64)]: 2000000
        }
      });

      expect(result.invoke_contract).toBeDefined();
    });

    test('should create typed factory contract', () => {
      const factory = createTypedContract(FACTORY_ADDRESS, factoryABI);

      const result = factory.createToken({
        name: 'Test Token',
        ticker: 'TEST',
        decimals: 8,
        supply: 1000000000,
        mintable: true,
        maxSupply: 10000000000,
        icon: 'https://example.com/icon.png'
      });

      expect(result.invoke_contract.chunk_id).toBe(1);
      expect(result.invoke_contract.parameters).toHaveLength(7);
    });
  });

  describe('Parameter Validation', () => {
    test('should validate hash format', () => {
      const contract = new Contract(ROUTER_ADDRESS, routerABI);

      expect(() => {
        contract.invoke('addLiquidity', {
          token0Hash: 'invalid-hash',
          token1Hash: 'b'.repeat(64)
        });
      }).toThrow(/not a valid 64-character hex hash/);
    });

    test('should validate u64 range', () => {
      const contract = new Contract(ROUTER_ADDRESS, routerABI);

      // Valid u64
      const result1 = contract.invoke('swap', {
        tokenInHash: 'a'.repeat(64),
        tokenOutHash: 'b'.repeat(64),
        amountOutMin: 1000
      });
      expect(result1).toBeDefined();

      // Negative number should fail
      expect(() => {
        contract.invoke('swap', {
          tokenInHash: 'a'.repeat(64),
          tokenOutHash: 'b'.repeat(64),
          amountOutMin: -1
        });
      }).toThrow(/out of range for u64/);
    });

    test('should handle different numeric types', () => {
      const factory = new Contract(FACTORY_ADDRESS, factoryABI);

      const result = factory.invoke('createToken', {
        name: 'Test',
        ticker: 'TST',
        decimals: 8,  // u8
        supply: 1000000,  // u64
        mintable: true,  // boolean
        maxSupply: BigInt(10000000),  // u64 as bigint
        icon: ''
      });

      expect(result.invoke_contract.parameters[2].value.type).toBe('u8');
      expect(result.invoke_contract.parameters[3].value.type).toBe('u64');
      expect(result.invoke_contract.parameters[4].value.type).toBe('boolean');
    });
  });

  describe('ABI Metadata Access', () => {
    test('should get method ABI', () => {
      const contract = new Contract(ROUTER_ADDRESS, routerABI);

      const swapABI = contract.getMethodSignature('swap');
      expect(swapABI).toBeDefined();
      expect(swapABI?.chunk_id).toBe(14);
      expect(swapABI?.params).toHaveLength(3);

      const nonExistent = contract.getMethodSignature('nonExistent');
      expect(nonExistent).toBeUndefined();
    });

    test('should list all methods', () => {
      const contract = new Contract(ROUTER_ADDRESS, routerABI);
      const methods = contract.getMethods();

      expect(methods).toEqual(['addLiquidity', 'removeLiquidity', 'swap']);
    });
  });

  describe('Complex Types', () => {
    test('should handle string parameters', () => {
      const factory = new Contract(FACTORY_ADDRESS, factoryABI);

      const result = factory.invoke('createToken', {
        name: 'My Token Name',
        ticker: 'MTN',
        decimals: 18,
        supply: 1000000,
        mintable: false,
        maxSupply: 2000000,
        icon: 'https://example.com/token.png'
      });

      expect(result.invoke_contract.parameters[0].value.type).toBe('string');
      expect(result.invoke_contract.parameters[0].value.value).toBe('My Token Name');
    });

    test('should handle boolean parameters', () => {
      const factory = new Contract(FACTORY_ADDRESS, factoryABI);

      const result = factory.invoke('createToken', {
        name: 'Token',
        ticker: 'TKN',
        decimals: 8,
        supply: 1000,
        mintable: true,
        maxSupply: 10000,
        icon: ''
      });

      expect(result.invoke_contract.parameters[4].value.type).toBe('boolean');
      expect(result.invoke_contract.parameters[4].value.value).toBe(true);
    });
  });

  describe('Default Values', () => {
    test('should use default maxGas if not provided', () => {
      const contract = new Contract(ROUTER_ADDRESS, routerABI);

      const result = contract.invoke('removeLiquidity', {
        liquidityTokenHash: 'a'.repeat(64)
      });

      expect(result.invoke_contract.max_gas).toBe(200000000); // default
    });

    test('should override default maxGas when provided', () => {
      const contract = new Contract(ROUTER_ADDRESS, routerABI);

      const result = contract.invoke('removeLiquidity', {
        liquidityTokenHash: 'a'.repeat(64),
        maxGas: 100000000
      });

      expect(result.invoke_contract.max_gas).toBe(100000000);
    });
  });
});

// Example integration test
describe('Integration Example', () => {
  test('complete DEX interaction flow', () => {
    const routerAddress = '0x1234567890abcdef1234567890abcdef12345678';
    const router = createTypedContract(routerAddress, routerABI);

    // Token addresses
    const tokenA = 'a'.repeat(64);
    const tokenB = 'b'.repeat(64);
    const lpToken = 'c'.repeat(64);

    // 1. Add liquidity
    const addLiqTx = router.addLiquidity({
      token0Hash: tokenA,
      token1Hash: tokenB,
      deposits: {
        [tokenA]: 1000000,
        [tokenB]: 1000000
      }
    });

    expect(addLiqTx.invoke_contract.chunk_id).toBe(12);
    console.log('Add Liquidity TX:', JSON.stringify(addLiqTx, null, 2));

    // 2. Swap tokens
    const swapTx = router.swap({
      tokenInHash: tokenA,
      tokenOutHash: tokenB,
      amountOutMin: 900000,
      deposits: {
        [tokenA]: 100000
      }
    });

    expect(swapTx.invoke_contract.chunk_id).toBe(14);
    console.log('Swap TX:', JSON.stringify(swapTx, null, 2));

    // 3. Remove liquidity
    const removeLiqTx = router.removeLiquidity({
      liquidityTokenHash: lpToken,
      deposits: {
        [lpToken]: 500000
      }
    });

    expect(removeLiqTx.invoke_contract.chunk_id).toBe(13);
    console.log('Remove Liquidity TX:', JSON.stringify(removeLiqTx, null, 2));
  });
});
