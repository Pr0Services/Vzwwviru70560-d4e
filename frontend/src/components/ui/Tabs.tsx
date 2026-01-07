/**
 * CHE·NU — Tabs Component
 */

import React from 'react';

const COLORS = {
  border: '#2A3530',
  cyan: '#00E5FF',
  text: '#E8E4DD',
  muted: '#888888',
};

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'line' | 'pills';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'line',
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: variant === 'pills' ? 8 : 24,
      borderBottom: variant === 'line' ? `1px solid ${COLORS.border}` : 'none',
    }}>
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: variant === 'pills' ? '8px 16px' : '12px 0',
              background: variant === 'pills' && isActive ? COLORS.cyan : 'transparent',
              border: variant === 'pills' 
                ? `1px solid ${isActive ? COLORS.cyan : COLORS.border}`
                : 'none',
              borderBottom: variant === 'line' 
                ? `2px solid ${isActive ? COLORS.cyan : 'transparent'}`
                : 'none',
              borderRadius: variant === 'pills' ? 20 : 0,
              color: isActive 
                ? (variant === 'pills' ? '#0D1210' : COLORS.cyan)
                : COLORS.muted,
              fontSize: 14,
              fontWeight: isActive ? 500 : 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
            }}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span style={{
                padding: '2px 6px',
                background: isActive ? 'rgba(0,0,0,0.2)' : `${COLORS.cyan}20`,
                borderRadius: 10,
                fontSize: 10,
                color: isActive ? 'inherit' : COLORS.cyan,
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
