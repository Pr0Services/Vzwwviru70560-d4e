/**
 * ============================================================
 * CHE·NU — useXR HOOK
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Main hook for managing XR state and interactions.
 * Provides unified access to XR functionality.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';

// ============================================================
// TYPES
// ============================================================

export interface XRDevice {
  id: string;
  name: string;
  type: 'headset' | 'controller' | 'tracker' | 'hand';
  manufacturer?: string;
  connected: boolean;
  batteryLevel?: number;
}

export interface XRSessionState {
  mode: 'inactive' | 'inline' | 'immersive-vr' | 'immersive-ar';
  isActive: boolean;
  isPaused: boolean;
  frameRate: number;
  duration: number;
}

export interface XRCapabilities {
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

export interface XRComfortSettings {
  mode: 'standard' | 'comfortable' | 'seated' | 'standing' | 'roomscale';
  vignette: boolean;
  vignetteIntensity: number;
  snapTurning: boolean;
  snapTurnAngle: number;
  smoothTurning: boolean;
  smoothTurnSpeed: number;
  teleportEnabled: boolean;
  heightOffset: number;
}

export interface XRAudioSettings {
  spatialAudio: boolean;
  ambientVolume: number;
  effectsVolume: number;
  voiceVolume: number;
  musicVolume: number;
  masterVolume: number;
}

export interface XRRenderSettings {
  quality: 'low' | 'medium' | 'high' | 'ultra' | 'adaptive';
  antialiasing: boolean;
  shadows: boolean;
  reflections: boolean;
  postProcessing: boolean;
  foveatedRendering: boolean;
  targetFramerate: number;
  resolutionScale: number;
}

export interface XRState {
  session: XRSessionState;
  devices: XRDevice[];
  capabilities: XRCapabilities;
  comfort: XRComfortSettings;
  audio: XRAudioSettings;
  render: XRRenderSettings;
  currentSphere: string | null;
  currentScene: string | null;
}

export interface UseXRReturn {
  // State
  state: XRState;
  isSupported: boolean;
  isReady: boolean;
  
  // Session
  startSession: (mode: 'immersive-vr' | 'immersive-ar' | 'inline') => Promise<void>;
  endSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  
  // Navigation
  enterScene: (sceneId: string) => void;
  exitScene: () => void;
  enterSphere: (sphereId: string) => void;
  
  // Settings
  updateComfortSettings: (settings: Partial<XRComfortSettings>) => void;
  updateAudioSettings: (settings: Partial<XRAudioSettings>) => void;
  updateRenderSettings: (settings: Partial<XRRenderSettings>) => void;
  resetSettings: () => void;
  
  // Devices
  refreshDevices: () => void;
  
  // Utilities
  checkCapabilities: () => XRCapabilities;
}

// ============================================================
// DEFAULTS
// ============================================================

const DEFAULT_COMFORT_SETTINGS: XRComfortSettings = {
  mode: 'standing',
  vignette: true,
  vignetteIntensity: 0.3,
  snapTurning: true,
  snapTurnAngle: 45,
  smoothTurning: false,
  smoothTurnSpeed: 60,
  teleportEnabled: true,
  heightOffset: 0,
};

const DEFAULT_AUDIO_SETTINGS: XRAudioSettings = {
  spatialAudio: true,
  ambientVolume: 0.5,
  effectsVolume: 0.7,
  voiceVolume: 0.8,
  musicVolume: 0.4,
  masterVolume: 0.8,
};

const DEFAULT_RENDER_SETTINGS: XRRenderSettings = {
  quality: 'high',
  antialiasing: true,
  shadows: true,
  reflections: true,
  postProcessing: true,
  foveatedRendering: true,
  targetFramerate: 72,
  resolutionScale: 1.0,
};

const DEFAULT_CAPABILITIES: XRCapabilities = {
  localFloor: false,
  boundedFloor: false,
  unbounded: false,
  handTracking: false,
  eyeTracking: false,
  depthSensing: false,
  anchorDetection: false,
  planeDetection: false,
  meshDetection: false,
};

const DEFAULT_SESSION: XRSessionState = {
  mode: 'inactive',
  isActive: false,
  isPaused: false,
  frameRate: 0,
  duration: 0,
};

// ============================================================
// HOOK
// ============================================================

export function useXR(): UseXRReturn {
  // State
  const [session, setSession] = useState<XRSessionState>(DEFAULT_SESSION);
  const [devices, setDevices] = useState<XRDevice[]>([]);
  const [capabilities, setCapabilities] = useState<XRCapabilities>(DEFAULT_CAPABILITIES);
  const [comfort, setComfort] = useState<XRComfortSettings>(DEFAULT_COMFORT_SETTINGS);
  const [audio, setAudio] = useState<XRAudioSettings>(DEFAULT_AUDIO_SETTINGS);
  const [render, setRender] = useState<XRRenderSettings>(DEFAULT_RENDER_SETTINGS);
  const [currentSphere, setCurrentSphere] = useState<string | null>(null);
  const [currentScene, setCurrentScene] = useState<string | null>(null);

  // Check XR support
  const isSupported = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return 'xr' in navigator;
  }, []);

  const isReady = useMemo(() => {
    return isSupported && devices.length > 0;
  }, [isSupported, devices]);

  // Session management
  const startSession = useCallback(async (mode: 'immersive-vr' | 'immersive-ar' | 'inline') => {
    logger.debug(`[useXR] Starting ${mode} session`);
    setSession(prev => ({
      ...prev,
      mode,
      isActive: true,
      isPaused: false,
      frameRate: render.targetFramerate,
      duration: 0,
    }));
  }, [render.targetFramerate]);

  const endSession = useCallback(() => {
    logger.debug('[useXR] Ending session');
    setSession(DEFAULT_SESSION);
    setCurrentScene(null);
  }, []);

  const pauseSession = useCallback(() => {
    setSession(prev => ({ ...prev, isPaused: true }));
  }, []);

  const resumeSession = useCallback(() => {
    setSession(prev => ({ ...prev, isPaused: false }));
  }, []);

  // Navigation
  const enterScene = useCallback((sceneId: string) => {
    logger.debug(`[useXR] Entering scene: ${sceneId}`);
    setCurrentScene(sceneId);
  }, []);

  const exitScene = useCallback(() => {
    logger.debug('[useXR] Exiting scene');
    setCurrentScene(null);
  }, []);

  const enterSphere = useCallback((sphereId: string) => {
    logger.debug(`[useXR] Entering sphere: ${sphereId}`);
    setCurrentSphere(sphereId);
  }, []);

  // Settings management
  const updateComfortSettings = useCallback((settings: Partial<XRComfortSettings>) => {
    setComfort(prev => ({ ...prev, ...settings }));
  }, []);

  const updateAudioSettings = useCallback((settings: Partial<XRAudioSettings>) => {
    setAudio(prev => ({ ...prev, ...settings }));
  }, []);

  const updateRenderSettings = useCallback((settings: Partial<XRRenderSettings>) => {
    setRender(prev => ({ ...prev, ...settings }));
  }, []);

  const resetSettings = useCallback(() => {
    setComfort(DEFAULT_COMFORT_SETTINGS);
    setAudio(DEFAULT_AUDIO_SETTINGS);
    setRender(DEFAULT_RENDER_SETTINGS);
  }, []);

  // Device management
  const refreshDevices = useCallback(() => {
    // In a real implementation, this would query WebXR
    logger.debug('[useXR] Refreshing devices');
    // Mock devices for demo
    setDevices([
      {
        id: 'headset-1',
        name: 'Virtual Headset',
        type: 'headset',
        manufacturer: 'CHE·NU',
        connected: true,
        batteryLevel: 85,
      },
      {
        id: 'controller-left',
        name: 'Left Controller',
        type: 'controller',
        connected: true,
        batteryLevel: 72,
      },
      {
        id: 'controller-right',
        name: 'Right Controller',
        type: 'controller',
        connected: true,
        batteryLevel: 68,
      },
    ]);
  }, []);

  // Capabilities check
  const checkCapabilities = useCallback((): XRCapabilities => {
    // In a real implementation, this would query WebXR capabilities
    const caps: XRCapabilities = {
      localFloor: true,
      boundedFloor: true,
      unbounded: false,
      handTracking: true,
      eyeTracking: false,
      depthSensing: false,
      anchorDetection: true,
      planeDetection: true,
      meshDetection: false,
    };
    setCapabilities(caps);
    return caps;
  }, []);

  // Initialize on mount
  useEffect(() => {
    if (isSupported) {
      refreshDevices();
      checkCapabilities();
    }
  }, [isSupported, refreshDevices, checkCapabilities]);

  // Duration timer
  useEffect(() => {
    if (session.isActive && !session.isPaused) {
      const interval = setInterval(() => {
        setSession(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [session.isActive, session.isPaused]);

  // Build state object
  const state: XRState = useMemo(() => ({
    session,
    devices,
    capabilities,
    comfort,
    audio,
    render,
    currentSphere,
    currentScene,
  }), [session, devices, capabilities, comfort, audio, render, currentSphere, currentScene]);

  return {
    state,
    isSupported,
    isReady,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    enterScene,
    exitScene,
    enterSphere,
    updateComfortSettings,
    updateAudioSettings,
    updateRenderSettings,
    resetSettings,
    refreshDevices,
    checkCapabilities,
  };
}

// ============================================================
// EXPORTS
// ============================================================

export default useXR;
