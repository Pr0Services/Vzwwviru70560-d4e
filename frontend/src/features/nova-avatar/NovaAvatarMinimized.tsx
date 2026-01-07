/**
 * CHE·NU — Nova Avatar Minimized
 * ============================================================
 * Compact version when avatar is minimized.
 * Simple indicator that Nova is available.
 * 
 * @version 1.0.0
 */

import React from 'react';
import type { AvatarState } from '../../hooks/useNovaAvatar';
import styles from './NovaAvatarMinimized.module.css';

interface NovaAvatarMinimizedProps {
  state: AvatarState;
  onRestore: () => void;
}

export const NovaAvatarMinimized: React.FC<NovaAvatarMinimizedProps> = ({
  state,
  onRestore
}) => {
  return (
    <button
      className={`${styles.minimized} ${styles[`state_${state}`]}`}
      onClick={onRestore}
      title="Restore Nova avatar"
      aria-label="Restore Nova avatar"
    >
      <div className={styles.indicator}>
        <div className={styles.dot} />
        {state === 'speaking' && (
          <div className={styles.speakingRing} />
        )}
        {state === 'listening' && (
          <div className={styles.listeningRing} />
        )}
        {state === 'processing' && (
          <div className={styles.processingRing} />
        )}
      </div>
      <span className={styles.label}>Nova</span>
    </button>
  );
};

export default NovaAvatarMinimized;
