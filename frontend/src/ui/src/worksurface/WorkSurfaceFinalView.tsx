/**
 * ============================================================
 * CHE·NU — WORKSURFACE FINAL VIEW
 * SAFE · REPRESENTATIONAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Finalized document view (PDF-like) for WorkSurface
 */

import React from 'react';
import { CHENU_COLORS } from './worksurfaceStyles';

// ============================================================
// TYPES
// ============================================================

export interface WorkSurfaceFinalViewProps {
  textBlocks: string[];
  title?: string;
  author?: string;
  date?: string;
  onExport?: (format: 'pdf' | 'markdown' | 'text') => void;
  onPrint?: () => void;
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
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '11px',
    fontWeight: 500,
    cursor: 'pointer',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.textSecondary,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  actionButtonPrimary: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
  },
  documentContainer: {
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#4A4A4A',
    minHeight: '500px',
  },
  document: {
    backgroundColor: CHENU_COLORS.softSand,
    color: CHENU_COLORS.uiSlate,
    padding: '60px 50px',
    borderRadius: '4px',
    boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
    maxWidth: '700px',
    width: '100%',
    fontFamily: "'Georgia', 'Times New Roman', serif",
    lineHeight: 1.8,
  },
  documentHeader: {
    textAlign: 'center',
    marginBottom: '40px',
    paddingBottom: '30px',
    borderBottom: `2px solid ${CHENU_COLORS.uiSlate}20`,
  },
  documentTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: CHENU_COLORS.uiSlate,
    marginBottom: '12px',
    letterSpacing: '-0.5px',
  },
  documentMeta: {
    fontSize: '12px',
    color: '#666',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  documentBody: {
    fontSize: '15px',
    color: '#333',
  },
  paragraph: {
    marginBottom: '18px',
    textAlign: 'justify',
    textIndent: '2em',
  },
  firstParagraph: {
    textIndent: 0,
  },
  documentFooter: {
    marginTop: '50px',
    paddingTop: '20px',
    borderTop: `1px solid ${CHENU_COLORS.uiSlate}20`,
    fontSize: '10px',
    color: '#888',
    textAlign: 'center',
  },
  pageNumber: {
    marginTop: '30px',
    fontSize: '11px',
    color: '#666',
    textAlign: 'center',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: '60px',
    color: 'rgba(0,0,0,0.03)',
    fontWeight: 700,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
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
  footer: {
    padding: '10px 16px',
    borderTop: `1px solid ${CHENU_COLORS.borderColor}`,
    backgroundColor: 'rgba(0,0,0,0.1)',
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  warningBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#FF9800',
    backgroundColor: 'rgba(255,152,0,0.1)',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '10px',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const WorkSurfaceFinalView: React.FC<WorkSurfaceFinalViewProps> = ({
  textBlocks,
  title = 'Document',
  author,
  date,
  onExport,
  onPrint,
}) => {
  // Calculate stats
  const wordCount = textBlocks.join(' ').split(/\s+/).filter(w => w).length;
  const pageEstimate = Math.max(1, Math.ceil(wordCount / 300));

  // Get current date if not provided
  const displayDate = date || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Empty state
  if (textBlocks.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>
            <span>📄</span>
            <span>Final Document View</span>
          </div>
        </div>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📄</div>
          <div style={styles.emptyText}>No content to finalize</div>
          <div style={styles.emptyHint}>Add content to see the final document view</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>📄</span>
          <span>Final Document View</span>
        </div>
        <div style={styles.actions}>
          {onPrint && (
            <button onClick={onPrint} style={styles.actionButton}>
              🖨️ Print
            </button>
          )}
          {onExport && (
            <>
              <button onClick={() => onExport('markdown')} style={styles.actionButton}>
                📝 Markdown
              </button>
              <button onClick={() => onExport('text')} style={styles.actionButton}>
                📋 Text
              </button>
              <button onClick={() => onExport('pdf')} style={{ ...styles.actionButton, ...styles.actionButtonPrimary }}>
                📄 Export PDF
              </button>
            </>
          )}
        </div>
      </div>

      {/* Document Container */}
      <div style={styles.documentContainer}>
        <div style={styles.document}>
          {/* Watermark */}
          <div style={styles.watermark as React.CSSProperties}>REPRESENTATIONAL</div>
          
          {/* Document Header */}
          <div style={styles.documentHeader}>
            <div style={styles.documentTitle}>{title}</div>
            <div style={styles.documentMeta}>
              {author && <span>By {author}</span>}
              <span>{displayDate}</span>
              <span>{wordCount} words</span>
            </div>
          </div>

          {/* Document Body */}
          <div style={styles.documentBody}>
            {textBlocks.map((block, index) => (
              <p
                key={index}
                style={{
                  ...styles.paragraph,
                  ...(index === 0 ? styles.firstParagraph : {}),
                }}
              >
                {block}
              </p>
            ))}
          </div>

          {/* Document Footer */}
          <div style={styles.documentFooter}>
            <div>CHE·NU WorkSurface — Representational Document View</div>
            <div>This is a preview only. No actual file has been created.</div>
          </div>

          {/* Page Number */}
          <div style={styles.pageNumber}>
            Page 1 of {pageEstimate}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span>{wordCount} words • ~{pageEstimate} page{pageEstimate > 1 ? 's' : ''}</span>
        <div style={styles.warningBadge}>
          ⚠️ REPRESENTATIONAL — No real file created
        </div>
      </div>
    </div>
  );
};

export default WorkSurfaceFinalView;
