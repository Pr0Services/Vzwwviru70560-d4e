import { usePTC } from "../../hooks/usePTC";

/**
 * PTCStatusBar
 *
 * Affiche toujours:
 * - Contexte actif (résumé)
 * - Dernier résultat de vérification
 *
 * Non bloquant, non alarmiste.
 * Transparence totale.
 */
export function PTCStatusBar() {
  const { hasActiveTask, activePTC, getActiveSummary, getCheckStatus, endTask } = usePTC();

  if (!hasActiveTask || !activePTC) {
    return (
      <div
        style={{
          padding: "8px 12px",
          background: "#f5f5f5",
          borderRadius: "4px",
          fontSize: "12px",
          color: "#888",
        }}
      >
        📋 Aucun contexte de tâche actif
      </div>
    );
  }

  const summary = getActiveSummary();
  const checkStatus = getCheckStatus();

  const statusColors = {
    ok: { bg: "#e8f5e9", border: "#a5d6a7", text: "#2e7d32", icon: "✓" },
    warning: { bg: "#fff3e0", border: "#ffcc80", text: "#e65100", icon: "⚠️" },
    violation: { bg: "#ffebee", border: "#ef9a9a", text: "#c62828", icon: "⚠️" },
  };

  const colors = checkStatus ? statusColors[checkStatus.status] : statusColors.ok;

  return (
    <div
      style={{
        padding: "12px",
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "13px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <span style={{ fontWeight: 500, color: "#333" }}>📋 Contexte actif</span>
        <button
          onClick={endTask}
          style={{
            padding: "4px 8px",
            background: "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "11px",
            cursor: "pointer",
          }}
        >
          Terminer
        </button>
      </div>

      {/* Intent */}
      <div style={{ marginBottom: "8px" }}>
        <span style={{ color: "#666" }}>Intention: </span>
        <span style={{ fontWeight: 500 }}>{activePTC.intent}</span>
      </div>

      {/* Summary */}
      <div
        style={{
          padding: "8px",
          background: "#f9f9f9",
          borderRadius: "4px",
          fontSize: "11px",
          color: "#666",
          marginBottom: "8px",
        }}
      >
        {summary}
      </div>

      {/* Check Status */}
      {checkStatus && (
        <div
          style={{
            padding: "8px",
            background: colors.bg,
            border: `1px solid ${colors.border}`,
            borderRadius: "4px",
            fontSize: "12px",
            color: colors.text,
          }}
        >
          <span style={{ marginRight: "6px" }}>{colors.icon}</span>
          {checkStatus.message}
        </div>
      )}

      {/* Directives list */}
      <div style={{ marginTop: "8px" }}>
        <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>
          Directives actives:
        </div>
        <ul
          style={{
            margin: 0,
            paddingLeft: "16px",
            fontSize: "11px",
            color: "#666",
          }}
        >
          <li>Rôles: {activePTC.allowedAgentRoles.join(", ") || "aucun"}</li>
          {activePTC.forbiddenCapabilities.length > 0 && (
            <li>Interdit: {activePTC.forbiddenCapabilities.join(", ")}</li>
          )}
          <li>
            XR: {activePTC.xrConstraints.allowed ? activePTC.xrConstraints.mode : "désactivé"}
          </li>
          <li>Données perso: {activePTC.dataConstraints.personalDataAllowed ? "oui" : "non"}</li>
          <li>
            Inter-sphères: {activePTC.dataConstraints.crossSphereAccessAllowed ? "oui" : "non"}
          </li>
        </ul>
      </div>
    </div>
  );
}
