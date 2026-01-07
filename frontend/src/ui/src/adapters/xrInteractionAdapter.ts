/**
 * ============================================================
 * CHE·NU — XR ADAPTER — INTERACTION ADAPTER
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Adapter for XR interactions, gestures, and input handling.
 */

// ============================================================
// TYPES
// ============================================================

export type InteractionType = 
  | "click"
  | "hover"
  | "grab"
  | "point"
  | "gaze"
  | "voice"
  | "gesture";

export type GestureType = 
  | "pinch"
  | "point"
  | "fist"
  | "open"
  | "thumbsUp"
  | "wave"
  | "swipe"
  | "rotate";

export type InputDevice = 
  | "controller"
  | "hand"
  | "gaze"
  | "mouse"
  | "touch"
  | "voice";

export type FeedbackType = 
  | "haptic"
  | "visual"
  | "audio"
  | "none";

export interface InteractionVector3 {
  x: number;
  y: number;
  z: number;
}

export interface InteractionTarget {
  id: string;
  name: string;
  type: "object" | "zone" | "ui" | "portal" | "avatar";
  interactable: boolean;
  interactions: InteractionType[];
  feedbackTypes: FeedbackType[];
}

export interface GestureDefinition {
  id: string;
  name: string;
  type: GestureType;
  description: string;
  requiredHand: "left" | "right" | "both" | "any";
  confidenceThreshold: number;
  action: string;
  icon: string;
}

export interface InputBinding {
  id: string;
  name: string;
  device: InputDevice;
  input: string;
  action: string;
  modifiers?: string[];
  description: string;
  enabled: boolean;
}

export interface HapticPattern {
  id: string;
  name: string;
  description: string;
  intensity: number;
  duration: number;
  pattern: number[];
  device: "controller" | "hand" | "both";
}

export interface InteractionEvent {
  id: string;
  type: InteractionType;
  targetId: string;
  device: InputDevice;
  position: InteractionVector3;
  timestamp: string;
  data?: Record<string, unknown>;
}

export interface InteractionZone {
  id: string;
  name: string;
  description: string;
  bounds: {
    min: InteractionVector3;
    max: InteractionVector3;
  };
  allowedInteractions: InteractionType[];
  activeFeedback: FeedbackType[];
  priority: number;
}

export interface VoiceCommand {
  id: string;
  phrase: string;
  aliases: string[];
  action: string;
  description: string;
  enabled: boolean;
  confidence: number;
}

export interface InteractionProfile {
  id: string;
  name: string;
  description: string;
  defaultDevice: InputDevice;
  bindings: InputBinding[];
  gestures: string[];
  voiceCommands: string[];
  hapticEnabled: boolean;
}

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_TARGETS: InteractionTarget[] = [
  {
    id: "target-memory-orb",
    name: "Memory Orb",
    type: "object",
    interactable: true,
    interactions: ["click", "hover", "grab"],
    feedbackTypes: ["haptic", "visual", "audio"]
  },
  {
    id: "target-portal-creative",
    name: "Creative Portal",
    type: "portal",
    interactable: true,
    interactions: ["click", "gaze", "point"],
    feedbackTypes: ["visual", "audio"]
  },
  {
    id: "target-info-panel",
    name: "Information Panel",
    type: "ui",
    interactable: true,
    interactions: ["click", "hover", "point"],
    feedbackTypes: ["visual"]
  },
  {
    id: "target-zone-sanctuary",
    name: "Sanctuary Zone",
    type: "zone",
    interactable: true,
    interactions: ["hover", "gaze"],
    feedbackTypes: ["visual"]
  },
  {
    id: "target-avatar-nova",
    name: "Nova Avatar",
    type: "avatar",
    interactable: true,
    interactions: ["click", "hover", "voice"],
    feedbackTypes: ["visual", "audio"]
  },
  {
    id: "target-desk-business",
    name: "Executive Desk",
    type: "object",
    interactable: true,
    interactions: ["click", "hover", "grab"],
    feedbackTypes: ["haptic", "visual"]
  },
  {
    id: "target-console-systems",
    name: "Control Console",
    type: "object",
    interactable: true,
    interactions: ["click", "hover", "point", "gesture"],
    feedbackTypes: ["haptic", "visual", "audio"]
  }
];

