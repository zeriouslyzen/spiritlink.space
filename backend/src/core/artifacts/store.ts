import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface ArtifactRef { id: string; sha256: string; type: string; path: string; lineage?: string[] }

export class LocalArtifactStore {
  constructor(private baseDir: string) {}
  private async ensure() { await fs.mkdir(this.baseDir, { recursive: true }); }
  async save(type: string, data: Buffer | string, lineage: string[] = []): Promise<ArtifactRef> {
    await this.ensure();
    const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
    const id = sha256.slice(0, 16);
    const p = path.join(this.baseDir, `${id}.${type}`);
    await fs.writeFile(p, buf);
    return { id, sha256, type, path: p, lineage };
  }
}


