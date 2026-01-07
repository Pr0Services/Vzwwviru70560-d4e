// CHE·NU™ Tree View Component
// Comprehensive tree navigation with selection, drag-drop, and virtualization

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  ReactNode,
  KeyboardEvent,
  MouseEvent,
} from 'react';

// ============================================================
// TYPES
// ============================================================

interface TreeNode<T = any> {
  id: string;
  label: string;
  icon?: ReactNode;
  children?: TreeNode<T>[];
  data?: T;
  disabled?: boolean;
  selectable?: boolean;
  draggable?: boolean;
  droppable?: boolean;
  isLeaf?: boolean;
  badge?: string | number;
  className?: string;
}

interface TreeState {
  expandedIds: Set<string>;
  selectedIds: Set<string>;
  focusedId: string | null;
  editingId: string | null;
}

interface TreeNodeRenderProps<T = any> {
  node: TreeNode<T>;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  isFocused: boolean;
  isEditing: boolean;
  hasChildren: boolean;
  onToggle: () => void;
  onSelect: () => void;
  onEdit: () => void;
}

interface TreeProps<T = any> {
  nodes: TreeNode<T>[];
  defaultExpanded?: string[];
  defaultSelected?: string[];
  expandedIds?: string[];
  selectedIds?: string[];
  selectionMode?: 'none' | 'single' | 'multiple' | 'checkbox';
  showCheckboxes?: boolean;
  showLines?: boolean;
  showIcons?: boolean;
  editable?: boolean;
  draggable?: boolean;
  virtualized?: boolean;
  rowHeight?: number;
  indent?: number;
  searchable?: boolean;
  searchQuery?: string;
  loading?: boolean;
  disabled?: boolean;
  onNodeSelect?: (nodeIds: string[], nodes: TreeNode<T>[]) => void;
  onNodeExpand?: (nodeId: string, isExpanded: boolean) => void;
  onNodeEdit?: (nodeId: string, newLabel: string) => void;
  onNodeDelete?: (nodeId: string) => void;
  onNodeMove?: (sourceId: string, targetId: string, position: 'before' | 'after' | 'inside') => void;
  onNodeClick?: (node: TreeNode<T>, event: MouseEvent) => void;
  onNodeDoubleClick?: (node: TreeNode<T>, event: MouseEvent) => void;
  onNodeContextMenu?: (node: TreeNode<T>, event: MouseEvent) => void;
  onLoadChildren?: (nodeId: string) => Promise<TreeNode<T>[]>;
  renderNode?: (props: TreeNodeRenderProps<T>) => ReactNode;
  renderEmpty?: () => ReactNode;
  className?: string;
}

interface FlatNode<T = any> {
  node: TreeNode<T>;
  depth: number;
  parentId: string | null;
  index: number;
  hasChildren: boolean;
  isLast: boolean;
  path: string[];
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
// UTILITIES
// ============================================================

function flattenNodes<T>(
  nodes: TreeNode<T>[],
  expandedIds: Set<string>,
  parentId: string | null = null,
  depth: number = 0,
  path: string[] = []
): FlatNode<T>[] {
  const result: FlatNode<T>[] = [];

  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    const hasChildren = !!(node.children && node.children.length > 0);
    const nodePath = [...path, node.id];

    result.push({
      node,
      depth,
      parentId,
      index,
      hasChildren,
      isLast,
      path: nodePath,
    });

    if (hasChildren && expandedIds.has(node.id) && node.children) {
      result.push(
        ...flattenNodes(node.children, expandedIds, node.id, depth + 1, nodePath)
      );
    }
  });

  return result;
}

function findNodeById<T>(nodes: TreeNode<T>[], id: string): TreeNode<T> | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function getAllNodeIds<T>(nodes: TreeNode<T>[]): string[] {
  const ids: string[] = [];
  const traverse = (nodeList: TreeNode<T>[]) => {
    nodeList.forEach((node) => {
      ids.push(node.id);
      if (node.children) traverse(node.children);
    });
  };
  traverse(nodes);
  return ids;
}

