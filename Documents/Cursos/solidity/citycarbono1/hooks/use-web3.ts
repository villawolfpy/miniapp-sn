"use client"

import { useState, useEffect, useCallback } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther, formatEther } from "viem"
import { config } from "@/lib/config"
import { useToast } from "@/hooks/use-toast"

// Contract ABIs
import { carbonoABI } from "@/lib/abi/carbono"
import { experienciaABI } from "@/lib/abi/experiencia"

export function useWeb3() {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { writeContract, data: hash, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Read Carbono token balance
  const { data: carbonoBalance = 0n, refetch: refetchCarbono } = useReadContract({
    address: config.carbonoAddress,
    abi: carbonoABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!config.carbonoAddress },
  })

  // Read Experiencia NFT balance
  const { data: experienciaBalance = 0n, refetch: refetchExperiencia } = useReadContract({
    address: config.experienciaAddress,
    abi: experienciaABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!config.experienciaAddress },
  })

  // Read token price
  const { data: tokenPrice = parseEther("0.001") } = useReadContract({
    address: config.carbonoAddress,
    abi: carbonoABI,
    functionName: "priceWeiPerToken",
    query: { enabled: !!config.carbonoAddress },
  })

  // Read mint cost for NFTs
  const { data: mintCost = parseEther("10") } = useReadContract({
    address: config.experienciaAddress,
    abi: experienciaABI,
    functionName: "priceInCBO",
    query: { enabled: !!config.experienciaAddress },
  })

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Éxito",
        description: "Transacción confirmada exitosamente",
      })
      // Refetch balances
      refetchCarbono()
      refetchExperiencia()
      setIsLoading(false)
    }
  }, [isConfirmed, toast, refetchCarbono, refetchExperiencia])

  // Handle transaction errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Error en la transacción",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }, [error, toast])

  // Buy Carbono tokens
  const buyCarbono = useCallback(
    async (amount: string) => {
      if (!isConnected || !address) {
        toast({
          title: "Error",
          description: "Por favor conecta tu wallet",
          variant: "destructive",
        })
        return
      }

      if (!config.carbonoAddress) {
        toast({
          title: "Error",
          description: "Dirección del contrato Carbono no configurada",
          variant: "destructive",
        })
        return
      }

      setIsLoading(true)
      try {
        const tokenAmount = parseEther(amount)
        const totalCost = (tokenAmount * tokenPrice) / parseEther("1")

        writeContract({
          address: config.carbonoAddress,
          abi: carbonoABI,
          functionName: "buyCarbono",
          args: [],
          value: totalCost,
        })

        toast({
          title: "Transacción enviada",
          description: "Esperando confirmación...",
        })
      } catch (error: any) {
        console.error("Error buying tokens:", error)
        toast({
          title: "Error",
          description: error.message || "Error al comprar tokens",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    },
    [isConnected, address, tokenPrice, writeContract, toast],
  )

  // Mint Experiencia NFT
  const mintExperiencia = useCallback(async () => {
    if (!isConnected || !address) {
      toast({
        title: "Error",
        description: "Por favor conecta tu wallet",
        variant: "destructive",
      })
      return
    }

    if (!config.experienciaAddress) {
      toast({
        title: "Error",
        description: "Dirección del contrato Experiencia no configurada",
        variant: "destructive",
      })
      return
    }

    // Check if user has enough Carbono tokens
    if (carbonoBalance < mintCost) {
      toast({
        title: "Error",
        description: `Necesitas ${formatEther(mintCost)} tokens CBO para mintear`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      writeContract({
        address: config.experienciaAddress,
        abi: experienciaABI,
        functionName: "mint",
        args: [1n],
      })

      toast({
        title: "Transacción enviada",
        description: "Esperando confirmación...",
      })
    } catch (error: any) {
      console.error("Error minting NFT:", error)
      toast({
        title: "Error",
        description: error.message || "Error al mintear NFT",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }, [isConnected, address, carbonoBalance, mintCost, writeContract, toast])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return {
    isConnected,
    address,
    isLoading: isLoading || isConfirming,
    carbonoBalance: formatEther(carbonoBalance),
    experienciaBalance: experienciaBalance.toString(),
    tokenPrice: formatEther(tokenPrice),
    mintCost: formatEther(mintCost),
    buyCarbono,
    mintExperiencia,
    formatAddress: address ? formatAddress(address) : "",
  }
}
