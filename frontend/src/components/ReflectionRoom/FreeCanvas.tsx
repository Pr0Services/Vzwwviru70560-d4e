/**
 * CHE·NU V51 — FREE CANVAS
 * =========================
 * 
 * Central cognitive staging area.
 * User creates blocks, links them, and generates proposals.
 * 
 * NO forced structure. Thinking first.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CanvasBlock, CanvasLink } from '../../contracts/ReflectionRoom.contract';

export interface FreeCanvasProps {
  blocks: CanvasBlock[];
  links: CanvasLink[];
  onAddBlock: (content: string, position: { x: number; y: number }) => void;
  onDeleteBlock: (blockId: string) => void;
  onUpdateBlock: (blockId: string, content: string) => void;
  onAddLink: (fromId: string, toId: string) => void;
  onCreateProposal: (content: string, spheres?: string[]) => void;
  uiMode: 'light' | 'dark_strict' | 'incident';
}

const FreeCanvas: React.FC<FreeCanvasProps> = ({
  blocks,
  links,
  onAddBlock,
  onDeleteBlock,
  onUpdateBlock,
  onAddLink,
  onCreateProposal,
  uiMode
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newBlockPos, setNewBlockPos] = useState<{ x: number; y: number } | null>(null);
  const [newBlockContent, setNewBlockContent] = useState('');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [linkingFrom, setLinkingFrom] = useState<string | null>(null);

  // Handle canvas double-click to create block
  const handleCanvasDoubleClick = useCallback((e: React.MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setNewBlockPos({ x, y });
      setIsCreating(true);
      setNewBlockContent('');
    }
  }, []);

  // Handle create block submit
  const handleCreateSubmit = useCallback(() => {
    if (newBlockContent.trim() && newBlockPos) {
      onAddBlock(newBlockContent.trim(), newBlockPos);
      setIsCreating(false);
      setNewBlockPos(null);
      setNewBlockContent('');
    }
  }, [newBlockContent, newBlockPos, onAddBlock]);

  // Handle block click
  const handleBlockClick = useCallback((blockId: string) => {
    if (linkingFrom) {
      // Creating a link
      if (linkingFrom !== blockId) {
        onAddLink(linkingFrom, blockId);
      }
      setLinkingFrom(null);
    } else {
      setSelectedBlockId(blockId === selectedBlockId ? null : blockId);
    }
  }, [linkingFrom, selectedBlockId, onAddLink]);

  // Handle start linking
  const handleStartLink = useCallback((blockId: string) => {
    setLinkingFrom(blockId);
  }, []);

  // Handle propose from block
  const handlePropose = useCallback((block: CanvasBlock) => {
    onCreateProposal(block.content);
  }, [onCreateProposal]);

  // Draw links
  const renderLinks = () => {
    return links.map(link => {
      const fromBlock = blocks.find(b => b.block_id === link.from_block_id);
      const toBlock = blocks.find(b => b.block_id === link.to_block_id);
      
      if (!fromBlock || !toBlock) return null;

      const fromX = fromBlock.position.x + 100;
      const fromY = fromBlock.position.y + 30;
      const toX = toBlock.position.x + 100;
      const toY = toBlock.position.y + 30;

      return (
        <svg
          key={link.link_id}
          style={styles.linkSvg}
        >
          <line
            x1={fromX}
            y1={fromY}
            x2={toX}
            y2={toY}
            stroke={getLinkColor(uiMode)}
            strokeWidth={2}
            strokeDasharray="5,5"
          />
        </svg>
      );
    });
  };

  return (
    <div
      ref={canvasRef}
      style={getCanvasStyles(uiMode)}
      onDoubleClick={handleCanvasDoubleClick}
    >
      {/* Instructions */}
      {blocks.length === 0 && !isCreating && (
        <div style={styles.instructions}>
          <p style={styles.instructionText}>Double-click to create a thought block</p>
          <p style={styles.instructionSubtext}>Think freely. Structure emerges later.</p>
        </div>
      )}

      {/* Links */}
      {renderLinks()}

      {/* Blocks */}
      {blocks.map(block => (
        <CanvasBlockComponent
          key={block.block_id}
          block={block}
          isSelected={block.block_id === selectedBlockId}
          isLinking={linkingFrom !== null}
          isLinkSource={block.block_id === linkingFrom}
          uiMode={uiMode}
          onClick={() => handleBlockClick(block.block_id)}
          onDelete={() => onDeleteBlock(block.block_id)}
          onUpdate={(content) => onUpdateBlock(block.block_id, content)}
          onStartLink={() => handleStartLink(block.block_id)}
          onPropose={() => handlePropose(block)}
        />
      ))}

      {/* New Block Creator */}
      {isCreating && newBlockPos && (
        <div
          style={{
            ...styles.newBlock,
            left: newBlockPos.x,
            top: newBlockPos.y,
            backgroundColor: getBlockBg(uiMode),
            borderColor: getBlockBorder(uiMode)
          }}
        >
          <textarea
            autoFocus
            value={newBlockContent}
            onChange={e => setNewBlockContent(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && e.metaKey) {
                handleCreateSubmit();
              } else if (e.key === 'Escape') {
                setIsCreating(false);
              }
            }}
            placeholder="Enter your thought..."
            style={styles.newBlockInput}
          />
          <div style={styles.newBlockActions}>
            <button
              onClick={handleCreateSubmit}
              style={styles.actionButton}
            >
              Create (⌘+Enter)
            </button>
            <button
              onClick={() => setIsCreating(false)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Linking indicator */}
      {linkingFrom && (
        <div style={styles.linkingIndicator}>
          Click another block to create link (ESC to cancel)
        </div>
      )}
    </div>
  );
};

