// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — DATA DISPLAY COMPONENTS
// Table, Stats, KPI Cards, Empty States
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
} from 'react';

// =============================================================================
// TABLE TYPES
// =============================================================================

export interface Column<T> {
  /** Unique key */
  key: string;
  
  /** Header label */
  header: ReactNode;
  
  /** Cell renderer */
  render?: (row: T, index: number) => ReactNode;
  
  /** Accessor for simple cases */
  accessor?: keyof T;
  
  /** Width */
  width?: string | number;
  
  /** Sortable */
  sortable?: boolean;
  
  /** Alignment */
  align?: 'left' | 'center' | 'right';
  
  /** Hide on mobile */
  hideOnMobile?: boolean;
}

export interface TableProps<T> extends HTMLAttributes<HTMLTableElement> {
  /** Data array */
  data: T[];
  
  /** Column definitions */
  columns: Column<T>[];
  
  /** Row key accessor */
  rowKey: keyof T | ((row: T) => string);
  
  /** Loading state */
  loading?: boolean;
  
  /** Empty state content */
  emptyContent?: ReactNode;
  
  /** Striped rows */
  striped?: boolean;
  
  /** Hoverable rows */
  hoverable?: boolean;
  
  /** Compact mode */
  compact?: boolean;
  
  /** Sticky header */
  stickyHeader?: boolean;
  
  /** On row click */
  onRowClick?: (row: T, index: number) => void;
  
  /** Selected rows */
  selectedRows?: string[];
  
  /** On selection change */
  onSelectionChange?: (selectedKeys: string[]) => void;
  
  /** Selectable */
  selectable?: boolean;
  
  /** Sort state */
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
}

// =============================================================================
// TABLE COMPONENT
// =============================================================================

/**
 * Data Table Component
 * 
 * @example
 * ```tsx
 * <DataTable
 *   data={projects}
 *   rowKey="id"
 *   columns={[
 *     { key: 'name', header: 'Nom', accessor: 'name' },
 *     { key: 'status', header: 'Statut', render: (row) => <Badge>{row.status}</Badge> },
 *     { key: 'budget', header: 'Budget', align: 'right', accessor: 'budget' },
 *   ]}
 *   hoverable
 *   onRowClick={(row) => navigate(`/projects/${row.id}`)}
 * />
 * ```
 */
