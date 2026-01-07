/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║              CHE·NU™ — DEPTH SUGGESTION (Constitution-Compliant)             ║
 * ║                                                                              ║
 * ║              CONSTITUTION LAW #3:                                            ║
 * ║              DEPTH IS A SUGGESTION, NOT A NEGOTIATION                        ║
 * ║                                                                              ║
 * ║              Deeper analysis = intellectual choice, NEVER financial          ║
 * ║              No numbers, no tokens, no costs                                 ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React from 'react';

// ══════════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════════

interface DepthSuggestionProps {
  /** Called when user clicks to deepen analysis */
  onDeepen: () => void;
  /** Optional custom note (must not contain cost/token info) */
  customNote?: string;
  /** Optional custom action label */
  actionLabel?: string;
  /** Additional examples to show */
  examples?: string[];
  /** Visual variant */
  variant?: 'default' | 'compact' | 'prominent';
  /** Whether the suggestion is currently loading */
  isLoading?: boolean;
}

// ══════════════════════════════════════════════════════════════════════════════
// CONSTITUTION CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * CONSTITUTION LAW #3:
 * These are the approved intellectual framings.
 * NO numbers, NO tokens, NO costs, NO budget info.
 */
const DEFAULT_NOTE_HEADER = "Note analytique:";

const DEFAULT_NOTE_BODY = 
  "Une analyse plus approfondie pourrait révéler des insights supplémentaires " +
  "(ex: scénarios alternatifs, corrélations secondaires, simulations).";

const DEFAULT_ACTION_LABEL = "👉 Je peux approfondir si tu le souhaites.";

const DEFAULT_EXAMPLES = [
  "scénarios alternatifs",
  "corrélations secondaires", 
  "simulations",
];

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

/**
 * DepthSuggestion - Suggests deeper analysis as an intellectual choice
 * 
 * CONSTITUTION LAW #3 COMPLIANCE:
 * ✅ Presents depth as intellectual luxury
 * ✅ Uses only approved framings
 * ✅ No numbers, tokens, costs, or budget info
 * 
 * ❌ FORBIDDEN - Never shows:
 * - Cost estimates
 * - Token counts
 * - Budget impact
 * - Percentage usage
 * - Time estimates (that imply cost)
 */
