// CHE·NU™ DataGrid Component
// Advanced data grid with sorting, filtering, pagination, selection

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  createContext,
  useContext,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type SortDirection = 'asc' | 'desc' | null;
type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'in';
type ColumnAlign = 'left' | 'center' | 'right';
type SelectionMode = 'none' | 'single' | 'multiple';

interface Column<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => any);
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  align?: ColumnAlign;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  frozen?: 'left' | 'right';
  hidden?: boolean;
  Cell?: React.ComponentType<CellProps<T>>;
  Header?: React.ComponentType<HeaderProps<T>>;
  Footer?: React.ComponentType<FooterProps<T>>;
  filterType?: 'text' | 'number' | 'date' | 'select' | 'boolean';
  filterOptions?: { label: string; value: unknown }[];
  aggregate?: 'sum' | 'avg' | 'min' | 'max' | 'count';
}

interface CellProps<T> {
  value: unknown;
  row: T;
  rowIndex: number;
  column: Column<T>;
}

interface HeaderProps<T> {
  column: Column<T>;
  sortDirection: SortDirection;
  onSort: () => void;
}

interface FooterProps<T> {
  column: Column<T>;
  data: T[];
  aggregateValue?: unknown;
}

interface SortState {
  columnId: string;
  direction: SortDirection;
}

interface FilterState {
  columnId: string;
  operator: FilterOperator;
  value: unknown;
  value2?: unknown; // For 'between' operator
}

interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

interface DataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  
  // Sorting
  sortable?: boolean;
  defaultSort?: SortState;
  onSort?: (sort: SortState | null) => void;
  
  // Filtering
  filterable?: boolean;
  filters?: FilterState[];
  onFilter?: (filters: FilterState[]) => void;
  
  // Pagination
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  
  // Selection
  selectionMode?: SelectionMode;
  selectedKeys?: unknown[];
  onSelectionChange?: (keys: unknown[]) => void;
  
  // Row actions
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
  rowClassName?: string | ((row: T, index: number) => string);
  
  // Appearance
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  height?: number | string;
  emptyMessage?: string;
  loading?: boolean;
  
  // Column features
  columnResizing?: boolean;
  columnReordering?: boolean;
  onColumnResize?: (columnId: string, width: number) => void;
  onColumnReorder?: (columns: Column<T>[]) => void;
  
  // Virtualization
  virtualized?: boolean;
  rowHeight?: number;
  overscan?: number;
  
  // Export
  exportable?: boolean;
  onExport?: (format: 'csv' | 'json' | 'xlsx') => void;
  
  // Grouping
  groupBy?: keyof T;
  expandedGroups?: unknown[];
  onGroupExpand?: (groupKey: unknown) => void;
  
  // Custom rendering
  renderRowActions?: (row: T) => React.ReactNode;
  renderToolbar?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
}

interface DataGridContextValue<T> {
  data: T[];
  columns: Column<T>[];
  sortState: SortState | null;
  filterStates: FilterState[];
  paginationState: PaginationState;
  selectedKeys: Set<any>;
  setSort: (sort: SortState | null) => void;
  setFilters: (filters: FilterState[]) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  toggleSelection: (key: unknown) => void;
  selectAll: () => void;
  deselectAll: () => void;
}

// ============================================================
// CONTEXT
// ============================================================

const DataGridContext = createContext<DataGridContextValue<any> | null>(null);

function useDataGridContext<T>(): DataGridContextValue<T> {
  const context = useContext(DataGridContext);
  if (!context) {
    throw new Error('useDataGridContext must be used within DataGrid');
  }
  return context;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function getCellValue<T>(row: T, accessor: keyof T | ((row: T) => any)): unknown {
  if (typeof accessor === 'function') {
    return accessor(row);
  }
  return row[accessor];
}

function compareValues(a: unknown, b: unknown, direction: 'asc' | 'desc'): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;
  
  const comparison = a < b ? -1 : 1;
  return direction === 'asc' ? comparison : -comparison;
}

