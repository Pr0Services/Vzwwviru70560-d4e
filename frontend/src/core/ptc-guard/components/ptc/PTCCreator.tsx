import { useState } from "react";
import { AgentRole, ForbiddenCapability } from "../../types/preApprovedTask";
import { usePTC } from "../../hooks/usePTC";

/**
 * PTCCreator
 *
 * Permet à l'utilisateur de définir explicitement un cadre de tâche.
 * Aucune supposition, tout est explicite.
 */
export function PTCCreator({ onCreated }: { onCreated?: () => void }) {
  const { create, startTask } = usePTC();

  const [intent, setIntent] = useState("");
  const [notes, setNotes] = useState("");
  const [allowedRoles, setAllowedRoles] = useState<AgentRole[]>(["analysis"]);
  const [forbiddenCaps, setForbiddenCaps] = useState<ForbiddenCapability[]>(["auto-action"]);
  const [personalData, setPersonalData] = useState(false);
  const [crossSphere, setCrossSphere] = useState(false);
  const [xrAllowed, setXrAllowed] = useState(true);
  const [xrMode, setXrMode] = useState<"read-only" | "disabled">("read-only");
  const [autoStart, setAutoStart] = useState(true);

  const allRoles: AgentRole[] = ["analysis", "methodology", "comparison", "presentation"];
  const allCaps: ForbiddenCapability[] = ["decision", "recommendation", "evaluation", "auto-action"];

  const toggleRole = (role: AgentRole) => {
    setAllowedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const toggleCap = (cap: ForbiddenCapability) => {
    setForbiddenCaps((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
    );
  };

  const handleCreate = () => {
    if (!intent.trim()) return;

    const ptc = create({
      intent: intent.trim(),
      allowedAgentRoles: allowedRoles,
      forbiddenCapabilities: forbiddenCaps,
      dataConstraints: {
        personalDataAllowed: personalData,
        crossSphereAccessAllowed: crossSphere,
      },
      xrConstraints: {
        allowed: xrAllowed,
        mode: xrMode,
      },
      notes: notes.trim() || undefined,
    });

    if (autoStart) {
      startTask(ptc.id);
    }

    // Reset form
    setIntent("");
    setNotes("");
    setAllowedRoles(["analysis"]);
    setForbiddenCaps(["auto-action"]);
    setPersonalData(false);
    setCrossSphere(false);
    setXrAllowed(true);
    setXrMode("read-only");

    onCreated?.();
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid #ddd",
        padding: "16px",
      }}
    >
      <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#333" }}>
        📋 Définir un nouveau contexte de tâche
      </h4>

      {/* Intent */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", color: "#666" }}>
          Intention de la tâche *
        </label>
        <input
          type="text"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          placeholder="ex: analyse, exploration, documentation..."
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        />
      </div>

      {/* Allowed Roles */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#666" }}>
          Rôles d'agent autorisés
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {allRoles.map((role) => (
            <button
              key={role}
              onClick={() => toggleRole(role)}
              style={{
                padding: "6px 12px",
                background: allowedRoles.includes(role) ? "#e8f5e9" : "#f5f5f5",
                border: `1px solid ${allowedRoles.includes(role) ? "#a5d6a7" : "#ddd"}`,
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
                color: allowedRoles.includes(role) ? "#2e7d32" : "#666",
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Forbidden Capabilities */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#666" }}>
          Capacités interdites
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {allCaps.map((cap) => (
            <button
              key={cap}
              onClick={() => toggleCap(cap)}
              style={{
                padding: "6px 12px",
                background: forbiddenCaps.includes(cap) ? "#ffebee" : "#f5f5f5",
                border: `1px solid ${forbiddenCaps.includes(cap) ? "#ef9a9a" : "#ddd"}`,
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
                color: forbiddenCaps.includes(cap) ? "#c62828" : "#666",
              }}
            >
              {cap}
            </button>
          ))}
        </div>
      </div>

      {/* Data Constraints */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#666" }}>
          Contraintes de données
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
            <input
              type="checkbox"
              checked={personalData}
              onChange={(e) => setPersonalData(e.target.checked)}
            />
            Autoriser l'accès aux données personnelles
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
            <input
              type="checkbox"
              checked={crossSphere}
              onChange={(e) => setCrossSphere(e.target.checked)}
            />
            Autoriser l'accès inter-sphères
          </label>
        </div>
      </div>

      {/* XR Constraints */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#666" }}>
          Contraintes XR
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
            <input
              type="checkbox"
              checked={xrAllowed}
              onChange={(e) => setXrAllowed(e.target.checked)}
            />
            Autoriser l'accès XR
          </label>
          {xrAllowed && (
            <select
              value={xrMode}
              onChange={(e) => setXrMode(e.target.value as "read-only" | "disabled")}
              style={{
                padding: "6px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "13px",
              }}
            >
              <option value="read-only">Lecture seule</option>
              <option value="disabled">Désactivé</option>
            </select>
          )}
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", color: "#666" }}>
          Notes (optionnel)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Rappels ou précisions sur le contexte..."
          rows={2}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "13px",
            resize: "vertical",
          }}
        />
      </div>

      {/* Auto-start option */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
          <input
            type="checkbox"
            checked={autoStart}
            onChange={(e) => setAutoStart(e.target.checked)}
          />
          Démarrer immédiatement la tâche avec ce contexte
        </label>
      </div>

      {/* Create button */}
      <button
        onClick={handleCreate}
        disabled={!intent.trim()}
        style={{
          width: "100%",
          padding: "12px",
          background: intent.trim() ? "#333" : "#ccc",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          fontSize: "14px",
          cursor: intent.trim() ? "pointer" : "not-allowed",
        }}
      >
        Créer le contexte
      </button>
    </div>
  );
}
