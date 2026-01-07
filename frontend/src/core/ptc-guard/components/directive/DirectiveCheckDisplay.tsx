// ============================================
// CHE·NU — DIRECTIVE CHECK DISPLAY
// ============================================
// Les agents ne décident jamais.
// Toute délégation est volontaire.
// Toute chaîne passe par l'utilisateur.
// Silence > Agent.
// Replay = lecture seule.
// ============================================

import { DirectiveCheckResult } from "../../types/preApprovedTask";
import { formatCheckResult } from "../../agents/directiveGuardAgent";

type DirectiveCheckDisplayProps = {
  result: DirectiveCheckResult | null;
  compact?: boolean;
};

/**
 * Affiche le résultat d'une vérification de directive
 * 
 * RAPPEL: Le Directive Guard OBSERVE seulement.
 * Il ne bloque JAMAIS, il ne décide JAMAIS.
 */
export function DirectiveCheckDisplay({
  result,
  compact = false,
}: DirectiveCheckDisplayProps) {
  if (!result) {
    return null;
  }

  const formatted = formatCheckResult(result);

  const statusColors = {
    ok: { bg: "#e8f5e9", border: "#a5d6a7", text: "#2e7d32", icon: "✓" },
    warning: { bg: "#fff3e0", border: "#ffcc80", text: "#e65100", icon: "⚠️" },
    violation: { bg: "#ffebee", border: "#ef9a9a", text: "#c62828", icon: "⛔" },
  };

  const colors = statusColors[formatted.status];

  if (compact) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 8px",
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          borderRadius: "4px",
          fontSize: "12px",
          color: colors.text,
        }}
      >
        <span>{colors.icon}</span>
        <span>{formatted.status === "ok" ? "Conforme" : formatted.status}</span>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "12px",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: "6px",
        fontSize: "13px",
      }}
    >
      {/* Status header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: result.warnings.length > 0 || result.violatedRules.length > 0 ? "8px" : 0,
        }}
      >
        <span style={{ fontSize: "16px" }}>{colors.icon}</span>
        <span style={{ fontWeight: 500, color: colors.text }}>
          {formatted.status === "ok" && "Conforme au contexte"}
          {formatted.status === "warning" && "Conforme avec avertissements"}
          {formatted.status === "violation" && "Non conforme au contexte"}
        </span>
      </div>

      {/* Warnings */}
      {result.warnings.length > 0 && (
        <div style={{ marginBottom: "8px" }}>
          <div style={{ fontSize: "11px", color: "#666", marginBottom: "4px" }}>
            Avertissements (informatifs):
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: "20px",
              color: colors.text,
            }}
          >
            {result.warnings.map((w, i) => (
              <li key={i} style={{ marginBottom: "2px" }}>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Violated rules */}
      {result.violatedRules.length > 0 && (
        <div>
          <div style={{ fontSize: "11px", color: "#666", marginBottom: "4px" }}>
            Règles non respectées:
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: "20px",
              color: colors.text,
            }}
          >
            {result.violatedRules.map((v, i) => (
              <li key={i} style={{ marginBottom: "2px" }}>
                {v}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timestamp */}
      <div
        style={{
          marginTop: "8px",
          fontSize: "10px",
          color: "#888",
          textAlign: "right",
        }}
      >
        Vérifié à {new Date(result.checkedAt).toLocaleTimeString("fr-CA")}
      </div>

      {/* Important notice */}
      <div
        style={{
          marginTop: "8px",
          paddingTop: "8px",
          borderTop: `1px solid ${colors.border}`,
          fontSize: "10px",
          color: "#666",
          fontStyle: "italic",
        }}
      >
        Note: Cette vérification est informative. Elle n'empêche aucune action.
        L'utilisateur reste le seul décideur.
      </div>
    </div>
  );
}

/**
 * Badge compact pour afficher l'état de conformité
 */
export function DirectiveStatusBadge({
  result,
}: {
  result: DirectiveCheckResult | null;
}) {
  if (!result) {
    return (
      <span
        style={{
          padding: "2px 6px",
          background: "#f5f5f5",
          borderRadius: "4px",
          fontSize: "11px",
          color: "#888",
        }}
      >
        Non vérifié
      </span>
    );
  }

  const formatted = formatCheckResult(result);

  const colors = {
    ok: { bg: "#e8f5e9", text: "#2e7d32" },
    warning: { bg: "#fff3e0", text: "#e65100" },
    violation: { bg: "#ffebee", text: "#c62828" },
  };

  const c = colors[formatted.status];

  return (
    <span
      style={{
        padding: "2px 6px",
        background: c.bg,
        borderRadius: "4px",
        fontSize: "11px",
        color: c.text,
        fontWeight: 500,
      }}
    >
      {formatted.status === "ok" && "✓ Conforme"}
      {formatted.status === "warning" && "⚠ Avertissement"}
      {formatted.status === "violation" && "⛔ Non conforme"}
    </span>
  );
}
