/**
 * ============================================================
 * CHE·NU — XR SECTOR LINK EDITOR
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Interface for creating symbolic links between sectors.
 * NO real navigation, NO 3D, PURE STRUCTURE.
 */

import React, { useState, useMemo, useCallback } from 'react';

// ============================================================
// TYPES
// ============================================================

interface XRSector {
  id: string;
  name: string;
  sceneId: string;
  sceneName: string;
}

interface XRScene {
  id: string;
  name: string;
  sphere: string;
  sectors: { id: string; name: string }[];
}

interface SectorLinkConfig {
  fromScene: string;
  fromSector: string;
  toScene: string;
  toSector: string;
  label: string;
  bidirectional: boolean;
}

interface XRSectorLinkEditorProps {
  scenes: XRScene[];
  onCreateLink?: (config: SectorLinkConfig) => void;
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
    maxWidth: '600px',
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
    color: CHENU_COLORS.sacredGold,
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
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 60px 1fr',
    gap: '16px',
    marginBottom: '20px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  columnTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
    marginBottom: '4px',
  },
  arrow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    color: CHENU_COLORS.cenoteTurquoise,
    paddingTop: '80px',
  },
  label: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
    cursor: 'pointer',
    outline: 'none',
  },
  sectorList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    maxHeight: '200px',
    overflow: 'auto',
    padding: '4px',
  },
  sectorOption: {
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
  sectorOptionSelected: {
    backgroundColor: `${CHENU_COLORS.sacredGold}20`,
    borderColor: CHENU_COLORS.sacredGold,
  },
  sectorIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  sectorName: {
    flex: 1,
    fontSize: '13px',
  },
  emptyState: {
    padding: '20px',
    textAlign: 'center',
    color: CHENU_COLORS.ancientStone,
    fontSize: '12px',
  },
  preview: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '20px',
  },
  previewTitle: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  previewConnection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    fontSize: '13px',
  },
  previewNode: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '10px 16px',
    borderRadius: '8px',
    minWidth: '120px',
  },
  previewNodeScene: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  previewNodeSector: {
    fontSize: '14px',
    fontWeight: 600,
  },
  previewArrow: {
    fontSize: '20px',
    color: CHENU_COLORS.sacredGold,
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
    marginBottom: '16px',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  checkboxInput: {
    width: '18px',
    height: '18px',
    accentColor: CHENU_COLORS.sacredGold,
  },
  checkboxText: {
    fontSize: '13px',
  },
  footer: {
    display: 'flex',
    gap: '12px',
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
};

// ============================================================
// COMPONENT
// ============================================================

export const XRSectorLinkEditor: React.FC<XRSectorLinkEditorProps> = ({
  scenes,
  onCreateLink,
  onCancel,
}) => {
  const [fromSceneId, setFromSceneId] = useState('');
  const [fromSectorId, setFromSectorId] = useState('');
  const [toSceneId, setToSceneId] = useState('');
  const [toSectorId, setToSectorId] = useState('');
  const [label, setLabel] = useState('');
  const [bidirectional, setBidirectional] = useState(true);

  // Get scenes with sectors only
  const scenesWithSectors = useMemo(() => {
    return scenes.filter(s => s.sectors.length > 0);
  }, [scenes]);

  // Get scene by ID
  const getScene = useCallback((id: string) => scenes.find(s => s.id === id), [scenes]);

  // Get sectors for selected scenes
  const fromScene = fromSceneId ? getScene(fromSceneId) : null;
  const toScene = toSceneId ? getScene(toSceneId) : null;
  const fromSector = fromScene?.sectors.find(s => s.id === fromSectorId);
  const toSector = toScene?.sectors.find(s => s.id === toSectorId);

  // Validation
  const isValid = fromSceneId && fromSectorId && toSceneId && toSectorId &&
    !(fromSceneId === toSceneId && fromSectorId === toSectorId);

  // Handle scene change
  const handleFromSceneChange = useCallback((sceneId: string) => {
    setFromSceneId(sceneId);
    setFromSectorId('');
  }, []);

  const handleToSceneChange = useCallback((sceneId: string) => {
    setToSceneId(sceneId);
    setToSectorId('');
  }, []);

  // Handle create
  const handleCreate = useCallback(() => {
    if (!isValid) return;
    onCreateLink?.({
      fromScene: fromSceneId,
      fromSector: fromSectorId,
      toScene: toSceneId,
      toSector: toSectorId,
      label: label || `${fromSector?.name} → ${toSector?.name}`,
      bidirectional,
    });
  }, [isValid, fromSceneId, fromSectorId, toSceneId, toSectorId, label, bidirectional, fromSector, toSector, onCreateLink]);

  if (scenesWithSectors.length < 1) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            <span>📍</span>
            Sector Link Editor
          </h2>
        </div>
        <div style={styles.emptyState}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
          <div>No scenes with sectors available</div>
          <div style={{ marginTop: '8px' }}>
            Add sectors to scenes to enable sector linking
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          <span>📍</span>
          Create Sector Link
        </h2>
        {onCancel && (
          <button style={styles.closeButton} onClick={onCancel}>
            ✕
          </button>
        )}
      </div>

      {/* Selection Grid */}
      <div style={styles.grid}>
        {/* From Column */}
        <div style={styles.column}>
          <div style={styles.columnTitle}>From</div>
          
          <div>
            <div style={styles.label}>Scene</div>
            <select
              style={styles.select}
              value={fromSceneId}
              onChange={e => handleFromSceneChange(e.target.value)}
            >
              <option value="">Select scene...</option>
              {scenesWithSectors.map(scene => (
                <option key={scene.id} value={scene.id}>
                  {scene.name} ({scene.sectors.length} sectors)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div style={styles.label}>Sector</div>
            {fromScene ? (
              <div style={styles.sectorList}>
                {fromScene.sectors.map(sector => (
                  <div
                    key={sector.id}
                    style={{
                      ...styles.sectorOption,
                      ...(fromSectorId === sector.id ? styles.sectorOptionSelected : {}),
                    }}
                    onClick={() => setFromSectorId(sector.id)}
                  >
                    <div style={styles.sectorIcon}>📍</div>
                    <div style={styles.sectorName}>{sector.name}</div>
                    {fromSectorId === sector.id && (
                      <span style={{ color: CHENU_COLORS.sacredGold }}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>Select a scene first</div>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div style={styles.arrow}>
          {bidirectional ? '⟷' : '→'}
        </div>

        {/* To Column */}
        <div style={styles.column}>
          <div style={styles.columnTitle}>To</div>
          
          <div>
            <div style={styles.label}>Scene</div>
            <select
              style={styles.select}
              value={toSceneId}
              onChange={e => handleToSceneChange(e.target.value)}
            >
              <option value="">Select scene...</option>
              {scenesWithSectors.map(scene => (
                <option key={scene.id} value={scene.id}>
                  {scene.name} ({scene.sectors.length} sectors)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div style={styles.label}>Sector</div>
            {toScene ? (
              <div style={styles.sectorList}>
                {toScene.sectors.map(sector => {
                  const isDisabled = fromSceneId === toSceneId && fromSectorId === sector.id;
                  return (
                    <div
                      key={sector.id}
                      style={{
                        ...styles.sectorOption,
                        ...(toSectorId === sector.id ? styles.sectorOptionSelected : {}),
                        ...(isDisabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}),
                      }}
                      onClick={() => !isDisabled && setToSectorId(sector.id)}
                    >
                      <div style={styles.sectorIcon}>📍</div>
                      <div style={styles.sectorName}>{sector.name}</div>
                      {toSectorId === sector.id && (
                        <span style={{ color: CHENU_COLORS.sacredGold }}>✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={styles.emptyState}>Select a scene first</div>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      {fromSector && toSector && (
        <div style={styles.preview}>
          <div style={styles.previewTitle}>Connection Preview</div>
          <div style={styles.previewConnection}>
            <div
              style={{
                ...styles.previewNode,
                backgroundColor: `${SPHERE_COLORS[fromScene?.sphere ?? ''] ?? CHENU_COLORS.ancientStone}20`,
              }}
            >
              <div style={styles.previewNodeScene}>{fromScene?.name}</div>
              <div style={styles.previewNodeSector}>{fromSector.name}</div>
            </div>
            <div style={styles.previewArrow}>{bidirectional ? '⟷' : '→'}</div>
            <div
              style={{
                ...styles.previewNode,
                backgroundColor: `${SPHERE_COLORS[toScene?.sphere ?? ''] ?? CHENU_COLORS.ancientStone}20`,
              }}
            >
              <div style={styles.previewNodeScene}>{toScene?.name}</div>
              <div style={styles.previewNodeSector}>{toSector.name}</div>
            </div>
          </div>
        </div>
      )}

      {/* Label */}
      <div style={styles.label}>Portal Label</div>
      <input
        type="text"
        style={styles.input}
        placeholder="Enter label (optional)..."
        value={label}
        onChange={e => setLabel(e.target.value)}
      />

      {/* Bidirectional */}
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
        <span style={styles.checkboxText}>
          Bidirectional (allow travel in both directions)
        </span>
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
            ...(!isValid ? styles.disabledButton : {}),
          }}
          onClick={handleCreate}
          disabled={!isValid}
        >
          📍 Create Sector Link
        </button>
      </div>
    </div>
  );
};

export default XRSectorLinkEditor;
