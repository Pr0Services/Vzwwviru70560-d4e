/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — THREADS PAGE                                ║
 * ║                                                                              ║
 * ║  Thread listing with maturity levels, sphere filtering, founding intent      ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// V72 Components
import { GlobalSearchV72 } from '../components/search/GlobalSearchV72';
import { QuickActionsFAB, type QuickAction } from '../components/actions/QuickActionsBar';
import { NotificationBell } from '../components/notifications/NotificationCenter';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useSpheres, SPHERES } from '../hooks/useSpheres';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type MaturityLevel = 'SEED' | 'SPROUTING' | 'GROWING' | 'MATURE' | 'RIPE';
type ThreadStatus = 'active' | 'paused' | 'completed' | 'archived';

interface Thread {
  id: string;
  title: string;
  founding_intent: string;
  sphere_id: string;
  status: ThreadStatus;
  maturity_level: MaturityLevel;
  maturity_score: number;
  event_count: number;
  decision_count: number;
  last_activity: string;
  created_at: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const MATURITY_CONFIG: Record<MaturityLevel, { color: string; bg: string; icon: string; label: string }> = {
  SEED: { color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.15)', icon: '🌱', label: 'Graine' },
  SPROUTING: { color: '#34D399', bg: 'rgba(52, 211, 153, 0.15)', icon: '🌿', label: 'Germination' },
  GROWING: { color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)', icon: '🌳', label: 'Croissance' },
  MATURE: { color: '#D8B26A', bg: 'rgba(216, 178, 106, 0.15)', icon: '🌲', label: 'Mature' },
  RIPE: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', icon: '🍎', label: 'Mûr' },
};

const STATUS_CONFIG: Record<ThreadStatus, { color: string; label: string }> = {
  active: { color: '#4ADE80', label: 'Actif' },
  paused: { color: '#FACC15', label: 'En pause' },
  completed: { color: '#3EB4A2', label: 'Complété' },
  archived: { color: '#6B7B6B', label: 'Archivé' },
};

// Mock threads data
const MOCK_THREADS: Thread[] = [
  {
    id: 'thread-1',
    title: 'Rénovation cuisine',
    founding_intent: 'Planifier et exécuter la rénovation complète de la cuisine principale',
    sphere_id: 'personal',
    status: 'active',
    maturity_level: 'GROWING',
    maturity_score: 65,
    event_count: 47,
    decision_count: 8,
    last_activity: '2025-01-07T10:30:00Z',
    created_at: '2024-12-15T09:00:00Z',
  },
  {
    id: 'thread-2',
    title: 'Lancement produit Q1',
    founding_intent: 'Coordonner le lancement du nouveau produit pour Q1 2025',
    sphere_id: 'business',
    status: 'active',
    maturity_level: 'MATURE',
    maturity_score: 82,
    event_count: 124,
    decision_count: 23,
    last_activity: '2025-01-07T09:45:00Z',
    created_at: '2024-11-01T08:00:00Z',
  },
  {
    id: 'thread-3',
    title: 'Formation équipe dev',
    founding_intent: 'Organiser et suivre la formation continue de l\'équipe développement',
    sphere_id: 'team',
    status: 'active',
    maturity_level: 'SPROUTING',
    maturity_score: 35,
    event_count: 18,
    decision_count: 3,
    last_activity: '2025-01-06T16:20:00Z',
    created_at: '2025-01-02T10:00:00Z',
  },
  {
    id: 'thread-4',
    title: 'Projet immobilier Laval',
    founding_intent: 'Analyser et acquérir un immeuble à revenus dans la région de Laval',
    sphere_id: 'business',
    status: 'active',
    maturity_level: 'GROWING',
    maturity_score: 58,
    event_count: 67,
    decision_count: 12,
    last_activity: '2025-01-07T08:15:00Z',
    created_at: '2024-12-01T14:00:00Z',
  },
  {
    id: 'thread-5',
    title: 'Permis RBQ',
    founding_intent: 'Obtenir la licence RBQ pour entrepreneur général',
    sphere_id: 'government',
    status: 'paused',
    maturity_level: 'SEED',
    maturity_score: 12,
    event_count: 8,
    decision_count: 2,
    last_activity: '2025-01-03T11:00:00Z',
    created_at: '2024-12-20T09:00:00Z',
  },
  {
    id: 'thread-6',
    title: 'Création logo entreprise',
    founding_intent: 'Concevoir le nouveau logo et l\'identité visuelle de l\'entreprise',
    sphere_id: 'studio',
    status: 'completed',
    maturity_level: 'RIPE',
    maturity_score: 100,
    event_count: 34,
    decision_count: 7,
    last_activity: '2025-01-05T17:30:00Z',
    created_at: '2024-11-15T10:00:00Z',
  },
  {
    id: 'thread-7',
    title: 'Recherche doctorale IA',
    founding_intent: 'Suivre et documenter la recherche sur les systèmes d\'IA gouvernés',
    sphere_id: 'scholar',
    status: 'active',
    maturity_level: 'GROWING',
    maturity_score: 45,
    event_count: 56,
    decision_count: 5,
    last_activity: '2025-01-07T07:00:00Z',
    created_at: '2024-10-01T08:00:00Z',
  },
  {
    id: 'thread-8',
    title: 'Organisation événement communautaire',
    founding_intent: 'Planifier l\'événement annuel de la communauté locale',
    sphere_id: 'community',
    status: 'active',
    maturity_level: 'SPROUTING',
    maturity_score: 28,
    event_count: 15,
    decision_count: 4,
    last_activity: '2025-01-06T14:00:00Z',
    created_at: '2025-01-01T09:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// THREAD CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const ThreadCard: React.FC<{
  thread: Thread;
  onClick: () => void;
}> = ({ thread, onClick }) => {
  const maturity = MATURITY_CONFIG[thread.maturity_level];
  const status = STATUS_CONFIG[thread.status];
  const sphere = SPHERES.find(s => s.id === thread.sphere_id);

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Il y a moins d\'une heure';
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Hier';
    return `Il y a ${days} jours`;
  };

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: 20,
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: 16,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
        e.currentTarget.style.borderColor = 'rgba(216, 178, 106, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>{maturity.icon}</span>
          <div>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#E8F0E8' }}>
              {thread.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <span
                style={{
                  padding: '2px 8px',
                  background: sphere?.color ? `${sphere.color}20` : 'rgba(255,255,255,0.05)',
                  borderRadius: 4,
                  fontSize: 10,
                  color: sphere?.color || '#9BA89B',
                }}
              >
                {sphere?.icon} {sphere?.name_fr}
              </span>
              <span
                style={{
                  padding: '2px 8px',
                  background: `${status.color}20`,
                  borderRadius: 4,
                  fontSize: 10,
                  color: status.color,
                }}
              >
                {status.label}
              </span>
            </div>
          </div>
        </div>
        
        {/* Maturity Score */}
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              padding: '6px 12px',
              background: maturity.bg,
              borderRadius: 8,
              display: 'inline-block',
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: maturity.color }}>
              {thread.maturity_score}%
            </span>
          </div>
          <div style={{ fontSize: 9, color: '#6B7B6B', marginTop: 4 }}>
            {maturity.label}
          </div>
        </div>
      </div>

