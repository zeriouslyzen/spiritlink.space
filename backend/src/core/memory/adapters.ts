export interface EpisodicTurn { role: 'user'|'assistant'; text: string; ts: string }
export interface EpisodicState { threadId: string; turns: EpisodicTurn[] }
export interface SemanticFact { id: string; text: string; entities?: string[] }
export interface ProceduralSkill { name: string; signature: string }
export interface Persona { styleHints?: Record<string, number> }

export interface MemoryAdapter {
  loadEpisodic(threadId: string): Promise<EpisodicState>;
  saveEpisodic(state: EpisodicState): Promise<void>;
  loadSemantic(): Promise<SemanticFact[]>;
  saveSemantic(facts: SemanticFact[]): Promise<void>;
  loadProcedural(): Promise<ProceduralSkill[]>;
  saveProcedural(skills: ProceduralSkill[]): Promise<void>;
}


