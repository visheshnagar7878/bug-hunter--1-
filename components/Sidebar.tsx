import React from 'react';
import { Language, Level, ViewState } from '../types';
import { CheckCircle, PlayCircle, Code, Trophy, User, Info, Target } from 'lucide-react';

interface Props {
  languages: Language[];
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  levels: Level[];
  completedLevelIds: number[];
  currentLevelId: number;
  onLevelSelect: (id: number) => void;
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export const Sidebar: React.FC<Props> = ({
  languages,
  currentLanguage,
  onLanguageChange,
  levels,
  completedLevelIds,
  currentLevelId,
  onLevelSelect,
  currentView,
  onViewChange
}) => {
  return (
    <div className="w-full h-full flex flex-col animate-slide-in-right">
      {/* Branding / Main Nav */}
      <div className="p-4 border-b border-gray-800/50 space-y-4 bg-gradient-to-b from-gray-800/20 to-transparent">
         <div className="flex items-center space-x-3 text-white font-bold px-2 group cursor-default">
             <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20 transition-all duration-300 group-hover:bg-blue-500/20 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                 <Target className="text-blue-500 transition-transform duration-700 group-hover:rotate-180" size={20} />
             </div>
             <div className="flex flex-col">
                 <span className="font-game tracking-tight text-2xl leading-none group-hover:text-blue-400 transition-colors">BUG HUNTER</span>
                 <span className="font-game text-[10px] text-gray-500 uppercase tracking-widest font-bold">Debug Protocol</span>
             </div>
         </div>
         
         <nav className="flex flex-col space-y-1">
             {[
               { id: 'game', icon: Code, label: 'Missions' },
               { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
               { id: 'profile', icon: User, label: 'Profile' },
               { id: 'about', icon: Info, label: 'About' }
             ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => onViewChange(item.id as ViewState)}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ease-out group ${
                    currentView === item.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 translate-x-2' 
                      : 'text-gray-400 hover:bg-gray-800/60 hover:text-white hover:translate-x-2'
                  }`}
                >
                    <item.icon size={18} className={`mr-3 transition-colors ${currentView === item.id ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                    {item.label}
                </button>
             ))}
         </nav>
      </div>

      {/* Game Context - Only show when in Game view */}
      {currentView === 'game' && (
        <div className="flex-1 flex flex-col min-h-0 animate-fade-in delay-100">
          <div className="px-4 py-3">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1 font-game">
              Target Language
            </label>
            <div className="relative group">
              <select 
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="w-full bg-gray-800 text-white text-sm rounded-lg border border-gray-700/50 p-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer hover:bg-gray-750 appearance-none shadow-sm hover:border-gray-600"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang === 'html' ? 'HTML' : lang === 'css' ? 'CSS' : lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-3 pointer-events-none text-gray-500 group-hover:text-gray-300 transition-colors">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-1 scrollbar-thin scrollbar-thumb-gray-700/50 hover:scrollbar-thumb-gray-600">
            <div className="flex items-center justify-between px-2 mb-2 mt-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-game">
                Mission Log
                </label>
                <span className="text-[12px] font-game text-gray-400 bg-gray-800/50 px-1.5 rounded">{completedLevelIds.length} / {levels.length}</span>
            </div>
            
            <div className="space-y-1 pb-4">
              {levels.map((level) => {
                const isCompleted = completedLevelIds.includes(level.id);
                const isActive = currentLevelId === level.id;
                
                return (
                  <button
                    key={level.id}
                    onClick={() => onLevelSelect(level.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between text-sm transition-all duration-200 ease-out group border ${
                      isActive 
                        ? 'bg-blue-600/10 text-blue-100 border-blue-500/30 shadow-md translate-x-1' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white border-transparent hover:border-white/5 hover:translate-x-1'
                    }`}
                  >
                    <div className="flex items-center overflow-hidden min-w-0">
                      <div className={`w-1.5 h-1.5 rounded-full mr-3 flex-shrink-0 transition-all duration-300 ${
                        isActive ? 'scale-150 shadow-[0_0_8px_currentColor]' : 'group-hover:scale-125'
                      } ${
                        level.difficulty === 'easy' ? 'bg-green-500 text-green-500' :
                        level.difficulty === 'medium' ? 'bg-yellow-500 text-yellow-500' :
                        'bg-red-500 text-red-500'
                      }`} />
                      <span className="truncate font-medium">{level.title}</span>
                    </div>
                    {isCompleted && <CheckCircle size={14} className="text-green-500 flex-shrink-0 ml-2" />}
                    {isActive && !isCompleted && <PlayCircle size={14} className="text-blue-400 flex-shrink-0 ml-2 animate-pulse" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};