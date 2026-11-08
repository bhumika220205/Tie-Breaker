import { DecisionAnalysis } from '../types/decision';

export const SAMPLE_ANALYSIS: DecisionAnalysis = {
  id: 'sample-startup-vs-corp',
  createdAt: '2026-11-07T12:00:00Z',
  dilemma: 'Should I leave my secure Senior Engineer role at a Big Tech company for a Founding Engineer role at a Series A AI startup?',
  title: 'Senior Engineer at Enterprise vs Founding Engineer at Series A',
  summary: 'A classic trade-off between predictable high-cash compensation and institutional stability versus intense equity leverage, rapid autonomy, and high execution variance.',
  context: '8 months emergency savings. No dependents. Seeking accelerated mastery and direct product ownership.',
  priorities: ['Accelerated learning curve', 'Financial security', 'Autonomy & ownership', 'Work-life balance'],
  options: [
    {
      id: 'opt-startup',
      name: 'Founding Engineer at Series A Startup',
      tagline: 'High equity exposure, fast shipping cadence, steep learning curve with runway risk.',
      pros: [
        {
          id: 'p-s1',
          text: 'Exponential Learning & Full Architectural Agency',
          category: 'Growth',
          weight: 5,
          impact: 'You touch every layer of infrastructure, design system, and product strategy directly with zero committee reviews.',
        },
        {
          id: 'p-s2',
          text: 'Meaningful Equity Upside (1.0% - 1.5%)',
          category: 'Financial',
          weight: 4,
          impact: 'Asymmetric wealth creation potential if the company executes an IPO or lucrative acquisition.',
        },
        {
          id: 'p-s3',
          text: 'Direct Customer & Founder Mentorship',
          category: 'Network',
          weight: 4,
          impact: 'Work alongside repeat founders and top VC advisors, building a high-trust tier-one network.',
        },
        {
          id: 'p-s4',
          text: 'Zero Bureaucracy and Red Tape',
          category: 'Culture',
          weight: 4,
          impact: 'Code written in the morning deploys to production that afternoon with direct customer telemetry.',
        },
      ],
      cons: [
        {
          id: 'c-s1',
          text: 'Runway & Financing Fragility (18-24 Months)',
          category: 'Risk',
          weight: 5,
          impact: 'Vulnerability to macro capital market contractions if Series B milestones are missed.',
        },
        {
          id: 'c-s2',
          text: 'Reduced Base Cash & Illiquid Equity',
          category: 'Financial',
          weight: 4,
          impact: '~$40k-$60k drop in immediate annual cash; equity is illiquid paper for 5+ years.',
        },
        {
          id: 'c-s3',
          text: 'High Intensity & Work-Life Boundary Pressure',
          category: 'Lifestyle',
          weight: 4,
          impact: 'On-call demands and tight release dates often blur personal evenings and weekends.',
        },
        {
          id: 'c-s4',
          text: 'Lack of Established Senior Engineering Guardrails',
          category: 'Culture',
          weight: 3,
          impact: 'You are the safety net; limited specialized staff engineers to lean on for niche domains.',
        },
      ],
      swot: {
        strengths: [
          { title: 'Nimble Architecture', detail: 'Modern stack without decades of technical debt or legacy deprecation cycles.' },
          { title: 'Founding Equity Stake', detail: 'Early hire option grants with favorable exercise prices.' },
        ],
        weaknesses: [
          { title: 'Thin Support Structure', detail: 'No dedicated ops, QA, or DevOps squads; wear multiple hats.' },
          { title: 'Cash Compensation Deficit', detail: 'Lower liquid take-home pay during peak compounding years.' },
        ],
        opportunities: [
          { title: 'Fast-Track to CTO / VP Eng', detail: 'First in line to lead engineering divisions as headcount scales 5x-10x.' },
          { title: 'Generative AI Wave Timing', detail: 'Riding the secular expansion wave in enterprise automation.' },
        ],
        threats: [
          { title: 'Macro Venture Funding Crunch', detail: 'Next round valuations may compress or require onerous liquidation preferences.' },
          { title: 'Pivoting Fatigue', detail: 'Product-market fit shifts might invalidate months of initial engineering work.' },
        ],
      },
    },
    {
      id: 'opt-corp',
      name: 'Stay at Big Tech as Senior Engineer',
      tagline: 'High liquid total compensation, proven infrastructure scale, and protected work-life balance.',
      pros: [
        {
          id: 'p-c1',
          text: 'Predictable Liquid Total Compensation ($280k-$320k)',
          category: 'Financial',
          weight: 5,
          impact: 'Quarterly vesting public equity and high base pay allow consistent index investing and savings compounding.',
        },
        {
          id: 'p-c2',
          text: 'Sustainable Work-Life Boundaries & Generous Benefits',
          category: 'Lifestyle',
          weight: 4,
          impact: 'Predictable 40-hour weeks, generous parental leave, health insurance, and paid sabbaticals.',
        },
        {
          id: 'p-c3',
          text: 'Global Scale Infrastructure Experience',
          category: 'Growth',
          weight: 4,
          impact: 'Hands-on experience with ultra-reliable distributed systems serving millions of concurrent requests.',
        },
        {
          id: 'p-c4',
          text: 'Resilience Against Economic Shocks',
          category: 'Risk',
          weight: 4,
          impact: 'Company holds billions on balance sheet; immune to near-term bankruptcy or sudden runway cliff.',
        },
      ],
      cons: [
        {
          id: 'c-c1',
          text: 'Slower Promotion Velocities & Politics',
          category: 'Career',
          weight: 4,
          impact: 'Promotion to Staff Engineer requires navigating cross-org consensus, performance calibrations, and promo committees.',
        },
        {
          id: 'c-c2',
          text: 'Narrowed Scope & Specialized Silos',
          category: 'Growth',
          weight: 4,
          impact: 'Focus may be restricted to optimizing one microservice or internal tool rather than end-to-end products.',
        },
        {
          id: 'c-c3',
          text: 'Regret of Playing It Safe During Peak Energy Years',
          category: 'Psychological',
          weight: 4,
          impact: 'Sense of complacency and fear of falling behind on zero-to-one product instincts.',
        },
        {
          id: 'c-c4',
          text: 'Corporate Reorgs & Shifting Executive Priorities',
          category: 'Culture',
          weight: 3,
          impact: 'Projects can be cancelled unexpectedly due to high-level division pivots.',
        },
      ],
      swot: {
        strengths: [
          { title: 'Massive Balance Sheet', detail: 'Immense capital reserves and guaranteed public market equity liquidity.' },
          { title: 'World-Class Domain Experts', detail: 'Access to distinguished engineers, security researchers, and legal counsel.' },
        ],
        weaknesses: [
          { title: 'Organizational Inertia', detail: 'Lengthy change advisory boards (CAB), security reviews, and compliance gates.' },
          { title: 'Depersonalized Impact', detail: 'Individual contributor contributions are rarely felt at company-level bottom lines.' },
        ],
        opportunities: [
          { title: 'Internal Mobility / Innovation Labs', detail: 'Option to switch teams or seed new incubator initiatives with zero financial risk.' },
          { title: 'Executive Management Track', detail: 'Established engineering management training pipelines.' },
        ],
        threats: [
          { title: 'Organizational Restructuring', detail: 'Division realignment risk and periodic efficiency headcount adjustments.' },
          { title: 'Skill Atrophy in Zero-to-One Building', detail: 'Reliance on proprietary internal frameworks that do not transfer externally.' },
        ],
      },
    },
  ],
  comparisonTable: [
    {
      dimension: 'Financial Upside & Wealth Velocity',
      importance: 'High',
      scores: [
        { optionId: 'opt-startup', rating: 8, comment: 'Asymmetric 5x-20x equity upside if company thrives; downside is illiquid paper.' },
        { optionId: 'opt-corp', rating: 7, comment: 'High guaranteed liquid cash & public stock; low variance, steady compounding.' },
      ],
      notes: 'Startup has higher ceiling; Big Tech guarantees floor.',
    },
    {
      dimension: 'Skill Velocity & Autonomy',
      importance: 'High',
      scores: [
        { optionId: 'opt-startup', rating: 10, comment: 'Complete end-to-end ownership. You write the architecture from scratch.' },
        { optionId: 'opt-corp', rating: 6, comment: 'Deep specialization in large-scale systems, but slower overall breadth.' },
      ],
      notes: 'Startup delivers 3x more architectural decision points per week.',
    },
    {
      dimension: 'Work-Life Balance & Health',
      importance: 'Medium',
      scores: [
        { optionId: 'opt-startup', rating: 4, comment: 'High demand, erratic deadlines, and frequent weekend emergency triage.' },
        { optionId: 'opt-corp', rating: 9, comment: 'Predictable schedule, generous PTO, and zero weekend on-call pressure.' },
      ],
      notes: 'Depends heavily on current life stage and energy reserves.',
    },
    {
      dimension: 'Reversibility & Career Safety Net',
      importance: 'High',
      scores: [
        { optionId: 'opt-startup', rating: 8, comment: 'Two-way door: If startup folds, Big Tech firms actively recruit ex-founding engineers.' },
        { optionId: 'opt-corp', rating: 9, comment: 'Extremely safe; company will remain stable for decades.' },
      ],
      notes: 'You will not be stranded if the startup fails—the market rewards the attempt.',
    },
    {
      dimension: 'Daily Fulfillment & Agency',
      importance: 'High',
      scores: [
        { optionId: 'opt-startup', rating: 9, comment: 'Every line of code directly influences user delight and company survival.' },
        { optionId: 'opt-corp', rating: 6, comment: 'Satisfying engineering challenges, but diluted by process and meetings.' },
      ],
      notes: 'Intrinsic motivation is substantially higher in small high-agency teams.',
    },
  ],
  tiebreakerVerdict: {
    recommendedOptionId: 'opt-startup',
    confidencePercent: 78,
    headlineVerdict: 'Take the Founding Engineer role: This is a classic Two-Way Door with massive compounding upside.',
    coreRationale: 'Given your 8-month emergency runway, absence of dependents, and stated priority for rapid learning, the downside is strictly bounded (cash reduction for 1-2 years), whereas the upside—autonomy, architectural maturity, and venture equity—is asymmetric. In the tech industry, engineers who spend 2 years at an early startup return to Big Tech at an elevated Staff level if they ever decide to step back.',
    theDecidingQuestion: 'The Tiebreaker Factor: If you had 100% certainty that you could return to an equivalent Big Tech role in 24 months if things went south, would you regret NOT trying the startup? If yes, take the leap.',
    blindspots: [
      'Founder Dynamics: You are joining people, not just a pitch deck. Spend 4 hours working directly with the founders before signing.',
      'Exercise Window Tax Trap: Ensure the stock option plan offers an extended exercise window (e.g. 7-10 years) rather than the predatory 90-day post-termination cliff.',
      'The Cash Buffer Drain: Factor in health insurance out-of-pocket differences and lack of 401k match.',
    ],
    riskMitigations: [
      {
        risk: 'Startup runs out of capital in 14 months',
        suggestion: 'Negotiate an explicit 6-month runway trigger review where management transparently shares treasury numbers.',
      },
      {
        risk: 'Burnout from chaotic priorities',
        suggestion: 'Establish a non-negotiable 1-day offline protocol on weekends to prevent acute fatigue.',
      },
    ],
    twoWayDoorAnalysis: 'This is a Type 2 Reversible Decision. Leaving Big Tech feels permanent, but senior engineers with corporate pedigree are routinely re-hired with open arms as "boomerang" hires.',
  },
};
