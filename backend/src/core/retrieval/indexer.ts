import crypto from 'crypto';
import { pool } from '../../models/database';
import { embedText, toVectorLiteral } from '../../services/embedding';

export function chunkText(text: string, maxLen = 800): Array<{ id: string; text: string; span: [number, number] }> {
  const chunks: Array<{ id: string; text: string; span: [number, number] }> = [];
  for (let i = 0; i < text.length; i += maxLen) {
    const slice = text.slice(i, i + maxLen);
    const id = crypto.createHash('sha256').update(slice).digest('hex').slice(0, 16);
    chunks.push({ id, text: slice, span: [i, Math.min(text.length, i + maxLen)] });
  }
  return chunks;
}

export async function ingestDocument(params: {
  source: string;
  title?: string;
  mime?: string;
  ownerId?: string;
  rawText: string;
  embeddingModel?: string;
}) {
  const { source, title, mime, ownerId, rawText, embeddingModel } = params;
  const hash = crypto.createHash('sha256').update(rawText).digest('hex');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const docRes = await client.query(
      `INSERT INTO documents (source, hash, title, mime, owner_id)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (hash) DO UPDATE SET title = EXCLUDED.title
       RETURNING id`,
      [source, hash, title || null, mime || null, ownerId || null]
    );
    const documentId: string = docRes.rows[0].id;

    const chunks = chunkText(rawText, 1000);
    const embeds = await embedText(chunks.map((c) => c.text), { model: embeddingModel });

    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i];
      const e = embeds[i] || [];
      const vec = toVectorLiteral(e);
      await client.query(
        `INSERT INTO chunks (document_id, text, embedding, embedding_model, embedding_dim, lang)
         VALUES ($1, $2, $3::vector, $4, $5, $6)`,
        [documentId, c.text, vec, embeddingModel || process.env.EMBEDDING_MODEL || 'nomic-embed-text', e.length || 0, null]
      );
      await client.query(
        `UPDATE chunks SET span = int4range($2, $3, '[]') WHERE document_id = $1 AND text = $4`,
        [documentId, c.span[0], c.span[1], c.text]
      );
    }
    await client.query('COMMIT');
    return { documentId, chunks: chunks.length };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}