function getNodeParents<T>(nodes: TreeNode<T>[], id: string, parents: string[] = []): string[] {
  for (const node of nodes) {
    if (node.id === id) return parents;
    if (node.children) {
      const found = getNodeParents(node.children, id, [...parents, node.id]);
      if (found.length > parents.length) return found;
    }
  }
  return parents;
}

function filterNodes<T>(nodes: TreeNode<T>[], query: string): TreeNode<T>[] {
  if (!query) return nodes;

  const lowerQuery = query.toLowerCase();

  const filterRecursive = (nodeList: TreeNode<T>[]): TreeNode<T>[] => {
    const result: TreeNode<T>[] = [];

    nodeList.forEach((node) => {
      const matchesLabel = node.label.toLowerCase().includes(lowerQuery);
      const filteredChildren = node.children ? filterRecursive(node.children) : [];

      if (matchesLabel || filteredChildren.length > 0) {
        result.push({
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children,
        });
      }
    });

    return result;
  };

  return filterRecursive(nodes);
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '14px',
    color: BRAND.uiSlate,
    userSelect: 'none' as const,
  },

  searchContainer: {
    padding: '8px 12px',
    borderBottom: `1px solid ${BRAND.ancientStone}20`,
  },

  searchInput: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: `1px solid ${BRAND.ancientStone}30`,
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },

  treeList: {
    listStyle: 'none',
    margin: 0,
    padding: '8px 0',
    overflow: 'auto',
  },

  treeNode: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'background-color 0.1s',
    position: 'relative' as const,
  },

  treeNodeSelected: {
    backgroundColor: `${BRAND.sacredGold}20`,
  },

  treeNodeFocused: {
    outline: `2px solid ${BRAND.cenoteTurquoise}`,
    outlineOffset: '-2px',
  },

  treeNodeDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  treeNodeHover: {
    backgroundColor: `${BRAND.ancientStone}10`,
  },

  indentGuide: {
    position: 'absolute' as const,
    left: 0,
    top: 0,
    bottom: 0,
    borderLeft: `1px solid ${BRAND.ancientStone}30`,
  },

  toggleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    marginRight: '4px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: BRAND.ancientStone,
    fontSize: '12px',
    transition: 'transform 0.2s',
    flexShrink: 0,
  },

  toggleButtonExpanded: {
    transform: 'rotate(90deg)',
  },

  togglePlaceholder: {
    width: '20px',
    marginRight: '4px',
    flexShrink: 0,
  },

  checkbox: {
    marginRight: '8px',
    width: '16px',
    height: '16px',
    accentColor: BRAND.sacredGold,
    cursor: 'pointer',
  },

  nodeIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '8px',
    fontSize: '16px',
    flexShrink: 0,
  },

  nodeLabel: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },

  nodeLabelEditing: {
    padding: '2px 8px',
    border: `1px solid ${BRAND.sacredGold}`,
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
  },

  nodeBadge: {
    marginLeft: '8px',
    padding: '2px 8px',
    backgroundColor: BRAND.softSand,
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: 500,
    color: BRAND.ancientStone,
    flexShrink: 0,
  },

  loadingIndicator: {
    marginLeft: '8px',
    width: '14px',
    height: '14px',
    border: `2px solid ${BRAND.softSand}`,
    borderTopColor: BRAND.cenoteTurquoise,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },

  dropIndicator: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: BRAND.cenoteTurquoise,
    pointerEvents: 'none' as const,
  },

  dropIndicatorBefore: {
    top: 0,
  },

  dropIndicatorAfter: {
    bottom: 0,
  },

  dropIndicatorInside: {
    left: '24px',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
  },

  emptyState: {
    padding: '24px',
    textAlign: 'center' as const,
    color: BRAND.ancientStone,
  },

  emptyIcon: {
    fontSize: '32px',
    marginBottom: '8px',
    opacity: 0.5,
  },

  emptyText: {
    fontSize: '14px',
  },

  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    color: BRAND.ancientStone,
  },
};

