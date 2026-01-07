/**
 * CHE·NU™ Dropdown, Tooltip & Tabs Components
 * 
 * Interactive overlay components with keyboard navigation and accessibility.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React, { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// DROPDOWN TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactElement;
  items: DropdownItem[];
  onSelect: (id: string) => void;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  width?: number | 'auto' | 'trigger';
}

// ═══════════════════════════════════════════════════════════════════════════
// DROPDOWN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  onSelect,
  placement = 'bottom-start',
  width = 'auto',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectableItems = items.filter(item => !item.separator && !item.disabled);

  const handleOpen = () => {
    setIsOpen(true);
    setFocusedIndex(0);
  };

  const handleClose = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleSelect = (id: string) => {
    onSelect(id);
    handleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleOpen();
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        handleClose();
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < selectableItems.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : selectableItems.length - 1
        );
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          handleSelect(selectableItems[focusedIndex].id);
        }
        break;
      case 'Tab':
        handleClose();
        break;
    }
  };

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const triggerWidth = triggerRef.current?.offsetWidth;
  const menuWidth = width === 'trigger' ? triggerWidth : width === 'auto' ? undefined : width;

  return (
    <div className="dropdown" onKeyDown={handleKeyDown}>
      <div 
        ref={triggerRef}
        className="dropdown__trigger"
        onClick={() => isOpen ? handleClose() : handleOpen()}
        tabIndex={0}
        role="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          ref={menuRef}
          className={`dropdown__menu dropdown__menu--${placement}`}
          style={{ width: menuWidth }}
          role="menu"
        >
          {items.map((item, index) => {
            if (item.separator) {
              return <div key={index} className="dropdown__separator" />;
            }

            const selectableIndex = selectableItems.findIndex(si => si.id === item.id);

            return (
              <button
                key={item.id}
                className={`
                  dropdown__item
                  ${item.disabled ? 'dropdown__item--disabled' : ''}
                  ${item.danger ? 'dropdown__item--danger' : ''}
                  ${selectableIndex === focusedIndex ? 'dropdown__item--focused' : ''}
                `}
                onClick={() => !item.disabled && handleSelect(item.id)}
                disabled={item.disabled}
                role="menuitem"
              >
                {item.icon && <span className="dropdown__item-icon">{item.icon}</span>}
                <span className="dropdown__item-label">{item.label}</span>
                {item.shortcut && (
                  <span className="dropdown__item-shortcut">{item.shortcut}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// TOOLTIP TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type TooltipPlacement = 
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: TooltipPlacement;
  delay?: number;
  disabled?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// TOOLTIP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 200,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    const offset = 8;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = trigger.top - tooltip.height - offset;
        left = trigger.left + (trigger.width - tooltip.width) / 2;
        break;
      case 'top-start':
        top = trigger.top - tooltip.height - offset;
        left = trigger.left;
        break;
      case 'top-end':
        top = trigger.top - tooltip.height - offset;
        left = trigger.right - tooltip.width;
        break;
      case 'bottom':
        top = trigger.bottom + offset;
        left = trigger.left + (trigger.width - tooltip.width) / 2;
        break;
      case 'bottom-start':
        top = trigger.bottom + offset;
        left = trigger.left;
        break;
      case 'bottom-end':
        top = trigger.bottom + offset;
        left = trigger.right - tooltip.width;
        break;
      case 'left':
        top = trigger.top + (trigger.height - tooltip.height) / 2;
        left = trigger.left - tooltip.width - offset;
        break;
      case 'right':
        top = trigger.top + (trigger.height - tooltip.height) / 2;
        left = trigger.right + offset;
        break;
    }

    // Keep within viewport
    left = Math.max(8, Math.min(left, window.innerWidth - tooltip.width - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - tooltip.height - 8));

    setPosition({ top, left });
  }, [placement]);

  const handleShow = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleHide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible, calculatePosition]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        className="tooltip-trigger"
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
        onFocus={handleShow}
        onBlur={handleHide}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`tooltip tooltip--${placement}`}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
          }}
          role="tooltip"
        >
          {content}
          <div className="tooltip__arrow" />
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// TABS TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export interface TabPanelProps {
  tabId: string;
  activeTab: string;
  children: React.ReactNode;
}

// ═══════════════════════════════════════════════════════════════════════════
// TABS CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabPanel must be used within Tabs');
  }
  return context;
};

// ═══════════════════════════════════════════════════════════════════════════
// TABS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
}) => {
  const tabListRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(
    tabs.findIndex(t => t.id === activeTab)
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const enabledTabs = tabs.filter(t => !t.disabled);
    const currentIndex = enabledTabs.findIndex((_, i) => i === focusedIndex);

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : enabledTabs.length - 1;
        setFocusedIndex(tabs.indexOf(enabledTabs[prevIndex]));
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = currentIndex < enabledTabs.length - 1 ? currentIndex + 1 : 0;
        setFocusedIndex(tabs.indexOf(enabledTabs[nextIndex]));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!tabs[focusedIndex].disabled) {
          onChange(tabs[focusedIndex].id);
        }
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(tabs.indexOf(enabledTabs[0]));
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(tabs.indexOf(enabledTabs[enabledTabs.length - 1]));
        break;
    }
  };

  return (
    <div 
      ref={tabListRef}
      className={`
        tabs
        tabs--${variant}
        tabs--${size}
        ${fullWidth ? 'tabs--full-width' : ''}
      `}
      role="tablist"
      onKeyDown={handleKeyDown}
    >
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          className={`
            tabs__tab
            ${tab.id === activeTab ? 'tabs__tab--active' : ''}
            ${tab.disabled ? 'tabs__tab--disabled' : ''}
            ${index === focusedIndex ? 'tabs__tab--focused' : ''}
          `}
          onClick={() => !tab.disabled && onChange(tab.id)}
          onFocus={() => setFocusedIndex(index)}
          disabled={tab.disabled}
          role="tab"
          aria-selected={tab.id === activeTab}
          aria-controls={`tabpanel-${tab.id}`}
          tabIndex={tab.id === activeTab ? 0 : -1}
        >
          {tab.icon && <span className="tabs__tab-icon">{tab.icon}</span>}
          <span className="tabs__tab-label">{tab.label}</span>
          {tab.badge && <span className="tabs__tab-badge">{tab.badge}</span>}
        </button>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// TAB PANEL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const TabPanel: React.FC<TabPanelProps> = ({
  tabId,
  activeTab,
  children,
}) => {
  if (tabId !== activeTab) return null;

  return (
    <div
      id={`tabpanel-${tabId}`}
      className="tabs__panel"
      role="tabpanel"
      aria-labelledby={tabId}
    >
      {children}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// POPOVER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface PopoverProps {
  trigger: React.ReactElement;
  content: React.ReactNode;
  placement?: TooltipPlacement;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  placement = 'bottom',
  isOpen: controlledIsOpen,
  onOpenChange,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const newState = !isOpen;
    if (!isControlled) {
      setInternalIsOpen(newState);
    }
    onOpenChange?.(newState);
  };

  const handleClose = () => {
    if (!isControlled) {
      setInternalIsOpen(false);
    }
    onOpenChange?.(false);
  };

  useEffect(() => {
    if (!isOpen || !triggerRef.current || !contentRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const content = contentRef.current.getBoundingClientRect();
    const offset = 8;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = trigger.top - content.height - offset;
        left = trigger.left + (trigger.width - content.width) / 2;
        break;
      case 'bottom':
        top = trigger.bottom + offset;
        left = trigger.left + (trigger.width - content.width) / 2;
        break;
      case 'left':
        top = trigger.top + (trigger.height - content.height) / 2;
        left = trigger.left - content.width - offset;
        break;
      case 'right':
        top = trigger.top + (trigger.height - content.height) / 2;
        left = trigger.right + offset;
        break;
      default:
        top = trigger.bottom + offset;
        left = trigger.left + (trigger.width - content.width) / 2;
    }

    setPosition({ top, left });
  }, [isOpen, placement]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <div ref={triggerRef} onClick={handleToggle}>
        {trigger}
      </div>
      
      {isOpen && (
        <div
          ref={contentRef}
          className={`popover popover--${placement}`}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
          }}
        >
          {content}
        </div>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

export const DropdownTooltipTabsStyles: React.FC = () => (
  <style>{`
    /* Dropdown */
    .dropdown {
      position: relative;
      display: inline-block;
    }

    .dropdown__trigger {
      cursor: pointer;
    }

    .dropdown__menu {
      position: absolute;
      z-index: 1000;
      min-width: 180px;
      padding: 4px;
      background: var(--color-bg-primary, #ffffff);
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
      animation: dropdown-in 0.15s ease-out;
    }

    @keyframes dropdown-in {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown__menu--bottom-start { top: 100%; left: 0; margin-top: 4px; }
    .dropdown__menu--bottom-end { top: 100%; right: 0; margin-top: 4px; }
    .dropdown__menu--top-start { bottom: 100%; left: 0; margin-bottom: 4px; }
    .dropdown__menu--top-end { bottom: 100%; right: 0; margin-bottom: 4px; }

    .dropdown__item {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 8px 12px;
      border: none;
      background: transparent;
      color: var(--color-text-primary, #111827);
      font-size: 14px;
      text-align: left;
      cursor: pointer;
      border-radius: var(--radius-sm, 6px);
      transition: background var(--transition-fast, 0.15s);
    }

    .dropdown__item:hover,
    .dropdown__item--focused {
      background: var(--color-bg-tertiary, #f3f4f6);
    }

    .dropdown__item--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .dropdown__item--danger {
      color: var(--color-error, #ef4444);
    }

    .dropdown__item--danger:hover {
      background: rgba(239, 68, 68, 0.1);
    }

    .dropdown__item-icon {
      margin-right: 8px;
      display: flex;
      width: 16px;
      justify-content: center;
    }

    .dropdown__item-label {
      flex: 1;
    }

    .dropdown__item-shortcut {
      margin-left: 16px;
      font-size: 12px;
      color: var(--color-text-tertiary, #9ca3af);
    }

    .dropdown__separator {
      height: 1px;
      margin: 4px 0;
      background: var(--color-border, #e5e7eb);
    }

    /* Tooltip */
    .tooltip-trigger {
      display: inline-block;
    }

    .tooltip {
      z-index: 9999;
      padding: 6px 10px;
      background: var(--color-text-primary, #111827);
      color: white;
      font-size: 13px;
      border-radius: var(--radius-sm, 6px);
      white-space: nowrap;
      animation: tooltip-in 0.15s ease-out;
    }

    @keyframes tooltip-in {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .tooltip__arrow {
      position: absolute;
      width: 8px;
      height: 8px;
      background: inherit;
      transform: rotate(45deg);
    }

    .tooltip--top .tooltip__arrow { bottom: -4px; left: 50%; margin-left: -4px; }
    .tooltip--bottom .tooltip__arrow { top: -4px; left: 50%; margin-left: -4px; }
    .tooltip--left .tooltip__arrow { right: -4px; top: 50%; margin-top: -4px; }
    .tooltip--right .tooltip__arrow { left: -4px; top: 50%; margin-top: -4px; }

    /* Tabs */
    .tabs {
      display: flex;
      gap: 4px;
      border-bottom: 1px solid var(--color-border, #e5e7eb);
    }

    .tabs--full-width {
      width: 100%;
    }

    .tabs--full-width .tabs__tab {
      flex: 1;
    }

    .tabs__tab {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 16px;
      border: none;
      background: transparent;
      color: var(--color-text-secondary, #6b7280);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast, 0.15s);
      position: relative;
    }

    .tabs--sm .tabs__tab { padding: 8px 12px; font-size: 13px; }
    .tabs--lg .tabs__tab { padding: 12px 20px; font-size: 15px; }

    .tabs__tab:hover {
      color: var(--color-text-primary, #111827);
    }

    .tabs__tab--active {
      color: var(--color-primary, #6366f1);
    }

    .tabs__tab--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .tabs__tab--focused {
      outline: 2px solid var(--color-primary, #6366f1);
      outline-offset: -2px;
    }

    /* Default variant - underline */
    .tabs--default .tabs__tab::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: transparent;
      transition: background var(--transition-fast, 0.15s);
    }

    .tabs--default .tabs__tab--active::after {
      background: var(--color-primary, #6366f1);
    }

    /* Underline variant */
    .tabs--underline {
      border-bottom: none;
    }

    .tabs--underline .tabs__tab::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: transparent;
      transition: background var(--transition-fast, 0.15s);
    }

    .tabs--underline .tabs__tab--active::after {
      background: var(--color-primary, #6366f1);
    }

    /* Pills variant */
    .tabs--pills {
      border-bottom: none;
      gap: 8px;
    }

    .tabs--pills .tabs__tab {
      border-radius: var(--radius-md, 8px);
    }

    .tabs--pills .tabs__tab--active {
      background: var(--color-primary, #6366f1);
      color: white;
    }

    .tabs__tab-icon {
      display: flex;
    }

    .tabs__tab-badge {
      margin-left: 4px;
    }

    .tabs__panel {
      padding: 16px 0;
    }

    /* Popover */
    .popover {
      z-index: 1000;
      padding: 12px;
      background: var(--color-bg-primary, #ffffff);
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-lg, 12px);
      box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
      animation: popover-in 0.15s ease-out;
    }

    @keyframes popover-in {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    /* Dark mode */
    [data-theme="dark"] .dropdown__menu {
      background: #1a1a1a;
      border-color: #333;
    }

    [data-theme="dark"] .dropdown__item {
      color: #f9fafb;
    }

    [data-theme="dark"] .dropdown__item:hover,
    [data-theme="dark"] .dropdown__item--focused {
      background: #2a2a2a;
    }

    [data-theme="dark"] .dropdown__separator {
      background: #333;
    }

    [data-theme="dark"] .tooltip {
      background: #f9fafb;
      color: #111827;
    }

    [data-theme="dark"] .tabs {
      border-color: #333;
    }

    [data-theme="dark"] .tabs__tab {
      color: #9ca3af;
    }

    [data-theme="dark"] .tabs__tab:hover {
      color: #f9fafb;
    }

    [data-theme="dark"] .tabs__tab--active {
      color: var(--color-primary, #6366f1);
    }

    [data-theme="dark"] .popover {
      background: #1a1a1a;
      border-color: #333;
    }
  `}</style>
);

export default {
  Dropdown,
  Tooltip,
  Tabs,
  TabPanel,
  Popover,
  DropdownTooltipTabsStyles,
};
