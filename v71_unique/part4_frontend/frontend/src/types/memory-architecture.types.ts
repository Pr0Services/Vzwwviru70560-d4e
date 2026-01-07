/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — TRI-LAYER MEMORY ARCHITECTURE                   ║
 * ║                    Canonical Implementation — v1.1                            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * ARCHITECTURE:
 * - L1: Mémoire Chaude (HOT)   → Raisonnement actif, volatile
 * - L2: Mémoire Subjective (WARM) → Continuité, révisable
 * - L3: Mémoire Froide (COLD)  → Archive immuable, traçable
 *
 * PRINCIPE FONDAMENTAL:
 * "Aucune intelligence ne doit porter l'intégralité de son passé actif en mémoire."
 * Le contexte n'est JAMAIS empilé, il est ADRESSABLE.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES FONDAMENTAUX
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Couches de mémoire
 */
export type MemoryLayer = 'hot' | 'warm' | 'cold';

/**
 * Status d'une conversation
 */
export type ConversationStatus = 'active' | 'archived' | 'frozen';

/**
 * Scope d'une conversation
 */
export type ConversationScope = 'general' | 'sphere' | 'task' | 'incident';

/**
 * Type de contenu mémoire
 */
export type MemoryContentType = 
  | 'message'           // Message brut
  | 'decision'          // Décision prise
  | 'artifact'          // Artifact créé
  | 'summary'           // Résumé sémantique
  | 'hypothesis'        // Hypothèse active
  | 'preference'        // Préférence apprise
  | 'mental_model'      // Modèle mental temporaire
  | 'audit_log';        // Log OPA/audit

// ═══════════════════════════════════════════════════════════════════════════════
// CONVERSATION (UNITÉ DE BASE)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Métadonnées d'une conversation
 */
export interface Conversation {
  conversation_id: string;
  owner: string;                    // agent_id | user_id
  scope: ConversationScope;
  status: ConversationStatus;
  linked_artifacts: string[];       // IDs des artifacts liés
  summary_pointer: string | null;   // Référence vectorielle du résumé
  created_at: string;               // ISO timestamp
  closed_at: string | null;         // ISO timestamp | null si active
  
  // Métadonnées additionnelles
  sphere_id?: string;
  thread_id?: string;
  parent_conversation_id?: string;  // Pour conversations chaînées
  tags: string[];
  token_count: number;              // Tokens consommés
}

// ═══════════════════════════════════════════════════════════════════════════════
// L1 — MÉMOIRE CHAUDE (HOT)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Configuration mémoire chaude
 */
export interface HotMemoryConfig {
  max_tokens: number;               // Limite stricte (ex: 8000)
  max_messages: number;             // Limite messages (ex: 50)
  ttl_seconds: number;              // Time-to-live (ex: 3600)
  auto_archive_threshold: number;   // Seuil d'archivage auto (ex: 0.8 = 80%)
}

/**
 * État de la mémoire chaude d'un agent
 */
export interface HotMemory {
  agent_id: string;
  conversation_id: string;
  
  // Contenu actif
  messages: HotMessage[];
  current_objectives: string[];
  active_constraints: string[];
  reasoning_state: ReasoningState;
  
  // Métriques
  token_count: number;
  created_at: string;
  last_activity: string;
  
  // Limites
  config: HotMemoryConfig;
  utilization: number;              // 0-1 (pourcentage utilisé)
}

/**
 * Message dans la mémoire chaude
 */
export interface HotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  token_count: number;
  metadata?: Record<string, unknown>;
}

/**
 * État du raisonnement en cours
 */
export interface ReasoningState {
  current_task: string | null;
  pending_actions: string[];
  active_hypotheses: string[];
  confidence_level: number;         // 0-1
  last_checkpoint_id: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// L2 — MÉMOIRE SUBJECTIVE (WARM)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Configuration mémoire subjective
 */
export interface WarmMemoryConfig {
  max_entries: number;              // Limite entrées (ex: 1000)
  compression_ratio: number;        // Ratio compression (ex: 0.1 = 10%)
  retention_days: number;           // Durée rétention (ex: 90)
  revision_allowed: boolean;        // Permettre révisions
}

/**
 * Mémoire subjective d'un agent/profil
 */
export interface WarmMemory {
  owner_id: string;                 // agent_id | user_id
  owner_type: 'agent' | 'user';
  
