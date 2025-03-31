import { NavBarDemo } from "@/components/navbar-demo"
import { GameMenubar } from "@/components/game-menubar"
import { Card } from "@/components/ui/card"
import { Coins } from "lucide-react"

export default function GamesPage() {
  // Game data with images
  const games = [
    {
      id: 1,
      name: "Ape Runner",
      image: "/placeholder.svg?height=300&width=500&text=Ape+Runner",
      description:
        "Run through the crypto jungle collecting coins and avoiding obstacles. The further you run, the more coins you earn!",
      rewards: "Up to 500 coins per run",
      difficulty: "Easy",
      playTime: "2-5 minutes",
    },
    {
      id: 2,
      name: "Crypto Clash",
      image: "/placeholder.svg?height=300&width=500&text=Crypto+Clash",
      description:
        "Battle other players in this strategic card game. Use your NFT abilities to gain an advantage and earn massive rewards.",
      rewards: "200-1000 coins per win",
      difficulty: "Medium",
      playTime: "5-15 minutes",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center bg-black">
      {/* NavBar Demo */}
      <NavBarDemo />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-4xl text-lime mb-8 text-center">Play Games</h1>

        {/* Game Menu */}
        <div className="mb-8">
          <GameMenubar />
        </div>

        {/* Games Grid - Reduced size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {games.map((game) => (
            <Card key={game.id} className="bg-black border-lime/20 overflow-hidden group">
              {/* Game Image - Reduced height */}
              <div className="relative">
                <img
                  src={game.image || "/placeholder.svg"}
                  alt={game.name}
                  className="w-full h-48 object-cover" /* Reduced from h-64 */
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <h3 className="absolute bottom-4 left-4 text-xl text-lime font-medium">{game.name}</h3>{" "}
                {/* Reduced from text-2xl */}
              </div>

              {/* Game Info - More compact */}
              <div className="p-4">
                {" "}
                {/* Reduced from p-6 */}
                <p className="text-gray-300 mb-4 text-sm">{game.description}</p> {/* Added text-sm */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {" "}
                  {/* Reduced gap from 4 to 2 */}
                  <div className="bg-black/50 border border-lime/20 p-2 rounded-md">
                    {" "}
                    {/* Reduced from p-3 */}
                    <div className="text-gray-400 text-xs">Rewards</div>
                    <div className="text-lime text-sm">{game.rewards}</div> {/* Added text-sm */}
                  </div>
                  <div className="bg-black/50 border border-lime/20 p-2 rounded-md">
                    <div className="text-gray-400 text-xs">Difficulty</div>
                    <div className="text-lime text-sm">{game.difficulty}</div>
                  </div>
                  <div className="bg-black/50 border border-lime/20 p-2 rounded-md">
                    <div className="text-gray-400 text-xs">Play Time</div>
                    <div className="text-lime text-sm">{game.playTime}</div>
                  </div>
                  <div className="bg-black/50 border border-lime/20 p-2 rounded-md">
                    <div className="text-gray-400 text-xs">NFT Bonus</div>
                    <div className="text-lime text-sm">+25% Coins</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-black/50 border border-lime/20 px-2 py-1 rounded-full">
                    {" "}
                    {/* Reduced padding */}
                    <Coins className="h-3 w-3 text-lime mr-1" /> {/* Reduced from h-4 w-4 */}
                    <span className="text-lime text-xs">Earn coins</span> {/* Reduced from text-sm */}
                  </div>
                  <button className="bg-lime text-black px-4 py-1 rounded-md text-sm font-medium hover:bg-lime/90 transition-colors">
                    {" "}
                    {/* Reduced size */}
                    Play Now
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

