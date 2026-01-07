import { usePTC } from "../../hooks/usePTC";
import { PreApprovedTaskContext } from "../../types/preApprovedTask";

/**
 * PTCList
 *
 * Affiche tous les contextes de tâche définis.
 * Permet de sélectionner, démarrer ou supprimer.
 */
export function PTCList() {
  const { contexts, activeTask, startTask, remove } = usePTC();

  if (contexts.length === 0) {
    return (
      <div
        style={{
          padding: "16px",
          background: "#f9f9f9",
          borderRadius: "8px",
          fontSize: "13px",
          color: "#888",
          textAlign: "center",
        }}
      >
        Aucun contexte de tâche défini.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {contexts.map((ptc) => (
        <PTCCard
          key={ptc.id}
          ptc={ptc}
          isActive={activeTask?.contextId === ptc.id}
          onStart={() => startTask(ptc.id)}
          onDelete={() => remove(ptc.id)}
        />
      ))}
    </div>
  );
}

function PTCCard({
  ptc,
  isActive,
  onStart,
  onDelete,
}: {
  ptc: PreApprovedTaskContext;
  isActive: boolean;
  onStart: () => void;
  onDelete: () => void;
}) {
  const createdDate = new Date(ptc.createdAt).toLocaleDateString("fr-CA", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        background: isActive ? "#e8f5e9" : "#fff",
        border: `1px solid ${isActive ? "#a5d6a7" : "#ddd"}`,
        borderRadius: "8px",
        padding: "12px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "8px",
        }}
      >
        <div>
          <div style={{ fontWeight: 500, fontSize: "14px", color: "#333" }}>{ptc.intent}</div>
          <div style={{ fontSize: "11px", color: "#888" }}>{createdDate}</div>
        </div>
        {isActive && (
          <span
            style={{
              padding: "2px 8px",
              background: "#4caf50",
              color: "#fff",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: 500,
            }}
          >
            ACTIF
          </span>
        )}
      </div>

      {/* Details */}
      <div style={{ fontSize: "12px", color: "#666", marginBottom: "12px" }}>
        <div>
          <span style={{ color: "#888" }}>Rôles:</span>{" "}
          {ptc.allowedAgentRoles.join(", ") || "aucun"}
        </div>
        {ptc.forbiddenCapabilities.length > 0 && (
          <div>
            <span style={{ color: "#888" }}>Interdit:</span>{" "}
            {ptc.forbiddenCapabilities.join(", ")}
          </div>
        )}
        <div>
          <span style={{ color: "#888" }}>XR:</span>{" "}
          {ptc.xrConstraints.allowed ? ptc.xrConstraints.mode : "désactivé"}
        </div>
        {ptc.notes && (
          <div style={{ marginTop: "4px", fontStyle: "italic" }}>"{ptc.notes}"</div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px" }}>
        {!isActive && (
          <button
            onClick={onStart}
            style={{
              flex: 1,
              padding: "8px",
              background: "#4a90d9",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Démarrer
          </button>
        )}
        <button
          onClick={onDelete}
          disabled={isActive}
          style={{
            padding: "8px 12px",
            background: isActive ? "#f5f5f5" : "#ffebee",
            color: isActive ? "#ccc" : "#c62828",
            border: `1px solid ${isActive ? "#eee" : "#ef9a9a"}`,
            borderRadius: "4px",
            fontSize: "12px",
            cursor: isActive ? "not-allowed" : "pointer",
          }}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
