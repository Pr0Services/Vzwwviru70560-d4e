/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — TASKS SECTION CONNECTED                         ║
 * ║                    Connecté au taskStore + Aligné Backend API                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * ALIGNEMENT BACKEND: /app/api/endpoints/tasks.py
 * 
 * TaskStatus: todo | in_progress | review | blocked | done | cancelled
 * TaskPriority: low | medium | high | urgent
 * TaskType: manual | agent | automated
 */

import React, { useCallback, useMemo, useEffect } from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { Task, TaskStatus, TaskPriority } from '../../services/tasks';
import { CHENU_COLORS } from '../../types';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface TasksSectionConnectedProps {
  sphereId: string;
  projectId?: string;
}

// Status columns for Kanban (aligned with backend)
const KANBAN_COLUMNS: { id: TaskStatus; title: string; icon: string; color: string }[] = [
  { id: 'todo', title: 'À faire', icon: '📋', color: CHENU_COLORS.ancientStone },
  { id: 'in_progress', title: 'En cours', icon: '🔄', color: CHENU_COLORS.cenoteTurquoise },
  { id: 'review', title: 'En revue', icon: '👀', color: '#9b59b6' }, // Backend has this!
  { id: 'blocked', title: 'Bloqué', icon: '🚫', color: '#e74c3c' },
  { id: 'done', title: 'Terminé', icon: '✅', color: CHENU_COLORS.jungleEmerald },
];

