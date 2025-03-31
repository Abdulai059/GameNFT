"use client"

import type React from "react"

import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function PlayGameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Short delay to ensure auth state is loaded
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!isAuthenticated) {
        router.push("/signup")
      }
    }, 300) // Increased from 100ms for more reliable loading

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 text-lime animate-spin" />
          <div className="text-lime">Loading...</div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

