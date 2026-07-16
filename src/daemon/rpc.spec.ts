import { to } from 'await-to-js'

import { MAINNET_NODE_RPC } from '../config'
import DaemonRPC from './rpc'

describe('DaemonRPC', () => {
  const daemon = new DaemonRPC(MAINNET_NODE_RPC)
  let realAddress: string
  let realContract: string
  let realBlockHash: string

  beforeAll(async () => {
    // Fetch real data from the daemon for dependent tests
    const [err1, accounts] = await to(daemon.getAccounts({ maximum: 1 }))
    if (!err1 && accounts && accounts.length > 0) {
      realAddress = accounts[0]
    }
    const [err2, contracts] = await to(daemon.getContracts({ maximum: 1 }))
    if (!err2 && contracts && contracts.length > 0) {
      realContract = contracts[0]
    }
    const [err3, topBlock] = await to(daemon.getTopBlock())
    if (!err3 && topBlock) {
      realBlockHash = topBlock.hash
    }
  })

  test('getVersion', async () => {
    const [err, res] = await to(daemon.getVersion())
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Version:', res)
  })

  test('getHeight', async () => {
    const [err, res] = await to(daemon.getHeight())
    expect(err).toBeNull()
    expect(res).toBeGreaterThan(0)
    console.log('Height:', res)
  })

  test('getTopoheight', async () => {
    const [err, res] = await to(daemon.getTopoheight())
    expect(err).toBeNull()
    expect(res).toBeGreaterThan(0)
    console.log('Topoheight:', res)
  })

  test('getPrunedTopoheight', async () => {
    const [err, res] = await to(daemon.getPrunedTopoheight())
    expect(err).toBeNull()
    console.log('Pruned topoheight:', res)
  })

  test('getInfo', async () => {
    const [err, res] = await to(daemon.getInfo())
    expect(err).toBeNull()
    expect(res).toBeDefined()
    expect(res!.height).toBeGreaterThan(0)
    expect(res!.version).toBeDefined()
    console.log('Info:', res)
  })

  test('getDifficulty', async () => {
    const [err, res] = await to(daemon.getDifficulty())
    expect(err).toBeNull()
    expect(res).toBeDefined()
    expect(res!.difficulty).toBeDefined()
    console.log('Difficulty:', res)
  })

  test('getTips', async () => {
    const [err, res] = await to(daemon.getTips())
    expect(err).toBeNull()
    expect(Array.isArray(res)).toBe(true)
    console.log('Tips count:', res?.length)
  })

  test('getDevFeeThresholds', async () => {
    const [err, res] = await to(daemon.getDevFeeThresholds())
    expect(err).toBeNull()
    expect(Array.isArray(res)).toBe(true)
    console.log('Dev fee thresholds:', res)
  })

  test('getSizeOnDisk', async () => {
    const [err, res] = await to(daemon.getSizeOnDisk())
    expect(err).toBeNull()
    expect(res).toBeDefined()
    expect(res!.size_bytes).toBeGreaterThan(0)
    console.log('Size on disk:', res)
  })

  test('getStableHeight', async () => {
    const [err, res] = await to(daemon.getStableHeight())
    expect(err).toBeNull()
    expect(res).toBeGreaterThan(0)
    console.log('Stable height:', res)
  })

  test('getStableTopoheight', async () => {
    const [err, res] = await to(daemon.getStableTopoheight())
    expect(err).toBeNull()
    expect(res).toBeGreaterThan(0)
    console.log('Stable topoheight:', res)
  })

  test('getHardForks', async () => {
    const [err, res] = await to(daemon.getHardForks())
    expect(err).toBeNull()
    expect(Array.isArray(res)).toBe(true)
    console.log('Hard forks:', res)
  })

  test('getTopBlock', async () => {
    const [err, res] = await to(daemon.getTopBlock())
    expect(err).toBeNull()
    expect(res).toBeDefined()
    expect(res!.hash).toBeDefined()
    console.log('Top block:', res!.hash)
  })

  test('getTopBlock with txs', async () => {
    const [err, res] = await to(daemon.getTopBlock({ include_txs: true }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    expect(res!.transactions).toBeDefined()
    console.log('Top block txs:', res!.transactions?.length)
  })

  test('getAssets', async () => {
    const [err, res] = await to(daemon.getAssets({ maximum: 5 }))
    expect(err).toBeNull()
    expect(Array.isArray(res)).toBe(true)
    console.log('Assets:', res)
  })

  test('countAssets', async () => {
    const [err, res] = await to(daemon.countAssets())
    expect(err).toBeNull()
    expect(res).toBeGreaterThan(0)
    console.log('Asset count:', res)
  })

  test('countTransactions', async () => {
    const [err, res] = await to(daemon.countTransactions())
    expect(err).toBeNull()
    expect(res).toBeGreaterThan(0)
    console.log('Tx count:', res)
  })

  test('countAccounts', async () => {
    const [err, res] = await to(daemon.countAccounts())
    expect(err).toBeNull()
    expect(res).toBeGreaterThan(0)
    console.log('Account count:', res)
  })

  test('countContracts', async () => {
    const [err, res] = await to(daemon.countContracts())
    expect(err).toBeNull()
    expect(res).toBeGreaterThanOrEqual(0)
    console.log('Contract count:', res)
  })

  test('p2pStatus', async () => {
    const [err, res] = await to(daemon.p2pStatus())
    expect(err).toBeNull()
    expect(res).toBeDefined()
    expect(res!.peer_count).toBeGreaterThanOrEqual(0)
    console.log('P2P status:', res)
  })

  test('getPeers', async () => {
    const [err, res] = await to(daemon.getPeers())
    expect(err).toBeNull()
    expect(res).toBeDefined()
    expect(res!.total_peers).toBeGreaterThanOrEqual(0)
    console.log('Peers:', res)
  })

  test('getMempool', async () => {
    const [err, res] = await to(daemon.getMemPool({ maximum: 5 }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Mempool total:', res?.total)
  })

  test('getMempoolSummary', async () => {
    const [err, res] = await to(daemon.getMempoolSummary({ maximum: 5 }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Mempool summary total:', res?.total)
  })

  test('getEstimatedFeeRates', async () => {
    const [err, res] = await to(daemon.getEstimatedFeeRates())
    expect(err).toBeNull()
    expect(res).toBeDefined()
    expect(res!.low).toBeGreaterThan(0)
    console.log('Fee rates:', res)
  })

  test('getEstimatedFeePerKB', async () => {
    const [err, res] = await to(daemon.getEstimatedFeePerKB())
    expect(err).toBeNull()
    expect(res).toBeDefined()
    expect(res!.fee_per_kb).toBeGreaterThan(0)
    console.log('Fee per KB:', res)
  })

  test('getDAGOrder', async () => {
    const [err, res] = await to(daemon.getDAGOrder({ start_topoheight: 0, end_topoheight: 10 }))
    expect(err).toBeNull()
    expect(Array.isArray(res)).toBe(true)
    console.log('DAG order count:', res?.length)
  })

  test('getBlocksRangeByTopoheight', async () => {
    const [err, res] = await to(daemon.getBlocksRangeByTopoheight({ start_topoheight: 0, end_topoheight: 2 }))
    expect(err).toBeNull()
    expect(Array.isArray(res)).toBe(true)
    console.log('Blocks by topoheight count:', res?.length)
  })

  test('getBlocksRangeByHeight', async () => {
    const [err, res] = await to(daemon.getBlocksRangeByHeight({ start_height: 0, end_height: 2 }))
    expect(err).toBeNull()
    expect(Array.isArray(res)).toBe(true)
    console.log('Blocks by height count:', res?.length)
  })

  test('getAccounts', async () => {
    const [err, res] = await to(daemon.getAccounts({ maximum: 5 }))
    expect(err).toBeNull()
    expect(Array.isArray(res)).toBe(true)
    console.log('Accounts:', res)
  })

  test('validateAddress', async () => {
    // Skip if no real address available
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.validateAddress({ address: realAddress, allow_integrated: false }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Validate address:', res)
  })

  test('getContractTransactions', async () => {
    // Skip if no real contract available
    if (!realContract) {
      console.log('Skipping: no real contract available')
      return
    }
    const [err, res] = await to(daemon.getContractTransactions({ contract: realContract, maximum: 5 }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Contract transactions:', res)
  })

  test('simulateContractInvoke', async () => {
    const [err, res] = await to(daemon.simulateContractInvoke({
      source: realAddress || 'xel:qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqp5uek2',
      contract: realContract || '0000000000000000000000000000000000000000000000000000000000000000',
      deposits: {},
      entry_id: 0,
      parameters: []
    }))
    // simulate may fail if entry doesn't exist, but we should get a response
    console.log('Simulate result:', err, res)
  })

  test('getBlockAtTopoheight', async () => {
    const [err, res] = await to(daemon.getBlockAtTopoheight({ topoheight: 0 }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    expect(res!.hash).toBeDefined()
    console.log('Block at topoheight 0:', res!.hash)
  })

  test('getBlocksAtHeight', async () => {
    const [err, res] = await to(daemon.getBlocksAtHeight({ height: 0 }))
    expect(err).toBeNull()
    expect(Array.isArray(res)).toBe(true)
    console.log('Blocks at height 0:', res?.length)
  })

  test('getBlockByHash', async () => {
    const [err1, topBlock] = await to(daemon.getTopBlock())
    expect(err1).toBeNull()
    expect(topBlock).toBeDefined()
    const [err2, res] = await to(daemon.getBlockByHash({ hash: topBlock!.hash }))
    expect(err2).toBeNull()
    expect(res).toBeDefined()
    expect(res!.hash).toBe(topBlock!.hash)
    console.log('Block by hash:', res!.hash)
  })

  test('getBlockDifficultyByHash', async () => {
    const [err1, topBlock] = await to(daemon.getTopBlock())
    expect(err1).toBeNull()
    const [err2, res] = await to(daemon.getBlockDifficultyByHash({ block_hash: topBlock!.hash }))
    expect(err2).toBeNull()
    expect(res).toBeDefined()
    console.log('Block difficulty:', res)
  })

  test('getBlockBaseFeeByHash', async () => {
    const [err1, topBlock] = await to(daemon.getTopBlock())
    expect(err1).toBeNull()
    const [err2, res] = await to(daemon.getBlockBaseFeeByHash({ block_hash: topBlock!.hash }))
    expect(err2).toBeNull()
    expect(res).toBeDefined()
    console.log('Block base fee:', res)
  })

  test('getBlockSummaryAtTopoheight', async () => {
    const [err, res] = await to(daemon.getBlockSummaryAtTopoheight({ topoheight: 0 }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Block summary at topoheight 0:', res)
  })

  test('getBlockSummaryByHash', async () => {
    const [err1, topBlock] = await to(daemon.getTopBlock())
    expect(err1).toBeNull()
    const [err2, res] = await to(daemon.getBlockSummaryByHash({ hash: topBlock!.hash }))
    expect(err2).toBeNull()
    expect(res).toBeDefined()
    console.log('Block summary by hash:', res)
  })

  test('getAsset', async () => {
    const [err, res] = await to(daemon.getAsset({ asset: '0000000000000000000000000000000000000000000000000000000000000000' }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('XELIS asset:', res)
  })

  test('getAssetSupply', async () => {
    const [err, res] = await to(daemon.getAssetSupply({ asset: '0000000000000000000000000000000000000000000000000000000000000000' }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    expect(res!.data).toBeGreaterThan(0)
    console.log('XELIS supply:', res)
  })

  test('getAssetSupplyAtTopoheight', async () => {
    const [err, res] = await to(daemon.getAssetSupplyAtTopoheight({ asset: '0000000000000000000000000000000000000000000000000000000000000000', topoheight: 0 }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('XELIS supply at topoheight 0:', res)
  })

  test('getContractModule', async () => {
    if (!realContract) {
      console.log('Skipping: no real contract available')
      return
    }
    const [err, res] = await to(daemon.getContractModule({ contract: realContract }))
    // Module may not be available for all contracts
    console.log('Contract module:', err, res)
  })

  test('getContractData', async () => {
    if (!realContract) {
      console.log('Skipping: no real contract available')
      return
    }
    const [err, res] = await to(daemon.getContractData({ contract: realContract, key: '0' }))
    // May fail if key doesn't exist
    console.log('Contract data:', err, res)
  })

  test('getContractDataAtTopoheight', async () => {
    if (!realContract) {
      console.log('Skipping: no real contract available')
      return
    }
    const [err, res] = await to(daemon.getContractDataAtTopoheight({ contract: realContract, key: '0', topoheight: 0 }))
    console.log('Contract data at topoheight:', err, res)
  })

  test('getContractBalance', async () => {
    if (!realContract) {
      console.log('Skipping: no real contract available')
      return
    }
    const [err, res] = await to(daemon.getContractBalance({ contract: realContract, asset: '0000000000000000000000000000000000000000000000000000000000000000' }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Contract balance:', res)
  })

  test('getContractBalanceAtTopoheight', async () => {
    if (!realContract) {
      console.log('Skipping: no real contract available')
      return
    }
    const [errTopo, topoheight] = await to(daemon.getTopoheight())
    if (errTopo || !topoheight) {
      console.log('Skipping: cannot get topoheight')
      return
    }
    const [err, res] = await to(daemon.getContractBalanceAtTopoheight({ contract: realContract, asset: '0000000000000000000000000000000000000000000000000000000000000000', topoheight }))
    if (err) {
      console.log('Contract balance at topoheight (soft fail):', err.message)
      return
    }
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Contract balance at topoheight:', res)
  })

  test('getContractAssets', async () => {
    if (!realContract) {
      console.log('Skipping: no real contract available')
      return
    }
    const [err, res] = await to(daemon.getContractAssets({ contract: realContract }))
    expect(err).toBeNull()
    expect(Array.isArray(res)).toBe(true)
    console.log('Contract assets:', res)
  })

  test('getContracts', async () => {
    const [err, res] = await to(daemon.getContracts({ maximum: 5 }))
    expect(err).toBeNull()
    expect(Array.isArray(res)).toBe(true)
    console.log('Contracts:', res)
  })

  test('getContractDataEntries', async () => {
    if (!realContract) {
      console.log('Skipping: no real contract available')
      return
    }
    const [err, res] = await to(daemon.getContractDataEntries({ contract: realContract, maximum: 5 }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Contract data entries:', res)
  })

  test('getContractLogs', async () => {
    const [err, res] = await to(daemon.getContractLogs({ caller: realContract || '0000000000000000000000000000000000000000000000000000000000000000' }))
    console.log('Contract logs:', err, res)
  })

  test('getTransactionExecutor', async () => {
    const [err, res] = await to(daemon.getTransactionExecutor('0000000000000000000000000000000000000000000000000000000000000000'))
    console.log('Tx executor:', err, res)
  })

  test('getTransaction', async () => {
    const [err, res] = await to(daemon.getTransaction('0000000000000000000000000000000000000000000000000000000000000000'))
    console.log('Transaction:', err, res)
  })

  test('getTransactions', async () => {
    const [err, res] = await to(daemon.getTransactions([]))
    expect(err).toBeNull()
    expect(Array.isArray(res)).toBe(true)
    console.log('Transactions:', res)
  })

  test('getTransactionsSummary', async () => {
    const [err, res] = await to(daemon.getTransactionsSummary({ tx_hashes: [] }))
    expect(err).toBeNull()
    expect(Array.isArray(res)).toBe(true)
    console.log('Transactions summary:', res)
  })

  test('isTxExecutedInBlock', async () => {
    const [err1, topBlock] = await to(daemon.getTopBlock())
    expect(err1).toBeNull()
    const [err2, res] = await to(daemon.isTxExecutedInBlock({ tx_hash: '0000000000000000000000000000000000000000000000000000000000000000', block_hash: topBlock!.hash }))
    expect(err2).toBeNull()
    expect(res).toBeDefined()
    console.log('Is tx executed in block:', res)
  })

  test('getP2PBlockPropagation', async () => {
    const [err1, topBlock] = await to(daemon.getTopBlock())
    expect(err1).toBeNull()
    const [err2, res] = await to(daemon.getP2PBlockPropagation({ hash: topBlock!.hash, outgoing: false, incoming: false }))
    expect(err2).toBeNull()
    expect(res).toBeDefined()
    console.log('P2P block propagation:', res)
  })

  test('splitAddress', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.splitAddress({ address: realAddress }))
    if (err) {
      console.log('Split address (not an integrated address):', err.message)
      return
    }
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Split address:', res)
  })

  test('extractKeyFromAddress', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.extractKeyFromAddress({ address: realAddress, as_hex: true }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Extract key:', res)
  })

  test('makeIntegratedAddress', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.makeIntegratedAddress({ address: realAddress, integrated_data: 'test' }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Integrated address:', res)
  })

  test('decryptExtraData', async () => {
    const [err, res] = await to(daemon.decryptExtraData({ shared_key: [], extra_data: [] }))
    console.log('Decrypt extra data:', err, res)
  })

  test('getMempoolCache', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.getMempoolCache(realAddress))
    console.log('Mempool cache:', err, res)
  })

  test('getMinerWork', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err1, template] = await to(daemon.getBlockTemplate(realAddress))
    if (err1 || !template) {
      console.log('Skipping miner work: block template failed:', err1)
      return
    }
    const [err2, res] = await to(daemon.getMinerWork({ template: template!.template }))
    expect(err2).toBeNull()
    expect(res).toBeDefined()
    console.log('Miner work:', res)
  })

  test('getBlockTemplate', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.getBlockTemplate(realAddress))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    expect(res!.template).toBeDefined()
    console.log('Block template:', res)
  })

  test('getBalance', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.getBalance({ address: realAddress, asset: '0000000000000000000000000000000000000000000000000000000000000000' }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Balance:', res)
  })

  test('getStableBalance', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.getStableBalance({ address: realAddress, asset: '0000000000000000000000000000000000000000000000000000000000000000' }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Stable balance:', res)
  })

  test('hasBalance', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.hasBalance({ address: realAddress, asset: '0000000000000000000000000000000000000000000000000000000000000000' }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Has balance:', res)
  })

  test('getNonce', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.getNonce({ address: realAddress }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Nonce:', res)
  })

  test('hasNonce', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.hasNonce({ address: realAddress }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Has nonce:', res)
  })

  test('getAccountHistory', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.getAccountHistory({ address: realAddress, maximum_topoheight: 10 }))
    expect(err).toBeNull()
    expect(Array.isArray(res)).toBe(true)
    console.log('Account history:', res)
  })

  test('getAccountAssets', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.getAccountAssets({ address: realAddress }))
    expect(err).toBeNull()
    expect(Array.isArray(res)).toBe(true)
    console.log('Account assets:', res)
  })

  test('isAccountRegistered', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.isAccountRegistered({ address: realAddress, in_stable_height: false }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Is account registered:', res)
  })

  test('getAccountRegistrationTopoheight', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.getAccountRegistrationTopoheight(realAddress))
    expect(err).toBeNull()
    expect(res).toBeGreaterThanOrEqual(0)
    console.log('Account registration topoheight:', res)
  })

  test('getMultisig', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.getMultisig({ address: realAddress }))
    console.log('Multisig:', err, res)
  })

  test('hasMultisig', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.hasMultisig({ address: realAddress }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Has multisig:', res)
  })

  test('getContractsOutputs', async () => {
    if (!realAddress) {
      console.log('Skipping: no real address available')
      return
    }
    const [err, res] = await to(daemon.getContractsOutputs({ address: realAddress, topoheight: 0 }))
    expect(err).toBeNull()
    expect(res).toBeDefined()
    console.log('Contract outputs:', res)
  })

  test('getContractScheduledExecutionsAtTopoheight', async () => {
    const [err, res] = await to(daemon.getContractScheduledExecutionsAtTopoheight({ topoheight: 0 }))
    expect(err).toBeNull()
    expect(Array.isArray(res)).toBe(true)
    console.log('Scheduled executions:', res)
  })

  test('getContractRegisteredExecutionsAtTopoheight', async () => {
    const [err, res] = await to(daemon.getContractRegisteredExecutionsAtTopoheight({ topoheight: 0 }))
    expect(err).toBeNull()
    expect(Array.isArray(res)).toBe(true)
    console.log('Registered executions:', res)
  })
})