// CHE·NU™ Kanban Board Component
// Comprehensive drag-and-drop kanban with columns, cards, and swimlanes

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  DragEvent,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type CardPriority = 'critical' | 'high' | 'medium' | 'low';
type CardStatus = 'open' | 'in_progress' | 'review' | 'done' | 'blocked';

interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  swimlaneId?: string;
  priority?: CardPriority;
  status?: CardStatus;
  assignees?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  labels?: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  dueDate?: Date;
  progress?: number;
  attachments?: number;
  comments?: number;
  subtasks?: { completed: number; total: number };
  createdAt?: Date;
  updatedAt?: Date;
  order: number;
  meta?: Record<string, any>;
}

interface KanbanColumn {
  id: string;
  title: string;
  color?: string;
  icon?: ReactNode;
  limit?: number;
  collapsed?: boolean;
  order: number;
}

interface KanbanSwimlane {
  id: string;
  title: string;
  color?: string;
  collapsed?: boolean;
  order: number;
}

interface KanbanBoardContextValue {
  columns: KanbanColumn[];
  swimlanes: KanbanSwimlane[];
  cards: KanbanCard[];
  draggedCard: KanbanCard | null;
  dragOverColumn: string | null;
  dragOverSwimlane: string | null;
  setDraggedCard: (card: KanbanCard | null) => void;
  setDragOverColumn: (columnId: string | null) => void;
  setDragOverSwimlane: (swimlaneId: string | null) => void;
  moveCard: (cardId: string, toColumnId: string, toSwimlaneId?: string, toIndex?: number) => void;
  addCard: (card: Partial<KanbanCard>, columnId: string, swimlaneId?: string) => void;
  updateCard: (cardId: string, updates: Partial<KanbanCard>) => void;
  deleteCard: (cardId: string) => void;
}

interface KanbanBoardProps {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  swimlanes?: KanbanSwimlane[];
  onChange?: (cards: KanbanCard[]) => void;
  onCardClick?: (card: KanbanCard) => void;
  onCardDoubleClick?: (card: KanbanCard) => void;
  onCardMove?: (card: KanbanCard, fromColumn: string, toColumn: string) => void;
  onCardAdd?: (columnId: string, swimlaneId?: string) => void;
  onCardDelete?: (card: KanbanCard) => void;
  onColumnCollapse?: (columnId: string, collapsed: boolean) => void;
  renderCard?: (card: KanbanCard) => ReactNode;
  renderColumnHeader?: (column: KanbanColumn, cardCount: number) => ReactNode;
  showAddCard?: boolean;
  showCardCount?: boolean;
  showColumnLimit?: boolean;
  columnWidth?: number;
  cardSpacing?: number;
  className?: string;
}

interface KanbanColumnProps {
  column: KanbanColumn;
  cards: KanbanCard[];
  swimlaneId?: string;
  renderCard?: (card: KanbanCard) => ReactNode;
  renderHeader?: (column: KanbanColumn, cardCount: number) => ReactNode;
  showAddCard?: boolean;
  showCardCount?: boolean;
  showLimit?: boolean;
  width?: number;
  onCardClick?: (card: KanbanCard) => void;
  onCardDoubleClick?: (card: KanbanCard) => void;
  onAddCard?: () => void;
}

interface KanbanCardProps {
  card: KanbanCard;
  isDragging?: boolean;
  isDropTarget?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onDelete?: () => void;
  renderContent?: (card: KanbanCard) => ReactNode;
}

// ============================================================
// BRAND COLORS (Memory Prompt)
// ============================================================

const BRAND = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

// ============================================================
// CONSTANTS
// ============================================================

const PRIORITY_CONFIG: Record<CardPriority, { color: string; label: string; icon: string }> = {
  critical: { color: '#E53E3E', label: 'Critical', icon: '🔴' },
  high: { color: '#DD6B20', label: 'High', icon: '🟠' },
  medium: { color: '#D69E2E', label: 'Medium', icon: '🟡' },
  low: { color: '#38A169', label: 'Low', icon: '🟢' },
};

const DEFAULT_COLUMN_WIDTH = 300;
const DEFAULT_CARD_SPACING = 8;

