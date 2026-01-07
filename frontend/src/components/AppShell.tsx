// chenu/AppShell.tsx
/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU — CANONICAL BUREAU STRUCTURE                             ║
 * ║                                                                              ║
 * ║  RULE: Do NOT skip hierarchy levels invisibly.                               ║
 * ║                                                                              ║
 * ║  TWO DISTINCT BUREAUX:                                                       ║
 * ║    1) Context Bureau — Shows context, allows preselection, always visible    ║
 * ║    2) Action Bureau  — Entry point for work, shortcuts to workspaces         ║
 * ║                                                                              ║
 * ║  FLOW: Context Bureau → Action Bureau → Workspace                            ║
 * ║                                                                              ║
 * ║  Intelligence PRE-FILLS the Context Bureau, it does NOT bypass it.           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useMemo } from "react";
import { useMachine } from "@xstate/react";
import { navMachine, Hub, ID, SphereKey, SPHERE_CONFIG, NavContext } from "./navMachine";

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  shell: {
    display: "grid",
    gridTemplateColumns: "280px 1fr 320px",
    gridTemplateRows: "auto 1fr",
    gap: 16,
    padding: 16,
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#e0e0e0",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  hubContainer: {
    border: "1px solid #2a2a2a",
    borderRadius: 12,
    padding: 16,
    background: "#111",
  },
  hubTitle: {
    fontWeight: 700,
    fontSize: 14,
    marginBottom: 12,
    color: "#888",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  diamond: {
    background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
    border: "1px solid #333",
    borderRadius: 16,
    padding: 20,
    textAlign: "center" as const,
  },
  contextBureau: {
    border: "1px solid #2a2a2a",
    borderRadius: 12,
    padding: 16,
    background: "#0f0f0f",
  },
  actionBureau: {
    border: "1px solid #2a2a2a",
    borderRadius: 12,
    padding: 16,
    background: "#0f0f0f",
  },
  contextRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    marginBottom: 8,
    background: "#1a1a1a",
    borderRadius: 8,
    border: "1px solid #222",
  },
  contextLabel: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase" as const,
  },
  contextValue: {
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
  },
  prefilledBadge: {
    fontSize: 10,
    padding: "2px 6px",
    borderRadius: 4,
    background: "#3EB4A2",
    color: "#000",
    marginLeft: 8,
  },
  editButton: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 4,
    background: "transparent",
    border: "1px solid #444",
    color: "#888",
    cursor: "pointer",
  },
  actionButton: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "12px 14px",
    marginBottom: 8,
    background: "#1a1a1a",
    border: "1px solid #222",
    borderRadius: 8,
    color: "#e0e0e0",
    cursor: "pointer",
    textAlign: "left" as const,
    transition: "all 0.15s ease",
  },
  workspaceCard: {
    padding: "14px",
    marginBottom: 10,
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: 10,
    cursor: "pointer",
  },
};

// ============================================================================
// COMPONENTS
// ============================================================================

interface HubContainerProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

