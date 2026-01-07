/**
 * ============================================================
 * CHE·NU — XR TOOLS PANEL
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Panel displaying XR tools for scene manipulation.
 * Tools are symbolic actions, NOT real 3D operations.
 */

import React, { useState } from 'react';

// ============================================================
// TYPES
// ============================================================

interface XRTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'layout' | 'mapping' | 'navigation' | 'utility';
  shortcut?: string;
}

interface XRToolsPanelProps {
  onToolSelect?: (toolId: string) => void;
  selectedToolId?: string;
  collapsible?: boolean;
}

// ============================================================
// CONSTANTS
// ============================================================

const CHENU_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

const XR_TOOLS: XRTool[] = [
  // Layout Tools
  {
    id: 'center',
    name: 'Center Object',
    description: 'Center selected object at origin',
    icon: '⊕',
    category: 'layout',
    shortcut: 'C',
  },
  {
    id: 'align-h',
    name: 'Align Horizontal',
    description: 'Align objects horizontally',
    icon: '⇿',
    category: 'layout',
    shortcut: 'H',
  },
  {
    id: 'align-v',
    name: 'Align Vertical',
    description: 'Align objects vertically',
    icon: '↕',
    category: 'layout',
    shortcut: 'V',
  },
  {
    id: 'distribute',
    name: 'Distribute',
    description: 'Distribute objects evenly',
    icon: '⋯',
    category: 'layout',
    shortcut: 'D',
  },
  {
    id: 'cluster',
    name: 'Cluster',
    description: 'Group objects in a cluster',
    icon: '◉',
    category: 'layout',
    shortcut: 'G',
  },
  {
    id: 'circle',
    name: 'Circle Arrange',
    description: 'Arrange objects in a circle',
    icon: '○',
    category: 'layout',
    shortcut: 'O',
  },
  
  // Mapping Tools
  {
    id: 'map-sphere',
    name: 'Map to Sphere',
    description: 'Assign objects to a sphere',
    icon: '🌐',
    category: 'mapping',
  },
  {
    id: 'map-domain',
    name: 'Map to Domain',
    description: 'Assign objects to a domain',
    icon: '📂',
    category: 'mapping',
  },
  {
    id: 'link-portal',
    name: 'Link Portal',
    description: 'Create a portal between scenes',
    icon: '🌀',
    category: 'mapping',
  },
  {
    id: 'tag',
    name: 'Add Tag',
    description: 'Tag objects for organization',
    icon: '🏷️',
    category: 'mapping',
  },
  
  // Navigation Tools
  {
    id: 'zoom-fit',
    name: 'Zoom to Fit',
    description: 'Fit all objects in view',
    icon: '⊡',
    category: 'navigation',
    shortcut: 'F',
  },
  {
    id: 'zoom-selection',
    name: 'Zoom to Selection',
    description: 'Zoom to selected objects',
    icon: '◎',
    category: 'navigation',
    shortcut: 'Z',
  },
  {
    id: 'pan',
    name: 'Pan View',
    description: 'Move the viewport',
    icon: '✋',
    category: 'navigation',
    shortcut: 'Space',
  },
  {
    id: 'orbit',
    name: 'Orbit View',
    description: 'Rotate viewport around center',
    icon: '↻',
    category: 'navigation',
    shortcut: 'R',
  },
  
  // Utility Tools
  {
    id: 'select',
    name: 'Select',
    description: 'Select objects',
    icon: '↖',
    category: 'utility',
    shortcut: 'S',
  },
  {
    id: 'multi-select',
    name: 'Multi Select',
    description: 'Select multiple objects',
    icon: '⬚',
    category: 'utility',
    shortcut: 'Shift+S',
  },
  {
    id: 'measure',
    name: 'Measure',
    description: 'Measure distance between objects',
    icon: '📏',
    category: 'utility',
    shortcut: 'M',
  },
  {
    id: 'info',
    name: 'Object Info',
    description: 'View object details',
    icon: 'ℹ️',
    category: 'utility',
    shortcut: 'I',
  },
];

