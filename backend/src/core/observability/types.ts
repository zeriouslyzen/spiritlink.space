export interface TelemetryEvent {
  ts: string;
  kind: 'plan'|'route'|'model'|'tool'|'govern'|'output'|'error'|'thesidia';
  detail: any;
}

export interface EvalResult {
  suite: string;
  taskId: string;
  pass: boolean;
  metrics?: Record<string, number>;
}


