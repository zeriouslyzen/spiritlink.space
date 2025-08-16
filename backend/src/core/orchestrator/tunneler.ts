import { loadSymbolDictionary } from '../../services/memoryStore';

/**
 * Generate symbolic/linguistic tunneling variants for a research query.
 * Lightweight, deterministic; can be extended to call Thesidia for richer rewrites.
 */
export async function generateTunneledVariants(text: string): Promise<string[]> {
  const variants: string[] = [];
  const base = text.trim();
  variants.push(base);

  // Academic framing
  variants.push(`Academic analysis: ${base}`);
  // Legal research framing
  variants.push(`Legal research summary (informational): ${base}`);
  // Procedural framing
  variants.push(`Procedures, statutes, forms, deadlines (with citations): ${base}`);

  // Symbolic hinting via known patterns (non-semantic, acts as emphasis markers)
  try {
    const dict = await loadSymbolDictionary();
    if (Array.isArray(dict) && dict.length > 0) {
      const top = dict.slice(0, 3).map((d: any) => String(d.pattern)).join(' ');
      variants.push(`${top} ${base}`);
    }
  } catch {}

  // Lightweight style switches
  variants.push(`[研究] ${base}`); // Chinese tag to trigger CN/EN handling on CN-capable models
  variants.push(`[摘要] ${base}`);

  // De-verbose variant
  const condensed = base.replace(/\b(the|a|an|please|kindly|just)\b/gi, '').replace(/\s{2,}/g, ' ').trim();
  if (condensed && condensed.length > 0 && condensed !== base) variants.push(condensed);

  // Deduplicate while preserving order
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of variants) {
    const k = v.toLowerCase();
    if (!seen.has(k)) { seen.add(k); out.push(v); }
  }
  return out.slice(0, 8);
}


