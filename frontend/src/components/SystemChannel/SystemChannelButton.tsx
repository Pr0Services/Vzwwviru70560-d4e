/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — SYSTEM CHANNEL BUTTON
 * ═══════════════════════════════════════════════════════════════════════════
 * Bouton toujours visible pour communiquer avec l'Orchestrateur
 * 
 * RÈGLES:
 * - Toujours visible (header)
 * - Toujours accessible
 * - Context-aware
 * - Connecte UNIQUEMENT à l'Orchestrateur
 * - N'exécute rien
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';

interface SystemChannelButtonProps {
  isOpen: boolean;
  onClick: () => void;
  hasNotification?: boolean;
  language?: 'en' | 'fr';
  className?: string;
}

export const SystemChannelButton: React.FC<SystemChannelButtonProps> = ({
  isOpen,
  onClick,
  hasNotification = false,
  language = 'fr',
  className = ''
}) => {
  const labels = {
    en: 'System Channel',
    fr: 'Parler au système'
  };

  return (
    <button
      onClick={onClick}
      className={`system-channel-button ${isOpen ? 'open' : ''} ${className}`}
      aria-label={labels[language]}
      title={labels[language]}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: isOpen ? '#1E1F22' : 'transparent',
        border: '1px solid #3A3B3E',
        borderRadius: '8px',
        color: '#E9E4D6',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
    >
      {/* Icon */}
      <span style={{ fontSize: '18px' }}>🧭</span>
      
      {/* Label */}
      <span>{labels[language]}</span>
      
      {/* Notification badge */}
      {hasNotification && (
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '8px',
            height: '8px',
            background: '#D8B26A',
            borderRadius: '50%'
          }}
        />
      )}
    </button>
  );
};

export default SystemChannelButton;
