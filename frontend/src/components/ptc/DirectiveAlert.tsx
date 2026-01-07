/**
 * CHE·NU - Directive Alert
 * Affiche les alertes de directive PTC
 */

import React from 'react';

interface DirectiveAlertProps {
  show: boolean;
  message?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  onDismiss?: () => void;
}

const alertStyles = {
  info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
  warning: { bg: '#fefce8', border: '#eab308', text: '#854d0e' },
  error: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
  success: { bg: '#f0fdf4', border: '#22c55e', text: '#166534' }
};

export const DirectiveAlert: React.FC<DirectiveAlertProps> = ({
  show,
  message = 'Vérification de gouvernance en cours...',
  type = 'info',
  onDismiss
}) => {
  if (!show) return null;

  const style = alertStyles[type];

  return (
    <div style={{
      padding: '12px 16px',
      backgroundColor: style.bg,
      borderLeft: `4px solid ${style.border}`,
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '18px' }}>
          {type === 'info' && 'ℹ️'}
          {type === 'warning' && '⚠️'}
          {type === 'error' && '❌'}
          {type === 'success' && '✅'}
        </span>
        <span style={{ color: style.text, fontSize: '14px' }}>
          {message}
        </span>
      </div>
      
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            color: style.text,
            opacity: 0.7
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default DirectiveAlert;
