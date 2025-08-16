export type RetrieveQuery = {
  text: string;
  kVec?: number; // vector candidates
  kBM25?: number; // sparse candidates
  kFinal?: number; // final top-k
  filters?: { lang?: string; ownerId?: string; entityIds?: string[] };
  rerank?: boolean; // enable cross-encoder reranking
};

export interface Chunk {
  id: string;
  documentId?: string;
  text: string;
  span?: [number, number];
  source?: string;
  score?: number;
}

export interface Provenance { source: string; locator?: string; sha256?: string; title?: string }
export interface RetrieveResult {
  passages: Array<{
    chunkId: string;
    documentId: string;
    text: string;
    span: [number, number];
    score: number;
    provenance: { source: string; hash: string; title?: string };
  }>;
}
export interface KGEdge { src: string; rel: string; dst: string; weight: number }


