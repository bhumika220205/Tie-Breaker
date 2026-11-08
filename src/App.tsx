/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VerdictBanner } from './components/VerdictBanner';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonMatrixView } from './components/ComparisonMatrixView';
import { SWOTMatrixView } from './components/SWOTMatrixView';
import { StressTestView } from './components/StressTestView';
import { DecisionInputModal } from './components/DecisionInputModal';
import { CoinFlipModal } from './components/CoinFlipModal';
import { SavedDecisionsDrawer } from './components/SavedDecisionsDrawer';
import { ExportShareModal } from './components/ExportShareModal';
import { DecisionAnalysis } from './types/decision';
import {
  loadSavedDecisions,
  saveDecision,
  deleteDecision,
  getActiveDecisionId,
  setActiveDecisionId,
} from './utils/storage';
import { SAMPLE_ANALYSIS } from './data/sampleDecision';
import {
  Scale,
  Sparkles,
  Share2,
  HelpCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Flame,
  Table,
  Grid2x2,
  Sliders,
  Award,
} from 'lucide-react';

export default function App() {
  const [savedDecisions, setSavedDecisions] = useState<DecisionAnalysis[]>([]);
  const [currentDecision, setCurrentDecision] = useState<DecisionAnalysis>(SAMPLE_ANALYSIS);
  const [activeTab, setActiveTab] = useState<'overview' | 'proscons' | 'comparison' | 'swot' | 'stresstest'>('overview');
  const [customWeights, setCustomWeights] = useState<Record<string, number>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Modals state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isCoinFlipOpen, setIsCoinFlipOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Initialize data and dark mode
  useEffect(() => {
    // Check saved dark mode preference or system
    const savedTheme = localStorage.getItem('tiebreaker_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const loaded = loadSavedDecisions();
    setSavedDecisions(loaded);

    const activeId = getActiveDecisionId();
    if (activeId) {
      const match = loaded.find((d) => d.id === activeId);
      if (match) {
        setCurrentDecision(match);
        if (match.customWeights) {
          setCustomWeights(match.customWeights);
        }
        return;
      }
    }

    if (loaded.length > 0) {
      setCurrentDecision(loaded[0]);
      if (loaded[0].customWeights) {
        setCustomWeights(loaded[0].customWeights);
      }
    }
  }, []);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('tiebreaker_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('tiebreaker_theme', 'light');
      }
      return next;
    });
  };

  const handleSelectDecision = (decision: DecisionAnalysis) => {
    setCurrentDecision(decision);
    setCustomWeights(decision.customWeights || {});
    setActiveDecisionId(decision.id);
  };

  const handleDeleteDecision = (id: string) => {
    const updated = deleteDecision(id);
    setSavedDecisions(updated);
    if (currentDecision.id === id) {
      if (updated.length > 0) {
        setCurrentDecision(updated[0]);
        setCustomWeights(updated[0].customWeights || {});
        setActiveDecisionId(updated[0].id);
      } else {
        setCurrentDecision(SAMPLE_ANALYSIS);
        saveDecision(SAMPLE_ANALYSIS);
      }
    }
  };

  const handleUpdateStatus = (id: string, status: 'evaluating' | 'decided' | 'archived', winnerId?: string) => {
    const updated = {
      ...currentDecision,
      status,
      selectedWinnerId: winnerId || currentDecision.selectedWinnerId,
    };
    setCurrentDecision(updated);
    saveDecision(updated);
    setSavedDecisions(loadSavedDecisions());
  };

  // Weight changes in Pros/Cons
  const handleWeightChange = (itemId: string, newWeight: number) => {
    const next = { ...customWeights, [itemId]: newWeight };
    setCustomWeights(next);
    const updated = { ...currentDecision, customWeights: next };
    setCurrentDecision(updated);
    saveDecision(updated);
  };

  const handleResetWeights = () => {
    setCustomWeights({});
    const updated = { ...currentDecision, customWeights: {} };
    setCurrentDecision(updated);
    saveDecision(updated);
  };

  // Add custom item
  const handleAddCustomItem = (
    optionId: string,
    type: 'pro' | 'con',
    text: string,
    category: string,
    weight: number
  ) => {
    const newItem = {
      id: `custom-${Date.now()}`,
      text,
      category,
      weight,
      impact: 'User-specified priority factor.',
    };

    const updatedOptions = currentDecision.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      return {
        ...opt,
        pros: type === 'pro' ? [newItem, ...opt.pros] : opt.pros,
        cons: type === 'con' ? [newItem, ...opt.cons] : opt.cons,
      };
    });

    const updated = { ...currentDecision, options: updatedOptions };
    setCurrentDecision(updated);
    saveDecision(updated);
  };

  // Delete item
  const handleDeleteItem = (optionId: string, type: 'pro' | 'con', itemId: string) => {
    const updatedOptions = currentDecision.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      return {
        ...opt,
        pros: type === 'pro' ? opt.pros.filter((p) => p.id !== itemId) : opt.pros,
        cons: type === 'con' ? opt.cons.filter((c) => c.id !== itemId) : opt.cons,
      };
    });

    const updated = { ...currentDecision, options: updatedOptions };
    setCurrentDecision(updated);
    saveDecision(updated);
  };

  // Analyze new decision
  const handleCreateDecision = async (data: {
    dilemma: string;
    options: string[];
    context: string;
    priorities: string[];
  }) => {
    setIsLoadingAnalysis(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze decision.');
      }

      const result = await response.json();

      const newDecision: DecisionAnalysis = {
        id: `decision-${Date.now()}`,
        createdAt: new Date().toISOString(),
        dilemma: data.dilemma,
        title: result.title || data.dilemma,
        summary: result.summary,
        context: data.context,
        priorities: data.priorities,
        options: result.options,
        comparisonTable: result.comparisonTable,
        tiebreakerVerdict: result.tiebreakerVerdict,
        status: 'evaluating',
      };

      saveDecision(newDecision);
      setSavedDecisions(loadSavedDecisions());
      setCurrentDecision(newDecision);
      setCustomWeights({});
      setIsNewModalOpen(false);
      setActiveTab('overview');
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors selection:bg-emerald-500/20">
      {/* Top Bar Contract Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewModal={() => setIsNewModalOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenCoinFlip={() => setIsCoinFlipOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        savedCount={savedDecisions.length}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Active Decision Context Bar */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Active Dilemma
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">
                  {new Date(currentDecision.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span aria-hidden="true">·</span>
                <span>{currentDecision.options.length} Alternatives</span>
                <span aria-hidden="true">·</span>
                <span
                  className={`font-semibold ${
                    currentDecision.status === 'decided'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {currentDecision.status === 'decided' ? 'Decided' : 'In Evaluation'}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-snug">
                {currentDecision.dilemma}
              </h1>

              {currentDecision.summary && (
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
                  {currentDecision.summary}
                </p>
              )}
            </div>

            {/* Utility actions for the active decision */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsCoinFlipOpen(true)}
                title="Coin Flip Gut Check"
                className="px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
                <span>Coin Flip</span>
              </button>

              <button
                onClick={() => setIsExportOpen(true)}
                title="Export or Share Decision"
                className="px-3 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Export Report</span>
              </button>

              <button
                onClick={() => setIsNewModalOpen(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze New Dilemma</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {analysisError && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between">
            <span>{analysisError}</span>
            <button
              onClick={() => setAnalysisError(null)}
              className="text-xs font-bold underline ml-4 hover:text-rose-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Studio View Tabs (Responsive mobile & desktop view switcher) */}
        <div className="flex md:hidden items-center justify-between gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Verdict
          </button>
          <button
            onClick={() => setActiveTab('proscons')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'proscons'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Pros & Cons
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Comparison
          </button>
          <button
            onClick={() => setActiveTab('swot')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'swot'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            SWOT
          </button>
          <button
            onClick={() => setActiveTab('stresstest')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'stresstest'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Stress Test
          </button>
        </div>

        {/* View Switcher Routing */}
        {activeTab === 'overview' && (
          <VerdictBanner
            decision={currentDecision}
            onViewProsCons={() => setActiveTab('proscons')}
            onViewComparison={() => setActiveTab('comparison')}
            onViewSWOT={() => setActiveTab('swot')}
            onOpenStressTest={() => setActiveTab('stresstest')}
          />
        )}

        {activeTab === 'proscons' && (
          <ProsConsView
            decision={currentDecision}
            customWeights={customWeights}
            onWeightChange={handleWeightChange}
            onResetWeights={handleResetWeights}
            onAddCustomItem={handleAddCustomItem}
            onDeleteItem={handleDeleteItem}
          />
        )}

        {activeTab === 'comparison' && (
          <ComparisonMatrixView decision={currentDecision} />
        )}

        {activeTab === 'swot' && (
          <SWOTMatrixView decision={currentDecision} />
        )}

        {activeTab === 'stresstest' && (
          <StressTestView decision={currentDecision} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-6 text-xs text-neutral-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-neutral-400" />
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">The Tiebreaker</span>
            <span aria-hidden="true">·</span>
            <span>Intelligent Decision Studio</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-500">
            <span>Powered by Gemini 3.8 Flash</span>
            <span aria-hidden="true">·</span>
            <span>Weighted Pros/Cons · Comparison Matrix · SWOT Analysis</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <DecisionInputModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateDecision}
        isLoading={isLoadingAnalysis}
      />

      <CoinFlipModal
        isOpen={isCoinFlipOpen}
        onClose={() => setIsCoinFlipOpen(false)}
        options={currentDecision.options}
      />

      <SavedDecisionsDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedDecisions={savedDecisions}
        activeDecisionId={currentDecision.id}
        onSelectDecision={handleSelectDecision}
        onDeleteDecision={handleDeleteDecision}
        onUpdateStatus={handleUpdateStatus}
      />

      <ExportShareModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        decision={currentDecision}
        customWeights={customWeights}
      />
    </div>
  );
}
