/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║              CHE·NU™ — GOVERNANCE DASHBOARD (Updated)                        ║
 * ║                                                                              ║
 * ║              Constitution-compliant governance overview                       ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * CONSTITUTION COMPLIANCE:
 * - LAW #1: NO budget/token info displayed
 * - LAW #2: Analysis status shown (never interrupted)
 * - LAW #3: Depth suggestions shown with intellectual framing
 */

import React, { useEffect, useState } from 'react';
import { useGovernanceStore } from '../../stores/governanceStore.constitution';
import { CheckpointModal } from './CheckpointModal';
import DepthSuggestion from './DepthSuggestion';

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════

interface GovernanceDashboardProps {
  /** Show Constitution status */
  showConstitution?: boolean;
  /** Show checkpoint history */
  showHistory?: boolean;
  /** Custom class name */
  className?: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    padding: '24px',
    backgroundColor: '#1E1F22',
    borderRadius: '12px',
    color: '#E9E4D6',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  titleIcon: {
    fontSize: '24px',
  },
  titleText: {
    color: '#D8B26A',
    fontSize: '20px',
    fontWeight: 600,
    margin: 0,
  },
  constitutionBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: 'rgba(63, 114, 73, 0.2)',
    borderRadius: '16px',
    fontSize: '12px',
    color: '#3F7249',
  },
  sections: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
    padding: '20px',
    border: '1px solid rgba(141, 131, 113, 0.1)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  sectionIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  sectionTitle: {
    color: '#E9E4D6',
    fontSize: '14px',
    fontWeight: 500,
    margin: 0,
  },
  lawList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  lawItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '6px',
  },
  lawNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    backgroundColor: 'rgba(216, 178, 106, 0.15)',
    color: '#D8B26A',
    fontSize: '12px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  lawContent: {
    flex: 1,
  },
  lawName: {
    color: '#E9E4D6',
    fontSize: '13px',
    fontWeight: 500,
    margin: '0 0 4px 0',
  },
  lawPrinciple: {
    color: '#8D8371',
    fontSize: '12px',
    margin: 0,
    lineHeight: 1.4,
  },
  lawStatus: {
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '10px',
    fontWeight: 500,
  },
  lawActive: {
    backgroundColor: 'rgba(63, 114, 73, 0.2)',
    color: '#3F7249',
  },
  historySection: {
    marginTop: '24px',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '8px',
  },
  historyTitle: {
    color: '#E9E4D6',
    fontSize: '14px',
    fontWeight: 500,
    margin: '0 0 16px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    maxHeight: '200px',
    overflowY: 'auto' as const,
  },
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '6px',
    fontSize: '13px',
  },
  historyStatus: {
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
  },
  statusApproved: {
    backgroundColor: 'rgba(63, 114, 73, 0.2)',
    color: '#3F7249',
  },
  statusRejected: {
    backgroundColor: 'rgba(122, 89, 58, 0.2)',
    color: '#7A593A',
  },
  emptyHistory: {
    color: '#8D8371',
    fontSize: '13px',
    textAlign: 'center' as const,
    padding: '20px',
  },
  axiom: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: 'rgba(216, 178, 106, 0.08)',
    borderRadius: '8px',
    borderLeft: '3px solid #D8B26A',
  },
  axiomText: {
    color: '#D8B26A',
    fontSize: '14px',
    fontStyle: 'italic',
    margin: 0,
  },
  axiomSubtext: {
    color: '#8D8371',
    fontSize: '12px',
    margin: '8px 0 0 0',
  },
};

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export const GovernanceDashboard: React.FC<GovernanceDashboardProps> = ({
  showConstitution = true,
  showHistory = true,
  className,
}) => {
  // Store
  const {
    constitutionActive,
    constitutionVersion,
    checkpointHistory,
    depthSuggestion,
    getConstitution,
  } = useGovernanceStore();

  // Get Constitution data
  const constitution = getConstitution();

  return (
    <div style={styles.container} className={className}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span style={styles.titleIcon}>🏛️</span>
          <h2 style={styles.titleText}>Gouvernance</h2>
        </div>
        {constitutionActive && (
          <div style={styles.constitutionBadge}>
            <span>✓</span>
            <span>Constitution v{constitutionVersion} Active</span>
          </div>
        )}
      </div>

      {/* Constitution Laws */}
      {showConstitution && (
        <div style={styles.sections}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div
                style={{
                  ...styles.sectionIcon,
                  backgroundColor: 'rgba(216, 178, 106, 0.15)',
                }}
              >
                📜
              </div>
              <h3 style={styles.sectionTitle}>Lois Constitutionnelles</h3>
            </div>

            <div style={styles.lawList}>
              {constitution.laws.map((law) => (
                <div key={law.number} style={styles.lawItem}>
                  <div style={styles.lawNumber}>{law.number}</div>
                  <div style={styles.lawContent}>
                    <h4 style={styles.lawName}>{law.name}</h4>
                    <p style={styles.lawPrinciple}>{law.principle}</p>
                  </div>
                  <span
                    style={{
                      ...styles.lawStatus,
                      ...(law.active ? styles.lawActive : {}),
                    }}
                  >
                    {law.active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div
                style={{
                  ...styles.sectionIcon,
                  backgroundColor: 'rgba(62, 180, 162, 0.15)',
                }}
              >
                📊
              </div>
              <h3 style={styles.sectionTitle}>Statistiques</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '6px',
                }}
              >
                <span style={{ color: '#8D8371', fontSize: '13px' }}>
                  Checkpoints traités
                </span>
                <span style={{ color: '#E9E4D6', fontSize: '14px', fontWeight: 500 }}>
                  {checkpointHistory.length}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '6px',
                }}
              >
                <span style={{ color: '#8D8371', fontSize: '13px' }}>Approuvés</span>
                <span style={{ color: '#3F7249', fontSize: '14px', fontWeight: 500 }}>
                  {checkpointHistory.filter((c) => c.status === 'approved').length}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '6px',
                }}
              >
                <span style={{ color: '#8D8371', fontSize: '13px' }}>Rejetés</span>
                <span style={{ color: '#7A593A', fontSize: '14px', fontWeight: 500 }}>
                  {checkpointHistory.filter((c) => c.status === 'rejected').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Depth Suggestion (if any) */}
      {depthSuggestion && <DepthSuggestion onDeepen={() => {}} />}

      {/* Checkpoint History */}
      {showHistory && (
        <div style={styles.historySection}>
          <h3 style={styles.historyTitle}>
            <span>📋</span>
            Historique des Checkpoints
          </h3>

          {checkpointHistory.length === 0 ? (
            <div style={styles.emptyHistory}>Aucun checkpoint traité</div>
          ) : (
            <div style={styles.historyList}>
              {checkpointHistory
                .slice()
                .reverse()
                .slice(0, 10)
                .map((checkpoint) => (
                  <div key={checkpoint.id} style={styles.historyItem}>
                    <span style={{ color: '#8D8371' }}>
                      {checkpoint.id.slice(0, 8)}...
                    </span>
                    <span
                      style={{
                        ...styles.historyStatus,
                        ...(checkpoint.status === 'approved'
                          ? styles.statusApproved
                          : styles.statusRejected),
                      }}
                    >
                      {checkpoint.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Axiom */}
      <div style={styles.axiom}>
        <p style={styles.axiomText}>"GOVERNANCE IS SILENT BY DEFAULT"</p>
        <p style={styles.axiomSubtext}>{constitution.formula}</p>
      </div>

      {/* Checkpoint Modal */}
      <CheckpointModal />
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════════════════════════════

export default GovernanceDashboard;
