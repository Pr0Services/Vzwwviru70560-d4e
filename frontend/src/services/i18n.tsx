// CHE·NU™ i18n — Internationalization System
// Multi-language support for global deployment

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ============================================================
// SUPPORTED LANGUAGES
// ============================================================

export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', dir: 'ltr' },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳', dir: 'ltr' },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
  ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷', dir: 'ltr' },
  ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// ============================================================
// TRANSLATION TYPES
// ============================================================

interface TranslationNamespace {
  [key: string]: string | TranslationNamespace;
}

export interface Translations {
  common: TranslationNamespace;
  nav: TranslationNamespace;
  spheres: TranslationNamespace;
  bureau: TranslationNamespace;
  threads: TranslationNamespace;
  tokens: TranslationNamespace;
  agents: TranslationNamespace;
  nova: TranslationNamespace;
  governance: TranslationNamespace;
  auth: TranslationNamespace;
  errors: TranslationNamespace;
  notifications: TranslationNamespace;
  settings: TranslationNamespace;
}

// ============================================================
// ENGLISH TRANSLATIONS (BASE)
// ============================================================

const en: Translations = {
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    refresh: 'Refresh',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    confirm: 'Confirm',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    more: 'More',
    less: 'Less',
    all: 'All',
    none: 'None',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
    help: 'Help',
  },
  nav: {
    home: 'Home',
    workspace: 'Workspace',
    nova: 'Nova',
    notifications: 'Notifications',
    menu: 'Menu',
  },
  // 8 Spheres (FROZEN - Memory Prompt)
  spheres: {
    personal: {
      name: 'Personal',
      description: 'Personal life management',
    },
    business: {
      name: 'Business',
      description: 'Business operations',
    },
    government: {
      name: 'Government & Institutions',
      description: 'Government interactions',
    },
    studio: {
      name: 'Creative Studio',
      description: 'Creative projects',
    },
    community: {
      name: 'Community',
      description: 'Community engagement',
    },
    social: {
      name: 'Social & Media',
      description: 'Social media management',
    },
    entertainment: {
      name: 'Entertainment',
      description: 'Entertainment activities',
    },
    team: {
      name: 'My Team',
      description: 'Team collaboration',
    },
  },
  // 10 Bureau Sections (NON-NEGOTIABLE - Memory Prompt)
  bureau: {
    dashboard: 'Dashboard',
    notes: 'Notes',
    tasks: 'Tasks',
    projects: 'Projects',
    threads: 'Threads (.chenu)',
    meetings: 'Meetings',
    data: 'Data / Database',
    agents: 'Agents',
    reports: 'Reports / History',
    budget: 'Budget & Governance',
  },
  threads: {
    title: 'Threads',
    createNew: 'Create New Thread',
    active: 'Active',
    paused: 'Paused',
    archived: 'Archived',
    tokenBudget: 'Token Budget',
    tokensUsed: 'Tokens Used',
    tokensRemaining: 'Tokens Remaining',
    sendMessage: 'Send Message',
    typeMessage: 'Type your message...',
    encoding: {
      enabled: 'Encoding Enabled',
      disabled: 'Encoding Disabled',
      savings: 'Encoding Savings',
    },
  },
  tokens: {
    title: 'Tokens',
    balance: 'Token Balance',
    allocated: 'Allocated',
    used: 'Used',
    remaining: 'Remaining',
    allocate: 'Allocate Tokens',
    transfer: 'Transfer',
    history: 'Usage History',
    budgetAlert: 'Budget Alert',
    lowBudget: 'Low token budget',
    // Memory Prompt Compliance
    disclaimer: 'Tokens are internal utility credits, not cryptocurrency.',
  },
  agents: {
    title: 'Agents',
    available: 'Available Agents',
    myAgents: 'My Agents',
    execute: 'Execute',
    executing: 'Executing...',
    completed: 'Completed',
    failed: 'Failed',
    cost: 'Cost',
    scope: 'Scope',
    hire: 'Hire Agent',
    fire: 'Release Agent',
  },
  nova: {
    title: 'Nova',
    subtitle: 'System Intelligence',
    askNova: 'Ask Nova...',
    insights: 'Insights',
    suggestions: 'Suggestions',
    guidance: 'Guidance',
    // Memory Prompt: Nova is SYSTEM intelligence, NEVER hired
    systemNote: 'Nova is always present as system intelligence.',
  },
  // 10 Laws of Governance
  governance: {
    title: 'Governance',
    laws: {
      title: '10 Laws of Governance',
      law1: 'Consent Primacy',
      law2: 'Temporal Sovereignty',
      law3: 'Contextual Fidelity',
      law4: 'Hierarchical Respect',
      law5: 'Audit Completeness',
      law6: 'Encoding Transparency',
      law7: 'Agent Non-Autonomy',
      law8: 'Budget Accountability',
      law9: 'Cross-Sphere Isolation',
      law10: 'Deletion Completeness',
    },
    audit: 'Audit Log',
    compliance: 'Compliance Score',
    checkPassed: 'Governance check passed',
    checkFailed: 'Governance check failed',
  },
  auth: {
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    rememberMe: 'Remember Me',
    orContinueWith: 'Or continue with',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    consent: {
      title: 'Consent Required',
      terms: 'I accept the Terms of Service',
      governance: 'I accept the 10 Laws of Governance',
      dataProcessing: 'I consent to data processing',
    },
  },
  errors: {
    generic: 'An error occurred',
    network: 'Network error',
    unauthorized: 'Unauthorized',
    forbidden: 'Forbidden',
    notFound: 'Not found',
    validation: 'Validation error',
    tokenExpired: 'Session expired',
    budgetExceeded: 'Token budget exceeded',
    governanceFailed: 'Governance check failed',
  },
  notifications: {
    title: 'Notifications',
    markAllRead: 'Mark all as read',
    clearAll: 'Clear all',
    empty: 'No notifications',
    types: {
      nova: 'Nova Insight',
      agent: 'Agent Update',
      thread: 'Thread Activity',
      token: 'Token Alert',
      governance: 'Governance',
      system: 'System',
    },
  },
  settings: {
    title: 'Settings',
    general: 'General',
    appearance: 'Appearance',
    language: 'Language',
    notifications: 'Notifications',
    privacy: 'Privacy',
    security: 'Security',
    theme: {
      title: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
  },
};

