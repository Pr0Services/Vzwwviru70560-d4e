// ============================================
// CHE·NU — AGENT PANEL (HARDENED)
// ============================================
// Les agents ne décident jamais.
// Toute délégation est volontaire.
// Toute chaîne passe par l'utilisateur.
// Silence > Agent.
// Replay = lecture seule.
// ============================================

import { useState } from "react";
import { useSilence } from "../hooks/useSilence";
import { AgentRegistry, getAgentById } from "../agents/AgentRegistry";
import { canCallAgent } from "../agents/agentGuards";
import { traceAgentCall } from "../state/agentCallStore";
import { AgentDefinition, AgentInputSource } from "../types/agent";

type AgentPanelProps = {
  context?: "live" | "replay";
  previousAgentOutput?: string | null;
};

export default function AgentPanel({
  context = "live",
  previousAgentOutput = null,
}: AgentPanelProps) {
  const { silence } = useSilence();
  const [selectedAgentId, setSelectedAgentId] = useState<string>(AgentRegistry[0]?.id || "");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [inputSource, setInputSource] = useState<AgentInputSource>("user");
  const [loading, setLoading] = useState(false);

  const selectedAgent = getAgentById(selectedAgentId);

  // Silence > Agent — PRIORITÉ ABSOLUE
  if (silence.enabled) {
    return (
      <section style={{ marginTop: "24px", borderTop: "1px solid #ddd", paddingTop: "16px" }}>
        <p style={{ color: "#888" }}>🔕 Mode silence actif — aucun agent disponible.</p>
        <p style={{ color: "#aaa", fontSize: "12px", marginTop: "8px" }}>
          Silence {">"} Agent. Désactivez le mode silence pour utiliser les agents.
        </p>
      </section>
    );
  }

  // Vérifier si l'agent peut être appelé
  const callCheck = canCallAgent(selectedAgentId, context);

  // Utiliser la sortie précédente comme input
  const usePreviousOutput = () => {
    if (previousAgentOutput) {
      setInput(previousAgentOutput);
      setInputSource("agent-output");
    }
  };

  // Réinitialiser à input utilisateur
  const useUserInput = () => {
    setInput("");
    setInputSource("user");
  };

  // Appeler l'agent (toujours manuel, jamais automatique)
  const submit = async () => {
    if (!input.trim() || !selectedAgent) return;

    setLoading(true);

    // Tracer l'appel — toujours calledBy: "user"
    traceAgentCall({
      agentId: selectedAgentId,
      context,
      inputSource,
      inputPreview: input,
    });

    // Simulation d'appel agent (mock)
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Output structuré selon le rôle
    const mockOutput = generateMockOutput(selectedAgent, input);
    setOutput(mockOutput);
    
    setLoading(false);
  };

  return (
    <section style={{ marginTop: "24px", borderTop: "1px solid #ddd", paddingTop: "16px" }}>
      {/* En-tête avec sélection d'agent */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
          🤖 Sélectionner un agent
        </label>
        <select
          value={selectedAgentId}
          onChange={(e) => {
            setSelectedAgentId(e.target.value);
            setOutput(null);
          }}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
            background: "#fff",
          }}
        >
          {AgentRegistry.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name} ({agent.role})
            </option>
          ))}
        </select>
      </div>

      {/* Informations sur l'agent sélectionné */}
      {selectedAgent && (
        <AgentInfoCard agent={selectedAgent} />
      )}

      {/* AVERTISSEMENT CLAIR */}
      <div
        style={{
          margin: "16px 0",
          padding: "12px",
          background: "#fff3e0",
          border: "1px solid #ffcc80",
          borderRadius: "4px",
        }}
      >
        <p style={{ margin: 0, fontWeight: 500, color: "#e65100", fontSize: "13px" }}>
          ⚠️ Cet agent ne prend aucune décision.
        </p>
        <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: "12px" }}>
          L'agent est un outil. Vous restez le seul décideur.
        </p>
      </div>

      {/* Source de l'input */}
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#666" }}>
          Origine de l'input:
        </label>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={useUserInput}
            style={{
              padding: "6px 12px",
              background: inputSource === "user" ? "#4a90d9" : "#f5f5f5",
              color: inputSource === "user" ? "#fff" : "#333",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            👤 Fourni par l'utilisateur
          </button>
          {previousAgentOutput && (
            <button
              onClick={usePreviousOutput}
              style={{
                padding: "6px 12px",
                background: inputSource === "agent-output" ? "#7cb342" : "#f5f5f5",
                color: inputSource === "agent-output" ? "#fff" : "#333",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              🔗 Issu d'un agent précédent
            </button>
          )}
        </div>
      </div>

      {/* Zone d'input */}
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#666" }}>
          Input EXACT transmis à l'agent:
        </label>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (inputSource === "agent-output") {
              setInputSource("user"); // Si modifié, devient input utilisateur
            }
          }}
          rows={4}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
            fontFamily: "monospace",
            resize: "vertical",
            background: "#fafafa",
          }}
          placeholder="Écrivez votre instruction ici..."
        />
      </div>

      {/* Bouton d'appel */}
      {callCheck.allowed ? (
        <button
          onClick={submit}
          disabled={loading || !input.trim()}
          style={{
            padding: "12px 24px",
            background: loading || !input.trim() ? "#ccc" : "#333",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: loading || !input.trim() ? "default" : "pointer",
            fontSize: "14px",
            width: "100%",
          }}
        >
          {loading ? "Traitement..." : "Appeler l'agent (action volontaire)"}
        </button>
      ) : (
        <div
          style={{
            padding: "12px",
            background: "#f5f5f5",
            borderRadius: "4px",
            color: "#666",
            fontSize: "13px",
          }}
        >
          ❌ {callCheck.reason}
        </div>
      )}

      {/* Output de l'agent */}
      {output && (
        <div style={{ marginTop: "16px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#666" }}>
            Sortie de l'agent (brute, sans interprétation):
          </label>
          <pre
            style={{
              padding: "12px",
              background: "#f7f7f7",
              border: "1px solid #eee",
              borderRadius: "4px",
              whiteSpace: "pre-wrap",
              fontSize: "13px",
              overflow: "auto",
              maxHeight: "300px",
            }}
          >
            {output}
          </pre>
          <p style={{ marginTop: "8px", fontSize: "11px", color: "#888" }}>
            Cette sortie est brute. C'est à vous de décider quoi en faire.
          </p>
        </div>
      )}
    </section>
  );
}

