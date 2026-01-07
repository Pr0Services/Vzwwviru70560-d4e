/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — TRI-LAYER MEMORY SERVICE                        ║
 * ║                    Frontend Implementation — v1.1                             ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * SERVICE DE GESTION MÉMOIRE TRI-COUCHE
 * 
 * PRINCIPE: "Le contexte n'est JAMAIS empilé, il est ADRESSABLE."
 * 
 * FLUX COGNITIF:
 *   Mémoire Froide (Archive) → [résumé] → Mémoire Subjective (Warm)
 *   → [sélection] → Mémoire Chaude (Hot) → Raisonnement/Action
 */

import type {
  MemoryLayer,
  Conversation,
  ConversationStatus,
  ConversationScope,
  HotMemory,
  HotMemoryConfig,
  HotMessage,
  ReasoningState,
  WarmMemory,
  WarmMemoryConfig,
  SemanticSummary,
  DecisionRecord,
  Hypothesis,
  Preference,
  ColdMemoryEntry,
  ColdMemoryConfig,
  ColdMemoryAccessRequest,
  ColdMemoryAccessResponse,
  ColdMemoryReference,
  MemoryTransfer,
  TransformationType,
  ArchivingPolicy,
  ArchiveResult,
  ContextLoadRequest,
  LoadedContext,
  DEFAULT_HOT_CONFIG,
  DEFAULT_WARM_CONFIG,
  DEFAULT_COLD_CONFIG,
  DEFAULT_ARCHIVING_POLICY,
} from '../types/memory-architecture.types';

// ═══════════════════════════════════════════════════════════════════════════════
// API CLIENT
// ═══════════════════════════════════════════════════════════════════════════════

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class MemoryApiClient {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('chenu_access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    return response.json();
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'GET' });
  }

  async delete(endpoint: string): Promise<void> {
    await this.fetch(endpoint, { method: 'DELETE' });
  }
}

const apiClient = new MemoryApiClient();

// ═══════════════════════════════════════════════════════════════════════════════
// L1 — HOT MEMORY SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Service pour la mémoire chaude (L1)
 * - Raisonnement actif
 * - Volatile
 * - 1 par agent
 */
class HotMemoryService {
  private cache: Map<string, HotMemory> = new Map();

  /**
   * Initialise la mémoire chaude pour un agent
   */
  async initialize(
    agentId: string, 
    conversationId: string,
    config: HotMemoryConfig = DEFAULT_HOT_CONFIG
  ): Promise<HotMemory> {
    const hotMemory: HotMemory = {
      agent_id: agentId,
      conversation_id: conversationId,
      messages: [],
      current_objectives: [],
      active_constraints: [],
      reasoning_state: {
        current_task: null,
        pending_actions: [],
        active_hypotheses: [],
        confidence_level: 1.0,
        last_checkpoint_id: null,
      },
      token_count: 0,
      created_at: new Date().toISOString(),
      last_activity: new Date().toISOString(),
      config,
      utilization: 0,
    };

    this.cache.set(agentId, hotMemory);
    
    // Sync avec backend
    await apiClient.post('/memory/hot/initialize', hotMemory);
    
    return hotMemory;
  }

  /**
   * Récupère la mémoire chaude d'un agent
   */
  async get(agentId: string): Promise<HotMemory | null> {
    // Check cache first
    if (this.cache.has(agentId)) {
      return this.cache.get(agentId)!;
    }

    try {
      const hotMemory = await apiClient.get<HotMemory>(`/memory/hot/${agentId}`);
      this.cache.set(agentId, hotMemory);
      return hotMemory;
    } catch {
      return null;
    }
  }

