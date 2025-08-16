export function selfConsistencyVote(candidates: string[], k = 3): { winner: string; tally: Record<string, number> } {
  const tally: Record<string, number> = {};
  for (const c of candidates.slice(0, k)) tally[c] = (tally[c] || 0) + 1;
  let winner = candidates[0] || '';
  let best = 0;
  for (const [k2, v] of Object.entries(tally)) if (v > best) { best = v; winner = k2; }
  return { winner, tally };
}