const MOCK_GESTURES: GestureDefinition[] = [
  {
    id: "gesture-pinch-select",
    name: "Pinch Select",
    type: "pinch",
    description: "Pinch thumb and index finger to select",
    requiredHand: "any",
    confidenceThreshold: 0.8,
    action: "select",
    icon: "🤏"
  },
  {
    id: "gesture-point-aim",
    name: "Point Aim",
    type: "point",
    description: "Point index finger to aim",
    requiredHand: "any",
    confidenceThreshold: 0.7,
    action: "aim",
    icon: "👆"
  },
  {
    id: "gesture-fist-grab",
    name: "Fist Grab",
    type: "fist",
    description: "Close fist to grab objects",
    requiredHand: "any",
    confidenceThreshold: 0.85,
    action: "grab",
    icon: "✊"
  },
  {
    id: "gesture-open-release",
    name: "Open Release",
    type: "open",
    description: "Open hand to release grabbed objects",
    requiredHand: "any",
    confidenceThreshold: 0.75,
    action: "release",
    icon: "✋"
  },
  {
    id: "gesture-thumbsup-confirm",
    name: "Thumbs Up Confirm",
    type: "thumbsUp",
    description: "Thumbs up to confirm action",
    requiredHand: "any",
    confidenceThreshold: 0.9,
    action: "confirm",
    icon: "👍"
  },
  {
    id: "gesture-wave-greet",
    name: "Wave Greet",
    type: "wave",
    description: "Wave to greet or get attention",
    requiredHand: "any",
    confidenceThreshold: 0.7,
    action: "greet",
    icon: "👋"
  },
  {
    id: "gesture-swipe-navigate",
    name: "Swipe Navigate",
    type: "swipe",
    description: "Swipe to navigate menus or scroll",
    requiredHand: "any",
    confidenceThreshold: 0.75,
    action: "navigate",
    icon: "👉"
  },
  {
    id: "gesture-rotate-manipulate",
    name: "Rotate Manipulate",
    type: "rotate",
    description: "Two-hand rotate to manipulate objects",
    requiredHand: "both",
    confidenceThreshold: 0.8,
    action: "rotate",
    icon: "🔄"
  }
];

const MOCK_BINDINGS: InputBinding[] = [
  {
    id: "bind-controller-trigger",
    name: "Controller Trigger",
    device: "controller",
    input: "trigger",
    action: "select",
    description: "Pull trigger to select",
    enabled: true
  },
  {
    id: "bind-controller-grip",
    name: "Controller Grip",
    device: "controller",
    input: "grip",
    action: "grab",
    description: "Squeeze grip to grab",
    enabled: true
  },
  {
    id: "bind-controller-thumbstick",
    name: "Controller Thumbstick",
    device: "controller",
    input: "thumbstick",
    action: "move",
    description: "Move thumbstick to navigate",
    enabled: true
  },
  {
    id: "bind-controller-a",
    name: "Controller A Button",
    device: "controller",
    input: "a",
    action: "confirm",
    description: "Press A to confirm",
    enabled: true
  },
  {
    id: "bind-controller-b",
    name: "Controller B Button",
    device: "controller",
    input: "b",
    action: "cancel",
    description: "Press B to cancel",
    enabled: true
  },
  {
    id: "bind-hand-pinch",
    name: "Hand Pinch",
    device: "hand",
    input: "pinch",
    action: "select",
    description: "Pinch to select",
    enabled: true
  },
  {
    id: "bind-gaze-focus",
    name: "Gaze Focus",
    device: "gaze",
    input: "focus",
    action: "hover",
    description: "Look at object to hover",
    enabled: true
  },
  {
    id: "bind-gaze-dwell",
    name: "Gaze Dwell",
    device: "gaze",
    input: "dwell",
    action: "select",
    modifiers: ["2s"],
    description: "Look at object for 2s to select",
    enabled: true
  },
  {
    id: "bind-mouse-click",
    name: "Mouse Click",
    device: "mouse",
    input: "left",
    action: "select",
    description: "Left click to select",
    enabled: true
  },
  {
    id: "bind-touch-tap",
    name: "Touch Tap",
    device: "touch",
    input: "tap",
    action: "select",
    description: "Tap to select",
    enabled: true
  }
];

const MOCK_HAPTICS: HapticPattern[] = [
  {
    id: "haptic-select",
    name: "Selection Feedback",
    description: "Brief pulse on selection",
    intensity: 0.5,
    duration: 50,
    pattern: [1, 0],
    device: "both"
  },
  {
    id: "haptic-grab",
    name: "Grab Feedback",
    description: "Strong pulse when grabbing",
    intensity: 0.8,
    duration: 100,
    pattern: [1, 0, 0.5, 0],
    device: "both"
  },
  {
    id: "haptic-error",
    name: "Error Feedback",
    description: "Triple pulse for errors",
    intensity: 0.6,
    duration: 200,
    pattern: [1, 0, 1, 0, 1, 0],
    device: "both"
  },
  {
    id: "haptic-success",
    name: "Success Feedback",
    description: "Rising pulse for success",
    intensity: 0.7,
    duration: 150,
    pattern: [0.3, 0, 0.6, 0, 1, 0],
    device: "both"
  },
  {
    id: "haptic-hover",
    name: "Hover Feedback",
    description: "Light pulse on hover",
    intensity: 0.2,
    duration: 30,
    pattern: [1, 0],
    device: "controller"
  },
  {
    id: "haptic-portal",
    name: "Portal Transition",
    description: "Wave effect for portal",
    intensity: 0.9,
    duration: 500,
    pattern: [0.2, 0.4, 0.6, 0.8, 1, 0.8, 0.6, 0.4, 0.2, 0],
    device: "both"
  }
];

