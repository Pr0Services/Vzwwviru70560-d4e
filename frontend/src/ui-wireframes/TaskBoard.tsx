// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — TASK BOARD (KANBAN VIEW)
// Canonical Implementation of UI Wireframe
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';

// =============================================================================
// TYPES
// =============================================================================

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';
type TaskType = 'EXECUTE' | 'ANALYZE' | 'REVIEW' | 'DECIDE' | 'RESEARCH';
type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

interface Task {
  id: string;
  title: string;
  description: string;
  task_type: TaskType;
  priority: Priority;
  status: TaskStatus;
  due_at?: string;
  created_at: string;
}

interface AgentInfo {
  id: string;
  name: string;
}

interface TaskBoardProps {
  agent: AgentInfo;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const STATUS_COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'PENDING', label: 'PENDING', color: '#a3a3a3' },
  { status: 'IN_PROGRESS', label: 'IN PROGRESS', color: '#0066cc' },
  { status: 'BLOCKED', label: 'BLOCKED', color: '#f59e0b' },
  { status: 'COMPLETED', label: 'COMPLETED', color: '#10b981' },
];

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  LOW: { label: 'LOW', color: '#a3a3a3' },
  NORMAL: { label: 'NORMAL', color: '#525252' },
  HIGH: { label: 'HIGH', color: '#f59e0b' },
  CRITICAL: { label: 'CRITICAL', color: '#ef4444' },
};

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
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#1a1a1a',
  },
  
  board: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'auto',
    padding: '1rem',
    gap: '1rem',
  },
  
  column: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0',
    borderBottom: '2px solid',
  },
  
  columnTitle: {
    margin: 0,
    fontSize: '0.8125rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  
  columnCount: {
    padding: '0.125rem 0.5rem',
    background: '#f5f5f5',
    borderRadius: '10px',
    fontSize: '0.75rem',
    color: '#737373',
  },
  
  taskList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    minHeight: '40px',
  },
  
  taskCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    background: '#fafafa',
    border: '1px solid #e8e8e8',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 150ms ease',
  },
  
  taskTitle: {
    margin: 0,
    fontSize: '0.9375rem',
    color: '#1a1a1a',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  
  priorityBadge: {
    padding: '0.125rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.6875rem',
    fontWeight: 600,
    background: '#f5f5f5',
    flexShrink: 0,
  },
  
  emptyColumn: {
    padding: '1rem',
    textAlign: 'center' as const,
    fontSize: '0.875rem',
    color: '#a3a3a3',
    fontStyle: 'italic',
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const TaskBoard: React.FC<TaskBoardProps> = ({
  agent,
  tasks,
  onTaskClick,
  onStatusChange,
}) => {
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);

  // Group tasks by status
  const tasksByStatus = STATUS_COLUMNS.reduce((acc, col) => {
    acc[col.status] = tasks.filter(t => t.status === col.status);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>TASKS — Assigned to {agent.name}</h2>
      </div>

      {/* BOARD - Vertical Kanban */}
      <div style={styles.board}>
        {STATUS_COLUMNS.map(column => {
          const columnTasks = tasksByStatus[column.status] || [];
          
          return (
            <div key={column.status} style={styles.column}>
              {/* Column Header */}
              <div style={{
                ...styles.columnHeader,
                borderColor: column.color,
              }}>
                <h3 style={{
                  ...styles.columnTitle,
                  color: column.color,
                }}>
                  [{column.label}]
                </h3>
                <span style={styles.columnCount}>{columnTasks.length}</span>
              </div>

              {/* Task List */}
              <div style={styles.taskList}>
                {columnTasks.length === 0 ? (
                  <div style={styles.emptyColumn}>No tasks</div>
                ) : (
                  columnTasks.map(task => {
                    const priorityConfig = PRIORITY_CONFIG[task.priority];
                    const isHovered = hoveredTaskId === task.id;

                    return (
                      <div
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        onMouseEnter={() => setHoveredTaskId(task.id)}
                        onMouseLeave={() => setHoveredTaskId(null)}
                        style={{
                          ...styles.taskCard,
                          background: isHovered ? '#f0f7ff' : '#fafafa',
                          borderColor: isHovered ? '#0066cc' : '#e8e8e8',
                        }}
                      >
                        <span style={styles.taskTitle}>
                          - {task.title}
                        </span>
                        <span style={{
                          ...styles.priorityBadge,
                          color: priorityConfig.color,
                        }}>
                          ({priorityConfig.label})
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default TaskBoard;
