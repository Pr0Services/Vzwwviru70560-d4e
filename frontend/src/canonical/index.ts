/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — CANONICAL EXPORTS (COMPLIANCE CORRECTED)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * All exports respect COMPLIANCE_RULES.md
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Compliance rules
export { AGENT_COMPLIANCE_RULES } from './MINIMAL_AGENTS_CANONICAL';
export { CHANNEL_COMPLIANCE } from './SYSTEM_CHANNEL_CANONICAL';
export { MEETING_COMPLIANCE, validateMeetingCompliance } from './MEETING_TYPES_CANONICAL';
export { XR_COMPLIANCE, validateXRCompliance } from './XR_DECISION_ROOM_CANONICAL';
export { MEMORY_COMPLIANCE, validateForStorage, NEVER_STORED } from './MEMORY_POST_MEETING_CANONICAL';

// Sphères
export * from './SPHERES_CANONICAL_V2';

// Agents système minimaux
export * from './MINIMAL_AGENTS_CANONICAL';

// Agents par sphère
export * from './SPHERE_AGENTS_CANONICAL';

// UniverseView
export * from './UNIVERSE_VIEW_TYPES';

// System Channel
export * from './SYSTEM_CHANNEL_CANONICAL';

// Meetings
export * from './MEETING_TYPES_CANONICAL';
export * from './MEETING_UI_CANONICAL';

// XR
export * from './XR_DECISION_ROOM_CANONICAL';

// Memory
export * from './MEMORY_POST_MEETING_CANONICAL';
