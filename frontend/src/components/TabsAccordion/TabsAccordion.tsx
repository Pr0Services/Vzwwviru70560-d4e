// CHE·NU™ Tabs & Accordion Components
// Comprehensive tabbed and collapsible content system

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  KeyboardEvent,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type TabsOrientation = 'horizontal' | 'vertical';
type TabsVariant = 'default' | 'pills' | 'underline' | 'enclosed' | 'soft';
type TabsSize = 'sm' | 'md' | 'lg';

interface TabItem {
  id: string;
  label: string | ReactNode;
  content: ReactNode;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  closable?: boolean;
}

interface TabsContextValue {
  activeId: string;
  setActiveId: (id: string) => void;
  orientation: TabsOrientation;
  variant: TabsVariant;
  size: TabsSize;
}

interface TabsProps {
  items: TabItem[];
  defaultActiveId?: string;
  activeId?: string;
  orientation?: TabsOrientation;
  variant?: TabsVariant;
  size?: TabsSize;
  fitted?: boolean;
  lazy?: boolean;
  animated?: boolean;
  destroyInactiveContent?: boolean;
  onChange?: (id: string) => void;
  onClose?: (id: string) => void;
  className?: string;
  tabListClassName?: string;
  tabPanelClassName?: string;
  renderTabLabel?: (item: TabItem, isActive: boolean) => ReactNode;
}

interface AccordionItem {
  id: string;
  title: string | ReactNode;
  content: ReactNode;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultExpandedIds?: string[];
  expandedIds?: string[];
  allowMultiple?: boolean;
  allowToggle?: boolean;
  animated?: boolean;
  variant?: 'default' | 'bordered' | 'separated' | 'flush';
  size?: 'sm' | 'md' | 'lg';
  onChange?: (expandedIds: string[]) => void;
  renderTitle?: (item: AccordionItem, isExpanded: boolean) => ReactNode;
  className?: string;
  itemClassName?: string;
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
// CONTEXT
// ============================================================

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component');
  }
  return context;
}

// ============================================================
// STYLES - TABS
// ============================================================

const tabStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
  },

  containerVertical: {
    flexDirection: 'row' as const,
  },

  tabList: {
    display: 'flex',
    gap: '4px',
    borderBottom: `1px solid ${BRAND.ancientStone}20`,
    marginBottom: '16px',
  },

  tabListVertical: {
    flexDirection: 'column' as const,
    borderBottom: 'none',
    borderRight: `1px solid ${BRAND.ancientStone}20`,
    marginBottom: 0,
    marginRight: '16px',
    paddingRight: '4px',
  },

  tabListPills: {
    backgroundColor: BRAND.softSand,
    padding: '4px',
    borderRadius: '8px',
    border: 'none',
  },

  tabListUnderline: {
    gap: '16px',
  },

  tabListEnclosed: {
    borderBottom: 'none',
    gap: 0,
  },

  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.ancientStone,
    transition: 'all 0.2s',
    position: 'relative' as const,
    whiteSpace: 'nowrap' as const,
  },

  tabSm: {
    padding: '6px 12px',
    fontSize: '13px',
  },

  tabLg: {
    padding: '12px 20px',
    fontSize: '15px',
  },

  tabActive: {
    color: BRAND.uiSlate,
  },

  tabDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  tabFitted: {
    flex: 1,
    justifyContent: 'center',
  },

  // Variant: Default - underline indicator
  tabDefaultActive: {
    color: BRAND.uiSlate,
  },

  tabDefaultIndicator: {
    position: 'absolute' as const,
    bottom: '-1px',
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: BRAND.sacredGold,
    transition: 'all 0.2s',
  },

  // Variant: Pills
  tabPills: {
    borderRadius: '6px',
  },

  tabPillsActive: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  // Variant: Underline
  tabUnderline: {
    padding: '10px 4px',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px',
  },

  tabUnderlineActive: {
    borderBottomColor: BRAND.sacredGold,
    color: BRAND.uiSlate,
  },

  // Variant: Enclosed
  tabEnclosed: {
    border: `1px solid transparent`,
    borderRadius: '8px 8px 0 0',
    marginBottom: '-1px',
    backgroundColor: 'transparent',
  },

  tabEnclosedActive: {
    backgroundColor: '#ffffff',
    borderColor: `${BRAND.ancientStone}20`,
    borderBottomColor: '#ffffff',
    color: BRAND.uiSlate,
  },

  // Variant: Soft
  tabSoft: {
    borderRadius: '6px',
    backgroundColor: 'transparent',
  },

  tabSoftActive: {
    backgroundColor: `${BRAND.sacredGold}15`,
    color: BRAND.earthEmber,
  },

  tabIcon: {
    fontSize: '16px',
  },

  tabBadge: {
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor: `${BRAND.cenoteTurquoise}20`,
    color: BRAND.shadowMoss,
  },

  tabClose: {
    marginLeft: '4px',
    padding: '2px',
    borderRadius: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: BRAND.ancientStone,
    lineHeight: 1,
    transition: 'all 0.2s',
  },

  tabCloseHover: {
    backgroundColor: `${BRAND.earthEmber}20`,
    color: BRAND.earthEmber,
  },

  tabPanel: {
    flex: 1,
  },

  tabPanelAnimated: {
    animation: 'fadeIn 0.2s ease-out',
  },
};

