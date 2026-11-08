import React, { useState } from 'react';
import { DecisionAnalysis } from '../types/decision';
import { X, Copy, Check, Printer, Download, Share2 } from 'lucide-react';

interface ExportShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  decision: DecisionAnalysis;
  customWeights: Record<string, number>;
}

export const ExportShareModal: React.FC<ExportShareModalProps> = ({
  isOpen,
  onClose,
  decision,
  customWeights,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    const { title, dilemma, context, tiebreakerVerdict, options, comparisonTable } = decision;

    let md = `# Decision Studio: ${title}\n\n`;
    md += `**Dilemma:** ${dilemma}\n`;
    if (context) md += `**Context:** ${context}\n`;
    md += `\n---\n\n`;

    md += `## 🏆 The Tiebreaker Verdict\n`;
    md += `**Recommendation:** ${tiebreakerVerdict.headlineVerdict}\n`;
    md += `**Confidence:** ${tiebreakerVerdict.confidencePercent}%\n\n`;
    md += `### 🎯 The Deciding Question (Tiebreaker Factor)\n> ${tiebreakerVerdict.theDecidingQuestion}\n\n`;
    md += `**Core Rationale:**\n${tiebreakerVerdict.coreRationale}\n\n`;
    md += `**Reversibility:** ${tiebreakerVerdict.twoWayDoorAnalysis}\n\n`;

    md += `### ⚠️ Overlooked Blindspots\n`;
    tiebreakerVerdict.blindspots.forEach((b, i) => {
      md += `${i + 1}. ${b}\n`;
    });
    md += `\n`;

    md += `### 🛡️ Downside Mitigation Strategy\n`;
    tiebreakerVerdict.riskMitigations.forEach((m) => {
      md += `- **Risk:** ${m.risk}\n  - **Action:** ${m.suggestion}\n`;
    });
    md += `\n---\n\n`;

    md += `## ⚖️ Weighted Pros & Cons\n\n`;
    options.forEach((opt) => {
      md += `### Option: ${opt.name}\n_${opt.tagline}_\n\n`;
      md += `**PROS:**\n`;
      opt.pros.forEach((p) => {
        const w = customWeights[p.id] ?? p.weight;
        md += `- [Weight: ${w}/5] **${p.text}** (${p.category}) - ${p.impact}\n`;
      });
      md += `\n**CONS:**\n`;
      opt.cons.forEach((c) => {
        const w = customWeights[c.id] ?? c.weight;
        md += `- [Weight: ${w}/5] **${c.text}** (${c.category}) - ${c.impact}\n`;
      });
      md += `\n`;
    });

    md += `\n---\n\n`;
    md += `## 📊 Comparison Matrix\n\n`;
    md += `| Dimension | Importance | ` + options.map((o) => o.name).join(' | ') + ` |\n`;
    md += `|---|---|` + options.map(() => '---|').join('') + `\n`;
    comparisonTable.forEach((row) => {
      const scores = options.map((opt) => {
        const s = row.scores.find((x) => x.optionId === opt.id);
        return `${s?.rating || 0}/10: ${s?.comment || ''}`;
      });
      md += `| ${row.dimension} | ${row.importance} | ${scores.join(' | ')} |\n`;
    });

    md += `\n---\n\n`;
    md += `## 🧭 SWOT Matrix\n\n`;
    options.forEach((opt) => {
      md += `### ${opt.name} SWOT:\n`;
      md += `- **Strengths:** ${opt.swot.strengths.map((s) => s.title).join(', ')}\n`;
      md += `- **Weaknesses:** ${opt.swot.weaknesses.map((w) => w.title).join(', ')}\n`;
      md += `- **Opportunities:** ${opt.swot.opportunities.map((o) => o.title).join(', ')}\n`;
      md += `- **Threats:** ${opt.swot.threats.map((t) => t.title).join(', ')}\n\n`;
    });

    md += `\n_Generated with The Tiebreaker AI Decision Studio._\n`;
    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl max-w-2xl w-full p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Export & Share Decision Report
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-neutral-500">
          Copy a clean markdown summary of this analysis to paste into Notion, Google Docs, Slack, or email.
        </p>

        {/* Markdown preview box */}
        <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 max-h-72 overflow-y-auto">
          <pre className="text-[11px] font-mono text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed">
            {generateMarkdown()}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print View</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
