export interface ToolScope { name: string; domains?: string[]; ratePerMin?: number }
export interface Secrets { [key: string]: string }
export interface PolicyConfig { tools: ToolScope[]; redactPII: boolean }

export function allowTool(name: string, url?: string, policy?: PolicyConfig): boolean {
  if (!policy) return true;
  const scope = policy.tools.find(t => t.name === name);
  if (!scope) return false;
  if (url && scope.domains && !scope.domains.some(d => url.includes(d))) return false;
  return true;
}


