import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { AppLayout } from "../components/AppLayout";
import { useSessionTracker } from "../hooks/useSessionTracker";
import { useSilence } from "../hooks/useSilence";
import { XR_ROOMS, XR_PARTICIPANTS, XR_TIMELINE } from "../data/xrMockData";
import { XRAvatar, XRAvatar2D } from "../components/xr/XRAvatar";
import { XRTimeline } from "../components/xr/XRTimeline";

function XRScene({ roomId }: { roomId: string }) {
  const participants = XR_PARTICIPANTS[roomId] || [];

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.5, -4]}>
        <boxGeometry args={[10, 4, 0.1]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Side walls */}
      <mesh position={[-5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[8, 4, 0.1]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[8, 4, 0.1]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Avatars */}
      {participants.map((p) => (
        <XRAvatar key={p.id} participant={p} />
      ))}
    </>
  );
}

function XRRoom2D({ roomId }: { roomId: string }) {
  const participants = XR_PARTICIPANTS[roomId] || [];

  return (
    <div
      style={{
        background: "#f0f0f0",
        borderRadius: "8px",
        padding: "24px",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p style={{ color: "#666", marginBottom: "16px" }}>
        Vue 2D (WebGL non disponible)
      </p>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        {participants.map((p) => (
          <XRAvatar2D key={p.id} participant={p} />
        ))}
      </div>
    </div>
  );
}

export default function XRMeetingRoom() {
  useSessionTracker();
  const { id } = useParams();
  const navigate = useNavigate();
  const { silence } = useSilence();
  const [webglSupported, setWebglSupported] = useState(true);

  const room = XR_ROOMS.find((r) => r.id === id);
  const timeline = id ? XR_TIMELINE[id] || [] : [];
  const participants = id ? XR_PARTICIPANTS[id] || [] : [];

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setWebglSupported(!!gl);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (!room || !id) {
    return (
      <AppLayout title="XR Meeting">
        <p>Salle introuvable.</p>
        <button
          onClick={() => navigate("/xr")}
          style={{
            padding: "8px 16px",
            marginTop: "16px",
            background: "#f5f5f5",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Retour aux salles XR
        </button>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`🕶️ ${room.name}`} showBack onBack={() => navigate("/xr")}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "16px" }}>
        {/* Main XR view */}
        <div>
          {/* XR Canvas or 2D Fallback */}
          <div
            style={{
              background: "#e8e8e8",
              borderRadius: "8px",
              overflow: "hidden",
              height: "400px",
            }}
          >
            {webglSupported && !silence.enabled ? (
              <Canvas
                camera={{ position: [0, 2, 6], fov: 50 }}
                style={{ width: "100%", height: "100%" }}
              >
                <XRScene roomId={id} />
              </Canvas>
            ) : (
              <XRRoom2D roomId={id} />
            )}
          </div>

          {/* Room info */}
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              background: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          >
            <p style={{ margin: 0, color: "#666" }}>{room.description}</p>
            <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: "#888" }}>
              👥 {participants.length} participant{participants.length > 1 ? "s" : ""} présent
              {participants.length > 1 ? "s" : ""}
            </p>
          </div>

          {/* Silence mode notice */}
          {silence.enabled && (
            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                background: "#f5f5f5",
                borderRadius: "8px",
                color: "#666",
                fontSize: "13px",
              }}
            >
              🔕 Mode silence — Vue statique uniquement
            </div>
          )}

          {/* Exit button */}
          <button
            onClick={() => navigate("/xr")}
            style={{
              marginTop: "16px",
              padding: "12px 24px",
              background: "#d32f2f",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              width: "100%",
            }}
          >
            🚪 Quitter la salle
          </button>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Participants list */}
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              border: "1px solid #ddd",
              padding: "16px",
            }}
          >
            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#666" }}>
              👥 Participants
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {participants.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: p.color,
                    }}
                  />
                  <span style={{ fontSize: "13px" }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <XRTimeline events={timeline} />
        </div>
      </div>
    </AppLayout>
  );
}
