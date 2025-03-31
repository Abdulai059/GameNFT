"use client"

import { Wallet, Loader2, ExternalLink, LogOut } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"

export function WalletConnectButton() {
  const { walletAddress, isConnecting, connect, disconnect } = useWallet()

  // Format address for display (0x1234...5678)
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <>
      {walletAddress ? (
        <div className="flex items-center gap-2 bg-black/50 border border-lime/30 rounded-lg p-2">
          <Wallet className="h-4 w-4 text-lime" />
          <span className="text-lime text-sm">{formatAddress(walletAddress)}</span>
          <button
            onClick={disconnect}
            className="ml-2 p-1 rounded-full hover:bg-lime/10"
            aria-label="Disconnect wallet"
          >
            <LogOut className="h-4 w-4 text-lime" />
          </button>
          <a
            href={`https://etherscan.io/address/${walletAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-full hover:bg-lime/10"
            aria-label="View on Etherscan"
          >
            <ExternalLink className="h-4 w-4 text-lime" />
          </a>
        </div>
      ) : (
        <button
          onClick={connect}
          disabled={isConnecting}
          className="flex items-center gap-2 bg-lime text-black px-4 py-2 rounded-lg hover:bg-lime/90 transition-colors disabled:opacity-70"
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </>
          )}
        </button>
      )}
    </>
  )
}

