// CHE·NU™ DataGrid Component
// Comprehensive data grid with sorting, filtering, pagination

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  ReactNode,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type SortDirection = 'asc' | 'desc' | null;
type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'notIn';
type ColumnType = 'string' | 'number' | 'date' | 'boolean' | 'custom';

interface ColumnDef<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => any);
  type?: ColumnType;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  frozen?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
  cell?: (value: unknown, row: T, index: number) => ReactNode;
  header_cell?: () => ReactNode;
  footer?: (rows: T[]) => ReactNode;
  aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
  hidden?: boolean;
  className?: string;
  headerClassName?: string;
}

interface SortState {
  columnId: string;
  direction: SortDirection;
}

interface FilterState {
  columnId: string;
  operator: FilterOperator;
  value: unknown;
}

interface PaginationState {
  page: number;
  pageSize: number;
  totalPages: number;
  totalRows: number;
}

interface SelectionState {
  selectedRows: Set<string | number>;
  selectAll: boolean;
}

interface DataGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowKey: keyof T | ((row: T) => string | number);
  
  // Sorting
  sortable?: boolean;
  defaultSort?: SortState;
  onSortChange?: (sort: SortState | null) => void;
  
  // Filtering
  filterable?: boolean;
  filters?: FilterState[];
  onFilterChange?: (filters: FilterState[]) => void;
  
  // Pagination
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number, pageSize: number) => void;
  serverSidePagination?: boolean;
  totalRows?: number;
  
  // Selection
  selectable?: boolean;
  selectionMode?: 'single' | 'multiple';
  selectedRows?: (string | number)[];
  onSelectionChange?: (selectedRows: (string | number)[]) => void;
  
  // Row actions
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
  onRowContextMenu?: (row: T, index: number, event: React.MouseEvent) => void;
  
  // Column actions
  onColumnResize?: (columnId: string, width: number) => void;
  onColumnReorder?: (sourceId: string, targetId: string) => void;
  
  // Loading & Empty states
  loading?: boolean;
  loadingComponent?: ReactNode;
  emptyComponent?: ReactNode;
  
  // Styling
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  cellClassName?: string;
  
  // Features
  stickyHeader?: boolean;
  virtualized?: boolean;
  rowHeight?: number;
  headerHeight?: number;
  
  // Expandable rows
  expandable?: boolean;
  expandedRowRender?: (row: T) => ReactNode;
  expandedRows?: (string | number)[];
  onExpandedChange?: (expandedRows: (string | number)[]) => void;
  
  // Grouping
  groupBy?: keyof T;
  groupHeaderRender?: (groupValue: unknown, rows: T[]) => ReactNode;
  
  // Export
  exportable?: boolean;
  onExport?: (format: 'csv' | 'json' | 'xlsx') => void;
}

