/**
 * ============================================================
 * CHE·NU — XR SCENE LINK EDITOR
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Interface for creating symbolic links between XR scenes.
 * NO real navigation, NO 3D, PURE STRUCTURE.
 */

import React, { useState, useMemo, useCallback } from 'react';

// ============================================================
// TYPES
// ============================================================

interface XRScene {
  id: string;
  name: string;
  sphere: string;
}

interface LinkConfig {
  fromScene: string;
  toScene: string;
  label: string;
  style: PortalStyle;
  bidirectional: boolean;
}

type PortalStyle = 'door' | 'arch' | 'ring' | 'vortex' | 'minimal' | 'bridge' | 'elevator' | 'teleport';

interface XRSceneLinkEditorProps {
  scenes: XRScene[];
  existingLinks?: Array<{ fromScene: string; toScene: string }>;
  onCreateLink?: (config: LinkConfig) => void;
  onCancel?: () => void;
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

const SPHERE_COLORS: Record<string, string> = {
  personal: CHENU_COLORS.sacredGold,
  business: CHENU_COLORS.jungleEmerald,
  creative: '#9B59B6',
  social: CHENU_COLORS.cenoteTurquoise,
  scholar: '#3498DB',
  ailab: '#00D9FF',
  entertainment: '#E74C3C',
  systems: CHENU_COLORS.ancientStone,
};

const SPHERE_ICONS: Record<string, string> = {
  personal: '🏠',
  business: '💼',
  creative: '🎨',
  social: '👥',
  scholar: '📚',
  ailab: '🤖',
  entertainment: '🎮',
  systems: '⚙️',
};

const PORTAL_STYLES: Array<{ id: PortalStyle; name: string; icon: string; description: string }> = [
  { id: 'ring', name: 'Ring Portal', icon: '⭕', description: 'Classic circular portal' },
  { id: 'door', name: 'Door', icon: '🚪', description: 'Standard door transition' },
  { id: 'arch', name: 'Archway', icon: '🌉', description: 'Grand archway portal' },
  { id: 'vortex', name: 'Vortex', icon: '🌀', description: 'Swirling vortex effect' },
  { id: 'bridge', name: 'Bridge', icon: '🌁', description: 'Bridge-like connection' },
  { id: 'elevator', name: 'Elevator', icon: '🛗', description: 'Vertical transition' },
  { id: 'teleport', name: 'Teleport', icon: '✨', description: 'Instant transition' },
  { id: 'minimal', name: 'Minimal', icon: '◯', description: 'Simple marker' },
];

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: CHENU_COLORS.uiSlate,
    borderRadius: '16px',
    padding: '20px',
    color: CHENU_COLORS.softSand,
    fontFamily: "'Inter', -apple-system, sans-serif",
    maxWidth: '500px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  closeButton: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.softSand,
    cursor: 'pointer',
    fontSize: '16px',
  },
  section: {
    marginBottom: '20px',
  },
  label: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '8px',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  sceneSelector: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxHeight: '180px',
    overflow: 'auto',
    padding: '4px',
  },
  sceneOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: `1px solid transparent`,
  },
  sceneOptionSelected: {
    backgroundColor: `${CHENU_COLORS.cenoteTurquoise}20`,
    borderColor: CHENU_COLORS.cenoteTurquoise,
  },
  sceneOptionDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  sceneIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  sceneName: {
    flex: 1,
    fontSize: '13px',
    fontWeight: 500,
  },
  sceneSphere: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  connectionPreview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    padding: '20px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    marginBottom: '20px',
  },
  previewNode: {
    textAlign: 'center',
    padding: '12px 16px',
    borderRadius: '10px',
    minWidth: '100px',
  },
  previewNodeIcon: {
    fontSize: '24px',
    marginBottom: '4px',
  },
  previewNodeName: {
    fontSize: '12px',
    fontWeight: 500,
  },
  previewArrow: {
    fontSize: '24px',
    color: CHENU_COLORS.cenoteTurquoise,
  },
  previewEmpty: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: `2px dashed ${CHENU_COLORS.shadowMoss}`,
    color: CHENU_COLORS.ancientStone,
    fontSize: '12px',
    minWidth: '100px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    outline: 'none',
  },
  styleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
  },
  styleOption: {
    padding: '12px 8px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: `1px solid transparent`,
    textAlign: 'center',
  },
  styleOptionSelected: {
    backgroundColor: `${CHENU_COLORS.sacredGold}20`,
    borderColor: CHENU_COLORS.sacredGold,
  },
  styleIcon: {
    fontSize: '20px',
    marginBottom: '4px',
  },
  styleName: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  checkboxInput: {
    width: '18px',
    height: '18px',
    accentColor: CHENU_COLORS.cenoteTurquoise,
  },
  checkboxLabel: {
    fontSize: '13px',
  },
  checkboxHint: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  footer: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  button: {
    flex: 1,
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
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
  disabledButton: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  warning: {
    padding: '10px 12px',
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#E74C3C',
    marginBottom: '16px',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRSceneLinkEditor: React.FC<XRSceneLinkEditorProps> = ({
  scenes,
  existingLinks = [],
  onCreateLink,
  onCancel,
}) => {
  const [fromScene, setFromScene] = useState<string>('');
  const [toScene, setToScene] = useState<string>('');
  const [label, setLabel] = useState('');
  const [style, setStyle] = useState<PortalStyle>('ring');
  const [bidirectional, setBidirectional] = useState(true);

  // Check if link already exists
  const linkExists = useMemo(() => {
    if (!fromScene || !toScene) return false;
    return existingLinks.some(
      l =>
        (l.fromScene === fromScene && l.toScene === toScene) ||
        (l.fromScene === toScene && l.toScene === fromScene)
    );
  }, [fromScene, toScene, existingLinks]);

  // Get scene data
  const getScene = useCallback((id: string) => scenes.find(s => s.id === id), [scenes]);
  const fromSceneData = fromScene ? getScene(fromScene) : null;
  const toSceneData = toScene ? getScene(toScene) : null;

  // Validation
  const isValid = fromScene && toScene && fromScene !== toScene && !linkExists;

  // Handle create
  const handleCreate = useCallback(() => {
    if (!isValid) return;
    onCreateLink?.({
      fromScene,
      toScene,
      label: label || 'Portal',
      style,
      bidirectional,
    });
  }, [isValid, fromScene, toScene, label, style, bidirectional, onCreateLink]);

  // Render scene option
  const renderSceneOption = (scene: XRScene, isFrom: boolean) => {
    const isSelected = isFrom ? fromScene === scene.id : toScene === scene.id;
    const isDisabled = isFrom ? toScene === scene.id : fromScene === scene.id;
    const color = SPHERE_COLORS[scene.sphere] ?? CHENU_COLORS.ancientStone;
    const icon = SPHERE_ICONS[scene.sphere] ?? '📍';

    return (
      <div
        key={scene.id}
        style={{
          ...styles.sceneOption,
          ...(isSelected ? styles.sceneOptionSelected : {}),
          ...(isDisabled ? styles.sceneOptionDisabled : {}),
        }}
        onClick={() => {
          if (isDisabled) return;
          if (isFrom) setFromScene(scene.id);
          else setToScene(scene.id);
        }}
      >
        <div
          style={{
            ...styles.sceneIcon,
            backgroundColor: `${color}30`,
            border: `2px solid ${color}`,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={styles.sceneName}>{scene.name}</div>
          <div style={styles.sceneSphere}>{scene.sphere}</div>
        </div>
        {isSelected && <span style={{ color: CHENU_COLORS.cenoteTurquoise }}>✓</span>}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          <span>🔗</span>
          Create Scene Link
        </h2>
        {onCancel && (
          <button style={styles.closeButton} onClick={onCancel}>
            ✕
          </button>
        )}
      </div>

      {/* Connection Preview */}
      <div style={styles.connectionPreview}>
        {fromSceneData ? (
          <div
            style={{
              ...styles.previewNode,
              backgroundColor: `${SPHERE_COLORS[fromSceneData.sphere] ?? CHENU_COLORS.ancientStone}20`,
            }}
          >
            <div style={styles.previewNodeIcon}>
              {SPHERE_ICONS[fromSceneData.sphere] ?? '📍'}
            </div>
            <div style={styles.previewNodeName}>{fromSceneData.name}</div>
          </div>
        ) : (
          <div style={styles.previewEmpty}>Select From</div>
        )}

        <div style={styles.previewArrow}>{bidirectional ? '⟷' : '→'}</div>

        {toSceneData ? (
          <div
            style={{
              ...styles.previewNode,
              backgroundColor: `${SPHERE_COLORS[toSceneData.sphere] ?? CHENU_COLORS.ancientStone}20`,
            }}
          >
            <div style={styles.previewNodeIcon}>
              {SPHERE_ICONS[toSceneData.sphere] ?? '📍'}
            </div>
            <div style={styles.previewNodeName}>{toSceneData.name}</div>
          </div>
        ) : (
          <div style={styles.previewEmpty}>Select To</div>
        )}
      </div>

      {/* Warning if link exists */}
      {linkExists && (
        <div style={styles.warning}>
          ⚠️ A link between these scenes already exists
        </div>
      )}

      {/* From Scene */}
      <div style={styles.section}>
        <label style={styles.label}>From Scene</label>
        <div style={styles.sceneSelector}>
          {scenes.map(scene => renderSceneOption(scene, true))}
        </div>
      </div>

      {/* To Scene */}
      <div style={styles.section}>
        <label style={styles.label}>To Scene</label>
        <div style={styles.sceneSelector}>
          {scenes.map(scene => renderSceneOption(scene, false))}
        </div>
      </div>

      {/* Portal Label */}
      <div style={styles.section}>
        <label style={styles.label}>Portal Label</label>
        <input
          type="text"
          style={styles.input}
          placeholder="Enter portal name..."
          value={label}
          onChange={e => setLabel(e.target.value)}
        />
      </div>

      {/* Portal Style */}
      <div style={styles.section}>
        <label style={styles.label}>Portal Style</label>
        <div style={styles.styleGrid}>
          {PORTAL_STYLES.map(s => (
            <div
              key={s.id}
              style={{
                ...styles.styleOption,
                ...(style === s.id ? styles.styleOptionSelected : {}),
              }}
              onClick={() => setStyle(s.id)}
              title={s.description}
            >
              <div style={styles.styleIcon}>{s.icon}</div>
              <div style={styles.styleName}>{s.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bidirectional Toggle */}
      <div style={styles.section}>
        <div
          style={styles.checkbox}
          onClick={() => setBidirectional(!bidirectional)}
        >
          <input
            type="checkbox"
            style={styles.checkboxInput}
            checked={bidirectional}
            onChange={e => setBidirectional(e.target.checked)}
          />
          <div>
            <div style={styles.checkboxLabel}>Bidirectional</div>
            <div style={styles.checkboxHint}>
              Allow travel in both directions
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
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
            ...(!isValid ? styles.disabledButton : {}),
          }}
          onClick={handleCreate}
          disabled={!isValid}
        >
          🔗 Create Link
        </button>
      </div>
    </div>
  );
};

export default XRSceneLinkEditor;
