"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { sepolia, mainnet } from "wagmi/chains"
import { http } from "viem"
import { config } from "./config"

export const wagmiConfig = getDefaultConfig({
  appName: "Carbono & Experiencia",
  projectId: "2f05a7cac472eca42db5a3912f4e8c7c",
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(config.rpcUrl || "https://rpc.sepolia.org"),
    [mainnet.id]: http(),
  },
  ssr: false,
})

export const targetChain = config.chainId === 1 ? mainnet : sepolia
