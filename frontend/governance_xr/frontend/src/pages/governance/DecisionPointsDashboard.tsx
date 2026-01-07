/**
 * CHE·NU™ Decision Points Dashboard
 * 
 * Main dashboard for viewing and managing decision points.
 * Shows aging summary, urgent items, and full list with filters.
 * 
 * R&D Rule #1: Human Sovereignty - All decisions tracked and managed here
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useDecisionPoints,
  useDecisionPointsSummary,
  useUrgentDecisionPoints,
  useDecisionPointActions,
} from '../../hooks/use-governance-xr';
import { DecisionPointCard, DecisionPointList } from '../../components/governance';
import type {
  DecisionPoint,
  AgingLevel,
  DecisionPointType,
} from '../../types/governance-xr.types';
import {
  AGING_CONFIG,
  DECISION_TYPE_CONFIG,
} from '../../types/governance-xr.types';

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0f',
    color: '#e0e0e0',
    padding: '24px',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#888',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  summaryCard: {
    backgroundColor: '#1a1a24',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center' as const,
    border: '1px solid #2a2a3a',
    transition: 'all 0.2s ease',
  },
  summaryCount: {
    fontSize: '36px',
    fontWeight: 700,
    marginBottom: '4px',
  },
  summaryLabel: {
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    opacity: 0.7,
  },
  urgentBanner: {
    backgroundColor: '#2a1a1a',
    border: '1px solid #ff4444',
    borderRadius: '12px',
    padding: '16px 24px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  urgentText: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#ff6666',
    fontWeight: 500,
  },
  urgentIcon: {
    fontSize: '24px',
    animation: 'pulse 1s infinite',
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap' as const,
  },
  filterButton: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #3a3a4a',
    backgroundColor: 'transparent',
    color: '#888',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s ease',
  },
  filterButtonActive: {
    backgroundColor: '#2a4a6a',
    borderColor: '#4a8aff',
    color: '#ffffff',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '24px',
  },
  listSection: {
    backgroundColor: '#12121a',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #2a2a3a',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  sidebarCard: {
    backgroundColor: '#12121a',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #2a2a3a',
  },
  sidebarTitle: {
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#aaa',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  quickAction: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#1a1a24',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    width: '100%',
    textAlign: 'left' as const,
    color: '#e0e0e0',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: '#666',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5,
  },
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    color: '#666',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #2a2a3a',
    borderTopColor: '#4a8aff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SUMMARY CARDS
// ═══════════════════════════════════════════════════════════════════════════════

interface SummaryCardProps {
  level: AgingLevel;
  count: number;
  onClick: () => void;
  isSelected: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  level,
  count,
  onClick,
  isSelected,
}) => {
  const config = AGING_CONFIG[level];
  
  return (
    <motion.div
      style={{
        ...styles.summaryCard,
        borderColor: isSelected ? config.color : '#2a2a3a',
        backgroundColor: isSelected ? `${config.color}15` : '#1a1a24',
        cursor: 'pointer',
      }}
      whileHover={{ scale: 1.02, borderColor: config.color }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div style={{ ...styles.summaryCount, color: config.color }}>
        {count}
      </div>
      <div style={styles.summaryLabel}>
        {config.icon} {config.label}
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// URGENT BANNER
// ═══════════════════════════════════════════════════════════════════════════════

interface UrgentBannerProps {
  count: number;
  hasCritical: boolean;
  onViewUrgent: () => void;
}

const UrgentBanner: React.FC<UrgentBannerProps> = ({
  count,
  hasCritical,
  onViewUrgent,
}) => {
  if (count === 0) return null;
  
  return (
    <motion.div
      style={{
        ...styles.urgentBanner,
        backgroundColor: hasCritical ? '#3a1a1a' : '#2a1a1a',
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div style={styles.urgentText}>
        <span style={styles.urgentIcon}>
          {hasCritical ? '🚨' : '⚠️'}
        </span>
        <span>
          <strong>{count}</strong> decision{count > 1 ? 's' : ''} need{count === 1 ? 's' : ''} urgent attention
          {hasCritical && ' - CRITICAL items present!'}
        </span>
      </div>
      <motion.button
        style={{
          ...styles.filterButton,
          backgroundColor: '#ff4444',
          borderColor: '#ff4444',
          color: '#fff',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onViewUrgent}
      >
        View Urgent
      </motion.button>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// QUICK ACTIONS SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════

interface QuickActionsSidebarProps {
  onBulkDefer: () => void;
  onBulkArchive: () => void;
  onRefresh: () => void;
  selectedCount: number;
}

const QuickActionsSidebar: React.FC<QuickActionsSidebarProps> = ({
  onBulkDefer,
  onBulkArchive,
  onRefresh,
  selectedCount,
}) => {
  return (
    <div style={styles.sidebarCard}>
      <div style={styles.sidebarTitle}>Quick Actions</div>
      
      <motion.button
        style={styles.quickAction}
        whileHover={{ backgroundColor: '#2a2a3a' }}
        onClick={onRefresh}
      >
        🔄 Refresh List
      </motion.button>
      
      {selectedCount > 0 && (
        <>
          <motion.button
            style={styles.quickAction}
            whileHover={{ backgroundColor: '#2a3a2a' }}
            onClick={onBulkDefer}
          >
            ⏰ Defer Selected ({selectedCount})
          </motion.button>
          
          <motion.button
            style={styles.quickAction}
            whileHover={{ backgroundColor: '#3a2a2a' }}
            onClick={onBulkArchive}
          >
            📦 Archive Selected ({selectedCount})
          </motion.button>
        </>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TIPS SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════

const TipsSidebar: React.FC = () => {
  const tips = [
    { icon: '🟢', text: 'Green items are fresh (<24h)' },
    { icon: '🟡', text: 'Yellow items need attention (1-3 days)' },
    { icon: '🔴', text: 'Red items are urgent (3-7 days)' },
    { icon: '💥', text: 'Blinking items are critical (7-10 days)' },
    { icon: '📦', text: 'Items auto-archive after 10 days' },
  ];
  
  return (
    <div style={styles.sidebarCard}>
      <div style={styles.sidebarTitle}>Aging Guide</div>
      {tips.map((tip, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            marginBottom: '8px',
            color: '#999',
          }}
        >
          <span>{tip.icon}</span>
          <span>{tip.text}</span>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

interface DecisionPointsDashboardProps {
  userId?: string;
  threadId?: string;
}

export const DecisionPointsDashboard: React.FC<DecisionPointsDashboardProps> = ({
  userId,
  threadId,
}) => {
  // State
  const [selectedAging, setSelectedAging] = useState<AgingLevel | null>(null);
  const [selectedType, setSelectedType] = useState<DecisionPointType | null>(null);
  const [selectedPoints, setSelectedPoints] = useState<Set<string>>(new Set());
  
  // Data fetching
  const { data: summary, isLoading: summaryLoading } = useDecisionPointsSummary(userId);
  const { data: urgentData } = useUrgentDecisionPoints(userId);
  const { 
    data: pointsData, 
    isLoading: pointsLoading,
    refetch,
  } = useDecisionPoints({
    userId,
    threadId,
    agingLevel: selectedAging || undefined,
    pointType: selectedType || undefined,
  });
  
  const actions = useDecisionPointActions();
  
  // Computed
  const isLoading = summaryLoading || pointsLoading;
  const points = pointsData?.points || [];
  const urgentCount = urgentData?.count || 0;
  const hasCritical = urgentData?.has_critical || false;
  
  // Handlers
  const handleAgingFilter = (level: AgingLevel) => {
    setSelectedAging(prev => prev === level ? null : level);
  };
  
  const handleTypeFilter = (type: DecisionPointType) => {
    setSelectedType(prev => prev === type ? null : type);
  };
  
  const handleViewUrgent = () => {
    setSelectedAging(null);
    // Show only RED and BLINK
    // Could implement multi-select filter
  };
  
  const handleBulkDefer = async () => {
    for (const pointId of selectedPoints) {
      await actions.deferAsync({ pointId, userId: userId || 'system' });
    }
    setSelectedPoints(new Set());
    refetch();
  };
  
  const handleBulkArchive = async () => {
    for (const pointId of selectedPoints) {
      await actions.archiveAsync({ 
        pointId, 
        userId: userId || 'system',
        reason: 'bulk_archive',
      });
    }
    setSelectedPoints(new Set());
    refetch();
  };
  
  const handlePointSelect = (pointId: string) => {
    setSelectedPoints(prev => {
      const next = new Set(prev);
      if (next.has(pointId)) {
        next.delete(pointId);
      } else {
        next.add(pointId);
      }
      return next;
    });
  };
  
  // Render
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>
          🎯 Decision Points
        </h1>
        <p style={styles.subtitle}>
          Tracked decisions awaiting your input • Nova suggests, you decide
        </p>
      </header>
      
      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        {(['green', 'yellow', 'red', 'blink', 'archive'] as AgingLevel[]).map(level => (
          <SummaryCard
            key={level}
            level={level}
            count={summary?.counts?.[level] || 0}
            onClick={() => handleAgingFilter(level)}
            isSelected={selectedAging === level}
          />
        ))}
      </div>
      
      {/* Urgent Banner */}
      <UrgentBanner
        count={urgentCount}
        hasCritical={hasCritical}
        onViewUrgent={handleViewUrgent}
      />
      
      {/* Type Filters */}
      <div style={styles.filters}>
        <span style={{ color: '#666', marginRight: '8px' }}>Filter by type:</span>
        {Object.entries(DECISION_TYPE_CONFIG).map(([type, config]) => (
          <motion.button
            key={type}
            style={{
              ...styles.filterButton,
              ...(selectedType === type ? styles.filterButtonActive : {}),
            }}
            whileHover={{ borderColor: '#4a8aff' }}
            onClick={() => handleTypeFilter(type as DecisionPointType)}
          >
            {config.icon} {config.label}
          </motion.button>
        ))}
        {(selectedAging || selectedType) && (
          <motion.button
            style={{
              ...styles.filterButton,
              borderColor: '#666',
            }}
            whileHover={{ borderColor: '#888' }}
            onClick={() => {
              setSelectedAging(null);
              setSelectedType(null);
            }}
          >
            ✕ Clear Filters
          </motion.button>
        )}
      </div>
      
      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* List Section */}
        <div style={styles.listSection}>
          {isLoading ? (
            <div style={styles.loadingState}>
              <div style={styles.spinner} />
            </div>
          ) : points.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>✨</div>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>
                No decision points
              </div>
              <div style={{ fontSize: '14px' }}>
                {selectedAging || selectedType
                  ? 'No items match your filters'
                  : 'All caught up! No pending decisions.'}
              </div>
            </div>
          ) : (
            <DecisionPointList
              points={points}
              onValidate={(id) => actions.validate({ pointId: id, userId: userId || 'system' })}
              onRedirect={(id, alt) => actions.redirect({ 
                pointId: id, 
                alternative: alt, 
                userId: userId || 'system',
              })}
              onDefer={(id) => actions.defer({ pointId: id, userId: userId || 'system' })}
              onArchive={(id) => actions.archive({ 
                pointId: id, 
                userId: userId || 'system',
              })}
              onComment={(id, comment) => actions.comment({
                pointId: id,
                comment,
                userId: userId || 'system',
              })}
            />
          )}
        </div>
        
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <QuickActionsSidebar
            onBulkDefer={handleBulkDefer}
            onBulkArchive={handleBulkArchive}
            onRefresh={() => refetch()}
            selectedCount={selectedPoints.size}
          />
          <TipsSidebar />
        </div>
      </div>
      
      {/* Global Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DecisionPointsDashboard;