// Priority config
const PRIORITY_CONFIG: Record<TaskPriority, { color: string; label: string; order: number }> = {
  urgent: { color: '#e74c3c', label: 'Urgent', order: 0 },
  high: { color: '#f39c12', label: 'Haute', order: 1 },
  medium: { color: CHENU_COLORS.cenoteTurquoise, label: 'Moyenne', order: 2 },
  low: { color: CHENU_COLORS.ancientStone, label: 'Basse', order: 3 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: { padding: '0' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: { fontSize: '20px', fontWeight: 600, color: CHENU_COLORS.softSand },
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
  storeIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: CHENU_COLORS.jungleEmerald + '22',
    borderRadius: '12px',
    fontSize: '10px',
    color: CHENU_COLORS.jungleEmerald,
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
    gridTemplateColumns: 'repeat(5, 1fr)', // 5 colonnes maintenant
    gap: '12px',
    minHeight: '500px',
  },
  column: (color: string) => ({
    backgroundColor: '#0a0a0b',
    borderRadius: '12px',
    padding: '12px',
    minHeight: '400px',
    borderTop: `3px solid ${color}`,
  }),
  columnHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    paddingBottom: '10px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  columnTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  columnCount: {
    backgroundColor: CHENU_COLORS.ancientStone + '33',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  taskCard: {
    backgroundColor: '#111113',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '8px',
    cursor: 'pointer',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    transition: 'all 0.2s ease',
  },
  taskTitle: {
    fontSize: '13px',
    fontWeight: 500,
    color: CHENU_COLORS.softSand,
    marginBottom: '6px',
  },
  taskDescription: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '8px',
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
  priority: (priority: TaskPriority) => ({
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '9px',
    fontWeight: 600,
    backgroundColor: PRIORITY_CONFIG[priority].color + '22',
    color: PRIORITY_CONFIG[priority].color,
    textTransform: 'uppercase' as const,
  }),
  dueDate: (isPast: boolean) => ({
    fontSize: '10px',
    color: isPast ? '#e74c3c' : CHENU_COLORS.ancientStone,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  }),
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px',
    marginBottom: '6px',
  },
  tag: {
    padding: '1px 5px',
    backgroundColor: '#0a0a0b',
    borderRadius: '3px',
    fontSize: '9px',
    color: CHENU_COLORS.ancientStone,
  },
  loadingOverlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    color: CHENU_COLORS.ancientStone,
  },
  errorBanner: {
    backgroundColor: '#e74c3c22',
    border: '1px solid #e74c3c44',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '16px',
    color: '#e74c3c',
    fontSize: '13px',
  },
  emptyColumn: {
    textAlign: 'center' as const,
    padding: '20px 10px',
    color: CHENU_COLORS.ancientStone,
    fontSize: '12px',
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
  formGroup: { marginBottom: '16px' },
  label: {
    display: 'block',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}44`,
    backgroundColor: '#0a0a0b',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}44`,
    backgroundColor: '#0a0a0b',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical' as const,
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}44`,
    backgroundColor: '#0a0a0b',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px',
  },
  cancelButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}44`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// TASK CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
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

      {task.tags && task.tags.length > 0 && (
        <div style={styles.tagsContainer}>
          {task.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} style={styles.tag}>#{tag}</span>
          ))}
        </div>
      )}

      <div style={styles.taskMeta}>
        <span style={styles.priority(task.priority)}>{PRIORITY_CONFIG[task.priority].label}</span>
        {task.due_date && (
          <span style={styles.dueDate(isPastDue)}>
            📅 {formatDate(task.due_date)}
          </span>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TASK EDITOR MODAL
// ═══════════════════════════════════════════════════════════════════════════════

interface TaskEditorProps {
  task?: Task;
  onSave: (data: any) => void;
  onClose: () => void;
  onDelete?: () => void;
}

const TaskEditor: React.FC<TaskEditorProps> = ({ task, onSave, onClose, onDelete }) => {
  const [title, setTitle] = React.useState(task?.title || '');
  const [description, setDescription] = React.useState(task?.description || '');
  const [status, setStatus] = React.useState<TaskStatus>(task?.status || 'todo');
  const [priority, setPriority] = React.useState<TaskPriority>(task?.priority || 'medium');
  const [dueDate, setDueDate] = React.useState(task?.due_date || '');
  const [tagsInput, setTagsInput] = React.useState(task?.tags?.join(', ') || '');

  const handleSave = () => {
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    onSave({
      title,
      description,
      status,
      priority,
      due_date: dueDate || undefined,
      tags,
    });
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{task ? 'Modifier la tâche' : 'Nouvelle tâche'}</h2>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Titre</label>
          <input
            type="text"
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la tâche..."
            autoFocus
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Statut</label>
            <select style={styles.select} value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
              {KANBAN_COLUMNS.map(col => (
                <option key={col.id} value={col.id}>{col.icon} {col.title}</option>
              ))}
              <option value="cancelled">❌ Annulé</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Priorité</label>
            <select style={styles.select} value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
              {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Date d'échéance</label>
          <input
            type="date"
            style={styles.input}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tags (séparés par virgules)</label>
          <input
            type="text"
            style={styles.input}
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="tag1, tag2, tag3"
          />
        </div>

        <div style={styles.modalActions}>
          {onDelete && (
            <button 
              style={{ ...styles.cancelButton, color: '#e74c3c', borderColor: '#e74c3c44' }} 
              onClick={onDelete}
            >
              Supprimer
            </button>
          )}
          <button style={styles.cancelButton} onClick={onClose}>Annuler</button>
          <button style={styles.saveButton} onClick={handleSave}>
            {task ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const TasksSectionConnected: React.FC<TasksSectionConnectedProps> = ({
  sphereId,
  projectId,
}) => {
  // ─────────────────────────────────────────────────────────────────────────────
  // CONNEXION AU STORE
  // ─────────────────────────────────────────────────────────────────────────────
  const {
    tasks,
    isLoading,
    error,
    statusFilter,
    priorityFilter,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    setStatusFilter,
    setPriorityFilter,
    clearError,
  } = useTaskStore();

  // Local state for editor
  const [showEditor, setShowEditor] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | undefined>();

  // ─────────────────────────────────────────────────────────────────────────────
  // LOAD DATA ON MOUNT
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // In production, would filter by sphereId
    fetchTasks();
  }, [fetchTasks, sphereId]);

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleCreateTask = useCallback(() => {
    setEditingTask(undefined);
    setShowEditor(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setShowEditor(true);
  }, []);

  const handleSaveTask = useCallback(async (data: any) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
      } else {
        await createTask({
          ...data,
          task_list_id: projectId,
        });
      }
      setShowEditor(false);
      setEditingTask(undefined);
    } catch (err) {
      console.error('Failed to save task:', err);
    }
  }, [editingTask, updateTask, createTask, projectId]);

  const handleDeleteTask = useCallback(async () => {
    if (editingTask) {
      await deleteTask(editingTask.id);
      setShowEditor(false);
      setEditingTask(undefined);
    }
  }, [editingTask, deleteTask]);

  // ─────────────────────────────────────────────────────────────────────────────
  // FILTERED & GROUPED TASKS
  // ─────────────────────────────────────────────────────────────────────────────
  const getTasksByStatus = useCallback((status: TaskStatus): Task[] => {
    return tasks
      .filter(t => t.status === status)
      .filter(t => !priorityFilter || t.priority === priorityFilter)
      .sort((a, b) => {
        const orderA = PRIORITY_CONFIG[a.priority]?.order ?? 99;
        const orderB = PRIORITY_CONFIG[b.priority]?.order ?? 99;
        return orderA - orderB;
      });
  }, [tasks, priorityFilter]);

  const taskCount = tasks.length;

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={styles.title}>Tasks</h2>
          <span style={styles.storeIndicator}>
            🔗 Store connecté • {taskCount} tâches
          </span>
        </div>
        <button style={styles.createButton} onClick={handleCreateTask}>
          + Nouvelle tâche
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={styles.errorBanner}>
          ⚠️ {error}
          <button 
            onClick={clearError}
            style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}
          >
            Fermer
          </button>
        </div>
      )}

      {/* Filters */}
      <div style={styles.filters}>
        <button
          style={styles.filterButton(!priorityFilter)}
          onClick={() => setPriorityFilter(null)}
        >
          Toutes
        </button>
        {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
          <button
            key={key}
            style={styles.filterButton(priorityFilter === key)}
            onClick={() => setPriorityFilter(key as TaskPriority)}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div style={styles.loadingOverlay}>
          ⏳ Chargement des tâches...
        </div>
      )}

      {/* Kanban Board */}
      {!isLoading && (
        <div style={styles.kanbanBoard}>
          {KANBAN_COLUMNS.map(column => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <div key={column.id} style={styles.column(column.color)}>
                <div style={styles.columnHeader}>
                  <span style={styles.columnTitle}>
                    {column.icon} {column.title}
                  </span>
                  <span style={styles.columnCount}>
                    {columnTasks.length}
                  </span>
                </div>
                
                {columnTasks.length === 0 ? (
                  <div style={styles.emptyColumn}>
                    Aucune tâche
                  </div>
                ) : (
                  columnTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => handleEditTask(task)}
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Task Editor Modal */}
      {showEditor && (
        <TaskEditor
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => {
            setShowEditor(false);
            setEditingTask(undefined);
          }}
          onDelete={editingTask ? handleDeleteTask : undefined}
        />
      )}
    </div>
  );
};

export default TasksSectionConnected;
