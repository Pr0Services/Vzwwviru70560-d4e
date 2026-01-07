// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU DESIGN SYSTEM — LAYOUT COMPONENTS
// AppShell, Sidebar, PageHeader, Container
// ═══════════════════════════════════════════════════════════════════════════════

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface SidebarContextValue {
  isCollapsed: boolean;
  isOpen: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
  openMobile: () => void;
  closeMobile: () => void;
}

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Sidebar component */
  sidebar?: ReactNode;
  
  /** Header component */
  header?: ReactNode;
  
  /** Footer component */
  footer?: ReactNode;
  
  /** Initial sidebar collapsed state */
  defaultCollapsed?: boolean;
  
  /** Fixed header */
  fixedHeader?: boolean;
  
  /** Fixed sidebar */
  fixedSidebar?: boolean;
  
  /** Padding for main content */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  /** Logo/Brand area */
  logo?: ReactNode;
  
  /** Navigation items */
  navigation?: ReactNode;
  
  /** Footer content */
  footer?: ReactNode;
  
  /** Width when expanded */
  width?: number;
  
  /** Width when collapsed */
  collapsedWidth?: number;
}

export interface SidebarItemProps extends HTMLAttributes<HTMLElement> {
  /** Icon */
  icon?: ReactNode;
  
  /** Label text */
  label: string;
  
  /** Is active/selected */
  active?: boolean;
  
  /** Href for link */
  href?: string;
  
  /** Badge content */
  badge?: ReactNode;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Nested items */
  children?: ReactNode;
  
  /** Is expanded (for nested) */
  expanded?: boolean;
  
  /** On click handler */
  onClick?: () => void;
}

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Group label */
  label?: string;
  
  /** Collapsible */
  collapsible?: boolean;
  
  /** Default expanded */
  defaultExpanded?: boolean;
}

export interface PageHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Page title */
  title: string;
  
  /** Subtitle/description */
  subtitle?: string;
  
  /** Breadcrumb items */
  breadcrumbs?: Array<{ label: string; href?: string }>;
  
  /** Actions (buttons, etc.) */
  actions?: ReactNode;
  
  /** Back button */
  backHref?: string;
  
  /** Back button click handler */
  onBack?: () => void;
  
  /** Tabs below header */
  tabs?: ReactNode;
  
  /** Sticky header */
  sticky?: boolean;
}

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Max width */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  
  /** Padding */
  padding?: boolean;
  
  /** Center content */
  centered?: boolean;
}

// =============================================================================
// CONTEXT
// =============================================================================

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within an AppShell');
  }
  return context;
}

// =============================================================================
// STYLES
// =============================================================================

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const maxWidthStyles = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
};

// =============================================================================
// APP SHELL COMPONENT
// =============================================================================

/**
 * AppShell Component
 * 
 * Main application layout wrapper with sidebar, header, and content areas.
 * 
 * @example
 * ```tsx
 * <AppShell
 *   sidebar={<Sidebar />}
 *   header={<Header />}
 *   defaultCollapsed={false}
 * >
 *   <main>Content</main>
 * </AppShell>
 * ```
 */
export function AppShell({
  sidebar,
  header,
  footer,
  defaultCollapsed = false,
  fixedHeader = true,
  fixedSidebar = true,
  padding = 'md',
  className = '',
  children,
  ...props
}: AppShellProps): JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isOpen, setIsOpen] = useState(false); // Mobile menu

  const toggle = useCallback(() => setIsCollapsed((prev) => !prev), []);
  const collapse = useCallback(() => setIsCollapsed(true), []);
  const expand = useCallback(() => setIsCollapsed(false), []);
  const openMobile = useCallback(() => setIsOpen(true), []);
  const closeMobile = useCallback(() => setIsOpen(false), []);

  const contextValue: SidebarContextValue = {
    isCollapsed,
    isOpen,
    toggle,
    collapse,
    expand,
    openMobile,
    closeMobile,
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        className={`
          min-h-screen
          bg-[var(--color-bg-primary)]
          text-[var(--color-text-primary)]
          ${className}
        `}
        {...props}
      >
        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={closeMobile}
          />
        )}

        {/* Sidebar */}
        {sidebar && (
          <aside
            className={`
              ${fixedSidebar ? 'fixed' : 'absolute'}
              top-0 left-0 z-50
              h-full
              bg-[var(--color-bg-secondary)]
              border-r border-[var(--color-border-subtle)]
              transition-all duration-300 ease-in-out
              
              /* Mobile: slide in/out */
              ${isOpen ? 'translate-x-0' : '-translate-x-full'}
              lg:translate-x-0
              
              /* Desktop: collapse/expand */
              ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
            `}
          >
            {sidebar}
          </aside>
        )}

        {/* Main wrapper */}
        <div
          className={`
            flex flex-col min-h-screen
            transition-all duration-300 ease-in-out
            ${sidebar ? (isCollapsed ? 'lg:ml-16' : 'lg:ml-64') : ''}
          `}
        >
          {/* Header */}
          {header && (
            <header
              className={`
                ${fixedHeader ? 'sticky top-0 z-30' : ''}
                bg-[var(--color-bg-secondary)]
                border-b border-[var(--color-border-subtle)]
              `}
            >
              {header}
            </header>
          )}

          {/* Main content */}
          <main className={`flex-1 ${paddingStyles[padding]}`}>
            {children}
          </main>

          {/* Footer */}
          {footer && (
            <footer className="border-t border-[var(--color-border-subtle)]">
              {footer}
            </footer>
          )}
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

