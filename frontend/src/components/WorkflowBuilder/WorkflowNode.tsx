/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — WORKFLOW NODE COMPONENT
   Visual draggable node for workflow canvas
   ═══════════════════════════════════════════════════════════════════════════════ */

import React, { useState, useCallback } from 'react';
import type { WorkflowNode as WorkflowNodeType, Position } from './types';
import { NODE_COLORS, NODE_ICONS } from './types';

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
};

// ════════════════════════════════════════════════════════════════════════════════
// PROPS
// ════════════════════════════════════════════════════════════════════════════════

interface WorkflowNodeProps {
  node: WorkflowNodeType;
  isSelected: boolean;
  isConnecting: boolean;
  zoom: number;
  onSelect: (nodeId: string) => void;
  onDragStart: (nodeId: string, e: React.MouseEvent) => void;
  onDrag: (nodeId: string, position: Position) => void;
  onDragEnd: (nodeId: string) => void;
  onConnectionStart: (nodeId: string, handleId?: string) => void;
  onConnectionEnd: (nodeId: string, handleId?: string) => void;
  onDelete: (nodeId: string) => void;
  onEdit: (nodeId: string) => void;
  locale?: 'en' | 'fr';
}

// ════════════════════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    position: 'absolute' as const,
    cursor: 'grab',
    userSelect: 'none' as const,
    transition: 'box-shadow 0.15s ease',
  },
  
  node: {
    minWidth: '180px',
    maxWidth: '220px',
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  
  iconContainer: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  
  headerContent: {
    flex: 1,
    minWidth: 0,
  },
  
  title: {
    fontSize: '13px',
    fontWeight: 600,
    color: COLORS.softSand,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  
  subtitle: {
    fontSize: '10px',
    color: COLORS.ancientStone,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  
  body: {
    padding: '10px 14px',
    fontSize: '11px',
    color: COLORS.ancientStone,
  },
  
  statusBadge: {
    position: 'absolute' as const,
    top: '-6px',
    right: '-6px',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    border: `2px solid ${COLORS.cardBg}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '8px',
  },
  
  handle: {
    position: 'absolute' as const,
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: COLORS.ancientStone,
    border: `2px solid ${COLORS.cardBg}`,
    cursor: 'crosshair',
    transition: 'all 0.15s ease',
  },
  
  handleTop: {
    top: '-6px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  
  handleBottom: {
    bottom: '-6px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  
  handleLeft: {
    left: '-6px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  
  handleRight: {
    right: '-6px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  
  conditionHandles: {
    position: 'absolute' as const,
    bottom: '-6px',
    display: 'flex',
    gap: '40px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  
  conditionHandle: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: `2px solid ${COLORS.cardBg}`,
    cursor: 'crosshair',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '8px',
    color: COLORS.cardBg,
    fontWeight: 'bold',
  },
  
  actions: {
    position: 'absolute' as const,
    top: '4px',
    right: '4px',
    display: 'flex',
    gap: '2px',
    opacity: 0,
    transition: 'opacity 0.15s ease',
  },
  
  actionButton: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: COLORS.softSand,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export const WorkflowNode: React.FC<WorkflowNodeProps> = ({
  node,
  isSelected,
  isConnecting,
  zoom,
  onSelect,
  onDragStart,
  onDrag,
  onDragEnd,
  onConnectionStart,
  onConnectionEnd,
  onDelete,
  onEdit,
  locale = 'fr',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const nodeColor = node.color || NODE_COLORS[node.type];
  const nodeIcon = node.icon || NODE_ICONS[node.type];
  const label = locale === 'fr' && node.labelFr ? node.labelFr : node.label;
  const description = locale === 'fr' && node.descriptionFr ? node.descriptionFr : node.description;

  // Handle mouse down for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();
    
    onSelect(node.id);
    setIsDragging(true);
    onDragStart(node.id, e);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { ...node.position };
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = (moveEvent.clientX - startX) / zoom;
      const dy = (moveEvent.clientY - startY) / zoom;
      onDrag(node.id, {
        x: startPos.x + dx,
        y: startPos.y + dy,
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      onDragEnd(node.id);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [node.id, node.position, zoom, onSelect, onDragStart, onDrag, onDragEnd]);

  // Handle connection start
  const handleConnectionMouseDown = useCallback((e: React.MouseEvent, handleId?: string) => {
    e.stopPropagation();
    onConnectionStart(node.id, handleId);
  }, [node.id, onConnectionStart]);

  // Handle connection end
  const handleConnectionMouseUp = useCallback((e: React.MouseEvent, handleId?: string) => {
    e.stopPropagation();
    if (isConnecting) {
      onConnectionEnd(node.id, handleId);
    }
  }, [node.id, isConnecting, onConnectionEnd]);

  // Get type label
  const getTypeLabel = (): string => {
    const labels: Record<string, { en: string; fr: string }> = {
      trigger: { en: 'Trigger', fr: 'Déclencheur' },
      condition: { en: 'Condition', fr: 'Condition' },
      action: { en: 'Action', fr: 'Action' },
      agent: { en: 'AI Agent', fr: 'Agent IA' },
      delay: { en: 'Delay', fr: 'Délai' },
      loop: { en: 'Loop', fr: 'Boucle' },
      transform: { en: 'Transform', fr: 'Transformation' },
      notification: { en: 'Notification', fr: 'Notification' },
      webhook: { en: 'Webhook', fr: 'Webhook' },
      end: { en: 'End', fr: 'Fin' },
    };
    return labels[node.type]?.[locale] || node.type;
  };

  return (
    <div
      style={{
        ...styles.container,
        left: node.position.x,
        top: node.position.y,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isSelected ? 100 : 1,
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={() => onEdit(node.id)}
    >
      {/* Input Handle (top) - except for triggers */}
      {node.type !== 'trigger' && (
        <div
          style={{
            ...styles.handle,
            ...styles.handleTop,
            backgroundColor: isConnecting ? COLORS.sacredGold : COLORS.ancientStone,
          }}
          onMouseDown={(e) => handleConnectionMouseDown(e, 'input')}
          onMouseUp={(e) => handleConnectionMouseUp(e, 'input')}
        />
      )}

      {/* Main Node */}
      <div
        style={{
          ...styles.node,
          border: isSelected 
            ? `2px solid ${COLORS.sacredGold}` 
            : `1px solid ${COLORS.border}`,
          boxShadow: isSelected 
            ? `0 0 20px ${COLORS.sacredGold}40` 
            : styles.node.boxShadow,
        }}
      >
        {/* Header */}
        <div style={styles.header}>
          <div
            style={{
              ...styles.iconContainer,
              backgroundColor: `${nodeColor}30`,
            }}
          >
            {nodeIcon}
          </div>
          <div style={styles.headerContent}>
            <div style={styles.title}>{label}</div>
            <div style={styles.subtitle}>{getTypeLabel()}</div>
          </div>
        </div>

        {/* Body (optional description) */}
        {description && (
          <div style={styles.body}>
            {description.length > 60 ? `${description.substring(0, 60)}...` : description}
          </div>
        )}

        {/* Validation Status */}
        {!node.isValid && (
          <div
            style={{
              ...styles.statusBadge,
              backgroundColor: '#C53030',
            }}
          >
            !
          </div>
        )}

        {/* Actions (visible on hover) */}
        <div
          style={{
            ...styles.actions,
            opacity: isHovered ? 1 : 0,
          }}
        >
          <button
            style={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(node.id);
            }}
            title={locale === 'fr' ? 'Modifier' : 'Edit'}
          >
            ✏️
          </button>
          {node.type !== 'trigger' && (
            <button
              style={styles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node.id);
              }}
              title={locale === 'fr' ? 'Supprimer' : 'Delete'}
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Output Handle(s) - different for condition nodes */}
      {node.type === 'condition' ? (
        <div style={styles.conditionHandles}>
          <div
            style={{
              ...styles.conditionHandle,
              backgroundColor: COLORS.jungleEmerald,
            }}
            onMouseDown={(e) => handleConnectionMouseDown(e, 'true')}
            title={locale === 'fr' ? 'Vrai' : 'True'}
          >
            ✓
          </div>
          <div
            style={{
              ...styles.conditionHandle,
              backgroundColor: '#C53030',
            }}
            onMouseDown={(e) => handleConnectionMouseDown(e, 'false')}
            title={locale === 'fr' ? 'Faux' : 'False'}
          >
            ✗
          </div>
        </div>
      ) : node.type !== 'end' ? (
        <div
          style={{
            ...styles.handle,
            ...styles.handleBottom,
            backgroundColor: isConnecting ? COLORS.sacredGold : COLORS.ancientStone,
          }}
          onMouseDown={(e) => handleConnectionMouseDown(e, 'output')}
        />
      ) : null}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default WorkflowNode;
