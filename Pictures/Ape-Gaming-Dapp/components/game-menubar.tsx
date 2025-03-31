"use client"

import Link from "next/link"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Gamepad, Trophy, Users, Wallet, ShoppingCart, BarChart, Home, Coins } from "lucide-react"

export function GameMenubar() {
  return (
    <Menubar className="border-lime/20 bg-black/80 backdrop-blur-md">
      <Link href="/play-game" className="inline-block">
        <MenubarMenu>
          <MenubarTrigger className="text-lime hover:bg-lime/10 cursor-pointer">
            <BarChart className="mr-2 size-4 text-lime" />
            Dashboard
          </MenubarTrigger>
          <MenubarContent className="bg-black border-lime/20">
            <Link href="/play-game">
              <MenubarItem className="text-lime hover:bg-lime/10 cursor-pointer">
                <BarChart className="mr-2 size-4 text-lime" />
                Overview
              </MenubarItem>
            </Link>
            <Link href="/play-game/coins">
              <MenubarItem className="text-lime hover:bg-lime/10 cursor-pointer">
                <Coins className="mr-2 size-4 text-lime" />
                Coin Converter
              </MenubarItem>
            </Link>
            <MenubarSeparator className="bg-lime/10" />
            <Link href="/">
              <MenubarItem className="text-lime hover:bg-lime/10 cursor-pointer">
                <Home className="mr-2 size-4 text-lime" />
                Back to Website
              </MenubarItem>
            </Link>
          </MenubarContent>
        </MenubarMenu>
      </Link>

      <Link href="/play-game/games" className="inline-block">
        <MenubarMenu>
          <MenubarTrigger className="text-lime hover:bg-lime/10 cursor-pointer">
            <Gamepad className="mr-2 size-4 text-lime" />
            Play
          </MenubarTrigger>
          <MenubarContent className="bg-black border-lime/20">
            <Link href="/play-game/games">
              <MenubarItem className="text-lime hover:bg-lime/10 cursor-pointer">
                <Gamepad className="mr-2 size-4 text-lime" />
                All Games
              </MenubarItem>
            </Link>
            <MenubarSeparator className="bg-lime/10" />
            <Link href="/play-game/leaderboard">
              <MenubarItem className="text-lime hover:bg-lime/10 cursor-pointer">
                <Trophy className="mr-2 size-4 text-lime" />
                Leaderboard
              </MenubarItem>
            </Link>
          </MenubarContent>
        </MenubarMenu>
      </Link>

      <Link href="/play-game/marketplace" className="inline-block">
        <MenubarMenu>
          <MenubarTrigger className="text-lime hover:bg-lime/10 cursor-pointer">
            <ShoppingCart className="mr-2 size-4 text-lime" />
            Marketplace
          </MenubarTrigger>
          <MenubarContent className="bg-black border-lime/20">
            <Link href="/play-game/marketplace">
              <MenubarItem className="text-lime hover:bg-lime/10 cursor-pointer">
                <Users className="mr-2 size-4 text-lime" />
                Mint Ape NFT
              </MenubarItem>
            </Link>
            <Link href="/play-game/marketplace/collection">
              <MenubarItem className="text-lime hover:bg-lime/10 cursor-pointer">
                <ShoppingCart className="mr-2 size-4 text-lime" />
                My Collection
              </MenubarItem>
            </Link>
            <MenubarSeparator className="bg-lime/10" />
            <Link href="/play-game/wallet">
              <MenubarItem className="text-lime hover:bg-lime/10 cursor-pointer">
                <Wallet className="mr-2 size-4 text-lime" />
                Wallet
              </MenubarItem>
            </Link>
          </MenubarContent>
        </MenubarMenu>
      </Link>
    </Menubar>
  )
}

