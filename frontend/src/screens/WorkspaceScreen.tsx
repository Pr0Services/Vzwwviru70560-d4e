/**
 * CHE·NU™ — Workspace Screen
 * Execution space. Context is LOCKED.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { NavContext } from "../../../shared/types";

interface WorkspaceScreenProps {
  ctx: NavContext;
  onBack: () => void;
  onChangeContext: () => void;
}

type WorkspaceMode = "draft" | "staging" | "review";

export function WorkspaceScreen({
  ctx,
  onBack,
  onChangeContext,
}: WorkspaceScreenProps) {
  const [mode, setMode] = useState<WorkspaceMode>("draft");
  const [content, setContent] = useState("");

  const { selection, data, diamond } = ctx;

  // Get current workspace info
  const keyIS =
    selection.identityId && selection.sphereId
      ? `${selection.identityId}:${selection.sphereId}`
      : null;

  const workspaces = keyIS
    ? data.workspacesByIdentitySphere[keyIS] ?? []
    : [];

  const currentWorkspace = selection.workspaceId
    ? workspaces.find((w) => w.id === selection.workspaceId)
    : null;

  const workspaceName = currentWorkspace?.name ?? "Nouveau Workspace";

  return (
    <motion.div
      className="workspace-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* WORKSPACE HEADER */}
      <header className="workspace-header">
        <div className="ws-title-row">
          <h2>🔧 {workspaceName}</h2>
          <span className="context-locked-badge">🔒 Contexte verrouillé</span>
        </div>
        <p className="ws-context">{diamond.contextLabel}</p>
      </header>

      {/* MODE SELECTOR */}
      <div className="workspace-modes">
        {(["draft", "staging", "review"] as WorkspaceMode[]).map((m) => (
          <button
            key={m}
            className={`mode-btn ${mode === m ? "active" : ""}`}
            onClick={() => setMode(m)}
          >
            {m === "draft" && "📝 Draft"}
            {m === "staging" && "🔄 Staging"}
            {m === "review" && "✅ Review"}
          </button>
        ))}
      </div>

      {/* WORKSPACE CANVAS */}
      <div className="workspace-canvas">
        {mode === "draft" && (
          <div className="canvas-draft">
            <textarea
              className="draft-editor"
              placeholder="Commencez à écrire..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        )}

        {mode === "staging" && (
          <div className="canvas-staging">
            <div className="staging-preview">
              <h4>Aperçu</h4>
              <div className="preview-content">
                {content || "Aucun contenu à prévisualiser"}
              </div>
            </div>
            <div className="staging-actions">
              <button className="staging-btn">Soumettre à review</button>
              <button className="staging-btn secondary">Envoyer à un agent</button>
            </div>
          </div>
        )}

        {mode === "review" && (
          <div className="canvas-review">
            <div className="review-content">
              <h4>En attente d'approbation</h4>
              <div className="review-preview">
                {content || "Aucun contenu soumis"}
              </div>
            </div>
            <div className="review-actions">
              <button className="review-btn approve">✓ Approuver</button>
              <button className="review-btn reject">✗ Rejeter</button>
              <button className="review-btn revise">↩ Réviser</button>
            </div>
          </div>
        )}
      </div>

      {/* WORKSPACE TOOLBAR */}
      <div className="workspace-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn" title="Diff">
            📋 Diff
          </button>
          <button className="toolbar-btn" title="Historique">
            🕐 Historique
          </button>
          <button className="toolbar-btn" title="Versions">
            🔄 Versions
          </button>
        </div>

        <div className="toolbar-right">
          <button className="toolbar-btn agent" title="Envoyer à un agent">
            🤖 Agent
          </button>
          <button className="toolbar-btn save" title="Sauvegarder">
            💾 Sauvegarder
          </button>
        </div>
      </div>

      {/* WORKSPACE FOOTER */}
      <div className="workspace-footer">
        <button className="back-btn" onClick={onBack}>
          ← Retour aux actions
        </button>
        <button className="change-context-btn" onClick={onChangeContext}>
          Changer de contexte
        </button>
      </div>
    </motion.div>
  );
}
