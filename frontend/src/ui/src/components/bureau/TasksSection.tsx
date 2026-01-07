// CHE·NU™ Tasks Component — Bureau Tasks Section

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  tags: string[];
  assignee: string | null;
  project_id: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review Q4 financial projections',
    description: 'Analyze and validate the Q4 financial forecasts with the team',
    status: 'in_progress',
    priority: 'high',
    due_date: '2024-01-20',
    tags: ['finance', 'review'],
    assignee: 'John Doe',
    project_id: 'p1',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    title: 'Prepare investor presentation',
    description: 'Create slides for the upcoming investor meeting',
    status: 'todo',
    priority: 'urgent',
    due_date: '2024-01-18',
    tags: ['presentation', 'investors'],
    assignee: null,
    project_id: 'p1',
    created_at: '2024-01-12T09:00:00Z',
    updated_at: '2024-01-12T09:00:00Z',
  },
  {
    id: '3',
    title: 'Update product roadmap',
    description: 'Incorporate feedback from last sprint review',
    status: 'done',
    priority: 'medium',
    due_date: '2024-01-15',
    tags: ['product', 'roadmap'],
    assignee: 'Jane Smith',
    project_id: 'p2',
    created_at: '2024-01-08T14:00:00Z',
    updated_at: '2024-01-14T16:00:00Z',
  },
  {
    id: '4',
    title: 'Fix authentication bug',
    description: 'Users are experiencing intermittent login issues',
    status: 'blocked',
    priority: 'high',
    due_date: '2024-01-16',
    tags: ['bug', 'auth'],
    assignee: 'Dev Team',
    project_id: 'p2',
    created_at: '2024-01-11T11:00:00Z',
    updated_at: '2024-01-13T10:00:00Z',
  },
  {
    id: '5',
    title: 'Schedule team retrospective',
    description: 'Organize sprint retrospective for next week',
    status: 'todo',
    priority: 'low',
    due_date: '2024-01-22',
    tags: ['meeting', 'team'],
    assignee: null,
    project_id: null,
    created_at: '2024-01-14T09:00:00Z',
    updated_at: '2024-01-14T09:00:00Z',
  },
];

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    padding: '0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  createButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap' as const,
  },
  filterButton: (isActive: boolean) => ({
    padding: '8px 16px',
    borderRadius: '20px',
    border: `1px solid ${isActive ? CHENU_COLORS.sacredGold : CHENU_COLORS.ancientStone}44`,
    backgroundColor: isActive ? CHENU_COLORS.sacredGold + '22' : 'transparent',
    color: isActive ? CHENU_COLORS.sacredGold : CHENU_COLORS.softSand,
    fontSize: '13px',
    cursor: 'pointer',
  }),
  kanbanBoard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    minHeight: '500px',
  },
  column: {
    backgroundColor: '#0a0a0b',
    borderRadius: '12px',
    padding: '16px',
    minHeight: '400px',
  },
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  columnTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  columnCount: {
    backgroundColor: CHENU_COLORS.ancientStone + '33',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  taskCard: {
    backgroundColor: '#111113',
    borderRadius: '8px',
    padding: '14px',
    marginBottom: '10px',
    cursor: 'pointer',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    transition: 'all 0.2s ease',
  },
  taskTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
    marginBottom: '8px',
  },
  taskDescription: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '10px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  },
  taskMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priority: (priority: string) => {
    const colors: Record<string, string> = {
      urgent: '#e74c3c',
      high: '#f39c12',
      medium: CHENU_COLORS.cenoteTurquoise,
      low: CHENU_COLORS.ancientStone,
    };
    return {
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: 600,
      backgroundColor: colors[priority] + '22',
      color: colors[priority],
      textTransform: 'uppercase' as const,
    };
  },
  dueDate: (isPast: boolean) => ({
    fontSize: '11px',
    color: isPast ? '#e74c3c' : CHENU_COLORS.ancientStone,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }),
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px',
    marginBottom: '8px',
  },
  tag: {
    padding: '2px 6px',
    backgroundColor: '#0a0a0b',
    borderRadius: '4px',
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
  },
  // Modal styles
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#111113',
    borderRadius: '16px',
    padding: '24px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: CHENU_COLORS.ancientStone,
    fontSize: '20px',
    cursor: 'pointer',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    backgroundColor: '#0a0a0b',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    backgroundColor: '#0a0a0b',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    backgroundColor: '#0a0a0b',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px',
  },
  cancelButton: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}44`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

// ============================================================
// COMPONENTS
// ============================================================

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isPastDue = task.due_date 
    ? new Date(task.due_date) < new Date() && task.status !== 'done'
    : false;

  return (
    <div style={styles.taskCard} onClick={onClick}>
      <h4 style={styles.taskTitle}>{task.title}</h4>
      
      {task.description && (
        <p style={styles.taskDescription}>{task.description}</p>
      )}

      {task.tags.length > 0 && (
        <div style={styles.tagsContainer}>
          {task.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} style={styles.tag}>#{tag}</span>
          ))}
        </div>
      )}

      <div style={styles.taskMeta}>
        <span style={styles.priority(task.priority)}>{task.priority}</span>
        {task.due_date && (
          <span style={styles.dueDate(isPastDue)}>
            📅 {formatDate(task.due_date)}
          </span>
        )}
      </div>
    </div>
  );
};

interface TaskEditorProps {
  task?: Task;
  onSave: (data: Partial<Task>) => void;
  onClose: () => void;
}

const TaskEditor: React.FC<TaskEditorProps> = ({ task, onSave, onClose }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'todo');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState(task?.due_date || '');
  const [tagsInput, setTagsInput] = useState(task?.tags.join(', ') || '');

  const handleSave = () => {
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    onSave({
      title,
      description,
      status: status as Task['status'],
      priority: priority as Task['priority'],
      due_date: dueDate || null,
      tags,
    });
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{task ? 'Edit Task' : 'New Task'}</h2>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Title</label>
          <input
            type="text"
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title..."
            autoFocus
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Status</label>
            <select style={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Priority</label>
            <select style={styles.select} value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Due Date</label>
          <input
            type="date"
            style={styles.input}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tags (comma separated)</label>
          <input
            type="text"
            style={styles.input}
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="tag1, tag2, tag3"
          />
        </div>

        <div style={styles.modalActions}>
          <button style={styles.cancelButton} onClick={onClose}>Cancel</button>
          <button style={styles.saveButton} onClick={handleSave}>
            {task ? 'Update' : 'Create'} Task
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const TasksSection: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  const columns: { id: Task['status']; title: string; icon: string }[] = [
    { id: 'todo', title: 'To Do', icon: '📋' },
    { id: 'in_progress', title: 'In Progress', icon: '🔄' },
    { id: 'done', title: 'Done', icon: '✅' },
    { id: 'blocked', title: 'Blocked', icon: '🚫' },
  ];

  const getTasksByStatus = (status: Task['status']) => {
    return tasks
      .filter(t => t.status === status)
      .filter(t => !priorityFilter || t.priority === priorityFilter)
      .sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setShowEditor(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditor(true);
  };

  const handleSaveTask = (data: Partial<Task>) => {
    if (editingTask) {
      setTasks(tasks.map(t => 
        t.id === editingTask.id 
          ? { ...t, ...data, updated_at: new Date().toISOString() }
          : t
      ));
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title: data.title || 'Untitled',
        description: data.description || '',
        status: data.status || 'todo',
        priority: data.priority || 'medium',
        due_date: data.due_date || null,
        tags: data.tags || [],
        assignee: null,
        project_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setTasks([...tasks, newTask]);
    }
    setShowEditor(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Tasks</h2>
        <button style={styles.createButton} onClick={handleCreateTask}>
          + New Task
        </button>
      </div>

      <div style={styles.filters}>
        <button 
          style={styles.filterButton(!priorityFilter)}
          onClick={() => setPriorityFilter(null)}
        >
          All
        </button>
        {['urgent', 'high', 'medium', 'low'].map(p => (
          <button 
            key={p}
            style={styles.filterButton(priorityFilter === p)}
            onClick={() => setPriorityFilter(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.kanbanBoard}>
        {columns.map(column => (
          <div key={column.id} style={styles.column}>
            <div style={styles.columnHeader}>
              <span style={styles.columnTitle}>
                {column.icon} {column.title}
              </span>
              <span style={styles.columnCount}>
                {getTasksByStatus(column.id).length}
              </span>
            </div>
            
            {getTasksByStatus(column.id).map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => handleEditTask(task)}
              />
            ))}
          </div>
        ))}
      </div>

      {showEditor && (
        <TaskEditor
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};

export default TasksSection;
export { TaskCard, TaskEditor };
