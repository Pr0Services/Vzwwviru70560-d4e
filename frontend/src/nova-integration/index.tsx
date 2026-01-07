// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — NOVA FRONTEND INTEGRATION
// Point d'entrée pour l'intégration Nova dans le frontend CHE·NU
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// PROVIDERS
// ─────────────────────────────────────────────────────────────────────────────────

export {
  NovaProvider,
  useNovaContext,
  useNovaChatbot,
  useNovaTutorials,
  useNovaSuggestions,
} from './providers/NovaProvider';

export type {
  NovaProviderState,
  NovaSettings,
  NovaContextValue,
} from './providers/NovaProvider';

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────────

export {
  NovaIntegrationWrapper,
} from './components/NovaIntegrationWrapper';

export type {
  NovaIntegrationConfig,
} from './components/NovaIntegrationWrapper';

export {
  NovaCommandPalette,
  BUILT_IN_COMMANDS,
} from './components/NovaCommandPalette';

export type {
  NovaCommand,
  CommandCategory,
} from './components/NovaCommandPalette';

export {
  NovaFloatingButton,
} from './components/NovaFloatingButton';

// ─────────────────────────────────────────────────────────────────────────────────
// RE-EXPORT NOVA CORE
// ─────────────────────────────────────────────────────────────────────────────────

// Core components
export {
  NovaChatInterface,
  NovaMessage as NovaMessageComponent,
  NovaTypingIndicator,
  NovaQuickActions,
} from '../core/nova/components/NovaComponents';

export {
  NovaFeedbackWidget,
  NovaInlineFeedback,
} from '../core/nova/components/NovaFeedbackWidget';

export {
  NovaProactiveSuggestions,
  NovaSuggestionCard,
} from '../core/nova/components/NovaProactiveSuggestions';

export {
  NovaTutorialOverlay,
} from '../core/nova/components/NovaTutorialOverlay';

// Core services
export { NovaService } from '../core/nova/NovaService';

// Engines
export { NovaIntentDetector } from '../core/nova/engines/NovaIntentDetector';
export { NovaKnowledgeEngine } from '../core/nova/engines/NovaKnowledgeEngine';
export { NovaResponseGenerator } from '../core/nova/engines/NovaResponseGenerator';
export { NovaTutorialEngine } from '../core/nova/engines/NovaTutorialEngine';
export { NovaQuestionEngine } from '../core/nova/engines/NovaQuestionEngine';
export { NovaProactiveEngine } from '../core/nova/engines/NovaProactiveEngine';

// ML Integration
export { NovaMLIntegration } from '../core/nova/integration/NovaMLIntegration';

// Hooks
export { useNova } from '../core/nova/hooks/useNova';

// Types
export type {
  NovaContext,
  NovaMessage,
  NovaUser,
  NovaSphere,
  NovaSection,
  NovaKnowledgeItem,
  NovaIntent,
} from '../core/nova/types/nova.types';

// ─────────────────────────────────────────────────────────────────────────────────
// QUICK INTEGRATION HELPER
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Helper pour une intégration rapide de Nova
 * 
 * @example
 * ```tsx
 * import { createNovaIntegration } from '@chenu/nova-frontend';
 * 
 * const Nova = createNovaIntegration({
 *   user: { id: 'user-123', name: 'Jo' },
 *   theme: 'dark',
 * });
 * 
 * function App() {
 *   return (
 *     <Nova.Provider>
 *       <YourApp />
 *       <Nova.FloatingButton />
 *       <Nova.CommandPalette />
 *     </Nova.Provider>
 *   );
 * }
 * ```
 */
export function createNovaIntegration(config: {
  user: { id: string; name: string; email?: string; level?: string };
  theme?: 'light' | 'dark' | 'system';
  language?: 'fr' | 'en';
  apiEndpoint?: string;
}) {
  const { NovaProvider: Provider } = require('./providers/NovaProvider');
  const { NovaCommandPalette: Palette } = require('./components/NovaCommandPalette');
  const { NovaFloatingButton: Button } = require('./components/NovaFloatingButton');

  return {
    Provider: (props: { children: React.ReactNode }) => (
      <Provider
        user={{
          id: config.user.id,
          name: config.user.name,
          email: config.user.email,
          level: config.user.level || 'explorer',
          language: config.language || 'fr',
        }}
        {...props}
      />
    ),
    FloatingButton: Button,
    CommandPalette: Palette,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// VERSION
// ─────────────────────────────────────────────────────────────────────────────────

export const NOVA_VERSION = '2.0.0';
export const NOVA_BUILD_DATE = '2025-01-XX';
