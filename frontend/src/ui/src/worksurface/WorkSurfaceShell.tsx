/**
 * ============================================================
 * CHE·NU — WORKSURFACE SHELL
 * SAFE · REPRESENTATIONAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Main shell component that contains all WorkSurface views
 */

import React, { useState, useCallback } from 'react';
import { worksurfaceStyles, CHENU_COLORS, getModeColor } from './worksurfaceStyles';

// ============================================================
// TYPES
// ============================================================

export type WorkSurfaceMode = 'text' | 'table' | 'blocks' | 'diagram' | 'summary' | 'xr_layout' | 'final';
export type WorkSurfaceControlMode = 'manual' | 'assisted';

export interface WorkSurfaceState {
  activeMode: WorkSurfaceMode;
  availableModes: WorkSurfaceMode[];
  controlMode: WorkSurfaceControlMode;
  lastInputKind: string;
  lastUpdate: number;
}

export interface WorkSurfaceContent {
  textBlocks: string[];
  tablePreview?: { columns: string[]; rows: string[][] };
  blocks?: Array<{ id: string; type: string; content: string }>;
  diagram?: { nodes: Array<{ id: string; label: string; x?: number; y?: number }>; links: Array<{ source: string; target: string }> };
  summary?: string;
}

export interface WorkSurfaceData {
  id: string;
  workspaceId: string;
  state: WorkSurfaceState;
  content: WorkSurfaceContent;
  xrScene?: { id: string; name: string; sectorsCount: number; objectsCount: number } | null;
  context?: { sphere: string; domain?: string } | null;
}

export interface WorkSurfaceShellProps {
  worksurface: WorkSurfaceData;
  onModeChange?: (mode: WorkSurfaceMode) => void;
  onControlModeChange?: (mode: WorkSurfaceControlMode) => void;
  onInput?: (text: string) => void;
  onClear?: () => void;
}

// ============================================================
// MODE CONFIG
// ============================================================

const MODE_CONFIG: Record<WorkSurfaceMode, { icon: string; label: string; shortLabel: string }> = {
  text: { icon: '📝', label: 'Text Editor', shortLabel: 'Text' },
  table: { icon: '📊', label: 'Table View', shortLabel: 'Table' },
  blocks: { icon: '🧱', label: 'Block Editor', shortLabel: 'Blocks' },
  diagram: { icon: '🔗', label: 'Diagram View', shortLabel: 'Diagram' },
  summary: { icon: '📋', label: 'Summary', shortLabel: 'Summary' },
  xr_layout: { icon: '🌀', label: 'XR Layout', shortLabel: 'XR' },
  final: { icon: '📄', label: 'Final Document', shortLabel: 'Final' },
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

// Mode Switcher
const ModeSwitcher: React.FC<{
  activeMode: WorkSurfaceMode;
  availableModes: WorkSurfaceMode[];
  onChange: (mode: WorkSurfaceMode) => void;
}> = ({ activeMode, availableModes, onChange }) => (
  <div style={worksurfaceStyles.modeSwitcher}>
    {availableModes.map(mode => {
      const config = MODE_CONFIG[mode];
      const isActive = mode === activeMode;
      return (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          style={{
            ...worksurfaceStyles.modeTab,
            ...(isActive ? worksurfaceStyles.modeTabActive : {}),
            ...(isActive ? { backgroundColor: getModeColor(mode) } : {}),
          }}
        >
          <span>{config.icon}</span>
          <span>{config.shortLabel}</span>
        </button>
      );
    })}
  </div>
);

// Toolbar
const Toolbar: React.FC<{
  controlMode: WorkSurfaceControlMode;
  context?: { sphere: string; domain?: string } | null;
  onControlModeToggle: () => void;
  onClear: () => void;
}> = ({ controlMode, context, onControlModeToggle, onClear }) => (
  <div style={worksurfaceStyles.toolbar}>
    {/* Context info */}
    {context && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: CHENU_COLORS.textMuted }}>
          {context.sphere}
          {context.domain && ` / ${context.domain}`}
        </span>
      </div>
    )}
    
    <div style={{ flex: 1 }} />
    
    {/* Control mode toggle */}
    <button
      onClick={onControlModeToggle}
      style={{
        ...worksurfaceStyles.modeTab,
        backgroundColor: controlMode === 'assisted' ? CHENU_COLORS.jungleEmerald : 'rgba(255,255,255,0.1)',
        color: controlMode === 'assisted' ? CHENU_COLORS.softSand : CHENU_COLORS.textMuted,
      }}
    >
      <span>{controlMode === 'assisted' ? '🤖' : '🎛️'}</span>
      <span>{controlMode === 'assisted' ? 'Assisted' : 'Manual'}</span>
    </button>
    
    {/* Clear button */}
    <button
      onClick={onClear}
      style={{
        ...worksurfaceStyles.modeTab,
        backgroundColor: 'rgba(244,67,54,0.2)',
        color: CHENU_COLORS.error,
      }}
    >
      🗑️ Clear
    </button>
  </div>
);

