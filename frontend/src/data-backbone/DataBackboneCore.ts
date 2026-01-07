// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — DATA BACKBONE & MEMORY UNIFICATION
// MEGA BLOCK — COPY / PASTE SAFE (Claude / Copilot)
// Purpose: The CORE that everything relies on
// ═══════════════════════════════════════════════════════════════════════════════

/* =========================================================
SECTION A — DESIGN GOAL (NON-NEGOTIABLES)
========================================================= */

/*
1. Every Sphere OWNS its data (local autonomy)
2. The System CAN reason across spheres (global clarity)
3. No sphere can leak private data by default
4. Memory is layered:
   - Local (sphere)
   - Cross-sphere (permissioned)
   - Narrative / temporal (decision history)
5. Agents NEVER read raw DB tables directly
   → they go through Memory & Query Guards
*/

/* =========================================================
1. SPHERE TYPES
========================================================= */

export type SphereId =
  | "personal"
  | "business"
  | "scholar"
  | "creative"
  | "social"
  | "institution"
  | "methodology"
  | "xr"
  | "ai_lab"
  | "my_team"
  | string; // Allow custom spheres

export type VisibilityLevel = "private" | "shared" | "public";
export type EncryptionLevel = "none" | "field" | "full";
export type RetentionPolicy = "ephemeral" | "session" | "short_term" | "long_term" | "permanent";

/* =========================================================
2. SPHERE DATABASE MODEL
========================================================= */

