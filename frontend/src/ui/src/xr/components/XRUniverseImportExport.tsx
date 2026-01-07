/**
 * ============================================================
 * CHE·NU — XR UNIVERSE IMPORT/EXPORT
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Import and export universe structures as JSON.
 * READ-ONLY from system perspective.
 */

import React, { useState, useCallback, useRef } from 'react';

// ============================================================
// TYPES
// ============================================================

interface XRUniverseData {
  id: string;
  name: string;
  description?: string;
  scenes: unknown[];
  portals?: unknown[];
  meta?: Record<string, any>;
}

interface XRUniverseImportExportProps {
  currentUniverse?: XRUniverseData;
  onImport?: (universe: XRUniverseData) => void;
  onExportComplete?: () => void;
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
  tabs: {
    display: 'flex',
    marginBottom: '20px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '10px',
    padding: '4px',
  },
  tab: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  tabActive: {
    backgroundColor: CHENU_COLORS.sacredGold,
    color: CHENU_COLORS.uiSlate,
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
  textarea: {
    width: '100%',
    height: '300px',
    padding: '14px',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: CHENU_COLORS.softSand,
    fontSize: '12px',
    fontFamily: "'JetBrains Mono', monospace",
    resize: 'vertical',
    outline: 'none',
  },
  preview: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
    padding: '14px',
    marginBottom: '16px',
    fontSize: '12px',
  },
  previewHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  previewTitle: {
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
  },
  previewStats: {
    display: 'flex',
    gap: '16px',
    color: CHENU_COLORS.ancientStone,
  },
  previewValid: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: CHENU_COLORS.jungleEmerald,
  },
  previewInvalid: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#E74C3C',
  },
  infoBox: {
    padding: '12px 14px',
    backgroundColor: 'rgba(62, 180, 162, 0.1)',
    borderRadius: '8px',
    fontSize: '12px',
    color: CHENU_COLORS.cenoteTurquoise,
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  errorBox: {
    padding: '12px 14px',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#E74C3C',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
  },
  actions: {
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
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
  successMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: 'rgba(39, 174, 96, 0.2)',
    borderRadius: '8px',
    color: '#27AE60',
    fontSize: '13px',
    marginBottom: '16px',
  },
  dropZone: {
    border: `2px dashed ${CHENU_COLORS.shadowMoss}`,
    borderRadius: '10px',
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '16px',
  },
  dropZoneActive: {
    borderColor: CHENU_COLORS.cenoteTurquoise,
    backgroundColor: 'rgba(62, 180, 162, 0.1)',
  },
  dropZoneIcon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  dropZoneText: {
    fontSize: '14px',
    color: CHENU_COLORS.softSand,
    marginBottom: '6px',
  },
  dropZoneHint: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  footer: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: `1px solid ${CHENU_COLORS.shadowMoss}`,
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const XRUniverseImportExport: React.FC<XRUniverseImportExportProps> = ({
  currentUniverse,
  onImport,
  onExportComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('export');
  const [importText, setImportText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedImport, setParsedImport] = useState<XRUniverseData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate export JSON
  const exportJson = currentUniverse
    ? JSON.stringify(currentUniverse, null, 2)
    : '';

  // Validate and parse import JSON
  const handleImportTextChange = useCallback((text: string) => {
    setImportText(text);
    setError(null);
    setParsedImport(null);

    if (!text.trim()) return;

    try {
      const parsed = JSON.parse(text);
      
      // Basic validation
      if (!parsed.id || typeof parsed.id !== 'string') {
        throw new Error('Missing or invalid "id" field');
      }
      if (!parsed.name || typeof parsed.name !== 'string') {
        throw new Error('Missing or invalid "name" field');
      }
      if (!Array.isArray(parsed.scenes)) {
        throw new Error('Missing or invalid "scenes" array');
      }

      // Sanitize and mark as safe
      const sanitized: XRUniverseData = {
        id: parsed.id,
        name: parsed.name,
        description: parsed.description,
        scenes: parsed.scenes,
        portals: parsed.portals ?? parsed.meta?.portals ?? [],
        meta: {
          ...(parsed.meta ?? {}),
          safe: true,
          importedAt: new Date().toISOString(),
        },
      };

      setParsedImport(sanitized);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON format');
    }
  }, []);

  // Handle import
  const handleImport = useCallback(() => {
    if (!parsedImport) return;
    
    onImport?.(parsedImport);
    setSuccess('Universe imported successfully!');
    setTimeout(() => setSuccess(null), 3000);
  }, [parsedImport, onImport]);

  // Handle copy to clipboard
  const handleCopyExport = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(exportJson);
      setSuccess('Copied to clipboard!');
      setTimeout(() => setSuccess(null), 2000);
      onExportComplete?.();
    } catch {
      setError('Failed to copy to clipboard');
    }
  }, [exportJson, onExportComplete]);

  // Handle download
  const handleDownload = useCallback(() => {
    if (!currentUniverse) return;

    const blob = new Blob([exportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentUniverse.name.toLowerCase().replace(/\s+/g, '-')}-universe.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    setSuccess('Downloaded!');
    setTimeout(() => setSuccess(null), 2000);
    onExportComplete?.();
  }, [currentUniverse, exportJson, onExportComplete]);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        handleImportTextChange(text);
      };
      reader.readAsText(file);
    } else {
      setError('Please drop a JSON file');
    }
  }, [handleImportTextChange]);

  // Handle file select
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        handleImportTextChange(text);
      };
      reader.readAsText(file);
    }
  }, [handleImportTextChange]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          <span>📤</span>
          Import / Export
        </h2>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'export' ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab('export')}
        >
          <span>📤</span> Export
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'import' ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab('import')}
        >
          <span>📥</span> Import
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div style={styles.successMessage}>
          <span>✅</span>
          {success}
        </div>
      )}

      {/* Export Tab */}
      {activeTab === 'export' && (
        <>
          {currentUniverse ? (
            <>
              <div style={styles.preview}>
                <div style={styles.previewHeader}>
                  <span style={styles.previewTitle}>{currentUniverse.name}</span>
                  <div style={styles.previewStats}>
                    <span>🎬 {currentUniverse.scenes.length} scenes</span>
                    <span>🔗 {currentUniverse.portals?.length ?? 0} portals</span>
                  </div>
                </div>
              </div>

              <div style={styles.section}>
                <label style={styles.label}>Universe JSON</label>
                <textarea
                  style={styles.textarea}
                  value={exportJson}
                  readOnly
                />
              </div>

              <div style={styles.actions}>
                <button
                  style={{ ...styles.button, ...styles.secondaryButton }}
                  onClick={handleCopyExport}
                >
                  📋 Copy to Clipboard
                </button>
                <button
                  style={{ ...styles.button, ...styles.primaryButton }}
                  onClick={handleDownload}
                >
                  💾 Download JSON
                </button>
              </div>
            </>
          ) : (
            <div style={styles.infoBox}>
              <span>ℹ️</span>
              <span>No universe loaded. Create or select a universe to export.</span>
            </div>
          )}
        </>
      )}

      {/* Import Tab */}
      {activeTab === 'import' && (
        <>
          <div style={styles.infoBox}>
            <span>ℹ️</span>
            <span>
              Import a universe structure from JSON. The data will be validated
              and sanitized before import. This is a READ-ONLY operation from
              the system perspective.
            </span>
          </div>

          {/* Drop Zone */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".json,application/json"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <div
            style={{
              ...styles.dropZone,
              ...(isDragging ? styles.dropZoneActive : {}),
            }}
            onDragOver={e => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div style={styles.dropZoneIcon}>📁</div>
            <div style={styles.dropZoneText}>
              Drop JSON file here or click to browse
            </div>
            <div style={styles.dropZoneHint}>
              Supports .json files
            </div>
          </div>

          {/* Or paste JSON */}
          <div style={styles.section}>
            <label style={styles.label}>Or paste JSON directly</label>
            <textarea
              style={styles.textarea}
              value={importText}
              onChange={e => handleImportTextChange(e.target.value)}
              placeholder='{\n  "id": "universe-1",\n  "name": "My Universe",\n  "scenes": [...]\n}'
            />
          </div>

          {/* Error */}
          {error && (
            <div style={styles.errorBox}>
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}

          {/* Parsed Preview */}
          {parsedImport && (
            <div style={styles.preview}>
              <div style={styles.previewHeader}>
                <div style={styles.previewValid}>
                  <span>✅</span>
                  Valid JSON
                </div>
              </div>
              <div style={{ marginTop: '8px' }}>
                <strong>{parsedImport.name}</strong>
                <div style={{ color: CHENU_COLORS.ancientStone, marginTop: '4px' }}>
                  {parsedImport.scenes.length} scenes •{' '}
                  {parsedImport.portals?.length ?? 0} portals
                </div>
              </div>
            </div>
          )}

          <div style={styles.actions}>
            <button
              style={{
                ...styles.button,
                ...styles.primaryButton,
                ...(!parsedImport ? styles.disabledButton : {}),
              }}
              onClick={handleImport}
              disabled={!parsedImport}
            >
              📥 Import Universe
            </button>
          </div>
        </>
      )}

      {/* Footer */}
      <div style={styles.footer}>
        <span>SAFE · READ-ONLY</span>
        <span>JSON Format v1.0</span>
      </div>
    </div>
  );
};

export default XRUniverseImportExport;