// ============================================================
// FRENCH TRANSLATIONS
// ============================================================

const fr: Translations = {
  common: {
    loading: 'Chargement...',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    create: 'Créer',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    refresh: 'Actualiser',
    back: 'Retour',
    next: 'Suivant',
    previous: 'Précédent',
    confirm: 'Confirmer',
    close: 'Fermer',
    yes: 'Oui',
    no: 'Non',
    ok: 'OK',
    more: 'Plus',
    less: 'Moins',
    all: 'Tout',
    none: 'Aucun',
    settings: 'Paramètres',
    profile: 'Profil',
    logout: 'Déconnexion',
    help: 'Aide',
  },
  nav: {
    home: 'Accueil',
    workspace: 'Espace de travail',
    nova: 'Nova',
    notifications: 'Notifications',
    menu: 'Menu',
  },
  // 8 Sphères (FIGÉ - Memory Prompt)
  spheres: {
    personal: {
      name: 'Personnel',
      description: 'Gestion de vie personnelle',
    },
    business: {
      name: 'Entreprise',
      description: 'Opérations commerciales',
    },
    government: {
      name: 'Gouvernement & Institutions',
      description: 'Interactions gouvernementales',
    },
    studio: {
      name: 'Studio de création',
      description: 'Projets créatifs',
    },
    community: {
      name: 'Communauté',
      description: 'Engagement communautaire',
    },
    social: {
      name: 'Réseaux sociaux',
      description: 'Gestion des médias sociaux',
    },
    entertainment: {
      name: 'Divertissement',
      description: 'Activités de divertissement',
    },
    team: {
      name: 'Mon équipe',
      description: 'Collaboration d\'équipe',
    },
  },
  // 10 Sections Bureau (NON-NÉGOCIABLE - Memory Prompt)
  bureau: {
    dashboard: 'Tableau de bord',
    notes: 'Notes',
    tasks: 'Tâches',
    projects: 'Projets',
    threads: 'Fils (.chenu)',
    meetings: 'Réunions',
    data: 'Données / Base de données',
    agents: 'Agents',
    reports: 'Rapports / Historique',
    budget: 'Budget & Gouvernance',
  },
  threads: {
    title: 'Fils de discussion',
    createNew: 'Créer un nouveau fil',
    active: 'Actif',
    paused: 'En pause',
    archived: 'Archivé',
    tokenBudget: 'Budget de tokens',
    tokensUsed: 'Tokens utilisés',
    tokensRemaining: 'Tokens restants',
    sendMessage: 'Envoyer',
    typeMessage: 'Tapez votre message...',
    encoding: {
      enabled: 'Encodage activé',
      disabled: 'Encodage désactivé',
      savings: 'Économies d\'encodage',
    },
  },
  tokens: {
    title: 'Tokens',
    balance: 'Solde de tokens',
    allocated: 'Alloués',
    used: 'Utilisés',
    remaining: 'Restants',
    allocate: 'Allouer des tokens',
    transfer: 'Transférer',
    history: 'Historique d\'utilisation',
    budgetAlert: 'Alerte budget',
    lowBudget: 'Budget de tokens faible',
    disclaimer: 'Les tokens sont des crédits utilitaires internes, pas une cryptomonnaie.',
  },
  agents: {
    title: 'Agents',
    available: 'Agents disponibles',
    myAgents: 'Mes agents',
    execute: 'Exécuter',
    executing: 'Exécution en cours...',
    completed: 'Terminé',
    failed: 'Échoué',
    cost: 'Coût',
    scope: 'Portée',
    hire: 'Embaucher',
    fire: 'Libérer',
  },
  nova: {
    title: 'Nova',
    subtitle: 'Intelligence Système',
    askNova: 'Demander à Nova...',
    insights: 'Aperçus',
    suggestions: 'Suggestions',
    guidance: 'Guidance',
    systemNote: 'Nova est toujours présente en tant qu\'intelligence système.',
  },
  governance: {
    title: 'Gouvernance',
    laws: {
      title: '10 Lois de Gouvernance',
      law1: 'Primauté du Consentement',
      law2: 'Souveraineté Temporelle',
      law3: 'Fidélité Contextuelle',
      law4: 'Respect Hiérarchique',
      law5: 'Complétude d\'Audit',
      law6: 'Transparence d\'Encodage',
      law7: 'Non-Autonomie des Agents',
      law8: 'Responsabilité Budgétaire',
      law9: 'Isolation Inter-Sphères',
      law10: 'Complétude de Suppression',
    },
    audit: 'Journal d\'audit',
    compliance: 'Score de conformité',
    checkPassed: 'Vérification de gouvernance réussie',
    checkFailed: 'Vérification de gouvernance échouée',
  },
  auth: {
    login: 'Connexion',
    register: 'Inscription',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    rememberMe: 'Se souvenir de moi',
    orContinueWith: 'Ou continuer avec',
    noAccount: 'Pas encore de compte ?',
    hasAccount: 'Déjà un compte ?',
    consent: {
      title: 'Consentement requis',
      terms: 'J\'accepte les Conditions d\'utilisation',
      governance: 'J\'accepte les 10 Lois de Gouvernance',
      dataProcessing: 'Je consens au traitement des données',
    },
  },
  errors: {
    generic: 'Une erreur est survenue',
    network: 'Erreur réseau',
    unauthorized: 'Non autorisé',
    forbidden: 'Interdit',
    notFound: 'Non trouvé',
    validation: 'Erreur de validation',
    tokenExpired: 'Session expirée',
    budgetExceeded: 'Budget de tokens dépassé',
    governanceFailed: 'Vérification de gouvernance échouée',
  },
  notifications: {
    title: 'Notifications',
    markAllRead: 'Tout marquer comme lu',
    clearAll: 'Tout effacer',
    empty: 'Aucune notification',
    types: {
      nova: 'Aperçu Nova',
      agent: 'Mise à jour Agent',
      thread: 'Activité de fil',
      token: 'Alerte Token',
      governance: 'Gouvernance',
      system: 'Système',
    },
  },
  settings: {
    title: 'Paramètres',
    general: 'Général',
    appearance: 'Apparence',
    language: 'Langue',
    notifications: 'Notifications',
    privacy: 'Confidentialité',
    security: 'Sécurité',
    theme: {
      title: 'Thème',
      light: 'Clair',
      dark: 'Sombre',
      system: 'Système',
    },
  },
};