      {/* Founding Intent */}
      <p style={{ 
        margin: '0 0 16px',
        fontSize: 12,
        color: '#8B9B8B',
        lineHeight: 1.5,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        💡 {thread.founding_intent}
      </p>

      {/* Progress Bar */}
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            height: 4,
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${thread.maturity_score}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${maturity.color}80 0%, ${maturity.color} 100%)`,
              borderRadius: 2,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Footer Stats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <span style={{ fontSize: 11, color: '#6B7B6B' }}>
            📝 {thread.event_count} événements
          </span>
          <span style={{ fontSize: 11, color: '#6B7B6B' }}>
            ⚡ {thread.decision_count} décisions
          </span>
        </div>
        <span style={{ fontSize: 10, color: '#4B5B4B' }}>
          {timeAgo(thread.last_activity)}
        </span>
      </div>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// NEW THREAD MODAL
// ═══════════════════════════════════════════════════════════════════════════════

const NewThreadModal: React.FC<{
  onClose: () => void;
  onCreate: (thread: Partial<Thread>) => void;
}> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [foundingIntent, setFoundingIntent] = useState('');
  const [sphereId, setSphereId] = useState('personal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && foundingIntent.trim()) {
      onCreate({
        title: title.trim(),
        founding_intent: foundingIntent.trim(),
        sphere_id: sphereId,
      });
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 520,
          background: 'linear-gradient(145deg, rgba(30, 35, 32, 0.98) 0%, rgba(25, 30, 28, 0.98) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 20,
          zIndex: 9999,
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, color: '#E8F0E8' }}>
            🧵 Nouveau Thread
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#6B7B6B', marginBottom: 8 }}>
              Titre du thread
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Rénovation salle de bain"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 10,
                color: '#E8F0E8',
                fontSize: 14,
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#6B7B6B', marginBottom: 8 }}>
              💡 Intention fondatrice (Founding Intent)
            </label>
            <textarea
              value={foundingIntent}
              onChange={(e) => setFoundingIntent(e.target.value)}
              placeholder="Décrivez l'objectif principal de ce thread..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 10,
                color: '#E8F0E8',
                fontSize: 14,
                outline: 'none',
                resize: 'vertical',
              }}
            />
            <p style={{ fontSize: 11, color: '#4B5B4B', marginTop: 6 }}>
              L'intention fondatrice guide le thread et ne peut être modifiée après création.
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#6B7B6B', marginBottom: 8 }}>
              Sphère
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {SPHERES.map((sphere) => (
                <button
                  key={sphere.id}
                  type="button"
                  onClick={() => setSphereId(sphere.id)}
                  style={{
                    padding: '10px',
                    background: sphereId === sphere.id ? `${sphere.color}20` : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${sphereId === sphere.id ? sphere.color : 'rgba(255, 255, 255, 0.06)'}`,
                    borderRadius: 8,
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{sphere.icon}</span>
                  <div style={{ fontSize: 10, color: sphereId === sphere.id ? sphere.color : '#6B7B6B', marginTop: 4 }}>
                    {sphere.name_fr}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 10,
                color: '#9BA89B',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !foundingIntent.trim()}
              style={{
                flex: 1,
                padding: '12px',
                background: title.trim() && foundingIntent.trim()
                  ? 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                borderRadius: 10,
                color: title.trim() && foundingIntent.trim() ? '#1A1A1A' : '#4B5B4B',
                fontSize: 13,
                fontWeight: 600,
                cursor: title.trim() && foundingIntent.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Créer le thread
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export const ThreadsPageV72: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State
  const [threads, setThreads] = useState<Thread[]>(MOCK_THREADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSphere, setFilterSphere] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ThreadStatus | null>(null);
  const [filterMaturity, setFilterMaturity] = useState<MaturityLevel | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'maturity' | 'activity'>('recent');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNewModal, setShowNewModal] = useState(searchParams.get('action') === 'new');

  // Filtered and sorted threads
  const filteredThreads = useMemo(() => {
    let result = [...threads];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.founding_intent.toLowerCase().includes(q)
      );
    }

    // Sphere filter
    if (filterSphere) {
      result = result.filter(t => t.sphere_id === filterSphere);
    }

    // Status filter
    if (filterStatus) {
      result = result.filter(t => t.status === filterStatus);
    }

    // Maturity filter
    if (filterMaturity) {
      result = result.filter(t => t.maturity_level === filterMaturity);
    }

    // Sort
    switch (sortBy) {
      case 'maturity':
        result.sort((a, b) => b.maturity_score - a.maturity_score);
        break;
      case 'activity':
        result.sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime());
        break;
      case 'recent':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [threads, searchQuery, filterSphere, filterStatus, filterMaturity, sortBy]);

