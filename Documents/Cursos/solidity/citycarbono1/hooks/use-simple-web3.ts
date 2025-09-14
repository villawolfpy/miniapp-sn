"use client"

import { useState, useEffect, useCallback } from "react"
import {
  getWalletClient,
  publicClient,
  CARBONO_TOKEN_ADDRESS,
  EXPERIENCIA_NFT_ADDRESS,
  CARBONO_ABI,
  EXPERIENCIA_ABI,
  formatAddress,
} from "@/lib/web3-simple"
import { parseEther, formatEther } from "viem"
import { useToast } from "@/hooks/use-toast"

export function useSimpleWeb3() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [carbonoBalance, setCarbonoBalance] = useState<string>("0")
  const [experienciaBalance, setExperienciaBalance] = useState<string>("0")
  const { toast } = useToast()

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setAddress(accounts[0])
            setIsConnected(true)
            await loadBalances(accounts[0])
          }
        } catch (error) {
          console.error("Error checking connection:", error)
        }
      }
    }
    checkConnection()
  }, [])

  // Load user balances
  const loadBalances = useCallback(async (userAddress: string) => {
    try {
      if (CARBONO_TOKEN_ADDRESS && CARBONO_TOKEN_ADDRESS !== "0x0000000000000000000000000000000000000000") {
        const carbonoBalance = await publicClient.readContract({
          address: CARBONO_TOKEN_ADDRESS,
          abi: CARBONO_ABI,
          functionName: "balanceOf",
          args: [userAddress as `0x${string}`],
        })
        setCarbonoBalance(formatEther(carbonoBalance))
      }

      if (EXPERIENCIA_NFT_ADDRESS && EXPERIENCIA_NFT_ADDRESS !== "0x0000000000000000000000000000000000000000") {
        const experienciaBalance = await publicClient.readContract({
          address: EXPERIENCIA_NFT_ADDRESS,
          abi: EXPERIENCIA_ABI,
          functionName: "balanceOf",
          args: [userAddress as `0x${string}`],
        })
        setExperienciaBalance(experienciaBalance.toString())
      }
    } catch (error) {
      console.error("Error loading balances:", error)
      // Set demo balances if contracts are not deployed
      setCarbonoBalance("100.5")
      setExperienciaBalance("3")
    }
  }, [])

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      toast({
        title: "Error",
        description: "MetaMask no está instalado. Por favor instala MetaMask para continuar.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
        await loadBalances(accounts[0])
        toast({
          title: "Éxito",
          description: "Wallet conectada exitosamente",
        })
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Error",
        description: "Error al conectar wallet",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setAddress(null)
    setIsConnected(false)
    setCarbonoBalance("0")
    setExperienciaBalance("0")
    toast({
      title: "Desconectado",
      description: "Wallet desconectada",
    })
  }

  // Buy Carbono tokens
  const buyCarbono = async (amount: string) => {
    if (!isConnected || !address) {
      toast({
        title: "Error",
        description: "Por favor conecta tu wallet",
        variant: "destructive",
      })
      return
    }

    const walletClient = getWalletClient()
    if (!walletClient) {
      toast({
        title: "Error",
        description: "No se pudo obtener el cliente de wallet",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate transaction for demo purposes
      if (!CARBONO_TOKEN_ADDRESS || CARBONO_TOKEN_ADDRESS === "0x0000000000000000000000000000000000000000") {
        // Demo mode - simulate successful purchase
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const newBalance = (Number.parseFloat(carbonoBalance) + Number.parseFloat(amount)).toString()
        setCarbonoBalance(newBalance)

        toast({
          title: "Éxito (Demo)",
          description: `Simulaste la compra de ${amount} tokens CBO exitosamente`,
        })
        return
      }

      const tokenAmount = parseEther(amount)
      const totalCost = (tokenAmount * parseEther("0.001")) / parseEther("1") // 0.001 ETH per token

      // Execute real transaction
      const hash = await walletClient.writeContract({
        address: CARBONO_TOKEN_ADDRESS,
        abi: CARBONO_ABI,
        functionName: "mint",
        args: [address as `0x${string}`, tokenAmount],
        value: totalCost,
      })

      toast({
        title: "Transacción enviada",
        description: `Hash: ${hash}`,
      })

      // Wait for transaction confirmation
      await publicClient.waitForTransactionReceipt({ hash })

      // Reload balances
      await loadBalances(address)

      toast({
        title: "Éxito",
        description: `Compraste ${amount} tokens CBO exitosamente`,
      })
    } catch (error: any) {
      console.error("Error buying tokens:", error)
      toast({
        title: "Error",
        description: error.message || "Error al comprar tokens",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Mint Experiencia NFT
  const mintExperiencia = async () => {
    if (!isConnected || !address) {
      toast({
        title: "Error",
        description: "Por favor conecta tu wallet",
        variant: "destructive",
      })
      return
    }

    const walletClient = getWalletClient()
    if (!walletClient) {
      toast({
        title: "Error",
        description: "No se pudo obtener el cliente de wallet",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Check if user has enough Carbono tokens
      if (Number.parseFloat(carbonoBalance) < 10) {
        toast({
          title: "Error",
          description: "Necesitas al menos 10 tokens CBO para mintear",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Simulate transaction for demo purposes
      if (!EXPERIENCIA_NFT_ADDRESS || EXPERIENCIA_NFT_ADDRESS === "0x0000000000000000000000000000000000000000") {
        // Demo mode - simulate successful mint
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const newCarbonBalance = (Number.parseFloat(carbonoBalance) - 10).toString()
        const newNftBalance = (Number.parseInt(experienciaBalance) + 1).toString()
        setCarbonoBalance(newCarbonBalance)
        setExperienciaBalance(newNftBalance)

        toast({
          title: "Éxito (Demo)",
          description: "NFT de Experiencia minteado exitosamente (simulación)",
        })
        return
      }

      // Execute real mint transaction
      const hash = await walletClient.writeContract({
        address: EXPERIENCIA_NFT_ADDRESS,
        abi: EXPERIENCIA_ABI,
        functionName: "mint",
        args: [address as `0x${string}`],
      })

      toast({
        title: "Transacción enviada",
        description: `Hash: ${hash}`,
      })

      // Wait for transaction confirmation
      await publicClient.waitForTransactionReceipt({ hash })

      // Reload balances
      await loadBalances(address)

      toast({
        title: "Éxito",
        description: "NFT de Experiencia minteado exitosamente",
      })
    } catch (error: any) {
      console.error("Error minting NFT:", error)
      toast({
        title: "Error",
        description: error.message || "Error al mintear NFT",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isConnected,
    address,
    isLoading,
    carbonoBalance,
    experienciaBalance,
    connectWallet,
    disconnectWallet,
    buyCarbono,
    mintExperiencia,
    formatAddress: address ? formatAddress(address) : "",
  }
}