// =============================================================================
// SIDEBAR COMPONENT
// =============================================================================

/**
 * Sidebar Component
 * 
 * @example
 * ```tsx
 * <Sidebar
 *   logo={<Logo />}
 *   navigation={
 *     <>
 *       <SidebarItem icon={<IconDashboard />} label="Dashboard" active />
 *       <SidebarItem icon={<IconProjects />} label="Projets" />
 *     </>
 *   }
 *   footer={<UserMenu />}
 * />
 * ```
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  function Sidebar(
    {
      logo,
      navigation,
      footer,
      width = 256,
      collapsedWidth = 64,
      className = '',
      children,
      ...props
    },
    ref
  ) {
    const { isCollapsed } = useSidebar();

    return (
      <nav
        ref={ref}
        className={`
          flex flex-col h-full
          ${className}
        `}
        style={{
          width: isCollapsed ? collapsedWidth : width,
        }}
        {...props}
      >
        {/* Logo area */}
        {logo && (
          <div className="flex items-center h-16 px-4 border-b border-[var(--color-border-subtle)]">
            {logo}
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-2">
          {navigation}
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-[var(--color-border-subtle)] p-2">
            {footer}
          </div>
        )}
      </nav>
    );
  }
);

// =============================================================================
// SIDEBAR ITEM COMPONENT
// =============================================================================

/**
 * Sidebar navigation item
 */
