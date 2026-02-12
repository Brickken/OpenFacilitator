/**
 * EIP-2612 (ERC20 Permit) implementation
 *
 * This is used for gasless ERC20 token transfers where the payer signs a permit
 * and the facilitator submits transferFrom after permit.
 */
import {
  createPublicClient,
  createWalletClient,
  http,
  type Address,
  type Hex,
  type Chain,
  encodeFunctionData,
  defineChain,
  parseSignature,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import {
  avalanche,
  avalancheFuji,
  base,
  baseSepolia,
  mainnet,
  polygon,
  polygonAmoy,
  sepolia,
} from 'viem/chains';

// Custom chain definitions (same as erc3009.ts)
const iotex = defineChain({
  id: 4689,
  name: 'IoTeX',
  nativeCurrency: { name: 'IOTX', symbol: 'IOTX', decimals: 18 },
  rpcUrls: { default: { http: ['https://babel-api.mainnet.iotex.io'] } },
  blockExplorers: { default: { name: 'IoTeXScan', url: 'https://iotexscan.io' } },
});

const peaq = defineChain({
  id: 3338,
  name: 'Peaq',
  nativeCurrency: { name: 'PEAQ', symbol: 'PEAQ', decimals: 18 },
  rpcUrls: { default: { http: ['https://peaq.api.onfinality.io/public'] } },
  blockExplorers: { default: { name: 'Subscan', url: 'https://peaq.subscan.io' } },
});

const sei = defineChain({
  id: 1329,
  name: 'Sei',
  nativeCurrency: { name: 'SEI', symbol: 'SEI', decimals: 18 },
  rpcUrls: { default: { http: ['https://evm-rpc.sei-apis.com'] } },
  blockExplorers: { default: { name: 'SeiTrace', url: 'https://seitrace.com' } },
});

const seiTestnet = defineChain({
  id: 1328,
  name: 'Sei Testnet',
  nativeCurrency: { name: 'SEI', symbol: 'SEI', decimals: 18 },
  rpcUrls: { default: { http: ['https://evm-rpc-testnet.sei-apis.com'] } },
  blockExplorers: { default: { name: 'SeiTrace Testnet', url: 'https://testnet.seitrace.com' } },
  testnet: true,
});

const xlayer = defineChain({
  id: 196,
  name: 'XLayer',
  nativeCurrency: { name: 'OKB', symbol: 'OKB', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.xlayer.tech'] } },
  blockExplorers: { default: { name: 'OKX Explorer', url: 'https://www.okx.com/explorer/xlayer' } },
});

const xlayerTestnet = defineChain({
  id: 195,
  name: 'XLayer Testnet',
  nativeCurrency: { name: 'OKB', symbol: 'OKB', decimals: 18 },
  rpcUrls: { default: { http: ['https://testrpc.xlayer.tech'] } },
  blockExplorers: { default: { name: 'OKX Explorer', url: 'https://www.okx.com/explorer/xlayer-test' } },
  testnet: true,
});

/**
 * Chain configuration (same as erc3009.ts)
 */
const chainConfigs: Record<number, { chain: Chain; rpcUrl: string }> = {
  43114: { chain: avalanche, rpcUrl: process.env.AVALANCHE_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc' },
  8453: { chain: base, rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org' },
  1: { chain: mainnet, rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com' },
  4689: { chain: iotex, rpcUrl: process.env.IOTEX_RPC_URL || 'https://babel-api.mainnet.iotex.io' },
  3338: { chain: peaq, rpcUrl: process.env.PEAQ_RPC_URL || 'https://peaq.api.onfinality.io/public' },
  137: { chain: polygon, rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com' },
  1329: { chain: sei, rpcUrl: process.env.SEI_RPC_URL || 'https://evm-rpc.sei-apis.com' },
  196: { chain: xlayer, rpcUrl: process.env.XLAYER_RPC_URL || 'https://rpc.xlayer.tech' },
  43113: { chain: avalancheFuji, rpcUrl: process.env.AVALANCHE_FUJI_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc' },
  84532: { chain: baseSepolia, rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org' },
  80002: { chain: polygonAmoy, rpcUrl: process.env.POLYGON_AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology' },
  1328: { chain: seiTestnet, rpcUrl: process.env.SEI_TESTNET_RPC_URL || 'https://evm-rpc-testnet.sei-apis.com' },
  11155111: { chain: sepolia, rpcUrl: process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org' },
  195: { chain: xlayerTestnet, rpcUrl: process.env.XLAYER_TESTNET_RPC_URL || 'https://testrpc.xlayer.tech' },
};

/**
 * ERC20 Permit ABI (EIP-2612)
 */
const PERMIT_ABI = [
  {
    name: 'permit',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
      { name: 'v', type: 'uint8' },
      { name: 'r', type: 'bytes32' },
      { name: 's', type: 'bytes32' },
    ],
    outputs: [],
  },
] as const;

/**
 * ERC20 transferFrom ABI
 */
const TRANSFER_FROM_ABI = [
  {
    name: 'transferFrom',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

export interface PermitAuthorization {
  owner: Address;
  spender: Address;
  value: string;
  deadline: number;
}

export interface PermitSettlementParams {
  chainId: number;
  tokenAddress: Address;
  authorization: PermitAuthorization;
  signature: Hex;
  facilitatorPrivateKey: Hex;
  recipient: Address; // Where tokens should be sent
}

export interface PermitSettlementResult {
  success: boolean;
  transactionHash?: Hex;
  errorMessage?: string;
  gasUsed?: bigint;
}

/**
 * Execute an EIP-2612 Permit + transferFrom transaction
 */
export async function executePermitSettlement(
  params: PermitSettlementParams
): Promise<PermitSettlementResult> {
  const { chainId, tokenAddress, authorization, signature, facilitatorPrivateKey, recipient } = params;

  console.log('[PermitSettlement] Starting settlement:', {
    chainId,
    tokenAddress,
    owner: authorization.owner,
    spender: authorization.spender,
    recipient,
    value: authorization.value,
    deadline: authorization.deadline,
  });

  // Get chain config
  const config = chainConfigs[chainId];
  if (!config) {
    return {
      success: false,
      errorMessage: `Unsupported chain ID: ${chainId}`,
    };
  }

  try {
    // Create account from private key
    const account = privateKeyToAccount(facilitatorPrivateKey);
    console.log('[PermitSettlement] Facilitator wallet:', account.address);

    // Verify spender is facilitator
    if (authorization.spender.toLowerCase() !== account.address.toLowerCase()) {
      return {
        success: false,
        errorMessage: `Permit spender (${authorization.spender}) does not match facilitator (${account.address})`,
      };
    }

    // Create clients
    const publicClient = createPublicClient({
      chain: config.chain,
      transport: http(config.rpcUrl),
      pollingInterval: 2_000,
    });

    const walletClient = createWalletClient({
      account,
      chain: config.chain,
      transport: http(config.rpcUrl),
    });

    // Parse signature into v, r, s
    console.log('[ERC3009Settlement] Raw signature:', signature);
    console.log('[ERC3009Settlement] Signature length:', signature.length);
    const v = parseInt(signature.slice(130, 132), 16);
    const r = `0x${signature.slice(2, 66)}` as Hex;
    const s = `0x${signature.slice(66, 130)}` as Hex;

    // Get current gas prices - use EIP-1559 for Base and other L2s
    // Legacy gasPrice transactions can be deprioritized or dropped on OP Stack chains
    const [baseFee, priorityFee] = await Promise.all([
      publicClient.getGasPrice(),
      publicClient.estimateMaxPriorityFeePerGas().catch(() => 1_000_000n), // fallback 1 gwei
    ]);
    // Add 20% buffer to base fee and 50% buffer to priority fee for reliability
    const maxPriorityFeePerGas = (priorityFee * 150n) / 100n;
    const maxFeePerGas = (baseFee * 120n) / 100n + maxPriorityFeePerGas;
    console.log('[ERC3009Settlement] Gas prices: baseFee=%s, priorityFee=%s, maxFee=%s',
      baseFee.toString(), maxPriorityFeePerGas.toString(), maxFeePerGas.toString());

    // Check facilitator ETH balance
    const ethBalance = await publicClient.getBalance({ address: account.address });
    console.log('[ERC3009Settlement] Facilitator ETH balance:', ethBalance.toString());

    if (ethBalance < 100000n * maxFeePerGas) {
      console.error('[ERC3009Settlement] Insufficient ETH for gas!');
      return {
        success: false,
        errorMessage: 'Facilitator has insufficient ETH for gas',
      };
    }

    // Step 1: Execute permit
    console.log('[PermitSettlement] Executing permit...');
    const permitData = encodeFunctionData({
      abi: PERMIT_ABI,
      functionName: 'permit',
      args: [
        authorization.owner,
        authorization.spender,
        BigInt(authorization.value),
        BigInt(authorization.deadline),
        v,
        r,
        s,
      ],
    });

    const permitHash = await walletClient.sendTransaction({
      to: tokenAddress,
      data: permitData,
      gas: 80000n,
      maxFeePerGas,
      maxPriorityFeePerGas,
    });

    console.log('[PermitSettlement] Permit transaction sent:', permitHash);

    const permitReceipt = await publicClient.waitForTransactionReceipt({
      hash: permitHash,
      confirmations: 1,
      timeout: 120_000,
    });

    if (permitReceipt.status !== 'success') {
      console.error('[PermitSettlement] Permit transaction reverted!');
      return {
        success: false,
        transactionHash: permitHash,
        errorMessage: 'Permit transaction reverted',
      };
    }

    console.log('[PermitSettlement] Permit confirmed, executing transferFrom...');

    // Step 2: Execute transferFrom
    const transferData = encodeFunctionData({
      abi: TRANSFER_FROM_ABI,
      functionName: 'transferFrom',
      args: [authorization.owner, recipient, BigInt(authorization.value)],
    });

    const transferHash = await walletClient.sendTransaction({
      to: tokenAddress,
      data: transferData,
      gas: 80000n,
      maxFeePerGas,
      maxPriorityFeePerGas,
    });

    console.log('[PermitSettlement] TransferFrom transaction sent:', transferHash);

    const transferReceipt = await publicClient.waitForTransactionReceipt({
      hash: transferHash,
      confirmations: 1,
      timeout: 120_000,
    });

    if (transferReceipt.status === 'success') {
      console.log('[PermitSettlement] SUCCESS!');
      return {
        success: true,
        transactionHash: transferHash,
        gasUsed: permitReceipt.gasUsed + transferReceipt.gasUsed,
      };
    } else {
      console.error('[PermitSettlement] TransferFrom reverted!');
      return {
        success: false,
        transactionHash: transferHash,
        errorMessage: 'TransferFrom transaction reverted',
      };
    }
  } catch (error) {
    console.error('[PermitSettlement] Error:', error);
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error during settlement',
    };
  }
}