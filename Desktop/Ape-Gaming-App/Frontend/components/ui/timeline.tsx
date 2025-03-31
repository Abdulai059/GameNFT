"use client"
import { useScroll, useTransform, motion } from "framer-motion"
import type React from "react"
import { useEffect, useRef, useState } from "react"

interface TimelineEntry {
  title: string
  content: React.ReactNode
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setHeight(rect.height)
    }
  }, [ref])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  })

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <div className="w-full bg-black dark:bg-black font-sans md:px-6" ref={containerRef}>
      <div className="max-w-5xl mx-auto py-12 px-4 md:px-6 lg:px-8">
        <h2 className="text-lg md:text-3xl mb-3 text-lime dark:text-lime max-w-4xl">How It Works</h2>
        <p className="text-gray-300 dark:text-gray-300 text-xs md:text-sm max-w-sm">
          Learn how our blockchain gaming platform works and start earning rewards through play.
        </p>
      </div>

      <div ref={ref} className="relative max-w-5xl mx-auto pb-12">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-8 md:pt-24 md:gap-6">
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-32 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-8 absolute left-3 md:left-3 w-8 rounded-full bg-black dark:bg-black flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-lime/20 dark:bg-lime/20 border border-lime/30 dark:border-lime/30 p-1.5" />
              </div>
              <h3 className="hidden md:block text-lg md:pl-16 md:text-3xl font-bold text-lime/70 dark:text-lime/70">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-16 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-xl mb-3 text-left font-bold text-lime/70 dark:text-lime/70">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-lime/20 dark:via-lime/20 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-lime via-lime/50 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  )
}

