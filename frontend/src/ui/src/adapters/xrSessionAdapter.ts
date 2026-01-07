/**
 * ============================================================
 * CHE·NU — XR ADAPTER — SESSION ADAPTER
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Adapter for XR session management, configuration, and state.
 */

import type { RootSphere } from "./universeAdapter";

// ============================================================
// TYPES
// ============================================================

export type SessionMode = 
  | "immersive-vr"
  | "immersive-ar"
  | "inline"
  | "desktop";

export type SessionState = 
  | "inactive"
  | "initializing"
  | "active"
  | "paused"
  | "ending"
  | "error";

export type RenderQuality = 
  | "low"
  | "medium"
  | "high"
  | "ultra"
  | "adaptive";

export type ComfortMode = 
  | "standard"
  | "comfortable"
  | "seated"
  | "standing"
  | "roomscale";

export interface SessionCapabilities {
  localFloor: boolean;
  boundedFloor: boolean;
  unbounded: boolean;
  handTracking: boolean;
  eyeTracking: boolean;
  depthSensing: boolean;
  anchorDetection: boolean;
  planeDetection: boolean;
  meshDetection: boolean;
}

export interface RenderSettings {
  quality: RenderQuality;
  antialiasing: boolean;
  shadows: boolean;
  reflections: boolean;
  postProcessing: boolean;
  foveatedRendering: boolean;
  targetFramerate: number;
  resolutionScale: number;
}

export interface ComfortSettings {
  mode: ComfortMode;
  vignette: boolean;
  vignetteIntensity: number;
  snapTurning: boolean;
  snapTurnAngle: number;
  smoothTurning: boolean;
  smoothTurnSpeed: number;
  teleportEnabled: boolean;
  heightOffset: number;
}

export interface AudioSettings {
  spatialAudio: boolean;
  ambientVolume: number;
  effectsVolume: number;
  voiceVolume: number;
  musicVolume: number;
  masterVolume: number;
}

export interface XRDevice {
  id: string;
  name: string;
  type: "headset" | "controller" | "tracker" | "hand";
  manufacturer: string;
  connected: boolean;
  batteryLevel?: number;
  capabilities: string[];
}

export interface XRSession {
  id: string;
  mode: SessionMode;
  state: SessionState;
  startTime: string;
  currentSphere: RootSphere;
  currentSceneId: string;
  devices: XRDevice[];
  capabilities: SessionCapabilities;
  renderSettings: RenderSettings;
  comfortSettings: ComfortSettings;
  audioSettings: AudioSettings;
  frameRate: number;
  duration: number;
}

export interface SessionPreset {
  id: string;
  name: string;
  description: string;
  mode: SessionMode;
  renderSettings: RenderSettings;
  comfortSettings: ComfortSettings;
  audioSettings: AudioSettings;
  recommended: boolean;
}

export interface SessionMetrics {
  averageFrameRate: number;
  droppedFrames: number;
  latency: number;
  totalDuration: number;
  spheresVisited: number;
  interactionsCount: number;
}

export interface SessionHistory {
  id: string;
  startTime: string;
  endTime: string;
  mode: SessionMode;
  duration: number;
  spheresVisited: RootSphere[];
  metrics: SessionMetrics;
}

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_DEVICES: XRDevice[] = [
  {
    id: "device-headset-quest3",
    name: "Meta Quest 3",
    type: "headset",
    manufacturer: "Meta",
    connected: true,
    batteryLevel: 85,
    capabilities: ["6dof", "passthrough", "handTracking", "eyeTracking"]
  },
  {
    id: "device-controller-left",
    name: "Touch Controller (Left)",
    type: "controller",
    manufacturer: "Meta",
    connected: true,
    batteryLevel: 72,
    capabilities: ["6dof", "haptics", "thumbstick", "buttons"]
  },
  {
    id: "device-controller-right",
    name: "Touch Controller (Right)",
    type: "controller",
    manufacturer: "Meta",
    connected: true,
    batteryLevel: 68,
    capabilities: ["6dof", "haptics", "thumbstick", "buttons"]
  },
  {
    id: "device-hand-left",
    name: "Hand Tracking (Left)",
    type: "hand",
    manufacturer: "System",
    connected: true,
    capabilities: ["tracking", "gestures", "pinch"]
  },
  {
    id: "device-hand-right",
    name: "Hand Tracking (Right)",
    type: "hand",
    manufacturer: "System",
    connected: true,
    capabilities: ["tracking", "gestures", "pinch"]
  }
];

