/**
 * ============================================================
 * CHE·NU — XR SCENE COMPOSER
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Visual scene composition interface.
 * Drag-and-drop sectors, configure scene properties.
 */

import React, { useState, useCallback, useMemo } from 'react';

// ============================================================
// TYPES
// ============================================================

interface SectorTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultSize: 'small' | 'medium' | 'large';
}

interface ComposedSector {
  templateId: string;
  name: string;
  position: { x: number; y: number };
  size: 'small' | 'medium' | 'large';
}

interface SceneComposition {
  name: string;
  sphere: string;
  domain?: string;
  sectors: ComposedSector[];
  description?: string;
}

interface XRSceneComposerProps {
  onSave?: (composition: SceneComposition) => void;
  onCancel?: () => void;
  initialComposition?: Partial<SceneComposition>;
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

const SPHERES = [
  { id: 'personal', name: 'Personal', icon: '🏠', color: CHENU_COLORS.sacredGold },
  { id: 'business', name: 'Business', icon: '💼', color: CHENU_COLORS.jungleEmerald },
  { id: 'creative', name: 'Creative', icon: '🎨', color: '#9B59B6' },
  { id: 'social', name: 'Social', icon: '👥', color: CHENU_COLORS.cenoteTurquoise },
  { id: 'scholars', name: 'Scholar', icon: '📚', color: '#3498DB' },
  { id: 'ailab', name: 'AI Lab', icon: '🤖', color: '#00D9FF' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎮', color: '#E74C3C' },
  { id: 'health', name: 'Health', icon: '💚', color: '#27AE60' },
  { id: 'construction', name: 'Construction', icon: '🏗️', color: CHENU_COLORS.earthEmber },
];

const SECTOR_TEMPLATES: SectorTemplate[] = [
  { id: 'entrance', name: 'Entrance', icon: '🚪', description: 'Main entry point', defaultSize: 'medium' },
  { id: 'hub', name: 'Hub', icon: '⭕', description: 'Central connection area', defaultSize: 'large' },
  { id: 'workspace', name: 'Workspace', icon: '💻', description: 'Work and productivity', defaultSize: 'medium' },
  { id: 'storage', name: 'Storage', icon: '📦', description: 'Data and file storage', defaultSize: 'small' },
  { id: 'meeting', name: 'Meeting Room', icon: '🗣️', description: 'Collaboration space', defaultSize: 'medium' },
  { id: 'display', name: 'Display', icon: '🖼️', description: 'Visualization area', defaultSize: 'large' },
  { id: 'garden', name: 'Garden', icon: '🌿', description: 'Relaxation zone', defaultSize: 'medium' },
  { id: 'archive', name: 'Archive', icon: '📁', description: 'Historical data', defaultSize: 'small' },
  { id: 'lab', name: 'Laboratory', icon: '🔬', description: 'Experimentation', defaultSize: 'large' },
  { id: 'lounge', name: 'Lounge', icon: '🛋️', description: 'Casual space', defaultSize: 'medium' },
  { id: 'control', name: 'Control Room', icon: '🎛️', description: 'System controls', defaultSize: 'medium' },
  { id: 'portal', name: 'Portal Bay', icon: '🌀', description: 'Transit point', defaultSize: 'small' },
];

const SIZE_DIMENSIONS = {
  small: { w: 60, h: 60 },
  medium: { w: 90, h: 90 },
  large: { w: 120, h: 120 },
};

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr 280px',
    gap: '16px',
    height: '600px',
    backgroundColor: CHENU_COLORS.uiSlate,
    borderRadius: '16px',
    padding: '16px',
    color: CHENU_COLORS.softSand,
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  panel: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '12px',
    padding: '14px',
    overflow: 'auto',
  },
  panelTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  templateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  templateItem: {
    padding: '10px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    cursor: 'grab',
    transition: 'all 0.2s ease',
    textAlign: 'center',
    border: `1px solid transparent`,
  },
  templateItemHover: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: CHENU_COLORS.shadowMoss,
  },
  templateIcon: {
    fontSize: '24px',
    marginBottom: '4px',
  },
  templateName: {
    fontSize: '11px',
    color: CHENU_COLORS.softSand,
  },
  canvas: {
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  canvasGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(62, 180, 162, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(62, 180, 162, 0.1) 1px, transparent 1px)
    `,
    backgroundSize: '30px 30px',
  },
  canvasContent: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  sectorNode: {
    position: 'absolute',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'move',
    transition: 'box-shadow 0.2s ease',
    border: '2px solid',
  },
  sectorNodeSelected: {
    boxShadow: `0 0 0 3px ${CHENU_COLORS.sacredGold}`,
  },
  sectorIcon: {
    fontSize: '28px',
    marginBottom: '4px',
  },
  sectorName: {
    fontSize: '10px',
    fontWeight: 500,
    textAlign: 'center',
    maxWidth: '90%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  formGroup: {
    marginBottom: '14px',
  },
  label: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '6px',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '60px',
  },
  sphereGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '6px',
  },
  sphereOption: {
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: `2px solid transparent`,
  },
  sphereOptionSelected: {
    borderColor: CHENU_COLORS.sacredGold,
  },
  sphereIcon: {
    fontSize: '18px',
  },
  sphereName: {
    fontSize: '9px',
    marginTop: '2px',
    color: CHENU_COLORS.ancientStone,
  },
  sectorDetail: {
    padding: '12px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    marginTop: '12px',
  },
  sectorDetailHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  deleteButton: {
    padding: '4px 8px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    color: '#E74C3C',
    fontSize: '11px',
    cursor: 'pointer',
  },
  sizeSelector: {
    display: 'flex',
    gap: '6px',
  },
  sizeOption: {
    flex: 1,
    padding: '8px',
    borderRadius: '6px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    backgroundColor: 'rgba(0,0,0,0.2)',
    color: CHENU_COLORS.softSand,
    fontSize: '11px',
    cursor: 'pointer',
    textAlign: 'center',
  },
  sizeOptionSelected: {
    borderColor: CHENU_COLORS.cenoteTurquoise,
    backgroundColor: `${CHENU_COLORS.cenoteTurquoise}20`,
  },
  footer: {
    display: 'flex',
    gap: '10px',
    marginTop: 'auto',
    paddingTop: '12px',
    borderTop: `1px solid ${CHENU_COLORS.shadowMoss}`,
  },
  button: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  primaryButton: {
    backgroundColor: CHENU_COLORS.sacredGold,
    color: CHENU_COLORS.uiSlate,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.softSand,
  },
  stats: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '8px',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRSceneComposer: React.FC<XRSceneComposerProps> = ({
  onSave,
  onCancel,
  initialComposition,
}) => {
  const [name, setName] = useState(initialComposition?.name ?? '');
  const [sphere, setSphere] = useState(initialComposition?.sphere ?? 'personal');
  const [domain, setDomain] = useState(initialComposition?.domain ?? '');
  const [description, setDescription] = useState(initialComposition?.description ?? '');
  const [sectors, setSectors] = useState<ComposedSector[]>(initialComposition?.sectors ?? []);
  const [selectedSectorIndex, setSelectedSectorIndex] = useState<number | null>(null);
  const [draggedTemplate, setDraggedTemplate] = useState<string | null>(null);

  // Get sphere data
  const currentSphere = useMemo(() => SPHERES.find(s => s.id === sphere), [sphere]);

  // Add sector from template
  const handleAddSector = useCallback((templateId: string, x: number, y: number) => {
    const template = SECTOR_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    const newSector: ComposedSector = {
      templateId,
      name: template.name,
      position: { x, y },
      size: template.defaultSize,
    };

    setSectors(prev => [...prev, newSector]);
    setSelectedSectorIndex(sectors.length);
  }, [sectors.length]);

  // Update sector
  const handleUpdateSector = useCallback((index: number, updates: Partial<ComposedSector>) => {
    setSectors(prev => prev.map((s, i) => i === index ? { ...s, ...updates } : s));
  }, []);

  // Delete sector
  const handleDeleteSector = useCallback((index: number) => {
    setSectors(prev => prev.filter((_, i) => i !== index));
    setSelectedSectorIndex(null);
  }, []);

  // Handle canvas drop
  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedTemplate) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 45;
    const y = e.clientY - rect.top - 45;

    handleAddSector(draggedTemplate, Math.max(0, x), Math.max(0, y));
    setDraggedTemplate(null);
  }, [draggedTemplate, handleAddSector]);

  // Handle save
  const handleSave = useCallback(() => {
    if (!name.trim()) return;

    const composition: SceneComposition = {
      name: name.trim(),
      sphere,
      domain: domain.trim() || undefined,
      description: description.trim() || undefined,
      sectors,
    };

    onSave?.(composition);
  }, [name, sphere, domain, description, sectors, onSave]);

  // Selected sector data
  const selectedSector = selectedSectorIndex !== null ? sectors[selectedSectorIndex] : null;
  const selectedTemplate = selectedSector
    ? SECTOR_TEMPLATES.find(t => t.id === selectedSector.templateId)
    : null;

  return (
    <div style={styles.container}>
      {/* Left Panel - Templates */}
      <div style={styles.panel}>
        <div style={styles.panelTitle}>
          <span>📦</span>
          Sector Templates
        </div>
        <div style={styles.templateGrid}>
          {SECTOR_TEMPLATES.map(template => (
            <div
              key={template.id}
              style={styles.templateItem}
              draggable
              onDragStart={() => setDraggedTemplate(template.id)}
              onDragEnd={() => setDraggedTemplate(null)}
              title={template.description}
            >
              <div style={styles.templateIcon}>{template.icon}</div>
              <div style={styles.templateName}>{template.name}</div>
            </div>
          ))}
        </div>
        <div style={styles.stats}>
          Drag templates to canvas to add sectors
        </div>
      </div>

      {/* Center - Canvas */}
      <div
        style={styles.canvas}
        onDragOver={e => e.preventDefault()}
        onDrop={handleCanvasDrop}
      >
        <div style={styles.canvasGrid} />
        <div style={styles.canvasContent}>
          {sectors.map((sector, index) => {
            const template = SECTOR_TEMPLATES.find(t => t.id === sector.templateId);
            const dims = SIZE_DIMENSIONS[sector.size];
            const isSelected = selectedSectorIndex === index;

            return (
              <div
                key={index}
                style={{
                  ...styles.sectorNode,
                  ...(isSelected ? styles.sectorNodeSelected : {}),
                  left: sector.position.x,
                  top: sector.position.y,
                  width: dims.w,
                  height: dims.h,
                  backgroundColor: `${currentSphere?.color ?? CHENU_COLORS.ancientStone}30`,
                  borderColor: currentSphere?.color ?? CHENU_COLORS.ancientStone,
                }}
                onClick={() => setSelectedSectorIndex(index)}
              >
                <span style={styles.sectorIcon}>{template?.icon ?? '📍'}</span>
                <span style={styles.sectorName}>{sector.name}</span>
              </div>
            );
          })}

          {sectors.length === 0 && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: CHENU_COLORS.ancientStone,
              fontSize: '14px',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <span style={{ fontSize: '40px' }}>🎨</span>
              <span>Drag sectors here to compose your scene</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Properties */}
      <div style={{ ...styles.panel, display: 'flex', flexDirection: 'column' }}>
        <div style={styles.panelTitle}>
          <span>⚙️</span>
          Scene Properties
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Scene Name</label>
          <input
            type="text"
            style={styles.input}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter scene name..."
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Sphere</label>
          <div style={styles.sphereGrid}>
            {SPHERES.slice(0, 9).map(s => (
              <div
                key={s.id}
                style={{
                  ...styles.sphereOption,
                  ...(sphere === s.id ? styles.sphereOptionSelected : {}),
                }}
                onClick={() => setSphere(s.id)}
              >
                <div style={styles.sphereIcon}>{s.icon}</div>
                <div style={styles.sphereName}>{s.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Domain (Optional)</label>
          <input
            type="text"
            style={styles.input}
            value={domain}
            onChange={e => setDomain(e.target.value)}
            placeholder="e.g., finance, marketing..."
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe this scene..."
          />
        </div>

        {/* Selected Sector Detail */}
        {selectedSector && selectedTemplate && (
          <div style={styles.sectorDetail}>
            <div style={styles.sectorDetailHeader}>
              <span style={{ fontWeight: 600 }}>
                {selectedTemplate.icon} {selectedSector.name}
              </span>
              <button
                style={styles.deleteButton}
                onClick={() => handleDeleteSector(selectedSectorIndex!)}
              >
                🗑️ Delete
              </button>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Sector Name</label>
              <input
                type="text"
                style={styles.input}
                value={selectedSector.name}
                onChange={e => handleUpdateSector(selectedSectorIndex!, { name: e.target.value })}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Size</label>
              <div style={styles.sizeSelector}>
                {(['small', 'medium', 'large'] as const).map(size => (
                  <button
                    key={size}
                    style={{
                      ...styles.sizeOption,
                      ...(selectedSector.size === size ? styles.sizeOptionSelected : {}),
                    }}
                    onClick={() => handleUpdateSector(selectedSectorIndex!, { size })}
                  >
                    {size === 'small' && 'S'}
                    {size === 'medium' && 'M'}
                    {size === 'large' && 'L'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={styles.stats}>
          {sectors.length} sector{sectors.length !== 1 ? 's' : ''} in scene
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          {onCancel && (
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
          <button
            style={{
              ...styles.button,
              ...styles.primaryButton,
              opacity: name.trim() ? 1 : 0.5,
            }}
            onClick={handleSave}
            disabled={!name.trim()}
          >
            💾 Save Scene
          </button>
        </div>
      </div>
    </div>
  );
};

export default XRSceneComposer;
