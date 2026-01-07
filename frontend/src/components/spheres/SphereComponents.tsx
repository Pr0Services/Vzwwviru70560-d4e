// CHE·NU™ Sphere Components — 8 Spheres Navigation

import React from 'react';
import type { SphereCode } from '../../types';
import { SPHERE_ICONS, SPHERE_COLORS, CHENU_COLORS } from '../../types';

// ============================================================
// SPHERE DATA
// ============================================================

interface SphereInfo {
  code: SphereCode;
  name_en: string;
  name_fr: string;
  description: string;
  icon: string;
  color: string;
}

export const SPHERES: SphereInfo[] = [
  { code: 'personal', name_en: 'Personal', name_fr: 'Personnel', description: 'Your private life', icon: '🏠', color: SPHERE_COLORS.personal },
  { code: 'business', name_en: 'Business', name_fr: 'Entreprise', description: 'Professional work', icon: '💼', color: SPHERE_COLORS.business },
  { code: 'government', name_en: 'Government', name_fr: 'Gouvernement', description: 'Institutions & compliance', icon: '🏛️', color: SPHERE_COLORS.government },
  { code: 'design_studio', name_en: 'Studio', name_fr: 'Studio', description: 'Creative projects', icon: '🎨', color: SPHERE_COLORS.studio },
  { code: 'community', name_en: 'Community', name_fr: 'Communauté', description: 'Groups & associations', icon: '👥', color: SPHERE_COLORS.community },
  { code: 'social', name_en: 'Social', name_fr: 'Social', description: 'Media & communication', icon: '📱', color: SPHERE_COLORS.social },
  { code: 'entertainment', name_en: 'Entertainment', name_fr: 'Divertissement', description: 'Leisure & culture', icon: '🎬', color: SPHERE_COLORS.entertainment },
  { code: 'my_team', name_en: 'My Team', name_fr: 'Mon Équipe', description: 'Your AI team', icon: '🤝', color: SPHERE_COLORS.team },
];

// ============================================================
// STYLES
// ============================================================

const styles = {
  verticalNav: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    padding: '8px',
  },
  
  sphereButton: (isActive: boolean, color: string) => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: isActive ? color : 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    transition: 'all 0.2s ease',
    opacity: isActive ? 1 : 0.6,
    transform: isActive ? 'scale(1.1)' : 'scale(1)',
    position: 'relative' as const,
  }),
  
  tooltip: {
    position: 'absolute' as const,
    left: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    marginLeft: '12px',
    padding: '8px 12px',
    backgroundColor: '#0a0a0b',
    borderRadius: '8px',
    whiteSpace: 'nowrap' as const,
    zIndex: 100,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  
  gridNav: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  
  gridItem: (isActive: boolean, color: string) => ({
    padding: '16px',
    borderRadius: '12px',
    border: `1px solid ${isActive ? color : CHENU_COLORS.ancientStone}33`,
    backgroundColor: isActive ? color + '15' : '#111113',
    cursor: 'pointer',
    textAlign: 'center' as const,
    transition: 'all 0.2s ease',
  }),
  
  horizontalNav: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto' as const,
    padding: '8px',
    scrollbarWidth: 'none' as const,
  },
  
  horizontalItem: (isActive: boolean, color: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: isActive ? color : '#111113',
    color: isActive ? '#000' : CHENU_COLORS.softSand,
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: isActive ? 600 : 400,
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.2s ease',
  }),
};

// ============================================================
// VERTICAL SPHERE NAV (Sidebar)
// ============================================================

interface VerticalSphereNavProps {
  currentSphere: SphereCode;
  onSelect: (sphere: SphereCode) => void;
  showTooltips?: boolean;
}