function matchesFilter<T>(row: T, filter: FilterState, columns: Column<T>[]): boolean {
  const column = columns.find((c) => c.id === filter.columnId);
  if (!column) return true;
  
  const value = getCellValue(row, column.accessor);
  const filterValue = filter.value;
  
  switch (filter.operator) {
    case 'equals':
      return value === filterValue;
    case 'contains':
      return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
    case 'startsWith':
      return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
    case 'endsWith':
      return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
    case 'gt':
      return value > filterValue;
    case 'gte':
      return value >= filterValue;
    case 'lt':
      return value < filterValue;
    case 'lte':
      return value <= filterValue;
    case 'between':
      return value >= filterValue && value <= filter.value2;
    case 'in':
      return Array.isArray(filterValue) && filterValue.includes(value);
    default:
      return true;
  }
}

function calculateAggregate<T>(data: T[], column: Column<T>): unknown {
  if (!column.aggregate || data.length === 0) return null;
  
  const values = data
    .map((row) => getCellValue(row, column.accessor))
    .filter((v) => v !== null && v !== undefined && !isNaN(Number(v)))
    .map(Number);
  
  if (values.length === 0) return null;
  
  switch (column.aggregate) {
    case 'sum':
      return values.reduce((a, b) => a + b, 0);
    case 'avg':
      return values.reduce((a, b) => a + b, 0) / values.length;
    case 'min':
      return Math.min(...values);
    case 'max':
      return Math.max(...values);
    case 'count':
      return values.length;
    default:
      return null;
  }
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
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '14px',
    color: BRAND.uiSlate,
  },
  
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: `1px solid ${BRAND.ancientStone}33`,
    backgroundColor: BRAND.softSand,
  },
  
  tableWrapper: {
    overflow: 'auto',
    position: 'relative' as const,
  },
  
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    tableLayout: 'fixed' as const,
  },
  
  thead: {
    backgroundColor: BRAND.uiSlate,
    color: BRAND.softSand,
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
  },
  
  th: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontWeight: 600,
    borderBottom: `2px solid ${BRAND.sacredGold}`,
    userSelect: 'none' as const,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  
  thSortable: {
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  
  thResizer: {
    position: 'absolute' as const,
    right: 0,
    top: 0,
    height: '100%',
    width: '5px',
    cursor: 'col-resize',
    backgroundColor: 'transparent',
  },
  
  tbody: {
    backgroundColor: '#fff',
  },
  
  tr: {
    borderBottom: `1px solid ${BRAND.ancientStone}22`,
    transition: 'background-color 0.15s',
  },
  
  trHoverable: {
    cursor: 'pointer',
  },
  
  trStriped: {
    backgroundColor: `${BRAND.softSand}66`,
  },
  
  trSelected: {
    backgroundColor: `${BRAND.cenoteTurquoise}22`,
  },
  
  td: {
    padding: '12px 16px',
    verticalAlign: 'middle',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  
  tdCompact: {
    padding: '8px 12px',
  },
  
  tfoot: {
    backgroundColor: BRAND.softSand,
    fontWeight: 600,
    borderTop: `2px solid ${BRAND.ancientStone}`,
  },
  
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: BRAND.jungleEmerald,
  },
  
  sortIcon: {
    marginLeft: '8px',
    opacity: 0.7,
  },
  
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderTop: `1px solid ${BRAND.ancientStone}33`,
    backgroundColor: BRAND.softSand,
  },
  
  paginationInfo: {
    color: BRAND.ancientStone,
    fontSize: '13px',
  },
  
  paginationButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  
  pageButton: {
    padding: '6px 12px',
    border: `1px solid ${BRAND.ancientStone}44`,
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '13px',
  },
  
  pageButtonActive: {
    backgroundColor: BRAND.jungleEmerald,
    color: '#fff',
    borderColor: BRAND.jungleEmerald,
  },
  
  pageButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  
  pageSizeSelect: {
    padding: '6px 8px',
    border: `1px solid ${BRAND.ancientStone}44`,
    borderRadius: '4px',
    backgroundColor: '#fff',
    fontSize: '13px',
  },
  
  filterInput: {
    padding: '6px 10px',
    border: `1px solid ${BRAND.ancientStone}44`,
    borderRadius: '4px',
    fontSize: '13px',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  
  emptyState: {
    padding: '48px 24px',
    textAlign: 'center' as const,
    color: BRAND.ancientStone,
    backgroundColor: BRAND.softSand,
  },
  
  loadingOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  
  spinner: {
    width: '40px',
    height: '40px',
    border: `3px solid ${BRAND.ancientStone}33`,
    borderTopColor: BRAND.jungleEmerald,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  groupRow: {
    backgroundColor: BRAND.uiSlate,
    color: BRAND.softSand,
    fontWeight: 600,
    cursor: 'pointer',
  },
  
  expandIcon: {
    marginRight: '8px',
    transition: 'transform 0.2s',
  },
  
  expandIconExpanded: {
    transform: 'rotate(90deg)',
  },
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

interface CheckboxCellProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}

const CheckboxCell: React.FC<CheckboxCellProps> = ({
  checked,
  indeterminate,
  onChange,
}) => {
  const ref = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);
  
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      style={styles.checkbox}
      onClick={(e) => e.stopPropagation()}
    />
  );
};

