/**
 * CHE·NU — Recherche Globale (Command+K)
 */

import React, { useState, useEffect, useRef } from 'react';

const COLORS = {
  bg: '#0D1210',
  card: '#151A18',
  border: '#2A3530',
  cyan: '#00E5FF',
  text: '#E8E4DD',
  muted: '#888888',
};

interface SearchResult {
  id: string;
  type: 'page' | 'sphere' | 'tool' | 'action';
  title: string;
  subtitle?: string;
  icon: string;
  path?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onOpenNova: () => void;
}

const ALL_RESULTS: SearchResult[] = [
  { id: 'nova', type: 'action', title: 'Parler à Nova', subtitle: 'Assistant IA', icon: '🤖' },
  { id: 'new-task', type: 'action', title: 'Nouvelle tâche', icon: '➕' },
  { id: 'dashboard', type: 'page', title: 'Tableau de bord', path: '/', icon: '🏠' },
  { id: 'notifications', type: 'page', title: 'Notifications', path: '/notifications', icon: '🔔' },
  { id: 'settings', type: 'page', title: 'Paramètres', path: '/settings', icon: '⚙️' },
  { id: 'personal', type: 'sphere', title: 'Personal', path: '/sphere/personal', icon: '👤' },
  { id: 'enterprise', type: 'sphere', title: 'Enterprise', path: '/sphere/enterprise', icon: '🏢' },
  { id: 'creative', type: 'sphere', title: 'Creative Studio', path: '/sphere/creative', icon: '🎨' },
  { id: 'ai-labs', type: 'sphere', title: 'AI Labs', path: '/sphere/ai-labs', icon: '🧪' },
  { id: 'calendar', type: 'tool', title: 'Calendrier', path: '/tools/calendar', icon: '📅' },
  { id: 'tasks', type: 'tool', title: 'Tâches', path: '/tools/tasks', icon: '📋' },
  { id: 'files', type: 'tool', title: 'Fichiers', path: '/tools/files', icon: '💾' },
];

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, onNavigate, onOpenNova }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, getResults().length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelect(getResults()[selectedIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, query]);

  const getResults = () => {
    if (!query.trim()) return ALL_RESULTS.slice(0, 8);
    return ALL_RESULTS.filter(r => r.title.toLowerCase().includes(query.toLowerCase()));
  };

  const handleSelect = (result: SearchResult) => {
    if (result.id === 'nova') onOpenNova();
    else if (result.path) onNavigate(result.path);
    onClose();
  };

  if (!isOpen) return null;

  const results = getResults();

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: 100, zIndex: 3000, fontFamily: "'Inter', sans-serif",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 600, background: COLORS.card,
        borderRadius: 16, border: `1px solid ${COLORS.border}`, overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px', borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>🔍</span>
          <input ref={inputRef} type="text" value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Rechercher..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: COLORS.text, fontSize: 16 }}
          />
          <kbd style={{ padding: '4px 8px', background: COLORS.bg, borderRadius: 6,
            color: COLORS.muted, fontSize: 11 }}>ESC</kbd>
        </div>
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {results.map((r, i) => (
            <button key={r.id} onClick={() => handleSelect(r)} style={{
              width: '100%', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12,
              background: selectedIndex === i ? `${COLORS.cyan}15` : 'transparent',
              border: 'none', cursor: 'pointer', textAlign: 'left',
            }}>
              <span style={{ fontSize: 20 }}>{r.icon}</span>
              <div>
                <div style={{ color: COLORS.text, fontSize: 14 }}>{r.title}</div>
                {r.subtitle && <div style={{ color: COLORS.muted, fontSize: 12 }}>{r.subtitle}</div>}
              </div>
            </button>
          ))}
        </div>
        <div style={{ padding: '12px 20px', borderTop: `1px solid ${COLORS.border}`,
          display: 'flex', gap: 16, color: COLORS.muted, fontSize: 11 }}>
          <span>↑↓ naviguer</span><span>↵ sélectionner</span><span>esc fermer</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
