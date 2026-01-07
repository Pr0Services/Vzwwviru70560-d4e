/**
 * ============================================================
 * CHE·NU — XR WORLD BUILDER PAGE
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React, { useState, useCallback } from 'react';

// ============================================================
// TYPES
// ============================================================

interface SceneObject {
  id: string;
  name: string;
  type: 'mesh' | 'light' | 'portal' | 'hotspot' | 'group';
  geometry?: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  material?: {
    color: string;
    metalness?: number;
    roughness?: number;
    emissive?: boolean;
  };
  visible: boolean;
  locked: boolean;
}

interface SceneConfig {
  id: string;
  name: string;
  environment: string;
  sphere: string;
  objects: SceneObject[];
}

interface Tool {
  id: string;
  name: string;
  icon: string;
  category: 'select' | 'create' | 'modify' | 'view';
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

const TOOLS: Tool[] = [
  { id: 'select', name: 'Select', icon: '🖱️', category: 'select' },
  { id: 'move', name: 'Move', icon: '✥', category: 'modify' },
  { id: 'rotate', name: 'Rotate', icon: '🔄', category: 'modify' },
  { id: 'scale', name: 'Scale', icon: '⤢', category: 'modify' },
  { id: 'box', name: 'Box', icon: '⬜', category: 'create' },
  { id: 'sphere', name: 'Sphere', icon: '⚪', category: 'create' },
  { id: 'cylinder', name: 'Cylinder', icon: '🔲', category: 'create' },
  { id: 'plane', name: 'Plane', icon: '▭', category: 'create' },
  { id: 'light', name: 'Light', icon: '💡', category: 'create' },
  { id: 'portal', name: 'Portal', icon: '🌀', category: 'create' },
  { id: 'hotspot', name: 'Hotspot', icon: '📍', category: 'create' },
  { id: 'orbit', name: 'Orbit', icon: '🔭', category: 'view' },
  { id: 'pan', name: 'Pan', icon: '🖐️', category: 'view' },
  { id: 'zoom', name: 'Zoom', icon: '🔍', category: 'view' },
];

const GEOMETRIES = ['box', 'sphere', 'cylinder', 'cone', 'torus', 'plane', 'ring'];

const ENVIRONMENTS = [
  { id: 'sanctuary', name: 'Sanctuary', sphere: 'personal' },
  { id: 'creative-studio', name: 'Creative Studio', sphere: 'creative' },
  { id: 'business-hub', name: 'Business Hub', sphere: 'business' },
  { id: 'social-plaza', name: 'Social Plaza', sphere: 'social' },
  { id: 'scholar-library', name: 'Scholar Library', sphere: 'scholars' },
  { id: 'ai-laboratory', name: 'AI Laboratory', sphere: 'ailab' },
  { id: 'observatory', name: 'Observatory', sphere: 'systems' },
];

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: CHENU_COLORS.uiSlate,
    color: CHENU_COLORS.softSand,
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottom: `1px solid ${CHENU_COLORS.shadowMoss}`,
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
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
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
  },
  main: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  toolbar: {
    width: '60px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRight: `1px solid ${CHENU_COLORS.shadowMoss}`,
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  toolCategory: {
    marginBottom: '12px',
  },
  toolCategoryLabel: {
    fontSize: '9px',
    textTransform: 'uppercase',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '4px',
    textAlign: 'center',
  },
  toolButton: {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    backgroundColor: 'transparent',
    transition: 'all 0.2s ease',
  },
  toolButtonActive: {
    backgroundColor: CHENU_COLORS.sacredGold,
  },
  viewport: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  viewportCanvas: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(62, 180, 162, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(62, 180, 162, 0.1) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    pointerEvents: 'none',
  },
  viewportInfo: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '6px 10px',
    borderRadius: '4px',
  },
  panel: {
    width: '280px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderLeft: `1px solid ${CHENU_COLORS.shadowMoss}`,
    display: 'flex',
    flexDirection: 'column',
  },
  panelHeader: {
    padding: '12px 16px',
    borderBottom: `1px solid ${CHENU_COLORS.shadowMoss}`,
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
  },
  panelContent: {
    flex: 1,
    overflow: 'auto',
    padding: '12px',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '11px',
    textTransform: 'uppercase',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '8px',
    letterSpacing: '0.5px',
  },
  inputGroup: {
    marginBottom: '12px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
  },
  select: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
  },
  vector3Input: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '4px',
  },
  vectorField: {
    padding: '6px 8px',
    borderRadius: '4px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: CHENU_COLORS.softSand,
    fontSize: '12px',
    textAlign: 'center',
  },
  objectList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  objectItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 10px',
    borderRadius: '6px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  objectItemSelected: {
    backgroundColor: 'rgba(216, 178, 106, 0.2)',
    border: `1px solid ${CHENU_COLORS.sacredGold}`,
  },
  objectIcon: {
    fontSize: '14px',
  },
  objectName: {
    flex: 1,
    fontSize: '12px',
  },
  objectActions: {
    display: 'flex',
    gap: '4px',
  },
  iconButton: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    cursor: 'pointer',
    fontSize: '12px',
  },
  colorPicker: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  colorSwatch: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  colorSwatchActive: {
    borderColor: CHENU_COLORS.softSand,
    transform: 'scale(1.1)',
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderTop: `1px solid ${CHENU_COLORS.shadowMoss}`,
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  placeholder3D: {
    color: CHENU_COLORS.ancientStone,
    textAlign: 'center',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRWorldBuilderPage: React.FC = () => {
  // State
  const [activeTool, setActiveTool] = useState<string>('select');
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [scene, setScene] = useState<SceneConfig>({
    id: 'scene-new',
    name: 'Untitled Scene',
    environment: 'sanctuary',
    sphere: 'personal',
    objects: [
      {
        id: 'obj-floor',
        name: 'Floor',
        type: 'mesh',
        geometry: 'plane',
        position: [0, 0, 0],
        rotation: [-90, 0, 0],
        scale: [10, 10, 1],
        material: { color: CHENU_COLORS.ancientStone, roughness: 0.9 },
        visible: true,
        locked: true,
      },
      {
        id: 'obj-sphere-1',
        name: 'Golden Sphere',
        type: 'mesh',
        geometry: 'sphere',
        position: [0, 1, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        material: { color: CHENU_COLORS.sacredGold, metalness: 0.3 },
        visible: true,
        locked: false,
      },
      {
        id: 'obj-light-1',
        name: 'Main Light',
        type: 'light',
        position: [5, 8, 5],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        visible: true,
        locked: false,
      },
    ],
  });

  // Handlers
  const handleToolSelect = useCallback((toolId: string) => {
    setActiveTool(toolId);
  }, []);

  const handleObjectSelect = useCallback((objectId: string) => {
    setSelectedObject(objectId === selectedObject ? null : objectId);
  }, [selectedObject]);

  const handleToggleVisibility = useCallback((objectId: string) => {
    setScene(prev => ({
      ...prev,
      objects: prev.objects.map(obj =>
        obj.id === objectId ? { ...obj, visible: !obj.visible } : obj
      ),
    }));
  }, []);

  const handleToggleLock = useCallback((objectId: string) => {
    setScene(prev => ({
      ...prev,
      objects: prev.objects.map(obj =>
        obj.id === objectId ? { ...obj, locked: !obj.locked } : obj
      ),
    }));
  }, []);

  const selectedObj = scene.objects.find(o => o.id === selectedObject);

  // Group tools by category
  const toolsByCategory = TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  const getObjectIcon = (type: string) => {
    switch (type) {
      case 'mesh': return '🔷';
      case 'light': return '💡';
      case 'portal': return '🌀';
      case 'hotspot': return '📍';
      case 'group': return '📁';
      default: return '❓';
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.title}>
          <span>🌐</span>
          <span>XR World Builder</span>
          <span style={{ color: CHENU_COLORS.ancientStone, fontWeight: 400 }}>
            — {scene.name}
          </span>
        </div>
        <div style={styles.headerActions}>
          <button style={{ ...styles.button, ...styles.secondaryButton }}>
            Preview
          </button>
          <button style={{ ...styles.button, ...styles.secondaryButton }}>
            Export
          </button>
          <button style={{ ...styles.button, ...styles.primaryButton }}>
            Save Scene
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Toolbar */}
        <aside style={styles.toolbar}>
          {Object.entries(toolsByCategory).map(([category, tools]) => (
            <div key={category} style={styles.toolCategory}>
              <div style={styles.toolCategoryLabel}>{category}</div>
              {tools.map(tool => (
                <button
                  key={tool.id}
                  style={{
                    ...styles.toolButton,
                    ...(activeTool === tool.id ? styles.toolButtonActive : {}),
                  }}
                  onClick={() => handleToolSelect(tool.id)}
                  title={tool.name}
                >
                  {tool.icon}
                </button>
              ))}
            </div>
          ))}
        </aside>

        {/* Viewport */}
        <section style={styles.viewport}>
          <div style={styles.viewportCanvas}>
            <div style={styles.gridOverlay} />
            <div style={styles.placeholder3D}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎮</div>
              <div style={{ fontSize: '16px', marginBottom: '8px' }}>3D Viewport</div>
              <div style={{ fontSize: '12px' }}>
                Three.js / React Three Fiber integration point
              </div>
            </div>
            <div style={styles.viewportInfo}>
              Objects: {scene.objects.length} | Tool: {activeTool} | Environment: {scene.environment}
            </div>
          </div>
        </section>

        {/* Properties Panel */}
        <aside style={styles.panel}>
          <div style={styles.panelHeader}>
            {selectedObj ? `Properties: ${selectedObj.name}` : 'Scene Objects'}
          </div>
          <div style={styles.panelContent}>
            {selectedObj ? (
              <>
                {/* Transform Section */}
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>Transform</div>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Position</label>
                    <div style={styles.vector3Input}>
                      <input
                        type="number"
                        style={styles.vectorField}
                        value={selectedObj.position[0]}
                        readOnly
                      />
                      <input
                        type="number"
                        style={styles.vectorField}
                        value={selectedObj.position[1]}
                        readOnly
                      />
                      <input
                        type="number"
                        style={styles.vectorField}
                        value={selectedObj.position[2]}
                        readOnly
                      />
                    </div>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Rotation</label>
                    <div style={styles.vector3Input}>
                      <input
                        type="number"
                        style={styles.vectorField}
                        value={selectedObj.rotation[0]}
                        readOnly
                      />
                      <input
                        type="number"
                        style={styles.vectorField}
                        value={selectedObj.rotation[1]}
                        readOnly
                      />
                      <input
                        type="number"
                        style={styles.vectorField}
                        value={selectedObj.rotation[2]}
                        readOnly
                      />
                    </div>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Scale</label>
                    <div style={styles.vector3Input}>
                      <input
                        type="number"
                        style={styles.vectorField}
                        value={selectedObj.scale[0]}
                        readOnly
                      />
                      <input
                        type="number"
                        style={styles.vectorField}
                        value={selectedObj.scale[1]}
                        readOnly
                      />
                      <input
                        type="number"
                        style={styles.vectorField}
                        value={selectedObj.scale[2]}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                {/* Material Section */}
                {selectedObj.material && (
                  <div style={styles.section}>
                    <div style={styles.sectionTitle}>Material</div>
                    
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Color</label>
                      <div style={styles.colorPicker}>
                        {Object.values(CHENU_COLORS).map(color => (
                          <div
                            key={color}
                            style={{
                              ...styles.colorSwatch,
                              backgroundColor: color,
                              ...(selectedObj.material?.color === color
                                ? styles.colorSwatchActive
                                : {}),
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {selectedObj.material.metalness !== undefined && (
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>
                          Metalness: {selectedObj.material.metalness}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={selectedObj.material.metalness}
                          style={{ width: '100%' }}
                          readOnly
                        />
                      </div>
                    )}

                    {selectedObj.material.roughness !== undefined && (
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>
                          Roughness: {selectedObj.material.roughness}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={selectedObj.material.roughness}
                          style={{ width: '100%' }}
                          readOnly
                        />
                      </div>
                    )}
                  </div>
                )}

                <button
                  style={{ ...styles.button, ...styles.secondaryButton, width: '100%' }}
                  onClick={() => setSelectedObject(null)}
                >
                  ← Back to Object List
                </button>
              </>
            ) : (
              <>
                {/* Scene Settings */}
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>Scene Settings</div>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Scene Name</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={scene.name}
                      onChange={e => setScene(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Environment</label>
                    <select
                      style={styles.select}
                      value={scene.environment}
                      onChange={e => setScene(prev => ({ ...prev, environment: e.target.value }))}
                    >
                      {ENVIRONMENTS.map(env => (
                        <option key={env.id} value={env.id}>
                          {env.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Object List */}
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>
                    Objects ({scene.objects.length})
                  </div>
                  <div style={styles.objectList}>
                    {scene.objects.map(obj => (
                      <div
                        key={obj.id}
                        style={{
                          ...styles.objectItem,
                          ...(selectedObject === obj.id ? styles.objectItemSelected : {}),
                          opacity: obj.visible ? 1 : 0.5,
                        }}
                        onClick={() => handleObjectSelect(obj.id)}
                      >
                        <span style={styles.objectIcon}>{getObjectIcon(obj.type)}</span>
                        <span style={styles.objectName}>{obj.name}</span>
                        <div style={styles.objectActions}>
                          <button
                            style={styles.iconButton}
                            onClick={e => {
                              e.stopPropagation();
                              handleToggleVisibility(obj.id);
                            }}
                          >
                            {obj.visible ? '👁️' : '🚫'}
                          </button>
                          <button
                            style={styles.iconButton}
                            onClick={e => {
                              e.stopPropagation();
                              handleToggleLock(obj.id);
                            }}
                          >
                            {obj.locked ? '🔒' : '🔓'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Object Button */}
                <button style={{ ...styles.button, ...styles.primaryButton, width: '100%' }}>
                  + Add Object
                </button>
              </>
            )}
          </div>
        </aside>
      </main>

      {/* Status Bar */}
      <footer style={styles.statusBar}>
        <span>CHE·NU XR World Builder v1.0</span>
        <span>SAFE · READ-ONLY · REPRESENTATIONAL</span>
        <span>Ready</span>
      </footer>
    </div>
  );
};

export default XRWorldBuilderPage;