const CATEGORY_CONFIG: Record<string, { name: string; icon: string; color: string }> = {
  layout: { name: 'Layout', icon: '📐', color: CHENU_COLORS.sacredGold },
  mapping: { name: 'Mapping', icon: '🗺️', color: CHENU_COLORS.jungleEmerald },
  navigation: { name: 'Navigation', icon: '🧭', color: CHENU_COLORS.cenoteTurquoise },
  utility: { name: 'Utility', icon: '🔧', color: CHENU_COLORS.earthEmber },
};

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: CHENU_COLORS.uiSlate,
    borderRadius: '12px',
    overflow: 'hidden',
    color: CHENU_COLORS.softSand,
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
    cursor: 'pointer',
  },
  title: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  collapseIcon: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    transition: 'transform 0.2s ease',
  },
  content: {
    padding: '12px',
  },
  category: {
    marginBottom: '12px',
  },
  categoryHeader: {
    fontSize: '11px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  categoryDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  toolGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '6px',
  },
  tool: {
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  toolSelected: {
    backgroundColor: `${CHENU_COLORS.cenoteTurquoise}20`,
    borderColor: CHENU_COLORS.cenoteTurquoise,
  },
  toolIcon: {
    fontSize: '18px',
  },
  toolName: {
    fontSize: '10px',
    fontWeight: 500,
    textAlign: 'center',
  },
  toolShortcut: {
    fontSize: '9px',
    color: CHENU_COLORS.ancientStone,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '8px 12px',
    backgroundColor: CHENU_COLORS.uiSlate,
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    borderRadius: '6px',
    fontSize: '11px',
    whiteSpace: 'nowrap',
    zIndex: 100,
    marginBottom: '4px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  quickAccess: {
    padding: '12px',
    borderTop: `1px solid ${CHENU_COLORS.shadowMoss}`,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  quickAccessTitle: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  quickAccessTools: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  quickTool: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.2s ease',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRToolsPanel: React.FC<XRToolsPanelProps> = ({
  onToolSelect,
  selectedToolId,
  collapsible = true,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  // Group tools by category
  const toolsByCategory = XR_TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, XRTool[]>);

  // Quick access tools (with shortcuts)
  const quickAccessTools = XR_TOOLS.filter(t => t.shortcut && t.shortcut.length === 1);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div
        style={styles.header}
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
      >
        <div style={styles.title}>
          <span>🛠️</span>
          XR Tools
        </div>
        {collapsible && (
          <span
            style={{
              ...styles.collapseIcon,
              transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            }}
          >
            ▼
          </span>
        )}
      </div>

      {/* Content */}
      {!isCollapsed && (
        <>
          <div style={styles.content}>
            {Object.entries(toolsByCategory).map(([category, tools]) => {
              const config = CATEGORY_CONFIG[category];
              return (
                <div key={category} style={styles.category}>
                  <div style={styles.categoryHeader}>
                    <div
                      style={{
                        ...styles.categoryDot,
                        backgroundColor: config.color,
                      }}
                    />
                    {config.icon} {config.name}
                  </div>
                  <div style={styles.toolGrid}>
                    {tools.map(tool => (
                      <div
                        key={tool.id}
                        style={{
                          ...styles.tool,
                          ...(selectedToolId === tool.id ? styles.toolSelected : {}),
                          position: 'relative',
                        }}
                        onClick={() => onToolSelect?.(tool.id)}
                        onMouseEnter={() => setHoveredTool(tool.id)}
                        onMouseLeave={() => setHoveredTool(null)}
                      >
                        <span style={styles.toolIcon}>{tool.icon}</span>
                        <span style={styles.toolName}>{tool.name}</span>
                        {tool.shortcut && (
                          <span style={styles.toolShortcut}>{tool.shortcut}</span>
                        )}
                        
                        {/* Tooltip */}
                        {hoveredTool === tool.id && (
                          <div style={styles.tooltip}>
                            {tool.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Access */}
          <div style={styles.quickAccess}>
            <div style={styles.quickAccessTitle}>Quick Access</div>
            <div style={styles.quickAccessTools}>
              {quickAccessTools.map(tool => (
                <div
                  key={tool.id}
                  style={{
                    ...styles.quickTool,
                    backgroundColor:
                      selectedToolId === tool.id
                        ? `${CHENU_COLORS.cenoteTurquoise}30`
                        : 'rgba(255,255,255,0.05)',
                  }}
                  onClick={() => onToolSelect?.(tool.id)}
                  title={`${tool.name} (${tool.shortcut})`}
                >
                  {tool.icon}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default XRToolsPanel;
