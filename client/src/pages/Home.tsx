import { useState, useEffect } from "react";
import { Dice5, RotateCcw, Plus, Trash2, Play, TrendingUp } from "lucide-react";

interface Player {
  name: string;
  role: "Batsman" | "Bowler" | "All-rounder" | "Wicketkeeper";
  country?: string;
  photo?: string;
}

interface Auctioneer {
  id: string;
  name: string;
  initialBid: number;
  currentBid: number;
  playersOwned: string[];
}

interface AuctionResult {
  playerName: string;
  auctioneerName: string;
  finalBid: number;
  role: string;
}

const PLAYERS: Player[] = [
  { name: "Virat Kohli", role: "Batsman", country: "IND" },
  { name: "Rohit Sharma", role: "Batsman", country: "IND" },
  { name: "MS Dhoni", role: "Wicketkeeper", country: "IND" },
  { name: "Sachin Tendulkar", role: "Batsman", country: "IND" },
  { name: "Yuvraj Singh", role: "All-rounder", country: "IND" },
  { name: "Hardik Pandya", role: "All-rounder", country: "IND" },
  { name: "Ravindra Jadeja", role: "All-rounder", country: "IND" },
  { name: "Jasprit Bumrah", role: "Bowler", country: "IND" },
  { name: "Mohammed Shami", role: "Bowler", country: "IND" },
  { name: "KL Rahul", role: "Wicketkeeper", country: "IND" },
  { name: "Rishabh Pant", role: "Wicketkeeper", country: "IND" },
  { name: "Shubman Gill", role: "Batsman", country: "IND" },
  { name: "Shreyas Iyer", role: "Batsman", country: "IND" },
  { name: "Sanju Samson", role: "Wicketkeeper", country: "IND" },
  { name: "Yuzvendra Chahal", role: "Bowler", country: "IND" },
  { name: "Kuldeep Yadav", role: "Bowler", country: "IND" },
  { name: "Bhuvneshwar Kumar", role: "Bowler", country: "IND" },
  { name: "Steve Smith", role: "Batsman", country: "AUS" },
  { name: "David Warner", role: "Batsman", country: "AUS" },
  { name: "Mitchell Starc", role: "Bowler", country: "AUS" },
  { name: "Pat Cummins", role: "Bowler", country: "AUS" },
  { name: "Joe Root", role: "Batsman", country: "ENG" },
  { name: "Ben Stokes", role: "All-rounder", country: "ENG" },
  { name: "Jos Buttler", role: "Wicketkeeper", country: "ENG" },
  { name: "Jofra Archer", role: "Bowler", country: "ENG" },
  { name: "AB de Villiers", role: "Batsman", country: "RSA" },
  { name: "Kagiso Rabada", role: "Bowler", country: "RSA" },
  { name: "Kane Williamson", role: "Batsman", country: "NZL" },
  { name: "Trent Boult", role: "Bowler", country: "NZL" },
  { name: "Babar Azam", role: "Batsman", country: "PAK" },
  { name: "Shaheen Afridi", role: "Bowler", country: "PAK" },
];

const getRoleColor = (role: string): string => {
  switch (role) {
    case "Batsman":
      return "from-amber-400 to-amber-500";
    case "Bowler":
      return "from-red-400 to-red-500";
    case "All-rounder":
      return "from-purple-400 to-purple-500";
    case "Wicketkeeper":
      return "from-cyan-400 to-cyan-500";
    default:
      return "from-gray-400 to-gray-500";
  }
};

const getRoleIcon = (role: string): string => {
  switch (role) {
    case "Batsman":
      return "🏏";
    case "Bowler":
      return "⚡";
    case "All-rounder":
      return "⭐";
    case "Wicketkeeper":
      return "🧤";
    default:
      return "🎯";
  }
};

