/**
 * I18N: microcopy.ts
 * PURPOSE: Bilingual microcopy for CHE·NU UI (French/English)
 * 
 * USAGE:
 *   import { getMicrocopy, setLanguage } from './i18n/microcopy';
 *   const t = getMicrocopy('thread_lobby.welcome');
 * 
 * R&D COMPLIANCE: ✅
 * - All user-facing text centralized
 * - French is primary (Quebec market first)
 * - English fallback available
 */

export type Language = 'fr' | 'en';

let currentLanguage: Language = 'fr';

export function setLanguage(lang: Language): void {
  currentLanguage = lang;
}

export function getLanguage(): Language {
  return currentLanguage;
}

// ============================================================================
// MICROCOPY DEFINITIONS
// ============================================================================

interface MicrocopyEntry {
  fr: string;
  en: string;
}

type MicrocopyKey = 
  // Thread Lobby
  | 'thread_lobby.welcome'
  | 'thread_lobby.welcome_collective'
  | 'thread_lobby.welcome_institutional'
  | 'thread_lobby.founding_intent'
  | 'thread_lobby.summary'
  | 'thread_lobby.no_summary'
  | 'thread_lobby.last_activity'
  | 'thread_lobby.choose_mode'
  | 'thread_lobby.privacy_notice'
  | 'thread_lobby.loading'
  | 'thread_lobby.error'
  | 'thread_lobby.retry'
  // Mode Selector
  | 'mode.chat'
  | 'mode.chat_desc'
  | 'mode.live'
  | 'mode.live_desc'
  | 'mode.xr'
  | 'mode.xr_desc'
  | 'mode.recommended'
  | 'mode.unavailable'
  | 'mode.requires_workshop'
  // Live Indicator
  | 'live.active'
  | 'live.participants'
  | 'live.join'
  | 'live.inactive'
  // Maturity Levels
  | 'maturity.seed'
  | 'maturity.sprout'
  | 'maturity.workshop'
  | 'maturity.studio'
  | 'maturity.org'
  | 'maturity.ecosystem'
  | 'maturity.score'
  | 'maturity.signals'
  // Maturity Signals
  | 'signal.has_founding_intent'
  | 'signal.has_decisions'
  | 'signal.has_actions'
  | 'signal.has_notes'
  | 'signal.has_links'
  | 'signal.has_summaries'
  | 'signal.has_memory_compressed'
  | 'signal.total_events'
  | 'signal.days_active'
  | 'signal.has_xr_blueprint'
  // XR Preflight
  | 'xr.preflight_title'
  | 'xr.available'
  | 'xr.unavailable'
  | 'xr.visible_zones'
  | 'xr.enabled_features'
  | 'xr.requirements'
  | 'xr.load_time'
  | 'xr.privacy_notice'
  | 'xr.projection_notice'
  | 'xr.proceed'
  | 'xr.cancel'
  | 'xr.webxr_required'
  // XR Zones
  | 'zone.intent_wall'
  | 'zone.decision_wall'
  | 'zone.action_table'
  | 'zone.memory_kiosk'
  | 'zone.timeline_strip'
  | 'zone.resource_shelf'
  // Governance Signals
  | 'governance.signal'
  | 'governance.signal_warn'
  | 'governance.signal_correct'
  | 'governance.signal_pause'
  | 'governance.signal_block'
  | 'governance.signal_escalate'
  | 'governance.acknowledge'
  | 'governance.patch_instruction'
  | 'governance.details'
  | 'governance.no_signals'
  // Governance Criteria
  | 'criterion.canon_guard'
  | 'criterion.security_guard'
  | 'criterion.budget_guard'
  | 'criterion.rate_limiter'
  | 'criterion.escalation_trigger'
  // Backlog
  | 'backlog.title'
  | 'backlog.type_error'
  | 'backlog.type_signal'
  | 'backlog.type_decision'
  | 'backlog.type_cost'
  | 'backlog.type_governance_debt'
  | 'backlog.severity_low'
  | 'backlog.severity_medium'
  | 'backlog.severity_high'
  | 'backlog.severity_critical'
  | 'backlog.status_open'
  | 'backlog.status_in_progress'
  | 'backlog.status_resolved'
  | 'backlog.status_wont_fix'
  | 'backlog.status_duplicate'
  | 'backlog.resolve'
  | 'backlog.escalate'
  | 'backlog.resolution_placeholder'
  | 'backlog.no_items'
  | 'backlog.fed_to_tuner'
  // Checkpoint
  | 'checkpoint.pending'
  | 'checkpoint.approve'
  | 'checkpoint.reject'
  | 'checkpoint.reason'
  // Time
  | 'time.just_now'
  | 'time.minutes_ago'
  | 'time.hours_ago'
  | 'time.days_ago'
  | 'time.seconds'
  // Common
  | 'common.loading'
  | 'common.error'
  | 'common.retry'
  | 'common.cancel'
  | 'common.save'
  | 'common.close'
  | 'common.submit'
  | 'common.confirm'
  | 'common.view_details'
  | 'common.hide_details';

