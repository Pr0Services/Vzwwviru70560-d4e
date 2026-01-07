/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — NOVA MODULE                                     ║
 * ║                    System Intelligence Exports                                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * NOVA EST:
 * - L'intelligence système de CHE·NU
 * - Toujours présente (jamais "hired")
 * - Guide, aide à formuler, valide
 * 
 * NOVA NE FAIT PAS:
 * - Deviner les intentions
 * - Remplir automatiquement
 * - Activer des features sans consentement
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SCRIPTS
// ═══════════════════════════════════════════════════════════════════════════════

export {
  NOVA_SCRIPTS,
  NOVA_THEMES,
  BUREAU_SECTIONS_INFO,
  getScriptByTrigger,
  getScriptOrder,
  calculateProgress,
  getTotalOnboardingDuration,
} from './scripts/NovaOnboardingScripts';

export type {
  NovaScriptId,
  NovaTrigger,
  NovaScript,
  NovaAction,
  NovaOnboardingState,
  NovaTheme,
} from './scripts/NovaOnboardingScripts';

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

export { useNovaOnboarding } from './hooks/useNovaOnboarding';
export type { UseNovaOnboardingReturn } from './hooks/useNovaOnboarding';

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

export {
  NovaOnboardingProvider,
  useNovaOnboardingContext,
  NovaTriggerComponent,
} from './context/NovaOnboardingContext';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

export { NovaDialogue } from './components/NovaDialogue';
export { NovaThemeSelector } from './components/NovaThemeSelector';
export { NovaSphereOverview } from './components/NovaSphereOverview';
export { NovaBureauIntro } from './components/NovaBureauIntro';
export { NovaProgressIndicator } from './components/NovaProgressIndicator';

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  // Provider for wrapping app
  Provider: require('./context/NovaOnboardingContext').NovaOnboardingProvider,
  
  // Main hook
  useOnboarding: require('./hooks/useNovaOnboarding').useNovaOnboarding,
  
  // Components
  Dialogue: require('./components/NovaDialogue').NovaDialogue,
  ThemeSelector: require('./components/NovaThemeSelector').NovaThemeSelector,
  SphereOverview: require('./components/NovaSphereOverview').NovaSphereOverview,
  BureauIntro: require('./components/NovaBureauIntro').NovaBureauIntro,
};
