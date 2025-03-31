"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { NFT } from "@/types"

type CollectionContextType = {
  collection: NFT[]
  addToCollection: (nft: NFT) => void
  removeFromCollection: (nftId: number) => void
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined)

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [collection, setCollection] = useState<NFT[]>([])

  // Load collection from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCollection = localStorage.getItem("nftCollection")

      if (savedCollection) {
        try {
          setCollection(JSON.parse(savedCollection))
        } catch (error) {
          console.error("Error parsing saved collection:", error)
          localStorage.removeItem("nftCollection")
        }
      }
    }
  }, [])

  const addToCollection = (nft: NFT) => {
    // Check if NFT already exists in collection
    if (!collection.some((item) => item.id === nft.id)) {
      const updatedCollection = [...collection, nft]
      setCollection(updatedCollection)

      if (typeof window !== "undefined") {
        localStorage.setItem("nftCollection", JSON.stringify(updatedCollection))
      }
    }
  }

  const removeFromCollection = (nftId: number) => {
    const updatedCollection = collection.filter((nft) => nft.id !== nftId)
    setCollection(updatedCollection)

    if (typeof window !== "undefined") {
      localStorage.setItem("nftCollection", JSON.stringify(updatedCollection))
    }
  }

  return (
    <CollectionContext.Provider
      value={{
        collection,
        addToCollection,
        removeFromCollection,
      }}
    >
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollection() {
  const context = useContext(CollectionContext)

  if (context === undefined) {
    throw new Error("useCollection must be used within a CollectionProvider")
  }

  return context
}

