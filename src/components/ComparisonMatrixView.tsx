import React, { useState } from 'react';
import { DecisionAnalysis, ComparisonDimension } from '../types/decision';
import { Table, ArrowUpDown, Info, Check, Sparkles } from 'lucide-react';

interface ComparisonMatrixViewProps {
  decision: DecisionAnalysis;
}

export const ComparisonMatrixView: React.FC<ComparisonMatrixViewProps> = ({ decision }) => {
  const { comparisonTable, options } = decision;
  const [sortBy, setSortBy] = useState<'default' | 'importance'>('default');

  // Compute average score per option across all dimensions
  const optionAverages: Record<string, number> = {};
  options.forEach((opt) => {
    let sum = 0;
    let count = 0;
    comparisonTable.forEach((row) => {
      const match = row.scores.find((s) => s.optionId === opt.id);
      if (match) {
        sum += match.rating;
        count++;
      }
    });
    optionAverages[opt.id] = count > 0 ? Number((sum / count).toFixed(1)) : 0;
  });

  const sortedRows = [...comparisonTable].sort((a, b) => {
    if (sortBy === 'importance') {
      const rank: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
      return (rank[b.importance] || 0) - (rank[a.importance] || 0);
    }
    return 0;
  });

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 8) return 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/70 dark:text-emerald-300';
    if (rating >= 6) return 'text-amber-700 bg-amber-100 dark:bg-amber-950/70 dark:text-amber-300';
    return 'text-rose-700 bg-rose-100 dark:bg-rose-950/70 dark:text-rose-300';
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Multi-Dimensional Comparison Matrix
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Direct side-by-side evaluation across core decision criteria with 1-10 qualitative ratings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Sort by:</span>
            <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs">
              <button
                onClick={() => setSortBy('default')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  sortBy === 'default'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setSortBy('importance')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  sortBy === 'importance'
                    ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                Importance (High → Low)
              </button>
            </div>
          </div>
        </div>

        {/* Aggregate Ratings Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-4">
          {options.map((opt) => (
            <div
              key={opt.id}
              className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between"
            >
              <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate pr-2">
                {opt.name}
              </div>
              <div className="flex items-baseline gap-1.5 shrink-0">
                <span className="text-lg font-extrabold text-neutral-900 dark:text-white tabular-nums">
                  {optionAverages[opt.id]}
                </span>
                <span className="text-[10px] text-neutral-400">/ 10 avg</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Comparison Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 text-neutral-600 dark:text-neutral-400">
                <th className="p-4 font-semibold w-1/4 min-w-[200px]">Decision Dimension</th>
                <th className="p-4 font-semibold w-24">Weight</th>
                {options.map((opt) => (
                  <th key={opt.id} className="p-4 font-semibold min-w-[240px]">
                    <div className="text-neutral-900 dark:text-white font-bold">{opt.name}</div>
                    <div className="text-[11px] font-normal text-neutral-400 truncate mt-0.5">
                      {opt.tagline}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {sortedRows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  {/* Dimension Name & Notes */}
                  <td className="p-4 align-top">
                    <div className="font-semibold text-neutral-900 dark:text-white">
                      {row.dimension}
                    </div>
                    {row.notes && (
                      <div className="text-[11px] text-neutral-400 mt-1 flex items-start gap-1">
                        <Info className="w-3 h-3 text-neutral-400 shrink-0 mt-0.5" />
                        <span>{row.notes}</span>
                      </div>
                    )}
                  </td>

                  {/* Importance */}
                  <td className="p-4 align-top whitespace-nowrap">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        row.importance === 'High'
                          ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                          : row.importance === 'Medium'
                          ? 'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}
                    >
                      {row.importance}
                    </span>
                  </td>

                  {/* Option Scores & Qualitative Comments */}
                  {options.map((opt) => {
                    const scoreObj = row.scores.find((s) => s.optionId === opt.id);
                    const rating = scoreObj?.rating || 0;
                    return (
                      <td key={opt.id} className="p-4 align-top">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded tabular-nums ${getRatingBadgeColor(
                                rating
                              )}`}
                            >
                              {rating} / 10
                            </span>
                            {/* Score progress bar */}
                            <div className="w-20 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${rating * 10}%` }}
                              />
                            </div>
                          </div>
                          <p className="text-neutral-600 dark:text-neutral-300 text-xs leading-relaxed">
                            {scoreObj?.comment || 'N/A'}
                          </p>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
