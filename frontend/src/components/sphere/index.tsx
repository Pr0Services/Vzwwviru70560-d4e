/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — SPHERE GRID COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════
 * Grille des 9 sphères CHE·NU
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Sphere {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  agentCount: number;
  threadCount: number;
}

export interface SphereGridProps {
  spheres?: Sphere[];
  onSphereClick?: (sphere: Sphere) => void;
  compact?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT SPHERES (9 sphères CHE·NU)
// ═══════════════════════════════════════════════════════════════════════════

export const DEFAULT_SPHERES: Sphere[] = [
  { id: 'personal', name: 'Personal', icon: '🏠', color: '#3EB4A2', description: 'Vie personnelle', agentCount: 28, threadCount: 12 },
  { id: 'business', name: 'Business', icon: '💼', color: '#D8B26A', description: 'Entreprise', agentCount: 43, threadCount: 24 },
  { id: 'government', name: 'Government', icon: '🏛️', color: '#8D8371', description: 'Institutions', agentCount: 18, threadCount: 5 },
  { id: 'studio', name: 'Creative Studio', icon: '🎨', color: '#E879F9', description: 'Création', agentCount: 42, threadCount: 18 },
  { id: 'community', name: 'Community', icon: '👥', color: '#3F7249', description: 'Communauté', agentCount: 12, threadCount: 8 },
  { id: 'social', name: 'Social & Media', icon: '📱', color: '#60A5FA', description: 'Réseaux sociaux', agentCount: 15, threadCount: 6 },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#F472B6', description: 'Divertissement', agentCount: 8, threadCount: 3 },
  { id: 'team', name: 'My Team', icon: '🤝', color: '#FB923C', description: 'Équipe', agentCount: 35, threadCount: 15 },
  { id: 'scholar', name: 'Scholar', icon: '📚', color: '#A78BFA', description: 'Recherche', agentCount: 25, threadCount: 7 },
];

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
    padding: 4,
  } as React.CSSProperties,
  
  card: {
    background: '#111113',
    border: '1px solid #1f1f23',
    borderRadius: 12,
    padding: 20,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  } as React.CSSProperties,
  
  cardHover: {
    background: '#1a1a1f',
    borderColor: '#2a2a30',
    transform: 'translateY(-2px)',
  } as React.CSSProperties,
  
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  } as React.CSSProperties,
  
  icon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
  } as React.CSSProperties,
  
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    margin: 0,
  } as React.CSSProperties,
  
  description: {
    fontSize: 13,
    color: '#888',
    margin: 0,
  } as React.CSSProperties,
  
  stats: {
    display: 'flex',
    gap: 16,
    marginTop: 8,
    paddingTop: 12,
    borderTop: '1px solid #1f1f23',
  } as React.CSSProperties,
  
  stat: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
  } as React.CSSProperties,
  
  statValue: {
    fontSize: 18,
    fontWeight: 600,
    color: '#D8B26A',
  } as React.CSSProperties,
  
  statLabel: {
    fontSize: 11,
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════════════
// SPHERE CARD
// ═══════════════════════════════════════════════════════════════════════════

interface SphereCardProps {
  sphere: Sphere;
  onClick?: (sphere: Sphere) => void;
  compact?: boolean;
}

const SphereCard: React.FC<SphereCardProps> = ({ sphere, onClick, compact }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {}),
      }}
      onClick={() => onClick?.(sphere)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.header}>
        <div style={{ ...styles.icon, background: `${sphere.color}20` }}>
          {sphere.icon}
        </div>
        <div>
          <h3 style={styles.title}>{sphere.name}</h3>
          <p style={styles.description}>{sphere.description}</p>
        </div>
      </div>
      
      {!compact && (
        <div style={styles.stats}>
          <div style={styles.stat}>
            <span style={styles.statValue}>{sphere.agentCount}</span>
            <span style={styles.statLabel}>Agents</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statValue}>{sphere.threadCount}</span>
            <span style={styles.statLabel}>Threads</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SPHERE GRID
// ═══════════════════════════════════════════════════════════════════════════

export const SphereGrid: React.FC<SphereGridProps> = ({
  spheres = DEFAULT_SPHERES,
  onSphereClick,
  compact = false,
}) => {
  return (
    <div style={styles.grid}>
      {spheres.map((sphere) => (
        <SphereCard
          key={sphere.id}
          sphere={sphere}
          onClick={onSphereClick}
          compact={compact}
        />
      ))}
    </div>
  );
};

export default SphereGrid;
