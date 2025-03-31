"use client"

import { memo, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useAnimation, useMotionValue, useTransform } from "framer-motion"

export const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

type UseMediaQueryOptions = {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

export function useMediaQuery(
  query: string,
  { defaultValue = false, initializeWithValue = true }: UseMediaQueryOptions = {},
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue
    }
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })

  const handleChange = () => {
    setMatches(getMatches(query))
  }

  useIsomorphicLayoutEffect(() => {
    if (IS_SERVER) return undefined

    const matchMedia = window.matchMedia(query)
    handleChange()

    // Use the newer addEventListener API if available
    if (matchMedia.addEventListener) {
      matchMedia.addEventListener("change", handleChange)
      return () => {
        matchMedia.removeEventListener("change", handleChange)
      }
    } else {
      // Fallback for older browsers
      matchMedia.addListener(handleChange)
      return () => {
        matchMedia.removeListener(handleChange)
      }
    }
  }, [query])

  return matches
}

const duration = 0.15
const transition = { duration, ease: [0.32, 0.72, 0, 1], filter: "blur(4px)" }
const transitionOverlay = { duration: 0.5, ease: [0.32, 0.72, 0, 1] }

const Carousel = memo(
  ({
    handleClick,
    controls,
    cards,
    isCarouselActive,
  }: {
    handleClick: (imgUrl: string, index: number) => void
    controls: any
    cards: string[]
    isCarouselActive: boolean
  }) => {
    const isScreenSizeSm = useMediaQuery("(max-width: 640px)")
    // Increased cylinder width for better visibility
    const cylinderWidth = isScreenSizeSm ? 1200 : 1800 // Increased from 400/600
    const faceCount = cards.length
    const faceWidth = cylinderWidth / faceCount
    const radius = cylinderWidth / (2 * Math.PI)
    const rotation = useMotionValue(0)
    const transform = useTransform(rotation, (value) => `rotate3d(0, 1, 0, ${value}deg)`)

    // Auto-rotation effect
    useEffect(() => {
      if (isCarouselActive) {
        const interval = setInterval(() => {
          rotation.set(rotation.get() + 0.5) // Slow, gentle rotation
        }, 50)

        return () => clearInterval(interval)
      }
    }, [isCarouselActive, rotation])

    return (
      <div
        className="flex h-full items-center justify-center bg-black"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div
          drag={isCarouselActive ? "x" : false}
          className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
          style={{
            transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          onDrag={(_, info) => isCarouselActive && rotation.set(rotation.get() + info.offset.x * 0.05)}
          onDragEnd={(_, info) =>
            isCarouselActive &&
            controls.start({
              rotateY: rotation.get() + info.velocity.x * 0.05,
              transition: {
                type: "spring",
                stiffness: 100,
                damping: 30,
                mass: 0.1,
              },
            })
          }
          animate={controls}
        >
          {cards.map((imgUrl, i) => (
            <motion.div
              key={`key-${imgUrl}-${i}`}
              className="absolute flex h-full origin-center items-center justify-center rounded-xl bg-black p-3" // Increased padding from p-2
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
              }}
              onClick={() => handleClick(imgUrl, i)}
            >
              <motion.img
                src={imgUrl}
                alt={`NFT Character ${i + 1}`}
                layoutId={`img-${imgUrl}`}
                className="pointer-events-none w-full rounded-xl object-cover aspect-square border border-lime/20 hover:border-lime/50 transition-all"
                initial={{ filter: "blur(4px)" }}
                layout="position"
                animate={{ filter: "blur(0px)" }}
                transition={transition}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  },
)

Carousel.displayName = "Carousel"

function ThreeDPhotoCarousel() {
  const [activeImg, setActiveImg] = useState<string | null>(null)
  const [isCarouselActive, setIsCarouselActive] = useState(true)
  const controls = useAnimation()

  // 10 NFT character images with increased size
  const nftCharacters = useMemo(
    () => [
      "/NFT's-M/1.avif", // Increased from 250x250
      "/NFT's-M/2.avif",
      "/NFT's-M/3.avif",
      "/nft/monkey.jpg",
      "/NFT's-M/5.avif",
      "/NFT's-M/6.jpg",
      "/NFT's-M/7.jpg",
      "/NFT's-M/8.avif",
      "/NFT's-M/12.avif",
      "/NFT's-M/15.avif",
    ],
    [],
  )

  const handleClick = (imgUrl: string) => {
    setActiveImg(imgUrl)
    setIsCarouselActive(false)
    controls.stop()
  }

  const handleClose = () => {
    setActiveImg(null)
    setIsCarouselActive(true)
  }

  return (
    <motion.div layout className="relative">
      <AnimatePresence mode="sync">
        {activeImg && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            layoutId={`img-container-${activeImg}`}
            layout="position"
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 m-5 md:m-36 lg:mx-[19rem] rounded-3xl"
            style={{ willChange: "opacity" }}
            transition={transitionOverlay}
          >
            <motion.img
              layoutId={`img-${activeImg}`}
              src={activeImg}
              className="max-w-full max-h-full rounded-lg shadow-lg border-2 border-lime"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.5,
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{
                willChange: "transform",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Increased height for carousel */}
      <div className="relative h-[450px] w-full overflow-hidden"> {/* Increased from h-[350px] */}
        <Carousel
          handleClick={handleClick}
          controls={controls}
          cards={nftCharacters}
          isCarouselActive={isCarouselActive}
        />
      </div>
    </motion.div>
  )
}

export { ThreeDPhotoCarousel }

