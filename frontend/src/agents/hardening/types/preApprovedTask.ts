// Pre-Approved Task Context (PTC)
// Cadre explicite défini par l'utilisateur AVANT toute action

export type AgentRole = "analysis" | "methodology" | "comparison" | "presentation";

export type ForbiddenCapability = "decision" | "recommendation" | "evaluation" | "auto-action";

export type PreApprovedTaskContext = {
  id: string;
  createdAt: number;
  createdBy: "user"; // Toujours l'utilisateur

  intent: string; // ex: "analyse", "exploration", "documentation"

  allowedAgentRoles: AgentRole[];

  forbiddenCapabilities: ForbiddenCapability[];

  dataConstraints: {
    personalDataAllowed: boolean;
    crossSphereAccessAllowed: boolean;
  };

  xrConstraints: {
    allowed: boolean;
    mode: "read-only" | "disabled";
  };

  notes?: string;
};

// Tâche active - référence TOUJOURS un PTC
export type ActiveTask = {
  id: string;
  contextId: string; // Référence vers PTC - obligatoire
  startedAt: number;
  sphereId?: string;
};

// Résultat de vérification du Directive Guard
// IL N'EMPÊCHE RIEN - il observe seulement
export type DirectiveCheckResult = {
  compliant: boolean;
  warnings: string[];
  violatedRules: string[];
  checkedAt: number;
};

// Historique des vérifications pour transparence
export type DirectiveCheckHistory = {
  taskId: string;
  checks: DirectiveCheckResult[];
};
