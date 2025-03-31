"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { Clock, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { NFT } from "@/types"
import { checkNFTBorrowStatus } from "@/lib/web3-utils"
import { ethers } from "ethers"

interface NFTLendingProps {
  nft: NFT
  walletAddress: string | null
}

export function NFTLending({ nft, walletAddress }: NFTLendingProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [borrowerAddress, setBorrowerAddress] = useState("")

  // This is a placeholder since the contract doesn't have lending functions implemented
  const handleLendNFT = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    if (!borrowerAddress || !ethers.utils.isAddress(borrowerAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Check if NFT is already borrowed
      const borrowStatus = await checkNFTBorrowStatus(nft.id)

      if (borrowStatus.success && borrowStatus.isBorrowed) {
        toast({
          title: "NFT Already Borrowed",
          description: "This NFT is already being borrowed by someone else.",
          variant: "destructive",
        })
        return
      }

      // This would call the lending function if it was implemented in the contract
      toast({
        title: "Lending Not Implemented",
        description: "The lending functionality is not yet implemented in the contract.",
        variant: "destructive",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!walletAddress) {
    return (
      <Card className="bg-black border-lime/20 p-4 mb-6">
        <div className="flex items-center text-gray-400 text-sm">
          <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
          <span>Connect your wallet to lend your NFTs</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="relative bg-black border-lime/20 p-4 mb-6">
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl text-lime mb-2 flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Lend Your NFT
          </h2>
          <p className="text-gray-300 mb-4 text-sm">
            Let others borrow your NFT for up to 5 days. They can use it in games to earn XP, but ownership remains with
            you.
          </p>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2 text-sm">Borrower Address</label>
            <input
              type="text"
              placeholder="0x..."
              value={borrowerAddress}
              onChange={(e) => setBorrowerAddress(e.target.value)}
              className="w-full p-2 rounded-md bg-black border border-lime/30 text-lime focus:border-lime focus:outline-none"
            />
          </div>

          <button
            className="bg-lime text-black px-4 py-2 rounded-md text-sm hover:bg-lime/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            onClick={handleLendNFT}
            disabled={isLoading || !walletAddress || nft.isBorrowed}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : nft.isBorrowed ? (
              "Currently Borrowed"
            ) : (
              "Lend NFT"
            )}
          </button>

          {nft.isBorrowed && (
            <div className="mt-4 p-2 border border-amber-500/30 rounded-md bg-amber-500/10">
              <div className="flex items-center text-amber-400 text-sm mb-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>This NFT is currently borrowed</span>
              </div>
              <div className="text-gray-300 text-xs">
                <p>
                  Borrower: {nft.borrower?.slice(0, 6)}...{nft.borrower?.slice(-4)}
                </p>
                <p>Expires: {nft.borrowExpiration?.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