const MOCK_VOICE_COMMANDS: VoiceCommand[] = [
  {
    id: "voice-nova-wake",
    phrase: "Hey Nova",
    aliases: ["Nova", "Hi Nova", "Hello Nova"],
    action: "wake_assistant",
    description: "Wake Nova assistant",
    enabled: true,
    confidence: 0.8
  },
  {
    id: "voice-go-home",
    phrase: "Go home",
    aliases: ["Take me home", "Return home", "Home"],
    action: "navigate_home",
    description: "Navigate to home/hub",
    enabled: true,
    confidence: 0.75
  },
  {
    id: "voice-open-menu",
    phrase: "Open menu",
    aliases: ["Show menu", "Menu"],
    action: "open_menu",
    description: "Open main menu",
    enabled: true,
    confidence: 0.7
  },
  {
    id: "voice-close",
    phrase: "Close",
    aliases: ["Close this", "Dismiss", "Exit"],
    action: "close_current",
    description: "Close current panel",
    enabled: true,
    confidence: 0.75
  },
  {
    id: "voice-select",
    phrase: "Select this",
    aliases: ["Select", "Choose this", "Pick this"],
    action: "select_focused",
    description: "Select focused item",
    enabled: true,
    confidence: 0.7
  },
  {
    id: "voice-help",
    phrase: "Help",
    aliases: ["I need help", "Show help", "What can I do"],
    action: "show_help",
    description: "Show help overlay",
    enabled: true,
    confidence: 0.8
  },
  {
    id: "voice-sphere",
    phrase: "Go to [sphere]",
    aliases: ["Open [sphere]", "Show [sphere]", "Navigate to [sphere]"],
    action: "navigate_sphere",
    description: "Navigate to specific sphere",
    enabled: true,
    confidence: 0.75
  }
];

const MOCK_PROFILES: InteractionProfile[] = [
  {
    id: "profile-vr-default",
    name: "VR Default",
    description: "Standard VR interaction profile with controllers",
    defaultDevice: "controller",
    bindings: ["bind-controller-trigger", "bind-controller-grip", "bind-controller-thumbstick", "bind-controller-a", "bind-controller-b"],
    gestures: [],
    voiceCommands: ["voice-nova-wake", "voice-go-home", "voice-help"],
    hapticEnabled: true
  },
  {
    id: "profile-hand-tracking",
    name: "Hand Tracking",
    description: "Natural hand interaction profile",
    defaultDevice: "hand",
    bindings: ["bind-hand-pinch"],
    gestures: ["gesture-pinch-select", "gesture-point-aim", "gesture-fist-grab", "gesture-open-release", "gesture-wave-greet"],
    voiceCommands: ["voice-nova-wake", "voice-go-home", "voice-open-menu", "voice-close", "voice-help"],
    hapticEnabled: false
  },
  {
    id: "profile-gaze-only",
    name: "Gaze Only",
    description: "Eye-tracking based interaction",
    defaultDevice: "gaze",
    bindings: ["bind-gaze-focus", "bind-gaze-dwell"],
    gestures: [],
    voiceCommands: ["voice-nova-wake", "voice-select", "voice-close", "voice-help", "voice-sphere"],
    hapticEnabled: false
  },
  {
    id: "profile-accessibility",
    name: "Accessibility",
    description: "Enhanced accessibility profile",
    defaultDevice: "voice",
    bindings: ["bind-gaze-focus"],
    gestures: ["gesture-thumbsup-confirm", "gesture-wave-greet"],
    voiceCommands: ["voice-nova-wake", "voice-go-home", "voice-open-menu", "voice-close", "voice-select", "voice-help", "voice-sphere"],
    hapticEnabled: true
  },
  {
    id: "profile-desktop",
    name: "Desktop",
    description: "Mouse and keyboard for desktop VR",
    defaultDevice: "mouse",
    bindings: ["bind-mouse-click"],
    gestures: [],
    voiceCommands: [],
    hapticEnabled: false
  }
];

// ============================================================
// ADAPTER FUNCTIONS
// ============================================================

/**
 * Get all interaction targets
 */
export function getAllTargets(): InteractionTarget[] {
  return [...MOCK_TARGETS];
}

/**
 * Get target by ID
 */
export function getTargetById(id: string): InteractionTarget | undefined {
  return MOCK_TARGETS.find(target => target.id === id);
}

