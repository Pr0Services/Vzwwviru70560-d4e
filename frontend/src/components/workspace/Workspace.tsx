// CHE·NU™ Workspace Component — Transversal Workspace
// Workspace is TRANSVERSAL - accessible across all Spheres
// Contains quick access to active threads, tasks, and Nova

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface WorkspaceThread {
  id: string;
  title: string;
  sphere: string;
  sphere_icon: string;
  last_message: string;
  tokens_used: number;
  token_budget: number;
  unread: number;
  timestamp: string;
}

interface WorkspaceTask {
  id: string;
  title: string;
  sphere: string;
  sphere_icon: string;
  status: 'todo' | 'in_progress' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
}

interface WorkspaceNotification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'governance';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockThreads: WorkspaceThread[] = [
  { id: 't1', title: 'Q4 Strategy Planning', sphere: 'Business', sphere_icon: '💼', last_message: 'Nova: I suggest reviewing the quarterly goals...', tokens_used: 2340, token_budget: 5000, unread: 2, timestamp: '2024-01-15T14:30:00Z' },
  { id: 't2', title: 'Personal Goals 2024', sphere: 'Personal', sphere_icon: '🏠', last_message: 'You: Let me track my progress on...', tokens_used: 450, token_budget: 1000, unread: 0, timestamp: '2024-01-15T12:00:00Z' },
  { id: 't3', title: 'Creative Project Brief', sphere: 'Studio', sphere_icon: '🎨', last_message: 'Nova: The design system needs...', tokens_used: 1200, token_budget: 3000, unread: 1, timestamp: '2024-01-15T10:00:00Z' },
];

const mockTasks: WorkspaceTask[] = [
  { id: 'task1', title: 'Review Q4 Report', sphere: 'Business', sphere_icon: '💼', status: 'in_progress', priority: 'high', due_date: '2024-01-16' },
  { id: 'task2', title: 'Schedule Team Meeting', sphere: 'Team', sphere_icon: '🤝', status: 'todo', priority: 'medium', due_date: '2024-01-17' },
  { id: 'task3', title: 'Update Design Assets', sphere: 'Studio', sphere_icon: '🎨', status: 'blocked', priority: 'high', due_date: '2024-01-15' },
  { id: 'task4', title: 'Personal Budget Review', sphere: 'Personal', sphere_icon: '🏠', status: 'todo', priority: 'low', due_date: null },
];

