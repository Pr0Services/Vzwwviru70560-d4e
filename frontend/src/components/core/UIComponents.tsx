// CHE·NU™ UI Components — Common UI Elements

import React, { useState, useRef, useEffect } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// BUTTON
// ============================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  style,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
    opacity: disabled || loading ? 0.6 : 1,
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '12px' },
    md: { padding: '10px 16px', fontSize: '14px' },
    lg: { padding: '14px 24px', fontSize: '16px' },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: CHENU_COLORS.sacredGold, color: '#000' },
    secondary: { backgroundColor: 'transparent', color: CHENU_COLORS.softSand, border: `1px solid ${CHENU_COLORS.ancientStone}44` },
    ghost: { backgroundColor: 'transparent', color: CHENU_COLORS.softSand },
    danger: { backgroundColor: '#e74c3c', color: '#fff' },
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={{ ...baseStyles, ...sizeStyles[size], ...variantStyles[variant], ...style }}
    >
      {loading ? <Spinner size="sm" /> : icon}
      {children}
    </button>
  );
};

// ============================================================
// INPUT
// ============================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, style, ...props }) => (
  <div style={{ marginBottom: '16px' }}>
    {label && (
      <label style={{
        display: 'block',
        fontSize: '12px',
        fontWeight: 600,
        color: CHENU_COLORS.ancientStone,
        marginBottom: '6px',
        textTransform: 'uppercase',
      }}>
        {label}
      </label>
    )}
    <input
      {...props}
      style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: `1px solid ${error ? '#e74c3c' : CHENU_COLORS.ancientStone}44`,
        backgroundColor: '#0a0a0b',
        color: CHENU_COLORS.softSand,
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.15s ease',
        boxSizing: 'border-box',
        ...style,
      }}
    />
    {error && <p style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
    {helperText && !error && <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px', marginTop: '4px' }}>{helperText}</p>}
  </div>
);

// ============================================================
// CARD
// ============================================================

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  accent?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, title, subtitle, actions, padding = 'md', accent, onClick }) => {
  const paddingValues = { sm: '12px', md: '20px', lg: '28px' };
  
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#111113',
        borderRadius: '12px',
        padding: paddingValues[padding],
        border: `1px solid ${CHENU_COLORS.ancientStone}22`,
        borderLeft: accent ? `4px solid ${accent}` : undefined,
        cursor: onClick ? 'pointer' : undefined,
        transition: 'all 0.15s ease',
      }}
    >
      {(title || actions) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            {title && <h3 style={{ fontSize: '16px', fontWeight: 600, color: CHENU_COLORS.softSand, marginBottom: subtitle ? '4px' : 0 }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: '13px', color: CHENU_COLORS.ancientStone }}>{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
};

// ============================================================
// BADGE
// ============================================================

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'turquoise' | 'green' | 'red' | 'orange';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'md' }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    default: { bg: CHENU_COLORS.ancientStone + '22', text: CHENU_COLORS.ancientStone },
    gold: { bg: CHENU_COLORS.sacredGold + '22', text: CHENU_COLORS.sacredGold },
    turquoise: { bg: CHENU_COLORS.cenoteTurquoise + '22', text: CHENU_COLORS.cenoteTurquoise },
    green: { bg: CHENU_COLORS.jungleEmerald + '22', text: CHENU_COLORS.jungleEmerald },
    red: { bg: '#e74c3c22', text: '#e74c3c' },
    orange: { bg: CHENU_COLORS.earthEmber + '22', text: CHENU_COLORS.earthEmber },
  };

  const sizeStyles = {
    sm: { padding: '2px 6px', fontSize: '10px' },
    md: { padding: '4px 10px', fontSize: '12px' },
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '12px',
      fontWeight: 500,
      backgroundColor: colors[variant].bg,
      color: colors[variant].text,
      ...sizeStyles[size],
    }}>
      {children}
    </span>
  );
};

// ============================================================
// PROGRESS BAR
// ============================================================

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, color = CHENU_COLORS.sacredGold, showLabel = false, size = 'md' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const heights = { sm: '4px', md: '8px', lg: '12px' };

  return (
    <div>
      <div style={{
        height: heights[size],
        backgroundColor: '#0a0a0b',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: '4px',
          transition: 'width 0.3s ease',
        }} />
      </div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>{value.toLocaleString()}</span>
          <span style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>{max.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
};

// ============================================================
// SPINNER
// ============================================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = CHENU_COLORS.sacredGold }) => {
  const sizes = { sm: '16px', md: '24px', lg: '32px' };
  
  return (
    <div style={{
      width: sizes[size],
      height: sizes[size],
      border: `2px solid ${color}33`,
      borderTopColor: color,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// ============================================================
// MODAL
// ============================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const widths = { sm: '400px', md: '560px', lg: '720px' };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '24px',
    }} onClick={onClose}>
      <div
        style={{
          backgroundColor: '#111113',
          borderRadius: '16px',
          border: `1px solid ${CHENU_COLORS.ancientStone}22`,
          width: '100%',
          maxWidth: widths[size],
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div style={{
            padding: '20px 24px',
            borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: CHENU_COLORS.softSand }}>{title}</h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: CHENU_COLORS.ancientStone,
                cursor: 'pointer',
                fontSize: '20px',
              }}
            >
              ×
            </button>
          </div>
        )}
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
};

