AI-powered decision studio offering multi-angle analysis: weighted pros & cons, comparative tables, and SWOT matrix.

# ⚖️ The Tiebreaker — AI Decision Studio

> **Transform dilemmas into decisive action.**  
> An intelligent decision studio powered by Google Gemini that analyzes complex choices through weighted pros & cons, comparative matrices, 2×2 SWOT analysis, and behavioral tiebreakers.

---

## 🌟 Key Features

### 🏆 1. The Tiebreaker Verdict & The Hinge Question
- **The Deciding Question**: Pinpoints the single hinge question that resolves the dilemma (*"If you answer YES to X, choose Option A; if NO, choose Option B"*).
- **Executive Recommendation & Confidence Score**: Synthesizes trade-offs with an overall confidence percentage and strategic rationale.
- **Two-Way Door Framing**: Analyzes decisions through Jeff Bezos' Type 1 (irreversible one-way door) vs. Type 2 (reversible two-way door) mental models.
- **Blindspot Spotter & Mitigation Playbook**: Flags non-obvious cognitive traps and gives concrete risk-mitigation tactics.

### ⚖️ 2. Dynamic Weighted Pros & Cons
- **Categorized Breakdown**: Detailed pros and cons categorized by Growth, Financial, Risk, Culture, and Lifestyle.
- **Real-Time Value Sliders (1–5)**: Adjust the personal importance of individual factors. Watch the net balance score dynamically shift in real time as your priorities change.
- **Custom Factors**: Add your own custom pros/cons or delete factors on the fly.

### 📊 3. Multi-Dimensional Comparison Matrix
- **Side-by-Side Tabular Matrix**: Evaluates all options across key dimensions (Financial Impact, Skill Velocity, Daily Stress, Reversibility, Long-Term Regret).
- **Qualitative & Quantitative Ratings**: 1–10 scores with progress bars, comparative notes, and overall option averages.
- **Importance Sorting**: Sort criteria by priority (High, Medium, Low).

### 🧭 4. Strategic 2×2 SWOT Matrix
- **Quadrant Grid**: Explores Strengths, Weaknesses, Opportunities, and Threats for each alternative.
- **Dual View Modes**: Switch between focused single-option analysis and side-by-side comparison.
- **Cross-Quadrant Directives**: Actionable S-O offensive maneuvers and W-T defensive safeguards.

### 🔥 5. Devil's Advocate & Pre-Mortem Red Team
- **18-Month Nightmare Scenario**: Inverts thinking by simulating how a choice could plausibly fail step-by-step.
- **Piercing Confrontation Questions**: Highlights questions people avoid due to wishful thinking or sunk costs.
- **Day-90 Acid Test**: Provides a verifiable metric to validate the decision in the first 90 days.

### 🪙 6. Psychological Coin Flip Test
- Uses behavioral science: flipping a coin triggers your gut reaction in mid-air, revealing which outcome you were subconsciously rooting for before it lands.

### 💾 7. Persistence & Export
- **Auto-Save & History**: Decisions and custom weight adjustments are automatically persisted locally.
- **Status Tracking**: Track dilemmas across *Evaluating* and *Decided* states.
- **1-Click Markdown & Print Export**: Copy formatted reports for Notion, Google Docs, Slack, or print to PDF.
- **Pre-Loaded Templates**: Explore realistic scenarios (Career Transitions, Home Buying vs Renting, Tech Build vs Buy, Overseas Relocation).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **Backend**: Node.js, Express, TSX
- **AI Engine**: `@google/genai` TypeScript SDK with `gemini-3.8-flash`
- **Build Tool**: Vite 8

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/the-tiebreaker.git
   cd the-tiebreaker
