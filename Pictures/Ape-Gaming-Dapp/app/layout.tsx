import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-context"
import { WalletProvider } from "@/contexts/wallet-context"
import { CollectionProvider } from "@/contexts/collection-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ape Game Platform",
  description: "A blockchain gaming platform with play-to-earn mechanics",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <WalletProvider>
            <CollectionProvider>{children}</CollectionProvider>
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'