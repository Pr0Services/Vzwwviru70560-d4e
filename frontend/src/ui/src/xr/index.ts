/**
 * ============================================================
 * CHE·NU — XR MODULE INDEX
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Main entry point for XR functionality.
 * Exports all components, pages, and adapters.
 */

// ============================================================
// COMPONENTS
// ============================================================

export {
  // Scene Components
  XRSceneViewer,
  
  // Avatar Components
  XRAvatarCard,
  XRAvatarDesigner,
  AVATAR_PRESETS,
  createAvatarMorphology,
  
  // Spatial Components
  XRSpatialMap,
  
  // Session Components
  XRSessionStatus,
  
  // Interaction Components
  XRInteractionPanel,
} from "./components";

export type { XRAvatarMorphology } from "./components";

// ============================================================
// UNIVERSE MAP COMPONENTS (NEW)
// ============================================================

export { XRUniverseMapView } from "./XRUniverseMapView";
export { XRUniverseMiniMap } from "./XRUniverseMiniMap";
export { XRSceneListPanel } from "./XRSceneListPanel";
export { XRSceneCardList } from "./XRSceneCardList";

// ============================================================
// PAGES
// ============================================================

export {
  XRDashboardPage,
  XRAvatarDesignerPage,
  XRSceneBrowserPage,
  XRSettingsPage,
} from "./pages";

// ============================================================
// RE-EXPORT ADAPTERS (for convenience)
// ============================================================

export {
  // Scene Adapter
  getAllScenes,
  getScenesForSphere,
  getSceneById,
  getScenesByType,
  getAllTemplates,
  getSceneStats,
} from "../adapters/xrSceneAdapter";

export {
  // Avatar Adapter
  getAllAvatars,
  getAvatarById,
  getAvatarsByRole,
  getNovaAvatar,
  getAllPresets as getAllAvatarPresets,
  getAllDirectors,
  getDirectorBySphere,
} from "../adapters/xrAvatarAdapter";

export {
  // Spatial Adapter
  getAllZones,
  getZonesForSphere,
  getZoneById,
  getAllPaths,
  getPathsFromZone,
  getAllSpawnPoints,
  getDefaultSpawnPoint,
  getAllMarkers,
  getSpatialStats,
} from "../adapters/xrSpatialAdapter";

export {
  // Interaction Adapter
  getAllGestures,
  getAllBindings,
  getAllVoiceCommands,
  getAllHaptics,
  getAllProfiles,
  getProfileById,
} from "../adapters/xrInteractionAdapter";

export {
  // Session Adapter
  getCurrentSession,
  getSessionState,
  getConnectedDevices,
  getCapabilities,
  getRenderSettings,
  getComfortSettings,
  getAudioSettings,
  getAllPresets as getAllSessionPresets,
  getSessionHistory,
  getSessionStats,
} from "../adapters/xrSessionAdapter";
