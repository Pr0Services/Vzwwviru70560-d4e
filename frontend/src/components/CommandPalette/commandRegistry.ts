/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — COMMAND REGISTRY
   Central registry of all available commands
   ═══════════════════════════════════════════════════════════════════════════════ */

import type { CommandItem, CommandGroup, CommandRegistryOptions } from './types';
import { logger } from '@/utils/logger';

// ════════════════════════════════════════════════════════════════════════════════
// SPHERE DEFINITIONS
// ════════════════════════════════════════════════════════════════════════════════

const SPHERES = [
  { id: 'personal', name: 'Personal', nameFr: 'Personnel', icon: '🏠', color: '#D8B26A' },
  { id: 'business', name: 'Business', nameFr: 'Affaires', icon: '💼', color: '#8D8371' },
  { id: 'government', name: 'Government', nameFr: 'Gouvernement', icon: '🏛️', color: '#2F4C39' },
  { id: 'creative', name: 'Creative Studio', nameFr: 'Studio de création', icon: '🎨', color: '#7A593A' },
  { id: 'community', name: 'Community', nameFr: 'Communauté', icon: '👥', color: '#3F7249' },
  { id: 'social', name: 'Social & Media', nameFr: 'Social & Médias', icon: '📱', color: '#3EB4A2' },
  { id: 'entertainment', name: 'Entertainment', nameFr: 'Divertissement', icon: '🎬', color: '#E9E4D6' },
  { id: 'my_team', name: 'My Team', nameFr: 'Mon Équipe', icon: '🤝', color: '#1E1F22' },
] as const;

const SECTIONS = [
  { id: 'QUICK_CAPTURE', name: 'Quick Capture', nameFr: 'Capture rapide', icon: '📥' },
  { id: 'RESUME_WORKSPACE', name: 'Resume', nameFr: 'Reprendre', icon: '▶️' },
  { id: 'THREADS', name: 'Threads', nameFr: 'Fils', icon: '💬' },
  { id: 'DATA_FILES', name: 'Data & Files', nameFr: 'Données', icon: '📁' },
  { id: 'ACTIVE_AGENTS', name: 'Agents', nameFr: 'Agents', icon: '🤖' },
  { id: 'MEETINGS', name: 'Meetings', nameFr: 'Réunions', icon: '📅' },
] as const;

// ════════════════════════════════════════════════════════════════════════════════
// NAVIGATION COMMANDS
// ════════════════════════════════════════════════════════════════════════════════

const createNavigationCommands = (navigate: (path: string) => void): CommandItem[] => {
  const commands: CommandItem[] = [];

  // Sphere navigation
  SPHERES.forEach((sphere) => {
    commands.push({
      id: `nav-sphere-${sphere.id}`,
      title: `Go to ${sphere.name}`,
      titleFr: `Aller à ${sphere.nameFr}`,
      subtitle: 'Sphere',
      category: 'navigation',
      icon: sphere.icon,
      keywords: [sphere.name.toLowerCase(), sphere.nameFr.toLowerCase(), 'sphere', 'go', 'aller'],
      shortcut: undefined,
      priority: 'high',
      sphereId: sphere.id,
      action: () => navigate(`/${sphere.id}`),
    });

    // Section navigation within each sphere
    SECTIONS.forEach((section) => {
      commands.push({
        id: `nav-${sphere.id}-${section.id}`,
        title: `${sphere.name} → ${section.name}`,
        titleFr: `${sphere.nameFr} → ${section.nameFr}`,
        subtitle: `${sphere.icon} ${section.icon}`,
        category: 'navigation',
        icon: section.icon,
        keywords: [
          sphere.name.toLowerCase(),
          section.name.toLowerCase(),
          sphere.nameFr.toLowerCase(),
          section.nameFr.toLowerCase(),
        ],
        priority: 'medium',
        sphereId: sphere.id,
        sectionId: section.id,
        action: () => navigate(`/${sphere.id}/${section.id.toLowerCase()}`),
      });
    });
  });

  // Special navigation
  commands.push(
    {
      id: 'nav-home',
      title: 'Go to Home',
      titleFr: 'Aller à l\'accueil',
      category: 'navigation',
      icon: '🏡',
      keywords: ['home', 'accueil', 'start', 'début'],
      shortcut: '⌘H',
      priority: 'high',
      action: () => navigate('/'),
    },
    {
      id: 'nav-settings',
      title: 'Open Settings',
      titleFr: 'Ouvrir les paramètres',
      category: 'settings',
      icon: '⚙️',
      keywords: ['settings', 'paramètres', 'preferences', 'config'],
      shortcut: '⌘,',
      priority: 'high',
      action: () => navigate('/settings'),
    },
    {
      id: 'nav-nova',
      title: 'Talk to Nova',
      titleFr: 'Parler à Nova',
      subtitle: 'System Intelligence',
      category: 'agent',
      icon: '✨',
      keywords: ['nova', 'ai', 'assistant', 'help', 'aide'],
      shortcut: '⌘N',
      priority: 'high',
      action: () => navigate('/nova'),
    },
  );

  return commands;
};