interface DataGridState<T> {
  sort: SortState | null;
  filters: FilterState[];
  pagination: PaginationState;
  selection: SelectionState;
  expandedRows: Set<string | number>;
  columnWidths: Map<string, number>;
  columnOrder: string[];
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
// STYLES
// ============================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
    backgroundColor: '#ffffff',
    border: `1px solid ${BRAND.ancientStone}30`,
    borderRadius: '8px',
    overflow: 'hidden',
  },
  
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: `1px solid ${BRAND.ancientStone}20`,
    backgroundColor: BRAND.softSand,
  },
  
  tableWrapper: {
    overflow: 'auto',
    flex: 1,
  },
  
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    tableLayout: 'fixed' as const,
  },
  
  thead: {
    backgroundColor: BRAND.uiSlate,
    color: '#ffffff',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
  },
  
  th: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontWeight: 600,
    fontSize: '13px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    borderBottom: `2px solid ${BRAND.sacredGold}`,
    userSelect: 'none' as const,
    position: 'relative' as const,
  },
  
  thSortable: {
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  
  thSortableHover: {
    backgroundColor: `${BRAND.uiSlate}dd`,
  },
  
  sortIcon: {
    marginLeft: '8px',
    fontSize: '12px',
    opacity: 0.7,
  },
  
  tbody: {
    backgroundColor: '#ffffff',
  },
  
  tr: {
    borderBottom: `1px solid ${BRAND.ancientStone}15`,
    transition: 'background-color 0.15s',
  },
  
  trHover: {
    backgroundColor: `${BRAND.cenoteTurquoise}10`,
  },
  
  trSelected: {
    backgroundColor: `${BRAND.sacredGold}20`,
  },
  
  trExpanded: {
    backgroundColor: `${BRAND.softSand}`,
  },
  
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    color: BRAND.uiSlate,
    verticalAlign: 'middle' as const,
  },
  
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: BRAND.sacredGold,
  },
  
  expandButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    fontSize: '16px',
    color: BRAND.jungleEmerald,
    transition: 'transform 0.2s',
  },
  
  expandedContent: {
    padding: '16px 48px',
    backgroundColor: BRAND.softSand,
    borderBottom: `1px solid ${BRAND.ancientStone}20`,
  },
  
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderTop: `1px solid ${BRAND.ancientStone}20`,
    backgroundColor: BRAND.softSand,
  },
  
  paginationInfo: {
    fontSize: '14px',
    color: BRAND.ancientStone,
  },
  
  paginationControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  paginationButton: {
    padding: '6px 12px',
    border: `1px solid ${BRAND.ancientStone}40`,
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  
  paginationButtonActive: {
    backgroundColor: BRAND.sacredGold,
    borderColor: BRAND.sacredGold,
    color: '#ffffff',
  },
  
  paginationButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  
  pageSizeSelect: {
    padding: '6px 12px',
    border: `1px solid ${BRAND.ancientStone}40`,
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    cursor: 'pointer',
  },
  
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    color: BRAND.ancientStone,
  },
  
  empty: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    color: BRAND.ancientStone,
  },
  
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5,
  },
  
  emptyText: {
    fontSize: '16px',
    marginBottom: '8px',
  },
  
  emptySubtext: {
    fontSize: '14px',
    opacity: 0.7,
  },
  
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 16px',
    backgroundColor: `${BRAND.softSand}80`,
    borderBottom: `1px solid ${BRAND.ancientStone}20`,
  },
  
  filterChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: `${BRAND.cenoteTurquoise}20`,
    borderRadius: '16px',
    fontSize: '13px',
    color: BRAND.shadowMoss,
  },
  
  filterChipRemove: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    fontSize: '14px',
    color: BRAND.earthEmber,
    lineHeight: 1,
  },
  
  resizeHandle: {
    position: 'absolute' as const,
    right: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    cursor: 'col-resize',
    backgroundColor: 'transparent',
    transition: 'background-color 0.2s',
  },
  
  resizeHandleActive: {
    backgroundColor: BRAND.sacredGold,
  },
  
  groupHeader: {
    padding: '12px 16px',
    backgroundColor: `${BRAND.jungleEmerald}15`,
    fontWeight: 600,
    fontSize: '14px',
    color: BRAND.shadowMoss,
    borderBottom: `1px solid ${BRAND.jungleEmerald}30`,
  },
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function getValue<T>(row: T, accessor: keyof T | ((row: T) => any)): unknown {
  if (typeof accessor === 'function') {
    return accessor(row);
  }
  return row[accessor];
}

function getRowKey<T>(row: T, rowKey: keyof T | ((row: T) => string | number)): string | number {
  if (typeof rowKey === 'function') {
    return rowKey(row);
  }
  return row[rowKey] as string | number;
}

function compareValues(a: unknown, b: unknown, direction: SortDirection): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;
  
  let result: number;
  if (typeof a === 'string' && typeof b === 'string') {
    result = a.localeCompare(b);
  } else if (a instanceof Date && b instanceof Date) {
    result = a.getTime() - b.getTime();
  } else {
    result = a < b ? -1 : 1;
  }
  
  return direction === 'desc' ? -result : result;
}

