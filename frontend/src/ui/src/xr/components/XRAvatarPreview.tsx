/**
 * ============================================================
 * CHE·NU — XR AVATAR PREVIEW
 * SAFE · NON-BIOMETRIC · SYMBOLIC
 * ============================================================
 * 
 * Displays a symbolic preview of an avatar morphology.
 * NEVER shows realistic human features.
 * Uses geometric/abstract forms only.
 */

import React from 'react';

// ============================================================
// TYPES
// ============================================================

interface AvatarTraits {
  height: number;
  proportions: 'balanced' | 'compact' | 'slim' | 'strong';
  silhouette: 'neutral' | 'rounded' | 'angular' | 'tall';
  colorPalette: string[];
}

interface XRAvatarPreviewProps {
  traits: AvatarTraits;
  name?: string;
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
}

// ============================================================
// CONSTANTS
// ============================================================

const CHENU_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

const SIZE_CONFIG = {
  small: { width: 120, height: 160 },
  medium: { width: 180, height: 240 },
  large: { width: 240, height: 320 },
};

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  previewArea: {
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
    pointerEvents: 'none',
  },
  avatarBody: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  head: {
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '-10px',
    zIndex: 2,
  },
  headInner: {
    width: '60%',
    height: '60%',
    borderRadius: '50%',
    opacity: 0.5,
  },
  torso: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  torsoInner: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    borderRadius: '8px',
    opacity: 0.4,
  },
  heightIndicator: {
    position: 'absolute',
    right: '10px',
    top: '10%',
    bottom: '10%',
    width: '4px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '2px',
  },
  heightFill: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    borderRadius: '2px',
    transition: 'height 0.3s ease',
  },
  heightLabel: {
    position: 'absolute',
    right: '20px',
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  paletteStrip: {
    display: 'flex',
    gap: '4px',
    marginTop: '8px',
  },
  paletteColor: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  name: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    textAlign: 'center',
  },
  traitsLabel: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    textAlign: 'center',
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getSilhouetteStyles(
  silhouette: AvatarTraits['silhouette'],
  proportions: AvatarTraits['proportions']
): { headRadius: string; torsoRadius: string; torsoShape: string } {
  const baseRadius = {
    neutral: '50%',
    rounded: '50%',
    angular: '20%',
    tall: '40%',
  };

  const torsoShapes = {
    neutral: '12px',
    rounded: '24px',
    angular: '4px',
    tall: '8px',
  };

  return {
    headRadius: baseRadius[silhouette],
    torsoRadius: torsoShapes[silhouette],
    torsoShape: proportions === 'strong' ? '16px' : torsoShapes[silhouette],
  };
}

function getProportionScales(proportions: AvatarTraits['proportions']): {
  headScale: number;
  torsoWidthScale: number;
  torsoHeightScale: number;
} {
  switch (proportions) {
    case 'compact':
      return { headScale: 1.1, torsoWidthScale: 1.2, torsoHeightScale: 0.8 };
    case 'slim':
      return { headScale: 0.9, torsoWidthScale: 0.8, torsoHeightScale: 1.1 };
    case 'strong':
      return { headScale: 1.0, torsoWidthScale: 1.3, torsoHeightScale: 1.0 };
    case 'balanced':
    default:
      return { headScale: 1.0, torsoWidthScale: 1.0, torsoHeightScale: 1.0 };
  }
}

// ============================================================
// COMPONENT
// ============================================================

export const XRAvatarPreview: React.FC<XRAvatarPreviewProps> = ({
  traits,
  name,
  size = 'medium',
  showLabels = true,
}) => {
  const { width, height } = SIZE_CONFIG[size];
  const silhouetteStyles = getSilhouetteStyles(traits.silhouette, traits.proportions);
  const proportionScales = getProportionScales(traits.proportions);
  
  // Calculate dimensions based on traits
  const baseHeadSize = size === 'small' ? 30 : size === 'medium' ? 45 : 60;
  const baseTorsoWidth = size === 'small' ? 40 : size === 'medium' ? 60 : 80;
  const baseTorsoHeight = size === 'small' ? 50 : size === 'medium' ? 75 : 100;
  
  const headSize = baseHeadSize * proportionScales.headScale;
  const torsoWidth = baseTorsoWidth * proportionScales.torsoWidthScale;
  const torsoHeight = baseTorsoHeight * proportionScales.torsoHeightScale * traits.height;
  
  // Primary and secondary colors
  const primaryColor = traits.colorPalette[0] || CHENU_COLORS.sacredGold;
  const secondaryColor = traits.colorPalette[1] || traits.colorPalette[0] || CHENU_COLORS.ancientStone;
  
  // Height percentage for indicator
  const heightPercent = ((traits.height - 0.7) / 0.8) * 100; // 0.7-1.5 range

  return (
    <div style={styles.container}>
      {/* Preview Area */}
      <div
        style={{
          ...styles.previewArea,
          width,
          height,
        }}
      >
        <div style={styles.grid} />
        
        {/* Avatar Body */}
        <div style={styles.avatarBody}>
          {/* Head - Geometric circle/shape */}
          <div
            style={{
              ...styles.head,
              width: headSize,
              height: headSize,
              backgroundColor: primaryColor,
              borderRadius: silhouetteStyles.headRadius,
            }}
          >
            <div
              style={{
                ...styles.headInner,
                backgroundColor: secondaryColor,
              }}
            />
          </div>
          
          {/* Torso - Geometric rectangle/shape */}
          <div
            style={{
              ...styles.torso,
              width: torsoWidth,
              height: torsoHeight,
              backgroundColor: primaryColor,
              borderRadius: silhouetteStyles.torsoRadius,
            }}
          >
            <div
              style={{
                ...styles.torsoInner,
                backgroundColor: secondaryColor,
                borderRadius: silhouetteStyles.torsoShape,
              }}
            />
          </div>
        </div>
        
        {/* Height Indicator */}
        {showLabels && (
          <div style={styles.heightIndicator}>
            <div
              style={{
                ...styles.heightFill,
                height: `${Math.min(100, Math.max(0, heightPercent))}%`,
              }}
            />
          </div>
        )}
        
        {/* Height Label */}
        {showLabels && (
          <div
            style={{
              ...styles.heightLabel,
              bottom: `${10 + heightPercent * 0.8}%`,
            }}
          >
            {traits.height.toFixed(2)}
          </div>
        )}
      </div>
      
      {/* Color Palette Strip */}
      <div style={styles.paletteStrip}>
        {traits.colorPalette.slice(0, 4).map((color, i) => (
          <div
            key={i}
            style={{
              ...styles.paletteColor,
              backgroundColor: color,
            }}
            title={color}
          />
        ))}
      </div>
      
      {/* Name & Traits */}
      {name && <div style={styles.name}>{name}</div>}
      {showLabels && (
        <div style={styles.traitsLabel}>
          {traits.proportions} · {traits.silhouette}
        </div>
      )}
    </div>
  );
};

export default XRAvatarPreview;
