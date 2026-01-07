/**
 * CHE·NU™ XR Preflight Modal Component
 * 
 * Displays before entering XR mode:
 * - Device requirements check
 * - Visible zones preview
 * - Privacy notice
 * - Proceed/Cancel actions
 * 
 * R&D Compliance:
 * - Rule #1: Explicit human decision to enter XR
 * - Rule #3: XR is projection only (communicated clearly)
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PreflightModalProps, ZoneType } from '../../types/governance-xr.types';

// =============================================================================
// CONSTANTS
// =============================================================================

const ZONE_LABELS: Record<ZoneType, { icon: string; label: string }> = {
  intent_wall: { icon: '🎯', label: 'Mur d\'intention / Intent Wall' },
  decision_wall: { icon: '⚖️', label: 'Mur de décisions / Decision Wall' },
  action_table: { icon: '✅', label: 'Table d\'actions / Action Table' },
  memory_kiosk: { icon: '🧠', label: 'Kiosque mémoire / Memory Kiosk' },
  timeline_strip: { icon: '📅', label: 'Bande temporelle / Timeline Strip' },
  resource_shelf: { icon: '📚', label: 'Étagère ressources / Resource Shelf' },
  portal_area: { icon: '🚪', label: 'Zone portails / Portal Area' },
};

// =============================================================================
// XR PREFLIGHT MODAL COMPONENT
// =============================================================================

export function XRPreflightModal({
  preflight,
  onProceed,
  onCancel,
}: PreflightModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="preflight-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          className="preflight-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="preflight-header">
            <span className="preflight-icon">🥽</span>
            <h2>Entrer en mode XR / Enter XR Mode</h2>
          </header>

          {/* Content */}
          <div className="preflight-content">
            {/* Availability status */}
            <div className={`status-banner ${preflight.xr_available ? 'status-ready' : 'status-unavailable'}`}>
              {preflight.xr_available ? (
                <>
                  <span className="status-icon">✅</span>
                  <span>XR disponible / XR Available</span>
                </>
              ) : (
                <>
                  <span className="status-icon">⚠️</span>
                  <span>XR non disponible / XR Not Available</span>
                </>
              )}
            </div>

            {/* Zones visible */}
            <section className="preflight-section">
              <h3>Zones visibles / Visible Zones</h3>
              <ul className="zone-list">
                {preflight.zones_visible.map((zone) => {
                  const config = ZONE_LABELS[zone];
                  return (
                    <li key={zone} className="zone-item">
                      <span className="zone-icon">{config?.icon || '📦'}</span>
                      <span className="zone-label">{config?.label || zone}</span>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Features enabled */}
            {preflight.features_enabled.length > 0 && (
              <section className="preflight-section">
                <h3>Fonctionnalités / Features</h3>
                <div className="feature-tags">
                  {preflight.features_enabled.map((feature) => (
                    <span key={feature} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Device requirements */}
            {preflight.device_requirements.length > 0 && (
              <section className="preflight-section">
                <h3>Prérequis / Requirements</h3>
                <ul className="requirements-list">
                  {preflight.device_requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Load time estimate */}
            <section className="preflight-section">
              <h3>Temps de chargement estimé / Estimated Load Time</h3>
              <p className="load-time">
                ~{Math.round(preflight.estimated_load_time_ms / 1000)}s
              </p>
            </section>

            {/* Privacy notice */}
            <div className="privacy-notice">
              <span className="privacy-icon">🔒</span>
              <p>{preflight.privacy_note}</p>
            </div>

            {/* XR is projection only notice */}
            <div className="projection-notice">
              <span className="projection-icon">ℹ️</span>
              <p>
                L'environnement XR est une <strong>projection</strong> du Thread.
                Toutes les modifications passent par des événements.
                <br />
                <em>XR environment is a <strong>projection</strong> of the Thread. All changes are made via events.</em>
              </p>
            </div>
          </div>

          {/* Actions */}
          <footer className="preflight-actions">
            <button
              className="cancel-button"
              onClick={onCancel}
            >
              Annuler / Cancel
            </button>
            <button
              className="proceed-button"
              onClick={onProceed}
              disabled={!preflight.proceed_enabled}
            >
              {preflight.proceed_enabled ? (
                <>Entrer en XR / Enter XR</>
              ) : (
                <>Non disponible / Unavailable</>
              )}
            </button>
          </footer>
        </motion.div>

        <style>{`
          .preflight-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            z-index: 1000;
          }

          .preflight-modal {
            background: white;
            border-radius: 1rem;
            max-width: 480px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          }

          .preflight-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1.5rem;
            border-bottom: 1px solid var(--color-border, #E5E7EB);
          }

          .preflight-icon {
            font-size: 2rem;
          }

          .preflight-header h2 {
            margin: 0;
            font-size: 1.25rem;
            color: var(--color-text-primary, #111827);
          }

          .preflight-content {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
          }

          .status-banner {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            font-weight: 500;
          }

          .status-ready {
            background: #ECFDF5;
            color: #065F46;
          }

          .status-unavailable {
            background: #FEF3C7;
            color: #92400E;
          }

          .status-icon {
            font-size: 1.25rem;
          }

          .preflight-section h3 {
            margin: 0 0 0.5rem 0;
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--color-text-secondary, #6B7280);
          }

          .zone-list {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .zone-item {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.5rem;
            background: var(--color-bg-secondary, #F3F4F6);
            border-radius: 0.25rem;
            font-size: 0.8125rem;
          }

          .zone-icon {
            font-size: 0.875rem;
          }

          .feature-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.375rem;
          }

          .feature-tag {
            padding: 0.25rem 0.5rem;
            background: #E0E7FF;
            color: #4338CA;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            font-weight: 500;
          }

          .requirements-list {
            margin: 0;
            padding-left: 1.25rem;
            font-size: 0.875rem;
            color: var(--color-text-secondary, #6B7280);
          }

          .requirements-list li {
            margin-bottom: 0.25rem;
          }

          .load-time {
            margin: 0;
            font-size: 1rem;
            font-weight: 500;
            color: var(--color-text-primary, #111827);
          }

          .privacy-notice, .projection-notice {
            display: flex;
            gap: 0.5rem;
            padding: 0.75rem;
            background: var(--color-bg-secondary, #F9FAFB);
            border-radius: 0.5rem;
          }

          .privacy-notice {
            background: #F0FDF4;
          }

          .projection-notice {
            background: #EFF6FF;
          }

          .privacy-icon, .projection-icon {
            font-size: 1.25rem;
            flex-shrink: 0;
          }

          .privacy-notice p, .projection-notice p {
            margin: 0;
            font-size: 0.8125rem;
            color: var(--color-text-secondary, #6B7280);
            line-height: 1.5;
          }

          .projection-notice em {
            font-size: 0.75rem;
            color: var(--color-text-tertiary, #9CA3AF);
          }

          .preflight-actions {
            display: flex;
            gap: 1rem;
            padding: 1rem 1.5rem;
            border-top: 1px solid var(--color-border, #E5E7EB);
            background: var(--color-bg-secondary, #F9FAFB);
            border-radius: 0 0 1rem 1rem;
          }

          .cancel-button, .proceed-button {
            flex: 1;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }

          .cancel-button {
            background: white;
            color: var(--color-text-primary, #111827);
            border: 1px solid var(--color-border, #E5E7EB);
          }

          .cancel-button:hover {
            background: var(--color-bg-secondary, #F3F4F6);
          }

          .proceed-button {
            background: #8B5CF6;
            color: white;
            border: none;
          }

          .proceed-button:hover:not(:disabled) {
            background: #7C3AED;
          }

          .proceed-button:disabled {
            background: #D1D5DB;
            cursor: not-allowed;
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
}

export default XRPreflightModal;