const MICROCOPY: Record<MicrocopyKey, MicrocopyEntry> = {
  // Thread Lobby
  'thread_lobby.welcome': {
    fr: 'Bienvenue dans ton Thread',
    en: 'Welcome to your Thread',
  },
  'thread_lobby.welcome_collective': {
    fr: 'Bienvenue dans ce Thread collectif',
    en: 'Welcome to this collective Thread',
  },
  'thread_lobby.welcome_institutional': {
    fr: 'Bienvenue dans ce Thread institutionnel',
    en: 'Welcome to this institutional Thread',
  },
  'thread_lobby.founding_intent': {
    fr: 'Intention fondatrice',
    en: 'Founding Intent',
  },
  'thread_lobby.summary': {
    fr: 'Résumé récent',
    en: 'Recent Summary',
  },
  'thread_lobby.no_summary': {
    fr: 'Pas encore de résumé disponible',
    en: 'No summary available yet',
  },
  'thread_lobby.last_activity': {
    fr: 'Dernière activité',
    en: 'Last activity',
  },
  'thread_lobby.choose_mode': {
    fr: 'Comment veux-tu entrer?',
    en: 'How would you like to enter?',
  },
  'thread_lobby.privacy_notice': {
    fr: 'Ce Thread appartient à ton identité. Tes données restent les tiennes.',
    en: 'This Thread belongs to your identity. Your data stays yours.',
  },
  'thread_lobby.loading': {
    fr: 'Chargement du Thread...',
    en: 'Loading Thread...',
  },
  'thread_lobby.error': {
    fr: 'Impossible de charger le Thread',
    en: 'Failed to load Thread',
  },
  'thread_lobby.retry': {
    fr: 'Réessayer',
    en: 'Retry',
  },

  // Mode Selector
  'mode.chat': {
    fr: 'Chat',
    en: 'Chat',
  },
  'mode.chat_desc': {
    fr: 'Conversation texte avec tes agents',
    en: 'Text conversation with your agents',
  },
  'mode.live': {
    fr: 'Live',
    en: 'Live',
  },
  'mode.live_desc': {
    fr: 'Session en temps réel avec ton équipe',
    en: 'Real-time session with your team',
  },
  'mode.xr': {
    fr: 'XR',
    en: 'XR',
  },
  'mode.xr_desc': {
    fr: 'Environnement spatial immersif',
    en: 'Immersive spatial environment',
  },
  'mode.recommended': {
    fr: 'Recommandé',
    en: 'Recommended',
  },
  'mode.unavailable': {
    fr: 'Non disponible',
    en: 'Unavailable',
  },
  'mode.requires_workshop': {
    fr: 'Requiert niveau Workshop (25+)',
    en: 'Requires Workshop level (25+)',
  },

  // Live Indicator
  'live.active': {
    fr: 'EN DIRECT',
    en: 'LIVE',
  },
  'live.participants': {
    fr: 'participants',
    en: 'participants',
  },
  'live.join': {
    fr: 'Rejoindre',
    en: 'Join',
  },
  'live.inactive': {
    fr: 'Pas de session en cours',
    en: 'No active session',
  },

  // Maturity Levels
  'maturity.seed': {
    fr: 'Graine',
    en: 'Seed',
  },
  'maturity.sprout': {
    fr: 'Pousse',
    en: 'Sprout',
  },
  'maturity.workshop': {
    fr: 'Atelier',
    en: 'Workshop',
  },
  'maturity.studio': {
    fr: 'Studio',
    en: 'Studio',
  },
  'maturity.org': {
    fr: 'Organisation',
    en: 'Org',
  },
  'maturity.ecosystem': {
    fr: 'Écosystème',
    en: 'Ecosystem',
  },
  'maturity.score': {
    fr: 'Score de maturité',
    en: 'Maturity Score',
  },
  'maturity.signals': {
    fr: 'Signaux de maturité',
    en: 'Maturity Signals',
  },

  // Maturity Signals
  'signal.has_founding_intent': {
    fr: 'Intention fondatrice définie',
    en: 'Founding intent defined',
  },
  'signal.has_decisions': {
    fr: 'Décisions enregistrées',
    en: 'Decisions recorded',
  },
  'signal.has_actions': {
    fr: 'Actions créées',
    en: 'Actions created',
  },
  'signal.has_notes': {
    fr: 'Notes ajoutées',
    en: 'Notes added',
  },
  'signal.has_links': {
    fr: 'Liens établis',
    en: 'Links established',
  },
  'signal.has_summaries': {
    fr: 'Résumés générés',
    en: 'Summaries generated',
  },
  'signal.has_memory_compressed': {
    fr: 'Mémoire compressée',
    en: 'Memory compressed',
  },
  'signal.total_events': {
    fr: 'Nombre d\'événements',
    en: 'Event count',
  },
  'signal.days_active': {
    fr: 'Jours d\'activité',
    en: 'Days active',
  },
  'signal.has_xr_blueprint': {
    fr: 'Blueprint XR généré',
    en: 'XR Blueprint generated',
  },

  // XR Preflight
  'xr.preflight_title': {
    fr: 'Préparation XR',
    en: 'XR Preflight',
  },
  'xr.available': {
    fr: 'XR disponible',
    en: 'XR available',
  },
  'xr.unavailable': {
    fr: 'XR non disponible',
    en: 'XR unavailable',
  },
  'xr.visible_zones': {
    fr: 'Zones visibles',
    en: 'Visible Zones',
  },
  'xr.enabled_features': {
    fr: 'Fonctionnalités activées',
    en: 'Enabled Features',
  },
  'xr.requirements': {
    fr: 'Prérequis',
    en: 'Requirements',
  },
  'xr.load_time': {
    fr: 'Temps de chargement estimé',
    en: 'Estimated load time',
  },
  'xr.privacy_notice': {
    fr: 'L\'environnement XR est une projection de ton Thread. Tes données restent chiffrées.',
    en: 'The XR environment is a projection of your Thread. Your data stays encrypted.',
  },
  'xr.projection_notice': {
    fr: 'XR est une projection. Toutes les modifications passent par des événements Thread.',
    en: 'XR is a projection. All changes flow through Thread events.',
  },
  'xr.proceed': {
    fr: 'Entrer en XR',
    en: 'Enter XR',
  },
  'xr.cancel': {
    fr: 'Annuler',
    en: 'Cancel',
  },
  'xr.webxr_required': {
    fr: 'WebXR requis. Utilisez un navigateur compatible.',
    en: 'WebXR required. Use a compatible browser.',
  },

  // XR Zones
  'zone.intent_wall': {
    fr: 'Mur d\'Intention',
    en: 'Intent Wall',
  },
  'zone.decision_wall': {
    fr: 'Mur de Décisions',
    en: 'Decision Wall',
  },
  'zone.action_table': {
    fr: 'Table d\'Actions',
    en: 'Action Table',
  },
  'zone.memory_kiosk': {
    fr: 'Kiosque Mémoire',
    en: 'Memory Kiosk',
  },
  'zone.timeline_strip': {
    fr: 'Ligne du Temps',
    en: 'Timeline Strip',
  },
  'zone.resource_shelf': {
    fr: 'Étagère Ressources',
    en: 'Resource Shelf',
  },

  // Governance Signals
  'governance.signal': {
    fr: 'Signal de Gouvernance',
    en: 'Governance Signal',
  },
  'governance.signal_warn': {
    fr: 'Avertissement',
    en: 'Warning',
  },
  'governance.signal_correct': {
    fr: 'Correction',
    en: 'Correction',
  },
  'governance.signal_pause': {
    fr: 'Pause',
    en: 'Pause',
  },
  'governance.signal_block': {
    fr: 'Bloqué',
    en: 'Blocked',
  },
  'governance.signal_escalate': {
    fr: 'Escaladé',
    en: 'Escalated',
  },
  'governance.acknowledge': {
    fr: 'Accuser réception',
    en: 'Acknowledge',
  },
  'governance.patch_instruction': {
    fr: 'Instruction de correction',
    en: 'Patch Instruction',
  },
  'governance.details': {
    fr: 'Détails',
    en: 'Details',
  },
  'governance.no_signals': {
    fr: 'Aucun signal de gouvernance',
    en: 'No governance signals',
  },

  // Governance Criteria
  'criterion.canon_guard': {
    fr: 'Garde Canon',
    en: 'Canon Guard',
  },
  'criterion.security_guard': {
    fr: 'Garde Sécurité',
    en: 'Security Guard',
  },
  'criterion.budget_guard': {
    fr: 'Garde Budget',
    en: 'Budget Guard',
  },
  'criterion.rate_limiter': {
    fr: 'Limiteur de Débit',
    en: 'Rate Limiter',
  },
  'criterion.escalation_trigger': {
    fr: 'Déclencheur d\'Escalade',
    en: 'Escalation Trigger',
  },

  // Backlog
  'backlog.title': {
    fr: 'Backlog de Gouvernance',
    en: 'Governance Backlog',
  },
  'backlog.type_error': {
    fr: 'Erreur',
    en: 'Error',
  },
  'backlog.type_signal': {
    fr: 'Signal',
    en: 'Signal',
  },
  'backlog.type_decision': {
    fr: 'Décision',
    en: 'Decision',
  },
  'backlog.type_cost': {
    fr: 'Coût',
    en: 'Cost',
  },
  'backlog.type_governance_debt': {
    fr: 'Dette de Gouvernance',
    en: 'Governance Debt',
  },
  'backlog.severity_low': {
    fr: 'Faible',
    en: 'Low',
  },
  'backlog.severity_medium': {
    fr: 'Moyen',
    en: 'Medium',
  },
  'backlog.severity_high': {
    fr: 'Élevé',
    en: 'High',
  },
  'backlog.severity_critical': {
    fr: 'Critique',
    en: 'Critical',
  },
  'backlog.status_open': {
    fr: 'Ouvert',
    en: 'Open',
  },
  'backlog.status_in_progress': {
    fr: 'En cours',
    en: 'In Progress',
  },
  'backlog.status_resolved': {
    fr: 'Résolu',
    en: 'Resolved',
  },
  'backlog.status_wont_fix': {
    fr: 'Non corrigé',
    en: 'Won\'t Fix',
  },
  'backlog.status_duplicate': {
    fr: 'Doublon',
    en: 'Duplicate',
  },
  'backlog.resolve': {
    fr: 'Résoudre',
    en: 'Resolve',
  },
  'backlog.escalate': {
    fr: 'Escalader',
    en: 'Escalate',
  },
  'backlog.resolution_placeholder': {
    fr: 'Décris comment tu as résolu ce problème...',
    en: 'Describe how you resolved this issue...',
  },
  'backlog.no_items': {
    fr: 'Aucun élément dans le backlog',
    en: 'No items in backlog',
  },
  'backlog.fed_to_tuner': {
    fr: 'Transmis au Policy Tuner',
    en: 'Fed to Policy Tuner',
  },

  // Checkpoint
  'checkpoint.pending': {
    fr: 'Approbation requise',
    en: 'Approval Required',
  },
  'checkpoint.approve': {
    fr: 'Approuver',
    en: 'Approve',
  },
  'checkpoint.reject': {
    fr: 'Rejeter',
    en: 'Reject',
  },
  'checkpoint.reason': {
    fr: 'Raison',
    en: 'Reason',
  },

  // Time
  'time.just_now': {
    fr: 'À l\'instant',
    en: 'Just now',
  },
  'time.minutes_ago': {
    fr: 'il y a {n} min',
    en: '{n} min ago',
  },
  'time.hours_ago': {
    fr: 'il y a {n} h',
    en: '{n} h ago',
  },
  'time.days_ago': {
    fr: 'il y a {n} j',
    en: '{n} d ago',
  },
  'time.seconds': {
    fr: 'secondes',
    en: 'seconds',
  },

  // Common
  'common.loading': {
    fr: 'Chargement...',
    en: 'Loading...',
  },
  'common.error': {
    fr: 'Erreur',
    en: 'Error',
  },
  'common.retry': {
    fr: 'Réessayer',
    en: 'Retry',
  },
  'common.cancel': {
    fr: 'Annuler',
    en: 'Cancel',
  },
  'common.save': {
    fr: 'Enregistrer',
    en: 'Save',
  },
  'common.close': {
    fr: 'Fermer',
    en: 'Close',
  },
  'common.submit': {
    fr: 'Soumettre',
    en: 'Submit',
  },
  'common.confirm': {
    fr: 'Confirmer',
    en: 'Confirm',
  },
  'common.view_details': {
    fr: 'Voir les détails',
    en: 'View details',
  },
  'common.hide_details': {
    fr: 'Masquer les détails',
    en: 'Hide details',
  },
};

