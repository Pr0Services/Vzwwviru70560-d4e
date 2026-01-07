/**
 * CHE·NU — Notifications Page
 */

import React, { useState } from 'react';
import { Notification, NotificationType } from '../../types/notification.types';

const COLORS = {
  bg: '#0D1210',
  card: '#151A18',
  border: '#2A3530',
  sand: '#D8B26A',
  sage: '#3F7249',
  cyan: '#00E5FF',
  text: '#E8E4DD',
  muted: '#888888',
  error: '#FF6B6B',
  warning: '#F39C12',
  success: '#4ADE80',
};

const TYPE_CONFIG: Record<NotificationType, { icon: string; color: string; label: string }> = {
  info: { icon: 'ℹ️', color: COLORS.cyan, label: 'Info' },
  success: { icon: '✅', color: COLORS.success, label: 'Succès' },
  warning: { icon: '⚠️', color: COLORS.warning, label: 'Attention' },
  error: { icon: '❌', color: COLORS.error, label: 'Erreur' },
  agent: { icon: '🤖', color: COLORS.sage, label: 'Agent' },
  system: { icon: '⚙️', color: COLORS.muted, label: 'Système' },
  mention: { icon: '@', color: COLORS.sand, label: 'Mention' },
  task: { icon: '📋', color: COLORS.cyan, label: 'Tâche' },
  reminder: { icon: '⏰', color: COLORS.warning, label: 'Rappel' },
};

// Mock data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    user_id: 'u1',
    type: 'agent',
    priority: 'normal',
    title: 'Nova a terminé l\'analyse',
    message: 'L\'analyse du projet CHE·NU v27 est complète. 3 recommandations disponibles.',
    source: { type: 'agent', id: 'nova', name: 'Nova' },
    action: { type: 'link', label: 'Voir les résultats', url: '/ai-labs/analysis/123' },
    read: false,
    dismissed: false,
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: '2',
    user_id: 'u1',
    type: 'task',
    priority: 'high',
    title: 'Échéance proche',
    message: 'La tâche "Finaliser module auth" expire dans 2 heures.',
    source: { type: 'system' },
    action: { type: 'link', label: 'Voir la tâche', url: '/tools/tasks/456' },
    read: false,
    dismissed: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '3',
    user_id: 'u1',
    type: 'success',
    priority: 'normal',
    title: 'Synchronisation terminée',
    message: 'Google Drive synchronisé avec succès. 47 fichiers mis à jour.',
    source: { type: 'external', name: 'Google Drive' },
    read: true,
    dismissed: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '4',
    user_id: 'u1',
    type: 'reminder',
    priority: 'normal',
    title: 'Standup quotidien',
    message: 'Réunion d\'équipe dans 15 minutes.',
    source: { type: 'system' },
    action: { type: 'link', label: 'Rejoindre', url: '/tools/calendar/event/789' },
    read: true,
    dismissed: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '5',
    user_id: 'u1',
    type: 'warning',
    priority: 'high',
    title: 'Quota stockage',
    message: 'Vous avez utilisé 85% de votre espace de stockage.',
    source: { type: 'system' },
    action: { type: 'link', label: 'Gérer le stockage', url: '/settings/storage' },
    read: false,
    dismissed: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

