import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SPHERES } from "../data/spheres";
import { getSphereState } from "../state/sphere.store";
import { clearSession } from "../state/sessionStore";
import { SphereRuntime } from "../types/sphereState";
import { useSessionTracker } from "../hooks/useSessionTracker";
import SphereCard from "../components/SphereCard";
import { SilenceToggle } from "../components/SilenceToggle";

export default function UniverseView() {
  useSessionTracker();

  const navigate = useNavigate();
  const [sphereStates, setSphereStates] = useState<Record<string, SphereRuntime>>({});

  useEffect(() => {
    const states: Record<string, SphereRuntime> = {};
    SPHERES.forEach((s) => {
      states[s.id] = getSphereState(s.id);
    });
    setSphereStates(states);
  }, []);

  const handleClearSession = () => {
    clearSession();
  };

  return (
    <main style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <h1>🌳 CHE·NU</h1>
          <SilenceToggle />
        </div>
        <button
          onClick={handleClearSession}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          ⏹️ Arrêter la session
        </button>
      </header>

      <p style={{ color: "#666", marginTop: "8px" }}>Orientation globale. Choisis une sphère.</p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        {SPHERES.map((s) => (
          <SphereCard
            key={s.id}
            sphere={s}
            status={sphereStates[s.id]?.status ?? "active"}
            onOpen={(id) => navigate(`/sphere/${id}`)}
          />
        ))}
      </section>
    </main>
  );
}