// ============================================================
// CONTEXT
// ============================================================

const KanbanBoardContext = createContext<KanbanBoardContextValue | null>(null);

export function useKanbanBoard(): KanbanBoardContextValue {
  const context = useContext(KanbanBoardContext);
  if (!context) {
    throw new Error('useKanbanBoard must be used within KanbanBoard');
  }
  return context;
}

// ============================================================
// UTILITIES
// ============================================================

function generateId(): string {
  return `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOverdue(date: Date): boolean {
  return date.getTime() < Date.now();
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  board: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    overflowX: 'auto' as const,
    overflowY: 'hidden',
    minHeight: '100%',
    backgroundColor: BRAND.softSand,
  },

  boardWithSwimlanes: {
    flexDirection: 'column' as const,
    gap: '24px',
  },

  swimlane: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  swimlaneHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    cursor: 'pointer',
  },

  swimlaneTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  swimlaneColumns: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto' as const,
  },

  column: {
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    minHeight: '200px',
    maxHeight: 'calc(100vh - 200px)',
    flexShrink: 0,
  },

  columnCollapsed: {
    width: '48px',
    minWidth: '48px',
    cursor: 'pointer',
  },

  columnDropTarget: {
    backgroundColor: `${BRAND.cenoteTurquoise}10`,
    borderColor: BRAND.cenoteTurquoise,
  },

  columnOverLimit: {
    borderColor: '#E53E3E',
    backgroundColor: '#FFF5F5',
  },

  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: `1px solid ${BRAND.ancientStone}10`,
    backgroundColor: BRAND.softSand,
    borderRadius: '12px 12px 0 0',
    position: 'sticky' as const,
    top: 0,
    zIndex: 1,
  },

  columnHeaderCollapsed: {
    flexDirection: 'column' as const,
    gap: '8px',
    padding: '12px 8px',
    writingMode: 'vertical-rl' as const,
    textOrientation: 'mixed' as const,
    height: '100%',
  },

  columnTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  columnTitleDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },

  columnCount: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '24px',
    height: '24px',
    padding: '0 8px',
    fontSize: '12px',
    fontWeight: 600,
    color: BRAND.ancientStone,
    backgroundColor: `${BRAND.ancientStone}15`,
    borderRadius: '100px',
  },

  columnCountOverLimit: {
    backgroundColor: '#FED7D7',
    color: '#E53E3E',
  },

  columnLimit: {
    fontSize: '11px',
    color: BRAND.ancientStone,
  },

  columnBody: {
    flex: 1,
    padding: '8px',
    overflowY: 'auto' as const,
  },

  columnFooter: {
    padding: '8px',
    borderTop: `1px solid ${BRAND.ancientStone}10`,
  },

  addCardButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    width: '100%',
    padding: '10px',
    fontSize: '13px',
    fontWeight: 500,
    color: BRAND.ancientStone,
    backgroundColor: 'transparent',
    border: `1px dashed ${BRAND.ancientStone}30`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  addCardButtonHover: {
    color: BRAND.sacredGold,
    borderColor: BRAND.sacredGold,
    backgroundColor: `${BRAND.sacredGold}08`,
  },

  // Card styles
  card: {
    padding: '12px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}15`,
    cursor: 'grab',
    transition: 'all 0.15s',
    marginBottom: '8px',
  },

  cardHover: {
    borderColor: BRAND.sacredGold,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },

  cardDragging: {
    opacity: 0.5,
    transform: 'rotate(3deg)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  },

  cardDropTarget: {
    borderColor: BRAND.cenoteTurquoise,
    borderStyle: 'dashed',
    backgroundColor: `${BRAND.cenoteTurquoise}08`,
  },

  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '8px',
    marginBottom: '8px',
  },

  cardTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    lineHeight: 1.4,
    flex: 1,
  },

  cardPriority: {
    fontSize: '12px',
  },

  cardDescription: {
    fontSize: '13px',
    color: BRAND.ancientStone,
    lineHeight: 1.5,
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  },

  cardLabels: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px',
    marginBottom: '8px',
  },

  cardLabel: {
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: 500,
    borderRadius: '100px',
    color: '#ffffff',
  },

  cardProgress: {
    marginBottom: '8px',
  },

  cardProgressBar: {
    width: '100%',
    height: '4px',
    backgroundColor: `${BRAND.ancientStone}20`,
    borderRadius: '100px',
    overflow: 'hidden',
  },

  cardProgressFill: {
    height: '100%',
    backgroundColor: BRAND.cenoteTurquoise,
    borderRadius: '100px',
    transition: 'width 0.3s ease',
  },

  cardProgressText: {
    fontSize: '11px',
    color: BRAND.ancientStone,
    marginTop: '4px',
  },

  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '12px',
    paddingTop: '8px',
    borderTop: `1px solid ${BRAND.ancientStone}10`,
  },

  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  cardMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  cardDueDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '100px',
    backgroundColor: `${BRAND.ancientStone}10`,
    color: BRAND.ancientStone,
  },

  cardDueDateOverdue: {
    backgroundColor: '#FED7D7',
    color: '#E53E3E',
  },

  cardDueDateSoon: {
    backgroundColor: '#FEFCBF',
    color: '#D69E2E',
  },

  cardAssignees: {
    display: 'flex',
    alignItems: 'center',
  },

  cardAssignee: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '2px solid #ffffff',
    marginLeft: '-8px',
    backgroundColor: BRAND.softSand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    overflow: 'hidden',
  },

  cardAssigneeFirst: {
    marginLeft: 0,
  },

  cardSubtasks: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  cardSubtasksComplete: {
    color: BRAND.jungleEmerald,
  },

  // Empty column styles
  emptyColumn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    color: BRAND.ancientStone,
    fontSize: '13px',
    textAlign: 'center' as const,
  },

  // Drag placeholder
  dragPlaceholder: {
    height: '60px',
    border: `2px dashed ${BRAND.cenoteTurquoise}`,
    borderRadius: '8px',
    backgroundColor: `${BRAND.cenoteTurquoise}08`,
    marginBottom: '8px',
  },
};