export default function Home() {
  const [gamePhase, setGamePhase] = useState<"setup" | "auction" | "results">("setup");
  const [auctioneers, setAuctioneers] = useState<Auctioneer[]>([]);
  const [newAuctioneerName, setNewAuctioneerName] = useState("");
  const [initialBidAmount, setInitialBidAmount] = useState("100");
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [auctionResults, setAuctionResults] = useState<AuctionResult[]>([]);
  const [selectedAuctioneer, setSelectedAuctioneer] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState("");

  const addAuctioneer = () => {
    if (newAuctioneerName.trim() && initialBidAmount) {
      const newAuctioneer: Auctioneer = {
        id: Date.now().toString(),
        name: newAuctioneerName,
        initialBid: parseInt(initialBidAmount),
        currentBid: parseInt(initialBidAmount),
        playersOwned: [],
      };
      setAuctioneers([...auctioneers, newAuctioneer]);
      setNewAuctioneerName("");
    }
  };

  const removeAuctioneer = (id: string) => {
    setAuctioneers(auctioneers.filter((a) => a.id !== id));
  };

  const startAuction = () => {
    if (auctioneers.length > 0) {
      const shuffled = [...PLAYERS].sort(() => Math.random() - 0.5);
      setPlayers(shuffled);
      setCurrentPlayerIndex(0);
      setGamePhase("auction");
      setSelectedAuctioneer(null);
      setBidAmount("");
    }
  };

  const sellToAuctioneer = (auctionerId: string) => {
    if (currentPlayerIndex < players.length) {
      const player = players[currentPlayerIndex];
      const auctioneer = auctioneers.find((a) => a.id === auctionerId);

      if (auctioneer) {
        const bidValue = bidAmount ? parseInt(bidAmount) : auctioneer.initialBid;

        setAuctionResults([
          ...auctionResults,
          {
            playerName: player.name,
            auctioneerName: auctioneer.name,
            finalBid: bidValue,
            role: player.role,
          },
        ]);

        setAuctioneers(
          auctioneers.map((a) =>
            a.id === auctionerId
              ? {
                  ...a,
                  currentBid: a.currentBid - bidValue,
                  playersOwned: [...a.playersOwned, player.name],
                }
              : a
          )
        );

        if (currentPlayerIndex + 1 < players.length) {
          setCurrentPlayerIndex(currentPlayerIndex + 1);
          setSelectedAuctioneer(null);
          setBidAmount("");
        } else {
          setGamePhase("results");
        }
      }
    }
  };

  const skipPlayer = () => {
    if (currentPlayerIndex + 1 < players.length) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setSelectedAuctioneer(null);
      setBidAmount("");
    } else {
      setGamePhase("results");
    }
  };

  const resetGame = () => {
    setGamePhase("setup");
    setAuctioneers([]);
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setAuctionResults([]);
    setSelectedAuctioneer(null);
    setBidAmount("");
    setNewAuctioneerName("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "1s" }}></div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {gamePhase === "setup" && (
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-300 via-amber-300 to-cyan-300 bg-clip-text text-transparent">
                🏏 Cricket Auction
              </h1>
              <p className="text-lg text-gray-300 font-light tracking-wide">
                Setup your auctioneers and begin the bidding war
              </p>
            </div>

            {/* Auctioneer Setup */}
            <div className="space-y-6">
              {/* Input Section */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                <h2 className="text-xl font-bold mb-4 text-cyan-300">Add Auctioneers</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Auctioneer Name</label>
                    <input
                      type="text"
                      value={newAuctioneerName}
                      onChange={(e) => setNewAuctioneerName(e.target.value)}
                      placeholder="e.g., Rajesh Kumar"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                      onKeyPress={(e) => e.key === "Enter" && addAuctioneer()}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Initial Bid Amount</label>
                    <input
                      type="number"
                      value={initialBidAmount}
                      onChange={(e) => setInitialBidAmount(e.target.value)}
                      placeholder="e.g., 100"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all"
                      onKeyPress={(e) => e.key === "Enter" && addAuctioneer()}
                    />
                  </div>

                  <button
                    onClick={addAuctioneer}
                    className="w-full group relative px-6 py-3 font-bold text-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-amber-500/20 backdrop-blur-xl border border-white/20 rounded-lg group-hover:from-cyan-500/30 group-hover:to-amber-500/30 transition-all duration-300"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      <Plus className="w-5 h-5" />
                      Add Auctioneer
                    </div>
                  </button>
                </div>
              </div>

              {/* Auctioneers List */}
              {auctioneers.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-4 text-amber-300">Registered Auctioneers ({auctioneers.length})</h3>
                  <div className="space-y-3">
                    {auctioneers.map((auctioneer) => (
                      <div
                        key={auctioneer.id}
                        className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all"
                      >
                        <div>
                          <p className="font-bold text-white">{auctioneer.name}</p>
                          <p className="text-sm text-gray-400">Budget: ₹{auctioneer.initialBid}</p>
                        </div>
                        <button
                          onClick={() => removeAuctioneer(auctioneer.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Start Button */}
              {auctioneers.length > 0 && (
                <button
                  onClick={startAuction}
                  className="w-full group relative px-8 py-4 font-bold text-lg text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-amber-500/30 backdrop-blur-xl border border-white/20 rounded-2xl group-hover:from-cyan-500/40 group-hover:to-amber-500/40 transition-all duration-300"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    <Play className="w-6 h-6" />
                    Start Auction
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {gamePhase === "auction" && currentPlayerIndex < players.length && (
          <div className="w-full max-w-4xl">
            {/* Auction Header */}
            <div className="text-center mb-8">
              <p className="text-gray-400 mb-2">Player {currentPlayerIndex + 1} of {players.length}</p>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-transparent">
                Now Auctioning...
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Player Card */}
              <div className="lg:col-span-1">
                <div className="relative group h-full">
                  {/* Card with gradient border */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-amber-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Trading Card */}
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-3xl p-6 shadow-2xl hover:border-white/40 transition-all duration-300 h-full flex flex-col">
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-gradient-to-r from-cyan-500 to-amber-500 rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                        {getRoleIcon(players[currentPlayerIndex].role)}
                      </div>
                      <span className={`bg-gradient-to-r ${getRoleColor(players[currentPlayerIndex].role)} text-black px-3 py-1 rounded-full text-xs font-bold`}>
                        {players[currentPlayerIndex].role}
                      </span>
                    </div>

                    {/* Player Image Placeholder */}
                    <div className="w-full aspect-square bg-gradient-to-br from-cyan-500/10 to-amber-500/10 rounded-2xl mb-4 flex items-center justify-center border border-white/10">
                      <div className="text-6xl">{getRoleIcon(players[currentPlayerIndex].role)}</div>
                    </div>

                    {/* Player Info */}
                    <h3 className="text-2xl font-bold text-white mb-2">{players[currentPlayerIndex].name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{players[currentPlayerIndex].country}</p>

                    {/* Card Footer */}
                    <div className="mt-auto pt-4 border-t border-white/10">
                      <p className="text-xs text-gray-500 text-center">Cricket Legend</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bidding Section */}
              <div className="lg:col-span-2 space-y-4">
                {/* Bid Input */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                  <label className="block text-sm text-gray-400 mb-3">Enter Bid Amount (Optional)</label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Leave empty for initial bid"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-all mb-4"
                  />
                  <p className="text-xs text-gray-500">Default: ₹{auctioneers[0]?.initialBid || 0}</p>
                </div>

                {/* Auctioneers Bidding */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-cyan-300">Select Auctioneer</h3>
                  {auctioneers.map((auctioneer) => (
                    <button
                      key={auctioneer.id}
                      onClick={() => {
                        setSelectedAuctioneer(auctioneer.id);
                        sellToAuctioneer(auctioneer.id);
                      }}
                      className={`w-full group relative px-6 py-4 font-bold text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 ${
                        selectedAuctioneer === auctioneer.id ? "ring-2 ring-cyan-500" : ""
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-amber-500/20 backdrop-blur-xl border border-white/20 rounded-2xl group-hover:from-cyan-500/30 group-hover:to-amber-500/30 transition-all duration-300"></div>
                      <div className="relative flex items-center justify-between">
                        <span>{auctioneer.name}</span>
                        <span className="text-sm">₹{auctioneer.currentBid} | {auctioneer.playersOwned.length} players</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Skip Button */}
                <button
                  onClick={skipPlayer}
                  className="w-full group relative px-6 py-3 font-bold text-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-xl border border-white/20 rounded-lg group-hover:from-red-500/30 group-hover:to-orange-500/30 transition-all duration-300"></div>
                  <div className="relative">Skip Player</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {gamePhase === "results" && (
          <div className="w-full max-w-4xl">
            {/* Results Header */}
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-transparent">
                Auction Complete! 🎉
              </h1>
              <p className="text-gray-400">Final Results and Summary</p>
            </div>

            {/* Results Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {auctioneers.map((auctioneer) => (
                <div
                  key={auctioneer.id}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
                >
                  <h3 className="text-xl font-bold text-cyan-300 mb-4">{auctioneer.name}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Initial Budget:</span>
                      <span className="font-bold text-white">₹{auctioneer.initialBid}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Remaining:</span>
                      <span className={`font-bold ${auctioneer.currentBid >= 0 ? "text-green-400" : "text-red-400"}`}>
                        ₹{auctioneer.currentBid}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Players Bought:</span>
                      <span className="font-bold text-amber-300">{auctioneer.playersOwned.length}</span>
                    </div>
                    {auctioneer.playersOwned.length > 0 && (
                      <div className="pt-3 border-t border-white/10">
                        <p className="text-xs text-gray-500 mb-2">Squad:</p>
                        <div className="flex flex-wrap gap-2">
                          {auctioneer.playersOwned.map((player, idx) => (
                            <span key={idx} className="bg-white/10 text-xs px-2 py-1 rounded text-gray-300">
                              {player}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Auction Log */}
            {auctionResults.length > 0 && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Auction Log
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {auctionResults.map((result, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-lg border border-white/5">
                      <div>
                        <p className="font-bold text-white">{result.playerName}</p>
                        <p className="text-xs text-gray-500">{result.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-cyan-300">{result.auctioneerName}</p>
                        <p className="text-xs text-amber-300">₹{result.finalBid}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={resetGame}
              className="w-full group relative px-8 py-4 font-bold text-lg text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-amber-500/30 backdrop-blur-xl border border-white/20 rounded-2xl group-hover:from-cyan-500/40 group-hover:to-amber-500/40 transition-all duration-300"></div>
              <div className="relative flex items-center justify-center gap-2">
                <RotateCcw className="w-6 h-6" />
                Start New Auction
              </div>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
