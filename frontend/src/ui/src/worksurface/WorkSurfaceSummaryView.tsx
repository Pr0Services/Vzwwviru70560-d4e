/**
 * ============================================================
 * CHE·NU — WORKSURFACE SUMMARY VIEW
 * SAFE · REPRESENTATIONAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Summary display view for WorkSurface
 */

import React from 'react';
import { CHENU_COLORS } from './worksurfaceStyles';

// ============================================================
// TYPES
// ============================================================

export interface WorkSurfaceSummaryViewProps {
  summary?: string;
  textBlocks?: string[];
  onRegenerate?: () => void;
  onCopy?: () => void;
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
  contentArea: {
    padding: '24px',
  },
  summaryBox: {
    backgroundColor: `${CHENU_COLORS.sacredGold}15`,
    border: `1px solid ${CHENU_COLORS.sacredGold}30`,
    borderRadius: '12px',
    padding: '24px',
  },
  summaryIcon: {
    fontSize: '32px',
    marginBottom: '16px',
  },
  summaryLabel: {
    fontSize: '11px',
    color: CHENU_COLORS.sacredGold,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px',
  },
  summaryText: {
    fontSize: '16px',
    lineHeight: 1.8,
    color: CHENU_COLORS.textPrimary,
  },
  statsSection: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
  },
  statsTitle: {
    fontSize: '12px',
    color: CHENU_COLORS.textMuted,
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: CHENU_COLORS.cenoteTurquoise,
  },
  statLabel: {
    fontSize: '10px',
    color: CHENU_COLORS.textMuted,
    marginTop: '4px',
    textTransform: 'uppercase',
  },
  keywordsSection: {
    marginTop: '20px',
    padding: '16px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
  },
  keywordsTitle: {
    fontSize: '12px',
    color: CHENU_COLORS.textMuted,
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  keywordsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  keyword: {
    padding: '4px 10px',
    backgroundColor: `${CHENU_COLORS.jungleEmerald}30`,
    borderRadius: '12px',
    fontSize: '11px',
    color: CHENU_COLORS.jungleEmerald,
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
  },
};

// ============================================================
// HELPERS
// ============================================================

function extractKeywords(text: string): string[] {
  // Simple keyword extraction - take most frequent words > 4 chars
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 4);
  
  const wordCount: Record<string, number> = {};
  words.forEach(w => {
    wordCount[w] = (wordCount[w] || 0) + 1;
  });
  
  // Stop words to filter out
  const stopWords = new Set(['about', 'above', 'after', 'again', 'against', 'because', 'before', 'being', 'below', 'between', 'could', 'during', 'would', 'should', 'there', 'these', 'those', 'through', 'under', 'until', 'where', 'which', 'while', 'their', 'other']);
  
  return Object.entries(wordCount)
    .filter(([word]) => !stopWords.has(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
}

function calculateStats(textBlocks: string[]) {
  const allText = textBlocks.join(' ');
  const words = allText.split(/\s+/).filter(w => w);
  const sentences = allText.split(/[.!?]+/).filter(s => s.trim());
  const paragraphs = textBlocks.length;
  const chars = allText.length;
  
  return {
    words: words.length,
    sentences: sentences.length,
    paragraphs,
    chars,
    avgWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
    readingTime: Math.max(1, Math.ceil(words.length / 200)), // ~200 words per minute
  };
}

// ============================================================
// COMPONENT
// ============================================================

export const WorkSurfaceSummaryView: React.FC<WorkSurfaceSummaryViewProps> = ({
  summary,
  textBlocks = [],
  onRegenerate,
  onCopy,
}) => {
  const stats = calculateStats(textBlocks);
  const keywords = extractKeywords(textBlocks.join(' '));

  // Copy to clipboard
  const handleCopy = () => {
    if (summary) {
      navigator.clipboard?.writeText(summary);
      onCopy?.();
    }
  };

  // Empty state
  if (!summary && textBlocks.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>
            <span>📋</span>
            <span>Summary View</span>
          </div>
        </div>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📋</div>
          <div style={styles.emptyText}>No summary available</div>
          <div style={styles.emptyHint}>Add more content to generate a summary</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>📋</span>
          <span>Summary View</span>
        </div>
        <div style={styles.actions}>
          {onRegenerate && (
            <button onClick={onRegenerate} style={styles.actionButton}>
              🔄 Regenerate
            </button>
          )}
          <button onClick={handleCopy} style={styles.actionButton}>
            📋 Copy
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={styles.contentArea}>
        {/* Summary Box */}
        <div style={styles.summaryBox}>
          <div style={styles.summaryIcon}>📋</div>
          <div style={styles.summaryLabel}>Content Summary</div>
          <div style={styles.summaryText}>
            {summary || 'No summary generated yet. Add more content to see a summary.'}
          </div>
        </div>

        {/* Stats Section */}
        <div style={styles.statsSection}>
          <div style={styles.statsTitle}>Content Statistics</div>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.words}</div>
              <div style={styles.statLabel}>Words</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.sentences}</div>
              <div style={styles.statLabel}>Sentences</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.paragraphs}</div>
              <div style={styles.statLabel}>Blocks</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{stats.readingTime}m</div>
              <div style={styles.statLabel}>Read Time</div>
            </div>
          </div>
        </div>

        {/* Keywords Section */}
        {keywords.length > 0 && (
          <div style={styles.keywordsSection}>
            <div style={styles.keywordsTitle}>Key Topics</div>
            <div style={styles.keywordsList}>
              {keywords.map((keyword, i) => (
                <span key={i} style={styles.keyword}>
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span>Generated from {textBlocks.length} content block(s)</span>
        <span style={{ color: CHENU_COLORS.jungleEmerald }}>SAFE · REPRESENTATIONAL</span>
      </div>
    </div>
  );
};

export default WorkSurfaceSummaryView;
