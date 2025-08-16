import { RetrieveQuery, RetrieveResult } from './types';
import { pool, PGVECTOR_AVAILABLE } from '../../models/database';
import { embedText, toVectorLiteral } from '../../services/embedding';

// Reciprocal Rank Fusion helper
function rrfMerge(scoresA: Map<string, number>, scoresB: Map<string, number>, k = 60): Map<string, number> {
  const keys = new Set<string>([...scoresA.keys(), ...scoresB.keys()]);
  const out = new Map<string, number>();
  for (const id of keys) {
    const ra = scoresA.get(id);
    const rb = scoresB.get(id);
    const s = (ra !== undefined ? 1 / (k + ra) : 0) + (rb !== undefined ? 1 / (k + rb) : 0);
    out.set(id, s);
  }
  return out;
}

// Simple rewrite (stub)
function rewriteQuery(text: string): string {
  return text.trim();
}

export async function retrieveHybrid(q: RetrieveQuery): Promise<RetrieveResult> {
  const text = rewriteQuery(q.text);
  const kVec = q.kVec ?? 50;
  const kBM25 = q.kBM25 ?? 50;
  const kFinal = q.kFinal ?? 12;

  // Vector search via pgvector (when available)
  let vecRows: any = { rows: [] };
  if (PGVECTOR_AVAILABLE) {
    const [queryVec] = await embedText([text], { model: process.env.EMBEDDING_MODEL || 'nomic-embed-text' });
    const vecLiteral = toVectorLiteral(queryVec || []);
    vecRows = await pool.query(
      `SELECT c.id AS chunk_id, c.document_id, c.text, c.span, d.source, d.hash, d.title,
              (row_number() OVER (ORDER BY c.embedding <-> $2::vector))::int AS rnk
       FROM chunks c
       JOIN documents d ON d.id = c.document_id
       WHERE c.embedding IS NOT NULL
       ORDER BY c.embedding <-> $2::vector
       LIMIT $1;`,
      [kVec, vecLiteral]
    );
  }

  // Sparse BM25 via tsvector (guard when retrieval tables missing)
  let bm25Rows: any = { rows: [] };
  if (PGVECTOR_AVAILABLE) {
    bm25Rows = await pool.query(
      `SELECT c.id AS chunk_id, c.document_id, c.text, c.span, d.source, d.hash, d.title,
              ts_rank_cd(c.sparse_tsv, plainto_tsquery('simple', $1)) AS score,
              row_number() OVER (ORDER BY ts_rank_cd(c.sparse_tsv, plainto_tsquery('simple', $1)) DESC)::int AS rnk
       FROM chunks c JOIN documents d ON d.id = c.document_id
       WHERE c.sparse_tsv @@ plainto_tsquery('simple', $1)
       ORDER BY score DESC
       LIMIT $2;`,
      [text, kBM25]
    );
  }

  const rankA = new Map<string, number>();
  for (const r of vecRows.rows) rankA.set(r.chunk_id, r.rnk);
  const rankB = new Map<string, number>();
  for (const r of bm25Rows.rows) rankB.set(r.chunk_id, r.rnk);
  const fused = rrfMerge(rankA, rankB);

  const byId: Record<string, any> = {};
  for (const r of vecRows.rows) byId[r.chunk_id] = r;
  for (const r of bm25Rows.rows) byId[r.chunk_id] = byId[r.chunk_id] || r;

  const top = [...fused.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, kFinal)
    .map(([chunkId]) => byId[chunkId])
    .filter(Boolean);

  return {
    passages: top.map((r: any) => ({
      chunkId: r.chunk_id,
      documentId: r.document_id,
      text: r.text,
      span: Array.isArray(r.span) ? (r.span as [number, number]) : [0, Math.min(800, r.text?.length || 0)],
      score: fused.get(r.chunk_id) || 0,
      provenance: { source: r.source, hash: r.hash, title: r.title }
    }))
  };
}


