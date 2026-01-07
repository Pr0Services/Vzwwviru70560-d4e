import { logger } from '../../utils/logger';
/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — CHECKPOINT MODAL CANONICAL                  ║
 * ║                    BLOQUANT — L'utilisateur DOIT décider                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * CONSTITUTION CHE·NU:
 * - ❌ Jamais de chiffres (tokens, coûts, budget)
 * - ❌ Jamais au milieu d'une analyse
 * - ❌ Jamais sans action explicite de l'utilisateur
 * - ✅ Message simple + deux boutons
 * - ✅ Backdrop non-dismissable (BLOQUANT)
 */

import React, { useEffect, useCallback, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface CheckpointModalCanonicalProps {
  /** Modal ouvert ou non */
  isOpen: boolean;
  /** Callback quand l'utilisateur approuve */
  onApprove: () => void;
  /** Callback quand l'utilisateur rejette */
  onReject: () => void;
  /** Titre personnalisé (optionnel) */
  title?: string;
  /** Message personnalisé (sera validé) */
  message?: string;
  /** Texte bouton approuver */
  approveLabel?: string;
  /** Texte bouton rejeter */
  rejectLabel?: string;
  /** Actions prévues à afficher */
  actions?: { id: string; description: string; type: string }[];
  /** Niveau de sensibilité */
  sensitivity?: 'low' | 'medium' | 'high' | 'critical';
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTITUTION CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_TITLE = '🔒 Autorisation Requise';
const DEFAULT_MESSAGE = 'Approfondir cette analyse nécessite de dépasser le cadre actuel.';
const DEFAULT_QUESTION = 'Souhaites-tu continuer ?';
const DEFAULT_APPROVE = '✓ Approuver';
const DEFAULT_REJECT = '✗ Annuler';

// Termes interdits (Constitution)
const FORBIDDEN_TERMS = [
  'token', 'tokens', 'budget', 'cost', 'coût', 'prix', 'price',
  'estimatedCost', 'tokenBudget', '$', '€', '£', '¥',
];

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

function validateMessage(message: string | undefined): string | null {
  if (!message) return null;
  
  const lowerMessage = message.toLowerCase();
  for (const term of FORBIDDEN_TERMS) {
    if (lowerMessage.includes(term.toLowerCase())) {
      logger.warn(`[Constitution] Message contains forbidden term: ${term}`);
      return null;
    }
  }
  
  // Check for numbers (could be costs)
  if (/\d+/.test(message)) {
    logger.warn('[Constitution] Message contains numbers');
    return null;
  }
  
  return message;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  backdrop: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    backgroundColor: '#1E1F22',
    borderRadius: '16px',
    border: '2px solid #D8B26A',
    padding: '32px',
    maxWidth: '520px',
    width: '90%',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.4)',
    animation: 'checkpointSlideIn 0.3s ease-out',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  icon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'rgba(216, 178, 106, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#D8B26A',
  },
  message: {
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#E9E4D6',
    marginBottom: '24px',
  },
  question: {
    fontSize: '15px',
    color: '#8D8371',
    marginBottom: '24px',
  },
  actionsPreview: {
    backgroundColor: 'rgba(62, 180, 162, 0.05)',
    border: '1px solid rgba(62, 180, 162, 0.2)',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
  },
  actionsTitle: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#3EB4A2',
    marginBottom: '12px',
  },
  actionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0',
    borderBottom: '1px solid rgba(62, 180, 162, 0.1)',
    fontSize: '14px',
    color: '#E9E4D6',
  },
  actionIcon: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    backgroundColor: 'rgba(62, 180, 162, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
  },
  sensitivityBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 500,
    marginLeft: 'auto',
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  rejectButton: {
    backgroundColor: 'transparent',
    border: '1px solid #8D8371',
    color: '#8D8371',
  },
  approveButton: {
    backgroundColor: '#3EB4A2',
    color: '#1E1F22',
  },
  keyHint: {
    marginTop: '16px',
    textAlign: 'center' as const,
    fontSize: '12px',
    color: '#8D8371',
  },
};

