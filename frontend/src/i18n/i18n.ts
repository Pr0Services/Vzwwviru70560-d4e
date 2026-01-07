/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — LOCALIZATION SYSTEM
   Centralized trilingual support (EN/FR/ES)
   ═══════════════════════════════════════════════════════════════════════════════ */

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export type Locale = 'en' | 'fr' | 'es';

export interface LocalizedString {
  en: string;
  fr: string;
  es: string;
}

// ════════════════════════════════════════════════════════════════════════════════
// COMMON STRINGS
// ════════════════════════════════════════════════════════════════════════════════

export const COMMON: Record<string, LocalizedString> = {
  // Actions
  save: { en: 'Save', fr: 'Sauvegarder', es: 'Guardar' },
  cancel: { en: 'Cancel', fr: 'Annuler', es: 'Cancelar' },
  delete: { en: 'Delete', fr: 'Supprimer', es: 'Eliminar' },
  edit: { en: 'Edit', fr: 'Modifier', es: 'Editar' },
  create: { en: 'Create', fr: 'Créer', es: 'Crear' },
  close: { en: 'Close', fr: 'Fermer', es: 'Cerrar' },
  confirm: { en: 'Confirm', fr: 'Confirmer', es: 'Confirmar' },
  submit: { en: 'Submit', fr: 'Soumettre', es: 'Enviar' },
  search: { en: 'Search', fr: 'Rechercher', es: 'Buscar' },
  filter: { en: 'Filter', fr: 'Filtrer', es: 'Filtrar' },
  sort: { en: 'Sort', fr: 'Trier', es: 'Ordenar' },
  refresh: { en: 'Refresh', fr: 'Actualiser', es: 'Actualizar' },
  loading: { en: 'Loading...', fr: 'Chargement...', es: 'Cargando...' },
  
  // Status
  active: { en: 'Active', fr: 'Actif', es: 'Activo' },
  inactive: { en: 'Inactive', fr: 'Inactif', es: 'Inactivo' },
  pending: { en: 'Pending', fr: 'En attente', es: 'Pendiente' },
  completed: { en: 'Completed', fr: 'Terminé', es: 'Completado' },
  failed: { en: 'Failed', fr: 'Échoué', es: 'Fallido' },
  draft: { en: 'Draft', fr: 'Brouillon', es: 'Borrador' },
  
  // Time
  today: { en: 'Today', fr: 'Aujourd\'hui', es: 'Hoy' },
  yesterday: { en: 'Yesterday', fr: 'Hier', es: 'Ayer' },
  thisWeek: { en: 'This week', fr: 'Cette semaine', es: 'Esta semana' },
  lastWeek: { en: 'Last week', fr: 'Semaine dernière', es: 'Semana pasada' },
  thisMonth: { en: 'This month', fr: 'Ce mois', es: 'Este mes' },
  older: { en: 'Older', fr: 'Plus ancien', es: 'Más antiguo' },
  
  // Counts
  items: { en: 'items', fr: 'éléments', es: 'elementos' },
  selected: { en: 'selected', fr: 'sélectionné(s)', es: 'seleccionado(s)' },
  total: { en: 'total', fr: 'total', es: 'total' },
  
  // Navigation
  back: { en: 'Back', fr: 'Retour', es: 'Volver' },
  next: { en: 'Next', fr: 'Suivant', es: 'Siguiente' },
  previous: { en: 'Previous', fr: 'Précédent', es: 'Anterior' },
  home: { en: 'Home', fr: 'Accueil', es: 'Inicio' },
  settings: { en: 'Settings', fr: 'Paramètres', es: 'Configuración' },
  
  // Messages
  success: { en: 'Success', fr: 'Succès', es: 'Éxito' },
  error: { en: 'Error', fr: 'Erreur', es: 'Error' },
  warning: { en: 'Warning', fr: 'Attention', es: 'Advertencia' },
  info: { en: 'Information', fr: 'Information', es: 'Información' },
  noResults: { en: 'No results', fr: 'Aucun résultat', es: 'Sin resultados' },
  noData: { en: 'No data', fr: 'Aucune donnée', es: 'Sin datos' },
};

// ════════════════════════════════════════════════════════════════════════════════
// COMMAND PALETTE STRINGS
// ════════════════════════════════════════════════════════════════════════════════

