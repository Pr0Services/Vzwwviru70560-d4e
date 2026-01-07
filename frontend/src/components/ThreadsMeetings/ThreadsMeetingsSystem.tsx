// CHE·NU™ Threads & Meetings System Components
// Complete .chenu thread management and meeting orchestration

import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';

// ============================================================
// TYPES - THREADS (.CHENU)
// ============================================================

type ThreadStatus = 'active' | 'paused' | 'completed' | 'archived';
type ThreadScope = 'personal' | 'my_team' | 'sphere' | 'global';
type MessageRole = 'user' | 'assistant' | 'system' | 'agent';

interface ThreadOwner {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface ThreadEncoding {
  enabled: boolean;
  qualityScore: number;
  compressionRatio: number;
  lastEncodedAt?: Date;
}

interface ThreadBudget {
  allocated: number;
  used: number;
  remaining: number;
  autoRefill?: boolean;
  refillAmount?: number;
}

interface ThreadMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  tokensUsed?: number;
  agentId?: string;
  agentName?: string;
  metadata?: Record<string, any>;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
}

interface ThreadDecision {
  id: string;
  title: string;
  description: string;
  decidedAt: Date;
  decidedBy: string;
  linkedMessageId?: string;
  status: 'proposed' | 'accepted' | 'rejected' | 'implemented';
}

