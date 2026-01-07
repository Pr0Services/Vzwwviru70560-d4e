/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — TIMELINE MODE                                         ║
 * ║              Workspace Mode L3: 📅 Gantt/Roadmap                             ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  CAPABILITIES:                                                               ║
 * ║  - Gantt-style project timelines                                             ║
 * ║  - Roadmap visualization                                                     ║
 * ║  - Milestone markers and dependencies                                        ║
 * ║  - Resource allocation views                                                 ║
 * ║  - Multiple timeline scales (day, week, month, year)                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CHENU_COLORS } from '../../types';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type TimeScale = 'day' | 'week' | 'month' | 'quarter' | 'year';
type ItemStatus = 'pending' | 'in_progress' | 'completed' | 'delayed' | 'blocked';

interface TimelineItem {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  status: ItemStatus;
  progress: number;
  color: string;
  assignee?: string;
  dependencies?: string[];
  isMilestone?: boolean;
}

interface TimelineModeProps {
  timelineId?: string;
  sphereId: string;
  domainId?: string;
  items?: TimelineItem[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const STATUS_COLORS: Record<ItemStatus, string> = {
  pending: CHENU_COLORS.ancientStone,
  in_progress: CHENU_COLORS.sacredGold,
  completed: CHENU_COLORS.jungleEmerald,
  delayed: '#ef4444',
  blocked: '#8b5cf6',
};

const MOCK_ITEMS: TimelineItem[] = [
  { id: 't1', title: 'Phase 1: Architecture', startDate: new Date(2026, 0, 1), endDate: new Date(2026, 0, 15), status: 'completed', progress: 100, color: CHENU_COLORS.jungleEmerald },
  { id: 't2', title: 'Phase 2: Core Development', startDate: new Date(2026, 0, 10), endDate: new Date(2026, 1, 15), status: 'in_progress', progress: 65, color: CHENU_COLORS.sacredGold, assignee: 'Team A' },
  { id: 't3', title: 'Phase 3: UI/UX', startDate: new Date(2026, 0, 20), endDate: new Date(2026, 2, 1), status: 'in_progress', progress: 40, color: CHENU_COLORS.cenoteTurquoise, dependencies: ['t1'] },
  { id: 't4', title: 'Phase 4: Testing', startDate: new Date(2026, 1, 15), endDate: new Date(2026, 2, 15), status: 'pending', progress: 0, color: '#8b5cf6', dependencies: ['t2', 't3'] },
  { id: 'm1', title: 'Alpha Release', startDate: new Date(2026, 1, 28), endDate: new Date(2026, 1, 28), status: 'pending', progress: 0, color: CHENU_COLORS.sacredGold, isMilestone: true },
  { id: 't5', title: 'Phase 5: Documentation', startDate: new Date(2026, 2, 1), endDate: new Date(2026, 2, 20), status: 'pending', progress: 0, color: CHENU_COLORS.earthEmber },
  { id: 'm2', title: 'Beta Release', startDate: new Date(2026, 2, 31), endDate: new Date(2026, 2, 31), status: 'pending', progress: 0, color: CHENU_COLORS.jungleEmerald, isMilestone: true },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    backgroundColor: CHENU_COLORS.uiSlate,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    backgroundColor: '#111113',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  toolbarTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  scaleSelector: {
    display: 'flex',
    gap: '4px',
    backgroundColor: CHENU_COLORS.ancientStone + '22',
    padding: '3px',
    borderRadius: '8px',
  },
  scaleBtn: (isActive: boolean) => ({
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: isActive ? CHENU_COLORS.softSand : 'transparent',
    color: isActive ? '#000' : CHENU_COLORS.ancientStone,
    fontSize: '12px',
    fontWeight: isActive ? 600 : 400,
    cursor: 'pointer',
  }),
  mainArea: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#111113',
    borderRight: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  sidebarHeader: {
    padding: '14px 16px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  itemList: {
    flex: 1,
    overflowY: 'auto' as const,
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}11`,
    cursor: 'pointer',
  },
  itemIndicator: (color: string, isMilestone: boolean) => ({
    width: isMilestone ? '12px' : '4px',
    height: isMilestone ? '12px' : '36px',
    borderRadius: isMilestone ? '50%' : '2px',
    backgroundColor: color,
    transform: isMilestone ? 'rotate(45deg)' : 'none',
  }),
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemTitle: {
    fontSize: '13px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemDates: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '2px',
  },
  timelineArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  timeHeader: {
    display: 'flex',
    height: '50px',
    backgroundColor: '#0d0d0f',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  timeColumn: {
    flex: 1,
    minWidth: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: `1px solid ${CHENU_COLORS.ancientStone}11`,
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  timeColumnCurrent: {
    backgroundColor: CHENU_COLORS.sacredGold + '11',
    color: CHENU_COLORS.sacredGold,
  },
  ganttArea: {
    flex: 1,
    overflow: 'auto',
    position: 'relative' as const,
  },
  ganttRow: {
    display: 'flex',
    height: '50px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}11`,
    position: 'relative' as const,
  },
  ganttCell: {
    flex: 1,
    minWidth: '100px',
    borderRight: `1px solid ${CHENU_COLORS.ancientStone}11`,
  },
  ganttBar: (left: number, width: number, color: string) => ({
    position: 'absolute' as const,
    left: `${left}%`,
    width: `${width}%`,
    top: '10px',
    height: '30px',
    backgroundColor: color,
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '10px',
    fontSize: '11px',
    color: '#fff',
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    cursor: 'pointer',
    boxShadow: `0 2px 8px ${color}44`,
  }),
  milestoneMarker: (left: number, color: string) => ({
    position: 'absolute' as const,
    left: `${left}%`,
    top: '12px',
    width: '20px',
    height: '20px',
    backgroundColor: color,
    transform: 'translateX(-50%) rotate(45deg)',
    cursor: 'pointer',
    boxShadow: `0 2px 8px ${color}44`,
  }),
  progressOverlay: (progress: number) => ({
    position: 'absolute' as const,
    left: 0,
    top: 0,
    height: '100%',
    width: `${progress}%`,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '6px 0 0 6px',
  }),
  todayLine: {
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: CHENU_COLORS.sacredGold,
    zIndex: 10,
  },
  statsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    backgroundColor: '#0a0a0b',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const TimelineMode: React.FC<TimelineModeProps> = ({
  timelineId,
  sphereId,
  domainId,
  items = MOCK_ITEMS,
}) => {
  const [scale, setScale] = useState<TimeScale>('week');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Calculate timeline range
  const { startDate, endDate, columns } = useMemo(() => {
    const allDates = items.flatMap(i => [i.startDate, i.endDate]);
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    // Add padding
    minDate.setDate(minDate.getDate() - 7);
    maxDate.setDate(maxDate.getDate() + 14);
    
    // Generate columns based on scale
    const cols: { date: Date; label: string; isCurrent: boolean }[] = [];
    const current = new Date(minDate);
    const today = new Date();
    
    while (current <= maxDate) {
      const isCurrent = scale === 'day' 
        ? current.toDateString() === today.toDateString()
        : scale === 'week'
          ? Math.abs(current.getTime() - today.getTime()) < 7 * 24 * 60 * 60 * 1000
          : current.getMonth() === today.getMonth();
          
      cols.push({
        date: new Date(current),
        label: formatColumnLabel(current, scale),
        isCurrent,
      });
      
      // Increment based on scale
      if (scale === 'day') current.setDate(current.getDate() + 1);
      else if (scale === 'week') current.setDate(current.getDate() + 7);
      else if (scale === 'month') current.setMonth(current.getMonth() + 1);
      else current.setMonth(current.getMonth() + 3);
    }
    
    return { startDate: minDate, endDate: maxDate, columns: cols };
  }, [items, scale]);

  function formatColumnLabel(date: Date, scale: TimeScale): string {
    if (scale === 'day') return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    if (scale === 'week') return `S${getWeekNumber(date)}`;
    if (scale === 'month') return date.toLocaleDateString('fr-FR', { month: 'short' });
    return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
  }

  function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  // Calculate bar position
  const getBarPosition = (item: TimelineItem) => {
    const totalRange = endDate.getTime() - startDate.getTime();
    const itemStart = item.startDate.getTime() - startDate.getTime();
    const itemDuration = item.endDate.getTime() - item.startDate.getTime();
    
    return {
      left: (itemStart / totalRange) * 100,
      width: Math.max((itemDuration / totalRange) * 100, 1),
    };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  // Stats
  const completedCount = items.filter(i => i.status === 'completed').length;
  const milestonesCount = items.filter(i => i.isMilestone).length;

  return (
    <div style={styles.container}>
      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarTitle}>
          <span>📅</span>
          <span>Timeline Mode</span>
        </div>
        
        <div style={styles.scaleSelector}>
          {(['day', 'week', 'month', 'quarter'] as TimeScale[]).map(s => (
            <button
              key={s}
              style={styles.scaleBtn(scale === s)}
              onClick={() => setScale(s)}
            >
              {s === 'day' && 'Jour'}
              {s === 'week' && 'Semaine'}
              {s === 'month' && 'Mois'}
              {s === 'quarter' && 'Trimestre'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div style={styles.mainArea}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            Éléments ({items.length})
          </div>
          <div style={styles.itemList}>
            {items.map(item => (
              <motion.div
                key={item.id}
                style={styles.itemRow}
                whileHover={{ backgroundColor: CHENU_COLORS.ancientStone + '11' }}
                onClick={() => setSelectedItem(item.id)}
              >
                <div style={styles.itemIndicator(item.color, item.isMilestone || false)} />
                <div style={styles.itemInfo}>
                  <div style={styles.itemTitle}>{item.title}</div>
                  <div style={styles.itemDates}>
                    {item.isMilestone 
                      ? formatDate(item.startDate)
                      : `${formatDate(item.startDate)} → ${formatDate(item.endDate)}`
                    }
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={styles.timelineArea}>
          {/* Time Header */}
          <div style={styles.timeHeader}>
            {columns.map((col, i) => (
              <div 
                key={i} 
                style={{
                  ...styles.timeColumn,
                  ...(col.isCurrent ? styles.timeColumnCurrent : {}),
                }}
              >
                {col.label}
              </div>
            ))}
          </div>

          {/* Gantt Area */}
          <div style={styles.ganttArea}>
            {items.map(item => {
              const pos = getBarPosition(item);
              
              return (
                <div key={item.id} style={styles.ganttRow}>
                  {columns.map((_, i) => (
                    <div key={i} style={styles.ganttCell} />
                  ))}
                  
                  {item.isMilestone ? (
                    <motion.div
                      style={styles.milestoneMarker(pos.left, item.color)}
                      whileHover={{ scale: 1.2 }}
                      title={item.title}
                    />
                  ) : (
                    <motion.div
                      style={styles.ganttBar(pos.left, pos.width, item.color)}
                      whileHover={{ scale: 1.02 }}
                      title={`${item.title} (${item.progress}%)`}
                    >
                      {pos.width > 5 && item.title}
                      <div style={styles.progressOverlay(item.progress)} />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span>📋 {items.length} éléments</span>
          <span>✅ {completedCount} terminés</span>
          <span>🎯 {milestonesCount} jalons</span>
        </div>
        <span>📍 {sphereId}</span>
      </div>
    </div>
  );
};

export default TimelineMode;
