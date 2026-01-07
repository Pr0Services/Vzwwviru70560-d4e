/**
 * CHE·NU™ — Nova Tutorial Overlay
 * Composant de tutoriel Nova (stub)
 */
import React from 'react';

export interface NovaTutorialOverlayProps {
  isVisible?: boolean;
  currentStep?: number;
  onComplete?: () => void;
  onSkip?: () => void;
}

export const NovaTutorialOverlay: React.FC<NovaTutorialOverlayProps> = ({
  isVisible = false,
  currentStep = 0,
  onComplete,
  onSkip,
}) => {
  if (!isVisible) return null;
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        background: '#1E1F22',
        padding: '24px',
        borderRadius: '12px',
        maxWidth: '400px',
      }}>
        <h3 style={{ color: '#D8B26A', marginBottom: '16px' }}>
          Bienvenue sur CHE·NU™
        </h3>
        <p style={{ color: '#E9E4D6', marginBottom: '24px' }}>
          Tutorial step {currentStep + 1}
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onSkip}>Passer</button>
          <button onClick={onComplete}>Continuer</button>
        </div>
      </div>
    </div>
  );
};

export default NovaTutorialOverlay;