  // Contenus subjectifs
  summaries: SemanticSummary[];
  decisions: DecisionRecord[];
  active_hypotheses: Hypothesis[];
  preferences: Preference[];
  mental_models: MentalModel[];
  
  // Métriques
  entry_count: number;
  last_updated: string;
  compression_status: CompressionStatus;
}

/**
 * Résumé sémantique d'une conversation
 */
export interface SemanticSummary {
  id: string;
  source_conversation_id: string;
  content: string;                  // Résumé compressé
  key_points: string[];             // Points clés extraits
  entities: string[];               // Entités mentionnées
  sentiment: 'positive' | 'neutral' | 'negative';
  vector_embedding?: number[];      // Embedding pour recherche
  created_at: string;
  relevance_score: number;          // 0-1
}

/**
 * Décision enregistrée
 */
export interface DecisionRecord {
  id: string;
  conversation_id: string;
  decision: string;
  intention: string;                // Pourquoi cette décision
  context_snapshot: string;         // Contexte au moment
  outcome?: 'success' | 'failure' | 'pending';
  created_at: string;
  reviewed_at?: string;
}

/**
 * Hypothèse active
 */
export interface Hypothesis {
  id: string;
  statement: string;
  confidence: number;               // 0-1
  supporting_evidence: string[];
  contradicting_evidence: string[];
  status: 'active' | 'confirmed' | 'rejected' | 'revised';
  created_at: string;
  last_evaluated: string;
}

/**
 * Préférence apprise
 */
export interface Preference {
  id: string;
  category: string;                 // ex: "communication_style"
  key: string;                      // ex: "verbosity"
  value: string | number | boolean;
  confidence: number;               // 0-1
  source_conversations: string[];   // D'où vient cette préférence
  created_at: string;
  last_confirmed: string;
}

/**
 * Modèle mental temporaire
 */
export interface MentalModel {
  id: string;
  name: string;
  description: string;
  assumptions: string[];
  valid_until?: string;             // Date d'expiration optionnelle
  applies_to: string[];             // Contextes d'application
  created_at: string;
}

/**
 * Status de compression
 */
export interface CompressionStatus {
  last_compression: string;
  original_tokens: number;
  compressed_tokens: number;
  compression_ratio: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// L3 — MÉMOIRE FROIDE (COLD / ARCHIVE)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Configuration mémoire froide
 */
export interface ColdMemoryConfig {
  retention_years: number;          // Durée légale (ex: 7)
  encryption_required: boolean;     // Chiffrement obligatoire
  immutable: true;                  // TOUJOURS true
  audit_trail_required: boolean;    // Audit obligatoire
}

/**
 * Entrée dans la mémoire froide (archive)
 */
export interface ColdMemoryEntry {
  id: string;
  type: ColdEntryType;
  
  // Référence (jamais le contenu brut en mémoire LLM)
  reference_id: string;
  storage_location: string;         // URI vers stockage
  
  // Métadonnées
  original_conversation_id: string;
  owner_id: string;
  created_at: string;
  archived_at: string;
  
  // Intégrité
  checksum: string;                 // SHA-256
  signature?: string;               // Signature cryptographique
  
  // Accès
  access_count: number;
  last_accessed?: string;
}

export type ColdEntryType = 
  | 'conversation_full'     // Conversation intégrale
  | 'artifact_validated'    // Artifact validé
  | 'decision_frozen'       // Décision gelée
  | 'audit_log'            // Log OPA
  | 'session_snapshot';    // Snapshot de session

/**
 * Requête d'accès à la mémoire froide
 */
export interface ColdMemoryAccessRequest {
  requester_id: string;
  entry_id: string;
  reason: string;
  access_type: 'read' | 'reference';  // Jamais 'write'
  governance_checkpoint_id?: string;
}

/**
 * Réponse d'accès (référence uniquement)
 */
export interface ColdMemoryAccessResponse {
  granted: boolean;
  reference: ColdMemoryReference | null;
  audit_event_id: string;
  denial_reason?: string;
}

/**
 * Référence à une entrée froide (jamais le contenu brut)
 */
export interface ColdMemoryReference {
  entry_id: string;
  summary: string;                  // Résumé pour décision
  relevance_score: number;
  access_url: string;               // URL sécurisée temporaire
  expires_at: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FLUX COGNITIF
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Flux de transfert entre couches
 */
export interface MemoryTransfer {
  id: string;
  source_layer: MemoryLayer;
  target_layer: MemoryLayer;
  content_type: MemoryContentType;
  content_id: string;
  
