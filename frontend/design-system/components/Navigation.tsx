// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — NAVIGATION COMPONENTS
// Tabs, Breadcrumbs, Menu, Pagination
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  forwardRef,
  createContext,
  useContext,
  useState,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
  type KeyboardEvent,
} from 'react';

// =============================================================================
// TABS TYPES
// =============================================================================

export type TabsVariant = 'line' | 'enclosed' | 'pills' | 'soft';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsOrientation = 'horizontal' | 'vertical';

export interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant: TabsVariant;
  size: TabsSize;
  orientation: TabsOrientation;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Default active tab */
  defaultTab?: string;
  
  /** Controlled active tab */
  activeTab?: string;
  
  /** On change callback */
  onChange?: (tabId: string) => void;
  
  /** Visual variant */
  variant?: TabsVariant;
  
  /** Size */
  size?: TabsSize;
  
  /** Orientation */
  orientation?: TabsOrientation;
  
  /** Full width tabs */
  fullWidth?: boolean;
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {}

export interface TabProps extends HTMLAttributes<HTMLButtonElement> {
  /** Tab identifier */
  id: string;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Icon */
  icon?: ReactNode;
  
  /** Badge/count */
  badge?: ReactNode;
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Panel identifier (matches tab id) */
  id: string;
}

// =============================================================================
// TABS CONTEXT
// =============================================================================

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
}

// =============================================================================
// TABS STYLES
// =============================================================================

const tabListVariantStyles: Record<TabsVariant, string> = {
  line: 'border-b border-[var(--color-border-default)]',
  enclosed: 'border-b border-[var(--color-border-default)]',
  pills: 'gap-2',
  soft: 'bg-[var(--color-bg-subtle)] rounded-lg p-1 gap-1',
};

const tabVariantStyles: Record<TabsVariant, { base: string; active: string; inactive: string }> = {
  line: {
    base: 'relative pb-3 px-4 -mb-px border-b-2 border-transparent',
    active: 'border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]',
    inactive: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)]',
  },
  enclosed: {
    base: 'px-4 py-2 rounded-t-lg border border-transparent -mb-px',
    active: 'bg-[var(--color-bg-secondary)] border-[var(--color-border-default)] border-b-[var(--color-bg-secondary)] text-[var(--color-text-primary)]',
    inactive: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]',
  },
  pills: {
    base: 'px-4 py-2 rounded-full',
    active: 'bg-[var(--color-brand-primary)] text-white',
    inactive: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]',
  },
  soft: {
    base: 'px-4 py-2 rounded-md flex-1 text-center',
    active: 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-sm',
    inactive: 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
  },
};

const tabSizeStyles: Record<TabsSize, string> = {
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
};

// =============================================================================
// TABS COMPONENT
// =============================================================================

/**
 * Tabs Container
 * 
 * @example
 * ```tsx
 * <Tabs defaultTab="tab1">
 *   <TabList>
 *     <Tab id="tab1">Tab 1</Tab>
 *     <Tab id="tab2">Tab 2</Tab>
 *   </TabList>
 *   <TabPanel id="tab1">Content 1</TabPanel>
 *   <TabPanel id="tab2">Content 2</TabPanel>
 * </Tabs>
 * ```
 */
