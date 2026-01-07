/**
 * ============================================================
 * CHE·NU — XR TIMELINE VIEW
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 * 
 * Timeline visualization of XR scenes/rooms.
 * Shows conceptual progression through rooms.
 * NOT real navigation tracking.
 */

import React, { useState, useMemo } from 'react';

// ============================================================
// TYPES
// ============================================================

interface TimelineEvent {
  id: string;
  sceneId: string;
  sceneName: string;
  sphere: string;
  timestamp: string;
  type: 'visit' | 'portal' | 'create' | 'update';
  details?: string;
}

interface XRTimelineViewProps {
  events: TimelineEvent[];
  onEventClick?: (eventId: string) => void;
  onSceneClick?: (sceneId: string) => void;
  maxVisible?: number;
}

// ============================================================
// CONSTANTS
// ============================================================

const CHENU_COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

const SPHERE_COLORS: Record<string, string> = {
  personal: CHENU_COLORS.sacredGold,
  business: CHENU_COLORS.jungleEmerald,
  community: CHENU_COLORS.cenoteTurquoise,
  social: '#3498DB',
  entertainment: '#E74C3C',
  ailab: '#00D9FF',
  scholar: '#9B59B6',
  creative: '#F39C12',
  xr: '#00CED1',
};

const SPHERE_ICONS: Record<string, string> = {
  personal: '🏠',
  business: '💼',
  community: '🌐',
  social: '👥',
  entertainment: '🎮',
  ailab: '🤖',
  scholar: '📚',
  creative: '🎨',
  xr: '🌀',
};