const SENSITIVITY_COLORS = {
  low: { bg: 'rgba(62, 180, 162, 0.15)', text: '#3EB4A2' },
  medium: { bg: 'rgba(216, 178, 106, 0.15)', text: '#D8B26A' },
  high: { bg: 'rgba(230, 126, 34, 0.15)', text: '#E67E22' },
  critical: { bg: 'rgba(231, 76, 60, 0.15)', text: '#E74C3C' },
};

const ACTION_ICONS: Record<string, string> = {
  analyze: '🔍',
  create: '➕',
  update: '✏️',
  delete: '🗑️',
  read: '👁️',
  generate: '✨',
  search: '🔎',
  notify: '🔔',
  schedule: '📅',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const CheckpointModalCanonical: React.FC<CheckpointModalCanonicalProps> = ({
  isOpen,
  onApprove,
  onReject,
  title = DEFAULT_TITLE,
  message,
  approveLabel = DEFAULT_APPROVE,
  rejectLabel = DEFAULT_REJECT,
  actions,
  sensitivity = 'medium',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Validate and sanitize message
  const displayMessage = validateMessage(message) || DEFAULT_MESSAGE;
  
  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onApprove();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onReject();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onApprove, onReject]);
  
  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll('button');
      if (focusableElements.length > 0) {
        (focusableElements[focusableElements.length - 1] as HTMLElement).focus();
      }
    }
  }, [isOpen]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const sensitivityColors = SENSITIVITY_COLORS[sensitivity];
  
  return (
    <>
      {/* Inject animation keyframes */}
      <style>{`
        @keyframes checkpointSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
      
      <div 
        style={styles.backdrop}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkpoint-title"
      >
        <div ref={modalRef} style={styles.modal}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.icon}>🔒</div>
            <h2 id="checkpoint-title" style={styles.title}>{title}</h2>
          </div>
          
          {/* Message */}
          <p style={styles.message}>{displayMessage}</p>
          <p style={styles.question}>{DEFAULT_QUESTION}</p>
          
          {/* Actions Preview */}
          {actions && actions.length > 0 && (
            <div style={styles.actionsPreview}>
              <div style={styles.actionsTitle}>
                📋 Actions prévues
                <span 
                  style={{
                    ...styles.sensitivityBadge,
                    backgroundColor: sensitivityColors.bg,
                    color: sensitivityColors.text,
                  }}
                >
                  {sensitivity.toUpperCase()}
                </span>
              </div>
              {actions.map((action, idx) => (
                <div 
                  key={action.id} 
                  style={{
                    ...styles.actionItem,
                    borderBottom: idx === actions.length - 1 ? 'none' : styles.actionItem.borderBottom,
                  }}
                >
                  <span style={styles.actionIcon}>
                    {ACTION_ICONS[action.type] || '⚡'}
                  </span>
                  <span>{action.description}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Buttons */}
          <div style={styles.buttons}>
            <button
              onClick={onReject}
              style={{ ...styles.button, ...styles.rejectButton }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#E74C3C';
                e.currentTarget.style.color = '#E74C3C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#8D8371';
                e.currentTarget.style.color = '#8D8371';
              }}
            >
              {rejectLabel}
            </button>
            <button
              onClick={onApprove}
              style={{ ...styles.button, ...styles.approveButton }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2F9A8A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3EB4A2';
              }}
            >
              {approveLabel}
            </button>
          </div>
          
          {/* Keyboard hints */}
          <div style={styles.keyHint}>
            <kbd style={{ 
              padding: '2px 6px', 
              backgroundColor: 'rgba(141, 131, 113, 0.2)',
              borderRadius: '4px',
              marginRight: '4px',
            }}>⌘/Ctrl + Enter</kbd> Approuver
            <span style={{ margin: '0 12px', color: '#2F4C39' }}>|</span>
            <kbd style={{ 
              padding: '2px 6px', 
              backgroundColor: 'rgba(141, 131, 113, 0.2)',
              borderRadius: '4px',
              marginRight: '4px',
            }}>Esc</kbd> Annuler
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckpointModalCanonical;
