/**
 * CHE·NU™ V75 — NotificationCenter Component
 * ============================================
 * Real-time notifications with WebSocket
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';

// =============================================================================
// TYPES
// =============================================================================

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'checkpoint';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationCenterProps {
  onNotificationClick?: (notification: Notification) => void;
}

// =============================================================================
// ICONS
// =============================================================================

const BellIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckpointIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// =============================================================================
// HELPERS
// =============================================================================

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success': return <CheckIcon />;
    case 'warning': return <WarningIcon />;
    case 'error': return <ErrorIcon />;
    case 'checkpoint': return <CheckpointIcon />;
    default: return <InfoIcon />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'success': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'checkpoint': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    default: return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
  }
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return 'À l\'instant';
  if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
  if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)} h`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

// =============================================================================
// MOCK DATA (replace with real API)
// =============================================================================

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Checkpoint requis',
    message: 'L\'agent Analytics demande votre approbation pour accéder aux données.',
    type: 'checkpoint',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    read: false,
    actionUrl: '/governance',
    actionLabel: 'Voir',
  },
  {
    id: '2',
    title: 'Thread créé',
    message: 'Le thread "Projet Q1 2026" a été créé avec succès.',
    type: 'success',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    read: false,
  },
  {
    id: '3',
    title: 'Agent embauché',
    message: 'Research Agent est maintenant actif dans la sphère Scholar.',
    type: 'info',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: true,
  },
  {
    id: '4',
    title: 'Décision requise',
    message: '3 décisions en attente dans la sphère Business.',
    type: 'warning',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true,
    actionUrl: '/decisions',
    actionLabel: 'Décider',
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onNotificationClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const queryClient = useQueryClient();

  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Handle click
  const handleClick = useCallback((notification: Notification) => {
    markAsRead(notification.id);
    onNotificationClick?.(notification);
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  }, [markAsRead, onNotificationClick]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notification-center')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }
  }, [isOpen]);

  return (
    <div className="notification-center relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/60 hover:text-white transition-colors"
      >
        <BellIcon />
        
        {/* Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-96 max-h-[calc(100vh-200px)] bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white font-semibold">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    Tout marquer comme lu
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-white/40 hover:text-white/60"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-96">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-white/20 mb-2">
                    <BellIcon />
                  </div>
                  <p className="text-white/40 text-sm">Aucune notification</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`
                        p-4 hover:bg-white/5 transition-colors cursor-pointer
                        ${!notification.read ? 'bg-white/5' : ''}
                      `}
                      onClick={() => handleClick(notification)}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={`
                          flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border
                          ${getNotificationColor(notification.type)}
                        `}>
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-white/70'}`}>
                              {notification.title}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="text-white/30 hover:text-white/60 flex-shrink-0"
                            >
                              <XIcon />
                            </button>
                          </div>
                          <p className="text-sm text-white/50 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-white/30">
                              {formatTime(notification.timestamp)}
                            </span>
                            {notification.actionLabel && (
                              <span className="text-xs text-cyan-400 font-medium">
                                {notification.actionLabel} →
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Unread Indicator */}
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-white/10 text-center">
                <button className="text-sm text-cyan-400 hover:text-cyan-300">
                  Voir toutes les notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// =============================================================================
// TOAST NOTIFICATIONS
// =============================================================================

interface ToastProps {
  notification: Notification;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`
        flex items-start gap-3 p-4 rounded-lg border backdrop-blur-lg
        ${getNotificationColor(notification.type)}
      `}
    >
      <div className="flex-shrink-0">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white">{notification.title}</p>
        <p className="text-sm text-white/70 mt-1">{notification.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-white/50 hover:text-white flex-shrink-0"
      >
        <XIcon />
      </button>
    </motion.div>
  );
};

export default NotificationCenter;
