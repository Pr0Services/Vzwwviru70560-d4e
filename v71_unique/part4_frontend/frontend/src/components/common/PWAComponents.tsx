/**
 * CHE·NU™ PWA Components
 * 
 * - PWAInstallPrompt: Prompts user to install the app
 * - PWAUpdateBanner: Shows when a new version is available
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React from 'react';
import {
  canInstall,
  isInstalled,
  promptInstall,
  onInstallAvailable,
  onUpdate,
  skipWaiting,
  PWAInstallPromptEvent,
} from '../../services/pwa/pwa.service';

// ═══════════════════════════════════════════════════════════════════════════
// PWA INSTALL PROMPT
// ═══════════════════════════════════════════════════════════════════════════

export interface PWAInstallPromptProps {
  /** Custom trigger element */
  children?: React.ReactNode;
  /** Show as banner instead of button */
  variant?: 'button' | 'banner' | 'minimal';
  /** Position for banner variant */
  position?: 'top' | 'bottom';
  /** Callback when install succeeds */
  onInstalled?: () => void;
  /** Callback when user dismisses */
  onDismissed?: () => void;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  children,
  variant = 'button',
  position = 'bottom',
  onInstalled,
  onDismissed,
}) => {
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    // Check if already installed
    if (isInstalled()) {
      return;
    }

    // Check dismissal state
    const dismissedAt = localStorage.getItem('chenu-pwa-dismissed');
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      // Don't show for 7 days after dismissal
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        setDismissed(true);
        return;
      }
    }

    // Listen for install availability
    const cleanup = onInstallAvailable(() => {
      setShowPrompt(true);
    });

    // Check if already available
    if (canInstall()) {
      setShowPrompt(true);
    }

    return cleanup;
  }, []);

  const handleInstall = async () => {
    const result = await promptInstall();
    
    if (result === 'accepted') {
      setShowPrompt(false);
      onInstalled?.();
    } else if (result === 'dismissed') {
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('chenu-pwa-dismissed', Date.now().toString());
    onDismissed?.();
  };

  if (!showPrompt || dismissed || isInstalled()) {
    return null;
  }

  // Custom trigger
  if (children) {
    return (
      <div onClick={handleInstall} style={{ cursor: 'pointer' }}>
        {children}
      </div>
    );
  }

  // Banner variant
  if (variant === 'banner') {
    return (
      <div className={`pwa-install-banner pwa-install-banner--${position}`}>
        <div className="pwa-install-banner__content">
          <div className="pwa-install-banner__icon">📱</div>
          <div className="pwa-install-banner__text">
            <strong>Installer CHE·NU™</strong>
            <span>Accédez plus rapidement, même hors ligne</span>
          </div>
        </div>
        <div className="pwa-install-banner__actions">
          <button className="pwa-install-banner__dismiss" onClick={handleDismiss}>
            Plus tard
          </button>
          <button className="pwa-install-banner__install" onClick={handleInstall}>
            Installer
          </button>
        </div>

        <style>{`
          .pwa-install-banner {
            position: fixed;
            left: 16px;
            right: 16px;
            background: linear-gradient(135deg, #6366f1, #818cf8);
            color: white;
            padding: 16px 20px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            box-shadow: 0 10px 40px rgba(99, 102, 241, 0.4);
            z-index: 9998;
            animation: slideIn 0.3s ease;
          }

          .pwa-install-banner--top {
            top: 16px;
          }

          .pwa-install-banner--bottom {
            bottom: 16px;
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .pwa-install-banner__content {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .pwa-install-banner__icon {
            font-size: 32px;
          }

          .pwa-install-banner__text {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .pwa-install-banner__text strong {
            font-size: 15px;
            font-weight: 600;
          }

          .pwa-install-banner__text span {
            font-size: 13px;
            opacity: 0.9;
          }

          .pwa-install-banner__actions {
            display: flex;
            gap: 8px;
          }

          .pwa-install-banner__dismiss,
          .pwa-install-banner__install {
            padding: 10px 16px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
          }

          .pwa-install-banner__dismiss {
            background: rgba(255, 255, 255, 0.15);
            color: white;
          }

          .pwa-install-banner__dismiss:hover {
            background: rgba(255, 255, 255, 0.25);
          }

          .pwa-install-banner__install {
            background: white;
            color: #6366f1;
          }

          .pwa-install-banner__install:hover {
            transform: scale(1.02);
          }

          @media (max-width: 640px) {
            .pwa-install-banner {
              flex-direction: column;
              text-align: center;
            }

            .pwa-install-banner__content {
              flex-direction: column;
            }

            .pwa-install-banner__actions {
              width: 100%;
            }

            .pwa-install-banner__dismiss,
            .pwa-install-banner__install {
              flex: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <button className="pwa-install-minimal" onClick={handleInstall}>
        <span className="pwa-install-minimal__icon">📲</span>
        <span className="pwa-install-minimal__text">Installer</span>

        <style>{`
          .pwa-install-minimal {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            background: var(--color-primary, #6366f1);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }

          .pwa-install-minimal:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          }

          .pwa-install-minimal__icon {
            font-size: 14px;
          }
        `}</style>
      </button>
    );
  }

  // Button variant (default)
  return (
    <button className="pwa-install-button" onClick={handleInstall}>
      <span className="pwa-install-button__icon">📱</span>
      <div className="pwa-install-button__text">
        <strong>Installer l'application</strong>
        <span>Accès rapide & hors ligne</span>
      </div>

      <style>{`
        .pwa-install-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pwa-install-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
        }

        .pwa-install-button__icon {
          font-size: 24px;
        }

        .pwa-install-button__text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .pwa-install-button__text strong {
          font-size: 14px;
          font-weight: 600;
        }

        .pwa-install-button__text span {
          font-size: 12px;
          opacity: 0.85;
        }
      `}</style>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PWA UPDATE BANNER
// ═══════════════════════════════════════════════════════════════════════════

export interface PWAUpdateBannerProps {
  /** Position of the banner */
  position?: 'top' | 'bottom';
  /** Callback when update is applied */
  onUpdate?: () => void;
  /** Callback when dismissed */
  onDismiss?: () => void;
}

export const PWAUpdateBanner: React.FC<PWAUpdateBannerProps> = ({
  position = 'bottom',
  onUpdate,
  onDismiss,
}) => {
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);

  React.useEffect(() => {
    const cleanup = onUpdate((registration) => {
      if (registration.waiting) {
        setUpdateAvailable(true);
      }
    });

    return cleanup;
  }, []);

  const handleUpdate = () => {
    setUpdating(true);
    skipWaiting();
    onUpdate?.();
    // Page will reload automatically via controllerchange event
  };

  const handleDismiss = () => {
    setUpdateAvailable(false);
    onDismiss?.();
  };

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className={`pwa-update-banner pwa-update-banner--${position}`}>
      <div className="pwa-update-banner__content">
        <span className="pwa-update-banner__icon">🆕</span>
        <span className="pwa-update-banner__text">
          Une nouvelle version de CHE·NU™ est disponible
        </span>
      </div>
      <div className="pwa-update-banner__actions">
        <button 
          className="pwa-update-banner__dismiss" 
          onClick={handleDismiss}
          disabled={updating}
        >
          Plus tard
        </button>
        <button 
          className="pwa-update-banner__update" 
          onClick={handleUpdate}
          disabled={updating}
        >
          {updating ? '🔄 Mise à jour...' : '✨ Mettre à jour'}
        </button>
      </div>

      <style>{`
        .pwa-update-banner {
          position: fixed;
          left: 16px;
          right: 16px;
          background: #1a1a1a;
          color: white;
          padding: 12px 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          z-index: 9999;
          animation: slideUp 0.3s ease;
        }

        .pwa-update-banner--top {
          top: 16px;
          animation-name: slideDown;
        }

        .pwa-update-banner--bottom {
          bottom: 16px;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pwa-update-banner__content {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pwa-update-banner__icon {
          font-size: 20px;
        }

        .pwa-update-banner__text {
          font-size: 14px;
        }

        .pwa-update-banner__actions {
          display: flex;
          gap: 8px;
        }

        .pwa-update-banner__dismiss,
        .pwa-update-banner__update {
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .pwa-update-banner__dismiss {
          background: transparent;
          color: #888;
        }

        .pwa-update-banner__dismiss:hover:not(:disabled) {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        .pwa-update-banner__update {
          background: #22c55e;
          color: white;
        }

        .pwa-update-banner__update:hover:not(:disabled) {
          background: #16a34a;
        }

        .pwa-update-banner__dismiss:disabled,
        .pwa-update-banner__update:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .pwa-update-banner {
            flex-direction: column;
            text-align: center;
          }

          .pwa-update-banner__actions {
            width: 100%;
          }

          .pwa-update-banner__dismiss,
          .pwa-update-banner__update {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PWA STATUS INDICATOR
// ═══════════════════════════════════════════════════════════════════════════

export const PWAStatus: React.FC = () => {
  const [status, setStatus] = React.useState({
    installed: false,
    canInstall: false,
    cacheSize: '0 B',
  });

  React.useEffect(() => {
    setStatus({
      installed: isInstalled(),
      canInstall: canInstall(),
      cacheSize: '...',
    });

    // Update can install state
    const cleanup = onInstallAvailable(() => {
      setStatus(s => ({ ...s, canInstall: true }));
    });

    return cleanup;
  }, []);

  return (
    <div className="pwa-status">
      <div className="pwa-status__item">
        <span>{status.installed ? '✅' : '📱'}</span>
        <span>{status.installed ? 'Installée' : 'Non installée'}</span>
      </div>
      {status.canInstall && !status.installed && (
        <PWAInstallPrompt variant="minimal" />
      )}

      <style>{`
        .pwa-status {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
        }

        .pwa-status__item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--color-text-secondary, #666);
        }
      `}</style>
    </div>
  );
};

export default {
  PWAInstallPrompt,
  PWAUpdateBanner,
  PWAStatus,
};
