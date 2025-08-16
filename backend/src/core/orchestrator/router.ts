import { RouterDecision, TaskType } from './types';

export function routeModel(task: TaskType, text: string): RouterDecision {
  const zh = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(text);
  if (zh) return { model: 'qwen', budget: { latencyMs: 2000, usd: 0.001 } };
  if (task === 'transform') return { model: 'mistral', budget: { latencyMs: 1000, usd: 0.0005 } };
  if (task === 'reason') return { model: 'mixtral', budget: { latencyMs: 3500, usd: 0.002 } };
  if (task === 'compute') return { model: 'mistral', budget: { latencyMs: 800, usd: 0.0005 } };
  if (task === 'retrieve') return { model: 'mixtral', budget: { latencyMs: 3000, usd: 0.0015 } };
  return { model: 'llama', budget: { latencyMs: 2500, usd: 0.001 } };
}