// Text View
const TextView: React.FC<{ content: WorkSurfaceContent; onInput: (text: string) => void }> = ({ content, onInput }) => {
  const [inputText, setInputText] = useState('');
  
  const handleSubmit = () => {
    if (inputText.trim()) {
      onInput(inputText);
      setInputText('');
    }
  };
  
  return (
    <div style={worksurfaceStyles.viewContainer}>
      {/* Display existing content */}
      {content.textBlocks.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          {content.textBlocks.map((block, index) => (
            <div key={index} style={{ ...worksurfaceStyles.textView, marginBottom: '12px' }}>
              {block}
            </div>
          ))}
        </div>
      )}
      
      {/* Input area */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste content here..."
          style={{ ...worksurfaceStyles.modeTab, flex: 1, minHeight: '100px', padding: '12px', backgroundColor: 'rgba(0,0,0,0.3)', border: `1px solid ${CHENU_COLORS.borderColor}`, color: CHENU_COLORS.textPrimary, fontFamily: "'JetBrains Mono', monospace", resize: 'vertical' }}
        />
      </div>
      <button
        onClick={handleSubmit}
        style={{ ...worksurfaceStyles.modeTab, marginTop: '12px', backgroundColor: CHENU_COLORS.cenoteTurquoise, color: CHENU_COLORS.uiSlate }}
      >
        ➕ Add Content
      </button>
    </div>
  );
};

