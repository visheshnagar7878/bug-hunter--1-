import React from 'react';
import { Level } from '../types';
import { X, CheckCircle, PlayCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  levels: Level[];
  completedLevelIds: number[];
  currentLevelId: number;
  onLevelSelect: (id: number) => void;
}

export const LevelSelectModal: React.FC<Props> = ({
  isOpen,
  onClose,
  levels,
  completedLevelIds,
  currentLevelId,
  onLevelSelect
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0f172a] md:hidden animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0f172a]/95 backdrop-blur-md shrink-0">
        <div>
           <h2 className="text-xl font-bold text-white font-game flex items-center gap-2">
             MISSION SELECT
           </h2>
           <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
             {completedLevelIds.length} / {levels.length} COMPLETED
           </p>
        </div>
        
        <button 
          onClick={onClose} 
          className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-full transition-all duration-200 active:scale-95"
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Filter/Tabs (Visual Only for now) */}
      <div className="flex px-4 py-3 space-x-2 bg-gray-900/50 overflow-x-auto no-scrollbar border-b border-gray-800">
         <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">All</div>
         <div className="px-3 py-1 bg-gray-800 text-gray-400 text-[10px] font-bold rounded-full uppercase tracking-wider">Unsolved</div>
         <div className="px-3 py-1 bg-gray-800 text-gray-400 text-[10px] font-bold rounded-full uppercase tracking-wider">Easy</div>
         <div className="px-3 py-1 bg-gray-800 text-gray-400 text-[10px] font-bold rounded-full uppercase tracking-wider">Hard</div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-safe">
        {levels.map((level) => {
           const isCompleted = completedLevelIds.includes(level.id);
           const isActive = currentLevelId === level.id;
           
           return (
             <button
               key={level.id}
               onClick={() => {
                 onLevelSelect(level.id);
                 onClose();
               }}
               className={`w-full text-left p-4 rounded-xl flex items-center justify-between transition-all duration-200 border relative overflow-hidden group ${
                 isActive 
                   ? 'bg-blue-600/10 border-blue-500/50 text-white shadow-[0_0_20px_rgba(37,99,235,0.15)]' 
                   : 'bg-[#1e293b] border-gray-700/50 text-gray-300 hover:bg-[#253248]'
               }`}
             >
               {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 animate-pulse"></div>}
               
               <div className="flex items-center overflow-hidden gap-4">
                 <div className={`w-3 h-3 rounded-full shrink-0 shadow-[0_0_8px_currentColor] ${
                   level.difficulty === 'easy' ? 'bg-green-500 text-green-500' :
                   level.difficulty === 'medium' ? 'bg-yellow-500 text-yellow-500' :
                   'bg-red-500 text-red-500'
                 }`} />
                 
                 <div className="flex flex-col min-w-0">
                    <span className="font-bold truncate text-sm font-game tracking-wide">{level.title}</span>
                    <span className="text-[10px] uppercase tracking-wider opacity-60 font-mono flex items-center gap-2">
                       {level.difficulty}
                       {isCompleted && <span className="text-green-400">• Solved</span>}
                    </span>
                 </div>
               </div>
               
               <div className="flex items-center pl-2">
                 {isCompleted ? (
                    <div className="bg-green-500/20 p-1.5 rounded-full">
                        <CheckCircle size={16} className="text-green-400" />
                    </div>
                 ) : isActive ? (
                    <div className="bg-blue-500/20 p-1.5 rounded-full animate-pulse">
                        <PlayCircle size={16} className="text-blue-400 fill-blue-400/20" />
                    </div>
                 ) : (
                    <div className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center">
                        <span className="text-[10px] font-mono text-gray-500">{level.id}</span>
                    </div>
                 )}
               </div>
             </button>
           );
        })}
        {/* Spacer for bottom safe area */}
        <div className="h-8"></div>
      </div>
    </div>
  );
};