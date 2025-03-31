"use client"

import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { FlippingApeNFTs } from "@/components/flipping-ape-nfts"

export function SplineSceneBasic() {
  return (
    <Card className="w-full h-auto min-h-[400px] sm:min-h-[450px] md:h-[500px] bg-black border-black relative overflow-hidden">
      {/* Hero Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        // style={{ backgroundImage: 'url("/images/hero-background.jpg")' }}
      >
        <div className="absolute inset-0 bg-black/40"></div> {/* Overlay to ensure text readability */}
      </div>

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 z-10" fill="white" />

      <div className="flex flex-col md:flex-row h-full bg-transparent relative z-10">
        {/* Content - Always first in the DOM order for better SEO and mobile display */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 relative z-10 flex flex-col justify-center bg-transparent order-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 text-center md:text-left">
            Ape NFT Collection
          </h1>
          <p className="mt-2 sm:mt-3 md:mt-4 text-neutral-300 max-w-lg text-sm sm:text-base text-center md:text-left">
            Discover our exclusive collection of unique Ape NFTs. Each NFT has special traits and abilities that enhance
            your gameplay experience and earn you more rewards.
          </p>
        </div>

        {/* NFT Display - Second in DOM order */}
        <div className="flex-1 relative bg-transparent flex items-center justify-center py-6 md:py-0 order-2">
          <FlippingApeNFTs />
        </div>
      </div>
    </Card>
  )
}

