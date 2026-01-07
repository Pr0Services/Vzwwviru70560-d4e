/**
 * CHE·NU Scope Lock Component
 * Governance: prevents unauthorized modifications
 */

import React, { useState } from 'react';
import { SemanticEncoding } from '../../../../sdk/core/encoding';

interface ScopeLockProps {
  encoding: SemanticEncoding;
  onChange: (enc: SemanticEncoding) => void;
  locked: boolean;
  onLockChange: (locked: boolean) => void;
}

export const ScopeLock: React.FC<ScopeLockProps> = ({
  encoding,
  onChange,
  locked,
  onLockChange,
}) => {
  const [confirmUnlock, setConfirmUnlock] = useState(false);

  const isLockScope = encoding.SCOPE === 'LOCK';

  const handleLock = () => {
    onChange({ ...encoding, SCOPE: 'LOCK' });
    onLockChange(true);
  };

  const handleUnlockRequest = () => {
    setConfirmUnlock(true);
  };

  const handleConfirmUnlock = () => {
    onLockChange(false);
    onChange({ ...encoding, SCOPE: 'SEL' });
    setConfirmUnlock(false);
  };

  const handleCancelUnlock = () => {
    setConfirmUnlock(false);
  };

  return (
    <div
      style={{
        padding: 12,
        border: locked ? '2px solid #dc2626' : '1px solid #e0e0e0',
        borderRadius: 8,
        background: locked ? '#fef2f2' : '#fff',
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>{locked ? '🔒' : '🔓'}</span>
          <span style={{ fontWeight: 600, fontSize: 13 }}>
            Scope Lock (Gouvernance)
          </span>
        </div>

        {!locked ? (
          <button
            onClick={handleLock}
            disabled={isLockScope}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              border: 'none',
              borderRadius: 6,
              background: '#dc2626',
              color: '#fff',
              cursor: isLockScope ? 'not-allowed' : 'pointer',
              opacity: isLockScope ? 0.6 : 1,
            }}
          >
            🔒 Verrouiller
          </button>
        ) : confirmUnlock ? (
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              onClick={handleConfirmUnlock}
              style={{
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 600,
                border: 'none',
                borderRadius: 6,
                background: '#f59e0b',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              ✓ Confirmer
            </button>
            <button
              onClick={handleCancelUnlock}
              style={{
                padding: '6px 12px',
                fontSize: 12,
                border: '1px solid #ddd',
                borderRadius: 6,
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              Annuler
            </button>
          </div>
        ) : (
          <button
            onClick={handleUnlockRequest}
            style={{
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              border: '1px solid #dc2626',
              borderRadius: 6,
              background: '#fff',
              color: '#dc2626',
              cursor: 'pointer',
            }}
          >
            🔓 Déverrouiller
          </button>
        )}
      </div>

      {locked && (
        <div style={{ fontSize: 11, color: '#991b1b' }}>
          ⚠️ Scope verrouillé. Les modifications sont restreintes.
          Supervision humaine requise (Tree Laws).
        </div>
      )}

      {!locked && (
        <div style={{ fontSize: 11, color: '#666' }}>
          Le verrouillage empêche les changements non autorisés et
          applique la gouvernance. Requis pour les opérations sensibles (SENS=1).
        </div>
      )}

      {/* Status indicators */}
      <div
        style={{
          marginTop: 8,
          display: 'flex',
          gap: 8,
          fontSize: 11,
        }}
      >
        <span
          style={{
            padding: '2px 6px',
            borderRadius: 4,
            background: isLockScope ? '#fee2e2' : '#f5f5f5',
            color: isLockScope ? '#991b1b' : '#666',
          }}
        >
          SCOPE={encoding.SCOPE}
        </span>
        {encoding.SENS === 1 && (
          <span
            style={{
              padding: '2px 6px',
              borderRadius: 4,
              background: '#fef3c7',
              color: '#92400e',
            }}
          >
            SENS=1 (sensible)
          </span>
        )}
        {encoding.RW === 1 && (
          <span
            style={{
              padding: '2px 6px',
              borderRadius: 4,
              background: '#fef3c7',
              color: '#92400e',
            }}
          >
            RW=1 (réécriture)
          </span>
        )}
      </div>
    </div>
  );
};

export default ScopeLock;
