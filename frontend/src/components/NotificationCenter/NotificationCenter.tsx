/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — NOTIFICATION CENTER COMPONENT
   Centralized notification management UI
   ═══════════════════════════════════════════════════════════════════════════════ */

import React, { useState, useMemo, useCallback } from 'react';
import type { 
  Notification, 
  NotificationType, 
  NotificationFilter,
  NotificationGroup 
} from './types';
import { NOTIFICATION_ICONS, NOTIFICATION_COLORS } from './types';

// ════════════════════════════════════════════════════════════════════════════════
// PALETTE CHE·NU
// ════════════════════════════════════════════════════════════════════════════════

const COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  background: '#0c0a09',
  cardBg: '#111113',
  border: 'rgba(141, 131, 113, 0.2)',
};

// ════════════════════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════════════════════

const styles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 9998,
  },
  
  panel: {
    position: 'fixed' as const,
    top: 0,
    right: 0,
    bottom: 0,
    width: '400px',
    maxWidth: '100vw',
    backgroundColor: COLORS.cardBg,
    borderLeft: `1px solid ${COLORS.border}`,
    display: 'flex',
    flexDirection: 'column' as const,
    zIndex: 9999,
    animation: 'slideIn 0.2s ease-out',
  },
  
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: COLORS.softSand,
  },
  
  badge: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '10px',
    backgroundColor: COLORS.sacredGold,
    color: COLORS.uiSlate,
    fontWeight: 600,
  },
  
  headerActions: {
    display: 'flex',
    gap: '8px',
  },
  
  iconButton: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: COLORS.ancientStone,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    transition: 'all 0.15s ease',
  },
  
  filters: {
    display: 'flex',
    gap: '6px',
    padding: '12px 16px',
    borderBottom: `1px solid ${COLORS.border}`,
    overflowX: 'auto' as const,
  },
  
  filterChip: {
    padding: '6px 12px',
    fontSize: '12px',
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap' as const,
  },
  
  content: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '8px',
  },
  
  dateGroup: {
    marginBottom: '16px',
  },
  
  dateHeader: {
    fontSize: '11px',
    fontWeight: 600,
    color: COLORS.ancientStone,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    padding: '8px 12px',
    position: 'sticky' as const,
    top: 0,
    backgroundColor: COLORS.cardBg,
  },
  
  notificationItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '4px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  
  notificationIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
  },
  
  notificationContent: {
    flex: 1,
    minWidth: 0,
  },
  
  notificationTitle: {
    fontSize: '13px',
    fontWeight: 500,
    color: COLORS.softSand,
    marginBottom: '2px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  
  notificationMessage: {
    fontSize: '12px',
    color: COLORS.ancientStone,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    lineHeight: '1.4',
  },
  
  notificationMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '6px',
    fontSize: '11px',
    color: COLORS.ancientStone,
  },
  
  sphereTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: COLORS.background,
  },
  
  notificationActions: {
    display: 'flex',
    gap: '6px',
    marginTop: '8px',
  },
  
  actionButton: {
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: 500,
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  
  empty: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    color: COLORS.ancientStone,
    textAlign: 'center' as const,
  },
  
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5,
  },
  
  footer: {
    padding: '12px 16px',
    borderTop: `1px solid ${COLORS.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  footerButton: {
    padding: '8px 16px',
    fontSize: '12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// FILTER OPTIONS
// ════════════════════════════════════════════════════════════════════════════════

const FILTER_OPTIONS: Array<{ id: string; label: string; labelFr: string; icon: string; types?: NotificationType[] }> = [
  { id: 'all', label: 'All', labelFr: 'Tout', icon: '📬' },
  { id: 'unread', label: 'Unread', labelFr: 'Non lus', icon: '🔵' },
  { id: 'mentions', label: 'Mentions', labelFr: 'Mentions', icon: '@', types: ['mention'] },
  { id: 'agents', label: 'Agents', labelFr: 'Agents', icon: '🤖', types: ['agent'] },
  { id: 'threads', label: 'Threads', labelFr: 'Fils', icon: '💬', types: ['thread'] },
  { id: 'meetings', label: 'Meetings', labelFr: 'Réunions', icon: '📅', types: ['meeting'] },
];

// ════════════════════════════════════════════════════════════════════════════════
// PROPS
// ════════════════════════════════════════════════════════════════════════════════

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onArchiveAll: () => void;
  onOpenSettings?: () => void;
  locale?: 'en' | 'fr';
}

// ════════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════════

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes}min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  return date.toLocaleDateString();
};

const groupByDate = (notifications: Notification[]): Map<string, Notification[]> => {
  const groups = new Map<string, Notification[]>();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  notifications.forEach(notif => {
    const dateStr = notif.createdAt.toDateString();
    let key: string;
    
    if (dateStr === today) {
      key = "Aujourd'hui";
    } else if (dateStr === yesterday) {
      key = 'Hier';
    } else {
      key = notif.createdAt.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    }
    
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(notif);
  });

  return groups;
};

// ════════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onArchiveAll,
  onOpenSettings,
  locale = 'fr',
}) => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];
    
    if (activeFilter === 'unread') {
      filtered = filtered.filter(n => n.status === 'unread');
    } else {
      const filterOption = FILTER_OPTIONS.find(f => f.id === activeFilter);
      if (filterOption?.types) {
        filtered = filtered.filter(n => filterOption.types!.includes(n.type));
      }
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return filtered;
  }, [notifications, activeFilter]);

  // Group by date
  const groupedNotifications = useMemo(() => {
    return groupByDate(filteredNotifications);
  }, [filteredNotifications]);

  // Unread count
  const unreadCount = useMemo(() => {
    return notifications.filter(n => n.status === 'unread').length;
  }, [notifications]);

  // Handle notification click
  const handleNotificationClick = useCallback((notification: Notification) => {
    if (notification.status === 'unread') {
      onMarkAsRead(notification.id);
    }
    if (notification.primaryAction) {
      notification.primaryAction.action();
    }
  }, [onMarkAsRead]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div style={styles.overlay} onClick={onClose} />
      
      {/* Panel */}
      <div style={styles.panel}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <span style={{ fontSize: '20px' }}>🔔</span>
            <span style={styles.title}>
              {locale === 'fr' ? 'Notifications' : 'Notifications'}
            </span>
            {unreadCount > 0 && (
              <span style={styles.badge}>{unreadCount}</span>
            )}
          </div>
          <div style={styles.headerActions}>
            {onOpenSettings && (
              <button
                style={styles.iconButton}
                onClick={onOpenSettings}
                title={locale === 'fr' ? 'Paramètres' : 'Settings'}
              >
                ⚙️
              </button>
            )}
            <button
              style={styles.iconButton}
              onClick={onClose}
              title={locale === 'fr' ? 'Fermer' : 'Close'}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          {FILTER_OPTIONS.map(filter => (
            <button
              key={filter.id}
              style={{
                ...styles.filterChip,
                backgroundColor: activeFilter === filter.id ? COLORS.sacredGold : COLORS.background,
                color: activeFilter === filter.id ? COLORS.uiSlate : COLORS.softSand,
              }}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.icon} {locale === 'fr' ? filter.labelFr : filter.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={styles.content}>
          {filteredNotifications.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>🔔</div>
              <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                {locale === 'fr' ? 'Aucune notification' : 'No notifications'}
              </div>
              <div style={{ fontSize: '12px' }}>
                {locale === 'fr' 
                  ? 'Vous êtes à jour!' 
                  : "You're all caught up!"}
              </div>
            </div>
          ) : (
            Array.from(groupedNotifications.entries()).map(([date, notifs]) => (
              <div key={date} style={styles.dateGroup}>
                <div style={styles.dateHeader}>{date}</div>
                {notifs.map(notification => (
                  <div
                    key={notification.id}
                    style={{
                      ...styles.notificationItem,
                      backgroundColor: notification.status === 'unread' 
                        ? `${COLORS.sacredGold}10` 
                        : 'transparent',
                    }}
                    onClick={() => handleNotificationClick(notification)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = COLORS.background;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = notification.status === 'unread'
                        ? `${COLORS.sacredGold}10`
                        : 'transparent';
                    }}
                  >
                    {/* Icon */}
                    <div 
                      style={{
                        ...styles.notificationIcon,
                        backgroundColor: `${NOTIFICATION_COLORS[notification.type]}20`,
                      }}
                    >
                      {notification.icon || NOTIFICATION_ICONS[notification.type]}
                    </div>
                    
                    {/* Content */}
                    <div style={styles.notificationContent}>
                      <div style={styles.notificationTitle}>
                        {notification.status === 'unread' && (
                          <span style={{ 
                            display: 'inline-block',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: COLORS.cenoteTurquoise,
                            marginRight: '8px',
                          }} />
                        )}
                        {notification.title}
                      </div>
                      <div style={styles.notificationMessage}>
                        {notification.message}
                      </div>
                      <div style={styles.notificationMeta}>
                        <span>{formatTime(notification.createdAt)}</span>
                        {notification.sphereName && (
                          <span style={styles.sphereTag}>
                            {notification.sphereName}
                          </span>
                        )}
                        {notification.agentName && (
                          <span style={styles.sphereTag}>
                            🤖 {notification.agentName}
                          </span>
                        )}
                      </div>
                      
                      {/* Actions */}
                      {(notification.primaryAction || notification.secondaryAction) && (
                        <div style={styles.notificationActions}>
                          {notification.primaryAction && (
                            <button
                              style={{
                                ...styles.actionButton,
                                backgroundColor: COLORS.sacredGold,
                                color: COLORS.uiSlate,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                notification.primaryAction!.action();
                              }}
                            >
                              {locale === 'fr' && notification.primaryAction.labelFr
                                ? notification.primaryAction.labelFr
                                : notification.primaryAction.label}
                            </button>
                          )}
                          {notification.secondaryAction && (
                            <button
                              style={{
                                ...styles.actionButton,
                                backgroundColor: COLORS.background,
                                color: COLORS.softSand,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                notification.secondaryAction!.action();
                              }}
                            >
                              {locale === 'fr' && notification.secondaryAction.labelFr
                                ? notification.secondaryAction.labelFr
                                : notification.secondaryAction.label}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Dismiss button */}
                    {notification.dismissable !== false && (
                      <button
                        style={{
                          ...styles.iconButton,
                          opacity: 0.5,
                          fontSize: '12px',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDismiss(notification.id);
                        }}
                        title={locale === 'fr' ? 'Supprimer' : 'Dismiss'}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div style={styles.footer}>
            <button
              style={{
                ...styles.footerButton,
                backgroundColor: 'transparent',
                color: COLORS.ancientStone,
                border: `1px solid ${COLORS.border}`,
              }}
              onClick={onArchiveAll}
            >
              {locale === 'fr' ? 'Tout archiver' : 'Archive all'}
            </button>
            <button
              style={{
                ...styles.footerButton,
                backgroundColor: COLORS.sacredGold,
                color: COLORS.uiSlate,
              }}
              onClick={onMarkAllAsRead}
            >
              {locale === 'fr' ? 'Tout marquer comme lu' : 'Mark all as read'}
            </button>
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// NOTIFICATION BELL BUTTON
// ════════════════════════════════════════════════════════════════════════════════

interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  unreadCount,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative',
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        transition: 'all 0.15s ease',
      }}
      title="Notifications"
    >
      🔔
      {unreadCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            minWidth: '18px',
            height: '18px',
            borderRadius: '9px',
            backgroundColor: COLORS.sacredGold,
            color: COLORS.uiSlate,
            fontSize: '10px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
          }}
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default NotificationCenter;