const EVENT_TYPE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  visit: { icon: '📍', label: 'Visited', color: CHENU_COLORS.cenoteTurquoise },
  portal: { icon: '🌀', label: 'Portal Jump', color: '#9B59B6' },
  create: { icon: '✨', label: 'Created', color: CHENU_COLORS.sacredGold },
  update: { icon: '🔄', label: 'Updated', color: CHENU_COLORS.jungleEmerald },
};

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: CHENU_COLORS.uiSlate,
    borderRadius: '16px',
    padding: '20px',
    color: CHENU_COLORS.softSand,
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stats: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  filters: {
    display: 'flex',
    gap: '6px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  filterChip: {
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid transparent',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: CHENU_COLORS.ancientStone,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  filterChipActive: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
  },
  timeline: {
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: '24px',
    top: '0',
    bottom: '0',
    width: '2px',
    backgroundColor: CHENU_COLORS.shadowMoss,
  },
  eventList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  event: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '12px',
    paddingLeft: '0',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    borderRadius: '8px',
    marginLeft: '8px',
  },
  eventDot: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    flexShrink: 0,
    zIndex: 1,
    border: `2px solid ${CHENU_COLORS.uiSlate}`,
  },
  eventContent: {
    flex: 1,
    minWidth: 0,
  },
  eventHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  eventScene: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  eventType: {
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '10px',
    fontWeight: 500,
  },
  eventDetails: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '4px',
  },
  eventTime: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  eventSphere: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
  },
  sphereDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  loadMore: {
    textAlign: 'center',
    padding: '12px',
  },
  loadMoreButton: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.shadowMoss}`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: CHENU_COLORS.ancientStone,
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  dayGroup: {
    marginBottom: '20px',
  },
  dayHeader: {
    fontSize: '11px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px',
    marginLeft: '56px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dayLine: {
    flex: 1,
    height: '1px',
    backgroundColor: CHENU_COLORS.shadowMoss,
  },
};

// ============================================================
// HELPERS
// ============================================================

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  }
}

function groupByDate(events: TimelineEvent[]): Map<string, TimelineEvent[]> {
  const groups = new Map<string, TimelineEvent[]>();
  
  for (const event of events) {
    const dateKey = new Date(event.timestamp).toDateString();
    const existing = groups.get(dateKey) || [];
    existing.push(event);
    groups.set(dateKey, existing);
  }
  
  return groups;
}

// ============================================================
// COMPONENT
// ============================================================

export const XRTimelineView: React.FC<XRTimelineViewProps> = ({
  events,
  onEventClick,
  onSceneClick,
  maxVisible = 20,
}) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(maxVisible);

  // Filter events
  const filteredEvents = useMemo(() => {
    if (!selectedType) return events;
    return events.filter(e => e.type === selectedType);
  }, [events, selectedType]);

  // Sort by timestamp (newest first)
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [filteredEvents]);

  // Visible events
  const visibleEvents = sortedEvents.slice(0, visibleCount);

  // Group by date
  const groupedEvents = useMemo(() => groupByDate(visibleEvents), [visibleEvents]);

  // Event type counts
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const event of events) {
      counts[event.type] = (counts[event.type] || 0) + 1;
    }
    return counts;
  }, [events]);

  if (events.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.title}>
            <span>🕐</span>
            XR Timeline
          </div>
        </div>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🕐</div>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>No events yet</div>
          <div style={{ fontSize: '13px' }}>Timeline will show scene visits and interactions</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>🕐</span>
          XR Timeline
        </div>
        <div style={styles.stats}>
          <span>📊 {events.length} events</span>
          <span>🗓️ {groupedEvents.size} days</span>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <div
          style={{
            ...styles.filterChip,
            ...(selectedType === null ? styles.filterChipActive : {}),
          }}
          onClick={() => setSelectedType(null)}
        >
          All ({events.length})
        </div>
        {Object.entries(EVENT_TYPE_CONFIG).map(([type, config]) => (
          <div
            key={type}
            style={{
              ...styles.filterChip,
              ...(selectedType === type ? styles.filterChipActive : {}),
            }}
            onClick={() => setSelectedType(type)}
          >
            <span>{config.icon}</span>
            {config.label} ({typeCounts[type] || 0})
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div style={styles.timeline}>
        <div style={styles.timelineLine} />
        
        {Array.from(groupedEvents.entries()).map(([dateKey, dayEvents]) => (
          <div key={dateKey} style={styles.dayGroup}>
            {/* Day Header */}
            <div style={styles.dayHeader}>
              <span>{formatDate(dayEvents[0].timestamp)}</span>
              <div style={styles.dayLine} />
              <span>{dayEvents.length} events</span>
            </div>

            {/* Events for this day */}
            <div style={styles.eventList}>
              {dayEvents.map(event => {
                const typeConfig = EVENT_TYPE_CONFIG[event.type];
                const sphereColor = SPHERE_COLORS[event.sphere] || CHENU_COLORS.ancientStone;
                const sphereIcon = SPHERE_ICONS[event.sphere] || '📍';

                return (
                  <div
                    key={event.id}
                    style={styles.event}
                    onClick={() => onEventClick?.(event.id)}
                  >
                    <div
                      style={{
                        ...styles.eventDot,
                        backgroundColor: typeConfig.color,
                      }}
                    >
                      {typeConfig.icon}
                    </div>

                    <div style={styles.eventContent}>
                      <div style={styles.eventHeader}>
                        <span
                          style={styles.eventScene}
                          onClick={e => {
                            e.stopPropagation();
                            onSceneClick?.(event.sceneId);
                          }}
                        >
                          {event.sceneName}
                        </span>
                        <span
                          style={{
                            ...styles.eventType,
                            backgroundColor: `${typeConfig.color}20`,
                            color: typeConfig.color,
                          }}
                        >
                          {typeConfig.label}
                        </span>
                      </div>

                      {event.details && (
                        <div style={styles.eventDetails}>{event.details}</div>
                      )}

                      <div style={styles.eventTime}>
                        <span>🕐 {formatTime(event.timestamp)}</span>
                        <span>•</span>
                        <div style={styles.eventSphere}>
                          <div
                            style={{
                              ...styles.sphereDot,
                              backgroundColor: sphereColor,
                            }}
                          />
                          <span>{sphereIcon} {event.sphere}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Load More */}
        {visibleCount < sortedEvents.length && (
          <div style={styles.loadMore}>
            <button
              style={styles.loadMoreButton}
              onClick={() => setVisibleCount(v => v + maxVisible)}
            >
              Load more ({sortedEvents.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default XRTimelineView;