export function Tabs({
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'line',
  size = 'md',
  orientation = 'horizontal',
  fullWidth = false,
  className = '',
  children,
  ...props
}: TabsProps): JSX.Element {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || '');

  const activeTab = controlledActiveTab ?? internalActiveTab;

  const setActiveTab = useCallback(
    (tabId: string) => {
      if (controlledActiveTab === undefined) {
        setInternalActiveTab(tabId);
      }
      onChange?.(tabId);
    },
    [controlledActiveTab, onChange]
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant, size, orientation }}>
      <div
        className={`
          ${orientation === 'vertical' ? 'flex gap-4' : ''}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/**
 * Tab List Container
 */
export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  function TabList({ className = '', children, ...props }, ref) {
    const { variant, orientation } = useTabsContext();

    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        className={`
          flex
          ${orientation === 'vertical' ? 'flex-col' : 'flex-row items-center'}
          ${tabListVariantStyles[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/**
 * Individual Tab
 */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  function Tab(
    { id, disabled = false, icon, badge, className = '', children, ...props },
    ref
  ) {
    const { activeTab, setActiveTab, variant, size } = useTabsContext();
    const isActive = activeTab === id;
    const styles = tabVariantStyles[variant];

    const handleClick = () => {
      if (!disabled) {
        setActiveTab(id);
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={`tab-${id}`}
        aria-selected={isActive}
        aria-controls={`panel-${id}`}
        tabIndex={isActive ? 0 : -1}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`
          inline-flex items-center justify-center gap-2
          font-medium
          transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${styles.base}
          ${isActive ? styles.active : styles.inactive}
          ${tabSizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
        {badge && (
          <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-[var(--color-bg-subtle)]">
            {badge}
          </span>
        )}
      </button>
    );
  }
);

/**
 * Tab Panel
 */
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  function TabPanel({ id, className = '', children, ...props }, ref) {
    const { activeTab } = useTabsContext();
    const isActive = activeTab === id;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`panel-${id}`}
        aria-labelledby={`tab-${id}`}
        tabIndex={0}
        className={`mt-4 focus:outline-none ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// =============================================================================
// BREADCRUMB TYPES
// =============================================================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Breadcrumb items */
  items: BreadcrumbItem[];
  
  /** Separator */
  separator?: ReactNode;
  
  /** Max items to show (collapses middle items) */
  maxItems?: number;
  
  /** Size */
  size?: 'sm' | 'md' | 'lg';
}

// =============================================================================
// BREADCRUMB COMPONENT
// =============================================================================

const defaultSeparator = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/**
 * Breadcrumb Component
 * 
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Current Page' },
 *   ]}
 * />
 * ```
 */
export function Breadcrumb({
  items,
  separator = defaultSeparator,
  maxItems,
  size = 'md',
  className = '',
  ...props
}: BreadcrumbProps): JSX.Element {
  const sizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Collapse items if maxItems is set
  let displayItems = items;
  let hasCollapsed = false;

  if (maxItems && items.length > maxItems) {
    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 1));
    displayItems = [firstItem, { label: '...' }, ...lastItems];
    hasCollapsed = true;
  }

  return (
    <nav aria-label="Breadcrumb" className={className} {...props}>
      <ol className={`flex items-center gap-2 ${sizeStyles[size]}`}>
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isCollapsed = hasCollapsed && index === 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-[var(--color-text-tertiary)]">
                  {separator}
                </span>
              )}

              {isCollapsed ? (
                <span className="text-[var(--color-text-tertiary)]">...</span>
              ) : isLast ? (
                <span
                  className="font-medium text-[var(--color-text-primary)]"
                  aria-current="page"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  onClick={item.onClick}
                  className="
                    text-[var(--color-text-secondary)]
                    hover:text-[var(--color-text-primary)]
                    hover:underline
                    transition-colors duration-150
                  "
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="
                    text-[var(--color-text-secondary)]
                    hover:text-[var(--color-text-primary)]
                    hover:underline
                    transition-colors duration-150
                  "
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// =============================================================================
// PAGINATION TYPES
// =============================================================================

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  /** Current page (1-indexed) */
  currentPage: number;
  
  /** Total number of pages */
  totalPages: number;
  
  /** On page change callback */
  onPageChange: (page: number) => void;
  
  /** Number of sibling pages to show */
  siblingCount?: number;
  
  /** Show first/last buttons */
  showFirstLast?: boolean;
  
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Variant */
  variant?: 'default' | 'simple';
}

// =============================================================================
// PAGINATION COMPONENT
// =============================================================================

/**
 * Generate pagination range
 */
function usePaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | 'ellipsis')[] {
  const totalNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 ellipsis

  if (totalNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, 'ellipsis', totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [1, 'ellipsis', ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
}

/**
 * Pagination Component
 * 
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={10}
 *   onPageChange={setCurrentPage}
 * />
 * ```
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}: PaginationProps): JSX.Element {
  const paginationRange = usePaginationRange(currentPage, totalPages, siblingCount);

  const sizeStyles = {
    sm: { button: 'w-7 h-7 text-xs', nav: 'gap-1' },
    md: { button: 'w-9 h-9 text-sm', nav: 'gap-1.5' },
    lg: { button: 'w-11 h-11 text-base', nav: 'gap-2' },
  };

  const buttonBase = `
    inline-flex items-center justify-center
    rounded-md
    font-medium
    transition-colors duration-150
    focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)]
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const buttonInactive = `
    text-[var(--color-text-secondary)]
    hover:text-[var(--color-text-primary)]
    hover:bg-[var(--color-bg-subtle)]
  `;

  const buttonActive = `
    bg-[var(--color-brand-primary)]
    text-white
  `;

  if (variant === 'simple') {
    return (
      <nav
        aria-label="Pagination"
        className={`flex items-center justify-between ${className}`}
        {...props}
      >
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${buttonBase} ${buttonInactive} px-3 ${sizeStyles[size].button}`}
        >
          Précédent
        </button>
        <span className="text-sm text-[var(--color-text-secondary)]">
          Page {currentPage} sur {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${buttonBase} ${buttonInactive} px-3 ${sizeStyles[size].button}`}
        >
          Suivant
        </button>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center ${sizeStyles[size].nav} ${className}`}
      {...props}
    >
      {/* First page */}
      {showFirstLast && (
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="Première page"
          className={`${buttonBase} ${buttonInactive} ${sizeStyles[size].button}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="11 17 6 12 11 7" />
            <polyline points="18 17 13 12 18 7" />
          </svg>
        </button>
      )}

      {/* Previous page */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Page précédente"
        className={`${buttonBase} ${buttonInactive} ${sizeStyles[size].button}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Page numbers */}
      {paginationRange.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className={`${sizeStyles[size].button} flex items-center justify-center text-[var(--color-text-tertiary)]`}
            >
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`
              ${buttonBase}
              ${sizeStyles[size].button}
              ${currentPage === page ? buttonActive : buttonInactive}
            `}
          >
            {page}
          </button>
        );
      })}

      {/* Next page */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
        className={`${buttonBase} ${buttonInactive} ${sizeStyles[size].button}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Last page */}
      {showFirstLast && (
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Dernière page"
          className={`${buttonBase} ${buttonInactive} ${sizeStyles[size].button}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
          </svg>
        </button>
      )}
    </nav>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export { Tabs as default };