// ============================================================
// KANBAN CARD COMPONENT
// ============================================================

function KanbanCardComponent({
  card,
  isDragging = false,
  isDropTarget = false,
  onClick,
  onDoubleClick,
  onDelete,
  renderContent,
}: KanbanCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const { setDraggedCard, setDragOverColumn, moveCard } = useKanbanBoard();

  const handleDragStart = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.id);
    setDraggedCard(card);
  }, [card, setDraggedCard]);

  const handleDragEnd = useCallback(() => {
    setDraggedCard(null);
    setDragOverColumn(null);
  }, [setDraggedCard, setDragOverColumn]);

  const priorityConfig = card.priority ? PRIORITY_CONFIG[card.priority] : null;
  const hasSubtasks = card.subtasks && card.subtasks.total > 0;
  const subtasksComplete = hasSubtasks && card.subtasks!.completed === card.subtasks!.total;

  const dueDateStatus = useMemo(() => {
    if (!card.dueDate) return null;
    const date = new Date(card.dueDate);
    if (isOverdue(date)) return 'overdue';
    const diff = date.getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days <= 2) return 'soon';
    return 'normal';
  }, [card.dueDate]);

  if (renderContent) {
    return (
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          ...styles.card,
          ...(isHovered && styles.cardHover),
          ...(isDragging && styles.cardDragging),
          ...(isDropTarget && styles.cardDropTarget),
        }}
      >
        {renderContent(card)}
      </div>
    );
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...styles.card,
        ...(isHovered && styles.cardHover),
        ...(isDragging && styles.cardDragging),
        ...(isDropTarget && styles.cardDropTarget),
      }}
    >
      {/* Header */}
      <div style={styles.cardHeader}>
        <div style={styles.cardTitle}>{card.title}</div>
        {priorityConfig && (
          <span style={styles.cardPriority} title={priorityConfig.label}>
            {priorityConfig.icon}
          </span>
        )}
      </div>

      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div style={styles.cardLabels}>
          {card.labels.slice(0, 3).map((label) => (
            <span
              key={label.id}
              style={{
                ...styles.cardLabel,
                backgroundColor: label.color,
              }}
            >
              {label.name}
            </span>
          ))}
          {card.labels.length > 3 && (
            <span
              style={{
                ...styles.cardLabel,
                backgroundColor: BRAND.ancientStone,
              }}
            >
              +{card.labels.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Description */}
      {card.description && (
        <div style={styles.cardDescription}>{card.description}</div>
      )}

      {/* Progress */}
      {card.progress !== undefined && (
        <div style={styles.cardProgress}>
          <div style={styles.cardProgressBar}>
            <div
              style={{
                ...styles.cardProgressFill,
                width: `${card.progress}%`,
              }}
            />
          </div>
          <div style={styles.cardProgressText}>{card.progress}% complete</div>
        </div>
      )}

      {/* Footer */}
      <div style={styles.cardFooter}>
        <div style={styles.cardMeta}>
          {/* Due date */}
          {card.dueDate && (
            <div
              style={{
                ...styles.cardDueDate,
                ...(dueDateStatus === 'overdue' && styles.cardDueDateOverdue),
                ...(dueDateStatus === 'soon' && styles.cardDueDateSoon),
              }}
            >
              📅 {formatDate(new Date(card.dueDate))}
            </div>
          )}

          {/* Subtasks */}
          {hasSubtasks && (
            <div
              style={{
                ...styles.cardSubtasks,
                ...(subtasksComplete && styles.cardSubtasksComplete),
              }}
            >
              ☑️ {card.subtasks!.completed}/{card.subtasks!.total}
            </div>
          )}

          {/* Attachments */}
          {card.attachments && card.attachments > 0 && (
            <div style={styles.cardMetaItem}>
              📎 {card.attachments}
            </div>
          )}

          {/* Comments */}
          {card.comments && card.comments > 0 && (
            <div style={styles.cardMetaItem}>
              💬 {card.comments}
            </div>
          )}
        </div>

        {/* Assignees */}
        {card.assignees && card.assignees.length > 0 && (
          <div style={styles.cardAssignees}>
            {card.assignees.slice(0, 3).map((assignee, index) => (
              <div
                key={assignee.id}
                style={{
                  ...styles.cardAssignee,
                  ...(index === 0 && styles.cardAssigneeFirst),
                  zIndex: card.assignees!.length - index,
                }}
                title={assignee.name}
              >
                {assignee.avatar ? (
                  <img
                    src={assignee.avatar}
                    alt={assignee.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  assignee.name.charAt(0).toUpperCase()
                )}
              </div>
            ))}
            {card.assignees.length > 3 && (
              <div
                style={{
                  ...styles.cardAssignee,
                  backgroundColor: BRAND.ancientStone,
                  color: '#ffffff',
                }}
              >
                +{card.assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// KANBAN COLUMN COMPONENT
// ============================================================

function KanbanColumnComponent({
  column,
  cards,
  swimlaneId,
  renderCard,
  renderHeader,
  showAddCard = true,
  showCardCount = true,
  showLimit = true,
  width = DEFAULT_COLUMN_WIDTH,
  onCardClick,
  onCardDoubleClick,
  onAddCard,
}: KanbanColumnProps): JSX.Element {
  const [isAddHovered, setIsAddHovered] = useState(false);
  const { draggedCard, dragOverColumn, setDragOverColumn, moveCard } = useKanbanBoard();

  const isDropTarget = dragOverColumn === column.id;
  const isOverLimit = column.limit !== undefined && cards.length >= column.limit;
  const cardCount = cards.length;

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedCard && draggedCard.columnId !== column.id) {
      setDragOverColumn(column.id);
    }
  }, [draggedCard, column.id, setDragOverColumn]);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, [setDragOverColumn]);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    if (cardId && draggedCard) {
      moveCard(cardId, column.id, swimlaneId);
    }
    setDragOverColumn(null);
  }, [draggedCard, column.id, swimlaneId, moveCard, setDragOverColumn]);

  if (column.collapsed) {
    return (
      <div
        style={{
          ...styles.column,
          ...styles.columnCollapsed,
        }}
      >
        <div style={{ ...styles.columnHeader, ...styles.columnHeaderCollapsed }}>
          <div style={styles.columnTitle}>
            {column.icon}
            <span>{column.title}</span>
          </div>
          <div style={styles.columnCount}>{cardCount}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...styles.column,
        width,
        ...(isDropTarget && styles.columnDropTarget),
        ...(isOverLimit && styles.columnOverLimit),
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      {renderHeader ? (
        renderHeader(column, cardCount)
      ) : (
        <div style={styles.columnHeader}>
          <div style={styles.columnTitle}>
            <div
              style={{
                ...styles.columnTitleDot,
                backgroundColor: column.color || BRAND.cenoteTurquoise,
              }}
            />
            {column.icon}
            <span>{column.title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {showCardCount && (
              <div
                style={{
                  ...styles.columnCount,
                  ...(isOverLimit && styles.columnCountOverLimit),
                }}
              >
                {cardCount}
                {showLimit && column.limit !== undefined && (
                  <span style={styles.columnLimit}>/{column.limit}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Body */}
      <div style={styles.columnBody}>
        {cards.length === 0 ? (
          <div style={styles.emptyColumn}>
            {isDropTarget ? 'Drop here' : 'No cards'}
          </div>
        ) : (
          cards.map((card) => (
            <KanbanCardComponent
              key={card.id}
              card={card}
              isDragging={draggedCard?.id === card.id}
              renderContent={renderCard}
              onClick={() => onCardClick?.(card)}
              onDoubleClick={() => onCardDoubleClick?.(card)}
            />
          ))
        )}

        {/* Drop placeholder */}
        {isDropTarget && draggedCard && (
          <div style={styles.dragPlaceholder} />
        )}
      </div>

      {/* Footer - Add card button */}
      {showAddCard && (
        <div style={styles.columnFooter}>
          <button
            style={{
              ...styles.addCardButton,
              ...(isAddHovered && styles.addCardButtonHover),
            }}
            onClick={onAddCard}
            onMouseEnter={() => setIsAddHovered(true)}
            onMouseLeave={() => setIsAddHovered(false)}
          >
            + Add card
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN KANBAN BOARD COMPONENT
// ============================================================

export function KanbanBoard({
  columns,
  cards: initialCards,
  swimlanes = [],
  onChange,
  onCardClick,
  onCardDoubleClick,
  onCardMove,
  onCardAdd,
  onCardDelete,
  onColumnCollapse,
  renderCard,
  renderColumnHeader,
  showAddCard = true,
  showCardCount = true,
  showColumnLimit = true,
  columnWidth = DEFAULT_COLUMN_WIDTH,
  cardSpacing = DEFAULT_CARD_SPACING,
  className,
}: KanbanBoardProps): JSX.Element {
  const [cards, setCards] = useState<KanbanCard[]>(initialCards);
  const [draggedCard, setDraggedCard] = useState<KanbanCard | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [dragOverSwimlane, setDragOverSwimlane] = useState<string | null>(null);

  // Sync cards with prop
  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  // Move card
  const moveCard = useCallback((cardId: string, toColumnId: string, toSwimlaneId?: string, toIndex?: number) => {
    setCards((prevCards) => {
      const cardIndex = prevCards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return prevCards;

      const card = prevCards[cardIndex];
      const fromColumnId = card.columnId;

      const newCards = [...prevCards];
      newCards[cardIndex] = {
        ...card,
        columnId: toColumnId,
        swimlaneId: toSwimlaneId,
      };

      // Reorder if index provided
      if (toIndex !== undefined) {
        const [movedCard] = newCards.splice(cardIndex, 1);
        newCards.splice(toIndex, 0, movedCard);
      }

      onChange?.(newCards);
      onCardMove?.(card, fromColumnId, toColumnId);

      return newCards;
    });
  }, [onChange, onCardMove]);

  // Add card
  const addCard = useCallback((cardData: Partial<KanbanCard>, columnId: string, swimlaneId?: string) => {
    const newCard: KanbanCard = {
      id: generateId(),
      title: cardData.title || 'New Card',
      description: cardData.description,
      columnId,
      swimlaneId,
      priority: cardData.priority,
      assignees: cardData.assignees || [],
      labels: cardData.labels || [],
      order: cards.filter((c) => c.columnId === columnId).length,
      createdAt: new Date(),
      ...cardData,
    };

    setCards((prev) => [...prev, newCard]);
    onChange?.([...cards, newCard]);
  }, [cards, onChange]);

  // Update card
  const updateCard = useCallback((cardId: string, updates: Partial<KanbanCard>) => {
    setCards((prevCards) => {
      const newCards = prevCards.map((card) =>
        card.id === cardId ? { ...card, ...updates, updatedAt: new Date() } : card
      );
      onChange?.(newCards);
      return newCards;
    });
  }, [onChange]);

  // Delete card
  const deleteCard = useCallback((cardId: string) => {
    setCards((prevCards) => {
      const card = prevCards.find((c) => c.id === cardId);
      if (card) {
        onCardDelete?.(card);
      }
      const newCards = prevCards.filter((c) => c.id !== cardId);
      onChange?.(newCards);
      return newCards;
    });
  }, [onChange, onCardDelete]);

  // Group cards by column (and optionally swimlane)
  const getColumnCards = useCallback((columnId: string, swimlaneId?: string) => {
    return cards
      .filter((card) => {
        if (card.columnId !== columnId) return false;
        if (swimlaneId !== undefined && card.swimlaneId !== swimlaneId) return false;
        return true;
      })
      .sort((a, b) => a.order - b.order);
  }, [cards]);

  const contextValue: KanbanBoardContextValue = {
    columns,
    swimlanes,
    cards,
    draggedCard,
    dragOverColumn,
    dragOverSwimlane,
    setDraggedCard,
    setDragOverColumn,
    setDragOverSwimlane,
    moveCard,
    addCard,
    updateCard,
    deleteCard,
  };

  const hasSwimlanes = swimlanes.length > 0;

  return (
    <KanbanBoardContext.Provider value={contextValue}>
      <div
        style={{
          ...styles.board,
          ...(hasSwimlanes && styles.boardWithSwimlanes),
        }}
        className={className}
      >
        {hasSwimlanes ? (
          // Render with swimlanes
          swimlanes.map((swimlane) => (
            <div key={swimlane.id} style={styles.swimlane}>
              <div style={styles.swimlaneHeader}>
                <span style={styles.swimlaneTitle}>{swimlane.title}</span>
              </div>
              <div style={styles.swimlaneColumns}>
                {columns.map((column) => (
                  <KanbanColumnComponent
                    key={column.id}
                    column={column}
                    cards={getColumnCards(column.id, swimlane.id)}
                    swimlaneId={swimlane.id}
                    renderCard={renderCard}
                    renderHeader={renderColumnHeader}
                    showAddCard={showAddCard}
                    showCardCount={showCardCount}
                    showLimit={showColumnLimit}
                    width={columnWidth}
                    onCardClick={onCardClick}
                    onCardDoubleClick={onCardDoubleClick}
                    onAddCard={() => onCardAdd?.(column.id, swimlane.id)}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          // Render without swimlanes
          columns.map((column) => (
            <KanbanColumnComponent
              key={column.id}
              column={column}
              cards={getColumnCards(column.id)}
              renderCard={renderCard}
              renderHeader={renderColumnHeader}
              showAddCard={showAddCard}
              showCardCount={showCardCount}
              showLimit={showColumnLimit}
              width={columnWidth}
              onCardClick={onCardClick}
              onCardDoubleClick={onCardDoubleClick}
              onAddCard={() => onCardAdd?.(column.id)}
            />
          ))
        )}
      </div>
    </KanbanBoardContext.Provider>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  CardPriority,
  CardStatus,
  KanbanCard,
  KanbanColumn,
  KanbanSwimlane,
  KanbanBoardContextValue,
  KanbanBoardProps,
  KanbanColumnProps,
  KanbanCardProps,
};

export {
  PRIORITY_CONFIG,
  DEFAULT_COLUMN_WIDTH,
  DEFAULT_CARD_SPACING,
  generateId,
  formatDate,
  isOverdue,
};

export default KanbanBoard;
