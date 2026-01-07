import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { AppLayout } from "../components/AppLayout";
import { useSessionTracker } from "../hooks/useSessionTracker";
import { useSilence } from "../hooks/useSilence";
import { useXRReplay } from "../hooks/useXRReplay";
import {
  XR_ROOMS,
  XR_PARTICIPANTS,
  XR_TIMELINE,
  XR_DECISIONS,
  XR_DECISION_BRANCHES,
} from "../data/xrMockData";
import { XRAvatar, XRAvatar2D } from "../components/xr/XRAvatar";
import { XRMeetingTimeline } from "../components/xr/XRMeetingTimeline";
import { XRTimeScrubber } from "../components/xr/XRTimeScrubber";
import { XRReplayBadge } from "../components/xr/XRReplayBadge";
import { XRDecisionTracks } from "../components/xr/XRDecisionTracks";
import { XRDecisionFocus } from "../components/xr/XRDecisionFocus";
import { XRComparisonOverlay } from "../components/xr/XRComparisonOverlay";
import { XRDecision } from "../types/xr";

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
  const { isReplay, currentEventIndex, enterReplay, exitReplay, setEventIndex } = useXRReplay(id);
  const [webglSupported, setWebglSupported] = useState(true);

  // Decision comparison state
  const [comparisonMode, setComparisonMode] = useState(false);
  const [focusedDecision, setFocusedDecision] = useState<XRDecision | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const room = XR_ROOMS.find((r) => r.id === id);
  const timeline = id ? XR_TIMELINE[id] || [] : [];
  const participants = id ? XR_PARTICIPANTS[id] || [] : [];
  const decisions = id ? XR_DECISIONS[id] || [] : [];

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

  // Reset replay when leaving
  useEffect(() => {
    return () => {
      if (isReplay) {
        exitReplay();
      }
    };
  }, [isReplay, exitReplay]);

  // Exit comparison mode handler
  const exitComparisonMode = () => {
    setComparisonMode(false);
    setFocusedDecision(null);
    setOverlayOpen(false);
  };

  // Enter comparison mode (exit replay if active)
  const enterComparisonMode = () => {
    if (isReplay) {
      exitReplay();
    }
    setComparisonMode(true);
  };

  // Handle decision selection
  const handleDecisionSelect = (decision: XRDecision) => {
    setFocusedDecision(decision);
  };

  // Get branch for focused decision
  const focusedBranch = focusedDecision
    ? XR_DECISION_BRANCHES.find((b) => b.id === focusedDecision.branchId) || null
    : null;

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
      {/* Comparison Overlay */}
      <XRComparisonOverlay
        isOpen={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        decisions={decisions}
        branches={XR_DECISION_BRANCHES}
        silenceMode={silence.enabled}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "16px" }}>
        {/* Main XR view */}
        <div>
          {/* Comparison mode banner */}
          {comparisonMode && (
            <div
              style={{
                padding: "12px 16px",
                background: "#e8eaf6",
                border: "1px solid #9fa8da",
                borderRadius: "8px",
                marginBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "14px", color: "#3f51b5" }}>
                📊 Mode comparaison — lecture seule
              </span>
              <button
                onClick={exitComparisonMode}
                style={{
                  padding: "6px 12px",
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Quitter comparaison
              </button>
            </div>
          )}

          {/* XR Canvas or 2D Fallback */}
          <div
            style={{
              background: "#e8e8e8",
              borderRadius: "8px",
              overflow: "hidden",
              height: comparisonMode ? "250px" : "400px",
              position: "relative",
            }}
          >
            {/* Replay Badge */}
            <XRReplayBadge visible={isReplay} />

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

          {/* Decision Tracks (when in comparison mode) */}
          {comparisonMode && decisions.length > 0 && (
            <div style={{ marginTop: "12px" }}>
              <XRDecisionTracks
                decisions={decisions}
                branches={XR_DECISION_BRANCHES}
                focusedDecisionId={focusedDecision?.id || null}
                onDecisionSelect={handleDecisionSelect}
                silenceMode={silence.enabled}
              />

              {/* Full comparison button */}
              <button
                onClick={() => setOverlayOpen(true)}
                style={{
                  marginTop: "12px",
                  padding: "10px 20px",
                  background: "#5c6bc0",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  width: "100%",
                }}
              >
                📊 Vue comparaison complète
              </button>

              {/* Decision Focus */}
              <XRDecisionFocus
                decision={focusedDecision}
                branch={focusedBranch}
                onClose={() => setFocusedDecision(null)}
              />
            </div>
          )}

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

          {/* Mode notices */}
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

          {isReplay && !comparisonMode && (
            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                background: "#fff3e0",
                borderRadius: "8px",
                color: "#e65100",
                fontSize: "13px",
              }}
            >
              ⏪ Mode Replay — Lecture seule, aucune modification possible
            </div>
          )}

          {/* Action buttons */}
          <div style={{ marginTop: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {/* Replay controls */}
            {!comparisonMode && (
              <>
                {!isReplay ? (
                  <button
                    onClick={enterReplay}
                    style={{
                      padding: "12px 24px",
                      background: "#4a90d9",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    ⏪ Entrer en Replay
                  </button>
                ) : (
                  <button
                    onClick={exitReplay}
                    style={{
                      padding: "12px 24px",
                      background: "#7cb342",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    ▶️ Retour Live
                  </button>
                )}
              </>
            )}

            {/* Compare decisions button */}
            {!comparisonMode && !isReplay && decisions.length > 0 && (
              <button
                onClick={enterComparisonMode}
                style={{
                  padding: "12px 24px",
                  background: "#5c6bc0",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                📊 Comparer décisions
              </button>
            )}

            {/* Exit room button - always visible */}
            <button
              onClick={() => navigate("/xr")}
              style={{
                padding: "12px 24px",
                background: "#d32f2f",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                marginLeft: "auto",
              }}
            >
              🚪 Quitter la salle
            </button>
          </div>
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

          {/* Time Scrubber - only in Replay mode */}
          {isReplay && !comparisonMode && (
            <XRTimeScrubber
              events={timeline}
              currentIndex={currentEventIndex}
              onIndexChange={setEventIndex}
              disabled={silence.enabled}
            />
          )}

          {/* Timeline */}
          <XRMeetingTimeline
            events={timeline}
            currentIndex={currentEventIndex}
            isReplay={isReplay && !comparisonMode}
          />
        </div>
      </div>
    </AppLayout>
  );
}
