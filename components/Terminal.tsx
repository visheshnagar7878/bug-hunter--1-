import React, { useEffect, useState, useRef } from 'react';
import { Terminal as TerminalIcon, Activity, Wifi } from 'lucide-react';

interface Props {
  output: { type: 'info' | 'error' | 'success', message: string } | null;
}

export const Terminal: React.FC<Props> = ({ output }) => {
  const [displayedText, setDisplayedText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Typewriter effect logic
  useEffect(() => {
    if (!output) {
      setDisplayedText('System Ready... Waiting for input sequence.');
      return;
    }

    let i = 0;
    const text = output.message;
    setDisplayedText('');
    
    // Faster typing for errors/success to feel responsive
    const speed = 15; 
    
    const intervalId = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i === text.length) clearInterval(intervalId);
    }, speed);

    return () => clearInterval(intervalId);
  }, [output]);
  
  // Auto-scroll
  useEffect(() => {
      if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  }, [displayedText]);

  return (
    <div className="relative group rounded-xl overflow-hidden mt-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]">
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-20 group-hover:opacity-40 animate-gradient-xy blur-sm transition-opacity"></div>
        
        {/* Main Container */}
        <div className="relative bg-[#0a0a0a]/90 backdrop-blur-xl h-40 md:h-48 flex flex-col border border-white/10 rounded-xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-900 to-black border-b border-white/5">
                <div className="flex items-center space-x-3">
                    <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    </div>
                    <div className="h-4 w-px bg-white/10 mx-2"></div>
                    <div className="flex items-center text-blue-400/80">
                        <TerminalIcon size={14} className="mr-2" />
                        <span className="text-[10px] font-bold tracking-[0.2em] font-game uppercase">Debug_Console_v2.0</span>
                    </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-500">
                    <Activity size={14} className="animate-pulse text-green-500/50" />
                    <span className="text-[10px] font-mono opacity-50">ONLINE</span>
                </div>
            </div>

            {/* CRT Screen Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20"></div>

            {/* Content Area */}
            <div ref={scrollRef} className="flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar relative">
                {/* Background Grid for Tech Feel */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                <div className="relative z-0 space-y-2">
                    <div className="flex items-start">
                        <span className="text-green-500/80 mr-3 font-bold select-none">root@hunter:~#</span>
                        <div className={`${
                            output?.type === 'error' ? 'text-red-400 shadow-[0_0_10px_rgba(248,113,113,0.2)]' : 
                            output?.type === 'success' ? 'text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)]' : 
                            'text-blue-300'
                        } leading-relaxed`}>
                            {displayedText}
                            <span className="inline-block w-2 h-4 ml-1 align-middle bg-blue-500/50 animate-pulse"></span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Status Footer */}
            <div className="px-4 py-1 bg-black/40 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                <span>MEM: 64MB OK</span>
                <span className="flex items-center gap-1"><Wifi size={10}/> 12ms</span>
            </div>
        </div>
    </div>
  );
};