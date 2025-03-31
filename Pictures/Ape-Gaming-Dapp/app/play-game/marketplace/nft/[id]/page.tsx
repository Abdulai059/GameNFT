"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { NavBarDemo } from "@/components/navbar-demo"
import { GameMenubar } from "@/components/game-menubar"
import { Card } from "@/components/ui/card"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { Wallet, Award, Star, Clock, ArrowLeft, Loader2 } from "lucide-react"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useWallet } from "@/contexts/wallet-context"
import { useCollection } from "@/contexts/collection-context"
import { NFTLending } from "@/components/nft-lending"
import { Progress } from "@/components/ui/progress"
import { earnXPForNFT } from "@/lib/web3-utils"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function NFTDetailPage() {
  const params = useParams()
  const { walletAddress, apeBalance } = useWallet()
  const { collection } = useCollection()
  const [isEarningXP, setIsEarningXP] = useState(false)

  const nftId = Number.parseInt(params?.id as string)
  const nft = collection.find((n) => n.id === nftId)

  if (!nft) {
    return (
      <main className="flex min-h-screen flex-col items-center bg-black">
        <NavBarDemo />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="flex items-center mb-8">
            <Link href="/play-game/marketplace/collection" className="text-lime hover:underline flex items-center">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Collection
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-xl text-lime mb-2">NFT Not Found</h3>
            <p className="text-gray-400 max-w-md mb-4">The NFT you're looking for doesn't exist in your collection.</p>
          </div>
        </div>
      </main>
    )
  }

  // Calculate XP progress to next level
  const calculateXPProgress = () => {
    if (!nft.xp || !nft.level) return 0
    const xpForCurrentLevel = (nft.level - 1) * 100
    const xpProgress = nft.xp - xpForCurrentLevel
    return (xpProgress / 100) * 100
  }

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "bg-purple-900/50 text-purple-300 border-purple-500/30"
      case "Mythic":
        return "bg-red-900/50 text-red-300 border-red-500/30"
      case "Epic":
        return "bg-blue-900/50 text-blue-300 border-blue-500/30"
      case "Rare":
        return "bg-green-900/50 text-green-300 border-green-500/30"
      default:
        return "bg-gray-800 text-gray-300 border-gray-500/30"
    }
  }

  // Handle earning XP
  const handleEarnXP = async () => {
    if (!walletAddress) {
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
        // Update local state
        if (nft.xp !== undefined && nft.level !== undefined) {
          nft.xp += xpAmount
          const newLevel = Math.floor(nft.xp / 100) + 1
          if (newLevel > nft.level) {
            nft.level = newLevel
            toast({
              title: "Level Up!",
              description: `Your NFT leveled up to level ${newLevel}!`,
              variant: "default",
            })
          } else {
            toast({
              title: "XP Earned!",
              description: `Your NFT earned ${xpAmount} XP!`,
              variant: "default",
            })
          }
        }
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
    <main className="flex min-h-screen flex-col items-center bg-black">
      <NavBarDemo />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center">
            <Link href="/play-game/marketplace/collection" className="text-lime hover:underline flex items-center mr-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Collection
            </Link>
            <h1 className="text-4xl text-lime">{nft.name}</h1>
          </div>
          <WalletConnectButton />
        </div>

        <div className="mb-8">
          <GameMenubar />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NFT Image */}
          <Card className="bg-black border-lime/20 p-4 overflow-hidden">
            <div className="relative">
              <img
                src={nft.image || "/placeholder.svg"}
                alt={nft.name}
                className="w-full aspect-square object-cover rounded-lg border-2 border-lime/30"
              />

              {/* Level badge */}
              {nft.level && (
                <div className="absolute top-4 left-4 bg-lime/80 text-black text-sm px-3 py-1 rounded-full flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  Level {nft.level}
                </div>
              )}

              {/* Rarity badge */}
              <div
                className={`absolute top-4 right-4 ${getRarityColor(nft.rarity)} text-sm px-3 py-1 rounded-full border`}
              >
                {nft.rarity}
              </div>

              {/* Borrowed badge */}
              {nft.isBorrowed && (
                <div className="absolute bottom-4 right-4 bg-amber-500/80 text-black text-sm px-3 py-1 rounded-full flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Borrowed
                </div>
              )}
            </div>
          </Card>

          {/* NFT Details */}
          <div className="space-y-6">
            <Card className="bg-black border-lime/20 p-4">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
              />
              <h2 className="text-2xl text-lime mb-4">NFT Details</h2>

              <div className="space-y-4">
                {/* Price */}
                <div className="flex justify-between items-center p-3 border border-lime/20 rounded-md bg-black/50">
                  <span className="text-gray-300">Price</span>
                  <div className="flex items-center">
                    <Wallet className="h-4 w-4 text-lime mr-1" />
                    <span className="text-lime font-medium">{nft.price} APE</span>
                  </div>
                </div>

                {/* XP and Level */}
                {nft.xp !== undefined && nft.level !== undefined && (
                  <div className="p-3 border border-lime/20 rounded-md bg-black/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Experience</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-lime mr-1" />
                        <span className="text-lime font-medium">{nft.xp} XP</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                      <span>Level {nft.level}</span>
                      <span>
                        {nft.level > 1 ? (nft.level - 1) * 100 : 0} / {nft.level * 100}
                      </span>
                    </div>
                    <Progress value={calculateXPProgress()} className="h-2 bg-gray-800" indicatorClassName="bg-lime" />

                    <button
                      className="mt-3 w-full bg-lime text-black px-4 py-2 rounded-md text-sm hover:bg-lime/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      onClick={handleEarnXP}
                      disabled={isEarningXP || !walletAddress}
                    >
                      {isEarningXP ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Earning XP...
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4 mr-2" />
                          Earn XP
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Traits */}
                <div className="p-3 border border-lime/20 rounded-md bg-black/50">
                  <h3 className="text-lime mb-2">Traits</h3>
                  <div className="flex flex-wrap gap-2">
                    {nft.traits.map((trait, index) => (
                      <span
                        key={index}
                        className="text-xs bg-black/50 border border-lime/20 text-lime px-2 py-1 rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Lending Options */}
            <NFTLending nft={nft} walletAddress={walletAddress} />
          </div>
        </div>
      </div>
    </main>
  )
}

