/**
 * ============================================================
 * CHE·NU — XR UNIVERSE EDITOR (ARCHITECTURE)
 * SAFE · STRUCTURAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * UI components for XR Universe Editor with Architecture integration.
 */

import React, { useState, useMemo, useCallback } from 'react';

// ============================================================
// STYLES
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
  cardBg: '#2A2B2E',
  borderColor: '#3A3B3E',
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#707070',
  xrAccent: '#00BCD4',
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: COLORS.uiSlate,
    borderRadius: '16px',
    border: `1px solid ${COLORS.borderColor}`,
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    padding: '20px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottom: `1px solid ${COLORS.borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: COLORS.textPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    backgroundColor: 'rgba(0,188,212,0.2)',
    color: COLORS.xrAccent,
    border: `1px solid ${COLORS.xrAccent}40`,
  },
  content: {
    padding: '20px',
  },
  templateGallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  templateCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    border: `2px solid ${COLORS.borderColor}`,
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  templateCardActive: {
    borderColor: COLORS.sacredGold,
    boxShadow: `0 0 0 3px ${COLORS.sacredGold}30`,
  },
  templateIcon: {
    fontSize: '32px',
    marginBottom: '12px',
  },
  templateName: {
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.textPrimary,
    marginBottom: '4px',
  },
  templateDesc: {
    fontSize: '12px',
    color: COLORS.textMuted,
    lineHeight: 1.4,
  },
  templateMeta: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    flexWrap: 'wrap',
  },
  templateTag: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: COLORS.textSecondary,
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  previewContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    padding: '20px',
    minHeight: '300px',
    position: 'relative',
  },
  universeMap: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: '8px',
    height: '250px',
  },
  roomNode: {
    backgroundColor: 'rgba(0,188,212,0.15)',
    border: `2px solid ${COLORS.xrAccent}50`,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  roomNodeCenter: {
    backgroundColor: 'rgba(216,178,106,0.2)',
    borderColor: COLORS.sacredGold,
  },
  roomNodeIcon: {
    fontSize: '20px',
    marginBottom: '4px',
  },
  roomNodeLabel: {
    fontSize: '10px',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  portalLine: {
    position: 'absolute',
    backgroundColor: COLORS.xrAccent,
    height: '2px',
    transformOrigin: 'left center',
  },
  controls: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  button: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  buttonPrimary: {
    backgroundColor: COLORS.cenoteTurquoise,
    color: COLORS.uiSlate,
  },
  buttonSecondary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: COLORS.textSecondary,
  },
  footer: {
    padding: '16px 20px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderTop: `1px solid ${COLORS.borderColor}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11px',
    color: COLORS.textMuted,
  },
  safetyBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: 'rgba(63,114,73,0.2)',
    border: `1px solid ${COLORS.jungleEmerald}`,
    borderRadius: '6px',
    color: COLORS.jungleEmerald,
    fontSize: '9px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
};

// ============================================================
// TYPES
// ============================================================

interface UniverseTemplate {
  id: string;
  name: string;
  description: string;
  layout: string;
  domain: string;
  roomCount: number;
  icon: string;
}

interface XRRoom {
  id: string;
  name: string;
  icon: string;
  position: { x: number; y: number };
  isCenter?: boolean;
}

interface XRUniverseEditorProps {
  domain?: string;
  onTemplateSelect?: (template: UniverseTemplate) => void;
  onCreateUniverse?: (templateId: string) => void;
}

// ============================================================
// TEMPLATE DATA
// ============================================================

const ARCHITECTURE_TEMPLATES: UniverseTemplate[] = [
  {
    id: 'archi_hub',
    name: 'Architectural Hub Universe',
    description: 'Central concept room + satellite rooms for blueprint, zoning, structure, and layout',
    layout: 'hub',
    domain: 'Architecture',
    roomCount: 5,
    icon: '🏛️',
  },
  {
    id: 'archi_linear',
    name: 'Architectural Linear Flow',
    description: 'Linear progression: Concept → Zoning → Structure → Layout → Final',
    layout: 'linear',
    domain: 'Architecture',
    roomCount: 5,
    icon: '📐',
  },
  {
    id: 'archi_minimal',
    name: 'Architectural Minimal',
    description: 'Simple 2-room setup for quick work',
    layout: 'minimal',
    domain: 'Architecture',
    roomCount: 2,
    icon: '⚡',
  },
  {
    id: 'archi_workshop',
    name: 'Architectural Workshop',
    description: 'Complete workshop with all room types',
    layout: 'workshop',
    domain: 'Architecture',
    roomCount: 5,
    icon: '🔧',
  },
];

// ============================================================
// COMPONENT
// ============================================================

