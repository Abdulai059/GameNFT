"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Wallet, Loader2, Star, Award, Clock } from "lucide-react"
import type { NFT } from "@/types"
import { Progress } from "@/components/ui/progress"
import { earnXPForNFT } from "@/lib/web3-utils"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface NFTCardProps {
  nft: NFT
  onMint?: (nftId: number) => void
  isMinting?: number
  showMintButton?: boolean
  showXPButton?: boolean
  walletConnected?: boolean
  apeBalance?: number
  hideLevel?: boolean
}

export function NFTCard({
  nft,
  onMint,
  isMinting,
  showMintButton = false,
  showXPButton = false,
  walletConnected,
  apeBalance,
  hideLevel = false,
}: NFTCardProps) {
  const [isEarningXP, setIsEarningXP] = useState(false)

  /**
   * Get the appropriate color class based on NFT rarity
   */
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "bg-purple-900/50 text-purple-300"
      case "Mythic":
        return "bg-red-900/50 text-red-300"
      case "Epic":
        return "bg-blue-900/50 text-blue-300"
      case "Rare":
        return "bg-green-900/50 text-green-300"
      default:
        return "bg-gray-800 text-gray-300"
    }
  }

  /**
   * Calculate XP progress percentage to next level
   */
  const calculateXPProgress = () => {
    if (!nft.xp || !nft.level) return 0
    const xpForCurrentLevel = (nft.level - 1) * 100
    const xpProgress = nft.xp - xpForCurrentLevel
    return (xpProgress / 100) * 100
  }

  /**
   * Handle earning XP for the NFT
   */
  const handleEarnXP = async () => {
    if (!walletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    setIsEarningXP(true)
    try {
      // Earn a random amount of XP between 5 and 20
      const xpAmount = Math.floor(Math.random() * 16) + 5
      const result = await earnXPForNFT(nft.id, xpAmount)

      if (result.success) {
        toast({
          title: "XP Earned!",
          description: `Your NFT earned ${xpAmount} XP!`,
          variant: "default",
        })
      } else {
        toast({
          title: "Error Earning XP",
          description: result.error as string,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsEarningXP(false)
    }
  }

  return (
    <Card className="relative bg-black border-lime/20 overflow-hidden group">
      {/* Hover effect gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-lime/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>

      <div className="relative z-10">
        {/* NFT Image */}
        <div className="p-3">
          <div className="relative">
            <img
              src={nft.image || "/placeholder.svg"}
              alt={nft.name}
              className="w-full aspect-square object-cover rounded-md border border-lime/30 group-hover:border-lime/70 transition-colors"
            />

            {/* Borrowed badge */}
            {nft.isBorrowed && (
              <div className="absolute top-2 right-2 bg-amber-500/80 text-black text-xs px-2 py-1 rounded-full flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Borrowed
              </div>
            )}

            {/* Level badge */}
            {nft.level && !hideLevel && (
              <div className="absolute top-2 left-2 bg-lime/80 text-black text-xs px-2 py-1 rounded-full flex items-center">
                <Award className="h-3 w-3 mr-1" />
                Lvl {nft.level}
              </div>
            )}
          </div>
        </div>

        {/* NFT Info */}
        <div className="p-2">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lime text-sm font-medium truncate">{nft.name}</h3>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${getRarityColor(nft.rarity)}`}>{nft.rarity}</span>
          </div>

          {/* XP Bar (only if XP exists and not hidden) */}
          {nft.xp !== undefined && nft.level !== undefined && !hideLevel && (
            <div className="mb-2">
              <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1">
                <span>XP: {nft.xp}</span>
                <span>
                  {nft.level > 1 ? (nft.level - 1) * 100 : 0} / {nft.level * 100}
                </span>
              </div>
              <Progress value={calculateXPProgress()} className="h-1 bg-gray-800" indicatorClassName="bg-lime" />
            </div>
          )}

          <div className="mb-2">
            <div className="text-gray-400 text-[10px] mb-1">Traits:</div>
            <div className="flex flex-wrap gap-1">
              {nft.traits.slice(0, 2).map((trait, index) => (
                <span
                  key={index}
                  className="text-[8px] sm:text-[10px] bg-black/50 border border-lime/20 text-lime px-1 py-0.5 rounded-full truncate max-w-[80px] sm:max-w-none"
                >
                  {trait}
                </span>
              ))}
              {nft.traits.length > 2 && (
                <span className="text-[8px] sm:text-[10px] bg-black/50 border border-lime/20 text-lime px-1 py-0.5 rounded-full">
                  +{nft.traits.length - 2}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Wallet className="h-3 w-3 text-lime mr-1" />
              <span className="text-lime text-[10px] sm:text-xs">{nft.price}</span>
            </div>

            {showMintButton && onMint && (
              <button
                onClick={() => onMint?.(nft.id)}
                disabled={isMinting === nft.id || (walletConnected && apeBalance !== undefined && apeBalance < nft.price)}
                className={cn(
                  "bg-lime text-black text-xs px-2 py-1 rounded-md hover:bg-lime/90 transition-colors flex items-center justify-center w-fit",
                  (isMinting === nft.id || (walletConnected && apeBalance !== undefined && apeBalance < nft.price)) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isMinting && isMinting === nft.id ? (
                  <>
                    <Loader2 className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 animate-spin" />
                    Minting...
                  </>
                ) : (
                  "Mint"
                )}
              </button>
            )}

            {showXPButton && (
              <button
                className="bg-lime text-black px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs hover:bg-lime/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                onClick={handleEarnXP}
                disabled={isEarningXP || !walletConnected}
                aria-label={`Earn XP for ${nft.name}`}
              >
                {isEarningXP ? (
                  <>
                    <Loader2 className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 animate-spin" />
                    Earning...
                  </>
                ) : (
                  <>
                    <Star className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                    Earn XP
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

