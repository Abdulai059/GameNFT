"use client"

import { useState } from "react"
import { NavBarDemo } from "@/components/navbar-demo"
import { GameMenubar } from "@/components/game-menubar"
import { Card } from "@/components/ui/card"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel"
import { Wallet, Loader2, AlertCircle } from "lucide-react"
import { mintNFT } from "@/lib/web3-utils"
import { toast } from "@/hooks/use-toast"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useWallet } from "@/contexts/wallet-context"
import { useCollection } from "@/contexts/collection-context"

export default function MintApePage() {
  const [quantity, setQuantity] = useState(1)
  const [isMinting, setIsMinting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { walletAddress, apeBalance, updateApeBalance } = useWallet()
  const { addToCollection } = useCollection()
  const pricePerNFT = 100

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, 10))
  }

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  const handleMint = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to mint NFTs.",
        variant: "destructive",
      })
      return
    }

    const totalCost = pricePerNFT * quantity

    if (apeBalance < totalCost) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least ${totalCost} Ape Tokens to mint ${quantity} NFT${quantity > 1 ? "s" : ""}.`,
        variant: "destructive",
      })
      return
    }

    setIsMinting(true)
    setErrorMessage(null)

    try {
      const result = await mintNFT(quantity, pricePerNFT)

      if (result.success) {
        // Deduct the price from the balance
        const newBalance = apeBalance - totalCost
        updateApeBalance(newBalance)

        // Add the NFTs to the collection
        for (let i = 0; i < quantity; i++) {
          // Generate a unique NFT for each minted item
          const randomId = Math.floor(Math.random() * 1000) + 1
          const rarityTypes = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"]
          const randomRarity = rarityTypes[Math.floor(Math.random() * rarityTypes.length)]

          const traits = [
            "Laser Eyes",
            "Gold Chain",
            "Cyber Helmet",
            "Space Suit",
            "Oxygen Tank",
            "Moon Rock",
            "Eye Patch",
            "Pirate Hat",
            "Parrot",
            "Katana",
            "Ninja Stars",
            "Shadow Cloak",
            "Magic Staff",
            "Wizard Hat",
            "Spell Book",
          ]

          // Select 3 random traits
          const randomTraits = []
          for (let j = 0; j < 3; j++) {
            const randomIndex = Math.floor(Math.random() * traits.length)
            randomTraits.push(traits[randomIndex])
            traits.splice(randomIndex, 1) // Remove selected trait to avoid duplicates
          }

          const mintedNft = {
            id: randomId,
            name: `Ape #${randomId.toString().padStart(3, "0")}`,
            image: `/placeholder.svg?height=300&width=300&text=Ape+%23${randomId}`,
            price: pricePerNFT,
            rarity: randomRarity as "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "Mythic",
            traits: randomTraits,
          }

          addToCollection(mintedNft)
        }

        toast({
          title: "NFT Minted Successfully!",
          description: `You minted ${quantity} Ape NFT${quantity > 1 ? "s" : ""}!`,
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
      setIsMinting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-black">
      {/* NavBar Demo */}
      <NavBarDemo />

      <div className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-lime mb-4 md:mb-0">Mint Ape NFT</h1>

          {/* Wallet Connection Button */}
          <WalletConnectButton />
        </div>

        {/* Game Menu */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <GameMenubar />
        </div>

        {/* Mint Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* NFT Preview */}
          <div>
            <Card className="bg-black border-lime/20 p-3 sm:p-4 md:p-5 h-full">
              <h2 className="text-xl sm:text-2xl text-lime mb-3 sm:mb-4 md:mb-5 text-center">Ape NFT Collection</h2>
              <div className="h-[200px] sm:h-[240px] md:h-[280px]">
                <ThreeDPhotoCarousel />
              </div>
              <p className="text-gray-300 mt-3 sm:mt-4 md:mt-5 text-center text-sm sm:text-base">
                Browse through our exclusive Ape NFT collection. Each Ape is unique with different traits and abilities.
              </p>
            </Card>
          </div>

          {/* Mint Form */}
          <div>
            <Card className="relative bg-black border-lime/20 p-3 sm:p-4 md:p-5 h-full">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
              />
              <h2 className="text-xl sm:text-2xl text-lime mb-3 sm:mb-4 md:mb-5">Mint Your Ape</h2>

              {!walletAddress && (
                <div className="flex items-center p-2 border border-amber-500/30 rounded-md bg-amber-500/10 w-full mb-4">
                  <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-amber-400 text-sm">Please connect your wallet to mint NFTs</span>
                </div>
              )}

              {walletAddress && (
                <div className="flex items-center p-2 border border-lime/30 rounded-md bg-black/50 w-fit mb-4">
                  <Wallet className="h-4 w-4 text-lime mr-1" />
                  <span className="text-lime text-sm">Your Balance: {apeBalance.toFixed(2)} Ape Tokens</span>
                </div>
              )}

              {errorMessage && (
                <div className="flex items-center p-2 border border-red-500/30 rounded-md bg-red-500/10 w-full mb-4">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-400 text-sm">{errorMessage}</span>
                </div>
              )}

              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                <div>
                  <label className="block text-gray-300 mb-1 sm:mb-2 text-sm sm:text-base">Quantity</label>
                  <div className="flex">
                    <button
                      className="bg-black border border-lime/30 text-lime px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-l-md hover:bg-lime/10 text-sm sm:text-base disabled:opacity-50"
                      onClick={handleDecrement}
                      disabled={quantity <= 1 || isMinting || !walletAddress}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      className="w-full p-1 sm:p-2 text-center bg-black border-t border-b border-lime/30 text-lime focus:outline-none text-sm sm:text-base"
                      readOnly
                    />
                    <button
                      className="bg-black border border-lime/30 text-lime px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-r-md hover:bg-lime/10 text-sm sm:text-base disabled:opacity-50"
                      onClick={handleIncrement}
                      disabled={quantity >= 10 || isMinting || !walletAddress}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 sm:mb-2 text-sm sm:text-base">Price</label>
                  <div className="flex items-center p-2 sm:p-3 border border-lime/30 rounded-md bg-black/50 text-sm sm:text-base">
                    <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-lime mr-1 sm:mr-2" />
                    <span className="text-lime">{pricePerNFT} Ape Tokens</span>
                  </div>
                </div>

                <div className="border-t border-lime/20 pt-3 sm:pt-4 md:pt-5">
                  <h3 className="text-lg text-lime mb-2 sm:mb-3 text-sm sm:text-base">Mint Summary</h3>
                  <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Price per NFT</span>
                      <span className="text-lime">{pricePerNFT} Ape Tokens</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Quantity</span>
                      <span className="text-lime">{quantity}</span>
                    </div>
                    <div className="flex justify-between border-t border-lime/20 pt-1 mt-1 sm:pt-2 sm:mt-2">
                      <span className="text-gray-300 font-medium">Total</span>
                      <span className="text-lime font-medium">{pricePerNFT * quantity} Ape Tokens</span>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full bg-lime text-black py-2 sm:py-3 rounded-md font-medium hover:bg-lime/90 transition-colors text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  onClick={handleMint}
                  disabled={isMinting || !walletAddress || apeBalance < pricePerNFT * quantity}
                >
                  {isMinting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Minting...
                    </>
                  ) : !walletAddress ? (
                    "Connect Wallet to Mint"
                  ) : apeBalance < pricePerNFT * quantity ? (
                    "Insufficient Balance"
                  ) : (
                    "Mint Now"
                  )}
                </button>

                <p className="text-gray-400 text-xs sm:text-sm text-center">
                  By minting, you agree to our terms and conditions. Each Ape NFT is unique and randomly generated.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

