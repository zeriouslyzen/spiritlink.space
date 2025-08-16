import { CETOutput } from './types';

export function validateCET(output: Partial<CETOutput>): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!output.claims || output.claims.length === 0) missing.push('claims');
  if (!output.evidence || output.evidence.length === 0) missing.push('evidence');
  if (!output.tests || output.tests.length === 0) missing.push('tests');
  return { ok: missing.length === 0, missing };
}


