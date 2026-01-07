/**
 * CHE·NU™ R&D Workspace - Phase 1: Exploration / Brainstorm
 * 
 * Objectif: Explorer librement, sans jugement
 * 
 * Règles:
 * - Aucune hiérarchie
 * - Aucune notation
 * - Aucune suppression définitive
 * 
 * Agent R&D autorisé:
 * - Regrouper des idées
 * - Reformuler
 * - Identifier thèmes émergents
 * 
 * ❌ Pas d'analyse quantitative
 * ❌ Pas de décision
 */

import React, { useState } from 'react';
import { RnDIdea, IdeaType } from './rnd-workspace.types';

// ============================================================================
// DESIGN SYSTEM
// ============================================================================

const CHENU_COLORS = {
  sacredGold: '#D4AF37',
  ancientStone: '#8B7355',
  cenoteTurquoise: '#40E0D0',
  obsidianBlack: '#0A0A0B',
  nightSlate: '#1E1F22',
  deepBlue: '#1E3A5F',
  explorationBlue: '#3B82F6',
};

const IDEA_TYPES: { type: IdeaType; label: string; icon: string; color: string }[] = [
  { type: 'idea', label: 'Idée', icon: '💡', color: '#EAB308' },
  { type: 'question', label: 'Question', icon: '❓', color: '#3B82F6' },
  { type: 'hypothesis', label: 'Hypothèse', icon: '🔬', color: '#22C55E' },
  { type: 'inspiration', label: 'Inspiration', icon: '✨', color: '#A855F7' },
];

