/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — WORKFLOW BUILDER CANVAS
   Main visual workflow editor component
   ═══════════════════════════════════════════════════════════════════════════════ */

import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import type { 
  Workflow, 
  WorkflowNode as WorkflowNodeType, 
  WorkflowEdge, 
  Position,
  NodeTemplate 
} from './types';
import { NODE_COLORS } from './types';
import { WorkflowNode } from './WorkflowNode';
import { WorkflowSidebar } from './WorkflowSidebar';
import { WORKFLOW_TEMPLATES, createWorkflowFromTemplate } from './templates';

// ════════════════════════════════════════════════════════════════════════════════
// PALETTE CHE·NU
// ════════════════════════════════════════════════════════════════════════════════

const COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  background: '#0c0a09',
  cardBg: '#111113',
  border: 'rgba(141, 131, 113, 0.2)',
  gridLine: 'rgba(141, 131, 113, 0.1)',
};

// ════════════════════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    display: 'flex',
    height: '100%',
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  
  canvasContainer: {
    flex: 1,
    position: 'relative' as const,
    overflow: 'hidden',
  },
  
  canvas: {
    position: 'absolute' as const,
    width: '5000px',
    height: '5000px',
    backgroundImage: `
      linear-gradient(${COLORS.gridLine} 1px, transparent 1px),
      linear-gradient(90deg, ${COLORS.gridLine} 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
    cursor: 'grab',
  },
  
  toolbar: {
    position: 'absolute' as const,
    top: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: COLORS.cardBg,
    borderRadius: '10px',
    border: `1px solid ${COLORS.border}`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  },
  
  toolbarButton: {
    padding: '8px 14px',
    fontSize: '12px',
    fontWeight: 500,
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.15s ease',
  },
  
  zoomControls: {
    position: 'absolute' as const,
    bottom: '16px',
    right: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    backgroundColor: COLORS.cardBg,
    borderRadius: '8px',
    border: `1px solid ${COLORS.border}`,
    padding: '4px',
    zIndex: 1000,
  },
  
  zoomButton: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: COLORS.softSand,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    transition: 'all 0.15s ease',
  },
  
  zoomLevel: {
    textAlign: 'center' as const,
    fontSize: '10px',
    color: COLORS.ancientStone,
    padding: '4px',
  },
  
  statusBar: {
    position: 'absolute' as const,
    bottom: '16px',
    left: '16px',
    display: 'flex',
    gap: '16px',
    padding: '8px 14px',
    backgroundColor: COLORS.cardBg,
    borderRadius: '8px',
    border: `1px solid ${COLORS.border}`,
    fontSize: '11px',
    color: COLORS.ancientStone,
    zIndex: 1000,
  },
  
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  
  edgeSvg: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    overflow: 'visible',
  },
  
  minimap: {
    position: 'absolute' as const,
    bottom: '60px',
    right: '16px',
    width: '150px',
    height: '100px',
    backgroundColor: COLORS.cardBg,
    borderRadius: '8px',
    border: `1px solid ${COLORS.border}`,
    overflow: 'hidden',
    zIndex: 1000,
  },
  
  emptyState: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center' as const,
    color: COLORS.ancientStone,
  },
  
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5,
  },
  
  emptyTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: COLORS.softSand,
    marginBottom: '8px',
  },
  
  emptyText: {
    fontSize: '13px',
    marginBottom: '20px',
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// PROPS
// ════════════════════════════════════════════════════════════════════════════════

interface WorkflowBuilderProps {
  workflow?: Workflow;
  onChange?: (workflow: Workflow) => void;
  onSave?: (workflow: Workflow) => void;
  onExecute?: (workflow: Workflow) => void;
  readOnly?: boolean;
  locale?: 'en' | 'fr';
}

// ════════════════════════════════════════════════════════════════════════════════
// HELPER: Generate ID
// ════════════════════════════════════════════════════════════════════════════════

const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ════════════════════════════════════════════════════════════════════════════════
// HELPER: Calculate edge path
// ════════════════════════════════════════════════════════════════════════════════

const calculateEdgePath = (
  sourcePos: Position,
  targetPos: Position,
  sourceHandle?: string
): string => {
  // Adjust for handle positions
  const sx = sourcePos.x + 90; // Center of node
  const sy = sourcePos.y + 80; // Bottom of node (approx)
  const tx = targetPos.x + 90; // Center of node
  const ty = targetPos.y;      // Top of node
  
  // Calculate control points for smooth curve
  const midY = (sy + ty) / 2;
  const controlOffset = Math.abs(ty - sy) * 0.5;
  
  return `M ${sx} ${sy} C ${sx} ${sy + controlOffset}, ${tx} ${ty - controlOffset}, ${tx} ${ty}`;
};

// ════════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflow: initialWorkflow,
  onChange,
  onSave,
  onExecute,
  readOnly = false,
  locale = 'fr',
}) => {
  // State
  const [workflow, setWorkflow] = useState<Workflow>(() => {
    if (initialWorkflow) return initialWorkflow;
    
    // Create empty workflow
    return {
      id: generateId('wf'),
      name: locale === 'fr' ? 'Nouveau Workflow' : 'New Workflow',
      version: 1,
      status: 'draft',
      nodes: [],
      edges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'user',
      executionCount: 0,
    };
  });
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState<Position>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSource, setConnectionSource] = useState<{ nodeId: string; handleId?: string } | null>(null);
  const [tempConnectionEnd, setTempConnectionEnd] = useState<Position | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Notify parent of changes
  useEffect(() => {
    onChange?.(workflow);
  }, [workflow, onChange]);

  // ════════════════════════════════════════════════════════════════════════════
  // NODE OPERATIONS
  // ════════════════════════════════════════════════════════════════════════════

  const addNode = useCallback((template: NodeTemplate, position: Position) => {
    const newNode: WorkflowNodeType = {
      id: generateId('node'),
      type: template.type,
      position,
      label: template.label,
      labelFr: template.labelFr,
      description: template.description,
      descriptionFr: template.descriptionFr,
      icon: template.icon,
      color: template.color,
      isValid: true,
      ...template.defaultConfig,
    } as WorkflowNodeType;

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      updatedAt: new Date(),
    }));
    
    setSelectedNodeId(newNode.id);
  }, []);

  const updateNode = useCallback((nodeId: string, updates: Partial<WorkflowNodeType>) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => 
        n.id === nodeId ? { ...n, ...updates } as WorkflowNodeType : n
      ),
      updatedAt: new Date(),
    }));
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      edges: prev.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
      updatedAt: new Date(),
    }));
    
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  }, [selectedNodeId]);

  const moveNode = useCallback((nodeId: string, position: Position) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(n =>
        n.id === nodeId ? { ...n, position } : n
      ),
    }));
  }, []);

  // ════════════════════════════════════════════════════════════════════════════
  // EDGE OPERATIONS
  // ════════════════════════════════════════════════════════════════════════════

  const addEdge = useCallback((source: string, target: string, sourceHandle?: string) => {
    // Prevent duplicate edges
    const exists = workflow.edges.some(
      e => e.source === source && e.target === target
    );
    if (exists) return;
    
    // Prevent self-connections
    if (source === target) return;
    
    const newEdge: WorkflowEdge = {
      id: generateId('edge'),
      source,
      target,
      sourceHandle,
      label: sourceHandle === 'true' ? (locale === 'fr' ? 'Oui' : 'Yes') :
             sourceHandle === 'false' ? (locale === 'fr' ? 'Non' : 'No') : undefined,
      animated: true,
    };

    setWorkflow(prev => ({
      ...prev,
      edges: [...prev.edges, newEdge],
      updatedAt: new Date(),
    }));
  }, [workflow.edges, locale]);

  const deleteEdge = useCallback((edgeId: string) => {
    setWorkflow(prev => ({
      ...prev,
      edges: prev.edges.filter(e => e.id !== edgeId),
      updatedAt: new Date(),
    }));
    
    if (selectedEdgeId === edgeId) {
      setSelectedEdgeId(null);
    }
  }, [selectedEdgeId]);

  // ════════════════════════════════════════════════════════════════════════════
  // CONNECTION HANDLING
  // ════════════════════════════════════════════════════════════════════════════

  const handleConnectionStart = useCallback((nodeId: string, handleId?: string) => {
    setIsConnecting(true);
    setConnectionSource({ nodeId, handleId });
  }, []);

  const handleConnectionEnd = useCallback((nodeId: string, handleId?: string) => {
    if (connectionSource && connectionSource.nodeId !== nodeId) {
      addEdge(connectionSource.nodeId, nodeId, connectionSource.handleId);
    }
    setIsConnecting(false);
    setConnectionSource(null);
    setTempConnectionEnd(null);
  }, [connectionSource, addEdge]);

  // ════════════════════════════════════════════════════════════════════════════
  // CANVAS INTERACTIONS
  // ════════════════════════════════════════════════════════════════════════════

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && e.target === canvasRef.current) {
      setIsPanning(true);
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
    }
  }, []);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }
    
    if (isConnecting && connectionSource) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setTempConnectionEnd({
          x: (e.clientX - rect.left - panOffset.x) / zoom,
          y: (e.clientY - rect.top - panOffset.y) / zoom,
        });
      }
    }
  }, [isPanning, isConnecting, connectionSource, panOffset, zoom]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsPanning(false);
    if (isConnecting) {
      setIsConnecting(false);
      setConnectionSource(null);
      setTempConnectionEnd(null);
    }
  }, [isConnecting]);

  // Handle drop from sidebar
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    
    try {
      const template: NodeTemplate = JSON.parse(data);
      const rect = canvasRef.current?.getBoundingClientRect();
      
      if (rect) {
        const position: Position = {
          x: (e.clientX - rect.left - panOffset.x) / zoom - 90,
          y: (e.clientY - rect.top - panOffset.y) / zoom - 40,
        };
        addNode(template, position);
      }
    } catch (error) {
      logger.error('Failed to parse dropped node:', error);
    }
  }, [panOffset, zoom, addNode]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  // ════════════════════════════════════════════════════════════════════════════
  // ZOOM
  // ════════════════════════════════════════════════════════════════════════════

  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.min(Math.max(prev + delta, 0.25), 2));
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      handleZoom(e.deltaY > 0 ? -0.1 : 0.1);
    }
  }, [handleZoom]);

  // ════════════════════════════════════════════════════════════════════════════
  // TEMPLATE SELECTION
  // ════════════════════════════════════════════════════════════════════════════

  const handleTemplateSelect = useCallback((template: typeof WORKFLOW_TEMPLATES[0]) => {
    const newWorkflow = createWorkflowFromTemplate(template, 'user');
    setWorkflow(newWorkflow);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    
    // Center the view
    setPanOffset({ x: 100, y: 50 });
    setZoom(1);
  }, []);

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER EDGES
  // ════════════════════════════════════════════════════════════════════════════

  const renderedEdges = useMemo(() => {
    return workflow.edges.map(edge => {
      const sourceNode = workflow.nodes.find(n => n.id === edge.source);
      const targetNode = workflow.nodes.find(n => n.id === edge.target);
      
      if (!sourceNode || !targetNode) return null;
      
      const path = calculateEdgePath(sourceNode.position, targetNode.position, edge.sourceHandle);
      const isSelected = selectedEdgeId === edge.id;
      
      return (
        <g key={edge.id}>
          {/* Invisible wider path for easier clicking */}
          <path
            d={path}
            stroke="transparent"
            strokeWidth={20}
            fill="none"
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedEdgeId(edge.id)}
          />
          {/* Visible edge */}
          <path
            d={path}
            stroke={isSelected ? COLORS.sacredGold : COLORS.ancientStone}
            strokeWidth={isSelected ? 3 : 2}
            fill="none"
            strokeDasharray={edge.animated ? '5,5' : undefined}
            markerEnd="url(#arrowhead)"
          >
            {edge.animated && (
              <animate
                attributeName="stroke-dashoffset"
                values="10;0"
                dur="0.5s"
                repeatCount="indefinite"
              />
            )}
          </path>
          {/* Edge label */}
          {edge.label && (
            <text
              x={(sourceNode.position.x + targetNode.position.x) / 2 + 90}
              y={(sourceNode.position.y + targetNode.position.y) / 2 + 40}
              fill={COLORS.ancientStone}
              fontSize="10"
              textAnchor="middle"
              style={{ userSelect: 'none' }}
            >
              {edge.label}
            </text>
          )}
        </g>
      );
    });
  }, [workflow.edges, workflow.nodes, selectedEdgeId]);

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      {!readOnly && (
        <WorkflowSidebar
          onNodeDragStart={() => {}}
          onTemplateSelect={handleTemplateSelect}
          locale={locale}
        />
      )}

      {/* Canvas Container */}
      <div 
        ref={containerRef}
        style={styles.canvasContainer}
        onWheel={handleWheel}
      >
        {/* Toolbar */}
        <div style={styles.toolbar}>
          <button
            style={{
              ...styles.toolbarButton,
              backgroundColor: COLORS.background,
              color: COLORS.softSand,
            }}
            onClick={() => {
              const newWorkflow = {
                ...workflow,
                id: generateId('wf'),
                name: locale === 'fr' ? 'Nouveau Workflow' : 'New Workflow',
                nodes: [],
                edges: [],
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              setWorkflow(newWorkflow);
            }}
          >
            📄 {locale === 'fr' ? 'Nouveau' : 'New'}
          </button>
          
          <button
            style={{
              ...styles.toolbarButton,
              backgroundColor: COLORS.sacredGold,
              color: COLORS.uiSlate,
            }}
            onClick={() => onSave?.(workflow)}
            disabled={readOnly}
          >
            💾 {locale === 'fr' ? 'Sauvegarder' : 'Save'}
          </button>
          
          <button
            style={{
              ...styles.toolbarButton,
              backgroundColor: COLORS.jungleEmerald,
              color: COLORS.softSand,
            }}
            onClick={() => onExecute?.(workflow)}
            disabled={workflow.nodes.length === 0}
          >
            ▶️ {locale === 'fr' ? 'Exécuter' : 'Execute'}
          </button>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          style={{
            ...styles.canvas,
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            cursor: isPanning ? 'grabbing' : 'grab',
          }}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* SVG for edges */}
          <svg style={styles.edgeSvg}>
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill={COLORS.ancientStone}
                />
              </marker>
            </defs>
            {renderedEdges}
            
            {/* Temp connection line */}
            {isConnecting && connectionSource && tempConnectionEnd && (
              <path
                d={calculateEdgePath(
                  workflow.nodes.find(n => n.id === connectionSource.nodeId)?.position || { x: 0, y: 0 },
                  tempConnectionEnd
                )}
                stroke={COLORS.sacredGold}
                strokeWidth={2}
                strokeDasharray="5,5"
                fill="none"
              />
            )}
          </svg>

          {/* Nodes */}
          {workflow.nodes.map(node => (
            <WorkflowNode
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              isConnecting={isConnecting}
              zoom={zoom}
              onSelect={setSelectedNodeId}
              onDragStart={() => {}}
              onDrag={(_, pos) => moveNode(node.id, pos)}
              onDragEnd={() => {}}
              onConnectionStart={handleConnectionStart}
              onConnectionEnd={handleConnectionEnd}
              onDelete={deleteNode}
              onEdit={() => logger.debug('Edit node:', node.id)}
              locale={locale}
            />
          ))}

          {/* Empty State */}
          {workflow.nodes.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🔧</div>
              <div style={styles.emptyTitle}>
                {locale === 'fr' 
                  ? 'Commencez à construire votre workflow'
                  : 'Start building your workflow'}
              </div>
              <div style={styles.emptyText}>
                {locale === 'fr'
                  ? 'Glissez des nœuds depuis la barre latérale ou choisissez un modèle'
                  : 'Drag nodes from the sidebar or choose a template'}
              </div>
            </div>
          )}
        </div>

        {/* Zoom Controls */}
        <div style={styles.zoomControls}>
          <button
            style={styles.zoomButton}
            onClick={() => handleZoom(0.1)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.background}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            +
          </button>
          <div style={styles.zoomLevel}>{Math.round(zoom * 100)}%</div>
          <button
            style={styles.zoomButton}
            onClick={() => handleZoom(-0.1)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.background}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            −
          </button>
          <button
            style={styles.zoomButton}
            onClick={() => { setZoom(1); setPanOffset({ x: 0, y: 0 }); }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.background}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title={locale === 'fr' ? 'Réinitialiser' : 'Reset'}
          >
            ⟲
          </button>
        </div>

        {/* Status Bar */}
        <div style={styles.statusBar}>
          <div style={styles.statusItem}>
            📦 {workflow.nodes.length} {locale === 'fr' ? 'nœuds' : 'nodes'}
          </div>
          <div style={styles.statusItem}>
            🔗 {workflow.edges.length} {locale === 'fr' ? 'connexions' : 'connections'}
          </div>
          <div style={styles.statusItem}>
            {workflow.status === 'active' ? '🟢' : workflow.status === 'paused' ? '🟡' : '⚪'}
            {' '}{workflow.status}
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default WorkflowBuilder;
