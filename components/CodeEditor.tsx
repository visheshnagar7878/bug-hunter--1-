import React, { useEffect, useState } from 'react';
import { Level } from '../types';
import { Scan, AlertTriangle } from 'lucide-react';

interface Props {
  level: Level;
  onLineClick: (lineNumber: number) => void;
  selectedLine: number | null;
  isCorrect: boolean | null;
}

declare global {
  interface Window {
    Prism: any;
  }
}

export const CodeEditor: React.FC<Props> = ({ level, onLineClick, selectedLine, isCorrect }) => {
  const [highlightedCode, setHighlightedCode] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Effect to handle highlighting and reset animations on level change
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate scanning/decryption time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    if (window.Prism) {
      const rawCode = level.code;
      const grammar = window.Prism.languages[level.language] || window.Prism.languages.javascript;
      
      // Split raw code first to maintain line integrity
      const lines = rawCode.split('\n').map(line => {
        return window.Prism.highlight(line, grammar, level.language);
      });
      
      setHighlightedCode(lines);
    }
    
    return () => clearTimeout(timer);
  }, [level]);

  return (
    <div className="bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-gray-700/50 font-mono text-sm md:text-base ring-1 ring-white/5 transition-all duration-300 hover:shadow-blue-500/5 relative group">
      {/* Mac-style Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-gray-700/50 backdrop-blur-sm z-20 relative">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm hover:brightness-110 transition-all cursor-pointer hover:scale-110"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm hover:brightness-110 transition-all cursor-pointer hover:scale-110"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm hover:brightness-110 transition-all cursor-pointer hover:scale-110"></div>
        </div>
        <div className="text-gray-400 text-xs font-medium tracking-wide flex items-center bg-black/20 px-3 py-1 rounded-full border border-white/5">
          <span className="opacity-50 mr-2">file:</span> 
          <span className="text-gray-300">{level.title.replace(/\s+/g, '_').toLowerCase()}.{level.language === 'python' ? 'py' : level.language === 'javascript' ? 'js' : level.language}</span>
        </div>
      </div>
      
      <div className="relative overflow-x-auto custom-scrollbar bg-[#1e1e1e]/95 backdrop-blur-sm min-h-[300px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1e1e1e] z-10">
            <div className="relative">
              <Scan size={48} className="text-blue-500 animate-pulse" />
              <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse"></div>
            </div>
            <p className="mt-4 text-blue-400 font-game tracking-widest text-sm animate-pulse">DECRYPTING SOURCE...</p>
            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_10px_#3b82f6] animate-scan"></div>
          </div>
        ) : (
          <div className="min-w-max py-4 relative">
            {highlightedCode.map((htmlLine, index) => {
              const lineNumber = index + 1;
              const isSelected = selectedLine === lineNumber;
              
              // Base classes
              let wrapperClass = "flex cursor-pointer transition-all duration-150 group/line relative border-l-2";
              let contentClass = "pr-4 whitespace-pre relative z-10 transition-colors duration-150";
              
              // Staggered Entry Animation
              const animationDelay = `${index * 40}ms`;

              // State-based styling
              if (isSelected) {
                 if (isCorrect === true) {
                     wrapperClass += " bg-green-500/10 border-green-500 animate-pop-success";
                     contentClass += " text-green-100 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
                 }
                 else if (isCorrect === false) {
                     wrapperClass += " bg-red-500/10 border-red-500 animate-glitch";
                     contentClass += " text-red-100";
                 }
                 else {
                     wrapperClass += " bg-blue-500/10 border-blue-500";
                     contentClass += " text-blue-100";
                 }
              } else {
                  wrapperClass += " border-transparent hover:border-gray-500 hover:bg-white/5 hover:translate-x-1";
              }

              return (
                <div 
                  key={`${level.id}-${lineNumber}`}
                  onClick={() => onLineClick(lineNumber)}
                  className={`${wrapperClass} line-entry`}
                  style={{ animationDelay }}
                >
                  {/* Line Number */}
                  <div className={`select-none w-12 text-right pr-4 flex-shrink-0 transition-colors duration-200 font-mono text-xs pt-1 ${isSelected ? 'text-gray-300 font-bold' : 'text-gray-600 group-hover/line:text-gray-400'}`}>
                    {lineNumber}
                  </div>
                  
                  {/* Code Content */}
                  <div 
                    className={contentClass}
                    dangerouslySetInnerHTML={{ __html: htmlLine || ' ' }} 
                  />

                  {/* Incorrect Indicator Icon */}
                  {isSelected && isCorrect === false && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-bounce">
                      <AlertTriangle size={16} className="text-red-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};