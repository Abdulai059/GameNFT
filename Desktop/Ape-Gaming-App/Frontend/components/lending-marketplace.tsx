"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { Clock, AlertCircle, Loader2, Search, ArrowRight, Share2, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { NFT } from "@/types"
import { checkNFTBorrowStatus } from "@/lib/web3-utils"
import { ethers } from "ethers"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCollection } from "@/contexts/collection-context"

interface LendingMarketplaceProps {
  walletAddress: string | null
}

export function LendingMarketplace({ walletAddress }: LendingMarketplaceProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [borrowerAddress, setBorrowerAddress] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [borrowDuration, setBorrowDuration] = useState(5) // Default 5 days
  const [availableNFTs, setAvailableNFTs] = useState<NFT[]>([])
  const { collection } = useCollection()
  const [listedNFTs, setListedNFTs] = useState<number[]>([]) // Track NFTs listed for borrowing

  // Load available NFTs on mount
  useEffect(() => {
    // In a real app, you would fetch available NFTs from the contract
    // For now, we'll use mock data and add any user-listed NFTs
    const mockAvailableNFTs: NFT[] = [
      {
        id: 101,
        name: "Samurai Ape #101",
        image: "/NFT's-M/7.jpg",
        price: 10, // Daily borrowing price
        rarity: "Rare",
        traits: ["Laser Eyes", "Gold Chain", "Cyber Helmet"],
        xp: 250,
        level: 3,
        isBorrowed: false,
      },
      {
        id: 202,
        name: "Robot Ape #202",
        image: "/NFT's-M/2.avif",
        price: 15,
        rarity: "Epic",
        traits: ["Space Suit", "Oxygen Tank", "Moon Rock"],
        xp: 420,
        level: 5,
        isBorrowed: false,
      },
      {
        id: 303,
        name: "Ninja Ape #303",
        image: "/NFT's-M/5.avif",
        price: 20,
        rarity: "Legendary",
        traits: ["Katana", "Ninja Stars", "Shadow Cloak"],
        xp: 780,
        level: 8,
        isBorrowed: false,
      },
    ]

    // Load any previously listed NFTs from localStorage
    if (typeof window !== "undefined") {
      const savedListedNFTs = localStorage.getItem("listedNFTs")
      if (savedListedNFTs) {
        try {
          setListedNFTs(JSON.parse(savedListedNFTs))
        } catch (error) {
          console.error("Error parsing saved listed NFTs:", error)
          localStorage.removeItem("listedNFTs")
        }
      }
    }

    setAvailableNFTs(mockAvailableNFTs)
  }, [])

  // Update available NFTs when collection or listedNFTs changes
  useEffect(() => {
    // Add user's listed NFTs to available NFTs
    const userListedNFTs = collection.filter((nft) => listedNFTs.includes(nft.id))

    // Combine with mock NFTs, avoiding duplicates
    setAvailableNFTs((prevNFTs) => {
      const mockNFTs = prevNFTs.filter((nft) => nft.id >= 100) // Assuming mock NFTs have IDs >= 100
      return [...mockNFTs, ...userListedNFTs]
    })
  }, [collection, listedNFTs])

  // Filter NFTs based on search term
  const filteredAvailableNFTs = availableNFTs.filter((nft) => nft.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredMyNFTs = collection.filter(
    (nft) => !nft.isBorrowed && nft.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle listing an NFT for borrowing
  const handleListForBorrowing = (nft: NFT) => {
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    // Check if NFT is already listed
    if (listedNFTs.includes(nft.id)) {
      // Remove from listed NFTs
      const updatedListedNFTs = listedNFTs.filter((id) => id !== nft.id)
      setListedNFTs(updatedListedNFTs)

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("listedNFTs", JSON.stringify(updatedListedNFTs))
      }

      toast({
        title: "NFT Unlisted",
        description: `${nft.name} has been removed from the borrowing marketplace.`,
        variant: "default",
      })
    } else {
      // Add to listed NFTs
      const updatedListedNFTs = [...listedNFTs, nft.id]
      setListedNFTs(updatedListedNFTs)

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("listedNFTs", JSON.stringify(updatedListedNFTs))
      }

      toast({
        title: "NFT Listed for Borrowing",
        description: `${nft.name} is now available in the borrowing marketplace.`,
        variant: "default",
      })
    }
  }

  // Handle lending an NFT
  const handleLendNFT = async () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    if (!selectedNFT) {
      toast({
        title: "No NFT Selected",
        description: "Please select an NFT to lend.",
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
      const borrowStatus = await checkNFTBorrowStatus(selectedNFT.id)

      if (borrowStatus.success && borrowStatus.isBorrowed) {
        toast({
          title: "NFT Already Borrowed",
          description: "This NFT is already being borrowed by someone else.",
          variant: "destructive",
        })
        return
      }

      // This would call the lending function if it was implemented in the contract
      setTimeout(() => {
        toast({
          title: "NFT Lent Successfully",
          description: `Your NFT has been lent to ${borrowerAddress.slice(0, 6)}...${borrowerAddress.slice(-4)} for ${borrowDuration} days.`,
          variant: "default",
        })

        // Update the NFT status in the collection
        if (selectedNFT) {
          selectedNFT.isBorrowed = true
          selectedNFT.borrower = borrowerAddress
          selectedNFT.borrowExpiration = new Date(Date.now() + borrowDuration * 24 * 60 * 60 * 1000)
        }

        // Reset form
        setBorrowerAddress("")
        setSelectedNFT(null)
      }, 1500)
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

  // Handle borrowing an NFT
  const handleBorrowNFT = async (nft: NFT) => {
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // This would call the borrowing function if it was implemented in the contract
      setTimeout(() => {
        toast({
          title: "NFT Borrowed Successfully",
          description: `You have borrowed ${nft.name} for 5 days.`,
          variant: "default",
        })

        // Update the NFT status
        nft.isBorrowed = true
        nft.borrower = walletAddress
        nft.borrowExpiration = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)

        // Remove from available NFTs
        setAvailableNFTs(availableNFTs.filter((n) => n.id !== nft.id))

        // If it was a user-listed NFT, remove from listed NFTs
        if (listedNFTs.includes(nft.id)) {
          const updatedListedNFTs = listedNFTs.filter((id) => id !== nft.id)
          setListedNFTs(updatedListedNFTs)

          // Save to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("listedNFTs", JSON.stringify(updatedListedNFTs))
          }
        }
      }, 1500)
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

  // Get rarity color
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

  // If wallet not connected, show connection prompt
  if (!walletAddress) {
    return (
      <Card className="bg-black border-lime/20 p-4 mb-6">
        <div className="flex items-center text-gray-400 text-sm">
          <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
          <span>Connect your wallet to access the NFT lending marketplace</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="relative bg-black border-lime/20 p-4 mb-6 max-w-4xl mx-auto">
      <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={2} />
      <div className="flex flex-col gap-4 min-h-[800px]">
        <div>
          <h2 className="text-xl text-lime mb-2 flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            NFT Lending Marketplace
          </h2>
          <p className="text-gray-300 mb-4 text-sm">
            Lend your NFTs to earn passive income or borrow NFTs to use their abilities in games. All lending is for a
            fixed period of 5 days.
          </p>

          {/* Search bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search NFTs by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 p-2 rounded-md bg-black border border-lime/30 text-lime focus:border-lime focus:outline-none"
            />
          </div>

          <Tabs defaultValue="borrow" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black border border-lime/30">
              <TabsTrigger value="borrow" className="data-[state=active]:bg-lime data-[state=active]:text-black">
                Borrow NFTs
              </TabsTrigger>
              <TabsTrigger value="lend" className="data-[state=active]:bg-lime data-[state=active]:text-black">
                Lend Your NFTs
              </TabsTrigger>
            </TabsList>

            {/* Borrow Tab */}
            <TabsContent value="borrow" className="mt-4">
              {filteredAvailableNFTs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {filteredAvailableNFTs.map((nft) => (
                    <div
                      key={nft.id}
                      className="border border-lime/20 rounded-lg overflow-hidden bg-black/50 hover:border-lime/50 transition-colors"
                    >
                      <div className="relative">
                        {/* Increased height from h-64 to h-80 */}
                        <img
                          src={nft.image || "/placeholder.svg"}
                          alt={nft.name}
                          className="w-full h-80 object-cover"
                        />
                        <div
                          className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)} text-[8px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full`}
                        >
                          {nft.rarity}
                        </div>

                        {/* Show "Your NFT" badge if it's the user's NFT */}
                        {listedNFTs.includes(nft.id) && (
                          <div className="absolute bottom-2 left-2 bg-lime/80 text-black text-[8px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center">
                            <Check className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                            Your NFT
                          </div>
                        )}
                      </div>

                      <div className="p-3 sm:p-4">
                        <h3 className="text-lime font-medium text-sm mb-1 sm:mb-2">{nft.name}</h3>
                        <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                          {nft.traits.slice(0, 2).map((trait, i) => (
                            <span
                              key={i}
                              className="text-[8px] sm:text-[10px] bg-black/50 border border-lime/20 text-lime px-1 py-0.5 rounded-full truncate max-w-[60px] sm:max-w-none"
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
                        <div className="flex justify-between items-center">
                          <div className="text-lime text-[10px] sm:text-sm">
                            <span className="text-gray-300 text-[8px] sm:text-xs">Fee:</span> {nft.price} APE
                          </div>
                          <button
                            onClick={() => handleBorrowNFT(nft)}
                            disabled={isLoading}
                            className="bg-lime text-black text-[8px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-md hover:bg-lime/90 transition-colors flex items-center"
                          >
                            {isLoading ? (
                              <Loader2 className="h-2 w-2 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 animate-spin" />
                            ) : null}
                            Borrow Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-lime/20 rounded-lg">
                  <Clock className="h-12 w-12 text-lime/50 mx-auto mb-2" />
                  <h3 className="text-lime mb-1">No NFTs Available</h3>
                  <p className="text-gray-400 text-sm">There are currently no NFTs available for borrowing.</p>
                </div>
              )}
            </TabsContent>

            {/* Lend Tab */}
            <TabsContent value="lend" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NFT Selection */}
                <div className="md:col-span-2 border border-lime/20 rounded-lg p-4 bg-black/50">
                  <h3 className="text-lime mb-3">Select an NFT to Lend</h3>

                  {filteredMyNFTs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
                      {filteredMyNFTs.map((nft) => (
                        <div
                          key={nft.id}
                          className={`border ${selectedNFT?.id === nft.id ? "border-lime" : "border-lime/20"} rounded-lg overflow-hidden bg-black/50 hover:border-lime/50 transition-colors cursor-pointer`}
                        >
                          <div className="flex items-center p-2">
                            <img
                              src={nft.image || "/placeholder.svg"}
                              alt={nft.name}
                              className="w-32 h-32 object-cover rounded-md mr-3"
                            />
                            <div className="flex-1">
                              <h4 className="text-lime text-sm font-medium">{nft.name}</h4>
                              <div
                                className={`text-[10px] ${getRarityColor(nft.rarity)} inline-block px-1.5 py-0.5 rounded-full mt-1`}
                              >
                                {nft.rarity}
                              </div>
                            </div>

                            {/* Add List for Borrowing button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation() // Prevent selecting the NFT
                                handleListForBorrowing(nft)
                              }}
                              className={`ml-2 p-1.5 rounded-md text-xs flex items-center ${
                                listedNFTs.includes(nft.id)
                                  ? "bg-lime/20 text-lime border border-lime/50"
                                  : "bg-black/50 text-gray-300 border border-lime/20 hover:border-lime/50"
                              }`}
                            >
                              <Share2 className="h-3 w-3 mr-1" />
                              {listedNFTs.includes(nft.id) ? "Listed" : "List"}
                            </button>

                            {/* Add Direct Lend button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation() // Prevent selecting the NFT
                                setSelectedNFT(nft)
                              }}
                              className="ml-1 p-1.5 rounded-md text-xs bg-lime text-black hover:bg-lime/90"
                            >
                              Lend
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-8 w-8 text-amber-500/50 mx-auto mb-2" />
                      <h3 className="text-amber-500 mb-1">No NFTs Available</h3>
                      <p className="text-gray-400 text-sm">You don't have any NFTs available for lending.</p>
                    </div>
                  )}
                </div>

                {/* Lending Form */}
                <div className="border border-lime/20 rounded-lg p-4 bg-black/50">
                  <h3 className="text-lime mb-3">Lending Details</h3>

                  {selectedNFT ? (
                    <>
                      <div className="mb-4 p-3 border border-lime/20 rounded-lg bg-black/30">
                        <div className="flex items-center">
                          <img
                            src={selectedNFT.image || "/placeholder.svg"}
                            alt={selectedNFT.name}
                            className="w-28 h-28 object-cover rounded-md mr-3"
                          />
                          <div>
                            <h4 className="text-lime text-sm font-medium">{selectedNFT.name}</h4>
                            <div
                              className={`text-[10px] ${getRarityColor(selectedNFT.rarity)} inline-block px-1.5 py-0.5 rounded-full mt-1`}
                            >
                              {selectedNFT.rarity}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-300 mb-1 text-sm">Borrower Address</label>
                        <input
                          type="text"
                          placeholder="0x..."
                          value={borrowerAddress}
                          onChange={(e) => setBorrowerAddress(e.target.value)}
                          className="w-full p-2 rounded-md bg-black border border-lime/30 text-lime focus:border-lime focus:outline-none"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-300 mb-1 text-sm">Lending Duration</label>
                        <div className="flex items-center">
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={borrowDuration}
                            onChange={(e) => setBorrowDuration(Number.parseInt(e.target.value))}
                            className="flex-1 h-2 bg-black rounded-lg appearance-none cursor-pointer accent-lime"
                          />
                          <span className="ml-3 text-lime">{borrowDuration} days</span>
                        </div>
                      </div>

                      <div className="mb-4 p-3 border border-lime/20 rounded-lg bg-black/30">
                        <h4 className="text-lime text-sm mb-2">Lending Summary</h4>
                        <div className="flex justify-between text-xs text-gray-300 mb-1">
                          <span>NFT:</span>
                          <span>{selectedNFT.name}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-300 mb-1">
                          <span>Duration:</span>
                          <span>{borrowDuration} days</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-300 mb-1">
                          <span>Return Date:</span>
                          <span>
                            {new Date(Date.now() + borrowDuration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <button
                        className="w-full bg-lime text-black py-2 rounded-md font-medium hover:bg-lime/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        onClick={handleLendNFT}
                        disabled={isLoading || !borrowerAddress}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Lend NFT"
                        )}
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <ArrowRight className="h-8 w-8 text-lime/50 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Select an NFT from the list to start lending.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Card>
  )
}

