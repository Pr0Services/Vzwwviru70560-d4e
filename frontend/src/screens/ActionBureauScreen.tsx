/**
 * CHE·NU™ — Action Bureau Screen
 * "Que faire maintenant?"
 * Quick actions, workspaces, Nova suggestions
 */

import React from "react";
import { motion } from "framer-motion";
import type { NavContext, ID } from "../../../shared/types";
import { QUICK_ACTIONS } from "../../../shared/constants";

interface ActionBureauScreenProps {
  ctx: NavContext;
  onOpenWorkspace: (id: ID) => void;
  onCreateNote: () => void;
  onCreateTask: () => void;
  onStartMeeting: () => void;
  onChangeContext: () => void;
}

export function ActionBureauScreen({
  ctx,
  onOpenWorkspace,
  onCreateNote,
  onCreateTask,
  onStartMeeting,
  onChangeContext,
}: ActionBureauScreenProps) {
  const { selection, data, actionSuggestions } = ctx;

  const keyIS =
    selection.identityId && selection.sphereId
      ? `${selection.identityId}:${selection.sphereId}`
      : null;

  const workspaces = keyIS
    ? data.workspacesByIdentitySphere[keyIS] ?? []
    : [];

  const pinnedWorkspaces = workspaces.filter((w) => w.pinned);
  const recentWorkspaces = workspaces
    .filter((w) => !w.pinned && w.lastOpenedAt)
    .sort((a, b) => (b.lastOpenedAt ?? 0) - (a.lastOpenedAt ?? 0))
    .slice(0, 5);

  return (
    <motion.div
      className="action-bureau-screen"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <header className="screen-header">
        <h2>⚡ Action Bureau</h2>
        <p className="screen-subtitle">Que faire maintenant?</p>
      </header>

      {/* QUICK ACTIONS */}
      <section className="action-section">
        <h3>Actions rapides</h3>
        <div className="quick-actions-grid">
          <motion.button
            className="quick-action-btn"
            onClick={onCreateNote}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="action-emoji">📝</span>
            <span className="action-label">Note rapide</span>
          </motion.button>

          <motion.button
            className="quick-action-btn"
            onClick={onCreateTask}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="action-emoji">✅</span>
            <span className="action-label">Nouvelle tâche</span>
          </motion.button>

          <motion.button
            className="quick-action-btn"
            onClick={onStartMeeting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="action-emoji">📹</span>
            <span className="action-label">Lancer réunion</span>
          </motion.button>

          <motion.button
            className="quick-action-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="action-emoji">🤖</span>
            <span className="action-label">Appeler agent</span>
          </motion.button>
        </div>
      </section>

      {/* PINNED WORKSPACES */}
      {pinnedWorkspaces.length > 0 && (
        <section className="action-section">
          <h3>📌 Workspaces épinglés</h3>
          <div className="workspaces-list">
            {pinnedWorkspaces.map((ws) => (
              <motion.button
                key={ws.id}
                className="workspace-card"
                onClick={() => onOpenWorkspace(ws.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="ws-icon">🔧</span>
                <div className="ws-info">
                  <span className="ws-name">{ws.name}</span>
                  <span className="ws-type">{ws.type}</span>
                </div>
                <span className="ws-arrow">→</span>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* RECENT WORKSPACES */}
      {recentWorkspaces.length > 0 && (
        <section className="action-section">
          <h3>🕐 Récents</h3>
          <div className="workspaces-list">
            {recentWorkspaces.map((ws) => (
              <motion.button
                key={ws.id}
                className="workspace-card"
                onClick={() => onOpenWorkspace(ws.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="ws-icon">📄</span>
                <div className="ws-info">
                  <span className="ws-name">{ws.name}</span>
                  <span className="ws-meta">
                    {ws.lastOpenedAt
                      ? new Date(ws.lastOpenedAt).toLocaleDateString("fr-FR")
                      : ""}
                  </span>
                </div>
                <span className="ws-arrow">→</span>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* NEW WORKSPACE */}
      {workspaces.length === 0 && (
        <section className="action-section empty-state">
          <p>Aucun workspace pour ce contexte.</p>
          <motion.button
            className="create-workspace-btn"
            onClick={() => onOpenWorkspace("new")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ➕ Créer un workspace
          </motion.button>
        </section>
      )}

      {/* NOVA SUGGESTIONS */}
      {actionSuggestions.length > 0 && (
        <section className="action-section nova-section">
          <h3>💡 Suggestions Nova</h3>
          <div className="nova-suggestion">
            <span className="nova-avatar">✦</span>
            <p>
              "Vous avez {ctx.contextSummary.urgentTasks} tâches urgentes.
              Commencer par là?"
            </p>
          </div>
        </section>
      )}

      {/* CHANGE CONTEXT */}
      <div className="action-footer">
        <button className="change-context-btn" onClick={onChangeContext}>
          ← Changer de contexte
        </button>
      </div>
    </motion.div>
  );
}
