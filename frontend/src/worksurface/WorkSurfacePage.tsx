/**
 * ============================================================
 * CHE·NU — WORKSURFACE PAGE
 * SAFE · REPRESENTATIONAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Main page component wrapping WorkSurfaceShell with mock data
 */

import React, { useState, useCallback } from 'react';
import { WorkSurfaceShell, WorkSurfaceData, WorkSurfaceMode, WorkSurfaceControlMode } from './WorkSurfaceShell';
import { CHENU_COLORS } from './worksurfaceStyles';

// ============================================================
// MOCK DATA
// ============================================================

const createMockWorkSurface = (workspaceId: string): WorkSurfaceData => ({
  id: 'wsf_demo_' + Date.now().toString(36),
  workspaceId,
  state: {
    activeMode: 'text',
    availableModes: ['text', 'table', 'blocks', 'diagram', 'summary', 'xr_layout', 'final'],
    controlMode: 'assisted',
    lastInputKind: 'none',
    lastUpdate: Date.now(),
  },
  content: {
    textBlocks: [
      'Welcome to CHE·NU WorkSurface!',
      'This is a unified editing surface that adapts to your content.',
    ],
    tablePreview: {
      columns: ['Name', 'Type', 'Status'],
      rows: [
        ['Project Alpha', 'Development', 'Active'],
        ['Project Beta', 'Research', 'Planning'],
        ['Project Gamma', 'Design', 'Complete'],
      ],
    },
    blocks: [
      { id: 'blk_1', type: 'heading', content: 'Getting Started' },
      { id: 'blk_2', type: 'text', content: 'WorkSurface provides multiple views for your content.' },
      { id: 'blk_3', type: 'list', content: 'Text Editor - Free-form content editing' },
      { id: 'blk_4', type: 'list', content: 'Table View - Structured data display' },
      { id: 'blk_5', type: 'list', content: 'Block Editor - Notion-like organization' },
    ],
    diagram: {
      nodes: [
        { id: 'n1', label: 'Input', x: 100, y: 100 },
        { id: 'n2', label: 'Process', x: 250, y: 100 },
        { id: 'n3', label: 'Output', x: 400, y: 100 },
      ],
      links: [
        { source: 'n1', target: 'n2' },
        { source: 'n2', target: 'n3' },
      ],
    },
    summary: 'CHE·NU WorkSurface is a unified editing interface that adapts to your content type. It supports text, tables, blocks, diagrams, and XR layouts. Use assisted mode for intelligent suggestions.',
  },
  xrScene: {
    id: 'xr_demo',
    name: 'Demo Scene',
    sectorsCount: 4,
    objectsCount: 12,
  },
  context: {
    sphere: 'personal',
    domain: 'productivity',
  },
});

// ============================================================
// SIMPLE CONTENT CLASSIFIER
// ============================================================

function classifyContent(text: string): { inputKind: string; suggestedMode?: WorkSurfaceMode } {
  const trimmed = text.trim();
  if (!trimmed) return { inputKind: 'empty' };
  
  const lines = trimmed.split('\n');
  const hasListMarkers = lines.some(l => /^[-*•]\s|^\d+[.)]\s/.test(l.trim()));
  const hasNumbers = /\d+/.test(trimmed);
  const hasTableChars = trimmed.includes('\t') || (trimmed.match(/\|/g) || []).length >= 2;
  
  if (hasTableChars) return { inputKind: 'table', suggestedMode: 'table' };
  if (hasListMarkers) return { inputKind: 'list', suggestedMode: 'blocks' };
  if (hasNumbers && !hasListMarkers) return { inputKind: 'numbers', suggestedMode: 'table' };
  return { inputKind: 'text', suggestedMode: 'text' };
}

// ============================================================
// PAGE COMPONENT
// ============================================================

export interface WorkSurfacePageProps {
  workspaceId?: string;
}

export const WorkSurfacePage: React.FC<WorkSurfacePageProps> = ({
  workspaceId = 'ws_default',
}) => {
  const [worksurface, setWorksurface] = useState<WorkSurfaceData>(() => 
    createMockWorkSurface(workspaceId)
  );
  
  // Handle mode change
  const handleModeChange = useCallback((mode: WorkSurfaceMode) => {
    setWorksurface(prev => ({
      ...prev,
      state: {
        ...prev.state,
        activeMode: mode,
        lastUpdate: Date.now(),
      },
    }));
  }, []);
  
  // Handle control mode change
  const handleControlModeChange = useCallback((controlMode: WorkSurfaceControlMode) => {
    setWorksurface(prev => ({
      ...prev,
      state: {
        ...prev.state,
        controlMode,
        lastUpdate: Date.now(),
      },
    }));
  }, []);
  
  // Handle input
  const handleInput = useCallback((text: string) => {
    setWorksurface(prev => {
      const classification = classifyContent(text);
      const newContent = {
        ...prev.content,
        textBlocks: [...prev.content.textBlocks, text],
      };
      
      // Auto-adapt mode in assisted mode
      let newMode = prev.state.activeMode;
      if (prev.state.controlMode === 'assisted' && classification.suggestedMode) {
        newMode = classification.suggestedMode;
      }
      
      return {
        ...prev,
        state: {
          ...prev.state,
          activeMode: newMode,
          lastInputKind: classification.inputKind,
          lastUpdate: Date.now(),
        },
        content: newContent,
      };
    });
  }, []);
  
  // Handle clear
  const handleClear = useCallback(() => {
    setWorksurface(prev => ({
      ...prev,
      state: {
        ...prev.state,
        activeMode: 'text',
        lastInputKind: 'none',
        lastUpdate: Date.now(),
      },
      content: {
        textBlocks: [],
        tablePreview: undefined,
        blocks: [],
        diagram: undefined,
        summary: '',
      },
    }));
  }, []);
  
  return (
    <div style={{ height: '100vh', backgroundColor: CHENU_COLORS.uiSlate }}>
      <WorkSurfaceShell
        worksurface={worksurface}
        onModeChange={handleModeChange}
        onControlModeChange={handleControlModeChange}
        onInput={handleInput}
        onClear={handleClear}
      />
    </div>
  );
};

export default WorkSurfacePage;
