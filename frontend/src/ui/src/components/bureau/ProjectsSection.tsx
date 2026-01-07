// CHE·NU™ Projects Component — Bureau Projects Section

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  start_date: string | null;
  end_date: string | null;
  owner: string;
  team_members: string[];
  tags: string[];
  task_count: { total: number; completed: number };
  thread_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Q4 Strategic Initiative',
    description: 'Company-wide strategic initiative for Q4 growth targets and market expansion',
    status: 'active',
    priority: 'high',
    progress: 65,
    start_date: '2024-01-01',
    end_date: '2024-03-31',
    owner: 'John Doe',
    team_members: ['Jane Smith', 'Mike Johnson', 'Sarah Wilson'],
    tags: ['strategy', 'growth', 'q4'],
    task_count: { total: 24, completed: 16 },
    thread_count: 8,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-15T14:30:00Z',
  },
  {
    id: 'p2',
    name: 'Product Redesign',
    description: 'Complete UI/UX overhaul of the main product interface',
    status: 'active',
    priority: 'high',
    progress: 40,
    start_date: '2024-01-10',
    end_date: '2024-02-28',
    owner: 'Jane Smith',
    team_members: ['Design Team', 'Dev Team'],
    tags: ['product', 'design', 'ux'],
    task_count: { total: 18, completed: 7 },
    thread_count: 5,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-14T16:00:00Z',
  },
  {
    id: 'p3',
    name: 'Infrastructure Migration',
    description: 'Migrate core services to new cloud infrastructure',
    status: 'planning',
    priority: 'medium',
    progress: 15,
    start_date: '2024-02-01',
    end_date: '2024-04-30',
    owner: 'Mike Johnson',
    team_members: ['DevOps Team'],
    tags: ['infrastructure', 'cloud', 'migration'],
    task_count: { total: 12, completed: 2 },
    thread_count: 3,
    created_at: '2024-01-12T09:00:00Z',
    updated_at: '2024-01-13T11:00:00Z',
  },
  {
    id: 'p4',
    name: 'Customer Success Program',
    description: 'Implement comprehensive customer success initiatives',
    status: 'on_hold',
    priority: 'low',
    progress: 25,
    start_date: '2024-01-05',
    end_date: null,
    owner: 'Sarah Wilson',
    team_members: ['CS Team'],
    tags: ['customer', 'success'],
    task_count: { total: 8, completed: 2 },
    thread_count: 2,
    created_at: '2024-01-05T14:00:00Z',
    updated_at: '2024-01-10T10:00:00Z',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '20px',
  },
  projectCard: {
    backgroundColor: '#111113',
    borderRadius: '16px',
    padding: '24px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  projectName: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
  },
  projectDescription: {
    fontSize: '13px',
    color: CHENU_COLORS.ancientStone,
    lineHeight: 1.5,
    marginBottom: '16px',
  },
  statusBadge: (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      planning: { bg: CHENU_COLORS.ancientStone + '33', text: CHENU_COLORS.ancientStone },
      active: { bg: CHENU_COLORS.jungleEmerald + '33', text: CHENU_COLORS.jungleEmerald },
      on_hold: { bg: '#f39c12' + '33', text: '#f39c12' },
      completed: { bg: CHENU_COLORS.cenoteTurquoise + '33', text: CHENU_COLORS.cenoteTurquoise },
      archived: { bg: CHENU_COLORS.ancientStone + '22', text: CHENU_COLORS.ancientStone },
    };
    return {
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: 600,
      backgroundColor: colors[status]?.bg || colors.planning.bg,
      color: colors[status]?.text || colors.planning.text,
      textTransform: 'uppercase' as const,
    };
  },
  progressSection: {
    marginBottom: '16px',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  progressLabel: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  progressValue: {
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.sacredGold,
  },
  progressBar: {
    height: '6px',
    backgroundColor: '#0a0a0b',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: (progress: number) => ({
    width: `${progress}%`,
    height: '100%',
    backgroundColor: CHENU_COLORS.sacredGold,
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  }),
  statsRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  stat: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#0a0a0b',
    borderRadius: '8px',
    textAlign: 'center' as const,
  },
  statValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: CHENU_COLORS.softSand,
  },
  statLabel: {
    fontSize: '10px',
    color: CHENU_COLORS.ancientStone,
    textTransform: 'uppercase' as const,
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
    marginBottom: '16px',
  },
  tag: {
    padding: '4px 10px',
    backgroundColor: '#0a0a0b',
    borderRadius: '12px',
    fontSize: '11px',
    color: CHENU_COLORS.softSand,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  owner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  ownerAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: CHENU_COLORS.sacredGold,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 600,
    color: '#000',
  },
  ownerName: {
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
  },
  dateRange: {
    fontSize: '12px',
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
    maxWidth: '600px',
    backgroundColor: '#111113',
    borderRadius: '16px',
    padding: '24px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    maxHeight: '90vh',
    overflow: 'auto',
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

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={styles.projectCard} onClick={onClick}>
      <div style={styles.cardHeader}>
        <div>
          <h3 style={styles.projectName}>{project.name}</h3>
        </div>
        <span style={styles.statusBadge(project.status)}>
          {project.status.replace('_', ' ')}
        </span>
      </div>

      <p style={styles.projectDescription}>{project.description}</p>

      <div style={styles.progressSection}>
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>Progress</span>
          <span style={styles.progressValue}>{project.progress}%</span>
        </div>
        <div style={styles.progressBar}>
          <div style={styles.progressFill(project.progress)} />
        </div>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.stat}>
          <div style={styles.statValue}>{project.task_count.completed}/{project.task_count.total}</div>
          <div style={styles.statLabel}>Tasks</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statValue}>{project.thread_count}</div>
          <div style={styles.statLabel}>Threads</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statValue}>{project.team_members.length}</div>
          <div style={styles.statLabel}>Members</div>
        </div>
      </div>

      {project.tags.length > 0 && (
        <div style={styles.tagsContainer}>
          {project.tags.map((tag, idx) => (
            <span key={idx} style={styles.tag}>#{tag}</span>
          ))}
        </div>
      )}

      <div style={styles.cardFooter}>
        <div style={styles.owner}>
          <div style={styles.ownerAvatar}>{getInitials(project.owner)}</div>
          <span style={styles.ownerName}>{project.owner}</span>
        </div>
        <span style={styles.dateRange}>
          {formatDate(project.start_date)} — {formatDate(project.end_date)}
        </span>
      </div>
    </div>
  );
};

