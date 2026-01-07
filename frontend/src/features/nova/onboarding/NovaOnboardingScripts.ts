/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — NOVA ONBOARDING SCRIPTS                         ║
 * ║                    7 Scripts de Dialogue (GELÉ)                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * RÈGLES NOVA:
 * - Nova EST l'intelligence système (jamais "hired")
 * - Nova formule, ne décide pas
 * - Nova ne remplit pas automatiquement
 * - Nova demande toujours confirmation
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type NovaScriptId = 
  | 'welcome'
  | 'theme_selection'
  | 'sphere_overview'
  | 'sphere_personal'
  | 'bureau_intro'
  | 'first_task'
  | 'free_exploration';

export type NovaTrigger =
  | 'on_first_login'
  | 'theme_carousel_shown'
  | 'theme_selected'
  | 'sphere_overview_done'
  | 'enter_first_sphere'
  | 'bureau_intro_done'
  | 'first_task_done'
  | 'skip_first_task';

export interface NovaScript {
  id: NovaScriptId;
  trigger: NovaTrigger;
  nextTrigger: NovaTrigger | null;
  nextScript: NovaScriptId | null;
  durationSeconds: number;
  title: string;
  messages: string[];
  actions?: NovaAction[];
  highlight?: string; // CSS selector to highlight
}

export interface NovaAction {
  label: string;
  action: 'continue' | 'skip' | 'done' | 'custom';
  customAction?: string;
  primary?: boolean;
}