// ============================================================
// STYLES - ACCORDION
// ============================================================

const accordionStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0',
  },

  containerSeparated: {
    gap: '8px',
  },

  item: {
    border: `1px solid ${BRAND.ancientStone}20`,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },

  itemFirst: {
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },

  itemLast: {
    borderBottomLeftRadius: '8px',
    borderBottomRightRadius: '8px',
  },

  itemBordered: {
    borderRadius: '8px',
    marginBottom: '-1px',
  },

  itemSeparated: {
    borderRadius: '8px',
  },

  itemFlush: {
    border: 'none',
    borderBottom: `1px solid ${BRAND.ancientStone}20`,
    borderRadius: 0,
  },

  itemExpanded: {
    // No additional styles needed
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '16px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    textAlign: 'left' as const,
    fontSize: '15px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    transition: 'all 0.2s',
  },

  headerSm: {
    padding: '12px 16px',
    fontSize: '14px',
  },

  headerLg: {
    padding: '20px',
    fontSize: '16px',
  },

  headerHover: {
    backgroundColor: `${BRAND.ancientStone}05`,
  },

  headerDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  headerExpanded: {
    backgroundColor: `${BRAND.softSand}50`,
  },

  headerIcon: {
    marginRight: '12px',
    fontSize: '18px',
  },

  headerTitle: {
    flex: 1,
  },

  headerBadge: {
    marginLeft: '12px',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: 600,
    backgroundColor: `${BRAND.cenoteTurquoise}20`,
    color: BRAND.shadowMoss,
  },

  headerChevron: {
    marginLeft: '12px',
    fontSize: '12px',
    color: BRAND.ancientStone,
    transition: 'transform 0.2s',
  },

  headerChevronExpanded: {
    transform: 'rotate(180deg)',
  },

  content: {
    overflow: 'hidden',
    transition: 'height 0.2s ease-out',
  },

  contentInner: {
    padding: '0 16px 16px',
    color: BRAND.ancientStone,
    fontSize: '14px',
    lineHeight: 1.6,
  },

  contentInnerSm: {
    padding: '0 16px 12px',
    fontSize: '13px',
  },

  contentInnerLg: {
    padding: '0 20px 20px',
    fontSize: '15px',
  },
};

// ============================================================
// TABS COMPONENT
// ============================================================

