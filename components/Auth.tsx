import React, { useState } from 'react';
    import { User } from '../types';
    import { saveUser } from '../utils/storage';
    import { Bug, ArrowRight, User as UserIcon } from 'lucide-react';

    interface Props {
      onLogin: (user: User) => void;
    }

    export const Auth: React.FC<Props> = ({ onLogin }) => {
      const [isSignup, setIsSignup] = useState(false);
      const [username, setUsername] = useState('');
      const [email, setEmail] = useState('');
      const [avatarId, setAvatarId] = useState(1);

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username) return;

        const newUser: User = {
          username,
          email,
          avatarId,
          joinedAt: Date.now(),
        };

        saveUser(newUser);
        onLogin(newUser);
      };

      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#1e293b]/90 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl p-8 relative overflow-hidden transition-all duration-500 hover:shadow-blue-900/20">
            {/* Background Decoration */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-300"></div>

            <div className="flex flex-col items-center mb-8 relative z-10">
              <div className="bg-blue-500/20 p-4 rounded-2xl mb-4 border border-blue-500/30 shadow-lg shadow-blue-500/20 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                <Bug className="text-blue-500" size={48} />
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight font-game">BUG HUNTER</h1>
              <p className="text-gray-400 mt-2 text-center font-medium">
                {isSignup ? "Join the elite squad of code fixers." : "Welcome back, Hunter."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 font-game">
                  Codename (Username)
                </label>
                <div className="relative group">
                  <UserIcon className="absolute left-3 top-3 text-gray-500 transition-colors group-hover:text-blue-400" size={18} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. NullPointer"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {isSignup && (
                <div className="animate-slide-up">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 font-game">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hunter@example.com"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-2.5 px-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>
              )}

              {/* Avatar Selection (Simple) */}
              <div className="pt-2">
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 font-game">
                  Select Avatar
                </label>
                <div className="flex justify-center space-x-3">
                  {[1, 2, 3, 4, 5].map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setAvatarId(id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                        avatarId === id 
                          ? 'border-blue-500 bg-blue-500/20 scale-125 shadow-lg shadow-blue-500/20' 
                          : 'border-gray-700 bg-gray-800 hover:border-gray-500 hover:scale-110'
                      }`}
                    >
                      <img 
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${id}&backgroundColor=transparent`} 
                        alt="avatar" 
                        className="w-8 h-8"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 transition-all duration-200 flex items-center justify-center group mt-6 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSignup ? 'Start Hunting' : 'Login'}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={18} />
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-sm text-gray-400 hover:text-white transition-colors underline decoration-dotted hover:decoration-solid"
              >
                {isSignup ? "Already have an account? Login" : "New recruit? Sign Up"}
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-gray-600 text-xs text-center max-w-xs animate-pulse">
            By joining, you agree to squash all bugs you encounter with extreme prejudice.
          </div>
        </div>
      );
    };