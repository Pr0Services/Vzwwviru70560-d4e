// CHE·NU™ Drag and Drop System
// Comprehensive DnD for lists, grids, and kanban boards

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
  MouseEvent,
  TouchEvent,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type DragType = 'move' | 'copy' | 'link';
type DropPosition = 'before' | 'after' | 'inside';

interface Position {
  x: number;
  y: number;
}

interface DragItem<T = any> {
  id: string;
  type: string;
  data: T;
  sourceContainerId: string;
  sourceIndex: number;
}

interface DropTarget {
  containerId: string;
  index: number;
  position: DropPosition;
}

interface DragState<T = any> {
  isDragging: boolean;
  dragItem: DragItem<T> | null;
  dragType: DragType;
  startPosition: Position | null;
  currentPosition: Position | null;
  dropTarget: DropTarget | null;
  dragPreview: ReactNode | null;
}

interface DragContextValue<T = any> {
  state: DragState<T>;
  startDrag: (item: DragItem<T>, position: Position, dragType?: DragType) => void;
  updateDrag: (position: Position) => void;
  setDropTarget: (target: DropTarget | null) => void;
  endDrag: () => void;
  cancelDrag: () => void;
  setDragPreview: (preview: ReactNode) => void;
}

interface DraggableProps<T = any> {
  id: string;
  type: string;
  data: T;
  containerId: string;
  index: number;
  disabled?: boolean;
  dragType?: DragType;
  dragHandle?: boolean;
  dragPreview?: ReactNode | ((item: DragItem<T>) => ReactNode);
  onDragStart?: (item: DragItem<T>) => void;
  onDragEnd?: (item: DragItem<T>, dropped: boolean) => void;
  children: ReactNode | ((props: DraggableChildProps) => ReactNode);
  className?: string;
  style?: React.CSSProperties;
}

interface DraggableChildProps {
  isDragging: boolean;
  dragHandleProps: {
    onMouseDown: (e: MouseEvent) => void;
    onTouchStart: (e: TouchEvent) => void;
  };
}

interface DroppableProps<T = any> {
  id: string;
  accepts: string | string[];
  disabled?: boolean;
  direction?: 'vertical' | 'horizontal' | 'grid';
  onDrop?: (item: DragItem<T>, target: DropTarget) => void;
  onDragEnter?: (item: DragItem<T>) => void;
  onDragLeave?: (item: DragItem<T>) => void;
  onDragOver?: (item: DragItem<T>, position: Position) => void;
  canDrop?: (item: DragItem<T>) => boolean;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: ReactNode;
}

interface SortableListProps<T = any> {
  items: T[];
  idKey: keyof T;
  containerId: string;
  itemType: string;
  direction?: 'vertical' | 'horizontal';
  onReorder: (items: T[], fromIndex: number, toIndex: number) => void;
  renderItem: (item: T, index: number, isDragging: boolean) => ReactNode;
  disabled?: boolean;
  className?: string;
  itemClassName?: string;
  gap?: number;
}

interface KanbanColumn<T = any> {
  id: string;
  title: string;
  items: T[];
  color?: string;
  maxItems?: number;
}

interface KanbanBoardProps<T = any> {
  columns: KanbanColumn<T>[];
  idKey: keyof T;
  itemType: string;
  onMove: (
    item: T,
    fromColumnId: string,
    toColumnId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
  renderItem: (item: T, columnId: string, isDragging: boolean) => ReactNode;
  renderColumnHeader?: (column: KanbanColumn<T>) => ReactNode;
  renderColumnFooter?: (column: KanbanColumn<T>) => ReactNode;
  disabled?: boolean;
  className?: string;
  columnClassName?: string;
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
// CONTEXT
// ============================================================

const DragContext = createContext<DragContextValue | null>(null);

export function useDrag<T = any>(): DragContextValue<T> {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error('useDrag must be used within a DragProvider');
  }
  return context as DragContextValue<T>;
}

// ============================================================
// UTILITIES
// ============================================================

function getEventPosition(e: MouseEvent | TouchEvent | globalThis.MouseEvent | globalThis.TouchEvent): Position {
  if ('touches' in e) {
    const touch = e.touches[0] || e.changedTouches[0];
    return { x: touch.clientX, y: touch.clientY };
  }
  return { x: (e as globalThis.MouseEvent).clientX, y: (e as globalThis.MouseEvent).clientY };
}

function isWithinElement(position: Position, element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    position.x >= rect.left &&
    position.x <= rect.right &&
    position.y >= rect.top &&
    position.y <= rect.bottom
  );
}

