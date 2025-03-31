"use client"
import { useState } from "react"
import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"
import { useAuth } from "@/components/auth-context"

function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await signIn(email, password)
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = () => {
    // Mock social sign in
    signIn("demo@example.com", "password")
  }

  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <Card className="w-full sm:w-96 bg-black border-lime/20">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-lime">Sign in to your account</CardTitle>
            <CardDescription className="text-gray-300">
              Welcome back! Enter your credentials to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-y-4">
            <div className="grid grid-cols-2 gap-x-4">
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={handleSocialSignIn}
                className="border-lime/20 text-lime hover:bg-lime/10 hover:text-lime"
              >
                <Icons.gitHub className="mr-2 size-4" />
                GitHub
              </Button>
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={handleSocialSignIn}
                className="border-lime/20 text-lime hover:bg-lime/10 hover:text-lime"
              >
                <Icons.google className="mr-2 size-4" />
                Google
              </Button>
            </div>

            <p className="flex items-center gap-x-3 text-sm text-gray-400 before:h-px before:flex-1 before:bg-lime/20 after:h-px after:flex-1 after:bg-lime/20">
              or
            </p>

            <div className="space-y-2">
              <Label className="text-gray-300">Email address</Label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black border-lime/20 text-lime focus:border-lime focus:ring-lime"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Password</Label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black border-lime/20 text-lime focus:border-lime focus:ring-lime"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button variant="link" size="sm" className="justify-end text-lime hover:text-lime/80">
              Forgot password?
            </Button>
          </CardContent>

          <CardFooter>
            <div className="grid w-full gap-y-4">
              <Button type="submit" disabled={isLoading} className="bg-lime text-black hover:bg-lime/90">
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              <Button variant="link" size="sm" asChild className="text-lime hover:text-lime/80">
                <Link href="/signup">Don't have an account? Sign up</Link>
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export { SignInPage }