export function Tabs({
  items,
  defaultActiveId,
  activeId: controlledActiveId,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  fitted = false,
  lazy = false,
  animated = true,
  destroyInactiveContent = false,
  onChange,
  onClose,
  className,
  tabListClassName,
  tabPanelClassName,
  renderTabLabel,
}: TabsProps): JSX.Element {
  const [internalActiveId, setInternalActiveId] = useState(
    defaultActiveId || items[0]?.id || ''
  );
  const [visitedIds, setVisitedIds] = useState<Set<string>>(new Set([internalActiveId]));
  const tabListRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;

  // Track visited tabs for lazy loading
  useEffect(() => {
    if (lazy) {
      setVisitedIds((prev) => new Set(prev).add(activeId));
    }
  }, [activeId, lazy]);

  // Handle tab change
  const handleTabChange = useCallback((id: string) => {
    const item = items.find((i) => i.id === id);
    if (item?.disabled) return;

    if (controlledActiveId === undefined) {
      setInternalActiveId(id);
    }
    onChange?.(id);
  }, [items, controlledActiveId, onChange]);

  // Handle close
  const handleClose = useCallback((id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onClose?.(id);
  }, [onClose]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const currentIndex = items.findIndex((item) => item.id === activeId);
    if (currentIndex === -1) return;

    const isHorizontal = orientation === 'horizontal';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';

    let newIndex = currentIndex;

    if (event.key === prevKey) {
      event.preventDefault();
      newIndex = currentIndex - 1;
      while (newIndex >= 0 && items[newIndex].disabled) newIndex--;
      if (newIndex < 0) newIndex = currentIndex;
    } else if (event.key === nextKey) {
      event.preventDefault();
      newIndex = currentIndex + 1;
      while (newIndex < items.length && items[newIndex].disabled) newIndex++;
      if (newIndex >= items.length) newIndex = currentIndex;
    } else if (event.key === 'Home') {
      event.preventDefault();
      newIndex = items.findIndex((item) => !item.disabled);
    } else if (event.key === 'End') {
      event.preventDefault();
      for (let i = items.length - 1; i >= 0; i--) {
        if (!items[i].disabled) {
          newIndex = i;
          break;
        }
      }
    }

    if (newIndex !== currentIndex) {
      handleTabChange(items[newIndex].id);
    }
  }, [items, activeId, orientation, handleTabChange]);

  // Update indicator position for default variant
  useEffect(() => {
    if (variant !== 'default' || !tabListRef.current || !indicatorRef.current) return;

    const activeTab = tabListRef.current.querySelector(`[data-tab-id="${activeId}"]`);
    if (!activeTab) return;

    const tabRect = activeTab.getBoundingClientRect();
    const listRect = tabListRef.current.getBoundingClientRect();

    if (orientation === 'horizontal') {
      indicatorRef.current.style.width = `${tabRect.width}px`;
      indicatorRef.current.style.left = `${tabRect.left - listRect.left}px`;
      indicatorRef.current.style.height = '2px';
      indicatorRef.current.style.bottom = '-1px';
      indicatorRef.current.style.top = 'auto';
    } else {
      indicatorRef.current.style.height = `${tabRect.height}px`;
      indicatorRef.current.style.top = `${tabRect.top - listRect.top}px`;
      indicatorRef.current.style.width = '2px';
      indicatorRef.current.style.right = '-1px';
      indicatorRef.current.style.left = 'auto';
    }
  }, [activeId, variant, orientation, items]);

  // Get tab styles based on variant
  const getTabStyle = (item: TabItem, isActive: boolean): React.CSSProperties => {
    let style: React.CSSProperties = { ...tabStyles.tab };

    if (size === 'sm') style = { ...style, ...tabStyles.tabSm };
    if (size === 'lg') style = { ...style, ...tabStyles.tabLg };
    if (fitted) style = { ...style, ...tabStyles.tabFitted };
    if (item.disabled) style = { ...style, ...tabStyles.tabDisabled };

    switch (variant) {
      case 'pills':
        style = { ...style, ...tabStyles.tabPills };
        if (isActive) style = { ...style, ...tabStyles.tabPillsActive };
        break;
      case 'underline':
        style = { ...style, ...tabStyles.tabUnderline };
        if (isActive) style = { ...style, ...tabStyles.tabUnderlineActive };
        break;
      case 'enclosed':
        style = { ...style, ...tabStyles.tabEnclosed };
        if (isActive) style = { ...style, ...tabStyles.tabEnclosedActive };
        break;
      case 'soft':
        style = { ...style, ...tabStyles.tabSoft };
        if (isActive) style = { ...style, ...tabStyles.tabSoftActive };
        break;
      default:
        if (isActive) style = { ...style, ...tabStyles.tabDefaultActive };
    }

    return style;
  };

  // Get tab list styles
  const tabListStyle: React.CSSProperties = {
    ...tabStyles.tabList,
    ...(orientation === 'vertical' && tabStyles.tabListVertical),
    ...(variant === 'pills' && tabStyles.tabListPills),
    ...(variant === 'underline' && tabStyles.tabListUnderline),
    ...(variant === 'enclosed' && tabStyles.tabListEnclosed),
  };

  const activeItem = items.find((item) => item.id === activeId);

  const contextValue: TabsContextValue = {
    activeId,
    setActiveId: handleTabChange,
    orientation,
    variant,
    size,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        style={{
          ...tabStyles.container,
          ...(orientation === 'vertical' && tabStyles.containerVertical),
        }}
        className={className}
      >
        {/* Tab List */}
        <div
          ref={tabListRef}
          role="tablist"
          aria-orientation={orientation}
          style={{ ...tabListStyle, position: 'relative' }}
          className={tabListClassName}
          onKeyDown={handleKeyDown}
        >
          {items.map((item) => {
            const isActive = item.id === activeId;

            return (
              <button
                key={item.id}
                role="tab"
                data-tab-id={item.id}
                aria-selected={isActive}
                aria-controls={`panel-${item.id}`}
                tabIndex={isActive ? 0 : -1}
                disabled={item.disabled}
                style={getTabStyle(item, isActive)}
                onClick={() => handleTabChange(item.id)}
              >
                {renderTabLabel ? (
                  renderTabLabel(item, isActive)
                ) : (
                  <>
                    {item.icon && <span style={tabStyles.tabIcon}>{item.icon}</span>}
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span style={tabStyles.tabBadge}>{item.badge}</span>
                    )}
                    {item.closable && onClose && (
                      <button
                        style={tabStyles.tabClose}
                        onClick={(e) => handleClose(item.id, e)}
                        aria-label={`Close ${item.label}`}
                      >
                        ×
                      </button>
                    )}
                  </>
                )}
              </button>
            );
          })}

          {/* Animated indicator for default variant */}
          {variant === 'default' && (
            <div
              ref={indicatorRef}
              style={{
                position: 'absolute',
                backgroundColor: BRAND.sacredGold,
                transition: 'all 0.2s ease-out',
              }}
            />
          )}
        </div>

        {/* Tab Panels */}
        <div style={tabStyles.tabPanel} className={tabPanelClassName}>
          {items.map((item) => {
            const isActive = item.id === activeId;
            const shouldRender = !lazy || visitedIds.has(item.id);
            const shouldShow = isActive && shouldRender;

            if (destroyInactiveContent && !isActive) return null;
            if (!shouldRender) return null;

            return (
              <div
                key={item.id}
                role="tabpanel"
                id={`panel-${item.id}`}
                aria-labelledby={item.id}
                hidden={!isActive}
                style={animated && isActive ? tabStyles.tabPanelAnimated : undefined}
              >
                {item.content}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </TabsContext.Provider>
  );
}

// ============================================================
// ACCORDION COMPONENT
// ============================================================

export function Accordion({
  items,
  defaultExpandedIds = [],
  expandedIds: controlledExpandedIds,
  allowMultiple = false,
  allowToggle = true,
  animated = true,
  variant = 'default',
  size = 'md',
  onChange,
  renderTitle,
  className,
  itemClassName,
}: AccordionProps): JSX.Element {
  const [internalExpandedIds, setInternalExpandedIds] = useState<Set<string>>(
    () => new Set(defaultExpandedIds)
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const contentRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const expandedIds = controlledExpandedIds !== undefined
    ? new Set(controlledExpandedIds)
    : internalExpandedIds;

  // Handle toggle
  const handleToggle = useCallback((id: string) => {
    const item = items.find((i) => i.id === id);
    if (item?.disabled) return;

    let newExpandedIds: Set<string>;

    if (expandedIds.has(id)) {
      if (!allowToggle && expandedIds.size === 1) return;
      newExpandedIds = new Set(expandedIds);
      newExpandedIds.delete(id);
    } else {
      if (allowMultiple) {
        newExpandedIds = new Set(expandedIds);
        newExpandedIds.add(id);
      } else {
        newExpandedIds = new Set([id]);
      }
    }

    if (controlledExpandedIds === undefined) {
      setInternalExpandedIds(newExpandedIds);
    }
    onChange?.(Array.from(newExpandedIds));
  }, [items, expandedIds, allowMultiple, allowToggle, controlledExpandedIds, onChange]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent, id: string) => {
    const currentIndex = items.findIndex((item) => item.id === id);
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        newIndex = currentIndex + 1;
        while (newIndex < items.length && items[newIndex].disabled) newIndex++;
        break;
      case 'ArrowUp':
        event.preventDefault();
        newIndex = currentIndex - 1;
        while (newIndex >= 0 && items[newIndex].disabled) newIndex--;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = items.findIndex((item) => !item.disabled);
        break;
      case 'End':
        event.preventDefault();
        for (let i = items.length - 1; i >= 0; i--) {
          if (!items[i].disabled) {
            newIndex = i;
            break;
          }
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleToggle(id);
        return;
    }

    if (newIndex >= 0 && newIndex < items.length && newIndex !== currentIndex) {
      const button = document.getElementById(`accordion-header-${items[newIndex].id}`);
      button?.focus();
    }
  }, [items, handleToggle]);

  // Get item styles
  const getItemStyle = (index: number): React.CSSProperties => {
    let style: React.CSSProperties = { ...accordionStyles.item };

    if (variant === 'bordered') {
      style = { ...style, ...accordionStyles.itemBordered };
    } else if (variant === 'separated') {
      style = { ...style, ...accordionStyles.itemSeparated };
    } else if (variant === 'flush') {
      style = { ...style, ...accordionStyles.itemFlush };
    } else {
      if (index === 0) style = { ...style, ...accordionStyles.itemFirst };
      if (index === items.length - 1) style = { ...style, ...accordionStyles.itemLast };
    }

    return style;
  };

  // Get header styles
  const getHeaderStyle = (item: AccordionItem, isExpanded: boolean, isHovered: boolean): React.CSSProperties => {
    let style: React.CSSProperties = { ...accordionStyles.header };

    if (size === 'sm') style = { ...style, ...accordionStyles.headerSm };
    if (size === 'lg') style = { ...style, ...accordionStyles.headerLg };
    if (item.disabled) style = { ...style, ...accordionStyles.headerDisabled };
    if (isHovered && !item.disabled) style = { ...style, ...accordionStyles.headerHover };
    if (isExpanded) style = { ...style, ...accordionStyles.headerExpanded };

    return style;
  };

  // Get content inner styles
  const getContentInnerStyle = (): React.CSSProperties => {
    let style: React.CSSProperties = { ...accordionStyles.contentInner };

    if (size === 'sm') style = { ...style, ...accordionStyles.contentInnerSm };
    if (size === 'lg') style = { ...style, ...accordionStyles.contentInnerLg };

    return style;
  };

  return (
    <div
      style={{
        ...accordionStyles.container,
        ...(variant === 'separated' && accordionStyles.containerSeparated),
      }}
      className={className}
    >
      {items.map((item, index) => {
        const isExpanded = expandedIds.has(item.id);
        const isHovered = hoveredId === item.id;
        const contentRef = contentRefs.current.get(item.id);
        const contentHeight = isExpanded && contentRef ? contentRef.scrollHeight : 0;

        return (
          <div
            key={item.id}
            style={getItemStyle(index)}
            className={itemClassName}
          >
            {/* Header */}
            <button
              id={`accordion-header-${item.id}`}
              aria-expanded={isExpanded}
              aria-controls={`accordion-content-${item.id}`}
              disabled={item.disabled}
              style={getHeaderStyle(item, isExpanded, isHovered)}
              onClick={() => handleToggle(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {renderTitle ? (
                renderTitle(item, isExpanded)
              ) : (
                <>
                  {item.icon && <span style={accordionStyles.headerIcon}>{item.icon}</span>}
                  <span style={accordionStyles.headerTitle}>{item.title}</span>
                  {item.badge !== undefined && (
                    <span style={accordionStyles.headerBadge}>{item.badge}</span>
                  )}
                  <span
                    style={{
                      ...accordionStyles.headerChevron,
                      ...(isExpanded && accordionStyles.headerChevronExpanded),
                    }}
                  >
                    ▼
                  </span>
                </>
              )}
            </button>

            {/* Content */}
            <div
              id={`accordion-content-${item.id}`}
              role="region"
              aria-labelledby={`accordion-header-${item.id}`}
              style={{
                ...accordionStyles.content,
                height: animated ? (isExpanded ? `${contentHeight}px` : '0px') : 'auto',
                display: !animated && !isExpanded ? 'none' : 'block',
              }}
            >
              <div
                ref={(el) => {
                  if (el) contentRefs.current.set(item.id, el);
                }}
                style={getContentInnerStyle()}
              >
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// ADDITIONAL COMPONENTS
// ============================================================

// Tab component for composition pattern
interface TabProps {
  children: ReactNode;
  className?: string;
}

export function Tab({ children, className }: TabProps): JSX.Element {
  return <div className={className}>{children}</div>;
}

// TabList component for composition pattern
interface TabListProps {
  children: ReactNode;
  className?: string;
}

export function TabList({ children, className }: TabListProps): JSX.Element {
  return <div className={className} role="tablist">{children}</div>;
}

// TabPanel component for composition pattern
interface TabPanelProps {
  children: ReactNode;
  className?: string;
}

export function TabPanel({ children, className }: TabPanelProps): JSX.Element {
  return <div className={className} role="tabpanel">{children}</div>;
}

// AccordionItem component for composition pattern
interface AccordionItemComponentProps {
  children: ReactNode;
  className?: string;
}

export function AccordionItemComponent({ children, className }: AccordionItemComponentProps): JSX.Element {
  return <div className={className}>{children}</div>;
}

// AccordionHeader component for composition pattern
interface AccordionHeaderProps {
  children: ReactNode;
  className?: string;
}

export function AccordionHeader({ children, className }: AccordionHeaderProps): JSX.Element {
  return <div className={className}>{children}</div>;
}

// AccordionContent component for composition pattern
interface AccordionContentProps {
  children: ReactNode;
  className?: string;
}

export function AccordionContent({ children, className }: AccordionContentProps): JSX.Element {
  return <div className={className}>{children}</div>;
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  TabsOrientation,
  TabsVariant,
  TabsSize,
  TabItem,
  TabsContextValue,
  TabsProps,
  AccordionItem,
  AccordionProps,
};

export { useTabsContext };

export default {
  Tabs,
  Accordion,
  Tab,
  TabList,
  TabPanel,
  AccordionItem: AccordionItemComponent,
  AccordionHeader,
  AccordionContent,
};
