/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — GOVERNANCE STORIES                          ║
 * ║                                                                              ║
 * ║  Checkpoint and governance components                                        ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// CHECKPOINT CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface CheckpointCardProps {
  id: string;
  actionType: string;
  description: string;
  requestedBy: string;
  riskLevel: RiskLevel;
  createdAt: string;
  onApprove?: () => void;
  onReject?: () => void;
}

const RISK_CONFIG = {
  low: { color: '#22C55E', bg: '#22C55E15', label: 'Faible' },
  medium: { color: '#EAB308', bg: '#EAB30815', label: 'Moyen' },
  high: { color: '#EF4444', bg: '#EF444415', label: 'Élevé' },
  critical: { color: '#DC2626', bg: '#DC262615', label: 'Critique' },
};

const CheckpointCard: React.FC<CheckpointCardProps> = ({
  id,
  actionType,
  description,
  requestedBy,
  riskLevel,
  createdAt,
  onApprove,
  onReject,
}) => {
  const risk = RISK_CONFIG[riskLevel];

  return (
    <div
      style={{
        background: '#2A2B2F',
        borderRadius: '12px',
        border: '2px solid #D8B26A40',
        overflow: 'hidden',
        maxWidth: '400px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: '#D8B26A15',
          padding: '12px 16px',
          borderBottom: '1px solid #D8B26A30',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '20px' }}>🛡️</span>
        <span style={{ color: '#D8B26A', fontWeight: 600, fontSize: '14px' }}>
          Point de contrôle requis
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: '#9CA3AF', fontSize: '11px', marginBottom: '4px' }}>
            Action
          </div>
          <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>
            {actionType}
          </div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ color: '#9CA3AF', fontSize: '11px', marginBottom: '4px' }}>
            Description
          </div>
          <div style={{ color: '#E5E7EB', fontSize: '13px' }}>
            {description}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ color: '#9CA3AF', fontSize: '11px', marginBottom: '4px' }}>
              Demandé par
            </div>
            <div style={{ color: '#E5E7EB', fontSize: '13px' }}>
              {requestedBy}
            </div>
          </div>
          <div>
            <div style={{ color: '#9CA3AF', fontSize: '11px', marginBottom: '4px' }}>
              Niveau de risque
            </div>
            <span
              style={{
                background: risk.bg,
                color: risk.color,
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              {risk.label}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onApprove}
            style={{
              flex: 1,
              padding: '10px',
              background: '#22C55E',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            ✓ Approuver
          </button>
          <button
            onClick={onReject}
            style={{
              flex: 1,
              padding: '10px',
              background: '#EF4444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            ✗ Rejeter
          </button>
        </div>
      </div>
    </div>
  );
};

const checkpointMeta: Meta<typeof CheckpointCard> = {
  title: 'V72/CheckpointCard',
  component: CheckpointCard,
  tags: ['autodocs'],
  argTypes: {
    riskLevel: {
      control: 'select',
      options: ['low', 'medium', 'high', 'critical'],
    },
    onApprove: { action: 'approved' },
    onReject: { action: 'rejected' },
  },
};

export default checkpointMeta;
type CheckpointStory = StoryObj<typeof CheckpointCard>;

export const LowRisk: CheckpointStory = {
  args: {
    id: '1',
    actionType: 'Embauche Agent',
    description: "Embaucher l'agent Superviseur de Chantier pour la sphère Personnel",
    requestedBy: 'Nova',
    riskLevel: 'low',
    createdAt: new Date().toISOString(),
  },
};

export const MediumRisk: CheckpointStory = {
  args: {
    id: '2',
    actionType: 'Envoi de document',
    description: 'Envoyer le devis final au contracteur sélectionné',
    requestedBy: 'Nova',
    riskLevel: 'medium',
    createdAt: new Date().toISOString(),
  },
};

export const HighRisk: CheckpointStory = {
  args: {
    id: '3',
    actionType: 'Suppression de données',
    description: 'Archiver et supprimer les données du thread "Ancien projet"',
    requestedBy: 'Agent Archiviste',
    riskLevel: 'high',
    createdAt: new Date().toISOString(),
  },
};

export const CriticalRisk: CheckpointStory = {
  args: {
    id: '4',
    actionType: 'Appel API externe',
    description: 'Envoyer les informations de paiement au service tiers',
    requestedBy: 'Agent Paiement',
    riskLevel: 'critical',
    createdAt: new Date().toISOString(),
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE SIGNAL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

type SignalLevel = 'info' | 'attention' | 'warning' | 'critical' | 'blocked';

interface GovernanceSignalProps {
  level: SignalLevel;
  title: string;
  description: string;
  source: string;
  timestamp: string;
  onResolve?: () => void;
}

const SIGNAL_CONFIG = {
  info: { icon: 'ℹ️', color: '#3B82F6', bg: '#3B82F615' },
  attention: { icon: '👀', color: '#8B5CF6', bg: '#8B5CF615' },
  warning: { icon: '⚠️', color: '#EAB308', bg: '#EAB30815' },
  critical: { icon: '🚨', color: '#EF4444', bg: '#EF444415' },
  blocked: { icon: '🛑', color: '#DC2626', bg: '#DC262615' },
};

const GovernanceSignal: React.FC<GovernanceSignalProps> = ({
  level,
  title,
  description,
  source,
  timestamp,
  onResolve,
}) => {
  const config = SIGNAL_CONFIG[level];

  return (
    <div
      style={{
        background: config.bg,
        borderLeft: `4px solid ${config.color}`,
        padding: '12px 16px',
        borderRadius: '0 8px 8px 0',
        maxWidth: '400px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ fontSize: '20px' }}>{config.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: config.color, fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
            {title}
          </div>
          <div style={{ color: '#E5E7EB', fontSize: '13px', marginBottom: '8px' }}>
            {description}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#9CA3AF', fontSize: '11px' }}>
              {source} • {new Date(timestamp).toLocaleTimeString('fr-FR')}
            </span>
            {onResolve && (
              <button
                onClick={onResolve}
                style={{
                  background: 'transparent',
                  border: `1px solid ${config.color}`,
                  color: config.color,
                  padding: '4px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Résoudre
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SignalInfo: StoryObj<typeof GovernanceSignal> = {
  render: () => (
    <GovernanceSignal
      level="info"
      title="Synchronisation terminée"
      description="Les données ont été synchronisées avec succès"
      source="Sync Engine"
      timestamp={new Date().toISOString()}
    />
  ),
};

export const SignalAttention: StoryObj<typeof GovernanceSignal> = {
  render: () => (
    <GovernanceSignal
      level="attention"
      title="Thread inactif détecté"
      description="Le thread 'Projet X' n'a pas eu d'activité depuis 7 jours"
      source="Activity Monitor"
      timestamp={new Date().toISOString()}
      onResolve={() => {}}
    />
  ),
};

export const SignalWarning: StoryObj<typeof GovernanceSignal> = {
  render: () => (
    <GovernanceSignal
      level="warning"
      title="Quota agent atteint"
      description="L'agent Construction a atteint 90% de son quota quotidien"
      source="Agent Monitor"
      timestamp={new Date().toISOString()}
      onResolve={() => {}}
    />
  ),
};

export const SignalCritical: StoryObj<typeof GovernanceSignal> = {
  render: () => (
    <GovernanceSignal
      level="critical"
      title="Décision expirée"
      description="La décision 'Choix contracteur' a dépassé la deadline"
      source="Decision Engine"
      timestamp={new Date().toISOString()}
      onResolve={() => {}}
    />
  ),
};

export const SignalBlocked: StoryObj<typeof GovernanceSignal> = {
  render: () => (
    <GovernanceSignal
      level="blocked"
      title="Action bloquée par OPA"
      description="Tentative d'accès non autorisé aux données sensibles"
      source="OPA Gateway"
      timestamp={new Date().toISOString()}
      onResolve={() => {}}
    />
  ),
};

export const AllSignals: StoryObj<typeof GovernanceSignal> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', background: '#1E1F22' }}>
      <GovernanceSignal level="info" title="Info" description="Message d'information" source="System" timestamp={new Date().toISOString()} />
      <GovernanceSignal level="attention" title="Attention" description="À surveiller" source="Monitor" timestamp={new Date().toISOString()} onResolve={() => {}} />
      <GovernanceSignal level="warning" title="Avertissement" description="Action requise" source="Engine" timestamp={new Date().toISOString()} onResolve={() => {}} />
      <GovernanceSignal level="critical" title="Critique" description="Urgent!" source="Alert" timestamp={new Date().toISOString()} onResolve={() => {}} />
      <GovernanceSignal level="blocked" title="Bloqué" description="Action empêchée" source="OPA" timestamp={new Date().toISOString()} onResolve={() => {}} />
    </div>
  ),
};
