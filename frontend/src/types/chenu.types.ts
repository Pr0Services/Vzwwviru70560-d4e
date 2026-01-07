/**
 * CHE·NU™ — Core Types
 * Types fondamentaux pour l'univers CHE·NU
 */

// ═══════════════════════════════════════════════════════════════════════════════
// UNIVERSE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type Universe = 'realistic' | 'ancient' | 'futurist' | 'cosmic';

export interface UniverseTheme {
  id: Universe;
  name: string;
  nameFr: string;
  icon: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
  };
}

/**
 * 4 Univers visuels de CHE·NU
 */
export const UNIVERSE_THEMES: Record<Universe, UniverseTheme> = {
  realistic: {
    id: 'realistic',
    name: 'Realistic',
    nameFr: 'Réaliste',
    icon: '🏢',
    description: 'Clean, professional, modern design',
    colors: {
      primary: '#3EB4A2',
      secondary: '#D8B26A',
      accent: '#3F7249',
      background: '#1E1F22',
      surface: '#2A2B2E',
    },
  },
  ancient: {
    id: 'ancient',
    name: 'Ancient',
    nameFr: 'Ancien',
    icon: '🏛️',
    description: 'Classical, timeless, institutional',
    colors: {
      primary: '#8D8371',
      secondary: '#D8B26A',
      accent: '#7A593A',
      background: '#1A1918',
      surface: '#2D2A26',
    },
  },
  futurist: {
    id: 'futurist',
    name: 'Futurist',
    nameFr: 'Futuriste',
    icon: '🚀',
    description: 'High-tech, innovative, sleek',
    colors: {
      primary: '#00D4FF',
      secondary: '#FF00E5',
      accent: '#00FF88',
      background: '#0A0A12',
      surface: '#141428',
    },
  },
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic',
    nameFr: 'Cosmique',
    icon: '🌌',
    description: 'Ethereal, expansive, mystical',
    colors: {
      primary: '#9B59B6',
      secondary: '#3498DB',
      accent: '#E74C3C',
      background: '#0D0D1A',
      surface: '#1A1A2E',
    },
  },
};

/**
 * Liste de tous les univers
 */
export function getAllUniverses(): UniverseTheme[] {
  return Object.values(UNIVERSE_THEMES);
}

/**
 * Obtenir un univers par son ID
 */
export function getUniverseById(id: Universe): UniverseTheme {
  return UNIVERSE_THEMES[id];
}

// ═══════════════════════════════════════════════════════════════════════════════
// RE-EXPORTS FROM MAIN TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export * from './index';
