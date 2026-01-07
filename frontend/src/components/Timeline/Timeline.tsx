// CHE·NU™ Timeline & Activity Feed Components
// Comprehensive timeline with events, activities, and history tracking

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  ReactNode,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type TimelineOrientation = 'vertical' | 'horizontal';
type TimelinePosition = 'left' | 'right' | 'alternate';
type ActivityType = 
  | 'created' 
  | 'updated' 
  | 'deleted' 
  | 'commented'
  | 'assigned'
  | 'completed'
  | 'moved'
  | 'uploaded'
  | 'shared'
  | 'mentioned'
  | 'approved'
  | 'rejected'
  | 'system';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: Date;
  icon?: ReactNode;
  color?: string;
  status?: 'completed' | 'current' | 'upcoming' | 'error';
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  meta?: Record<string, any>;
  children?: ReactNode;
}

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: Date;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  target?: {
    id: string;
    type: string;
    name: string;
    url?: string;
  };
  changes?: Array<{
    field: string;
    from?: string;
    to?: string;
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    size?: number;
  }>;
  comments?: number;
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  isRead?: boolean;
  isPinned?: boolean;
  meta?: Record<string, any>;
}

interface TimelineProps {
  items: TimelineItem[];
  orientation?: TimelineOrientation;
  position?: TimelinePosition;
  showConnector?: boolean;
  animate?: boolean;
  onItemClick?: (item: TimelineItem) => void;
  renderItem?: (item: TimelineItem, index: number) => ReactNode;
  className?: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
  showLoadMore?: boolean;
  groupByDate?: boolean;
  showFilters?: boolean;
  filterTypes?: ActivityType[];
  onActivityClick?: (activity: ActivityItem) => void;
  onLoadMore?: () => void;
  onMarkAsRead?: (activityId: string) => void;
  onPin?: (activityId: string) => void;
  renderActivity?: (activity: ActivityItem) => ReactNode;
  emptyMessage?: string;
  className?: string;
}

interface HistoryLogProps {
  entries: Array<{
    id: string;
    action: string;
    description?: string;
    user: { id: string; name: string; avatar?: string };
    timestamp: Date;
    details?: Record<string, any>;
  }>;
  showSearch?: boolean;
  showFilter?: boolean;
  onEntryClick?: (entry: unknown) => void;
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

const ACTIVITY_CONFIG: Record<ActivityType, { icon: string; color: string; label: string }> = {
  created: { icon: '✨', color: '#38A169', label: 'Created' },
  updated: { icon: '✏️', color: '#3182CE', label: 'Updated' },
  deleted: { icon: '🗑️', color: '#E53E3E', label: 'Deleted' },
  commented: { icon: '💬', color: '#805AD5', label: 'Commented' },
  assigned: { icon: '👤', color: '#DD6B20', label: 'Assigned' },
  completed: { icon: '✅', color: '#38A169', label: 'Completed' },
  moved: { icon: '↔️', color: '#3182CE', label: 'Moved' },
  uploaded: { icon: '📎', color: '#D69E2E', label: 'Uploaded' },
  shared: { icon: '🔗', color: '#319795', label: 'Shared' },
  mentioned: { icon: '@', color: '#D53F8C', label: 'Mentioned' },
  approved: { icon: '👍', color: '#38A169', label: 'Approved' },
  rejected: { icon: '👎', color: '#E53E3E', label: 'Rejected' },
  system: { icon: '⚙️', color: BRAND.ancientStone, label: 'System' },
};

const STATUS_CONFIG = {
  completed: { color: '#38A169', icon: '✓' },
  current: { color: BRAND.cenoteTurquoise, icon: '●' },
  upcoming: { color: BRAND.ancientStone, icon: '○' },
  error: { color: '#E53E3E', icon: '✕' },
};

// ============================================================
// UTILITIES
// ============================================================

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return date.toLocaleDateString();
}

function formatDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function groupByDate<T extends { timestamp: Date }>(items: T[]): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  
  items.forEach((item) => {
    const dateKey = formatDate(new Date(item.timestamp));
    const existing = groups.get(dateKey) || [];
    groups.set(dateKey, [...existing, item]);
  });
  
  return groups;
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  // Timeline styles
  timeline: {
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'relative' as const,
  },

  timelineHorizontal: {
    flexDirection: 'row' as const,
    overflowX: 'auto' as const,
    padding: '20px 0',
  },

  timelineConnector: {
    position: 'absolute' as const,
    backgroundColor: `${BRAND.ancientStone}30`,
  },

  timelineConnectorVertical: {
    width: '2px',
    top: '24px',
    bottom: '24px',
    left: '15px',
  },

  timelineConnectorHorizontal: {
    height: '2px',
    left: '24px',
    right: '24px',
    top: '15px',
  },

  timelineConnectorAlternate: {
    left: '50%',
    transform: 'translateX(-50%)',
  },

  timelineItem: {
    display: 'flex',
    gap: '16px',
    padding: '16px 0',
    position: 'relative' as const,
  },

  timelineItemHorizontal: {
    flexDirection: 'column' as const,
    alignItems: 'center',
    minWidth: '200px',
    padding: '0 16px',
  },

  timelineItemRight: {
    flexDirection: 'row-reverse' as const,
    textAlign: 'right' as const,
  },

  timelineItemAlternate: {
    width: '50%',
  },

  timelineItemAlternateRight: {
    marginLeft: '50%',
  },

  timelineDot: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    border: `3px solid ${BRAND.cenoteTurquoise}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    flexShrink: 0,
    zIndex: 1,
    transition: 'all 0.2s',
  },

  timelineDotCompleted: {
    backgroundColor: '#38A169',
    borderColor: '#38A169',
    color: '#ffffff',
  },

  timelineDotCurrent: {
    backgroundColor: BRAND.cenoteTurquoise,
    borderColor: BRAND.cenoteTurquoise,
    color: '#ffffff',
    boxShadow: `0 0 0 4px ${BRAND.cenoteTurquoise}30`,
  },

  timelineDotUpcoming: {
    borderColor: BRAND.ancientStone,
    color: BRAND.ancientStone,
  },

  timelineDotError: {
    backgroundColor: '#E53E3E',
    borderColor: '#E53E3E',
    color: '#ffffff',
  },

  timelineContent: {
    flex: 1,
  },

  timelineTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '4px',
  },

  timelineDescription: {
    fontSize: '14px',
    color: BRAND.ancientStone,
    lineHeight: 1.5,
    marginBottom: '8px',
  },

  timelineDate: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  timelineUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '8px',
  },

  timelineUserAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: BRAND.softSand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    overflow: 'hidden',
  },

  timelineUserName: {
    fontSize: '13px',
    color: BRAND.ancientStone,
  },

  timelineActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },

  timelineAction: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 500,
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  timelineActionPrimary: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  timelineActionSecondary: {
    backgroundColor: BRAND.softSand,
    color: BRAND.uiSlate,
  },

  timelineActionDanger: {
    backgroundColor: '#FED7D7',
    color: '#E53E3E',
  },

  // Activity feed styles
  activityFeed: {
    display: 'flex',
    flexDirection: 'column' as const,
  },

  activityFilters: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderBottom: `1px solid ${BRAND.ancientStone}15`,
    overflowX: 'auto' as const,
  },

  activityFilterButton: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 500,
    color: BRAND.ancientStone,
    backgroundColor: 'transparent',
    border: `1px solid ${BRAND.ancientStone}20`,
    borderRadius: '100px',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.15s',
  },

  activityFilterButtonActive: {
    backgroundColor: BRAND.sacredGold,
    borderColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  activityDateGroup: {
    padding: '8px 16px',
    backgroundColor: BRAND.softSand,
    fontSize: '12px',
    fontWeight: 600,
    color: BRAND.ancientStone,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },

  activityItem: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#ffffff',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
    transition: 'background-color 0.15s',
    cursor: 'pointer',
  },

  activityItemHover: {
    backgroundColor: BRAND.softSand,
  },

  activityItemUnread: {
    backgroundColor: `${BRAND.cenoteTurquoise}05`,
  },

  activityItemPinned: {
    borderLeft: `3px solid ${BRAND.sacredGold}`,
  },

  activityIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    flexShrink: 0,
  },

  activityContent: {
    flex: 1,
    minWidth: 0,
  },

  activityHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '8px',
    marginBottom: '4px',
  },

  activityTitle: {
    fontSize: '14px',
    color: BRAND.uiSlate,
    lineHeight: 1.4,
  },

  activityTitleUser: {
    fontWeight: 600,
  },

  activityTitleTarget: {
    fontWeight: 500,
    color: BRAND.cenoteTurquoise,
    cursor: 'pointer',
  },

  activityTime: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    whiteSpace: 'nowrap' as const,
  },

  activityDescription: {
    fontSize: '13px',
    color: BRAND.ancientStone,
    lineHeight: 1.5,
    marginBottom: '8px',
  },

  activityChanges: {
    backgroundColor: BRAND.softSand,
    borderRadius: '6px',
    padding: '8px 12px',
    marginBottom: '8px',
  },

  activityChange: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    padding: '4px 0',
  },

  activityChangeField: {
    fontWeight: 500,
    color: BRAND.uiSlate,
    minWidth: '80px',
  },

  activityChangeFrom: {
    color: '#E53E3E',
    textDecoration: 'line-through',
  },

  activityChangeTo: {
    color: '#38A169',
  },

  activityAttachments: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginBottom: '8px',
  },

  activityAttachment: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    backgroundColor: BRAND.softSand,
    borderRadius: '6px',
    fontSize: '12px',
    color: BRAND.uiSlate,
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },

  activityAttachmentHover: {
    backgroundColor: `${BRAND.ancientStone}20`,
  },

  activityFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },

  activityReactions: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  activityReaction: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: BRAND.softSand,
    borderRadius: '100px',
    fontSize: '12px',
    cursor: 'pointer',
  },

  activityComments: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: BRAND.ancientStone,
    cursor: 'pointer',
  },

  activityActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: 'auto',
    opacity: 0,
    transition: 'opacity 0.15s',
  },

  activityActionsVisible: {
    opacity: 1,
  },

  activityActionButton: {
    padding: '4px 8px',
    fontSize: '11px',
    color: BRAND.ancientStone,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  activityActionButtonHover: {
    backgroundColor: BRAND.softSand,
    color: BRAND.uiSlate,
  },

  loadMore: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },

  loadMoreButton: {
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.sacredGold,
    backgroundColor: 'transparent',
    border: `1px solid ${BRAND.sacredGold}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  loadMoreButtonHover: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    textAlign: 'center' as const,
  },

  emptyStateIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5,
  },

  emptyStateText: {
    fontSize: '14px',
    color: BRAND.ancientStone,
  },

  // History log styles
  historyLog: {
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
  },

  historyHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: `1px solid ${BRAND.ancientStone}10`,
    backgroundColor: BRAND.softSand,
  },

  historyTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  historySearch: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    border: `1px solid ${BRAND.ancientStone}20`,
  },

  historySearchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '13px',
    color: BRAND.uiSlate,
    backgroundColor: 'transparent',
    width: '150px',
  },

  historyList: {
    maxHeight: '400px',
    overflowY: 'auto' as const,
  },

  historyEntry: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 16px',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },

  historyEntryHover: {
    backgroundColor: BRAND.softSand,
  },

  historyEntryAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: BRAND.softSand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    flexShrink: 0,
    overflow: 'hidden',
  },

  historyEntryContent: {
    flex: 1,
    minWidth: 0,
  },

  historyEntryAction: {
    fontSize: '13px',
    color: BRAND.uiSlate,
    marginBottom: '2px',
  },

  historyEntryActionBold: {
    fontWeight: 600,
  },

  historyEntryTime: {
    fontSize: '11px',
    color: BRAND.ancientStone,
  },

  historyEntryDetails: {
    marginTop: '6px',
    padding: '6px 8px',
    backgroundColor: BRAND.softSand,
    borderRadius: '4px',
    fontSize: '11px',
    fontFamily: 'monospace',
    color: BRAND.ancientStone,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
};