function getDropPosition(
  position: Position,
  element: Element,
  direction: 'vertical' | 'horizontal' | 'grid'
): DropPosition {
  const rect = element.getBoundingClientRect();
  
  if (direction === 'horizontal') {
    const midX = rect.left + rect.width / 2;
    return position.x < midX ? 'before' : 'after';
  }
  
  const midY = rect.top + rect.height / 2;
  return position.y < midY ? 'before' : 'after';
}

// ============================================================
// DRAG PROVIDER
// ============================================================

interface DragProviderProps {
  children: ReactNode;
  onDragEnd?: (item: DragItem, target: DropTarget | null) => void;
}

export function DragProvider({ children, onDragEnd }: DragProviderProps): JSX.Element {
  const [state, setState] = useState<DragState>({
    isDragging: false,
    dragItem: null,
    dragType: 'move',
    startPosition: null,
    currentPosition: null,
    dropTarget: null,
    dragPreview: null,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const startDrag = useCallback((
    item: DragItem,
    position: Position,
    dragType: DragType = 'move'
  ) => {
    setState((prev) => ({
      ...prev,
      isDragging: true,
      dragItem: item,
      dragType,
      startPosition: position,
      currentPosition: position,
    }));
  }, []);

  const updateDrag = useCallback((position: Position) => {
    setState((prev) => ({
      ...prev,
      currentPosition: position,
    }));
  }, []);

  const setDropTarget = useCallback((target: DropTarget | null) => {
    setState((prev) => ({
      ...prev,
      dropTarget: target,
    }));
  }, []);

  const endDrag = useCallback(() => {
    const current = stateRef.current;
    if (current.dragItem && current.dropTarget) {
      onDragEnd?.(current.dragItem, current.dropTarget);
    }
    
    setState({
      isDragging: false,
      dragItem: null,
      dragType: 'move',
      startPosition: null,
      currentPosition: null,
      dropTarget: null,
      dragPreview: null,
    });
  }, [onDragEnd]);

  const cancelDrag = useCallback(() => {
    setState({
      isDragging: false,
      dragItem: null,
      dragType: 'move',
      startPosition: null,
      currentPosition: null,
      dropTarget: null,
      dragPreview: null,
    });
  }, []);

  const setDragPreview = useCallback((preview: ReactNode) => {
    setState((prev) => ({
      ...prev,
      dragPreview: preview,
    }));
  }, []);

  // Global event listeners
  useEffect(() => {
    if (!state.isDragging) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      updateDrag(getEventPosition(e));
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      updateDrag(getEventPosition(e));
    };

    const handleMouseUp = () => {
      endDrag();
    };

    const handleTouchEnd = () => {
      endDrag();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelDrag();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.isDragging, updateDrag, endDrag, cancelDrag]);

  const contextValue: DragContextValue = {
    state,
    startDrag,
    updateDrag,
    setDropTarget,
    endDrag,
    cancelDrag,
    setDragPreview,
  };

  return (
    <DragContext.Provider value={contextValue}>
      {children}
      {state.isDragging && state.currentPosition && (
        <div
          style={{
            position: 'fixed',
            left: state.currentPosition.x,
            top: state.currentPosition.y,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 10000,
            opacity: 0.8,
          }}
        >
          {state.dragPreview || (
            <div
              style={{
                padding: '8px 16px',
                backgroundColor: BRAND.sacredGold,
                color: '#fff',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              {state.dragItem?.id}
            </div>
          )}
        </div>
      )}
    </DragContext.Provider>
  );
}

// ============================================================
// DRAGGABLE COMPONENT
// ============================================================

export function Draggable<T = any>({
  id,
  type,
  data,
  containerId,
  index,
  disabled = false,
  dragType = 'move',
  dragHandle = false,
  dragPreview,
  onDragStart,
  onDragEnd,
  children,
  className,
  style,
}: DraggableProps<T>): JSX.Element {
  const { state, startDrag, setDragPreview } = useDrag<T>();
  const elementRef = useRef<HTMLDivElement>(null);

  const isDragging = state.isDragging && state.dragItem?.id === id;

  const handleDragStart = useCallback((e: MouseEvent | TouchEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();

    const item: DragItem<T> = {
      id,
      type,
      data,
      sourceContainerId: containerId,
      sourceIndex: index,
    };

    const position = getEventPosition(e);
    startDrag(item, position, dragType);

    if (dragPreview) {
      const preview = typeof dragPreview === 'function' ? dragPreview(item) : dragPreview;
      setDragPreview(preview);
    }

    onDragStart?.(item);
  }, [id, type, data, containerId, index, disabled, dragType, dragPreview, startDrag, setDragPreview, onDragStart]);

  const dragHandleProps = {
    onMouseDown: handleDragStart,
    onTouchStart: handleDragStart,
  };

  const content = typeof children === 'function'
    ? children({ isDragging, dragHandleProps })
    : children;

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        ...style,
        opacity: isDragging ? 0.5 : 1,
        cursor: disabled ? 'default' : dragHandle ? 'default' : 'grab',
        transition: 'opacity 0.2s',
        touchAction: 'none',
      }}
      {...(!dragHandle && !disabled ? dragHandleProps : {})}
    >
      {content}
    </div>
  );
}

// ============================================================
// DROPPABLE COMPONENT
// ============================================================

export function Droppable<T = any>({
  id,
  accepts,
  disabled = false,
  direction = 'vertical',
  onDrop,
  onDragEnter,
  onDragLeave,
  onDragOver,
  canDrop,
  children,
  className,
  style,
  placeholder,
}: DroppableProps<T>): JSX.Element {
  const { state, setDropTarget } = useDrag<T>();
  const elementRef = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState(false);
  const lastOverItem = useRef<string | null>(null);

  const acceptsArray = Array.isArray(accepts) ? accepts : [accepts];
  const canAccept = state.dragItem && acceptsArray.includes(state.dragItem.type);
  const canDropHere = canAccept && !disabled && (!canDrop || canDrop(state.dragItem!));

  useEffect(() => {
    if (!state.isDragging || !state.currentPosition || !elementRef.current || !canDropHere) {
      if (isOver) {
        setIsOver(false);
        if (state.dragItem) {
          onDragLeave?.(state.dragItem);
        }
      }
      return;
    }

    const element = elementRef.current;
    const isWithin = isWithinElement(state.currentPosition, element);

    if (isWithin && !isOver) {
      setIsOver(true);
      onDragEnter?.(state.dragItem!);
    } else if (!isWithin && isOver) {
      setIsOver(false);
      onDragLeave?.(state.dragItem!);
      setDropTarget(null);
    }

    if (isWithin) {
      onDragOver?.(state.dragItem!, state.currentPosition);

      // Find drop position among children
      const childElements = Array.from(element.children);
      let dropIndex = childElements.length;
      let dropPosition: DropPosition = 'after';

      for (let i = 0; i < childElements.length; i++) {
        const child = childElements[i];
        if (isWithinElement(state.currentPosition, child)) {
          dropPosition = getDropPosition(state.currentPosition, child, direction);
          dropIndex = dropPosition === 'before' ? i : i + 1;
          break;
        }
      }

      setDropTarget({
        containerId: id,
        index: dropIndex,
        position: dropPosition,
      });
    }
  }, [
    state.isDragging,
    state.currentPosition,
    state.dragItem,
    canDropHere,
    isOver,
    id,
    direction,
    onDragEnter,
    onDragLeave,
    onDragOver,
    setDropTarget,
  ]);

  // Handle drop
  useEffect(() => {
    if (!state.isDragging && isOver && state.dropTarget?.containerId === id && state.dragItem) {
      onDrop?.(state.dragItem, state.dropTarget);
      setIsOver(false);
    }
  }, [state.isDragging, isOver, state.dropTarget, state.dragItem, id, onDrop]);

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        ...style,
        position: 'relative',
        minHeight: '50px',
        backgroundColor: isOver && canDropHere ? `${BRAND.cenoteTurquoise}10` : undefined,
        border: isOver && canDropHere ? `2px dashed ${BRAND.cenoteTurquoise}` : undefined,
        borderRadius: '8px',
        transition: 'background-color 0.2s, border 0.2s',
      }}
    >
      {children}
      {state.isDragging && canDropHere && React.Children.count(children) === 0 && (
        placeholder || (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100px',
              color: BRAND.ancientStone,
              fontSize: '14px',
            }}
          >
            Drop here
          </div>
        )
      )}
    </div>
  );
}

