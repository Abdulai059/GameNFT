import Image from "next/image"
import { Timeline } from "@/components/ui/timeline"

export function HowItWorksTimeline() {
  const data = [
    {
      title: "Step 1: Connect Wallet",
      content: (
        <div>
          <p className="text-gray-300 dark:text-gray-300 text-xs md:text-sm font-normal mb-4">
            Connect your cryptocurrency wallet to securely store your earned tokens and NFTs.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-black/50 border border-lime/20 p-4 rounded-lg">
              <h4 className="text-lime mb-2 text-sm">Supported Wallets</h4>
              <div className="flex flex-wrap gap-2">
                <span className="text-gray-300 text-xs bg-black/30 px-2 py-1 rounded-full border border-lime/10">
                  MetaMask
                </span>
                <span className="text-gray-300 text-xs bg-black/30 px-2 py-1 rounded-full border border-lime/10">
                  Coinbase
                </span>
                <span className="text-gray-300 text-xs bg-black/30 px-2 py-1 rounded-full border border-lime/10">
                  WalletConnect
                </span>
              </div>
            </div>
            <Image
              src="/placeholder.svg?height=200&width=400&text=Connect+Wallet"
              alt="Connect Wallet"
              width={400}
              height={200}
              className="rounded-lg object-cover h-40 w-full border border-lime/20"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 2: Mint NFTs",
      content: (
        <div>
          <p className="text-gray-300 dark:text-gray-300 text-xs md:text-sm font-normal mb-4">
            Use earned tokens to mint unique NFT characters with special abilities that enhance gameplay.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/placeholder.svg?height=150&width=150&text=Cyber+Ape"
              alt="Cyber Ape NFT"
              width={150}
              height={150}
              className="rounded-lg object-cover h-32 w-full border border-lime/20"
            />
            <Image
              src="/placeholder.svg?height=150&width=150&text=Space+Ape"
              alt="Space Ape NFT"
              width={150}
              height={150}
              className="rounded-lg object-cover h-32 w-full border border-lime/20"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 3: Play Games",
      content: (
        <div>
          <p className="text-gray-300 dark:text-gray-300 text-xs md:text-sm font-normal mb-4">
            Choose from our blockchain-powered games and earn rewards through gameplay achievements.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/placeholder.svg?height=150&width=250&text=Ape+Runner"
              alt="Ape Runner Game"
              width={250}
              height={150}
              className="rounded-lg object-cover h-32 w-full border border-lime/20"
            />
            <Image
              src="/placeholder.svg?height=150&width=250&text=Crypto+Clash"
              alt="Crypto Clash Game"
              width={250}
              height={150}
              className="rounded-lg object-cover h-32 w-full border border-lime/20"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 4: Trade & Earn",
      content: (
        <div>
          <p className="text-gray-300 dark:text-gray-300 text-xs md:text-sm font-normal mb-4">
            Trade NFTs in our marketplace or use them to earn more rewards. Convert game coins to Ape Tokens.
          </p>
          <div className="mb-4 bg-black/50 border border-lime/20 p-3 rounded-lg">
            <h4 className="text-lime mb-2 text-sm">Earning Potential</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-gray-300 text-xs">✅ Up to 500 coins per game</div>
              <div className="text-gray-300 text-xs">✅ NFTs boost earnings by 25%</div>
            </div>
          </div>
          <Image
            src="/placeholder.svg?height=150&width=400&text=Marketplace"
            alt="Marketplace Trading"
            width={400}
            height={150}
            className="rounded-lg object-cover w-full h-32 border border-lime/20"
          />
        </div>
      ),
    },
  ]
  return (
    <div className="min-h-screen w-full bg-black">
      <Timeline data={data} />
    </div>
  )
}

