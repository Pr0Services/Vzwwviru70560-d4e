/**
 * CHE·NU — useKeyboard Hook
 */

import { useEffect, useCallback } from 'react';

interface ShortcutOptions {
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
}

export function useKeyboard(
  key: string,
  callback: () => void,
  options: ShortcutOptions = {}
) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { ctrl, meta, shift, alt } = options;
    
    const ctrlMatch = ctrl ? (event.ctrlKey || event.metaKey) : true;
    const metaMatch = meta ? event.metaKey : true;
    const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
    const altMatch = alt ? event.altKey : !event.altKey;
    
    if (
      event.key.toLowerCase() === key.toLowerCase() &&
      ctrlMatch &&
      metaMatch &&
      shiftMatch &&
      altMatch
    ) {
      event.preventDefault();
      callback();
    }
  }, [key, callback, options]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Predefined shortcuts
export function useNovaShortcut(callback: () => void) {
  useKeyboard('k', callback, { ctrl: true });
}

export function useSearchShortcut(callback: () => void) {
  useKeyboard('/', callback);
}

export function useEscapeShortcut(callback: () => void) {
  useKeyboard('Escape', callback);
}

export default useKeyboard;
