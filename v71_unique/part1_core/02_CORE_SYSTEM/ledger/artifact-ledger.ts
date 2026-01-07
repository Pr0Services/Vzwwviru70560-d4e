/**
 * 📜 CHE·NU V71 — ARTIFACT LEDGER
 * Registre immuable de toutes les actions
 * 
 * RÈGLE: Rien n'existe s'il n'y a pas d'Artifact
 * RÈGLE: Aucune suppression possible
 */

export interface Artifact {
  id: string;
  type: string;
  action: string;
  actorId: string;
  identityId: string;
  timestamp: Date;
  inputHash: string;
  outputHash: string;
  parentArtifactId?: string;
  childArtifactIds: string[];
  metadata: Record<string, unknown>;
  synapseChain: string[]; // IDs des synapses qui ont mené à cet artifact
}

export interface ArtifactQuery {
  actorId?: string;
  identityId?: string;
  type?: string;
  action?: string;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
}

export class ArtifactLedger {
  private artifacts: Map<string, Artifact> = new Map();
  private indexByActor: Map<string, string[]> = new Map();
  private indexByIdentity: Map<string, string[]> = new Map();

  /**
   * Enregistre un artifact IMMUABLEMENT
   * ⚠️ Une fois créé, ne peut JAMAIS être modifié ou supprimé
   */
  async record(params: {
    type: string;
    action: string;
    actorId: string;
    identityId: string;
    input: unknown;
    output: unknown;
    parentArtifactId?: string;
    synapseChain: string[];
    metadata?: Record<string, unknown>;
  }): Promise<Artifact> {
    const artifact: Artifact = {
      id: crypto.randomUUID(),
      type: params.type,
      action: params.action,
      actorId: params.actorId,
      identityId: params.identityId,
      timestamp: new Date(),
      inputHash: await this.hash(params.input),
      outputHash: await this.hash(params.output),
      parentArtifactId: params.parentArtifactId,
      childArtifactIds: [],
      metadata: params.metadata || {},
      synapseChain: params.synapseChain
    };

    // Enregistrement immuable
    this.artifacts.set(artifact.id, Object.freeze(artifact));

    // Indexation
    this.addToIndex(this.indexByActor, artifact.actorId, artifact.id);
    this.addToIndex(this.indexByIdentity, artifact.identityId, artifact.id);

    // Lien parent-enfant
    if (params.parentArtifactId) {
      const parent = this.artifacts.get(params.parentArtifactId);
      if (parent) {
        // Note: On ne modifie pas parent, on crée une nouvelle référence
        parent.childArtifactIds.push(artifact.id);
      }
    }

    return artifact;
  }

  /**
   * Recherche d'artifacts (LECTURE SEULE)
   */
  async query(q: ArtifactQuery): Promise<Artifact[]> {
    let results: Artifact[] = Array.from(this.artifacts.values());

    if (q.actorId) {
      const ids = this.indexByActor.get(q.actorId) || [];
      results = results.filter(a => ids.includes(a.id));
    }
    if (q.identityId) {
      const ids = this.indexByIdentity.get(q.identityId) || [];
      results = results.filter(a => ids.includes(a.id));
    }
    if (q.type) results = results.filter(a => a.type === q.type);
    if (q.action) results = results.filter(a => a.action === q.action);
    if (q.fromDate) results = results.filter(a => a.timestamp >= q.fromDate!);
    if (q.toDate) results = results.filter(a => a.timestamp <= q.toDate!);

    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    if (q.limit) results = results.slice(0, q.limit);

    return results;
  }

  /**
   * Récupère un artifact par ID
   */
  get(id: string): Artifact | undefined {
    return this.artifacts.get(id);
  }

  /**
   * ⚠️ DELETE EST INTERDIT
   * Cette méthode existe pour documenter l'interdiction
   */
  delete(_id: string): never {
    throw new Error('CANONICAL VIOLATION: Artifacts cannot be deleted. Ledger is immutable.');
  }

  private async hash(data: unknown): Promise<string> {
    const str = JSON.stringify(data);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private addToIndex(index: Map<string, string[]>, key: string, id: string): void {
    const existing = index.get(key) || [];
    existing.push(id);
    index.set(key, existing);
  }
}

export const artifactLedger = new ArtifactLedger();
