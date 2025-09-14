import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import "./globals.css"

const Providers = dynamic(() => import("./providers"), {
  ssr: false,
  loading: () => null,
})

export const metadata: Metadata = {
  title: "Carbono & Experiencia - Web3 DApp",
  description: "Compra tokens Carbono y mintea NFTs de Experiencia en la blockchain",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  )
}
