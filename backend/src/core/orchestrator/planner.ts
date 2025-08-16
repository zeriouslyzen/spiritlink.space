import { CETSpec, Plan, TaskNode, TaskType } from './types';

function inferTaskType(prompt: string): TaskType {
  const p = prompt.toLowerCase();
  if (/\b(json|format|parse|extract|transform)\b/.test(p)) return 'transform';
  if (/\bcalculate|sum|product|compute|solve\b/.test(p)) return 'compute';
  if (/\bsearch|find|look up|cite|source|reference\b/.test(p)) return 'retrieve';
  if (/\bwrite|generate|draft|compose\b/.test(p)) return 'generate';
  return 'reason';
}

export function planTasks(prompt: string): Plan {
  const type = inferTaskType(prompt);
  const tasks: TaskNode[] = [{ id: 't1', type, input: { prompt } }];
  const goal: CETSpec = { goal: prompt, claims: [], evidence: [], tests: [] };
  return { tasks, goal };
}


