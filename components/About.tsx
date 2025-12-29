import React from 'react';
import { Heart, Github, Target } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-slide-up">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-block p-4 bg-blue-500/10 rounded-full mb-4 animate-bounce hover:bg-blue-500/20 transition-colors duration-300">
             <Target size={48} className="text-blue-500" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight font-game">BUG HUNTER</h1>
          <p className="text-xl text-gray-300">The gamified IDE for code whisperers.</p>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 leading-relaxed text-gray-300 space-y-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <p>
            <strong className="text-white">Bug Hunter</strong> is designed to sharpen your eye for detail. 
            Real-world software engineering isn't just about writing new code—it's about reading, understanding, 
            and fixing existing logic.
          </p>
          <p>
            Whether you are a seasoned senior engineer or a student just starting out, identifying 
            syntax errors, logic traps, and memory leaks is a muscle that needs training.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20">
            <Github className="text-gray-400 group-hover:text-white mb-4 transition-colors duration-300" size={32} />
            <h3 className="text-lg font-bold text-white mb-2 font-game">Open Source</h3>
            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
              Check out the source code, contribute new levels, or report bugs on our repository.
            </p>
          </div>
          
          <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 hover:border-pink-500 transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-900/20">
            <Heart className="text-gray-400 group-hover:text-pink-500 mb-4 transition-colors duration-300" size={32} />
            <h3 className="text-lg font-bold text-white mb-2 font-game">Support Us</h3>
            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
              Love the game? Share it with your friends or buy us a coffee to keep the servers running.
            </p>
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm pt-8 pb-8 opacity-60 hover:opacity-100 transition-opacity duration-300">
          <p>© 2024 Bug Hunter Inc. All semicolon rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};