export const XRUniverseEditorArchitecture: React.FC<XRUniverseEditorProps> = ({
  domain = 'Architecture',
  onTemplateSelect,
  onCreateUniverse,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>('archi_hub');
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  // Get current template
  const currentTemplate = useMemo(() => {
    return ARCHITECTURE_TEMPLATES.find(t => t.id === selectedTemplate);
  }, [selectedTemplate]);

  // Generate preview rooms based on template
  const previewRooms = useMemo((): XRRoom[] => {
    if (!currentTemplate) return [];

    switch (currentTemplate.layout) {
      case 'hub':
        return [
          { id: 'central', name: 'Concept', icon: '🏛️', position: { x: 2, y: 1 }, isCenter: true },
          { id: 'blueprint', name: 'Blueprint', icon: '📐', position: { x: 2, y: 0 } },
          { id: 'zoning', name: 'Zoning', icon: '◻️', position: { x: 1, y: 1 } },
          { id: 'structure', name: 'Structure', icon: '🔗', position: { x: 3, y: 1 } },
          { id: 'grid', name: 'Grid', icon: '📏', position: { x: 2, y: 2 } },
        ];
      case 'linear':
        return [
          { id: 'concept', name: 'Concept', icon: '💡', position: { x: 0, y: 1 }, isCenter: true },
          { id: 'zoning', name: 'Zoning', icon: '◻️', position: { x: 1, y: 1 } },
          { id: 'structure', name: 'Structure', icon: '🔗', position: { x: 2, y: 1 } },
          { id: 'layout', name: 'Layout', icon: '📏', position: { x: 3, y: 1 } },
          { id: 'final', name: 'Final', icon: '📐', position: { x: 4, y: 1 } },
        ];
      case 'minimal':
        return [
          { id: 'main', name: 'Main', icon: '🏛️', position: { x: 1, y: 1 }, isCenter: true },
          { id: 'blueprint', name: 'Blueprint', icon: '📐', position: { x: 3, y: 1 } },
        ];
      case 'workshop':
        return [
          { id: 'central', name: 'Central', icon: '🏛️', position: { x: 2, y: 1 }, isCenter: true },
          { id: 'blueprint', name: 'Blueprint', icon: '📐', position: { x: 1, y: 0 } },
          { id: 'zoning', name: 'Zoning', icon: '◻️', position: { x: 3, y: 0 } },
          { id: 'structure', name: 'Structure', icon: '🔗', position: { x: 1, y: 2 } },
          { id: 'grid', name: 'Grid', icon: '📏', position: { x: 3, y: 2 } },
        ];
      default:
        return [];
    }
  }, [currentTemplate]);

  // Handle template selection
  const handleTemplateSelect = useCallback((templateId: string) => {
    setSelectedTemplate(templateId);
    const template = ARCHITECTURE_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      onTemplateSelect?.(template);
    }
  }, [onTemplateSelect]);

  // Handle create
  const handleCreate = useCallback(() => {
    if (selectedTemplate) {
      onCreateUniverse?.(selectedTemplate);
    }
  }, [selectedTemplate, onCreateUniverse]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>🌀</span>
          <span>XR Universe Editor</span>
          <span style={styles.badge}>{domain}</span>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Template Gallery */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>🏛️ Architecture Templates</div>
          <div style={styles.templateGallery}>
            {ARCHITECTURE_TEMPLATES.map(template => (
              <div
                key={template.id}
                style={{
                  ...styles.templateCard,
                  ...(selectedTemplate === template.id ? styles.templateCardActive : {}),
                }}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div style={styles.templateIcon}>{template.icon}</div>
                <div style={styles.templateName}>{template.name}</div>
                <div style={styles.templateDesc}>{template.description}</div>
                <div style={styles.templateMeta}>
                  <span style={styles.templateTag}>{template.roomCount} rooms</span>
                  <span style={styles.templateTag}>{template.layout}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Universe Preview */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>🗺️ Universe Preview</div>
          <div style={styles.previewContainer}>
            <div style={styles.universeMap}>
              {Array.from({ length: 15 }).map((_, i) => {
                const x = i % 5;
                const y = Math.floor(i / 5);
                const room = previewRooms.find(r => r.position.x === x && r.position.y === y);
                
                if (!room) {
                  return <div key={i} />;
                }

                return (
                  <div
                    key={room.id}
                    style={{
                      ...styles.roomNode,
                      ...(room.isCenter ? styles.roomNodeCenter : {}),
                      transform: hoveredRoom === room.id ? 'scale(1.05)' : 'scale(1)',
                    }}
                    onMouseEnter={() => setHoveredRoom(room.id)}
                    onMouseLeave={() => setHoveredRoom(null)}
                  >
                    <div style={styles.roomNodeIcon}>{room.icon}</div>
                    <div style={styles.roomNodeLabel}>{room.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          <button
            style={{ ...styles.button, ...styles.buttonPrimary }}
            onClick={handleCreate}
            disabled={!selectedTemplate}
          >
            🌀 Create Universe
          </button>
          <button style={{ ...styles.button, ...styles.buttonSecondary }}>
            📋 View Details
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span>
          {currentTemplate 
            ? `Selected: ${currentTemplate.name} (${currentTemplate.roomCount} rooms)`
            : 'Select a template to preview'
          }
        </span>
        <div style={styles.safetyBadge}>
          🛡️ SAFE · SYMBOLIC · NON-AUTONOMOUS
        </div>
      </div>
    </div>
  );
};

export default XRUniverseEditorArchitecture;
