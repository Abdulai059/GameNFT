"use client"

import type React from "react"

import { useState } from "react"
import { NavBarDemo } from "@/components/navbar-demo"
import { GameMenubar } from "@/components/game-menubar"
import { Card } from "@/components/ui/card"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { Coins, Gamepad, ShoppingCart, Wallet, Loader2 } from "lucide-react"
import Link from "next/link"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useWallet } from "@/contexts/wallet-context"
import { toast } from "@/hooks/use-toast"

export default function PlayGamePage() {
  const { walletAddress, apeBalance, updateApeBalance } = useWallet()
  const [gameCoins, setGameCoins] = useState<string>("")
  const [apeTokens, setApeTokens] = useState<string>("")
  const [isConverting, setIsConverting] = useState(false)

  // Calculate Ape tokens based on game coins (1 game coin = 0.1 Ape tokens)
  const handleGameCoinsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setGameCoins(value)

    if (value && !isNaN(Number.parseFloat(value))) {
      const tokens = Number.parseFloat(value) * 0.1
      setApeTokens(tokens.toFixed(2))
    } else {
      setApeTokens("")
    }
  }

  const handleConvert = () => {
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to convert coins.",
        variant: "destructive",
      })
      return
    }

    if (!gameCoins || isNaN(Number.parseFloat(gameCoins)) || Number.parseFloat(gameCoins) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount of game coins.",
        variant: "destructive",
      })
      return
    }

    setIsConverting(true)

    // Simulate conversion process
    setTimeout(() => {
      const convertedTokens = Number.parseFloat(apeTokens)
      const newBalance = apeBalance + convertedTokens

      updateApeBalance(newBalance)

      toast({
        title: "Conversion Successful",
        description: `Converted ${gameCoins} game coins to ${apeTokens} Ape tokens.`,
        variant: "default",
      })

      setGameCoins("")
      setApeTokens("")
      setIsConverting(false)
    }, 1500)
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-black">
      {/* NavBar Demo */}
      <NavBarDemo />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-4xl text-lime mb-4 md:mb-0">Ape Game Dashboard</h1>

          {/* Wallet Connection Button */}
          <WalletConnectButton />
        </div>

        {/* Game Menu */}
        <div className="mb-8">
          <GameMenubar />
        </div>

        {/* Quick Access Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/play-game" className="w-full">
            <Card className="bg-black border-lime/20 p-4 hover:border-lime/50 transition-colors cursor-pointer h-full">
              <div className="flex items-center">
                <div className="bg-lime/10 p-3 rounded-full mr-4">
                  <Coins className="h-6 w-6 text-lime" />
                </div>
                <div>
                  <h3 className="text-lime text-lg">Dashboard</h3>
                  <p className="text-gray-400 text-sm">View stats & convert coins</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/play-game/games" className="w-full">
            <Card className="bg-black border-lime/20 p-4 hover:border-lime/50 transition-colors cursor-pointer h-full">
              <div className="flex items-center">
                <div className="bg-lime/10 p-3 rounded-full mr-4">
                  <Gamepad className="h-6 w-6 text-lime" />
                </div>
                <div>
                  <h3 className="text-lime text-lg">Play Games</h3>
                  <p className="text-gray-400 text-sm">Choose from 2 exciting games</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/play-game/marketplace" className="w-full">
            <Card className="bg-black border-lime/20 p-4 hover:border-lime/50 transition-colors cursor-pointer h-full">
              <div className="flex items-center">
                <div className="bg-lime/10 p-3 rounded-full mr-4">
                  <ShoppingCart className="h-6 w-6 text-lime" />
                </div>
                <div>
                  <h3 className="text-lime text-lg">Marketplace</h3>
                  <p className="text-gray-400 text-sm">Mint unique Ape NFTs</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Game Dashboard */}
        <div className="grid grid-cols-1 gap-6">
          {/* Coin Converter */}
          <Card className="relative col-span-1 bg-black border-lime/20 overflow-hidden p-6">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h2 className="text-2xl text-lime mb-4 flex items-center">
                  <Coins className="mr-2 h-6 w-6" />
                  Coin Converter
                </h2>
                <p className="text-gray-300 mb-4">
                  Convert your game coins to Ape tokens that can be used to mint NFTs or trade on exchanges.
                </p>

                {walletAddress && (
                  <div className="flex items-center p-2 border border-lime/30 rounded-md bg-black/50 w-fit mb-4">
                    <Wallet className="h-4 w-4 text-lime mr-2" />
                    <span className="text-lime text-sm">Your Balance: {apeBalance.toFixed(2)} Ape Tokens</span>
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-gray-300 mb-2">Game Coins</label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={gameCoins}
                      onChange={handleGameCoinsChange}
                      className="w-full p-2 rounded-md bg-black border border-lime/30 text-lime focus:border-lime focus:outline-none"
                    />
                  </div>
                  <div className="text-center text-lime py-2 px-4">=</div>
                  <div className="flex-1">
                    <label className="block text-gray-300 mb-2">Ape Tokens</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={apeTokens}
                      className="w-full p-2 rounded-md bg-black border border-lime/30 text-lime focus:border-lime focus:outline-none"
                      readOnly
                    />
                  </div>
                  <button
                    className="bg-lime text-black px-6 py-2 rounded-md hover:bg-lime/90 transition-colors disabled:opacity-50 flex items-center"
                    disabled={!walletAddress || !gameCoins || isConverting}
                    onClick={handleConvert}
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      "Convert"
                    )}
                  </button>
                </div>

                {!walletAddress && (
                  <p className="mt-4 text-amber-400 text-sm flex items-center">
                    <Wallet className="h-4 w-4 mr-1" />
                    Connect your wallet to use the coin converter
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}

