import { NavBarDemo } from "@/components/navbar-demo"
import { SignInPage } from "@/components/ui/sign-in"

export default function SignIn() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-black">
      {/* NavBar Demo */}
      <NavBarDemo />

      <div className="w-full flex-1 flex items-center justify-center pt-20">
        <SignInPage />
      </div>
    </main>
  )
}

