/**
 * CHE·NU V51 — REFLECTION ROOM PAGE
 * ==================================
 * 
 * The heart of CHE·NU. A cognitive workspace where:
 * - User starts without defining context
 * - Thinking is free-form
 * - Structure emerges progressively
 * - Intelligence is staged, not executed
 * 
 * COMPONENT TREE:
 * ReflectionRoomPage
 * ├── SystemHeader          (Nova visibility only)
 * ├── LayoutGrid
 * │   ├── SphereRing        (LEFT)
 * │   ├── FreeCanvas        (CENTER)
 * │   └── ProposalDrawer    (RIGHT)
 * ├── SystemFooter          (trace strip)
 * └── ModeController        (CSS-only)
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ModuleState,
  createStateTransitionEvent
} from '../../contracts/ModuleActivationContract';
import {
  REFLECTION_ROOM_CONTRACT,
  ReflectionRoomState,
  ReflectionProposal,
  CanvasBlock,
  CanvasLink,
  CognitiveLoadSignals,
  createReflectionRoomState,
  createReflectionProposal,
  createReflectionRoomEvent
} from '../../contracts/ReflectionRoom.contract';
import {
  getGlobalEventStore,
  emitModuleEntered,
  emitModuleExited
} from '../../stores/SystemEventStore';
import {
  getGlobalProposalStore,
  Proposal
} from '../../stores/ProposalStore';
import {
  getGlobalProfileStore
} from '../../stores/UserProfileState';
import {
  getGlobalCognitiveLoadStore,
  LoadState
} from '../../stores/CognitiveLoadSignals';

// Sub-components (will be created separately)
import SystemHeader from './SystemHeader';
import SphereRing from './SphereRing';
import FreeCanvas from './FreeCanvas';
import ProposalDrawer from './ProposalDrawer';
import SystemFooter from './SystemFooter';

// ============================================
// PROPS
// ============================================

export interface ReflectionRoomPageProps {
  sessionId?: string;
  initialUIMode?: 'light' | 'dark_strict' | 'incident';
  onNavigateToModule?: (moduleId: string) => void;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export const ReflectionRoomPage: React.FC<ReflectionRoomPageProps> = ({
  sessionId,
  initialUIMode = 'dark_strict',
  onNavigateToModule,
  className = ''
}) => {
  // Generate session ID if not provided
  const effectiveSessionId = useMemo(() => 
    sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    [sessionId]
  );

  // Module state
  const [state, setState] = useState<ReflectionRoomState>(() => 
    createReflectionRoomState(effectiveSessionId)
  );

  // UI Mode
  const [uiMode, setUIMode] = useState<'light' | 'dark_strict' | 'incident'>(initialUIMode);

  // Canvas state
  const [canvasBlocks, setCanvasBlocks] = useState<CanvasBlock[]>([]);
  const [canvasLinks, setCanvasLinks] = useState<CanvasLink[]>([]);

  // Proposals
  const [pendingProposals, setPendingProposals] = useState<Proposal[]>([]);

  // Cognitive load
  const [cognitiveLoad, setCognitiveLoad] = useState<CognitiveLoadSignals>({
    active_blocks: 0,
    estimated_tokens: 0,
    open_spheres: 0,
    pending_proposals: 0,
    load_state: 'closed',
    warnings: [],
    updated_at: new Date().toISOString()
  });

  // Sphere focus
  const [focusedSphere, setFocusedSphere] = useState<string | undefined>();

  // ----------------------------------------
  // LIFECYCLE: Module Enter/Exit
  // ----------------------------------------

  useEffect(() => {
    // Emit module entered event
    emitModuleEntered('reflection_room');

    // Update profile
    getGlobalProfileStore().recordModuleOpened('reflection_room');

    // Update module state
    setState(prev => ({
      ...prev,
      module_state: ModuleState.ACTIVE
    }));

    // Subscribe to proposal store
    const unsubProposals = getGlobalProposalStore().subscribe(event => {
      if (event.proposal.source_module === 'reflection_room') {
        setPendingProposals(
          getGlobalProposalStore().getByModule('reflection_room').filter(p => p.status === 'pending')
        );
      }
    });

    // Subscribe to cognitive load
    const unsubCogLoad = getGlobalCognitiveLoadStore().subscribe(signals => {
      setCognitiveLoad(signals);
    });

    // Cleanup on unmount
    return () => {
      emitModuleExited('reflection_room');
      setState(prev => ({
        ...prev,
        module_state: ModuleState.CLOSED
      }));
      unsubProposals();
      unsubCogLoad();
    };
  }, []);

  // ----------------------------------------
  // UPDATE COGNITIVE LOAD
  // ----------------------------------------

  useEffect(() => {
    const store = getGlobalCognitiveLoadStore();
    store.update({
      active_blocks: canvasBlocks.length,
      estimated_tokens: canvasBlocks.reduce((sum, b) => sum + b.content.length, 0),
      open_spheres: focusedSphere ? 1 : 0,
      pending_proposals: pendingProposals.length
    });
  }, [canvasBlocks, focusedSphere, pendingProposals]);

  // ----------------------------------------
  // CANVAS HANDLERS
  // ----------------------------------------

  const handleAddBlock = useCallback((content: string, position: { x: number; y: number }) => {
    const block: CanvasBlock = {
      block_id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      block_type: 'text',
      content,
      position,
      created_at: new Date().toISOString()
    };

    setCanvasBlocks(prev => [...prev, block]);

    getGlobalEventStore().emit(
      'canvas_block_created',
      'user',
      'reflection_room',
      'info',
      { block_id: block.block_id }
    );
  }, []);

  const handleDeleteBlock = useCallback((blockId: string) => {
    setCanvasBlocks(prev => prev.filter(b => b.block_id !== blockId));
    setCanvasLinks(prev => prev.filter(l => 
      l.from_block_id !== blockId && l.to_block_id !== blockId
    ));

    getGlobalEventStore().emit(
      'canvas_block_deleted',
      'user',
      'reflection_room',
      'info',
      { block_id: blockId }
    );
  }, []);

  const handleUpdateBlock = useCallback((blockId: string, content: string) => {
    setCanvasBlocks(prev => prev.map(b => 
      b.block_id === blockId ? { ...b, content } : b
    ));
  }, []);

  const handleAddLink = useCallback((fromId: string, toId: string) => {
    const link: CanvasLink = {
      link_id: `link_${Date.now()}`,
      from_block_id: fromId,
      to_block_id: toId,
      link_type: 'association'
    };

    setCanvasLinks(prev => [...prev, link]);

    getGlobalEventStore().emit(
      'canvas_link_created',
      'user',
      'reflection_room',
      'info',
      { link_id: link.link_id }
    );
  }, []);

  // ----------------------------------------
  // SPHERE HANDLERS
  // ----------------------------------------

  const handleFocusSphere = useCallback((sphereId: string | undefined) => {
    setFocusedSphere(sphereId);

    if (sphereId) {
      getGlobalEventStore().emit(
        'sphere_focused',
        'user',
        'reflection_room',
        'info',
        { sphere_id: sphereId }
      );
    } else {
      getGlobalEventStore().emit(
        'sphere_unfocused',
        'user',
        'reflection_room',
        'info'
      );
    }
  }, []);

  // ----------------------------------------
  // PROPOSAL HANDLERS
  // ----------------------------------------

  const handleCreateProposal = useCallback((content: string, spheres: string[] = []) => {
    const store = getGlobalProposalStore();
    
    store.create(
      'memory_unit',
      'reflection_room',
      {
        memory_system: 'workspace',
        category: 'general',
        volatility: 'medium',
        priority: 'normal',
        canonical_summary: content,
        tags: [],
        projects: [],
        spheres
      },
      spheres
    );
  }, []);

  const handleApproveProposal = useCallback((proposalId: string) => {
    getGlobalProposalStore().approve(proposalId);
  }, []);

  const handleDiscardProposal = useCallback((proposalId: string) => {
    getGlobalProposalStore().discard(proposalId);
  }, []);

  // ----------------------------------------
  // UI MODE HANDLER
  // ----------------------------------------

  const handleSetUIMode = useCallback((mode: 'light' | 'dark_strict' | 'incident') => {
    setUIMode(mode);
    getGlobalProfileStore().setPreferredUIMode(mode);
    getGlobalEventStore().emit(
      'ui_mode_changed',
      'user',
      'reflection_room',
      'info',
      { mode }
    );
  }, []);

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  return (
    <div 
      className={`reflection-room ${className}`}
      data-ui-mode={uiMode}
      style={getContainerStyles(uiMode)}
    >
      {/* System Header - Nova visibility only */}
      <SystemHeader
        uiMode={uiMode}
        cognitiveLoad={cognitiveLoad}
        onNavigateToModule={onNavigateToModule}
      />

      {/* Main Layout Grid */}
      <div style={styles.layoutGrid}>
        {/* LEFT: Sphere Ring */}
        <div style={styles.leftPanel}>
          <SphereRing
            focusedSphere={focusedSphere}
            onFocusSphere={handleFocusSphere}
            uiMode={uiMode}
          />
        </div>

        {/* CENTER: Free Canvas */}
        <div style={styles.centerPanel}>
          <FreeCanvas
            blocks={canvasBlocks}
            links={canvasLinks}
            onAddBlock={handleAddBlock}
            onDeleteBlock={handleDeleteBlock}
            onUpdateBlock={handleUpdateBlock}
            onAddLink={handleAddLink}
            onCreateProposal={handleCreateProposal}
            uiMode={uiMode}
          />
        </div>

        {/* RIGHT: Proposal Drawer */}
        <div style={styles.rightPanel}>
          <ProposalDrawer
            proposals={pendingProposals}
            onApprove={handleApproveProposal}
            onDiscard={handleDiscardProposal}
            uiMode={uiMode}
          />
        </div>
      </div>

      {/* System Footer - Trace Strip */}
      <SystemFooter
        sessionId={effectiveSessionId}
        moduleState={state.module_state}
        cognitiveLoad={cognitiveLoad}
        uiMode={uiMode}
        onSetUIMode={handleSetUIMode}
      />
    </div>
  );
};

// ============================================
// STYLES
// ============================================

function getContainerStyles(uiMode: string): React.CSSProperties {
  const baseStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  switch (uiMode) {
    case 'light':
      return { ...baseStyles, backgroundColor: '#f5f5f5', color: '#1a1a1a' };
    case 'incident':
      return { ...baseStyles, backgroundColor: '#1a0a0a', color: '#ff6b6b' };
    case 'dark_strict':
    default:
      return { ...baseStyles, backgroundColor: '#0a0a1a', color: '#e0e0e0' };
  }
}

const styles: Record<string, React.CSSProperties> = {
  layoutGrid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '200px 1fr 280px',
    gap: '0',
    overflow: 'hidden'
  },
  leftPanel: {
    borderRight: '1px solid #333',
    overflow: 'auto'
  },
  centerPanel: {
    overflow: 'hidden',
    position: 'relative'
  },
  rightPanel: {
    borderLeft: '1px solid #333',
    overflow: 'auto'
  }
};

export default ReflectionRoomPage;
