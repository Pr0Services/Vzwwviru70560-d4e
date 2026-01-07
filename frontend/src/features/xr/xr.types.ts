/**
 * CHE·NU — XR / SPATIAL TYPES
 * ============================================================
 * Type definitions for spatial computing integration.
 * 
 * Core Principle:
 * XR is an interface layer, never a decision layer.
 * All governance rules remain unchanged.
 * 
 * @version 1.0.0
 */

// ============================================================
// XR SESSION
// ============================================================

export interface XRSession {
  id: string;
  
  // Device
  deviceType: XRDeviceType;
  deviceCapabilities: XRCapabilities;
  
  // Mode
  mode: XRMode;
  immersionLevel: ImmersionLevel;
  
  // Surfaces
  surfaces: XRSurfaces;
  
  // State
  isActive: boolean;
  isPaused: boolean;
  
  // Performance
  frameRate: number;
  batteryLevel?: number;
  comfortScore: number;        // 0-100
  
  // Settings
  settings: XRSettings;
  
  // Timestamps
  startedAt: Date;
  lastActiveAt: Date;
}

export type XRDeviceType = 
  | 'ar_glasses'
  | 'vr_headset'
  | 'spatial_desktop'
  | 'mixed_reality'
  | 'phone_ar';

export type XRMode = 
  | 'ar'           // Augmented reality
  | 'vr'           // Virtual reality
  | 'mr'           // Mixed reality
  | 'passthrough'; // VR with passthrough

export type ImmersionLevel = 
  | 'minimal'      // Small overlays
  | 'partial'      // Floating panels
  | 'full';        // Fully spatial

export interface XRCapabilities {
  handTracking: boolean;
  eyeTracking: boolean;
  voiceInput: boolean;
  spatialAudio: boolean;
  passthrough: boolean;
  roomMapping: boolean;
}

export interface XRSettings {
  // Comfort
  comfortMode: boolean;
  reduceMotion: boolean;
  snapTurning: boolean;
  
  // Privacy
  allowRoomMapping: boolean;
  allowEyeTracking: boolean;
  
  // Audio
  spatialAudioEnabled: boolean;
  
  // Display
  brightness: number;
  textScale: number;
  panelDistance: number;
  
  // Interaction
  dominantHand: 'left' | 'right';
  gestureConfirmations: boolean;  // Always false per spec
}

// ============================================================
// XR SURFACES (Mapped from 2D)
// ============================================================

export interface XRSurfaces {
  nova: XRSurfaceNova;
  context: XRSurfaceContext;
  workspace: XRSurfaceWorkspace;
}

export interface XRSurfaceNova {
  // Presence
  isVisible: boolean;
  position: XRPosition;
  
  // Display
  displayMode: 'avatar' | 'text_panel' | 'voice_only' | 'hidden';
  scale: number;            // Never > 0.5 (not dominant)
  
  // Behavior
  followsGaze: boolean;     // Should be false per spec
  animationLevel: 'none' | 'minimal' | 'subtle';
}

export interface XRSurfaceContext {
  isVisible: boolean;
  position: XRPosition;
  
  // Panels
  panels: XRPanel[];
  
  // Layout
  layout: 'arc' | 'grid' | 'stack' | 'orbital';
  spacing: number;
}

export interface XRSurfaceWorkspace {
  isVisible: boolean;
  position: XRPosition;
  
  // Canvas
  canvasSize: XRSize;
  canvasPosition: XRPosition;
  
  // Documents
  documents: XRDocument[];
  
  // Interaction
  activeDocument?: string;
}

// ============================================================
// XR OBJECTS
// ============================================================

export interface XRPosition {
  x: number;
  y: number;
  z: number;
  
  // Rotation (euler angles in degrees)
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
}

export interface XRSize {
  width: number;
  height: number;
  depth?: number;
}

export interface XRPanel {
  id: string;
  type: PanelType;
  
  // Position
  position: XRPosition;
  size: XRSize;
  
  // Content
  title?: string;
  content: unknown;
  
  // Interaction
  isPinned: boolean;
  isInteractive: boolean;
  
  // Visibility
  opacity: number;
  isMinimized: boolean;
}

export type PanelType = 
  | 'sphere_indicator'
  | 'budget_meter'
  | 'scope_display'
  | 'notification'
  | 'mini_map'
  | 'participant_list'
  | 'tool_palette';

export interface XRDocument {
  id: string;
  documentId: string;         // Maps to real document
  
  // Display
  position: XRPosition;
  size: XRSize;
  displayMode: 'panel' | 'object' | 'embedded';
  
  // State
  isSelected: boolean;
  isFocused: boolean;
  
  // Interaction
  lastInteraction?: Date;
}

// ============================================================
// XR INTERACTIONS
// ============================================================

export interface XRInteraction {
  id: string;
  type: InteractionType;
  
  // Target
  targetId?: string;
  targetType?: string;
  
  // Position
  position: XRPosition;
  direction?: XRPosition;
  
  // State
  state: InteractionState;
  
  // Timestamp
  timestamp: Date;
}

export type InteractionType = 
  | 'gaze'           // Looking at
  | 'point'          // Pointing
  | 'select'         // Click/tap
  | 'grab'           // Grab object
  | 'release'        // Release object
  | 'resize'         // Resize gesture
  | 'scroll'         // Scroll gesture
  | 'voice';         // Voice command

export type InteractionState = 
  | 'started'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

// ============================================================
// XR MEETINGS
// ============================================================

export interface XRMeeting {
  meetingId: string;
  
  // Environment
  environment: MeetingEnvironment;
  
  // Participants
  participants: XRParticipant[];
  
  // Shared content
  sharedDocuments: XRDocument[];
  sharedPointers: XRPointer[];
  
  // State
  isActive: boolean;
}

export type MeetingEnvironment = 
  | 'void'           // Minimal, just content
  | 'table'          // Virtual table
  | 'room'           // Simple room
  | 'custom';        // Custom environment

export interface XRParticipant {
  id: string;
  userId: string;
  
  // Avatar (optional per spec)
  hasAvatar: boolean;
  avatarType?: 'abstract' | 'upper_body' | 'minimal';
  
  // Position
  position: XRPosition;
  
  // Indicators
  isSpeaking: boolean;
  isPointing: boolean;
  pointerPosition?: XRPosition;
}

export interface XRPointer {
  id: string;
  userId: string;
  position: XRPosition;
  color: string;
  isActive: boolean;
}

// ============================================================
// XR PERFORMANCE
// ============================================================

export interface XRPerformanceMetrics {
  frameRate: number;
  latency: number;
  trackingQuality: 'excellent' | 'good' | 'poor';
  
  // Comfort
  sessionDuration: number;
  comfortScore: number;
  
  // Battery
  batteryLevel?: number;
  batteryDrain?: number;      // % per hour
  
  // Recommendations
  shouldReduceQuality: boolean;
  shouldExitXR: boolean;
  exitReason?: string;
}

// ============================================================
// XR FALLBACK
// ============================================================

export interface XRFallbackConfig {
  // When to fallback
  minFrameRate: number;
  minBatteryLevel: number;
  maxLatency: number;
  
  // Fallback options
  fallbackTo: '2d' | 'simplified_xr' | 'pause';
  
  // User notification
  notifyBeforeFallback: boolean;
  notificationDelay: number;
}

export const DEFAULT_FALLBACK_CONFIG: XRFallbackConfig = {
  minFrameRate: 30,
  minBatteryLevel: 10,
  maxLatency: 50,
  fallbackTo: '2d',
  notifyBeforeFallback: true,
  notificationDelay: 5000
};