export function SidebarItem({
  icon,
  label,
  active = false,
  href,
  badge,
  disabled = false,
  children,
  expanded,
  onClick,
  className = '',
  ...props
}: SidebarItemProps): JSX.Element {
  const { isCollapsed } = useSidebar();
  const [isExpanded, setIsExpanded] = useState(expanded ?? false);
  const hasChildren = Boolean(children);

  const handleClick = () => {
    if (disabled) return;
    if (hasChildren) {
      setIsExpanded((prev) => !prev);
    }
    onClick?.();
  };

  const content = (
    <>
      {/* Icon */}
      {icon && (
        <span
          className={`
            flex-shrink-0 w-5 h-5
            ${active ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-text-tertiary)]'}
          `}
        >
          {icon}
        </span>
      )}

      {/* Label */}
      {!isCollapsed && (
        <span className="flex-1 truncate">{label}</span>
      )}

      {/* Badge */}
      {!isCollapsed && badge && (
        <span className="ml-auto">{badge}</span>
      )}

      {/* Expand icon */}
      {!isCollapsed && hasChildren && (
        <svg
          className={`
            w-4 h-4 transition-transform duration-200
            ${isExpanded ? 'rotate-180' : ''}
          `}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      )}
    </>
  );

  const itemClasses = `
    flex items-center gap-3
    w-full px-3 py-2.5
    rounded-lg
    text-sm font-medium
    transition-colors duration-150
    ${active
      ? 'bg-[var(--color-brand-primary-bg)] text-[var(--color-brand-primary)]'
      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${isCollapsed ? 'justify-center' : ''}
    ${className}
  `;

  return (
    <div {...props}>
      {href && !hasChildren ? (
        <a href={href} className={itemClasses} onClick={handleClick}>
          {content}
        </a>
      ) : (
        <button
          type="button"
          className={itemClasses}
          onClick={handleClick}
          disabled={disabled}
        >
          {content}
        </button>
      )}

      {/* Nested children */}
      {hasChildren && isExpanded && !isCollapsed && (
        <div className="ml-4 mt-1 space-y-1 border-l border-[var(--color-border-subtle)] pl-3">
          {children}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// SIDEBAR GROUP COMPONENT
// =============================================================================

/**
 * Group of sidebar items with optional label
 */
export function SidebarGroup({
  label,
  collapsible = false,
  defaultExpanded = true,
  className = '',
  children,
  ...props
}: SidebarGroupProps): JSX.Element {
  const { isCollapsed } = useSidebar();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (isCollapsed) {
    return <div className={`space-y-1 ${className}`} {...props}>{children}</div>;
  }

  return (
    <div className={`mb-4 ${className}`} {...props}>
      {label && (
        <button
          type="button"
          onClick={() => collapsible && setIsExpanded((prev) => !prev)}
          className={`
            flex items-center justify-between w-full
            px-3 py-2
            text-xs font-semibold uppercase tracking-wider
            text-[var(--color-text-tertiary)]
            ${collapsible ? 'cursor-pointer hover:text-[var(--color-text-secondary)]' : 'cursor-default'}
          `}
        >
          {label}
          {collapsible && (
            <svg
              className={`w-3 h-3 transition-transform ${isExpanded ? '' : '-rotate-90'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </button>
      )}
      {isExpanded && <div className="space-y-1">{children}</div>}
    </div>
  );
}

// =============================================================================
// SIDEBAR TOGGLE BUTTON
// =============================================================================

/**
 * Button to toggle sidebar collapse state
 */
export function SidebarToggle({ className = '' }: { className?: string }): JSX.Element {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggle}
      className={`
        p-2 rounded-lg
        text-[var(--color-text-secondary)]
        hover:bg-[var(--color-bg-hover)]
        hover:text-[var(--color-text-primary)]
        transition-colors duration-150
        ${className}
      `}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <polyline points="14 9 11 12 14 15" />
      </svg>
    </button>
  );
}

// =============================================================================
// MOBILE MENU BUTTON
// =============================================================================

/**
 * Button to open mobile sidebar
 */
export function MobileMenuButton({ className = '' }: { className?: string }): JSX.Element {
  const { openMobile } = useSidebar();

  return (
    <button
      type="button"
      onClick={openMobile}
      className={`
        lg:hidden
        p-2 rounded-lg
        text-[var(--color-text-secondary)]
        hover:bg-[var(--color-bg-hover)]
        hover:text-[var(--color-text-primary)]
        transition-colors duration-150
        ${className}
      `}
      aria-label="Open menu"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}

// =============================================================================
// PAGE HEADER COMPONENT
// =============================================================================

/**
 * Page Header Component
 * 
 * @example
 * ```tsx
 * <PageHeader
 *   title="Dashboard"
 *   subtitle="Vue d'ensemble de vos projets"
 *   breadcrumbs={[
 *     { label: 'Accueil', href: '/' },
 *     { label: 'Dashboard' },
 *   ]}
 *   actions={
 *     <Button variant="primary" leftIcon={<IconPlus />}>
 *       Nouveau projet
 *     </Button>
 *   }
 * />
 * ```
 */
export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  backHref,
  onBack,
  tabs,
  sticky = false,
  className = '',
  ...props
}: PageHeaderProps): JSX.Element {
  const showBack = backHref || onBack;

  return (
    <header
      className={`
        ${sticky ? 'sticky top-0 z-20 bg-[var(--color-bg-primary)]' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)] mb-2">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-[var(--color-text-secondary)]">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Main header row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Back button */}
          {showBack && (
            <a
              href={backHref}
              onClick={(e) => {
                if (onBack) {
                  e.preventDefault();
                  onBack();
                }
              }}
              className="
                p-2 -ml-2 rounded-lg
                text-[var(--color-text-secondary)]
                hover:bg-[var(--color-bg-hover)]
                hover:text-[var(--color-text-primary)]
                transition-colors
              "
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </a>
          )}

          {/* Title & subtitle */}
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>

      {/* Tabs */}
      {tabs && <div className="mt-4">{tabs}</div>}
    </header>
  );
}

// =============================================================================
// CONTAINER COMPONENT
// =============================================================================

/**
 * Container Component
 * 
 * Constrains content width and adds consistent padding.
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  function Container(
    {
      maxWidth = 'xl',
      padding = true,
      centered = true,
      className = '',
      children,
      ...props
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={`
          w-full
          ${maxWidthStyles[maxWidth]}
          ${padding ? 'px-4 sm:px-6 lg:px-8' : ''}
          ${centered ? 'mx-auto' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// =============================================================================
// SECTION COMPONENT
// =============================================================================

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  /** Section title */
  title?: string;
  
  /** Section description */
  description?: string;
  
  /** Actions */
  actions?: ReactNode;
  
  /** Padding */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Section Component
 * 
 * Groups related content with optional header.
 */
export function Section({
  title,
  description,
  actions,
  padding = 'md',
  className = '',
  children,
  ...props
}: SectionProps): JSX.Element {
  return (
    <section className={`${paddingStyles[padding]} ${className}`} {...props}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

// =============================================================================
// GRID COMPONENT
// =============================================================================

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns */
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  
  /** Gap between items */
  gap?: 'none' | 'sm' | 'md' | 'lg';
  
  /** Responsive columns (sm, md, lg breakpoints) */
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
}

const gapStyles = {
  none: 'gap-0',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

/**
 * Grid Component
 * 
 * CSS Grid layout helper.
 */
export function Grid({
  cols = 1,
  gap = 'md',
  responsive,
  className = '',
  children,
  ...props
}: GridProps): JSX.Element {
  const colClasses = responsive
    ? `grid-cols-1 ${responsive.sm ? `sm:grid-cols-${responsive.sm}` : ''} ${responsive.md ? `md:grid-cols-${responsive.md}` : ''} ${responsive.lg ? `lg:grid-cols-${responsive.lg}` : ''}`
    : `grid-cols-${cols}`;

  return (
    <div
      className={`grid ${colClasses} ${gapStyles[gap]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default AppShell;
