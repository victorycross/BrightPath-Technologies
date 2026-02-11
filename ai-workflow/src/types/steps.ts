import type { StepMeta } from './workflow';

export const STEPS: StepMeta[] = [
  {
    id: 'use-case-intake',
    index: 0,
    title: 'Use Case Intake',
    shortTitle: 'Intake',
    description: 'Capture the AI use case details, objectives, and expected outcomes.',
  },
  {
    id: 'business-impact',
    index: 1,
    title: 'Business Impact Assessment',
    shortTitle: 'Impact',
    description: 'Evaluate strategic alignment, revenue impact, and estimated ROI.',
  },
  {
    id: 'data-readiness',
    index: 2,
    title: 'Data Readiness Review',
    shortTitle: 'Data',
    description: 'Assess data availability, quality, and governance readiness.',
  },
  {
    id: 'risk-assessment',
    index: 3,
    title: 'Risk Assessment',
    shortTitle: 'Risk',
    description: 'Evaluate bias, privacy, security, reputational, and operational risks.',
  },
  {
    id: 'governance-review',
    index: 4,
    title: 'Governance Review',
    shortTitle: 'Governance',
    description: 'Ensure regulatory compliance including PIPEDA and Canadian AI standards.',
  },
  {
    id: 'delivery-planning',
    index: 5,
    title: 'Delivery Planning',
    shortTitle: 'Delivery',
    description: 'Define the build approach, team, tech stack, and milestones.',
  },
  {
    id: 'implementation',
    index: 6,
    title: 'Implementation Tracking',
    shortTitle: 'Implement',
    description: 'Track development phases, progress, blockers, and testing status.',
  },
  {
    id: 'launch-monitoring',
    index: 7,
    title: 'Launch & Monitoring',
    shortTitle: 'Launch',
    description: 'Go-live readiness, monitoring metrics, and feedback loops.',
  },
];
