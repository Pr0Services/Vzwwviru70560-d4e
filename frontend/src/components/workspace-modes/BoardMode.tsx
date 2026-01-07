/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — BOARD MODE                                            ║
 * ║              Workspace Mode L3: 📋 Kanban/Agile Board                        ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  CAPABILITIES:                                                               ║
 * ║  - Draggable task cards                                                      ║
 * ║  - Customizable columns (status, priority, phase)                            ║
 * ║  - Swimlanes for categorization                                              ║
 * ║  - Card templates for common task types                                      ║
 * ║  - Progress visualization                                                    ║
 * ║  - Dependency tracking                                                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback } from 'react';
import { motion, Reorder } from 'framer-motion';

// Types
import { CHENU_COLORS } from '../../types';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type Priority = 'urgent' | 'high' | 'medium' | 'low';
type CardStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

interface BoardCard {
  id: string;
  title: string;
  description?: string;
  status: CardStatus;
  priority: Priority;
  assignee?: string;
  dueDate?: Date;
  tags: string[];
  progress?: number;
  dependencies?: string[];
  tokenCost?: number;
}

interface BoardColumn {
  id: CardStatus;
  title: string;
  icon: string;
  cards: BoardCard[];
  limit?: number;
}

interface BoardModeProps {
  boardId?: string;
  sphereId: string;
  domainId?: string;
  onCardMove?: (cardId: string, fromCol: CardStatus, toCol: CardStatus) => void;
  onCardCreate?: (column: CardStatus) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; icon: string }> = {
  urgent: { label: 'Urgent', color: '#ef4444', icon: '🔴' },
  high: { label: 'Haute', color: CHENU_COLORS.sacredGold, icon: '🟠' },
  medium: { label: 'Moyenne', color: CHENU_COLORS.cenoteTurquoise, icon: '🟡' },
  low: { label: 'Basse', color: CHENU_COLORS.ancientStone, icon: '🟢' },
};

const COLUMN_CONFIG: Record<CardStatus, { title: string; icon: string; color: string }> = {
  backlog: { title: 'Backlog', icon: '📥', color: CHENU_COLORS.ancientStone },
  todo: { title: 'À faire', icon: '📋', color: CHENU_COLORS.cenoteTurquoise },
  in_progress: { title: 'En cours', icon: '⚡', color: CHENU_COLORS.sacredGold },
  review: { title: 'Revue', icon: '👁️', color: '#8b5cf6' },
  done: { title: 'Terminé', icon: '✅', color: CHENU_COLORS.jungleEmerald },
};

