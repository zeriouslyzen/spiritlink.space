export interface Job<T=any> { id: string; payload: T; attempts: number }

export class InMemoryQueue<T=any> {
  private q: Job<T>[] = [];
  private seen = new Set<string>();
  constructor(private maxAttempts = 3) {}
  enqueue(idempotencyKey: string, payload: T) {
    if (this.seen.has(idempotencyKey)) return;
    this.seen.add(idempotencyKey);
    this.q.push({ id: idempotencyKey, payload, attempts: 0 });
  }
  next(): Job<T> | null { return this.q.shift() || null }
  retry(job: Job<T>, backoffMs = 1000) {
    if (job.attempts + 1 >= this.maxAttempts) return;
    setTimeout(() => {
      this.q.push({ ...job, attempts: job.attempts + 1 });
    }, backoffMs);
  }
}