// Composant d'information sur l'agent
function AgentInfoCard({ agent }: { agent: AgentDefinition }) {
  return (
    <div
      style={{
        padding: "12px",
        background: "#f9f9f9",
        border: "1px solid #eee",
        borderRadius: "4px",
        fontSize: "12px",
      }}
    >
      <div style={{ marginBottom: "8px" }}>
        <strong>{agent.name}</strong>
        <span
          style={{
            marginLeft: "8px",
            padding: "2px 8px",
            background: "#e3f2fd",
            borderRadius: "4px",
            fontSize: "11px",
          }}
        >
          {agent.role}
        </span>
      </div>
      <p style={{ margin: "0 0 8px 0", color: "#666" }}>{agent.description}</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <div>
          <strong style={{ color: "#2e7d32" }}>✓ Fait:</strong>
          <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "#666" }}>
            {agent.does.slice(0, 3).map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong style={{ color: "#c62828" }}>✗ Ne fait JAMAIS:</strong>
          <ul style={{ margin: "4px 0 0 16px", padding: 0, color: "#666" }}>
            {agent.neverDoes.slice(0, 3).map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Mock output generator (simulation)
function generateMockOutput(agent: AgentDefinition, input: string): string {
  const timestamp = new Date().toISOString();
  
  switch (agent.role) {
    case "analysis":
      return `[ANALYSE - ${timestamp}]
Input reçu: "${input.slice(0, 100)}${input.length > 100 ? "..." : ""}"

Structure identifiée:
- Élément 1: (description factuelle)
- Élément 2: (description factuelle)
- Élément 3: (description factuelle)

Aucune interprétation fournie.
Aucune recommandation donnée.
Décision: À VOUS.`;

    case "methodology":
      return `[MÉTHODOLOGIES - ${timestamp}]
Objectif analysé: "${input.slice(0, 100)}${input.length > 100 ? "..." : ""}"

Méthodologies possibles (sans ordre de préférence):

1. Approche A
   - Description factuelle

2. Approche B
   - Description factuelle

3. Approche C
   - Description factuelle

Aucun classement fourni.
Aucune recommandation donnée.
Choix: À VOUS.`;

    case "comparison":
      return `[COMPARAISON - ${timestamp}]
Éléments comparés: "${input.slice(0, 100)}${input.length > 100 ? "..." : ""}"

| Critère | Option A | Option B |
|---------|----------|----------|
| ...     | ...      | ...      |

Aucun jugement de valeur.
Aucune préférence indiquée.
Décision: À VOUS.`;

    case "presentation":
      return `[PRÉSENTATION - ${timestamp}]
Contenu formaté:

---
${input}
---

Mise en forme sans modification du sens.
Aucune interprétation ajoutée.`;

    default:
      return `[OUTPUT - ${timestamp}]\n${input}`;
  }
}