export interface SphereDatabaseMeta {
  sphereId: SphereId;
  ownerUserId: string;
  displayName: string;
  description?: string;
  visibility: VisibilityLevel;
  encryptionLevel: EncryptionLevel;
  retentionPolicy: RetentionPolicy;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export interface SphereRecord<T = unknown> {
  id: string;
  createdAt: number;
  updatedAt: number;
  authorId: string;
  authorType: "user" | "agent" | "system";
  data: T;
  tags?: string[];
  sensitivity: "public" | "private" | "restricted";
  expiresAt?: number;
}

export interface SphereDatabase<T = unknown> {
  meta: SphereDatabaseMeta;
  records: Map<string, SphereRecord<T>>;
}

/* =========================================================
3. MEMORY LAYERS (CRITICAL CONCEPT)
========================================================= */

export type MemoryLayer =
  | "sphere_local"      // Contained within single sphere
  | "cross_sphere"      // Shared between specific spheres (permissioned)
  | "collective"        // Organization-wide knowledge
  | "narrative"         // Decision history and rationale
  | "archive";          // Long-term historical storage

export interface MemoryEntry {
  id: string;
  layer: MemoryLayer;
  sphereId?: SphereId;
  relatedSpheres?: SphereId[];
  relatedEntityIds?: string[];
  timestamp: number;
  author: "user" | "agent" | "system";
  authorId?: string;
  content: unknown;
  contentType: "text" | "structured" | "reference" | "decision" | "event";
  sensitivity: "public" | "private" | "restricted";
  ttl?: number; // Time-to-live in ms
  version: number;
}

/* =========================================================
4. UNIFIED MEMORY INDEX
========================================================= */

/*
This is NOT a database.
This is a READ-ONLY intelligent index aggregating:
- what exists
- where it exists
- who is allowed to see it
*/

export interface MemoryIndexPointer {
  entryId: string;
  sourceSphere?: SphereId;
  layer: MemoryLayer;
  sensitivity: MemoryEntry["sensitivity"];
  permissions: string[]; // roles / agents / users allowed
  contentHash?: string; // For integrity verification
  lastAccessed?: number;
}

export interface MemoryIndex {
  pointers: MemoryIndexPointer[];
  version: number;
  lastUpdated: number;
}

/* =========================================================
5. PERMISSION & PRIVACY GUARDS
========================================================= */

export type AccessPurpose =
  | "display"
  | "analysis"
  | "decision"
  | "learning"
  | "export"
  | "audit";

export interface AccessContext {
  requesterId: string;
  requesterType: "user" | "agent" | "system";
  requesterRole?: string;
  sphereContext?: SphereId;
  purpose: AccessPurpose;
  timestamp: number;
}

/**
 * Check if requester can access a memory entry
 */
export function canAccessMemory(
  ctx: AccessContext,
  pointer: MemoryIndexPointer
): boolean {
  // Public content is always accessible
  if (pointer.sensitivity === "public") return true;

  // Private content requires direct permission
  if (pointer.sensitivity === "private") {
    return (
      ctx.requesterType === "user" &&
      pointer.permissions.includes(ctx.requesterId)
    );
  }

  // Restricted content requires role-based permission
  if (pointer.sensitivity === "restricted") {
    if (!ctx.requesterRole) return false;
    return pointer.permissions.includes(ctx.requesterRole);
  }

  return false;
}

/**
 * Check if purpose is allowed for sensitivity level
 */
export function isPurposeAllowed(
  sensitivity: MemoryEntry["sensitivity"],
  purpose: AccessPurpose
): boolean {
  // Public: all purposes allowed
  if (sensitivity === "public") return true;

  // Private: no learning or export without explicit consent
  if (sensitivity === "private") {
    return !["learning", "export"].includes(purpose);
  }

  // Restricted: only display, analysis, audit
  if (sensitivity === "restricted") {
    return ["display", "analysis", "audit"].includes(purpose);
  }

  return false;
}

/* =========================================================
6. AGENT DATA ACCESS (MANDATORY PATH)
========================================================= */

/*
Agents NEVER:
❌ query databases directly
❌ inspect schemas
❌ pull raw records
❌ bypass memory guards

Agents ALWAYS:
✅ query MemoryIndex
✅ request scoped summaries
✅ receive redacted payloads
✅ operate within allowed scopes
*/

export type AgentQueryIntent =
  | "summarize"
  | "compare"
  | "detect_pattern"
  | "verify"
  | "learn"
  | "search";

export interface AgentMemoryQuery {
  agentId: string;
  allowedScopes: MemoryLayer[];
  requestedSphere?: SphereId;
  intent: AgentQueryIntent;
  queryFilters?: {
    tags?: string[];
    dateRange?: { from: number; to: number };
    contentTypes?: MemoryEntry["contentType"][];
  };
  maxResults?: number;
}

export interface AgentMemoryResponse {
  summaries: AgentMemorySummary[];
  redactionsApplied: boolean;
  deniedEntriesCount: number;
  totalMatches: number;
  queryTimestamp: number;
}

export interface AgentMemorySummary {
  entryId: string;
  layer: MemoryLayer;
  sphere?: SphereId;
  timestamp: number;
  contentType: MemoryEntry["contentType"];
  summary: string; // Always summarized/redacted, never raw
  tags?: string[];
}

/* =========================================================
7. MEMORY QUERY ENGINE (SAFE)
========================================================= */

/**
 * Query memory for an agent (with guards)
 */
export function queryMemoryForAgent(
  query: AgentMemoryQuery,
  ctx: AccessContext,
  index: MemoryIndex,
  entries: MemoryEntry[]
): AgentMemoryResponse {
  const summaries: AgentMemorySummary[] = [];
  let denied = 0;
  let matched = 0;

  index.pointers.forEach((pointer) => {
    // Check scope
    if (!query.allowedScopes.includes(pointer.layer)) return;

    // Check sphere filter
    if (query.requestedSphere && pointer.sourceSphere !== query.requestedSphere) {
      return;
    }

    matched++;

    // Check access permission
    const allowed = canAccessMemory(ctx, pointer);
    if (!allowed) {
      denied++;
      return;
    }

    // Check purpose
    if (!isPurposeAllowed(pointer.sensitivity, ctx.purpose)) {
      denied++;
      return;
    }

    // Find entry
    const entry = entries.find((e) => e.id === pointer.entryId);
    if (!entry) return;

    // Apply additional filters
    if (query.queryFilters) {
      const { tags, dateRange, contentTypes } = query.queryFilters;

      if (tags && entry.tags) {
        const hasTag = tags.some((t) => entry.tags?.includes(t));
        if (!hasTag) return;
      }

      if (dateRange) {
        if (entry.timestamp < dateRange.from || entry.timestamp > dateRange.to) {
          return;
        }
      }

      if (contentTypes && !contentTypes.includes(entry.contentType)) {
        return;
      }
    }

    // Create redacted summary
    summaries.push({
      entryId: entry.id,
      layer: entry.layer,
      sphere: entry.sphereId,
      timestamp: entry.timestamp,
      contentType: entry.contentType,
      summary: createRedactedSummary(entry, ctx.purpose),
      tags: entry.tags,
    });

    // Enforce max results
    if (query.maxResults && summaries.length >= query.maxResults) {
      return;
    }
  });

  return {
    summaries,
    redactionsApplied: denied > 0,
    deniedEntriesCount: denied,
    totalMatches: matched,
    queryTimestamp: Date.now(),
  };
}

/**
 * Create a redacted summary of an entry
 */
function createRedactedSummary(entry: MemoryEntry, purpose: AccessPurpose): string {
  // For learning, provide minimal info
  if (purpose === "learning") {
    return `[${entry.contentType}] Entry from ${new Date(entry.timestamp).toISOString()}`;
  }

  // For analysis, provide structured info
  if (purpose === "analysis") {
    return `[${entry.contentType}] Layer: ${entry.layer}, Sphere: ${entry.sphereId || "none"}`;
  }

  // For display, provide more context (still redacted)
  return `[${entry.contentType}] Content available - sensitivity: ${entry.sensitivity}`;
}

/* =========================================================
8. DECISION MEMORY & TRACEABILITY
========================================================= */

export interface DecisionTrace {
  id: string;
  decisionLabel: string;
  description: string;
  timestamp: number;
  inputMemoryIds: string[];
  outputActions: string[];
  rationale: string;
  confidence: number; // 0..1
  decidedBy: "user" | "agent" | "system";
  agentId?: string;
  sphereContext?: SphereId;
  impactLevel: "low" | "medium" | "high";
}

export interface DecisionLedger {
  traces: DecisionTrace[];
  version: number;
  lastUpdated: number;
}

/*
Law:
Every decision worth keeping MUST have:
- inputs (what was considered)
- outputs (what actions resulted)
- rationale (why)
- timestamp (when)
- confidence (how sure)
*/

/**
 * Create a decision trace
 */
export function createDecisionTrace(
  label: string,
  description: string,
  inputMemoryIds: string[],
  outputActions: string[],
  rationale: string,
  confidence: number,
  decidedBy: "user" | "agent" | "system",
  options?: {
    agentId?: string;
    sphereContext?: SphereId;
    impactLevel?: "low" | "medium" | "high";
  }
): DecisionTrace {
  return {
    id: `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    decisionLabel: label,
    description,
    timestamp: Date.now(),
    inputMemoryIds,
    outputActions,
    rationale,
    confidence: Math.max(0, Math.min(1, confidence)),
    decidedBy,
    agentId: options?.agentId,
    sphereContext: options?.sphereContext,
    impactLevel: options?.impactLevel || "low",
  };
}

/* =========================================================
9. EXPORT & SHARING RULES
========================================================= */

export type ExportScope =
  | "single_sphere"
  | "multi_sphere"
  | "decision_only"
  | "narrative_only"
  | "full_archive";

export type ExportFormat = "pdf" | "json" | "md" | "csv" | "encrypted_bundle";

export interface ExportRequest {
  id: string;
  requesterId: string;
  requesterType: "user" | "agent" | "system";
  scope: ExportScope;
  targetSpheres?: SphereId[];
  format: ExportFormat;
  anonymize: boolean;
  dateRange?: { from: number; to: number };
  includeDecisions: boolean;
  timestamp: number;
}

export interface ExportValidation {
  isValid: boolean;
  requiresApproval: boolean;
  approvalReason?: string;
  warnings: string[];
}

/**
 * Validate an export request
 */
export function validateExportRequest(
  req: ExportRequest,
  memory: MemoryIndexPointer[]
): ExportValidation {
  const warnings: string[] = [];

  // Anonymized exports are generally safe
  if (req.anonymize) {
    return {
      isValid: true,
      requiresApproval: false,
      warnings: ["Data will be anonymized before export"],
    };
  }

  // Non-anonymized exports require owner approval
  const hasPrivateData = memory.some((p) => p.sensitivity === "private");
  const hasRestrictedData = memory.some((p) => p.sensitivity === "restricted");

  if (hasPrivateData) {
    warnings.push("Export contains private data");
  }

  if (hasRestrictedData) {
    warnings.push("Export contains restricted data");
  }

  // Multi-sphere exports need extra scrutiny
  if (req.scope === "multi_sphere" || req.scope === "full_archive") {
    warnings.push("Cross-sphere export requires elevated permissions");
  }

  // Agent exports always require approval
  if (req.requesterType === "agent") {
    return {
      isValid: true,
      requiresApproval: true,
      approvalReason: "Agent-initiated exports require user approval",
      warnings,
    };
  }

  return {
    isValid: true,
    requiresApproval: hasPrivateData || hasRestrictedData,
    approvalReason:
      hasPrivateData || hasRestrictedData
        ? "Export contains sensitive data"
        : undefined,
    warnings,
  };
}

/* =========================================================
10. FORGETTING & RETENTION
========================================================= */

export interface RetentionRule {
  layer: MemoryLayer;
  maxAge?: number; // ms
  maxEntries?: number;
  exemptTags?: string[]; // Tags that prevent deletion
  priority: number; // Higher = delete last
}

export const DEFAULT_RETENTION_RULES: RetentionRule[] = [
  { layer: "sphere_local", maxAge: 90 * 24 * 60 * 60 * 1000, priority: 1 }, // 90 days
  { layer: "cross_sphere", maxAge: 180 * 24 * 60 * 60 * 1000, priority: 2 }, // 180 days
  { layer: "narrative", exemptTags: ["important", "milestone"], priority: 4 },
  { layer: "collective", priority: 3 },
  { layer: "archive", priority: 5 }, // Archive = permanent unless explicit delete
];

/**
 * Get entries that should be forgotten based on retention rules
 */
export function getExpiredEntries(
  entries: MemoryEntry[],
  rules: RetentionRule[]
): string[] {
  const now = Date.now();
  const toForget: string[] = [];

  entries.forEach((entry) => {
    const rule = rules.find((r) => r.layer === entry.layer);
    if (!rule) return;

    // Check TTL on entry itself
    if (entry.ttl && now - entry.timestamp > entry.ttl) {
      toForget.push(entry.id);
      return;
    }

    // Check layer max age
    if (rule.maxAge && now - entry.timestamp > rule.maxAge) {
      // Check exempt tags
      if (rule.exemptTags && entry.tags) {
        const isExempt = rule.exemptTags.some((t) => entry.tags?.includes(t));
        if (isExempt) return;
      }
      toForget.push(entry.id);
    }
  });

  return toForget;
}

/* =========================================================
11. FOUNDATIONAL LAWS (DATA)
========================================================= */

export const DATA_BACKBONE_LAW = {
  // Ownership
  dataOwnership: "Data belongs to the user, not the agent",
  sphereAutonomy: "Every sphere owns its data",

  // Access
  noAccessWithoutPurpose: "No access without explicit purpose",
  noPurposeWithoutTrace: "No purpose without traceable record",
  agentsMustUseGuards: "Agents NEVER access raw data directly",

  // Memory
  memoryIsContextual: "Memory is contextual, not absolute",
  memoryIsLayered: "Memory exists in defined layers",

  // Intelligence
  intelligenceWithResponsibility: "No intelligence without responsibility",
  forgettingIsFeature: "Forgetting is a feature, not a bug",

  // Privacy
  noLeakByDefault: "No sphere can leak private data by default",
  crossSphereIsPermissioned: "Cross-sphere access requires explicit permission",
} as const;

/* =========================================================
12. EXPORTS
========================================================= */

export default {
  // Access control
  canAccessMemory,
  isPurposeAllowed,

  // Query engine
  queryMemoryForAgent,

  // Decision tracing
  createDecisionTrace,

  // Export validation
  validateExportRequest,

  // Retention
  getExpiredEntries,
  DEFAULT_RETENTION_RULES,

  // Law
  DATA_BACKBONE_LAW,
};
