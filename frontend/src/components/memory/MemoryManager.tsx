/**
 * CHE·NU — Memory Manager UI
 */

import React, { useState, useEffect } from 'react';
import { AgentMemory, MemorySettings, MemoryStats, MemoryCategory } from '../../types/memory.types';

const COLORS = {
  bg: '#0D1210',
  card: '#151A18',
  border: '#2A3530',
  sand: '#D8B26A',
  sage: '#3F7249',
  cyan: '#00E5FF',
  text: '#E8E4DD',
  muted: '#888888',
  error: '#FF6B6B',
  warning: '#F39C12',
};

const CATEGORY_ICONS: Record<MemoryCategory, string> = {
  preference: '⚙️',
  fact: '📚',
  decision: '🎯',
  pattern: '🔄',
  relationship: '🔗',
  skill: '💡',
  context: '📍',
  feedback: '💬',
};

const CATEGORY_LABELS: Record<MemoryCategory, string> = {
  preference: 'Préférences',
  fact: 'Faits',
  decision: 'Décisions',
  pattern: 'Patterns',
  relationship: 'Relations',
  skill: 'Compétences',
  context: 'Contexte',
  feedback: 'Feedback',
};

interface MemoryManagerProps {
  onClose?: () => void;
}

export const MemoryManager: React.FC<MemoryManagerProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'browse' | 'settings'>('overview');
  const [memories, setMemories] = useState<AgentMemory[]>([]);
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [settings, setSettings] = useState<MemorySettings | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MemoryCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    // Simulate API calls
    await new Promise(r => setTimeout(r, 500));
    
    // Mock data
    setStats({
      total: 271,
      by_type: { stm: 45, mtm: 89, ltm: 125, semantic: 12 },
      by_category: {
        preference: 47,
        fact: 123,
        decision: 89,
        pattern: 12,
        relationship: 0,
        skill: 0,
        context: 0,
        feedback: 0,
      },
      storage_used: 2.3 * 1024 * 1024,
      oldest: '2024-01-15',
      newest: '2024-12-13',
    });

    setSettings({
      enabled: true,
      retention: { stm: 24, mtm: 30, ltm: -1 },
      categories: {
        preference: true,
        fact: true,
        decision: true,
        pattern: true,
        relationship: false,
        skill: false,
        context: false,
        feedback: false,
      },
      auto_prune: true,
      max_memories: 1000,
    });

    setMemories([
      {
        id: '1',
        user_id: 'u1',
        agent_id: 'nova',
        type: 'ltm',
        category: 'preference',
        content: { key: 'language', value: 'fr-CA', summary: 'Préfère communiquer en français' },
        context: { source: 'user' },
        importance: 0.9,
        access_count: 45,
        created_at: '2024-06-15T10:00:00Z',
        updated_at: '2024-12-01T14:30:00Z',
      },
      {
        id: '2',
        user_id: 'u1',
        agent_id: 'nova',
        type: 'ltm',
        category: 'fact',
        content: { key: 'company', value: 'Pro-Service Construction', summary: 'Travaille chez Pro-Service Construction' },
        context: { source: 'user' },
        importance: 0.85,
        access_count: 32,
        created_at: '2024-06-20T09:00:00Z',
        updated_at: '2024-11-15T16:00:00Z',
      },
      {
        id: '3',
        user_id: 'u1',
        agent_id: 'nova',
        type: 'mtm',
        category: 'decision',
        content: { key: 'chenu_version', value: 'v27', summary: 'Travaille sur la version 27 de CHE·NU' },
        context: { sphere: 'enterprise', source: 'inference' },
        importance: 0.7,
        access_count: 18,
        created_at: '2024-12-01T08:00:00Z',
        updated_at: '2024-12-13T11:00:00Z',
      },
    ]);

    setIsLoading(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleClearAll = async () => {
    setShowConfirmClear(false);
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setMemories([]);
    setStats(prev => prev ? { ...prev, total: 0 } : null);
    setIsLoading(false);
  };

  const handleDeleteMemory = async (id: string) => {
    setMemories(memories.filter(m => m.id !== id));
  };

  const handleToggleCategory = (category: MemoryCategory) => {
    if (settings) {
      setSettings({
        ...settings,
        categories: {
          ...settings.categories,
          [category]: !settings.categories[category],
        },
      });
    }
  };

  const filteredMemories = selectedCategory === 'all' 
    ? memories 
    : memories.filter(m => m.category === selectedCategory);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: 800,
        maxHeight: '90vh',
        background: COLORS.card,
        borderRadius: 20,
        border: `1px solid ${COLORS.border}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>🧠</span>
            <div>
              <h2 style={{ color: COLORS.text, fontSize: 18, margin: 0 }}>Mémoire des Agents</h2>
              <p style={{ color: COLORS.muted, fontSize: 12, margin: 0 }}>
                Gérez ce que les agents retiennent de vos interactions
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: COLORS.muted,
                fontSize: 20,
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Tabs */}
        <div style={{
          padding: '0 24px',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          gap: 24,
        }}>
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
            { id: 'browse', label: 'Parcourir', icon: '📋' },
            { id: 'settings', label: 'Paramètres', icon: '⚙️' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '16px 0',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? COLORS.cyan : 'transparent'}`,
                color: activeTab === tab.id ? COLORS.cyan : COLORS.muted,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 40, color: COLORS.muted }}>
              Chargement...
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && stats && (
                <div>
                  {/* Global toggle */}
                  <div style={{
                    padding: 20,
                    background: COLORS.bg,
                    borderRadius: 12,
                    marginBottom: 20,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ color: COLORS.text, fontSize: 15, fontWeight: 500 }}>
                        Mémoire Globale
                      </div>
                      <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>
                        Permettre aux agents de se souvenir de vos interactions
                      </div>
                    </div>
                    <button
                      onClick={() => settings && setSettings({ ...settings, enabled: !settings.enabled })}
                      style={{
                        width: 52,
                        height: 28,
                        borderRadius: 14,
                        background: settings?.enabled ? COLORS.sage : COLORS.border,
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: 'white',
                        position: 'absolute',
                        top: 3,
                        left: settings?.enabled ? 27 : 3,
                        transition: 'left 0.2s',
                      }} />
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 16,
                    marginBottom: 24,
                  }}>
                    <div style={{
                      padding: 20,
                      background: COLORS.bg,
                      borderRadius: 12,
                      textAlign: 'center',
                    }}>
                      <div style={{ color: COLORS.cyan, fontSize: 28, fontWeight: 600 }}>
                        {stats.total}
                      </div>
                      <div style={{ color: COLORS.muted, fontSize: 12 }}>Total mémoires</div>
                    </div>
                    <div style={{
                      padding: 20,
                      background: COLORS.bg,
                      borderRadius: 12,
                      textAlign: 'center',
                    }}>
                      <div style={{ color: COLORS.sand, fontSize: 28, fontWeight: 600 }}>
                        {formatBytes(stats.storage_used)}
                      </div>
                      <div style={{ color: COLORS.muted, fontSize: 12 }}>Espace utilisé</div>
                    </div>
                    <div style={{
                      padding: 20,
                      background: COLORS.bg,
                      borderRadius: 12,
                      textAlign: 'center',
                    }}>
                      <div style={{ color: COLORS.sage, fontSize: 28, fontWeight: 600 }}>
                        {stats.by_type.ltm}
                      </div>
                      <div style={{ color: COLORS.muted, fontSize: 12 }}>Long terme</div>
                    </div>
                    <div style={{
                      padding: 20,
                      background: COLORS.bg,
                      borderRadius: 12,
                      textAlign: 'center',
                    }}>
                      <div style={{ color: COLORS.text, fontSize: 28, fontWeight: 600 }}>
                        {stats.by_type.mtm}
                      </div>
                      <div style={{ color: COLORS.muted, fontSize: 12 }}>Moyen terme</div>
                    </div>
                  </div>

                  {/* Categories breakdown */}
                  <h3 style={{ color: COLORS.text, fontSize: 14, marginBottom: 16 }}>
                    Par catégorie
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(Object.keys(stats.by_category) as MemoryCategory[])
                      .filter(cat => stats.by_category[cat] > 0)
                      .map(category => (
                        <div
                          key={category}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '12px 16px',
                            background: COLORS.bg,
                            borderRadius: 8,
                          }}
                        >
                          <span style={{ fontSize: 18 }}>{CATEGORY_ICONS[category]}</span>
                          <span style={{ color: COLORS.text, fontSize: 14, flex: 1 }}>
                            {CATEGORY_LABELS[category]}
                          </span>
                          <span style={{ color: COLORS.muted, fontSize: 14 }}>
                            {stats.by_category[category]} entrées
                          </span>
                        </div>
                      ))}
                  </div>

                  {/* Actions */}
                  <div style={{
                    marginTop: 24,
                    padding: 20,
                    background: `${COLORS.warning}10`,
                    border: `1px solid ${COLORS.warning}30`,
                    borderRadius: 12,
                  }}>
                    <h3 style={{ color: COLORS.text, fontSize: 14, marginBottom: 16 }}>
                      ⚠️ Actions
                    </h3>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        onClick={() => {}}
                        style={{
                          padding: '10px 16px',
                          background: COLORS.bg,
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: 8,
                          color: COLORS.text,
                          fontSize: 13,
                          cursor: 'pointer',
                        }}
                      >
                        📥 Exporter mes mémoires
                      </button>
                      <button
                        onClick={() => setShowConfirmClear(true)}
                        style={{
                          padding: '10px 16px',
                          background: `${COLORS.error}20`,
                          border: `1px solid ${COLORS.error}40`,
                          borderRadius: 8,
                          color: COLORS.error,
                          fontSize: 13,
                          cursor: 'pointer',
                        }}
                      >
                        🗑️ Supprimer toutes les mémoires
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Browse Tab */}
              {activeTab === 'browse' && (
                <div>
                  {/* Filter */}
                  <div style={{ marginBottom: 20, display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setSelectedCategory('all')}
                      style={{
                        padding: '8px 16px',
                        background: selectedCategory === 'all' ? COLORS.cyan : 'transparent',
                        border: `1px solid ${selectedCategory === 'all' ? COLORS.cyan : COLORS.border}`,
                        borderRadius: 20,
                        color: selectedCategory === 'all' ? COLORS.bg : COLORS.text,
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      Toutes
                    </button>
                    {(Object.keys(CATEGORY_ICONS) as MemoryCategory[]).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                          padding: '8px 16px',
                          background: selectedCategory === cat ? COLORS.cyan : 'transparent',
                          border: `1px solid ${selectedCategory === cat ? COLORS.cyan : COLORS.border}`,
                          borderRadius: 20,
                          color: selectedCategory === cat ? COLORS.bg : COLORS.text,
                          fontSize: 13,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <span>{CATEGORY_ICONS[cat]}</span>
                        <span>{CATEGORY_LABELS[cat]}</span>
                      </button>
                    ))}
                  </div>

                  {/* Memories List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filteredMemories.map(memory => (
                      <div
                        key={memory.id}
                        style={{
                          padding: 16,
                          background: COLORS.bg,
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: 12,
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: 8,
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 16 }}>{CATEGORY_ICONS[memory.category]}</span>
                            <span style={{ color: COLORS.text, fontSize: 14, fontWeight: 500 }}>
                              {memory.content.key}
                            </span>
                            <span style={{
                              padding: '2px 8px',
                              background: COLORS.border,
                              borderRadius: 10,
                              color: COLORS.muted,
                              fontSize: 10,
                            }}>
                              {memory.type.toUpperCase()}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteMemory(memory.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: COLORS.muted,
                              cursor: 'pointer',
                              fontSize: 14,
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                        <p style={{ color: COLORS.muted, fontSize: 13, margin: 0 }}>
                          {memory.content.summary}
                        </p>
                        <div style={{
                          marginTop: 12,
                          display: 'flex',
                          gap: 16,
                          fontSize: 11,
                          color: COLORS.muted,
                        }}>
                          <span>Importance: {Math.round(memory.importance * 100)}%</span>
                          <span>Accès: {memory.access_count}x</span>
                          <span>Source: {memory.context.source}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && settings && (
                <div>
                  <h3 style={{ color: COLORS.text, fontSize: 14, marginBottom: 16 }}>
                    Ce que les agents peuvent retenir:
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {(Object.keys(settings.categories) as MemoryCategory[]).map(category => (
                      <label
                        key={category}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '12px 16px',
                          background: COLORS.bg,
                          borderRadius: 8,
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={settings.categories[category]}
                          onChange={() => handleToggleCategory(category)}
                          style={{ width: 18, height: 18 }}
                        />
                        <span style={{ fontSize: 18 }}>{CATEGORY_ICONS[category]}</span>
                        <span style={{ color: COLORS.text, fontSize: 14 }}>
                          {CATEGORY_LABELS[category]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Confirm Clear Modal */}
        {showConfirmClear && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              padding: 24,
              background: COLORS.card,
              borderRadius: 16,
              border: `1px solid ${COLORS.error}`,
              maxWidth: 400,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
              <h3 style={{ color: COLORS.text, marginBottom: 8 }}>Êtes-vous sûr?</h3>
              <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>
                Cette action supprimera toutes vos mémoires de manière irréversible.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  style={{
                    padding: '10px 24px',
                    background: COLORS.bg,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 8,
                    color: COLORS.text,
                    cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleClearAll}
                  style={{
                    padding: '10px 24px',
                    background: COLORS.error,
                    border: 'none',
                    borderRadius: 8,
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  Supprimer tout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryManager;
