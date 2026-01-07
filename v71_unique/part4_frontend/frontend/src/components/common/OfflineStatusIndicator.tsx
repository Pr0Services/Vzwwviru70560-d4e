/**
 * CHE·NU™ Offline Status Indicator
 * 
 * Visual indicator for offline/online status and sync state.
 * Shows pending operations and conflicts.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React, { useState, useEffect } from 'react';
import { 
  useOfflineStore, 
  selectIsOnline, 
  selectPendingCount,
  selectSyncInProgress,
  selectHasUnresolvedConflicts,
  selectNeedsSyncing,
} from '../../services/offline';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface OfflineStatusIndicatorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showDetails?: boolean;
  compact?: boolean;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const OfflineStatusIndicator: React.FC<OfflineStatusIndicatorProps> = ({
  position = 'bottom-right',
  showDetails = true,
  compact = false,
  className = '',
}) => {
  const isOnline = useOfflineStore(selectIsOnline);
  const pendingCount = useOfflineStore(selectPendingCount);
  const syncInProgress = useOfflineStore(selectSyncInProgress);
  const hasConflicts = useOfflineStore(selectHasUnresolvedConflicts);
  const needsSyncing = useOfflineStore(selectNeedsSyncing);
  const syncProgress = useOfflineStore(s => s.syncProgress);
  
  const [expanded, setExpanded] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Show banner when going offline
  useEffect(() => {
    if (!isOnline && !wasOffline) {
      setWasOffline(true);
      setShowBanner(true);
    } else if (isOnline && wasOffline) {
      setWasOffline(false);
      // Keep banner briefly to show "Back online"
      setTimeout(() => setShowBanner(false), 3000);
    }
  }, [isOnline, wasOffline]);

  // Auto-collapse when sync completes
  useEffect(() => {
    if (!syncInProgress && !needsSyncing && !hasConflicts) {
      const timer = setTimeout(() => setExpanded(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [syncInProgress, needsSyncing, hasConflicts]);

  const syncNow = useOfflineStore(s => s.syncNow);

  // Position styles
  const positionStyles: Record<typeof position, React.CSSProperties> = {
    'top-left': { top: 16, left: 16 },
    'top-right': { top: 16, right: 16 },
    'bottom-left': { bottom: 16, left: 16 },
    'bottom-right': { bottom: 16, right: 16 },
  };

  // Determine status
  const getStatus = () => {
    if (!isOnline) return 'offline';
    if (syncInProgress) return 'syncing';
    if (hasConflicts) return 'conflict';
    if (needsSyncing) return 'pending';
    return 'online';
  };

  const status = getStatus();

  // Status configurations
  const statusConfig = {
    offline: {
      icon: '📴',
      label: 'Hors ligne',
      color: 'var(--color-warning, #f59e0b)',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    syncing: {
      icon: '🔄',
      label: 'Synchronisation...',
      color: 'var(--color-info, #3b82f6)',
      bg: 'rgba(59, 130, 246, 0.1)',
    },
    conflict: {
      icon: '⚠️',
      label: 'Conflits à résoudre',
      color: 'var(--color-error, #ef4444)',
      bg: 'rgba(239, 68, 68, 0.1)',
    },
    pending: {
      icon: '📤',
      label: `${pendingCount} en attente`,
      color: 'var(--color-primary, #6366f1)',
      bg: 'rgba(99, 102, 241, 0.1)',
    },
    online: {
      icon: '✓',
      label: 'Synchronisé',
      color: 'var(--color-success, #22c55e)',
      bg: 'rgba(34, 197, 94, 0.1)',
    },
  };

  const config = statusConfig[status];

  // Don't show if online and synced (unless compact mode is off)
  if (status === 'online' && !showBanner && compact) {
    return null;
  }

  return (
    <>
      {/* Offline Banner */}
      {showBanner && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            padding: '12px 24px',
            background: isOnline 
              ? 'var(--color-success, #22c55e)' 
              : 'var(--color-warning, #f59e0b)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            zIndex: 9998,
            animation: 'slideDown 0.3s ease',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          <span>{isOnline ? '✓' : '📴'}</span>
          <span>
            {isOnline 
              ? 'Connexion rétablie - Synchronisation en cours...' 
              : 'Vous êtes hors ligne - Vos modifications seront synchronisées automatiquement'
            }
          </span>
          <button
            onClick={() => setShowBanner(false)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              color: '#fff',
              cursor: 'pointer',
              marginLeft: '16px',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Status Indicator */}
      <div
        className={`offline-status-indicator ${className}`}
        style={{
          position: 'fixed',
          ...positionStyles[position],
          zIndex: 9997,
        }}
      >
        {/* Main Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: compact ? '8px' : '8px 16px',
            background: config.bg,
            border: `1px solid ${config.color}`,
            borderRadius: expanded ? '12px 12px 0 0' : '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            color: config.color,
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          <span style={{ 
            animation: syncInProgress ? 'spin 1s linear infinite' : 'none',
          }}>
            {config.icon}
          </span>
          {!compact && <span>{config.label}</span>}
          {showDetails && pendingCount > 0 && status !== 'pending' && (
            <span style={{
              background: 'var(--color-primary, #6366f1)',
              color: '#fff',
              borderRadius: '10px',
              padding: '2px 8px',
              fontSize: '12px',
            }}>
              {pendingCount}
            </span>
          )}
        </button>

        {/* Expanded Details */}
        {expanded && showDetails && (
          <div
            style={{
              background: 'var(--color-bg-secondary, #fff)',
              border: `1px solid ${config.color}`,
              borderTop: 'none',
              borderRadius: '0 0 12px 12px',
              padding: '16px',
              minWidth: '280px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {/* Status Details */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '14px',
              }}>
                <span style={{ color: 'var(--color-text-secondary, #666)' }}>
                  Statut
                </span>
                <span style={{ color: config.color, fontWeight: 500 }}>
                  {isOnline ? 'En ligne' : 'Hors ligne'}
                </span>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '8px',
                fontSize: '14px',
              }}>
                <span style={{ color: 'var(--color-text-secondary, #666)' }}>
                  En attente
                </span>
                <span style={{ fontWeight: 500 }}>
                  {pendingCount} opération{pendingCount !== 1 ? 's' : ''}
                </span>
              </div>

              {hasConflicts && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  color: 'var(--color-error, #ef4444)',
                }}>
                  <span>Conflits</span>
                  <span style={{ fontWeight: 500 }}>À résoudre</span>
                </div>
              )}
            </div>

            {/* Sync Progress */}
            {syncInProgress && syncProgress && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  fontSize: '12px',
                  color: 'var(--color-text-secondary, #666)',
                  marginBottom: '8px',
                }}>
                  Synchronisation en cours... ({syncProgress.completed}/{syncProgress.total})
                </div>
                <div style={{
                  height: '4px',
                  background: 'var(--color-bg-tertiary, #f5f5f5)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${(syncProgress.completed / syncProgress.total) * 100}%`,
                    height: '100%',
                    background: 'var(--color-primary, #6366f1)',
                    transition: 'width 0.3s',
                  }} />
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {isOnline && pendingCount > 0 && !syncInProgress && (
                <button
                  onClick={() => syncNow()}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    background: 'var(--color-primary, #6366f1)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Synchroniser maintenant
                </button>
              )}

              {hasConflicts && (
                <button
                  onClick={() => {
                    // Navigate to conflict resolution
                    window.location.hash = '#conflicts';
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 16px',
                    background: 'var(--color-error, #ef4444)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Résoudre les conflits
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Styles */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }

        .offline-status-indicator button:hover {
          filter: brightness(1.05);
        }

        .offline-status-indicator button:active {
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPACT VARIANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Small status dot for header/footer
 */
export const OfflineStatusDot: React.FC<{ className?: string }> = ({ className }) => {
  const isOnline = useOfflineStore(selectIsOnline);
  const pendingCount = useOfflineStore(selectPendingCount);
  const syncInProgress = useOfflineStore(selectSyncInProgress);

  const getColor = () => {
    if (!isOnline) return 'var(--color-warning, #f59e0b)';
    if (syncInProgress) return 'var(--color-info, #3b82f6)';
    if (pendingCount > 0) return 'var(--color-primary, #6366f1)';
    return 'var(--color-success, #22c55e)';
  };

  return (
    <span
      className={className}
      title={
        !isOnline 
          ? 'Hors ligne' 
          : syncInProgress 
            ? 'Synchronisation...' 
            : pendingCount > 0 
              ? `${pendingCount} en attente` 
              : 'Synchronisé'
      }
      style={{
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: getColor(),
        animation: syncInProgress ? 'pulse 1s infinite' : 'none',
      }}
    />
  );
};

export default OfflineStatusIndicator;