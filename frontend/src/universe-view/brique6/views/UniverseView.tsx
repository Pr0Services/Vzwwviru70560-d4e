import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { SPHERES } from "../data/spheres";
import { getSphereState } from "../state/sphere.store";
import { clearSession } from "../state/sessionStore";
import { SphereRuntime } from "../types/sphereState";
import { useSessionTracker } from "../hooks/useSessionTracker";
import { AppLayout } from "../components/AppLayout";
import SphereCard from "../components/SphereCard";

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

  return (
    <AppLayout title="🌳 CHE·NU — Universe View">
      <p style={{ color: "#666", marginBottom: "24px" }}>
        Orientation globale. Choisis une sphère pour travailler dans un contexte précis.
      </p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
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

      <section style={{ marginTop: "24px", borderTop: "1px solid #ddd", paddingTop: "12px" }}>
        <button
          onClick={clearSession}
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
      </section>
    </AppLayout>
  );
}
