"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { Copy, Gift, Users, Award, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getReferralRewards } from "@/lib/web3-utils"

interface ReferralSystemProps {
  walletAddress: string | null
}

export function ReferralSystem({ walletAddress }: ReferralSystemProps) {
  const [referralLink, setReferralLink] = useState("")
  const [rewards, setRewards] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (walletAddress) {
      // Create referral link with the wallet address
      const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
      setReferralLink(`${baseUrl}/play-game/marketplace?ref=${walletAddress}`)

      // Load referral rewards
      loadReferralRewards()
    }
  }, [walletAddress])

  const loadReferralRewards = async () => {
    if (!walletAddress) return

    setIsLoading(true)
    try {
      const result = await getReferralRewards(walletAddress)
      if (result.success) {
        setRewards(result.rewards)
      }
    } catch (error) {
      console.error("Error loading referral rewards:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyReferralLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(referralLink)
      toast({
        title: "Referral Link Copied!",
        description: "Share this link with friends to earn rewards.",
        variant: "default",
      })
    }
  }

  if (!walletAddress) {
    return (
      <Card className="bg-black border-lime/20 p-4 mb-6">
        <div className="flex items-center text-gray-400 text-sm">
          <Users className="h-4 w-4 mr-2 text-lime" />
          <span>Connect your wallet to access the referral program</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="relative bg-black border-lime/20 p-4 mb-6">
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="flex-1">
          <h2 className="text-xl text-lime mb-2 flex items-center">
            <Gift className="mr-2 h-5 w-5" />
            Referral Program
          </h2>
          <p className="text-gray-300 mb-4 text-sm">
            Invite friends to mint NFTs and earn rewards! You'll receive 5 APE tokens for each friend who mints an NFT
            using your referral link.
          </p>

          <div className="flex items-center mb-4">
            <div className="flex-1 bg-black/50 border border-lime/30 rounded-l-md p-2 text-lime text-sm truncate">
              {referralLink}
            </div>
            <button
              onClick={copyReferralLink}
              className="bg-lime text-black p-2 rounded-r-md hover:bg-lime/90 transition-colors"
              aria-label="Copy referral link"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center p-2 border border-lime/30 rounded-md bg-black/50 w-fit">
            <Award className="h-4 w-4 text-lime mr-2" />
            <span className="text-lime text-sm">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin inline mr-1" />
              ) : (
                <>Your Rewards: {rewards} APE Tokens</>
              )}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

