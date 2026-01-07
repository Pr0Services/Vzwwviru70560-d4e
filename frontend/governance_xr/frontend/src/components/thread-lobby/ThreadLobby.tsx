/**
 * CHE·NU™ Thread Lobby Component
 * 
 * Entry point for threads displaying:
 * - Thread title and sphere
 * - Maturity badge with score
 * - Mode selection (Chat / Live / XR)
 * - Summary and last activity
 * - Live status indicator
 * 
 * R&D Compliance:
 * - Rule #1: Mode selection is human-initiated
 * - Rule #3: XR is projection only, not source of truth
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThreadLobby, useEnterThreadMode, usePrefetchXRBlueprint } from '../../hooks/use-governance-xr';
import { MaturityBadge } from './MaturityBadge';
import { ModeSelector } from './ModeSelector';
import { LiveIndicator } from './LiveIndicator';
import type {
  ThreadLobbyProps,
  ThreadEntryMode,
  MaturityLevel,
} from '../../types/governance-xr.types';

// =============================================================================
// CONSTANTS
// =============================================================================

const MODE_ICONS: Record<ThreadEntryMode, string> = {
  chat: '💬',
  live: '🔴',
  xr: '🥽',
};

const SPHERE_ICONS: Record<string, string> = {
  personal: '🏠',
  business: '💼',
  government: '🏛️',
  creative_studio: '🎨',
  community: '👥',
  social_media: '📱',
  entertainment: '🎬',
  my_team: '🤝',
  scholar: '📚',
};

// =============================================================================
// THREAD LOBBY COMPONENT
// =============================================================================

export function ThreadLobby({ threadId, onEnterMode, onBack }: ThreadLobbyProps) {
  const { data: lobby, isLoading, error } = useThreadLobby(threadId);
  const enterMode = useEnterThreadMode(threadId);
  const prefetchXR = usePrefetchXRBlueprint();

  // Prefetch XR blueprint when hovering XR mode
  const handleXRHover = () => {
    if (lobby?.available_modes.includes('xr')) {
      prefetchXR(threadId);
    }
  };

  const handleModeSelect = async (mode: ThreadEntryMode) => {
    try {
      await enterMode.mutateAsync(mode);
      onEnterMode(mode);
    } catch (err) {
      console.error('Failed to enter mode:', err);
    }
  };

  // Loading state
  if (isLoading) {
    return <ThreadLobbySkeleton />;
  }

  // Error state
  if (error || !lobby) {
    return (
      <ThreadLobbyError
        error={error as Error}
        onRetry={() => window.location.reload()}
        onBack={onBack}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="thread-lobby"
    >
      {/* Header with back button */}
      <header className="lobby-header">
        <button
          onClick={onBack}
          className="back-button"
          aria-label="Retour / Back"
        >
          ← Retour
        </button>
        
        {/* Sphere badge */}
        <div className="sphere-badge">
          <span className="sphere-icon">
            {SPHERE_ICONS[lobby.sphere_id] || '📁'}
          </span>
          <span className="sphere-name">{lobby.sphere_name}</span>
        </div>
      </header>

      {/* Main content */}
      <main className="lobby-content">
        {/* Thread title and type */}
        <div className="thread-header">
          <h1 className="thread-title">{lobby.thread_title}</h1>
          <span className="thread-type">{lobby.thread_type}</span>
        </div>

        {/* Maturity badge */}
        <div className="maturity-section">
          <MaturityBadge
            maturity={lobby.maturity}
            size="lg"
            showScore
            showSignals
          />
        </div>

        {/* Welcome message (microcopy) */}
        <p className="welcome-message">{lobby.welcome_message}</p>

        {/* Summary if available */}
        {lobby.summary && (
          <div className="summary-section">
            <h2>Résumé / Summary</h2>
            <p className="summary-text">{lobby.summary}</p>
          </div>
        )}

        {/* Last activity */}
        {lobby.last_activity && (
          <p className="last-activity">
            Dernière activité: {formatRelativeTime(lobby.last_activity)}
          </p>
        )}

        {/* Live indicator */}
        {lobby.live_active && (
          <LiveIndicator
            participantCount={lobby.live_participant_count || 0}
          />
        )}

        {/* Mode selector */}
        <div className="mode-section">
          <h2>Choisir un mode / Choose a mode</h2>
          <ModeSelector
            availableModes={lobby.available_modes}
            recommendedMode={lobby.recommended_mode}
            modeDescriptions={lobby.mode_descriptions}
            onSelect={handleModeSelect}
            onXRHover={handleXRHover}
            isLoading={enterMode.isPending}
            maturityLevel={lobby.maturity.level}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="lobby-footer">
        <p className="privacy-note">
          🔒 Ce Thread est {lobby.thread_type === 'personal' ? 'privé' : 'partagé'}.
          Vos données restent sous votre contrôle.
        </p>
      </footer>

      <style>{`
        .thread-lobby {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .lobby-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .back-button {
          background: none;
          border: none;
          font-size: 1rem;
          color: var(--color-text-secondary, #6B7280);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.25rem;
          transition: color 0.2s, background 0.2s;
        }

        .back-button:hover {
          color: var(--color-text-primary, #111827);
          background: var(--color-bg-secondary, #F3F4F6);
        }

        .sphere-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--color-bg-secondary, #F3F4F6);
          border-radius: 9999px;
          font-size: 0.875rem;
        }

        .sphere-icon {
          font-size: 1.25rem;
        }

        .sphere-name {
          text-transform: capitalize;
        }

        .lobby-content {
          flex: 1;
        }

        .thread-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .thread-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-text-primary, #111827);
          margin: 0 0 0.5rem 0;
        }

        .thread-type {
          font-size: 0.875rem;
          color: var(--color-text-secondary, #6B7280);
          text-transform: capitalize;
        }

        .maturity-section {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .welcome-message {
          text-align: center;
          color: var(--color-text-secondary, #6B7280);
          font-size: 1rem;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .summary-section {
          background: var(--color-bg-secondary, #F9FAFB);
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          margin-bottom: 1rem;
        }

        .summary-section h2 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-secondary, #6B7280);
          margin: 0 0 0.5rem 0;
        }

        .summary-text {
          font-size: 0.9375rem;
          color: var(--color-text-primary, #111827);
          margin: 0;
          line-height: 1.6;
        }

        .last-activity {
          text-align: center;
          font-size: 0.875rem;
          color: var(--color-text-tertiary, #9CA3AF);
          margin-bottom: 1.5rem;
        }

        .mode-section {
          margin-top: 2rem;
        }

        .mode-section h2 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text-primary, #111827);
          margin: 0 0 1rem 0;
          text-align: center;
        }

        .lobby-footer {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border, #E5E7EB);
        }

        .privacy-note {
          font-size: 0.75rem;
          color: var(--color-text-tertiary, #9CA3AF);
          text-align: center;
          margin: 0;
        }
      `}</style>
    </motion.div>
  );
}

