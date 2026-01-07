/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — EMPTY STATE COMPONENTS                      ║
 * ║                    États Vides Unifiés pour le Bureau                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Features:
 * - Empty state générique
 * - Variantes par section
 * - Call to action intégré
 * - Illustrations
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: string;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BASE EMPTY STATE
// ═══════════════════════════════════════════════════════════════════════════════

export function EmptyState({
  icon = '📭',
  title,
  description,
  action,
  secondaryAction,
  size = 'md',
  className = '',
}: EmptyStateProps) {
  const sizeConfig = {
    sm: {
      icon: 'text-3xl',
      title: 'text-sm',
      description: 'text-xs',
      padding: 'py-6 px-4',
      button: 'px-3 py-1.5 text-xs',
    },
    md: {
      icon: 'text-5xl',
      title: 'text-base',
      description: 'text-sm',
      padding: 'py-12 px-6',
      button: 'px-4 py-2 text-sm',
    },
    lg: {
      icon: 'text-6xl',
      title: 'text-lg',
      description: 'text-base',
      padding: 'py-16 px-8',
      button: 'px-5 py-2.5 text-sm',
    },
  };

  const config = sizeConfig[size];

  return (
    <div 
      className={`
        flex flex-col items-center justify-center text-center
        ${config.padding}
        ${className}
      `}
      data-testid="empty-state"
    >
      {/* Icon */}
      <span className={`${config.icon} mb-4 block`}>{icon}</span>
      
      {/* Title */}
      <h3 className={`${config.title} font-medium text-[#E9E4D6] mb-2`}>
        {title}
      </h3>
      
      {/* Description */}
      {description && (
        <p className={`${config.description} text-[#5A5B5E] max-w-sm mb-6`}>
          {description}
        </p>
      )}
      
      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {action && (
            <button
              onClick={action.onClick}
              className={`
                ${config.button}
                font-medium rounded-lg
                bg-[#D8B26A] text-[#0D0E10]
                hover:bg-[#E9C87B] transition-colors
                flex items-center gap-2
              `}
              data-testid="empty-state-action"
            >
              {action.icon && <span>{action.icon}</span>}
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className={`
                ${config.button}
                text-[#8D8371] hover:text-[#E9E4D6]
                transition-colors
              `}
              data-testid="empty-state-secondary"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION-SPECIFIC EMPTY STATES
// ═══════════════════════════════════════════════════════════════════════════════

interface SectionEmptyStateProps {
  onAction?: () => void;
  className?: string;
}

// QuickCapture Empty
export function EmptyQuickCapture({ onAction, className }: SectionEmptyStateProps) {
  return (
    <EmptyState
      icon="📝"
      title="Aucune capture"
      description="Capturez rapidement vos idées, notes et pensées ici."
      action={onAction ? {
        label: 'Nouvelle capture',
        onClick: onAction,
        icon: '✏️',
      } : undefined}
      className={className}
    />
  );
}

// Threads Empty
export function EmptyThreads({ onAction, className }: SectionEmptyStateProps) {
  return (
    <EmptyState
      icon="💬"
      title="Aucun thread"
      description="Les threads sont vos conversations structurées. Commencez une nouvelle discussion."
      action={onAction ? {
        label: 'Nouveau thread',
        onClick: onAction,
        icon: '➕',
      } : undefined}
      className={className}
    />
  );
}

// DataFiles Empty
export function EmptyDataFiles({ onAction, className }: SectionEmptyStateProps) {
  return (
    <EmptyState
      icon="📁"
      title="Aucun fichier"
      description="Organisez vos fichiers dans des DataSpaces intelligents."
      action={onAction ? {
        label: 'Créer un DataSpace',
        onClick: onAction,
        icon: '📂',
      } : undefined}
      className={className}
    />
  );
}

// ActiveAgents Empty
export function EmptyActiveAgents({ onAction, className }: SectionEmptyStateProps) {
  return (
    <EmptyState
      icon="🤖"
      title="Aucun agent actif"
      description="Les agents travaillent pour vous. Embauchez-en un pour commencer."
      action={onAction ? {
        label: 'Parcourir les agents',
        onClick: onAction,
        icon: '🔍',
      } : undefined}
      className={className}
    />
  );
}

// Meetings Empty
export function EmptyMeetings({ onAction, className }: SectionEmptyStateProps) {
  return (
    <EmptyState
      icon="📅"
      title="Aucune réunion"
      description="Planifiez des réunions virtuelles avec participants humains et agents IA."
      action={onAction ? {
        label: 'Planifier une réunion',
        onClick: onAction,
        icon: '➕',
      } : undefined}
      className={className}
    />
  );
}

// Search Empty
export function EmptySearch({ query, className }: { query?: string; className?: string }) {
  return (
    <EmptyState
      icon="🔍"
      title={query ? `Aucun résultat pour "${query}"` : 'Aucun résultat'}
      description="Essayez avec d'autres termes de recherche."
      className={className}
    />
  );
}

// Error State
export function ErrorState({ 
  message, 
  onRetry, 
  className 
}: { 
  message?: string; 
  onRetry?: () => void; 
  className?: string;
}) {
  return (
    <EmptyState
      icon="⚠️"
      title="Une erreur est survenue"
      description={message || "Impossible de charger le contenu. Veuillez réessayer."}
      action={onRetry ? {
        label: 'Réessayer',
        onClick: onRetry,
        icon: '🔄',
      } : undefined}
      className={className}
    />
  );
}

// Loading State (alternative to skeleton)
export function LoadingState({ 
  message = 'Chargement...', 
  className 
}: { 
  message?: string; 
  className?: string;
}) {
  return (
    <div 
      className={`
        flex flex-col items-center justify-center py-12
        ${className}
      `}
      data-testid="loading-state"
    >
      <div className="w-8 h-8 border-2 border-[#D8B26A] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm text-[#5A5B5E]">{message}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PERMISSION STATES
// ═══════════════════════════════════════════════════════════════════════════════

export function NoAccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      icon="🔒"
      title="Accès restreint"
      description="Vous n'avez pas les permissions nécessaires pour accéder à ce contenu."
      className={className}
    />
  );
}

export function NotFoundState({ 
  onGoBack, 
  className 
}: { 
  onGoBack?: () => void; 
  className?: string;
}) {
  return (
    <EmptyState
      icon="🔎"
      title="Page introuvable"
      description="La page que vous cherchez n'existe pas ou a été déplacée."
      action={onGoBack ? {
        label: 'Retour',
        onClick: onGoBack,
        icon: '←',
      } : undefined}
      className={className}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default EmptyState;
