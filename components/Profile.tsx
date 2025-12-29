import React from 'react';
import { GameState, User } from '../types';
import { Zap, Bug, Target, Award, Share2, LogOut } from 'lucide-react';
import { logoutUser } from '../utils/storage';

interface Props {
  user: User | null;
  gameState: GameState;
  completedCount: number;
  onLogout: () => void;
}

export const Profile: React.FC<Props> = ({ user, gameState, completedCount, onLogout }) => {
  if (!user) return null;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-slide-up">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-900 to-[#1e293b] rounded-2xl p-6 md:p-8 mb-8 shadow-2xl border border-blue-800/50 relative overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Bug size={200} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 relative z-10">
            <div className="w-24 h-24 rounded-full bg-gray-800 border-4 border-blue-500 flex items-center justify-center shadow-lg overflow-hidden transition-transform duration-300 hover:rotate-6 hover:scale-110">
              <img 
                 src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user.avatarId}&backgroundColor=transparent`} 
                 alt="avatar" 
                 className="w-full h-full p-2"
              />
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold text-white mb-1 tracking-tight font-game">{user.username}</h1>
              <p className="text-blue-300 mb-4 font-medium">{user.email || 'Bug Hunter Elite'} • Joined {new Date(user.joinedAt).toLocaleDateString()}</p>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 transition-all hover:bg-blue-500/30">
                  Bug Hunter
                </span>
                {gameState.streak > 10 && (
                  <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30 animate-pulse">
                    On Fire
                  </span>
                )}
                {completedCount > 20 && (
                   <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold border border-green-500/30 transition-all hover:bg-green-500/30">
                    Senior Dev
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-200 border border-white/10 backdrop-blur-sm hover:scale-105 active:scale-95">
                <Share2 size={16} className="mr-2" />
                Share
              </button>
              <button 
                onClick={() => {
                   logoutUser();
                   onLogout();
                }}
                className="flex items-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-200 transition-all duration-200 border border-red-500/20 backdrop-blur-sm hover:scale-105 active:scale-95"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center py-6 hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/20">
            <div className="bg-blue-500/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <Bug className="text-blue-500" size={24} />
            </div>
            <div className="text-4xl font-bold text-white mb-1 font-game">{completedCount}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-game">Bugs Fixed</div>
          </div>
          
          <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center py-6 hover:border-yellow-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-900/20">
            <div className="bg-yellow-500/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <Target className="text-yellow-500" size={24} />
            </div>
            <div className="text-4xl font-bold text-white mb-1 font-game">{gameState.score.toLocaleString()}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-game">Total Score</div>
          </div>

          <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center py-6 hover:border-orange-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-900/20">
            <div className="bg-orange-500/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <Zap className="text-orange-500" size={24} />
            </div>
            <div className="text-4xl font-bold text-white mb-1 font-game">{gameState.streak}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-game">Best Streak</div>
          </div>

          <div className="bg-[#1e293b] p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center py-6 hover:border-purple-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-900/20">
             <div className="bg-purple-500/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <Award className="text-purple-500" size={24} />
            </div>
            <div className="text-4xl font-bold text-white mb-1 font-game">Top 5%</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-game">Global Rank</div>
          </div>
        </div>

        {/* Activity Heatmap Mock */}
        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors duration-300">
          <h3 className="text-xl font-bold text-white mb-4 font-game">Activity Log</h3>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 98 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-sm transition-all duration-300 hover:scale-150 hover:z-10 cursor-default ${
                  Math.random() > 0.8 ? 'bg-blue-500 hover:shadow-blue-500/50 hover:shadow-md' : 
                  Math.random() > 0.6 ? 'bg-blue-700' : 
                  Math.random() > 0.4 ? 'bg-blue-900/50' : 
                  'bg-gray-800'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};