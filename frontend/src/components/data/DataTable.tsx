// CHE·NU™ Data Table Component
// Comprehensive table with sorting, filtering, pagination

import React, { useState, useMemo, useCallback } from 'react';

// ============================================================
// TYPES
// ============================================================

export type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
  key: string;
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

export interface TableFilter {
  key: string;
  value: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte';
}

export interface TableSort {
  key: string;
  direction: SortDirection;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T, index: number) => string | number;
  
  // Sorting
  sortable?: boolean;
  defaultSort?: TableSort;
  onSort?: (sort: TableSort) => void;
  
  // Filtering
  filterable?: boolean;
  filters?: TableFilter[];
  onFilterChange?: (filters: TableFilter[]) => void;
  
  // Pagination
  pagination?: PaginationConfig;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  
  // Selection
  selectable?: boolean;
  selectedRows?: (string | number)[];
  onSelectionChange?: (selectedKeys: (string | number)[]) => void;
  
  // Actions
  onRowClick?: (row: T, index: number) => void;
  rowActions?: (row: T, index: number) => React.ReactNode;
  bulkActions?: React.ReactNode;
  
  // Styling
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  
  // States
  loading?: boolean;
  emptyMessage?: string;
  errorMessage?: string;
  
  // Other
  className?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string);
}

// ============================================================
// BRAND COLORS
// ============================================================

const COLORS = {
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
// ICONS
// ============================================================

const SortIcon: React.FC<{ direction: SortDirection }> = ({ direction }) => (
  <span className="inline-flex flex-col ml-1">
    <svg
      className={`w-3 h-3 ${direction === 'asc' ? 'text-amber-600' : 'text-gray-300'}`}
      viewBox="0 0 10 5"
    >
      <path d="M5 0L10 5H0L5 0Z" fill="currentColor" />
    </svg>
    <svg
      className={`w-3 h-3 -mt-1 ${direction === 'desc' ? 'text-amber-600' : 'text-gray-300'}`}
      viewBox="0 0 10 5"
    >
      <path d="M5 5L0 0H10L5 5Z" fill="currentColor" />
    </svg>
  </span>
);

const CheckIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
    <path d="M6.5 12L2 7.5l1.4-1.4 3.1 3.1L13.6 2 15 3.4 6.5 12z" />
  </svg>
);

const MinusIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 7h12v2H2z" />
  </svg>
);

// ============================================================
// CHECKBOX COMPONENT
// ============================================================

