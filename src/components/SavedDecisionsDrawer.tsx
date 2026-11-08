import React from 'react';
import { DecisionAnalysis } from '../types/decision';
import { X, Trash2, CheckCircle2, Clock, Archive, ChevronRight, Scale } from 'lucide-react';

interface SavedDecisionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: DecisionAnalysis[];
  activeDecisionId: string;
  onSelectDecision: (decision: DecisionAnalysis) => void;
  onDeleteDecision: (id: string) => void;
  onUpdateStatus: (id: string, status: 'evaluating' | 'decided' | 'archived', winnerId?: string) => void;
}

export const SavedDecisionsDrawer: React.FC<SavedDecisionsDrawerProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  activeDecisionId,
  onSelectDecision,
  onDeleteDecision,
  onUpdateStatus,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Decision History ({savedDecisions.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            {savedDecisions.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                No saved decisions yet. Run your first analysis!
              </div>
            ) : (
              savedDecisions.map((dec) => {
                const isActive = dec.id === activeDecisionId;
                const status = dec.status || 'evaluating';

                return (
                  <div
                    key={dec.id}
                    className={`p-4 rounded-xl border transition-all text-left space-y-2.5 ${
                      isActive
                        ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 ring-1 ring-emerald-500'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/40 dark:bg-neutral-800/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        onClick={() => {
                          onSelectDecision(dec);
                          onClose();
                        }}
                        className="cursor-pointer space-y-0.5 flex-1"
                      >
                        <div className="text-xs text-neutral-400 font-mono">
                          {new Date(dec.createdAt).toLocaleDateString()}
                        </div>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-2">
                          {dec.title || dec.dilemma}
                        </h4>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDecision(dec.id);
                        }}
                        title="Delete decision"
                        className="p-1 text-neutral-400 hover:text-rose-500 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-neutral-500 line-clamp-2">
                      {dec.tiebreakerVerdict.headlineVerdict}
                    </p>

                    {/* Status & Winner Assignment */}
                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onUpdateStatus(dec.id, 'evaluating')}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                            status === 'evaluating'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                              : 'text-neutral-400 hover:text-neutral-600'
                          }`}
                        >
                          Evaluating
                        </button>
                        <button
                          onClick={() => onUpdateStatus(dec.id, 'decided')}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                            status === 'decided'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'text-neutral-400 hover:text-neutral-600'
                          }`}
                        >
                          Decided
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          onSelectDecision(dec);
                          onClose();
                        }}
                        className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
                      >
                        <span>Open</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
