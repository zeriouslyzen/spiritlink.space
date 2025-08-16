export type TaskType = 'transform' | 'reason' | 'generate' | 'retrieve' | 'compute';

export interface CETSpec {
  goal?: string;
  claims?: string[];
  evidence?: string[];
  tests?: string[];
}

export interface TaskNode {
  id: string;
  type: TaskType;
  input: any;
  deps?: string[];
}

export interface Plan {
  tasks: TaskNode[];
  goal: CETSpec;
}

export interface RouterDecision {
  model: 'mistral' | 'mixtral' | 'llama' | 'qwen' | 'api';
  budget: { latencyMs: number; usd: number };
}

export interface ToolCall {
  name: string;
  args: Record<string, any>;
}

export interface ResultCache {
  get: (key: string) => Promise<any | null>;
  set: (key: string, value: any, ttlSec?: number) => Promise<void>;
}

export interface EpisodicState { threadId: string; turns: Array<{ role: 'user'|'assistant'; text: string }>; }
export interface Entity { id: string; name: string; type?: string }
export interface EntityStore { entities: Entity[] }

export interface ToolRegistry {
  call: (tool: string, args: Record<string, any>) => Promise<any>;
}

export interface AgentContext {
  episodic: EpisodicState;
  semantic: EntityStore;
  tools: ToolRegistry;
  cache: ResultCache;
}


