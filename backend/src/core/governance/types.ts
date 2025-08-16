export interface Verdict {
  pass: boolean;
  reasons: string[];
  citations?: Array<{ url: string; snippet?: string }>;
  artifacts?: Array<{ id: string; sha256: string; type: string }>;
}

export interface CETOutput {
  steps?: string[];
  rationale?: string;
  claims: string[];
  evidence: string[];
  tests: string[];
  sections?: Record<string, string>;
}


