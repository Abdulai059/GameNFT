"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { connectWallet } from "@/lib/web3-utils"
import { toast } from "@/hooks/use-toast"

type WalletContextType = {
  walletAddress: string | null
  isConnecting: boolean
  apeBalance: number
  connect: () => Promise<void>
  disconnect: () => void
  updateApeBalance: (newBalance?: number) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [apeBalance, setApeBalance] = useState(0)

  // Check if wallet was previously connected
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAddress = localStorage.getItem("walletAddress")
      const savedBalance = localStorage.getItem("apeBalance")

      if (savedAddress) {
        setWalletAddress(savedAddress)
      }

      if (savedBalance) {
        setApeBalance(Number.parseFloat(savedBalance))
      }
    }
  }, [])

  const connect = async () => {
    setIsConnecting(true)

    try {
      const result = await connectWallet()

      if (result.success && result.account) {
        setWalletAddress(result.account)

        if (typeof window !== "undefined") {
          localStorage.setItem("walletAddress", result.account)
        }

        // Fetch initial balance (mock for now)
        const initialBalance = 245.5
        setApeBalance(initialBalance)

        if (typeof window !== "undefined") {
          localStorage.setItem("apeBalance", initialBalance.toString())
        }

        toast({
          title: "Wallet Connected",
          description: "Your wallet has been successfully connected.",
          variant: "default",
        })
      } else {
        toast({
          title: "Connection Failed",
          description: result.error as string,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      })
      console.error("Wallet connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setWalletAddress(null)

    if (typeof window !== "undefined") {
      localStorage.removeItem("walletAddress")
    }

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
      variant: "default",
    })
  }

  const updateApeBalance = (newBalance?: number) => {
    if (newBalance !== undefined) {
      setApeBalance(newBalance)

      if (typeof window !== "undefined") {
        localStorage.setItem("apeBalance", newBalance.toString())
      }
    }
  }

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnecting,
        apeBalance,
        connect,
        disconnect,
        updateApeBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)

  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }

  return context
}

