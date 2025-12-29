import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { CodeEditor } from './components/CodeEditor';
import { Terminal } from './components/Terminal';
import { Modal } from './components/Modal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { Leaderboard } from './components/Leaderboard';
import { Profile } from './components/Profile';
import { About } from './components/About';
import { Auth } from './components/Auth';
import { levels, getLevelsByLanguage } from './data';
import { Language, Level, GameState, ViewState, User } from './types';
import { Bug, Trophy, Zap, List, Menu, Target, Settings2 } from 'lucide-react';
import { loadUser, loadProgress, saveProgress } from './utils/storage';

const LANGUAGES: Language[] = [
  'javascript', 'python', 'html', 'css', 'cpp', 'java', 'rust', 
  'go', 'swift', 'php', 'csharp', 'ruby',
  'typescript', 'kotlin', 'scala'
];

const App: React.FC = () => {
  // --- State ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('auth');
  
  const [currentLanguage, setCurrentLanguage] = useState<Language>('javascript');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    streak: 0,
    lives: 3,
    currentLevelId: 1,
    gameStatus: 'idle',
  });
  
  // UI State for Feedback
  const [modalData, setModalData] = useState<{
    show: boolean;
    type: 'success' | 'fail';
    title: string;
    message: string;
    solution?: string;
  }>({ show: false, type: 'success', title: '', message: '' });

  const [terminalOutput, setTerminalOutput] = useState<{ type: 'info' | 'error' | 'success', message: string } | null>(null);

  // Refs for scrolling
  const terminalRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  // --- Initialization ---
  useEffect(() => {
    const user = loadUser();
    if (user) {
      setCurrentUser(user);
      const progress = loadProgress();
      if (progress) {
        setCompletedLevels(progress.completedLevels || []);
        setGameState(prev => ({
           ...prev,
           score: progress.score || 0,
           streak: progress.streak || 0,
           lives: progress.lives ?? 3
        }));
      }
      setCurrentView('game');
    } else {
      setCurrentView('auth');
    }
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    if (currentUser && currentView !== 'auth') {
      saveProgress(completedLevels, gameState);
    }
  }, [completedLevels, gameState, currentUser, currentView]);


  // --- Derived State ---
  const availableLevels = useMemo(() => getLevelsByLanguage(currentLanguage), [currentLanguage]);
  const currentLevel = levels.find(l => l.id === currentLevelId) || levels[0];

  // --- Effects ---

  // Handle Level Change
  useEffect(() => {
    // When language changes, pick the first level of that language
    const firstLevelOfLang = levels.find(l => l.language === currentLanguage);
    if (firstLevelOfLang) {
      setCurrentLevelId(firstLevelOfLang.id);
      resetLevel();
    }
  }, [currentLanguage]);

  // Auto-start level when ID changes
  useEffect(() => {
    resetLevel();
    if (currentView === 'game') {
        setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
    }
    setTerminalOutput(null);
  }, [currentLevelId]);

  // Scroll to terminal on output update (error/success)
  useEffect(() => {
      if (terminalOutput && terminalRef.current && mainScrollRef.current) {
          // Small delay to allow render
          setTimeout(() => {
             terminalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
      }
  }, [terminalOutput]);

  // --- Handlers ---

  const resetLevel = () => {
    setGameState(prev => ({ ...prev, gameStatus: 'playing' }));
    setSelectedLine(null);
    setModalData({ ...modalData, show: false });
    setTerminalOutput(null);
  };

  const handleLineClick = (line: number) => {
    if (gameState.gameStatus !== 'playing') return;
    
    setSelectedLine(line);
    
    // Check answer
    if (line === currentLevel.bugLine) {
      handleSuccess();
    } else {
      handleFailure();
    }
  };

  const handleSuccess = () => {
    const streakBonus = gameState.streak * 50;
    const points = 100 + streakBonus;

    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      streak: prev.streak + 1,
      gameStatus: 'level-complete'
    }));
    
    if (!completedLevels.includes(currentLevelId)) {
      setCompletedLevels(prev => [...prev, currentLevelId]);
    }

    setTerminalOutput({ type: 'success', message: 'BUG DETECTED! Patch applied successfully. System stabilizing...' });
    
    // Small delay before modal to let user see green highlight
    setTimeout(() => {
      setModalData({
        show: true,
        type: 'success',
        title: 'Bug Squashed!',
        message: currentLevel.explanation,
        solution: currentLevel.solution
      });
    }, 800);
  };

  const handleFailure = () => {
    setGameState(prev => ({
      ...prev,
      lives: Math.max(0, prev.lives - 1),
      streak: 0,
      score: Math.max(0, prev.score - 50)
    }));
    
    setTerminalOutput({ type: 'error', message: 'CRITICAL ERROR: Analysis failed. No anomaly detected at this vector.' });
  };

  const handleNextLevel = () => {
    const currentIndex = availableLevels.findIndex(l => l.id === currentLevelId);
    if (currentIndex < availableLevels.length - 1) {
      setCurrentLevelId(availableLevels[currentIndex + 1].id);
    } else {
      // Loop or find next incomplete
      alert("You've completed all levels for this language!");
    }
    setModalData({ ...modalData, show: false });
  };

  const handleRetry = () => {
    resetLevel();
  };

  const handleViewChange = (view: ViewState) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false); // Close mobile menu if open
  }

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('game');
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('auth');
    setIsMobileMenuOpen(false);
  }

  // --- Render Views ---
  const renderContent = () => {
    // We wrap content in a key div to trigger entry animations when view changes
    return (
      <div key={currentView} className={`w-full flex flex-col view-enter ${currentView === 'game' ? 'min-h-full' : 'h-full'}`}>
        {(() => {
          switch(currentView) {
            case 'auth': return <Auth onLogin={handleLogin} />;
            case 'leaderboard': return <Leaderboard />;
            case 'profile': return <Profile user={currentUser} gameState={gameState} completedCount={completedLevels.length} onLogout={handleLogout} />;
            case 'about': return <About />;
            case 'game':
            default:
              return (
                <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col space-y-6">
                  {/* Mission Brief */}
                  <div className="bg-[#1e293b]/80 backdrop-blur-md p-5 rounded-xl border border-gray-700/50 shadow-lg relative overflow-hidden group transition-all duration-300 hover:shadow-blue-900/10 hover:border-blue-500/30">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:w-2 transition-all duration-300"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-2 flex items-center gap-2 font-game">
                          <Target size={14} className="animate-pulse" />
                          Mission Objective 
                        </h2>
                        <p className="text-gray-100 text-lg leading-relaxed font-medium">{currentLevel.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider shadow-sm font-game ${
                          currentLevel.difficulty === 'easy' ? 'bg-green-500/20 text-green-300 border border-green-500/20' :
                          currentLevel.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/20' :
                          'bg-red-500/20 text-red-300 border border-red-500/20'
                      }`}>
                        {currentLevel.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Code Editor */}
                  <div className="flex-1 min-h-[300px] flex flex-col">
                    <CodeEditor 
                      level={currentLevel}
                      onLineClick={handleLineClick}
                      selectedLine={selectedLine}
                      isCorrect={
                        gameState.gameStatus === 'level-complete' && selectedLine === currentLevel.bugLine ? true :
                        selectedLine !== null && selectedLine !== currentLevel.bugLine ? false : null
                      }
                    />
                  </div>

                  {/* Terminal */}
                  <div ref={terminalRef} className="pb-4">
                      <Terminal output={terminalOutput} />
                  </div>
                </div>
              );
          }
        })()}
      </div>
    );
  };

  // If in Auth mode, don't show the main layout shell
  if (currentView === 'auth') {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full text-white overflow-hidden bg-transparent">
      
      {/* Sidebar (Desktop) */}
      <div className="hidden md:block h-full shadow-2xl z-20 w-64 flex-shrink-0 bg-gray-900/40 backdrop-blur-xl border-r border-gray-800/50">
        <Sidebar 
          languages={LANGUAGES}
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
          levels={availableLevels}
          completedLevelIds={completedLevels}
          currentLevelId={currentLevelId}
          onLevelSelect={setCurrentLevelId}
          currentView={currentView}
          onViewChange={handleViewChange}
        />
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-[#1e293b]/70 backdrop-blur-md border-b border-gray-700/50 flex items-center justify-between px-4 md:px-8 shadow-sm z-10 shrink-0">
          
          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-all duration-200 active:scale-95">
                <Menu />
             </button>
             <div className="ml-3 flex items-center space-x-2">
                <Target className="text-blue-500" size={20} />
                <span className="font-bold tracking-tight text-white font-game text-xl">HUNTER</span>
             </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center bg-black/20 px-3 py-1 rounded-full border border-white/5">
              <span className={`w-2 h-2 rounded-full mr-2 shadow-[0_0_8px_currentColor] ${gameState.gameStatus === 'playing' ? 'text-green-500 bg-green-500 animate-pulse' : 'text-gray-500 bg-gray-500'}`}></span>
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider font-game">{gameState.gameStatus.replace('-', ' ')}</span>
            </div>
            {currentUser && <span className="text-gray-400 text-sm pl-2">Agent: <span className="text-white font-medium">{currentUser.username}</span></span>}
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-6">
             <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/10 to-transparent px-4 py-1.5 rounded-full border border-yellow-500/20 transition-transform duration-200 hover:scale-105 cursor-default group">
               <Trophy size={16} className="text-yellow-500 group-hover:rotate-12 transition-transform" />
               <span className="font-bold text-lg text-yellow-100 font-game">{gameState.score.toLocaleString()}</span>
             </div>

             <div className="flex items-center space-x-1 text-orange-400 transition-transform duration-200 hover:scale-110 cursor-default group">
               <Zap size={18} fill="currentColor" className="group-hover:animate-pulse" />
               <span className="font-bold font-game text-lg">{gameState.streak}</span>
             </div>
          </div>
        </header>

        {/* Mobile Dropdown Menu (View Navigation) */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-[#1e293b]/95 backdrop-blur-xl border-b border-gray-700 z-50 p-4 shadow-2xl md:hidden animate-slide-up">
             <nav className="flex flex-col space-y-2">
                <button onClick={() => handleViewChange('game')} className={`p-3 rounded-xl text-left transition-all duration-200 ${currentView === 'game' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'bg-gray-800/50 hover:bg-gray-700'}`}>Missions</button>
                <button onClick={() => handleViewChange('leaderboard')} className={`p-3 rounded-xl text-left transition-all duration-200 ${currentView === 'leaderboard' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'bg-gray-800/50 hover:bg-gray-700'}`}>Leaderboard</button>
                <button onClick={() => handleViewChange('profile')} className={`p-3 rounded-xl text-left transition-all duration-200 ${currentView === 'profile' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'bg-gray-800/50 hover:bg-gray-700'}`}>Profile</button>
                <button onClick={() => handleViewChange('about')} className={`p-3 rounded-xl text-left transition-all duration-200 ${currentView === 'about' ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'bg-gray-800/50 hover:bg-gray-700'}`}>About</button>
                <button onClick={handleLogout} className="p-3 rounded-xl text-left bg-red-500/10 text-red-400 mt-2 border border-red-500/20 hover:bg-red-500/20 transition-colors duration-200">Logout</button>
             </nav>
          </div>
        )}

        {/* Main View Area */}
        <main ref={mainScrollRef} className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col p-4 md:p-8 relative scroll-smooth custom-scrollbar">
           {renderContent()}
        </main>
        
        {/* Mobile Bottom Navigation (Only visible in Game View) */}
        {currentView === 'game' && (
          <div className="md:hidden bg-[#0f172a]/95 backdrop-blur-xl border-t border-blue-900/30 z-30 pb-safe shadow-[0_-8px_32px_rgba(0,0,0,0.5)] shrink-0 animate-slide-up">
              <div className="flex items-center h-20 px-2 py-2">
                  
                  {/* Level Selector Button (Modal Trigger) */}
                  <button 
                      onClick={() => setIsLevelModalOpen(true)}
                      className="flex flex-col items-center justify-center w-20 h-full bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-500/20 text-blue-400 mr-3 flex-shrink-0 active:scale-95 transition-all group"
                  >
                      <List size={20} className="mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold font-game tracking-wider">LEVELS</span>
                      <span className="text-[9px] text-gray-500 font-mono mt-0.5">{completedLevels.length}/{levels.length}</span>
                  </button>

                  {/* Vertical Divider */}
                  <div className="w-px h-10 bg-gray-700/50 mr-2" />

                  {/* Language Scroller */}
                  <div className="flex-1 overflow-hidden relative h-full flex items-center">
                       {/* Gradient Masks for Scroll Hint */}
                       <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[#0f172a] to-transparent z-10 pointer-events-none" />
                       <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0f172a] to-transparent z-10 pointer-events-none" />
                       
                       <div className="overflow-x-auto whitespace-nowrap flex items-center space-x-3 px-2 no-scrollbar h-full w-full snap-x snap-mandatory">
                          {LANGUAGES.map(lang => (
                              <button 
                                key={lang}
                                onClick={() => setCurrentLanguage(lang)}
                                className={`flex-shrink-0 snap-center px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all duration-300 font-game border flex items-center gap-2 ${
                                  currentLanguage === lang 
                                    ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-105' 
                                    : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
                                }`}
                              >
                                {currentLanguage === lang && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                {lang === 'cpp' ? 'C++' : lang === 'csharp' ? 'C#' : lang.toUpperCase()}
                              </button>
                          ))}
                          {/* Spacer for end of list scrolling */}
                          <div className="w-4 flex-shrink-0"></div>
                       </div>
                  </div>
              </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modalData.show && (
        <Modal 
          type={modalData.type}
          title={modalData.title}
          message={modalData.message}
          solution={modalData.solution}
          onNext={handleNextLevel}
          onRetry={handleRetry}
        />
      )}
      
      <LevelSelectModal 
        isOpen={isLevelModalOpen}
        onClose={() => setIsLevelModalOpen(false)}
        levels={availableLevels}
        completedLevelIds={completedLevels}
        currentLevelId={currentLevelId}
        onLevelSelect={setCurrentLevelId}
      />
    </div>
  );
};

export default App;