import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { SPHERES } from "../data/spheres";
import { getSphereState, setSphereStatus } from "../state/sphere.store";
import { SphereStatus } from "../types/sphereState";
import { useSessionTracker } from "../hooks/useSessionTracker";
import AgentPanel from "../components/AgentPanel";

export default function SphereView() {
  useSessionTracker();

  const { id } = useParams();
  const navigate = useNavigate();
  const sphere = SPHERES.find((s) => s.id === id);

  const [state, setState] = useState(() => (id ? getSphereState(id) : null));

  if (!sphere || !state) {
    return (
      <main style={{ padding: "24px" }}>
        <p>Sphère introuvable.</p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            marginTop: "16px",
          }}
        >
          ← Retour Tronc
        </button>
      </main>
    );
  }

  const updateStatus = (status: SphereStatus) => {
    setSphereStatus(sphere.id, status);
    setState({ ...state, status });
  };

  return (
    <main style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "8px 16px",
          cursor: "pointer",
          background: "#f5f5f5",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        ← Retour Tronc
      </button>

      <h2 style={{ marginTop: "24px", fontSize: "32px" }}>
        {sphere.emoji} {sphere.name}
      </h2>
      <p style={{ color: "#666", marginTop: "8px" }}>{sphere.description}</p>

      <section
        style={{
          marginTop: "32px",
          padding: "24px",
          background: "#f9f9f9",
          borderRadius: "8px",
          border: "1px solid #eee",
        }}
      >
        <strong>État de la sphère :</strong>
        <p
          style={{
            marginTop: "8px",
            padding: "4px 12px",
            display: "inline-block",
            borderRadius: "4px",
            background:
              state.status === "active"
                ? "#e8f5e9"
                : state.status === "dormant"
                ? "#fff3e0"
                : "#f5f5f5",
            color:
              state.status === "active"
                ? "#2e7d32"
                : state.status === "dormant"
                ? "#e65100"
                : "#666",
          }}
        >
          {state.status}
        </p>

        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
          <button
            onClick={() => updateStatus("active")}
            disabled={state.status === "active"}
            style={{
              padding: "8px 16px",
              cursor: state.status === "active" ? "default" : "pointer",
              opacity: state.status === "active" ? 0.5 : 1,
              background: "#e8f5e9",
              border: "1px solid #a5d6a7",
              borderRadius: "4px",
            }}
          >
            Activer
          </button>
          <button
            onClick={() => updateStatus("dormant")}
            disabled={state.status === "dormant"}
            style={{
              padding: "8px 16px",
              cursor: state.status === "dormant" ? "default" : "pointer",
              opacity: state.status === "dormant" ? 0.5 : 1,
              background: "#fff3e0",
              border: "1px solid #ffcc80",
              borderRadius: "4px",
            }}
          >
            Mettre en sommeil
          </button>
          <button
            onClick={() => updateStatus("archived")}
            disabled={state.status === "archived"}
            style={{
              padding: "8px 16px",
              cursor: state.status === "archived" ? "default" : "pointer",
              opacity: state.status === "archived" ? 0.5 : 1,
              background: "#f5f5f5",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            Archiver
          </button>
        </div>
      </section>

      <AgentPanel />
    </main>
  );
}
