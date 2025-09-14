"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatCard } from "@/components/stat-card"
import { ImageIcon, Coins, Package, Wallet, ExternalLink } from "lucide-react"
import { toast } from "sonner"

declare global {
  interface Window {
    ethereum?: any
  }
}

export function MintExperiencia() {
  const [quantity, setQuantity] = useState("")
  const [account, setAccount] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [needsApproval, setNeedsApproval] = useState(false)
  const [contractData, setContractData] = useState({
    nftPrice: "100", // Price in CBO tokens
    nftBalance: "0",
    totalSupply: "150",
    maxSupply: "10000",
    cboBalance: "250.5",
    allowance: "0",
  })

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          loadContractData(accounts[0])
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const loadContractData = async (address: string) => {
    try {
      // Simulate loading user's NFT and CBO data
      setContractData((prev) => ({
        ...prev,
        nftBalance: "3", // Mock NFT balance
        cboBalance: "250.5", // Mock CBO balance
        allowance: "50", // Mock allowance
      }))
    } catch (error) {
      console.error("Error loading contract data:", error)
    }
  }

  const quantityNum = Number.parseInt(quantity) || 0
  const cboRequired = quantityNum * Number.parseFloat(contractData.nftPrice)
  const hasEnoughCBO = Number.parseFloat(contractData.cboBalance) >= cboRequired
  const hasEnoughAllowance = Number.parseFloat(contractData.allowance) >= cboRequired

  const handleApprove = async () => {
    if (!account || cboRequired <= 0) {
      toast.error("Por favor conecta tu wallet e ingresa una cantidad válida")
      return
    }

    setIsLoading(true)
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        // Simulate approval transaction
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              to: process.env.NEXT_PUBLIC_CARBONO,
              from: account,
              data: "0x", // Approval function call data would go here
            },
          ],
        })

        toast.success("¡Aprobación enviada!", {
          description: `Hash de transacción: ${txHash.slice(0, 10)}...`,
        })

        // Update allowance after successful approval
        setTimeout(() => {
          setContractData((prev) => ({
            ...prev,
            allowance: cboRequired.toString(),
          }))
          setNeedsApproval(false)
        }, 2000)
      }
    } catch (error: any) {
      console.error("Approval error:", error)
      toast.error("Aprobación fallida", {
        description: error.message || "Ocurrió un error desconocido",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMint = async () => {
    if (!account || quantityNum <= 0) {
      toast.error("Por favor conecta tu wallet e ingresa una cantidad válida")
      return
    }

    if (!hasEnoughCBO) {
      toast.error("Balance CBO insuficiente")
      return
    }

    if (!hasEnoughAllowance) {
      setNeedsApproval(true)
      toast.error("Por favor aprueba los tokens CBO primero")
      return
    }

    setIsLoading(true)
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              to: process.env.NEXT_PUBLIC_EXPERIENCIA,
              from: account,
              data: "0x", // Mint function call data would go here
            },
          ],
        })

        toast.success("¡Transacción de minteo enviada!", {
          description: `Hash de transacción: ${txHash.slice(0, 10)}...`,
        })

        // Update balances after successful mint
        setTimeout(() => {
          setContractData((prev) => ({
            ...prev,
            nftBalance: (Number.parseInt(prev.nftBalance) + quantityNum).toString(),
            cboBalance: (Number.parseFloat(prev.cboBalance) - cboRequired).toString(),
            totalSupply: (Number.parseInt(prev.totalSupply) + quantityNum).toString(),
          }))
          setQuantity("")
        }, 2000)
      }
    } catch (error: any) {
      console.error("Mint error:", error)
      toast.error("Minteo fallido", {
        description: error.message || "Ocurrió un error desconocido",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Precio NFT"
          value={`${contractData.nftPrice} CBO`}
          icon={Coins}
          description="Precio por NFT"
          loading={false}
        />
        <StatCard
          title="Tus NFTs"
          value={contractData.nftBalance}
          icon={ImageIcon}
          description="NFTs de Experiencia que posees"
          loading={false}
        />
        <StatCard
          title="Suministro Total"
          value={`${contractData.totalSupply}/${contractData.maxSupply}`}
          icon={Package}
          description="NFTs minteados / Suministro máximo"
          loading={false}
        />
        <StatCard
          title="Tu Balance CBO"
          value={contractData.cboBalance}
          icon={Wallet}
          description="Tokens CBO disponibles"
          loading={false}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Mintear NFTs de Experiencia
          </CardTitle>
          <CardDescription>
            Mintea NFTs únicos de Experiencia usando tus tokens CBO. Cada NFT representa una experiencia única.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nft-quantity">Cantidad (NFTs)</Label>
            <Input
              id="nft-quantity"
              type="number"
              placeholder="Ingresa el número de NFTs a mintear"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              step="1"
            />
          </div>

          {quantityNum > 0 && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">CBO Requerido:</span>
                <span className="font-mono font-medium">{cboRequired} CBO</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tu Balance CBO:</span>
                <span className={`font-mono font-medium ${hasEnoughCBO ? "text-green-600" : "text-red-600"}`}>
                  {contractData.cboBalance} CBO
                </span>
              </div>
              {!hasEnoughCBO && quantityNum > 0 && (
                <div className="text-sm text-red-600">
                  Balance CBO insuficiente. Necesitas {cboRequired - Number.parseFloat(contractData.cboBalance)} CBO
                  más.
                </div>
              )}
            </div>
          )}

          {!hasEnoughAllowance && quantityNum > 0 && hasEnoughCBO && (
            <Button
              onClick={handleApprove}
              disabled={!account || isLoading}
              className="w-full bg-transparent"
              variant="outline"
            >
              {isLoading ? "Aprobando..." : `Aprobar ${cboRequired} CBO`}
            </Button>
          )}

          <Button
            onClick={handleMint}
            disabled={!account || !quantityNum || quantityNum <= 0 || !hasEnoughCBO || !hasEnoughAllowance || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading
              ? "Procesando..."
              : !hasEnoughAllowance
                ? "Aprobar CBO Primero"
                : `Mintear ${quantityNum || 0} NFT${quantityNum !== 1 ? "s" : ""}`}
          </Button>

          {!account && (
            <div className="text-center text-sm text-muted-foreground">
              Por favor conecta tu wallet para mintear NFTs
            </div>
          )}

          <div className="text-sm text-center text-muted-foreground">
            <p className="flex items-center justify-center gap-1">
              Contrato: {process.env.NEXT_PUBLIC_EXPERIENCIA}
              <ExternalLink className="h-3 w-3" />
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
