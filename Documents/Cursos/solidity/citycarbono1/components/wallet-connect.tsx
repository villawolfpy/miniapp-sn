"use client"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useWallet } from "@/hooks/use-wallet"

export function WalletConnect() {
  const { address, isConnected, isLoading, connect, disconnect } = useWallet()

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-700">{formatAddress(address)}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={disconnect}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
        >
          Desconectar
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={connect} disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white">
      <Icons.wallet className="w-4 h-4 mr-2" />
      {isLoading ? "Conectando..." : "Conectar Wallet"}
    </Button>
  )
}
