/**
 * CHE·NU — Header avec Breadcrumb et Notifications
 */

import React, { useState } from 'react';

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
};

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface HeaderProps {
  breadcrumbs: BreadcrumbItem[];
  notifications: Notification[];
  userAvatar?: string;
  userName: string;
  onNavigate: (path: string) => void;
  onNotificationClick: (id: string) => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  breadcrumbs,
  notifications,
  userAvatar,
  userName,
  onNavigate,
  onNotificationClick,
  onProfileClick,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 260,
      right: 0,
      height: 60,
      background: COLORS.card,
      borderBottom: `1px solid ${COLORS.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      zIndex: 900,
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <span style={{ color: COLORS.muted, fontSize: 12 }}>›</span>
            )}
            {item.path ? (
              <button
                onClick={() => onNavigate(item.path!)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: index === breadcrumbs.length - 1 ? COLORS.text : COLORS.muted,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 8px',
                  borderRadius: 6,
                }}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </button>
            ) : (
              <span style={{
                color: COLORS.text,
                fontSize: 14,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Search */}
        <button style={{
          background: COLORS.bg,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          padding: '8px 16px',
          color: COLORS.muted,
          fontSize: 13,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minWidth: 200,
        }}>
          <span>🔍</span>
          <span>Rechercher...</span>
          <span style={{
            marginLeft: 'auto',
            fontSize: 11,
            background: COLORS.border,
            padding: '2px 6px',
            borderRadius: 4,
          }}>⌘K</span>
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: 40,
              height: 40,
              background: showNotifications ? `${COLORS.cyan}20` : 'transparent',
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 18,
                height: 18,
                background: COLORS.error,
                borderRadius: '50%',
                fontSize: 10,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Notifications */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              width: 360,
              marginTop: 8,
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '16px',
                borderBottom: `1px solid ${COLORS.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ color: COLORS.text, fontWeight: 500 }}>Notifications</span>
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.cyan,
                  fontSize: 12,
                  cursor: 'pointer',
                }}>
                  Tout marquer lu
                </button>
              </div>
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: 32, textAlign: 'center', color: COLORS.muted }}>
                    Aucune notification
                  </div>
                ) : (
                  notifications.map(notif => (
                    <button
                      key={notif.id}
                      onClick={() => onNotificationClick(notif.id)}
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: notif.read ? 'transparent' : `${COLORS.cyan}08`,
                        border: 'none',
                        borderBottom: `1px solid ${COLORS.border}`,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                      }}>
                        <span style={{ color: COLORS.text, fontSize: 13, fontWeight: 500 }}>
                          {notif.title}
                        </span>
                        <span style={{ color: COLORS.muted, fontSize: 11 }}>
                          {notif.time}
                        </span>
                      </div>
                      <p style={{ color: COLORS.muted, fontSize: 12, margin: 0 }}>
                        {notif.message}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <button
          onClick={onProfileClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 12px',
            background: 'transparent',
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: userAvatar ? `url(${userAvatar}) center/cover` : `linear-gradient(135deg, ${COLORS.sage}, ${COLORS.sand})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
          }}>
            {!userAvatar && '👤'}
          </div>
          <span style={{ color: COLORS.text, fontSize: 13 }}>{userName}</span>
          <span style={{ color: COLORS.muted, fontSize: 10 }}>▼</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
