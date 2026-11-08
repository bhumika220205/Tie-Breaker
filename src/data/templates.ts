import { DecisionTemplate } from '../types/decision';

export const DECISION_TEMPLATES: DecisionTemplate[] = [
  {
    id: 'career-startup-vs-corp',
    title: 'Series A Startup vs Stable Corporate Lead',
    tagline: 'High equity upside & speed vs predictable compensation & work-life balance',
    category: 'Career',
    dilemma: 'Should I leave my secure Senior Engineer role at a Big Tech company for a Founding Engineer role at a well-funded Series A AI startup?',
    options: [
      'Join Series A AI Startup as Founding Engineer (Equity heavy, fast-paced)',
      'Stay at Big Tech as Senior Engineer (High cash compensation, stability)',
      'Negotiate Internal Transfer to a zero-to-one innovation team inside current company',
    ],
    context: 'I have 8 months of living expenses saved. No dependents right now. Seeking rapid professional growth, but worried about burn-out and tech turbulence.',
    priorities: ['Accelerated learning curve', 'Financial security', 'Ownership & autonomy', 'Work-life balance'],
  },
  {
    id: 'housing-buy-vs-rent',
    title: 'Buy First Home vs Rent & Maximize Equities',
    tagline: 'Fixed housing footprint & equity build vs ultimate liquidity & zero maintenance',
    category: 'Finance',
    dilemma: 'Should we purchase a suburban townhouse with a 6.8% mortgage rate or continue renting in the city and aggressively invest our savings into index funds?',
    options: [
      'Buy 3-Bedroom Suburban Townhouse ($650k, 20% down, 30-yr fixed)',
      'Continue Renting in City Center & Dollar-Cost Average into broad market index funds',
    ],
    context: 'Combined household income $210k. Planning to start a family in 2-3 years. Current city rent is $2,800/mo. Townhouse all-in monthly payment would be ~$4,300/mo.',
    priorities: ['Long-term wealth compounding', 'Flexibility to move', 'Family space stability', 'Cash flow buffer'],
  },
  {
    id: 'tech-build-vs-buy',
    title: 'Custom In-House Architecture vs Managed SaaS Solution',
    tagline: 'Deep control & zero vendor lock-in vs instant time-to-market and low dev overhead',
    category: 'Tech',
    dilemma: 'Should our engineering team build our own specialized authorization & billing orchestration engine, or adopt a commercial vendor platform?',
    options: [
      'Build Custom In-House Solution using Postgres RLS and open-source primitives',
      'Integrate Commercial Off-the-Shelf Platform (e.g. Auth0 / Stripe Billing tier)',
    ],
    context: 'Team of 6 full-stack engineers. Product launch targeted in 4 months. Core business is workflow automation, not security infrastructure.',
    priorities: ['Speed to launch', 'Engineering maintenance burden', 'Vendor lock-in risk', 'Total cost of ownership'],
  },
  {
    id: 'life-relocation',
    title: 'Relocate Overseas for a 2-Year Adventure vs Stay Near Roots',
    tagline: 'Cultural immersion and global perspective vs community ties and aging family proximity',
    category: 'Life',
    dilemma: 'Should I take an internal opportunity to transfer to our London office for two years, or remain in Chicago near my established friend circle and family?',
    options: [
      'Accept 2-Year London Transfer (New continent, travel hub, higher tax)',
      'Remain in Chicago (Established community, lower friction, close to family)',
    ],
    context: 'Late 20s, single. Both parents are healthy in mid-60s. Craving travel and novel perspectives before settling down permanently.',
    priorities: ['Life memories & adventure', 'Social community & support system', 'Career international exposure', 'Financial savings rate'],
  },
];
