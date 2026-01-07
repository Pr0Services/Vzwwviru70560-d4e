import { DirectiveCheckResult } from "../../types/preApprovedTask";

/**
 * DirectiveAlert
 *
 * Affiche une alerte NON BLOQUANTE si une directive est violée.
 * Message clair, non alarmiste, aucune prise de pouvoir.
 */
type DirectiveAlertProps = {
  result: DirectiveCheckResult | null;
  onDismiss?: () => void;
};

export function DirectiveAlert({ result, onDismiss }: DirectiveAlertProps) {
  if (!result) return null;

  // Si tout est OK, ne rien afficher
  if (result.compliant && result.warnings.length === 0) return null;

  const isViolation = !result.compliant;
  const hasWarnings = result.warnings.length > 0;

  const colors = isViolation
    ? { bg: "#fff8e1", border: "#ffe082", text: "#f57c00", icon: "⚠️" }
    : { bg: "#e3f2fd", border: "#90caf9", text: "#1976d2", icon: "ℹ️" };

  return (
    <div
      style={{
        padding: "12px 16px",
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: "8px",
        marginBottom: "12px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          {/* Main message */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "16px" }}>{colors.icon}</span>
            <span style={{ fontWeight: 500, color: colors.text, fontSize: "14px" }}>
              {isViolation
                ? "Cette action sort du cadre que vous avez défini."
                : "Information concernant le contexte."}
            </span>
          </div>

          {/* Violations */}
          {result.violatedRules.length > 0 && (
            <ul
              style={{
                margin: "8px 0 0 24px",
                padding: 0,
                listStyle: "disc",
                fontSize: "13px",
                color: "#666",
              }}
            >
              {result.violatedRules.map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
          )}

          {/* Warnings */}
          {hasWarnings && (
            <ul
              style={{
                margin: "8px 0 0 24px",
                padding: 0,
                listStyle: "circle",
                fontSize: "12px",
                color: "#888",
              }}
            >
              {result.warnings.map((warning, i) => (
                <li key={i}>{warning}</li>
              ))}
            </ul>
          )}

          {/* Reminder */}
          <div style={{ marginTop: "8px", fontSize: "11px", color: "#888" }}>
            Vous restez responsable de vos actions. Ceci est une information, pas un blocage.
          </div>
        </div>

        {/* Dismiss button */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{
              padding: "4px 8px",
              background: "transparent",
              border: "none",
              fontSize: "18px",
              cursor: "pointer",
              color: "#999",
            }}
            aria-label="Fermer"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
