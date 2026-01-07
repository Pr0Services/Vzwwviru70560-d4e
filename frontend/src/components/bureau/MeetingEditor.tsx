/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║                   CHE·NU™ V50 — MEETING EDITOR                               ║
 * ║                   (Knowledge Event Creator)                                  ║
 * ║                                                                              ║
 * ║  In CHE·NU, meetings are not mere video calls — they are KNOWLEDGE EVENTS   ║
 * ║  that generate structured, actionable, and replayable artifacts:            ║
 * ║                                                                              ║
 * ║  • Structured Notes (by topic, speaker, chronology)                         ║
 * ║  • Tasks (extracted with assignees and deadlines)                           ║
 * ║  • Decisions (captured with context and rationale)                          ║
 * ║  • DataSpace Updates (automatic synchronization)                            ║
 * ║  • Replayable Content (indexed, searchable)                                 ║
 * ║                                                                              ║
 * ║  Meeting Types: Real-Time | Asynchronous | Hybrid | XR Spatial              ║
 * ║                                                                              ║
 * ║  GOUVERNANCE > EXÉCUTION                                                    ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS — CHE·NU Brand Colors
// ═══════════════════════════════════════════════════════════════════════════════

const CHENU_COLORS = {
  // Primary Brand
  sacredGold: '#D8B26A',
  sacredGoldDark: '#B8924A',
  sacredGoldLight: '#E8C88A',
  
  // Nature Palette
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  ancientStone: '#8D8371',
  
  // UI Colors
  uiSlate: '#1E1F22',
  uiSlateLight: '#2A2B30',
  softSand: '#E9E4D6',
  softSandMuted: '#B8B0A8',
  
  // Semantic Colors
  success: '#4ade80',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Backgrounds
  bgPrimary: '#0a0d0b',
  bgSecondary: '#111113',
  bgTertiary: '#1a1a1c',
  bgHover: '#252528',
  
  // Borders
  borderDefault: 'rgba(141, 131, 113, 0.2)',
  borderHover: 'rgba(216, 178, 106, 0.3)',
  borderFocus: 'rgba(216, 178, 106, 0.5)',
};

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES — Meeting Data Model
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Meeting type determines the collaboration modality
 */
type MeetingType = 'sync' | 'async' | 'hybrid' | 'xr_spatial';

/**
 * Meeting category for classification
 */
type MeetingCategory = 'standup' | 'planning' | 'review' | 'decision' | 'brainstorm' | 'presentation' | 'workshop' | 'other';

/**
 * Meeting status in its lifecycle
 */
type MeetingStatus = 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';

/**
 * Participant role in a meeting
 */
type ParticipantRole = 'host' | 'co_host' | 'presenter' | 'participant' | 'observer' | 'agent';

/**
 * Recording consent status
 */
type ConsentStatus = 'pending' | 'granted' | 'denied';

/**
 * Meeting participant with role and consent
 */
interface MeetingParticipant {
  id: string;
  name: string;
  email?: string;
  role: ParticipantRole;
  avatar?: string;
  isAgent?: boolean;
  isRequired: boolean;
  rsvpStatus: 'pending' | 'accepted' | 'declined' | 'tentative';
  recordingConsent: ConsentStatus;
  aiParticipationConsent: ConsentStatus;
  addedAt: string;
}

/**
 * Agenda item structure
 */
interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  duration: number; // minutes
  presenter?: string;
  type: 'discussion' | 'presentation' | 'decision' | 'brainstorm' | 'break' | 'other';
  order: number;
  isCompleted?: boolean;
  notes?: string;
}

/**
 * Recurrence configuration
 */
interface RecurrenceConfig {
  enabled: boolean;
  pattern: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
  interval: number;
  daysOfWeek?: number[]; // 0-6 for weekly
  endDate?: string;
  occurrences?: number;
}

/**
 * XR/Spatial meeting settings
 */
interface XRSettings {
  enabled: boolean;
  environment: 'office' | 'nature' | 'abstract' | 'custom';
  spatialAudio: boolean;
  allow3DObjects: boolean;
  recordSpatialSession: boolean;
}

/**
 * Meeting governance settings
 */
interface MeetingGovernance {
  requireConsent: {
    recording: boolean;
    aiParticipation: boolean;
    externalSharing: boolean;
  };
  autoGenerateArtifacts: {
    notes: boolean;
    tasks: boolean;
    decisions: boolean;
    summary: boolean;
  };
  allowAgentInterruption: boolean;
  maxTokenBudget: number;
  auditLevel: 'minimal' | 'standard' | 'comprehensive';
}

/**
 * Linked context for the meeting
 */
interface MeetingContext {
  sphereId: string;
  projectId?: string;
  threadIds: string[];
  dataspaceIds: string[];
  previousMeetingId?: string;
}

/**
 * Complete Meeting data structure
 */
interface Meeting {
  id: string;
  title: string;
  description: string;
  
  // Type & Category
  meetingType: MeetingType;
  category: MeetingCategory;
  status: MeetingStatus;
  
  // Schedule
  scheduledAt: string;
  duration: number; // minutes
  timezone: string;
  recurrence?: RecurrenceConfig;
  
  // Participants
  organizer: MeetingParticipant;
  participants: MeetingParticipant[];
  
  // Agenda
  agenda: AgendaItem[];
  
  // Token Economy
  tokenBudget: number;
  tokensUsed: number;
  
  // Context
  context: MeetingContext;
  tags: string[];
  
  // Settings
  xrSettings: XRSettings;
  governance: MeetingGovernance;
  