// Mock data
const MOCK_CARDS: BoardCard[] = [
  { id: 'c1', title: 'Implémenter authentification', status: 'done', priority: 'high', tags: ['backend'], progress: 100 },
  { id: 'c2', title: 'Design page d\'accueil', status: 'in_progress', priority: 'high', tags: ['design', 'frontend'], progress: 60, assignee: 'Marie' },
  { id: 'c3', title: 'API DataSpaces', status: 'in_progress', priority: 'urgent', tags: ['backend', 'api'], progress: 40, tokenCost: 500 },
  { id: 'c4', title: 'Tests unitaires agents', status: 'review', priority: 'medium', tags: ['testing'], assignee: 'Agent QA' },
  { id: 'c5', title: 'Documentation API', status: 'todo', priority: 'medium', tags: ['docs'], dueDate: new Date(Date.now() + 86400000 * 3) },
  { id: 'c6', title: 'Intégration XR', status: 'backlog', priority: 'low', tags: ['xr', 'future'] },
  { id: 'c7', title: 'Optimisation performance', status: 'backlog', priority: 'medium', tags: ['perf'] },
  { id: 'c8', title: 'Mode hors-ligne', status: 'todo', priority: 'low', tags: ['offline'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    backgroundColor: CHENU_COLORS.uiSlate,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    backgroundColor: '#111113',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  toolbarTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  toolbarActions: {
    display: 'flex',
    gap: '8px',
  },
  filterBtn: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  addBtn: {
    padding: '8px 14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  boardArea: {
    flex: 1,
    display: 'flex',
    gap: '16px',
    padding: '20px',
    overflowX: 'auto' as const,
  },
  column: {
    minWidth: '280px',
    maxWidth: '320px',
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  columnHeader: (color: string) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderBottom: `2px solid ${color}`,
  }),
  columnTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  columnCount: {
    padding: '2px 8px',
    borderRadius: '10px',
    backgroundColor: CHENU_COLORS.ancientStone + '33',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  columnContent: {
    flex: 1,
    padding: '12px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    overflowY: 'auto' as const,
    minHeight: '200px',
  },
  card: {
    backgroundColor: '#1a1a1c',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    padding: '14px',
    cursor: 'grab',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    flex: 1,
  },
  priorityDot: (priority: Priority) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: PRIORITY_CONFIG[priority].color,
    marginLeft: '8px',
  }),
  cardTags: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px',
    marginTop: '10px',
  },
  tag: {
    padding: '2px 8px',
    borderRadius: '10px',
    backgroundColor: CHENU_COLORS.ancientStone + '22',
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '10px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  progressBar: {
    height: '4px',
    backgroundColor: CHENU_COLORS.ancientStone + '22',
    borderRadius: '2px',
    marginTop: '10px',
    overflow: 'hidden',
  },
  progressFill: (progress: number) => ({
    height: '100%',
    width: `${progress}%`,
    backgroundColor: progress >= 75 
      ? CHENU_COLORS.jungleEmerald 
      : progress >= 50 
        ? CHENU_COLORS.sacredGold 
        : CHENU_COLORS.cenoteTurquoise,
    borderRadius: '2px',
  }),
  addCardBtn: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: `1px dashed ${CHENU_COLORS.ancientStone}44`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    fontSize: '12px',
    cursor: 'pointer',
    marginTop: '4px',
  },
  statsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    backgroundColor: '#0a0a0b',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const BoardMode: React.FC<BoardModeProps> = ({
  boardId,
  sphereId,
  domainId,
  onCardMove,
  onCardCreate,
}) => {
  const [cards, setCards] = useState<BoardCard[]>(MOCK_CARDS);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);

  // Group cards by column
  const columns: BoardColumn[] = Object.entries(COLUMN_CONFIG).map(([status, config]) => ({
    id: status as CardStatus,
    title: config.title,
    icon: config.icon,
    cards: cards.filter(c => c.status === status),
  }));

  // Stats
  const totalCards = cards.length;
  const doneCards = cards.filter(c => c.status === 'done').length;
  const inProgressCards = cards.filter(c => c.status === 'in_progress').length;
  const totalTokens = cards.reduce((sum, c) => sum + (c.tokenCost || 0), 0);

  // Handlers
  const handleDragStart = useCallback((cardId: string) => {
    setDraggedCard(cardId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedCard(null);
  }, []);

  const handleDrop = useCallback((targetStatus: CardStatus) => {
    if (!draggedCard) return;
    
    const card = cards.find(c => c.id === draggedCard);
    if (!card || card.status === targetStatus) return;

    const fromStatus = card.status;
    setCards(prev => prev.map(c => 
      c.id === draggedCard ? { ...c, status: targetStatus } : c
    ));
    
    onCardMove?.(draggedCard, fromStatus, targetStatus);
    setDraggedCard(null);
  }, [draggedCard, cards, onCardMove]);

  const handleAddCard = useCallback((column: CardStatus) => {
    const newCard: BoardCard = {
      id: `c${Date.now()}`,
      title: 'Nouvelle tâche',
      status: column,
      priority: 'medium',
      tags: [],
    };
    setCards(prev => [...prev, newCard]);
    onCardCreate?.(column);
  }, [onCardCreate]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  const renderCard = (card: BoardCard) => (
    <motion.div
      key={card.id}
      style={styles.card}
      draggable
      onDragStart={() => handleDragStart(card.id)}
      onDragEnd={handleDragEnd}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: `0 4px 20px ${CHENU_COLORS.sacredGold}11`,
        borderColor: CHENU_COLORS.sacredGold + '44',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div style={styles.cardHeader}>
        <span style={styles.cardTitle}>{card.title}</span>
        <div style={styles.priorityDot(card.priority)} title={PRIORITY_CONFIG[card.priority].label} />
      </div>

      {card.tags.length > 0 && (
        <div style={styles.cardTags}>
          {card.tags.map(tag => (
            <span key={tag} style={styles.tag}>#{tag}</span>
          ))}
        </div>
      )}

      {card.progress !== undefined && (
        <div style={styles.progressBar}>
          <div style={styles.progressFill(card.progress)} />
        </div>
      )}

      <div style={styles.cardFooter}>
        <div style={{ display: 'flex', gap: '10px' }}>
          {card.assignee && <span>👤 {card.assignee}</span>}
          {card.dueDate && <span>📅 {formatDate(card.dueDate)}</span>}
        </div>
        {card.tokenCost && <span>💎 {card.tokenCost}</span>}
      </div>
    </motion.div>
  );

  return (
    <div style={styles.container}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarTitle}>
          <span>📋</span>
          <span>Board Mode</span>
        </div>
        <div style={styles.toolbarActions}>
          <button style={styles.filterBtn}>
            🏷️ Filtres
          </button>
          <button style={styles.filterBtn}>
            👥 Assignés
          </button>
          <motion.button
            style={styles.addBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ➕ Nouvelle carte
          </motion.button>
        </div>
      </div>

      {/* Board Area */}
      <div style={styles.boardArea}>
        {columns.map(column => {
          const config = COLUMN_CONFIG[column.id];
          return (
            <div
              key={column.id}
              style={styles.column}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(column.id)}
            >
              <div style={styles.columnHeader(config.color)}>
                <div style={styles.columnTitle}>
                  <span>{config.icon}</span>
                  <span>{config.title}</span>
                </div>
                <span style={styles.columnCount}>{column.cards.length}</span>
              </div>

              <div style={styles.columnContent}>
                {column.cards.map(renderCard)}
                
                <motion.button
                  style={styles.addCardBtn}
                  whileHover={{ 
                    backgroundColor: CHENU_COLORS.ancientStone + '11',
                    borderColor: CHENU_COLORS.sacredGold + '44',
                  }}
                  onClick={() => handleAddCard(column.id)}
                >
                  ➕ Ajouter une carte
                </motion.button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span style={styles.statItem}>📋 {totalCards} cartes</span>
          <span style={styles.statItem}>⚡ {inProgressCards} en cours</span>
          <span style={styles.statItem}>✅ {doneCards} terminées</span>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span style={styles.statItem}>💎 {totalTokens} tokens alloués</span>
          <span style={styles.statItem}>📍 {sphereId}</span>
        </div>
      </div>
    </div>
  );
};

export default BoardMode;
