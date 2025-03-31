import { NavBarDemo } from "@/components/navbar-demo"
import { HowItWorksTimeline } from "@/components/how-it-works-timeline"
import { Footer } from "@/components/footer"

export default function HowItWorksPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-black">
      {/* NavBar Demo */}
      <NavBarDemo />

      <div className="w-full pt-16">
        <HowItWorksTimeline />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}