// ============================================================
// DEFAULT ICONS
// ============================================================

const DEFAULT_ICONS = {
  folder: '📁',
  folderOpen: '📂',
  file: '📄',
  chevron: '▶',
};

// ============================================================
// TREE NODE COMPONENT
// ============================================================

interface TreeNodeItemProps<T = any> {
  flatNode: FlatNode<T>;
  isExpanded: boolean;
  isSelected: boolean;
  isFocused: boolean;
  isEditing: boolean;
  isDropTarget: boolean;
  dropPosition: 'before' | 'after' | 'inside' | null;
  showCheckboxes: boolean;
  showLines: boolean;
  showIcons: boolean;
  indent: number;
  disabled: boolean;
  loadingNodes: Set<string>;
  onToggle: () => void;
  onSelect: (event: MouseEvent) => void;
  onEdit: () => void;
  onEditSubmit: (newLabel: string) => void;
  onEditCancel: () => void;
  onClick: (event: MouseEvent) => void;
  onDoubleClick: (event: MouseEvent) => void;
  onContextMenu: (event: MouseEvent) => void;
  onDragStart: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (event: React.DragEvent) => void;
  renderNode?: (props: TreeNodeRenderProps<T>) => ReactNode;
}

function TreeNodeItem<T>({
  flatNode,
  isExpanded,
  isSelected,
  isFocused,
  isEditing,
  isDropTarget,
  dropPosition,
  showCheckboxes,
  showLines,
  showIcons,
  indent,
  disabled,
  loadingNodes,
  onToggle,
  onSelect,
  onEdit,
  onEditSubmit,
  onEditCancel,
  onClick,
  onDoubleClick,
  onContextMenu,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  renderNode,
}: TreeNodeItemProps<T>): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [editValue, setEditValue] = useState(flatNode.node.label);
  const editInputRef = useRef<HTMLInputElement>(null);

  const { node, depth, hasChildren } = flatNode;
  const isLoading = loadingNodes.has(node.id);
  const isDisabled = disabled || node.disabled;

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleEditKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEditSubmit(editValue);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onEditCancel();
    }
  }, [editValue, onEditSubmit, onEditCancel]);

  // Custom render
  if (renderNode) {
    return renderNode({
      node,
      depth,
      isExpanded,
      isSelected,
      isFocused,
      isEditing,
      hasChildren,
      onToggle,
      onSelect: () => onSelect({} as MouseEvent),
      onEdit,
    }) as JSX.Element;
  }

  const nodeStyle: React.CSSProperties = {
    ...styles.treeNode,
    paddingLeft: `${12 + depth * indent}px`,
    ...(isSelected && styles.treeNodeSelected),
    ...(isFocused && styles.treeNodeFocused),
    ...(isDisabled && styles.treeNodeDisabled),
    ...(isHovered && !isSelected && styles.treeNodeHover),
  };

  return (
    <div
      style={nodeStyle}
      className={node.className}
      draggable={!isDisabled && node.draggable !== false}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Indent guides */}
      {showLines && depth > 0 && (
        Array.from({ length: depth }).map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.indentGuide,
              left: `${12 + i * indent + indent / 2}px`,
            }}
          />
        ))
      )}

      {/* Drop indicator */}
      {isDropTarget && dropPosition && (
        <div
          style={{
            ...styles.dropIndicator,
            ...(dropPosition === 'before' && styles.dropIndicatorBefore),
            ...(dropPosition === 'after' && styles.dropIndicatorAfter),
            ...(dropPosition === 'inside' && styles.dropIndicatorInside),
          }}
        />
      )}

      {/* Toggle button */}
      {hasChildren ? (
        <button
          style={{
            ...styles.toggleButton,
            ...(isExpanded && styles.toggleButtonExpanded),
          }}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          tabIndex={-1}
        >
          {DEFAULT_ICONS.chevron}
        </button>
      ) : (
        <div style={styles.togglePlaceholder} />
      )}

      {/* Checkbox */}
      {showCheckboxes && node.selectable !== false && (
        <input
          type="checkbox"
          style={styles.checkbox}
          checked={isSelected}
          disabled={isDisabled}
          onChange={() => {}}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(e as unknown as MouseEvent);
          }}
        />
      )}

      {/* Icon */}
      {showIcons && (
        <span style={styles.nodeIcon}>
          {node.icon || (
            hasChildren
              ? isExpanded
                ? DEFAULT_ICONS.folderOpen
                : DEFAULT_ICONS.folder
              : DEFAULT_ICONS.file
          )}
        </span>
      )}

      {/* Label or edit input */}
      {isEditing ? (
        <input
          ref={editInputRef}
          type="text"
          value={editValue}
          style={styles.nodeLabelEditing}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleEditKeyDown}
          onBlur={() => onEditSubmit(editValue)}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span style={styles.nodeLabel}>{node.label}</span>
      )}

      {/* Badge */}
      {node.badge !== undefined && (
        <span style={styles.nodeBadge}>{node.badge}</span>
      )}

      {/* Loading indicator */}
      {isLoading && <div style={styles.loadingIndicator} />}
    </div>
  );
}