// ============================================================================
// API
// ============================================================================

/**
 * Get microcopy for given key in current language
 */
export function getMicrocopy(key: MicrocopyKey, params?: Record<string, string | number>): string {
  const entry = MICROCOPY[key];
  if (!entry) {
    console.warn(`[i18n] Missing microcopy key: ${key}`);
    return key;
  }
  
  let text = entry[currentLanguage] || entry.en;
  
  // Replace parameters like {n}
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
    });
  }
  
  return text;
}

/**
 * Shorthand alias for getMicrocopy
 */
export const t = getMicrocopy;

/**
 * Get microcopy in both languages (for bilingual display)
 */
export function getBilingual(key: MicrocopyKey, params?: Record<string, string | number>): { fr: string; en: string } {
  const entry = MICROCOPY[key];
  if (!entry) {
    return { fr: key, en: key };
  }
  
  let fr = entry.fr;
  let en = entry.en;
  
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      fr = fr.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
      en = en.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
    });
  }
  
  return { fr, en };
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  
  if (minutes < 1) {
    return t('time.just_now');
  } else if (minutes < 60) {
    return t('time.minutes_ago', { n: minutes });
  } else if (hours < 24) {
    return t('time.hours_ago', { n: hours });
  } else {
    return t('time.days_ago', { n: days });
  }
}

// ============================================================================
// REACT HOOKS
// ============================================================================

import { useCallback, useSyncExternalStore } from 'react';

// Simple store for language changes
const languageListeners = new Set<() => void>();

function subscribeToLanguage(callback: () => void): () => void {
  languageListeners.add(callback);
  return () => languageListeners.delete(callback);
}

function notifyLanguageChange(): void {
  languageListeners.forEach((listener) => listener());
}

// Override setLanguage to notify listeners
const originalSetLanguage = setLanguage;
(setLanguage as (lang: Language) => void) = (lang: Language) => {
  originalSetLanguage(lang);
  notifyLanguageChange();
};

/**
 * React hook for using microcopy with automatic re-render on language change
 */
export function useTranslation() {
  const lang = useSyncExternalStore(
    subscribeToLanguage,
    () => currentLanguage,
    () => 'fr' as Language
  );
  
  const translate = useCallback(
    (key: MicrocopyKey, params?: Record<string, string | number>) => getMicrocopy(key, params),
    [lang]
  );
  
  return {
    t: translate,
    language: lang,
    setLanguage,
    formatRelativeTime,
    getBilingual,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export type { MicrocopyKey };
export { MICROCOPY };