const MOCK_CAPABILITIES: SessionCapabilities = {
  localFloor: true,
  boundedFloor: true,
  unbounded: true,
  handTracking: true,
  eyeTracking: true,
  depthSensing: true,
  anchorDetection: true,
  planeDetection: true,
  meshDetection: false
};

const DEFAULT_RENDER_SETTINGS: RenderSettings = {
  quality: "high",
  antialiasing: true,
  shadows: true,
  reflections: true,
  postProcessing: true,
  foveatedRendering: true,
  targetFramerate: 72,
  resolutionScale: 1.0
};

const DEFAULT_COMFORT_SETTINGS: ComfortSettings = {
  mode: "standing",
  vignette: true,
  vignetteIntensity: 0.3,
  snapTurning: true,
  snapTurnAngle: 45,
  smoothTurning: false,
  smoothTurnSpeed: 60,
  teleportEnabled: true,
  heightOffset: 0
};

const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  spatialAudio: true,
  ambientVolume: 0.5,
  effectsVolume: 0.7,
  voiceVolume: 0.8,
  musicVolume: 0.4,
  masterVolume: 0.8
};

const MOCK_CURRENT_SESSION: XRSession = {
  id: "session-current",
  mode: "immersive-vr",
  state: "active",
  startTime: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
  currentSphere: "personal",
  currentSceneId: "scene-sanctuary-personal",
  devices: MOCK_DEVICES,
  capabilities: MOCK_CAPABILITIES,
  renderSettings: DEFAULT_RENDER_SETTINGS,
  comfortSettings: DEFAULT_COMFORT_SETTINGS,
  audioSettings: DEFAULT_AUDIO_SETTINGS,
  frameRate: 72,
  duration: 1800
};

const MOCK_PRESETS: SessionPreset[] = [
  {
    id: "preset-performance",
    name: "Performance",
    description: "Optimized for smooth performance on all devices",
    mode: "immersive-vr",
    renderSettings: {
      quality: "medium",
      antialiasing: true,
      shadows: false,
      reflections: false,
      postProcessing: false,
      foveatedRendering: true,
      targetFramerate: 90,
      resolutionScale: 0.8
    },
    comfortSettings: DEFAULT_COMFORT_SETTINGS,
    audioSettings: DEFAULT_AUDIO_SETTINGS,
    recommended: false
  },
  {
    id: "preset-balanced",
    name: "Balanced",
    description: "Good balance between quality and performance",
    mode: "immersive-vr",
    renderSettings: {
      quality: "high",
      antialiasing: true,
      shadows: true,
      reflections: false,
      postProcessing: true,
      foveatedRendering: true,
      targetFramerate: 72,
      resolutionScale: 1.0
    },
    comfortSettings: DEFAULT_COMFORT_SETTINGS,
    audioSettings: DEFAULT_AUDIO_SETTINGS,
    recommended: true
  },
  {
    id: "preset-quality",
    name: "Quality",
    description: "Maximum visual quality for high-end devices",
    mode: "immersive-vr",
    renderSettings: {
      quality: "ultra",
      antialiasing: true,
      shadows: true,
      reflections: true,
      postProcessing: true,
      foveatedRendering: true,
      targetFramerate: 72,
      resolutionScale: 1.2
    },
    comfortSettings: DEFAULT_COMFORT_SETTINGS,
    audioSettings: DEFAULT_AUDIO_SETTINGS,
    recommended: false
  },
  {
    id: "preset-comfort-seated",
    name: "Seated Comfort",
    description: "Optimized for seated experiences with comfort options",
    mode: "immersive-vr",
    renderSettings: DEFAULT_RENDER_SETTINGS,
    comfortSettings: {
      mode: "seated",
      vignette: true,
      vignetteIntensity: 0.5,
      snapTurning: true,
      snapTurnAngle: 30,
      smoothTurning: false,
      smoothTurnSpeed: 45,
      teleportEnabled: true,
      heightOffset: -0.4
    },
    audioSettings: DEFAULT_AUDIO_SETTINGS,
    recommended: false
  },
  {
    id: "preset-accessibility",
    name: "Accessibility",
    description: "Enhanced accessibility features",
    mode: "immersive-vr",
    renderSettings: {
      ...DEFAULT_RENDER_SETTINGS,
      quality: "medium"
    },
    comfortSettings: {
      mode: "seated",
      vignette: true,
      vignetteIntensity: 0.7,
      snapTurning: true,
      snapTurnAngle: 22.5,
      smoothTurning: false,
      smoothTurnSpeed: 30,
      teleportEnabled: true,
      heightOffset: 0
    },
    audioSettings: {
      ...DEFAULT_AUDIO_SETTINGS,
      voiceVolume: 1.0
    },
    recommended: false
  },
  {
    id: "preset-ar-passthrough",
    name: "AR Passthrough",
    description: "Mixed reality with passthrough",
    mode: "immersive-ar",
    renderSettings: {
      quality: "high",
      antialiasing: true,
      shadows: true,
      reflections: false,
      postProcessing: false,
      foveatedRendering: true,
      targetFramerate: 72,
      resolutionScale: 1.0
    },
    comfortSettings: {
      ...DEFAULT_COMFORT_SETTINGS,
      mode: "roomscale"
    },
    audioSettings: {
      ...DEFAULT_AUDIO_SETTINGS,
      ambientVolume: 0.3
    },
    recommended: false
  }
];

