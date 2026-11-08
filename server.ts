import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Endpoint: Analyze Decision (Pros/Cons, Comparison Matrix, SWOT, Tiebreaker)
app.post('/api/analyze-decision', async (req, res) => {
  try {
    const { dilemma, options, context, priorities } = req.body;

    if (!dilemma || typeof dilemma !== 'string') {
      return res.status(400).json({ error: 'Please provide a valid decision dilemma.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check Settings > Secrets.',
      });
    }

    const prompt = `You are "The Tiebreaker", an elite decision-analysis strategist, behavioral economist, and cognitive bias auditor.
The user has the following decision dilemma:
"${dilemma}"

${options && options.length > 0 ? `The options currently under consideration are:
${options.map((opt: string, i: number) => `- Option ${i + 1}: ${opt}`).join('\n')}` : 'If options are not explicitly provided, create 2 to 3 distinct, realistic, mutually exclusive options (e.g. for a "Should I do X?" query, Option 1 is "Do X", Option 2 is "Stay course / Don\'t do X", or an optimized hybrid Option 3).'}

${context ? `Additional user context, values, or constraints:\n${context}` : ''}
${priorities && priorities.length > 0 ? `Key user priorities/criteria:\n${priorities.join(', ')}` : ''}

Provide a comprehensive, objective, and deeply actionable decision breakdown containing:
1. Normalized options (id, name, 1-sentence tagline).
2. For EACH option:
   - 4 to 6 sharp, realistic Pros (each with title/text, category, initialWeight 1-5, and concrete rationale/impact).
   - 4 to 6 critical, non-obvious Cons (each with title/text, category, initialWeight 1-5, and concrete rationale/risk).
   - Complete SWOT matrix: Strengths (internal advantages), Weaknesses (internal drawbacks), Opportunities (external tailwinds/upside), Threats (external risks/downside).
3. A Comparison Table matrix across 5-7 meaningful decision dimensions (e.g., Financial Risk, Career/Life Growth, Daily Mental Energy, Reversibility, Execution Friction, Long-term Regret minimization). For each dimension, evaluate each option with a score (1-10) and a concise verdict text.
4. "The Tiebreaker Verdict":
   - recommendedOptionId
   - confidencePercent (e.g. 65-90)
   - headlineVerdict (crisp executive recommendation)
   - coreRationale (why this option edges out)
   - theDecidingQuestion (the single critical "tiebreaker hinge question", e.g., "If you value X over Y, choose Option A; if not, choose Option B")
   - blindspots (3-4 overlooked cognitive traps or hidden risks)
   - riskMitigations (mitigation tactics for the top cons of the recommended path)
   - twoWayDoorAnalysis (Bezos reversible Type 2 decision vs irreversible Type 1 decision assessment).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  tagline: { type: Type.STRING },
                  pros: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING },
                        category: { type: Type.STRING },
                        weight: { type: Type.INTEGER },
                        impact: { type: Type.STRING },
                      },
                      required: ['id', 'text', 'category', 'weight', 'impact'],
                    },
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING },
                        category: { type: Type.STRING },
                        weight: { type: Type.INTEGER },
                        impact: { type: Type.STRING },
                      },
                      required: ['id', 'text', 'category', 'weight', 'impact'],
                    },
                  },
                  swot: {
                    type: Type.OBJECT,
                    properties: {
                      strengths: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            title: { type: Type.STRING },
                            detail: { type: Type.STRING },
                          },
                          required: ['title', 'detail'],
                        },
                      },
                      weaknesses: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            title: { type: Type.STRING },
                            detail: { type: Type.STRING },
                          },
                          required: ['title', 'detail'],
                        },
                      },
                      opportunities: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            title: { type: Type.STRING },
                            detail: { type: Type.STRING },
                          },
                          required: ['title', 'detail'],
                        },
                      },
                      threats: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            title: { type: Type.STRING },
                            detail: { type: Type.STRING },
                          },
                          required: ['title', 'detail'],
                        },
                      },
                    },
                    required: ['strengths', 'weaknesses', 'opportunities', 'threats'],
                  },
                },
                required: ['id', 'name', 'tagline', 'pros', 'cons', 'swot'],
              },
            },
            comparisonTable: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dimension: { type: Type.STRING },
                  importance: { type: Type.STRING },
                  scores: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        optionId: { type: Type.STRING },
                        rating: { type: Type.INTEGER },
                        comment: { type: Type.STRING },
                      },
                      required: ['optionId', 'rating', 'comment'],
                    },
                  },
                  notes: { type: Type.STRING },
                },
                required: ['dimension', 'importance', 'scores'],
              },
            },
            tiebreakerVerdict: {
              type: Type.OBJECT,
              properties: {
                recommendedOptionId: { type: Type.STRING },
                confidencePercent: { type: Type.INTEGER },
                headlineVerdict: { type: Type.STRING },
                coreRationale: { type: Type.STRING },
                theDecidingQuestion: { type: Type.STRING },
                blindspots: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                riskMitigations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      risk: { type: Type.STRING },
                      suggestion: { type: Type.STRING },
                    },
                    required: ['risk', 'suggestion'],
                  },
                },
                twoWayDoorAnalysis: { type: Type.STRING },
              },
              required: [
                'recommendedOptionId',
                'confidencePercent',
                'headlineVerdict',
                'coreRationale',
                'theDecidingQuestion',
                'blindspots',
                'riskMitigations',
                'twoWayDoorAnalysis',
              ],
            },
          },
          required: ['title', 'summary', 'options', 'comparisonTable', 'tiebreakerVerdict'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing decision:', error);
    res.status(500).json({
      error: error?.message || 'Failed to analyze decision with AI. Please try again.',
    });
  }
});

// Endpoint: Devil's Advocate / Pre-Mortem Stress Test
app.post('/api/stress-test', async (req, res) => {
  try {
    const { dilemma, optionName, allOptions } = req.body;

    if (!dilemma || !optionName) {
      return res.status(400).json({ error: 'Missing dilemma or optionName.' });
    }

    const prompt = `You are a relentless Devil's Advocate and Red Team strategist for decision making.
Decision Dilemma: "${dilemma}"
Selected/Favored Option to Stress-Test: "${optionName}"
All options: ${JSON.stringify(allOptions || [])}

Conduct an unsparing "Pre-Mortem" and Stress Test:
1. "The 18-Month Nightmare": Imagine 18 months have passed and choosing "${optionName}" was a catastrophic mistake. Tell the plausible, realistic story of how it quietly fell apart step-by-step.
2. "Tough Confrontation Questions": 3 piercing questions that the user might be avoiding because of wishful thinking or sunk cost fallacy.
3. "The Acid Test Metric": One quantitative or qualitative metric to monitor during the first 90 days to verify if this was indeed the right choice or if the escape hatch must be triggered.
4. "The Counter-Argument You Secretly Know": The hardest truth against this option.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nightmareScenario: { type: Type.STRING },
            piercingQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            acidTestMetric: { type: Type.STRING },
            hardTruth: { type: Type.STRING },
            survivalChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'nightmareScenario',
            'piercingQuestions',
            'acidTestMetric',
            'hardTruth',
            'survivalChecklist',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in stress test:', error);
    res.status(500).json({ error: error?.message || 'Stress test failed.' });
  }
});

// Serve frontend in dev (via Vite middleware) or prod (static dist)
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`The Tiebreaker server running on http://0.0.0.0:${port} (${isProd ? 'production' : 'development'})`);
  });
}

startServer();
