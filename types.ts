export type Language = 
  | 'javascript' 
  | 'python' 
  | 'cpp' 
  | 'java' 
  | 'csharp' 
  | 'ruby' 
  | 'php' 
  | 'swift' 
  | 'go' 
  | 'rust'
  | 'typescript'
  | 'kotlin'
  | 'scala'
  | 'html'
  | 'css';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ViewState = 'auth' | 'game' | 'leaderboard' | 'profile' | 'about';

export interface Level {
  id: number;
  language: Language;
  difficulty: Difficulty;
  title: string;
  description: string;
  code: string;
  bugLine: number; // 1-based index matching the UI display
  solution: string;
  explanation: string;
}

export interface GameState {
  score: number;
  streak: number;
  lives: number;
  currentLevelId: number;
  gameStatus: 'idle' | 'playing' | 'paused' | 'gameover' | 'level-complete';
}

export interface User {
  username: string;
  email: string;
  avatarId: number; // 1-5 for mock avatars
  joinedAt: number;
}

export interface UserStats {
  totalBugsSquashed: number;
  highestStreak: number;
  favoriteLanguage: Language;
  rank: string;
}