// ============================================================
// TIMELINE COMPONENT
// ============================================================

export function Timeline({
  items,
  orientation = 'vertical',
  position = 'left',
  showConnector = true,
  animate = true,
  onItemClick,
  renderItem,
  className,
}: TimelineProps): JSX.Element {
  const isHorizontal = orientation === 'horizontal';
  const isAlternate = position === 'alternate';

  return (
    <div
      style={{
        ...styles.timeline,
        ...(isHorizontal && styles.timelineHorizontal),
      }}
      className={className}
    >
      {/* Connector line */}
      {showConnector && (
        <div
          style={{
            ...styles.timelineConnector,
            ...(isHorizontal ? styles.timelineConnectorHorizontal : styles.timelineConnectorVertical),
            ...(isAlternate && !isHorizontal && styles.timelineConnectorAlternate),
          }}
        />
      )}

      {/* Items */}
      {items.map((item, index) => {
        const isRight = position === 'right' || (isAlternate && index % 2 === 1);
        const statusConfig = item.status ? STATUS_CONFIG[item.status] : null;

        if (renderItem) {
          return (
            <div key={item.id} onClick={() => onItemClick?.(item)}>
              {renderItem(item, index)}
            </div>
          );
        }

        return (
          <div
            key={item.id}
            style={{
              ...styles.timelineItem,
              ...(isHorizontal && styles.timelineItemHorizontal),
              ...(isRight && !isHorizontal && styles.timelineItemRight),
              ...(isAlternate && styles.timelineItemAlternate),
              ...(isAlternate && isRight && styles.timelineItemAlternateRight),
            }}
            onClick={() => onItemClick?.(item)}
          >
            {/* Dot */}
            <div
              style={{
                ...styles.timelineDot,
                ...(item.status === 'completed' && styles.timelineDotCompleted),
                ...(item.status === 'current' && styles.timelineDotCurrent),
                ...(item.status === 'upcoming' && styles.timelineDotUpcoming),
                ...(item.status === 'error' && styles.timelineDotError),
                ...(item.color && { borderColor: item.color, backgroundColor: item.status === 'completed' ? item.color : '#ffffff' }),
              }}
            >
              {item.icon || (statusConfig?.icon)}
            </div>

            {/* Content */}
            <div style={styles.timelineContent}>
              <div style={styles.timelineTitle}>{item.title}</div>
              {item.description && (
                <div style={styles.timelineDescription}>{item.description}</div>
              )}
              <div style={styles.timelineDate}>
                📅 {item.date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
                {' · '}
                {item.date.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </div>

              {item.user && (
                <div style={styles.timelineUser}>
                  <div style={styles.timelineUserAvatar}>
                    {item.user.avatar ? (
                      <img
                        src={item.user.avatar}
                        alt={item.user.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      item.user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span style={styles.timelineUserName}>{item.user.name}</span>
                </div>
              )}

              {item.actions && item.actions.length > 0 && (
                <div style={styles.timelineActions}>
                  {item.actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      style={{
                        ...styles.timelineAction,
                        ...(action.variant === 'primary' && styles.timelineActionPrimary),
                        ...(action.variant === 'secondary' && styles.timelineActionSecondary),
                        ...(action.variant === 'danger' && styles.timelineActionDanger),
                        ...(!action.variant && styles.timelineActionSecondary),
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick();
                      }}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}

              {item.children}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// ACTIVITY FEED COMPONENT
// ============================================================

export function ActivityFeed({
  activities,
  maxItems,
  showLoadMore = true,
  groupByDate = true,
  showFilters = false,
  filterTypes,
  onActivityClick,
  onLoadMore,
  onMarkAsRead,
  onPin,
  renderActivity,
  emptyMessage = 'No activity yet',
  className,
}: ActivityFeedProps): JSX.Element {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<ActivityType | 'all'>('all');
  const [loadMoreHovered, setLoadMoreHovered] = useState(false);

  // Filter activities
  const filteredActivities = useMemo(() => {
    let result = [...activities];
    
    if (selectedFilter !== 'all') {
      result = result.filter((a) => a.type === selectedFilter);
    }
    
    if (maxItems) {
      result = result.slice(0, maxItems);
    }
    
    return result;
  }, [activities, selectedFilter, maxItems]);

  // Group by date if enabled
  const groupedActivities = useMemo(() => {
    if (!groupByDate) return null;
    return groupByDate ? groupByDate(filteredActivities) : null;
  }, [filteredActivities, groupByDate]);

  const renderActivityItem = (activity: ActivityItem) => {
    const config = ACTIVITY_CONFIG[activity.type];
    const isHovered = hoveredId === activity.id;

    if (renderActivity) {
      return renderActivity(activity);
    }

    return (
      <div
        key={activity.id}
        style={{
          ...styles.activityItem,
          ...(isHovered && styles.activityItemHover),
          ...(!activity.isRead && styles.activityItemUnread),
          ...(activity.isPinned && styles.activityItemPinned),
        }}
        onMouseEnter={() => setHoveredId(activity.id)}
        onMouseLeave={() => setHoveredId(null)}
        onClick={() => onActivityClick?.(activity)}
      >
        {/* Icon */}
        <div
          style={{
            ...styles.activityIcon,
            backgroundColor: `${config.color}15`,
          }}
        >
          {config.icon}
        </div>

        {/* Content */}
        <div style={styles.activityContent}>
          <div style={styles.activityHeader}>
            <div style={styles.activityTitle}>
              <span style={styles.activityTitleUser}>{activity.user.name}</span>
              {' '}
              {config.label.toLowerCase()}
              {activity.target && (
                <>
                  {' '}
                  <span style={styles.activityTitleTarget}>{activity.target.name}</span>
                </>
              )}
            </div>
            <span style={styles.activityTime}>
              {formatRelativeTime(new Date(activity.timestamp))}
            </span>
          </div>

          {activity.description && (
            <div style={styles.activityDescription}>{activity.description}</div>
          )}

          {/* Changes */}
          {activity.changes && activity.changes.length > 0 && (
            <div style={styles.activityChanges}>
              {activity.changes.map((change, index) => (
                <div key={index} style={styles.activityChange}>
                  <span style={styles.activityChangeField}>{change.field}:</span>
                  {change.from && (
                    <span style={styles.activityChangeFrom}>{change.from}</span>
                  )}
                  <span>→</span>
                  <span style={styles.activityChangeTo}>{change.to}</span>
                </div>
              ))}
            </div>
          )}

          {/* Attachments */}
          {activity.attachments && activity.attachments.length > 0 && (
            <div style={styles.activityAttachments}>
              {activity.attachments.map((attachment) => (
                <div key={attachment.id} style={styles.activityAttachment}>
                  📎 {attachment.name}
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={styles.activityFooter}>
            {activity.reactions && activity.reactions.length > 0 && (
              <div style={styles.activityReactions}>
                {activity.reactions.map((reaction, index) => (
                  <div key={index} style={styles.activityReaction}>
                    {reaction.emoji} {reaction.count}
                  </div>
                ))}
              </div>
            )}

            {activity.comments !== undefined && activity.comments > 0 && (
              <div style={styles.activityComments}>
                💬 {activity.comments}
              </div>
            )}

            <div
              style={{
                ...styles.activityActions,
                ...(isHovered && styles.activityActionsVisible),
              }}
            >
              {!activity.isRead && onMarkAsRead && (
                <button
                  style={styles.activityActionButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(activity.id);
                  }}
                >
                  Mark as read
                </button>
              )}
              {onPin && (
                <button
                  style={styles.activityActionButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPin(activity.id);
                  }}
                >
                  {activity.isPinned ? 'Unpin' : 'Pin'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (filteredActivities.length === 0) {
    return (
      <div style={styles.activityFeed} className={className}>
        <div style={styles.emptyState}>
          <div style={styles.emptyStateIcon}>📭</div>
          <div style={styles.emptyStateText}>{emptyMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.activityFeed} className={className}>
      {/* Filters */}
      {showFilters && filterTypes && (
        <div style={styles.activityFilters}>
          <button
            style={{
              ...styles.activityFilterButton,
              ...(selectedFilter === 'all' && styles.activityFilterButtonActive),
            }}
            onClick={() => setSelectedFilter('all')}
          >
            All
          </button>
          {filterTypes.map((type) => (
            <button
              key={type}
              style={{
                ...styles.activityFilterButton,
                ...(selectedFilter === type && styles.activityFilterButtonActive),
              }}
              onClick={() => setSelectedFilter(type)}
            >
              {ACTIVITY_CONFIG[type].icon} {ACTIVITY_CONFIG[type].label}
            </button>
          ))}
        </div>
      )}

      {/* Activities */}
      {groupByDate && groupedActivities ? (
        Array.from(groupedActivities.entries()).map(([date, dateActivities]) => (
          <React.Fragment key={date}>
            <div style={styles.activityDateGroup}>{date}</div>
            {dateActivities.map(renderActivityItem)}
          </React.Fragment>
        ))
      ) : (
        filteredActivities.map(renderActivityItem)
      )}

      {/* Load more */}
      {showLoadMore && onLoadMore && (
        <div style={styles.loadMore}>
          <button
            style={{
              ...styles.loadMoreButton,
              ...(loadMoreHovered && styles.loadMoreButtonHover),
            }}
            onClick={onLoadMore}
            onMouseEnter={() => setLoadMoreHovered(true)}
            onMouseLeave={() => setLoadMoreHovered(false)}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// HISTORY LOG COMPONENT
// ============================================================

export function HistoryLog({
  entries,
  showSearch = true,
  showFilter = false,
  onEntryClick,
  className,
}: HistoryLogProps): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredEntries = useMemo(() => {
    if (!searchQuery) return entries;
    const query = searchQuery.toLowerCase();
    return entries.filter(
      (entry) =>
        entry.action.toLowerCase().includes(query) ||
        entry.user.name.toLowerCase().includes(query) ||
        entry.description?.toLowerCase().includes(query)
    );
  }, [entries, searchQuery]);

  return (
    <div style={styles.historyLog} className={className}>
      {/* Header */}
      <div style={styles.historyHeader}>
        <span style={styles.historyTitle}>History Log</span>
        {showSearch && (
          <div style={styles.historySearch}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.historySearchInput}
            />
          </div>
        )}
      </div>

      {/* List */}
      <div style={styles.historyList}>
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            style={{
              ...styles.historyEntry,
              ...(hoveredId === entry.id && styles.historyEntryHover),
            }}
            onClick={() => onEntryClick?.(entry)}
            onMouseEnter={() => setHoveredId(entry.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div style={styles.historyEntryAvatar}>
              {entry.user.avatar ? (
                <img
                  src={entry.user.avatar}
                  alt={entry.user.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                entry.user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div style={styles.historyEntryContent}>
              <div style={styles.historyEntryAction}>
                <span style={styles.historyEntryActionBold}>{entry.user.name}</span>
                {' '}{entry.action}
              </div>
              <div style={styles.historyEntryTime}>
                {formatRelativeTime(new Date(entry.timestamp))}
              </div>
              {entry.details && (
                <div style={styles.historyEntryDetails}>
                  {JSON.stringify(entry.details)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  TimelineOrientation,
  TimelinePosition,
  ActivityType,
  TimelineItem,
  ActivityItem,
  TimelineProps,
  ActivityFeedProps,
  HistoryLogProps,
};

export {
  ACTIVITY_CONFIG,
  STATUS_CONFIG,
  formatRelativeTime,
  formatDate,
  isSameDay,
  groupByDate,
};

export default {
  Timeline,
  ActivityFeed,
  HistoryLog,
};
