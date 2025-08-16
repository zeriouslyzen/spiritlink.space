export type Friction = 'policy' | 'vague' | 'scope' | 'evidence' | 'schema';
export type Transform =
  | 'advice→research'
  | 'directive→options'
  | 'claim→evidence'
  | 'ask→tests'
  | 'nsfw→consent';

export interface TunnelerInput {
  text: string;
  cet: { goal?: string; type?: string };
  role: 'user' | 'research';
  domain?: 'legal' | 'medical' | 'code' | 'general';
  locale?: string;
  requireCitations?: number; // default 2
}

export interface TunnelerOutput {
  transformed: string;
  transform: Transform;
  friction: Friction[];
  rationale: string;
  requireCitations: number;
}

const ADVICE_RX = /\b(should|what do i do|can i legally|is it legal|how do i|give me steps)\b/i;
const MED_RX = /\b(diagnose|treat|prescribe|dose|medical advice)\b/i;
const NSFW_RX = /\b(erotic|nsfw|sexual|explicit)\b/i;

export function diagnose(text: string): Friction[] {
  const f: Friction[] = [];
  if (ADVICE_RX.test(text) || MED_RX.test(text) || NSFW_RX.test(text)) f.push('policy');
  if (text.trim().length < 10) f.push('vague');
  return f.length ? f : ['scope'];
}

// — templates
import { legalBrief, medicalBrief, nsfwConsent, testsFirst, claimEvidence } from './templates';

function makeScaffold(t: Transform, q: string, N: number, locale?: string): string {
  switch (t) {
    case 'advice→research':
      return legalBrief(q, N, locale);
    case 'ask→tests':
      return testsFirst(q);
    case 'nsfw→consent':
      return nsfwConsent(q);
    case 'claim→evidence':
      return claimEvidence(q, N);
    default:
      return claimEvidence(q, N);
  }
}

export function tunnel(input: TunnelerInput): TunnelerOutput {
  const friction = diagnose(input.text);
  const N = input.requireCitations ?? 2;

  // choose transform
  let transform: Transform = 'claim→evidence';
  if (input.domain === 'code') transform = 'ask→tests';
  if (ADVICE_RX.test(input.text) && input.domain === 'legal') transform = 'advice→research';
  if (MED_RX.test(input.text)) transform = 'advice→research';
  if (NSFW_RX.test(input.text)) transform = 'nsfw→consent';

  // emit lawful scaffold
  const brief = makeScaffold(transform, input.text, N, input.locale);

  return {
    transformed: brief,
    transform,
    friction,
    rationale: `SQT mapped intent to allowed ${transform} with CET placeholders and citations≥${N}.`,
    requireCitations: N,
  };
}