// ============================================
// CANVAS BLOCK COMPONENT
// ============================================

interface CanvasBlockComponentProps {
  block: CanvasBlock;
  isSelected: boolean;
  isLinking: boolean;
  isLinkSource: boolean;
  uiMode: string;
  onClick: () => void;
  onDelete: () => void;
  onUpdate: (content: string) => void;
  onStartLink: () => void;
  onPropose: () => void;
}

const CanvasBlockComponent: React.FC<CanvasBlockComponentProps> = ({
  block,
  isSelected,
  isLinking,
  isLinkSource,
  uiMode,
  onClick,
  onDelete,
  onUpdate,
  onStartLink,
  onPropose
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(block.content);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditContent(block.content);
  };

  const handleSave = () => {
    onUpdate(editContent);
    setIsEditing(false);
  };

  return (
    <div
      style={{
        ...styles.block,
        left: block.position.x,
        top: block.position.y,
        backgroundColor: getBlockBg(uiMode),
        borderColor: isLinkSource ? '#4a9eff' : isSelected ? '#81c784' : getBlockBorder(uiMode),
        borderWidth: isSelected || isLinkSource ? '2px' : '1px',
        cursor: isLinking ? 'crosshair' : 'pointer'
      }}
      onClick={onClick}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <div style={styles.blockEdit}>
          <textarea
            autoFocus
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && e.metaKey) handleSave();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            style={styles.blockEditInput}
          />
          <button onClick={handleSave} style={styles.smallButton}>Save</button>
        </div>
      ) : (
        <>
          <div style={styles.blockContent}>{block.content}</div>
          {isSelected && (
            <div style={styles.blockActions}>
              <button onClick={onStartLink} style={styles.blockAction} title="Link">🔗</button>
              <button onClick={onPropose} style={styles.blockAction} title="Propose">📝</button>
              <button onClick={onDelete} style={styles.blockAction} title="Delete">🗑️</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================
// STYLE HELPERS
// ============================================

function getCanvasStyles(uiMode: string): React.CSSProperties {
  return {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: uiMode === 'light' ? '#fafafa' 
      : uiMode === 'incident' ? '#0a0505' 
      : '#0a0a15'
  };
}

function getBlockBg(uiMode: string): string {
  switch (uiMode) {
    case 'light': return '#fff';
    case 'incident': return '#1a0a0a';
    default: return '#1a1a2e';
  }
}

function getBlockBorder(uiMode: string): string {
  switch (uiMode) {
    case 'light': return '#ddd';
    case 'incident': return '#500';
    default: return '#333';
  }
}

function getLinkColor(uiMode: string): string {
  switch (uiMode) {
    case 'light': return '#999';
    case 'incident': return '#600';
    default: return '#4a4a6a';
  }
}

const styles: Record<string, React.CSSProperties> = {
  instructions: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    opacity: 0.5
  },
  instructionText: {
    fontSize: '18px',
    marginBottom: '10px'
  },
  instructionSubtext: {
    fontSize: '14px',
    color: '#888'
  },
  linkSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none'
  },
  block: {
    position: 'absolute',
    minWidth: '200px',
    maxWidth: '300px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
  blockContent: {
    fontSize: '14px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap'
  },
  blockActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
    borderTop: '1px solid #333',
    paddingTop: '8px'
  },
  blockAction: {
    padding: '4px 8px',
    fontSize: '12px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    opacity: 0.7
  },
  blockEdit: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  blockEditInput: {
    width: '100%',
    minHeight: '80px',
    padding: '8px',
    fontSize: '14px',
    backgroundColor: 'transparent',
    border: '1px solid #444',
    borderRadius: '4px',
    color: 'inherit',
    resize: 'vertical'
  },
  smallButton: {
    padding: '4px 12px',
    fontSize: '12px',
    backgroundColor: '#4a4a6a',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer'
  },
  newBlock: {
    position: 'absolute',
    width: '300px',
    padding: '12px',
    borderRadius: '8px',
    border: '2px dashed',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
  },
  newBlockInput: {
    width: '100%',
    minHeight: '100px',
    padding: '8px',
    fontSize: '14px',
    backgroundColor: 'transparent',
    border: '1px solid #444',
    borderRadius: '4px',
    color: 'inherit',
    resize: 'vertical',
    marginBottom: '10px'
  },
  newBlockActions: {
    display: 'flex',
    gap: '10px'
  },
  actionButton: {
    padding: '8px 16px',
    fontSize: '13px',
    backgroundColor: '#4a6a4a',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer'
  },
  cancelButton: {
    padding: '8px 16px',
    fontSize: '13px',
    backgroundColor: 'transparent',
    border: '1px solid #666',
    borderRadius: '4px',
    color: '#888',
    cursor: 'pointer'
  },
  linkingIndicator: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '8px 16px',
    backgroundColor: '#4a9eff',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '13px'
  }
};

export default FreeCanvas;
