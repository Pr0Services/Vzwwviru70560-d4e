/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                                                                              ║
 * ║                   CHE·NU™ V50 — THREAD EDITOR (.chenu)                       ║
 * ║                                                                              ║
 * ║  Threads are FIRST-CLASS OBJECTS in CHE·NU representing persistent          ║
 * ║  lines of thought with:                                                      ║
 * ║                                                                              ║
 * ║  • Owner & Scope (personal/shared/project)                                   ║
 * ║  • Token Budget & Governance                                                 ║
 * ║  • Encoding Rules (semantic compression)                                     ║
 * ║  • Participant Management                                                    ║
 * ║  • Audit Trail (append-only, immutable history)                              ║
 * ║  • Sphere & Project Linkage                                                  ║
 * ║                                                                              ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ║  Every thread operation requires governance checkpoint validation.           ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';

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
// TYPES — Thread Data Model
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Thread scope determines visibility and access control
 */
type ThreadScope = 'personal' | 'shared' | 'project';

/**
 * Thread status in its lifecycle
 */
type ThreadStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';

/**
 * Thread priority for sorting and attention
 */
type ThreadPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Encoding quality level - affects token usage
 */
type EncodingLevel = 'minimal' | 'standard' | 'detailed' | 'comprehensive';

/**
 * Participant in a thread with their role
 */
interface ThreadParticipant {
  id: string;
  name: string;
  email?: string;
  role: 'owner' | 'contributor' | 'viewer' | 'agent';
  avatar?: string;
  isAgent?: boolean;
  addedAt: string;
}

/**
 * Encoding configuration for the thread
 */
interface EncodingConfig {
  level: EncodingLevel;
  autoOptimize: boolean;
  preserveContext: boolean;
  compressionRatio?: number;
  qualityScore?: number;
}

/**
 * Governance settings for the thread
 */
interface GovernanceConfig {
  requireApprovalFor: ('edit' | 'share' | 'delete' | 'budget_change')[];
  approvers: string[];
  maxTokensPerMessage: number;
  allowAgentExecution: boolean;
  auditLevel: 'minimal' | 'standard' | 'comprehensive';
}

/**
 * Complete Thread data structure
 */
interface Thread {
  id: string;
  title: string;
  description: string;
  
  // Ownership & Scope
  owner: ThreadParticipant;
  scope: ThreadScope;
  status: ThreadStatus;
  priority: ThreadPriority;
  
  // Participants
  participants: ThreadParticipant[];
  
  // Token Economy
  tokenBudget: number;
  tokensUsed: number;
  tokenReserve: number;
  
  // Categorization
  sphereId: string;
  projectId?: string;
  tags: string[];
  
  // Encoding
  encoding: EncodingConfig;
  
  // Governance
  governance: GovernanceConfig;
  
  // Metadata
  messageCount: number;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
  
  // Linked Resources
  linkedDataspaces: string[];
  linkedMeetings: string[];
  parentThreadId?: string;
}

/**
 * Props for the ThreadEditor component
 */
interface ThreadEditorProps {
  thread?: Thread;
  sphereId: string;
  projectId?: string;
  onSave: (thread: Partial<Thread>) => Promise<void>;
  onClose: () => void;
  onDelete?: (threadId: string) => Promise<void>;
  availableParticipants?: ThreadParticipant[];
  availableSpheres?: { id: string; name: string; emoji: string }[];
  availableProjects?: { id: string; name: string }[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const SCOPE_OPTIONS: { value: ThreadScope; label: string; icon: string; description: string }[] = [
  { 
    value: 'personal', 
    label: 'Personnel', 
    icon: '🔒', 
    description: 'Visible uniquement par vous et Nova' 
  },
  { 
    value: 'shared', 
    label: 'Partagé', 
    icon: '👥', 
    description: 'Visible par les participants invités' 
  },
  { 
    value: 'project', 
    label: 'Projet', 
    icon: '📁', 
    description: 'Visible par tous les membres du projet' 
  },
];

const STATUS_OPTIONS: { value: ThreadStatus; label: string; color: string }[] = [
  { value: 'draft', label: 'Brouillon', color: CHENU_COLORS.ancientStone },
  { value: 'active', label: 'Actif', color: CHENU_COLORS.jungleEmerald },
  { value: 'paused', label: 'En pause', color: CHENU_COLORS.warning },
  { value: 'completed', label: 'Terminé', color: CHENU_COLORS.cenoteTurquoise },
  { value: 'archived', label: 'Archivé', color: CHENU_COLORS.ancientStone },
];

const PRIORITY_OPTIONS: { value: ThreadPriority; label: string; color: string; icon: string }[] = [
  { value: 'low', label: 'Basse', color: CHENU_COLORS.ancientStone, icon: '▽' },
  { value: 'normal', label: 'Normale', color: CHENU_COLORS.cenoteTurquoise, icon: '◇' },
  { value: 'high', label: 'Haute', color: CHENU_COLORS.warning, icon: '△' },
  { value: 'urgent', label: 'Urgente', color: CHENU_COLORS.error, icon: '⬆' },
];

const ENCODING_LEVELS: { value: EncodingLevel; label: string; description: string; tokenMultiplier: number }[] = [
  { 
    value: 'minimal', 
    label: 'Minimal', 
    description: 'Compression maximale, contexte réduit',
    tokenMultiplier: 0.5,
  },
  { 
    value: 'standard', 
    label: 'Standard', 
    description: 'Équilibre compression/contexte (recommandé)',
    tokenMultiplier: 1.0,
  },
  { 
    value: 'detailed', 
    label: 'Détaillé', 
    description: 'Plus de contexte préservé',
    tokenMultiplier: 1.5,
  },
  { 
    value: 'comprehensive', 
    label: 'Complet', 
    description: 'Contexte complet, compression minimale',
    tokenMultiplier: 2.0,
  },
];

const TOKEN_PRESETS = [500, 1000, 2500, 5000, 10000, 25000];

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
    maxWidth: '720px',
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
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
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
  },
  
