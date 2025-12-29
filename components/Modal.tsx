import React from 'react';
import { XCircle, CheckCircle, ArrowRight, RotateCcw, Share2 } from 'lucide-react';

interface Props {
  type: 'success' | 'fail';
  title: string;
  message: string;
  solution?: string;
  onNext?: () => void;
  onRetry: () => void;
}

export const Modal: React.FC<Props> = ({ type, title, message, solution, onNext, onRetry }) => {
  const handleShare = async () => {
    const text = `I just squashed a bug in Debug_Mode! Can you find the error?\n\nPlay now: https://debug-mode.app`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Debug_Mode',
          text: text,
          url: 'https://debug-mode.app',
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity duration-300">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-300 ease-out">
        
        <div className="flex items-center mb-4">
          {type === 'success' ? (
            <div className="bg-green-500/20 p-2 rounded-full mr-4 animate-bounce">
              <CheckCircle className="text-green-500" size={32} />
            </div>
          ) : (
             <div className="bg-red-500/20 p-2 rounded-full mr-4 animate-pulse">
              <XCircle className="text-red-500" size={32} />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight font-game">{title}</h2>
            <p className="text-sm text-gray-400">{type === 'success' ? 'Great job!' : 'Don\'t give up.'}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-4 leading-relaxed">{message}</p>
          {solution && (
            <div className="bg-gray-800 rounded p-3 border border-gray-700 shadow-inner">
              <p className="text-xs text-gray-500 uppercase mb-1 font-game">Correct Solution:</p>
              <code className="text-green-400 font-mono text-sm block break-all">{solution}</code>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={onRetry}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-200 font-medium text-sm hover:scale-105 active:scale-95 shadow-lg hover:shadow-gray-900/50"
          >
            <RotateCcw size={16} className="mr-2 transition-transform duration-500 hover:-rotate-180" />
            {type === 'success' ? 'Replay' : 'Try Again'}
          </button>
          
          {type === 'success' && (
             <button 
                onClick={handleShare}
                className="bg-blue-900/50 hover:bg-blue-900 text-blue-200 py-2 px-3 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90"
                title="Share Result"
              >
                <Share2 size={16} />
              </button>
          )}

          {type === 'success' && onNext && (
            <button 
              onClick={onNext}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-200 font-medium text-sm hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50"
            >
              Next Level
              <ArrowRight size={16} className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};