export const COMMAND_PALETTE: Record<string, LocalizedString> = {
  title: { en: 'Command Palette', fr: 'Palette de commandes', es: 'Paleta de comandos' },
  placeholder: { en: 'Type a command or search...', fr: 'Tapez une commande ou recherchez...', es: 'Escriba un comando o busque...' },
  noResults: { en: 'No commands found', fr: 'Aucune commande trouvée', es: 'No se encontraron comandos' },
  recent: { en: 'Recent', fr: 'Récent', es: 'Reciente' },
  navigation: { en: 'Navigation', fr: 'Navigation', es: 'Navegación' },
  actions: { en: 'Actions', fr: 'Actions', es: 'Acciones' },
  spheres: { en: 'Spheres', fr: 'Sphères', es: 'Esferas' },
  bureau: { en: 'Bureau', fr: 'Bureau', es: 'Oficina' },
  threads: { en: 'Threads', fr: 'Fils', es: 'Hilos' },
  agents: { en: 'Agents', fr: 'Agents', es: 'Agentes' },
  meetings: { en: 'Meetings', fr: 'Réunions', es: 'Reuniones' },
  settings: { en: 'Settings', fr: 'Paramètres', es: 'Configuración' },
  help: { en: 'Help', fr: 'Aide', es: 'Ayuda' },
  
  // Commands
  goToPersonal: { en: 'Go to Personal', fr: 'Aller à Personnel', es: 'Ir a Personal' },
  goToBusiness: { en: 'Go to Business', fr: 'Aller à Business', es: 'Ir a Negocios' },
  goToGovernment: { en: 'Go to Government', fr: 'Aller à Gouvernement', es: 'Ir a Gobierno' },
  goToStudio: { en: 'Go to Studio', fr: 'Aller au Studio', es: 'Ir al Estudio' },
  goToCommunity: { en: 'Go to Community', fr: 'Aller à Communauté', es: 'Ir a Comunidad' },
  goToSocial: { en: 'Go to Social', fr: 'Aller à Social', es: 'Ir a Social' },
  goToEntertainment: { en: 'Go to Entertainment', fr: 'Aller à Divertissement', es: 'Ir a Entretenimiento' },
  goToMyTeam: { en: 'Go to My Team', fr: 'Aller à Mon équipe', es: 'Ir a Mi equipo' },
  
  newThread: { en: 'New Thread', fr: 'Nouveau fil', es: 'Nuevo hilo' },
  newMeeting: { en: 'New Meeting', fr: 'Nouvelle réunion', es: 'Nueva reunión' },
  newTask: { en: 'New Task', fr: 'Nouvelle tâche', es: 'Nueva tarea' },
  newProject: { en: 'New Project', fr: 'Nouveau projet', es: 'Nuevo proyecto' },
  quickCapture: { en: 'Quick Capture', fr: 'Capture rapide', es: 'Captura rápida' },
  
  toggleTheme: { en: 'Toggle Theme', fr: 'Changer de thème', es: 'Cambiar tema' },
  toggleSidebar: { en: 'Toggle Sidebar', fr: 'Basculer la barre latérale', es: 'Alternar barra lateral' },
  openSettings: { en: 'Open Settings', fr: 'Ouvrir les paramètres', es: 'Abrir configuración' },
  showKeyboardShortcuts: { en: 'Keyboard Shortcuts', fr: 'Raccourcis clavier', es: 'Atajos de teclado' },
};

// ════════════════════════════════════════════════════════════════════════════════
// NOTIFICATION CENTER STRINGS
// ════════════════════════════════════════════════════════════════════════════════