interface NotificationsPageProps {
  onNavigate: (path: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ 
      ...n, 
      read: true, 
      read_at: new Date().toISOString() 
    })));
  };

  const dismiss = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications
    .filter(n => filter === 'all' || !n.read)
    .filter(n => typeFilter === 'all' || n.type === typeFilter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 1000 * 60) return 'À l\'instant';
    if (diff < 1000 * 60 * 60) return `Il y a ${Math.floor(diff / (1000 * 60))} min`;
    if (diff < 1000 * 60 * 60 * 24) return `Il y a ${Math.floor(diff / (1000 * 60 * 60))} h`;
    return date.toLocaleDateString('fr-CA');
  };

  return (
    <div style={{
      padding: 24,
      fontFamily: "'Inter', sans-serif",
      maxWidth: 800,
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <div>
          <h1 style={{ color: COLORS.text, fontSize: 24, margin: 0 }}>
            🔔 Notifications
          </h1>
          <p style={{ color: COLORS.muted, fontSize: 14, marginTop: 4 }}>
            {unreadCount > 0 ? `${unreadCount} non lue(s)` : 'Tout est à jour'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              color: unreadCount > 0 ? COLORS.text : COLORS.muted,
              fontSize: 13,
              cursor: unreadCount > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            ✓ Tout marquer lu
          </button>
          <button
            onClick={() => onNavigate('/settings/notifications')}
            style={{
              padding: '10px 16px',
              background: COLORS.bg,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              color: COLORS.text,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            ⚙️ Paramètres
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: 16,
        marginBottom: 20,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
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
            }}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('unread')}
            style={{
              padding: '8px 16px',
              background: filter === 'unread' ? COLORS.cyan : 'transparent',
              border: `1px solid ${filter === 'unread' ? COLORS.cyan : COLORS.border}`,
              borderRadius: 20,
              color: filter === 'unread' ? COLORS.bg : COLORS.text,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Non lues {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setTypeFilter('all')}
            style={{
              padding: '6px 12px',
              background: typeFilter === 'all' ? COLORS.border : 'transparent',
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              color: COLORS.text,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Tous types
          </button>
          {(Object.keys(TYPE_CONFIG) as NotificationType[]).slice(0, 5).map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              style={{
                padding: '6px 12px',
                background: typeFilter === type ? `${TYPE_CONFIG[type].color}20` : 'transparent',
                border: `1px solid ${typeFilter === type ? TYPE_CONFIG[type].color : COLORS.border}`,
                borderRadius: 16,
                color: typeFilter === type ? TYPE_CONFIG[type].color : COLORS.muted,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span>{TYPE_CONFIG[type].icon}</span>
              <span>{TYPE_CONFIG[type].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredNotifications.length === 0 ? (
          <div style={{
            padding: 60,
            textAlign: 'center',
            color: COLORS.muted,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
            <p>Aucune notification</p>
          </div>
        ) : (
          filteredNotifications.map(notif => {
            const config = TYPE_CONFIG[notif.type];
            return (
              <div
                key={notif.id}
                onClick={() => {
                  if (!notif.read) markAsRead(notif.id);
                  if (notif.action?.url) onNavigate(notif.action.url);
                }}
                style={{
                  padding: 16,
                  background: notif.read ? COLORS.bg : `${config.color}08`,
                  border: `1px solid ${notif.read ? COLORS.border : config.color}40`,
                  borderRadius: 12,
                  cursor: notif.action ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  display: 'flex',
                  gap: 12,
                }}>
                  {/* Icon */}
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${config.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    flexShrink: 0,
                  }}>
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 4,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          color: COLORS.text,
                          fontSize: 14,
                          fontWeight: notif.read ? 400 : 500,
                        }}>
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: config.color,
                          }} />
                        )}
                        {notif.priority === 'high' && (
                          <span style={{
                            padding: '2px 6px',
                            background: `${COLORS.error}20`,
                            borderRadius: 4,
                            color: COLORS.error,
                            fontSize: 10,
                            fontWeight: 600,
                          }}>
                            URGENT
                          </span>
                        )}
                      </div>
                      <span style={{ color: COLORS.muted, fontSize: 12, flexShrink: 0 }}>
                        {formatTime(notif.created_at)}
                      </span>
                    </div>

                    <p style={{
                      color: COLORS.muted,
                      fontSize: 13,
                      margin: 0,
                      lineHeight: 1.5,
                    }}>
                      {notif.message}
                    </p>

                    {/* Actions */}
                    <div style={{
                      display: 'flex',
                      gap: 8,
                      marginTop: 12,
                    }}>
                      {notif.action && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (notif.action?.url) onNavigate(notif.action.url);
                          }}
                          style={{
                            padding: '6px 12px',
                            background: config.color,
                            border: 'none',
                            borderRadius: 6,
                            color: 'white',
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          {notif.action.label}
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismiss(notif.id);
                        }}
                        style={{
                          padding: '6px 12px',
                          background: 'transparent',
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: 6,
                          color: COLORS.muted,
                          fontSize: 12,
                          cursor: 'pointer',
                        }}
                      >
                        Ignorer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Clear All */}
      {notifications.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            onClick={clearAll}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              color: COLORS.muted,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            🗑️ Effacer toutes les notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