interface Thread {
  id: string;
  title: string;
  description?: string;
  status: ThreadStatus;
  scope: ThreadScope;
  sphereId: string;
  owner: ThreadOwner;
  participants?: ThreadOwner[];
  encoding: ThreadEncoding;
  budget: ThreadBudget;
  messages: ThreadMessage[];
  decisions: ThreadDecision[];
  tags?: string[];
  isStarred?: boolean;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// TYPES - MEETINGS
// ============================================================

type MeetingStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
type MeetingType = 'standup' | 'brainstorm' | 'review' | 'planning' | 'decision' | 'general';
type ParticipantRole = 'organizer' | 'participant' | 'observer' | 'ai-assistant';

interface MeetingParticipant {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role: ParticipantRole;
  isPresent?: boolean;
  joinedAt?: Date;
  leftAt?: Date;
}

interface MeetingAgendaItem {
  id: string;
  title: string;
  description?: string;
  duration: number;
  presenter?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  notes?: string;
  order: number;
}

interface MeetingNote {
  id: string;
  content: string;
  createdBy: string;
  createdByName: string;
  timestamp: Date;
  agendaItemId?: string;
  isActionItem?: boolean;
  assignee?: string;
}

interface MeetingActionItem {
  id: string;
  title: string;
  description?: string;
  assignee: string;
  assigneeName: string;
  dueDate?: Date;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface Meeting {
  id: string;
  title: string;
  description?: string;
  type: MeetingType;
  status: MeetingStatus;
  sphereId: string;
  threadId?: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  organizer: MeetingParticipant;
  participants: MeetingParticipant[];
  agenda: MeetingAgendaItem[];
  notes: MeetingNote[];
  actionItems: MeetingActionItem[];
  tokenBudget: number;
  tokensUsed: number;
  recordingUrl?: string;
  transcriptUrl?: string;
  tags?: string[];
  isRecurring?: boolean;
  recurrenceRule?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// PROPS INTERFACES
// ============================================================

interface ThreadListProps {
  threads: Thread[];
  view?: 'list' | 'grid';
  onThreadClick?: (thread: Thread) => void;
  onCreateThread?: () => void;
  showFilters?: boolean;
  className?: string;
}

interface ThreadCardProps {
  thread: Thread;
  variant?: 'compact' | 'detailed';
  onClick?: () => void;
  onStar?: (starred: boolean) => void;
  className?: string;
}

interface ThreadDetailProps {
  thread: Thread;
  onSendMessage?: (content: string) => void;
  onUpdateStatus?: (status: ThreadStatus) => void;
  onAddDecision?: (decision: Partial<ThreadDecision>) => void;
  className?: string;
}

interface MeetingListProps {
  meetings: Meeting[];
  view?: 'list' | 'calendar' | 'agenda';
  onMeetingClick?: (meeting: Meeting) => void;
  onCreateMeeting?: () => void;
  showFilters?: boolean;
  className?: string;
}

interface MeetingCardProps {
  meeting: Meeting;
  variant?: 'compact' | 'detailed';
  onClick?: () => void;
  onJoin?: () => void;
  className?: string;
}

interface MeetingDetailProps {
  meeting: Meeting;
  onUpdateStatus?: (status: MeetingStatus) => void;
  onAddNote?: (note: Partial<MeetingNote>) => void;
  onAddActionItem?: (item: Partial<MeetingActionItem>) => void;
  onUpdateAgendaItem?: (itemId: string, updates: Partial<MeetingAgendaItem>) => void;
  className?: string;
}

// ============================================================
// BRAND COLORS (Memory Prompt)
// ============================================================

const BRAND = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

// ============================================================
// CONSTANTS
// ============================================================

const THREAD_STATUS_CONFIG: Record<ThreadStatus, { color: string; label: string; icon: string }> = {
  active: { color: '#38A169', label: 'Active', icon: '🟢' },
  paused: { color: BRAND.sacredGold, label: 'Paused', icon: '⏸️' },
  completed: { color: BRAND.cenoteTurquoise, label: 'Completed', icon: '✅' },
  archived: { color: BRAND.ancientStone, label: 'Archived', icon: '📦' },
};

const THREAD_SCOPE_CONFIG: Record<ThreadScope, { color: string; label: string; icon: string }> = {
  personal: { color: '#805AD5', label: 'Personal', icon: '👤' },
  team: { color: '#3182CE', label: 'Team', icon: '👥' },
  sphere: { color: BRAND.cenoteTurquoise, label: 'Sphere', icon: '🔵' },
  global: { color: BRAND.sacredGold, label: 'Global', icon: '🌐' },
};

const MEETING_STATUS_CONFIG: Record<MeetingStatus, { color: string; label: string; icon: string }> = {
  scheduled: { color: '#3182CE', label: 'Scheduled', icon: '📅' },
  'in-progress': { color: '#38A169', label: 'In Progress', icon: '🎙️' },
  completed: { color: BRAND.ancientStone, label: 'Completed', icon: '✅' },
  cancelled: { color: '#E53E3E', label: 'Cancelled', icon: '❌' },
};

const MEETING_TYPE_CONFIG: Record<MeetingType, { color: string; label: string; icon: string }> = {
  standup: { color: '#38A169', label: 'Standup', icon: '☀️' },
  brainstorm: { color: '#805AD5', label: 'Brainstorm', icon: '💡' },
  review: { color: '#DD6B20', label: 'Review', icon: '🔍' },
  planning: { color: '#3182CE', label: 'Planning', icon: '📋' },
  decision: { color: BRAND.sacredGold, label: 'Decision', icon: '⚖️' },
  general: { color: BRAND.ancientStone, label: 'General', icon: '💬' },
};

// ============================================================
// UTILITIES
// ============================================================

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDateTime(date: Date): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function formatTokens(amount: number): string {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return amount.toLocaleString();
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  // Thread list
  threadList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },

  threadListHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },

  threadListTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  createButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#ffffff',
    backgroundColor: BRAND.sacredGold,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },

  createButtonHover: {
    backgroundColor: BRAND.earthEmber,
  },

  // Thread card
  threadCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  threadCardHover: {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
  },

  threadCardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '16px',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  threadIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: `${BRAND.cenoteTurquoise}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: BRAND.cenoteTurquoise,
    flexShrink: 0,
  },

  threadInfo: {
    flex: 1,
    marginLeft: '12px',
    minWidth: 0,
  },

  threadTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  threadExtension: {
    fontSize: '11px',
    fontWeight: 500,
    color: BRAND.cenoteTurquoise,
    backgroundColor: `${BRAND.cenoteTurquoise}10`,
    padding: '2px 6px',
    borderRadius: '4px',
  },

  threadMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  statusBadge: {
    padding: '2px 8px',
    borderRadius: '100px',
    fontSize: '11px',
    fontWeight: 500,
  },

  scopeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
  },

  starButton: {
    padding: '4px',
    fontSize: '18px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.15s',
  },

  starButtonHover: {
    transform: 'scale(1.2)',
  },

  threadCardBody: {
    padding: '16px',
  },

  threadDescription: {
    fontSize: '13px',
    color: BRAND.ancientStone,
    lineHeight: 1.5,
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  },

  threadStats: {
    display: 'flex',
    gap: '16px',
    marginBottom: '12px',
  },

  threadStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  encodingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: BRAND.softSand,
    borderRadius: '8px',
    fontSize: '12px',
  },

  encodingScore: {
    fontWeight: 600,
    color: BRAND.jungleEmerald,
  },

  budgetBar: {
    marginTop: '12px',
  },

  budgetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
    fontSize: '11px',
    color: BRAND.ancientStone,
  },

  budgetProgress: {
    height: '4px',
    backgroundColor: `${BRAND.ancientStone}15`,
    borderRadius: '2px',
    overflow: 'hidden',
  },

  budgetFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s',
  },

  // Thread detail
  threadDetail: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
  },

  threadDetailHeader: {
    padding: '16px 20px',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  threadDetailTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '8px',
  },

  threadDetailMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '13px',
    color: BRAND.ancientStone,
  },

  messagesContainer: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },

  messageItem: {
    display: 'flex',
    gap: '12px',
    maxWidth: '80%',
  },

  messageItemUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse' as const,
  },

  messageItemAssistant: {
    alignSelf: 'flex-start',
  },

  messageAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: BRAND.softSand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    flexShrink: 0,
    overflow: 'hidden',
  },

  messageBubble: {
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    lineHeight: 1.5,
  },

  messageBubbleUser: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
    borderBottomRightRadius: '4px',
  },

  messageBubbleAssistant: {
    backgroundColor: BRAND.softSand,
    color: BRAND.uiSlate,
    borderBottomLeftRadius: '4px',
  },

  messageTime: {
    fontSize: '10px',
    color: BRAND.ancientStone,
    marginTop: '4px',
  },

  messageTokens: {
    fontSize: '10px',
    color: BRAND.ancientStone,
    marginTop: '2px',
  },

  inputContainer: {
    padding: '16px 20px',
    borderTop: `1px solid ${BRAND.ancientStone}08`,
    display: 'flex',
    gap: '12px',
  },

  messageInput: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '14px',
    color: BRAND.uiSlate,
    backgroundColor: BRAND.softSand,
    border: 'none',
    borderRadius: '8px',
    outline: 'none',
    resize: 'none' as const,
  },

  sendButton: {
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#ffffff',
    backgroundColor: BRAND.sacredGold,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },

  sendButtonHover: {
    backgroundColor: BRAND.earthEmber,
  },

  // Meeting list
  meetingList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },

  meetingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },

  // Meeting card
  meetingCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  meetingCardHover: {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
  },

  meetingCardHeader: {
    padding: '16px',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  meetingTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  meetingType: {
    padding: '2px 8px',
    borderRadius: '100px',
    fontSize: '11px',
    fontWeight: 500,
  },

  meetingDateTime: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: BRAND.ancientStone,
  },

  meetingCardBody: {
    padding: '16px',
  },

  meetingDescription: {
    fontSize: '13px',
    color: BRAND.ancientStone,
    lineHeight: 1.5,
    marginBottom: '12px',
  },

  meetingParticipants: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },

  participantAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: BRAND.softSand,
    border: '2px solid #ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginLeft: '-8px',
    overflow: 'hidden',
  },

  participantAvatarFirst: {
    marginLeft: 0,
  },

  participantMore: {
    backgroundColor: BRAND.ancientStone,
    color: '#ffffff',
  },

  meetingStats: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  meetingStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  joinButton: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#ffffff',
    backgroundColor: '#38A169',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
    marginTop: '12px',
  },

  joinButtonHover: {
    backgroundColor: '#2F855A',
  },

  // Meeting detail
  meetingDetail: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },

  detailHeader: {
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
  },

  detailTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: BRAND.uiSlate,
    marginBottom: '8px',
  },

  detailMeta: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '16px',
    marginBottom: '16px',
    fontSize: '13px',
    color: BRAND.ancientStone,
  },

  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  // Section
  section: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  sectionTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  sectionContent: {
    padding: '20px',
  },

  // Agenda
  agendaList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },

  agendaItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: BRAND.softSand,
    borderRadius: '8px',
  },

  agendaNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    flexShrink: 0,
  },

  agendaContent: {
    flex: 1,
  },

  agendaTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    marginBottom: '4px',
  },

  agendaMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  agendaStatus: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 500,
  },

  // Notes
  notesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },

  noteItem: {
    padding: '12px 16px',
    backgroundColor: BRAND.softSand,
    borderRadius: '8px',
  },

  noteContent: {
    fontSize: '14px',
    color: BRAND.uiSlate,
    lineHeight: 1.5,
    marginBottom: '8px',
  },

  noteMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  noteActionBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 500,
  },

  // Action items
  actionItemsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },

  actionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}15`,
  },

  actionCheckbox: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: `2px solid ${BRAND.ancientStone}40`,
    flexShrink: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionCheckboxCompleted: {
    backgroundColor: '#38A169',
    borderColor: '#38A169',
    color: '#ffffff',
  },

  actionContent: {
    flex: 1,
  },

  actionTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    marginBottom: '4px',
  },

  actionTitleCompleted: {
    textDecoration: 'line-through',
    color: BRAND.ancientStone,
  },

  actionMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  priorityBadge: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 500,
  },

  // Empty state
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center' as const,
  },

  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5,
  },

  emptyText: {
    fontSize: '14px',
    color: BRAND.ancientStone,
    marginBottom: '16px',
  },
};

