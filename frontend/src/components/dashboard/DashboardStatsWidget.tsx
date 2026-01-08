/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — DASHBOARD STATS WIDGET
 * ═══════════════════════════════════════════════════════════════════════════
 * Widget de statistiques pour le Dashboard V72
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface DashboardStats {
  totalThreads: number;
  activeThreads: number;
  completedThreads: number;
  totalAgents: number;
  hiredAgents: number;
  pendingDecisions: number;
  tokensUsed: number;
  tokensLimit: number;
  checkpointsPending: number;
}

export interface DashboardStatsWidgetProps {
  stats: DashboardStats;
  onStatClick?: (statKey: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 12,
  } as React.CSSProperties,
  
  card: {
    background: '#111113',
    border: '1px solid #1f1f23',
    borderRadius: 10,
    padding: 16,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
  
  cardHover: {
    background: '#1a1a1f',
    borderColor: '#D8B26A40',
  } as React.CSSProperties,
  
  icon: {
    fontSize: 20,
    marginBottom: 8,
  } as React.CSSProperties,
  
  value: {
    fontSize: 28,
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1,
    marginBottom: 4,
  } as React.CSSProperties,
  
  label: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  
  progress: {
    marginTop: 8,
    height: 4,
    background: '#1f1f23',
    borderRadius: 2,
    overflow: 'hidden',
  } as React.CSSProperties,
  
  progressBar: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.3s ease',
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════════════════════════════════

interface StatCardProps {
  icon: string;
  value: number | string;
  label: string;
  color?: string;
  progress?: number;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  value, 
  label, 
  color = '#D8B26A',
  progress,
  onClick 
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {}),
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.icon}>{icon}</div>
      <div style={{ ...styles.value, color }}>{value}</div>
      <div style={styles.label}>{label}</div>
      
      {progress !== undefined && (
        <div style={styles.progress}>
          <div 
            style={{ 
              ...styles.progressBar, 
              width: `${Math.min(progress, 100)}%`,
              background: color,
            }} 
          />
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD STATS WIDGET
// ═══════════════════════════════════════════════════════════════════════════

export const DashboardStatsWidget: React.FC<DashboardStatsWidgetProps> = ({
  stats,
  onStatClick,
}) => {
  const tokenProgress = (stats.tokensUsed / stats.tokensLimit) * 100;
  
  const statCards = [
    { 
      key: 'threads',
      icon: '🧵', 
      value: stats.activeThreads, 
      label: 'Threads Actifs',
      color: '#3EB4A2',
    },
    { 
      key: 'agents',
      icon: '🤖', 
      value: `${stats.hiredAgents}/${stats.totalAgents}`, 
      label: 'Agents Actifs',
      color: '#D8B26A',
    },
    { 
      key: 'decisions',
      icon: '⚖️', 
      value: stats.pendingDecisions, 
      label: 'Décisions',
      color: stats.pendingDecisions > 5 ? '#F59E0B' : '#3F7249',
    },
    { 
      key: 'checkpoints',
      icon: '🚦', 
      value: stats.checkpointsPending, 
      label: 'Checkpoints',
      color: stats.checkpointsPending > 0 ? '#EF4444' : '#3F7249',
    },
    { 
      key: 'tokens',
      icon: '💎', 
      value: `${Math.round(stats.tokensUsed / 1000)}K`, 
      label: 'Tokens Utilisés',
      color: tokenProgress > 80 ? '#EF4444' : '#D8B26A',
      progress: tokenProgress,
    },
    { 
      key: 'completed',
      icon: '✅', 
      value: stats.completedThreads, 
      label: 'Complétés',
      color: '#3F7249',
    },
  ];
  
  return (
    <div style={styles.container}>
      {statCards.map((stat) => (
        <StatCard
          key={stat.key}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
          color={stat.color}
          progress={stat.progress}
          onClick={() => onStatClick?.(stat.key)}
        />
      ))}
    </div>
  );
};

export default DashboardStatsWidget;
