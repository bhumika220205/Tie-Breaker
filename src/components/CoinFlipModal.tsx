import React, { useState } from 'react';
import { DecisionOption } from '../types/decision';
import { X, Coins, Sparkles, RefreshCw, Heart } from 'lucide-react';

interface CoinFlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: DecisionOption[];
}

export const CoinFlipModal: React.FC<CoinFlipModalProps> = ({ isOpen, onClose, options }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [headsOptionId, setHeadsOptionId] = useState<string>(options[0]?.id || '');
  const [tailsOptionId, setTailsOptionId] = useState<string>(options[1]?.id || options[0]?.id || '');

  if (!isOpen) return null;

  const optA = options.find((o) => o.id === headsOptionId) || options[0];
  const optB = options.find((o) => o.id === tailsOptionId) || options[1] || options[0];

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);

    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
      setResult(outcome);
      setIsFlipping(false);
    }, 1800);
  };

  const winningOpt = result === 'heads' ? optA : optB;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-md w-full p-6 space-y-6 text-center relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 mb-1">
            <Coins className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
            The Psychological Coin Flip
          </h3>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">
            While the coin is in the air, pay close attention: <strong className="text-neutral-800 dark:text-neutral-200">which side are you secretly praying it lands on?</strong>
          </p>
        </div>

        {/* Option Mapping */}
        <div className="grid grid-cols-2 gap-3 text-xs text-left">
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="font-bold text-amber-700 dark:text-amber-400 uppercase text-[10px] tracking-wider mb-1">
              HEADS (A)
            </div>
            <div className="font-semibold text-neutral-900 dark:text-white truncate">
              {optA?.name || 'Option A'}
            </div>
          </div>

          <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="font-bold text-sky-700 dark:text-sky-400 uppercase text-[10px] tracking-wider mb-1">
              TAILS (B)
            </div>
            <div className="font-semibold text-neutral-900 dark:text-white truncate">
              {optB?.name || 'Option B'}
            </div>
          </div>
        </div>

        {/* Coin Flip Visual */}
        <div className="py-6 flex flex-col items-center justify-center">
          <div
            onClick={handleFlip}
            className={`w-28 h-28 rounded-full border-4 border-amber-400 dark:border-amber-300 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 shadow-xl flex items-center justify-center cursor-pointer select-none transition-transform active:scale-95 ${
              isFlipping ? 'animate-bounce scale-110' : ''
            }`}
          >
            <div className="w-22 h-22 rounded-full border-2 border-dashed border-amber-600/50 flex items-center justify-center text-amber-950 font-black text-xl tracking-wider">
              {isFlipping ? '...' : result ? (result === 'heads' ? 'HEADS' : 'TAILS') : 'FLIP'}
            </div>
          </div>

          <button
            onClick={handleFlip}
            disabled={isFlipping}
            className="mt-6 px-5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg shadow-sm transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFlipping ? 'animate-spin' : ''}`} />
            <span>{isFlipping ? 'Flipping in mid-air...' : 'Flip the Coin'}</span>
          </button>
        </div>

        {/* Result Prompt */}
        {result && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2 text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>Coin Landed on: {result.toUpperCase()}</span>
            </div>
            <div className="text-xs text-neutral-800 dark:text-neutral-200">
              The coin selected: <strong className="text-emerald-700 dark:text-emerald-300">{winningOpt?.name}</strong>.
            </div>
            <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800 text-[11px] text-neutral-600 dark:text-neutral-400 italic">
              "Did you feel a slight pang of disappointment or a surge of relief? That reaction is your intuitive subconscious speaking."
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
