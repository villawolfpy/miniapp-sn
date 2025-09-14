import { createPublicClient, createWalletClient, custom, http } from "viem"
import { sepolia, mainnet } from "viem/chains"

// Get chain configuration from environment variables
const chainId = process.env.NEXT_PUBLIC_CHAIN_ID ? Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) : 11155111
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia.infura.io/v3/your-key"

// Chain configuration
const chain = chainId === 1 ? mainnet : sepolia

// Contract addresses from environment variables
export const CARBONO_TOKEN_ADDRESS =
  (process.env.NEXT_PUBLIC_CARBONO as `0x${string}`) || "0x0000000000000000000000000000000000000000"
export const EXPERIENCIA_NFT_ADDRESS =
  (process.env.NEXT_PUBLIC_EXPERIENCIA as `0x${string}`) || "0x0000000000000000000000000000000000000000"

// Create public client for reading blockchain data
export const publicClient = createPublicClient({
  chain,
  transport: http(rpcUrl),
})

// Create wallet client for transactions (only available in browser)
export const getWalletClient = () => {
  if (typeof window === "undefined" || !window.ethereum) {
    return null
  }

  return createWalletClient({
    chain,
    transport: custom(window.ethereum),
  })
}

// Contract ABIs
export const CARBONO_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const

export const EXPERIENCIA_ABI = [
  {
    inputs: [{ name: "to", type: "address" }],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const

// Utility functions
export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