// =============================================================================
// SKELETON COMPONENT
// =============================================================================

function ThreadLobbySkeleton() {
  return (
    <div className="thread-lobby-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-back" />
        <div className="skeleton-sphere" />
      </div>
      <div className="skeleton-content">
        <div className="skeleton-title" />
        <div className="skeleton-badge" />
        <div className="skeleton-text" />
        <div className="skeleton-modes" />
      </div>
      
      <style>{`
        .thread-lobby-skeleton {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
        }

        .skeleton-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
        }

        .skeleton-back, .skeleton-sphere {
          height: 2rem;
          background: var(--color-bg-secondary, #F3F4F6);
          border-radius: 0.5rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-back { width: 5rem; }
        .skeleton-sphere { width: 8rem; }

        .skeleton-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .skeleton-title {
          height: 2rem;
          width: 60%;
          background: var(--color-bg-secondary, #F3F4F6);
          border-radius: 0.5rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-badge {
          height: 4rem;
          width: 12rem;
          background: var(--color-bg-secondary, #F3F4F6);
          border-radius: 1rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-text {
          height: 1rem;
          width: 80%;
          background: var(--color-bg-secondary, #F3F4F6);
          border-radius: 0.25rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-modes {
          height: 8rem;
          width: 100%;
          background: var(--color-bg-secondary, #F3F4F6);
          border-radius: 0.75rem;
          animation: pulse 1.5s ease-in-out infinite;
          margin-top: 2rem;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// ERROR COMPONENT
// =============================================================================

interface ThreadLobbyErrorProps {
  error: Error | null;
  onRetry: () => void;
  onBack: () => void;
}

function ThreadLobbyError({ error, onRetry, onBack }: ThreadLobbyErrorProps) {
  return (
    <div className="thread-lobby-error">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <h1>Oops! Something went wrong</h1>
        <p>
          {error?.message || 'Unable to load thread. Please try again.'}
        </p>
        <div className="error-actions">
          <button onClick={onRetry} className="retry-button">
            Réessayer / Retry
          </button>
          <button onClick={onBack} className="back-button">
            Retour / Back
          </button>
        </div>
      </div>

      <style>{`
        .thread-lobby-error {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .error-content {
          text-align: center;
        }

        .error-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

        .error-content h1 {
          font-size: 1.5rem;
          color: var(--color-text-primary, #111827);
          margin: 0 0 0.5rem 0;
        }

        .error-content p {
          color: var(--color-text-secondary, #6B7280);
          margin: 0 0 1.5rem 0;
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .retry-button, .back-button {
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .retry-button {
          background: var(--color-primary, #3B82F6);
          color: white;
          border: none;
        }

        .retry-button:hover {
          background: var(--color-primary-dark, #2563EB);
        }

        .back-button {
          background: white;
          color: var(--color-text-primary, #111827);
          border: 1px solid var(--color-border, #E5E7EB);
        }

        .back-button:hover {
          background: var(--color-bg-secondary, #F9FAFB);
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// UTILITIES
// =============================================================================

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'à l\'instant / just now';
  if (diffMins < 60) return `il y a ${diffMins} min / ${diffMins} min ago`;
  if (diffHours < 24) return `il y a ${diffHours}h / ${diffHours}h ago`;
  if (diffDays < 7) return `il y a ${diffDays}j / ${diffDays}d ago`;
  
  return date.toLocaleDateString('fr-CA');
}

export default ThreadLobby;
