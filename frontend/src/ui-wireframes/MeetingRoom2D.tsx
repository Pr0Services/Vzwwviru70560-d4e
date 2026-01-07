// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — MEETING ROOM 2D
// Canonical Implementation of UI Wireframe
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface AgendaItem {
  id: string;
  title: string;
  completed: boolean;
}

interface TimelineEvent {
  id: string;
  type: 'decision' | 'task' | 'comment' | 'joined';
  content: string;
  timestamp: string;
  agent?: string;
}

interface ActiveAgent {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

interface Meeting {
  id: string;
  title: string;
  objective: string;
  agenda: AgendaItem[];
  timeline: TimelineEvent[];
  activeAgents: ActiveAgent[];
  status: 'active' | 'paused' | 'completed';
}

interface MeetingRoom2DProps {
  meeting: Meeting;
  onSummarize: () => void;
  onDecide: () => void;
  onContinueLater: () => void;
  onAgendaItemClick?: (item: AgendaItem) => void;
  onSendMessage?: (message: string) => void;
}

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    background: 'white',
    borderRadius: '12px',
    border: '1px solid #e8e8e8',
    overflow: 'hidden',
  },
  
  header: {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #e8e8e8',
  },
  
  title: {
    margin: '0 0 0.5rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  
  objectiveSection: {
    padding: '0.75rem 1.25rem',
    borderBottom: '1px solid #e8e8e8',
    background: '#f0f7ff',
  },
  
  objectiveLabel: {
    fontSize: '0.75rem',
    color: '#0066cc',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '0.25rem',
  },
  
  objectiveText: {
    margin: 0,
    fontSize: '0.9375rem',
    color: '#1a1a1a',
  },
  
  mainContent: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  
  leftPanel: {
    width: '250px',
    borderRight: '1px solid #e8e8e8',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  
  panelSection: {
    padding: '1rem',
    borderBottom: '1px solid #f5f5f5',
  },
  
  panelLabel: {
    fontSize: '0.75rem',
    color: '#737373',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '0.75rem',
  },
  
  agendaList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  
  agendaItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    padding: '0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 150ms ease',
  },
  
  agendaNumber: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#e8e8e8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#525252',
    flexShrink: 0,
  },
  
  agendaText: {
    fontSize: '0.875rem',
    color: '#1a1a1a',
  },
  
  agentsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  
  agentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#525252',
  },
  
  agentAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#e8e8e8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
  },
  
  onlineIndicator: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#10b981',
    marginLeft: 'auto',
  },
  
  rightPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  
  discussionArea: {
    flex: 1,
    padding: '1rem',
    overflow: 'auto',
  },
  
  discussionLabel: {
    fontSize: '0.75rem',
    color: '#737373',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '1rem',
  },
  
  timeline: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  
  timelineItem: {
    display: 'flex',
    gap: '0.75rem',
    padding: '0.75rem',
    borderRadius: '8px',
    background: '#fafafa',
  },
  
  timelineIcon: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    flexShrink: 0,
  },
  
  timelineContent: {
    flex: 1,
  },
  
  timelineText: {
    margin: 0,
    fontSize: '0.875rem',
    color: '#1a1a1a',
  },
  
  timelineTime: {
    fontSize: '0.75rem',
    color: '#a3a3a3',
    marginTop: '0.25rem',
  },
  
  messageInput: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem',
    borderTop: '1px solid #e8e8e8',
  },
  
  input: {
    flex: 1,
    padding: '0.625rem 1rem',
    border: '1px solid #e8e8e8',
    borderRadius: '8px',
    fontSize: '0.9375rem',
    fontFamily: 'inherit',
  },
  
  sendButton: {
    padding: '0.625rem 1rem',
    background: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  
  footer: {
    padding: '1rem 1.25rem',
    borderTop: '1px solid #e8e8e8',
    display: 'flex',
    gap: '0.75rem',
    background: '#fafafa',
  },
  
  primaryButton: {
    flex: 1,
    padding: '0.75rem 1rem',
    background: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  
  secondaryButton: {
    flex: 1,
    padding: '0.75rem 1rem',
    background: 'white',
    color: '#525252',
    border: '1px solid #e8e8e8',
    borderRadius: '8px',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
};

// =============================================================================
// CONSTANTS
// =============================================================================

const TIMELINE_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
  decision: { icon: '✓', color: '#10b981', bg: '#d1fae5' },
  task: { icon: '📋', color: '#0066cc', bg: '#dbeafe' },
  comment: { icon: '💬', color: '#737373', bg: '#f5f5f5' },
  joined: { icon: '👋', color: '#8b5cf6', bg: '#ede9fe' },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const MeetingRoom2D: React.FC<MeetingRoom2DProps> = ({
  meeting,
  onSummarize,
  onDecide,
  onContinueLater,
  onAgendaItemClick,
  onSendMessage,
}) => {
  const [messageText, setMessageText] = useState('');
  const [hoveredAgendaId, setHoveredAgendaId] = useState<string | null>(null);

  // Handle send message
  const handleSendMessage = () => {
    if (messageText.trim() && onSendMessage) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  // Format time
  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>MEETING ROOM — {meeting.title}</h2>
      </div>

      {/* OBJECTIVE */}
      <div style={styles.objectiveSection}>
        <div style={styles.objectiveLabel}>Objective</div>
        <p style={styles.objectiveText}>{meeting.objective}</p>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.mainContent}>
        {/* LEFT PANEL - Agenda & Agents */}
        <div style={styles.leftPanel}>
          {/* Agenda */}
          <div style={styles.panelSection}>
            <div style={styles.panelLabel}>Agenda (Left)</div>
            <div style={styles.agendaList}>
              {meeting.agenda.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => onAgendaItemClick?.(item)}
                  onMouseEnter={() => setHoveredAgendaId(item.id)}
                  onMouseLeave={() => setHoveredAgendaId(null)}
                  style={{
                    ...styles.agendaItem,
                    background: hoveredAgendaId === item.id ? '#f5f5f5' : 'transparent',
                  }}
                >
                  <div style={{
                    ...styles.agendaNumber,
                    background: item.completed ? '#10b981' : '#e8e8e8',
                    color: item.completed ? 'white' : '#525252',
                  }}>
                    {item.completed ? '✓' : index + 1}
                  </div>
                  <span style={{
                    ...styles.agendaText,
                    textDecoration: item.completed ? 'line-through' : 'none',
                    color: item.completed ? '#a3a3a3' : '#1a1a1a',
                  }}>
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Agents */}
          <div style={styles.panelSection}>
            <div style={styles.panelLabel}>Agents active:</div>
            <div style={styles.agentsList}>
              {meeting.activeAgents.map(agent => (
                <div key={agent.id} style={styles.agentItem}>
                  <div style={styles.agentAvatar}>
                    {agent.avatar || agent.name.charAt(0)}
                  </div>
                  <span>{agent.name}</span>
                  <div style={styles.onlineIndicator} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Discussion & Timeline */}
        <div style={styles.rightPanel}>
          {/* Discussion Area */}
          <div style={styles.discussionArea}>
            <div style={styles.discussionLabel}>Discussion / Content</div>
            
            {/* Timeline - Threaded discussion */}
            <div style={styles.timeline}>
              <div style={{ fontSize: '0.875rem', color: '#737373', marginBottom: '0.5rem' }}>
                Timeline
              </div>
              
              {meeting.timeline.map(event => {
                const iconConfig = TIMELINE_ICONS[event.type] || TIMELINE_ICONS.comment;
                
                return (
                  <div key={event.id} style={styles.timelineItem}>
                    <div style={{
                      ...styles.timelineIcon,
                      background: iconConfig.bg,
                      color: iconConfig.color,
                    }}>
                      {iconConfig.icon}
                    </div>
                    <div style={styles.timelineContent}>
                      <p style={styles.timelineText}>
                        - {event.content}
                      </p>
                      <div style={styles.timelineTime}>
                        {event.agent && `${event.agent} • `}
                        {formatTime(event.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Message Input */}
          {onSendMessage && (
            <div style={styles.messageInput}>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                style={styles.input}
              />
              <button onClick={handleSendMessage} style={styles.sendButton}>
                Send
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER - 3 Actions */}
      <div style={styles.footer}>
        <button style={styles.primaryButton} onClick={onSummarize}>
          Summarize
        </button>
        <button style={styles.secondaryButton} onClick={onDecide}>
          Decide
        </button>
        <button style={styles.secondaryButton} onClick={onContinueLater}>
          Continue Later
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default MeetingRoom2D;