export const NOTIFICATION_CENTER: Record<string, LocalizedString> = {
  title: { en: 'Notifications', fr: 'Notifications', es: 'Notificaciones' },
  markAllRead: { en: 'Mark all as read', fr: 'Tout marquer comme lu', es: 'Marcar todo como leído' },
  clearAll: { en: 'Clear all', fr: 'Tout effacer', es: 'Borrar todo' },
  noNotifications: { en: 'No notifications', fr: 'Aucune notification', es: 'Sin notificaciones' },
  allCaughtUp: { en: 'You\'re all caught up!', fr: 'Vous êtes à jour!', es: '¡Estás al día!' },
  
  // Filter tabs
  all: { en: 'All', fr: 'Tout', es: 'Todo' },
  unread: { en: 'Unread', fr: 'Non lu', es: 'No leído' },
  mentions: { en: 'Mentions', fr: 'Mentions', es: 'Menciones' },
  
  // Notification types
  system: { en: 'System', fr: 'Système', es: 'Sistema' },
  agent: { en: 'Agent', fr: 'Agent', es: 'Agente' },
  thread: { en: 'Thread', fr: 'Fil', es: 'Hilo' },
  meeting: { en: 'Meeting', fr: 'Réunion', es: 'Reunión' },
  task: { en: 'Task', fr: 'Tâche', es: 'Tarea' },
  deadline: { en: 'Deadline', fr: 'Échéance', es: 'Fecha límite' },
  governance: { en: 'Governance', fr: 'Gouvernance', es: 'Gobernanza' },
  collaboration: { en: 'Collaboration', fr: 'Collaboration', es: 'Colaboración' },
  achievement: { en: 'Achievement', fr: 'Accomplissement', es: 'Logro' },
  security: { en: 'Security', fr: 'Sécurité', es: 'Seguridad' },
  
  // Actions
  view: { en: 'View', fr: 'Voir', es: 'Ver' },
  dismiss: { en: 'Dismiss', fr: 'Ignorer', es: 'Descartar' },
  markRead: { en: 'Mark as read', fr: 'Marquer comme lu', es: 'Marcar como leído' },
};

// ════════════════════════════════════════════════════════════════════════════════
// WORKFLOW BUILDER STRINGS
// ════════════════════════════════════════════════════════════════════════════════

export const WORKFLOW_BUILDER: Record<string, LocalizedString> = {
  title: { en: 'Workflow Builder', fr: 'Constructeur de Workflow', es: 'Constructor de Flujo de Trabajo' },
  newWorkflow: { en: 'New Workflow', fr: 'Nouveau Workflow', es: 'Nuevo Flujo de Trabajo' },
  saveWorkflow: { en: 'Save', fr: 'Sauvegarder', es: 'Guardar' },
  executeWorkflow: { en: 'Execute', fr: 'Exécuter', es: 'Ejecutar' },
  
  // Tabs
  nodes: { en: 'Nodes', fr: 'Nœuds', es: 'Nodos' },
  templates: { en: 'Templates', fr: 'Modèles', es: 'Plantillas' },
  
  // Categories
  triggers: { en: 'Triggers', fr: 'Déclencheurs', es: 'Disparadores' },
  logic: { en: 'Logic', fr: 'Logique', es: 'Lógica' },
  aiTransform: { en: 'AI & Transform', fr: 'IA & Transformation', es: 'IA y Transformación' },
  actions: { en: 'Actions', fr: 'Actions', es: 'Acciones' },
  utility: { en: 'Utility', fr: 'Utilitaires', es: 'Utilidades' },
  
  // Node types
  trigger: { en: 'Trigger', fr: 'Déclencheur', es: 'Disparador' },
  condition: { en: 'Condition', fr: 'Condition', es: 'Condición' },
  action: { en: 'Action', fr: 'Action', es: 'Acción' },
  agent: { en: 'AI Agent', fr: 'Agent IA', es: 'Agente IA' },
  delay: { en: 'Delay', fr: 'Délai', es: 'Retraso' },
  loop: { en: 'Loop', fr: 'Boucle', es: 'Bucle' },
  transform: { en: 'Transform', fr: 'Transformation', es: 'Transformación' },
  notification: { en: 'Notification', fr: 'Notification', es: 'Notificación' },
  webhook: { en: 'Webhook', fr: 'Webhook', es: 'Webhook' },
  end: { en: 'End', fr: 'Fin', es: 'Fin' },
  
  // Empty state
  emptyTitle: { en: 'Start building your workflow', fr: 'Commencez à construire votre workflow', es: 'Comience a construir su flujo de trabajo' },
  emptyDescription: { en: 'Drag nodes from the sidebar or choose a template', fr: 'Glissez des nœuds depuis la barre latérale ou choisissez un modèle', es: 'Arrastre nodos desde la barra lateral o elija una plantilla' },
  
  // Status
  connections: { en: 'connections', fr: 'connexions', es: 'conexiones' },
  
  // Validation
  validationError: { en: 'Validation Error', fr: 'Erreur de validation', es: 'Error de validación' },
  needsTrigger: { en: 'Workflow needs at least one trigger', fr: 'Le workflow doit avoir au moins un déclencheur', es: 'El flujo de trabajo necesita al menos un disparador' },
  needsEnd: { en: 'Workflow should have at least one end node', fr: 'Le workflow devrait avoir au moins un nœud de fin', es: 'El flujo de trabajo debería tener al menos un nodo final' },
};