  // Handlers
  const handleQuickAction = useCallback((action: QuickAction) => {
    switch (action) {
      case 'new-thread':
        setShowNewModal(true);
        break;
      case 'search':
        setIsSearchOpen(true);
        break;
      case 'nova-chat':
        navigate('/nova');
        break;
    }
  }, [navigate]);

  const handleCreateThread = (newThread: Partial<Thread>) => {
    const thread: Thread = {
      id: `thread-${Date.now()}`,
      title: newThread.title || '',
      founding_intent: newThread.founding_intent || '',
      sphere_id: newThread.sphere_id || 'personal',
      status: 'active',
      maturity_level: 'SEED',
      maturity_score: 0,
      event_count: 0,
      decision_count: 0,
      last_activity: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    setThreads(prev => [thread, ...prev]);
    setShowNewModal(false);
    navigate(`/thread/${thread.id}`);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onAction: (action) => {
      if (action === 'search') setIsSearchOpen(true);
      if (action === 'new-thread') setShowNewModal(true);
      if (action === 'escape') {
        setIsSearchOpen(false);
        setShowNewModal(false);
      }
    },
  });

  // Stats
  const stats = useMemo(() => ({
    total: threads.length,
    active: threads.filter(t => t.status === 'active').length,
    avgMaturity: Math.round(threads.reduce((sum, t) => sum + t.maturity_score, 0) / threads.length),
  }), [threads]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #0D1210 0%, #121816 50%, #0F1512 100%)',
        padding: '24px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'transparent', border: 'none', color: '#6B7B6B', fontSize: 13, cursor: 'pointer', marginBottom: 8 }}
            >
              ← Retour au dashboard
            </button>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#E8F0E8', margin: '0 0 8px' }}>
              🧵 Threads
            </h1>
            <p style={{ color: '#6B7B6B', fontSize: 13, margin: 0 }}>
              {stats.total} threads • {stats.active} actifs • {stats.avgMaturity}% maturité moyenne
            </p>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)',
              border: 'none',
              borderRadius: 10,
              color: '#1A1A1A',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>+</span>
            Nouveau Thread
            <kbd style={{ padding: '2px 6px', background: 'rgba(0,0,0,0.2)', borderRadius: 4, fontSize: 10 }}>⌘N</kbd>
          </button>
        </div>

