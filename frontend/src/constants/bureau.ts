/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — BUREAU SECTIONS CONSTANTS (v35 CORRECTED)
   FROZEN ARCHITECTURE - 6 HIERARCHICAL FLEXIBLE SECTIONS
   
   ⚠️ CRITICAL: EXACTLY 6 SECTIONS (NOT 10!)
   This is NON-NEGOTIABLE per canonical architecture v33+
   ═══════════════════════════════════════════════════════════════════════════════ */

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export interface BureauSection {
  readonly id: BureauSectionId;
  readonly name: string;
  readonly nameFr: string;
  readonly icon: string;
  readonly description: string;
  readonly descriptionFr: string;
  readonly order: number;
  readonly route: string;
  readonly permissions: BureauPermission[];
  readonly features: BureauFeature[];
}

/**
 * v33+ CANONICAL: Exactly 6 sections (Hierarchical Flexible)
 * 
 * OLD (DEPRECATED - DO NOT USE):
 * DASHBOARD, NOTES, TASKS, PROJECTS, THREADS, MEETINGS, DATA, AGENTS, REPORTS, GOVERNANCE
 * 
 * NEW (CANONICAL):
 * QUICK_CAPTURE, RESUME_WORKSPACE, THREADS, DATA_FILES, ACTIVE_AGENTS, MEETINGS
 */
export type BureauSectionId =
  | "QUICK_CAPTURE"
  | "RESUME_WORKSPACE"
  | "THREADS"
  | "DATA_FILES"
  | "ACTIVE_AGENTS"
  | "MEETINGS";

export type BureauPermission = "read" | "write" | "delete" | "share" | "export";

export type BureauFeature =
  | "search"
  | "filter"
  | "sort"
  | "version"
  | "collaborate"
  | "ai_assist"
  | "export"
  | "import"
  | "archive";

// ════════════════════════════════════════════════════════════════════════════════
// 6 BUREAU SECTIONS - FROZEN ARCHITECTURE v33+
// ════════════════════════════════════════════════════════════════════════════════

export const BUREAU_SECTIONS: readonly BureauSection[] = Object.freeze([
  // ────────────────────────────────────────────────────────────────────────────
  // 1. QUICK CAPTURE — Rapid input, voice notes, quick captures
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: "QUICK_CAPTURE",
    name: "Quick Capture",
    nameFr: "Capture rapide",
    icon: "Inbox",
    description: "Rapid input, voice notes, quick captures (500 char max)",
    descriptionFr: "Entrée rapide, notes vocales, captures (500 car. max)",
    order: 1,
    route: "capture",
    permissions: ["read", "write"],
    features: ["ai_assist"],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // 2. RESUME WORKSPACE — Continue work in progress
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: "RESUME_WORKSPACE",
    name: "Resume Workspace",
    nameFr: "Reprendre le travail",
    icon: "Play",
    description: "Continue work in progress, recent items",
    descriptionFr: "Continuer le travail en cours, éléments récents",
    order: 2,
    route: "resume",
    permissions: ["read", "write"],
    features: ["search", "filter", "sort"],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // 3. THREADS — Persistent thought lines (.chenu files)
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: "THREADS",
    name: "Threads",
    nameFr: "Fils",
    icon: "MessageSquare",
    description: "Persistent thought lines, .chenu governed conversations",
    descriptionFr: "Fils de pensée persistants, conversations .chenu gouvernées",
    order: 3,
    route: "threads",
    permissions: ["read", "write", "share"],
    features: ["search", "filter", "ai_assist", "collaborate", "version"],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // 4. DATA FILES — File and data management
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: "DATA_FILES",
    name: "Data & Files",
    nameFr: "Données & Fichiers",
    icon: "Database",
    description: "File management, documents, structured data",
    descriptionFr: "Gestion de fichiers, documents, données structurées",
    order: 4,
    route: "data",
    permissions: ["read", "write", "delete", "share", "export"],
    features: ["search", "filter", "sort", "version", "import", "export", "archive"],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // 5. ACTIVE AGENTS — Agent status and control (OBSERVATIONAL ONLY)
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: "ACTIVE_AGENTS",
    name: "Active Agents",
    nameFr: "Agents actifs",
    icon: "Bot",
    description: "Agent status, task progress, agent bureau (observational)",
    descriptionFr: "État des agents, progrès des tâches, bureau agent (observation)",
    order: 5,
    route: "agents",
    permissions: ["read"], // OBSERVATIONAL - agents cannot write directly
    features: ["filter", "sort"],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // 6. MEETINGS — Meeting management
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: "MEETINGS",
    name: "Meetings",
    nameFr: "Réunions",
    icon: "Calendar",
    description: "Meeting scheduling, recordings, summaries",
    descriptionFr: "Planification de réunions, enregistrements, résumés",
    order: 6,
    route: "meetings",
    permissions: ["read", "write", "share"],
    features: ["search", "filter", "ai_assist", "collaborate", "export"],
  },
] as const);

// ════════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════════

export const getBureauSection = (id: BureauSectionId): BureauSection | undefined => {
  return BUREAU_SECTIONS.find((section) => section.id === id);
};

export const getBureauSectionByRoute = (route: string): BureauSection | undefined => {
  return BUREAU_SECTIONS.find((section) => section.route === route);
};

export const getBureauSectionsByPermission = (permission: BureauPermission): BureauSection[] => {
  return BUREAU_SECTIONS.filter((section) => section.permissions.includes(permission));
};

export const getBureauSectionsByFeature = (feature: BureauFeature): BureauSection[] => {
  return BUREAU_SECTIONS.filter((section) => section.features.includes(feature));
};

// ════════════════════════════════════════════════════════════════════════════════
// VALIDATION (Runtime check)
// ════════════════════════════════════════════════════════════════════════════════

export const validateBureauSections = (): void => {
  const EXPECTED_COUNT = 6;
  if (BUREAU_SECTIONS.length !== EXPECTED_COUNT) {
    throw new Error(
      `ARCHITECTURAL VIOLATION: Bureau must have exactly ${EXPECTED_COUNT} sections. ` +
      `Found: ${BUREAU_SECTIONS.length}. ` +
      `This is a FROZEN requirement per CHE·NU canonical architecture v33+.`
    );
  }
};

// Run validation on import
validateBureauSections();

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default BUREAU_SECTIONS;

// ════════════════════════════════════════════════════════════════════════════════
// MIGRATION NOTE
// ════════════════════════════════════════════════════════════════════════════════
/**
 * MIGRATION FROM 10 SECTIONS TO 6 SECTIONS:
 * 
 * OLD → NEW Mapping:
 * ─────────────────────────────────────────────────────────────────────────────
 * DASHBOARD      → (removed - integrated into RESUME_WORKSPACE)
 * NOTES          → QUICK_CAPTURE (for quick notes) + DATA_FILES (for full notes)
 * TASKS          → (removed - integrated into THREADS as actionable threads)
 * PROJECTS       → (removed - Projects are DataSpaces, accessed via DATA_FILES)
 * THREADS        → THREADS (kept)
 * MEETINGS       → MEETINGS (kept)
 * DATA           → DATA_FILES (expanded)
 * AGENTS         → ACTIVE_AGENTS (renamed, observational only)
 * REPORTS        → (removed - Reports generated from threads/data)
 * GOVERNANCE     → (removed - Governance is cross-cutting, not a section)
 * 
 * NEW SECTION:
 * RESUME_WORKSPACE → Replaces Dashboard + Recent work
 */