interface TableCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const TableCheckbox: React.FC<TableCheckboxProps> = ({
  checked,
  indeterminate = false,
  onChange,
  disabled = false,
}) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    className={`
      w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
      ${checked || indeterminate
        ? 'bg-amber-600 border-amber-600 text-white'
        : 'bg-white border-gray-300 hover:border-gray-400'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
  >
    {checked && <CheckIcon />}
    {indeterminate && !checked && <MinusIcon />}
  </button>
);

// ============================================================
// FILTER INPUT COMPONENT
// ============================================================

interface FilterInputProps {
  column: Column<any>;
  value: string;
  onChange: (value: string) => void;
}

const FilterInput: React.FC<FilterInputProps> = ({ column, value, onChange }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={`Filter ${column.header}...`}
    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
  />
);

// ============================================================
// PAGINATION COMPONENT
// ============================================================

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  total,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      let start = Math.max(2, page - Math.floor(showPages / 2));
      let end = Math.min(totalPages - 1, start + showPages - 1);
      
      if (end - start < showPages - 1) {
        start = Math.max(2, end - showPages + 1);
      }
      
      if (start > 2) pages.push('ellipsis');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('ellipsis');
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {total} results
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="px-2 py-1 text-sm rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ««
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-2 py-1 text-sm rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          «
        </button>
        
        {getPageNumbers().map((pageNum, index) =>
          pageNum === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-2 py-1 text-sm text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`
                px-3 py-1 text-sm rounded transition-colors
                ${page === pageNum
                  ? 'bg-amber-600 text-white'
                  : 'hover:bg-gray-100'
                }
              `}
            >
              {pageNum}
            </button>
          )
        )}
        
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-2 py-1 text-sm rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          »
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="px-2 py-1 text-sm rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          »»
        </button>
      </div>
    </div>
  );
};

// ============================================================
// LOADING SKELETON
// ============================================================

interface LoadingSkeletonProps {
  columns: number;
  rows: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ columns, rows }) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <tr key={rowIndex}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <td key={colIndex} className="px-4 py-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

// ============================================================
// EMPTY STATE
// ============================================================

interface EmptyStateProps {
  message: string;
  columns: number;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, columns }) => (
  <tr>
    <td colSpan={columns} className="px-4 py-12 text-center">
      <div className="text-gray-400 text-lg mb-2">📭</div>
      <p className="text-gray-500">{message}</p>
    </td>
  </tr>
);

// ============================================================
// ERROR STATE
// ============================================================

interface ErrorStateProps {
  message: string;
  columns: number;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, columns }) => (
  <tr>
    <td colSpan={columns} className="px-4 py-12 text-center">
      <div className="text-red-400 text-lg mb-2">⚠️</div>
      <p className="text-red-500">{message}</p>
    </td>
  </tr>
);

// ============================================================
// DATA TABLE COMPONENT
// ============================================================

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  sortable = true,
  defaultSort,
  onSort,
  filterable = false,
  filters = [],
  onFilterChange,
  pagination,
  onPageChange,
  onPageSizeChange,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  onRowClick,
  rowActions,
  bulkActions,
  striped = true,
  hoverable = true,
  bordered = false,
  compact = false,
  stickyHeader = false,
  loading = false,
  emptyMessage = 'No data available',
  errorMessage,
  className = '',
  headerClassName = '',
  rowClassName,
}: DataTableProps<T>) {
  // ============================================================
  // STATE
  // ============================================================
  
  const [sort, setSort] = useState<TableSort>(defaultSort || { key: '', direction: null });
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  
  // ============================================================
  // COMPUTED
  // ============================================================
  
  const totalColumns = useMemo(() => {
    let count = columns.length;
    if (selectable) count++;
    if (rowActions) count++;
    return count;
  }, [columns.length, selectable, rowActions]);
  
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Apply filters
    if (filterable) {
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value) {
          result = result.filter((row) => {
            const col = columns.find((c) => c.key === key);
            if (!col) return true;
            
            const cellValue = typeof col.accessor === 'function'
              ? String(col.accessor(row))
              : String(row[col.accessor]);
            
            return cellValue.toLowerCase().includes(value.toLowerCase());
          });
        }
      });
    }
    
    // Apply sort (only if no external sort handler)
    if (sort.key && sort.direction && !onSort) {
      result.sort((a, b) => {
        const col = columns.find((c) => c.key === sort.key);
        if (!col) return 0;
        
        const aValue = typeof col.accessor === 'function'
          ? col.accessor(a)
          : a[col.accessor];
        const bValue = typeof col.accessor === 'function'
          ? col.accessor(b)
          : b[col.accessor];
        
        if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [data, columns, filterValues, sort, filterable, onSort]);
  
  const allSelected = useMemo(() => {
    if (processedData.length === 0) return false;
    return processedData.every((row, index) =>
      selectedRows.includes(keyExtractor(row, index))
    );
  }, [processedData, selectedRows, keyExtractor]);
  
  const someSelected = useMemo(() => {
    return selectedRows.length > 0 && !allSelected;
  }, [selectedRows.length, allSelected]);
  
  // ============================================================
  // HANDLERS
  // ============================================================
  
  const handleSort = useCallback((key: string) => {
    const newSort: TableSort = {
      key,
      direction: sort.key === key
        ? sort.direction === 'asc' ? 'desc' : sort.direction === 'desc' ? null : 'asc'
        : 'asc',
    };
    
    setSort(newSort);
    onSort?.(newSort);
  }, [sort, onSort]);
  
  const handleFilterChange = useCallback((key: string, value: string) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);
    
    const filterArray: TableFilter[] = Object.entries(newFilters)
      .filter(([, v]) => v)
      .map(([k, v]) => ({ key: k, value: v, operator: 'contains' }));
    
    onFilterChange?.(filterArray);
  }, [filterValues, onFilterChange]);
  
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allKeys = processedData.map((row, index) => keyExtractor(row, index));
      onSelectionChange?.(allKeys);
    } else {
      onSelectionChange?.([]);
    }
  }, [processedData, keyExtractor, onSelectionChange]);
  
  const handleSelectRow = useCallback((rowKey: string | number, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedRows, rowKey]);
    } else {
      onSelectionChange?.(selectedRows.filter((k) => k !== rowKey));
    }
  }, [selectedRows, onSelectionChange]);
  
  // ============================================================
  // RENDER
  // ============================================================
  
  const getCellValue = (row: T, column: Column<T>, index: number): React.ReactNode => {
    const value = typeof column.accessor === 'function'
      ? column.accessor(row)
      : row[column.accessor];
    
    if (column.render) {
      return column.render(value, row, index);
    }
    
    return value;
  };
  
  const getRowClassName = (row: T, index: number): string => {
    if (typeof rowClassName === 'function') {
      return rowClassName(row, index);
    }
    return rowClassName || '';
  };
  
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {/* Bulk Actions Bar */}
      {selectable && selectedRows.length > 0 && bulkActions && (
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-200 flex items-center gap-4">
          <span className="text-sm text-amber-800">
            {selectedRows.length} item{selectedRows.length > 1 ? 's' : ''} selected
          </span>
          {bulkActions}
        </div>
      )}
      
      {/* Table */}
      <div className={`overflow-x-auto ${stickyHeader ? 'max-h-[600px] overflow-y-auto' : ''}`}>
        <table className="w-full">
          <thead className={`bg-gray-50 ${stickyHeader ? 'sticky top-0 z-10' : ''} ${headerClassName}`}>
            <tr>
              {/* Selection Header */}
              {selectable && (
                <th className={`${compact ? 'px-3 py-2' : 'px-4 py-3'} w-12`}>
                  <TableCheckbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              
              {/* Column Headers */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    ${compact ? 'px-3 py-2' : 'px-4 py-3'}
                    text-${column.align || 'left'} text-sm font-semibold text-gray-700
                    ${bordered ? 'border border-gray-200' : ''}
                    ${column.sortable !== false && sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''}
                  `}
                  style={{ width: column.width }}
                  onClick={() => column.sortable !== false && sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable !== false && sortable && (
                      <SortIcon direction={sort.key === column.key ? sort.direction : null} />
                    )}
                  </div>
                </th>
              ))}
              
              {/* Actions Header */}
              {rowActions && (
                <th className={`${compact ? 'px-3 py-2' : 'px-4 py-3'} w-24 text-right`}>
                  Actions
                </th>
              )}
            </tr>
            
            {/* Filter Row */}
            {filterable && (
              <tr className="bg-gray-25">
                {selectable && <th className={`${compact ? 'px-3 py-2' : 'px-4 py-2'}`} />}
                {columns.map((column) => (
                  <th key={`filter-${column.key}`} className={`${compact ? 'px-3 py-2' : 'px-4 py-2'}`}>
                    {column.filterable !== false && (
                      <FilterInput
                        column={column}
                        value={filterValues[column.key] || ''}
                        onChange={(value) => handleFilterChange(column.key, value)}
                      />
                    )}
                  </th>
                ))}
                {rowActions && <th className={`${compact ? 'px-3 py-2' : 'px-4 py-2'}`} />}
              </tr>
            )}
          </thead>
          
          <tbody>
            {/* Loading State */}
            {loading && (
              <LoadingSkeleton columns={totalColumns} rows={5} />
            )}
            
            {/* Error State */}
            {!loading && errorMessage && (
              <ErrorState message={errorMessage} columns={totalColumns} />
            )}
            
            {/* Empty State */}
            {!loading && !errorMessage && processedData.length === 0 && (
              <EmptyState message={emptyMessage} columns={totalColumns} />
            )}
            
            {/* Data Rows */}
            {!loading && !errorMessage && processedData.map((row, index) => {
              const rowKey = keyExtractor(row, index);
              const isSelected = selectedRows.includes(rowKey);
              
              return (
                <tr
                  key={rowKey}
                  onClick={() => onRowClick?.(row, index)}
                  className={`
                    ${striped && index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}
                    ${hoverable ? 'hover:bg-amber-50' : ''}
                    ${isSelected ? 'bg-amber-100' : ''}
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${bordered ? 'border-b border-gray-200' : ''}
                    ${getRowClassName(row, index)}
                  `}
                >
                  {/* Selection Cell */}
                  {selectable && (
                    <td
                      className={`${compact ? 'px-3 py-2' : 'px-4 py-3'}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <TableCheckbox
                        checked={isSelected}
                        onChange={(checked) => handleSelectRow(rowKey, checked)}
                      />
                    </td>
                  )}
                  
                  {/* Data Cells */}
                  {columns.map((column) => (
                    <td
                      key={`${rowKey}-${column.key}`}
                      className={`
                        ${compact ? 'px-3 py-2' : 'px-4 py-3'}
                        text-${column.align || 'left'} text-sm text-gray-700
                        ${bordered ? 'border border-gray-200' : ''}
                      `}
                      style={{ width: column.width }}
                    >
                      {getCellValue(row, column, index)}
                    </td>
                  ))}
                  
                  {/* Actions Cell */}
                  {rowActions && (
                    <td
                      className={`${compact ? 'px-3 py-2' : 'px-4 py-3'} text-right`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {rowActions(row, index)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && (
        <Pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          pageSizeOptions={pagination.pageSizeOptions || [10, 25, 50, 100]}
          onPageChange={onPageChange || (() => {})}
          onPageSizeChange={onPageSizeChange || (() => {})}
        />
      )}
    </div>
  );
}

// ============================================================
// SIMPLE TABLE VARIANT
// ============================================================

interface SimpleTableProps {
  headers: string[];
  rows: React.ReactNode[][];
  className?: string;
}

export const SimpleTable: React.FC<SimpleTableProps> = ({
  headers,
  rows,
  className = '',
}) => (
  <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className={rowIndex % 2 === 1 ? 'bg-gray-50' : 'bg-white'}
          >
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="px-4 py-3 text-sm text-gray-700"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ============================================================
// EXPORTS
// ============================================================

export default DataTable;
