import { NavBarDemo } from "@/components/navbar-demo"
import { SignUpPage } from "@/components/ui/sign-up"

export default function SignUp() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-black">
      {/* NavBar Demo */}
      <NavBarDemo />

      <div className="w-full flex-1 flex items-center justify-center pt-20">
        <SignUpPage />
      </div>
    </main>
  )
}

