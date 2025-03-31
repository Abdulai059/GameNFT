import { NavBarDemo } from "@/components/navbar-demo"
import { SplineSceneBasic } from "@/components/spline-scene-demo"
import { AboutUsSection } from "@/components/about-us-section"
import { TeamSection } from "@/components/team-section"
import { NFTShowcaseSection } from "@/components/nft-showcase-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-black">
      {/* NavBar Demo */}
      <NavBarDemo />

      {/* Spline Scene Demo */}
      <div className="w-full max-w-7xl mt-16 px-4">
        <SplineSceneBasic />
      </div>

      {/* About Us Section */}
      <div id="about" className="w-full">
        <AboutUsSection />
      </div>

      {/* Team Section */}
      <div id="team" className="w-full">
        <TeamSection />
      </div>

      {/* NFT Showcase Section */}
      <div id="nft-showcase" className="w-full">
        <NFTShowcaseSection />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}

