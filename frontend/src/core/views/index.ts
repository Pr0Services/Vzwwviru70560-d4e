/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       CHE·NU™ — CORE VIEWS & NAVIGATION                      ║
 * ║                       Exports Centralisés                                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// NOVA - Intelligence Système
// ═══════════════════════════════════════════════════════════════════════════════

export { 
  NovaInterface,
  NovaAvatar,
  type NovaState,
  type NovaMessage,
  type NovaSuggestion,
  type NovaCheckpoint,
  type NovaContext,
  type NovaInterfaceProps,
} from './nova/NovaInterface';

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION - Minimap & Navigation
// ═══════════════════════════════════════════════════════════════════════════════

export {
  OrbitalMinimap,
  CompactMinimap,
  MinimapHeader,
  type OrbitalMinimapProps,
  type CompactMinimapProps,
  type MinimapHeaderProps,
  type SphereId,
} from './navigation/OrbitalMinimap';

// ═══════════════════════════════════════════════════════════════════════════════
// VIEWS - Vues Principales
// ═══════════════════════════════════════════════════════════════════════════════

export {
  UniverseView,
  type UniverseViewProps,
  type ViewMode,
} from './views/UniverseView';

export {
  SphereView,
  type SphereViewProps,
  type BureauSectionId,
} from './views/SphereView';

export {
  MapView,
  type MapViewProps,
} from './views/MapView';