// ============================================================
// SPANISH TRANSLATIONS
// ============================================================

const es: Translations = {
  common: {
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    create: 'Crear',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    refresh: 'Actualizar',
    back: 'Volver',
    next: 'Siguiente',
    previous: 'Anterior',
    confirm: 'Confirmar',
    close: 'Cerrar',
    yes: 'Sí',
    no: 'No',
    ok: 'OK',
    more: 'Más',
    less: 'Menos',
    all: 'Todo',
    none: 'Ninguno',
    settings: 'Configuración',
    profile: 'Perfil',
    logout: 'Cerrar sesión',
    help: 'Ayuda',
  },
  nav: {
    home: 'Inicio',
    workspace: 'Espacio de trabajo',
    nova: 'Nova',
    notifications: 'Notificaciones',
    menu: 'Menú',
  },
  spheres: {
    personal: { name: 'Personal', description: 'Gestión de vida personal' },
    business: { name: 'Negocios', description: 'Operaciones comerciales' },
    government: { name: 'Gobierno e Instituciones', description: 'Interacciones gubernamentales' },
    studio: { name: 'Estudio Creativo', description: 'Proyectos creativos' },
    community: { name: 'Comunidad', description: 'Participación comunitaria' },
    social: { name: 'Redes Sociales', description: 'Gestión de redes sociales' },
    entertainment: { name: 'Entretenimiento', description: 'Actividades de entretenimiento' },
    team: { name: 'Mi Equipo', description: 'Colaboración en equipo' },
  },
  bureau: {
    dashboard: 'Panel',
    notes: 'Notas',
    tasks: 'Tareas',
    projects: 'Proyectos',
    threads: 'Hilos (.chenu)',
    meetings: 'Reuniones',
    data: 'Datos / Base de datos',
    agents: 'Agentes',
    reports: 'Informes / Historial',
    budget: 'Presupuesto y Gobernanza',
  },
  threads: {
    title: 'Hilos',
    createNew: 'Crear nuevo hilo',
    active: 'Activo',
    paused: 'Pausado',
    archived: 'Archivado',
    tokenBudget: 'Presupuesto de tokens',
    tokensUsed: 'Tokens usados',
    tokensRemaining: 'Tokens restantes',
    sendMessage: 'Enviar',
    typeMessage: 'Escribe tu mensaje...',
    encoding: { enabled: 'Codificación activada', disabled: 'Codificación desactivada', savings: 'Ahorro de codificación' },
  },
  tokens: {
    title: 'Tokens',
    balance: 'Saldo de tokens',
    allocated: 'Asignados',
    used: 'Usados',
    remaining: 'Restantes',
    allocate: 'Asignar tokens',
    transfer: 'Transferir',
    history: 'Historial de uso',
    budgetAlert: 'Alerta de presupuesto',
    lowBudget: 'Presupuesto de tokens bajo',
    disclaimer: 'Los tokens son créditos de utilidad internos, no criptomonedas.',
  },
  agents: {
    title: 'Agentes',
    available: 'Agentes disponibles',
    myAgents: 'Mis agentes',
    execute: 'Ejecutar',
    executing: 'Ejecutando...',
    completed: 'Completado',
    failed: 'Fallido',
    cost: 'Costo',
    scope: 'Alcance',
    hire: 'Contratar',
    fire: 'Liberar',
  },
  nova: {
    title: 'Nova',
    subtitle: 'Inteligencia del Sistema',
    askNova: 'Pregunta a Nova...',
    insights: 'Perspectivas',
    suggestions: 'Sugerencias',
    guidance: 'Orientación',
    systemNote: 'Nova siempre está presente como inteligencia del sistema.',
  },
  governance: {
    title: 'Gobernanza',
    laws: {
      title: '10 Leyes de Gobernanza',
      law1: 'Primacía del Consentimiento',
      law2: 'Soberanía Temporal',
      law3: 'Fidelidad Contextual',
      law4: 'Respeto Jerárquico',
      law5: 'Integridad de Auditoría',
      law6: 'Transparencia de Codificación',
      law7: 'No Autonomía de Agentes',
      law8: 'Responsabilidad Presupuestaria',
      law9: 'Aislamiento Entre Esferas',
      law10: 'Integridad de Eliminación',
    },
    audit: 'Registro de auditoría',
    compliance: 'Puntuación de cumplimiento',
    checkPassed: 'Verificación de gobernanza aprobada',
    checkFailed: 'Verificación de gobernanza fallida',
  },
  auth: {
    login: 'Iniciar sesión',
    register: 'Registrarse',
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    rememberMe: 'Recordarme',
    orContinueWith: 'O continuar con',
    noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?',
    consent: {
      title: 'Consentimiento requerido',
      terms: 'Acepto los Términos de Servicio',
      governance: 'Acepto las 10 Leyes de Gobernanza',
      dataProcessing: 'Consiento el procesamiento de datos',
    },
  },
  errors: {
    generic: 'Ha ocurrido un error',
    network: 'Error de red',
    unauthorized: 'No autorizado',
    forbidden: 'Prohibido',
    notFound: 'No encontrado',
    validation: 'Error de validación',
    tokenExpired: 'Sesión expirada',
    budgetExceeded: 'Presupuesto de tokens excedido',
    governanceFailed: 'Verificación de gobernanza fallida',
  },
  notifications: {
    title: 'Notificaciones',
    markAllRead: 'Marcar todo como leído',
    clearAll: 'Borrar todo',
    empty: 'Sin notificaciones',
    types: { nova: 'Perspectiva Nova', agent: 'Actualización de Agente', thread: 'Actividad de Hilo', token: 'Alerta de Token', governance: 'Gobernanza', system: 'Sistema' },
  },
  settings: {
    title: 'Configuración',
    general: 'General',
    appearance: 'Apariencia',
    language: 'Idioma',
    notifications: 'Notificaciones',
    privacy: 'Privacidad',
    security: 'Seguridad',
    theme: { title: 'Tema', light: 'Claro', dark: 'Oscuro', system: 'Sistema' },
  },
};

