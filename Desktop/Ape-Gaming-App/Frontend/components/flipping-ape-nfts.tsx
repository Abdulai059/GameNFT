"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/components/ui/3d-carousel" // Reusing the media query hook

export function FlippingApeNFTs() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Array of 10 Ape NFT images with their traits and rarity
  const apeNFTs = [
    {
      image: "/nft/monkey.jpg",
      name: "Cyber Ape #001",
      rarity: "Rare",
      traits: ["Laser Eyes", "Gold Chain", "Cyber Helmet"],
    },
    {
      image: "/nft/monkey-3.jpg",
      name: "Space Ape #042",
      rarity: "Epic",
      traits: ["Space Suit", "Oxygen Tank", "Moon Rock"],
    },
    {
      image: "/nft/monkey-4.jpg",
      name: "Pirate Ape #107",
      rarity: "Uncommon",
      traits: ["Eye Patch", "Pirate Hat", "Parrot"],
    },
    {
      image: "/NFT's-M/13.avif",
      name: "Zombie Ape #256",
      rarity: "Legendary",
      traits: ["Katana", "Ninja Stars", "Shadow Cloak"],
    },
    {
      image: "/nft/monkey-10.jpg",
      name: "Wizard Ape #38",
      rarity: "Epic",
      traits: ["Magic Staff", "Wizard Hat", "Spell Book"],
    },
    {
      image: "/NFT's-M/2.avif",
      name: "Robot Ape #512",
      rarity: "Mythic",
      traits: ["Metal Body", "Laser Arm", "Digital Brain"],
    },
    {
      image: "/nft/monkey-5.jpg",
      name: "Samurai Ape #628",
      rarity: "Legendary",
      traits: ["Samurai Armor", "Dual Swords", "War Fan"],
    },
    {
      image: "/NFT's-M/12.avif",
      name: "Zombie Ape #731",
      rarity: "Rare",
      traits: ["Decaying Skin", "Glowing Eyes", "Brain Exposure"],
    },
    {
      image: "/nft/OIP.jpg",
      name: "Hacker Ape #845",
      rarity: "Epic",
      traits: ["VR Headset", "Holographic Keyboard", "Data Gloves"],
    },
    {
      image: "/NFT's-M/5.avif",
      name: "King Ape #999",
      rarity: "Mythic",
      traits: ["Golden Crown", "Royal Cape", "Diamond Scepter"],
    },
  ]

  // Auto-flip to the next NFT every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % apeNFTs.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [apeNFTs.length])

  // Get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "bg-purple-900/50 text-purple-300"
      case "Mythic":
        return "bg-red-900/50 text-red-300"
      case "Epic":
        return "bg-blue-900/50 text-blue-300"
      case "Rare":
        return "bg-green-900/50 text-green-300"
      default:
        return "bg-gray-800 text-gray-300"
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{
              rotateY: 90,
              opacity: 0,
              z: -100,
              scale: 0.8,
            }}
            animate={{
              rotateY: 0,
              opacity: 1,
              z: 0,
              scale: 1,
              y: [0, -10, 0],
            }}
            exit={{
              rotateY: -90,
              opacity: 0,
              z: -100,
              scale: 0.8,
            }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              opacity: { duration: 0.4 },
              y: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                duration: 2,
                ease: "easeInOut",
              },
            }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
          >
            <div className="relative w-full h-full p-2 sm:p-4">
              <motion.div
                className="w-full h-full relative overflow-hidden rounded-2xl border-2 border-lime/50 shadow-[0_0_15px_rgba(204,255,0,0.3)] lime-glow"
                whileHover={{
                  scale: 1.03,
                  rotateZ: 1,
                  transition: { duration: 0.3 },
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <img
                  src={apeNFTs[currentIndex].image || "/placeholder.svg"}
                  alt={apeNFTs[currentIndex].name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 sm:p-4">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lime text-sm sm:text-base md:text-lg lg:text-xl font-medium truncate">
                      {apeNFTs[currentIndex].name}
                    </h3>
                    <span
                      className={`text-[8px] sm:text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded ${getRarityColor(apeNFTs[currentIndex].rarity)}`}
                    >
                      {apeNFTs[currentIndex].rarity}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
                    {apeNFTs[currentIndex].traits.slice(0, isMobile ? 2 : 3).map((trait, index) => (
                      <span
                        key={index}
                        className="text-[8px] sm:text-xs bg-black/50 border border-lime/20 text-lime px-1 sm:px-2 py-0.5 sm:py-1 rounded-full truncate"
                      >
                        {trait}
                      </span>
                    ))}
                    {apeNFTs[currentIndex].traits.length > (isMobile ? 2 : 3) && (
                      <span className="text-[8px] sm:text-xs bg-black/50 border border-lime/20 text-lime px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">
                        +{apeNFTs[currentIndex].traits.length - (isMobile ? 2 : 3)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Holographic effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-lime/5 to-transparent opacity-50 pointer-events-none"></div>
                <motion.div
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(204,255,0,0.15),transparent_70%)] pointer-events-none"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.7, 0.5],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* NFT Indicators */}
        <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {apeNFTs.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-lime" : "bg-lime/30"
              }`}
              aria-label={`View ${apeNFTs[index].name}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

