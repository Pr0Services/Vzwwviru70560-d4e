/**
 * CHE·NU — Orchestrator Indicator Component
 * ============================================================
 * Shows orchestrator status in the header when active.
 * Provides quick deactivation option.
 * 
 * @version 1.0.0
 */

import React from 'react';
import styles from './OrchestratorIndicator.module.css';

interface OrchestratorIndicatorProps {
  isActive: boolean;
  onDeactivate: () => void;
}

export const OrchestratorIndicator: React.FC<OrchestratorIndicatorProps> = ({
  isActive,
  onDeactivate
}) => {
  if (!isActive) return null;
  
  return (
    <div className={styles.indicator}>
      <div className={styles.status}>
        <div className={styles.dot} />
        <span className={styles.label}>Orchestrator</span>
      </div>
      <button
        className={styles.deactivate}
        onClick={onDeactivate}
        title="Deactivate orchestrator"
        aria-label="Deactivate orchestrator"
      >
        ×
      </button>
    </div>
  );
};

export default OrchestratorIndicator;