// ============================================================
// ALL TRANSLATIONS
// ============================================================

const translations: Record<LanguageCode, Translations> = {
  en,
  fr,
  es,
  // Other languages would extend from en with specific overrides
  de: { ...en } as Translations,
  it: { ...en } as Translations,
  pt: { ...en } as Translations,
  zh: { ...en } as Translations,
  ja: { ...en } as Translations,
  ko: { ...en } as Translations,
  ar: { ...en } as Translations,
};

// ============================================================
// I18N CONTEXT
// ============================================================

interface I18nContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextValue | null>(null);

// ============================================================
// I18N PROVIDER
// ============================================================

interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: LanguageCode;
}

export function I18nProvider({ children, defaultLanguage = 'en' }: I18nProviderProps) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('chenu_language');
    if (stored && stored in SUPPORTED_LANGUAGES) {
      return stored as LanguageCode;
    }
    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang in SUPPORTED_LANGUAGES) {
      return browserLang as LanguageCode;
    }
    return defaultLanguage;
  });

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('chenu_language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = SUPPORTED_LANGUAGES[lang].dir;
  }, []);

  // Translation function
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: unknown = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if not found
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
        return String(params[paramKey] ?? `{{${paramKey}}}`);
      });
    }

    return value;
  }, [language]);

  const dir = SUPPORTED_LANGUAGES[language].dir;

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