        {/* Filters */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 24,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Rechercher un thread..."
            style={{
              flex: '1 1 200px',
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 10,
              color: '#E8F0E8',
              fontSize: 13,
              outline: 'none',
            }}
          />

          {/* Sphere Filter */}
          <select
            value={filterSphere || ''}
            onChange={(e) => setFilterSphere(e.target.value || null)}
            style={{
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 10,
              color: '#E8F0E8',
              fontSize: 13,
            }}
          >
            <option value="">Toutes sphères</option>
            {SPHERES.map(s => (
              <option key={s.id} value={s.id}>{s.icon} {s.name_fr}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus || ''}
            onChange={(e) => setFilterStatus((e.target.value as ThreadStatus) || null)}
            style={{
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 10,
              color: '#E8F0E8',
              fontSize: 13,
            }}
          >
            <option value="">Tous statuts</option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            style={{
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 10,
              color: '#E8F0E8',
              fontSize: 13,
            }}
          >
            <option value="recent">Plus récents</option>
            <option value="activity">Activité récente</option>
            <option value="maturity">Maturité</option>
          </select>
        </div>

        {/* Threads Grid */}
        {filteredThreads.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 16 }}>
            {filteredThreads.map((thread) => (
              <ThreadCard
                key={thread.id}
                thread={thread}
                onClick={() => navigate(`/thread/${thread.id}`)}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: 60,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: 16,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧵</div>
            <h3 style={{ color: '#9BA89B', fontSize: 16, margin: '0 0 8px' }}>
              Aucun thread trouvé
            </h3>
            <p style={{ color: '#6B7B6B', fontSize: 13, margin: '0 0 20px' }}>
              {searchQuery ? 'Essayez une autre recherche' : 'Créez votre premier thread pour commencer'}
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #D8B26A 0%, #C9A35B 100%)',
                border: 'none',
                borderRadius: 10,
                color: '#1A1A1A',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Nouveau Thread
            </button>
          </div>
        )}
      </div>

      {/* FAB */}
      <QuickActionsFAB onAction={handleQuickAction} />

      {/* Search Modal */}
      <GlobalSearchV72
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={(result) => result.path && navigate(result.path)}
        onNavigate={navigate}
      />

      {/* New Thread Modal */}
      {showNewModal && (
        <NewThreadModal
          onClose={() => setShowNewModal(false)}
          onCreate={handleCreateThread}
        />
      )}
    </div>
  );
};

export default ThreadsPageV72;