function applyFilter<T>(row: T, filter: FilterState, columns: ColumnDef<T>[]): boolean {
  const column = columns.find((c) => c.id === filter.columnId);
  if (!column) return true;
  
  const value = getValue(row, column.accessor);
  const filterValue = filter.value;
  
  switch (filter.operator) {
    case 'eq':
      return value === filterValue;
    case 'neq':
      return value !== filterValue;
    case 'gt':
      return value > filterValue;
    case 'gte':
      return value >= filterValue;
    case 'lt':
      return value < filterValue;
    case 'lte':
      return value <= filterValue;
    case 'contains':
      return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
    case 'startsWith':
      return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
    case 'endsWith':
      return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
    case 'in':
      return Array.isArray(filterValue) && filterValue.includes(value);
    case 'notIn':
      return Array.isArray(filterValue) && !filterValue.includes(value);
    default:
      return true;
  }
}

function calculateAggregation<T>(rows: T[], column: ColumnDef<T>): unknown {
  if (!column.aggregation) return null;
  
  const values = rows
    .map((row) => getValue(row, column.accessor))
    .filter((v) => v !== null && v !== undefined && !isNaN(v));
  
  switch (column.aggregation) {
    case 'sum':
      return values.reduce((acc, v) => acc + Number(v), 0);
    case 'avg':
      return values.length > 0 ? values.reduce((acc, v) => acc + Number(v), 0) / values.length : 0;
    case 'min':
      return Math.min(...values.map(Number));
    case 'max':
      return Math.max(...values.map(Number));
    case 'count':
      return values.length;
    default:
      return null;
  }
}

