"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/components/ui/toast"

interface WalletState {
  address: string | null
  isConnected: boolean
  chainId: number | null
  isLoading: boolean
}

export function useWallet() {
  const { showToast } = useToast()

  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    isLoading: false,
  })

  const checkConnection = useCallback(async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        const chainId = await window.ethereum.request({ method: "eth_chainId" })

        if (accounts.length > 0) {
          setWallet({
            address: accounts[0],
            isConnected: true,
            chainId: Number.parseInt(chainId, 16),
            isLoading: false,
          })
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }
  }, [])

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      showToast("MetaMask no está instalado", "error")
      return
    }

    setWallet((prev) => ({ ...prev, isLoading: true }))

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      const chainId = await window.ethereum.request({ method: "eth_chainId" })

      setWallet({
        address: accounts[0],
        isConnected: true,
        chainId: Number.parseInt(chainId, 16),
        isLoading: false,
      })

      showToast("Wallet conectada exitosamente", "success")
    } catch (error: any) {
      setWallet((prev) => ({ ...prev, isLoading: false }))
      if (error.code === 4001) {
        showToast("Conexión rechazada por el usuario", "error")
      } else {
        showToast("Error al conectar wallet", "error")
      }
    }
  }, [showToast])

  const disconnect = useCallback(() => {
    setWallet({
      address: null,
      isConnected: false,
      chainId: null,
      isLoading: false,
    })
    showToast("Wallet desconectada", "success")
  }, [showToast])

  const switchNetwork = useCallback(
    async (targetChainId: number) => {
      if (typeof window === "undefined" || !window.ethereum) {
        showToast("MetaMask no está disponible", "error")
        return false
      }

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        })
        return true
      } catch (error: any) {
        if (error.code === 4902) {
          showToast("Red no agregada a MetaMask", "error")
        } else {
          showToast("Error al cambiar de red", "error")
        }
        return false
      }
    },
    [showToast],
  )

  useEffect(() => {
    checkConnection()

    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect()
        } else {
          setWallet((prev) => ({ ...prev, address: accounts[0] }))
        }
      }

      const handleChainChanged = (chainId: string) => {
        setWallet((prev) => ({ ...prev, chainId: Number.parseInt(chainId, 16) }))
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum?.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [checkConnection, disconnect])

  return {
    ...wallet,
    connect,
    disconnect,
    switchNetwork,
  }
}
