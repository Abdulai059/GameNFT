import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel"

export function NFTShowcaseSection() {
  return (
    <section id="nft-showcase" className="w-full py-8 sm:py-12 md:py-16 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-lime mb-4 sm:mb-6 md:mb-8 text-center">NFT Characters</h2>
        <p className="text-gray-300 text-center max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base">
          Explore our unique collection of NFT characters that you can collect, trade, and use in our game. Each
          character has unique abilities and attributes that will help you on your journey.
        </p>

        <div className="flex justify-center">
          <div className="w-full max-w-2xl sm:max-w-3xl">
            {" "}
            {/* Increased from max-w-xl sm:max-w-2xl */}
            <ThreeDPhotoCarousel />
          </div>
        </div>
      </div>
    </section>
  )
}