  // Transformation appliquée
  transformation: TransformationType;
  
  // Audit
  initiated_by: string;
  initiated_at: string;
  completed_at?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export type TransformationType = 
  | 'none'              // Copie directe
  | 'summarize'         // Compression sémantique
  | 'extract_decision'  // Extraction de décision
  | 'archive_full';     // Archivage complet

/**
 * Règle de transfert automatique
 */
export interface TransferRule {
  id: string;
  name: string;
  trigger: TransferTrigger;
  source_layer: MemoryLayer;
  target_layer: MemoryLayer;
  transformation: TransformationType;
  conditions: TransferCondition[];
  enabled: boolean;
}

export type TransferTrigger = 
  | 'token_threshold'     // Seuil tokens atteint
  | 'time_elapsed'        // Temps écoulé
  | 'conversation_close'  // Fermeture conversation
  | 'manual'              // Manuel
  | 'checkpoint_approved';// Checkpoint approuvé

export interface TransferCondition {
  field: string;
  operator: 'eq' | 'gt' | 'lt' | 'contains';
  value: string | number | boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONVERSATION ARCHIVING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Politique d'archivage
 */
export interface ArchivingPolicy {
  id: string;
  name: string;
  
  // Déclencheurs
  auto_archive_after_minutes: number;
  auto_archive_on_token_limit: boolean;
  archive_on_close: boolean;
  
  // Transformation
  generate_summary: boolean;
  extract_decisions: boolean;
  preserve_artifacts: boolean;
  
  // Rétention
  warm_retention_days: number;
  cold_retention_years: number;
}

/**
 * Résultat d'archivage
 */
export interface ArchiveResult {
  conversation_id: string;
  archived_at: string;
  
  // Créations
  summary_id: string | null;
  cold_entry_id: string;
  extracted_decisions: string[];
  
  // Métriques
  original_tokens: number;
  summary_tokens: number;
  compression_ratio: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT LOADING (Chargement sélectif)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Requête de chargement contexte
 */
export interface ContextLoadRequest {
  agent_id: string;
  conversation_id: string;
  
  // Sources à charger
  load_from_warm: boolean;
  load_from_cold: boolean;
  
  // Filtres
  relevance_threshold: number;      // 0-1
  max_summaries: number;
  max_decisions: number;
  time_range?: {
    from: string;
    to: string;
  };
  
  // Recherche sémantique
  semantic_query?: string;
}

/**
 * Contexte chargé
 */
export interface LoadedContext {
  request_id: string;
  
  // Contenu sélectionné
  relevant_summaries: SemanticSummary[];
  relevant_decisions: DecisionRecord[];
  active_hypotheses: Hypothesis[];
  applicable_preferences: Preference[];
  
  // Références froides (jamais le contenu brut)
  cold_references: ColdMemoryReference[];
  
  // Métriques
  total_tokens_loaded: number;
  sources_consulted: number;
  load_time_ms: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export const DEFAULT_HOT_CONFIG: HotMemoryConfig = {
  max_tokens: 8000,
  max_messages: 50,
  ttl_seconds: 3600,
  auto_archive_threshold: 0.8,
};

export const DEFAULT_WARM_CONFIG: WarmMemoryConfig = {
  max_entries: 1000,
  compression_ratio: 0.1,
  retention_days: 90,
  revision_allowed: true,
};

export const DEFAULT_COLD_CONFIG: ColdMemoryConfig = {
  retention_years: 7,
  encryption_required: true,
  immutable: true,
  audit_trail_required: true,
};

export const DEFAULT_ARCHIVING_POLICY: ArchivingPolicy = {
  id: 'default',
  name: 'Default Archiving Policy',
  auto_archive_after_minutes: 60,
  auto_archive_on_token_limit: true,
  archive_on_close: true,
  generate_summary: true,
  extract_decisions: true,
  preserve_artifacts: true,
  warm_retention_days: 90,
  cold_retention_years: 7,
};