// ════════════════════════════════════════════════════════════════════════════════
// ACTION COMMANDS
// ════════════════════════════════════════════════════════════════════════════════

const createActionCommands = (
  actions: {
    createThread?: () => void;
    createTask?: () => void;
    createMeeting?: () => void;
    uploadFile?: () => void;
    quickCapture?: () => void;
    startAgent?: () => void;
  }
): CommandItem[] => [
  {
    id: 'action-new-thread',
    title: 'New Thread',
    titleFr: 'Nouveau fil',
    subtitle: 'Create a governed conversation',
    subtitleFr: 'Créer une conversation gouvernée',
    category: 'action',
    icon: '💬',
    keywords: ['new', 'nouveau', 'thread', 'fil', 'conversation', 'create', 'créer'],
    shortcut: '⌘T',
    priority: 'high',
    action: actions.createThread || (() => logger.debug('Create thread')),
  },
  {
    id: 'action-quick-capture',
    title: 'Quick Capture',
    titleFr: 'Capture rapide',
    subtitle: 'Capture a thought (500 chars max)',
    subtitleFr: 'Capturer une idée (500 car. max)',
    category: 'action',
    icon: '📥',
    keywords: ['quick', 'capture', 'rapide', 'note', 'idea', 'idée'],
    shortcut: '⌘⇧C',
    priority: 'high',
    action: actions.quickCapture || (() => logger.debug('Quick capture')),
  },
  {
    id: 'action-new-meeting',
    title: 'Schedule Meeting',
    titleFr: 'Planifier une réunion',
    subtitle: 'Create a new meeting',
    category: 'action',
    icon: '📅',
    keywords: ['meeting', 'réunion', 'schedule', 'planifier', 'calendar'],
    shortcut: '⌘M',
    priority: 'high',
    action: actions.createMeeting || (() => logger.debug('Create meeting')),
  },
  {
    id: 'action-upload',
    title: 'Upload File',
    titleFr: 'Téléverser un fichier',
    subtitle: 'Add a file to current DataSpace',
    category: 'action',
    icon: '📤',
    keywords: ['upload', 'téléverser', 'file', 'fichier', 'import'],
    shortcut: '⌘U',
    priority: 'medium',
    action: actions.uploadFile || (() => logger.debug('Upload file')),
  },
  {
    id: 'action-start-agent',
    title: 'Start Agent',
    titleFr: 'Démarrer un agent',
    subtitle: 'Activate an AI agent',
    category: 'agent',
    icon: '🤖',
    keywords: ['agent', 'ai', 'start', 'démarrer', 'activate'],
    priority: 'medium',
    action: actions.startAgent || (() => logger.debug('Start agent')),
  },
];

// ════════════════════════════════════════════════════════════════════════════════
// HELP COMMANDS
// ════════════════════════════════════════════════════════════════════════════════