/**
 * Get interactable targets
 */
export function getInteractableTargets(): InteractionTarget[] {
  return MOCK_TARGETS.filter(target => target.interactable);
}

/**
 * Get targets by type
 */
export function getTargetsByType(type: InteractionTarget["type"]): InteractionTarget[] {
  return MOCK_TARGETS.filter(target => target.type === type);
}

/**
 * Get all gesture definitions
 */
export function getAllGestures(): GestureDefinition[] {
  return [...MOCK_GESTURES];
}

/**
 * Get gesture by ID
 */
export function getGestureById(id: string): GestureDefinition | undefined {
  return MOCK_GESTURES.find(gesture => gesture.id === id);
}

/**
 * Get gestures by type
 */
export function getGesturesByType(type: GestureType): GestureDefinition[] {
  return MOCK_GESTURES.filter(gesture => gesture.type === type);
}

/**
 * Get gestures for hand
 */
export function getGesturesForHand(hand: "left" | "right"): GestureDefinition[] {
  return MOCK_GESTURES.filter(g => 
    g.requiredHand === hand || 
    g.requiredHand === "any" || 
    g.requiredHand === "both"
  );
}

/**
 * Get all input bindings
 */
export function getAllBindings(): InputBinding[] {
  return [...MOCK_BINDINGS];
}

/**
 * Get binding by ID
 */
export function getBindingById(id: string): InputBinding | undefined {
  return MOCK_BINDINGS.find(binding => binding.id === id);
}

/**
 * Get bindings for device
 */
export function getBindingsForDevice(device: InputDevice): InputBinding[] {
  return MOCK_BINDINGS.filter(binding => binding.device === device);
}

/**
 * Get enabled bindings
 */
export function getEnabledBindings(): InputBinding[] {
  return MOCK_BINDINGS.filter(binding => binding.enabled);
}

/**
 * Get all haptic patterns
 */
export function getAllHaptics(): HapticPattern[] {
  return [...MOCK_HAPTICS];
}

/**
 * Get haptic by ID
 */
export function getHapticById(id: string): HapticPattern | undefined {
  return MOCK_HAPTICS.find(haptic => haptic.id === id);
}

/**
 * Get all voice commands
 */
export function getAllVoiceCommands(): VoiceCommand[] {
  return [...MOCK_VOICE_COMMANDS];
}

/**
 * Get voice command by ID
 */
export function getVoiceCommandById(id: string): VoiceCommand | undefined {
  return MOCK_VOICE_COMMANDS.find(cmd => cmd.id === id);
}

/**
 * Get enabled voice commands
 */
export function getEnabledVoiceCommands(): VoiceCommand[] {
  return MOCK_VOICE_COMMANDS.filter(cmd => cmd.enabled);
}

/**
 * Get all interaction profiles
 */
export function getAllProfiles(): InteractionProfile[] {
  return [...MOCK_PROFILES];
}

/**
 * Get profile by ID
 */
export function getProfileById(id: string): InteractionProfile | undefined {
  return MOCK_PROFILES.find(profile => profile.id === id);
}

/**
 * Get profile for device
 */
export function getProfileForDevice(device: InputDevice): InteractionProfile | undefined {
  return MOCK_PROFILES.find(profile => profile.defaultDevice === device);
}

/**
 * Get available input devices
 */
export function getAvailableDevices(): InputDevice[] {
  return ["controller", "hand", "gaze", "mouse", "touch", "voice"];
}

/**
 * Get available interaction types
 */
export function getAvailableInteractionTypes(): InteractionType[] {
  return ["click", "hover", "grab", "point", "gaze", "voice", "gesture"];
}

/**
 * Get interaction statistics
 */
export function getInteractionStats(): {
  targetCount: number;
  gestureCount: number;
  bindingCount: number;
  voiceCommandCount: number;
  profileCount: number;
} {
  return {
    targetCount: MOCK_TARGETS.length,
    gestureCount: MOCK_GESTURES.length,
    bindingCount: MOCK_BINDINGS.length,
    voiceCommandCount: MOCK_VOICE_COMMANDS.length,
    profileCount: MOCK_PROFILES.length
  };
}

export default {
  getAllTargets,
  getTargetById,
  getInteractableTargets,
  getTargetsByType,
  getAllGestures,
  getGestureById,
  getGesturesByType,
  getGesturesForHand,
  getAllBindings,
  getBindingById,
  getBindingsForDevice,
  getEnabledBindings,
  getAllHaptics,
  getHapticById,
  getAllVoiceCommands,
  getVoiceCommandById,
  getEnabledVoiceCommands,
  getAllProfiles,
  getProfileById,
  getProfileForDevice,
  getAvailableDevices,
  getAvailableInteractionTypes,
  getInteractionStats
};
