"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type User = {
  id: string
  email: string
}

type AuthContextType = {
  user: User | null
  signUp: (email: string, password: string) => Promise<{ error: any | null }>
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signOut: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Simple mock authentication
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is already logged in from localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      }
    } catch (e) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("user")
      }
      console.error("Error parsing stored user:", e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Protect routes that require authentication
  useEffect(() => {
    if (!isLoading && !user && pathname?.startsWith("/play-game")) {
      router.push("/signup")
    }
  }, [user, pathname, router, isLoading])

  const signUp = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        return { error: "Email and password are required" }
      }

      // Create a mock user
      const newUser = { id: Date.now().toString(), email }
      setUser(newUser)

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(newUser))
      }

      router.push("/play-game")
      return { error: null }
    } catch (error) {
      console.error("Sign up error:", error)
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        return { error: "Email and password are required" }
      }

      // Create a mock user
      const newUser = { id: Date.now().toString(), email }
      setUser(newUser)

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(newUser))
      }

      router.push("/play-game")
      return { error: null }
    } catch (error) {
      console.error("Sign in error:", error)
      return { error }
    }
  }

  const signOut = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
    router.push("/")
  }

  const authValue = {
    user,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