// ============================================================
// THREAD CARD COMPONENT
// ============================================================

export function ThreadCard({
  thread,
  variant = 'detailed',
  onClick,
  onStar,
  className,
}: ThreadCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [starHovered, setStarHovered] = useState(false);

  const statusConfig = THREAD_STATUS_CONFIG[thread.status];
  const scopeConfig = THREAD_SCOPE_CONFIG[thread.scope];
  const budgetPercent = (thread.budget.used / thread.budget.allocated) * 100;

  return (
    <div
      style={{
        ...styles.threadCard,
        ...(isHovered && styles.threadCardHover),
      }}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.threadCardHeader}>
        <div style={styles.threadIcon}>💬</div>
        <div style={styles.threadInfo}>
          <div style={styles.threadTitle}>
            {thread.title}
            <span style={styles.threadExtension}>.chenu</span>
          </div>
          <div style={styles.threadMeta}>
            <span
              style={{
                ...styles.statusBadge,
                backgroundColor: `${statusConfig.color}15`,
                color: statusConfig.color,
              }}
            >
              {statusConfig.icon} {statusConfig.label}
            </span>
            <span style={{ ...styles.scopeBadge, color: scopeConfig.color }}>
              {scopeConfig.icon} {scopeConfig.label}
            </span>
          </div>
        </div>
        {onStar && (
          <button
            style={{
              ...styles.starButton,
              ...(starHovered && styles.starButtonHover),
            }}
            onClick={(e) => {
              e.stopPropagation();
              onStar(!thread.isStarred);
            }}
            onMouseEnter={() => setStarHovered(true)}
            onMouseLeave={() => setStarHovered(false)}
          >
            {thread.isStarred ? '⭐' : '☆'}
          </button>
        )}
      </div>

      {variant === 'detailed' && (
        <div style={styles.threadCardBody}>
          {thread.description && (
            <p style={styles.threadDescription}>{thread.description}</p>
          )}

          <div style={styles.threadStats}>
            <span style={styles.threadStat}>
              💬 {thread.messages.length} messages
            </span>
            <span style={styles.threadStat}>
              📝 {thread.decisions.length} decisions
            </span>
            {thread.lastMessageAt && (
              <span style={styles.threadStat}>
                🕐 {formatRelativeTime(thread.lastMessageAt)}
              </span>
            )}
          </div>

          <div style={styles.encodingBadge}>
            <span>🔐 Encoding:</span>
            <span style={styles.encodingScore}>
              {thread.encoding.qualityScore}%
            </span>
            <span>|</span>
            <span>{thread.encoding.compressionRatio}x compression</span>
          </div>

          <div style={styles.budgetBar}>
            <div style={styles.budgetHeader}>
              <span>Token Budget</span>
              <span>
                {formatTokens(thread.budget.used)} / {formatTokens(thread.budget.allocated)}
              </span>
            </div>
            <div style={styles.budgetProgress}>
              <div
                style={{
                  ...styles.budgetFill,
                  width: `${Math.min(budgetPercent, 100)}%`,
                  backgroundColor: budgetPercent > 90 ? '#E53E3E' : BRAND.cenoteTurquoise,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// THREAD LIST COMPONENT
// ============================================================

export function ThreadList({
  threads,
  view = 'list',
  onThreadClick,
  onCreateThread,
  showFilters = true,
  className,
}: ThreadListProps): JSX.Element {
  const [createHovered, setCreateHovered] = useState(false);

  if (threads.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>💬</div>
        <div style={styles.emptyText}>No threads yet</div>
        {onCreateThread && (
          <button
            style={{
              ...styles.createButton,
              ...(createHovered && styles.createButtonHover),
            }}
            onClick={onCreateThread}
            onMouseEnter={() => setCreateHovered(true)}
            onMouseLeave={() => setCreateHovered(false)}
          >
            ➕ Start Thread
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={styles.threadList} className={className}>
      <div style={styles.threadListHeader}>
        <span style={styles.threadListTitle}>Threads ({threads.length})</span>
        {onCreateThread && (
          <button
            style={{
              ...styles.createButton,
              ...(createHovered && styles.createButtonHover),
            }}
            onClick={onCreateThread}
            onMouseEnter={() => setCreateHovered(true)}
            onMouseLeave={() => setCreateHovered(false)}
          >
            ➕ New Thread
          </button>
        )}
      </div>

      {view === 'grid' ? (
        <div style={styles.meetingGrid}>
          {threads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              onClick={() => onThreadClick?.(thread)}
            />
          ))}
        </div>
      ) : (
        <div style={styles.threadList}>
          {threads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              variant="compact"
              onClick={() => onThreadClick?.(thread)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MEETING CARD COMPONENT
// ============================================================

export function MeetingCard({
  meeting,
  variant = 'detailed',
  onClick,
  onJoin,
  className,
}: MeetingCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);
  const [joinHovered, setJoinHovered] = useState(false);

  const statusConfig = MEETING_STATUS_CONFIG[meeting.status];
  const typeConfig = MEETING_TYPE_CONFIG[meeting.type];
  const duration = Math.round(
    (new Date(meeting.scheduledEnd).getTime() - new Date(meeting.scheduledStart).getTime()) / 60000
  );

  return (
    <div
      style={{
        ...styles.meetingCard,
        ...(isHovered && styles.meetingCardHover),
      }}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.meetingCardHeader}>
        <div style={styles.meetingTitle}>
          {meeting.title}
          <span
            style={{
              ...styles.meetingType,
              backgroundColor: `${typeConfig.color}15`,
              color: typeConfig.color,
            }}
          >
            {typeConfig.icon} {typeConfig.label}
          </span>
        </div>
        <div style={styles.meetingDateTime}>
          <span>📅 {formatDate(meeting.scheduledStart)}</span>
          <span>🕐 {formatTime(meeting.scheduledStart)}</span>
          <span>⏱️ {formatDuration(duration)}</span>
        </div>
      </div>

      {variant === 'detailed' && (
        <div style={styles.meetingCardBody}>
          {meeting.description && (
            <p style={styles.meetingDescription}>{meeting.description}</p>
          )}

          <div style={styles.meetingParticipants}>
            {meeting.participants.slice(0, 4).map((participant, index) => (
              <div
                key={participant.id}
                style={{
                  ...styles.participantAvatar,
                  ...(index === 0 && styles.participantAvatarFirst),
                }}
              >
                {participant.avatar ? (
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  participant.name.charAt(0).toUpperCase()
                )}
              </div>
            ))}
            {meeting.participants.length > 4 && (
              <div style={{ ...styles.participantAvatar, ...styles.participantMore }}>
                +{meeting.participants.length - 4}
              </div>
            )}
          </div>

          <div style={styles.meetingStats}>
            <span style={styles.meetingStat}>
              📋 {meeting.agenda.length} agenda items
            </span>
            <span style={styles.meetingStat}>
              ✅ {meeting.actionItems.length} action items
            </span>
          </div>

          {meeting.status === 'in-progress' && onJoin && (
            <button
              style={{
                ...styles.joinButton,
                ...(joinHovered && styles.joinButtonHover),
              }}
              onClick={(e) => {
                e.stopPropagation();
                onJoin();
              }}
              onMouseEnter={() => setJoinHovered(true)}
              onMouseLeave={() => setJoinHovered(false)}
            >
              🎙️ Join Meeting
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MEETING LIST COMPONENT
// ============================================================

export function MeetingList({
  meetings,
  view = 'list',
  onMeetingClick,
  onCreateMeeting,
  showFilters = true,
  className,
}: MeetingListProps): JSX.Element {
  const [createHovered, setCreateHovered] = useState(false);

  if (meetings.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📅</div>
        <div style={styles.emptyText}>No meetings scheduled</div>
        {onCreateMeeting && (
          <button
            style={{
              ...styles.createButton,
              ...(createHovered && styles.createButtonHover),
            }}
            onClick={onCreateMeeting}
            onMouseEnter={() => setCreateHovered(true)}
            onMouseLeave={() => setCreateHovered(false)}
          >
            ➕ Schedule Meeting
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={styles.meetingList} className={className}>
      <div style={styles.threadListHeader}>
        <span style={styles.threadListTitle}>Meetings ({meetings.length})</span>
        {onCreateMeeting && (
          <button
            style={{
              ...styles.createButton,
              ...(createHovered && styles.createButtonHover),
            }}
            onClick={onCreateMeeting}
            onMouseEnter={() => setCreateHovered(true)}
            onMouseLeave={() => setCreateHovered(false)}
          >
            ➕ New Meeting
          </button>
        )}
      </div>

      <div style={styles.meetingGrid}>
        {meetings.map((meeting) => (
          <MeetingCard
            key={meeting.id}
            meeting={meeting}
            onClick={() => onMeetingClick?.(meeting)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  ThreadStatus,
  ThreadScope,
  MessageRole,
  ThreadOwner,
  ThreadEncoding,
  ThreadBudget,
  ThreadMessage,
  ThreadDecision,
  Thread,
  MeetingStatus,
  MeetingType,
  ParticipantRole,
  MeetingParticipant,
  MeetingAgendaItem,
  MeetingNote,
  MeetingActionItem,
  Meeting,
  ThreadListProps,
  ThreadCardProps,
  ThreadDetailProps,
  MeetingListProps,
  MeetingCardProps,
  MeetingDetailProps,
};

export {
  THREAD_STATUS_CONFIG,
  THREAD_SCOPE_CONFIG,
  MEETING_STATUS_CONFIG,
  MEETING_TYPE_CONFIG,
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatDuration,
  formatTokens,
};

export default {
  ThreadList,
  ThreadCard,
  MeetingList,
  MeetingCard,
};
