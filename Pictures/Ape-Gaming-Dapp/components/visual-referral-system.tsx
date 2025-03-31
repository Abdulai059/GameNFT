"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import {
  Copy,
  Gift,
  Users,
  Award,
  Loader2,
  Share2,
  Coins,
  UserPlus,
  TrendingUp,
  Check,
  Link,
  Twitter,
  Facebook,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { getReferralRewards } from "@/lib/web3-utils"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface VisualReferralSystemProps {
  walletAddress: string | null
}

export function VisualReferralSystem({ walletAddress }: VisualReferralSystemProps) {
  const [referralLink, setReferralLink] = useState("")
  const [rewards, setRewards] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [referrals, setReferrals] = useState<{ address: string; date: Date; reward: number }[]>([])
  const [totalReferrals, setTotalReferrals] = useState(0)
  const [copied, setCopied] = useState(false)

  // Mock data for referral tiers
  const referralTiers = [
    { level: 1, count: 5, reward: "10 APE Bonus" },
    { level: 2, count: 10, reward: "25 APE Bonus" },
    { level: 3, count: 25, reward: "75 APE Bonus" },
    { level: 4, count: 50, reward: "200 APE Bonus" },
  ]

  useEffect(() => {
    if (walletAddress) {
      // Create referral link with the wallet address
      const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
      setReferralLink(`${baseUrl}/play-game/marketplace?ref=${walletAddress}`)

      // Load referral rewards
      loadReferralRewards()

      // Mock referral data
      const mockReferrals = [
        { address: "0x1234...5678", date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), reward: 5 },
        { address: "0xabcd...efgh", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), reward: 5 },
        { address: "0x9876...5432", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), reward: 5 },
      ]
      setReferrals(mockReferrals)
      setTotalReferrals(mockReferrals.length)
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
      setCopied(true)

      // Show success toast
      toast({
        title: "Referral Link Copied!",
        description: "Share this link with friends to earn rewards.",
        variant: "default",
      })

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareReferralLink = (platform = "default") => {
    const shareText = "Join me on the Ape NFT Marketplace and get exclusive rewards!"

    if (typeof navigator !== "undefined") {
      switch (platform) {
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`,
            "_blank",
          )
          break
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(shareText)}`,
            "_blank",
          )
          break
        default:
          if (navigator.share) {
            navigator
              .share({
                title: "Join Ape NFT Marketplace",
                text: shareText,
                url: referralLink,
              })
              .catch((error) => console.log("Error sharing", error))
          } else {
            copyReferralLink()
          }
      }
    }
  }

  // Calculate progress to next tier
  const getCurrentTier = () => {
    for (let i = referralTiers.length - 1; i >= 0; i--) {
      if (totalReferrals >= referralTiers[i].count) {
        return i
      }
    }
    return -1
  }

  const getNextTier = () => {
    const currentTier = getCurrentTier()
    return currentTier < referralTiers.length - 1 ? currentTier + 1 : currentTier
  }

  const getProgressToNextTier = () => {
    const currentTier = getCurrentTier()
    const nextTier = getNextTier()

    if (currentTier === nextTier) return 100 // Already at max tier

    const currentCount = currentTier >= 0 ? referralTiers[currentTier].count : 0
    const nextCount = referralTiers[nextTier].count

    return ((totalReferrals - currentCount) / (nextCount - currentCount)) * 100
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
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl text-lime mb-2 flex items-center">
            <Gift className="mr-2 h-5 w-5" />
            Referral Program
          </h2>
          <p className="text-gray-300 mb-4 text-sm">
            Invite friends to mint NFTs and earn rewards! You'll receive 5 APE tokens for each friend who mints an NFT
            using your referral link.
          </p>

          <Tabs defaultValue="share" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black border border-lime/30">
              <TabsTrigger value="share" className="data-[state=active]:bg-lime data-[state=active]:text-black">
                Share
              </TabsTrigger>
              <TabsTrigger value="rewards" className="data-[state=active]:bg-lime data-[state=active]:text-black">
                Rewards
              </TabsTrigger>
              <TabsTrigger value="tiers" className="data-[state=active]:bg-lime data-[state=active]:text-black">
                Tiers
              </TabsTrigger>
            </TabsList>

            {/* Share Tab */}
            <TabsContent value="share" className="mt-4">
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-black/50 border border-lime/20 rounded-lg p-4">
                  <h3 className="text-lime mb-3 flex items-center">
                    <Link className="h-4 w-4 mr-2" />
                    Your Referral Link
                  </h3>

                  {/* Enhanced referral link display */}
                  <div className="relative mb-6">
                    <div className="flex items-center mb-2">
                      <div className="flex-1 bg-black/50 border border-lime/30 rounded-l-md p-2 text-lime text-xs sm:text-sm truncate">
                        {referralLink}
                      </div>
                      <button
                        onClick={copyReferralLink}
                        className={`p-2 rounded-r-md transition-colors flex items-center justify-center ${
                          copied ? "bg-green-600 text-white" : "bg-lime text-black hover:bg-lime/90"
                        }`}
                        aria-label="Copy referral link"
                      >
                        {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                      </button>
                    </div>
                    {copied && (
                      <div className="absolute -bottom-6 left-0 right-0 text-center text-green-500 text-xs">
                        Copied to clipboard!
                      </div>
                    )}
                  </div>

                  {/* Enhanced sharing options */}
                  <div className="space-y-3">
                    <h4 className="text-lime text-sm mb-2">Share via:</h4>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <button
                        onClick={copyReferralLink}
                        className="flex flex-col items-center justify-center bg-black border border-lime/30 text-lime p-2 sm:p-3 rounded-md hover:bg-lime/10 transition-colors"
                      >
                        <Copy className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                        <span className="text-[10px] sm:text-xs">Copy Link</span>
                      </button>
                      <button
                        onClick={() => shareReferralLink("twitter")}
                        className="flex flex-col items-center justify-center bg-black border border-lime/30 text-lime p-2 sm:p-3 rounded-md hover:bg-lime/10 transition-colors"
                      >
                        <Twitter className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                        <span className="text-[10px] sm:text-xs">Twitter</span>
                      </button>
                      <button
                        onClick={() => shareReferralLink("facebook")}
                        className="flex flex-col items-center justify-center bg-black border border-lime/30 text-lime p-2 sm:p-3 rounded-md hover:bg-lime/10 transition-colors"
                      >
                        <Facebook className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                        <span className="text-[10px] sm:text-xs">Facebook</span>
                      </button>
                    </div>
                    <button
                      onClick={() => shareReferralLink()}
                      className="w-full flex items-center justify-center bg-lime text-black p-2 sm:p-3 rounded-md hover:bg-lime/90 transition-colors mt-4"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      <span className="text-sm">Share with Friends</span>
                    </button>
                  </div>
                </div>

                <div className="bg-black/50 border border-lime/20 rounded-lg p-4">
                  <h3 className="text-lime mb-3 flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    How It Works
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lime/20 text-lime flex items-center justify-center text-xs mr-3 mt-0.5">
                        1
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm font-medium mb-1">Share your unique referral link</p>
                        <p className="text-gray-400 text-xs">
                          Send your link to friends via social media, messaging apps, or email
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lime/20 text-lime flex items-center justify-center text-xs mr-3 mt-0.5">
                        2
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm font-medium mb-1">Friends mint NFTs using your link</p>
                        <p className="text-gray-400 text-xs">When they mint an NFT, you earn 5 APE tokens per mint</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lime/20 text-lime flex items-center justify-center text-xs mr-3 mt-0.5">
                        3
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm font-medium mb-1">Reach referral tiers for bonuses</p>
                        <p className="text-gray-400 text-xs">
                          The more friends you refer, the higher tier rewards you unlock
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-lime/20 text-lime flex items-center justify-center text-xs mr-3 mt-0.5">
                        4
                      </div>
                      <div>
                        <p className="text-gray-300 text-sm font-medium mb-1">Withdraw your rewards anytime</p>
                        <p className="text-gray-400 text-xs">Collect your earned APE tokens whenever you want</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-black/50 border border-lime/20 rounded-lg p-4">
                  <h3 className="text-lime mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    Your Referrals
                  </h3>

                  {referrals.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-lime/20">
                            <th className="text-left py-2 px-3 text-gray-400 text-xs">Address</th>
                            <th className="text-left py-2 px-3 text-gray-400 text-xs">Date</th>
                            <th className="text-right py-2 px-3 text-gray-400 text-xs">Reward</th>
                          </tr>
                        </thead>
                        <tbody>
                          {referrals.map((referral, index) => (
                            <tr key={index} className="border-b border-lime/10">
                              <td className="py-2 px-3 text-lime text-sm">{referral.address}</td>
                              <td className="py-2 px-3 text-gray-300 text-sm">{referral.date.toLocaleDateString()}</td>
                              <td className="py-2 px-3 text-lime text-sm text-right">{referral.reward} APE</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-lime/30 mx-auto mb-2" />
                      <h3 className="text-lime mb-1">No Referrals Yet</h3>
                      <p className="text-gray-400 text-sm">Share your referral link to start earning rewards!</p>
                    </div>
                  )}
                </div>

                <div className="bg-black/50 border border-lime/20 rounded-lg p-4">
                  <h3 className="text-lime mb-3 flex items-center">
                    <Coins className="h-4 w-4 mr-2" />
                    Your Rewards
                  </h3>

                  <div className="bg-black/30 border border-lime/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300 text-sm">Total Rewards</span>
                      <span className="text-lime text-xl font-medium">
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : `${rewards} APE`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Total Referrals</span>
                      <span className="text-lime text-xl font-medium">{totalReferrals}</span>
                    </div>
                  </div>

                  <button
                    className="w-full bg-lime text-black py-2 rounded-md font-medium hover:bg-lime/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={rewards <= 0}
                  >
                    Withdraw Rewards
                  </button>

                  {/* Quick share button */}
                  <div className="mt-4 text-center">
                    <p className="text-gray-400 text-xs mb-2">Want to earn more rewards?</p>
                    <button
                      onClick={copyReferralLink}
                      className="text-lime text-sm hover:underline flex items-center justify-center mx-auto"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy your referral link
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tiers Tab */}
            <TabsContent value="tiers" className="mt-4">
              <div className="bg-black/50 border border-lime/20 rounded-lg p-4">
                <h3 className="text-lime mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Referral Tiers
                </h3>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300 text-sm">Progress to next tier</span>
                    <span className="text-lime text-sm">
                      {totalReferrals} /{" "}
                      {getNextTier() < referralTiers.length
                        ? referralTiers[getNextTier()].count
                        : referralTiers[referralTiers.length - 1].count}{" "}
                      referrals
                    </span>
                  </div>
                  <Progress value={getProgressToNextTier()} className="h-2" />
                </div>

                <div className="space-y-4">
                  {referralTiers.map((tier, index) => {
                    const isActive = totalReferrals >= tier.count
                    const isNext = !isActive && index === getNextTier()

                    return (
                      <div
                        key={index}
                        className={`border ${isActive ? "border-lime" : isNext ? "border-lime/50" : "border-lime/20"} rounded-lg p-3 transition-colors ${isActive ? "bg-lime/10" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full ${isActive ? "bg-lime text-black" : "bg-lime/20 text-lime"} flex items-center justify-center text-sm font-medium mr-3`}
                            >
                              {tier.level}
                            </div>
                            <div>
                              <h4 className="text-lime text-sm font-medium">{tier.count} Referrals</h4>
                              <p className="text-gray-300 text-xs">{tier.reward}</p>
                            </div>
                          </div>
                          {isActive && (
                            <div className="bg-lime/20 text-lime text-xs px-2 py-1 rounded-full">Unlocked</div>
                          )}
                          {isNext && (
                            <div className="bg-amber-500/20 text-amber-500 text-xs px-2 py-1 rounded-full">
                              Next Tier
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Share button at bottom of tiers */}
                <div className="mt-6 text-center">
                  <p className="text-gray-300 text-sm mb-3">Share your referral link to reach the next tier!</p>
                  <button
                    onClick={() => shareReferralLink()}
                    className="bg-lime text-black px-6 py-2 rounded-md hover:bg-lime/90 transition-colors inline-flex items-center"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Now
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Card>
  )
}

