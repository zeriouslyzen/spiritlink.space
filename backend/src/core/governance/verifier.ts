export interface PropertyTest { name: string; check: (text: string) => boolean }

export function runPropertyTests(text: string, tests: PropertyTest[]): { pass: boolean; failures: string[] } {
  const failures = tests.filter(t => !t.check(text)).map(t => t.name);
  return { pass: failures.length === 0, failures };
}

export const defaultTests: PropertyTest[] = [
  { name: 'has_CET_claims', check: t => /\bClaims\b/i.test(t) },
  { name: 'has_CET_evidence', check: t => /\bEvidence\b/i.test(t) },
  { name: 'has_CET_tests', check: t => /\bTests\b/i.test(t) }
];