function HubContainer({ title, icon, children, style }: HubContainerProps) {
  return (
    <div style={{ ...styles.hubContainer, ...style }}>
      <div style={styles.hubTitle}>
        {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
        {title}
      </div>
      {children}
    </div>
  );
}

// ============================================================================
// DIAMOND HUB (Center - Always Visible)
// ============================================================================

interface DiamondHubProps {
  ctx: NavContext;
  onToggleHub: (hub: Hub) => void;
}

function DiamondHub({ ctx, onToggleHub }: DiamondHubProps) {
  return (
    <div style={styles.diamond}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>◆</div>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
        {ctx.diamond.contextLabel}
      </div>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>
        CHE·NU Governed Intelligence
      </div>

      {/* Status indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 16 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#3EB4A2" }}>
            {ctx.diamond.alertsCount}
          </div>
          <div style={{ fontSize: 10, color: "#666" }}>Alerts</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#5BA9FF" }}>
            {ctx.diamond.meetingsCount}
          </div>
          <div style={{ fontSize: 10, color: "#666" }}>Meetings</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#FFB04D" }}>
            {ctx.diamond.tasksDueCount}
          </div>
          <div style={{ fontSize: 10, color: "#666" }}>Tasks Due</div>
        </div>
      </div>

      {/* Hub toggles */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
        {(["communication", "navigation", "workspace"] as Hub[]).map((hub) => (
          <button
            key={hub}
            onClick={() => onToggleHub(hub)}
            style={{
              padding: "6px 12px",
              fontSize: 11,
              borderRadius: 6,
              border: "1px solid #333",
              background: ctx.visibleHubs.includes(hub) ? "#333" : "transparent",
              color: ctx.visibleHubs.includes(hub) ? "#fff" : "#666",
              cursor: "pointer",
            }}
          >
            {hub.charAt(0).toUpperCase() + hub.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 12, fontSize: 10, color: "#444" }}>
        Max 2 hubs visible • Governance enforced
      </div>
    </div>
  );
}

// ============================================================================
// CONTEXT BUREAU (Always Visible - Shows Hierarchy)
// ============================================================================

interface ContextBureauProps {
  ctx: NavContext;
  onSelectIdentity: (id: ID) => void;
  onSelectSphere: (id: ID) => void;
  onSelectProject: (id: ID) => void;
  onClearLevel: (level: "identity" | "sphere" | "project") => void;
}

function ContextBureau({
  ctx,
  onSelectIdentity,
  onSelectSphere,
  onSelectProject,
  onClearLevel,
}: ContextBureauProps) {
  const { sel, data, skipped } = ctx;

  // Get current selections
  const currentIdentity = sel.identityId
    ? data.identities.find((i) => i.id === sel.identityId)
    : null;

  const availableSpheres = sel.identityId
    ? data.spheresByIdentity[sel.identityId] ?? []
    : [];

  const currentSphere = sel.sphereId
    ? availableSpheres.find((s) => s.id === sel.sphereId)
    : null;

  const keyIS = sel.identityId && sel.sphereId
    ? `${sel.identityId}:${sel.sphereId}`
    : null;

  const availableProjects = keyIS
    ? data.projectsByIdentitySphere[keyIS] ?? []
    : [];

  const currentProject = sel.projectId
    ? availableProjects.find((p) => p.id === sel.projectId)
    : null;

  const isPrefilledIdentity = skipped.includes("identity");
  const isPrefilledSphere = skipped.includes("sphere");
  const isPrefilledProject = skipped.includes("project");

  return (
    <div style={styles.contextBureau}>
      <div style={styles.hubTitle}>📍 Context Bureau</div>
      <div style={{ fontSize: 11, color: "#555", marginBottom: 16 }}>
        Intelligence pre-fills, you confirm
      </div>

      {/* IDENTITY ROW */}
      <div style={styles.contextRow}>
        <div>
          <div style={styles.contextLabel}>Identity</div>
          <div style={styles.contextValue}>
            {currentIdentity ? (
              <>
                {currentIdentity.type === "personal" ? "🏠" : currentIdentity.type === "business" ? "💼" : "🏛️"}
                {" "}{currentIdentity.name}
                {isPrefilledIdentity && <span style={styles.prefilledBadge}>Auto</span>}
              </>
            ) : (
              <span style={{ color: "#666" }}>Select identity...</span>
            )}
          </div>
        </div>
        {currentIdentity && (
          <button style={styles.editButton} onClick={() => onClearLevel("identity")}>
            Change
          </button>
        )}
      </div>

      {/* Identity selector dropdown (if not selected) */}
      {!currentIdentity && data.identities.length > 0 && (
        <div style={{ marginBottom: 12, paddingLeft: 12 }}>
          {data.identities.map((identity) => (
            <button
              key={identity.id}
              onClick={() => onSelectIdentity(identity.id)}
              style={{
                ...styles.actionButton,
                marginBottom: 4,
                padding: "8px 12px",
              }}
            >
              {identity.type === "personal" ? "🏠" : identity.type === "business" ? "💼" : "🏛️"}
              <span>{identity.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* SPHERE ROW */}
      {sel.identityId && (
        <div style={styles.contextRow}>
          <div>
            <div style={styles.contextLabel}>Sphere</div>
            <div style={styles.contextValue}>
              {currentSphere ? (
                <>
                  {SPHERE_CONFIG[currentSphere.key as SphereKey]?.emoji ?? "◯"}
                  {" "}{currentSphere.label}
                  {isPrefilledSphere && <span style={styles.prefilledBadge}>Auto</span>}
                </>
              ) : (
                <span style={{ color: "#666" }}>Select sphere...</span>
              )}
            </div>
          </div>
          {currentSphere && (
            <button style={styles.editButton} onClick={() => onClearLevel("sphere")}>
              Change
            </button>
          )}
        </div>
      )}

      {/* Sphere selector (if identity selected but no sphere) */}
      {sel.identityId && !currentSphere && availableSpheres.length > 0 && (
        <div style={{ marginBottom: 12, paddingLeft: 12 }}>
          {availableSpheres.map((sphere) => {
            const config = SPHERE_CONFIG[sphere.key as SphereKey];
            return (
              <button
                key={sphere.id}
                onClick={() => onSelectSphere(sphere.id)}
                style={{
                  ...styles.actionButton,
                  marginBottom: 4,
                  padding: "8px 12px",
                  borderLeft: `3px solid ${config?.color ?? "#666"}`,
                }}
              >
                {config?.emoji ?? "◯"}
                <span>{sphere.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* PROJECT ROW (Optional) */}
      {sel.sphereId && availableProjects.length > 0 && (
        <div style={styles.contextRow}>
          <div>
            <div style={styles.contextLabel}>Project (Optional)</div>
            <div style={styles.contextValue}>
              {currentProject ? (
                <>
                  📁 {currentProject.name}
                  {isPrefilledProject && <span style={styles.prefilledBadge}>Auto</span>}
                </>
              ) : (
                <span style={{ color: "#666" }}>All projects</span>
              )}
            </div>
          </div>
          {currentProject && (
            <button style={styles.editButton} onClick={() => onClearLevel("project")}>
              Clear
            </button>
          )}
        </div>
      )}

      {/* Project selector */}
      {sel.sphereId && !currentProject && availableProjects.length > 1 && (
        <div style={{ marginBottom: 12, paddingLeft: 12 }}>
          {availableProjects.slice(0, 5).map((project) => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              style={{
                ...styles.actionButton,
                marginBottom: 4,
                padding: "8px 12px",
              }}
            >
              📁 <span>{project.name}</span>
            </button>
          ))}
          {availableProjects.length > 5 && (
            <div style={{ fontSize: 11, color: "#555", paddingLeft: 12 }}>
              +{availableProjects.length - 5} more projects
            </div>
          )}
        </div>
      )}

      {/* Context complete indicator */}
      {sel.sphereId && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 12px",
            background: "#0d2818",
            border: "1px solid #1a4d2e",
            borderRadius: 8,
            fontSize: 12,
            color: "#3EB4A2",
          }}
        >
          ✓ Context ready — proceed to Action Bureau
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ACTION BUREAU (Entry Point for Work)
// ============================================================================

interface ActionBureauProps {
  ctx: NavContext;
  onOpenWorkspace: (id: ID) => void;
}

function ActionBureau({ ctx, onOpenWorkspace }: ActionBureauProps) {
  const { sel, data } = ctx;

  const keyIS = sel.identityId && sel.sphereId
    ? `${sel.identityId}:${sel.sphereId}`
    : null;

  const workspaces = keyIS
    ? data.workspacesByIdentitySphere[keyIS] ?? []
    : [];

  const pinnedWorkspaces = workspaces.filter((w) => w.pinned);
  const recentWorkspaces = workspaces
    .filter((w) => !w.pinned && w.lastOpenedAt)
    .sort((a, b) => (b.lastOpenedAt ?? 0) - (a.lastOpenedAt ?? 0))
    .slice(0, 3);

  const isContextReady = !!sel.sphereId;

  return (
    <div style={styles.actionBureau}>
      <div style={styles.hubTitle}>⚡ Action Bureau</div>

      {!isContextReady ? (
        <div style={{ color: "#555", fontSize: 13, padding: "20px 0", textAlign: "center" }}>
          Select context first (Identity → Sphere)
        </div>
      ) : (
        <>
          {/* Quick Actions */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>Quick Actions</div>
            <button style={styles.actionButton}>
              ➕ <span>New Workspace</span>
            </button>
            <button style={styles.actionButton}>
              📝 <span>Quick Note</span>
            </button>
            <button style={styles.actionButton}>
              ✅ <span>New Task</span>
            </button>
          </div>

          {/* Pinned Workspaces */}
          {pinnedWorkspaces.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>📌 Pinned</div>
              {pinnedWorkspaces.map((ws) => (
                <div
                  key={ws.id}
                  style={styles.workspaceCard}
                  onClick={() => onOpenWorkspace(ws.id)}
                >
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{ws.name}</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
                    Pinned workspace
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent Workspaces */}
          {recentWorkspaces.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>🕐 Recent</div>
              {recentWorkspaces.map((ws) => (
                <div
                  key={ws.id}
                  style={styles.workspaceCard}
                  onClick={() => onOpenWorkspace(ws.id)}
                >
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{ws.name}</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
                    {ws.lastOpenedAt
                      ? `Last opened ${new Date(ws.lastOpenedAt).toLocaleDateString()}`
                      : "No recent activity"}
                  </div>
                </div>
              ))}
            </div>
          )}

          {workspaces.length === 0 && (
            <div style={{ color: "#555", fontSize: 13, padding: "20px 0", textAlign: "center" }}>
              No workspaces yet. Create one to get started.
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================================
// COMMUNICATION HUB
// ============================================================================

function CommunicationHub({ onFocus }: { onFocus: () => void }) {
  return (
    <HubContainer title="Communication Hub" icon="💬">
      <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
        Nova chat, notifications, meetings
      </div>

      {/* Nova Assistant */}
      <div
        style={{
          padding: 12,
          background: "#1a1a1a",
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 20 }}>✦</span>
          <span style={{ fontWeight: 600 }}>Nova</span>
        </div>
        <div style={{ fontSize: 12, color: "#888" }}>
          "How can I assist you today?"
        </div>
      </div>

      {/* Quick notifications */}
      <div style={{ fontSize: 12, color: "#666" }}>
        No new notifications
      </div>

      <button
        onClick={onFocus}
        style={{
          marginTop: 12,
          padding: "8px 12px",
          fontSize: 11,
          borderRadius: 6,
          border: "1px solid #333",
          background: "transparent",
          color: "#888",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Focus Hub
      </button>
    </HubContainer>
  );
}

// ============================================================================
// WORKSPACE HUB
// ============================================================================

interface WorkspaceHubProps {
  ctx: NavContext;
  onClose: () => void;
  onFocus: () => void;
}

function WorkspaceHub({ ctx, onClose, onFocus }: WorkspaceHubProps) {
  const { sel, data } = ctx;

  const keyIS = sel.identityId && sel.sphereId
    ? `${sel.identityId}:${sel.sphereId}`
    : null;

  const workspaces = keyIS
    ? data.workspacesByIdentitySphere[keyIS] ?? []
    : [];

  const currentWorkspace = sel.workspaceId
    ? workspaces.find((w) => w.id === sel.workspaceId)
    : null;

  return (
    <HubContainer title="Workspace Hub" icon="🔧">
      {currentWorkspace ? (
        <>
          <div
            style={{
              padding: 16,
              background: "#1a1a1a",
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
              {currentWorkspace.name}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>
              Active workspace
            </div>
          </div>

          {/* Workspace tools */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <button style={{ ...styles.editButton, flex: 1 }}>📋 Tasks</button>
            <button style={{ ...styles.editButton, flex: 1 }}>📝 Notes</button>
            <button style={{ ...styles.editButton, flex: 1 }}>📁 Files</button>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onFocus}
              style={{ ...styles.editButton, flex: 1 }}
            >
              Focus
            </button>
            <button
              onClick={onClose}
              style={{
                ...styles.editButton,
                flex: 1,
                borderColor: "#663333",
                color: "#cc6666",
              }}
            >
              Close
            </button>
          </div>
        </>
      ) : (
        <div style={{ color: "#555", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
          No workspace open
        </div>
      )}
    </HubContainer>
  );
}

// ============================================================================
// MAIN APP SHELL
// ============================================================================

export function AppShell({ initialData }: { initialData: unknown }) {
  const [state, send] = useMachine(navMachine, {
    input: { data: initialData, mode: "auto" },
  });

  const ctx = state.context;

  const showComm = ctx.visibleHubs.includes("communication");
  const showNav = ctx.visibleHubs.includes("navigation");
  const showWs = ctx.visibleHubs.includes("workspace");

  // Handlers
  const handleSelectIdentity = (id: ID) => {
    send({ type: "SELECT_IDENTITY", identityId: id });
  };

  const handleSelectSphere = (id: ID) => {
    send({ type: "SELECT_SPHERE", sphereId: id });
  };

  const handleSelectProject = (id: ID) => {
    send({ type: "SELECT_PROJECT", projectId: id });
  };

  const handleOpenWorkspace = (id: ID) => {
    send({ type: "OPEN_WORKSPACE", workspaceId: id });
  };

  const handleClearLevel = (level: "identity" | "sphere" | "project") => {
    send({ type: "BACK_TO", level });
  };

  const handleToggleHub = (hub: Hub) => {
    send({ type: "TOGGLE_HUB", hub });
  };

  const handleFocusHub = (hub: Hub) => {
    send({ type: "FOCUS_HUB", hub });
  };

  const handleCloseWorkspace = () => {
    send({ type: "BACK_TO", level: "workspace" });
  };

  return (
    <div style={styles.shell}>
      {/* LEFT COLUMN: Communication Hub */}
      <div>
        {showComm && (
          <CommunicationHub onFocus={() => handleFocusHub("communication")} />
        )}
      </div>

      {/* CENTER COLUMN: Diamond + Context Bureau + Action Bureau */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Diamond Hub - Always visible */}
        <DiamondHub ctx={ctx} onToggleHub={handleToggleHub} />

        {/* Two Bureaux Side by Side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Context Bureau - Always visible */}
          <ContextBureau
            ctx={ctx}
            onSelectIdentity={handleSelectIdentity}
            onSelectSphere={handleSelectSphere}
            onSelectProject={handleSelectProject}
            onClearLevel={handleClearLevel}
          />

          {/* Action Bureau */}
          <ActionBureau ctx={ctx} onOpenWorkspace={handleOpenWorkspace} />
        </div>

        {/* Mode indicator */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            fontSize: 11,
            color: "#555",
          }}
        >
          <span>
            Mode:{" "}
            <button
              onClick={() =>
                send({ type: "SET_MODE", mode: ctx.mode === "auto" ? "manual" : "auto" })
              }
              style={{
                background: "transparent",
                border: "none",
                color: ctx.mode === "auto" ? "#3EB4A2" : "#888",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {ctx.mode.toUpperCase()}
            </button>
          </span>
          {ctx.skipped.length > 0 && (
            <span>Pre-filled: {ctx.skipped.join(", ")}</span>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Workspace Hub */}
      <div>
        {showWs && (
          <WorkspaceHub
            ctx={ctx}
            onClose={handleCloseWorkspace}
            onFocus={() => handleFocusHub("workspace")}
          />
        )}

        {/* Navigation Hub as fallback if workspace hidden */}
        {!showWs && showNav && (
          <HubContainer title="Navigation Hub" icon="🧭">
            <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
              Browse hierarchy
            </div>
            <button
              onClick={() => send({ type: "BACK_TO", level: "global" })}
              style={styles.actionButton}
            >
              🏠 <span>Go to Global</span>
            </button>
          </HubContainer>
        )}
      </div>
    </div>
  );
}

export default AppShell;