export const DepthSuggestion: React.FC<DepthSuggestionProps> = ({
  onDeepen,
  customNote,
  actionLabel,
  examples = DEFAULT_EXAMPLES,
  variant = 'default',
  isLoading = false,
}) => {
  // Validate and sanitize custom content
  const safeNote = validateContent(customNote) || DEFAULT_NOTE_BODY;
  const safeActionLabel = validateContent(actionLabel) || DEFAULT_ACTION_LABEL;

  // Format examples string
  const examplesStr = examples.length > 0 
    ? `(ex: ${examples.join(', ')})`
    : '';

  return (
    <div className={`depth-suggestion depth-suggestion--${variant}`}>
      {/* Header */}
      <p className="depth-suggestion__header">
        {DEFAULT_NOTE_HEADER}
      </p>

      {/* Body - Intellectual framing only */}
      <p className="depth-suggestion__body">
        {safeNote}
        {examplesStr && !safeNote.includes('(ex:') && (
          <span className="depth-suggestion__examples"> {examplesStr}</span>
        )}
      </p>

      {/* Action button - No cost/token info */}
      <button 
        className="depth-suggestion__action"
        onClick={onDeepen}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="depth-suggestion__loading">
            <span className="loading-dot">.</span>
            <span className="loading-dot">.</span>
            <span className="loading-dot">.</span>
          </span>
        ) : (
          safeActionLabel
        )}
      </button>

      {/* ❌ FORBIDDEN - Never add these:
      <p className="cost-estimate">Coût estimé: ~0.30$</p>
      <p className="time-estimate">Temps: ~2 min (0.15$ de tokens)</p>
      <p className="tokens">Tokens additionnels: ~3,000</p>
      <div className="budget-impact">Impact budget: +15%</div>
      */}

      <style>{`
        .depth-suggestion {
          margin-top: 24px;
          padding: 16px 20px;
          background: linear-gradient(135deg, #f8f6f3 0%, #f5f3f0 100%);
          border-radius: 12px;
          border-left: 4px solid #D8B26A;
        }

        .depth-suggestion--compact {
          padding: 12px 16px;
        }

        .depth-suggestion--prominent {
          padding: 24px;
          background: linear-gradient(135deg, #faf8f5 0%, #f5f2ed 100%);
          box-shadow: 0 4px 12px rgba(216, 178, 106, 0.15);
        }

        .depth-suggestion__header {
          font-size: 13px;
          font-style: italic;
          color: #8D8371;
          margin: 0 0 8px 0;
        }

        .depth-suggestion__body {
          font-size: 15px;
          line-height: 1.6;
          color: #4a4a4a;
          margin: 0 0 16px 0;
        }

        .depth-suggestion__examples {
          color: #6a6a6a;
        }

        .depth-suggestion__action {
          background: none;
          border: none;
          padding: 0;
          font-size: 15px;
          font-weight: 500;
          color: #D8B26A;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .depth-suggestion__action:hover {
          color: #B8924A;
        }

        .depth-suggestion__action:disabled {
          cursor: wait;
          opacity: 0.7;
        }

        .depth-suggestion__loading {
          display: inline-flex;
          gap: 2px;
        }

        .loading-dot {
          animation: pulse 1s infinite;
        }

        .loading-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .loading-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .depth-suggestion {
            background: linear-gradient(135deg, #2a2a3a 0%, #252535 100%);
          }

          .depth-suggestion__header {
            color: #a0a0a0;
          }

          .depth-suggestion__body {
            color: #d0d0d0;
          }

          .depth-suggestion__examples {
            color: #909090;
          }
        }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ALTERNATIVE SUGGESTIONS (All Constitution-Compliant)
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Pre-defined suggestion variants - all intellectual, never financial.
 */
export const DEPTH_SUGGESTION_VARIANTS = {
  analysis: {
    note: "Une analyse plus approfondie pourrait révéler des insights supplémentaires.",
    examples: ["scénarios alternatifs", "corrélations secondaires", "simulations"],
    action: "👉 Je peux approfondir si tu le souhaites.",
  },
  
  research: {
    note: "Des recherches complémentaires pourraient enrichir cette analyse.",
    examples: ["sources additionnelles", "perspectives alternatives", "données comparatives"],
    action: "👉 Souhaites-tu que j'approfondisse les recherches?",
  },
  
  exploration: {
    note: "Cette piste mérite d'être explorée plus en détail.",
    examples: ["implications secondaires", "cas d'usage avancés", "projections"],
    action: "👉 Veux-tu que j'explore davantage?",
  },
  
  detail: {
    note: "Je peux fournir une analyse plus détaillée de certains aspects.",
    examples: ["breakdown technique", "analyse comparative", "cas limites"],
    action: "👉 Veux-tu plus de détails?",
  },
} as const;

// ══════════════════════════════════════════════════════════════════════════════
// VALIDATION HELPERS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Validate content doesn't contain forbidden information.
 * 
 * CONSTITUTION LAW #3: No numbers, tokens, costs, budget info.
 */
function validateContent(content?: string): string | null {
  if (!content) return null;

  // Forbidden patterns
  const forbiddenPatterns = [
    /\$\d/,              // Dollar amounts
    /€\d/,               // Euro amounts
    /\d+\s*tokens?/i,    // Token counts
    /\d+\s*crédits?/i,   // Credit counts
    /budget/i,           // Budget mentions
    /coût/i,             // Cost mentions (French)
    /cost/i,             // Cost mentions (English)
    /prix/i,             // Price mentions
    /\d+%/,              // Percentages
    /\d+\s*(min|sec)/i,  // Time estimates
    /\d+\s*minutes?/i,   // Time estimates
    /gratuit|payant/i,   // Free/paid mentions
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) {
      logger.warn(
        'DepthSuggestion: Content contains forbidden information. ' +
        'Using default. (Constitution LAW #3)'
      );
      return null;
    }
  }

  return content;
}

// ══════════════════════════════════════════════════════════════════════════════
// HOOK FOR DEPTH SUGGESTION
// ══════════════════════════════════════════════════════════════════════════════

interface UseDepthSuggestionResult {
  showSuggestion: boolean;
  isDeepening: boolean;
  handleDeepen: () => Promise<void>;
  setSuggestionAvailable: (available: boolean) => void;
}

/**
 * Hook for managing depth suggestion state.
 */
export const useDepthSuggestion = (
  onDeepen: () => Promise<void>
): UseDepthSuggestionResult => {
  const [showSuggestion, setShowSuggestion] = React.useState(false);
  const [isDeepening, setIsDeepening] = React.useState(false);

  const handleDeepen = React.useCallback(async () => {
    setIsDeepening(true);
    try {
      await onDeepen();
    } finally {
      setIsDeepening(false);
      setShowSuggestion(false);
    }
  }, [onDeepen]);

  const setSuggestionAvailable = React.useCallback((available: boolean) => {
    setShowSuggestion(available);
  }, []);

  return {
    showSuggestion,
    isDeepening,
    handleDeepen,
    setSuggestionAvailable,
  };
};

// ══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════════════════════════════

export default DepthSuggestion;