  // Outputs (populated after meeting)
  outputs?: {
    notes?: string;
    decisions?: string[];
    tasks?: { task: string; assignee: string; deadline?: string }[];
    recordingUrl?: string;
    transcriptUrl?: string;
  };
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * Props for the MeetingEditor component
 */
interface MeetingEditorProps {
  meeting?: Meeting;
  sphereId: string;
  projectId?: string;
  onSave: (meeting: Partial<Meeting>) => Promise<void>;
  onClose: () => void;
  onDelete?: (meetingId: string) => Promise<void>;
  availableParticipants?: MeetingParticipant[];
  availableThreads?: { id: string; title: string }[];
  availableSpheres?: { id: string; name: string; emoji: string }[];
  availableProjects?: { id: string; name: string }[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const MEETING_TYPES: { value: MeetingType; label: string; icon: string; description: string }[] = [
  { 
    value: 'sync', 
    label: 'Temps réel', 
    icon: '🎥', 
    description: 'Tous les participants en même temps' 
  },
  { 
    value: 'async', 
    label: 'Asynchrone', 
    icon: '⏱️', 
    description: 'Contributions à des moments différents' 
  },
  { 
    value: 'hybrid', 
    label: 'Hybride', 
    icon: '🔄', 
    description: 'Mélange temps réel et asynchrone' 
  },
  { 
    value: 'xr_spatial', 
    label: 'XR Spatial', 
    icon: '🥽', 
    description: 'Réunion immersive en réalité étendue' 
  },
];

const MEETING_CATEGORIES: { value: MeetingCategory; label: string; icon: string; defaultDuration: number }[] = [
  { value: 'standup', label: 'Stand-up', icon: '🌅', defaultDuration: 15 },
  { value: 'planning', label: 'Planification', icon: '📋', defaultDuration: 60 },
  { value: 'review', label: 'Revue', icon: '🔍', defaultDuration: 45 },
  { value: 'decision', label: 'Prise de décision', icon: '⚖️', defaultDuration: 30 },
  { value: 'brainstorm', label: 'Brainstorming', icon: '💡', defaultDuration: 60 },
  { value: 'presentation', label: 'Présentation', icon: '📊', defaultDuration: 45 },
  { value: 'workshop', label: 'Atelier', icon: '🛠️', defaultDuration: 90 },
  { value: 'other', label: 'Autre', icon: '📅', defaultDuration: 30 },
];

const AGENDA_ITEM_TYPES: { value: AgendaItem['type']; label: string; icon: string }[] = [
  { value: 'discussion', label: 'Discussion', icon: '💬' },
  { value: 'presentation', label: 'Présentation', icon: '📊' },
  { value: 'decision', label: 'Décision', icon: '⚖️' },
  { value: 'brainstorm', label: 'Brainstorming', icon: '💡' },
  { value: 'break', label: 'Pause', icon: '☕' },
  { value: 'other', label: 'Autre', icon: '📌' },
];

const DURATION_PRESETS = [15, 30, 45, 60, 90, 120];

const XR_ENVIRONMENTS: { value: XRSettings['environment']; label: string; icon: string }[] = [
  { value: 'office', label: 'Bureau virtuel', icon: '🏢' },
  { value: 'nature', label: 'Nature', icon: '🌳' },
  { value: 'abstract', label: 'Abstrait', icon: '✨' },
  { value: 'custom', label: 'Personnalisé', icon: '🎨' },
];

const DEFAULT_SPHERES = [
  { id: 'personal', name: 'Personal', emoji: '🏠' },
  { id: 'business', name: 'Business', emoji: '💼' },
  { id: 'government', name: 'Government & Institutions', emoji: '🏛️' },
  { id: 'design_studio', name: 'Studio de création', emoji: '🎨' },
  { id: 'community', name: 'Community', emoji: '👥' },
  { id: 'social', name: 'Social & Media', emoji: '📱' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬' },
  { id: 'my_team', name: 'My Team', emoji: '🤝' },
  { id: 'scholars', name: 'Scholar', emoji: '📚' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  // Modal Overlay
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '24px',
    backdropFilter: 'blur(4px)',
  },
  
  // Modal Container
  modal: {
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    backgroundColor: CHENU_COLORS.bgSecondary,
    borderRadius: '16px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  
  // Header
  header: {
    padding: '20px 24px',
    borderBottom: `1px solid ${CHENU_COLORS.borderDefault}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: CHENU_COLORS.bgTertiary,
  },
  
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  
  headerIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
  },
  
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    margin: 0,
  },
  
  subtitle: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  
  closeButton: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    transition: 'all 0.2s ease',
  },
  
  // Content
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
  },
  
  // Tabs
  tabs: {
    display: 'flex',
    gap: '4px',
    marginBottom: '24px',
    padding: '4px',
    backgroundColor: CHENU_COLORS.bgPrimary,
    borderRadius: '10px',
    overflowX: 'auto',
  },
  
  tab: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSandMuted,
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
  },
  
  tabActive: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
  },
  
  // Form Elements
  formSection: {
    marginBottom: '24px',
  },
  
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 700,
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  formGroup: {
    marginBottom: '16px',
  },
  
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.softSandMuted,
    marginBottom: '8px',
  },
  
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: CHENU_COLORS.bgPrimary,
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  },
  
  textarea: {
    width: '100%',
    minHeight: '80px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: CHENU_COLORS.bgPrimary,
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  
  select: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: CHENU_COLORS.bgPrimary,
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  
  // Meeting Type Grid
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  
  typeOption: {
    padding: '16px 12px',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: CHENU_COLORS.bgPrimary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
  },
  
  typeOptionSelected: {
    borderColor: CHENU_COLORS.cenoteTurquoise,
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '11',
  },
  
  typeIcon: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  
  typeLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  
  typeDesc: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    lineHeight: 1.3,
  },
  
  // Category chips
  categoryChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  
  categoryChip: {
    padding: '8px 14px',
    borderRadius: '20px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSandMuted,
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  
  categoryChipSelected: {
    borderColor: CHENU_COLORS.sacredGold,
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    color: CHENU_COLORS.sacredGold,
  },
  
  // Schedule section
  scheduleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
  },
  
  durationPresets: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  
  durationPreset: {
    padding: '6px 12px',
    borderRadius: '16px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSandMuted,
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  durationPresetSelected: {
    borderColor: CHENU_COLORS.sacredGold,
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    color: CHENU_COLORS.sacredGold,
  },
  
  // Participants
  participantsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px',
  },
  
  participantItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: CHENU_COLORS.bgPrimary,
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
  },
  
  participantAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
    flexShrink: 0,
  },
  
  participantInfo: {
    flex: 1,
    minWidth: 0,
  },
  
  participantName: {
    fontSize: '14px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
  },
  
  participantMeta: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    display: 'flex',
    gap: '8px',
    marginTop: '2px',
  },
  
  roleSelect: {
    padding: '6px 10px',
    borderRadius: '6px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: CHENU_COLORS.bgTertiary,
    color: CHENU_COLORS.softSand,
    fontSize: '11px',
    cursor: 'pointer',
  },
  
  participantRemove: {
    padding: '6px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    cursor: 'pointer',
    fontSize: '16px',
  },
  
  addParticipantBtn: {
    padding: '12px',
    borderRadius: '8px',
    border: `1px dashed ${CHENU_COLORS.borderDefault}`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    width: '100%',
  },
  
  // Agenda
  agendaList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '12px',
  },
  
  agendaItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '14px',
    borderRadius: '10px',
    backgroundColor: CHENU_COLORS.bgPrimary,
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
  },
  
  agendaDrag: {
    cursor: 'grab',
    color: CHENU_COLORS.ancientStone,
    padding: '4px',
  },
  
  agendaNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '22',
    color: CHENU_COLORS.cenoteTurquoise,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600,
    flexShrink: 0,
  },
  
  agendaContent: {
    flex: 1,
    minWidth: 0,
  },
  
  agendaTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  
  agendaMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  
  agendaActions: {
    display: 'flex',
    gap: '4px',
  },
  
  agendaActionBtn: {
    padding: '6px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    cursor: 'pointer',
    fontSize: '14px',
  },
  
  addAgendaBtn: {
    padding: '12px',
    borderRadius: '8px',
    border: `1px dashed ${CHENU_COLORS.borderDefault}`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
  },
  
  // Agenda Editor Modal
  agendaEditor: {
    padding: '16px',
    borderRadius: '10px',
    backgroundColor: CHENU_COLORS.bgTertiary,
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    marginBottom: '12px',
  },
  
  agendaEditorGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '12px',
    marginBottom: '12px',
  },
  
  // XR Settings
  xrToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderRadius: '10px',
    backgroundColor: CHENU_COLORS.bgPrimary,
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    marginBottom: '16px',
  },
  
  xrEnvironments: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  
  xrEnvOption: {
    padding: '16px 12px',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: CHENU_COLORS.bgPrimary,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease',
  },
  
  xrEnvSelected: {
    borderColor: CHENU_COLORS.cenoteTurquoise,
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '11',
  },
  
  // Governance
  governanceOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: CHENU_COLORS.bgPrimary,
    marginBottom: '8px',
    cursor: 'pointer',
  },
  
  checkbox: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: `2px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  
  checkboxChecked: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    borderColor: CHENU_COLORS.cenoteTurquoise,
  },
  
  toggle: {
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    backgroundColor: CHENU_COLORS.bgTertiary,
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  toggleActive: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    borderColor: CHENU_COLORS.cenoteTurquoise,
  },
  
  toggleKnob: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: CHENU_COLORS.softSand,
    transition: 'all 0.2s ease',
  },
  
  toggleKnobActive: {
    left: '22px',
  },
  
  // Info Box
  infoBox: {
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '11',
    border: `1px solid ${CHENU_COLORS.cenoteTurquoise}33`,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '16px',
  },
  
  infoIcon: {
    fontSize: '16px',
    marginTop: '2px',
  },
  
  infoText: {
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
    lineHeight: 1.5,
  },
  
  // Summary Card
  summaryCard: {
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: CHENU_COLORS.bgPrimary,
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    marginBottom: '16px',
  },
  
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: `1px solid ${CHENU_COLORS.borderDefault}`,
  },
  
  summaryLabel: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  
  summaryValue: {
    fontSize: '13px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
  },
  
  // Footer
  footer: {
    padding: '16px 24px',
    borderTop: `1px solid ${CHENU_COLORS.borderDefault}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: CHENU_COLORS.bgTertiary,
  },
  
  footerLeft: {
    display: 'flex',
    gap: '12px',
  },
  
  footerRight: {
    display: 'flex',
    gap: '12px',
  },
  
  btnSecondary: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  btnPrimary: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  btnDanger: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.error}44`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.error,
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  // Inline Grid
  inlineGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  
  // Tags
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  
  tag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '16px',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    color: CHENU_COLORS.sacredGold,
    fontSize: '12px',
  },
  
  tagRemove: {
    cursor: 'pointer',
    opacity: 0.7,
  },
  
  tagInput: {
    flex: 1,
    minWidth: '120px',
    padding: '6px 12px',
    borderRadius: '16px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '12px',
    outline: 'none',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Toggle Switch Component
 */
const Toggle: React.FC<{ checked: boolean; onChange: () => void; disabled?: boolean }> = ({ 
  checked, 
  onChange, 
  disabled 
}) => (
  <div 
    style={{ 
      ...styles.toggle, 
      ...(checked ? styles.toggleActive : {}),
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}
    onClick={() => !disabled && onChange()}
  >
    <div style={{ 
      ...styles.toggleKnob, 
      ...(checked ? styles.toggleKnobActive : {}) 
    }} />
  </div>
);

/**
 * Duration formatter
 */
const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

/**
 * Calculate total agenda duration
 */
const calculateTotalAgendaDuration = (agenda: AgendaItem[]): number => {
  return agenda.reduce((sum, item) => sum + item.duration, 0);
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

type EditorTab = 'details' | 'schedule' | 'participants' | 'agenda' | 'xr' | 'governance';

const MeetingEditor: React.FC<MeetingEditorProps> = ({
  meeting,
  sphereId,
  projectId,
  onSave,
  onClose,
  onDelete,
  availableParticipants = [],
  availableThreads = [],
  availableSpheres = DEFAULT_SPHERES,
  availableProjects = [],
}) => {
  // ─────────────────────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────────────────────
  
  const [activeTab, setActiveTab] = useState<EditorTab>('details');
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Basic Details
  const [title, setTitle] = useState(meeting?.title || '');
  const [description, setDescription] = useState(meeting?.description || '');
  const [meetingType, setMeetingType] = useState<MeetingType>(meeting?.meetingType || 'sync');
  const [category, setCategory] = useState<MeetingCategory>(meeting?.category || 'other');
  const [selectedSphereId, setSelectedSphereId] = useState(meeting?.context?.sphereId || sphereId);
  const [selectedProjectId, setSelectedProjectId] = useState(meeting?.context?.projectId || projectId);
  
  // Schedule
  const [scheduledDate, setScheduledDate] = useState(
    meeting?.scheduledAt ? meeting.scheduledAt.split('T')[0] : ''
  );
  const [scheduledTime, setScheduledTime] = useState(
    meeting?.scheduledAt ? meeting.scheduledAt.split('T')[1]?.slice(0, 5) : ''
  );
  const [duration, setDuration] = useState(meeting?.duration || 30);
  const [timezone] = useState(meeting?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
  
  // Recurrence
  const [recurrenceEnabled, setRecurrenceEnabled] = useState(meeting?.recurrence?.enabled || false);
  const [recurrencePattern, setRecurrencePattern] = useState(meeting?.recurrence?.pattern || 'weekly');
  
  // Participants
  const [participants, setParticipants] = useState<MeetingParticipant[]>(
    meeting?.participants || [
      // Nova as context agent
      {
        id: 'nova',
        name: 'Nova',
        role: 'agent',
        isAgent: true,
        isRequired: true,
        rsvpStatus: 'accepted',
        recordingConsent: 'granted',
        aiParticipationConsent: 'granted',
        addedAt: new Date().toISOString(),
      }
    ]
  );
  
  // Agenda
  const [agenda, setAgenda] = useState<AgendaItem[]>(meeting?.agenda || []);
  const [editingAgendaItem, setEditingAgendaItem] = useState<AgendaItem | null>(null);
  const [newAgendaTitle, setNewAgendaTitle] = useState('');
  const [newAgendaDuration, setNewAgendaDuration] = useState(10);
  const [newAgendaType, setNewAgendaType] = useState<AgendaItem['type']>('discussion');
  
  // Tags
  const [tags, setTags] = useState<string[]>(meeting?.tags || []);
  const [tagInput, setTagInput] = useState('');
  
  // XR Settings
  const [xrEnabled, setXrEnabled] = useState(meeting?.xrSettings?.enabled || false);
  const [xrEnvironment, setXrEnvironment] = useState<XRSettings['environment']>(
    meeting?.xrSettings?.environment || 'office'
  );
  const [xrSpatialAudio, setXrSpatialAudio] = useState(meeting?.xrSettings?.spatialAudio ?? true);
  const [xrAllow3D, setXrAllow3D] = useState(meeting?.xrSettings?.allow3DObjects ?? true);
  
  // Governance
  const [requireRecordingConsent, setRequireRecordingConsent] = useState(
    meeting?.governance?.requireConsent?.recording ?? true
  );
  const [requireAIConsent, setRequireAIConsent] = useState(
    meeting?.governance?.requireConsent?.aiParticipation ?? true
  );
  const [autoGenerateNotes, setAutoGenerateNotes] = useState(
    meeting?.governance?.autoGenerateArtifacts?.notes ?? true
  );
  const [autoGenerateTasks, setAutoGenerateTasks] = useState(
    meeting?.governance?.autoGenerateArtifacts?.tasks ?? true
  );
  const [autoGenerateDecisions, setAutoGenerateDecisions] = useState(
    meeting?.governance?.autoGenerateArtifacts?.decisions ?? true
  );
  const [autoGenerateSummary, setAutoGenerateSummary] = useState(
    meeting?.governance?.autoGenerateArtifacts?.summary ?? true
  );
  const [tokenBudget, setTokenBudget] = useState(meeting?.tokenBudget || 1000);
  
  // Participant picker
  const [showParticipantPicker, setShowParticipantPicker] = useState(false);
  const [participantSearch, setParticipantSearch] = useState('');
  
  // Linked Threads
  const [linkedThreadIds, setLinkedThreadIds] = useState<string[]>(meeting?.context?.threadIds || []);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Keyboard Shortcuts
  // ─────────────────────────────────────────────────────────────────────────────
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape') {
        if (showParticipantPicker) {
          setShowParticipantPicker(false);
        } else {
          handleClose();
        }
      }
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (canSave && !isSaving) {
          handleSave();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canSave, isSaving, showParticipantPicker]);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Computed values
  // ─────────────────────────────────────────────────────────────────────────────
  
  const isEditing = !!meeting;
  
  const totalAgendaDuration = useMemo(() => calculateTotalAgendaDuration(agenda), [agenda]);
  
  const canSave = useMemo(() => {
    return title.trim().length > 0 && scheduledDate && scheduledTime;
  }, [title, scheduledDate, scheduledTime]);
  
  const scheduledDateTime = useMemo(() => {
    if (!scheduledDate || !scheduledTime) return null;
    return `${scheduledDate}T${scheduledTime}:00`;
  }, [scheduledDate, scheduledTime]);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────────
  
  const handleFieldChange = useCallback(() => {
    setIsDirty(true);
  }, []);
  
  // Tags
  const handleAddTag = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
        handleFieldChange();
      }
      setTagInput('');
    }
  }, [tagInput, tags, handleFieldChange]);
  
  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
    handleFieldChange();
  }, [tags, handleFieldChange]);
  