// ============================================================
// SORTABLE LIST
// ============================================================

export function SortableList<T extends Record<string, any>>({
  items,
  idKey,
  containerId,
  itemType,
  direction = 'vertical',
  onReorder,
  renderItem,
  disabled = false,
  className,
  itemClassName,
  gap = 8,
}: SortableListProps<T>): JSX.Element {
  const { state } = useDrag<T>();

  const handleDrop = useCallback((item: DragItem<T>, target: DropTarget) => {
    if (item.sourceContainerId !== containerId) return;

    const fromIndex = item.sourceIndex;
    let toIndex = target.index;

    // Adjust index if moving within same container
    if (fromIndex < toIndex) {
      toIndex -= 1;
    }

    if (fromIndex === toIndex) return;

    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);

    onReorder(newItems, fromIndex, toIndex);
  }, [items, containerId, onReorder]);

  return (
    <DragProvider onDragEnd={(item, target) => target && handleDrop(item as DragItem<T>, target)}>
      <Droppable
        id={containerId}
        accepts={itemType}
        direction={direction}
        disabled={disabled}
        className={className}
        style={{
          display: 'flex',
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
          gap: `${gap}px`,
        }}
      >
        {items.map((item, index) => {
          const id = String(item[idKey]);
          const isDragging = state.dragItem?.id === id;

          return (
            <Draggable
              key={id}
              id={id}
              type={itemType}
              data={item}
              containerId={containerId}
              index={index}
              disabled={disabled}
              className={itemClassName}
            >
              {renderItem(item, index, isDragging)}
            </Draggable>
          );
        })}
      </Droppable>
    </DragProvider>
  );
}

