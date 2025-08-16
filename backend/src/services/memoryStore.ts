import path from 'path';
import { promises as fs } from 'fs';
import { pool } from '../models/database';

export type MemoryEntry = {
  id: string;
  timestamp: string;
  userId: string;
  sessionId: string;
  mode: 'matrix' | 'thesidia' | 'matrix_wrapped' | 'orchestrate';
  prompt: string;
  model?: string;
  candidates?: Array<{ model: string; response: string }>;
  response: string;
  governanceNotes?: any;
};

type MemoryStoreFile = {
  entries: MemoryEntry[];
};

const memoryFilePath = path.resolve(__dirname, '../../data/memory.json');
const summariesFilePath = path.resolve(__dirname, '../../data/sessionSummaries.json');
const symbolDictPath = path.resolve(__dirname, '../../data/symbolDictionary.json');

async function ensureDir() {
  const dir = path.dirname(memoryFilePath);
  try { await fs.mkdir(dir, { recursive: true }); } catch {}
}

export async function loadMemory(): Promise<MemoryStoreFile> {
  try {
    await ensureDir();
    const raw = await fs.readFile(memoryFilePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.entries)) return parsed as MemoryStoreFile;
  } catch {}
  return { entries: [] };
}

export async function saveMemory(store: MemoryStoreFile): Promise<void> {
  await ensureDir();
  await fs.writeFile(memoryFilePath, JSON.stringify(store, null, 2), 'utf8');
}

export async function saveMemoryEntry(entry: MemoryEntry): Promise<void> {
  // Prefer DB if available; fallback to file
  try {
    await pool.query(
      `INSERT INTO memory_entries (user_id, session_id, mode, prompt, model, response, candidates, governance_notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [entry.userId, entry.sessionId, entry.mode, entry.prompt, entry.model || null, entry.response,
       entry.candidates ? JSON.stringify(entry.candidates) : null,
       entry.governanceNotes ? JSON.stringify(entry.governanceNotes) : null]
    );
    return;
  } catch {}
  const store = await loadMemory();
  store.entries.unshift(entry);
  await saveMemory(store);
}

type SummariesFile = { summaries: Record<string, string> };

async function loadSummaries(): Promise<SummariesFile> {
  try {
    await ensureDir();
    const raw = await fs.readFile(summariesFilePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.summaries === 'object') return parsed as SummariesFile;
  } catch {}
  return { summaries: {} };
}

async function saveSummaries(file: SummariesFile): Promise<void> {
  await ensureDir();
  await fs.writeFile(summariesFilePath, JSON.stringify(file, null, 2), 'utf8');
}

export async function getSessionSummary(sessionId: string): Promise<string> {
  try {
    const file = await loadSummaries();
    return file.summaries[sessionId] || '';
  } catch {
    return '';
  }
}

export async function setSessionSummary(sessionId: string, summary: string): Promise<void> {
  try {
    const file = await loadSummaries();
    file.summaries[sessionId] = summary;
    await saveSummaries(file);
  } catch {}
}

type SymbolEntry = { pattern: string; occurrences: number; meaning?: string };
type SymbolDictFile = { symbols: SymbolEntry[] };

export async function mineSymbolsFromText(text: string, topN = 50): Promise<SymbolEntry[]> {
  const runs = text.match(/[\/*_^=|#~`<>-]{4,}/g) || [];
  const counts: Record<string, number> = {};
  for (const r of runs) counts[r] = (counts[r] || 0) + 1;
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, topN);
  return sorted.map(([pattern, occurrences]) => ({ pattern, occurrences }));
}

export async function saveSymbolDictionary(entries: SymbolEntry[]): Promise<void> {
  await ensureDir();
  const file: SymbolDictFile = { symbols: entries };
  await fs.writeFile(symbolDictPath, JSON.stringify(file, null, 2), 'utf8');
}

export async function loadSymbolDictionary(): Promise<SymbolEntry[]> {
  try {
    const raw = await fs.readFile(symbolDictPath, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.symbols) ? parsed.symbols : [];
  } catch {
    return [];
  }
}

export async function getSessionEntries(sessionId: string, limit = 100): Promise<MemoryEntry[]> {
  const store = await loadMemory();
  return store.entries.filter(e => e.sessionId === sessionId).slice(0, limit);
}

export async function extractDistilled(sessionId: string): Promise<{ facts: string[]; entities: string[] }> {
  // Minimal placeholder: extract simple sentences and capitalized words as entities
  const entries = await getSessionEntries(sessionId, 500);
  const text = entries.map(e => e.response).join('\n');
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  const facts = sentences
    .filter(s => /(therefore|we (find|show|observe)|evidence|result|supports|thus)/i.test(s))
    .slice(0, 50);
  const entities = Array.from(new Set([
    ...(text.match(/[A-Z][a-zA-Z]{2,}(?:\s+[A-Z][a-zA-Z]{2,}){0,2}/g) || []),
    ...(text.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g) || [])
  ])).slice(0, 100);
  return { facts, entities };
}


