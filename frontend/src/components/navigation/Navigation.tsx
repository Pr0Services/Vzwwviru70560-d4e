// CHE·NU™ Sidebar & Navigation Components
// Comprehensive navigation system with collapsible sidebar, menu items, and breadcrumbs

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  CSSProperties,
} from 'react';

// ============================================================
// TYPES
// ============================================================

interface NavItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  badgeColor?: string;
  disabled?: boolean;
  children?: NavItem[];
  divider?: boolean;
  section?: string;
}

interface SidebarContextValue {
  isCollapsed: boolean;
  isOpen: boolean;
  isMobile: boolean;
  activeItem: string | null;
  expandedItems: Set<string>;
  setCollapsed: (collapsed: boolean) => void;
  setOpen: (open: boolean) => void;
  setActiveItem: (id: string) => void;
  toggleExpanded: (id: string) => void;
}

interface SidebarProps {
  items: NavItem[];
  header?: ReactNode;
  footer?: ReactNode;
  activeItem?: string;
  defaultCollapsed?: boolean;
  collapsible?: boolean;
  width?: number;
  collapsedWidth?: number;
  breakpoint?: number;
  showToggle?: boolean;
  onItemClick?: (item: NavItem) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
}

interface SidebarHeaderProps {
  logo?: ReactNode;
  logoCollapsed?: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

interface SidebarFooterProps {
  children?: ReactNode;
  showUser?: boolean;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
  };
  onUserClick?: () => void;
  className?: string;
}

interface NavMenuProps {
  items: NavItem[];
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'pills' | 'underline' | 'minimal';
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
  className?: string;
}

interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  maxItems?: number;
  showHome?: boolean;
  homeIcon?: ReactNode;
  onItemClick?: (item: BreadcrumbItem) => void;
  className?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  backButton?: boolean;
  onBack?: () => void;
  tabs?: Array<{ id: string; label: string; badge?: string | number }>;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
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

const DEFAULT_SIDEBAR_WIDTH = 260;
const DEFAULT_COLLAPSED_WIDTH = 72;
const DEFAULT_BREAKPOINT = 1024;

