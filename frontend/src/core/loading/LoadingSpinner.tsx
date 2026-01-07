/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — LOADING SPINNER
 * Phase 10: Final Polish & Launch
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';

interface Props {
  size?: 'small' | 'medium' | 'large';
  fullscreen?: boolean;
}

export const LoadingSpinner: React.FC<Props> = ({ 
  size = 'medium', 
  fullscreen = false 
}) => {
  const sizes = {
    small: 24,
    medium: 48,
    large: 72,
  };

  const spinnerSize = sizes[size];

  const spinner = (
    <div className="spinner-container">
      <div className="spinner" />
      <style jsx>{`
        .spinner-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          width: ${spinnerSize}px;
          height: ${spinnerSize}px;
          border: 4px solid #e9e4d6;
          border-top-color: #d8b26a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fullscreen-loader">
        {spinner}
        <style jsx>{`
          .fullscreen-loader {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(233, 228, 214, 0.9);
            z-index: 9999;
          }
        `}</style>
      </div>
    );
  }

  return spinner;
};
