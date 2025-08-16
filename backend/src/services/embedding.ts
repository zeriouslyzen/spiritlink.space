import fetch from 'node-fetch';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

export type EmbeddingOptions = {
  model?: string; // e.g., 'bge-m3' or 'nomic-embed-text'
};

export async function embedText(texts: string[], opts: EmbeddingOptions = {}): Promise<number[][]> {
  const model = opts.model || process.env.EMBEDDING_MODEL || 'nomic-embed-text';
  const results: number[][] = [];
  for (const t of texts) {
    const r = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt: t })
    });
    const raw = await r.text();
    try {
      const j: any = JSON.parse(raw);
      if (Array.isArray(j?.embedding)) {
        results.push(j.embedding.map((x: any) => Number(x)));
      } else {
        // fallback empty vector
        results.push([]);
      }
    } catch {
      results.push([]);
    }
  }
  return results;
}

export function toVectorLiteral(vec: number[]): string {
  if (!Array.isArray(vec) || vec.length === 0) return '[]';
  return `[${vec.map((v) => (Number.isFinite(v) ? v : 0)).join(',')}]`;
}