// ============================================================
// HOOKS
// ============================================================

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

export function useTranslation() {
  const { t, language } = useI18n();
  return { t, language };
}

// ============================================================
// LANGUAGE SELECTOR COMPONENT
// ============================================================

export function LanguageSelector() {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-xl">{SUPPORTED_LANGUAGES[language].flag}</span>
        <span className="text-sm">{SUPPORTED_LANGUAGES[language].nativeName}</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-80 overflow-y-auto">
            {(Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[]).map((code) => (
              <button
                key={code}
                onClick={() => {
                  setLanguage(code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  language === code ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                }`}
              >
                <span className="text-xl">{SUPPORTED_LANGUAGES[code].flag}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{SUPPORTED_LANGUAGES[code].nativeName}</div>
                  <div className="text-xs text-gray-500">{SUPPORTED_LANGUAGES[code].name}</div>
                </div>
                {language === code && (
                  <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// TRANSLATED TEXT COMPONENT
// ============================================================

interface TransProps {
  i18nKey: string;
  params?: Record<string, string | number>;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export function Trans({ i18nKey, params, as: Component = 'span', className }: TransProps) {
  const { t } = useI18n();
  return <Component className={className}>{t(i18nKey, params)}</Component>;
}

// ============================================================
// EXPORTS
// ============================================================

export { translations, en, fr, es };
export default { I18nProvider, useI18n, useTranslation, LanguageSelector, Trans };
