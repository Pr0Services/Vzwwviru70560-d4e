/**
 * CHE·NU™ — Desktop Integration Hook
 * Detects if running in Electron and provides desktop-specific functionality
 */

import { useEffect, useState, useCallback } from 'react';

// TypeScript interface for the exposed Electron API
interface ChenuDesktopAPI {
  platform: string;
  isDesktop: boolean;
  store: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: unknown) => Promise<boolean>;
  };
  app: {
    getInfo: () => Promise<{ version: string; name: string; platform: string }>;
  };
  window: {
    minimize: () => void;
    maximize: () => void;
    close: () => void;
  };
  theme: {
    get: () => Promise<boolean>;
    onChange: (callback: (isDark: boolean) => void) => void;
  };
  onNavigate: (callback: (screen: string) => void) => void;
  onToggleNova: (callback: () => void) => void;
  onSelectSphere: (callback: (sphere: string) => void) => void;
  onNewWorkspace: (callback: () => void) => void;
  onNewNote: (callback: () => void) => void;
  onSave: (callback: () => void) => void;
  onOpenPreferences: (callback: () => void) => void;
  onShowShortcuts: (callback: () => void) => void;
  notify: (title: string, body: string) => void;
}

declare global {
  interface Window {
    chenu?: ChenuDesktopAPI;
  }
}

interface DesktopState {
  isDesktop: boolean;
  platform: string | null;
  appVersion: string | null;
}

interface UseDesktopReturn extends DesktopState {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  notify: (title: string, body: string) => void;
  storeGet: (key: string) => Promise<any>;
  storeSet: (key: string, value: unknown) => Promise<boolean>;
}

/**
 * Hook for desktop integration
 * Returns desktop-specific functions that work both in Electron and web
 */
export function useDesktop(handlers?: {
  onNavigate?: (screen: string) => void;
  onToggleNova?: () => void;
  onSelectSphere?: (sphere: string) => void;
  onNewWorkspace?: () => void;
  onNewNote?: () => void;
  onSave?: () => void;
  onOpenPreferences?: () => void;
  onShowShortcuts?: () => void;
}): UseDesktopReturn {
  const [state, setState] = useState<DesktopState>({
    isDesktop: false,
    platform: null,
    appVersion: null,
  });

  // Initialize on mount
  useEffect(() => {
    const api = window.chenu;
    
    if (api?.isDesktop) {
      // We're in Electron
      setState({
        isDesktop: true,
        platform: api.platform,
        appVersion: null, // Will be set async
      });

      // Get app version
      api.app.getInfo().then((info) => {
        setState((prev) => ({ ...prev, appVersion: info.version }));
      });

      // Set up event handlers
      if (handlers?.onNavigate) api.onNavigate(handlers.onNavigate);
      if (handlers?.onToggleNova) api.onToggleNova(handlers.onToggleNova);
      if (handlers?.onSelectSphere) api.onSelectSphere(handlers.onSelectSphere);
      if (handlers?.onNewWorkspace) api.onNewWorkspace(handlers.onNewWorkspace);
      if (handlers?.onNewNote) api.onNewNote(handlers.onNewNote);
      if (handlers?.onSave) api.onSave(handlers.onSave);
      if (handlers?.onOpenPreferences) api.onOpenPreferences(handlers.onOpenPreferences);
      if (handlers?.onShowShortcuts) api.onShowShortcuts(handlers.onShowShortcuts);
    }
  }, []);

  // Window controls
  const minimize = useCallback(() => {
    window.chenu?.window.minimize();
  }, []);

  const maximize = useCallback(() => {
    window.chenu?.window.maximize();
  }, []);

  const close = useCallback(() => {
    window.chenu?.window.close();
  }, []);

  // Notifications
  const notify = useCallback((title: string, body: string) => {
    if (window.chenu?.notify) {
      window.chenu.notify(title, body);
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }, []);

  // Store operations
  const storeGet = useCallback(async (key: string): Promise<any> => {
    if (window.chenu?.store) {
      return window.chenu.store.get(key);
    }
    // Fallback to localStorage for web
    const value = localStorage.getItem(`chenu:${key}`);
    return value ? JSON.parse(value) : null;
  }, []);

  const storeSet = useCallback(async (key: string, value: unknown): Promise<boolean> => {
    if (window.chenu?.store) {
      return window.chenu.store.set(key, value);
    }
    // Fallback to localStorage for web
    localStorage.setItem(`chenu:${key}`, JSON.stringify(value));
    return true;
  }, []);

  return {
    ...state,
    minimize,
    maximize,
    close,
    notify,
    storeGet,
    storeSet,
  };
}

/**
 * Check if running in desktop mode
 */
export function isDesktop(): boolean {
  return !!window.chenu?.isDesktop;
}

/**
 * Get platform
 */
export function getPlatform(): string {
  return window.chenu?.platform ?? 'web';
}
