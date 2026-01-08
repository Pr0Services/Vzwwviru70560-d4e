/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — NOTIFICATION CENTER V72
 * ═══════════════════════════════════════════════════════════════════════════
 * Centre de notifications avec bell et panel
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'checkpoint' | 'agent';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationCenterProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDismiss: (id: string) => void;
  onClear: () => void;
}

export interface NotificationBellProps {
  count: number;
  onClick: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'checkpoint',
    title: 'Checkpoint en attente',
    message: 'Nova demande votre approbation pour exécuter une action.',
    timestamp: new Date(Date.now() - 5 * 60000),
    read: false,
    actionUrl: '/nova',
    actionLabel: 'Voir',
  },
  {
    id: '2',
    type: 'agent',
    title: 'Agent terminé',
    message: 'Content Writer a terminé la rédaction de votre article.',
    timestamp: new Date(Date.now() - 30 * 60000),
    read: false,
    actionUrl: '/agents',
  },
  {
    id: '3',
    type: 'success',
    title: 'Thread complété',
    message: 'Le thread "Projet Alpha" a été marqué comme complété.',
    timestamp: new Date(Date.now() - 2 * 3600000),
    read: true,
  },
  {
    id: '4',
    type: 'warning',
    title: 'Décision expirante',
    message: 'Une décision arrive à expiration dans 2 jours.',
    timestamp: new Date(Date.now() - 24 * 3600000),
    read: true,
    actionUrl: '/decisions',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = {
  info: '#60A5FA',
  success: '#3F7249',
  warning: '#F59E0B',
  error: '#EF4444',
  checkpoint: '#D8B26A',
  agent: '#A78BFA',
};

const styles = {
  bell: {
    position: 'relative' as const,
    width: 40,
    height: 40,
    borderRadius: 10,
    background: 'transparent',
    border: '1px solid #1f1f23',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
  
  bellHover: {
    background: '#1f1f23',
    borderColor: '#2a2a30',
  } as React.CSSProperties,
  
  badge: {
    position: 'absolute' as const,
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    background: '#EF4444',
    color: '#fff',
    fontSize: 10,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
  } as React.CSSProperties,
  
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  } as React.CSSProperties,
  
  panel: {
    position: 'fixed' as const,
    top: 0,
    right: 0,
    width: 380,
    height: '100vh',
    background: '#111113',
    borderLeft: '1px solid #1f1f23',
    zIndex: 101,
    display: 'flex',
    flexDirection: 'column' as const,
  } as React.CSSProperties,
  
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #1f1f23',
  } as React.CSSProperties,
  
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
  } as React.CSSProperties,
  
  headerActions: {
    display: 'flex',
    gap: 8,
  } as React.CSSProperties,
  
  headerBtn: {
    padding: '6px 12px',
    borderRadius: 6,
    border: 'none',
    background: '#1f1f23',
    color: '#888',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  } as React.CSSProperties,
  
  list: {
    flex: 1,
    overflow: 'auto',
    padding: 12,
  } as React.CSSProperties,
  
  notification: {
    display: 'flex',
    gap: 12,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    background: '#0a0a0b',
    border: '1px solid #1f1f23',
  } as React.CSSProperties,
  
  notificationUnread: {
    background: '#1a1a1f',
    borderColor: '#2a2a30',
  } as React.CSSProperties,
  
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    flexShrink: 0,
  } as React.CSSProperties,
  
  notificationContent: {
    flex: 1,
    minWidth: 0,
  } as React.CSSProperties,
  
  notificationTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: '#fff',
    marginBottom: 2,
  } as React.CSSProperties,
  
  notificationMessage: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
  } as React.CSSProperties,
  
  notificationTime: {
    fontSize: 11,
    color: '#666',
  } as React.CSSProperties,
  
  empty: {
    padding: 40,
    textAlign: 'center' as const,
    color: '#666',
  } as React.CSSProperties,
  
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: 'none',
    background: 'transparent',
    color: '#888',
    fontSize: 18,
    cursor: 'pointer',
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICATION BELL
// ═══════════════════════════════════════════════════════════════════════════

export const NotificationBell: React.FC<NotificationBellProps> = ({ count, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      style={{
        ...styles.bell,
        ...(isHovered ? styles.bellHover : {}),
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      🔔
      {count > 0 && (
        <span style={styles.badge}>{count > 9 ? '9+' : count}</span>
      )}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// FORMAT TIME
// ═══════════════════════════════════════════════════════════════════════════

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes}m`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  return date.toLocaleDateString('fr-FR');
};

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICATION CENTER
// ═══════════════════════════════════════════════════════════════════════════

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onDismiss,
  onClear,
}) => {
  const getIcon = (type: NotificationType): string => {
    switch (type) {
      case 'checkpoint': return '🚦';
      case 'agent': return '🤖';
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div style={styles.panel}>
        {/* Header */}
        <div style={styles.header}>
          <span style={styles.title}>Notifications</span>
          <div style={styles.headerActions}>
            <button style={styles.headerBtn} onClick={onMarkAllRead}>
              Tout marquer lu
            </button>
            <button style={styles.headerBtn} onClick={onClear}>
              Effacer
            </button>
            <button style={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>
        
        {/* List */}
        <div style={styles.list}>
          {notifications.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔔</div>
              <div>Aucune notification</div>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  ...styles.notification,
                  ...(!notif.read ? styles.notificationUnread : {}),
                }}
                onClick={() => onMarkRead(notif.id)}
              >
                <div
                  style={{
                    ...styles.notificationIcon,
                    background: `${COLORS[notif.type]}20`,
                  }}
                >
                  {getIcon(notif.type)}
                </div>
                <div style={styles.notificationContent}>
                  <div style={styles.notificationTitle}>{notif.title}</div>
                  <div style={styles.notificationMessage}>{notif.message}</div>
                  <div style={styles.notificationTime}>{formatTime(notif.timestamp)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;
