/**
 * CHE·NU - WorkSurface Styles
 * Styles partagés pour les composants WorkSurface
 */

export const worksurfaceColors = {
  bg: '#0D1210',
  card: '#151A18',
  border: '#2A3530',
  sage: '#3F7249',
  cyan: '#00E5FF',
  text: '#E8E4DD',
  muted: '#888888',
};

export const worksurfaceSpacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

export const worksurfaceStyles = {
  container: {
    backgroundColor: worksurfaceColors.bg,
    color: worksurfaceColors.text,
    minHeight: '100vh',
  },
  card: {
    backgroundColor: worksurfaceColors.card,
    borderRadius: '12px',
    padding: worksurfaceSpacing.md,
    border: `1px solid ${worksurfaceColors.border}`,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: worksurfaceSpacing.sm,
    padding: worksurfaceSpacing.md,
    borderBottom: `1px solid ${worksurfaceColors.border}`,
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${worksurfaceSpacing.sm} ${worksurfaceSpacing.md}`,
    backgroundColor: worksurfaceColors.card,
    borderTop: `1px solid ${worksurfaceColors.border}`,
  },
  button: {
    padding: `${worksurfaceSpacing.sm} ${worksurfaceSpacing.md}`,
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
  buttonPrimary: {
    backgroundColor: worksurfaceColors.sage,
    color: 'white',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    border: `1px solid ${worksurfaceColors.border}`,
    color: worksurfaceColors.text,
  },
};

export default worksurfaceStyles;