// ============================================================
// TREE VIEW COMPONENT
// ============================================================

export function TreeView<T = any>({
  nodes,
  defaultExpanded = [],
  defaultSelected = [],
  expandedIds: controlledExpanded,
  selectedIds: controlledSelected,
  selectionMode = 'single',
  showCheckboxes = false,
  showLines = false,
  showIcons = true,
  editable = false,
  draggable = false,
  virtualized = false,
  rowHeight = 32,
  indent = 20,
  searchable = false,
  searchQuery: controlledSearchQuery,
  loading = false,
  disabled = false,
  onNodeSelect,
  onNodeExpand,
  onNodeEdit,
  onNodeDelete,
  onNodeMove,
  onNodeClick,
  onNodeDoubleClick,
  onNodeContextMenu,
  onLoadChildren,
  renderNode,
  renderEmpty,
  className,
}: TreeProps<T>): JSX.Element {
  // Internal state
  const [internalExpanded, setInternalExpanded] = useState<Set<string>>(
    () => new Set(defaultExpanded)
  );
  const [internalSelected, setInternalSelected] = useState<Set<string>>(
    () => new Set(defaultSelected)
  );
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [loadingNodes, setLoadingNodes] = useState<Set<string>>(new Set());
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'inside' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Controlled vs uncontrolled
  const expandedIds = controlledExpanded !== undefined
    ? new Set(controlledExpanded)
    : internalExpanded;
  const selectedIds = controlledSelected !== undefined
    ? new Set(controlledSelected)
    : internalSelected;
  const searchQuery = controlledSearchQuery !== undefined
    ? controlledSearchQuery
    : internalSearchQuery;

  // Filter nodes by search
  const filteredNodes = useMemo(() => {
    return filterNodes(nodes, searchQuery);
  }, [nodes, searchQuery]);

  // Flatten visible nodes
  const flatNodes = useMemo(() => {
    return flattenNodes(filteredNodes, expandedIds);
  }, [filteredNodes, expandedIds]);

  // Toggle node expansion
  const toggleExpand = useCallback(async (nodeId: string) => {
    const isExpanded = expandedIds.has(nodeId);
    const node = findNodeById(nodes, nodeId);

    // Lazy load children
    if (!isExpanded && node && !node.children && !node.isLeaf && onLoadChildren) {
      setLoadingNodes((prev) => new Set(prev).add(nodeId));
      try {
        await onLoadChildren(nodeId);
      } finally {
        setLoadingNodes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(nodeId);
          return newSet;
        });
      }
    }

    if (controlledExpanded === undefined) {
      setInternalExpanded((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(nodeId)) {
          newSet.delete(nodeId);
        } else {
          newSet.add(nodeId);
        }
        return newSet;
      });
    }

    onNodeExpand?.(nodeId, !isExpanded);
  }, [nodes, expandedIds, controlledExpanded, onNodeExpand, onLoadChildren]);

  // Handle selection
  const handleSelect = useCallback((nodeId: string, event: MouseEvent) => {
    const node = findNodeById(nodes, nodeId);
    if (!node || node.selectable === false) return;

    let newSelected: Set<string>;

    switch (selectionMode) {
      case 'none':
        return;
      case 'single':
        newSelected = new Set([nodeId]);
        break;
      case 'multiple':
        if (event.ctrlKey || event.metaKey) {
          newSelected = new Set(selectedIds);
          if (newSelected.has(nodeId)) {
            newSelected.delete(nodeId);
          } else {
            newSelected.add(nodeId);
          }
        } else if (event.shiftKey && focusedId) {
          // Range selection
          const allIds = getAllNodeIds(nodes);
          const startIndex = allIds.indexOf(focusedId);
          const endIndex = allIds.indexOf(nodeId);
          const [from, to] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
          newSelected = new Set(allIds.slice(from, to + 1));
        } else {
          newSelected = new Set([nodeId]);
        }
        break;
      case 'checkbox':
        newSelected = new Set(selectedIds);
        if (newSelected.has(nodeId)) {
          newSelected.delete(nodeId);
        } else {
          newSelected.add(nodeId);
        }
        break;
      default:
        return;
    }

    if (controlledSelected === undefined) {
      setInternalSelected(newSelected);
    }

    const selectedNodes = Array.from(newSelected)
      .map((id) => findNodeById(nodes, id))
      .filter(Boolean) as TreeNode<T>[];

    onNodeSelect?.(Array.from(newSelected), selectedNodes);
  }, [nodes, selectionMode, selectedIds, focusedId, controlledSelected, onNodeSelect]);

  // Handle click
  const handleClick = useCallback((nodeId: string, event: MouseEvent) => {
    setFocusedId(nodeId);
    handleSelect(nodeId, event);

    const node = findNodeById(nodes, nodeId);
    if (node) {
      onNodeClick?.(node, event);
    }
  }, [nodes, handleSelect, onNodeClick]);

  // Handle double click
  const handleDoubleClick = useCallback((nodeId: string, event: MouseEvent) => {
    const node = findNodeById(nodes, nodeId);
    if (!node) return;

    if (editable && node.selectable !== false) {
      setEditingId(nodeId);
    } else if (node.children) {
      toggleExpand(nodeId);
    }

    onNodeDoubleClick?.(node, event);
  }, [nodes, editable, toggleExpand, onNodeDoubleClick]);

  // Handle context menu
  const handleContextMenu = useCallback((nodeId: string, event: MouseEvent) => {
    event.preventDefault();
    const node = findNodeById(nodes, nodeId);
    if (node) {
      onNodeContextMenu?.(node, event);
    }
  }, [nodes, onNodeContextMenu]);

  // Handle edit
  const handleEditSubmit = useCallback((nodeId: string, newLabel: string) => {
    if (newLabel.trim() && newLabel !== findNodeById(nodes, nodeId)?.label) {
      onNodeEdit?.(nodeId, newLabel.trim());
    }
    setEditingId(null);
  }, [nodes, onNodeEdit]);

  // Handle drag & drop
  const handleDragStart = useCallback((nodeId: string, event: React.DragEvent) => {
    setDraggedId(nodeId);
    event.dataTransfer.setData('text/plain', nodeId);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((nodeId: string, event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    if (draggedId === nodeId) return;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const y = event.clientY - rect.top;
    const height = rect.height;

    let position: 'before' | 'after' | 'inside';
    if (y < height * 0.25) {
      position = 'before';
    } else if (y > height * 0.75) {
      position = 'after';
    } else {
      position = 'inside';
    }

    setDropTargetId(nodeId);
    setDropPosition(position);
  }, [draggedId]);

  const handleDragLeave = useCallback(() => {
    setDropTargetId(null);
    setDropPosition(null);
  }, []);

  const handleDrop = useCallback((targetId: string, event: React.DragEvent) => {
    event.preventDefault();
    
    if (draggedId && dropPosition) {
      onNodeMove?.(draggedId, targetId, dropPosition);
    }

    setDraggedId(null);
    setDropTargetId(null);
    setDropPosition(null);
  }, [draggedId, dropPosition, onNodeMove]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: globalThis.KeyboardEvent) => {
    if (!focusedId || editingId) return;

    const currentIndex = flatNodes.findIndex((fn) => fn.node.id === focusedId);
    if (currentIndex === -1) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < flatNodes.length - 1) {
          setFocusedId(flatNodes[currentIndex + 1].node.id);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          setFocusedId(flatNodes[currentIndex - 1].node.id);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        const currentNode = flatNodes[currentIndex];
        if (currentNode.hasChildren && !expandedIds.has(focusedId)) {
          toggleExpand(focusedId);
        } else if (currentNode.hasChildren && currentIndex < flatNodes.length - 1) {
          setFocusedId(flatNodes[currentIndex + 1].node.id);
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (expandedIds.has(focusedId)) {
          toggleExpand(focusedId);
        } else {
          const parent = flatNodes[currentIndex].parentId;
          if (parent) setFocusedId(parent);
        }
        break;
      case 'Enter':
        event.preventDefault();
        handleSelect(focusedId, {} as MouseEvent);
        break;
      case ' ':
        event.preventDefault();
        toggleExpand(focusedId);
        break;
      case 'Delete':
      case 'Backspace':
        if (onNodeDelete) {
          event.preventDefault();
          onNodeDelete(focusedId);
        }
        break;
      case 'F2':
        if (editable) {
          event.preventDefault();
          setEditingId(focusedId);
        }
        break;
    }
  }, [focusedId, editingId, flatNodes, expandedIds, toggleExpand, handleSelect, editable, onNodeDelete]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Loading state
  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.loadingIndicator} />
        <span style={{ marginLeft: '12px' }}>Loading...</span>
      </div>
    );
  }

  // Empty state
  if (flatNodes.length === 0) {
    return renderEmpty ? (
      <>{renderEmpty()}</>
    ) : (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📂</div>
        <div style={styles.emptyText}>
          {searchQuery ? 'No matching items found' : 'No items'}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={styles.container} className={className}>
      {/* Search input */}
      {searchable && (
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setInternalSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      )}

      {/* Tree list */}
      <div style={styles.treeList} role="tree">
        {flatNodes.map((flatNode) => (
          <TreeNodeItem
            key={flatNode.node.id}
            flatNode={flatNode}
            isExpanded={expandedIds.has(flatNode.node.id)}
            isSelected={selectedIds.has(flatNode.node.id)}
            isFocused={focusedId === flatNode.node.id}
            isEditing={editingId === flatNode.node.id}
            isDropTarget={dropTargetId === flatNode.node.id}
            dropPosition={dropTargetId === flatNode.node.id ? dropPosition : null}
            showCheckboxes={showCheckboxes}
            showLines={showLines}
            showIcons={showIcons}
            indent={indent}
            disabled={disabled}
            loadingNodes={loadingNodes}
            onToggle={() => toggleExpand(flatNode.node.id)}
            onSelect={(e) => handleSelect(flatNode.node.id, e)}
            onEdit={() => setEditingId(flatNode.node.id)}
            onEditSubmit={(newLabel) => handleEditSubmit(flatNode.node.id, newLabel)}
            onEditCancel={() => setEditingId(null)}
            onClick={(e) => handleClick(flatNode.node.id, e)}
            onDoubleClick={(e) => handleDoubleClick(flatNode.node.id, e)}
            onContextMenu={(e) => handleContextMenu(flatNode.node.id, e)}
            onDragStart={(e) => handleDragStart(flatNode.node.id, e)}
            onDragOver={(e) => handleDragOver(flatNode.node.id, e)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(flatNode.node.id, e)}
            renderNode={renderNode}
          />
        ))}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  TreeNode,
  TreeState,
  TreeNodeRenderProps,
  TreeProps,
  FlatNode,
};

export { findNodeById, getAllNodeIds, getNodeParents, filterNodes };
export default TreeView;