const helpCommands: CommandItem[] = [
  {
    id: 'help-shortcuts',
    title: 'Keyboard Shortcuts',
    titleFr: 'Raccourcis clavier',
    category: 'help',
    icon: '⌨️',
    keywords: ['keyboard', 'shortcuts', 'raccourcis', 'clavier', 'help'],
    shortcut: '?',
    priority: 'medium',
    action: () => logger.debug('Show shortcuts'),
  },
  {
    id: 'help-docs',
    title: 'Documentation',
    titleFr: 'Documentation',
    category: 'help',
    icon: '📚',
    keywords: ['docs', 'documentation', 'help', 'aide', 'guide'],
    priority: 'low',
    action: () => window.open('https://docs.chenu.ai', '_blank'),
  },
  {
    id: 'help-support',
    title: 'Contact Support',
    titleFr: 'Contacter le support',
    category: 'help',
    icon: '🆘',
    keywords: ['support', 'contact', 'help', 'aide', 'bug'],
    priority: 'low',
    action: () => logger.debug('Open support'),
  },
];

// ════════════════════════════════════════════════════════════════════════════════
// COMMAND REGISTRY CLASS
// ════════════════════════════════════════════════════════════════════════════════

export class CommandRegistry {
  private commands: Map<string, CommandItem> = new Map();
  private navigate: (path: string) => void;
  private actions: Record<string, () => void>;

  constructor(
    navigate: (path: string) => void,
    actions: Record<string, () => void> = {}
  ) {
    this.navigate = navigate;
    this.actions = actions;
    this.registerDefaultCommands();
  }

  private registerDefaultCommands(): void {
    // Register navigation commands
    createNavigationCommands(this.navigate).forEach(cmd => {
      this.commands.set(cmd.id, cmd);
    });

    // Register action commands
    createActionCommands(this.actions).forEach(cmd => {
      this.commands.set(cmd.id, cmd);
    });

    // Register help commands
    helpCommands.forEach(cmd => {
      this.commands.set(cmd.id, cmd);
    });
  }

  register(command: CommandItem): void {
    this.commands.set(command.id, command);
  }

  unregister(commandId: string): void {
    this.commands.delete(commandId);
  }

  getAll(): CommandItem[] {
    return Array.from(this.commands.values());
  }

  getByCategory(category: string): CommandItem[] {
    return this.getAll().filter(cmd => cmd.category === category);
  }

  search(query: string): CommandItem[] {
    if (!query.trim()) {
      return this.getAll()
        .filter(cmd => cmd.priority === 'high')
        .slice(0, 10);
    }

    const normalizedQuery = query.toLowerCase().trim();
    const words = normalizedQuery.split(/\s+/);

    return this.getAll()
      .map(cmd => {
        let score = 0;
        
        // Title match (highest priority)
        if (cmd.title.toLowerCase().includes(normalizedQuery)) {
          score += 100;
        }
        if (cmd.titleFr?.toLowerCase().includes(normalizedQuery)) {
          score += 100;
        }
        
        // Keyword match
        cmd.keywords.forEach(keyword => {
          if (keyword.includes(normalizedQuery)) {
            score += 50;
          }
          words.forEach(word => {
            if (keyword.includes(word)) {
              score += 20;
            }
          });
        });

        // Subtitle match
        if (cmd.subtitle?.toLowerCase().includes(normalizedQuery)) {
          score += 30;
        }

        // Priority bonus
        if (cmd.priority === 'high') score += 10;
        if (cmd.priority === 'medium') score += 5;

        return { cmd, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ cmd }) => cmd)
      .slice(0, 15);
  }

  getGroups(): CommandGroup[] {
    return [
      {
        id: 'navigation',
        title: 'Navigation',
        titleFr: 'Navigation',
        icon: '🧭',
        commands: this.getByCategory('navigation'),
      },
      {
        id: 'actions',
        title: 'Actions',
        titleFr: 'Actions',
        icon: '⚡',
        commands: this.getByCategory('action'),
      },
      {
        id: 'agents',
        title: 'Agents',
        titleFr: 'Agents',
        icon: '🤖',
        commands: this.getByCategory('agent'),
      },
      {
        id: 'settings',
        title: 'Settings',
        titleFr: 'Paramètres',
        icon: '⚙️',
        commands: this.getByCategory('settings'),
      },
      {
        id: 'help',
        title: 'Help',
        titleFr: 'Aide',
        icon: '❓',
        commands: this.getByCategory('help'),
      },
    ];
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ════════════════════════════════════════════════════════════════════════════════

export default CommandRegistry;