const mockNotifications: WorkspaceNotification[] = [
  { id: 'n1', type: 'governance', title: 'Budget Alert', message: 'Thread "Q4 Strategy" at 80% token budget', timestamp: '2024-01-15T14:00:00Z', read: false },
  { id: 'n2', type: 'info', title: 'Meeting Reminder', message: 'Weekly Sync in 30 minutes', timestamp: '2024-01-15T13:30:00Z', read: false },
  { id: 'n3', type: 'success', title: 'Task Completed', message: 'Agent DOC_ANALYZER finished analysis', timestamp: '2024-01-15T13:00:00Z', read: true },
];

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    width: '380px',
    height: '100vh',
    backgroundColor: '#0a0a0b',
    borderLeft: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  header: {
    padding: '20px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  headerTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  headerSubtitle: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  tabs: {
    display: 'flex',
    padding: '0 16px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  tab: (isActive: boolean) => ({
    padding: '12px 16px',
    fontSize: '13px',
    fontWeight: isActive ? 600 : 400,
    color: isActive ? CHENU_COLORS.sacredGold : CHENU_COLORS.ancientStone,
    borderBottom: isActive ? `2px solid ${CHENU_COLORS.sacredGold}` : '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }),
  content: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '16px',
  },
  section: {
    marginBottom: '20px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase' as const,
  },
  sectionAction: {
    fontSize: '11px',
    color: CHENU_COLORS.sacredGold,
    cursor: 'pointer',
  },
  
  // Thread Item
  threadItem: {
    padding: '12px',
    backgroundColor: '#111113',
    borderRadius: '10px',
    marginBottom: '8px',
    cursor: 'pointer',
    border: `1px solid ${CHENU_COLORS.ancientStone}11`,
  },
  threadHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  threadTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  threadSphere: {
    fontSize: '14px',
  },
  threadBadge: {
    padding: '2px 6px',
    backgroundColor: CHENU_COLORS.sacredGold,
    borderRadius: '10px',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#000',
  },
  threadMessage: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  threadFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tokenBar: {
    width: '60px',
    height: '4px',
    backgroundColor: '#1a1a1c',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  tokenFill: (percent: number) => ({
    width: `${percent}%`,
    height: '100%',
    backgroundColor: percent > 80 ? '#e74c3c' : CHENU_COLORS.sacredGold,
  }),
  threadTime: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
  },

  // Task Item
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    backgroundColor: '#111113',
    borderRadius: '8px',
    marginBottom: '6px',
    cursor: 'pointer',
  },
  taskCheckbox: (status: string) => ({
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    border: `2px solid ${status === 'blocked' ? '#e74c3c' : CHENU_COLORS.ancientStone}`,
    backgroundColor: status === 'in_progress' ? CHENU_COLORS.sacredGold + '33' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    flexShrink: 0,
  }),
  taskContent: {
    flex: 1,
    overflow: 'hidden',
  },
  taskTitle: {
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  taskMeta: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  priorityDot: (priority: string) => {
    const colors: Record<string, string> = {
      urgent: '#e74c3c',
      high: '#f39c12',
      medium: CHENU_COLORS.cenoteTurquoise,
      low: CHENU_COLORS.ancientStone,
    };
    return {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: colors[priority],
    };
  },

  // Notification Item
  notificationItem: (read: boolean) => ({
    padding: '12px',
    backgroundColor: read ? '#111113' : '#111113',
    borderRadius: '8px',
    marginBottom: '8px',
    borderLeft: read ? 'none' : `3px solid ${CHENU_COLORS.sacredGold}`,
  }),
  notificationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  notificationIcon: (type: string) => {
    const colors: Record<string, string> = {
      info: CHENU_COLORS.cenoteTurquoise,
      warning: '#f39c12',
      success: CHENU_COLORS.jungleEmerald,
      governance: CHENU_COLORS.sacredGold,
    };
    return { color: colors[type], fontSize: '14px' };
  },
  notificationTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  notificationMessage: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  notificationTime: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    marginTop: '4px',
  },

  // Nova Quick Access
  novaSection: {
    padding: '16px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  novaCard: {
    padding: '16px',
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '11',
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.cenoteTurquoise}33`,
  },
  novaHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  novaIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: CHENU_COLORS.cenoteTurquoise + '22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  novaInfo: {
    flex: 1,
  },
  novaTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.cenoteTurquoise,
  },
  novaStatus: {
    fontSize: '11px',
    color: CHENU_COLORS.softSand,
  },
  novaInput: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#0a0a0b',
    border: `1px solid ${CHENU_COLORS.cenoteTurquoise}33`,
    borderRadius: '8px',
    color: CHENU_COLORS.softSand,
    fontSize: '13px',
  },
  quickActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  quickAction: {
    padding: '6px 12px',
    backgroundColor: '#0a0a0b',
    borderRadius: '6px',
    fontSize: '11px',
    color: CHENU_COLORS.softSand,
    cursor: 'pointer',
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

interface WorkspaceProps {
  onThreadClick?: (threadId: string) => void;
  onTaskClick?: (taskId: string) => void;
  onNovaOpen?: () => void;
}

const Workspace: React.FC<WorkspaceProps> = ({
  onThreadClick,
  onTaskClick,
  onNovaOpen,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'threads' | 'tasks' | 'notifications'>('overview');
  const [threads] = useState<WorkspaceThread[]>(mockThreads);
  const [tasks] = useState<WorkspaceTask[]>(mockTasks);
  const [notifications] = useState<WorkspaceNotification[]>(mockNotifications);
  const [novaInput, setNovaInput] = useState('');

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      info: 'ℹ️',
      warning: '⚠️',
      success: '✅',
      governance: '⚖️',
    };
    return icons[type];
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingTasks = tasks.filter(t => t.status !== 'done').length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>Workspace</div>
        <div style={styles.headerSubtitle}>Transversal • All Spheres</div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <div style={styles.tab(activeTab === 'overview')} onClick={() => setActiveTab('overview')}>Overview</div>
        <div style={styles.tab(activeTab === 'threads')} onClick={() => setActiveTab('threads')}>Threads</div>
        <div style={styles.tab(activeTab === 'tasks')} onClick={() => setActiveTab('tasks')}>Tasks ({pendingTasks})</div>
        <div style={styles.tab(activeTab === 'notifications')} onClick={() => setActiveTab('notifications')}>
          Alerts {unreadCount > 0 && <span style={{ marginLeft: '4px', color: CHENU_COLORS.sacredGold }}>•</span>}
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'overview' && (
          <>
            {/* Active Threads */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>Active Threads</span>
                <span style={styles.sectionAction}>View all</span>
              </div>
              {threads.slice(0, 3).map(thread => (
                <div key={thread.id} style={styles.threadItem} onClick={() => onThreadClick?.(thread.id)}>
                  <div style={styles.threadHeader}>
                    <span style={styles.threadTitle}>
                      <span style={styles.threadSphere}>{thread.sphere_icon}</span>
                      {thread.title}
                    </span>
                    {thread.unread > 0 && <span style={styles.threadBadge}>{thread.unread}</span>}
                  </div>
                  <div style={styles.threadMessage}>{thread.last_message}</div>
                  <div style={styles.threadFooter}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={styles.tokenBar}>
                        <div style={styles.tokenFill((thread.tokens_used / thread.token_budget) * 100)} />
                      </div>
                      <span style={{ fontSize: '10px', color: CHENU_COLORS.ancientStone }}>
                        {thread.tokens_used}/{thread.token_budget}
                      </span>
                    </div>
                    <span style={styles.threadTime}>{formatTime(thread.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Priority Tasks */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>Priority Tasks</span>
                <span style={styles.sectionAction}>View all</span>
              </div>
              {tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').slice(0, 4).map(task => (
                <div key={task.id} style={styles.taskItem} onClick={() => onTaskClick?.(task.id)}>
                  <div style={styles.taskCheckbox(task.status)}>
                    {task.status === 'in_progress' && '●'}
                    {task.status === 'blocked' && '!'}
                  </div>
                  <div style={styles.taskContent}>
                    <div style={styles.taskTitle}>{task.title}</div>
                    <div style={styles.taskMeta}>
                      <span>{task.sphere_icon}</span>
                      <span style={styles.priorityDot(task.priority)} />
                      {task.due_date && <span>Due {task.due_date}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'threads' && (
          <div style={styles.section}>
            {threads.map(thread => (
              <div key={thread.id} style={styles.threadItem} onClick={() => onThreadClick?.(thread.id)}>
                <div style={styles.threadHeader}>
                  <span style={styles.threadTitle}>
                    <span style={styles.threadSphere}>{thread.sphere_icon}</span>
                    {thread.title}
                  </span>
                  {thread.unread > 0 && <span style={styles.threadBadge}>{thread.unread}</span>}
                </div>
                <div style={styles.threadMessage}>{thread.last_message}</div>
                <div style={styles.threadFooter}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={styles.tokenBar}>
                      <div style={styles.tokenFill((thread.tokens_used / thread.token_budget) * 100)} />
                    </div>
                    <span style={{ fontSize: '10px', color: CHENU_COLORS.ancientStone }}>
                      {thread.tokens_used}/{thread.token_budget}
                    </span>
                  </div>
                  <span style={styles.threadTime}>{formatTime(thread.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div style={styles.section}>
            {tasks.map(task => (
              <div key={task.id} style={styles.taskItem} onClick={() => onTaskClick?.(task.id)}>
                <div style={styles.taskCheckbox(task.status)}>
                  {task.status === 'in_progress' && '●'}
                  {task.status === 'blocked' && '!'}
                </div>
                <div style={styles.taskContent}>
                  <div style={styles.taskTitle}>{task.title}</div>
                  <div style={styles.taskMeta}>
                    <span>{task.sphere_icon}</span>
                    <span style={styles.priorityDot(task.priority)} />
                    {task.due_date && <span>Due {task.due_date}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div style={styles.section}>
            {notifications.map(notif => (
              <div key={notif.id} style={styles.notificationItem(notif.read)}>
                <div style={styles.notificationHeader}>
                  <span style={styles.notificationIcon(notif.type)}>{getNotificationIcon(notif.type)}</span>
                  <span style={styles.notificationTitle}>{notif.title}</span>
                </div>
                <div style={styles.notificationMessage}>{notif.message}</div>
                <div style={styles.notificationTime}>{formatTime(notif.timestamp)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nova Quick Access */}
      <div style={styles.novaSection}>
        <div style={styles.novaCard}>
          <div style={styles.novaHeader}>
            <div style={styles.novaIcon}>🌟</div>
            <div style={styles.novaInfo}>
              <div style={styles.novaTitle}>Nova</div>
              <div style={styles.novaStatus}>System Intelligence • Online</div>
            </div>
          </div>
          <input
            type="text"
            placeholder="Ask Nova anything..."
            style={styles.novaInput}
            value={novaInput}
            onChange={(e) => setNovaInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onNovaOpen?.()}
          />
          <div style={styles.quickActions}>
            <div style={styles.quickAction}>📊 Summary</div>
            <div style={styles.quickAction}>💡 Suggestions</div>
            <div style={styles.quickAction}>⚖️ Governance</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