// ============================================================================
// STYLES
// ============================================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#E8E6E1',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#9CA3AF',
    maxWidth: '600px',
    lineHeight: 1.5,
  },
  rules: {
    display: 'flex',
    gap: '16px',
    marginTop: '8px',
  },
  rule: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    backgroundColor: `${CHENU_COLORS.explorationBlue}15`,
    borderRadius: '4px',
    fontSize: '12px',
    color: CHENU_COLORS.explorationBlue,
  },
  
  // Input area
  inputArea: {
    backgroundColor: CHENU_COLORS.nightSlate,
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${CHENU_COLORS.ancientStone}40`,
  },
  inputTypeSelector: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  typeButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    backgroundColor: 'transparent',
    border: `1px solid ${CHENU_COLORS.ancientStone}40`,
    borderRadius: '6px',
    color: '#9CA3AF',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s ease',
  },
  typeButtonActive: {
    backgroundColor: `${CHENU_COLORS.explorationBlue}20`,
    borderColor: CHENU_COLORS.explorationBlue,
    color: CHENU_COLORS.explorationBlue,
  },
  textareaWrapper: {
    display: 'flex',
    gap: '12px',
  },
  textarea: {
    flex: 1,
    padding: '14px 16px',
    backgroundColor: '#111113',
    border: `1px solid ${CHENU_COLORS.ancientStone}40`,
    borderRadius: '8px',
    color: '#E8E6E1',
    fontSize: '15px',
    resize: 'none' as const,
    minHeight: '80px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  addButton: {
    padding: '14px 24px',
    backgroundColor: CHENU_COLORS.explorationBlue,
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    alignSelf: 'flex-end',
  },
  
  // Ideas grid
  ideasSection: {
    marginTop: '24px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#E8E6E1',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  ideasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  ideaCard: {
    padding: '16px',
    backgroundColor: CHENU_COLORS.nightSlate,
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.ancientStone}30`,
    transition: 'all 0.2s ease',
  },
  ideaHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  ideaType: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 500,
  },
  ideaContent: {
    fontSize: '14px',
    color: '#E8E6E1',
    lineHeight: 1.6,
  },
  ideaMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '10px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}20`,
    fontSize: '11px',
    color: '#6B7280',
  },
  ideaTags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap' as const,
  },
  ideaTag: {
    padding: '2px 8px',
    backgroundColor: `${CHENU_COLORS.ancientStone}20`,
    borderRadius: '3px',
    fontSize: '11px',
    color: '#9CA3AF',
  },
  ideaTheme: {
    padding: '4px 10px',
    backgroundColor: `${CHENU_COLORS.sacredGold}15`,
    borderRadius: '4px',
    color: CHENU_COLORS.sacredGold,
    fontSize: '11px',
    fontWeight: 500,
  },
  
  // Themes section
  themesSection: {
    marginTop: '32px',
    padding: '20px',
    backgroundColor: `${CHENU_COLORS.sacredGold}08`,
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.sacredGold}20`,
  },
  themesTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  themesList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '10px',
  },
  themeChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    backgroundColor: CHENU_COLORS.nightSlate,
    borderRadius: '6px',
    fontSize: '13px',
    color: '#E8E6E1',
  },
  themeCount: {
    padding: '2px 6px',
    backgroundColor: `${CHENU_COLORS.sacredGold}30`,
    borderRadius: '4px',
    fontSize: '11px',
    color: CHENU_COLORS.sacredGold,
    fontWeight: 600,
  },
  
  // Agent button
  askAgentButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: `${CHENU_COLORS.sacredGold}15`,
    border: `1px solid ${CHENU_COLORS.sacredGold}30`,
    borderRadius: '8px',
    color: CHENU_COLORS.sacredGold,
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s ease',
  },
  
  // Empty state
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: '#6B7280',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '16px',
    marginBottom: '8px',
    color: '#9CA3AF',
  },
  emptyHint: {
    fontSize: '13px',
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

interface RnDPhase1ExplorationProps {
  ideas: RnDIdea[];
  themes: string[];
  onAddIdea: (idea: RnDIdea) => void;
  onUpdateThemes: (themes: string[]) => void;
  onAskAgent: () => void;
}

export const RnDPhase1Exploration: React.FC<RnDPhase1ExplorationProps> = ({
  ideas,
  themes,
  onAddIdea,
  onUpdateThemes,
  onAskAgent,
}) => {
  const [selectedType, setSelectedType] = useState<IdeaType>('idea');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  
  const handleAddIdea = () => {
    if (!content.trim()) return;
    
    const newIdea: RnDIdea = {
      id: `idea-${Date.now()}`,
      type: selectedType,
      content: content.trim(),
      created_by: 'current-user',
      created_at: new Date().toISOString(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    
    onAddIdea(newIdea);
    setContent('');
    setTags('');
  };
  
  const getTypeInfo = (type: IdeaType) => {
    return IDEA_TYPES.find(t => t.type === type) || IDEA_TYPES[0];
  };
  
  // Group ideas by theme
  const ideasByTheme = ideas.reduce((acc, idea) => {
    const theme = idea.theme || 'Non classé';
    if (!acc[theme]) acc[theme] = [];
    acc[theme].push(idea);
    return acc;
  }, {} as Record<string, RnDIdea[]>);
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h2 style={styles.title}>
            🔵 Exploration / Brainstorm
          </h2>
          <p style={styles.subtitle}>
            Espace de cartes d'idées. Notez vos idées courtes, questions, hypothèses 
            et inspirations externes. Aucune hiérarchie, aucune notation, aucune 
            suppression définitive.
          </p>
          <div style={styles.rules}>
            <span style={styles.rule}>✓ Sans jugement</span>
            <span style={styles.rule}>✓ Toute idée compte</span>
            <span style={styles.rule}>✓ Archivé ≠ Supprimé</span>
          </div>
        </div>
        
        <button
          style={styles.askAgentButton}
          onClick={onAskAgent}
        >
          🤖 Demander à l'agent de regrouper
        </button>
      </div>
      
      {/* Input Area */}
      <div style={styles.inputArea}>
        <div style={styles.inputTypeSelector}>
          {IDEA_TYPES.map(({ type, label, icon, color }) => (
            <button
              key={type}
              style={{
                ...styles.typeButton,
                ...(selectedType === type ? {
                  ...styles.typeButtonActive,
                  borderColor: color,
                  color: color,
                  backgroundColor: `${color}15`,
                } : {}),
              }}
              onClick={() => setSelectedType(type)}
            >
              {icon} {label}
            </button>
          ))}
        </div>
        
        <div style={styles.textareaWrapper}>
          <textarea
            style={styles.textarea}
            placeholder={`Ajoutez une ${getTypeInfo(selectedType).label.toLowerCase()}...`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) {
                handleAddIdea();
              }
            }}
          />
          <button
            style={{
              ...styles.addButton,
              opacity: content.trim() ? 1 : 0.5,
              cursor: content.trim() ? 'pointer' : 'not-allowed',
            }}
            onClick={handleAddIdea}
            disabled={!content.trim()}
          >
            + Ajouter
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Tags (séparés par des virgules)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{
            ...styles.textarea,
            minHeight: 'auto',
            padding: '10px 16px',
            marginTop: '12px',
            fontSize: '13px',
          }}
        />
      </div>
      
      {/* Ideas Grid */}
      <div style={styles.ideasSection}>
        <h3 style={styles.sectionTitle}>
          💭 Idées ({ideas.length})
        </h3>
        
        {ideas.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🧠</div>
            <p style={styles.emptyText}>
              Aucune idée pour l'instant
            </p>
            <p style={styles.emptyHint}>
              Commencez à explorer en ajoutant vos premières pensées
            </p>
          </div>
        ) : (
          <div style={styles.ideasGrid}>
            {ideas.map((idea) => {
              const typeInfo = getTypeInfo(idea.type);
              return (
                <div
                  key={idea.id}
                  style={styles.ideaCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${typeInfo.color}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${CHENU_COLORS.ancientStone}30`;
                  }}
                >
                  <div style={styles.ideaHeader}>
                    <span
                      style={{
                        ...styles.ideaType,
                        backgroundColor: `${typeInfo.color}15`,
                        color: typeInfo.color,
                      }}
                    >
                      {typeInfo.icon} {typeInfo.label}
                    </span>
                    {idea.theme && (
                      <span style={styles.ideaTheme}>
                        {idea.theme}
                      </span>
                    )}
                  </div>
                  
                  <p style={styles.ideaContent}>
                    {idea.content}
                  </p>
                  
                  <div style={styles.ideaMeta}>
                    <div style={styles.ideaTags}>
                      {idea.tags.map((tag, i) => (
                        <span key={i} style={styles.ideaTag}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span>
                      {new Date(idea.created_at).toLocaleDateString('fr-CA')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Themes Section (if agent has identified themes) */}
      {themes.length > 0 && (
        <div style={styles.themesSection}>
          <h4 style={styles.themesTitle}>
            🏷️ Thèmes identifiés par l'Agent R&D
          </h4>
          <div style={styles.themesList}>
            {themes.map((theme, i) => {
              const count = ideasByTheme[theme]?.length || 0;
              return (
                <div key={i} style={styles.themeChip}>
                  {theme}
                  <span style={styles.themeCount}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RnDPhase1Exploration;
