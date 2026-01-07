// CHE·NU™ Data Table Component
// Comprehensive table with sorting, filtering, pagination, and selection

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  ReactNode,
  CSSProperties,
  ChangeEvent,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type SortDirection = 'asc' | 'desc' | null;
type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte' | 'between' | 'in';
type ColumnAlign = 'left' | 'center' | 'right';
type SelectionMode = 'none' | 'single' | 'multiple';
type TableSize = 'sm' | 'md' | 'lg';
type TableVariant = 'default' | 'striped' | 'bordered';

interface ColumnDef<T> {
  id: string;
  header: string | ReactNode;
  accessor: keyof T | ((row: T) => any);
  cell?: (value: unknown, row: T, index: number) => ReactNode;
  footer?: string | ReactNode | ((rows: T[]) => ReactNode);
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  align?: ColumnAlign;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: 'text' | 'number' | 'date' | 'select' | 'boolean';
  filterOptions?: { value: unknown; label: string }[];
  resizable?: boolean;
  hidden?: boolean;
  sticky?: 'left' | 'right';
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
}

interface SortState {
  column: string;
  direction: SortDirection;
}

interface FilterState {
  column: string;
  operator: FilterOperator;
  value: unknown;
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyField: keyof T;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string | ReactNode;
  size?: TableSize;
  variant?: TableVariant;
  selectionMode?: SelectionMode;
  selectedRows?: T[keyof T][];
  onSelectionChange?: (selectedIds: T[keyof T][]) => void;
  sortable?: boolean;
  defaultSort?: SortState;
  onSort?: (sort: SortState | null) => void;
  filterable?: boolean;
  filters?: FilterState[];
  onFilterChange?: (filters: FilterState[]) => void;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  currentPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  expandable?: boolean;
  expandedRows?: T[keyof T][];
  renderExpandedRow?: (row: T) => ReactNode;
  onExpandChange?: (expandedIds: T[keyof T][]) => void;
  stickyHeader?: boolean;
  maxHeight?: number | string;
  showFooter?: boolean;
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
  rowClassName?: (row: T, index: number) => string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  className?: string;
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

const SIZE_CONFIG: Record<TableSize, { padding: string; fontSize: number; headerHeight: number }> = {
  sm: { padding: '8px 12px', fontSize: 13, headerHeight: 36 },
  md: { padding: '12px 16px', fontSize: 14, headerHeight: 44 },
  lg: { padding: '16px 20px', fontSize: 15, headerHeight: 52 },
};

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}20`,
    overflow: 'hidden',
  },

  tableWrapper: {
    overflowX: 'auto' as const,
    overflowY: 'auto' as const,
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    borderSpacing: 0,
  },

  thead: {
    backgroundColor: BRAND.softSand,
  },

  theadSticky: {
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
  },

  th: {
    textAlign: 'left' as const,
    fontWeight: 600,
    color: BRAND.uiSlate,
    borderBottom: `2px solid ${BRAND.ancientStone}30`,
    whiteSpace: 'nowrap' as const,
    position: 'relative' as const,
    userSelect: 'none' as const,
  },

  thSortable: {
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },

  thSortableHover: {
    backgroundColor: `${BRAND.ancientStone}15`,
  },

  thContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  sortIcon: {
    fontSize: '12px',
    opacity: 0.5,
  },

  sortIconActive: {
    opacity: 1,
    color: BRAND.sacredGold,
  },

  tbody: {},

  tr: {
    transition: 'background-color 0.15s',
  },

  trHover: {
    backgroundColor: `${BRAND.cenoteTurquoise}08`,
  },

  trSelected: {
    backgroundColor: `${BRAND.sacredGold}15`,
  },

  trStriped: {
    backgroundColor: `${BRAND.softSand}50`,
  },

  trClickable: {
    cursor: 'pointer',
  },

  td: {
    color: BRAND.uiSlate,
    borderBottom: `1px solid ${BRAND.ancientStone}15`,
  },

  tdBordered: {
    borderRight: `1px solid ${BRAND.ancientStone}15`,
  },

  tfoot: {
    backgroundColor: BRAND.softSand,
    fontWeight: 600,
  },

  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: BRAND.sacredGold,
  },

  expandButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'all 0.2s',
    color: BRAND.ancientStone,
  },

  expandButtonHover: {
    backgroundColor: `${BRAND.ancientStone}15`,
    color: BRAND.uiSlate,
  },

  expandedRow: {
    backgroundColor: `${BRAND.softSand}30`,
  },

  expandedContent: {
    padding: '16px 24px',
  },

  resizeHandle: {
    position: 'absolute' as const,
    right: 0,
    top: 0,
    bottom: 0,
    width: '4px',
    cursor: 'col-resize',
    backgroundColor: 'transparent',
    transition: 'background-color 0.15s',
  },

  resizeHandleActive: {
    backgroundColor: BRAND.sacredGold,
  },

  // Filter row
  filterRow: {
    backgroundColor: '#ffffff',
    borderBottom: `1px solid ${BRAND.ancientStone}20`,
  },

  filterInput: {
    width: '100%',
    padding: '6px 10px',
    border: `1px solid ${BRAND.ancientStone}30`,
    borderRadius: '4px',
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },

  filterInputFocus: {
    borderColor: BRAND.sacredGold,
  },

  // Pagination
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderTop: `1px solid ${BRAND.ancientStone}20`,
    backgroundColor: '#ffffff',
  },

  paginationInfo: {
    fontSize: '13px',
    color: BRAND.ancientStone,
  },

  paginationControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  paginationButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
    height: '32px',
    padding: '0 8px',
    border: `1px solid ${BRAND.ancientStone}30`,
    borderRadius: '4px',
    backgroundColor: '#ffffff',
    color: BRAND.uiSlate,
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  paginationButtonHover: {
    borderColor: BRAND.sacredGold,
    backgroundColor: `${BRAND.sacredGold}10`,
  },

  paginationButtonActive: {
    borderColor: BRAND.sacredGold,
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  paginationButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },

  pageSizeSelect: {
    padding: '6px 8px',
    border: `1px solid ${BRAND.ancientStone}30`,
    borderRadius: '4px',
    fontSize: '13px',
    color: BRAND.uiSlate,
    outline: 'none',
    cursor: 'pointer',
  },

  // Empty state
  emptyState: {
    padding: '48px 24px',
    textAlign: 'center' as const,
    color: BRAND.ancientStone,
  },

  emptyStateIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5,
  },

  emptyStateText: {
    fontSize: '15px',
  },

  // Loading state
  loadingOverlay: {
    position: 'absolute' as const,
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 20,
  },

  loadingSpinner: {
    width: '32px',
    height: '32px',
    border: `3px solid ${BRAND.ancientStone}30`,
    borderTopColor: BRAND.sacredGold,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },

  // Error state
  errorState: {
    padding: '24px',
    textAlign: 'center' as const,
    color: '#E53E3E',
    backgroundColor: '#FFF5F5',
    borderRadius: '4px',
    margin: '16px',
  },

  // Sticky columns
  stickyLeft: {
    position: 'sticky' as const,
    left: 0,
    backgroundColor: 'inherit',
    zIndex: 5,
    boxShadow: '2px 0 4px rgba(0, 0, 0, 0.05)',
  },

  stickyRight: {
    position: 'sticky' as const,
    right: 0,
    backgroundColor: 'inherit',
    zIndex: 5,
    boxShadow: '-2px 0 4px rgba(0, 0, 0, 0.05)',
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getValue<T>(row: T, accessor: keyof T | ((row: T) => any)): unknown {
  if (typeof accessor === 'function') {
    return accessor(row);
  }
  return row[accessor];
}

function sortData<T>(data: T[], columns: ColumnDef<T>[], sort: SortState | null): T[] {
  if (!sort || !sort.direction) return data;

  const column = columns.find((c) => c.id === sort.column);
  if (!column) return data;

  return [...data].sort((a, b) => {
    const aValue = getValue(a, column.accessor);
    const bValue = getValue(b, column.accessor);

    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    let comparison = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sort.direction === 'desc' ? -comparison : comparison;
  });
}

function filterData<T>(data: T[], columns: ColumnDef<T>[], filters: FilterState[]): T[] {
  if (filters.length === 0) return data;

  return data.filter((row) => {
    return filters.every((filter) => {
      const column = columns.find((c) => c.id === filter.column);
      if (!column) return true;

      const value = getValue(row, column.accessor);
      const filterValue = filter.value;

      if (filterValue === '' || filterValue === null || filterValue === undefined) {
        return true;
      }

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
        case 'lt':
          return value < filterValue;
        case 'gte':
          return value >= filterValue;
        case 'lte':
          return value <= filterValue;
        case 'between':
          return Array.isArray(filterValue) && value >= filterValue[0] && value <= filterValue[1];
        case 'in':
          return Array.isArray(filterValue) && filterValue.includes(value);
        default:
          return true;
      }
    });
  });
}

function paginateData<T>(data: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return data.slice(start, start + pageSize);
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

interface TableHeaderCellProps<T> {
  column: ColumnDef<T>;
  sort: SortState | null;
  onSort: (columnId: string) => void;
  size: TableSize;
  isResizing: boolean;
  onResizeStart: (columnId: string, e: React.MouseEvent) => void;
}

function TableHeaderCell<T>({
  column,
  sort,
  onSort,
  size,
  isResizing,
  onResizeStart,
}: TableHeaderCellProps<T>) {
  const [isHovered, setIsHovered] = useState(false);
  const sizeConfig = SIZE_CONFIG[size];
  const isSorted = sort?.column === column.id;
  const sortDirection = isSorted ? sort?.direction : null;

  const cellStyle: CSSProperties = {
    ...styles.th,
    padding: sizeConfig.padding,
    fontSize: sizeConfig.fontSize,
    height: sizeConfig.headerHeight,
    width: column.width,
    minWidth: column.minWidth,
    maxWidth: column.maxWidth,
    textAlign: column.align || 'left',
    ...(column.sortable && styles.thSortable),
    ...(column.sortable && isHovered && styles.thSortableHover),
    ...(column.sticky === 'left' && styles.stickyLeft),
    ...(column.sticky === 'right' && styles.stickyRight),
  };

  return (
    <th
      style={cellStyle}
      className={column.headerClassName}
      onClick={() => column.sortable && onSort(column.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.thContent}>
        {column.header}
        {column.sortable && (
          <span style={{ ...styles.sortIcon, ...(isSorted && styles.sortIconActive) }}>
            {sortDirection === 'asc' ? '▲' : sortDirection === 'desc' ? '▼' : '⇅'}
          </span>
        )}
      </div>
      {column.resizable && (
        <div
          style={{
            ...styles.resizeHandle,
            ...(isResizing && styles.resizeHandleActive),
          }}
          onMouseDown={(e) => onResizeStart(column.id, e)}
        />
      )}
    </th>
  );
}

interface FilterRowProps<T> {
  columns: ColumnDef<T>[];
  filters: FilterState[];
  onFilterChange: (columnId: string, value: unknown) => void;
  size: TableSize;
  hasSelection: boolean;
  hasExpand: boolean;
}

function FilterRow<T>({
  columns,
  filters,
  onFilterChange,
  size,
  hasSelection,
  hasExpand,
}: FilterRowProps<T>) {
  const sizeConfig = SIZE_CONFIG[size];
  const [focusedFilter, setFocusedFilter] = useState<string | null>(null);

  const getFilterValue = (columnId: string) => {
    const filter = filters.find((f) => f.column === columnId);
    return filter?.value || '';
  };

  return (
    <tr style={styles.filterRow}>
      {hasSelection && <td style={{ padding: sizeConfig.padding }} />}
      {hasExpand && <td style={{ padding: sizeConfig.padding }} />}
      {columns
        .filter((col) => !col.hidden)
        .map((column) => (
          <td
            key={column.id}
            style={{
              padding: '8px',
              ...(column.sticky === 'left' && styles.stickyLeft),
              ...(column.sticky === 'right' && styles.stickyRight),
            }}
          >
            {column.filterable !== false && (
              column.filterType === 'select' && column.filterOptions ? (
                <select
                  style={styles.filterInput}
                  value={getFilterValue(column.id)}
                  onChange={(e) => onFilterChange(column.id, e.target.value)}
                >
                  <option value="">All</option>
                  {column.filterOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : column.filterType === 'boolean' ? (
                <select
                  style={styles.filterInput}
                  value={getFilterValue(column.id)}
                  onChange={(e) => onFilterChange(column.id, e.target.value === '' ? '' : e.target.value === 'true')}
                >
                  <option value="">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              ) : (
                <input
                  type={column.filterType === 'number' ? 'number' : column.filterType === 'date' ? 'date' : 'text'}
                  placeholder={`Filter ${column.header}...`}
                  value={getFilterValue(column.id)}
                  onChange={(e) => onFilterChange(column.id, e.target.value)}
                  onFocus={() => setFocusedFilter(column.id)}
                  onBlur={() => setFocusedFilter(null)}
                  style={{
                    ...styles.filterInput,
                    ...(focusedFilter === column.id && styles.filterInputFocus),
                  }}
                />
              )
            )}
          </td>
        ))}
    </tr>
  );
}

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

function Pagination({
  page,
  pageSize,
  total,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const getVisiblePages = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push('ellipsis');
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push('ellipsis');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const buttonStyle = (key: string, active: boolean = false, disabled: boolean = false): CSSProperties => ({
    ...styles.paginationButton,
    ...(hoveredButton === key && !disabled && styles.paginationButtonHover),
    ...(active && styles.paginationButtonActive),
    ...(disabled && styles.paginationButtonDisabled),
  });

  return (
    <div style={styles.pagination}>
      <div style={styles.paginationInfo}>
        Showing {startItem} to {endItem} of {total} results
      </div>

      <div style={styles.paginationControls}>
        <select
          style={styles.pageSizeSelect}
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>

        <button
          style={buttonStyle('prev', false, page === 1)}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          onMouseEnter={() => setHoveredButton('prev')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          ‹
        </button>

        {getVisiblePages().map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} style={{ padding: '0 4px', color: BRAND.ancientStone }}>
              ...
            </span>
          ) : (
            <button
              key={p}
              style={buttonStyle(`page-${p}`, p === page)}
              onClick={() => onPageChange(p)}
              onMouseEnter={() => setHoveredButton(`page-${p}`)}
              onMouseLeave={() => setHoveredButton(null)}
            >
              {p}
            </button>
          )
        )}

        <button
          style={buttonStyle('next', false, page === totalPages)}
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          onMouseEnter={() => setHoveredButton('next')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          ›
        </button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  loading = false,
  error = null,
  emptyMessage = 'No data available',
  size = 'md',
  variant = 'default',
  selectionMode = 'none',
  selectedRows = [],
  onSelectionChange,
  sortable = true,
  defaultSort,
  onSort,
  filterable = false,
  filters: controlledFilters,
  onFilterChange,
  pagination = false,
  pageSize: initialPageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  currentPage: controlledPage,
  totalItems,
  onPageChange,
  onPageSizeChange,
  expandable = false,
  expandedRows: controlledExpandedRows,
  renderExpandedRow,
  onExpandChange,
  stickyHeader = false,
  maxHeight,
  showFooter = false,
  onRowClick,
  onRowDoubleClick,
  rowClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
  className,
}: DataTableProps<T>): JSX.Element {
  // Internal state
  const [sort, setSort] = useState<SortState | null>(defaultSort || null);
  const [internalFilters, setInternalFilters] = useState<FilterState[]>([]);
  const [internalPage, setInternalPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(initialPageSize);
  const [internalSelectedRows, setInternalSelectedRows] = useState<T[keyof T][]>([]);
  const [internalExpandedRows, setInternalExpandedRows] = useState<T[keyof T][]>([]);
  const [hoveredRow, setHoveredRow] = useState<T[keyof T] | null>(null);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  // Use controlled or internal state
  const filters = controlledFilters !== undefined ? controlledFilters : internalFilters;
  const page = controlledPage !== undefined ? controlledPage : internalPage;
  const pageSize = internalPageSize;
  const selected = selectedRows.length > 0 ? selectedRows : internalSelectedRows;
  const expanded = controlledExpandedRows !== undefined ? controlledExpandedRows : internalExpandedRows;

  const sizeConfig = SIZE_CONFIG[size];
  const visibleColumns = columns.filter((col) => !col.hidden);
  const hasSelection = selectionMode !== 'none';
  const hasExpand = expandable && !!renderExpandedRow;

  // Process data: filter -> sort -> paginate
  const processedData = useMemo(() => {
    let result = filterData(data, columns, filters);
    result = sortData(result, columns, sort);
    return result;
  }, [data, columns, filters, sort]);

  const total = totalItems !== undefined ? totalItems : processedData.length;

  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;
    return paginateData(processedData, page, pageSize);
  }, [processedData, pagination, page, pageSize]);

  // Handlers
  const handleSort = useCallback((columnId: string) => {
    const newSort: SortState = {
      column: columnId,
      direction:
        sort?.column === columnId
          ? sort.direction === 'asc'
            ? 'desc'
            : sort.direction === 'desc'
            ? null
            : 'asc'
          : 'asc',
    };

    if (newSort.direction === null) {
      setSort(null);
      onSort?.(null);
    } else {
      setSort(newSort);
      onSort?.(newSort);
    }
  }, [sort, onSort]);

  const handleFilterChange = useCallback((columnId: string, value: unknown) => {
    const newFilters = [...filters];
    const existingIndex = newFilters.findIndex((f) => f.column === columnId);

    if (value === '' || value === null || value === undefined) {
      if (existingIndex > -1) {
        newFilters.splice(existingIndex, 1);
      }
    } else {
      const newFilter: FilterState = {
        column: columnId,
        operator: 'contains',
        value,
      };

      if (existingIndex > -1) {
        newFilters[existingIndex] = newFilter;
      } else {
        newFilters.push(newFilter);
      }
    }

    setInternalFilters(newFilters);
    onFilterChange?.(newFilters);
    setInternalPage(1);
  }, [filters, onFilterChange]);

  const handlePageChange = useCallback((newPage: number) => {
    setInternalPage(newPage);
    onPageChange?.(newPage);
  }, [onPageChange]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setInternalPageSize(newPageSize);
    setInternalPage(1);
    onPageSizeChange?.(newPageSize);
  }, [onPageSizeChange]);

  const handleSelectAll = useCallback((checked: boolean) => {
    const newSelected = checked ? paginatedData.map((row) => row[keyField]) : [];
    setInternalSelectedRows(newSelected);
    onSelectionChange?.(newSelected);
  }, [paginatedData, keyField, onSelectionChange]);

  const handleSelectRow = useCallback((rowKey: T[keyof T], checked: boolean) => {
    let newSelected: T[keyof T][];

    if (selectionMode === 'single') {
      newSelected = checked ? [rowKey] : [];
    } else {
      newSelected = checked
        ? [...selected, rowKey]
        : selected.filter((key) => key !== rowKey);
    }

    setInternalSelectedRows(newSelected);
    onSelectionChange?.(newSelected);
  }, [selectionMode, selected, onSelectionChange]);

  const handleExpandRow = useCallback((rowKey: T[keyof T]) => {
    const newExpanded = expanded.includes(rowKey)
      ? expanded.filter((key) => key !== rowKey)
      : [...expanded, rowKey];

    setInternalExpandedRows(newExpanded);
    onExpandChange?.(newExpanded);
  }, [expanded, onExpandChange]);

  const handleResizeStart = useCallback((columnId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingColumn(columnId);

    const startX = e.clientX;
    const startWidth = columnWidths[columnId] || 150;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diff = moveEvent.clientX - startX;
      const newWidth = Math.max(50, startWidth + diff);
      setColumnWidths((prev) => ({ ...prev, [columnId]: newWidth }));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [columnWidths]);

  const isAllSelected = paginatedData.length > 0 && paginatedData.every((row) => selected.includes(row[keyField]));
  const isSomeSelected = paginatedData.some((row) => selected.includes(row[keyField]));

  // Render
  if (error) {
    return (
      <div style={styles.container} className={className}>
        <div style={styles.errorState}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container} className={className}>
      <div style={{ ...styles.tableWrapper, maxHeight, position: 'relative' }}>
        {loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.loadingSpinner} />
          </div>
        )}

        <table style={styles.table}>
          <thead style={{ ...styles.thead, ...(stickyHeader && styles.theadSticky) }} className={headerClassName}>
            <tr>
              {hasSelection && (
                <th style={{ ...styles.th, width: '48px', padding: sizeConfig.padding }}>
                  {selectionMode === 'multiple' && (
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected && !isAllSelected;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  )}
                </th>
              )}
              {hasExpand && (
                <th style={{ ...styles.th, width: '48px', padding: sizeConfig.padding }} />
              )}
              {visibleColumns.map((column) => (
                <TableHeaderCell
                  key={column.id}
                  column={{
                    ...column,
                    width: columnWidths[column.id] || column.width,
                    sortable: sortable && column.sortable !== false,
                  }}
                  sort={sort}
                  onSort={handleSort}
                  size={size}
                  isResizing={resizingColumn === column.id}
                  onResizeStart={handleResizeStart}
                />
              ))}
            </tr>

            {filterable && (
              <FilterRow
                columns={visibleColumns}
                filters={filters}
                onFilterChange={handleFilterChange}
                size={size}
                hasSelection={hasSelection}
                hasExpand={hasExpand}
              />
            )}
          </thead>

          <tbody style={styles.tbody} className={bodyClassName}>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (hasSelection ? 1 : 0) + (hasExpand ? 1 : 0)}
                  style={styles.emptyState}
                >
                  <div style={styles.emptyStateIcon}>📭</div>
                  <div style={styles.emptyStateText}>{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const rowKey = row[keyField];
                const isSelected = selected.includes(rowKey);
                const isExpanded = expanded.includes(rowKey);
                const isHovered = hoveredRow === rowKey;
                const isStriped = variant === 'striped' && rowIndex % 2 === 1;

                return (
                  <React.Fragment key={String(rowKey)}>
                    <tr
                      style={{
                        ...styles.tr,
                        ...(isHovered && styles.trHover),
                        ...(isSelected && styles.trSelected),
                        ...(isStriped && styles.trStriped),
                        ...((onRowClick || onRowDoubleClick) && styles.trClickable),
                      }}
                      className={rowClassName?.(row, rowIndex)}
                      onClick={() => onRowClick?.(row)}
                      onDoubleClick={() => onRowDoubleClick?.(row)}
                      onMouseEnter={() => setHoveredRow(rowKey)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      {hasSelection && (
                        <td style={{ ...styles.td, padding: sizeConfig.padding }}>
                          <input
                            type="checkbox"
                            style={styles.checkbox}
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectRow(rowKey, e.target.checked);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                      )}
                      {hasExpand && (
                        <td style={{ ...styles.td, padding: sizeConfig.padding }}>
                          <button
                            style={styles.expandButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandRow(rowKey);
                            }}
                          >
                            {isExpanded ? '▼' : '▶'}
                          </button>
                        </td>
                      )}
                      {visibleColumns.map((column) => {
                        const value = getValue(row, column.accessor);
                        return (
                          <td
                            key={column.id}
                            style={{
                              ...styles.td,
                              padding: sizeConfig.padding,
                              fontSize: sizeConfig.fontSize,
                              textAlign: column.align || 'left',
                              width: columnWidths[column.id] || column.width,
                              ...(variant === 'bordered' && styles.tdBordered),
                              ...(column.sticky === 'left' && styles.stickyLeft),
                              ...(column.sticky === 'right' && styles.stickyRight),
                            }}
                            className={column.cellClassName}
                          >
                            {column.cell ? column.cell(value, row, rowIndex) : value}
                          </td>
                        );
                      })}
                    </tr>
                    {isExpanded && renderExpandedRow && (
                      <tr style={styles.expandedRow}>
                        <td
                          colSpan={visibleColumns.length + (hasSelection ? 1 : 0) + (hasExpand ? 1 : 0)}
                          style={styles.expandedContent}
                        >
                          {renderExpandedRow(row)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>

          {showFooter && (
            <tfoot style={styles.tfoot} className={footerClassName}>
              <tr>
                {hasSelection && <td style={{ padding: sizeConfig.padding }} />}
                {hasExpand && <td style={{ padding: sizeConfig.padding }} />}
                {visibleColumns.map((column) => (
                  <td
                    key={column.id}
                    style={{
                      padding: sizeConfig.padding,
                      textAlign: column.align || 'left',
                    }}
                  >
                    {typeof column.footer === 'function'
                      ? column.footer(processedData)
                      : column.footer}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {pagination && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          pageSizeOptions={pageSizeOptions}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  SortDirection,
  FilterOperator,
  ColumnAlign,
  SelectionMode,
  TableSize,
  TableVariant,
  ColumnDef,
  SortState,
  FilterState,
  PaginationState,
  DataTableProps,
};

export default DataTable;
