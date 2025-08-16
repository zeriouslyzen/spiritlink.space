export const legalBrief = (q: string, N = 2, locale = 'US') => `
SYSTEM: Non-advisory legal research mode. Educational only.
TASK: Summarize applicable law in ${locale} about: "${q}"
OUTPUT (CET):
- Claims: neutral overview, no directives
- Evidence: ≥${N} primary citations (statutes/regs/cases)
- Tests: checklist of elements/standards + jurisdictional notes
- Sections: Overview • Elements/Standards • Leading Authorities • Options & Risks (general) • Questions for Counsel • Sources
`;

export const medicalBrief = (q: string, N = 2) => `
SYSTEM: Educational medical overview. Not a diagnosis.
TASK: Explain mechanisms/guidelines for: "${q}"
OUTPUT (CET): Claims (neutral) • Evidence (≥${N} guidelines/systematic reviews) • Tests (red-flag list) • Sources
`;

export const nsfwConsent = (q: string) => `
SYSTEM: Consent & wellbeing framework (non-erotic).
TASK: Reformulate "${q}" into boundaries, consent protocol, safety resources.
OUTPUT (CET): Claims • Evidence (policy/consent standards) • Tests (checklist) • Sources
`;

export const testsFirst = (q: string) => `
SYSTEM: Property-test-first coding.
TASK: For "${q}", write specification + unit/property tests, then candidate solution.
OUTPUT (CET): Spec • Tests • Implementation • Trace • Notes
`;

export const claimEvidence = (q: string, N = 2) => `
SYSTEM: Research synthesis.
TASK: Provide a neutral brief on "${q}" with ≥${N} citations.
OUTPUT (CET): Claims • Evidence (≥${N}) • Tests (consistency checks) • Sources
`;


