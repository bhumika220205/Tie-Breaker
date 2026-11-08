import React, { useState } from 'react';
import { DECISION_TEMPLATES } from '../data/templates';
import { DecisionTemplate } from '../types/decision';
import { X, Sparkles, Plus, Trash2, ArrowRight, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface DecisionInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    dilemma: string;
    options: string[];
    context: string;
    priorities: string[];
  }) => void;
  isLoading: boolean;
}

const COMMON_PRIORITIES = [
  'Financial Upside',
  'Career & Mastery',
  'Work-Life Balance',
  'Autonomy & Agency',
  'Stability & Security',
  'Personal Freedom',
  'Low Long-Term Regret',
  'Speed of Execution',
];

export const DecisionInputModal: React.FC<DecisionInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [dilemma, setDilemma] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [context, setContext] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
    'Financial Upside',
    'Low Long-Term Regret',
  ]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!isOpen) return null;

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const togglePriority = (p: string) => {
    if (selectedPriorities.includes(p)) {
      setSelectedPriorities(selectedPriorities.filter((item) => item !== p));
    } else {
      setSelectedPriorities([...selectedPriorities, p]);
    }
  };

  const handleApplyTemplate = (tmpl: DecisionTemplate) => {
    setDilemma(tmpl.dilemma);
    setOptions(tmpl.options);
    setContext(tmpl.context);
    setSelectedPriorities(tmpl.priorities);
    setShowAdvanced(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dilemma.trim() || isLoading) return;

    // Filter out empty option strings
    const cleanedOptions = options.map((o) => o.trim()).filter(Boolean);

    onSubmit({
      dilemma: dilemma.trim(),
      options: cleanedOptions,
      context: context.trim(),
      priorities: selectedPriorities,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                New Decision Analysis
              </h2>
            </div>
            <p className="text-xs text-neutral-500">
              State your dilemma and options. The Tiebreaker AI will generate weighted pros & cons, a comparison table, and SWOT analysis.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Quick Template Picker */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
              <span>Or Start with a Realistic Dilemma Template:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DECISION_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="p-2 text-left bg-neutral-50 dark:bg-neutral-800/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg border border-neutral-200/80 dark:border-neutral-800 transition-colors"
                >
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {tmpl.category}
                  </div>
                  <div className="text-xs font-medium text-neutral-900 dark:text-white truncate">
                    {tmpl.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Decision Dilemma Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
              What decision do you need to make? <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={dilemma}
              onChange={(e) => setDilemma(e.target.value)}
              placeholder="e.g. Should I leave my comfortable corporate job to join an early-stage AI startup as a founding engineer?"
              className="w-full text-sm p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>

          {/* Options to compare */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Options Under Consideration
              </label>
              {options.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Option</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-neutral-500">
              Leave blank if you'd like AI to identify the optimal opposing choices automatically.
            </p>

            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-neutral-400 w-6 shrink-0">
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={idx === 0 ? 'Option A (e.g. Join the startup)' : 'Option B (e.g. Stay at Big Tech)'}
                    className="flex-1 text-xs p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-2 text-neutral-400 hover:text-rose-500 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Priority Checklist */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
              What matters most to you right now?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PRIORITIES.map((p) => {
                const isSelected = selectedPriorities.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePriority(p)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expandable Advanced Context (Savings, Timeline, Constraints) */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <span>Add Personal Context & Constraints (Optional)</span>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-2">
                <textarea
                  rows={2}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="e.g. Have 6 months of living expenses, planning a wedding next year, prefer lower risk in near term, looking for great mentorship..."
                  className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!dilemma.trim() || isLoading}
              className="px-5 py-2.5 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Decision Studio...</span>
                </>
              ) : (
                <>
                  <span>Run The Tiebreaker Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
