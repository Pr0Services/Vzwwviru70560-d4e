/**
 * CHE·NU™ App Provider
 * 
 * Centralizes initialization of all app-wide services and contexts.
 * Wraps the application with necessary providers.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React from 'react';
import { 
  ToastContainer, 
  PWAUpdateBanner, 
  PWAInstallPrompt,
  LoadingStyles,
  PageErrorBoundary,
  OfflineStatusIndicator,
} from '../components/common';
import { initPWA } from '../services/pwa';
import { useOfflineStore } from '../services/offline';

// ═══════════════════════════════════════════════════════════════════════════
// APP CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

interface AppContextValue {
  isInitialized: boolean;
  isOnline: boolean;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const AppContext = React.createContext<AppContextValue>({
  isInitialized: false,
  isOnline: true,
  theme: 'system',
  setTheme: () => {},
});

export const useApp = () => React.useContext(AppContext);

// ═══════════════════════════════════════════════════════════════════════════
// APP PROVIDER
// ═══════════════════════════════════════════════════════════════════════════

export interface AppProviderProps {
  children: React.ReactNode;
  /** Initial theme */
  defaultTheme?: 'light' | 'dark' | 'system';
  /** Show offline indicator */
  showOfflineIndicator?: boolean;
  /** Show PWA install prompt */
  showInstallPrompt?: boolean;
  /** Position of offline indicator */
  offlinePosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  defaultTheme = 'system',
  showOfflineIndicator = true,
  showInstallPrompt = true,
  offlinePosition = 'bottom-right',
}) => {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'system'>(defaultTheme);
  
  // Get online status from offline store
  const isOnline = useOfflineStore(state => state.isOnline);
  const initializeOffline = useOfflineStore(state => state.initialize);

  // Initialize on mount
  React.useEffect(() => {
    const init = async () => {
      try {
        // Initialize PWA features
        await initPWA();
        
        // Initialize offline support
        await initializeOffline();
        
        // Load saved theme
        const savedTheme = localStorage.getItem('chenu-theme') as typeof theme;
        if (savedTheme) {
          setTheme(savedTheme);
        }
        
        console.log('[App] CHE·NU initialized');
        setIsInitialized(true);
      } catch (error) {
        console.error('[App] Initialization error:', error);
        setIsInitialized(true); // Still mark as initialized to allow app to render
      }
    };

    init();
  }, [initializeOffline]);

  // Handle theme changes
  React.useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      root.setAttribute('data-theme', systemTheme);
    } else {
      root.setAttribute('data-theme', theme);
    }
    
    localStorage.setItem('chenu-theme', theme);
  }, [theme]);

  // Listen for system theme changes
  React.useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const contextValue = React.useMemo(() => ({
    isInitialized,
    isOnline,
    theme,
    setTheme,
  }), [isInitialized, isOnline, theme]);

  return (
    <AppContext.Provider value={contextValue}>
      <PageErrorBoundary>
        {/* Global styles */}
        <LoadingStyles />
        <GlobalStyles />
        
        {/* Main content */}
        {children}
        
        {/* Toast notifications */}
        <ToastContainer />
        
        {/* PWA update banner */}
        <PWAUpdateBanner position="bottom" />
        
        {/* PWA install prompt (conditional) */}
        {showInstallPrompt && (
          <PWAInstallPrompt variant="banner" position="bottom" />
        )}
        
        {/* Offline indicator (conditional) */}
        {showOfflineIndicator && (
          <OfflineStatusIndicator position={offlinePosition} />
        )}
      </PageErrorBoundary>
    </AppContext.Provider>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════════════════

const GlobalStyles: React.FC = () => (
  <style>{`
    /* CSS Variables */
    :root {
      /* Colors - Light theme */
      --color-primary: #6366f1;
      --color-primary-hover: #4f46e5;
      --color-primary-light: #818cf8;
      
      --color-success: #22c55e;
      --color-error: #ef4444;
      --color-warning: #f59e0b;
      --color-info: #3b82f6;
      
      --color-bg-primary: #ffffff;
      --color-bg-secondary: #f9fafb;
      --color-bg-tertiary: #f3f4f6;
      --color-bg-tertiary-hover: #e5e7eb;
      
      --color-text-primary: #111827;
      --color-text-secondary: #6b7280;
      --color-text-tertiary: #9ca3af;
      
      --color-border: #e5e7eb;
      --color-border-hover: #d1d5db;
      
      --color-skeleton: #e5e7eb;
      --color-skeleton-highlight: #f3f4f6;
      
      /* Spacing */
      --space-1: 4px;
      --space-2: 8px;
      --space-3: 12px;
      --space-4: 16px;
      --space-5: 20px;
      --space-6: 24px;
      --space-8: 32px;
      --space-10: 40px;
      --space-12: 48px;
      
      /* Border radius */
      --radius-sm: 4px;
      --radius-md: 8px;
      --radius-lg: 12px;
      --radius-xl: 16px;
      --radius-full: 9999px;
      
      /* Typography */
      --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Monaco, Consolas, monospace;
      
      --text-xs: 12px;
      --text-sm: 14px;
      --text-base: 16px;
      --text-lg: 18px;
      --text-xl: 20px;
      --text-2xl: 24px;
      --text-3xl: 30px;
      
      /* Shadows */
      --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      
      /* Transitions */
      --transition-fast: 0.1s ease;
      --transition-normal: 0.2s ease;
      --transition-slow: 0.3s ease;
      
      /* Z-indexes */
      --z-dropdown: 1000;
      --z-sticky: 1020;
      --z-fixed: 1030;
      --z-modal-backdrop: 1040;
      --z-modal: 1050;
      --z-popover: 1060;
      --z-tooltip: 1070;
      --z-toast: 1080;
    }

    /* Dark theme */
    [data-theme="dark"] {
      --color-bg-primary: #0a0a0a;
      --color-bg-secondary: #141414;
      --color-bg-tertiary: #1f1f1f;
      --color-bg-tertiary-hover: #2a2a2a;
      
      --color-text-primary: #f9fafb;
      --color-text-secondary: #9ca3af;
      --color-text-tertiary: #6b7280;
      
      --color-border: #2a2a2a;
      --color-border-hover: #3a3a3a;
      
      --color-skeleton: #2a2a2a;
      --color-skeleton-highlight: #3a3a3a;
    }

    /* Reset */
    *, *::before, *::after {
      box-sizing: border-box;
    }

    html {
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: var(--font-sans);
      background: var(--color-bg-primary);
      color: var(--color-text-primary);
      line-height: 1.5;
    }

    /* Focus styles */
    :focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    /* Selection */
    ::selection {
      background: var(--color-primary);
      color: white;
    }

    /* Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: var(--color-border);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: var(--color-border-hover);
    }

    /* Links */
    a {
      color: var(--color-primary);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    /* Buttons */
    button {
      font-family: inherit;
    }

    /* Images */
    img {
      max-width: 100%;
      height: auto;
    }

    /* Code */
    code, pre {
      font-family: var(--font-mono);
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `}</style>
);

export default AppProvider;