// ════════════════════════════════════════════════════════════════════════════════
// SPHERES
// ════════════════════════════════════════════════════════════════════════════════

export const SPHERES: Record<string, LocalizedString> = {
  personal: { en: 'Personal', fr: 'Personnel', es: 'Personal' },
  business: { en: 'Business', fr: 'Business', es: 'Negocios' },
  government: { en: 'Government & Institutions', fr: 'Gouvernement & Institutions', es: 'Gobierno e Instituciones' },
  studio: { en: 'Creation Studio', fr: 'Studio de création', es: 'Estudio de creación' },
  community: { en: 'Community', fr: 'Communauté', es: 'Comunidad' },
  social: { en: 'Social & Media', fr: 'Social & Média', es: 'Social y Medios' },
  entertainment: { en: 'Entertainment', fr: 'Divertissement', es: 'Entretenimiento' },
  myTeam: { en: 'My Team', fr: 'Mon équipe', es: 'Mi equipo' },
};

// ════════════════════════════════════════════════════════════════════════════════
// BUREAU SECTIONS
// ════════════════════════════════════════════════════════════════════════════════

export const BUREAU_SECTIONS: Record<string, LocalizedString> = {
  dashboard: { en: 'Dashboard', fr: 'Tableau de bord', es: 'Panel de control' },
  notes: { en: 'Notes', fr: 'Notes', es: 'Notas' },
  tasks: { en: 'Tasks', fr: 'Tâches', es: 'Tareas' },
  projects: { en: 'Projects', fr: 'Projets', es: 'Proyectos' },
  threads: { en: 'Threads (.chenu)', fr: 'Fils (.chenu)', es: 'Hilos (.chenu)' },
  meetings: { en: 'Meetings', fr: 'Réunions', es: 'Reuniones' },
  data: { en: 'Data / Database', fr: 'Données / Base de données', es: 'Datos / Base de datos' },
  agents: { en: 'Agents', fr: 'Agents', es: 'Agentes' },
  reports: { en: 'Reports / History', fr: 'Rapports / Historique', es: 'Informes / Historial' },
  budget: { en: 'Budget & Governance', fr: 'Budget & Gouvernance', es: 'Presupuesto y Gobernanza' },
};

// ════════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Get localized string
 */
export const t = (strings: LocalizedString, locale: Locale): string => {
  return strings[locale] || strings.en;
};

/**
 * Get localized string from a dictionary
 */
export const tDict = (
  dictionary: Record<string, LocalizedString>,
  key: string,
  locale: Locale
): string => {
  const strings = dictionary[key];
  if (!strings) return key;
  return strings[locale] || strings.en;
};

/**
 * Create a translator for a specific dictionary
 */
export const createTranslator = (
  dictionary: Record<string, LocalizedString>,
  locale: Locale
) => {
  return (key: string): string => tDict(dictionary, key, locale);
};

/**
 * Format date based on locale
 */
export const formatDate = (date: Date, locale: Locale): string => {
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    fr: 'fr-FR',
    es: 'es-ES',
  };
  
  return new Intl.DateTimeFormat(localeMap[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

/**
 * Format relative time
 */
export const formatRelativeTime = (date: Date, locale: Locale): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  const strings: Record<Locale, Record<string, string>> = {
    en: {
      justNow: 'just now',
      minutesAgo: 'min ago',
      hoursAgo: 'h ago',
      daysAgo: 'd ago',
    },
    fr: {
      justNow: 'à l\'instant',
      minutesAgo: 'min',
      hoursAgo: 'h',
      daysAgo: 'j',
    },
    es: {
      justNow: 'ahora mismo',
      minutesAgo: 'min',
      hoursAgo: 'h',
      daysAgo: 'd',
    },
  };
  
  const s = strings[locale];
  
  if (diffMins < 1) return s.justNow;
  if (diffMins < 60) return `${diffMins} ${s.minutesAgo}`;
  if (diffHours < 24) return `${diffHours} ${s.hoursAgo}`;
  return `${diffDays} ${s.daysAgo}`;
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default {
  COMMON,
  COMMAND_PALETTE,
  NOTIFICATION_CENTER,
  WORKFLOW_BUILDER,
  SPHERES,
  BUREAU_SECTIONS,
  t,
  tDict,
  createTranslator,
  formatDate,
  formatRelativeTime,
};