interface SortIconProps {
  direction: SortDirection;
}

const SortIcon: React.FC<SortIconProps> = ({ direction }) => {
  if (!direction) {
    return (
      <span style={{ ...styles.sortIcon, opacity: 0.3 }}>↕</span>
    );
  }
  return (
    <span style={styles.sortIcon}>
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  );
};

interface FilterPopoverProps {
  column: Column<any>;
  value: FilterState | undefined;
  onChange: (filter: FilterState | null) => void;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({
  column,
  value,
  onChange,
}) => {
  const [localValue, setLocalValue] = useState(value?.value || '');
  const [operator, setOperator] = useState<FilterOperator>(value?.operator || 'contains');
  
  const handleApply = () => {
    if (!localValue) {
      onChange(null);
    } else {
      onChange({
        columnId: column.id,
        operator,
        value: localValue,
      });
    }
  };
  
  const handleClear = () => {
    setLocalValue('');
    onChange(null);
  };
  
  return (
    <div style={{ padding: '12px', minWidth: '200px' }}>
      <div style={{ marginBottom: '8px' }}>
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value as FilterOperator)}
          style={{ ...styles.pageSizeSelect, width: '100%', marginBottom: '8px' }}
        >
          <option value="contains">Contains</option>
          <option value="equals">Equals</option>
          <option value="startsWith">Starts with</option>
          <option value="endsWith">Ends with</option>
          {column.filterType === 'number' && (
            <>
              <option value="gt">Greater than</option>
              <option value="gte">Greater or equal</option>
              <option value="lt">Less than</option>
              <option value="lte">Less or equal</option>
            </>
          )}
        </select>
      </div>
      <input
        type={column.filterType === 'number' ? 'number' : 'text'}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={`Filter ${column.header}...`}
        style={styles.filterInput}
        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
      />
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button
          onClick={handleClear}
          style={{ ...styles.pageButton, flex: 1 }}
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          style={{ ...styles.pageButton, ...styles.pageButtonActive, flex: 1 }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

function DataGrid<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  
  sortable = true,
  defaultSort,
  onSort,
  
  filterable = false,
  filters: controlledFilters,
  onFilter,
  
  pagination = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  
  selectionMode = 'none',
  selectedKeys: controlledSelectedKeys,
  onSelectionChange,
  
  onRowClick,
  onRowDoubleClick,
  rowClassName,
  
  striped = true,
  bordered = false,
  hoverable = true,
  compact = false,
  stickyHeader = true,
  height,
  emptyMessage = 'No data available',
  loading = false,
  
  columnResizing = false,
  columnReordering = false,
  onColumnResize,
  onColumnReorder,
  
  virtualized = false,
  rowHeight = 48,
  overscan = 5,
  
  exportable = false,
  onExport,
  
  groupBy,
  expandedGroups: controlledExpandedGroups,
  onGroupExpand,
  
  renderRowActions,
  renderToolbar,
  renderFooter,
}: DataGridProps<T>): React.ReactElement {
  // State
  const [sortState, setSortState] = useState<SortState | null>(defaultSort || null);
  const [filterStates, setFilterStates] = useState<FilterState[]>(controlledFilters || []);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selectedKeys, setSelectedKeys] = useState<Set<any>>(
    new Set(controlledSelectedKeys || [])
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<any>>(
    new Set(controlledExpandedGroups || [])
  );
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  
  const tableRef = useRef<HTMLTableElement>(null);
  
  // Filter visible columns
  const visibleColumns = useMemo(
    () => columns.filter((col) => !col.hidden),
    [columns]
  );
  
  // Apply filters
  const filteredData = useMemo(() => {
    if (filterStates.length === 0) return data;
    return data.filter((row) =>
      filterStates.every((filter) => matchesFilter(row, filter, columns))
    );
  }, [data, filterStates, columns]);
  
  // Apply sorting
  const sortedData = useMemo(() => {
    if (!sortState || !sortState.direction) return filteredData;
    
    const column = columns.find((c) => c.id === sortState.columnId);
    if (!column) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const valueA = getCellValue(a, column.accessor);
      const valueB = getCellValue(b, column.accessor);
      return compareValues(valueA, valueB, sortState.direction!);
    });
  }, [filteredData, sortState, columns]);
  
  // Apply pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pagination, page, pageSize]);
  
  // Pagination info
  const paginationState: PaginationState = useMemo(() => ({
    page,
    pageSize,
    totalItems: sortedData.length,
    totalPages: Math.ceil(sortedData.length / pageSize),
  }), [page, pageSize, sortedData.length]);
  
  // Handlers
  const handleSort = useCallback((columnId: string) => {
    setSortState((prev) => {
      let newSort: SortState | null;
      
      if (!prev || prev.columnId !== columnId) {
        newSort = { columnId, direction: 'asc' };
      } else if (prev.direction === 'asc') {
        newSort = { columnId, direction: 'desc' };
      } else {
        newSort = null;
      }
      
      onSort?.(newSort);
      return newSort;
    });
  }, [onSort]);
  
  const handleFilterChange = useCallback((filter: FilterState | null) => {
    setFilterStates((prev) => {
      let newFilters: FilterState[];
      
      if (!filter) {
        newFilters = prev.filter((f) => f.columnId !== filter?.columnId);
      } else {
        const existing = prev.findIndex((f) => f.columnId === filter.columnId);
        if (existing >= 0) {
          newFilters = [...prev];
          newFilters[existing] = filter;
        } else {
          newFilters = [...prev, filter];
        }
      }
      
      onFilter?.(newFilters);
      return newFilters;
    });
    setPage(1);
  }, [onFilter]);
  
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    onPageChange?.(newPage);
  }, [onPageChange]);
  
  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
    onPageSizeChange?.(newSize);
  }, [onPageSizeChange]);
  
  const toggleSelection = useCallback((key: unknown) => {
    setSelectedKeys((prev) => {
      const newSet = new Set(prev);
      
      if (selectionMode === 'single') {
        if (newSet.has(key)) {
          newSet.clear();
        } else {
          newSet.clear();
          newSet.add(key);
        }
      } else {
        if (newSet.has(key)) {
          newSet.delete(key);
        } else {
          newSet.add(key);
        }
      }
      
      onSelectionChange?.(Array.from(newSet));
      return newSet;
    });
  }, [selectionMode, onSelectionChange]);
  
  const selectAll = useCallback(() => {
    const allKeys = paginatedData.map((row) => row[keyField]);
    setSelectedKeys(new Set(allKeys));
    onSelectionChange?.(allKeys);
  }, [paginatedData, keyField, onSelectionChange]);
  
  const deselectAll = useCallback(() => {
    setSelectedKeys(new Set());
    onSelectionChange?.([]);
  }, [onSelectionChange]);
  
  const isAllSelected = useMemo(() => {
    if (paginatedData.length === 0) return false;
    return paginatedData.every((row) => selectedKeys.has(row[keyField]));
  }, [paginatedData, selectedKeys, keyField]);
  
  const isSomeSelected = useMemo(() => {
    return paginatedData.some((row) => selectedKeys.has(row[keyField])) && !isAllSelected;
  }, [paginatedData, selectedKeys, keyField, isAllSelected]);
  
  // Column resize handlers
  const handleResizeStart = useCallback((columnId: string) => {
    setResizingColumn(columnId);
  }, []);
  
  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizingColumn || !tableRef.current) return;
    
    const th = tableRef.current.querySelector(`[data-column-id="${resizingColumn}"]`);
    if (th) {
      const rect = th.getBoundingClientRect();
      const newWidth = Math.max(50, e.clientX - rect.left);
      setColumnWidths((prev) => ({ ...prev, [resizingColumn]: newWidth }));
      onColumnResize?.(resizingColumn, newWidth);
    }
  }, [resizingColumn, onColumnResize]);
  
  const handleResizeEnd = useCallback(() => {
    setResizingColumn(null);
  }, []);
  
  useEffect(() => {
    if (resizingColumn) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizingColumn, handleResizeMove, handleResizeEnd]);
  
  // Get row class
  const getRowClassName = useCallback((row: T, index: number): string => {
    let classes: string[] = [];
    
    if (typeof rowClassName === 'function') {
      classes.push(rowClassName(row, index));
    } else if (rowClassName) {
      classes.push(rowClassName);
    }
    
    return classes.join(' ');
  }, [rowClassName]);
  
  // Context value
  const contextValue: DataGridContextValue<T> = {
    data: paginatedData,
    columns: visibleColumns,
    sortState,
    filterStates,
    paginationState,
    selectedKeys,
    setSort: (sort) => {
      setSortState(sort);
      onSort?.(sort);
    },
    setFilters: (filters) => {
      setFilterStates(filters);
      onFilter?.(filters);
    },
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    toggleSelection,
    selectAll,
    deselectAll,
  };
  
  // Render pagination controls
  const renderPagination = () => {
    if (!pagination) return null;
    
    const { page: currentPage, pageSize: size, totalItems, totalPages } = paginationState;
    const start = (currentPage - 1) * size + 1;
    const end = Math.min(currentPage * size, totalItems);
    
    return (
      <div style={styles.pagination}>
        <div style={styles.paginationInfo}>
          Showing {start} to {end} of {totalItems} entries
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <select
              value={size}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              style={styles.pageSizeSelect}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} per page
                </option>
              ))}
            </select>
          </div>
          
          <div style={styles.paginationButtons}>
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              style={{
                ...styles.pageButton,
                ...(currentPage === 1 ? styles.pageButtonDisabled : {}),
              }}
            >
              ««
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                ...styles.pageButton,
                ...(currentPage === 1 ? styles.pageButtonDisabled : {}),
              }}
            >
              «
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  style={{
                    ...styles.pageButton,
                    ...(currentPage === pageNum ? styles.pageButtonActive : {}),
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                ...styles.pageButton,
                ...(currentPage === totalPages ? styles.pageButtonDisabled : {}),
              }}
            >
              »
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              style={{
                ...styles.pageButton,
                ...(currentPage === totalPages ? styles.pageButtonDisabled : {}),
              }}
            >
              »»
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <DataGridContext.Provider value={contextValue}>
      <div style={styles.container}>
        {/* Toolbar */}
        {renderToolbar && (
          <div style={styles.toolbar}>
            {renderToolbar()}
          </div>
        )}
        
        {/* Table */}
        <div
          style={{
            ...styles.tableWrapper,
            ...(height ? { height, maxHeight: height } : {}),
          }}
        >
          {loading && (
            <div style={styles.loadingOverlay}>
              <div style={styles.spinner} />
            </div>
          )}
          
          <table ref={tableRef} style={styles.table}>
            <thead style={stickyHeader ? styles.thead : {}}>
              <tr>
                {/* Selection checkbox column */}
                {selectionMode !== 'none' && (
                  <th style={{ ...styles.th, width: '48px' }}>
                    {selectionMode === 'multiple' && (
                      <CheckboxCell
                        checked={isAllSelected}
                        indeterminate={isSomeSelected}
                        onChange={isAllSelected ? deselectAll : selectAll}
                      />
                    )}
                  </th>
                )}
                
                {/* Data columns */}
                {visibleColumns.map((column) => {
                  const isSorted = sortState?.columnId === column.id;
                  const width = columnWidths[column.id] || column.width;
                  
                  return (
                    <th
                      key={column.id}
                      data-column-id={column.id}
                      onClick={() => sortable && column.sortable !== false && handleSort(column.id)}
                      style={{
                        ...styles.th,
                        ...(sortable && column.sortable !== false ? styles.thSortable : {}),
                        width: width || 'auto',
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth,
                        textAlign: column.align || 'left',
                        position: 'relative',
                      }}
                    >
                      {column.Header ? (
                        <column.Header
                          column={column}
                          sortDirection={isSorted ? sortState!.direction : null}
                          onSort={() => handleSort(column.id)}
                        />
                      ) : (
                        <>
                          {column.header}
                          {sortable && column.sortable !== false && (
                            <SortIcon direction={isSorted ? sortState!.direction : null} />
                          )}
                        </>
                      )}
                      
                      {columnResizing && column.resizable !== false && (
                        <div
                          style={styles.thResizer}
                          onMouseDown={() => handleResizeStart(column.id)}
                        />
                      )}
                    </th>
                  );
                })}
                
                {/* Actions column */}
                {renderRowActions && (
                  <th style={{ ...styles.th, width: '100px' }}>Actions</th>
                )}
              </tr>
            </thead>
            
            <tbody style={styles.tbody}>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length + (selectionMode !== 'none' ? 1 : 0) + (renderRowActions ? 1 : 0)}
                    style={styles.emptyState}
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => {
                  const key = row[keyField];
                  const isSelected = selectedKeys.has(key);
                  const actualIndex = (page - 1) * pageSize + rowIndex;
                  
                  return (
                    <tr
                      key={key}
                      onClick={() => onRowClick?.(row, actualIndex)}
                      onDoubleClick={() => onRowDoubleClick?.(row, actualIndex)}
                      className={getRowClassName(row, actualIndex)}
                      style={{
                        ...styles.tr,
                        ...(hoverable ? styles.trHoverable : {}),
                        ...(striped && rowIndex % 2 === 1 ? styles.trStriped : {}),
                        ...(isSelected ? styles.trSelected : {}),
                      }}
                    >
                      {/* Selection checkbox */}
                      {selectionMode !== 'none' && (
                        <td style={{ ...styles.td, ...(compact ? styles.tdCompact : {}) }}>
                          <CheckboxCell
                            checked={isSelected}
                            onChange={() => toggleSelection(key)}
                          />
                        </td>
                      )}
                      
                      {/* Data cells */}
                      {visibleColumns.map((column) => {
                        const value = getCellValue(row, column.accessor);
                        
                        return (
                          <td
                            key={column.id}
                            style={{
                              ...styles.td,
                              ...(compact ? styles.tdCompact : {}),
                              textAlign: column.align || 'left',
                            }}
                          >
                            {column.Cell ? (
                              <column.Cell
                                value={value}
                                row={row}
                                rowIndex={actualIndex}
                                column={column}
                              />
                            ) : (
                              String(value ?? '')
                            )}
                          </td>
                        );
                      })}
                      
                      {/* Actions */}
                      {renderRowActions && (
                        <td style={{ ...styles.td, ...(compact ? styles.tdCompact : {}) }}>
                          {renderRowActions(row)}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
            
            {/* Footer with aggregates */}
            {visibleColumns.some((c) => c.aggregate) && (
              <tfoot style={styles.tfoot}>
                <tr>
                  {selectionMode !== 'none' && <td style={styles.td} />}
                  {visibleColumns.map((column) => (
                    <td
                      key={column.id}
                      style={{
                        ...styles.td,
                        textAlign: column.align || 'left',
                      }}
                    >
                      {column.Footer ? (
                        <column.Footer
                          column={column}
                          data={sortedData}
                          aggregateValue={calculateAggregate(sortedData, column)}
                        />
                      ) : column.aggregate ? (
                        calculateAggregate(sortedData, column)?.toLocaleString()
                      ) : null}
                    </td>
                  ))}
                  {renderRowActions && <td style={styles.td} />}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        
        {/* Pagination */}
        {renderPagination()}
        
        {/* Custom footer */}
        {renderFooter && renderFooter()}
      </div>
    </DataGridContext.Provider>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  Column,
  CellProps,
  HeaderProps,
  FooterProps,
  SortState,
  FilterState,
  PaginationState,
  DataGridProps,
  SortDirection,
  FilterOperator,
  ColumnAlign,
  SelectionMode,
};

export { DataGrid, useDataGridContext, getCellValue, calculateAggregate };

export default DataGrid;
