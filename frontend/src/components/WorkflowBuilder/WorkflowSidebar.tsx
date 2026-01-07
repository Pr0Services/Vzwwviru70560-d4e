/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — WORKFLOW SIDEBAR
   Node palette and workflow management
   ═══════════════════════════════════════════════════════════════════════════════ */

import React, { useState, useMemo } from 'react';
import type { NodeTemplate, Workflow } from './types';
import { NODE_TEMPLATES, WORKFLOW_TEMPLATES } from './templates';

// ════════════════════════════════════════════════════════════════════════════════
// PALETTE CHE·NU
// ════════════════════════════════════════════════════════════════════════════════

const COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  background: '#0c0a09',
  cardBg: '#111113',
  border: 'rgba(141, 131, 113, 0.2)',
};

// ════════════════════════════════════════════════════════════════════════════════
// CATEGORY CONFIG
// ════════════════════════════════════════════════════════════════════════════════

const CATEGORIES = [
  { id: 'trigger', label: 'Triggers', labelFr: 'Déclencheurs', icon: '⚡' },
  { id: 'logic', label: 'Logic', labelFr: 'Logique', icon: '🔀' },
  { id: 'ai', label: 'AI & Transform', labelFr: 'IA & Transformation', icon: '🤖' },
  { id: 'action', label: 'Actions', labelFr: 'Actions', icon: '▶️' },
  { id: 'utility', label: 'Utility', labelFr: 'Utilitaires', icon: '🔧' },
];

// ════════════════════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════════════════════