// ============================================================
// CONTEXT
// ============================================================

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  // Sidebar styles
  sidebarOverlay: {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    opacity: 0,
    visibility: 'hidden' as const,
    transition: 'opacity 0.2s, visibility 0.2s',
  },

  sidebarOverlayVisible: {
    opacity: 1,
    visibility: 'visible' as const,
  },

  sidebar: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
    borderRight: `1px solid ${BRAND.ancientStone}15`,
    display: 'flex',
    flexDirection: 'column' as const,
    zIndex: 1000,
    transition: 'width 0.3s ease, transform 0.3s ease',
    overflow: 'hidden',
  },

  sidebarMobile: {
    transform: 'translateX(-100%)',
  },

  sidebarMobileOpen: {
    transform: 'translateX(0)',
  },

  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderBottom: `1px solid ${BRAND.ancientStone}10`,
    minHeight: '64px',
  },

  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    overflow: 'hidden',
  },

  sidebarLogoIcon: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BRAND.sacredGold,
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 700,
    flexShrink: 0,
  },

  sidebarLogoText: {
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    whiteSpace: 'nowrap' as const,
  },

  sidebarTitle: {
    fontSize: '16px',
    fontWeight: 700,
    color: BRAND.uiSlate,
  },

  sidebarSubtitle: {
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  sidebarBody: {
    flex: 1,
    overflowY: 'auto' as const,
    overflowX: 'hidden',
    padding: '8px',
  },

  sidebarFooter: {
    padding: '12px',
    borderTop: `1px solid ${BRAND.ancientStone}10`,
  },

  sidebarToggle: {
    position: 'absolute' as const,
    right: '-12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    border: `1px solid ${BRAND.ancientStone}20`,
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'all 0.2s',
    fontSize: '12px',
    color: BRAND.ancientStone,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },

  sidebarToggleHover: {
    backgroundColor: BRAND.sacredGold,
    borderColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  // Nav item styles
  navSection: {
    marginTop: '16px',
    marginBottom: '8px',
    paddingLeft: '12px',
    paddingRight: '12px',
  },

  navSectionLabel: {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    color: BRAND.ancientStone,
  },

  navDivider: {
    height: '1px',
    backgroundColor: `${BRAND.ancientStone}15`,
    margin: '8px 12px',
  },

  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    color: BRAND.uiSlate,
    textDecoration: 'none',
    width: '100%',
    border: 'none',
    background: 'none',
    textAlign: 'left' as const,
    fontSize: '14px',
  },

  navItemHover: {
    backgroundColor: BRAND.softSand,
  },

  navItemActive: {
    backgroundColor: `${BRAND.sacredGold}15`,
    color: BRAND.earthEmber,
  },

  navItemDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  navItemCollapsed: {
    justifyContent: 'center',
    padding: '10px',
  },

  navItemIcon: {
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
  },

  navItemLabel: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    fontWeight: 500,
  },

  navItemBadge: {
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: 600,
    borderRadius: '100px',
    backgroundColor: BRAND.cenoteTurquoise,
    color: '#ffffff',
  },

  navItemExpander: {
    fontSize: '10px',
    color: BRAND.ancientStone,
    transition: 'transform 0.2s',
  },

  navItemExpanderOpen: {
    transform: 'rotate(180deg)',
  },

  navSubmenu: {
    marginLeft: '20px',
    paddingLeft: '12px',
    borderLeft: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
    transition: 'max-height 0.3s ease, opacity 0.3s ease',
  },

  navSubmenuCollapsed: {
    maxHeight: 0,
    opacity: 0,
  },

  // User profile styles
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },

  userProfileHover: {
    backgroundColor: BRAND.softSand,
  },

  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: BRAND.softSand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    flexShrink: 0,
    overflow: 'hidden',
  },

  userInfo: {
    flex: 1,
    overflow: 'hidden',
  },

  userName: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },

  userEmail: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },

  // Horizontal nav menu styles
  navMenu: {
    display: 'flex',
    alignItems: 'center',
  },

  navMenuVertical: {
    flexDirection: 'column' as const,
    alignItems: 'stretch',
  },

  navMenuHorizontal: {
    flexDirection: 'row' as const,
    gap: '4px',
  },

  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    color: BRAND.uiSlate,
    textDecoration: 'none',
    border: 'none',
    background: 'none',
    fontSize: '14px',
    fontWeight: 500,
    whiteSpace: 'nowrap' as const,
  },

  menuItemPills: {
    borderRadius: '100px',
  },

  menuItemUnderline: {
    borderRadius: 0,
    borderBottom: '2px solid transparent',
    paddingBottom: '10px',
  },

  menuItemUnderlineActive: {
    borderBottomColor: BRAND.sacredGold,
  },

  menuItemMinimal: {
    padding: '8px 12px',
    borderRadius: 0,
  },

  menuItemHover: {
    backgroundColor: BRAND.softSand,
  },

  menuItemActive: {
    backgroundColor: `${BRAND.sacredGold}15`,
    color: BRAND.earthEmber,
  },

  // Breadcrumbs styles
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '8px',
    fontSize: '14px',
  },

  breadcrumbItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: BRAND.ancientStone,
    textDecoration: 'none',
    transition: 'color 0.15s',
    cursor: 'pointer',
  },

  breadcrumbItemHover: {
    color: BRAND.uiSlate,
  },

  breadcrumbItemCurrent: {
    color: BRAND.uiSlate,
    fontWeight: 500,
    cursor: 'default',
  },

  breadcrumbSeparator: {
    color: BRAND.ancientStone,
    opacity: 0.5,
    userSelect: 'none' as const,
  },

  breadcrumbEllipsis: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    cursor: 'pointer',
    color: BRAND.ancientStone,
    transition: 'background-color 0.15s',
  },

  breadcrumbEllipsisHover: {
    backgroundColor: BRAND.softSand,
  },

  // Page header styles
  pageHeader: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    padding: '24px',
    borderBottom: `1px solid ${BRAND.ancientStone}10`,
    backgroundColor: '#ffffff',
  },

  pageHeaderTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '24px',
  },

  pageHeaderContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },

  pageHeaderTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  pageHeaderBackButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}20`,
    background: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s',
    color: BRAND.ancientStone,
    fontSize: '18px',
  },

  pageHeaderBackButtonHover: {
    borderColor: BRAND.sacredGold,
    color: BRAND.sacredGold,
  },

  pageHeaderTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: BRAND.uiSlate,
    margin: 0,
  },

  pageHeaderSubtitle: {
    fontSize: '14px',
    color: BRAND.ancientStone,
  },

  pageHeaderActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  pageHeaderTabs: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    borderBottom: `1px solid ${BRAND.ancientStone}15`,
    marginTop: '8px',
    marginBottom: '-24px',
    marginLeft: '-24px',
    marginRight: '-24px',
    paddingLeft: '24px',
    paddingRight: '24px',
  },

  pageHeaderTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '12px 16px',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    color: BRAND.ancientStone,
    fontWeight: 500,
    fontSize: '14px',
    background: 'none',
    border: 'none',
  },

  pageHeaderTabHover: {
    color: BRAND.uiSlate,
  },

  pageHeaderTabActive: {
    color: BRAND.sacredGold,
    borderBottomColor: BRAND.sacredGold,
  },

  pageHeaderTabBadge: {
    padding: '1px 6px',
    fontSize: '11px',
    fontWeight: 600,
    borderRadius: '100px',
    backgroundColor: `${BRAND.ancientStone}20`,
    color: BRAND.ancientStone,
  },

  pageHeaderTabBadgeActive: {
    backgroundColor: `${BRAND.sacredGold}20`,
    color: BRAND.earthEmber,
  },
};

// ============================================================
// NAV ITEM COMPONENT
// ============================================================

interface NavItemComponentProps {
  item: NavItem;
  isActive: boolean;
  isExpanded: boolean;
  isCollapsed: boolean;
  depth?: number;
  onItemClick: (item: NavItem) => void;
  onToggleExpand: () => void;
}

function NavItemComponent({
  item,
  isActive,
  isExpanded,
  isCollapsed,
  depth = 0,
  onItemClick,
  onToggleExpand,
}: NavItemComponentProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (item.disabled) return;
    if (hasChildren) {
      onToggleExpand();
    } else {
      onItemClick(item);
    }
  };

  if (item.divider) {
    return <div style={styles.navDivider} />;
  }

  return (
    <div>
      <button
        style={{
          ...styles.navItem,
          ...(isHovered && !item.disabled && styles.navItemHover),
          ...(isActive && styles.navItemActive),
          ...(item.disabled && styles.navItemDisabled),
          ...(isCollapsed && styles.navItemCollapsed),
          paddingLeft: isCollapsed ? '10px' : `${12 + depth * 12}px`,
        }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={item.disabled}
      >
        {item.icon && <span style={styles.navItemIcon}>{item.icon}</span>}
        
        {!isCollapsed && (
          <>
            <span style={styles.navItemLabel}>{item.label}</span>
            
            {item.badge !== undefined && (
              <span
                style={{
                  ...styles.navItemBadge,
                  backgroundColor: item.badgeColor || BRAND.cenoteTurquoise,
                }}
              >
                {item.badge}
              </span>
            )}
            
            {hasChildren && (
              <span
                style={{
                  ...styles.navItemExpander,
                  ...(isExpanded && styles.navItemExpanderOpen),
                }}
              >
                ▼
              </span>
            )}
          </>
        )}
      </button>

      {/* Submenu */}
      {hasChildren && !isCollapsed && (
        <div
          style={{
            ...styles.navSubmenu,
            ...(isExpanded ? { maxHeight: '500px', opacity: 1 } : styles.navSubmenuCollapsed),
          }}
        >
          {item.children!.map((child) => (
            <NavItemComponent
              key={child.id}
              item={child}
              isActive={false}
              isExpanded={false}
              isCollapsed={false}
              depth={depth + 1}
              onItemClick={onItemClick}
              onToggleExpand={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// SIDEBAR HEADER COMPONENT
// ============================================================

export function SidebarHeader({
  logo,
  logoCollapsed,
  title,
  subtitle,
  className,
}: SidebarHeaderProps): JSX.Element {
  const { isCollapsed } = useSidebar();

  return (
    <div style={styles.sidebarHeader} className={className}>
      <div style={styles.sidebarLogo}>
        {isCollapsed ? (
          logoCollapsed || logo || <div style={styles.sidebarLogoIcon}>C</div>
        ) : (
          <>
            {logo || <div style={styles.sidebarLogoIcon}>C</div>}
            <div style={styles.sidebarLogoText}>
              {title && <div style={styles.sidebarTitle}>{title}</div>}
              {subtitle && <div style={styles.sidebarSubtitle}>{subtitle}</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SIDEBAR FOOTER COMPONENT
// ============================================================

export function SidebarFooter({
  children,
  showUser = false,
  user,
  onUserClick,
  className,
}: SidebarFooterProps): JSX.Element {
  const { isCollapsed } = useSidebar();
  const [isHovered, setIsHovered] = useState(false);

  if (children) {
    return <div style={styles.sidebarFooter} className={className}>{children}</div>;
  }

  if (!showUser || !user) {
    return <></>;
  }

  return (
    <div style={styles.sidebarFooter} className={className}>
      <div
        style={{
          ...styles.userProfile,
          ...(isHovered && styles.userProfileHover),
          justifyContent: isCollapsed ? 'center' : 'flex-start',
        }}
        onClick={onUserClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={styles.userAvatar}>
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
        
        {!isCollapsed && (
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user.name}</div>
            {user.email && <div style={styles.userEmail}>{user.email}</div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MAIN SIDEBAR COMPONENT
// ============================================================

export function Sidebar({
  items,
  header,
  footer,
  activeItem: controlledActiveItem,
  defaultCollapsed = false,
  collapsible = true,
  width = DEFAULT_SIDEBAR_WIDTH,
  collapsedWidth = DEFAULT_COLLAPSED_WIDTH,
  breakpoint = DEFAULT_BREAKPOINT,
  showToggle = true,
  onItemClick,
  onCollapsedChange,
  className,
}: SidebarProps): JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(controlledActiveItem || null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [toggleHovered, setToggleHovered] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  // Update controlled active item
  useEffect(() => {
    if (controlledActiveItem !== undefined) {
      setActiveItem(controlledActiveItem);
    }
  }, [controlledActiveItem]);

  const handleCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsed(collapsed);
    onCollapsedChange?.(collapsed);
  }, [onCollapsedChange]);

  const toggleExpanded = useCallback((id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleItemClick = useCallback((item: NavItem) => {
    setActiveItem(item.id);
    onItemClick?.(item);
    
    if (item.onClick) {
      item.onClick();
    }
    
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile, onItemClick]);

  const currentWidth = isCollapsed && !isMobile ? collapsedWidth : width;

  const contextValue: SidebarContextValue = {
    isCollapsed: isCollapsed && !isMobile,
    isOpen,
    isMobile,
    activeItem,
    expandedItems,
    setCollapsed: handleCollapsed,
    setOpen: setIsOpen,
    setActiveItem,
    toggleExpanded,
  };

  // Group items by section
  const groupedItems = useMemo(() => {
    const groups: Array<{ section: string | null; items: NavItem[] }> = [];
    let currentGroup: { section: string | null; items: NavItem[] } = { section: null, items: [] };

    items.forEach((item) => {
      if (item.section && item.section !== currentGroup.section) {
        if (currentGroup.items.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = { section: item.section, items: [item] };
      } else {
        currentGroup.items.push(item);
      }
    });

    if (currentGroup.items.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }, [items]);

  return (
    <SidebarContext.Provider value={contextValue}>
      {/* Mobile overlay */}
      {isMobile && (
        <div
          style={{
            ...styles.sidebarOverlay,
            ...(isOpen && styles.sidebarOverlayVisible),
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          ...styles.sidebar,
          width: isMobile ? width : currentWidth,
          ...(isMobile && styles.sidebarMobile),
          ...(isMobile && isOpen && styles.sidebarMobileOpen),
        }}
        className={className}
      >
        {/* Header */}
        {header}

        {/* Body */}
        <nav style={styles.sidebarBody}>
          {groupedItems.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.section && !isCollapsed && (
                <div style={styles.navSection}>
                  <div style={styles.navSectionLabel}>{group.section}</div>
                </div>
              )}
              {group.items.map((item) => (
                <NavItemComponent
                  key={item.id}
                  item={item}
                  isActive={activeItem === item.id}
                  isExpanded={expandedItems.has(item.id)}
                  isCollapsed={isCollapsed && !isMobile}
                  onItemClick={handleItemClick}
                  onToggleExpand={() => toggleExpanded(item.id)}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {footer}

        {/* Toggle button */}
        {collapsible && showToggle && !isMobile && (
          <button
            style={{
              ...styles.sidebarToggle,
              ...(toggleHovered && styles.sidebarToggleHover),
            }}
            onClick={() => handleCollapsed(!isCollapsed)}
            onMouseEnter={() => setToggleHovered(true)}
            onMouseLeave={() => setToggleHovered(false)}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        )}
      </aside>
    </SidebarContext.Provider>
  );
}

// ============================================================
// NAV MENU COMPONENT (Horizontal/Vertical Menu)
// ============================================================

export function NavMenu({
  items,
  orientation = 'horizontal',
  size = 'md',
  variant = 'default',
  activeItem,
  onItemClick,
  className,
}: NavMenuProps): JSX.Element {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const sizeStyles: Record<string, CSSProperties> = {
    sm: { fontSize: '13px', padding: '6px 12px' },
    md: { fontSize: '14px', padding: '8px 16px' },
    lg: { fontSize: '15px', padding: '10px 20px' },
  };

  return (
    <nav
      style={{
        ...styles.navMenu,
        ...(orientation === 'horizontal' ? styles.navMenuHorizontal : styles.navMenuVertical),
      }}
      className={className}
    >
      {items.map((item) => {
        const isActive = activeItem === item.id;
        const isHovered = hoveredItem === item.id;

        return (
          <button
            key={item.id}
            style={{
              ...styles.menuItem,
              ...sizeStyles[size],
              ...(variant === 'pills' && styles.menuItemPills),
              ...(variant === 'underline' && styles.menuItemUnderline),
              ...(variant === 'underline' && isActive && styles.menuItemUnderlineActive),
              ...(variant === 'minimal' && styles.menuItemMinimal),
              ...(isHovered && !item.disabled && styles.menuItemHover),
              ...(isActive && variant !== 'underline' && styles.menuItemActive),
              ...(item.disabled && { opacity: 0.5, cursor: 'not-allowed' }),
            }}
            onClick={() => !item.disabled && onItemClick?.(item)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            disabled={item.disabled}
          >
            {item.icon && <span>{item.icon}</span>}
            {item.label}
            {item.badge !== undefined && (
              <span style={styles.navItemBadge}>{item.badge}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ============================================================
// BREADCRUMBS COMPONENT
// ============================================================

export function Breadcrumbs({
  items,
  separator = '/',
  maxItems = 0,
  showHome = false,
  homeIcon = '🏠',
  onItemClick,
  className,
}: BreadcrumbsProps): JSX.Element {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);

  const visibleItems = useMemo(() => {
    if (maxItems <= 0 || items.length <= maxItems || showHidden) {
      return items;
    }

    const first = items.slice(0, 1);
    const last = items.slice(-Math.floor(maxItems / 2));
    return [...first, { id: 'ellipsis', label: '...', onClick: () => setShowHidden(true) }, ...last];
  }, [items, maxItems, showHidden]);

  return (
    <nav style={styles.breadcrumbs} className={className}>
      {showHome && (
        <>
          <span
            style={{
              ...styles.breadcrumbItem,
              ...(hoveredItem === 'home' && styles.breadcrumbItemHover),
            }}
            onClick={() => onItemClick?.({ id: 'home', label: 'Home' })}
            onMouseEnter={() => setHoveredItem('home')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {homeIcon}
          </span>
          <span style={styles.breadcrumbSeparator}>{separator}</span>
        </>
      )}

      {visibleItems.map((item, index) => {
        const isLast = index === visibleItems.length - 1;
        const isEllipsis = item.id === 'ellipsis';

        return (
          <React.Fragment key={item.id}>
            {isEllipsis ? (
              <span
                style={{
                  ...styles.breadcrumbEllipsis,
                  ...(hoveredItem === item.id && styles.breadcrumbEllipsisHover),
                }}
                onClick={item.onClick}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                ···
              </span>
            ) : (
              <span
                style={{
                  ...styles.breadcrumbItem,
                  ...(isLast && styles.breadcrumbItemCurrent),
                  ...(!isLast && hoveredItem === item.id && styles.breadcrumbItemHover),
                }}
                onClick={() => !isLast && onItemClick?.(item)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </span>
            )}

            {!isLast && <span style={styles.breadcrumbSeparator}>{separator}</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

// ============================================================
// PAGE HEADER COMPONENT
// ============================================================

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  backButton = false,
  onBack,
  tabs,
  activeTab,
  onTabChange,
  className,
}: PageHeaderProps): JSX.Element {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [backHovered, setBackHovered] = useState(false);

  return (
    <header style={styles.pageHeader} className={className}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} />
      )}

      {/* Top row */}
      <div style={styles.pageHeaderTop}>
        <div style={styles.pageHeaderContent}>
          <div style={styles.pageHeaderTitleRow}>
            {backButton && (
              <button
                style={{
                  ...styles.pageHeaderBackButton,
                  ...(backHovered && styles.pageHeaderBackButtonHover),
                }}
                onClick={onBack}
                onMouseEnter={() => setBackHovered(true)}
                onMouseLeave={() => setBackHovered(false)}
              >
                ←
              </button>
            )}
            <h1 style={styles.pageHeaderTitle}>{title}</h1>
          </div>
          {subtitle && <p style={styles.pageHeaderSubtitle}>{subtitle}</p>}
        </div>

        {actions && <div style={styles.pageHeaderActions}>{actions}</div>}
      </div>

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div style={styles.pageHeaderTabs}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isHovered = hoveredTab === tab.id;

            return (
              <button
                key={tab.id}
                style={{
                  ...styles.pageHeaderTab,
                  ...(isHovered && !isActive && styles.pageHeaderTabHover),
                  ...(isActive && styles.pageHeaderTabActive),
                }}
                onClick={() => onTabChange?.(tab.id)}
                onMouseEnter={() => setHoveredTab(tab.id)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                {tab.label}
                {tab.badge !== undefined && (
                  <span
                    style={{
                      ...styles.pageHeaderTabBadge,
                      ...(isActive && styles.pageHeaderTabBadgeActive),
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  NavItem,
  SidebarContextValue,
  SidebarProps,
  SidebarHeaderProps,
  SidebarFooterProps,
  NavMenuProps,
  BreadcrumbItem,
  BreadcrumbsProps,
  PageHeaderProps,
};

export {
  DEFAULT_SIDEBAR_WIDTH,
  DEFAULT_COLLAPSED_WIDTH,
  DEFAULT_BREAKPOINT,
};

export default {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  NavMenu,
  Breadcrumbs,
  PageHeader,
  useSidebar,
};
