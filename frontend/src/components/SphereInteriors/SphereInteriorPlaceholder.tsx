/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — SPHERE INTERIOR PLACEHOLDERS
   Lightweight SVG-based placeholders for sphere room backgrounds
   ═══════════════════════════════════════════════════════════════════════════════ */

import React from 'react';

// ════════════════════════════════════════════════════════════════════════════════
// CHE·NU OFFICIAL PALETTE
// ════════════════════════════════════════════════════════════════════════════════

export const CHENU_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
} as const;

// ════════════════════════════════════════════════════════════════════════════════
// SPHERE CONFIGURATION
// ════════════════════════════════════════════════════════════════════════════════

export interface SphereInteriorConfig {
  id: string;
  name: string;
  nameFr: string;
  icon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  hasRealImage: boolean;
  imagePath?: string;
  description: string;
}

export const SPHERE_INTERIORS: Record<string, SphereInteriorConfig> = {
  personal: {
    id: 'personal',
    name: 'Personal',
    nameFr: 'Personnel',
    icon: '🏠',
    primaryColor: CHENU_COLORS.sacredGold,
    secondaryColor: CHENU_COLORS.earthEmber,
    accentColor: CHENU_COLORS.cenoteTurquoise,
    hasRealImage: false,
    description: 'Le Sanctuaire - Espace personnel et bien-être',
  },
  business: {
    id: 'business',
    name: 'Business',
    nameFr: 'Affaires',
    icon: '💼',
    primaryColor: CHENU_COLORS.ancientStone,
    secondaryColor: CHENU_COLORS.sacredGold,
    accentColor: CHENU_COLORS.cenoteTurquoise,
    hasRealImage: true,
    imagePath: '/assets/spheres/business-interior.png',
    description: 'Le Quartier Général - Centre de commandement professionnel',
  },
  government: {
    id: 'government',
    name: 'Government',
    nameFr: 'Gouvernement',
    icon: '🏛️',
    primaryColor: CHENU_COLORS.shadowMoss,
    secondaryColor: CHENU_COLORS.sacredGold,
    accentColor: CHENU_COLORS.cenoteTurquoise,
    hasRealImage: true,
    imagePath: '/assets/spheres/government-interior.png',
    description: "L'Institution - Salle des décisions officielles",
  },
  creative: {
    id: 'creative',
    name: 'Creative Studio',
    nameFr: 'Studio de création',
    icon: '🎨',
    primaryColor: CHENU_COLORS.earthEmber,
    secondaryColor: CHENU_COLORS.sacredGold,
    accentColor: CHENU_COLORS.jungleEmerald,
    hasRealImage: false,
    description: "L'Atelier - Espace de création artistique",
  },
  community: {
    id: 'community',
    name: 'Community',
    nameFr: 'Communauté',
    icon: '👥',
    primaryColor: CHENU_COLORS.jungleEmerald,
    secondaryColor: CHENU_COLORS.sacredGold,
    accentColor: CHENU_COLORS.cenoteTurquoise,
    hasRealImage: false,
    description: 'Le Forum - Lieu de rassemblement communautaire',
  },
  social: {
    id: 'social',
    name: 'Social & Media',
    nameFr: 'Social & Médias',
    icon: '📱',
    primaryColor: CHENU_COLORS.cenoteTurquoise,
    secondaryColor: CHENU_COLORS.sacredGold,
    accentColor: CHENU_COLORS.jungleEmerald,
    hasRealImage: true,
    imagePath: '/assets/spheres/social-interior.png',
    description: 'Le Hub - Centre de connexion sociale',
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment',
    nameFr: 'Divertissement',
    icon: '🎬',
    primaryColor: CHENU_COLORS.softSand,
    secondaryColor: CHENU_COLORS.sacredGold,
    accentColor: CHENU_COLORS.shadowMoss,
    hasRealImage: false,
    description: 'Le Cinéma - Sanctuaire du divertissement',
  },
  team: {
    id: 'my_team',
    name: 'My Team',
    nameFr: 'Mon Équipe',
    icon: '🤝',
    primaryColor: CHENU_COLORS.uiSlate,
    secondaryColor: CHENU_COLORS.sacredGold,
    accentColor: CHENU_COLORS.cenoteTurquoise,
    hasRealImage: false,
    description: 'Le QG des Agents - Centre de commandement IA',
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// SVG PLACEHOLDER COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

interface SphereInteriorPlaceholderProps {
  sphereId: keyof typeof SPHERE_INTERIORS;
  width?: number | string;
  height?: number | string;
  className?: string;
  showLabel?: boolean;
}

export const SphereInteriorPlaceholder: React.FC<SphereInteriorPlaceholderProps> = ({
  sphereId,
  width = '100%',
  height = '100%',
  className = '',
  showLabel = true,
}) => {
  const config = SPHERE_INTERIORS[sphereId];
  
  if (!config) {
    return <div>Sphere not found</div>;
  }

  // If real image exists, use it
  if (config.hasRealImage && config.imagePath) {
    return (
      <div 
        className={className}
        style={{
          width,
          height,
          backgroundImage: `url(${config.imagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        {showLabel && (
          <div style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            background: 'rgba(0,0,0,0.7)',
            padding: '8px 16px',
            borderRadius: 8,
            color: config.primaryColor,
          }}>
            {config.icon} {config.nameFr}
          </div>
        )}
      </div>
    );
  }

  // SVG Placeholder
  return (
    <svg
      viewBox="0 0 800 450"
      width={width}
      height={height}
      className={className}
      style={{ background: CHENU_COLORS.uiSlate }}
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id={`grad-${sphereId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={config.primaryColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={CHENU_COLORS.uiSlate} stopOpacity="1" />
        </linearGradient>
        
        <radialGradient id={`glow-${sphereId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={config.accentColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={config.accentColor} stopOpacity="0" />
        </radialGradient>
        
        <filter id={`blur-${sphereId}`}>
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Base background */}
      <rect width="800" height="450" fill={`url(#grad-${sphereId})`} />
      
      {/* Floor perspective */}
      <polygon
        points="0,450 800,450 700,280 100,280"
        fill={config.secondaryColor}
        opacity="0.2"
      />
      
      {/* Floor grid lines */}
      {[...Array(8)].map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={280 + i * 21.25}
          x2="800"
          y2={280 + i * 21.25}
          stroke={config.primaryColor}
          strokeWidth="0.5"
          opacity="0.3"
        />
      ))}
      {[...Array(12)].map((_, i) => (
        <line
          key={`v-${i}`}
          x1={100 + i * 50 - (i * 4)}
          y1="280"
          x2={i * 66.66}
          y2="450"
          stroke={config.primaryColor}
          strokeWidth="0.5"
          opacity="0.3"
        />
      ))}
      
      {/* Central glow */}
      <ellipse
        cx="400"
        cy="350"
        rx="200"
        ry="80"
        fill={`url(#glow-${sphereId})`}
      />
      
      {/* Decorative elements - walls */}
      <rect x="50" y="80" width="20" height="200" fill={config.primaryColor} opacity="0.4" />
      <rect x="730" y="80" width="20" height="200" fill={config.primaryColor} opacity="0.4" />
      
      {/* Central icon */}
      <circle
        cx="400"
        cy="200"
        r="60"
        fill={config.primaryColor}
        opacity="0.2"
        filter={`url(#blur-${sphereId})`}
      />
      <text
        x="400"
        y="215"
        textAnchor="middle"
        fontSize="48"
        fill={config.primaryColor}
      >
        {config.icon}
      </text>
      
      {/* Accent lines */}
      <line
        x1="200"
        y1="100"
        x2="600"
        y2="100"
        stroke={config.accentColor}
        strokeWidth="2"
        opacity="0.5"
      />
      <line
        x1="150"
        y1="270"
        x2="650"
        y2="270"
        stroke={config.accentColor}
        strokeWidth="1"
        opacity="0.3"
      />
      
      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <circle
          key={`p-${i}`}
          cx={100 + Math.random() * 600}
          cy={100 + Math.random() * 150}
          r={1 + Math.random() * 2}
          fill={config.accentColor}
          opacity={0.3 + Math.random() * 0.4}
        >
          <animate
            attributeName="opacity"
            values="0.3;0.7;0.3"
            dur={`${2 + Math.random() * 3}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      
      {/* Label */}
      {showLabel && (
        <g>
          <rect
            x="300"
            y="390"
            width="200"
            height="40"
            rx="8"
            fill="rgba(0,0,0,0.7)"
          />
          <text
            x="400"
            y="418"
            textAnchor="middle"
            fontSize="16"
            fill={config.primaryColor}
            fontFamily="system-ui, sans-serif"
          >
            {config.icon} {config.nameFr}
          </text>
        </g>
      )}
      
      {/* "Image à venir" indicator */}
      <text
        x="400"
        y="320"
        textAnchor="middle"
        fontSize="12"
        fill={CHENU_COLORS.ancientStone}
        opacity="0.6"
        fontFamily="system-ui, sans-serif"
      >
        Environnement en cours de création
      </text>
    </svg>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// SPHERE BACKGROUND COMPONENT (with fallback)
// ════════════════════════════════════════════════════════════════════════════════

interface SphereBackgroundProps {
  sphereId: keyof typeof SPHERE_INTERIORS;
  children?: React.ReactNode;
  className?: string;
  overlay?: boolean;
}

export const SphereBackground: React.FC<SphereBackgroundProps> = ({
  sphereId,
  children,
  className = '',
  overlay = true,
}) => {
  const config = SPHERE_INTERIORS[sphereId];

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <SphereInteriorPlaceholder
          sphereId={sphereId}
          showLabel={false}
        />
      </div>
      
      {/* Overlay for readability */}
      {overlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to bottom, 
              rgba(30, 31, 34, 0.7) 0%, 
              rgba(30, 31, 34, 0.9) 100%)`,
            zIndex: 1,
          }}
        />
      )}
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default SphereInteriorPlaceholder;
