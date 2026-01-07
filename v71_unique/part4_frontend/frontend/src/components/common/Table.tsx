/**
 * CHE·NU™ Table & DataGrid Components
 * 
 * Data display components with sorting, pagination, and selection.
 * Optimized for large datasets and accessibility.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Checkbox } from './Input';
import { IconButton } from './Button';
import { Skeleton } from './Loading';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  variant?: 'default' | 'striped' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  emptyMessage?: string;
  stickyHeader?: boolean;
  selectable?: boolean;
  selectedRows?: Set<string | number>;
  onSelectionChange?: (selected: Set<string | number>) => void;
  sortColumn?: string;
  sortDirection?: SortDirection;
  onSort?: (column: string, direction: SortDirection) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showItemCount?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// TABLE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function Table<T>({
  columns,
  data,
  keyExtractor,
  variant = 'default',
  size = 'md',
  isLoading = false,
  emptyMessage = 'No data available',
  stickyHeader = false,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  sortColumn,
  sortDirection,
  onSort,
}: TableProps<T>) {
  
  const handleSort = (columnId: string) => {
    if (!onSort) return;
    
    let newDirection: SortDirection;
    if (sortColumn !== columnId) {
      newDirection = 'asc';
    } else if (sortDirection === 'asc') {
      newDirection = 'desc';
    } else {
      newDirection = null;
    }
    
    onSort(columnId, newDirection);
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    
    const allKeys = new Set(data.map(row => keyExtractor(row)));
    const allSelected = data.every(row => selectedRows.has(keyExtractor(row)));
    
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(allKeys);
    }
  };

  const handleSelectRow = (key: string | number) => {
    if (!onSelectionChange) return;
    
    const newSelected = new Set(selectedRows);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    onSelectionChange(newSelected);
  };

  const isAllSelected = data.length > 0 && data.every(row => selectedRows.has(keyExtractor(row)));
  const isIndeterminate = selectedRows.size > 0 && !isAllSelected;

  const getValue = (row: T, column: Column<T>): any => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor];
  };

  return (
    <div className={`table-container ${stickyHeader ? 'table-container--sticky' : ''}`}>
      <table className={`table table--${variant} table--${size}`}>
        <thead className="table__head">
          <tr>
            {selectable && (
              <th className="table__th table__th--checkbox">
                <Checkbox
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map(column => (
              <th
                key={column.id}
                className={`
                  table__th
                  table__th--${column.align || 'left'}
                  ${column.sortable ? 'table__th--sortable' : ''}
                `}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.id)}
              >
                <div className="table__th-content">
                  <span>{column.header}</span>
                  {column.sortable && (
                    <span className="table__sort-icon">
                      {sortColumn === column.id ? (
                        sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : '↕'
                      ) : '↕'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="table__body">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="table__tr">
                {selectable && (
                  <td className="table__td">
                    <Skeleton width={20} height={20} />
                  </td>
                )}
                {columns.map(column => (
                  <td key={column.id} className="table__td">
                    <Skeleton width="80%" height={16} />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="table__empty"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const key = keyExtractor(row);
              const isSelected = selectedRows.has(key);
              
              return (
                <tr 
                  key={key}
                  className={`table__tr ${isSelected ? 'table__tr--selected' : ''}`}
                >
                  {selectable && (
                    <td className="table__td table__td--checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectRow(key)}
                        aria-label={`Select row ${index + 1}`}
                      />
                    </td>
                  )}
                  {columns.map(column => {
                    const value = getValue(row, column);
                    const rendered = column.render 
                      ? column.render(value, row, index)
                      : value;
                    
                    return (
                      <td
                        key={column.id}
                        className={`table__td table__td--${column.align || 'left'}`}
                      >
                        {rendered}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGINATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = true,
  showItemCount = true,
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getVisiblePages = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const delta = 2;
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== 'ellipsis') {
        pages.push('ellipsis');
      }
    }
    
    return pages;
  };

  return (
    <div className="pagination">
      {showItemCount && (
        <div className="pagination__info">
          Showing {startItem}-{endItem} of {totalItems}
        </div>
      )}
      
      <div className="pagination__controls">
        <IconButton
          icon="←"
          size="sm"
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        />
        
        <div className="pagination__pages">
          {getVisiblePages().map((page, index) => (
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                …
              </span>
            ) : (
              <button
                key={page}
                className={`pagination__page ${page === currentPage ? 'pagination__page--active' : ''}`}
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            )
          ))}
        </div>
        
        <IconButton
          icon="→"
          size="sm"
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        />
      </div>
      
      {showPageSizeSelector && onPageSizeChange && (
        <div className="pagination__page-size">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="pagination__select"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// DATA GRID COMPONENT (Table + Pagination + Toolbar)
// ═══════════════════════════════════════════════════════════════════════════

export interface DataGridProps<T> extends Omit<TableProps<T>, 'data'> {
  data: T[];
  pageSize?: number;
  pageSizeOptions?: number[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
}

export function DataGrid<T>({
  data,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  toolbar,
  footer,
  sortColumn: controlledSortColumn,
  sortDirection: controlledSortDirection,
  onSort: controlledOnSort,
  ...tableProps
}: DataGridProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchQuery, setSearchQuery] = useState('');
  const [internalSortColumn, setInternalSortColumn] = useState<string | undefined>();
  const [internalSortDirection, setInternalSortDirection] = useState<SortDirection>(null);

  const sortColumn = controlledSortColumn ?? internalSortColumn;
  const sortDirection = controlledSortDirection ?? internalSortDirection;

  const handleSort = useCallback((column: string, direction: SortDirection) => {
    if (controlledOnSort) {
      controlledOnSort(column, direction);
    } else {
      setInternalSortColumn(direction ? column : undefined);
      setInternalSortDirection(direction);
    }
  }, [controlledOnSort]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    onSearch?.(query);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;
    
    const column = tableProps.columns.find(c => c.id === sortColumn);
    if (!column) return data;

    return [...data].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (typeof column.accessor === 'function') {
        aVal = column.accessor(a);
        bVal = column.accessor(b);
      } else {
        aVal = a[column.accessor];
        bVal = b[column.accessor];
      }

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection, tableProps.columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  return (
    <div className="data-grid">
      {(searchable || toolbar) && (
        <div className="data-grid__toolbar">
          {searchable && (
            <input
              type="search"
              className="data-grid__search"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          )}
          {toolbar && <div className="data-grid__actions">{toolbar}</div>}
        </div>
      )}
      
      <Table
        {...tableProps}
        data={paginatedData}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
      
      <div className="data-grid__footer">
        {footer}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedData.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

export const TableStyles: React.FC = () => (
  <style>{`
    /* Table container */
    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    .table-container--sticky {
      max-height: 600px;
      overflow-y: auto;
    }

    .table-container--sticky .table__head {
      position: sticky;
      top: 0;
      z-index: 1;
    }

    /* Table */
    .table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }

    .table--sm { font-size: 13px; }
    .table--lg { font-size: 15px; }

    /* Header */
    .table__head {
      background: var(--color-bg-secondary, #f9fafb);
    }

    .table__th {
      padding: 12px 16px;
      text-align: left;
      font-weight: 600;
      color: var(--color-text-secondary, #6b7280);
      border-bottom: 1px solid var(--color-border, #e5e7eb);
      white-space: nowrap;
    }

    .table--sm .table__th { padding: 8px 12px; }
    .table--lg .table__th { padding: 16px 20px; }

    .table__th--center { text-align: center; }
    .table__th--right { text-align: right; }
    .table__th--checkbox { width: 48px; }

    .table__th--sortable {
      cursor: pointer;
      user-select: none;
    }

    .table__th--sortable:hover {
      background: var(--color-bg-tertiary, #f3f4f6);
    }

    .table__th-content {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .table__sort-icon {
      opacity: 0.5;
      font-size: 12px;
    }

    .table__th--sortable:hover .table__sort-icon {
      opacity: 0.8;
    }

    /* Body */
    .table__tr {
      transition: background var(--transition-fast, 0.15s);
    }

    .table__tr:hover {
      background: var(--color-bg-secondary, #f9fafb);
    }

    .table__tr--selected {
      background: rgba(99, 102, 241, 0.05);
    }

    .table__tr--selected:hover {
      background: rgba(99, 102, 241, 0.1);
    }

    .table__td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--color-border, #e5e7eb);
      color: var(--color-text-primary, #111827);
    }

    .table--sm .table__td { padding: 8px 12px; }
    .table--lg .table__td { padding: 16px 20px; }

    .table__td--center { text-align: center; }
    .table__td--right { text-align: right; }
    .table__td--checkbox { width: 48px; }

    /* Variants */
    .table--striped .table__tr:nth-child(even) {
      background: var(--color-bg-secondary, #f9fafb);
    }

    .table--bordered .table__th,
    .table--bordered .table__td {
      border: 1px solid var(--color-border, #e5e7eb);
    }

    /* Empty state */
    .table__empty {
      padding: 48px 16px;
      text-align: center;
      color: var(--color-text-secondary, #6b7280);
    }

    /* Pagination */
    .pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 0;
      flex-wrap: wrap;
    }

    .pagination__info {
      font-size: 14px;
      color: var(--color-text-secondary, #6b7280);
    }

    .pagination__controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pagination__pages {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .pagination__page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      height: 32px;
      padding: 0 8px;
      border: none;
      background: transparent;
      color: var(--color-text-primary, #111827);
      font-size: 14px;
      border-radius: var(--radius-sm, 6px);
      cursor: pointer;
      transition: all var(--transition-fast, 0.15s);
    }

    .pagination__page:hover {
      background: var(--color-bg-tertiary, #f3f4f6);
    }

    .pagination__page--active {
      background: var(--color-primary, #6366f1);
      color: white;
    }

    .pagination__page--active:hover {
      background: var(--color-primary-hover, #4f46e5);
    }

    .pagination__ellipsis {
      padding: 0 8px;
      color: var(--color-text-tertiary, #9ca3af);
    }

    .pagination__page-size {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pagination__select {
      padding: 6px 10px;
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-sm, 6px);
      background: var(--color-bg-primary, #ffffff);
      color: var(--color-text-primary, #111827);
      font-size: 14px;
      cursor: pointer;
    }

    /* Data Grid */
    .data-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .data-grid__toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .data-grid__search {
      min-width: 250px;
      padding: 8px 12px;
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      font-size: 14px;
      background: var(--color-bg-primary, #ffffff);
      color: var(--color-text-primary, #111827);
    }

    .data-grid__search:focus {
      outline: none;
      border-color: var(--color-primary, #6366f1);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    .data-grid__actions {
      display: flex;
      gap: 8px;
    }

    .data-grid__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    /* Dark mode */
    [data-theme="dark"] .table__head {
      background: #1a1a1a;
    }

    [data-theme="dark"] .table__th {
      color: #9ca3af;
      border-color: #333;
    }

    [data-theme="dark"] .table__th--sortable:hover {
      background: #2a2a2a;
    }

    [data-theme="dark"] .table__tr:hover {
      background: #2a2a2a;
    }

    [data-theme="dark"] .table__td {
      color: #f9fafb;
      border-color: #333;
    }

    [data-theme="dark"] .table--striped .table__tr:nth-child(even) {
      background: #1a1a1a;
    }

    [data-theme="dark"] .pagination__page {
      color: #f9fafb;
    }

    [data-theme="dark"] .pagination__page:hover {
      background: #2a2a2a;
    }

    [data-theme="dark"] .pagination__select {
      background: #1a1a1a;
      border-color: #333;
      color: #f9fafb;
    }

    [data-theme="dark"] .data-grid__search {
      background: #1a1a1a;
      border-color: #333;
      color: #f9fafb;
    }
  `}</style>
);

export default {
  Table,
  Pagination,
  DataGrid,
  TableStyles,
};
