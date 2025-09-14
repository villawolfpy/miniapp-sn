"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { useWeb3 } from "@/hooks/use-web3"
import { useDisconnect } from "wagmi"

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function HomePage() {
  const [quantity, setQuantity] = useState("")
  const { disconnect } = useDisconnect()
  const {
    isConnected,
    address,
    isLoading,
    carbonoBalance,
    experienciaBalance,
    tokenPrice,
    mintCost,
    buyCarbono,
    mintExperiencia,
    formatAddress,
  } = useWeb3()

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Por favor instala MetaMask para usar esta aplicación")
      return
    }

    try {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      })
    } catch (error) {
      console.error("Error connecting wallet:", error)
      alert("Error al conectar la wallet")
    }
  }

  const disconnectWallet = () => {
    disconnect()
  }

  const handleBuy = async () => {
    if (!quantity || Number(quantity) <= 0) {
      return
    }
    await buyCarbono(quantity)
    setQuantity("")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                🌱
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Carbono & Experiencia</h1>
                <p className="text-sm text-muted-foreground">Plataforma Web3 de Tokens de Carbono y NFTs</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isConnected && address ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700">{formatAddress}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={disconnectWallet}
                    className="text-red-600 hover:text-red-700 bg-transparent"
                  >
                    Desconectar
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Icons.wallet className="w-4 h-4 mr-2" />
                  {isLoading ? "Conectando..." : "Conectar Wallet"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              🌱
            </div>
            <h2 className="text-3xl font-bold mb-4">Bienvenido a Carbono & Experiencia</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Una plataforma descentralizada para comercializar tokens de carbono y mintear NFTs de experiencias únicas.
              Conecta tu wallet para comenzar.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="p-6 border rounded-lg bg-card">
                <Icons.coins className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Comprar Tokens CBO</h3>
                <p className="text-muted-foreground">
                  Compra tokens Carbono (CBO) con ETH. Estos tokens representan créditos de carbono.
                </p>
              </div>
              <div className="p-6 border rounded-lg bg-card">
                <Icons.image className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Mintear NFTs de Experiencia</h3>
                <p className="text-muted-foreground">Usa tus tokens CBO para mintear NFTs únicos de Experiencia.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icons.coins className="h-5 w-5" />
                    Balance CBO
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600">{carbonoBalance}</p>
                  <p className="text-sm text-muted-foreground">Tokens Carbono</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icons.image className="h-5 w-5" />
                    NFTs Experiencia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-blue-600">{experienciaBalance}</p>
                  <p className="text-sm text-muted-foreground">NFTs en tu wallet</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="buy-carbono" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="buy-carbono" className="flex items-center gap-2">
                  <Icons.coins className="h-4 w-4" />
                  Comprar CBO
                </TabsTrigger>
                <TabsTrigger value="mint-nft" className="flex items-center gap-2">
                  <Icons.image className="h-4 w-4" />
                  Mintear NFTs
                </TabsTrigger>
              </TabsList>

              <TabsContent value="buy-carbono">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.coins className="h-5 w-5" />
                      Comprar Tokens CBO
                    </CardTitle>
                    <CardDescription>Compra tokens Carbono (CBO) con ETH. Precio: {tokenPrice} ETH por token.</CardDescription>
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

                    {quantity && Number(quantity) > 0 && (
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">ETH Requerido:</span>
                          <span className="font-mono font-medium">{(Number(quantity) * Number(tokenPrice)).toFixed(6)} ETH</span>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleBuy}
                      disabled={!quantity || Number(quantity) <= 0 || isLoading}
                      className="w-full"
                      size="lg"
                    >
                      {isLoading ? "Procesando..." : `Comprar ${quantity || 0} CBO`}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mint-nft">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icons.image className="h-5 w-5" />
                      Mintear NFT de Experiencia
                    </CardTitle>
                    <CardDescription>Usa tus tokens CBO para mintear un NFT único de Experiencia.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Costo: {mintCost} CBO por NFT</p>
                      <p className="text-sm text-muted-foreground">Tu balance: {carbonoBalance} CBO</p>
                    </div>

                    <Button
                      onClick={mintExperiencia}
                      disabled={isLoading || Number(carbonoBalance) < Number(mintCost)}
                      className="w-full"
                      size="lg"
                    >
                      {isLoading ? "Minteando..." : "Mintear NFT de Experiencia"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Carbono & Experiencia. Construido con Next.js y Web3.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
