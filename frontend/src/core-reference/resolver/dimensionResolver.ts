/**
 * CHE·NU - Dimension Resolver
 * Résout les dimensions dynamiquement
 */

export interface Dimension {
  width: number;
  height: number;
  scale: number;
}

export interface DimensionConfig {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
}

export const resolveDimension = (
  containerWidth: number,
  containerHeight: number,
  config: DimensionConfig = {}
): Dimension => {
  const {
    minWidth = 0,
    maxWidth = Infinity,
    minHeight = 0,
    maxHeight = Infinity,
    aspectRatio
  } = config;

  let width = Math.min(Math.max(containerWidth, minWidth), maxWidth);
  let height = Math.min(Math.max(containerHeight, minHeight), maxHeight);

  if (aspectRatio) {
    const currentRatio = width / height;
    if (currentRatio > aspectRatio) {
      width = height * aspectRatio;
    } else {
      height = width / aspectRatio;
    }
  }

  const scale = Math.min(width / containerWidth, height / containerHeight);

  return { width, height, scale };
};

export const getResponsiveDimension = (breakpoint: string): Dimension => {
  const breakpoints: Record<string, Dimension> = {
    mobile: { width: 375, height: 667, scale: 1 },
    tablet: { width: 768, height: 1024, scale: 1 },
    desktop: { width: 1440, height: 900, scale: 1 },
    wide: { width: 1920, height: 1080, scale: 1 }
  };

  return breakpoints[breakpoint] || breakpoints.desktop;
};

export default { resolveDimension, getResponsiveDimension };
