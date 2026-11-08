import React, { useState } from 'react';
import { DecisionAnalysis, OptionSWOT } from '../types/decision';
import { Grid2x2, TrendingUp, AlertOctagon, Zap, ShieldAlert, ArrowRight } from 'lucide-react';

interface SWOTMatrixViewProps {
  decision: DecisionAnalysis;
}

export const SWOTMatrixView: React.FC<SWOTMatrixViewProps> = ({ decision }) => {
  const { options } = decision;
  const [activeOptionId, setActiveOptionId] = useState<string>(options[0]?.id || '');
  const [viewMode, setViewMode] = useState<'single' | 'side-by-side'>('single');

  const activeOption = options.find((o) => o.id === activeOptionId) || options[0];

  const renderQuadrant = (
    title: string,
    subtitle: string,
    icon: React.ReactNode,
    items: Array<{ title: string; detail: string }>,
    accentClass: string,
    bgClass: string,
    borderClass: string
  ) => (
    <div className={`p-5 rounded-xl border ${borderClass} ${bgClass} space-y-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${accentClass}`}>{icon}</div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              {title}
            </h4>
            <span className="text-[11px] text-neutral-500">{subtitle}</span>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-neutral-400 tabular-nums">
          {items.length} factors
        </span>
      </div>

      <div className="space-y-2.5 pt-1">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-1"
          >
            <div className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              <span className="text-neutral-400 font-mono text-[10px]">{idx + 1}.</span>
              <span>{item.title}</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed pl-3.5">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* SWOT Header & Option Switcher */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Grid2x2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                SWOT Strategic Analysis Matrix
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Evaluate internal dynamics (Strengths & Weaknesses) and external forces (Opportunities & Threats).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
              <button
                onClick={() => setViewMode('single')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  viewMode === 'single'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                Focused 2x2 View
              </button>
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  viewMode === 'side-by-side'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                All Options
              </button>
            </div>
          </div>
        </div>

        {/* Option Tabs for Single Mode */}
        {viewMode === 'single' && (
          <div className="flex items-center gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-4 overflow-x-auto">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setActiveOptionId(opt.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all text-left ${
                  activeOptionId === opt.id
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <div className="font-bold">{opt.name}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Focused View */}
      {viewMode === 'single' ? (
        <div className="space-y-6">
          <div className="text-xs text-neutral-500 font-medium">
            Viewing Strategic SWOT for: <span className="text-neutral-900 dark:text-white font-bold">{activeOption.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* STRENGTHS */}
            {renderQuadrant(
              'Strengths',
              'Internal Advantages',
              <Zap className="w-4 h-4 text-emerald-700 dark:text-emerald-300" />,
              activeOption.swot.strengths,
              'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400',
              'bg-emerald-50/30 dark:bg-emerald-950/20',
              'border-emerald-200 dark:border-emerald-900/60'
            )}

            {/* WEAKNESSES */}
            {renderQuadrant(
              'Weaknesses',
              'Internal Disadvantages',
              <AlertOctagon className="w-4 h-4 text-amber-700 dark:text-amber-300" />,
              activeOption.swot.weaknesses,
              'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400',
              'bg-amber-50/30 dark:bg-amber-950/20',
              'border-amber-200 dark:border-amber-900/60'
            )}

            {/* OPPORTUNITIES */}
            {renderQuadrant(
              'Opportunities',
              'External Tailwinds & Upside',
              <TrendingUp className="w-4 h-4 text-sky-700 dark:text-sky-300" />,
              activeOption.swot.opportunities,
              'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400',
              'bg-sky-50/30 dark:bg-sky-950/20',
              'border-sky-200 dark:border-sky-900/60'
            )}

            {/* THREATS */}
            {renderQuadrant(
              'Threats',
              'External Hazards & Downside',
              <ShieldAlert className="w-4 h-4 text-rose-700 dark:text-rose-300" />,
              activeOption.swot.threats,
              'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400',
              'bg-rose-50/30 dark:bg-rose-950/20',
              'border-rose-200 dark:border-rose-900/60'
            )}
          </div>

          {/* Strategic Synthesis Callout */}
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
              Cross-Quadrant Strategic Directives for {activeOption.name}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg space-y-1">
                <div className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>S-O Offensive Maneuver:</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Leverage internal strengths to aggressively capitalize on external opportunities before the market window narrows.
                </p>
              </div>
              <div className="p-3 bg-neutral-50 dark:bg-neutral-850 rounded-lg space-y-1">
                <div className="font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>W-T Defensive Safeguard:</span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Address core internal weaknesses to avoid exposure when external threats or market fluctuations materialize.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Side by Side Mode for All Options */
        <div className="space-y-8">
          {options.map((opt) => (
            <div
              key={opt.id}
              className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-sm"
            >
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">{opt.name}</h3>
                <p className="text-xs text-neutral-500">{opt.tagline}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderQuadrant(
                  'Strengths',
                  'Internal Advantages',
                  <Zap className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />,
                  opt.swot.strengths,
                  'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400',
                  'bg-emerald-50/20 dark:bg-emerald-950/10',
                  'border-emerald-200/60 dark:border-emerald-900/40'
                )}
                {renderQuadrant(
                  'Weaknesses',
                  'Internal Disadvantages',
                  <AlertOctagon className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />,
                  opt.swot.weaknesses,
                  'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400',
                  'bg-amber-50/20 dark:bg-amber-950/10',
                  'border-amber-200/60 dark:border-amber-900/40'
                )}
                {renderQuadrant(
                  'Opportunities',
                  'External Upside',
                  <TrendingUp className="w-3.5 h-3.5 text-sky-700 dark:text-sky-300" />,
                  opt.swot.opportunities,
                  'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400',
                  'bg-sky-50/20 dark:bg-sky-950/10',
                  'border-sky-200/60 dark:border-sky-900/40'
                )}
                {renderQuadrant(
                  'Threats',
                  'External Hazards',
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-700 dark:text-rose-300" />,
                  opt.swot.threats,
                  'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400',
                  'bg-rose-50/20 dark:bg-rose-950/10',
                  'border-rose-200/60 dark:border-rose-900/40'
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
