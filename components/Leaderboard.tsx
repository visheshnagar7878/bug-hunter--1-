import React from 'react';
import { Trophy, Medal, User } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const mockData = [
    { rank: 1, name: "BugSlayer99", score: 154200, streak: 42, lang: "Python" },
    { rank: 2, name: "NullPointer", score: 128500, streak: 15, lang: "Java" },
    { rank: 3, name: "CSS_Wizard", score: 98200, streak: 28, lang: "CSS" },
    { rank: 4, name: "Rustacean", score: 85000, streak: 8, lang: "Rust" },
    { rank: 5, name: "ConsoleLog", score: 72100, streak: 12, lang: "JS" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-yellow-500/20 p-3 rounded-xl border border-yellow-500/50">
            <Trophy className="text-yellow-500" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white font-game">Global Leaderboard</h1>
            <p className="text-gray-400">Top hunters squashing bugs across the multiverse.</p>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 bg-gray-900/50 text-xs font-bold text-gray-400 uppercase tracking-wider font-game">
            <div className="col-span-2 md:col-span-1 text-center">Rank</div>
            <div className="col-span-6 md:col-span-5">Hunter</div>
            <div className="col-span-4 md:col-span-3 text-right">Score</div>
            <div className="hidden md:block col-span-3 text-center">Favorite Stack</div>
          </div>
          
          {mockData.map((user, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors items-center">
              <div className="col-span-2 md:col-span-1 flex justify-center">
                {user.rank === 1 ? <Medal className="text-yellow-400" size={24} /> :
                 user.rank === 2 ? <Medal className="text-gray-400" size={24} /> :
                 user.rank === 3 ? <Medal className="text-amber-600" size={24} /> :
                 <span className="font-game text-gray-500 font-bold text-lg">#{user.rank}</span>}
              </div>
              
              <div className="col-span-6 md:col-span-5 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="font-medium text-white">{user.name}</span>
                {index === 0 && <span className="bg-yellow-500/20 text-yellow-400 text-[10px] px-1.5 py-0.5 rounded border border-yellow-500/30 font-game">KING</span>}
              </div>
              
              <div className="col-span-4 md:col-span-3 text-right font-game text-blue-400 font-bold text-lg">
                {user.score.toLocaleString()}
              </div>
              
              <div className="hidden md:block col-span-3 text-center">
                 <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full font-mono">
                   {user.lang}
                 </span>
              </div>
            </div>
          ))}
          
          <div className="p-4 text-center text-gray-500 text-sm bg-gray-900/30">
            Sign in to see your global ranking
          </div>
        </div>
      </div>
    </div>
  );
};