  // Participants
  const handleRemoveParticipant = useCallback((participantId: string) => {
    if (participantId === 'nova') return;
    setParticipants(participants.filter(p => p.id !== participantId));
    handleFieldChange();
  }, [participants, handleFieldChange]);
  
  const handleParticipantRoleChange = useCallback((participantId: string, newRole: ParticipantRole) => {
    setParticipants(participants.map(p => 
      p.id === participantId ? { ...p, role: newRole } : p
    ));
    handleFieldChange();
  }, [participants, handleFieldChange]);
  
  // Agenda
  const handleAddAgendaItem = useCallback(() => {
    if (!newAgendaTitle.trim()) return;
    
    const newItem: AgendaItem = {
      id: `agenda-${Date.now()}`,
      title: newAgendaTitle.trim(),
      duration: newAgendaDuration,
      type: newAgendaType,
      order: agenda.length,
    };
    
    setAgenda([...agenda, newItem]);
    setNewAgendaTitle('');
    setNewAgendaDuration(10);
    setNewAgendaType('discussion');
    handleFieldChange();
  }, [newAgendaTitle, newAgendaDuration, newAgendaType, agenda, handleFieldChange]);
  
  const handleRemoveAgendaItem = useCallback((itemId: string) => {
    setAgenda(agenda.filter(item => item.id !== itemId).map((item, idx) => ({ ...item, order: idx })));
    handleFieldChange();
  }, [agenda, handleFieldChange]);
  
