/**
 * CHE·NU™ — Tasks Section
 * Gestion des tâches
 */

import React, { useState } from 'react';
import { SphereId } from '../../../canonical/SPHERES_CANONICAL_V2';

type TaskStatus = 'todo' | 'in_progress' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: number;
  createdAt: number;
}

interface TasksSectionProps {
  sphereId: SphereId;
  userId: string;
  language?: 'en' | 'fr';
}

export const TasksSection: React.FC<TasksSectionProps> = ({
  sphereId,
  userId,
  language = 'fr'
}) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Tâche importante', status: 'todo', priority: 'high', createdAt: Date.now() },
    { id: '2', title: 'Tâche en cours', status: 'in_progress', priority: 'medium', createdAt: Date.now() },
    { id: '3', title: 'Tâche terminée', status: 'done', priority: 'low', createdAt: Date.now() }
  ]);
  const [newTask, setNewTask] = useState('');

  const labels = {
    en: {
      todo: 'To Do',
      inProgress: 'In Progress',
      done: 'Done',
      addTask: 'Add Task',
      placeholder: 'New task...'
    },
    fr: {
      todo: 'À Faire',
      inProgress: 'En Cours',
      done: 'Terminé',
      addTask: 'Ajouter',
      placeholder: 'Nouvelle tâche...'
    }
  };

  const t = labels[language];

  const getPriorityColor = (priority: TaskPriority) => {
    const colors = { low: '#3F7249', medium: '#D8B26A', high: '#EF4444' };
    return colors[priority];
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask,
      status: 'todo',
      priority: 'medium',
      createdAt: Date.now()
    };
    setTasks(prev => [...prev, task]);
    setNewTask('');
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  const renderColumn = (title: string, columnTasks: Task[], status: TaskStatus) => (
    <div style={{ flex: 1 }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#8D8371' }}>
        {title} ({columnTasks.length})
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {columnTasks.map(task => (
          <div
            key={task.id}
            style={{
              padding: '12px',
              background: '#2A2B2E',
              borderRadius: '8px',
              borderLeft: `3px solid ${getPriorityColor(task.priority)}`
            }}
          >
            <div style={{ color: '#E9E4D6', fontSize: '13px', marginBottom: '8px' }}>
              {task.title}
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {status !== 'todo' && (
                <button
                  onClick={() => updateTaskStatus(task.id, 'todo')}
                  style={{ padding: '4px 8px', background: '#3A3B3E', border: 'none', borderRadius: '4px', color: '#8D8371', fontSize: '10px', cursor: 'pointer' }}
                >
                  ← Todo
                </button>
              )}
              {status !== 'in_progress' && (
                <button
                  onClick={() => updateTaskStatus(task.id, 'in_progress')}
                  style={{ padding: '4px 8px', background: '#3A3B3E', border: 'none', borderRadius: '4px', color: '#D8B26A', fontSize: '10px', cursor: 'pointer' }}
                >
                  🔄
                </button>
              )}
              {status !== 'done' && (
                <button
                  onClick={() => updateTaskStatus(task.id, 'done')}
                  style={{ padding: '4px 8px', background: '#3A3B3E', border: 'none', borderRadius: '4px', color: '#3F7249', fontSize: '10px', cursor: 'pointer' }}
                >
                  ✓ Done
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="tasks-section">
      {/* Add Task */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          placeholder={t.placeholder}
          style={{
            flex: 1,
            padding: '12px 16px',
            background: '#2A2B2E',
            border: '1px solid #3A3B3E',
            borderRadius: '8px',
            color: '#E9E4D6',
            fontSize: '14px'
          }}
        />
        <button
          onClick={handleAddTask}
          style={{
            padding: '12px 24px',
            background: '#D8B26A',
            border: 'none',
            borderRadius: '8px',
            color: '#1E1F22',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {t.addTask}
        </button>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'flex', gap: '16px' }}>
        {renderColumn(t.todo, todoTasks, 'todo')}
        {renderColumn(t.inProgress, inProgressTasks, 'in_progress')}
        {renderColumn(t.done, doneTasks, 'done')}
      </div>
    </div>
  );
};

export default TasksSection;
