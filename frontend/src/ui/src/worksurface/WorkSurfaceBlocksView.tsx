/**
 * ============================================================
 * CHE·NU — WORKSURFACE BLOCKS VIEW
 * SAFE · REPRESENTATIONAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Block-based editor view (Notion-like) for WorkSurface
 */

import React, { useState } from 'react';
import { CHENU_COLORS } from './worksurfaceStyles';

// ============================================================
// TYPES
// ============================================================

export interface ContentBlock {
  id: string;
  type: 'text' | 'heading' | 'list' | 'quote' | 'code' | 'divider' | 'callout' | 'image';
  content: string;
  meta?: Record<string, unknown>;
}

export interface WorkSurfaceBlocksViewProps {
  blocks?: ContentBlock[];
  onBlockClick?: (block: ContentBlock) => void;
  onBlockReorder?: (fromIndex: number, toIndex: number) => void;
  editable?: boolean;
}

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: CHENU_COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.borderColor}`,
    overflow: 'hidden',
  },
  header: {
    padding: '12px 16px',
    borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.textPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stats: {
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
    display: 'flex',
    gap: '12px',
  },
  legend: {
    padding: '10px 16px',
    borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
    backgroundColor: 'rgba(0,0,0,0.1)',
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '10px',
    color: CHENU_COLORS.textMuted,
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '2px',
  },
  blocksContainer: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '500px',
    overflowY: 'auto',
  },
  block: {
    padding: '14px 16px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    borderLeft: '3px solid',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  blockHover: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    transform: 'translateX(4px)',
  },
  blockHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  blockType: {
    fontSize: '10px',
    color: CHENU_COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  blockContent: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: CHENU_COLORS.textSecondary,
  },
  // Block type specific styles
  headingContent: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.textPrimary,
  },
  listContent: {
    paddingLeft: '20px',
  },
  quoteContent: {
    fontStyle: 'italic',
    opacity: 0.9,
  },
  codeContent: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '8px 12px',
    borderRadius: '4px',
  },
  calloutContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  calloutIcon: {
    fontSize: '20px',
  },
  dividerBlock: {
    padding: '8px 16px',
  },
  dividerLine: {
    height: '1px',
    backgroundColor: CHENU_COLORS.borderColor,
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: CHENU_COLORS.textMuted,
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '14px',
    marginBottom: '8px',
  },
  emptyHint: {
    fontSize: '12px',
    opacity: 0.7,
  },
  dragHandle: {
    cursor: 'grab',
    opacity: 0.5,
    fontSize: '12px',
  },
};

// ============================================================
// BLOCK TYPE CONFIG
// ============================================================

interface BlockTypeConfig {
  icon: string;
  color: string;
  label: string;
}

const BLOCK_TYPE_CONFIG: Record<string, BlockTypeConfig> = {
  text: { icon: '📝', color: CHENU_COLORS.ancientStone, label: 'Text' },
  heading: { icon: '📌', color: CHENU_COLORS.sacredGold, label: 'Heading' },
  list: { icon: '📋', color: CHENU_COLORS.cenoteTurquoise, label: 'List' },
  quote: { icon: '💬', color: CHENU_COLORS.jungleEmerald, label: 'Quote' },
  code: { icon: '💻', color: CHENU_COLORS.earthEmber, label: 'Code' },
  divider: { icon: '➖', color: CHENU_COLORS.borderColor, label: 'Divider' },
  callout: { icon: '💡', color: '#FF9800', label: 'Callout' },
  image: { icon: '🖼️', color: '#9C27B0', label: 'Image' },
};

// ============================================================
// COMPONENT
// ============================================================

export const WorkSurfaceBlocksView: React.FC<WorkSurfaceBlocksViewProps> = ({
  blocks = [],
  onBlockClick,
  onBlockReorder,
  editable = false,
}) => {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  // Count blocks by type
  const blockCounts = blocks.reduce((acc, block) => {
    acc[block.type] = (acc[block.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Handle block click
  const handleBlockClick = (block: ContentBlock) => {
    if (onBlockClick) {
      onBlockClick(block);
    }
  };

  // Get block config
  const getBlockConfig = (type: string): BlockTypeConfig => {
    return BLOCK_TYPE_CONFIG[type] || BLOCK_TYPE_CONFIG.text;
  };

  // Render block content based on type
  const renderBlockContent = (block: ContentBlock) => {
    const config = getBlockConfig(block.type);

    switch (block.type) {
      case 'heading':
        return (
          <div style={styles.headingContent}>
            {block.content}
          </div>
        );

      case 'list':
        return (
          <div style={styles.listContent}>
            • {block.content}
          </div>
        );

      case 'quote':
        return (
          <div style={styles.quoteContent}>
            "{block.content}"
          </div>
        );

      case 'code':
        return (
          <div style={styles.codeContent}>
            {block.content}
          </div>
        );

      case 'callout':
        return (
          <div style={styles.calloutContent}>
            <span style={styles.calloutIcon}>💡</span>
            <span>{block.content}</span>
          </div>
        );

      case 'divider':
        return (
          <div style={styles.dividerLine} />
        );

      default:
        return (
          <div style={styles.blockContent}>
            {block.content}
          </div>
        );
    }
  };

  // Empty state
  if (blocks.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>
            <span>🧱</span>
            <span>Block Editor</span>
          </div>
        </div>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🧱</div>
          <div style={styles.emptyText}>No blocks available</div>
          <div style={styles.emptyHint}>Add structured content (lists, headings) to see blocks</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>🧱</span>
          <span>Block Editor</span>
        </div>
        <div style={styles.stats}>
          <span>{blocks.length} block{blocks.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Legend */}
      <div style={styles.legend}>
        {Object.entries(blockCounts).map(([type, count]) => {
          const config = getBlockConfig(type);
          return (
            <div key={type} style={styles.legendItem}>
              <div style={{ ...styles.legendDot, backgroundColor: config.color }} />
              <span>{config.label}: {count}</span>
            </div>
          );
        })}
      </div>

      {/* Blocks */}
      <div style={styles.blocksContainer}>
        {blocks.map((block, index) => {
          const config = getBlockConfig(block.type);
          const isHovered = hoveredBlock === block.id;
          
          return (
            <div
              key={block.id}
              style={{
                ...styles.block,
                borderLeftColor: config.color,
                ...(isHovered ? styles.blockHover : {}),
              }}
              onMouseEnter={() => setHoveredBlock(block.id)}
              onMouseLeave={() => setHoveredBlock(null)}
              onClick={() => handleBlockClick(block)}
            >
              {/* Block Header */}
              <div style={styles.blockHeader}>
                <div style={styles.blockType}>
                  <span>{config.icon}</span>
                  <span>{config.label}</span>
                </div>
                {editable && (
                  <span style={styles.dragHandle}>⋮⋮</span>
                )}
              </div>
              
              {/* Block Content */}
              {renderBlockContent(block)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkSurfaceBlocksView;
