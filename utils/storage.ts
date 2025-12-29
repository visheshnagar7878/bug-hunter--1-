import { GameState, User } from '../types';

const USER_KEY = 'bh_user';
const PROGRESS_KEY = 'bh_progress';

export const saveUser = (user: User) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user', e);
  }
};

export const loadUser = (): User | null => {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem(USER_KEY);
  // Optional: keep progress or clear it? Let's keep it for now.
};

export const saveProgress = (completedLevels: number[], gameState: GameState) => {
  try {
    const data = {
      completedLevels,
      score: gameState.score,
      streak: gameState.streak,
      lives: gameState.lives
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save progress', e);
  }
};

export const loadProgress = () => {
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};