export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  rowKey,
  loading = false,
  emptyContent,
  striped = false,
  hoverable = true,
  compact = false,
  stickyHeader = false,
  onRowClick,
  selectedRows = [],
  onSelectionChange,
  selectable = false,
  sortBy,
  sortDirection,
  onSort,
  className = '',
  ...props
}: TableProps<T>): JSX.Element {
  const getRowKey = (row: T): string => {
    return typeof rowKey === 'function' ? rowKey(row) : String(row[rowKey]);
  };

  const handleSort = (key: string) => {
    if (!onSort) return;
    const newDirection = sortBy === key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(key, newDirection);
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (selectedRows.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map(getRowKey));
    }
  };

  const handleSelectRow = (key: string) => {
    if (!onSelectionChange) return;
    if (selectedRows.includes(key)) {
      onSelectionChange(selectedRows.filter((k) => k !== key));
    } else {
      onSelectionChange([...selectedRows, key]);
    }
  };

  const getCellValue = (row: T, column: Column<T>, index: number): ReactNode => {
    if (column.render) {
      return column.render(row, index);
    }
    if (column.accessor) {
      return row[column.accessor] as ReactNode;
    }
    return null;
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table
        className="w-full border-collapse"
        {...props}
      >
        {/* Header */}
        <thead
          className={`
            bg-[var(--color-bg-subtle)]
            ${stickyHeader ? 'sticky top-0 z-10' : ''}
          `}
        >
          <tr>
            {/* Selection checkbox */}
            {selectable && (
              <th className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length && data.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-[var(--color-border-default)]"
                />
              </th>
            )}

            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  px-4 ${compact ? 'py-2' : 'py-3'}
                  text-left text-xs font-semibold uppercase tracking-wider
                  text-[var(--color-text-secondary)]
                  ${column.sortable ? 'cursor-pointer hover:text-[var(--color-text-primary)]' : ''}
                  ${column.hideOnMobile ? 'hidden md:table-cell' : ''}
                  ${column.align === 'center' ? 'text-center' : ''}
                  ${column.align === 'right' ? 'text-right' : ''}
                `}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {column.header}
                  {column.sortable && (
                    <span className="ml-1">
                      {sortBy === column.key ? (
                        sortDirection === 'asc' ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        )
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      )}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-[var(--color-border-subtle)]">
          {loading ? (
            // Loading skeleton
            [...Array(5)].map((_, i) => (
              <tr key={i}>
                {selectable && (
                  <td className="px-3 py-3">
                    <div className="w-4 h-4 bg-[var(--color-bg-hover)] rounded animate-pulse" />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 ${compact ? 'py-2' : 'py-3'} ${column.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                  >
                    <div className="h-4 bg-[var(--color-bg-hover)] rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            // Empty state
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-4 py-12 text-center"
              >
                {emptyContent || (
                  <EmptyState
                    title="Aucune donnée"
                    description="Aucun élément à afficher pour le moment."
                  />
                )}
              </td>
            </tr>
          ) : (
            // Data rows
            data.map((row, index) => {
              const key = getRowKey(row);
              const isSelected = selectedRows.includes(key);

              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row, index)}
                  className={`
                    ${striped && index % 2 === 1 ? 'bg-[var(--color-bg-subtle)]' : ''}
                    ${hoverable ? 'hover:bg-[var(--color-bg-hover)]' : ''}
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${isSelected ? 'bg-[var(--color-brand-primary-bg)]' : ''}
                    transition-colors duration-100
                  `}
                >
                  {/* Selection checkbox */}
                  {selectable && (
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(key)}
                        className="w-4 h-4 rounded border-[var(--color-border-default)]"
                      />
                    </td>
                  )}

                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`
                        px-4 ${compact ? 'py-2' : 'py-3'}
                        text-sm text-[var(--color-text-primary)]
                        ${column.hideOnMobile ? 'hidden md:table-cell' : ''}
                        ${column.align === 'center' ? 'text-center' : ''}
                        ${column.align === 'right' ? 'text-right' : ''}
                      `}
                    >
                      {getCellValue(row, column, index)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// =============================================================================
// STAT CARD COMPONENT
// =============================================================================

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Label */
  label: string;
  
  /** Main value */
  value: string | number;
  
  /** Change indicator */
  change?: {
    value: string | number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  
  /** Icon */
  icon?: ReactNode;
  
  /** Trend data for sparkline */
  trend?: number[];
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  
  /** Color accent */
  accentColor?: string;
  
  /** Footer content */
  footer?: ReactNode;
}

/**
 * Stat Card Component
 * 
 * @example
 * ```tsx
 * <StatCard
 *   label="Revenus"
 *   value="$45,231"
 *   change={{ value: '+12.5%', type: 'increase' }}
 *   icon={<IconDollar />}
 * />
 * ```
 */
export function StatCard({
  label,
  value,
  change,
  icon,
  trend,
  size = 'md',
  accentColor,
  footer,
  className = '',
  ...props
}: StatCardProps): JSX.Element {
  const sizeStyles = {
    sm: { value: 'text-xl', label: 'text-xs', icon: 'w-8 h-8', padding: 'p-3' },
    md: { value: 'text-2xl', label: 'text-sm', icon: 'w-10 h-10', padding: 'p-4' },
    lg: { value: 'text-3xl', label: 'text-base', icon: 'w-12 h-12', padding: 'p-5' },
  };

  const s = sizeStyles[size];

  return (
    <div
      className={`
        bg-[var(--color-bg-secondary)]
        border border-[var(--color-border-subtle)]
        rounded-xl
        ${s.padding}
        ${className}
      `}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Label */}
          <p className={`${s.label} font-medium text-[var(--color-text-secondary)]`}>
            {label}
          </p>

          {/* Value */}
          <p
            className={`${s.value} font-bold text-[var(--color-text-primary)] mt-1`}
            style={{ color: accentColor }}
          >
            {value}
          </p>

          {/* Change */}
          {change && (
            <div
              className={`
                inline-flex items-center gap-1 mt-2
                ${s.label} font-medium
                ${change.type === 'increase' ? 'text-[var(--color-status-success)]' : ''}
                ${change.type === 'decrease' ? 'text-[var(--color-status-error)]' : ''}
                ${change.type === 'neutral' ? 'text-[var(--color-text-tertiary)]' : ''}
              `}
            >
              {change.type === 'increase' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              )}
              {change.type === 'decrease' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
              {change.value}
            </div>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <div
            className={`
              ${s.icon}
              flex items-center justify-center
              rounded-lg
              bg-[var(--color-bg-subtle)]
              text-[var(--color-text-secondary)]
            `}
            style={{ backgroundColor: accentColor ? `${accentColor}20` : undefined, color: accentColor }}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Sparkline trend */}
      {trend && trend.length > 0 && (
        <div className="mt-3 h-8">
          <Sparkline data={trend} color={accentColor} />
        </div>
      )}

      {/* Footer */}
      {footer && (
        <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)]">
          {footer}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SPARKLINE COMPONENT
// =============================================================================

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

function Sparkline({ data, color = 'var(--color-brand-primary)', height = 32 }: SparklineProps): JSX.Element {
  if (data.length < 2) return <></>;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = ((max - value) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// =============================================================================
// KPI GRID COMPONENT
// =============================================================================

export interface KPI {
  id: string;
  label: string;
  value: string | number;
  change?: { value: string; type: 'increase' | 'decrease' | 'neutral' };
  icon?: ReactNode;
  color?: string;
}

export interface KPIGridProps extends HTMLAttributes<HTMLDivElement> {
  kpis: KPI[];
  columns?: 2 | 3 | 4;
}

/**
 * KPI Grid Component
 */
export function KPIGrid({
  kpis,
  columns = 4,
  className = '',
  ...props
}: KPIGridProps): JSX.Element {
  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${colClasses[columns]} gap-4 ${className}`} {...props}>
      {kpis.map((kpi) => (
        <StatCard
          key={kpi.id}
          label={kpi.label}
          value={kpi.value}
          change={kpi.change}
          icon={kpi.icon}
          accentColor={kpi.color}
          size="sm"
        />
      ))}
    </div>
  );
}

