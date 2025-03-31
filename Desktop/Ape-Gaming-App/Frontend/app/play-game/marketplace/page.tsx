"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { NavBarDemo } from "@/components/navbar-demo"
import { GameMenubar } from "@/components/game-menubar"
import { Card } from "@/components/ui/card"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { Wallet, Info, AlertCircle, Clock, Gift } from "lucide-react"
import { mintNFTWithAPE } from "@/lib/web3-utils"
import { toast } from "@/hooks/use-toast"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useWallet } from "@/contexts/wallet-context"
import { useCollection } from "@/contexts/collection-context"
import { NFTCard } from "@/components/nft-card"
import { VisualReferralSystem } from "@/components/visual-referral-system"
import { LendingMarketplace } from "@/components/lending-marketplace"
import type { NFT } from "@/types"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MarketplacePage() {
  const [isMinting, setIsMinting] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [referrer, setReferrer] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("mint")
  const { walletAddress, apeBalance, updateApeBalance } = useWallet()
  const { addToCollection } = useCollection()
  const searchParams = useSearchParams()

  // Check for referrer in URL
  useEffect(() => {
    const ref = searchParams?.get("ref")
    if (ref) {
      setReferrer(ref)
      toast({
        title: "Referral Detected",
        description: "You're using a referral link. Your friend will earn rewards when you mint an NFT!",
        variant: "default",
      })
    }
  }, [searchParams])

  // NFT data with images - expanded to 10 NFTs with XP and level
  const nfts: NFT[] = [
    {
      id: 1,
      name: "Cyber Ape #001",
      image: "/NFT's-M/1.avif",
      price: 100,
      rarity: "Rare",
      traits: ["Laser Eyes", "Gold Chain", "Cyber Helmet"],
      xp: 0,
      level: 1,
    },
    {
      id: 2,
      name: "Space Ape #042",
      image: "/NFT's-M/2.avif",
      price: 120,
      rarity: "Epic",
      traits: ["Space Suit", "Oxygen Tank", "Moon Rock"],
      xp: 0,
      level: 1,
    },
    {
      id: 3,
      name: "Pirate Ape #107",
      image: "/NFT's-M/3.avif",
      price: 90,
      rarity: "Uncommon",
      traits: ["Eye Patch", "Pirate Hat", "Parrot"],
      xp: 0,
      level: 1,
    },
    {
      id: 4,
      name: "Ninja Ape #256",
      image: "/NFT's-M/8.avif",
      price: 150,
      rarity: "Legendary",
      traits: ["Katana", "Ninja Stars", "Shadow Cloak"],
      xp: 0,
      level: 1,
    },
    {
      id: 5,
      name: "Wizard Ape #389",
      image: "/NFT's-M/12.avif",
      price: 130,
      rarity: "Epic",
      traits: ["Magic Staff", "Wizard Hat", "Spell Book"],
      xp: 0,
      level: 1,
    },
    {
      id: 6,
      name: "King Ape #512",
      image: "/NFT's-M/5.avif",
      price: 200,
      rarity: "Mythic",
      traits: ["Metal Body", "Laser Arm", "Digital Brain"],
      xp: 0,
      level: 1,
    },
    {
      id: 7,
      name: "Samurai Ape #628",
      image: "/NFT's-M/7.jpg",
      price: 180,
      rarity: "Legendary",
      traits: ["Samurai Armor", "Dual Swords", "War Fan"],
      xp: 0,
      level: 1,
    },
    {
      id: 8,
      name: "Zombie Ape #731",
      image: "/NFT's-M/14.avif",
      price: 110,
      rarity: "Rare",
      traits: ["Decaying Skin", "Glowing Eyes", "Brain Exposure"],
      xp: 0,
      level: 1,
    },
    {
      id: 9,
      name: "Bloodrot Ape #845",
      image: "/NFT's-M/18.avif",
      price: 140,
      rarity: "Epic",
      traits: ["VR Headset", "Holographic Keyboard", "Data Gloves"],
      xp: 0,
      level: 1,
    },
    {
      id: 10,
      name: "Eternal Decay Ape #999",
      image: "/NFT's-M/6.jpg",
      price: 250,
      rarity: "Mythic",
      traits: ["Golden Crown", "Royal Cape", "Diamond Scepter"],
      xp: 0,
      level: 1,
    },
  ]

  /**
   * Handle minting an NFT
   */
  const handleMint = async (nftId: number) => {
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to mint NFTs.",
        variant: "destructive",
      })
      return
    }

    const nft = nfts.find((n) => n.id === nftId)
    if (!nft) return

    if (apeBalance < nft.price) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least ${nft.price} Ape Tokens to mint this NFT.`,
        variant: "destructive",
      })
      return
    }

    setIsMinting(nftId)
    setErrorMessage(null)

    try {
      const result = await mintNFTWithAPE(nftId, referrer || undefined)

      if (result.success) {
        // Deduct the price from the balance
        const newBalance = apeBalance - nft.price
        updateApeBalance(newBalance)

        // Add the NFT to the collection
        addToCollection(nft)

        toast({
          title: "NFT Minted Successfully!",
          description: `Transaction: ${result.transaction?.slice(0, 10)}...`,
          variant: "default",
        })
      } else {
        setErrorMessage(result.error as string)
        toast({
          title: "Minting Failed",
          description: result.error as string,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      const errorMsg = error?.message || "An unexpected error occurred"
      setErrorMessage(errorMsg)
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
      console.error("Mint error:", error)
    } finally {
      setIsMinting(null)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-black">
      {/* NavBar Demo */}
      <NavBarDemo />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-4xl text-lime mb-4 md:mb-0">Ape NFT Marketplace</h1>

          {/* Wallet Connection Button */}
          <WalletConnectButton />
        </div>

        {/* Game Menu */}
        <div className="mb-8">
          <GameMenubar />
        </div>

        {/* Marketplace Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-4 sm:mb-6">
          <TabsList className="grid w-full grid-cols-3 bg-black border border-lime/30">
            <TabsTrigger
              value="mint"
              className="data-[state=active]:bg-lime data-[state=active]:text-black text-xs sm:text-sm py-1 sm:py-2"
            >
              Mint NFTs
            </TabsTrigger>
            <TabsTrigger
              value="lending"
              className="data-[state=active]:bg-lime data-[state=active]:text-black text-xs sm:text-sm py-1 sm:py-2"
            >
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Lending</span>
              <span className="xs:hidden">Lend</span>
            </TabsTrigger>
            <TabsTrigger
              value="referrals"
              className="data-[state=active]:bg-lime data-[state=active]:text-black text-xs sm:text-sm py-1 sm:py-2"
            >
              <Gift className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Referrals</span>
              <span className="xs:hidden">Refer</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Mint Tab Content */}
        {activeTab === "mint" && (
          <>
            {/* Marketplace Info */}
            <Card className="relative bg-black border-lime/20 p-4 mb-6">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
              />
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1">
                  <h2 className="text-xl text-lime mb-2">Mint Your Ape NFT</h2>
                  <p className="text-gray-300 mb-2 text-sm">
                    Each Ape NFT is unique with different traits and abilities that will enhance your gameplay
                    experience. Mint your NFT to unlock special abilities and earn more rewards in our games.
                  </p>
                  <div className="flex items-center text-gray-400 text-xs mb-2">
                    <Info className="h-3 w-3 mr-1 text-lime" />
                    <span>Connect your Web3 wallet to mint NFTs. Each NFT costs Ape Tokens.</span>
                  </div>

                  {errorMessage && (
                    <div className="flex items-center p-2 border border-red-500/30 rounded-md bg-red-500/10 w-full mb-2">
                      <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-400 text-sm">{errorMessage}</span>
                    </div>
                  )}

                  {!walletAddress ? (
                    <div className="flex items-center p-2 border border-amber-500/30 rounded-md bg-amber-500/10 w-full mb-2">
                      <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="text-amber-400 text-sm">Please connect your wallet to mint NFTs</span>
                    </div>
                  ) : (
                    <div className="flex items-center p-2 border border-lime/30 rounded-md bg-black/50 w-fit">
                      <Wallet className="h-4 w-4 text-lime mr-1" />
                      <span className="text-lime text-sm">Your Balance: {apeBalance.toFixed(2)} Ape Tokens</span>
                    </div>
                  )}
                </div>
                <div className="flex-none">
                  <img
                    src="/nft/1.jpg"
                    alt="Ape NFT"
                    className="h-24 w-24 rounded-full border-2 border-lime"
                  />
                </div>
              </div>
            </Card>

            {/* NFT Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {nfts.map((nft) => (
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  onMint={handleMint}
                  isMinting={isMinting === nft.id ? nft.id : undefined}
                  showMintButton={true}
                  walletConnected={!!walletAddress}
                  apeBalance={apeBalance}
                  hideLevel={true}
                />
              ))}
            </div>
          </>
        )}

        {/* Lending Tab Content */}
        {activeTab === "lending" && <LendingMarketplace walletAddress={walletAddress} />}

        {/* Referrals Tab Content */}
        {activeTab === "referrals" && <VisualReferralSystem walletAddress={walletAddress} />}
      </div>
    </main>
  )
}

