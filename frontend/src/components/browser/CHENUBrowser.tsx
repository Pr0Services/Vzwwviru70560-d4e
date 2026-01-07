/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — BROWSER                                               ║
 * ║              Tab 3 Mobile: 🌐 Navigateur Intégré                             ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  PROTOCOLES SUPPORTÉS:                                                       ║
 * ║  - chenu://    → URLs internes (workspaces, dataspaces, threads)             ║
 * ║  - https://    → Sites web externes                                          ║
 * ║  - workspace:  → Rendu des workspace modes                                   ║
 * ║  - document:   → Visualisation de documents                                  ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  ARCHITECTURE MOBILE (3 TABS):                                               ║
 * ║  Tab 1: Communications (Nova, Agents, Appels)                                ║
 * ║  Tab 2: Navigation Hub (Dashboard, Sphères, Favoris)                         ║
 * ║  Tab 3: CHE·NU Browser ← CE COMPOSANT                                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHENU_COLORS } from '../../types';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type BrowserProtocol = 'chenu' | 'https' | 'http' | 'workspace' | 'document' | 'dataspace' | 'thread' | 'meeting';

interface BrowserTab {
  id: string;
  url: string;
  title: string;
  protocol: BrowserProtocol;
  favicon?: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

interface BookmarkItem {
  id: string;
  url: string;
  title: string;
  icon: string;
  category: 'workspace' | 'dataspace' | 'external' | 'favorite';
}

interface HistoryItem {
  id: string;
  url: string;
  title: string;
  visitedAt: Date;
  protocol: BrowserProtocol;
}

interface CHENUBrowserProps {
  initialUrl?: string;
  userId?: string;
  onNavigate?: (url: string) => void;
  onWorkspaceOpen?: (workspaceId: string) => void;
  onDataSpaceOpen?: (dataspaceId: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const PROTOCOL_CONFIG: Record<BrowserProtocol, { label: string; icon: string; color: string; secure: boolean }> = {
  chenu: { label: 'CHE·NU', icon: '✦', color: CHENU_COLORS.sacredGold, secure: true },
  https: { label: 'Sécurisé', icon: '🔒', color: CHENU_COLORS.jungleEmerald, secure: true },
  http: { label: 'BLOQUÉ', icon: '🚫', color: '#ef4444', secure: false }, // HTTP BLOQUÉ
  workspace: { label: 'Workspace', icon: '📂', color: CHENU_COLORS.cenoteTurquoise },
  document: { label: 'Document', icon: '📄', color: '#3b82f6' },
  dataspace: { label: 'DataSpace', icon: '💾', color: '#8b5cf6' },
  thread: { label: 'Thread', icon: '💬', color: CHENU_COLORS.earthEmber },
  meeting: { label: 'Meeting', icon: '🎥', color: '#ec4899' },
};

const DEFAULT_BOOKMARKS: BookmarkItem[] = [
  { id: 'bk1', url: 'chenu://home', title: 'Accueil', icon: '🏠', category: 'workspace' },
  { id: 'bk2', url: 'chenu://workspace/recent', title: 'Récents', icon: '🕐', category: 'workspace' },
  { id: 'bk3', url: 'chenu://dataspace/all', title: 'DataSpaces', icon: '💾', category: 'dataspace' },
  { id: 'bk4', url: 'chenu://threads', title: 'Threads', icon: '💬', category: 'workspace' },
  { id: 'bk5', url: 'chenu://meetings', title: 'Réunions', icon: '🎥', category: 'workspace' },
];

const QUICK_ACCESS = [
  { url: 'chenu://sphere/personal', label: 'Personal', icon: '🏠' },
  { url: 'chenu://sphere/business', label: 'Business', icon: '💼' },
  { url: 'chenu://sphere/my_team', label: 'My Team', icon: '🤝' },
  { url: 'chenu://nova', label: 'Nova', icon: '✦' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    backgroundColor: CHENU_COLORS.uiSlate,
  },
  // Tab Bar
  tabBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    padding: '8px 12px 0',
    backgroundColor: '#0a0a0b',
    overflowX: 'auto' as const,
  },
  tab: (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: isActive ? '#1a1a1c' : 'transparent',
    borderRadius: '8px 8px 0 0',
    border: 'none',
    color: isActive ? CHENU_COLORS.softSand : CHENU_COLORS.ancientStone,
    fontSize: '13px',
    cursor: 'pointer',
    maxWidth: '200px',
    minWidth: '100px',
  }),
  tabTitle: {
    flex: 1,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  tabClose: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newTabBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Address Bar
  addressBarContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    backgroundColor: '#111113',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  navBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnDisabled: {
    opacity: 0.3,
    cursor: 'not-allowed',
  },
  addressBar: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#0d0d0f',
    borderRadius: '20px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
  },
  protocolBadge: (color: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '10px',
    backgroundColor: color + '22',
    color: color,
    fontSize: '11px',
    fontWeight: 600,
  }),
  urlInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    outline: 'none',
  },
  actionBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Content Area
  contentArea: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative' as const,
  },
  // New Tab Page
  newTabPage: {
    height: '100%',
    overflowY: 'auto' as const,
    padding: '40px 20px',
  },
  newTabHeader: {
    textAlign: 'center' as const,
    marginBottom: '40px',
  },
  newTabLogo: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  newTabTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '8px',
  },
  newTabSubtitle: {
    fontSize: '14px',
    color: CHENU_COLORS.ancientStone,
  },
  searchBox: {
    maxWidth: '600px',
    margin: '0 auto 40px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
    backgroundColor: '#111113',
    borderRadius: '24px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    color: CHENU_COLORS.softSand,
    fontSize: '16px',
    outline: 'none',
  },
  quickAccessGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '16px',
    maxWidth: '500px',
    margin: '0 auto 40px',
  },
  quickAccessItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    padding: '16px',
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    cursor: 'pointer',
  },
  quickAccessIcon: {
    fontSize: '28px',
  },
  quickAccessLabel: {
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
    textAlign: 'center' as const,
  },
  bookmarksSection: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  bookmarksList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  bookmarkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    backgroundColor: '#111113',
    borderRadius: '20px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    cursor: 'pointer',
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
  },
  // Web Content (iframe placeholder)
  webContent: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    border: 'none',
  },
  // Internal Content
  internalContent: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column' as const,
    gap: '20px',
    color: CHENU_COLORS.softSand,
  },
  internalIcon: {
    fontSize: '64px',
  },
  internalTitle: {
    fontSize: '20px',
    fontWeight: 600,
  },
  internalUrl: {
    fontSize: '14px',
    color: CHENU_COLORS.ancientStone,
    padding: '8px 16px',
    backgroundColor: '#111113',
    borderRadius: '20px',
  },
  // Loading
  loadingBar: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    height: '3px',
    backgroundColor: CHENU_COLORS.sacredGold,
    animation: 'loading 1s ease-in-out infinite',
  },
  // Menu
  menuOverlay: {
    position: 'absolute' as const,
    top: '100%',
    right: 0,
    marginTop: '8px',
    backgroundColor: '#1a1a1c',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    borderRadius: '12px',
    padding: '8px',
    minWidth: '200px',
    zIndex: 100,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left' as const,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function parseUrl(url: string): { protocol: BrowserProtocol; path: string; display: string } {
  if (url.startsWith('chenu://')) {
    const path = url.replace('chenu://', '');
    // Determine specific chenu protocol
    if (path.startsWith('workspace')) return { protocol: 'workspace', path, display: url };
    if (path.startsWith('dataspace')) return { protocol: 'dataspace', path, display: url };
    if (path.startsWith('thread')) return { protocol: 'thread', path, display: url };
    if (path.startsWith('meeting')) return { protocol: 'meeting', path, display: url };
    if (path.startsWith('document')) return { protocol: 'document', path, display: url };
    return { protocol: 'chenu', path, display: url };
  }
  if (url.startsWith('https://')) {
    return { protocol: 'https', path: url.replace('https://', ''), display: url };
  }
  if (url.startsWith('http://')) {
    return { protocol: 'http', path: url.replace('http://', ''), display: url };
  }
  // Default: treat as chenu
  return { protocol: 'chenu', path: url, display: `chenu://${url}` };
}