// =============================================================================
// EMPTY STATE COMPONENT
// =============================================================================

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Title */
  title: string;
  
  /** Description */
  description?: string;
  
  /** Icon */
  icon?: ReactNode;
  
  /** Action button */
  action?: ReactNode;
  
  /** Size */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Empty State Component
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   title="Aucun projet"
 *   description="Créez votre premier projet pour commencer"
 *   icon={<IconProjects />}
 *   action={<Button>Créer un projet</Button>}
 * />
 * ```
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  size = 'md',
  className = '',
  ...props
}: EmptyStateProps): JSX.Element {
  const sizeStyles = {
    sm: { icon: 'w-10 h-10', title: 'text-base', desc: 'text-sm', gap: 'gap-2' },
    md: { icon: 'w-12 h-12', title: 'text-lg', desc: 'text-sm', gap: 'gap-3' },
    lg: { icon: 'w-16 h-16', title: 'text-xl', desc: 'text-base', gap: 'gap-4' },
  };

  const s = sizeStyles[size];

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${s.gap} ${className}`}
      {...props}
    >
      {icon && (
        <div className={`${s.icon} text-[var(--color-text-tertiary)]`}>
          {icon}
        </div>
      )}
      
      <div>
        <h3 className={`${s.title} font-semibold text-[var(--color-text-primary)]`}>
          {title}
        </h3>
        {description && (
          <p className={`${s.desc} text-[var(--color-text-secondary)] mt-1`}>
            {description}
          </p>
        )}
      </div>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

// =============================================================================
// METRIC COMPARISON COMPONENT
// =============================================================================

export interface MetricComparisonProps extends HTMLAttributes<HTMLDivElement> {
  /** Metric label */
  label: string;
  
  /** Current value */
  current: number;
  
  /** Previous/comparison value */
  previous: number;
  
  /** Format function */
  format?: (value: number) => string;
  
  /** Show percentage change */
  showPercentage?: boolean;
  
  /** Inverse colors (decrease is good) */
  inverseColors?: boolean;
}

/**
 * Metric Comparison Component
 */
export function MetricComparison({
  label,
  current,
  previous,
  format = (v) => v.toLocaleString(),
  showPercentage = true,
  inverseColors = false,
  className = '',
  ...props
}: MetricComparisonProps): JSX.Element {
  const diff = current - previous;
  const percentChange = previous !== 0 ? ((diff / previous) * 100).toFixed(1) : '0';
  const isPositive = diff > 0;
  const isGood = inverseColors ? !isPositive : isPositive;

  return (
    <div className={`${className}`} {...props}>
      <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-bold text-[var(--color-text-primary)]">
          {format(current)}
        </span>
        <span
          className={`
            text-sm font-medium flex items-center gap-0.5
            ${isGood ? 'text-[var(--color-status-success)]' : 'text-[var(--color-status-error)]'}
          `}
        >
          {isPositive ? '↑' : '↓'}
          {showPercentage && `${percentChange}%`}
        </span>
      </div>
      <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
        vs. {format(previous)} précédemment
      </p>
    </div>
  );
}

// =============================================================================
// PROGRESS LIST COMPONENT
// =============================================================================

export interface ProgressItem {
  id: string;
  label: string;
  value: number;
  max?: number;
  color?: string;
}

export interface ProgressListProps extends HTMLAttributes<HTMLDivElement> {
  items: ProgressItem[];
  showValues?: boolean;
  showPercentage?: boolean;
}

/**
 * Progress List Component
 * 
 * Shows multiple progress bars with labels.
 */
export function ProgressList({
  items,
  showValues = true,
  showPercentage = true,
  className = '',
  ...props
}: ProgressListProps): JSX.Element {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {items.map((item) => {
        const max = item.max ?? 100;
        const percentage = Math.min((item.value / max) * 100, 100);

        return (
          <div key={item.id}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {item.label}
              </span>
              <span className="text-sm text-[var(--color-text-secondary)]">
                {showValues && item.value}
                {showValues && showPercentage && ' / '}
                {showPercentage && `${percentage.toFixed(0)}%`}
              </span>
            </div>
            <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: item.color || 'var(--color-brand-primary)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default DataTable;
