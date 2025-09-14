"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatCard } from "@/components/stat-card"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/toast"
import { useWallet } from "@/hooks/use-wallet"

export function BuyCarbono() {
  const { showToast } = useToast()
  const [quantity, setQuantity] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [contractData, setContractData] = useState({
    price: "0.001", // Mock price in ETH
    balance: "0",
    totalSupply: "1000000",
  })

  const { address, isConnected } = useWallet()

  useEffect(() => {
    if (isConnected && address) {
      loadContractData(address)
    }
  }, [isConnected, address])

  const loadContractData = async (address: string) => {
    try {
      // Simulate loading user's CBO balance
      setContractData((prev) => ({
        ...prev,
        balance: "150.5", // Mock balance
      }))
    } catch (error) {
      console.error("Error loading contract data:", error)
    }
  }

  const quantityNum = Number.parseFloat(quantity) || 0
  const ethRequired = quantityNum * Number.parseFloat(contractData.price)

  const handleBuy = async () => {
    if (!isConnected || !address || quantityNum <= 0) {
      showToast("Por favor conecta tu wallet e ingresa una cantidad válida", "error")
      return
    }

    setIsLoading(true)
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const transactionParameters = {
          to: process.env.NEXT_PUBLIC_CARBONO, // Contract address
          from: address,
          value: (ethRequired * 1e18).toString(16), // Convert to wei and hex
          data: "0x", // Contract function call data would go here
        }

        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        })

        showToast(`¡Transacción enviada! Hash: ${txHash.slice(0, 10)}...`, "success")

        // Update balance after successful transaction
        setTimeout(() => {
          setContractData((prev) => ({
            ...prev,
            balance: (Number.parseFloat(prev.balance) + quantityNum).toString(),
          }))
          setQuantity("")
        }, 2000)
      }
    } catch (error: any) {
      console.error("Transaction error:", error)
      showToast(`Transacción fallida: ${error.message || "Error desconocido"}`, "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Precio CBO"
          value={`${contractData.price} ETH`}
          icon={Icons.dollarSign}
          description="Precio por token CBO"
          loading={false}
        />
        <StatCard
          title="Tu Balance CBO"
          value={contractData.balance}
          icon={Icons.wallet}
          description="Tokens CBO que posees"
          loading={false}
        />
        <StatCard
          title="Suministro Total CBO"
          value={contractData.totalSupply}
          icon={Icons.coins}
          description="Total de tokens minteados"
          loading={false}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.coins className="h-5 w-5" />
            Comprar Tokens CBO
          </CardTitle>
          <CardDescription>
            Compra tokens Carbono (CBO) con ETH. Estos tokens pueden usarse para mintear NFTs de Experiencia.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad (CBO)</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Ingresa la cantidad de CBO a comprar"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          {quantityNum > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ETH Requerido:</span>
                <span className="font-mono font-medium">{ethRequired.toFixed(6)} ETH</span>
              </div>
            </div>
          )}

          <Button
            onClick={handleBuy}
            disabled={!isConnected || !quantityNum || quantityNum <= 0 || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Procesando..." : `Comprar ${quantityNum || 0} CBO`}
          </Button>

          {!isConnected && (
            <div className="text-center text-sm text-muted-foreground">
              Por favor conecta tu wallet para comprar tokens CBO
            </div>
          )}

          <div className="text-sm text-center text-muted-foreground">
            <p className="flex items-center justify-center gap-1">
              Contrato: {process.env.NEXT_PUBLIC_CARBONO}
              <Icons.externalLink className="h-3 w-3" />
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
