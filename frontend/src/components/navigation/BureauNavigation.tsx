/**
 * CHE·NU™ - BUREAU NAVIGATION
 * Sidebar navigation for the 10 Bureau sections
 * Used within each Sphere page
 */

import React from 'react';
import { 
  BureauSectionId, 
  BureauSection,
  BUREAU_SECTIONS,
  getAllBureauSections 
} from '../../constants/spheres';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface BureauNavigationProps {
  activeSectionId: BureauSectionId;
  onSectionChange: (sectionId: BureauSectionId) => void;
  sphereColor: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export const BureauNavigation: React.FC<BureauNavigationProps> = ({
  activeSectionId,
  onSectionChange,
  sphereColor,
  collapsed = false,
  onToggleCollapse
}) => {
  const sections = getAllBureauSections();

  return (
    <nav 
      className="bureau-navigation"
      style={{
        width: collapsed ? '64px' : '240px',
        backgroundColor: '#111',
        borderRight: '1px solid #222',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden'
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        style={{
          padding: '12px',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#666',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: collapsed ? 'center' : 'flex-end',
          fontSize: '18px'
        }}
      >
        {collapsed ? '→' : '←'}
      </button>

      {/* Section Title */}
      {!collapsed && (
        <div style={{
          padding: '8px 16px',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: '#555'
        }}>
          Bureau Sections
        </div>
      )}

      {/* Section Links */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        padding: '8px'
      }}>
        {sections.map((section) => (
          <BureauSectionItem
            key={section.id}
            section={section}
            isActive={activeSectionId === section.id}
            onClick={() => onSectionChange(section.id)}
            sphereColor={sphereColor}
            collapsed={collapsed}
          />
        ))}
      </div>

      {/* Quick Actions Footer */}
      {!collapsed && (
        <div style={{
          padding: '16px',
          borderTop: '1px solid #222'
        }}>
          <button
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: sphereColor,
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>🧵</span>
            New Thread
          </button>
        </div>
      )}
    </nav>
  );
};

// ═══════════════════════════════════════════════════════════════
// SECTION ITEM
// ═══════════════════════════════════════════════════════════════

interface BureauSectionItemProps {
  section: BureauSection;
  isActive: boolean;
  onClick: () => void;
  sphereColor: string;
  collapsed: boolean;
}

const BureauSectionItem: React.FC<BureauSectionItemProps> = ({
  section,
  isActive,
  onClick,
  sphereColor,
  collapsed
}) => {
  return (
    <button
      onClick={onClick}
      title={collapsed ? section.name : undefined}
      style={{
        width: '100%',
        padding: collapsed ? '12px' : '12px 16px',
        marginBottom: '4px',
        backgroundColor: isActive ? `${sphereColor}20` : 'transparent',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        textAlign: 'left',
        color: isActive ? sphereColor : '#888',
        transition: 'all 0.15s ease',
        justifyContent: collapsed ? 'center' : 'flex-start',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = '#1a1a1a';
          e.currentTarget.style.color = '#fff';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#888';
        }
      }}
    >
      {/* Active Indicator */}
      {isActive && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '3px',
          height: '24px',
          backgroundColor: sphereColor,
          borderRadius: '0 4px 4px 0'
        }} />
      )}
      
      {/* Icon */}
      <span style={{ fontSize: '18px' }}>
        {section.icon}
      </span>
      
      {/* Name */}
      {!collapsed && (
        <span style={{ 
          fontWeight: isActive ? 600 : 400,
          fontSize: '14px'
        }}>
          {section.name}
        </span>
      )}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════
// HORIZONTAL BUREAU NAVIGATION (Alternative Layout)
// ═══════════════════════════════════════════════════════════════

interface HorizontalBureauNavProps {
  activeSectionId: BureauSectionId;
  onSectionChange: (sectionId: BureauSectionId) => void;
  sphereColor: string;
}

export const HorizontalBureauNavigation: React.FC<HorizontalBureauNavProps> = ({
  activeSectionId,
  onSectionChange,
  sphereColor
}) => {
  const sections = getAllBureauSections();

  return (
    <nav style={{
      display: 'flex',
      gap: '4px',
      padding: '8px 16px',
      backgroundColor: '#111',
      borderBottom: '1px solid #222',
      overflowX: 'auto'
    }}>
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          style={{
            padding: '8px 16px',
            backgroundColor: activeSectionId === section.id ? `${sphereColor}20` : 'transparent',
            border: activeSectionId === section.id ? `1px solid ${sphereColor}` : '1px solid transparent',
            borderRadius: '20px',
            color: activeSectionId === section.id ? sphereColor : '#888',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            fontSize: '13px',
            fontWeight: activeSectionId === section.id ? 600 : 400,
            transition: 'all 0.15s ease'
          }}
        >
          <span>{section.icon}</span>
          <span>{section.name}</span>
        </button>
      ))}
    </nav>
  );
};

export default BureauNavigation;
