/**
 * CHE·NU V51 — PROPOSAL DRAWER
 * =============================
 * 
 * Right panel - governance gate.
 * Shows proposals awaiting human review.
 * 
 * RULES:
 * - All proposals require validation
 * - User can approve, discard, or edit
 * - NOTHING is auto-applied
 */

import React, { useState } from 'react';
import { Proposal } from '../../stores/ProposalStore';

export interface ProposalDrawerProps {
  proposals: Proposal[];
  onApprove: (proposalId: string) => void;
  onDiscard: (proposalId: string) => void;
  uiMode: 'light' | 'dark_strict' | 'incident';
}

const ProposalDrawer: React.FC<ProposalDrawerProps> = ({
  proposals,
  onApprove,
  onDiscard,
  uiMode
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div style={getContainerStyles(uiMode)}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.title}>Propositions</span>
        <span style={styles.count}>{proposals.length}</span>
      </div>

      {/* Governance Notice */}
      <div style={styles.notice}>
        <span style={styles.noticeIcon}>🛡️</span>
        <span style={styles.noticeText}>
          Toutes les propositions requièrent votre approbation.
          Rien n'est appliqué automatiquement.
        </span>
      </div>

      {/* Proposals List */}
      <div style={styles.proposalList}>
        {proposals.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>📝</span>
            <p style={styles.emptyText}>Aucune proposition en attente</p>
            <p style={styles.emptySubtext}>
              Créez des blocs dans le canvas et utilisez "Proposer" 
              pour générer des propositions mémoire.
            </p>
          </div>
        ) : (
          proposals.map(proposal => (
            <ProposalCard
              key={proposal.proposal_id}
              proposal={proposal}
              isExpanded={expandedId === proposal.proposal_id}
              onToggleExpand={() => setExpandedId(
                expandedId === proposal.proposal_id ? null : proposal.proposal_id
              )}
              onApprove={() => onApprove(proposal.proposal_id)}
              onDiscard={() => onDiscard(proposal.proposal_id)}
              uiMode={uiMode}
            />
          ))
        )}
      </div>

      {/* Bulk Actions */}
      {proposals.length > 1 && (
        <div style={styles.bulkActions}>
          <button
            onClick={() => proposals.forEach(p => onApprove(p.proposal_id))}
            style={styles.bulkApprove}
          >
            ✓ Tout approuver
          </button>
          <button
            onClick={() => proposals.forEach(p => onDiscard(p.proposal_id))}
            style={styles.bulkDiscard}
          >
            ✗ Tout rejeter
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// PROPOSAL CARD
// ============================================

interface ProposalCardProps {
  proposal: Proposal;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onApprove: () => void;
  onDiscard: () => void;
  uiMode: string;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  isExpanded,
  onToggleExpand,
  onApprove,
  onDiscard,
  uiMode
}) => {
  const content = proposal.content as Record<string, unknown>;
  const summary = content?.canonical_summary as string || 'Proposition';
  const confidence = proposal.confidence;

  return (
    <div style={{
      ...styles.proposalCard,
      backgroundColor: uiMode === 'light' ? '#fff' 
        : uiMode === 'incident' ? '#1a0a0a' 
        : '#1a1a2e',
      borderColor: uiMode === 'incident' ? '#500' : '#333'
    }}>
      {/* Header */}
      <div style={styles.cardHeader} onClick={onToggleExpand}>
        <div style={styles.cardType}>
          <span style={styles.typeIcon}>📝</span>
          <span style={styles.typeName}>{proposal.proposal_type}</span>
        </div>
        <div style={styles.cardMeta}>
          <ConfidenceBadge confidence={confidence} />
          <span style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
        </div>
      </div>

      {/* Summary */}
      <div style={styles.cardSummary}>
        {summary.length > 100 && !isExpanded 
          ? summary.substring(0, 100) + '...' 
          : summary
        }
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div style={styles.cardDetails}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>ID:</span>
            <code style={styles.detailValue}>{proposal.proposal_id}</code>
          </div>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Créé:</span>
            <span style={styles.detailValue}>
              {new Date(proposal.created_at).toLocaleString('fr-CA')}
            </span>
          </div>
          {proposal.affected_spheres.length > 0 && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Sphères:</span>
              <span style={styles.detailValue}>
                {proposal.affected_spheres.join(', ')}
              </span>
            </div>
          )}
          {proposal.edit_history.length > 0 && (
            <div style={styles.editHistory}>
              <span style={styles.detailLabel}>Historique:</span>
              {proposal.edit_history.map((edit, i) => (
                <div key={i} style={styles.editEntry}>
                  {edit.field}: {String(edit.old_value)} → {String(edit.new_value)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={styles.cardActions}>
        <button onClick={onApprove} style={styles.approveButton}>
          ✓ Approuver
        </button>
        <button onClick={onDiscard} style={styles.discardButton}>
          ✗ Rejeter
        </button>
      </div>
    </div>
  );
};

// ============================================
// CONFIDENCE BADGE
// ============================================

const ConfidenceBadge: React.FC<{ confidence: string }> = ({ confidence }) => {
  const getColor = () => {
    switch (confidence) {
      case 'high': return '#81c784';
      case 'medium': return '#ffb74d';
      case 'low': return '#e57373';
      default: return '#888';
    }
  };

  return (
    <span style={{
      ...styles.confidenceBadge,
      backgroundColor: `${getColor()}30`,
      color: getColor(),
      borderColor: getColor()
    }}>
      {confidence}
    </span>
  );
};

// ============================================
// STYLES
// ============================================

function getContainerStyles(uiMode: string): React.CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '15px',
    backgroundColor: uiMode === 'light' ? '#f5f5f5' 
      : uiMode === 'incident' ? '#0a0505' 
      : '#0a0a15'
  };
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px'
  },
  title: {
    fontSize: '14px',
    fontWeight: 'bold'
  },
  count: {
    fontSize: '12px',
    padding: '2px 8px',
    backgroundColor: '#4a4a6a',
    borderRadius: '10px',
    color: '#fff'
  },
  notice: {
    display: 'flex',
    gap: '8px',
    padding: '10px',
    backgroundColor: '#1a2e1a',
    borderRadius: '6px',
    marginBottom: '15px',
    border: '1px solid #4a6a4a'
  },
  noticeIcon: {
    fontSize: '14px'
  },
  noticeText: {
    fontSize: '11px',
    color: '#81c784',
    lineHeight: '1.4'
  },
  proposalList: {
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '30px 15px'
  },
  emptyIcon: {
    fontSize: '32px',
    opacity: 0.5
  },
  emptyText: {
    fontSize: '14px',
    marginTop: '10px',
    color: '#888'
  },
  emptySubtext: {
    fontSize: '12px',
    color: '#666',
    marginTop: '8px',
    lineHeight: '1.5'
  },
  proposalCard: {
    borderRadius: '8px',
    border: '1px solid',
    overflow: 'hidden'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid #333'
  },
  cardType: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  typeIcon: {
    fontSize: '14px'
  },
  typeName: {
    fontSize: '12px',
    textTransform: 'capitalize'
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  confidenceBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    border: '1px solid',
    textTransform: 'uppercase'
  },
  expandIcon: {
    fontSize: '10px',
    color: '#888'
  },
  cardSummary: {
    padding: '12px',
    fontSize: '13px',
    lineHeight: '1.5'
  },
  cardDetails: {
    padding: '0 12px 12px',
    borderTop: '1px solid #333'
  },
  detailRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
    fontSize: '11px'
  },
  detailLabel: {
    color: '#888',
    minWidth: '60px'
  },
  detailValue: {
    fontFamily: 'monospace'
  },
  editHistory: {
    marginTop: '10px'
  },
  editEntry: {
    fontSize: '10px',
    color: '#888',
    marginTop: '4px'
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
    padding: '10px 12px',
    borderTop: '1px solid #333'
  },
  approveButton: {
    flex: 1,
    padding: '8px',
    fontSize: '12px',
    backgroundColor: '#4a6a4a',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer'
  },
  discardButton: {
    flex: 1,
    padding: '8px',
    fontSize: '12px',
    backgroundColor: '#6a4a4a',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer'
  },
  bulkActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #333'
  },
  bulkApprove: {
    flex: 1,
    padding: '10px',
    fontSize: '12px',
    backgroundColor: 'transparent',
    border: '1px solid #4a6a4a',
    borderRadius: '4px',
    color: '#81c784',
    cursor: 'pointer'
  },
  bulkDiscard: {
    flex: 1,
    padding: '10px',
    fontSize: '12px',
    backgroundColor: 'transparent',
    border: '1px solid #6a4a4a',
    borderRadius: '4px',
    color: '#e57373',
    cursor: 'pointer'
  }
};

export default ProposalDrawer;
