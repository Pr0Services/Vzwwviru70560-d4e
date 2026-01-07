/**
 * CHE·NU — Centre de Notifications
 */

import React, { useState, useEffect } from 'react';
import { Notification, NotificationType } from '../../types/notification.types';

const COLORS = {
  bg: '#0D1210',
  card: '#151A18',
  border: '#2A3530',
  sage: '#3F7249',
  cyan: '#00E5FF',
  text: '#E8E4DD',
  muted: '#888888',
  success: '#4ADE80',
  error: '#FF6B6B',
  warning: '#F39C12',
  info: '#3498DB',
};

const TYPE_CONFIG: Record<NotificationType, { icon: string; color: string }> = {
  info: { icon: 'ℹ️', color: COLORS.info },
  success: { icon: '✅', color: COLORS.success },
  warning: { icon: '⚠️', color: COLORS.warning },
  error: { icon: '❌', color: COLORS.error },
  ai: { icon: '🤖', color: COLORS.cyan },
  task: { icon: '📋', color: COLORS.sage },
  message: { icon: '💬', color: '#9B59B6' },
  system: { icon: '⚙️', color: COLORS.muted },
};

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
  onAction: (notification: Notification) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onDismissAll,
  onAction,
}) => {
  const [filter, setFilter] = useState<NotificationType | 'all'>('all');
  const [showSettings, setShowSettings] = useState(false);

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString('fr-CA');
  };

  const groupByDate = (notifs: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {};
    
    notifs.forEach(n => {
      const date = new Date(n.created_at);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let key: string;
      if (date.toDateString() === today.toDateString()) {
        key = "Aujourd'hui";
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = 'Hier';
      } else {
        key = date.toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' });
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(n);
    });
    
    return groups;
  };

  const grouped = groupByDate(filteredNotifications);

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.bg,
      fontFamily: "'Inter', sans-serif",
      paddingLeft: 260, // Sidebar width
      paddingTop: 60, // Header height
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}>
          <div>
            <h1 style={{ color: COLORS.text, fontSize: 24, margin: 0 }}>
              Notifications
            </h1>
            <p style={{ color: COLORS.muted, fontSize: 14, marginTop: 4 }}>
              {unreadCount > 0 ? `${unreadCount} non lue(s)` : 'Tout est lu!'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: 12 }}>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                style={{
                  padding: '10px 16px',
                  background: 'transparent',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  color: COLORS.text,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                ✓ Tout marquer lu
              </button>
            )}
            <button
              onClick={onDismissAll}
              style={{
                padding: '10px 16px',
                background: 'transparent',
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                color: COLORS.muted,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              🗑️ Tout effacer
            </button>
            <button
              onClick={() => setShowSettings(true)}
              style={{
                padding: '10px 16px',
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 8,
                color: COLORS.text,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          overflowX: 'auto',
          paddingBottom: 8,
        }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 16px',
              background: filter === 'all' ? COLORS.cyan : 'transparent',
              border: `1px solid ${filter === 'all' ? COLORS.cyan : COLORS.border}`,
              borderRadius: 20,
              color: filter === 'all' ? COLORS.bg : COLORS.text,
              fontSize: 13,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Toutes ({notifications.length})
          </button>
          {(Object.keys(TYPE_CONFIG) as NotificationType[]).map(type => {
            const count = notifications.filter(n => n.type === type).length;
            if (count === 0) return null;
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  padding: '8px 16px',
                  background: filter === type ? TYPE_CONFIG[type].color : 'transparent',
                  border: `1px solid ${filter === type ? TYPE_CONFIG[type].color : COLORS.border}`,
                  borderRadius: 20,
                  color: filter === type ? 'white' : COLORS.text,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{TYPE_CONFIG[type].icon}</span>
                <span>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 60,
            color: COLORS.muted,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
            <p>Aucune notification</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, notifs]) => (
            <div key={date} style={{ marginBottom: 32 }}>
              <h3 style={{
                color: COLORS.muted,
                fontSize: 12,
                textTransform: 'uppercase',
                marginBottom: 12,
                fontWeight: 600,
              }}>
                {date}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {notifs.map(notification => (
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (!notification.read) onMarkAsRead(notification.id);
                      if (notification.action) onAction(notification);
                    }}
                    style={{
                      padding: 16,
                      background: notification.read ? COLORS.card : `${TYPE_CONFIG[notification.type].color}10`,
                      border: `1px solid ${notification.read ? COLORS.border : TYPE_CONFIG[notification.type].color}40`,
                      borderRadius: 12,
                      cursor: notification.action ? 'pointer' : 'default',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                    }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: `${TYPE_CONFIG[notification.type].color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        flexShrink: 0,
                      }}>
                        {TYPE_CONFIG[notification.type].icon}
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: 4,
                        }}>
                          <span style={{
                            color: COLORS.text,
                            fontSize: 14,
                            fontWeight: notification.read ? 400 : 600,
                          }}>
                            {notification.title}
                          </span>
                          <span style={{ color: COLORS.muted, fontSize: 11, flexShrink: 0 }}>
                            {formatTime(notification.created_at)}
                          </span>
                        </div>
                        
                        <p style={{
                          color: COLORS.muted,
                          fontSize: 13,
                          margin: 0,
                          lineHeight: 1.5,
                        }}>
                          {notification.message}
                        </p>

                        {notification.action && (
                          <div style={{ marginTop: 12 }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAction(notification);
                              }}
                              style={{
                                padding: '6px 12px',
                                background: TYPE_CONFIG[notification.type].color,
                                border: 'none',
                                borderRadius: 6,
                                color: 'white',
                                fontSize: 12,
                                cursor: 'pointer',
                              }}
                            >
                              {notification.action.label || 'Voir'}
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDismiss(notification.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: COLORS.muted,
                          cursor: 'pointer',
                          padding: 4,
                          fontSize: 14,
                          opacity: 0.6,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