interface ProjectEditorProps {
  project?: Project;
  onSave: (data: Partial<Project>) => void;
  onClose: () => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, onSave, onClose }) => {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [status, setStatus] = useState(project?.status || 'planning');
  const [priority, setPriority] = useState(project?.priority || 'medium');
  const [startDate, setStartDate] = useState(project?.start_date || '');
  const [endDate, setEndDate] = useState(project?.end_date || '');
  const [tagsInput, setTagsInput] = useState(project?.tags.join(', ') || '');

  const handleSave = () => {
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    onSave({
      name,
      description,
      status: status as Project['status'],
      priority: priority as Project['priority'],
      start_date: startDate || null,
      end_date: endDate || null,
      tags,
    });
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{project ? 'Edit Project' : 'New Project'}</h2>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Project Name</label>
          <input
            type="text"
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name..."
            autoFocus
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project description..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Status</label>
            <select style={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Priority</label>
            <select style={styles.select} value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Start Date</label>
            <input
              type="date"
              style={styles.input}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>End Date</label>
            <input
              type="date"
              style={styles.input}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
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
            {project ? 'Update' : 'Create'} Project
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [showEditor, setShowEditor] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredProjects = projects
    .filter(p => !statusFilter || p.status === statusFilter)
    .sort((a, b) => {
      const statusOrder = { active: 0, planning: 1, on_hold: 2, completed: 3, archived: 4 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

  const handleCreateProject = () => {
    setEditingProject(undefined);
    setShowEditor(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowEditor(true);
  };

  const handleSaveProject = (data: Partial<Project>) => {
    if (editingProject) {
      setProjects(projects.map(p => 
        p.id === editingProject.id 
          ? { ...p, ...data, updated_at: new Date().toISOString() }
          : p
      ));
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        name: data.name || 'Untitled Project',
        description: data.description || '',
        status: data.status || 'planning',
        priority: data.priority || 'medium',
        progress: 0,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        owner: 'Current User',
        team_members: [],
        tags: data.tags || [],
        task_count: { total: 0, completed: 0 },
        thread_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProjects([newProject, ...projects]);
    }
    setShowEditor(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Projects</h2>
        <button style={styles.createButton} onClick={handleCreateProject}>
          + New Project
        </button>
      </div>

      <div style={styles.filters}>
        <button 
          style={styles.filterButton(!statusFilter)}
          onClick={() => setStatusFilter(null)}
        >
          All ({projects.length})
        </button>
        {['active', 'planning', 'on_hold', 'completed'].map(s => (
          <button 
            key={s}
            style={styles.filterButton(statusFilter === s)}
            onClick={() => setStatusFilter(s)}
          >
            {s.replace('_', ' ').charAt(0).toUpperCase() + s.replace('_', ' ').slice(1)} ({projects.filter(p => p.status === s).length})
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        {filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => handleEditProject(project)}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: CHENU_COLORS.ancientStone }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>📁</p>
          <p>No projects found</p>
          <button 
            style={{ ...styles.createButton, marginTop: '16px' }}
            onClick={handleCreateProject}
          >
            Create your first project
          </button>
        </div>
      )}

      {showEditor && (
        <ProjectEditor
          project={editingProject}
          onSave={handleSaveProject}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};

export default ProjectsSection;
export { ProjectCard, ProjectEditor };