  const handleMoveAgendaItem = useCallback((itemId: string, direction: 'up' | 'down') => {
    const index = agenda.findIndex(item => item.id === itemId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === agenda.length - 1) return;
    
    const newAgenda = [...agenda];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newAgenda[index], newAgenda[swapIndex]] = [newAgenda[swapIndex], newAgenda[index]];
    
    setAgenda(newAgenda.map((item, idx) => ({ ...item, order: idx })));
    handleFieldChange();
  }, [agenda, handleFieldChange]);
  
  // Save
  const handleSave = useCallback(async () => {
    if (!canSave || !scheduledDateTime) return;
    
    setIsSaving(true);
    
    try {
      const meetingData: Partial<Meeting> = {
        ...(meeting?.id && { id: meeting.id }),
        title: title.trim(),
        description: description.trim(),
        meetingType,
        category,
        status: 'scheduled',
        scheduledAt: scheduledDateTime,
        duration,
        timezone,
        recurrence: recurrenceEnabled ? {
          enabled: true,
          pattern: recurrencePattern as RecurrenceConfig['pattern'],
          interval: 1,
        } : undefined,
        participants,
        agenda,
        tokenBudget,
        context: {
          sphereId: selectedSphereId,
          projectId: selectedProjectId || undefined,
          threadIds: linkedThreadIds,
          dataspaceIds: [],
        },
        tags,
        xrSettings: {
          enabled: xrEnabled,
          environment: xrEnvironment,
          spatialAudio: xrSpatialAudio,
          allow3DObjects: xrAllow3D,
          recordSpatialSession: false,
        },
        governance: {
          requireConsent: {
            recording: requireRecordingConsent,
            aiParticipation: requireAIConsent,
            externalSharing: true,
          },
          autoGenerateArtifacts: {
            notes: autoGenerateNotes,
            tasks: autoGenerateTasks,
            decisions: autoGenerateDecisions,
            summary: autoGenerateSummary,
          },
          allowAgentInterruption: false,
          maxTokenBudget: tokenBudget,
          auditLevel: 'standard',
        },
      };
      
      await onSave(meetingData);
      setIsDirty(false);
    } catch (error) {
      logger.error('Failed to save meeting:', error);
    } finally {
      setIsSaving(false);
    }
  }, [
    canSave, scheduledDateTime, meeting, title, description, meetingType, category,
    duration, timezone, recurrenceEnabled, recurrencePattern, participants, agenda,
    tokenBudget, selectedSphereId, selectedProjectId, tags, xrEnabled, xrEnvironment,
    xrSpatialAudio, xrAllow3D, requireRecordingConsent, requireAIConsent,
    autoGenerateNotes, autoGenerateTasks, autoGenerateDecisions, autoGenerateSummary, onSave
  ]);
  
  const handleClose = useCallback(() => {
    if (isDirty) {
      const confirm = window.confirm('Des modifications non sauvegardées seront perdues. Continuer?');
      if (!confirm) return;
    }
    onClose();
  }, [isDirty, onClose]);
  
  const handleDelete = useCallback(async () => {
    if (!meeting?.id || !onDelete) return;
    
    const confirm = window.confirm(
      'Êtes-vous sûr de vouloir supprimer cette réunion? Cette action est irréversible.'
    );
    if (!confirm) return;
    
    setIsSaving(true);
    try {
      await onDelete(meeting.id);
    } finally {
      setIsSaving(false);
    }
  }, [meeting, onDelete]);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Tab Content Renderers
  // ─────────────────────────────────────────────────────────────────────────────
  
  const renderDetailsTab = () => (
    <>
      <div style={styles.infoBox}>
        <span style={styles.infoIcon}>📅</span>
        <span style={styles.infoText}>
          Dans CHE·NU, les réunions sont des <strong>Knowledge Events</strong> qui génèrent 
          automatiquement des notes structurées, des tâches, des décisions et des artifacts réutilisables.
        </span>
      </div>
      
      {/* Title */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Titre de la réunion *</label>
        <input
          type="text"
          style={styles.input}
          value={title}
          onChange={(e) => { setTitle(e.target.value); handleFieldChange(); }}
          placeholder="Ex: Sprint Planning Q1, Revue de design, Stand-up quotidien..."
          autoFocus
        />
      </div>
      
      {/* Description */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Description / Objectif</label>
        <textarea
          style={styles.textarea}
          value={description}
          onChange={(e) => { setDescription(e.target.value); handleFieldChange(); }}
          placeholder="Décrivez l'objectif principal et les résultats attendus de cette réunion..."
        />
      </div>
      
      {/* Meeting Type */}
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>🎯</span>
          <span>Type de réunion</span>
        </div>
        <div style={styles.typeGrid}>
          {MEETING_TYPES.map((type) => (
            <div
              key={type.value}
              style={{
                ...styles.typeOption,
                ...(meetingType === type.value ? styles.typeOptionSelected : {}),
              }}
              onClick={() => { setMeetingType(type.value); handleFieldChange(); }}
            >
              <div style={styles.typeIcon}>{type.icon}</div>
              <div style={styles.typeLabel}>{type.label}</div>
              <div style={styles.typeDesc}>{type.description}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Category */}
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>📂</span>
          <span>Catégorie</span>
        </div>
        <div style={styles.categoryChips}>
          {MEETING_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              style={{
                ...styles.categoryChip,
                ...(category === cat.value ? styles.categoryChipSelected : {}),
              }}
              onClick={() => { 
                setCategory(cat.value); 
                if (!meeting) setDuration(cat.defaultDuration);
                handleFieldChange(); 
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Sphere & Project */}
      <div style={styles.inlineGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Sphère</label>
          <select
            style={styles.select}
            value={selectedSphereId}
            onChange={(e) => { setSelectedSphereId(e.target.value); handleFieldChange(); }}
          >
            {availableSpheres.map((sphere) => (
              <option key={sphere.id} value={sphere.id}>
                {sphere.emoji} {sphere.name}
              </option>
            ))}
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Projet (optionnel)</label>
          <select
            style={styles.select}
            value={selectedProjectId || ''}
            onChange={(e) => { setSelectedProjectId(e.target.value || undefined); handleFieldChange(); }}
          >
            <option value="">Aucun projet</option>
            {availableProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Tags */}
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>🏷️</span>
          <span>Tags</span>
        </div>
        <div style={styles.tagsContainer}>
          {tags.map((tag) => (
            <span key={tag} style={styles.tag}>
              #{tag}
              <span style={styles.tagRemove} onClick={() => handleRemoveTag(tag)}>×</span>
            </span>
          ))}
          <input
            type="text"
            style={styles.tagInput}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Ajouter un tag..."
          />
        </div>
      </div>
    </>
  );
  
  const renderScheduleTab = () => (
    <>
      {/* Date & Time */}
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>🗓️</span>
          <span>Date et heure</span>
        </div>
        
        <div style={styles.scheduleGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Date *</label>
            <input
              type="date"
              style={styles.input}
              value={scheduledDate}
              onChange={(e) => { setScheduledDate(e.target.value); handleFieldChange(); }}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Heure *</label>
            <input
              type="time"
              style={styles.input}
              value={scheduledTime}
              onChange={(e) => { setScheduledTime(e.target.value); handleFieldChange(); }}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Fuseau horaire</label>
            <input
              type="text"
              style={{ ...styles.input, backgroundColor: CHENU_COLORS.bgTertiary }}
              value={timezone}
              disabled
            />
          </div>
        </div>
      </div>
      
      {/* Duration */}
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>⏱️</span>
          <span>Durée: {formatDuration(duration)}</span>
        </div>
        
        <input
          type="range"
          style={{ width: '100%', marginBottom: '12px' }}
          min={15}
          max={180}
          step={15}
          value={duration}
          onChange={(e) => { setDuration(Number(e.target.value)); handleFieldChange(); }}
        />
        
        <div style={styles.durationPresets}>
          {DURATION_PRESETS.map((preset) => (
            <button
              key={preset}
              style={{
                ...styles.durationPreset,
                ...(duration === preset ? styles.durationPresetSelected : {}),
              }}
              onClick={() => { setDuration(preset); handleFieldChange(); }}
            >
              {formatDuration(preset)}
            </button>
          ))}
        </div>
        
        {totalAgendaDuration > 0 && totalAgendaDuration !== duration && (
          <div style={{
            marginTop: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: totalAgendaDuration > duration ? CHENU_COLORS.warning + '11' : CHENU_COLORS.success + '11',
            border: `1px solid ${totalAgendaDuration > duration ? CHENU_COLORS.warning : CHENU_COLORS.success}33`,
          }}>
            <span style={{ 
              fontSize: '12px', 
              color: totalAgendaDuration > duration ? CHENU_COLORS.warning : CHENU_COLORS.success 
            }}>
              ⚠️ La durée totale de l'agenda ({formatDuration(totalAgendaDuration)}) 
              {totalAgendaDuration > duration ? ' dépasse' : ' est inférieure à'} la durée prévue
            </span>
          </div>
        )}
      </div>
      
      {/* Recurrence */}
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>🔄</span>
          <span>Récurrence</span>
        </div>
        
        <div style={styles.xrToggle}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: CHENU_COLORS.softSand }}>
              Réunion récurrente
            </div>
            <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginTop: '2px' }}>
              Planifier automatiquement les prochaines occurrences
            </div>
          </div>
          <Toggle checked={recurrenceEnabled} onChange={() => { setRecurrenceEnabled(!recurrenceEnabled); handleFieldChange(); }} />
        </div>
        
        {recurrenceEnabled && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Fréquence</label>
            <select
              style={styles.select}
              value={recurrencePattern}
              onChange={(e) => { setRecurrencePattern(e.target.value); handleFieldChange(); }}
            >
              <option value="daily">Tous les jours</option>
              <option value="weekly">Toutes les semaines</option>
              <option value="biweekly">Toutes les 2 semaines</option>
              <option value="monthly">Tous les mois</option>
            </select>
          </div>
        )}
      </div>
    </>
  );
  
  const renderParticipantsTab = () => (
    <>
      <div style={styles.infoBox}>
        <span style={styles.infoIcon}>👥</span>
        <span style={styles.infoText}>
          Chaque participant a un rôle défini. <strong>Nova</strong> est toujours présent 
          comme agent de contexte pour assister la réunion et générer les artifacts.
        </span>
      </div>
      
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>👥</span>
          <span>Participants ({participants.length})</span>
        </div>
        
        <div style={styles.participantsList}>
          {participants.map((participant) => (
            <div key={participant.id} style={styles.participantItem}>
              <div style={{
                ...styles.participantAvatar,
                ...(participant.isAgent 
                  ? { backgroundColor: CHENU_COLORS.cenoteTurquoise + '22', color: CHENU_COLORS.cenoteTurquoise }
                  : participant.role === 'host'
                    ? { backgroundColor: CHENU_COLORS.sacredGold + '22', color: CHENU_COLORS.sacredGold }
                    : {}
                ),
              }}>
                {participant.isAgent ? '🤖' : participant.name.charAt(0).toUpperCase()}
              </div>
              
              <div style={styles.participantInfo}>
                <div style={styles.participantName}>
                  {participant.name}
                  {participant.id === 'nova' && (
                    <span style={{ marginLeft: '8px', fontSize: '11px', color: CHENU_COLORS.cenoteTurquoise }}>
                      (Agent Contexte)
                    </span>
                  )}
                </div>
                <div style={styles.participantMeta}>
                  <span>{participant.isRequired ? '✓ Requis' : '○ Optionnel'}</span>
                  {participant.email && <span>• {participant.email}</span>}
                </div>
              </div>
              
              {participant.id !== 'nova' && (
                <select
                  style={styles.roleSelect}
                  value={participant.role}
                  onChange={(e) => handleParticipantRoleChange(participant.id, e.target.value as ParticipantRole)}
                >
                  <option value="host">Hôte</option>
                  <option value="co_host">Co-hôte</option>
                  <option value="presenter">Présentateur</option>
                  <option value="participant">Participant</option>
                  <option value="observer">Observateur</option>
                </select>
              )}
              
              {participant.id !== 'nova' && (
                <button
                  style={styles.participantRemove}
                  onClick={() => handleRemoveParticipant(participant.id)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button 
          style={styles.addParticipantBtn}
          onClick={() => setShowParticipantPicker(true)}
        >
          <span>+</span>
          <span>Ajouter un participant</span>
        </button>
        
        {/* Participant Picker */}
        {showParticipantPicker && (
          <div style={{
            marginTop: '12px',
            padding: '16px',
            borderRadius: '10px',
            backgroundColor: CHENU_COLORS.bgTertiary,
            border: `1px solid ${CHENU_COLORS.borderDefault}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: CHENU_COLORS.softSand }}>
                Inviter un participant
              </span>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: CHENU_COLORS.ancientStone,
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
                onClick={() => setShowParticipantPicker(false)}
              >
                ×
              </button>
            </div>
            
            <input
              type="text"
              style={{ ...styles.input, marginBottom: '12px' }}
              placeholder="Rechercher par nom ou email..."
              value={participantSearch}
              onChange={(e) => setParticipantSearch(e.target.value)}
              autoFocus
            />
            
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {availableParticipants
                .filter(p => !participants.some(existing => existing.id === p.id))
                .filter(p => 
                  participantSearch === '' ||
                  p.name.toLowerCase().includes(participantSearch.toLowerCase()) ||
                  (p.email && p.email.toLowerCase().includes(participantSearch.toLowerCase()))
                )
                .map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                    }}
                    onClick={() => {
                      const newParticipant: MeetingParticipant = {
                        ...p,
                        role: 'participant',
                        isRequired: false,
                        rsvpStatus: 'pending',
                        recordingConsent: 'pending',
                        aiParticipationConsent: 'pending',
                        addedAt: new Date().toISOString(),
                      };
                      setParticipants([...participants, newParticipant]);
                      setShowParticipantPicker(false);
                      setParticipantSearch('');
                      handleFieldChange();
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = CHENU_COLORS.bgHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: CHENU_COLORS.cenoteTurquoise + '22',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: CHENU_COLORS.cenoteTurquoise,
                    }}>
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', color: CHENU_COLORS.softSand }}>{p.name}</div>
                      {p.email && (
                        <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>{p.email}</div>
                      )}
                    </div>
                  </div>
                ))
              }
              {availableParticipants.length === 0 && (
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center', 
                  color: CHENU_COLORS.ancientStone,
                  fontSize: '12px',
                }}>
                  Tapez un email pour inviter quelqu'un
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Role Legend */}
      <div style={{ ...styles.formSection, marginTop: '24px' }}>
        <div style={styles.sectionTitle}>
          <span>🔑</span>
          <span>Légende des rôles</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {[
            { role: 'Hôte', desc: 'Organise et contrôle la réunion', color: CHENU_COLORS.sacredGold },
            { role: 'Co-hôte', desc: 'Peut gérer les participants', color: CHENU_COLORS.jungleEmerald },
            { role: 'Présentateur', desc: 'Peut partager son écran', color: CHENU_COLORS.cenoteTurquoise },
            { role: 'Participant', desc: 'Peut intervenir et voter', color: CHENU_COLORS.softSand },
            { role: 'Observateur', desc: 'Lecture seule', color: CHENU_COLORS.ancientStone },
            { role: 'Agent', desc: 'IA assistant la réunion', color: CHENU_COLORS.info },
          ].map((item) => (
            <div key={item.role} style={{
              padding: '10px 14px',
              borderRadius: '6px',
              backgroundColor: CHENU_COLORS.bgPrimary,
            }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: item.color }}>{item.role}</span>
              <span style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginLeft: '8px' }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
  
  const renderAgendaTab = () => (
    <>
      <div style={styles.infoBox}>
        <span style={styles.infoIcon}>📋</span>
        <span style={styles.infoText}>
          Un agenda structuré aide Nova à générer des notes organisées par topic et à 
          suivre les décisions prises à chaque point.
        </span>
      </div>
      
      {/* Summary */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        padding: '14px',
        borderRadius: '10px',
        backgroundColor: CHENU_COLORS.bgPrimary,
      }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: CHENU_COLORS.sacredGold }}>
            {agenda.length}
          </div>
          <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>Points</div>
        </div>
        <div style={{ width: '1px', backgroundColor: CHENU_COLORS.borderDefault }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: CHENU_COLORS.cenoteTurquoise }}>
            {formatDuration(totalAgendaDuration)}
          </div>
          <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>Durée totale</div>
        </div>
        <div style={{ width: '1px', backgroundColor: CHENU_COLORS.borderDefault }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: CHENU_COLORS.jungleEmerald }}>
            {formatDuration(duration)}
          </div>
          <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>Durée prévue</div>
        </div>
      </div>
      
      {/* Agenda Items */}
      <div style={styles.agendaList}>
        {agenda.map((item, index) => (
          <div key={item.id} style={styles.agendaItem}>
            <div style={styles.agendaDrag}>⋮⋮</div>
            <div style={styles.agendaNumber}>{index + 1}</div>
            <div style={styles.agendaContent}>
              <div style={styles.agendaTitle}>{item.title}</div>
              <div style={styles.agendaMeta}>
                <span>{AGENDA_ITEM_TYPES.find(t => t.value === item.type)?.icon} {AGENDA_ITEM_TYPES.find(t => t.value === item.type)?.label}</span>
                <span>⏱️ {item.duration} min</span>
                {item.presenter && <span>👤 {item.presenter}</span>}
              </div>
            </div>
            <div style={styles.agendaActions}>
              <button
                style={styles.agendaActionBtn}
                onClick={() => handleMoveAgendaItem(item.id, 'up')}
                disabled={index === 0}
              >
                ↑
              </button>
              <button
                style={styles.agendaActionBtn}
                onClick={() => handleMoveAgendaItem(item.id, 'down')}
                disabled={index === agenda.length - 1}
              >
                ↓
              </button>
              <button
                style={styles.agendaActionBtn}
                onClick={() => handleRemoveAgendaItem(item.id)}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add Agenda Item Form */}
      <div style={styles.agendaEditor}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: CHENU_COLORS.softSand, marginBottom: '12px' }}>
          Ajouter un point à l'ordre du jour
        </div>
        <div style={styles.agendaEditorGrid}>
          <input
            type="text"
            style={styles.input}
            value={newAgendaTitle}
            onChange={(e) => setNewAgendaTitle(e.target.value)}
            placeholder="Titre du point..."
            onKeyDown={(e) => e.key === 'Enter' && handleAddAgendaItem()}
          />
          <input
            type="number"
            style={{ ...styles.input, width: '80px' }}
            value={newAgendaDuration}
            onChange={(e) => setNewAgendaDuration(Number(e.target.value))}
            min={5}
            max={120}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {AGENDA_ITEM_TYPES.map((type) => (
            <button
              key={type.value}
              style={{
                ...styles.categoryChip,
                padding: '6px 12px',
                fontSize: '11px',
                ...(newAgendaType === type.value ? styles.categoryChipSelected : {}),
              }}
              onClick={() => setNewAgendaType(type.value)}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
          <button
            style={{
              ...styles.btnPrimary,
              padding: '8px 16px',
              fontSize: '12px',
              marginLeft: 'auto',
            }}
            onClick={handleAddAgendaItem}
            disabled={!newAgendaTitle.trim()}
          >
            + Ajouter
          </button>
        </div>
      </div>
    </>
  );
  
  const renderXRTab = () => (
    <>
      <div style={styles.infoBox}>
        <span style={styles.infoIcon}>🥽</span>
        <span style={styles.infoText}>
          Les réunions XR permettent des collaborations immersives où les participants peuvent 
          manipuler des objets 3D, explorer des données spatiales et collaborer de manière inédite.
        </span>
      </div>
      
      {/* XR Enable Toggle */}
      <div style={styles.xrToggle}>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: CHENU_COLORS.softSand }}>
            🥽 Mode XR Spatial
          </div>
          <div style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone, marginTop: '4px' }}>
            Activer l'environnement de réalité étendue
          </div>
        </div>
        <Toggle checked={xrEnabled} onChange={() => { setXrEnabled(!xrEnabled); handleFieldChange(); }} />
      </div>
      
      {xrEnabled && (
        <>
          {/* Environment */}
          <div style={styles.formSection}>
            <div style={styles.sectionTitle}>
              <span>🌍</span>
              <span>Environnement</span>
            </div>
            <div style={styles.xrEnvironments}>
              {XR_ENVIRONMENTS.map((env) => (
                <div
                  key={env.value}
                  style={{
                    ...styles.xrEnvOption,
                    ...(xrEnvironment === env.value ? styles.xrEnvSelected : {}),
                  }}
                  onClick={() => { setXrEnvironment(env.value); handleFieldChange(); }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{env.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: CHENU_COLORS.softSand }}>
                    {env.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* XR Options */}
          <div style={styles.formSection}>
            <div style={styles.sectionTitle}>
              <span>⚙️</span>
              <span>Options XR</span>
            </div>
            
            <div
              style={styles.governanceOption}
              onClick={() => { setXrSpatialAudio(!xrSpatialAudio); handleFieldChange(); }}
            >
              <div style={{ ...styles.checkbox, ...(xrSpatialAudio ? styles.checkboxChecked : {}) }}>
                {xrSpatialAudio && <span style={{ color: CHENU_COLORS.uiSlate, fontSize: '12px' }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: CHENU_COLORS.softSand }}>Audio spatial</div>
                <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginTop: '2px' }}>
                  Le son provient de la position des participants dans l'espace
                </div>
              </div>
            </div>
            
            <div
              style={styles.governanceOption}
              onClick={() => { setXrAllow3D(!xrAllow3D); handleFieldChange(); }}
            >
              <div style={{ ...styles.checkbox, ...(xrAllow3D ? styles.checkboxChecked : {}) }}>
                {xrAllow3D && <span style={{ color: CHENU_COLORS.uiSlate, fontSize: '12px' }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: CHENU_COLORS.softSand }}>Objets 3D interactifs</div>
                <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginTop: '2px' }}>
                  Permettre aux participants de créer et manipuler des objets 3D
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {!xrEnabled && (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: CHENU_COLORS.ancientStone,
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🥽</div>
          <div style={{ fontSize: '14px' }}>
            Activez le mode XR pour configurer l'environnement immersif
          </div>
        </div>
      )}
    </>
  );
  
  const renderGovernanceTab = () => (
    <>
      <div style={styles.infoBox}>
        <span style={styles.infoIcon}>🏛️</span>
        <span style={styles.infoText}>
          <strong>GOUVERNANCE {'>'} EXÉCUTION</strong> — Les paramètres de consentement et de 
          génération automatique garantissent le respect de la vie privée et le contrôle sur les artifacts produits.
        </span>
      </div>
      
      {/* Consent Requirements */}
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>✅</span>
          <span>Consentement requis</span>
        </div>
        
        <div
          style={styles.governanceOption}
          onClick={() => { setRequireRecordingConsent(!requireRecordingConsent); handleFieldChange(); }}
        >
          <div style={{ ...styles.checkbox, ...(requireRecordingConsent ? styles.checkboxChecked : {}) }}>
            {requireRecordingConsent && <span style={{ color: CHENU_COLORS.uiSlate, fontSize: '12px' }}>✓</span>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', color: CHENU_COLORS.softSand }}>Enregistrement</div>
            <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginTop: '2px' }}>
              Demander le consentement explicite avant d'enregistrer
            </div>
          </div>
        </div>
        
        <div
          style={styles.governanceOption}
          onClick={() => { setRequireAIConsent(!requireAIConsent); handleFieldChange(); }}
        >
          <div style={{ ...styles.checkbox, ...(requireAIConsent ? styles.checkboxChecked : {}) }}>
            {requireAIConsent && <span style={{ color: CHENU_COLORS.uiSlate, fontSize: '12px' }}>✓</span>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', color: CHENU_COLORS.softSand }}>Participation IA</div>
            <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginTop: '2px' }}>
              Informer les participants de la présence d'agents IA
            </div>
          </div>
        </div>
      </div>
      
      {/* Auto-generate Artifacts */}
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>📄</span>
          <span>Génération automatique d'artifacts</span>
        </div>
        
        {[
          { key: 'notes', label: 'Notes structurées', desc: 'Résumé par topic et intervenant', checked: autoGenerateNotes, setChecked: setAutoGenerateNotes },
          { key: 'tasks', label: 'Tâches extraites', desc: 'Actions identifiées avec assignés', checked: autoGenerateTasks, setChecked: setAutoGenerateTasks },
          { key: 'decisions', label: 'Décisions capturées', desc: 'Choix avec contexte et rationale', checked: autoGenerateDecisions, setChecked: setAutoGenerateDecisions },
          { key: 'summary', label: 'Résumé exécutif', desc: 'Synthèse pour les absents', checked: autoGenerateSummary, setChecked: setAutoGenerateSummary },
        ].map((item) => (
          <div
            key={item.key}
            style={styles.governanceOption}
            onClick={() => { item.setChecked(!item.checked); handleFieldChange(); }}
          >
            <div style={{ ...styles.checkbox, ...(item.checked ? styles.checkboxChecked : {}) }}>
              {item.checked && <span style={{ color: CHENU_COLORS.uiSlate, fontSize: '12px' }}>✓</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', color: CHENU_COLORS.softSand }}>{item.label}</div>
              <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginTop: '2px' }}>
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Linked Threads */}
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>🔗</span>
          <span>Threads liés</span>
        </div>
        
        <div style={{
          padding: '14px',
          borderRadius: '8px',
          backgroundColor: CHENU_COLORS.bgPrimary,
          border: `1px solid ${CHENU_COLORS.borderDefault}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: CHENU_COLORS.softSand }}>
              💬 Threads ({linkedThreadIds.length})
            </span>
            <button
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: `1px solid ${CHENU_COLORS.borderDefault}`,
                backgroundColor: 'transparent',
                color: CHENU_COLORS.ancientStone,
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              + Lier un thread
            </button>
          </div>
          
          {linkedThreadIds.length === 0 ? (
            <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, fontStyle: 'italic' }}>
              Liez des threads pour que Nova puisse fournir du contexte pertinent pendant la réunion
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {linkedThreadIds.map((threadId, i) => {
                const thread = availableThreads.find(t => t.id === threadId);
                return (
                  <span key={i} style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    backgroundColor: CHENU_COLORS.sacredGold + '22',
                    color: CHENU_COLORS.sacredGold,
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    {thread?.title || threadId}
                    <span 
                      style={{ cursor: 'pointer', opacity: 0.7 }}
                      onClick={() => {
                        setLinkedThreadIds(linkedThreadIds.filter(id => id !== threadId));
                        handleFieldChange();
                      }}
                    >
                      ×
                    </span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Token Budget */}
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>⬡</span>
          <span>Budget Tokens pour les agents</span>
        </div>
        
        <div style={{
          padding: '16px',
          borderRadius: '10px',
          backgroundColor: CHENU_COLORS.bgPrimary,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>Budget alloué</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: CHENU_COLORS.sacredGold }}>
              {tokenBudget.toLocaleString()} ⬡
            </span>
          </div>
          <input
            type="range"
            style={{ width: '100%' }}
            min={100}
            max={5000}
            step={100}
            value={tokenBudget}
            onChange={(e) => { setTokenBudget(Number(e.target.value)); handleFieldChange(); }}
          />
          <div style={{ 
            marginTop: '8px', 
            fontSize: '11px', 
            color: CHENU_COLORS.ancientStone,
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <span>100 (minimal)</span>
            <span>5,000 (maximum)</span>
          </div>
        </div>
      </div>
    </>
  );
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────
  
  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <div style={styles.headerIcon}>📅</div>
            <div style={styles.headerText}>
              <h2 style={styles.title}>
                {isEditing ? 'Modifier la réunion' : 'Planifier une réunion'}
              </h2>
              <span style={styles.subtitle}>
                {isEditing ? `ID: ${meeting.id.slice(0, 8)}...` : 'Créer un Knowledge Event'}
              </span>
            </div>
          </div>
          <button
            style={styles.closeButton}
            onClick={handleClose}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = CHENU_COLORS.bgHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>
        
        {/* Tabs */}
        <div style={{ padding: '16px 24px 0' }}>
          <div style={styles.tabs}>
            {[
              { id: 'details', label: 'Détails', icon: '📝' },
              { id: 'schedule', label: 'Horaire', icon: '🗓️' },
              { id: 'participants', label: 'Participants', icon: '👥' },
              { id: 'agenda', label: 'Agenda', icon: '📋' },
              { id: 'xr', label: 'XR', icon: '🥽' },
              { id: 'governance', label: 'Gouvernance', icon: '🏛️' },
            ].map((tab) => (
              <button
                key={tab.id}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab.id ? styles.tabActive : {}),
                }}
                onClick={() => setActiveTab(tab.id as EditorTab)}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div style={styles.content}>
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'schedule' && renderScheduleTab()}
          {activeTab === 'participants' && renderParticipantsTab()}
          {activeTab === 'agenda' && renderAgendaTab()}
          {activeTab === 'xr' && renderXRTab()}
          {activeTab === 'governance' && renderGovernanceTab()}
        </div>
        
        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerLeft}>
            {isEditing && onDelete && (
              <button
                style={styles.btnDanger}
                onClick={handleDelete}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = CHENU_COLORS.error + '11'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Supprimer
              </button>
            )}
          </div>
          <div style={styles.footerRight}>
            <button
              style={styles.btnSecondary}
              onClick={handleClose}
            >
              Annuler
            </button>
            <button
              style={{
                ...styles.btnPrimary,
                opacity: canSave && !isSaving ? 1 : 0.5,
                cursor: canSave && !isSaving ? 'pointer' : 'not-allowed',
              }}
              onClick={handleSave}
              disabled={!canSave || isSaving}
            >
              {isSaving ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Planifier'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingEditor;
export { MeetingEditor };
export type {
  Meeting,
  MeetingType,
  MeetingCategory,
  MeetingStatus,
  MeetingParticipant,
  ParticipantRole,
  AgendaItem,
  RecurrenceConfig,
  XRSettings,
  MeetingGovernance,
  MeetingContext,
  MeetingEditorProps,
};
