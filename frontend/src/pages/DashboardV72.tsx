/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — ENHANCED DASHBOARD                          ║
 * ║                                                                              ║
 * ║  Integrates: StatsWidget, QuickActions, Notifications, Search, Agents       ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

// V72 Components
import { SphereGrid, type Sphere } from '../components/sphere';
import { DashboardStatsWidget, type DashboardStats } from '../components/dashboard/DashboardStatsWidget';
import { QuickActionsFAB, type QuickAction } from '../components/actions/QuickActionsBar';
import { NotificationCenter, NotificationBell, MOCK_NOTIFICATIONS, type Notification } from '../components/notifications/NotificationCenter';
import { GlobalSearchV72, type SearchResult } from '../components/search/GlobalSearchV72';
import { AgentSuggestionEngine } from '../components/agents/AgentSuggestionEngine';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import type { AgentDefinition } from '../data/agents-catalog';

// API Hooks
import { useDashboardStats } from '../hooks/api';

// ═══════════════════════════════════════════════════════════════════════════════
// FALLBACK STATS (used while loading or on error)
// ═══════════════════════════════════════════════════════════════════════════════

const FALLBACK_STATS: DashboardStats = {
  decisions: {
    total: 0,
    byAging: { GREEN: 0, YELLOW: 0, RED: 0, BLINK: 0 },
  },
  threads: {
    total: 0,
    active: 0,
    bySphere: {
      personal: 0,
      business: 0,
      studio: 0,
      team: 0,
      scholar: 0,
    },
  },
  agents: {
    hired: 0,
    active: 0,
    available: 0,
  },
  checkpoints: {
    pending: 0,
    approved_today: 0,
    rejected_today: 0,
  },
  governance: {
    signals: 0,
    critical: 0,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SKELETON LOADER
// ═══════════════════════════════════════════════════════════════════════════════

const StatsSkeleton: React.FC = () => (
  <div
    style={{
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: 16,
      padding: 20,
      border: '1px solid rgba(255, 255, 255, 0.06)',
    }}
  >
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            flex: '1 1 150px',
            height: 80,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: 12,
          }}
        />
      ))}
    </div>
    <style>{`
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export const DashboardV72: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // API Data
  const { data: statsData, isLoading: statsLoading, isError: statsError } = useDashboardStats();
  const stats = statsData || FALLBACK_STATS;

  // State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────

  const handleSphereClick = (sphere: Sphere) => {
    navigate(`/sphere/${sphere.id}`);
  };

  const handleQuickAction = useCallback((action: QuickAction) => {
    switch (action) {
      case 'nova-chat':
        navigate('/nova');
        break;
      case 'new-thread':
        navigate('/threads?action=new');
        break;
      case 'quick-capture':
        // TODO: Open quick capture modal
        console.log('Quick capture');
        break;
      case 'search':
        setIsSearchOpen(true);
        break;
      case 'new-decision':
        navigate('/decisions?action=new');
        break;
    }
  }, [navigate]);

  const handleSearchSelect = useCallback((result: SearchResult) => {
    if (result.path) {
      navigate(result.path);
    } else if (result.action) {
      result.action();
    }
  }, [navigate]);

  const handleStatClick = useCallback((stat: string) => {
    switch (stat) {
      case 'decisions':
        navigate('/decisions');
        break;
      case 'threads':
        navigate('/threads');
        break;
      case 'agents':
        navigate('/agents');
        break;
      case 'checkpoints':
        navigate('/nova?tab=checkpoints');
        break;
      case 'governance':
        navigate('/governance');
        break;
    }
  }, [navigate]);

  const handleAgentHire = useCallback((agent: AgentDefinition) => {
    navigate(`/agents?hire=${agent.id}`);
  }, [navigate]);

  // Notification handlers
  const handleMarkRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // KEYBOARD SHORTCUTS
  // ─────────────────────────────────────────────────────────────────────────────

  useKeyboardShortcuts({
    onAction: (action) => {
      switch (action) {
        case 'search':
          setIsSearchOpen(true);
          break;
        case 'nova':
          navigate('/nova');
          break;
        case 'new-thread':
          navigate('/threads?action=new');
          break;
        case 'new-decision':
          navigate('/decisions?action=new');
          break;
        case 'dashboard':
          navigate('/');
          break;
        case 'threads':
          navigate('/threads');
          break;
        case 'decisions':
          navigate('/decisions');
          break;
        case 'agents':
          navigate('/agents');
          break;
        case 'notifications':
          setIsNotificationOpen(!isNotificationOpen);
          break;
        case 'escape':
          setIsSearchOpen(false);
          setIsNotificationOpen(false);
          break;
      }
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────────────────────

  const unreadCount = notifications.filter(n => !n.read).length;
  const hasCritical = notifications.some(n => n.priority === 'critical' && !n.read);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #0D1210 0%, #121816 50%, #0F1512 100%)',
        padding: '24px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* HEADER */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          {/* Greeting */}
          <div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: '#E8F0E8',
                margin: 0,
              }}
            >
              {getGreeting()}, {user?.displayName || user?.username || 'Jo'} 👋
            </h1>
            <p style={{ color: '#6B7B6B', fontSize: 13, margin: '8px 0 0' }}>
              Bienvenue dans votre espace CHE·NU™ — <span style={{ color: '#D8B26A' }}>GOUVERNANCE</span> {'>'} EXÉCUTION
            </p>
          </div>

          {/* Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 10,
                color: '#8B9B8B',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              <span>🔍</span>
              <span>Rechercher...</span>
              <kbd
                style={{
                  padding: '2px 6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 4,
                  fontSize: 10,
                  marginLeft: 8,
                }}
              >
                ⌘K
              </kbd>
            </button>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <NotificationBell
                count={unreadCount}
                hasCritical={hasCritical}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              />
              
              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 8,
                    zIndex: 1000,
                  }}
                >
                  <NotificationCenter
                    notifications={notifications}
                    onMarkRead={handleMarkRead}
                    onMarkAllRead={handleMarkAllRead}
                    onDismiss={handleDismissNotification}
                    onClear={handleClearNotifications}
                  />
                </div>
              )}
            </div>

            {/* User Avatar */}
            <button
              onClick={() => navigate('/settings')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #D8B26A 0%, #3F7249 100%)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 600,
                color: '#1E1F22',
              }}
            >
              {(user?.displayName || user?.username || 'J')[0].toUpperCase()}
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* STATS WIDGET */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        
        <div style={{ marginBottom: 32 }}>
          {statsLoading ? (
            <StatsSkeleton />
          ) : statsError ? (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: 12,
                padding: 16,
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#FCA5A5',
                fontSize: 13,
              }}
            >
              ⚠️ Impossible de charger les statistiques. Veuillez réessayer.
            </div>
          ) : (
            <DashboardStatsWidget
              stats={stats}
              onStatClick={handleStatClick}
            />
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* MAIN CONTENT GRID */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: 24,
          }}
        >
          {/* Left Column - Spheres */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#D8B26A',
                  margin: '0 0 4px',
                }}
              >
                Vos 9 Sphères
              </h2>
              <p style={{ color: '#6B7B6B', fontSize: 12, margin: 0 }}>
                Sélectionnez une sphère pour accéder à vos espaces de travail
              </p>
            </div>

            <SphereGrid columns={3} onSphereClick={handleSphereClick} />

            {/* Nova Quick Access */}
            <div
              style={{
                marginTop: 24,
                padding: 20,
                background: 'linear-gradient(135deg, rgba(216, 178, 106, 0.08) 0%, rgba(63, 114, 73, 0.08) 100%)',
                borderRadius: 16,
                border: '1px solid rgba(216, 178, 106, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #D8B26A 0%, #3F7249 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                  }}
                >
                  ✨
                </div>
                <div>
                  <h3 style={{ color: '#E8F0E8', fontSize: 15, fontWeight: 600, margin: 0 }}>
                    Nova est prête
                  </h3>
                  <p style={{ color: '#6B7B6B', fontSize: 12, margin: '4px 0 0' }}>
                    Intelligence gouvernée • ⌘J
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/nova')}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)',
                  border: 'none',
                  borderRadius: 10,
                  color: '#1A1A1A',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Parler →
              </button>
            </div>
          </div>

          {/* Right Column - Agent Suggestions */}
          <div>
            <AgentSuggestionEngine
              context={{
                sphereId: 'business',
                keywords: ['gestion', 'projet'],
              }}
              maxSuggestions={4}
              onHire={handleAgentHire}
            />

            {/* Quick Links */}
            <div
              style={{
                marginTop: 20,
                padding: 16,
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <h3 style={{ fontSize: 12, color: '#6B7B6B', margin: '0 0 12px', fontWeight: 500 }}>
                Accès rapide
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: '🛡️', label: 'Gouvernance CEA', path: '/governance' },
                  { icon: '📊', label: 'Décisions', path: '/decisions' },
                  { icon: '🤖', label: 'Marketplace Agents', path: '/agents' },
                  { icon: '🥽', label: 'Vue XR', path: '/xr' },
                ].map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: 8,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    <span style={{ fontSize: 12, color: '#9BA89B' }}>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* FOOTER */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        
        <div
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 10, color: '#3B4B3B' }}>
            CHE·NU™ V72 — Governed Intelligence Operating System
          </span>
          <div style={{ display: 'flex', gap: 16, fontSize: 10, color: '#4B5B4B' }}>
            <span>⌘K Recherche</span>
            <span>⌘J Nova</span>
            <span>⌘N Thread</span>
            <span>? Aide</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* FLOATING COMPONENTS */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}

      {/* Quick Actions FAB */}
      <QuickActionsFAB onAction={handleQuickAction} />

      {/* Global Search Modal */}
      <GlobalSearchV72
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSearchSelect}
        onNavigate={navigate}
      />

      {/* Click outside to close notification */}
      {isNotificationOpen && (
        <div
          onClick={() => setIsNotificationOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};

export default DashboardV72;
