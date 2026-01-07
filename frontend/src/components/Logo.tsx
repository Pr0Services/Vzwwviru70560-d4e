/**
 * CHE·NU — LOGO COMPONENT
 * ============================================================
 * 
 * Logo officiel CHE·NU
 * Pyramide maya avec végétation tropicale et fontaine
 * 
 * @version 27.0.0
 */

import React, { useState } from 'react';

interface LogoProps {
  size?: 'xs' | 'small' | 'medium' | 'large' | 'xlarge' | 'hero';
  showText?: boolean;
  variant?: 'full' | 'icon' | 'text';
  className?: string;
  onClick?: () => void;
}

const SIZES = {
  xs: { logo: 24, text: 10, subtitle: 6 },
  small: { logo: 32, text: 12, subtitle: 8 },
  medium: { logo: 48, text: 16, subtitle: 10 },
  large: { logo: 80, text: 24, subtitle: 14 },
  xlarge: { logo: 120, text: 32, subtitle: 18 },
  hero: { logo: 200, text: 48, subtitle: 24 },
};

// Logo image paths (place your logo at these locations)
const LOGO_PATHS = [
  '/chenu-logo.jpg',
  '/assets/images/chenu-logo.jpg',
  '/images/chenu-logo.jpg',
];

export const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  showText = true,
  variant = 'full',
  className = '',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const dimensions = SIZES[size];

  // Handle image load error - try next path or show fallback
  const handleImageError = () => {
    if (currentPathIndex < LOGO_PATHS.length - 1) {
      setCurrentPathIndex(prev => prev + 1);
    } else {
      setImageError(true);
    }
  };

  // Text-only variant
  if (variant === 'text') {
    return (
      <span
        className={className}
        onClick={onClick}
        style={{
          fontSize: dimensions.text,
          fontWeight: 700,
          color: '#D8B26A',
          letterSpacing: 2,
          fontFamily: "'Cinzel', 'Times New Roman', serif",
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        CHE·NU
      </span>
    );
  }

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: dimensions.logo * 0.2,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {/* Logo Image or Fallback */}
      {variant !== 'text' && (
        <div
          style={{
            width: dimensions.logo,
            height: dimensions.logo,
            borderRadius: dimensions.logo * 0.12,
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #1A2420 0%, #0D1210 100%)',
            boxShadow: `0 4px ${dimensions.logo * 0.25}px rgba(216, 178, 106, 0.15)`,
            flexShrink: 0,
          }}
        >
          {!imageError ? (
            <img
              src={LOGO_PATHS[currentPathIndex]}
              alt="CHE·NU"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={handleImageError}
            />
          ) : (
            // Fallback: Styled SVG representation
            <LogoFallback size={dimensions.logo} />
          )}
        </div>
      )}

      {/* Text */}
      {showText && variant !== 'icon' && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: dimensions.text,
              fontWeight: 700,
              color: '#E8F0E8',
              letterSpacing: 1.5,
              lineHeight: 1.1,
              fontFamily: "'Cinzel', 'Times New Roman', serif",
            }}
          >
            CHE·NU
          </div>
          {size !== 'xs' && size !== 'small' && (
            <div
              style={{
                fontSize: dimensions.subtitle,
                color: '#6B8068',
                marginTop: 2,
                fontStyle: 'italic',
              }}
            >
              Chez Nous
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================
// FALLBACK SVG LOGO
// ============================================================

const LogoFallback: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background circle */}
    <circle cx="50" cy="50" r="48" fill="#1A2420" stroke="#3F7249" strokeWidth="2" />
    
    {/* Water/fountain at bottom */}
    <ellipse cx="50" cy="78" rx="35" ry="12" fill="#4ECDC4" opacity="0.6" />
    <ellipse cx="50" cy="78" rx="25" ry="8" fill="#7FDBDA" opacity="0.4" />
    
    {/* Pyramid structure */}
    <path d="M50 15 L75 50 L70 55 L65 50 L60 55 L55 50 L50 55 L45 50 L40 55 L35 50 L30 55 L25 50 L50 15Z" fill="#8B7355" />
    <path d="M30 55 L50 25 L70 55 L65 60 L50 35 L35 60 L30 55Z" fill="#A08060" />
    <path d="M35 60 L50 35 L65 60 L60 65 L50 45 L40 65 L35 60Z" fill="#B8956A" />
    
    {/* CHE text */}
    <text x="50" y="58" textAnchor="middle" fill="#D8B26A" fontSize="12" fontWeight="bold" fontFamily="serif">
      CHE
    </text>
    
    {/* NU text */}
    <text x="50" y="72" textAnchor="middle" fill="#D8B26A" fontSize="12" fontWeight="bold" fontFamily="serif">
      NU
    </text>
    
    {/* Vegetation - left */}
    <path d="M15 45 Q20 35 25 45 Q20 40 15 45" fill="#3F7249" />
    <path d="M18 50 Q23 40 28 50 Q23 45 18 50" fill="#4A8B54" />
    <path d="M12 55 Q18 42 24 55 Q18 48 12 55" fill="#2D5A35" />
    
    {/* Vegetation - right */}
    <path d="M85 45 Q80 35 75 45 Q80 40 85 45" fill="#3F7249" />
    <path d="M82 50 Q77 40 72 50 Q77 45 82 50" fill="#4A8B54" />
    <path d="M88 55 Q82 42 76 55 Q82 48 88 55" fill="#2D5A35" />
    
    {/* Small flowers */}
    <circle cx="20" cy="60" r="2" fill="#FF6B9D" />
    <circle cx="80" cy="58" r="2" fill="#5BC0EB" />
    <circle cx="75" cy="65" r="1.5" fill="#FF6B9D" />
  </svg>
);

export default Logo;
