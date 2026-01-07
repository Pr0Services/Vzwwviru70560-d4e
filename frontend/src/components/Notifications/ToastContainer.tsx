/**
 * CHE·NU — Toast Notifications Container
 */

import React, { useState, useEffect } from 'react';
import { ToastNotification } from '../../types/notification.types';
import notificationService from '../../services/notification.service';

const COLORS = {
  bg: '#151A18',
  border: '#2A3530',
  text: '#E8E4DD',
  success: '#4ADE80',
  error: '#FF6B6B',
  warning: '#F39C12',
  info: '#00E5FF',
};

const TYPE_CONFIG = {
  success: { icon: '✓', color: COLORS.success },
  error: { icon: '✕', color: COLORS.error },
  warning: { icon: '⚠', color: COLORS.warning },
  info: { icon: 'ℹ', color: COLORS.info },
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.onToast((toast) => {
      setToasts(prev => [...prev, toast]);
      if (toast.duration !== 0) {
        setTimeout(() => removeToast(toast.id), toast.duration || 4000);
      }
    });
    return unsubscribe;
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 80,
      right: 20,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      maxWidth: 380,
      fontFamily: "'Inter', sans-serif",
    }}>
      {toasts.map((toast) => {
        const config = TYPE_CONFIG[toast.type];
        return (
          <div key={toast.id} style={{
            padding: '14px 18px',
            background: COLORS.bg,
            border: `1px solid ${config.color}40`,
            borderLeft: `4px solid ${config.color}`,
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: `${config.color}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: config.color, fontSize: 14, fontWeight: 600,
            }}>
              {config.icon}
            </div>
            <div style={{ flex: 1 }}>
              {toast.title && <div style={{ color: COLORS.text, fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{toast.title}</div>}
              <div style={{ color: toast.title ? '#888' : COLORS.text, fontSize: 13, lineHeight: 1.4 }}>{toast.message}</div>
              {toast.action && (
                <button onClick={() => { toast.action!.onClick(); removeToast(toast.id); }}
                  style={{ marginTop: 10, padding: '6px 12px', background: config.color, border: 'none', borderRadius: 6, color: 'white', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
                  {toast.action.label}
                </button>
              )}
            </div>
            <button onClick={() => removeToast(toast.id)} style={{ background: 'none', border: 'none', color: '#666', fontSize: 16, cursor: 'pointer', padding: 4 }}>×</button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