function getTitleFromUrl(url: string): string {
  const { protocol, path } = parseUrl(url);
  if (protocol === 'chenu' && path === 'home') return 'Accueil CHE·NU';
  if (protocol === 'chenu' && path === 'nova') return 'Nova Intelligence';
  if (url.includes('workspace')) return 'Workspace';
  if (url.includes('dataspace')) return 'DataSpace';
  if (url.includes('sphere')) {
    const sphere = path.split('/').pop();
    return `Sphère ${sphere?.charAt(0).toUpperCase()}${sphere?.slice(1)}`;
  }
  return url;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const CHENUBrowser: React.FC<CHENUBrowserProps> = ({
  initialUrl = 'chenu://home',
  userId,
  onNavigate,
  onWorkspaceOpen,
  onDataSpaceOpen,
}) => {
  // State
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: 'tab-1',
      url: initialUrl,
      title: getTitleFromUrl(initialUrl),
      protocol: parseUrl(initialUrl).protocol,
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const [urlInput, setUrlInput] = useState(initialUrl);
  const [showMenu, setShowMenu] = useState(false);
  const [bookmarks] = useState<BookmarkItem[]>(DEFAULT_BOOKMARKS);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Current tab
  const activeTab = useMemo(() => {
    return tabs.find(t => t.id === activeTabId) || tabs[0];
  }, [tabs, activeTabId]);

  const parsedUrl = useMemo(() => parseUrl(activeTab?.url || ''), [activeTab?.url]);

  // Handlers
  const navigate = useCallback((url: string) => {
    let parsed = parseUrl(url);
    
    // 🔒 SÉCURITÉ: Bloquer HTTP, forcer HTTPS
    if (parsed.protocol === 'http') {
      // Upgrade automatique vers HTTPS
      const secureUrl = url.replace('http://', 'https://');
      parsed = parseUrl(secureUrl);
      logger.warn('[CHE·NU Security] HTTP bloqué, upgrade vers HTTPS:', secureUrl);
    }
    
    const fullUrl = parsed.display;
    
    setTabs(prev => prev.map(t => 
      t.id === activeTabId
        ? {
            ...t,
            url: fullUrl,
            title: getTitleFromUrl(fullUrl),
            protocol: parsed.protocol,
            isLoading: true,
            canGoBack: true,
          }
        : t
    ));
    
    setUrlInput(fullUrl);
    
    // Add to history
    setHistory(prev => [{
      id: `h-${Date.now()}`,
      url: fullUrl,
      title: getTitleFromUrl(fullUrl),
      visitedAt: new Date(),
      protocol: parsed.protocol,
    }, ...prev.slice(0, 99)]);
    
    // Simulate loading
    setTimeout(() => {
      setTabs(prev => prev.map(t =>
        t.id === activeTabId ? { ...t, isLoading: false } : t
      ));
    }, 500);
    
    onNavigate?.(fullUrl);
    
    // Handle specific protocols
    if (parsed.protocol === 'workspace') {
      const workspaceId = parsed.path.split('/').pop();
      if (workspaceId) onWorkspaceOpen?.(workspaceId);
    }
    if (parsed.protocol === 'dataspace') {
      const dataspaceId = parsed.path.split('/').pop();
      if (dataspaceId) onDataSpaceOpen?.(dataspaceId);
    }
  }, [activeTabId, onNavigate, onWorkspaceOpen, onDataSpaceOpen]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    navigate(urlInput);
  }, [urlInput, navigate]);

  const createNewTab = useCallback(() => {
    const newTab: BrowserTab = {
      id: `tab-${Date.now()}`,
      url: 'chenu://home',
      title: 'Nouvel onglet',
      protocol: 'chenu',
      isLoading: false,
      canGoBack: false,
      canGoForward: false,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
    setUrlInput('chenu://home');
  }, []);

  const closeTab = useCallback((tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Don't close last tab
    
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    setTabs(prev => prev.filter(t => t.id !== tabId));
    
    if (tabId === activeTabId) {
      const newActiveIndex = Math.max(0, tabIndex - 1);
      setActiveTabId(tabs[newActiveIndex]?.id || tabs[0].id);
    }
  }, [tabs, activeTabId]);

  const goBack = useCallback(() => {
    // Simplified: just go to home
    navigate('chenu://home');
  }, [navigate]);

  const goForward = useCallback(() => {
    // TODO: Implement proper history navigation
  }, []);

  const refresh = useCallback(() => {
    setTabs(prev => prev.map(t =>
      t.id === activeTabId ? { ...t, isLoading: true } : t
    ));
    setTimeout(() => {
      setTabs(prev => prev.map(t =>
        t.id === activeTabId ? { ...t, isLoading: false } : t
      ));
    }, 500);
  }, [activeTabId]);

  const isNewTabPage = activeTab?.url === 'chenu://home' || activeTab?.url === '';

  // Render content based on URL
  const renderContent = () => {
    if (isNewTabPage) {
      return (
        <div style={styles.newTabPage}>
          <div style={styles.newTabHeader}>
            <div style={styles.newTabLogo}>✦</div>
            <h1 style={styles.newTabTitle}>CHE·NU Browser</h1>
            <p style={styles.newTabSubtitle}>Intelligence gouvernée à portée de clic</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.searchBox}>
              <span>🔍</span>
              <input
                style={styles.searchInput}
                placeholder="Rechercher ou entrer une URL chenu://"
                value={urlInput === 'chenu://home' ? '' : urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
            </div>
          </form>

          <div style={styles.quickAccessGrid}>
            {QUICK_ACCESS.map(item => (
              <motion.div
                key={item.url}
                style={styles.quickAccessItem}
                whileHover={{ scale: 1.05, borderColor: CHENU_COLORS.sacredGold }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.url)}
              >
                <span style={styles.quickAccessIcon}>{item.icon}</span>
                <span style={styles.quickAccessLabel}>{item.label}</span>
              </motion.div>
            ))}
          </div>

          <div style={styles.bookmarksSection}>
            <div style={styles.sectionTitle}>
              <span>⭐</span>
              <span>Favoris</span>
            </div>
            <div style={styles.bookmarksList}>
              {bookmarks.map(bk => (
                <motion.div
                  key={bk.id}
                  style={styles.bookmarkItem}
                  whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '22' }}
                  onClick={() => navigate(bk.url)}
                >
                  <span>{bk.icon}</span>
                  <span>{bk.title}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Internal CHE·NU content
    if (parsedUrl.protocol !== 'https' && parsedUrl.protocol !== 'http') {
      const config = PROTOCOL_CONFIG[parsedUrl.protocol];
      return (
        <div style={styles.internalContent}>
          <motion.div
            style={{ ...styles.internalIcon, color: config.color }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {config.icon}
          </motion.div>
          <div style={styles.internalTitle}>{activeTab.title}</div>
          <div style={styles.internalUrl}>{activeTab.url}</div>
          <p style={{ color: CHENU_COLORS.ancientStone, textAlign: 'center', maxWidth: '400px' }}>
            Ce contenu sera rendu par le moteur CHE·NU approprié
            ({config.label})
          </p>
        </div>
      );
    }

    // External web content (iframe)
    return (
      <iframe
        style={styles.webContent}
        src={activeTab.url}
        title={activeTab.title}
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    );
  };

  return (
    <div style={styles.container}>
      {/* Tab Bar */}
      <div style={styles.tabBar}>
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            style={styles.tab(tab.id === activeTabId)}
            onClick={() => {
              setActiveTabId(tab.id);
              setUrlInput(tab.url);
            }}
            whileHover={{ backgroundColor: tab.id === activeTabId ? '#1a1a1c' : '#111113' }}
          >
            <span>{PROTOCOL_CONFIG[tab.protocol]?.icon || '📄'}</span>
            <span style={styles.tabTitle}>{tab.title}</span>
            {tabs.length > 1 && (
              <motion.button
                style={styles.tabClose}
                whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '33' }}
                onClick={(e) => closeTab(tab.id, e)}
              >
                ✕
              </motion.button>
            )}
          </motion.button>
        ))}
        <motion.button
          style={styles.newTabBtn}
          whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '22' }}
          onClick={createNewTab}
        >
          +
        </motion.button>
      </div>

      {/* Address Bar */}
      <div style={styles.addressBarContainer}>
        <motion.button
          style={{
            ...styles.navBtn,
            ...(activeTab.canGoBack ? {} : styles.navBtnDisabled),
          }}
          whileHover={activeTab.canGoBack ? { backgroundColor: CHENU_COLORS.ancientStone + '22' } : {}}
          onClick={goBack}
          disabled={!activeTab.canGoBack}
        >
          ←
        </motion.button>
        
        <motion.button
          style={{
            ...styles.navBtn,
            ...(activeTab.canGoForward ? {} : styles.navBtnDisabled),
          }}
          whileHover={activeTab.canGoForward ? { backgroundColor: CHENU_COLORS.ancientStone + '22' } : {}}
          onClick={goForward}
          disabled={!activeTab.canGoForward}
        >
          →
        </motion.button>
        
        <motion.button
          style={styles.navBtn}
          whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '22' }}
          onClick={refresh}
        >
          {activeTab.isLoading ? '⏳' : '🔄'}
        </motion.button>

        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
          <div style={styles.addressBar}>
            <div style={styles.protocolBadge(PROTOCOL_CONFIG[parsedUrl.protocol]?.color || CHENU_COLORS.ancientStone)}>
              {PROTOCOL_CONFIG[parsedUrl.protocol]?.icon}
              {PROTOCOL_CONFIG[parsedUrl.protocol]?.label}
            </div>
            <input
              ref={inputRef}
              style={styles.urlInput}
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="chenu://home"
            />
          </div>
        </form>

        <motion.button
          style={styles.actionBtn}
          whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '22' }}
          onClick={() => {/* Add to bookmarks */}}
        >
          ⭐
        </motion.button>

        <div style={{ position: 'relative' }}>
          <motion.button
            style={styles.actionBtn}
            whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '22' }}
            onClick={() => setShowMenu(!showMenu)}
          >
            ⋮
          </motion.button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                style={styles.menuOverlay}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <motion.button
                  style={styles.menuItem}
                  whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '22' }}
                  onClick={() => { createNewTab(); setShowMenu(false); }}
                >
                  ➕ Nouvel onglet
                </motion.button>
                <motion.button
                  style={styles.menuItem}
                  whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '22' }}
                >
                  📜 Historique
                </motion.button>
                <motion.button
                  style={styles.menuItem}
                  whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '22' }}
                >
                  ⭐ Favoris
                </motion.button>
                <motion.button
                  style={styles.menuItem}
                  whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '22' }}
                >
                  ⚙️ Paramètres
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content Area */}
      <div style={styles.contentArea}>
        {activeTab.isLoading && (
          <motion.div
            style={styles.loadingBar}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5 }}
          />
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default CHENUBrowser;
