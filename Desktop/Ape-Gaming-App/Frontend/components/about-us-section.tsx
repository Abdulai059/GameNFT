"use client"

import type React from "react"

import { Box, Code, Gamepad, Users } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { cn } from "@/lib/utils"

export function AboutUsSection() {
  return (
    <section className="w-full py-16 bg-black">
      <div className="container px-4 mx-auto">
        <h2 className="text-4xl text-lime mb-12 text-center">About Us</h2>

        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-2 lg:gap-6">
          <GridItem
            area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
            icon={<Gamepad className="h-4 w-4 text-lime" />}
            title="Play to Earn"
            description="Experience our revolutionary blockchain gaming platform where every achievement translates to real-world rewards."
          />
          <GridItem
            area="md:[grid-area:1/7/2/13] xl:[grid-area:1/5/2/9]"
            icon={<Users className="h-4 w-4 text-lime" />}
            title="Join Our Community"
            description="Connect with thousands of players worldwide who are already part of our growing ecosystem."
          />
          <GridItem
            area="md:[grid-area:2/1/3/7] xl:[grid-area:1/9/2/13]"
            icon={<Box className="h-4 w-4 text-lime" />}
            title="NFT Marketplace"
            description="Trade unique in-game assets on our secure marketplace, built with the latest blockchain technology."
          />
          <GridItem
            area="md:[grid-area:2/7/3/13] xl:[grid-area:2/1/3/7]"
            icon={<Code className="h-4 w-4 text-lime" />}
            title="Built on Web3"
            description="Our platform leverages decentralized technology to ensure transparency, security, and true ownership of your digital assets."
          />
          <GridItem
            area="md:[grid-area:3/1/4/13] xl:[grid-area:2/7/3/13]"
            icon={<Gamepad className="h-4 w-4 text-lime" />}
            title="Multiple Game Worlds"
            description="Explore diverse gaming environments, each with unique gameplay mechanics and earning opportunities."
          />
        </ul>
      </div>
    </section>
  )
}

interface GridItemProps {
  area: string
  icon: React.ReactNode
  title: string
  description: React.ReactNode
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-lime/20 p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-lime/10 bg-black p-6 shadow-sm md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-lime/20 bg-black/50 p-2">{icon}</div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-normal font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-lime">
                {title}
              </h3>
              <p className="font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-gray-300">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

