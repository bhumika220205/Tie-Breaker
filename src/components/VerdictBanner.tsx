import React from 'react';
import { DecisionAnalysis } from '../types/decision';
import { Award, Sparkles, AlertTriangle, ShieldCheck, DoorOpen, Compass, ChevronRight } from 'lucide-react';

interface VerdictBannerProps {
  decision: DecisionAnalysis;
  onViewProsCons: () => void;
  onViewComparison: () => void;
  onViewSWOT: () => void;
  onOpenStressTest: () => void;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({
  decision,
  onViewProsCons,
  onViewComparison,
  onViewSWOT,
  onOpenStressTest,
}) => {
  const { tiebreakerVerdict, options } = decision;
  const recommendedOpt = options.find((o) => o.id === tiebreakerVerdict.recommendedOptionId) || options[0];

  return (
    <div className="space-y-6">
      {/* Primary The Tiebreaker Verdict Card */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background tint */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Eyebrow & Confidence */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                THE TIEBREAKER VERDICT
              </span>
              <span aria-hidden="true">·</span>
              <span>AI Strategic Synthesis</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{options.length} Options Evaluated</span>
            </div>

            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full text-xs font-medium text-neutral-700 dark:text-neutral-300">
              <span className="text-neutral-500">Confidence:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {tiebreakerVerdict.confidencePercent}%
              </span>
            </div>
          </div>

          {/* Headline Recommendation */}
          <div>
            <div className="text-xs font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500 mb-1">
              Recommended Choice: {recommendedOpt.name}
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-neutral-900 dark:text-white leading-tight">
              {tiebreakerVerdict.headlineVerdict}
            </h2>
          </div>

          {/* THE TIEBREAKER HINGE QUESTION - THE CORE DIFFERENTIATOR */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5">
                <Compass className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  The Deciding Question (The Tiebreaker Factor)
                </div>
                <p className="text-sm sm:text-base font-semibold text-emerald-950 dark:text-emerald-100 leading-snug">
                  {tiebreakerVerdict.theDecidingQuestion}
                </p>
              </div>
            </div>
          </div>

          {/* Core Rationale */}
          <div className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-4xl">
            {tiebreakerVerdict.coreRationale}
          </div>

          {/* Reversibility / Two-Way Door Framing */}
          <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl p-4 border border-neutral-200/70 dark:border-neutral-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 shrink-0">
              <DoorOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mb-0.5">
                Reversibility Assessment (Type 1 vs Type 2 Decision)
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                {tiebreakerVerdict.twoWayDoorAnalysis}
              </p>
            </div>
          </div>

          {/* Quick jump action buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              onClick={onViewProsCons}
              className="px-3.5 py-2 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Inspect Weighted Pros & Cons</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
            </button>
            <button
              onClick={onViewComparison}
              className="px-3.5 py-2 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Open Comparison Matrix</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
            </button>
            <button
              onClick={onViewSWOT}
              className="px-3.5 py-2 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Examine SWOT Analysis</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
            </button>
            <button
              onClick={onOpenStressTest}
              className="px-3.5 py-2 text-xs font-medium bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-800 dark:text-rose-300 rounded-lg transition-colors flex items-center gap-1.5 border border-rose-200 dark:border-rose-900/50"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Run Devil's Advocate Pre-Mortem</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Deep Insights: Blindspots & Risk Mitigations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blindspots Box */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Overlooked Blindspots & Hidden Traps
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Cognitive biases often make us ignore friction points or secondary consequences:
          </p>
          <ul className="space-y-2.5">
            {tiebreakerVerdict.blindspots.map((b, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 flex items-start gap-2.5 bg-neutral-50 dark:bg-neutral-800/50 p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800"
              >
                <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold shrink-0 mt-0.5">
                  0{idx + 1}.
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risk Mitigation Playbook */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Downside Protection & Mitigation Strategy
            </h3>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Actionable guardrails to de-risk the chosen direction before committing:
          </p>
          <div className="space-y-2.5">
            {tiebreakerVerdict.riskMitigations.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-800 space-y-1"
              >
                <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <span>Risk:</span>
                  <span>{item.risk}</span>
                </div>
                <div className="text-xs text-neutral-700 dark:text-neutral-300">
                  <span className="font-medium text-emerald-700 dark:text-emerald-400">Action: </span>
                  {item.suggestion}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