// ============================================================
// TABS
// ============================================================

interface TabsProps {
  tabs: Array<{ id: string; label: string; icon?: string }>;
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => (
  <div style={{
    display: 'flex',
    gap: '4px',
    padding: '4px',
    backgroundColor: '#0a0a0b',
    borderRadius: '10px',
    marginBottom: '20px',
  }}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        style={{
          flex: 1,
          padding: '10px 16px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: activeTab === tab.id ? '#111113' : 'transparent',
          color: activeTab === tab.id ? CHENU_COLORS.softSand : CHENU_COLORS.ancientStone,
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: activeTab === tab.id ? 600 : 400,
          transition: 'all 0.15s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        {tab.icon && <span>{tab.icon}</span>}
        {tab.label}
      </button>
    ))}
  </div>
);

// ============================================================
// DROPDOWN
// ============================================================

interface DropdownProps {
  trigger: React.ReactNode;
  items: Array<{ id: string; label: string; icon?: string; onClick: () => void }>;
}

export const Dropdown: React.FC<DropdownProps> = ({ trigger, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '8px',
          backgroundColor: '#111113',
          borderRadius: '8px',
          border: `1px solid ${CHENU_COLORS.ancientStone}22`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          minWidth: '160px',
          zIndex: 100,
          overflow: 'hidden',
        }}>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => { item.onClick(); setIsOpen(false); }}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: 'none',
                backgroundColor: 'transparent',
                color: CHENU_COLORS.softSand,
                cursor: 'pointer',
                fontSize: '13px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.15s ease',
              }}
            >
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// TOAST / NOTIFICATION
// ============================================================

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
  const colors = {
    success: CHENU_COLORS.jungleEmerald,
    error: '#e74c3c',
    warning: CHENU_COLORS.earthEmber,
    info: CHENU_COLORS.cenoteTurquoise,
  };
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      backgroundColor: '#111113',
      borderRadius: '8px',
      borderLeft: `4px solid ${colors[type]}`,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    }}>
      <span style={{ color: colors[type], fontSize: '16px' }}>{icons[type]}</span>
      <span style={{ color: CHENU_COLORS.softSand, fontSize: '14px', flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: CHENU_COLORS.ancientStone, cursor: 'pointer' }}
        >
          ×
        </button>
      )}
    </div>
  );
};

// ============================================================
// EMPTY STATE
// ============================================================

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon = '📭', title, description, action }) => (
  <div style={{
    textAlign: 'center',
    padding: '48px 24px',
    color: CHENU_COLORS.ancientStone,
  }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
    <h3 style={{ fontSize: '18px', fontWeight: 600, color: CHENU_COLORS.softSand, marginBottom: '8px' }}>{title}</h3>
    {description && <p style={{ fontSize: '14px', marginBottom: '20px' }}>{description}</p>}
    {action}
  </div>
);

// ============================================================
// AVATAR
// ============================================================

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy';
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', status }) => {
  const sizes = { sm: 32, md: 40, lg: 48, xl: 64 };
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {src ? (
        <img
          src={src}
          alt={name}
          style={{
            width: sizes[size],
            height: sizes[size],
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <div style={{
          width: sizes[size],
          height: sizes[size],
          borderRadius: '50%',
          backgroundColor: CHENU_COLORS.sacredGold + '33',
          color: CHENU_COLORS.sacredGold,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: sizes[size] * 0.4,
          fontWeight: 600,
        }}>
          {initials || '?'}
        </div>
      )}
      {status && (
        <span style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: sizes[size] * 0.25,
          height: sizes[size] * 0.25,
          borderRadius: '50%',
          border: '2px solid #111113',
          backgroundColor: status === 'online' ? CHENU_COLORS.jungleEmerald : status === 'busy' ? CHENU_COLORS.earthEmber : CHENU_COLORS.ancientStone,
        }} />
      )}
    </div>
  );
};

// ============================================================
// STAT CARD
// ============================================================

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  change?: { value: number; isPositive: boolean };
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, change, color = CHENU_COLORS.sacredGold }) => (
  <Card padding="md" accent={color}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone, marginBottom: '4px' }}>{label}</p>
        <p style={{ fontSize: '28px', fontWeight: 'bold', color }}>{typeof value === 'number' ? value.toLocaleString() : value}</p>
        {change && (
          <p style={{ fontSize: '12px', color: change.isPositive ? CHENU_COLORS.jungleEmerald : '#e74c3c', marginTop: '4px' }}>
            {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
          </p>
        )}
      </div>
      {icon && <span style={{ fontSize: '24px', opacity: 0.6 }}>{icon}</span>}
    </div>
  </Card>
);

export default {
  Button, Input, Card, Badge, ProgressBar, Spinner,
  Modal, Tabs, Dropdown, Toast, EmptyState, Avatar, StatCard,
};
