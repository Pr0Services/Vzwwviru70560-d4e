// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ — NOVA COMMAND PALETTE
// Interface de commandes "/" style Notion/Slack intégrée au frontend
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type KeyboardEvent,
} from 'react';
import { useNovaContext } from '../providers/NovaProvider';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface NovaCommand {
  id: string;
  label: string;
  labelEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  category: CommandCategory;
  keywords: string[];
  action: (context: unknown) => void;
  shortcut?: string;
  requiresInput?: boolean;
}

export type CommandCategory = 
  | 'navigation'
  | 'action'
  | 'search'
  | 'help'
  | 'settings'
  | 'recent';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'fr' | 'en';
  position?: { x: number; y: number };
  anchorElement?: HTMLElement | null;
}

// ─────────────────────────────────────────────────────────────────────────────────
// BUILT-IN COMMANDS
// ─────────────────────────────────────────────────────────────────────────────────

const BUILT_IN_COMMANDS: NovaCommand[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'nav-personal',
    label: 'Aller à Personal',
    labelEn: 'Go to Personal',
    description: 'Ouvrir la sphère Personal',
    descriptionEn: 'Open the Personal sphere',
    icon: '🏠',
    category: 'navigation',
    keywords: ['personal', 'personnel', 'home', 'maison'],
    action: (ctx) => ctx.navigateToSphere('personal'),
    shortcut: '⌘1',
  },
  {
    id: 'nav-business',
    label: 'Aller à Business',
    labelEn: 'Go to Business',
    description: 'Ouvrir la sphère Business',
    descriptionEn: 'Open the Business sphere',
    icon: '💼',
    category: 'navigation',
    keywords: ['business', 'entreprise', 'work', 'travail'],
    action: (ctx) => ctx.navigateToSphere('business'),
    shortcut: '⌘2',
  },
  {
    id: 'nav-government',
    label: 'Aller à Government',
    labelEn: 'Go to Government',
    description: 'Ouvrir la sphère Government & Institutions',
    descriptionEn: 'Open the Government & Institutions sphere',
    icon: '🏛️',
    category: 'navigation',
    keywords: ['government', 'gouvernement', 'institutions', 'admin'],
    action: (ctx) => ctx.navigateToSphere('government'),
    shortcut: '⌘3',
  },
  {
    id: 'nav-creative',
    label: 'Aller au Studio',
    labelEn: 'Go to Creative Studio',
    description: 'Ouvrir le Studio de création',
    descriptionEn: 'Open the Creative Studio',
    icon: '🎨',
    category: 'navigation',
    keywords: ['creative', 'design_studio', 'création', 'art', 'design'],
    action: (ctx) => ctx.navigateToSphere('creative'),
    shortcut: '⌘4',
  },
  {
    id: 'nav-community',
    label: 'Aller à Community',
    labelEn: 'Go to Community',
    description: 'Ouvrir la sphère Community',
    descriptionEn: 'Open the Community sphere',
    icon: '👥',
    category: 'navigation',
    keywords: ['community', 'communauté', 'groupe', 'group'],
    action: (ctx) => ctx.navigateToSphere('community'),
    shortcut: '⌘5',
  },
  {
    id: 'nav-social',
    label: 'Aller à Social',
    labelEn: 'Go to Social & Media',
    description: 'Ouvrir la sphère Social & Media',
    descriptionEn: 'Open the Social & Media sphere',
    icon: '📱',
    category: 'navigation',
    keywords: ['social', 'media', 'réseaux', 'networks'],
    action: (ctx) => ctx.navigateToSphere('social'),
    shortcut: '⌘6',
  },
  {
    id: 'nav-entertainment',
    label: 'Aller à Entertainment',
    labelEn: 'Go to Entertainment',
    description: 'Ouvrir la sphère Entertainment',
    descriptionEn: 'Open the Entertainment sphere',
    icon: '🎬',
    category: 'navigation',
    keywords: ['entertainment', 'divertissement', 'films', 'games'],
    action: (ctx) => ctx.navigateToSphere('entertainment'),
    shortcut: '⌘7',
  },
  {
    id: 'nav-myteam',
    label: 'Aller à My Team',
    labelEn: 'Go to My Team',
    description: 'Ouvrir My Team (agents, labs, skills)',
    descriptionEn: 'Open My Team (agents, labs, skills)',
    icon: '🤝',
    category: 'navigation',
    keywords: ['my_team', 'équipe', 'agents', 'labs', 'skills'],
    action: (ctx) => ctx.navigateToSphere('my_team'),
    shortcut: '⌘8',
  },
  {
    id: 'nav-scholar',
    label: 'Aller à Scholar',
    labelEn: 'Go to Scholar',
    description: 'Ouvrir la sphère Scholar',
    descriptionEn: 'Open the Scholar sphere',
    icon: '📚',
    category: 'navigation',
    keywords: ['scholars', 'étude', 'study', 'recherche', 'quantum'],
    action: (ctx) => ctx.navigateToSphere('scholar'),
    shortcut: '⌘9',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'nav-dashboard',
    label: 'Ouvrir Dashboard',
    labelEn: 'Open Dashboard',
    description: 'Voir le tableau de bord',
    descriptionEn: 'View the dashboard',
    icon: '📊',
    category: 'navigation',
    keywords: ['dashboard', 'tableau', 'overview', 'résumé'],
    action: (ctx) => ctx.navigateToSection('dashboard'),
  },
  {
    id: 'nav-tasks',
    label: 'Ouvrir Tasks',
    labelEn: 'Open Tasks',
    description: 'Voir les tâches',
    descriptionEn: 'View tasks',
    icon: '✅',
    category: 'navigation',
    keywords: ['tasks', 'tâches', 'todo', 'liste'],
    action: (ctx) => ctx.navigateToSection('tasks'),
  },
  {
    id: 'nav-projects',
    label: 'Ouvrir Projects',
    labelEn: 'Open Projects',
    description: 'Voir les projets',
    descriptionEn: 'View projects',
    icon: '📁',
    category: 'navigation',
    keywords: ['projects', 'projets', 'kanban'],
    action: (ctx) => ctx.navigateToSection('projects'),
  },
  {
    id: 'nav-notes',
    label: 'Ouvrir Notes',
    labelEn: 'Open Notes',
    description: 'Voir les notes',
    descriptionEn: 'View notes',
    icon: '📝',
    category: 'navigation',
    keywords: ['notes', 'capture', 'idées'],
    action: (ctx) => ctx.navigateToSection('notes'),
  },
  {
    id: 'nav-threads',
    label: 'Ouvrir Threads',
    labelEn: 'Open Threads',
    description: 'Voir les threads (.chenu)',
    descriptionEn: 'View threads (.chenu)',
    icon: '🧵',
    category: 'navigation',
    keywords: ['threads', 'fils', 'conversation', '.chenu'],
    action: (ctx) => ctx.navigateToSection('threads'),
  },
  {
    id: 'nav-meetings',
    label: 'Ouvrir Meetings',
    labelEn: 'Open Meetings',
    description: 'Voir les réunions',
    descriptionEn: 'View meetings',
    icon: '📅',
    category: 'navigation',
    keywords: ['meetings', 'réunions', 'calendrier', 'calendar'],
    action: (ctx) => ctx.navigateToSection('meetings'),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'action-new-task',
    label: 'Nouvelle tâche',
    labelEn: 'New task',
    description: 'Créer une nouvelle tâche',
    descriptionEn: 'Create a new task',
    icon: '➕',
    category: 'action',
    keywords: ['nouvelle', 'new', 'tâche', 'task', 'créer', 'create'],
    action: (ctx) => ctx.executeAction('create_task'),
    requiresInput: true,
  },
  {
    id: 'action-new-note',
    label: 'Nouvelle note',
    labelEn: 'New note',
    description: 'Créer une nouvelle note',
    descriptionEn: 'Create a new note',
    icon: '📄',
    category: 'action',
    keywords: ['nouvelle', 'new', 'note', 'créer', 'create'],
    action: (ctx) => ctx.executeAction('create_note'),
    requiresInput: true,
  },
  {
    id: 'action-new-project',
    label: 'Nouveau projet',
    labelEn: 'New project',
    description: 'Créer un nouveau projet',
    descriptionEn: 'Create a new project',
    icon: '🚀',
    category: 'action',
    keywords: ['nouveau', 'new', 'projet', 'project', 'créer', 'create'],
    action: (ctx) => ctx.executeAction('create_project'),
    requiresInput: true,
  },
  {
    id: 'action-new-thread',
    label: 'Nouveau thread',
    labelEn: 'New thread',
    description: 'Créer un nouveau thread .chenu',
    descriptionEn: 'Create a new .chenu thread',
    icon: '🧵',
    category: 'action',
    keywords: ['nouveau', 'new', 'thread', 'fil', '.chenu'],
    action: (ctx) => ctx.executeAction('create_thread'),
    requiresInput: true,
  },
  {
    id: 'action-new-meeting',
    label: 'Nouvelle réunion',
    labelEn: 'New meeting',
    description: 'Planifier une réunion',
    descriptionEn: 'Schedule a meeting',
    icon: '🗓️',
    category: 'action',
    keywords: ['nouvelle', 'new', 'réunion', 'meeting', 'planifier', 'schedule'],
    action: (ctx) => ctx.executeAction('create_meeting'),
    requiresInput: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HELP
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'help-nova',
    label: 'Parler à Nova',
    labelEn: 'Talk to Nova',
    description: 'Ouvrir l\'assistant Nova',
    descriptionEn: 'Open Nova assistant',
    icon: '🧠',
    category: 'help',
    keywords: ['nova', 'aide', 'help', 'assistant', 'question'],
    action: (ctx) => ctx.openNova(),
  },
  {
    id: 'help-tutorial',
    label: 'Tutoriels',
    labelEn: 'Tutorials',
    description: 'Voir les tutoriels disponibles',
    descriptionEn: 'View available tutorials',
    icon: '🎓',
    category: 'help',
    keywords: ['tutoriel', 'tutorial', 'apprendre', 'learn', 'guide'],
    action: (ctx) => ctx.startTutorial('welcome-tour'),
  },
  {
    id: 'help-shortcuts',
    label: 'Raccourcis clavier',
    labelEn: 'Keyboard shortcuts',
    description: 'Voir tous les raccourcis',
    descriptionEn: 'View all shortcuts',
    icon: '⌨️',
    category: 'help',
    keywords: ['raccourcis', 'shortcuts', 'keyboard', 'clavier'],
    action: (ctx) => ctx.executeAction('show_shortcuts'),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SETTINGS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'settings-theme',
    label: 'Changer le thème',
    labelEn: 'Change theme',
    description: 'Basculer entre clair/sombre',
    descriptionEn: 'Toggle light/dark mode',
    icon: '🎨',
    category: 'settings',
    keywords: ['thème', 'theme', 'dark', 'light', 'sombre', 'clair'],
    action: (ctx) => ctx.executeAction('toggle_theme'),
  },
  {
    id: 'settings-language',
    label: 'Changer la langue',
    labelEn: 'Change language',
    description: 'Basculer français/anglais',
    descriptionEn: 'Toggle French/English',
    icon: '🌐',
    category: 'settings',
    keywords: ['langue', 'language', 'français', 'french', 'english', 'anglais'],
    action: (ctx) => ctx.executeAction('toggle_language'),
  },
  {
    id: 'settings-preferences',
    label: 'Préférences',
    labelEn: 'Preferences',
    description: 'Ouvrir les préférences',
    descriptionEn: 'Open preferences',
    icon: '⚙️',
    category: 'settings',
    keywords: ['préférences', 'preferences', 'settings', 'paramètres'],
    action: (ctx) => ctx.executeAction('open_settings'),
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SEARCH
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'search-global',
    label: 'Recherche globale',
    labelEn: 'Global search',
    description: 'Chercher partout dans CHE·NU',
    descriptionEn: 'Search everywhere in CHE·NU',
    icon: '🔍',
    category: 'search',
    keywords: ['recherche', 'search', 'chercher', 'find', 'trouver'],
    action: (ctx) => ctx.executeAction('global_search'),
    requiresInput: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────────

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '15vh',
    zIndex: 9999,
  },
  container: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: 'var(--chenu-bg-primary, #1E1F22)',
    borderRadius: '12px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    animation: 'nova-palette-appear 0.15s ease-out',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid var(--chenu-border, #333)',
    gap: '12px',
  },
  novaIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #D8B26A 0%, #3F7249 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    color: 'var(--chenu-text-primary, #fff)',
    caretColor: '#D8B26A',
  },
  hint: {
    fontSize: '12px',
    color: 'var(--chenu-text-secondary, #888)',
  },
  results: {
    maxHeight: '400px',
    overflowY: 'auto' as const,
    padding: '8px',
  },
  category: {
    padding: '8px 12px 4px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--chenu-text-secondary, #888)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  commandItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    gap: '12px',
    transition: 'background 0.1s',
  },
  commandItemSelected: {
    backgroundColor: 'var(--chenu-bg-hover, #2a2b2e)',
  },
  commandIcon: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    backgroundColor: 'var(--chenu-bg-secondary, #2a2b2e)',
    borderRadius: '8px',
  },
  commandContent: {
    flex: 1,
    minWidth: 0,
  },
  commandLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--chenu-text-primary, #fff)',
  },
  commandDescription: {
    fontSize: '12px',
    color: 'var(--chenu-text-secondary, #888)',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  commandShortcut: {
    fontSize: '12px',
    color: 'var(--chenu-text-secondary, #888)',
    backgroundColor: 'var(--chenu-bg-secondary, #2a2b2e)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 16px',
    borderTop: '1px solid var(--chenu-border, #333)',
    fontSize: '12px',
    color: 'var(--chenu-text-secondary, #888)',
  },
  footerHint: {
    display: 'flex',
    gap: '16px',
  },
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center' as const,
    color: 'var(--chenu-text-secondary, #888)',
  },
};

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function NovaCommandPalette({
  isOpen,
  onClose,
  language = 'fr',
}: CommandPaletteProps) {
  const {
    navigateToSphere,
    navigateToSection,
    executeAction,
    openNova,
    startTutorial,
  } = useNovaContext();
  
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // FILTER COMMANDS
  // ═══════════════════════════════════════════════════════════════════════════
  
  const filteredCommands = useMemo(() => {
    if (!query.trim()) {
      return BUILT_IN_COMMANDS;
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return BUILT_IN_COMMANDS.filter(cmd => {
      const label = language === 'en' ? cmd.labelEn : cmd.label;
      const description = language === 'en' ? cmd.descriptionEn : cmd.description;
      
      return (
        label.toLowerCase().includes(normalizedQuery) ||
        description.toLowerCase().includes(normalizedQuery) ||
        cmd.keywords.some(k => k.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [query, language]);

  // Group by category
  const groupedCommands = useMemo(() => {
    const groups: Record<CommandCategory, NovaCommand[]> = {
      recent: [],
      navigation: [],
      action: [],
      search: [],
      help: [],
      settings: [],
    };
    
    for (const cmd of filteredCommands) {
      groups[cmd.category].push(cmd);
    }
    
    return groups;
  }, [filteredCommands]);

  // Flat list for navigation
  const flatCommands = useMemo(() => {
    return filteredCommands;
  }, [filteredCommands]);

  // ═══════════════════════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selected = resultsRef.current.querySelector('[data-selected="true"]');
      if (selected) {
        selected.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════
  
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, flatCommands.length - 1));
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      
      case 'Enter':
        e.preventDefault();
        if (flatCommands[selectedIndex]) {
          executeCommand(flatCommands[selectedIndex]);
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [flatCommands, selectedIndex, onClose]);

  const executeCommand = useCallback((command: NovaCommand) => {
    const context = {
      navigateToSphere,
      navigateToSection,
      executeAction,
      openNova,
      startTutorial,
    };
    
    command.action(context);
    onClose();
  }, [navigateToSphere, navigateToSection, executeAction, openNova, startTutorial, onClose]);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  
  if (!isOpen) return null;

  const categoryLabels: Record<CommandCategory, { fr: string; en: string }> = {
    recent: { fr: 'Récent', en: 'Recent' },
    navigation: { fr: 'Navigation', en: 'Navigation' },
    action: { fr: 'Actions', en: 'Actions' },
    search: { fr: 'Recherche', en: 'Search' },
    help: { fr: 'Aide', en: 'Help' },
    settings: { fr: 'Paramètres', en: 'Settings' },
  };

  let commandIndex = 0;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.container} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.novaIcon}>🧠</div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={language === 'fr' ? 'Que veux-tu faire?' : 'What do you want to do?'}
            style={styles.input}
          />
          <span style={styles.hint}>
            {language === 'fr' ? 'Esc pour fermer' : 'Esc to close'}
          </span>
        </div>

        {/* Results */}
        <div ref={resultsRef} style={styles.results}>
          {flatCommands.length === 0 ? (
            <div style={styles.emptyState}>
              {language === 'fr' 
                ? 'Aucune commande trouvée. Essaie autre chose!' 
                : 'No commands found. Try something else!'}
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, commands]) => {
              if (commands.length === 0) return null;
              
              return (
                <div key={category}>
                  <div style={styles.category}>
                    {categoryLabels[category as CommandCategory][language]}
                  </div>
                  {commands.map(cmd => {
                    const isSelected = commandIndex === selectedIndex;
                    const thisIndex = commandIndex;
                    commandIndex++;
                    
                    return (
                      <div
                        key={cmd.id}
                        data-selected={isSelected}
                        style={{
                          ...styles.commandItem,
                          ...(isSelected ? styles.commandItemSelected : {}),
                        }}
                        onClick={() => executeCommand(cmd)}
                        onMouseEnter={() => setSelectedIndex(thisIndex)}
                      >
                        <div style={styles.commandIcon}>{cmd.icon}</div>
                        <div style={styles.commandContent}>
                          <div style={styles.commandLabel}>
                            {language === 'en' ? cmd.labelEn : cmd.label}
                          </div>
                          <div style={styles.commandDescription}>
                            {language === 'en' ? cmd.descriptionEn : cmd.description}
                          </div>
                        </div>
                        {cmd.shortcut && (
                          <div style={styles.commandShortcut}>{cmd.shortcut}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerHint}>
            <span>↑↓ {language === 'fr' ? 'naviguer' : 'navigate'}</span>
            <span>↵ {language === 'fr' ? 'sélectionner' : 'select'}</span>
          </div>
          <div>
            💡 {language === 'fr' 
              ? 'Tape "/" partout pour ouvrir'
              : 'Press "/" anywhere to open'}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes nova-palette-appear {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────────

export default NovaCommandPalette;
export { BUILT_IN_COMMANDS };