export const VerticalSphereNav: React.FC<VerticalSphereNavProps> = ({ 
  currentSphere, 
  onSelect, 
  showTooltips = true 
}) => {
  const [hoveredSphere, setHoveredSphere] = React.useState<SphereCode | null>(null);

  return (
    <div style={styles.verticalNav}>
      {SPHERES.map((sphere) => (
        <div
          key={sphere.code}
          style={{ position: 'relative' }}
          onMouseEnter={() => setHoveredSphere(sphere.code)}
          onMouseLeave={() => setHoveredSphere(null)}
        >
          <button
            style={styles.sphereButton(currentSphere === sphere.code, sphere.color)}
            onClick={() => onSelect(sphere.code)}
            title={sphere.name_en}
          >
            {sphere.icon}
          </button>
          
          {showTooltips && hoveredSphere === sphere.code && (
            <div style={styles.tooltip}>
              <p style={{ color: sphere.color, fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>
                {sphere.name_en}
              </p>
              <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '11px' }}>
                {sphere.description}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ============================================================
// GRID SPHERE NAV (Dashboard)
// ============================================================

interface GridSphereNavProps {
  currentSphere: SphereCode;
  onSelect: (sphere: SphereCode) => void;
  locale?: 'en' | 'fr';
}

export const GridSphereNav: React.FC<GridSphereNavProps> = ({ 
  currentSphere, 
  onSelect,
  locale = 'en'
}) => (
  <div style={styles.gridNav}>
    {SPHERES.map((sphere) => {
      const isActive = currentSphere === sphere.code;
      return (
        <div
          key={sphere.code}
          style={styles.gridItem(isActive, sphere.color)}
          onClick={() => onSelect(sphere.code)}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>{sphere.icon}</div>
          <p style={{ 
            color: isActive ? sphere.color : CHENU_COLORS.softSand, 
            fontWeight: 600, 
            fontSize: '14px',
            marginBottom: '4px'
          }}>
            {locale === 'fr' ? sphere.name_fr : sphere.name_en}
          </p>
          <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '11px' }}>
            {sphere.description}
          </p>
        </div>
      );
    })}
  </div>
);

// ============================================================
// HORIZONTAL SPHERE NAV (Mobile/Compact)
// ============================================================

interface HorizontalSphereNavProps {
  currentSphere: SphereCode;
  onSelect: (sphere: SphereCode) => void;
  compact?: boolean;
}

export const HorizontalSphereNav: React.FC<HorizontalSphereNavProps> = ({ 
  currentSphere, 
  onSelect,
  compact = false
}) => (
  <div style={styles.horizontalNav}>
    {SPHERES.map((sphere) => (
      <button
        key={sphere.code}
        style={styles.horizontalItem(currentSphere === sphere.code, sphere.color)}
        onClick={() => onSelect(sphere.code)}
      >
        <span>{sphere.icon}</span>
        {!compact && <span>{sphere.name_en}</span>}
      </button>
    ))}
  </div>
);

// ============================================================
// SPHERE BADGE
// ============================================================

interface SphereBadgeProps {
  sphere: SphereCode;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const SphereBadge: React.FC<SphereBadgeProps> = ({ sphere, size = 'md', showLabel = true }) => {
  const info = SPHERES.find(s => s.code === sphere);
  if (!info) return null;

  const sizes = {
    sm: { icon: '14px', text: '11px', padding: '4px 8px' },
    md: { icon: '16px', text: '12px', padding: '6px 12px' },
    lg: { icon: '20px', text: '14px', padding: '8px 16px' },
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: sizes[size].padding,
      backgroundColor: info.color + '22',
      color: info.color,
      borderRadius: '8px',
      fontSize: sizes[size].text,
      fontWeight: 500,
    }}>
      <span style={{ fontSize: sizes[size].icon }}>{info.icon}</span>
      {showLabel && <span>{info.name_en}</span>}
    </span>
  );
};

// ============================================================
// SPHERE HEADER
// ============================================================

interface SphereHeaderProps {
  sphere: SphereCode;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const SphereHeader: React.FC<SphereHeaderProps> = ({ sphere, subtitle, actions }) => {
  const info = SPHERES.find(s => s.code === sphere);
  if (!info) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: info.color + '22',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
        }}>
          {info.icon}
        </div>
        <div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 700, 
            color: CHENU_COLORS.softSand,
            marginBottom: '4px'
          }}>
            {info.name_en} Bureau
          </h1>
          <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '14px' }}>
            {subtitle || info.description}
          </p>
        </div>
      </div>
      {actions}
    </div>
  );
};

// ============================================================
// SPHERE CARD
// ============================================================

interface SphereCardProps {
  sphere: SphereCode;
  stats?: { threads: number; tasks: number; tokens: number };
  onClick?: () => void;
}

export const SphereCard: React.FC<SphereCardProps> = ({ sphere, stats, onClick }) => {
  const info = SPHERES.find(s => s.code === sphere);
  if (!info) return null;

  return (
    <div
      onClick={onClick}
      style={{
        padding: '20px',
        borderRadius: '16px',
        backgroundColor: '#111113',
        border: `1px solid ${info.color}33`,
        cursor: onClick ? 'pointer' : undefined,
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={{ fontSize: '32px' }}>{info.icon}</span>
        <div>
          <h3 style={{ color: info.color, fontWeight: 600, fontSize: '16px' }}>{info.name_en}</h3>
          <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '12px' }}>{info.description}</p>
        </div>
      </div>
      
      {stats && (
        <div style={{ display: 'flex', gap: '16px' }}>
          <div>
            <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '11px' }}>Threads</p>
            <p style={{ color: CHENU_COLORS.softSand, fontWeight: 600 }}>{stats.threads}</p>
          </div>
          <div>
            <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '11px' }}>Tasks</p>
            <p style={{ color: CHENU_COLORS.softSand, fontWeight: 600 }}>{stats.tasks}</p>
          </div>
          <div>
            <p style={{ color: CHENU_COLORS.ancientStone, fontSize: '11px' }}>Tokens</p>
            <p style={{ color: info.color, fontWeight: 600 }}>{stats.tokens.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default {
  SPHERES,
  VerticalSphereNav,
  GridSphereNav,
  HorizontalSphereNav,
  SphereBadge,
  SphereHeader,
  SphereCard,
};