// ============================================================
// KANBAN BOARD
// ============================================================

const kanbanStyles = {
  board: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto' as const,
    padding: '16px',
    minHeight: '400px',
  },
  
  column: {
    flex: '0 0 300px',
    backgroundColor: BRAND.softSand,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column' as const,
    maxHeight: '100%',
  },
  
  columnHeader: {
    padding: '12px 16px',
    borderBottom: `1px solid ${BRAND.ancientStone}20`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  columnTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },
  
  columnCount: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    backgroundColor: '#ffffff',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  
  columnContent: {
    flex: 1,
    padding: '12px',
    overflowY: 'auto' as const,
    minHeight: '100px',
  },
  
  columnFooter: {
    padding: '12px 16px',
    borderTop: `1px solid ${BRAND.ancientStone}20`,
  },
  
  item: {
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    padding: '12px',
    marginBottom: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    cursor: 'grab',
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
  
  itemDragging: {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transform: 'rotate(2deg)',
  },
};

export function KanbanBoard<T extends Record<string, any>>({
  columns,
  idKey,
  itemType,
  onMove,
  renderItem,
  renderColumnHeader,
  renderColumnFooter,
  disabled = false,
  className,
  columnClassName,
}: KanbanBoardProps<T>): JSX.Element {
  const handleDrop = useCallback((item: DragItem<T>, target: DropTarget) => {
    const fromColumnId = item.sourceContainerId;
    const toColumnId = target.containerId;
    const fromIndex = item.sourceIndex;
    let toIndex = target.index;

    // Adjust index if moving within same column
    if (fromColumnId === toColumnId && fromIndex < toIndex) {
      toIndex -= 1;
    }

    if (fromColumnId === toColumnId && fromIndex === toIndex) return;

    onMove(item.data, fromColumnId, toColumnId, fromIndex, toIndex);
  }, [onMove]);

  return (
    <DragProvider onDragEnd={(item, target) => target && handleDrop(item as DragItem<T>, target)}>
      <div style={kanbanStyles.board} className={className}>
        {columns.map((column) => (
          <div
            key={column.id}
            style={{
              ...kanbanStyles.column,
              borderTop: column.color ? `3px solid ${column.color}` : undefined,
            }}
            className={columnClassName}
          >
            {renderColumnHeader ? (
              renderColumnHeader(column)
            ) : (
              <div style={kanbanStyles.columnHeader}>
                <span style={kanbanStyles.columnTitle}>{column.title}</span>
                <span style={kanbanStyles.columnCount}>
                  {column.items.length}
                  {column.maxItems && ` / ${column.maxItems}`}
                </span>
              </div>
            )}

            <Droppable
              id={column.id}
              accepts={itemType}
              direction="vertical"
              disabled={disabled || (column.maxItems !== undefined && column.items.length >= column.maxItems)}
              style={kanbanStyles.columnContent}
            >
              {column.items.map((item, index) => {
                const id = String(item[idKey]);

                return (
                  <Draggable
                    key={id}
                    id={id}
                    type={itemType}
                    data={item}
                    containerId={column.id}
                    index={index}
                    disabled={disabled}
                  >
                    {({ isDragging }) => (
                      <div
                        style={{
                          ...kanbanStyles.item,
                          ...(isDragging && kanbanStyles.itemDragging),
                        }}
                      >
                        {renderItem(item, column.id, isDragging)}
                      </div>
                    )}
                  </Draggable>
                );
              })}
            </Droppable>

            {renderColumnFooter && (
              <div style={kanbanStyles.columnFooter}>
                {renderColumnFooter(column)}
              </div>
            )}
          </div>
        ))}
      </div>
    </DragProvider>
  );
}

// ============================================================
// HOOKS
// ============================================================

export function useDragLayer<T = any>() {
  const { state } = useDrag<T>();

  return {
    isDragging: state.isDragging,
    item: state.dragItem,
    itemType: state.dragItem?.type,
    currentOffset: state.currentPosition,
    initialOffset: state.startPosition,
  };
}

export function useDropTarget<T = any>(containerId: string) {
  const { state } = useDrag<T>();

  return {
    isOver: state.dropTarget?.containerId === containerId,
    canDrop: state.isDragging && state.dropTarget?.containerId === containerId,
    item: state.dragItem,
    dropIndex: state.dropTarget?.containerId === containerId ? state.dropTarget.index : null,
  };
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  DragType,
  DropPosition,
  Position,
  DragItem,
  DropTarget,
  DragState,
  DragContextValue,
  DraggableProps,
  DraggableChildProps,
  DroppableProps,
  SortableListProps,
  KanbanColumn,
  KanbanBoardProps,
};

export default {
  DragProvider,
  Draggable,
  Droppable,
  SortableList,
  KanbanBoard,
  useDrag,
  useDragLayer,
  useDropTarget,
};
