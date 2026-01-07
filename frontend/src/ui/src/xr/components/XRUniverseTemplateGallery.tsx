/**
 * ============================================================
 * CHE·NU — XR UNIVERSE TEMPLATE GALLERY
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React, { useState, useMemo } from 'react';

// ============================================================
// TYPES
// ============================================================

interface UniverseTemplate {
  id: string;
  name: string;
  description: string;
  layout: string;
  category: string;
  sphereHint?: string;
  sceneCount: number;
  connectionCount: number;
}

interface XRUniverseTemplateGalleryProps {
  onSelect?: (templateId: string) => void;
  selectedId?: string | null;
}

// ============================================================
// CONSTANTS
// ============================================================

const CHENU_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

const MOCK_TEMPLATES: UniverseTemplate[] = [
  {
    id: 'circular_hub',
    name: 'Circular Hub',
    description: 'Central hub connected to 4 surrounding rooms',
    layout: 'Radial arrangement',
    category: 'hub',
    sceneCount: 5,
    connectionCount: 4,
  },
  {
    id: 'cross_hub',
    name: 'Cross Hub Universe',
    description: '4 main rooms in cardinal directions',
    layout: 'Cross pattern',
    category: 'hub',
    sceneCount: 5,
    connectionCount: 8,
  },
  {
    id: 'layered_realm',
    name: 'Layered Realm',
    description: 'Vertical symbolic layering of rooms',
    layout: 'Stacked layers',
    category: 'hierarchical',
    sceneCount: 5,
    connectionCount: 4,
  },
  {
    id: 'linear_journey',
    name: 'Linear Journey',
    description: 'Sequential rooms in linear progression',
    layout: 'Linear path',
    category: 'linear',
    sceneCount: 5,
    connectionCount: 4,
  },
  {
    id: 'grid_layout',
    name: 'Grid Layout',
    description: '3x3 grid of interconnected rooms',
    layout: 'Matrix arrangement',
    category: 'grid',
    sceneCount: 9,
    connectionCount: 12,
  },
  {
    id: 'personal_hub',
    name: 'Personal Hub',
    description: 'Personal life management space',
    layout: 'Central sanctuary',
    category: 'specialized',
    sphereHint: 'personal',
    sceneCount: 5,
    connectionCount: 4,
  },
  {
    id: 'community_hub',
    name: 'Community Hub',
    description: 'Community gathering and interaction',
    layout: 'Central plaza',
    category: 'specialized',
    sphereHint: 'social',
    sceneCount: 5,
    connectionCount: 5,
  },
  {
    id: 'streaming_hub',
    name: 'Streaming Hub',
    description: 'Video streaming and entertainment',
    layout: 'Central theater',
    category: 'specialized',
    sphereHint: 'entertainment',
    sceneCount: 5,
    connectionCount: 5,
  },
  {
    id: 'ai_lab_hub',
    name: 'AI Lab Hub',
    description: 'AI experimentation and cognitive tools',
    layout: 'Central lab',
    category: 'specialized',
    sphereHint: 'ailab',
    sceneCount: 5,
    connectionCount: 5,
  },
  {
    id: 'business_hub',
    name: 'Business Operations Hub',
    description: 'Business management and operations',
    layout: 'Executive hub',
    category: 'specialized',
    sphereHint: 'business',
    sceneCount: 5,
    connectionCount: 5,
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: '📋' },
  { id: 'hub', name: 'Hub Layouts', icon: '🔀' },
  { id: 'linear', name: 'Linear', icon: '➡️' },
  { id: 'grid', name: 'Grid', icon: '📊' },
  { id: 'hierarchical', name: 'Hierarchical', icon: '🏛️' },
  { id: 'specialized', name: 'Specialized', icon: '⭐' },
];

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: CHENU_COLORS.uiSlate,
    borderRadius: '16px',
    padding: '20px',
    color: CHENU_COLORS.softSand,
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  categoryFilter: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  categoryButton: {
    padding: '8px 14px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: CHENU_COLORS.ancientStone,
  },
  categoryButtonActive: {
    backgroundColor: `${CHENU_COLORS.sacredGold}30`,
    color: CHENU_COLORS.sacredGold,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    padding: '16px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  cardSelected: {
    borderColor: CHENU_COLORS.sacredGold,
    backgroundColor: `${CHENU_COLORS.sacredGold}10`,
    boxShadow: `0 0 20px ${CHENU_COLORS.sacredGold}20`,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  cardCategory: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  cardDescription: {
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '12px',
    lineHeight: 1.5,
  },
  cardLayout: {
    fontSize: '12px',
    color: CHENU_COLORS.cenoteTurquoise,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  cardStats: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  statValue: {
    color: CHENU_COLORS.softSand,
    fontWeight: 600,
  },
  preview: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80px',
  },
  previewIcon: {
    fontSize: '32px',
    opacity: 0.5,
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: CHENU_COLORS.ancientStone,
  },
  footer: {
    marginTop: '20px',
    padding: '12px 16px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    backgroundColor: CHENU_COLORS.sacredGold,
    color: CHENU_COLORS.uiSlate,
  },
};

// ============================================================
// HELPER
// ============================================================

const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'hub': return '🔀';
    case 'linear': return '➡️';
    case 'grid': return '📊';
    case 'hierarchical': return '🏛️';
    case 'specialized': return '⭐';
    default: return '📦';
  }
};

const getSphereColor = (sphere?: string): string => {
  switch (sphere) {
    case 'personal': return CHENU_COLORS.sacredGold;
    case 'business': return CHENU_COLORS.jungleEmerald;
    case 'social': return CHENU_COLORS.cenoteTurquoise;
    case 'entertainment': return '#E74C3C';
    case 'ailab': return '#00D9FF';
    default: return CHENU_COLORS.ancientStone;
  }
};

const getLayoutIcon = (layout: string): string => {
  if (layout.toLowerCase().includes('radial') || layout.toLowerCase().includes('circular')) return '⭕';
  if (layout.toLowerCase().includes('cross')) return '✚';
  if (layout.toLowerCase().includes('linear')) return '━━━';
  if (layout.toLowerCase().includes('grid') || layout.toLowerCase().includes('matrix')) return '▦';
  if (layout.toLowerCase().includes('layer') || layout.toLowerCase().includes('stack')) return '☰';
  return '◎';
};

// ============================================================
// COMPONENT
// ============================================================

export const XRUniverseTemplateGallery: React.FC<XRUniverseTemplateGalleryProps> = ({
  onSelect,
  selectedId,
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [templates] = useState<UniverseTemplate[]>(MOCK_TEMPLATES);

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'all') return templates;
    return templates.filter(t => t.category === activeCategory);
  }, [templates, activeCategory]);

  const handleSelect = (templateId: string) => {
    onSelect?.(templateId);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          <span>📋</span>
          Universe Templates
        </h2>
        <span style={{ fontSize: '13px', color: CHENU_COLORS.ancientStone }}>
          {filteredTemplates.length} templates
        </span>
      </div>

      {/* Category Filter */}
      <div style={styles.categoryFilter}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            style={{
              ...styles.categoryButton,
              ...(activeCategory === cat.id ? styles.categoryButtonActive : {}),
            }}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      {filteredTemplates.length > 0 ? (
        <div style={styles.grid}>
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              style={{
                ...styles.card,
                ...(selectedId === template.id ? styles.cardSelected : {}),
              }}
              onClick={() => handleSelect(template.id)}
            >
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.cardTitle}>{template.name}</div>
                  <div style={styles.cardCategory}>
                    {getCategoryIcon(template.category)} {template.category}
                  </div>
                </div>
                {template.sphereHint && (
                  <div
                    style={{
                      ...styles.cardBadge,
                      backgroundColor: `${getSphereColor(template.sphereHint)}30`,
                      color: getSphereColor(template.sphereHint),
                    }}
                  >
                    {template.sphereHint}
                  </div>
                )}
              </div>

              <div style={styles.cardDescription}>{template.description}</div>

              <div style={styles.cardLayout}>
                <span>{getLayoutIcon(template.layout)}</span>
                {template.layout}
              </div>

              <div style={styles.cardStats}>
                <div style={styles.stat}>
                  <span>🎬</span>
                  <span style={styles.statValue}>{template.sceneCount}</span>
                  scenes
                </div>
                <div style={styles.stat}>
                  <span>🔗</span>
                  <span style={styles.statValue}>{template.connectionCount}</span>
                  links
                </div>
              </div>

              <div style={styles.preview}>
                <span style={styles.previewIcon}>
                  {getLayoutIcon(template.layout)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
          <div>No templates found for this category</div>
        </div>
      )}

      {/* Footer */}
      {selectedId && (
        <div style={styles.footer}>
          <span>
            Selected: <strong>{templates.find(t => t.id === selectedId)?.name}</strong>
          </span>
          <button style={styles.button}>
            Use Template
          </button>
        </div>
      )}
    </div>
  );
};

export default XRUniverseTemplateGallery;