// Table View
const TableView: React.FC<{ content: WorkSurfaceContent }> = ({ content }) => {
  const table = content.tablePreview;
  
  if (!table || table.rows.length === 0) {
    return (
      <div style={{ ...worksurfaceStyles.viewContainer, textAlign: 'center', color: CHENU_COLORS.textMuted }}>
        <p>📊 No table data available</p>
        <p style={{ fontSize: '12px' }}>Add structured data (CSV, tab-separated) to see table view</p>
      </div>
    );
  }
  
  return (
    <div style={{ ...worksurfaceStyles.viewContainer, ...worksurfaceStyles.tableContainer }}>
      <table style={worksurfaceStyles.table}>
        <thead>
          <tr>
            {table.columns.map((col, i) => (
              <th key={i} style={worksurfaceStyles.tableHeader}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} style={worksurfaceStyles.tableCell}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Blocks View
const BlocksView: React.FC<{ content: WorkSurfaceContent }> = ({ content }) => {
  const blocks = content.blocks || [];
  
  if (blocks.length === 0) {
    return (
      <div style={{ ...worksurfaceStyles.viewContainer, textAlign: 'center', color: CHENU_COLORS.textMuted }}>
        <p>🧱 No blocks available</p>
        <p style={{ fontSize: '12px' }}>Add structured content (lists, headings) to see blocks</p>
      </div>
    );
  }
  
  const getBlockStyle = (type: string) => {
    const colors: Record<string, string> = {
      heading: CHENU_COLORS.sacredGold,
      list: CHENU_COLORS.cenoteTurquoise,
      quote: CHENU_COLORS.jungleEmerald,
      code: CHENU_COLORS.earthEmber,
      text: CHENU_COLORS.ancientStone,
    };
    return { borderLeftColor: colors[type] || CHENU_COLORS.ancientStone };
  };
  
  return (
    <div style={worksurfaceStyles.viewContainer}>
      <div style={worksurfaceStyles.blocksList}>
        {blocks.map((block) => (
          <div key={block.id} style={{ ...worksurfaceStyles.block, ...getBlockStyle(block.type) }}>
            <div style={{ fontSize: '10px', color: CHENU_COLORS.textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>
              {block.type}
            </div>
            <div>{block.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Diagram View
const DiagramView: React.FC<{ content: WorkSurfaceContent }> = ({ content }) => {
  const diagram = content.diagram;
  
  if (!diagram || diagram.nodes.length === 0) {
    return (
      <div style={{ ...worksurfaceStyles.viewContainer, textAlign: 'center', color: CHENU_COLORS.textMuted }}>
        <p>🔗 No diagram data available</p>
        <p style={{ fontSize: '12px' }}>Add structured content to generate diagram</p>
      </div>
    );
  }
  
  return (
    <div style={worksurfaceStyles.viewContainer}>
      <div style={worksurfaceStyles.diagramCanvas}>
        {/* SVG for links */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {diagram.links.map((link, i) => {
            const sourceNode = diagram.nodes.find(n => n.id === link.source);
            const targetNode = diagram.nodes.find(n => n.id === link.target);
            if (!sourceNode || !targetNode) return null;
            return (
              <line
                key={i}
                x1={sourceNode.x || 0}
                y1={sourceNode.y || 0}
                x2={targetNode.x || 0}
                y2={targetNode.y || 0}
                stroke={CHENU_COLORS.cenoteTurquoise}
                strokeWidth="2"
                opacity={0.6}
              />
            );
          })}
        </svg>
        
        {/* Nodes */}
        {diagram.nodes.map((node) => (
          <div
            key={node.id}
            style={{
              ...worksurfaceStyles.diagramNode,
              left: node.x || 100,
              top: node.y || 100,
            }}
          >
            {node.label}
          </div>
        ))}
      </div>
    </div>
  );
};

// Summary View
const SummaryView: React.FC<{ content: WorkSurfaceContent }> = ({ content }) => {
  const summary = content.summary;
  
  if (!summary) {
    return (
      <div style={{ ...worksurfaceStyles.viewContainer, textAlign: 'center', color: CHENU_COLORS.textMuted }}>
        <p>📋 No summary available</p>
        <p style={{ fontSize: '12px' }}>Add more content to generate a summary</p>
      </div>
    );
  }
  
  return (
    <div style={worksurfaceStyles.viewContainer}>
      <div style={worksurfaceStyles.summaryView}>
        <h3 style={{ margin: '0 0 16px', color: CHENU_COLORS.sacredGold }}>📋 Summary</h3>
        <p style={{ lineHeight: 1.8, margin: 0 }}>{summary}</p>
      </div>
    </div>
  );
};

// XR Layout View
const XRLayoutView: React.FC<{ xrScene?: WorkSurfaceData['xrScene'] }> = ({ xrScene }) => {
  if (!xrScene) {
    return (
      <div style={{ ...worksurfaceStyles.viewContainer, textAlign: 'center', color: CHENU_COLORS.textMuted }}>
        <p>🌀 No XR scene attached</p>
        <p style={{ fontSize: '12px' }}>Connect an XR scene to preview layout</p>
      </div>
    );
  }
  
  return (
    <div style={worksurfaceStyles.viewContainer}>
      <div style={worksurfaceStyles.xrPreview}>
        <h3 style={{ margin: '0 0 16px', color: CHENU_COLORS.cenoteTurquoise }}>🌀 XR Scene: {xrScene.name}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: CHENU_COLORS.cenoteTurquoise }}>{xrScene.sectorsCount}</div>
            <div style={{ fontSize: '11px', color: CHENU_COLORS.textMuted }}>Sectors</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: CHENU_COLORS.sacredGold }}>{xrScene.objectsCount}</div>
            <div style={{ fontSize: '11px', color: CHENU_COLORS.textMuted }}>Objects</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px' }}>✅</div>
            <div style={{ fontSize: '11px', color: CHENU_COLORS.textMuted }}>Ready</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Final View
const FinalView: React.FC<{ content: WorkSurfaceContent }> = ({ content }) => {
  if (content.textBlocks.length === 0) {
    return (
      <div style={{ ...worksurfaceStyles.viewContainer, textAlign: 'center', color: CHENU_COLORS.textMuted }}>
        <p>📄 No content to finalize</p>
        <p style={{ fontSize: '12px' }}>Add content to see final document view</p>
      </div>
    );
  }
  
  return (
    <div style={worksurfaceStyles.viewContainer}>
      <div style={worksurfaceStyles.finalView}>
        <h1 style={{ fontSize: '24px', marginBottom: '24px', borderBottom: '1px solid #ccc', paddingBottom: '12px' }}>
          Document
        </h1>
        {content.textBlocks.map((block, i) => (
          <p key={i} style={{ marginBottom: '16px', lineHeight: 1.8 }}>{block}</p>
        ))}
        <div style={{ marginTop: '40px', fontSize: '10px', color: '#666', borderTop: '1px solid #ccc', paddingTop: '12px' }}>
          CHE·NU WorkSurface — Representational Document View
        </div>
      </div>
    </div>
  );
};

// Status Bar
const StatusBar: React.FC<{ state: WorkSurfaceState }> = ({ state }) => (
  <div style={worksurfaceStyles.statusBar}>
    <div style={worksurfaceStyles.statusIndicator}>
      <div style={worksurfaceStyles.statusDot} />
      <span>Ready</span>
    </div>
    <span>|</span>
    <span>Mode: {MODE_CONFIG[state.activeMode].label}</span>
    <span>|</span>
    <span>Control: {state.controlMode}</span>
    <span>|</span>
    <span>Last input: {state.lastInputKind}</span>
    <div style={{ flex: 1 }} />
    <span style={{ color: CHENU_COLORS.jungleEmerald }}>SAFE · REPRESENTATIONAL</span>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

export const WorkSurfaceShell: React.FC<WorkSurfaceShellProps> = ({
  worksurface,
  onModeChange,
  onControlModeChange,
  onInput,
  onClear,
}) => {
  const { state, content, xrScene, context } = worksurface;
  
  const handleModeChange = useCallback((mode: WorkSurfaceMode) => {
    onModeChange?.(mode);
  }, [onModeChange]);
  
  const handleControlModeToggle = useCallback(() => {
    const newMode: WorkSurfaceControlMode = state.controlMode === 'assisted' ? 'manual' : 'assisted';
    onControlModeChange?.(newMode);
  }, [state.controlMode, onControlModeChange]);
  
  const handleInput = useCallback((text: string) => {
    onInput?.(text);
  }, [onInput]);
  
  const handleClear = useCallback(() => {
    onClear?.();
  }, [onClear]);
  
  // Render active view
  const renderView = () => {
    switch (state.activeMode) {
      case 'text':
        return <TextView content={content} onInput={handleInput} />;
      case 'table':
        return <TableView content={content} />;
      case 'blocks':
        return <BlocksView content={content} />;
      case 'diagram':
        return <DiagramView content={content} />;
      case 'summary':
        return <SummaryView content={content} />;
      case 'xr_layout':
        return <XRLayoutView xrScene={xrScene} />;
      case 'final':
        return <FinalView content={content} />;
      default:
        return <TextView content={content} onInput={handleInput} />;
    }
  };
  
  return (
    <div style={worksurfaceStyles.shell}>
      {/* Header with mode switcher */}
      <div style={worksurfaceStyles.header}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>📐</span>
            <span style={{ fontSize: '16px', fontWeight: 600 }}>WorkSurface</span>
            <span style={{ fontSize: '12px', color: CHENU_COLORS.textMuted }}>ID: {worksurface.id}</span>
          </div>
          <ModeSwitcher
            activeMode={state.activeMode}
            availableModes={state.availableModes}
            onChange={handleModeChange}
          />
        </div>
      </div>
      
      {/* Toolbar */}
      <Toolbar
        controlMode={state.controlMode}
        context={context}
        onControlModeToggle={handleControlModeToggle}
        onClear={handleClear}
      />
      
      {/* Main content */}
      <div style={worksurfaceStyles.mainContent}>
        {renderView()}
      </div>
      
      {/* Status bar */}
      <StatusBar state={state} />
    </div>
  );
};

export default WorkSurfaceShell;
