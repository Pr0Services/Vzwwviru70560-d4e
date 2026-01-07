/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — ADAPTERS INDEX
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Central export for all data adapters.
 */

// ============================================================
// CORE ADAPTERS
// ============================================================

// Universe Adapter - Root spheres and domains
export * from "./universeAdapter";

// Context Adapter - Contextual data
export * from "./contextAdapter";

// Tool Adapter - Tools and utilities
export * from "./toolAdapter";

// Process Adapter - Processes and workflows
export * from "./processAdapter";

// Project Adapter - Projects and tasks
export * from "./projectAdapter";

// Template Adapter - Templates and blueprints
export * from "./templateAdapter";

// Memory Adapter - Memory entries (read-only, external)
export * from "./memoryAdapter";

// ============================================================
// XR ADAPTERS
// ============================================================

// XR Scene Adapter - Scenes, environments, lighting
export * from "./xrSceneAdapter";

// XR Avatar Adapter - Avatars, presets, directors
export * from "./xrAvatarAdapter";

// XR Spatial Adapter - Zones, paths, navigation
export * from "./xrSpatialAdapter";

// XR Interaction Adapter - Gestures, inputs, voice
export * from "./xrInteractionAdapter";

// XR Session Adapter - Session management, settings
export * from "./xrSessionAdapter";
