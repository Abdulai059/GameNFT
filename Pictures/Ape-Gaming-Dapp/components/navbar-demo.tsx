import { NavBar } from "@/components/ui/tubelight-navbar"

export function NavBarDemo() {
  const navItems = [
    { name: "Home", url: "/", icon: "home" },
    { name: "About", url: "/#about", icon: "user" },
    { name: "How it Works", url: "/how-it-works", icon: "help-circle" },
    { name: "Play Game", url: "/play-game", icon: "gamepad-2" },
    { name: "Team", url: "/#team", icon: "users" },
  ]

  return <NavBar items={navItems} className="z-50" />
}