const MOCK_HISTORY: SessionHistory[] = [
  {
    id: "history-1",
    startTime: "2024-03-10T10:00:00Z",
    endTime: "2024-03-10T11:30:00Z",
    mode: "immersive-vr",
    duration: 5400,
    spheresVisited: ["personal", "creative", "business"],
    metrics: {
      averageFrameRate: 71.5,
      droppedFrames: 23,
      latency: 12,
      totalDuration: 5400,
      spheresVisited: 3,
      interactionsCount: 156
    }
  },
  {
    id: "history-2",
    startTime: "2024-03-09T14:00:00Z",
    endTime: "2024-03-09T15:00:00Z",
    mode: "immersive-vr",
    duration: 3600,
    spheresVisited: ["systems", "production"],
    metrics: {
      averageFrameRate: 72.0,
      droppedFrames: 8,
      latency: 11,
      totalDuration: 3600,
      spheresVisited: 2,
      interactionsCount: 89
    }
  },
  {
    id: "history-3",
    startTime: "2024-03-08T09:00:00Z",
    endTime: "2024-03-08T09:45:00Z",
    mode: "immersive-ar",
    duration: 2700,
    spheresVisited: ["construction", "realestate"],
    metrics: {
      averageFrameRate: 70.2,
      droppedFrames: 45,
      latency: 15,
      totalDuration: 2700,
      spheresVisited: 2,
      interactionsCount: 67
    }
  }
];

// ============================================================
// ADAPTER FUNCTIONS
// ============================================================

/**
 * Get current session
 */
export function getCurrentSession(): XRSession | null {
  return { ...MOCK_CURRENT_SESSION };
}

/**
 * Get session state
 */
export function getSessionState(): SessionState {
  return MOCK_CURRENT_SESSION.state;
}

/**
 * Get connected devices
 */
export function getConnectedDevices(): XRDevice[] {
  return MOCK_DEVICES.filter(device => device.connected);
}

/**
 * Get device by ID
 */
export function getDeviceById(id: string): XRDevice | undefined {
  return MOCK_DEVICES.find(device => device.id === id);
}

/**
 * Get devices by type
 */
export function getDevicesByType(type: XRDevice["type"]): XRDevice[] {
  return MOCK_DEVICES.filter(device => device.type === type);
}

/**
 * Get session capabilities
 */
export function getCapabilities(): SessionCapabilities {
  return { ...MOCK_CAPABILITIES };
}

/**
 * Check if capability is supported
 */