function exportToCsv<T>(data: T[], columns: ColumnDef<T>[], filename: string): void {
  const visibleColumns = columns.filter((c) => !c.hidden);
  const headers = visibleColumns.map((c) => c.header).join(',');
  const rows = data.map((row) =>
    visibleColumns
      .map((col) => {
        const value = getValue(row, col.accessor);
        const strValue = String(value ?? '');
        return strValue.includes(',') ? `"${strValue}"` : strValue;
      })
      .join(',')
  );
  
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportToJson<T>(data: T[], filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================================
// COMPONENT
// ============================================================

function DataGrid<T extends Record<string, any>>({
  data,
  columns,
  rowKey,
  sortable = true,
  defaultSort,
  onSortChange,
  filterable = false,
  filters: externalFilters,
  onFilterChange,
  pagination = true,
  pageSize: defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  serverSidePagination = false,
  totalRows: externalTotalRows,
  selectable = false,
  selectionMode = 'multiple',
  selectedRows: externalSelectedRows,
  onSelectionChange,
  onRowClick,
  onRowDoubleClick,
  onRowContextMenu,
  onColumnResize,
  onColumnReorder,
  loading = false,
  loadingComponent,
  emptyComponent,
  className,
  headerClassName,
  bodyClassName,
  rowClassName,
  cellClassName,
  stickyHeader = true,
  virtualized = false,
  rowHeight = 48,
  headerHeight = 48,
  expandable = false,
  expandedRowRender,
  expandedRows: externalExpandedRows,
  onExpandedChange,
  groupBy,
  groupHeaderRender,
  exportable = false,
  onExport,
}: DataGridProps<T>): JSX.Element {
  // State
  const [sort, setSort] = useState<SortState | null>(defaultSort || null);
  const [internalFilters, setInternalFilters] = useState<FilterState[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [internalSelectedRows, setInternalSelectedRows] = useState<Set<string | number>>(new Set());
  const [internalExpandedRows, setInternalExpandedRows] = useState<Set<string | number>>(new Set());
  const [columnWidths, setColumnWidths] = useState<Map<string, number>>(new Map());
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  
  const tableRef = useRef<HTMLTableElement>(null);
  const resizeStartX = useRef<number>(0);
  const resizeStartWidth = useRef<number>(0);
  
  // Derived state
  const filters = externalFilters ?? internalFilters;
  const selectedRows = externalSelectedRows
    ? new Set(externalSelectedRows)
    : internalSelectedRows;
  const expandedRows = externalExpandedRows
    ? new Set(externalExpandedRows)
    : internalExpandedRows;
  
  // Visible columns
  const visibleColumns = useMemo(
    () => columns.filter((col) => !col.hidden),
    [columns]
  );
  
  // Process data
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Apply filters
    if (filters.length > 0) {
      result = result.filter((row) =>
        filters.every((filter) => applyFilter(row, filter, columns))
      );
    }
    
    // Apply sorting
    if (sort && sort.direction) {
      const column = columns.find((c) => c.id === sort.columnId);
      if (column) {
        result.sort((a, b) => {
          const aValue = getValue(a, column.accessor);
          const bValue = getValue(b, column.accessor);
          return compareValues(aValue, bValue, sort.direction);
        });
      }
    }
    
    return result;
  }, [data, filters, sort, columns]);
  
  // Grouped data
  const groupedData = useMemo(() => {
    if (!groupBy) return null;
    
    const groups = new Map<any, T[]>();
    processedData.forEach((row) => {
      const groupValue = row[groupBy];
      const group = groups.get(groupValue) || [];
      group.push(row);
      groups.set(groupValue, group);
    });
    
    return groups;
  }, [processedData, groupBy]);
  
  // Paginated data
  const paginatedData = useMemo(() => {
    if (!pagination || serverSidePagination) return processedData;
    
    const startIndex = (page - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, pagination, serverSidePagination, page, pageSize]);
  
  // Pagination info
  const totalRows = serverSidePagination
    ? externalTotalRows || 0
    : processedData.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  
  // Handlers
  const handleSort = useCallback((columnId: string) => {
    const column = columns.find((c) => c.id === columnId);
    if (!column || column.sortable === false) return;
    
    setSort((prev) => {
      let newSort: SortState | null;
      if (prev?.columnId === columnId) {
        if (prev.direction === 'asc') {
          newSort = { columnId, direction: 'desc' };
        } else if (prev.direction === 'desc') {
          newSort = null;
        } else {
          newSort = { columnId, direction: 'asc' };
        }
      } else {
        newSort = { columnId, direction: 'asc' };
      }
      
      onSortChange?.(newSort);
      return newSort;
    });
  }, [columns, onSortChange]);
  
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    onPageChange?.(newPage, pageSize);
  }, [pageSize, onPageChange]);
  
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
    onPageChange?.(1, newPageSize);
  }, [onPageChange]);
  
  const handleRowSelect = useCallback((key: string | number) => {
    if (selectionMode === 'single') {
      const newSelection = new Set([key]);
      setInternalSelectedRows(newSelection);
      onSelectionChange?.([key]);
    } else {
      setInternalSelectedRows((prev) => {
        const newSelection = new Set(prev);
        if (newSelection.has(key)) {
          newSelection.delete(key);
        } else {
          newSelection.add(key);
        }
        onSelectionChange?.(Array.from(newSelection));
        return newSelection;
      });
    }
  }, [selectionMode, onSelectionChange]);
  
  const handleSelectAll = useCallback(() => {
    const allKeys = paginatedData.map((row) => getRowKey(row, rowKey));
    const allSelected = allKeys.every((key) => selectedRows.has(key));
    
    if (allSelected) {
      setInternalSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const newSelection = new Set(allKeys);
      setInternalSelectedRows(newSelection);
      onSelectionChange?.(allKeys);
    }
  }, [paginatedData, rowKey, selectedRows, onSelectionChange]);
  
  const handleExpandRow = useCallback((key: string | number) => {
    setInternalExpandedRows((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(key)) {
        newExpanded.delete(key);
      } else {
        newExpanded.add(key);
      }
      onExpandedChange?.(Array.from(newExpanded));
      return newExpanded;
    });
  }, [onExpandedChange]);
  
  const handleRemoveFilter = useCallback((index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    setInternalFilters(newFilters);
    onFilterChange?.(newFilters);
  }, [filters, onFilterChange]);
  
  const handleExport = useCallback((format: 'csv' | 'json' | 'xlsx') => {
    if (onExport) {
      onExport(format);
    } else if (format === 'csv') {
      exportToCsv(processedData, columns, 'export');
    } else if (format === 'json') {
      exportToJson(processedData, 'export');
    }
  }, [processedData, columns, onExport]);
  
  // Column resize handlers
  const handleResizeStart = useCallback((e: React.MouseEvent, columnId: string) => {
    e.preventDefault();
    setResizingColumn(columnId);
    resizeStartX.current = e.clientX;
    resizeStartWidth.current = columnWidths.get(columnId) || 150;
    
    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - resizeStartX.current;
      const newWidth = Math.max(50, resizeStartWidth.current + diff);
      setColumnWidths((prev) => new Map(prev).set(columnId, newWidth));
    };
    
    const handleMouseUp = () => {
      setResizingColumn(null);
      const finalWidth = columnWidths.get(columnId) || resizeStartWidth.current;
      onColumnResize?.(columnId, finalWidth);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [columnWidths, onColumnResize]);
  
  // Render helpers
  const renderSortIcon = (columnId: string): ReactNode => {
    if (sort?.columnId !== columnId) return <span style={styles.sortIcon}>⇅</span>;
    if (sort.direction === 'asc') return <span style={styles.sortIcon}>↑</span>;
    if (sort.direction === 'desc') return <span style={styles.sortIcon}>↓</span>;
    return <span style={styles.sortIcon}>⇅</span>;
  };
  
  const renderHeaderCell = (column: ColumnDef<T>): ReactNode => {
    const isSortable = sortable && column.sortable !== false;
    const width = columnWidths.get(column.id) || column.width;
    
    return (
      <th
        key={column.id}
        style={{
          ...styles.th,
          ...(isSortable && styles.thSortable),
          width,
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
          textAlign: column.headerAlign || column.align || 'left',
        }}
        className={column.headerClassName}
        onClick={isSortable ? () => handleSort(column.id) : undefined}
      >
        {column.header_cell ? column.header_cell() : column.header}
        {isSortable && renderSortIcon(column.id)}
        {column.resizable !== false && (
          <div
            style={{
              ...styles.resizeHandle,
              ...(resizingColumn === column.id && styles.resizeHandleActive),
            }}
            onMouseDown={(e) => handleResizeStart(e, column.id)}
          />
        )}
      </th>
    );
  };
  
  const renderCell = (row: T, column: ColumnDef<T>, rowIndex: number): ReactNode => {
    const value = getValue(row, column.accessor);
    const content = column.cell ? column.cell(value, row, rowIndex) : value;
    
    return (
      <td
        key={column.id}
        style={{
          ...styles.td,
          textAlign: column.align || 'left',
        }}
        className={`${cellClassName || ''} ${column.className || ''}`}
      >
        {content}
      </td>
    );
  };
  
  const renderRow = (row: T, index: number): ReactNode => {
    const key = getRowKey(row, rowKey);
    const isSelected = selectedRows.has(key);
    const isExpanded = expandedRows.has(key);
    const isHovered = hoveredRow === index;
    
    const rowStyle = {
      ...styles.tr,
      ...(isHovered && styles.trHover),
      ...(isSelected && styles.trSelected),
      ...(isExpanded && styles.trExpanded),
    };
    
    const computedRowClassName = typeof rowClassName === 'function'
      ? rowClassName(row, index)
      : rowClassName || '';
    
    return (
      <React.Fragment key={key}>
        <tr
          style={rowStyle}
          className={computedRowClassName}
          onMouseEnter={() => setHoveredRow(index)}
          onMouseLeave={() => setHoveredRow(null)}
          onClick={() => onRowClick?.(row, index)}
          onDoubleClick={() => onRowDoubleClick?.(row, index)}
          onContextMenu={(e) => onRowContextMenu?.(row, index, e)}
        >
          {selectable && (
            <td style={styles.td}>
              <input
                type={selectionMode === 'single' ? 'radio' : 'checkbox'}
                style={styles.checkbox}
                checked={isSelected}
                onChange={() => handleRowSelect(key)}
                onClick={(e) => e.stopPropagation()}
              />
            </td>
          )}
          {expandable && (
            <td style={styles.td}>
              <button
                style={{
                  ...styles.expandButton,
                  transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpandRow(key);
                }}
              >
                ▶
              </button>
            </td>
          )}
          {visibleColumns.map((column) => renderCell(row, column, index))}
        </tr>
        {expandable && isExpanded && expandedRowRender && (
          <tr>
            <td
              colSpan={visibleColumns.length + (selectable ? 1 : 0) + 1}
              style={styles.expandedContent}
            >
              {expandedRowRender(row)}
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };
  
  const renderPagination = (): ReactNode => {
    if (!pagination) return null;
    
    const startRow = (page - 1) * pageSize + 1;
    const endRow = Math.min(page * pageSize, totalRows);
    
    return (
      <div style={styles.pagination}>
        <div style={styles.paginationInfo}>
          Showing {startRow} to {endRow} of {totalRows} entries
        </div>
        <div style={styles.paginationControls}>
          <select
            style={styles.pageSizeSelect}
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
          <button
            style={{
              ...styles.paginationButton,
              ...(page === 1 && styles.paginationButtonDisabled),
            }}
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
          >
            ⟪
          </button>
          <button
            style={{
              ...styles.paginationButton,
              ...(page === 1 && styles.paginationButtonDisabled),
            }}
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            ⟨
          </button>
          <span style={{ padding: '0 12px' }}>
            Page {page} of {totalPages}
          </span>
          <button
            style={{
              ...styles.paginationButton,
              ...(page === totalPages && styles.paginationButtonDisabled),
            }}
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            ⟩
          </button>
          <button
            style={{
              ...styles.paginationButton,
              ...(page === totalPages && styles.paginationButtonDisabled),
            }}
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages}
          >
            ⟫
          </button>
        </div>
      </div>
    );
  };
  
  // Loading state
  if (loading) {
    return (
      <div style={{ ...styles.container, ...{ className } }}>
        <div style={styles.loading}>
          {loadingComponent || (
            <>
              <span style={{ marginRight: '8px' }}>⟳</span>
              Loading...
            </>
          )}
        </div>
      </div>
    );
  }
  
  // Empty state
  if (paginatedData.length === 0) {
    return (
      <div style={{ ...styles.container, ...{ className } }}>
        {emptyComponent || (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📭</div>
            <div style={styles.emptyText}>No data available</div>
            <div style={styles.emptySubtext}>
              Try adjusting your filters or search criteria
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div style={styles.container} className={className}>
      {/* Toolbar */}
      {(exportable || filters.length > 0) && (
        <div style={styles.toolbar}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {filters.map((filter, index) => (
              <div key={index} style={styles.filterChip}>
                <span>{filter.columnId}: {filter.value}</span>
                <button
                  style={styles.filterChipRemove}
                  onClick={() => handleRemoveFilter(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {exportable && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={styles.paginationButton}
                onClick={() => handleExport('csv')}
              >
                Export CSV
              </button>
              <button
                style={styles.paginationButton}
                onClick={() => handleExport('json')}
              >
                Export JSON
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Table */}
      <div style={styles.tableWrapper}>
        <table ref={tableRef} style={styles.table}>
          <thead style={{ ...styles.thead, ...(stickyHeader && { position: 'sticky', top: 0 }) }} className={headerClassName}>
            <tr>
              {selectable && (
                <th style={{ ...styles.th, width: 50 }}>
                  {selectionMode === 'multiple' && (
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={
                        paginatedData.length > 0 &&
                        paginatedData.every((row) => selectedRows.has(getRowKey(row, rowKey)))
                      }
                      onChange={handleSelectAll}
                    />
                  )}
                </th>
              )}
              {expandable && <th style={{ ...styles.th, width: 50 }} />}
              {visibleColumns.map(renderHeaderCell)}
            </tr>
          </thead>
          <tbody style={styles.tbody} className={bodyClassName}>
            {paginatedData.map((row, index) => renderRow(row, index))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  ColumnDef,
  SortDirection,
  FilterOperator,
  ColumnType,
  SortState,
  FilterState,
  PaginationState,
  SelectionState,
  DataGridProps,
};

export { DataGrid, exportToCsv, exportToJson };
export default DataGrid;
