/**
 * CHE·NU — Theme Configuration
 */

export const colors = {
  // Base
  bg: '#0D1210',
  bgAlt: '#121816',
  card: '#151A18',
  cardHover: '#1E2422',
  
  // Borders
  border: '#2A3530',
  borderLight: '#3A4540',
  
  // Brand
  sand: '#D8B26A',
  sage: '#3F7249',
  cyan: '#00E5FF',
  
  // Text
  text: '#E8E4DD',
  textMuted: '#888888',
  textLight: '#AAAAAA',
  
  // Status
  success: '#4ADE80',
  warning: '#F39C12',
  error: '#FF6B6B',
  info: '#3498DB',
  
  // Gradients
  gradientPrimary: 'linear-gradient(135deg, #3F7249 0%, #D8B26A 100%)',
  gradientNova: 'linear-gradient(135deg, #00E5FF 0%, #3F7249 100%)',
};

export const typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', monospace",
  
  sizes: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '22px',
    '2xl': '28px',
    '3xl': '36px',
  },
  
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
};

export const borderRadius = {
  sm: '6px',
  md: '8px',
  lg: '10px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '20px',
  full: '9999px',
};

export const shadows = {
  sm: '0 2px 4px rgba(0,0,0,0.1)',
  md: '0 4px 8px rgba(0,0,0,0.15)',
  lg: '0 8px 16px rgba(0,0,0,0.2)',
  xl: '0 12px 24px rgba(0,0,0,0.25)',
  nova: '0 0 20px rgba(0,229,255,0.3)',
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export default theme;