export interface NovaOnboardingState {
  currentScript: NovaScriptId | null;
  completedScripts: NovaScriptId[];
  isActive: boolean;
  isPaused: boolean;
  selectedTheme: string | null;
  onboardingComplete: boolean;
  messageIndex: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCRIPTS DATA (7 SCRIPTS GELÉS)
// ═══════════════════════════════════════════════════════════════════════════════

export const NOVA_SCRIPTS: Record<NovaScriptId, NovaScript> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // 1️⃣ ACCUEIL APRÈS CRÉATION DE COMPTE
  // ═══════════════════════════════════════════════════════════════════════════
  welcome: {
    id: 'welcome',
    trigger: 'on_first_login',
    nextTrigger: 'theme_carousel_shown',
    nextScript: 'theme_selection',
    durationSeconds: 30,
    title: 'Bienvenue',
    messages: [
      "Bienvenue dans CHE·NU.",
      "Je m'appelle Nova.",
      "Je suis ici pour t'aider à prendre en main cet environnement, et pour m'assurer que le système s'adapte à toi — et non l'inverse.",
      "CHE·NU n'est pas une application classique. C'est un système intelligent conçu pour organiser, connecter et faire évoluer tes données, tes projets et tes idées, à travers différents espaces spécialisés que nous appelons des sphères.",
      "Avant de commencer, je vais te proposer un environnement visuel. Il ne s'agit pas d'un simple thème graphique, mais d'une manière de structurer l'espace dans lequel tu vas évoluer."
    ],
    actions: [
      { label: 'Continuer', action: 'continue', primary: true }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2️⃣ CHOIX DE L'ENVIRONNEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  theme_selection: {
    id: 'theme_selection',
    trigger: 'theme_carousel_shown',
    nextTrigger: 'theme_selected',
    nextScript: 'sphere_overview',
    durationSeconds: 10,
    title: 'Choix de l\'environnement',
    messages: [
      "Fais simplement défiler les environnements de gauche à droite, et choisis celui dans lequel tu te sens le plus à l'aise.",
      "Tu pourras en changer plus tard. Pour l'instant, choisis celui qui te ressemble le plus."
    ],
    actions: []  // Actions gérées par le carousel
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3️⃣ EXPLICATION DES SPHÈRES (VUE D'ENSEMBLE)
  // ═══════════════════════════════════════════════════════════════════════════
  sphere_overview: {
    id: 'sphere_overview',
    trigger: 'theme_selected',
    nextTrigger: 'sphere_overview_done',
    nextScript: 'sphere_personal',
    durationSeconds: 20,
    title: 'Les Sphères',
    messages: [
      "CHE·NU est organisé autour de sphères. Chaque sphère représente un domaine de ta vie ou de ton activité.",
      "Les sphères sont indépendantes, mais peuvent collaborer entre elles lorsque tu le décides.",
      "Elles se débloquent progressivement, pour te permettre de découvrir le système sans te submerger."
    ],
    actions: [
      { label: 'Continuer', action: 'continue', primary: true }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4️⃣ SPHÈRE PERSONNELLE (PREMIÈRE SPHÈRE)
  // ═══════════════════════════════════════════════════════════════════════════
  sphere_personal: {
    id: 'sphere_personal',
    trigger: 'sphere_overview_done',
    nextTrigger: 'enter_first_sphere',
    nextScript: 'bureau_intro',
    durationSeconds: 25,
    title: 'Sphère Personnel',
    messages: [
      "Nous allons commencer par la sphère personnelle.",
      "C'est ici que le système apprend à te connaître. Tes notes personnelles, tes objectifs, tes tâches privées et tes informations de base vivent ici.",
      "Rien de ce qui se trouve dans cette sphère n'est partagé sans ton accord explicite.",
      "Plus tu complètes cette sphère, plus CHE·NU pourra adapter ses suggestions, ses automatisations et ses assistants à ta réalité."
    ],
    actions: [
      { label: 'Entrer dans Personnel', action: 'continue', primary: true }
    ],
    highlight: '[data-sphere="personal"]'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5️⃣ INTRODUCTION AU BUREAU
  // ═══════════════════════════════════════════════════════════════════════════
  bureau_intro: {
    id: 'bureau_intro',
    trigger: 'enter_first_sphere',
    nextTrigger: 'bureau_intro_done',
    nextScript: 'first_task',
    durationSeconds: 20,
    title: 'Le Bureau',
    messages: [
      "Voici le Bureau de la sphère Personnel.",
      "Chaque sphère possède un Bureau identique. Seul le contenu change.",
      "Le Bureau est composé de 6 sections:"
    ],
    actions: [
      { label: 'Continuer', action: 'continue', primary: true }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6️⃣ PREMIÈRE TÂCHE
  // ═══════════════════════════════════════════════════════════════════════════
  first_task: {
    id: 'first_task',
    trigger: 'bureau_intro_done',
    nextTrigger: 'first_task_done',
    nextScript: 'free_exploration',
    durationSeconds: 15,
    title: 'Première Action',
    messages: [
      "Pour bien commencer, je te propose de créer ta première note.",
      "Ça peut être n'importe quoi: une idée, une réflexion, ou simplement un 'Bonjour CHE·NU'.",
      "Cette première action va initialiser ton espace et me permettre de mieux t'accompagner par la suite.",
      "Clique sur 'Notes' dans le Bureau, puis sur 'Nouvelle note'."
    ],
    actions: [
      { label: "C'est fait!", action: 'done', primary: true },
      { label: 'Plus tard', action: 'skip' }
    ],
    highlight: '[data-section="notes"]'
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7️⃣ EXPLORATION LIBRE
  // ═══════════════════════════════════════════════════════════════════════════
  free_exploration: {
    id: 'free_exploration',
    trigger: 'first_task_done',
    nextTrigger: null,
    nextScript: null,
    durationSeconds: 15,
    title: 'Exploration',
    messages: [
      "Parfait! Tu es maintenant prêt à explorer CHE·NU.",
      "Je reste disponible à tout moment. Tu peux m'appeler en cliquant sur ✨ Nova dans la barre du bas, ou en disant 'Hey Nova' si tu as activé la reconnaissance vocale.",
      "N'hésite pas à me poser des questions! Je suis là pour t'aider à comprendre le système, pas pour décider à ta place.",
      "Bonne exploration! 🌟"
    ],
    actions: [
      { label: 'Commencer', action: 'continue', primary: true }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// THÈMES ENVIRONNEMENT
// ═══════════════════════════════════════════════════════════════════════════════

export interface NovaTheme {
  id: string;
  emoji: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  };
}

export const NOVA_THEMES: NovaTheme[] = [
  {
    id: 'forest',
    emoji: '🌳',
    name: 'Forêt Émeraude',
    colors: {
      primary: '#3F7249',
      secondary: '#2F4C39',
      background: '#1a2e1f',
      accent: '#8BC34A'
    }
  },
  {
    id: 'ocean',
    emoji: '🌊',
    name: 'Océan Turquoise',
    colors: {
      primary: '#3EB4A2',
      secondary: '#1E7B6E',
      background: '#0d2d29',
      accent: '#00BCD4'
    }
  },
  {
    id: 'desert',
    emoji: '🏜️',
    name: 'Désert Sable',
    colors: {
      primary: '#D8B26A',
      secondary: '#7A593A',
      background: '#2a2318',
      accent: '#FFB300'
    }
  },
  {
    id: 'cosmos',
    emoji: '✨',
    name: 'Cosmos Nuit',
    colors: {
      primary: '#9B59B6',
      secondary: '#5B2C6F',
      background: '#1a0f20',
      accent: '#E040FB'
    }
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// SECTIONS BUREAU (RÉFÉRENCE)
// ═══════════════════════════════════════════════════════════════════════════════

export const BUREAU_SECTIONS_INFO = [
  { id: 'dashboard', emoji: '📊', name: 'Dashboard', description: 'Vue d\'ensemble' },
  { id: 'notes', emoji: '📝', name: 'Notes', description: 'Tes pensées et références' },
  { id: 'tasks', emoji: '✅', name: 'Tasks', description: 'Tes tâches à accomplir' },
  { id: 'projects', emoji: '📁', name: 'Projects', description: 'Tes projets organisés' },
  { id: 'threads', emoji: '💬', name: 'Threads', description: 'Tes conversations persistantes' },
  { id: 'meetings', emoji: '📅', name: 'Meetings', description: 'Tes réunions et rendez-vous' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Obtient le script suivant basé sur un trigger
 */
export function getScriptByTrigger(trigger: NovaTrigger): NovaScript | null {
  return Object.values(NOVA_SCRIPTS).find(s => s.trigger === trigger) || null;
}

/**
 * Obtient l'ordre des scripts
 */
export function getScriptOrder(): NovaScriptId[] {
  return [
    'welcome',
    'theme_selection',
    'sphere_overview',
    'sphere_personal',
    'bureau_intro',
    'first_task',
    'free_exploration'
  ];
}

/**
 * Calcule la progression de l'onboarding
 */
export function calculateProgress(completedScripts: NovaScriptId[]): number {
  const total = getScriptOrder().length;
  return Math.round((completedScripts.length / total) * 100);
}

/**
 * Durée totale estimée de l'onboarding
 */
export function getTotalOnboardingDuration(): number {
  return Object.values(NOVA_SCRIPTS).reduce((acc, s) => acc + s.durationSeconds, 0);
}

export default NOVA_SCRIPTS;