  /**
   * Ajoute un message à la mémoire chaude
   */
  async addMessage(agentId: string, message: Omit<HotMessage, 'id' | 'timestamp'>): Promise<HotMemory> {
    const hotMemory = await this.get(agentId);
    if (!hotMemory) {
      throw new Error(`No hot memory for agent ${agentId}`);
    }

    const newMessage: HotMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    // Vérifier limite tokens
    const newTokenCount = hotMemory.token_count + message.token_count;
    if (newTokenCount > hotMemory.config.max_tokens) {
      // Déclencher archivage automatique
      await this.triggerAutoArchive(agentId, hotMemory);
    }

    // Ajouter message
    hotMemory.messages.push(newMessage);
    hotMemory.token_count = newTokenCount;
    hotMemory.last_activity = new Date().toISOString();
    hotMemory.utilization = newTokenCount / hotMemory.config.max_tokens;

    // Vérifier seuil d'archivage
    if (hotMemory.utilization >= hotMemory.config.auto_archive_threshold) {
      console.warn(`[HotMemory] Agent ${agentId} at ${(hotMemory.utilization * 100).toFixed(1)}% capacity`);
    }

    this.cache.set(agentId, hotMemory);
    await apiClient.post(`/memory/hot/${agentId}/message`, newMessage);

    return hotMemory;
  }

  /**
   * Met à jour l'état de raisonnement
   */
  async updateReasoningState(agentId: string, state: Partial<ReasoningState>): Promise<HotMemory> {
    const hotMemory = await this.get(agentId);
    if (!hotMemory) {
      throw new Error(`No hot memory for agent ${agentId}`);
    }

    hotMemory.reasoning_state = {
      ...hotMemory.reasoning_state,
      ...state,
    };
    hotMemory.last_activity = new Date().toISOString();

    this.cache.set(agentId, hotMemory);
    await apiClient.post(`/memory/hot/${agentId}/reasoning`, state);

    return hotMemory;
  }

  /**
   * Déclenche l'archivage automatique
   */
  private async triggerAutoArchive(agentId: string, hotMemory: HotMemory): Promise<void> {
    console.log(`[HotMemory] Auto-archiving for agent ${agentId}`);
    
    // Transférer vers warm memory via le service d'archivage
    await archivingService.archiveConversation(hotMemory.conversation_id, {
      generate_summary: true,
      extract_decisions: true,
    });

    // Réinitialiser la mémoire chaude (garder contexte minimal)
    const summaryMessage: HotMessage = {
      id: crypto.randomUUID(),
      role: 'system',
      content: '[Contexte précédent archivé. Résumé disponible dans la mémoire subjective.]',
      timestamp: new Date().toISOString(),
      token_count: 20,
    };

    hotMemory.messages = [summaryMessage];
    hotMemory.token_count = summaryMessage.token_count;
    hotMemory.utilization = hotMemory.token_count / hotMemory.config.max_tokens;
  }

  /**
   * Efface la mémoire chaude (fin de session)
   */
  async clear(agentId: string): Promise<void> {
    this.cache.delete(agentId);
    await apiClient.delete(`/memory/hot/${agentId}`);
  }

