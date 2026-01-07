/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — ONBOARDING MODULE
 * Phase 4: Onboarding Experience
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Components
export { WelcomeWizard } from './components/WelcomeWizard';
export { GuidedTour } from './components/GuidedTour';
export { OnboardingProgress } from './components/OnboardingProgress';

// Hooks
export { useOnboarding } from './hooks/useOnboarding';

// Tours
export { CHENU_TOURS } from './tours/chenu-tours';

// Types
export type { OnboardingStage, OnboardingProgress, OnboardingStep } from './hooks/useOnboarding';
export type { TourStep } from './components/GuidedTour';
