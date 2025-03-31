"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { UserPlus, LogOut, Menu, X, Home, User, HelpCircle, Gamepad2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-context"

interface NavItem {
  name: string
  url: string
  icon: string // Changed to string
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, signOut } = useAuth()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Set initial active tab based on current path
    if (pathname) {
      const currentItem = items.find(
        (item) => pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url)),
      )

      if (currentItem) {
        setActiveTab(currentItem.name)
      } else {
        // Default to first item if no match
        setActiveTab(items[0].name)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [items, pathname])

  // Handle navigation with smooth scrolling for anchor links
  const handleClick = (name: string, url: string, e: React.MouseEvent) => {
    setActiveTab(name)
    setMobileMenuOpen(false)

    // If it's an anchor link
    if (url.startsWith("/#")) {
      e.preventDefault()

      // If we're already on the homepage
      if (pathname === "/") {
        handleSmoothScroll(url.substring(1)) // Remove the leading "/"
      } else {
        // Navigate to homepage first, then scroll
        router.push("/")
        // Need to wait for navigation to complete
        setTimeout(() => {
          handleSmoothScroll(url.substring(1)) // Remove the leading "/"
        }, 100)
      }
    }
  }

  const handleSmoothScroll = (url: string) => {
    try {
      const targetId = url.slice(1) // Remove the # character
      const element = document.getElementById(targetId)

      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    } catch (error) {
      console.error("Error scrolling to element:", error)
    }
  }

  // Function to render the appropriate icon based on the string identifier
  const renderIcon = (iconName: string, size = 20) => {
    switch (iconName) {
      case "home":
        return <Home size={size} />
      case "user":
        return <User size={size} />
      case "help-circle":
        return <HelpCircle size={size} />
      case "gamepad-2":
        return <Gamepad2 size={size} />
      case "users":
        return <Users size={size} />
      default:
        return <Home size={size} />
    }
  }

  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50 pt-4 px-4 sm:px-8", className)}>
      <div className="flex items-center justify-between max-w-7xl mx-auto bg-transparent backdrop-blur-sm rounded-full border border-lime/20 p-2 md:bg-transparent md:border-0 md:p-0">
        {/* Logo or Brand - Left side */}
        <div className="md:hidden">
          <span className="text-lime font-bold">Ape NFT</span>
        </div>

        {/* Main Navigation - Desktop */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center gap-3 bg-background/5 border border-lime/20 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
            {items.map((item) => {
              const isActive = activeTab === item.name

              // Skip Play Game item if not authenticated
              if (item.name === "Play Game" && !isAuthenticated) {
                return null
              }

              return (
                <Link
                  key={item.name}
                  href={item.url}
                  onClick={(e) => handleClick(item.name, item.url, e)}
                  className={cn(
                    "relative cursor-pointer text-sm font-normal px-6 py-2 rounded-full transition-colors",
                    "text-lime hover:text-lime/90",
                    isActive && "bg-lime/10 text-lime",
                  )}
                >
                  <span className="inline">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-lime/5 rounded-full -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-lime rounded-t-full">
                        <div className="absolute w-12 h-6 bg-lime/30 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-lime/40 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-lime/50 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Mobile menu button - Right side */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black/80 border border-lime/20 text-lime"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:block ml-4">
          {isAuthenticated ? (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1 border border-lime/20 text-lime font-normal px-4 py-2 rounded-full hover:bg-lime/10 transition-colors"
            >
              <LogOut size={16} className="md:mr-1" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          ) : (
            <Link href="/signup">
              <button className="flex items-center gap-1 bg-lime text-black font-normal px-4 py-2 rounded-full hover:bg-lime/90 transition-colors shadow-lg">
                <UserPlus size={16} className="md:mr-1" />
                <span className="hidden md:inline">Sign Up</span>
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden fixed top-20 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-lime/20"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              {items.map((item) => {
                // Skip Play Game item if not authenticated
                if (item.name === "Play Game" && !isAuthenticated) {
                  return null
                }

                return (
                  <Link
                    key={item.name}
                    href={item.url}
                    onClick={(e) => handleClick(item.name, item.url, e)}
                    className={cn(
                      "flex items-center gap-2 text-lime hover:text-lime/90 px-4 py-2 rounded-lg transition-colors",
                      activeTab === item.name && "bg-lime/10"
                    )}
                  >
                    {renderIcon(item.icon)}
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-lime/20">
              {isAuthenticated ? (
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-lime hover:text-lime/90 px-4 py-2 rounded-lg transition-colors w-full"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/signin" className="block">
                    <button className="flex items-center gap-2 border border-lime/20 text-lime px-4 py-2 rounded-lg hover:bg-lime/10 transition-colors w-full">
                      <User size={20} />
                      <span>Sign In</span>
                    </button>
                  </Link>
                  <Link href="/signup" className="block">
                    <button className="flex items-center gap-2 bg-lime text-black px-4 py-2 rounded-lg hover:bg-lime/90 transition-colors w-full">
                      <UserPlus size={20} />
                      <span>Sign Up</span>
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

