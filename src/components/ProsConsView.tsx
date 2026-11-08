import React, { useState } from 'react';
import { DecisionAnalysis, DecisionOption, ProConItem } from '../types/decision';
import { Plus, Sliders, CheckCircle2, XCircle, Trash2, RotateCcw, Filter, Sparkles, Scale } from 'lucide-react';

interface ProsConsViewProps {
  decision: DecisionAnalysis;
  customWeights: Record<string, number>;
  onWeightChange: (itemId: string, newWeight: number) => void;
  onResetWeights: () => void;
  onAddCustomItem: (optionId: string, type: 'pro' | 'con', text: string, category: string, weight: number) => void;
  onDeleteItem: (optionId: string, type: 'pro' | 'con', itemId: string) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  decision,
  customWeights,
  onWeightChange,
  onResetWeights,
  onAddCustomItem,
  onDeleteItem,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(decision.options[0]?.id || '');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddingPro, setIsAddingPro] = useState(false);
  const [isAddingCon, setIsAddingCon] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Personal');
  const [newItemWeight, setNewItemWeight] = useState(3);

  // Compute live scores for each option based on customWeights
  const calculateOptionScore = (opt: DecisionOption) => {
    let proScore = 0;
    let conScore = 0;

    opt.pros.forEach((p) => {
      const weight = customWeights[p.id] ?? p.weight;
      proScore += weight * 10;
    });

    opt.cons.forEach((c) => {
      const weight = customWeights[c.id] ?? c.weight;
      conScore += weight * 10;
    });

    const netScore = proScore - conScore;
    return { proScore, conScore, netScore };
  };

  const optionScores = decision.options.map((opt) => ({
    option: opt,
    ...calculateOptionScore(opt),
  }));

  // Find max net score for relative scale
  const activeOption = decision.options.find((o) => o.id === selectedOptionId) || decision.options[0];
  const activeScore = calculateOptionScore(activeOption);

  // Extract all categories
  const allCategories = Array.from(
    new Set([
      ...activeOption.pros.map((p) => p.category),
      ...activeOption.cons.map((c) => c.category),
    ])
  );

  const filteredPros = filterCategory === 'all'
    ? activeOption.pros
    : activeOption.pros.filter((p) => p.category === filterCategory);

  const filteredCons = filterCategory === 'all'
    ? activeOption.cons
    : activeOption.cons.filter((c) => c.category === filterCategory);

  const handleCreateItem = (type: 'pro' | 'con') => {
    if (!newItemText.trim()) return;
    onAddCustomItem(activeOption.id, type, newItemText.trim(), newItemCategory, newItemWeight);
    setNewItemText('');
    setIsAddingPro(false);
    setIsAddingCon(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Dynamic Live Weighted Scoreboard */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Live Weighted Decision Balance
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Adjust sliders below (1-5) to reflect your personal values. Scores update in real time.
            </p>
          </div>

          <button
            onClick={onResetWeights}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors border border-neutral-200 dark:border-neutral-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Weights to AI Defaults</span>
          </button>
        </div>

        {/* Multi-Option comparative balance meter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {optionScores.map(({ option, proScore, conScore, netScore }) => {
            const isLeading = optionScores.every((s) => netScore >= s.netScore);
            return (
              <div
                key={option.id}
                onClick={() => setSelectedOptionId(option.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedOptionId === option.id
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                    {option.name}
                  </div>
                  {isLeading && (
                    <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full shrink-0">
                      Leading
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-extrabold text-neutral-900 dark:text-white tabular-nums">
                    {netScore > 0 ? `+${netScore}` : netScore}
                  </span>
                  <span className="text-xs text-neutral-500">Net Points</span>
                </div>

                {/* Micro visual bar */}
                <div className="space-y-1 text-[11px] text-neutral-500">
                  <div className="flex justify-between tabular-nums">
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Pros: +{proScore}</span>
                    <span className="text-rose-600 dark:text-rose-400 font-medium">Cons: -{conScore}</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${(proScore / (proScore + conScore || 1)) * 100}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full"
                      style={{ width: `${(conScore / (proScore + conScore || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Option Selector Tabs & Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-3">
        {/* Interactive Option Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          {decision.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedOptionId(opt.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                selectedOptionId === opt.id
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                filterCategory === 'all'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              All
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  filterCategory === cat
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Two Columns: PROS (Left) and CONS (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PROS COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-900/50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Pros ({filteredPros.length})
              </h3>
              <span className="text-xs text-neutral-500 tabular-nums">
                +{activeScore.proScore} pts
              </span>
            </div>
            <button
              onClick={() => {
                setIsAddingPro(!isAddingPro);
                setIsAddingCon(false);
              }}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Pro</span>
            </button>
          </div>

          {/* Inline Add Pro Form */}
          {isAddingPro && (
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-3">
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Add Custom Pro
              </div>
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="e.g. Higher equity upside, closer to family..."
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-500">Weight:</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={newItemWeight}
                    onChange={(e) => setNewItemWeight(parseInt(e.target.value, 10))}
                    className="w-24 accent-emerald-600"
                  />
                  <span className="font-bold tabular-nums text-neutral-800 dark:text-neutral-200">
                    {newItemWeight}/5
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddingPro(false)}
                    className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleCreateItem('pro')}
                    className="px-3 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                  >
                    Save Pro
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pros List */}
          <div className="space-y-3">
            {filteredPros.map((pro) => {
              const weight = customWeights[pro.id] ?? pro.weight;
              return (
                <div
                  key={pro.id}
                  className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-emerald-200 dark:hover:border-emerald-900/60 transition-colors shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-neutral-400 font-medium">
                        {pro.category}
                      </div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-white leading-snug">
                        {pro.text}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteItem(activeOption.id, 'pro', pro.id)}
                      title="Remove this factor"
                      className="text-neutral-400 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {pro.impact && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {pro.impact}
                    </p>
                  )}

                  {/* Interactive Slider for Weight */}
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Sliders className="w-3 h-3" />
                      <span>Importance Weight:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={weight}
                        onChange={(e) => onWeightChange(pro.id, parseInt(e.target.value, 10))}
                        className="w-24 accent-emerald-600 cursor-pointer"
                      />
                      <span className="font-bold text-neutral-900 dark:text-white tabular-nums w-8 text-right">
                        {weight}/5
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CONS COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-rose-200 dark:border-rose-900/50">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Cons ({filteredCons.length})
              </h3>
              <span className="text-xs text-neutral-500 tabular-nums">
                -{activeScore.conScore} pts
              </span>
            </div>
            <button
              onClick={() => {
                setIsAddingCon(!isAddingCon);
                setIsAddingPro(false);
              }}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Con</span>
            </button>
          </div>

          {/* Inline Add Con Form */}
          {isAddingCon && (
            <div className="p-4 bg-rose-50/50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800 space-y-3">
              <div className="text-xs font-bold text-rose-800 dark:text-rose-300">
                Add Custom Con / Downside
              </div>
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="e.g. Higher monthly burn rate, longer commute..."
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-500">Weight:</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={newItemWeight}
                    onChange={(e) => setNewItemWeight(parseInt(e.target.value, 10))}
                    className="w-24 accent-rose-600"
                  />
                  <span className="font-bold tabular-nums text-neutral-800 dark:text-neutral-200">
                    {newItemWeight}/5
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddingCon(false)}
                    className="px-2.5 py-1 text-xs text-neutral-600 hover:text-neutral-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleCreateItem('con')}
                    className="px-3 py-1 text-xs font-semibold bg-rose-600 text-white rounded-md hover:bg-rose-700"
                  >
                    Save Con
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Cons List */}
          <div className="space-y-3">
            {filteredCons.map((con) => {
              const weight = customWeights[con.id] ?? con.weight;
              return (
                <div
                  key={con.id}
                  className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-rose-200 dark:hover:border-rose-900/60 transition-colors shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-neutral-400 font-medium">
                        {con.category}
                      </div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-white leading-snug">
                        {con.text}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteItem(activeOption.id, 'con', con.id)}
                      title="Remove this factor"
                      className="text-neutral-400 hover:text-rose-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {con.impact && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {con.impact}
                    </p>
                  )}

                  {/* Interactive Slider for Weight */}
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <Sliders className="w-3 h-3" />
                      <span>Importance Weight:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={weight}
                        onChange={(e) => onWeightChange(con.id, parseInt(e.target.value, 10))}
                        className="w-24 accent-rose-600 cursor-pointer"
                      />
                      <span className="font-bold text-neutral-900 dark:text-white tabular-nums w-8 text-right">
                        {weight}/5
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