  /**
   * Obtient les métriques d'utilisation
   */
  getUtilization(agentId: string): number {
    const hotMemory = this.cache.get(agentId);
    return hotMemory?.utilization ?? 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// L2 — WARM MEMORY SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Service pour la mémoire subjective (L2)
 * - Continuité & intention
 * - Compressée et synthétique
 * - Révisable
 */
class WarmMemoryService {
  /**
   * Récupère la mémoire subjective d'un owner
   */
  async get(ownerId: string): Promise<WarmMemory | null> {
    try {
      return await apiClient.get<WarmMemory>(`/memory/warm/${ownerId}`);
    } catch {
      return null;
    }
  }

  /**
   * Ajoute un résumé sémantique
   */
  async addSummary(ownerId: string, summary: Omit<SemanticSummary, 'id' | 'created_at'>): Promise<SemanticSummary> {
    return apiClient.post<SemanticSummary>(`/memory/warm/${ownerId}/summaries`, summary);
  }

  /**
   * Ajoute une décision
   */
  async addDecision(ownerId: string, decision: Omit<DecisionRecord, 'id' | 'created_at'>): Promise<DecisionRecord> {
    return apiClient.post<DecisionRecord>(`/memory/warm/${ownerId}/decisions`, decision);
  }

  /**
   * Ajoute une hypothèse
   */
  async addHypothesis(ownerId: string, hypothesis: Omit<Hypothesis, 'id' | 'created_at' | 'last_evaluated'>): Promise<Hypothesis> {
    return apiClient.post<Hypothesis>(`/memory/warm/${ownerId}/hypotheses`, hypothesis);
  }

  /**
   * Met à jour une hypothèse
   */
  async updateHypothesis(ownerId: string, hypothesisId: string, update: Partial<Hypothesis>): Promise<Hypothesis> {
    return apiClient.post<Hypothesis>(`/memory/warm/${ownerId}/hypotheses/${hypothesisId}`, update);
  }

  /**
   * Ajoute une préférence
   */
  async addPreference(ownerId: string, preference: Omit<Preference, 'id' | 'created_at' | 'last_confirmed'>): Promise<Preference> {
    return apiClient.post<Preference>(`/memory/warm/${ownerId}/preferences`, preference);
  }

  /**
   * Recherche sémantique dans la mémoire subjective
   */
  async search(ownerId: string, query: string, limit: number = 10): Promise<{
    summaries: SemanticSummary[];
    decisions: DecisionRecord[];
  }> {
    return apiClient.post(`/memory/warm/${ownerId}/search`, { query, limit });
  }

  /**
   * Compresse la mémoire subjective
   */
  async compress(ownerId: string): Promise<{ original_tokens: number; compressed_tokens: number }> {
    return apiClient.post(`/memory/warm/${ownerId}/compress`, {});
  }

  /**
   * Récupère les préférences actives
   */
  async getPreferences(ownerId: string, category?: string): Promise<Preference[]> {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    return apiClient.get<Preference[]>(`/memory/warm/${ownerId}/preferences${params}`);
  }

  /**
   * Récupère les hypothèses actives
   */
  async getActiveHypotheses(ownerId: string): Promise<Hypothesis[]> {
    return apiClient.get<Hypothesis[]>(`/memory/warm/${ownerId}/hypotheses?status=active`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// L3 — COLD MEMORY SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Service pour la mémoire froide (L3)
 * - Archive immuable
 * - Jamais chargée en contexte LLM
 * - Accès par référence uniquement
 */
class ColdMemoryService {
  /**
   * Archive une entrée dans la mémoire froide
   */
  async archive(entry: Omit<ColdMemoryEntry, 'id' | 'archived_at' | 'checksum'>): Promise<ColdMemoryEntry> {
    return apiClient.post<ColdMemoryEntry>('/memory/cold/archive', entry);
  }

  /**
   * Demande accès à une entrée froide (retourne référence, jamais contenu brut)
   */
  async requestAccess(request: ColdMemoryAccessRequest): Promise<ColdMemoryAccessResponse> {
    return apiClient.post<ColdMemoryAccessResponse>('/memory/cold/access', request);
  }

  /**
   * Liste les entrées archivées pour un owner
   */
  async list(ownerId: string, options?: {
    type?: string;
    from?: string;
    to?: string;
    limit?: number;
  }): Promise<ColdMemoryEntry[]> {
    const params = new URLSearchParams();
    if (options?.type) params.set('type', options.type);
    if (options?.from) params.set('from', options.from);
    if (options?.to) params.set('to', options.to);
    if (options?.limit) params.set('limit', options.limit.toString());
    
    return apiClient.get<ColdMemoryEntry[]>(`/memory/cold/${ownerId}?${params}`);
  }

  /**
   * Obtient une référence (résumé + URL temporaire)
   */
  async getReference(entryId: string, requesterId: string, reason: string): Promise<ColdMemoryReference | null> {
    const response = await this.requestAccess({
      requester_id: requesterId,
      entry_id: entryId,
      reason,
      access_type: 'reference',
    });

    return response.granted ? response.reference : null;
  }

  /**
   * Vérifie l'intégrité d'une entrée
   */
  async verifyIntegrity(entryId: string): Promise<{ valid: boolean; checksum: string }> {
    return apiClient.get(`/memory/cold/${entryId}/verify`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVING SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Service d'archivage des conversations
 */
class ArchivingService {
  /**
   * Archive une conversation complète
   */
  async archiveConversation(
    conversationId: string,
    options: {
      generate_summary?: boolean;
      extract_decisions?: boolean;
      preserve_artifacts?: boolean;
    } = {}
  ): Promise<ArchiveResult> {
    const policy = {
      ...DEFAULT_ARCHIVING_POLICY,
      generate_summary: options.generate_summary ?? true,
      extract_decisions: options.extract_decisions ?? true,
      preserve_artifacts: options.preserve_artifacts ?? true,
    };

    return apiClient.post<ArchiveResult>('/memory/archive', {
      conversation_id: conversationId,
      policy,
    });
  }

  /**
   * Ferme et archive une conversation
   */
  async closeAndArchive(conversationId: string): Promise<ArchiveResult> {
    // Marquer comme fermée
    await apiClient.post(`/conversations/${conversationId}/close`, {});
    
    // Archiver
    return this.archiveConversation(conversationId);
  }

  /**
   * Configure la politique d'archivage
   */
  async setPolicy(policy: ArchivingPolicy): Promise<void> {
    await apiClient.post('/memory/archive/policy', policy);
  }

  /**
   * Récupère la politique d'archivage actuelle
   */
  async getPolicy(): Promise<ArchivingPolicy> {
    return apiClient.get<ArchivingPolicy>('/memory/archive/policy');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT LOADER SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Service de chargement de contexte sélectif
 */
class ContextLoaderService {
  /**
   * Charge le contexte pertinent pour une conversation
   */
  async loadContext(request: ContextLoadRequest): Promise<LoadedContext> {
    return apiClient.post<LoadedContext>('/memory/context/load', request);
  }

  /**
   * Charge le contexte avec recherche sémantique
   */
  async loadWithQuery(
    agentId: string,
    conversationId: string,
    query: string,
    maxTokens: number = 2000
  ): Promise<LoadedContext> {
    return this.loadContext({
      agent_id: agentId,
      conversation_id: conversationId,
      load_from_warm: true,
      load_from_cold: false,
      relevance_threshold: 0.7,
      max_summaries: 5,
      max_decisions: 3,
      semantic_query: query,
    });
  }

  /**
   * Précharge le contexte pour une nouvelle conversation
   */
  async preloadForNewConversation(
    agentId: string,
    sphereId?: string
  ): Promise<LoadedContext> {
    return apiClient.post<LoadedContext>('/memory/context/preload', {
      agent_id: agentId,
      sphere_id: sphereId,
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONVERSATION SERVICE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Service de gestion des conversations
 */
class ConversationService {
  /**
   * Crée une nouvelle conversation
   */
  async create(data: {
    owner: string;
    scope: ConversationScope;
    sphere_id?: string;
    thread_id?: string;
    tags?: string[];
  }): Promise<Conversation> {
    return apiClient.post<Conversation>('/conversations', {
      ...data,
      status: 'active',
      linked_artifacts: [],
      summary_pointer: null,
      created_at: new Date().toISOString(),
      closed_at: null,
      token_count: 0,
    });
  }

  /**
   * Récupère une conversation
   */
  async get(conversationId: string): Promise<Conversation | null> {
    try {
      return await apiClient.get<Conversation>(`/conversations/${conversationId}`);
    } catch {
      return null;
    }
  }

  /**
   * Liste les conversations actives
   */
  async listActive(ownerId: string): Promise<Conversation[]> {
    return apiClient.get<Conversation[]>(`/conversations?owner=${ownerId}&status=active`);
  }

  /**
   * Ferme une conversation
   */
  async close(conversationId: string): Promise<Conversation> {
    return apiClient.post<Conversation>(`/conversations/${conversationId}/close`, {});
  }

  /**
   * Lie un artifact à une conversation
   */
  async linkArtifact(conversationId: string, artifactId: string): Promise<void> {
    await apiClient.post(`/conversations/${conversationId}/artifacts`, { artifact_id: artifactId });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS — SINGLETON INSTANCES
// ═══════════════════════════════════════════════════════════════════════════════

export const hotMemoryService = new HotMemoryService();
export const warmMemoryService = new WarmMemoryService();
export const coldMemoryService = new ColdMemoryService();
export const archivingService = new ArchivingService();
export const contextLoaderService = new ContextLoaderService();
export const conversationService = new ConversationService();

// Export all services as a unified memory service
export const memoryService = {
  hot: hotMemoryService,
  warm: warmMemoryService,
  cold: coldMemoryService,
  archiving: archivingService,
  context: contextLoaderService,
  conversation: conversationService,
};

export default memoryService;
