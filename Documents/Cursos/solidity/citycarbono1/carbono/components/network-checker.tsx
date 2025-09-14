"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Icons } from "@/components/icons"
import { config } from "@/lib/config"
import { useToast } from "@/components/ui/toast"

declare global {
  interface Window {
    ethereum?: any
  }
}

export function NetworkChecker() {
  const { showToast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [currentChainId, setCurrentChainId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkConnection()

    // Listen for network changes
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("chainChanged", (chainId: string) => {
        setCurrentChainId(Number.parseInt(chainId, 16))
      })

      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setIsConnected(accounts.length > 0)
        if (accounts.length > 0) {
          getCurrentNetwork()
        }
      })
    }

    return () => {
      if (typeof window !== "undefined" && window.ethereum) {
        window.ethereum.removeAllListeners("chainChanged")
        window.ethereum.removeAllListeners("accountsChanged")
      }
    }
  }, [])

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        })
        setIsConnected(accounts.length > 0)

        if (accounts.length > 0) {
          getCurrentNetwork()
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const getCurrentNetwork = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        })
        setCurrentChainId(Number.parseInt(chainId, 16))
      } catch (error) {
        console.error("Error getting network:", error)
      }
    }
  }

  const switchNetwork = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      showToast("MetaMask no detectado", "error")
      return
    }

    setIsLoading(true)
    try {
      const chainIdHex = `0x${config.chainId.toString(16)}`

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      })

      showToast("Red cambiada exitosamente", "success")
    } catch (error: any) {
      console.error("Error switching network:", error)

      // If the network doesn't exist, try to add it (for testnets)
      if (error.code === 4902 && config.chainId === 11155111) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia Testnet",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.sepolia.org"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          })
          showToast("Red agregada y cambiada exitosamente", "success")
        } catch (addError) {
          showToast("Error al agregar la red", "error")
        }
      } else {
        showToast("Error al cambiar de red", "error")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected || currentChainId === config.chainId) {
    return null
  }

  const networkName = config.chainId === 1 ? "Ethereum Mainnet" : "Sepolia Testnet"

  return (
    <Alert className="mb-6 border-destructive">
      <Icons.alertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Red incorrecta detectada. Por favor cambia a {networkName} para usar esta aplicación.</span>
        <Button variant="destructive" size="sm" onClick={switchNetwork} disabled={isLoading}>
          {isLoading ? "Cambiando..." : "Cambiar Red"}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
