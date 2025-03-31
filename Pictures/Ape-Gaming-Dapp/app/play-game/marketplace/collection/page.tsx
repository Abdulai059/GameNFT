"use client"

import { useState, useEffect } from "react"
import { NavBarDemo } from "@/components/navbar-demo"
import { GameMenubar } from "@/components/game-menubar"
import { Card } from "@/components/ui/card"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { Wallet, Info, AlertCircle, Loader2 } from "lucide-react"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useWallet } from "@/contexts/wallet-context"
import { useCollection } from "@/contexts/collection-context"
import { NFTCard } from "@/components/nft-card"
import { NFTLending } from "@/components/nft-lending"
import { getUserNFTs } from "@/lib/web3-utils"
import type { NFT } from "@/types"

export default function CollectionPage() {
  const { walletAddress, apeBalance } = useWallet()
  const { collection } = useCollection()
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [onChainNFTs, setOnChainNFTs] = useState<any[]>([])

  // Load on-chain NFTs when wallet is connected
  useEffect(() => {
    if (walletAddress) {
      loadOnChainNFTs()
    }
  }, [walletAddress])

  const loadOnChainNFTs = async () => {
    if (!walletAddress) return

    setIsLoading(true)
    try {
      const result = await getUserNFTs(walletAddress)
      if (result.success) {
        setOnChainNFTs(result.nfts)

        // Update local collection with on-chain data
        result.nfts.forEach((onChainNFT: any) => {
          const existingNFT = collection.find((nft) => nft.id === onChainNFT.id)
          if (existingNFT) {
            existingNFT.xp = onChainNFT.xp
            existingNFT.level = onChainNFT.level
            existingNFT.isBorrowed = onChainNFT.isBorrowed
          }
        })
      }
    } catch (error) {
      console.error("Error loading on-chain NFTs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNFTClick = (nft: NFT) => {
    setSelectedNFT(nft)
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-black">
      {/* NavBar Demo */}
      <NavBarDemo />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-4xl text-lime mb-4 md:mb-0">My NFT Collection</h1>

          {/* Wallet Connection Button */}
          <WalletConnectButton />
        </div>

        {/* Game Menu */}
        <div className="mb-8">
          <GameMenubar />
        </div>

        {/* Collection Info */}
        <Card className="relative bg-black border-lime/20 p-4 mb-6">
          <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <h2 className="text-xl text-lime mb-2">Your Ape NFT Collection</h2>
              <p className="text-gray-300 mb-2 text-sm">
                View all the Ape NFTs you've minted. Each NFT has unique traits and abilities that enhance your
                gameplay. Click on an NFT to see more details and lending options.
              </p>

              {!walletAddress ? (
                <div className="flex items-center p-2 border border-amber-500/30 rounded-md bg-amber-500/10 w-full mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-amber-400 text-sm">Please connect your wallet to view your collection</span>
                </div>
              ) : (
                <div className="flex items-center p-2 border border-lime/30 rounded-md bg-black/50 w-fit">
                  <Wallet className="h-4 w-4 text-lime mr-1" />
                  <span className="text-lime text-sm">Your Balance: {apeBalance.toFixed(2)} Ape Tokens</span>
                </div>
              )}

              <div className="flex items-center text-gray-400 text-xs mt-2">
                <Info className="h-3 w-3 mr-1 text-lime" />
                <span>
                  You own {collection.length} Ape NFT{collection.length !== 1 ? "s" : ""}
                </span>
              </div>

              {isLoading && (
                <div className="flex items-center text-gray-400 text-xs mt-2">
                  <Loader2 className="h-3 w-3 mr-1 text-lime animate-spin" />
                  <span>Loading on-chain NFT data...</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Selected NFT Details */}
        {selectedNFT && (
          <div className="mb-6">
            <NFTLending nft={selectedNFT} walletAddress={walletAddress} />
          </div>
        )}

        {/* Collection Grid */}
        {walletAddress ? (
          collection.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {collection.map((nft) => (
                <div key={nft.id} onClick={() => handleNFTClick(nft)} className="cursor-pointer">
                  <NFTCard nft={nft} showXPButton={true} walletConnected={!!walletAddress} apeBalance={apeBalance} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <img
                src="/placeholder.svg?height=150&width=150&text=Empty+Collection"
                alt="Empty Collection"
                className="w-32 h-32 mb-4 opacity-50"
              />
              <h3 className="text-xl text-lime mb-2">Your Collection is Empty</h3>
              <p className="text-gray-400 max-w-md mb-4">
                You haven't minted any Ape NFTs yet. Visit the marketplace to mint your first NFT.
              </p>
              <a
                href="/play-game/marketplace"
                className="bg-lime text-black px-4 py-2 rounded-md hover:bg-lime/90 transition-colors"
              >
                Go to Marketplace
              </a>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <img
              src="/placeholder.svg?height=150&width=150&text=Connect+Wallet"
              alt="Connect Wallet"
              className="w-32 h-32 mb-4 opacity-50"
            />
            <h3 className="text-xl text-lime mb-2">Connect Your Wallet</h3>
            <p className="text-gray-400 max-w-md mb-4">Please connect your wallet to view your NFT collection.</p>
          </div>
        )}
      </div>
    </main>
  )
}

