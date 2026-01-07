/**
 * CHE·NU - PTC Status Bar
 * Affiche le statut de la Pre-Task Check
 */

import React from 'react';

interface PTCStatusBarProps {
  hasActiveTask: boolean;
  lastCheck: Date | null;
  onCheck?: () => void;
}

export const PTCStatusBar: React.FC<PTCStatusBarProps> = ({
  hasActiveTask,
  lastCheck,
  onCheck
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 16px',
      backgroundColor: hasActiveTask ? '#fef3c7' : '#ecfdf5',
      borderRadius: '8px',
      fontSize: '14px'
    }}>
      <span style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: hasActiveTask ? '#f59e0b' : '#10b981'
      }} />
      
      <span style={{ color: hasActiveTask ? '#92400e' : '#065f46' }}>
        {hasActiveTask ? 'Tâche en cours' : 'Prêt'}
      </span>
      
      {lastCheck && (
        <span style={{ color: '#6b7280', fontSize: '12px' }}>
          Dernière vérification: {lastCheck.toLocaleTimeString()}
        </span>
      )}
      
      {onCheck && (
        <button
          onClick={onCheck}
          style={{
            marginLeft: 'auto',
            padding: '4px 12px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Vérifier
        </button>
      )}
    </div>
  );
};

export default PTCStatusBar;