const styles = {
  sidebar: {
    width: '280px',
    height: '100%',
    backgroundColor: COLORS.cardBg,
    borderRight: `1px solid ${COLORS.border}`,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  
  header: {
    padding: '16px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.softSand,
    marginBottom: '12px',
  },
  
  tabs: {
    display: 'flex',
    gap: '4px',
  },
  
  tab: {
    flex: 1,
    padding: '8px 12px',
    fontSize: '11px',
    fontWeight: 500,
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  
  searchContainer: {
    padding: '12px 16px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  
  searchInput: {
    width: '100%',
    padding: '10px 12px',
    paddingLeft: '36px',
    fontSize: '13px',
    backgroundColor: COLORS.background,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    color: COLORS.softSand,
    outline: 'none',
  },
  
  searchIcon: {
    position: 'absolute' as const,
    left: '28px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '14px',
    color: COLORS.ancientStone,
    pointerEvents: 'none' as const,
  },
  
  content: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '8px',
  },
  
  category: {
    marginBottom: '16px',
  },
  
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    fontSize: '11px',
    fontWeight: 600,
    color: COLORS.ancientStone,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    cursor: 'pointer',
  },
  
  categoryIcon: {
    fontSize: '14px',
  },
  
  nodeList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  
  nodeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    backgroundColor: COLORS.background,
    borderRadius: '8px',
    cursor: 'grab',
    transition: 'all 0.15s ease',
    border: `1px solid transparent`,
  },
  
  nodeIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  
  nodeInfo: {
    flex: 1,
    minWidth: 0,
  },
  
  nodeLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: COLORS.softSand,
    marginBottom: '2px',
  },
  
  nodeDescription: {
    fontSize: '10px',
    color: COLORS.ancientStone,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  
  templateList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  
  templateCard: {
    padding: '14px',
    backgroundColor: COLORS.background,
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    border: `1px solid ${COLORS.border}`,
  },
  
  templateName: {
    fontSize: '13px',
    fontWeight: 600,
    color: COLORS.softSand,
    marginBottom: '6px',
  },
  
  templateDescription: {
    fontSize: '11px',
    color: COLORS.ancientStone,
    lineHeight: '1.4',
    marginBottom: '8px',
  },
  
  templateMeta: {
    display: 'flex',
    gap: '8px',
    fontSize: '10px',
    color: COLORS.ancientStone,
  },
  
  metaBadge: {
    padding: '2px 6px',
    backgroundColor: COLORS.cardBg,
    borderRadius: '4px',
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// PROPS
// ════════════════════════════════════════════════════════════════════════════════

interface WorkflowSidebarProps {
  onNodeDragStart: (template: NodeTemplate, e: React.DragEvent) => void;
  onTemplateSelect: (template: typeof WORKFLOW_TEMPLATES[0]) => void;
  locale?: 'en' | 'fr';
}

// ════════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({
  onNodeDragStart,
  onTemplateSelect,
  locale = 'fr',
}) => {
  const [activeTab, setActiveTab] = useState<'nodes' | 'templates'>('nodes');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['trigger', 'logic', 'ai', 'action'])
  );

  // Filter nodes by search
  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return NODE_TEMPLATES;
    
    const query = searchQuery.toLowerCase();
    return NODE_TEMPLATES.filter(node => 
      node.label.toLowerCase().includes(query) ||
      node.labelFr.toLowerCase().includes(query) ||
      node.description.toLowerCase().includes(query) ||
      node.descriptionFr.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group nodes by category
  const nodesByCategory = useMemo(() => {
    const grouped: Record<string, NodeTemplate[]> = {};
    filteredNodes.forEach(node => {
      if (!grouped[node.category]) {
        grouped[node.category] = [];
      }
      grouped[node.category].push(node);
    });
    return grouped;
  }, [filteredNodes]);

  // Filter templates by search
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return WORKFLOW_TEMPLATES;
    
    const query = searchQuery.toLowerCase();
    return WORKFLOW_TEMPLATES.filter(template =>
      template.name.toLowerCase().includes(query) ||
      template.nameFr?.toLowerCase().includes(query) ||
      template.description?.toLowerCase().includes(query) ||
      template.descriptionFr?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Handle drag start
  const handleDragStart = (template: NodeTemplate, e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(template));
    e.dataTransfer.effectAllowed = 'copy';
    onNodeDragStart(template, e);
  };

  return (
    <div style={styles.sidebar}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          {locale === 'fr' ? '🔧 Workflow Builder' : '🔧 Workflow Builder'}
        </div>
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              backgroundColor: activeTab === 'nodes' ? COLORS.sacredGold : COLORS.background,
              color: activeTab === 'nodes' ? COLORS.uiSlate : COLORS.softSand,
            }}
            onClick={() => setActiveTab('nodes')}
          >
            {locale === 'fr' ? 'Nœuds' : 'Nodes'}
          </button>
          <button
            style={{
              ...styles.tab,
              backgroundColor: activeTab === 'templates' ? COLORS.sacredGold : COLORS.background,
              color: activeTab === 'templates' ? COLORS.uiSlate : COLORS.softSand,
            }}
            onClick={() => setActiveTab('templates')}
          >
            {locale === 'fr' ? 'Modèles' : 'Templates'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ ...styles.searchContainer, position: 'relative' }}>
        <span style={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder={locale === 'fr' ? 'Rechercher...' : 'Search...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'nodes' ? (
          /* Node Palette */
          CATEGORIES.map(category => {
            const categoryNodes = nodesByCategory[category.id] || [];
            if (categoryNodes.length === 0) return null;
            
            const isExpanded = expandedCategories.has(category.id);
            
            return (
              <div key={category.id} style={styles.category}>
                <div
                  style={styles.categoryHeader}
                  onClick={() => toggleCategory(category.id)}
                >
                  <span style={styles.categoryIcon}>{category.icon}</span>
                  <span>{locale === 'fr' ? category.labelFr : category.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '10px' }}>
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </div>
                
                {isExpanded && (
                  <div style={styles.nodeList}>
                    {categoryNodes.map((node, idx) => (
                      <div
                        key={`${node.type}-${idx}`}
                        style={styles.nodeItem}
                        draggable
                        onDragStart={(e) => handleDragStart(node, e)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = COLORS.sacredGold;
                          e.currentTarget.style.backgroundColor = `${COLORS.sacredGold}10`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'transparent';
                          e.currentTarget.style.backgroundColor = COLORS.background;
                        }}
                      >
                        <div
                          style={{
                            ...styles.nodeIcon,
                            backgroundColor: `${node.color}30`,
                          }}
                        >
                          {node.icon}
                        </div>
                        <div style={styles.nodeInfo}>
                          <div style={styles.nodeLabel}>
                            {locale === 'fr' ? node.labelFr : node.label}
                          </div>
                          <div style={styles.nodeDescription}>
                            {locale === 'fr' ? node.descriptionFr : node.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          /* Template List */
          <div style={styles.templateList}>
            {filteredTemplates.map((template, idx) => (
              <div
                key={idx}
                style={styles.templateCard}
                onClick={() => onTemplateSelect(template)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORS.sacredGold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = COLORS.border;
                }}
              >
                <div style={styles.templateName}>
                  {locale === 'fr' && template.nameFr ? template.nameFr : template.name}
                </div>
                <div style={styles.templateDescription}>
                  {locale === 'fr' && template.descriptionFr 
                    ? template.descriptionFr 
                    : template.description}
                </div>
                <div style={styles.templateMeta}>
                  <span style={styles.metaBadge}>
                    📦 {template.nodes.length} {locale === 'fr' ? 'nœuds' : 'nodes'}
                  </span>
                  <span style={styles.metaBadge}>
                    🪙 {template.tokenBudget} tokens
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default WorkflowSidebar;
