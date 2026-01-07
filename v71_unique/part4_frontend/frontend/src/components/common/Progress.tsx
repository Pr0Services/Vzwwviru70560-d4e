/**
 * CHE·NU™ Progress, Accordion & Navigation Components
 * 
 * Advanced UI components for progress visualization, collapsible content,
 * and navigation patterns.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React, { useState, useRef, useEffect, createContext, useContext } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS CIRCLE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface ProgressCircleProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  thickness?: number;
  color?: string;
  trackColor?: string;
  showValue?: boolean;
  label?: string;
  animate?: boolean;
}

const sizeMap = { sm: 48, md: 64, lg: 96, xl: 128 };

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  max = 100,
  size = 'md',
  thickness = 4,
  color = 'var(--color-primary, #6366f1)',
  trackColor = 'var(--color-border, #e5e7eb)',
  showValue = true,
  label,
  animate = true,
}) => {
  const dimensions = sizeMap[size];
  const radius = (dimensions - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max(value / max, 0), 1);
  const offset = circumference - (percentage * circumference);

  return (
    <div className="progress-circle" style={{ width: dimensions, height: dimensions }}>
      <svg width={dimensions} height={dimensions} viewBox={`0 0 ${dimensions} ${dimensions}`}>
        {/* Track */}
        <circle
          className="progress-circle__track"
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
        />
        {/* Progress */}
        <circle
          className="progress-circle__progress"
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: 'center',
            transition: animate ? 'stroke-dashoffset 0.5s ease-out' : 'none',
          }}
        />
      </svg>
      {(showValue || label) && (
        <div className="progress-circle__content">
          {showValue && (
            <span className="progress-circle__value">
              {Math.round(percentage * 100)}%
            </span>
          )}
          {label && <span className="progress-circle__label">{label}</span>}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STEPS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface StepsProps {
  steps: Step[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'simple';
  onStepClick?: (stepIndex: number) => void;
}

export const Steps: React.FC<StepsProps> = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  size = 'md',
  variant = 'default',
  onStepClick,
}) => {
  return (
    <div className={`steps steps--${orientation} steps--${size} steps--${variant}`}>
      {steps.map((step, index) => {
        const status = index < currentStep ? 'completed' : index === currentStep ? 'active' : 'pending';
        
        return (
          <div 
            key={step.id}
            className={`steps__step steps__step--${status}`}
            onClick={() => onStepClick?.(index)}
            style={{ cursor: onStepClick ? 'pointer' : 'default' }}
          >
            <div className="steps__indicator">
              {status === 'completed' ? (
                <span className="steps__check">✓</span>
              ) : step.icon ? (
                step.icon
              ) : (
                <span className="steps__number">{index + 1}</span>
              )}
            </div>
            
            {variant === 'default' && (
              <div className="steps__content">
                <span className="steps__title">{step.title}</span>
                {step.description && (
                  <span className="steps__description">{step.description}</span>
                )}
              </div>
            )}
            
            {index < steps.length - 1 && (
              <div className={`steps__connector steps__connector--${status === 'completed' ? 'completed' : 'pending'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ACCORDION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
  variant?: 'default' | 'bordered' | 'separated';
}

interface AccordionContextValue {
  expandedItems: Set<string>;
  toggleItem: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  variant = 'default',
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(defaultExpanded)
  );

  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(id);
      }
      return next;
    });
  };

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem }}>
      <div className={`accordion accordion--${variant}`}>
        {items.map((item) => (
          <AccordionItemComponent key={item.id} item={item} />
        ))}
      </div>
    </AccordionContext.Provider>
  );
};

const AccordionItemComponent: React.FC<{ item: AccordionItem }> = ({ item }) => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionItem must be used within Accordion');
  
  const { expandedItems, toggleItem } = context;
  const isExpanded = expandedItems.has(item.id);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [item.content]);

  return (
    <div className={`accordion__item ${isExpanded ? 'accordion__item--expanded' : ''} ${item.disabled ? 'accordion__item--disabled' : ''}`}>
      <button
        className="accordion__header"
        onClick={() => !item.disabled && toggleItem(item.id)}
        disabled={item.disabled}
        aria-expanded={isExpanded}
        aria-controls={`accordion-content-${item.id}`}
      >
        {item.icon && <span className="accordion__icon">{item.icon}</span>}
        <span className="accordion__title">{item.title}</span>
        <span className={`accordion__chevron ${isExpanded ? 'accordion__chevron--expanded' : ''}`}>
          ▼
        </span>
      </button>
      
      <div
        id={`accordion-content-${item.id}`}
        className="accordion__content-wrapper"
        style={{ height: isExpanded ? contentHeight : 0 }}
      >
        <div ref={contentRef} className="accordion__content">
          {item.content}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// BREADCRUMB COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  onNavigate?: (href: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  maxItems = 0,
  onNavigate,
}) => {
  const displayItems = maxItems > 0 && items.length > maxItems
    ? [
        items[0],
        { label: '...', href: undefined },
        ...items.slice(-(maxItems - 2)),
      ]
    : items;

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          
          return (
            <li key={index} className="breadcrumb__item">
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="breadcrumb__link"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate(item.href!);
                    }
                  }}
                >
                  {item.icon && <span className="breadcrumb__icon">{item.icon}</span>}
                  {item.label}
                </a>
              ) : (
                <span className={`breadcrumb__text ${isLast ? 'breadcrumb__text--current' : ''}`}>
                  {item.icon && <span className="breadcrumb__icon">{item.icon}</span>}
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <span className="breadcrumb__separator" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SIDEBAR NAV COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children?: NavItem[];
  disabled?: boolean;
}

export interface SidebarNavProps {
  items: NavItem[];
  activeItem?: string;
  onNavigate?: (item: NavItem) => void;
  collapsed?: boolean;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  items,
  activeItem,
  onNavigate,
  collapsed = false,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedGroups.has(item.id);
    const isActive = item.id === activeItem;

    return (
      <li key={item.id} className="sidebar-nav__item">
        <button
          className={`
            sidebar-nav__link
            ${isActive ? 'sidebar-nav__link--active' : ''}
            ${item.disabled ? 'sidebar-nav__link--disabled' : ''}
          `}
          style={{ paddingLeft: collapsed ? 12 : 12 + depth * 16 }}
          onClick={() => {
            if (hasChildren) {
              toggleGroup(item.id);
            } else if (!item.disabled) {
              onNavigate?.(item);
            }
          }}
          disabled={item.disabled}
        >
          {item.icon && <span className="sidebar-nav__icon">{item.icon}</span>}
          {!collapsed && (
            <>
              <span className="sidebar-nav__label">{item.label}</span>
              {item.badge && <span className="sidebar-nav__badge">{item.badge}</span>}
              {hasChildren && (
                <span className={`sidebar-nav__expand ${isExpanded ? 'sidebar-nav__expand--open' : ''}`}>
                  ▶
                </span>
              )}
            </>
          )}
        </button>
        
        {hasChildren && !collapsed && (
          <ul 
            className={`sidebar-nav__children ${isExpanded ? 'sidebar-nav__children--expanded' : ''}`}
          >
            {item.children!.map(child => renderItem(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav className={`sidebar-nav ${collapsed ? 'sidebar-nav--collapsed' : ''}`}>
      <ul className="sidebar-nav__list">
        {items.map(item => renderItem(item))}
      </ul>
    </nav>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

export const ProgressNavStyles: React.FC = () => (
  <style>{`
    /* Progress Circle */
    .progress-circle {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .progress-circle__content {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .progress-circle__value {
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text-primary, #111827);
    }

    .progress-circle__label {
      font-size: 11px;
      color: var(--color-text-secondary, #6b7280);
    }

    /* Steps */
    .steps {
      display: flex;
      gap: 8px;
    }

    .steps--vertical {
      flex-direction: column;
    }

    .steps__step {
      display: flex;
      align-items: center;
      position: relative;
    }

    .steps--vertical .steps__step {
      flex-direction: row;
      align-items: flex-start;
    }

    .steps__indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 14px;
      font-weight: 600;
      flex-shrink: 0;
      background: var(--color-bg-tertiary, #e5e7eb);
      color: var(--color-text-secondary, #6b7280);
      transition: all var(--transition-fast, 0.15s);
    }

    .steps--sm .steps__indicator { width: 24px; height: 24px; font-size: 12px; }
    .steps--lg .steps__indicator { width: 40px; height: 40px; font-size: 16px; }

    .steps__step--active .steps__indicator {
      background: var(--color-primary, #6366f1);
      color: white;
    }

    .steps__step--completed .steps__indicator {
      background: var(--color-success, #22c55e);
      color: white;
    }

    .steps__content {
      margin-left: 12px;
      display: flex;
      flex-direction: column;
    }

    .steps__title {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-primary, #111827);
    }

    .steps__description {
      font-size: 13px;
      color: var(--color-text-secondary, #6b7280);
    }

    .steps__connector {
      flex: 1;
      height: 2px;
      background: var(--color-border, #e5e7eb);
      margin: 0 8px;
    }

    .steps--vertical .steps__connector {
      position: absolute;
      left: 15px;
      top: 36px;
      width: 2px;
      height: calc(100% - 36px + 8px);
      margin: 0;
    }

    .steps__connector--completed {
      background: var(--color-success, #22c55e);
    }

    /* Accordion */
    .accordion {
      display: flex;
      flex-direction: column;
    }

    .accordion--bordered {
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-lg, 12px);
      overflow: hidden;
    }

    .accordion--separated {
      gap: 8px;
    }

    .accordion--separated .accordion__item {
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 8px);
    }

    .accordion__item {
      border-bottom: 1px solid var(--color-border, #e5e7eb);
    }

    .accordion__item:last-child {
      border-bottom: none;
    }

    .accordion__item--disabled {
      opacity: 0.5;
    }

    .accordion__header {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 16px;
      border: none;
      background: transparent;
      color: var(--color-text-primary, #111827);
      font-size: 15px;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      transition: background var(--transition-fast, 0.15s);
    }

    .accordion__header:hover {
      background: var(--color-bg-secondary, #f9fafb);
    }

    .accordion__icon {
      margin-right: 12px;
      display: flex;
    }

    .accordion__title {
      flex: 1;
    }

    .accordion__chevron {
      font-size: 10px;
      color: var(--color-text-secondary, #6b7280);
      transition: transform var(--transition-fast, 0.15s);
    }

    .accordion__chevron--expanded {
      transform: rotate(180deg);
    }

    .accordion__content-wrapper {
      overflow: hidden;
      transition: height 0.2s ease-out;
    }

    .accordion__content {
      padding: 0 16px 16px;
      font-size: 14px;
      color: var(--color-text-secondary, #6b7280);
    }

    /* Breadcrumb */
    .breadcrumb__list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .breadcrumb__item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .breadcrumb__link {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--color-text-secondary, #6b7280);
      text-decoration: none;
      font-size: 14px;
      transition: color var(--transition-fast, 0.15s);
    }

    .breadcrumb__link:hover {
      color: var(--color-primary, #6366f1);
    }

    .breadcrumb__text {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--color-text-secondary, #6b7280);
      font-size: 14px;
    }

    .breadcrumb__text--current {
      color: var(--color-text-primary, #111827);
      font-weight: 500;
    }

    .breadcrumb__separator {
      color: var(--color-text-tertiary, #9ca3af);
      font-size: 12px;
    }

    .breadcrumb__icon {
      display: flex;
      font-size: 14px;
    }

    /* Sidebar Nav */
    .sidebar-nav {
      width: 240px;
    }

    .sidebar-nav--collapsed {
      width: 56px;
    }

    .sidebar-nav__list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .sidebar-nav__item {
      margin-bottom: 2px;
    }

    .sidebar-nav__link {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 10px 12px;
      gap: 10px;
      border: none;
      background: transparent;
      color: var(--color-text-secondary, #6b7280);
      font-size: 14px;
      text-align: left;
      cursor: pointer;
      border-radius: var(--radius-md, 8px);
      transition: all var(--transition-fast, 0.15s);
    }

    .sidebar-nav__link:hover {
      background: var(--color-bg-tertiary, #f3f4f6);
      color: var(--color-text-primary, #111827);
    }

    .sidebar-nav__link--active {
      background: rgba(99, 102, 241, 0.1);
      color: var(--color-primary, #6366f1);
    }

    .sidebar-nav__link--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .sidebar-nav__icon {
      display: flex;
      width: 20px;
      justify-content: center;
      flex-shrink: 0;
    }

    .sidebar-nav__label {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sidebar-nav__badge {
      flex-shrink: 0;
    }

    .sidebar-nav__expand {
      font-size: 10px;
      transition: transform var(--transition-fast, 0.15s);
    }

    .sidebar-nav__expand--open {
      transform: rotate(90deg);
    }

    .sidebar-nav__children {
      list-style: none;
      padding: 0;
      margin: 0;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.2s ease-out;
    }

    .sidebar-nav__children--expanded {
      max-height: 500px;
    }

    /* Dark mode */
    [data-theme="dark"] .progress-circle__value {
      color: #f9fafb;
    }

    [data-theme="dark"] .steps__indicator {
      background: #333;
      color: #9ca3af;
    }

    [data-theme="dark"] .steps__title {
      color: #f9fafb;
    }

    [data-theme="dark"] .steps__connector {
      background: #333;
    }

    [data-theme="dark"] .accordion--bordered,
    [data-theme="dark"] .accordion--separated .accordion__item {
      border-color: #333;
    }

    [data-theme="dark"] .accordion__item {
      border-color: #333;
    }

    [data-theme="dark"] .accordion__header {
      color: #f9fafb;
    }

    [data-theme="dark"] .accordion__header:hover {
      background: #2a2a2a;
    }

    [data-theme="dark"] .breadcrumb__text--current {
      color: #f9fafb;
    }

    [data-theme="dark"] .sidebar-nav__link {
      color: #9ca3af;
    }

    [data-theme="dark"] .sidebar-nav__link:hover {
      background: #2a2a2a;
      color: #f9fafb;
    }
  `}</style>
);

export default {
  ProgressCircle,
  Steps,
  Accordion,
  Breadcrumb,
  SidebarNav,
  ProgressNavStyles,
};