export function hasCapability(capability: keyof SessionCapabilities): boolean {
  return MOCK_CAPABILITIES[capability];
}

/**
 * Get render settings
 */
export function getRenderSettings(): RenderSettings {
  return { ...DEFAULT_RENDER_SETTINGS };
}

/**
 * Get comfort settings
 */
export function getComfortSettings(): ComfortSettings {
  return { ...DEFAULT_COMFORT_SETTINGS };
}

/**
 * Get audio settings
 */
export function getAudioSettings(): AudioSettings {
  return { ...DEFAULT_AUDIO_SETTINGS };
}

/**
 * Get all session presets
 */
export function getAllPresets(): SessionPreset[] {
  return [...MOCK_PRESETS];
}

/**
 * Get preset by ID
 */
export function getPresetById(id: string): SessionPreset | undefined {
  return MOCK_PRESETS.find(preset => preset.id === id);
}

/**
 * Get recommended preset
 */
export function getRecommendedPreset(): SessionPreset | undefined {
  return MOCK_PRESETS.find(preset => preset.recommended);
}

/**
 * Get presets by mode
 */
export function getPresetsByMode(mode: SessionMode): SessionPreset[] {
  return MOCK_PRESETS.filter(preset => preset.mode === mode);
}

/**
 * Get session history
 */
export function getSessionHistory(): SessionHistory[] {
  return [...MOCK_HISTORY];
}

/**
 * Get session history by ID
 */
export function getHistoryById(id: string): SessionHistory | undefined {
  return MOCK_HISTORY.find(history => history.id === id);
}

/**
 * Get total session time
 */
export function getTotalSessionTime(): number {
  return MOCK_HISTORY.reduce((total, session) => total + session.duration, 0);
}

/**
 * Get average session duration
 */
export function getAverageSessionDuration(): number {
  if (MOCK_HISTORY.length === 0) return 0;
  return getTotalSessionTime() / MOCK_HISTORY.length;
}

/**
 * Get available session modes
 */
export function getAvailableModes(): SessionMode[] {
  return ["immersive-vr", "immersive-ar", "inline", "desktop"];
}

/**
 * Get available quality levels
 */
export function getQualityLevels(): RenderQuality[] {
  return ["low", "medium", "high", "ultra", "adaptive"];
}

/**
 * Get available comfort modes
 */
export function getComfortModes(): ComfortMode[] {
  return ["standard", "comfortable", "seated", "standing", "roomscale"];
}

/**
 * Get session statistics
 */
export function getSessionStats(): {
  totalSessions: number;
  totalTime: number;
  averageDuration: number;
  mostVisitedSphere: RootSphere;
  averageFrameRate: number;
} {
  const sphereVisits: Record<string, number> = {};
  let totalFrameRate = 0;
  
  MOCK_HISTORY.forEach(session => {
    session.spheresVisited.forEach(sphere => {
      sphereVisits[sphere] = (sphereVisits[sphere] || 0) + 1;
    });
    totalFrameRate += session.metrics.averageFrameRate;
  });
  
  const mostVisited = Object.entries(sphereVisits)
    .sort(([,a], [,b]) => b - a)[0]?.[0] as RootSphere || "personal";
  
  return {
    totalSessions: MOCK_HISTORY.length,
    totalTime: getTotalSessionTime(),
    averageDuration: getAverageSessionDuration(),
    mostVisitedSphere: mostVisited,
    averageFrameRate: MOCK_HISTORY.length > 0 
      ? totalFrameRate / MOCK_HISTORY.length 
      : 0
  };
}

/**
 * Format duration as human-readable string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

export default {
  getCurrentSession,
  getSessionState,
  getConnectedDevices,
  getDeviceById,
  getDevicesByType,
  getCapabilities,
  hasCapability,
  getRenderSettings,
  getComfortSettings,
  getAudioSettings,
  getAllPresets,
  getPresetById,
  getRecommendedPreset,
  getPresetsByMode,
  getSessionHistory,
  getHistoryById,
  getTotalSessionTime,
  getAverageSessionDuration,
  getAvailableModes,
  getQualityLevels,
  getComfortModes,
  getSessionStats,
  formatDuration
};