  tab: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSandMuted,
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  
  tabActive: {
    backgroundColor: CHENU_COLORS.sacredGold,
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
    minHeight: '100px',
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
  
  // Scope Selection
  scopeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  
  scopeOption: {
    padding: '16px',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: CHENU_COLORS.bgPrimary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
  },
  
  scopeOptionSelected: {
    borderColor: CHENU_COLORS.sacredGold,
    backgroundColor: CHENU_COLORS.sacredGold + '11',
  },
  
  scopeIcon: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  
  scopeLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  
  scopeDesc: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    lineHeight: 1.4,
  },
  
  // Token Budget
  tokenBudgetSection: {
    padding: '20px',
    borderRadius: '12px',
    backgroundColor: CHENU_COLORS.bgPrimary,
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
  },
  
  tokenPresets: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  },
  
  tokenPreset: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSandMuted,
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  tokenPresetSelected: {
    borderColor: CHENU_COLORS.sacredGold,
    backgroundColor: CHENU_COLORS.sacredGold + '22',
    color: CHENU_COLORS.sacredGold,
  },
  
  tokenSlider: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    appearance: 'none',
    backgroundColor: CHENU_COLORS.bgTertiary,
    outline: 'none',
    marginBottom: '12px',
  },
  
  tokenDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  tokenValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: CHENU_COLORS.sacredGold,
  },
  
  tokenLabel: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  
  tokenEstimate: {
    textAlign: 'right',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
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
  },
  
  participantInfo: {
    flex: 1,
  },
  
  participantName: {
    fontSize: '14px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
  },
  
  participantRole: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    textTransform: 'capitalize',
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
  
  // Tags
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '12px',
  },
  
  tag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '16px',
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '22',
    color: CHENU_COLORS.cenoteTurquoise,
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
  
  // Encoding Options
  encodingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  
  encodingOption: {
    padding: '16px',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.borderDefault}`,
    backgroundColor: CHENU_COLORS.bgPrimary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  encodingOptionSelected: {
    borderColor: CHENU_COLORS.cenoteTurquoise,
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '11',
  },
  
  encodingLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  
  encodingDesc: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '8px',
  },
  
  encodingMultiplier: {
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
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
    backgroundColor: CHENU_COLORS.sacredGold,
    borderColor: CHENU_COLORS.sacredGold,
  },
  
  checkboxLabel: {
    flex: 1,
    fontSize: '13px',
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
    backgroundColor: CHENU_COLORS.sacredGold,
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
  
  // Loading
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
  },
  
  spinner: {
    width: '40px',
    height: '40px',
    border: `3px solid ${CHENU_COLORS.borderDefault}`,
    borderTopColor: CHENU_COLORS.sacredGold,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Status badge component
 */
const StatusBadge: React.FC<{ status: ThreadStatus }> = ({ status }) => {
  const statusConfig = STATUS_OPTIONS.find(s => s.value === status);
  if (!statusConfig) return null;
  
  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 600,
      backgroundColor: statusConfig.color + '22',
      color: statusConfig.color,
      textTransform: 'uppercase',
    }}>
      {statusConfig.label}
    </span>
  );
};

/**
 * Priority indicator component
 */
const PriorityIndicator: React.FC<{ priority: ThreadPriority; onClick?: () => void }> = ({ priority, onClick }) => {
  const config = PRIORITY_OPTIONS.find(p => p.value === priority);
  if (!config) return null;
  
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: '6px',
        border: `1px solid ${config.color}44`,
        backgroundColor: config.color + '11',
        color: config.color,
        fontSize: '12px',
        fontWeight: 500,
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </button>
  );
};

/**
 * Token usage bar component
 */
const TokenUsageBar: React.FC<{ used: number; budget: number }> = ({ used, budget }) => {
  const percentage = budget > 0 ? Math.min((used / budget) * 100, 100) : 0;
  const isWarning = percentage > 75;
  const isCritical = percentage > 90;
  
  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>
          Tokens utilisés
        </span>
        <span style={{ 
          fontSize: '12px', 
          fontWeight: 600,
          color: isCritical ? CHENU_COLORS.error : isWarning ? CHENU_COLORS.warning : CHENU_COLORS.softSand,
        }}>
          {used.toLocaleString()} / {budget.toLocaleString()}
        </span>
      </div>
      <div style={{
        height: '6px',
        borderRadius: '3px',
        backgroundColor: CHENU_COLORS.bgTertiary,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          borderRadius: '3px',
          backgroundColor: isCritical ? CHENU_COLORS.error : isWarning ? CHENU_COLORS.warning : CHENU_COLORS.sacredGold,
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

type EditorTab = 'general' | 'participants' | 'budget' | 'encoding' | 'governance';

const ThreadEditor: React.FC<ThreadEditorProps> = ({
  thread,
  sphereId,
  projectId,
  onSave,
  onClose,
  onDelete,
  availableParticipants = [],
  availableSpheres = DEFAULT_SPHERES,
  availableProjects = [],
}) => {
  // ─────────────────────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────────────────────
  
  const [activeTab, setActiveTab] = useState<EditorTab>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Form state
  const [title, setTitle] = useState(thread?.title || '');
  const [description, setDescription] = useState(thread?.description || '');
  const [scope, setScope] = useState<ThreadScope>(thread?.scope || 'personal');
  const [status, setStatus] = useState<ThreadStatus>(thread?.status || 'draft');
  const [priority, setPriority] = useState<ThreadPriority>(thread?.priority || 'normal');
  const [selectedSphereId, setSelectedSphereId] = useState(thread?.sphereId || sphereId);
  const [selectedProjectId, setSelectedProjectId] = useState(thread?.projectId || projectId);
  
  // Participants
  const [participants, setParticipants] = useState<ThreadParticipant[]>(
    thread?.participants || [
      // Nova is always a participant
      { id: 'nova', name: 'Nova', role: 'agent', isAgent: true, addedAt: new Date().toISOString() }
    ]
  );
  
  // Token budget
  const [tokenBudget, setTokenBudget] = useState(thread?.tokenBudget || 2500);
  const [tokenReserve, setTokenReserve] = useState(thread?.tokenReserve || 0);
  
  // Tags
  const [tags, setTags] = useState<string[]>(thread?.tags || []);
  const [tagInput, setTagInput] = useState('');
  
  // Encoding
  const [encodingLevel, setEncodingLevel] = useState<EncodingLevel>(thread?.encoding?.level || 'standard');
  const [autoOptimize, setAutoOptimize] = useState(thread?.encoding?.autoOptimize ?? true);
  const [preserveContext, setPreserveContext] = useState(thread?.encoding?.preserveContext ?? true);
  
  // Governance
  const [requireApprovalForEdit, setRequireApprovalForEdit] = useState(
    thread?.governance?.requireApprovalFor.includes('edit') ?? false
  );
  const [requireApprovalForShare, setRequireApprovalForShare] = useState(
    thread?.governance?.requireApprovalFor.includes('share') ?? true
  );
  const [requireApprovalForDelete, setRequireApprovalForDelete] = useState(
    thread?.governance?.requireApprovalFor.includes('delete') ?? true
  );
  const [allowAgentExecution, setAllowAgentExecution] = useState(
    thread?.governance?.allowAgentExecution ?? false
  );
  const [maxTokensPerMessage, setMaxTokensPerMessage] = useState(
    thread?.governance?.maxTokensPerMessage || 500
  );
  const [auditLevel, setAuditLevel] = useState<'minimal' | 'standard' | 'comprehensive'>(
    thread?.governance?.auditLevel || 'standard'
  );
  
  // Linked Resources
  const [linkedDataspaces, setLinkedDataspaces] = useState<string[]>(thread?.linkedDataspaces || []);
  const [linkedMeetings, setLinkedMeetings] = useState<string[]>(thread?.linkedMeetings || []);
  
  // Participant picker
  const [showParticipantPicker, setShowParticipantPicker] = useState(false);
  const [participantSearch, setParticipantSearch] = useState('');
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Keyboard Shortcuts
  // ─────────────────────────────────────────────────────────────────────────────
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape') {
        handleClose();
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
  }, [canSave, isSaving]); // Note: handleClose and handleSave defined below
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Computed values
  // ─────────────────────────────────────────────────────────────────────────────
  
  const isEditing = !!thread;
  
  const encodingConfig = useMemo(() => {
    const levelConfig = ENCODING_LEVELS.find(e => e.value === encodingLevel);
    return {
      effectiveTokens: Math.round(tokenBudget * (levelConfig?.tokenMultiplier || 1)),
      multiplier: levelConfig?.tokenMultiplier || 1,
    };
  }, [tokenBudget, encodingLevel]);
  
  const canSave = useMemo(() => {
    return title.trim().length > 0 && tokenBudget > 0;
  }, [title, tokenBudget]);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────────
  
  const handleFieldChange = useCallback(() => {
    setIsDirty(true);
  }, []);
  
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
  
  const handleRemoveParticipant = useCallback((participantId: string) => {
    if (participantId === 'nova') return; // Nova cannot be removed
    setParticipants(participants.filter(p => p.id !== participantId));
    handleFieldChange();
  }, [participants, handleFieldChange]);
  
  const handleSave = useCallback(async () => {
    if (!canSave) return;
    
    setIsSaving(true);
    
    try {
      const threadData: Partial<Thread> = {
        ...(thread?.id && { id: thread.id }),
        title: title.trim(),
        description: description.trim(),
        scope,
        status,
        priority,
        sphereId: selectedSphereId,
        projectId: selectedProjectId || undefined,
        participants,
        tokenBudget,
        tokenReserve,
        tags,
        encoding: {
          level: encodingLevel,
          autoOptimize,
          preserveContext,
        },
        governance: {
          requireApprovalFor: [
            ...(requireApprovalForEdit ? ['edit' as const] : []),
            ...(requireApprovalForShare ? ['share' as const] : []),
            ...(requireApprovalForDelete ? ['delete' as const] : []),
          ],
          approvers: [],
          maxTokensPerMessage,
          allowAgentExecution,
          auditLevel,
        },
        linkedDataspaces,
        linkedMeetings,
      };
      
      await onSave(threadData);
      setIsDirty(false);
    } catch (error) {
      logger.error('Failed to save thread:', error);
    } finally {
      setIsSaving(false);
    }
  }, [
    canSave, thread, title, description, scope, status, priority,
    selectedSphereId, selectedProjectId, participants, tokenBudget,
    tokenReserve, tags, encodingLevel, autoOptimize, preserveContext,
    requireApprovalForEdit, requireApprovalForShare, requireApprovalForDelete,
    allowAgentExecution, maxTokensPerMessage, onSave
  ]);
  
  const handleClose = useCallback(() => {
    if (isDirty) {
      const confirm = window.confirm('Des modifications non sauvegardées seront perdues. Continuer?');
      if (!confirm) return;
    }
    onClose();
  }, [isDirty, onClose]);
  
  const handleDelete = useCallback(async () => {
    if (!thread?.id || !onDelete) return;
    
    const confirm = window.confirm(
      'Êtes-vous sûr de vouloir supprimer ce thread? Cette action est irréversible.'
    );
    if (!confirm) return;
    
    setIsSaving(true);
    try {
      await onDelete(thread.id);
    } finally {
      setIsSaving(false);
    }
  }, [thread, onDelete]);
  
  // ─────────────────────────────────────────────────────────────────────────────
  // Tab Content Renderers
  // ─────────────────────────────────────────────────────────────────────────────
  
  const renderGeneralTab = () => (
    <>
      {/* Info Box for new threads */}
      {!isEditing && (
        <div style={styles.infoBox}>
          <span style={styles.infoIcon}>💬</span>
          <span style={styles.infoText}>
            Les Threads (.chenu) sont des <strong>objets de première classe</strong> dans CHE·NU. 
            Ils représentent des lignes de pensée persistantes avec un budget de tokens, 
            des règles d'encodage et un historique d'audit complet.
          </span>
        </div>
      )}
      
      {/* Title */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Titre du Thread *</label>
        <input
          type="text"
          style={styles.input}
          value={title}
          onChange={(e) => { setTitle(e.target.value); handleFieldChange(); }}
          placeholder="Ex: Planification Q1 2025, Idées de design..."
          autoFocus
        />
      </div>
      
      {/* Description */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Description (optionnel)</label>
        <textarea
          style={styles.textarea}
          value={description}
          onChange={(e) => { setDescription(e.target.value); handleFieldChange(); }}
          placeholder="Décrivez l'objectif et le contexte de ce thread..."
        />
      </div>
      
      {/* Scope */}
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>🔐</span>
          <span>Portée & Visibilité</span>
        </div>
        <div style={styles.scopeGrid}>
          {SCOPE_OPTIONS.map((option) => (
            <div
              key={option.value}
              style={{
                ...styles.scopeOption,
                ...(scope === option.value ? styles.scopeOptionSelected : {}),
              }}
              onClick={() => { setScope(option.value); handleFieldChange(); }}
            >
              <div style={styles.scopeIcon}>{option.icon}</div>
              <div style={styles.scopeLabel}>{option.label}</div>
              <div style={styles.scopeDesc}>{option.description}</div>
            </div>
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
      
      {/* Status & Priority */}
      <div style={styles.inlineGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Statut</label>
          <select
            style={styles.select}
            value={status}
            onChange={(e) => { setStatus(e.target.value as ThreadStatus); handleFieldChange(); }}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Priorité</label>
          <select
            style={styles.select}
            value={priority}
            onChange={(e) => { setPriority(e.target.value as ThreadPriority); handleFieldChange(); }}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
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
              <span
                style={styles.tagRemove}
                onClick={() => handleRemoveTag(tag)}
              >
                ×
              </span>
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
  
  const renderParticipantsTab = () => (
    <>
      <div style={styles.infoBox}>
        <span style={styles.infoIcon}>👥</span>
        <span style={styles.infoText}>
          Les participants peuvent contribuer au thread selon leur rôle. 
          <strong>Nova</strong> est toujours présent comme agent système pour l'assistance et la gouvernance.
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
                ...(participant.isAgent ? { backgroundColor: CHENU_COLORS.cenoteTurquoise + '22', color: CHENU_COLORS.cenoteTurquoise } : {}),
              }}>
                {participant.isAgent ? '🤖' : participant.name.charAt(0).toUpperCase()}
              </div>
              <div style={styles.participantInfo}>
                <div style={styles.participantName}>
                  {participant.name}
                  {participant.id === 'nova' && <span style={{ marginLeft: '8px', fontSize: '11px', color: CHENU_COLORS.cenoteTurquoise }}>(Système)</span>}
                </div>
                <div style={styles.participantRole}>{participant.role}</div>
              </div>
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
          onMouseEnter={(e) => e.currentTarget.style.borderColor = CHENU_COLORS.borderHover}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = CHENU_COLORS.borderDefault}
        >
          <span>+</span>
          <span>Ajouter un participant</span>
        </button>
        
        {/* Participant Picker Modal */}
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
                Sélectionner un participant
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
                      setParticipants([...participants, {
                        ...p,
                        role: 'contributor',
                        addedAt: new Date().toISOString(),
                      }]);
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
                      backgroundColor: CHENU_COLORS.sacredGold + '22',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: CHENU_COLORS.sacredGold,
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
              {availableParticipants.filter(p => !participants.some(existing => existing.id === p.id)).length === 0 && (
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center', 
                  color: CHENU_COLORS.ancientStone,
                  fontSize: '12px',
                }}>
                  Aucun participant disponible
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Role permissions info */}
      <div style={{ ...styles.formSection, marginTop: '24px' }}>
        <div style={styles.sectionTitle}>
          <span>🔑</span>
          <span>Permissions par rôle</span>
        </div>
        
        <div style={{ display: 'grid', gap: '8px' }}>
          {[
            { role: 'Propriétaire', permissions: 'Tous les droits, supprimer le thread', color: CHENU_COLORS.sacredGold },
            { role: 'Contributeur', permissions: 'Lire, écrire, modifier ses messages', color: CHENU_COLORS.jungleEmerald },
            { role: 'Lecteur', permissions: 'Lecture seule', color: CHENU_COLORS.cenoteTurquoise },
            { role: 'Agent', permissions: 'Selon les règles de gouvernance', color: CHENU_COLORS.ancientStone },
          ].map((item) => (
            <div key={item.role} style={{
              padding: '10px 14px',
              borderRadius: '6px',
              backgroundColor: CHENU_COLORS.bgPrimary,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: item.color }}>{item.role}</span>
              <span style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>{item.permissions}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
  
  const renderBudgetTab = () => (
    <>
      <div style={styles.infoBox}>
        <span style={styles.infoIcon}>⬡</span>
        <span style={styles.infoText}>
          Les tokens représentent l'<strong>énergie d'intelligence</strong> dans CHE·NU. 
          Chaque message consomme des tokens selon son encodage et sa complexité. 
          Le budget contrôle la profondeur et la durée des conversations.
        </span>
      </div>
      
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>⬡</span>
          <span>Budget Tokens</span>
        </div>
        
        <div style={styles.tokenBudgetSection}>
          {/* Presets */}
          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, textTransform: 'uppercase' }}>
              Presets rapides
            </span>
          </div>
          <div style={styles.tokenPresets}>
            {TOKEN_PRESETS.map((preset) => (
              <button
                key={preset}
                style={{
                  ...styles.tokenPreset,
                  ...(tokenBudget === preset ? styles.tokenPresetSelected : {}),
                }}
                onClick={() => { setTokenBudget(preset); handleFieldChange(); }}
              >
                {preset.toLocaleString()}
              </button>
            ))}
          </div>
          
          {/* Slider */}
          <input
            type="range"
            style={styles.tokenSlider}
            min={100}
            max={50000}
            step={100}
            value={tokenBudget}
            onChange={(e) => { setTokenBudget(Number(e.target.value)); handleFieldChange(); }}
          />
          
          {/* Display */}
          <div style={styles.tokenDisplay}>
            <div>
              <div style={styles.tokenValue}>{tokenBudget.toLocaleString()}</div>
              <div style={styles.tokenLabel}>Tokens alloués</div>
            </div>
            <div style={styles.tokenEstimate}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: CHENU_COLORS.softSand }}>
                ~{Math.round(tokenBudget / encodingConfig.multiplier).toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>
                Tokens effectifs ({encodingLevel})
              </div>
            </div>
          </div>
          
          {/* Usage bar if editing */}
          {isEditing && thread && (
            <TokenUsageBar used={thread.tokensUsed} budget={tokenBudget} />
          )}
        </div>
      </div>
      
      {/* Token Reserve */}
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>🔒</span>
          <span>Réserve de tokens</span>
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Réserve (optionnel) — Tokens mis de côté pour les opérations critiques
          </label>
          <input
            type="number"
            style={styles.input}
            value={tokenReserve}
            onChange={(e) => { setTokenReserve(Number(e.target.value)); handleFieldChange(); }}
            min={0}
            max={tokenBudget * 0.3}
            placeholder="0"
          />
          <div style={{ marginTop: '4px', fontSize: '11px', color: CHENU_COLORS.ancientStone }}>
            Maximum recommandé: {Math.round(tokenBudget * 0.3).toLocaleString()} tokens (30% du budget)
          </div>
        </div>
      </div>
      
      {/* Cost estimation */}
      <div style={{ ...styles.formSection, marginTop: '16px' }}>
        <div style={styles.sectionTitle}>
          <span>📊</span>
          <span>Estimation d'utilisation</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { label: 'Messages courts', estimate: Math.round(tokenBudget / 50), unit: 'messages' },
            { label: 'Messages moyens', estimate: Math.round(tokenBudget / 150), unit: 'messages' },
            { label: 'Messages longs', estimate: Math.round(tokenBudget / 500), unit: 'messages' },
          ].map((item) => (
            <div key={item.label} style={{
              padding: '14px',
              borderRadius: '8px',
              backgroundColor: CHENU_COLORS.bgPrimary,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: CHENU_COLORS.sacredGold }}>
                ~{item.estimate}
              </div>
              <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginTop: '4px' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
  
  const renderEncodingTab = () => (
    <>
      <div style={styles.infoBox}>
        <span style={styles.infoIcon}>🔐</span>
        <span style={styles.infoText}>
          L'encodage sémantique transforme vos intentions en schémas structurés optimisés. 
          Un encodage plus compact économise des tokens mais peut réduire le contexte préservé.
        </span>
      </div>
      
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>📊</span>
          <span>Niveau d'encodage</span>
        </div>
        
        <div style={styles.encodingGrid}>
          {ENCODING_LEVELS.map((level) => (
            <div
              key={level.value}
              style={{
                ...styles.encodingOption,
                ...(encodingLevel === level.value ? styles.encodingOptionSelected : {}),
              }}
              onClick={() => { setEncodingLevel(level.value); handleFieldChange(); }}
            >
              <div style={styles.encodingLabel}>{level.label}</div>
              <div style={styles.encodingDesc}>{level.description}</div>
              <div style={styles.encodingMultiplier}>
                ×{level.tokenMultiplier} tokens
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Encoding options */}
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>⚙️</span>
          <span>Options d'encodage</span>
        </div>
        
        <div
          style={styles.governanceOption}
          onClick={() => { setAutoOptimize(!autoOptimize); handleFieldChange(); }}
        >
          <div style={{
            ...styles.checkbox,
            ...(autoOptimize ? styles.checkboxChecked : {}),
          }}>
            {autoOptimize && <span style={{ color: CHENU_COLORS.uiSlate, fontSize: '12px' }}>✓</span>}
          </div>
          <div>
            <div style={styles.checkboxLabel}>Auto-optimisation</div>
            <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginTop: '2px' }}>
              Permet à Nova d'optimiser automatiquement l'encodage pour économiser des tokens
            </div>
          </div>
        </div>
        
        <div
          style={styles.governanceOption}
          onClick={() => { setPreserveContext(!preserveContext); handleFieldChange(); }}
        >
          <div style={{
            ...styles.checkbox,
            ...(preserveContext ? styles.checkboxChecked : {}),
          }}>
            {preserveContext && <span style={{ color: CHENU_COLORS.uiSlate, fontSize: '12px' }}>✓</span>}
          </div>
          <div>
            <div style={styles.checkboxLabel}>Préserver le contexte</div>
            <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginTop: '2px' }}>
              Maintient le contexte des messages précédents (utilise plus de tokens)
            </div>
          </div>
        </div>
      </div>
      
      {/* Encoding Quality Score preview */}
      <div style={{ ...styles.formSection, marginTop: '16px' }}>
        <div style={styles.sectionTitle}>
          <span>📈</span>
          <span>Score de qualité estimé (EQS)</span>
        </div>
        
        <div style={{
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: CHENU_COLORS.bgPrimary,
          textAlign: 'center',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: CHENU_COLORS.cenoteTurquoise + '22',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: CHENU_COLORS.cenoteTurquoise }}>
              {encodingLevel === 'comprehensive' ? '95' : 
               encodingLevel === 'detailed' ? '85' :
               encodingLevel === 'standard' ? '75' : '60'}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: CHENU_COLORS.ancientStone }}>
            Score basé sur le niveau d'encodage et les options sélectionnées
          </div>
        </div>
      </div>
    </>
  );
  
  const renderGovernanceTab = () => (
    <>
      <div style={styles.infoBox}>
        <span style={styles.infoIcon}>🏛️</span>
        <span style={styles.infoText}>
          <strong>GOUVERNANCE {'>'} EXÉCUTION</strong> — Chaque action importante nécessite une validation 
          selon les règles définies ici. Les checkpoints garantissent le contrôle humain sur les opérations IA.
        </span>
      </div>
      
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>✅</span>
          <span>Approbation requise pour</span>
        </div>
        
        <div
          style={styles.governanceOption}
          onClick={() => { setRequireApprovalForEdit(!requireApprovalForEdit); handleFieldChange(); }}
        >
          <div style={{
            ...styles.checkbox,
            ...(requireApprovalForEdit ? styles.checkboxChecked : {}),
          }}>
            {requireApprovalForEdit && <span style={{ color: CHENU_COLORS.uiSlate, fontSize: '12px' }}>✓</span>}
          </div>
          <div>
            <div style={styles.checkboxLabel}>Modifications</div>
            <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginTop: '2px' }}>
              Requiert approbation pour modifier le contenu du thread
            </div>
          </div>
        </div>
        
        <div
          style={styles.governanceOption}
          onClick={() => { setRequireApprovalForShare(!requireApprovalForShare); handleFieldChange(); }}
        >
          <div style={{
            ...styles.checkbox,
            ...(requireApprovalForShare ? styles.checkboxChecked : {}),
          }}>
            {requireApprovalForShare && <span style={{ color: CHENU_COLORS.uiSlate, fontSize: '12px' }}>✓</span>}
          </div>
          <div>
            <div style={styles.checkboxLabel}>Partage</div>
            <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginTop: '2px' }}>
              Requiert approbation pour partager le thread avec de nouveaux participants
            </div>
          </div>
        </div>
        
        <div
          style={styles.governanceOption}
          onClick={() => { setRequireApprovalForDelete(!requireApprovalForDelete); handleFieldChange(); }}
        >
          <div style={{
            ...styles.checkbox,
            ...(requireApprovalForDelete ? styles.checkboxChecked : {}),
          }}>
            {requireApprovalForDelete && <span style={{ color: CHENU_COLORS.uiSlate, fontSize: '12px' }}>✓</span>}
          </div>
          <div>
            <div style={styles.checkboxLabel}>Suppression</div>
            <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginTop: '2px' }}>
              Requiert double confirmation pour supprimer le thread
            </div>
          </div>
        </div>
      </div>
      
      {/* Agent execution */}
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>🤖</span>
          <span>Exécution par agents</span>
        </div>
        
        <div
          style={styles.governanceOption}
          onClick={() => { setAllowAgentExecution(!allowAgentExecution); handleFieldChange(); }}
        >
          <div style={{
            ...styles.checkbox,
            ...(allowAgentExecution ? styles.checkboxChecked : {}),
          }}>
            {allowAgentExecution && <span style={{ color: CHENU_COLORS.uiSlate, fontSize: '12px' }}>✓</span>}
          </div>
          <div>
            <div style={styles.checkboxLabel}>Autoriser l'exécution automatique</div>
            <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, marginTop: '2px' }}>
              Permet aux agents d'exécuter des actions dans ce thread (avec checkpoints)
            </div>
          </div>
        </div>
        
        {allowAgentExecution && (
          <div style={{ ...styles.formGroup, marginTop: '12px', marginLeft: '32px' }}>
            <label style={styles.label}>Tokens max par message agent</label>
            <input
              type="number"
              style={{ ...styles.input, maxWidth: '200px' }}
              value={maxTokensPerMessage}
              onChange={(e) => { setMaxTokensPerMessage(Number(e.target.value)); handleFieldChange(); }}
              min={50}
              max={2000}
            />
          </div>
        )}
      </div>
      
      {/* Audit Level */}
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>📜</span>
          <span>Niveau d'audit</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { value: 'minimal' as const, label: 'Minimal', desc: 'Actions principales uniquement', icon: '📝' },
            { value: 'standard' as const, label: 'Standard', desc: 'Toutes les actions (recommandé)', icon: '📋' },
            { value: 'comprehensive' as const, label: 'Complet', desc: 'Actions + contexte + metadata', icon: '📚' },
          ].map((option) => (
            <div
              key={option.value}
              style={{
                padding: '14px',
                borderRadius: '10px',
                border: `1px solid ${auditLevel === option.value ? CHENU_COLORS.sacredGold : CHENU_COLORS.borderDefault}`,
                backgroundColor: auditLevel === option.value ? CHENU_COLORS.sacredGold + '11' : CHENU_COLORS.bgPrimary,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => { setAuditLevel(option.value); handleFieldChange(); }}
            >
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{option.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: CHENU_COLORS.softSand, marginBottom: '4px' }}>
                {option.label}
              </div>
              <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>
                {option.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Linked Resources */}
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>🔗</span>
          <span>Ressources liées</span>
        </div>
        
        <div style={{ display: 'grid', gap: '12px' }}>
          {/* Linked DataSpaces */}
          <div style={{
            padding: '14px',
            borderRadius: '8px',
            backgroundColor: CHENU_COLORS.bgPrimary,
            border: `1px solid ${CHENU_COLORS.borderDefault}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: CHENU_COLORS.softSand }}>
                📁 DataSpaces ({linkedDataspaces.length})
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
                + Lier
              </button>
            </div>
            {linkedDataspaces.length === 0 ? (
              <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, fontStyle: 'italic' }}>
                Aucun DataSpace lié
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {linkedDataspaces.map((ds, i) => (
                  <span key={i} style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    backgroundColor: CHENU_COLORS.jungleEmerald + '22',
                    color: CHENU_COLORS.jungleEmerald,
                    fontSize: '11px',
                  }}>
                    {ds}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Linked Meetings */}
          <div style={{
            padding: '14px',
            borderRadius: '8px',
            backgroundColor: CHENU_COLORS.bgPrimary,
            border: `1px solid ${CHENU_COLORS.borderDefault}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: CHENU_COLORS.softSand }}>
                📅 Meetings ({linkedMeetings.length})
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
                + Lier
              </button>
            </div>
            {linkedMeetings.length === 0 ? (
              <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone, fontStyle: 'italic' }}>
                Aucune réunion liée
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {linkedMeetings.map((m, i) => (
                  <span key={i} style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    backgroundColor: CHENU_COLORS.cenoteTurquoise + '22',
                    color: CHENU_COLORS.cenoteTurquoise,
                    fontSize: '11px',
                  }}>
                    {m}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Audit Trail */}
      <div style={styles.formSection}>
        <div style={styles.sectionTitle}>
          <span>📜</span>
          <span>Audit Trail</span>
        </div>
        
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          backgroundColor: CHENU_COLORS.bgPrimary,
          border: `1px solid ${CHENU_COLORS.borderDefault}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>🔗</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: CHENU_COLORS.softSand }}>
                Hash Chain Audit
              </div>
              <div style={{ fontSize: '11px', color: CHENU_COLORS.ancientStone }}>
                Chaque action est enregistrée dans une chaîne immuable
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { label: 'Création', value: thread?.createdAt ? new Date(thread.createdAt).toLocaleDateString() : 'Maintenant' },
              { label: 'Dernière modification', value: thread?.updatedAt ? new Date(thread.updatedAt).toLocaleDateString() : '—' },
              { label: 'Messages', value: thread?.messageCount?.toString() || '0' },
              { label: 'Niveau d\'audit', value: 'Standard' },
            ].map((item) => (
              <div key={item.label} style={{
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: CHENU_COLORS.bgTertiary,
              }}>
                <div style={{ fontSize: '10px', color: CHENU_COLORS.ancientStone, textTransform: 'uppercase' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '13px', color: CHENU_COLORS.softSand, marginTop: '2px' }}>
                  {item.value}
                </div>
              </div>
            ))}
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
            <div style={styles.headerIcon}>💬</div>
            <div style={styles.headerText}>
              <h2 style={styles.title}>
                {isEditing ? 'Modifier le Thread' : 'Nouveau Thread (.chenu)'}
              </h2>
              <span style={styles.subtitle}>
                {isEditing ? `ID: ${thread.id.slice(0, 8)}...` : 'Créer une nouvelle ligne de pensée'}
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
              { id: 'general', label: 'Général', icon: '📝' },
              { id: 'participants', label: 'Participants', icon: '👥' },
              { id: 'budget', label: 'Budget', icon: '⬡' },
              { id: 'encoding', label: 'Encodage', icon: '🔐' },
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
          {activeTab === 'general' && renderGeneralTab()}
          {activeTab === 'participants' && renderParticipantsTab()}
          {activeTab === 'budget' && renderBudgetTab()}
          {activeTab === 'encoding' && renderEncodingTab()}
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
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = CHENU_COLORS.bgHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
              {isSaving ? (
                <>
                  <span style={{ 
                    width: '14px', 
                    height: '14px', 
                    border: '2px solid transparent',
                    borderTopColor: CHENU_COLORS.uiSlate,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }} />
                  Enregistrement...
                </>
              ) : (
                <>
                  <span>✓</span>
                  {isEditing ? 'Mettre à jour' : 'Créer le Thread'}
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Loading overlay */}
        {isSaving && (
          <div style={styles.loadingOverlay}>
            <div style={styles.spinner} />
          </div>
        )}
      </div>
      
      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ThreadEditor;
export { ThreadEditor };
export type { 
  Thread, 
  ThreadScope, 
  ThreadStatus, 
  ThreadPriority, 
  ThreadParticipant,
  EncodingConfig,
  GovernanceConfig,
  ThreadEditorProps,
};
