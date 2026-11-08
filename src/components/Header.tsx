import React from 'react';
import { Scale, Plus, Moon, Sun, History, Sparkles, HelpCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'overview' | 'proscons' | 'comparison' | 'swot' | 'stresstest';
  setActiveTab: (tab: 'overview' | 'proscons' | 'comparison' | 'swot' | 'stresstest') => void;
  onOpenNewModal: () => void;
  onOpenHistory: () => void;
  onOpenCoinFlip: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewModal,
  onOpenHistory,
  onOpenCoinFlip,
  isDarkMode,
  onToggleDarkMode,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single element) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 shadow-sm transition-transform group-hover:scale-105">
                <Scale className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white whitespace-nowrap">
                The Tiebreaker
              </span>
            </button>
          </div>

          {/* Zone 2: 4-5 Clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Verdict & Overview
            </button>
            <button
              onClick={() => setActiveTab('proscons')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'proscons'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Weighted Pros & Cons
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'comparison'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Comparison Table
            </button>
            <button
              onClick={() => setActiveTab('swot')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'swot'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              SWOT Analysis
            </button>
            <button
              onClick={() => setActiveTab('stresstest')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'stresstest'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              Devil's Advocate
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Utility Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Coin flip shortcut */}
            <button
              onClick={onOpenCoinFlip}
              title="Psychological Coin Flip Test"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-200 dark:border-neutral-800"
            >
              <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
              <span>Coin Flip</span>
            </button>

            {/* Saved History */}
            <button
              onClick={onOpenHistory}
              title="Saved Decisions History"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-200 dark:border-neutral-800"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">History</span>
              <span className="text-[10px] bg-neutral-200 dark:bg-neutral-700 px-1.5 py-0.2 rounded-full tabular-nums">
                {savedCount}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Decision</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
