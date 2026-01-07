// CHE·NU™ Navigation & Layout System
// Complete navigation, sidebar, header, and layout components

import React, { useState, useCallback, useMemo, createContext, useContext, useRef, useEffect } from 'react';

// ============================================================
// TYPES
// ============================================================

export type SphereCode = 
  | 'PERSONAL'
  | 'BUSINESS'
  | 'GOVERNMENT'
  | 'STUDIO'
  | 'COMMUNITY'
  | 'SOCIAL'
  | 'ENTERTAINMENT'
  | 'TEAM';

export interface Sphere {
  code: SphereCode;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface BureauSection {
  id: string;
  name: string;
  icon: string;
  path: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  badge?: number | string;
  children?: NavItem[];
  onClick?: () => void;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
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
// SPHERE DEFINITIONS (8 SPHERES - FROZEN)
// ============================================================

export const SPHERES: Sphere[] = [
  {
    code: 'PERSONAL',
    name: 'Personal',
    icon: '🏠',
    color: COLORS.sacredGold,
    description: 'Your personal life management',
  },
  {
    code: 'BUSINESS',
    name: 'Business',
    icon: '💼',
    color: COLORS.jungleEmerald,
    description: 'Professional and business operations',
  },
  {
    code: 'GOVERNMENT',
    name: 'Government & Institutions',
    icon: '🏛️',
    color: COLORS.ancientStone,
    description: 'Government relations and institutional matters',
  },
  {
    code: 'STUDIO',
    name: 'Studio de création',
    icon: '🎨',
    color: COLORS.cenoteTurquoise,
    description: 'Creative projects and artistic work',
  },
  {
    code: 'COMMUNITY',
    name: 'Community',
    icon: '👥',
    color: COLORS.shadowMoss,
    description: 'Community engagement and associations',
  },
  {
    code: 'SOCIAL',
    name: 'Social & Media',
    icon: '📱',
    color: '#6366f1',
    description: 'Social media and communications',
  },
  {
    code: 'ENTERTAINMENT',
    name: 'Entertainment',
    icon: '🎬',
    color: '#ec4899',
    description: 'Entertainment and leisure activities',
  },
  {
    code: 'TEAM',
    name: 'My Team',
    icon: '🤝',
    color: COLORS.earthEmber,
    description: 'Team management, IA Labs, Skills & Tools',
  },
];

// ============================================================
// BUREAU SECTIONS (10 SECTIONS - FROZEN)
// ============================================================

export const BUREAU_SECTIONS: BureauSection[] = [
  { id: 'dashboard', name: 'Dashboard', icon: '📊', path: '/dashboard' },
  { id: 'notes', name: 'Notes', icon: '📝', path: '/notes' },
  { id: 'tasks', name: 'Tasks', icon: '✅', path: '/tasks' },
  { id: 'projects', name: 'Projects', icon: '📁', path: '/projects' },
  { id: 'threads', name: 'Threads (.chenu)', icon: '💬', path: '/threads' },
  { id: 'meetings', name: 'Meetings', icon: '📅', path: '/meetings' },
  { id: 'data', name: 'Data / Database', icon: '🗄️', path: '/data' },
  { id: 'agents', name: 'Agents', icon: '🤖', path: '/agents' },
  { id: 'reports', name: 'Reports / History', icon: '📈', path: '/reports' },
  { id: 'budget', name: 'Budget & Governance', icon: '⚖️', path: '/budget' },
];

// ============================================================
// NAVIGATION CONTEXT
// ============================================================

interface NavigationState {
  currentSphere: SphereCode;
  currentSection: string;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
}

interface NavigationContextValue extends NavigationState {
  setSphere: (sphere: SphereCode) => void;
  setSection: (section: string) => void;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NavigationState>({
    currentSphere: 'PERSONAL',
    currentSection: 'dashboard',
    sidebarOpen: true,
    sidebarCollapsed: false,
  });

  const setSphere = useCallback((sphere: SphereCode) => {
    setState((prev) => ({ ...prev, currentSphere: sphere }));
  }, []);

  const setSection = useCallback((section: string) => {
    setState((prev) => ({ ...prev, currentSection: section }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setState((prev) => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  }, []);

  const collapseSidebar = useCallback(() => {
    setState((prev) => ({ ...prev, sidebarCollapsed: true }));
  }, []);

  const expandSidebar = useCallback(() => {
    setState((prev) => ({ ...prev, sidebarCollapsed: false }));
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        ...state,
        setSphere,
        setSection,
        toggleSidebar,
        collapseSidebar,
        expandSidebar,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

// ============================================================
// SPHERE SELECTOR COMPONENT
// ============================================================

interface SphereSelectorProps {
  currentSphere: SphereCode;
  onSelect: (sphere: SphereCode) => void;
  layout?: 'horizontal' | 'vertical' | 'grid';
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SphereSelector: React.FC<SphereSelectorProps> = ({
  currentSphere,
  onSelect,
  layout = 'horizontal',
  showLabels = true,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
  };

  const layoutClasses = {
    horizontal: 'flex flex-row gap-2',
    vertical: 'flex flex-col gap-2',
    grid: 'grid grid-cols-4 gap-2',
  };

  return (
    <div className={layoutClasses[layout]}>
      {SPHERES.map((sphere) => {
        const isActive = currentSphere === sphere.code;
        return (
          <button
            key={sphere.code}
            type="button"
            onClick={() => onSelect(sphere.code)}
            className={`
              relative group flex items-center gap-3 p-2 rounded-xl
              transition-all duration-200
              ${isActive
                ? 'bg-white shadow-lg scale-105'
                : 'hover:bg-white/50 hover:scale-102'
              }
            `}
            title={sphere.description}
          >
            <div
              className={`
                ${sizeClasses[size]} rounded-xl flex items-center justify-center
                transition-transform group-hover:scale-110
              `}
              style={{
                backgroundColor: isActive ? sphere.color : `${sphere.color}20`,
                color: isActive ? 'white' : sphere.color,
              }}
            >
              {sphere.icon}
            </div>
            {showLabels && (
              <div className="flex flex-col items-start">
                <span className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                  {sphere.name}
                </span>
                {layout === 'vertical' && (
                  <span className="text-xs text-gray-400">{sphere.description}</span>
                )}
              </div>
            )}
            {isActive && (
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                style={{ backgroundColor: sphere.color }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

// ============================================================
// SIDEBAR COMPONENT
// ============================================================

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentSection: string;
  onSectionChange: (section: string) => void;
  currentSphere: SphereCode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isCollapsed,
  onToggleCollapse,
  currentSection,
  onSectionChange,
  currentSphere,
  header,
  footer,
}) => {
  const currentSphereData = SPHERES.find((s) => s.code === currentSphere);

  if (!isOpen) return null;

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-200
        transition-all duration-300 z-40
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-gray-100">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentSphereData?.icon}</span>
            <span className="font-semibold text-gray-900">{currentSphereData?.name}</span>
          </div>
        )}
        {isCollapsed && (
          <span className="text-2xl mx-auto">{currentSphereData?.icon}</span>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Custom Header */}
      {header && !isCollapsed && (
        <div className="p-4 border-b border-gray-100">
          {header}
        </div>
      )}

      {/* Bureau Sections */}
      <nav className="p-2 flex-1 overflow-y-auto">
        {BUREAU_SECTIONS.map((section) => {
          const isActive = currentSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1
                transition-all duration-200
                ${isActive
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? section.name : undefined}
            >
              <span className="text-xl">{section.icon}</span>
              {!isCollapsed && (
                <span className="font-medium">{section.name}</span>
              )}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="p-4 border-t border-gray-100">
          {footer}
        </div>
      )}
    </aside>
  );
};

// ============================================================
// HEADER COMPONENT
// ============================================================

interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  showNotifications?: boolean;
  notificationCount?: number;
  user?: {
    name: string;
    avatar?: string;
  };
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftContent,
  rightContent,
  showSearch = true,
  onSearch,
  showNotifications = true,
  notificationCount = 0,
  user,
  onMenuClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {leftContent || (
          <div>
            {title && <h1 className="text-lg font-semibold text-gray-900">{title}</h1>}
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        )}
      </div>

      {/* Center Section - Search */}
      {showSearch && (
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg mx-4">
          <div className={`
            relative flex items-center rounded-lg border transition-colors
            ${isSearchFocused ? 'border-amber-500 ring-2 ring-amber-100' : 'border-gray-200'}
          `}>
            <svg className="w-5 h-5 text-gray-400 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search across all spheres..."
              className="flex-1 px-3 py-2 bg-transparent outline-none text-sm"
            />
            <kbd className="hidden sm:block mr-3 px-2 py-0.5 text-xs bg-gray-100 rounded">
              ⌘K
            </kbd>
          </div>
        </form>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {rightContent}

        {/* Notifications */}
        {showNotifications && (
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
        )}

        {/* Nova (System Intelligence) */}
        <button
          className="p-2 hover:bg-amber-50 rounded-lg group"
          title="Nova - System Intelligence"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
            N
          </div>
        </button>

        {/* User Profile */}
        {user && (
          <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                {user.name.charAt(0)}
              </div>
            )}
            <span className="hidden sm:block text-sm font-medium text-gray-700">
              {user.name}
            </span>
          </button>
        )}
      </div>
    </header>
  );
};

// ============================================================
// BREADCRUMBS COMPONENT
// ============================================================

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = '/',
  className = '',
}) => {
  return (
    <nav className={`flex items-center gap-2 text-sm ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-gray-400">{separator}</span>
          )}
          {item.path ? (
            <a
              href={item.path}
              className="flex items-center gap-1 text-gray-600 hover:text-amber-600 transition-colors"
            >
              {item.icon}
              {item.label}
            </a>
          ) : (
            <span className="flex items-center gap-1 text-gray-900 font-medium">
              {item.icon}
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// ============================================================
// TABS COMPONENT
// ============================================================

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    default: {
      container: 'bg-gray-100 p-1 rounded-lg',
      tab: 'rounded-md',
      active: 'bg-white shadow text-gray-900',
      inactive: 'text-gray-600 hover:text-gray-900',
    },
    pills: {
      container: 'gap-2',
      tab: 'rounded-full',
      active: 'bg-amber-600 text-white',
      inactive: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    },
    underline: {
      container: 'border-b border-gray-200 gap-0',
      tab: 'border-b-2 -mb-px',
      active: 'border-amber-600 text-amber-600',
      inactive: 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300',
    },
  };

  const styles = variantClasses[variant];

  return (
    <div className={`flex ${styles.container} ${fullWidth ? 'w-full' : ''}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          className={`
            ${sizeClasses[size]}
            ${styles.tab}
            ${activeTab === tab.id ? styles.active : styles.inactive}
            flex items-center gap-2 font-medium transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            ${fullWidth ? 'flex-1 justify-center' : ''}
          `}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && (
            <span className={`
              px-1.5 py-0.5 text-xs rounded-full
              ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'}
            `}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

// ============================================================
// DROPDOWN MENU COMPONENT
// ============================================================

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  position?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  position = 'left',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`
            absolute top-full mt-2 min-w-[200px]
            bg-white rounded-lg shadow-lg border border-gray-200
            py-1 z-50
            ${position === 'right' ? 'right-0' : 'left-0'}
          `}
        >
          {items.map((item, index) => {
            if (item.divider) {
              return <div key={index} className="h-px bg-gray-200 my-1" />;
            }

            return (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                disabled={item.disabled}
                className={`
                  w-full px-4 py-2 text-left flex items-center gap-2
                  transition-colors
                  ${item.danger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================
// PAGE LAYOUT COMPONENT
// ============================================================

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  sidebar?: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
  breadcrumbs,
  tabs,
  activeTab,
  onTabChange,
  sidebar,
  className = '',
}) => {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Page Header */}
      {(title || breadcrumbs || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-2" />}
          
          <div className="flex items-center justify-between">
            <div>
              {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
              {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>

          {tabs && activeTab && onTabChange && (
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={onTabChange}
              variant="underline"
              className="mt-4"
            />
          )}
        </div>
      )}

      {/* Page Content */}
      <div className="flex-1 flex overflow-hidden">
        {sidebar && (
          <aside className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            {sidebar}
          </aside>
        )}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

// ============================================================
// APP SHELL COMPONENT
// ============================================================

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const {
    currentSphere,
    currentSection,
    sidebarOpen,
    sidebarCollapsed,
    setSphere,
    setSection,
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
  } = useNavigation();

  const currentSphereData = SPHERES.find((s) => s.code === currentSphere);
  const currentSectionData = BUREAU_SECTIONS.find((s) => s.id === currentSection);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Sphere Bar */}
      <div
        className="h-14 flex items-center justify-between px-4"
        style={{ backgroundColor: `${currentSphereData?.color}15` }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-xl">
            C
          </div>
          <span className="font-bold text-xl" style={{ color: COLORS.uiSlate }}>
            CHE·NU
          </span>
        </div>

        {/* Sphere Selector */}
        <SphereSelector
          currentSphere={currentSphere}
          onSelect={setSphere}
          layout="horizontal"
          showLabels={false}
          size="sm"
        />

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/50 rounded-lg">
            <span className="text-xl">⚙️</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => sidebarCollapsed ? expandSidebar() : collapseSidebar()}
          currentSection={currentSection}
          onSectionChange={setSection}
          currentSphere={currentSphere}
        />

        {/* Content */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            sidebarOpen ? (sidebarCollapsed ? 'ml-20' : 'ml-64') : 'ml-0'
          }`}
        >
          {/* Header */}
          <Header
            title={currentSectionData?.name}
            subtitle={`${currentSphereData?.name} Bureau`}
            onMenuClick={toggleSidebar}
            user={{ name: 'User' }}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  SPHERES,
  BUREAU_SECTIONS,
  NavigationProvider,
  useNavigation,
  SphereSelector,
  Sidebar,
  Header,
  Breadcrumbs,
  Tabs,
  Dropdown,
  PageLayout,
  AppShell,
};
