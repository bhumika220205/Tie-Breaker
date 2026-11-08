import React, { useState } from 'react';
import { DecisionAnalysis, StressTestResult } from '../types/decision';
import { Flame, AlertTriangle, HelpCircle, Shield, CheckCircle, RefreshCw } from 'lucide-react';

interface StressTestViewProps {
  decision: DecisionAnalysis;
}

export const StressTestView: React.FC<StressTestViewProps> = ({ decision }) => {
  const { options, dilemma } = decision;
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    decision.tiebreakerVerdict.recommendedOptionId || options[0]?.id || ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<StressTestResult | null>(null);

  const activeOption = options.find((o) => o.id === selectedOptionId) || options[0];

  const handleRunStressTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/stress-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dilemma,
          optionName: activeOption.name,
          allOptions: options.map((o) => o.name),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to complete stress test.');
      }

      const data: StressTestResult = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while stress testing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Devil's Advocate & Pre-Mortem Red Team
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Invert your thinking: Simulate catastrophic failure and uncover wishful thinking before you sign or commit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Target Option:</span>
            <select
              value={selectedOptionId}
              onChange={(e) => {
                setSelectedOptionId(e.target.value);
                setTestResult(null);
              }}
              className="text-xs p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleRunStressTest}
              disabled={loading}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Stress Testing...</span>
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5" />
                  <span>Execute Pre-Mortem</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* When no test has run yet */}
      {!testResult && !loading && (
        <div className="p-12 text-center bg-white dark:bg-neutral-900 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
            Ready to Stress-Test "{activeOption.name}"
          </h4>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            A pre-mortem asks: "Imagine it is 18 months from today and this decision was a disaster. What went wrong?" Click below to simulate the worst-case failure mode.
          </p>
          <button
            onClick={handleRunStressTest}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-all"
          >
            Launch Pre-Mortem Simulation
          </button>
        </div>
      )}

      {/* Stress Test Results */}
      {testResult && (
        <div className="space-y-6">
          {/* Nightmare Scenario */}
          <div className="bg-rose-50/50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/60 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 dark:text-rose-200">
                The 18-Month Nightmare Scenario
              </h4>
            </div>
            <p className="text-sm text-rose-950 dark:text-rose-100 leading-relaxed font-serif">
              "{testResult.nightmareScenario}"
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Piercing Confrontation Questions */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-3 shadow-sm">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Piercing Confrontation Questions
                </h4>
              </div>
              <p className="text-xs text-neutral-500">
                Are you avoiding answering these truthfully?
              </p>
              <ul className="space-y-2.5">
                {testResult.piercingQuestions.map((q, idx) => (
                  <li
                    key={idx}
                    className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-800 text-xs text-neutral-800 dark:text-neutral-200 flex items-start gap-2.5"
                  >
                    <span className="font-mono text-amber-600 font-bold shrink-0 mt-0.5">
                      ?{idx + 1}
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hard Truth & Acid Test Metric */}
            <div className="space-y-6">
              {/* The Hard Truth */}
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-2 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  The Hard Truth You Secretly Know
                </div>
                <p className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white leading-relaxed">
                  {testResult.hardTruth}
                </p>
              </div>

              {/* The Day 90 Acid Test Metric */}
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Day 90 Acid Test Metric
                  </div>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300">
                  {testResult.acidTestMetric}
                </p>
              </div>
            </div>
          </div>

          {/* Survival Checklist */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-3 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              De-Risking Survival Checklist Before You Commit
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {testResult.survivalChecklist.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg border border-neutral-200/60 dark:border-neutral-800 flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
