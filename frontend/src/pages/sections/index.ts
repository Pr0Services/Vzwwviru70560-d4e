/**
 * CHE·NU™ V71 — Bureau Sections
 * 
 * 6 Canonical Sections per Sphere:
 * 1. QuickCapture - Capture rapide
 * 2. ResumeWorkspace - Espace de travail
 * 3. Threads - Conversations
 * 4. DataFiles - Données & Fichiers
 * 5. ActiveAgents - Agents Actifs
 * 6. Meetings - Réunions
 */

export { default as QuickCaptureSection } from './QuickCaptureSection';
export { default as ResumeWorkspaceSection } from './ResumeWorkspaceSection';
export { default as ThreadsSection } from './ThreadsSection';
export { default as DataFilesSection } from './DataFilesSection';
export { default as ActiveAgentsSection } from './ActiveAgentsSection';
export { default as MeetingsSection } from './MeetingsSection';

// Section IDs and metadata
export const SECTION_IDS = [
  'quickcapture',
  'resumeworkspace',
  'threads',
  'datafiles',
  'activeagents',
  'meetings'
] as const;

export type SectionId = typeof SECTION_IDS[number];

export const SECTION_COMPONENTS = {
  quickcapture: 'QuickCaptureSection',
  resumeworkspace: 'ResumeWorkspaceSection',
  threads: 'ThreadsSection',
  datafiles: 'DataFilesSection',
  activeagents: 'ActiveAgentsSection',
  meetings: 'MeetingsSection'
} as const;
