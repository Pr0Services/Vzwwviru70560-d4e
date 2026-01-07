// CHE·NU™ Project Management Components
// Complete project management with phases, milestones, and team tracking

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
// TYPES
// ============================================================

type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';
type Priority = 'low' | 'medium' | 'high' | 'critical';
type MilestoneStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';
type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department?: string;
}

interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assignee?: TeamMember;
  dueDate?: Date;
  estimatedHours?: number;
  loggedHours?: number;
  tags?: string[];
  milestoneId?: string;
  dependencies?: string[];
  attachments?: number;
  comments?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Milestone {
  id: string;
  title: string;
  description?: string;
  status: MilestoneStatus;
  dueDate: Date;
  completedDate?: Date;
  tasks: ProjectTask[];
  progress: number;
  owner?: TeamMember;
}

interface ProjectPhase {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
  progress: number;
  color?: string;
}

interface ProjectBudget {
  allocated: number;
  spent: number;
  remaining: number;
  currency: string;
  breakdown?: Array<{
    category: string;
    amount: number;
    spent: number;
  }>;
}

interface ProjectRisk {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  probability: 'unlikely' | 'possible' | 'likely';
  mitigation?: string;
  owner?: TeamMember;
  status: 'identified' | 'mitigating' | 'resolved';
}

interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: Priority;
  sphereId: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  phases: ProjectPhase[];
  team: TeamMember[];
  lead?: TeamMember;
  budget?: ProjectBudget;
  risks?: ProjectRisk[];
  tags?: string[];
  tokenBudget?: number;
  tokensUsed?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectListProps {
  projects: Project[];
  view?: 'grid' | 'list' | 'board';
  onProjectClick?: (project: Project) => void;
  onCreateProject?: () => void;
  showFilters?: boolean;
  className?: string;
}

interface ProjectCardProps {
  project: Project;
  variant?: 'compact' | 'detailed';
  onClick?: () => void;
  className?: string;
}

interface ProjectDetailProps {
  project: Project;
  onUpdateProject?: (updates: Partial<Project>) => void;
  onAddTask?: (task: Partial<ProjectTask>) => void;
  onAddMilestone?: (milestone: Partial<Milestone>) => void;
  className?: string;
}

interface MilestoneCardProps {
  milestone: Milestone;
  onClick?: () => void;
  onUpdateStatus?: (status: MilestoneStatus) => void;
  className?: string;
}

interface TaskRowProps {
  task: ProjectTask;
  onClick?: () => void;
  onStatusChange?: (status: TaskStatus) => void;
  showProject?: boolean;
  className?: string;
}

interface TimelineViewProps {
  phases: ProjectPhase[];
  startDate: Date;
  endDate: Date;
  onPhaseClick?: (phase: ProjectPhase) => void;
  onMilestoneClick?: (milestone: Milestone) => void;
  className?: string;
}

interface TeamOverviewProps {
  team: TeamMember[];
  tasks: ProjectTask[];
  onMemberClick?: (member: TeamMember) => void;
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

const STATUS_CONFIG: Record<ProjectStatus, { color: string; label: string; icon: string }> = {
  planning: { color: '#805AD5', label: 'Planning', icon: '📋' },
  active: { color: BRAND.cenoteTurquoise, label: 'Active', icon: '🚀' },
  'on-hold': { color: '#DD6B20', label: 'On Hold', icon: '⏸️' },
  completed: { color: '#38A169', label: 'Completed', icon: '✅' },
  archived: { color: BRAND.ancientStone, label: 'Archived', icon: '📦' },
};

const PRIORITY_CONFIG: Record<Priority, { color: string; label: string }> = {
  low: { color: '#38A169', label: 'Low' },
  medium: { color: BRAND.sacredGold, label: 'Medium' },
  high: { color: '#DD6B20', label: 'High' },
  critical: { color: '#E53E3E', label: 'Critical' },
};

const TASK_STATUS_CONFIG: Record<TaskStatus, { color: string; label: string }> = {
  todo: { color: BRAND.ancientStone, label: 'To Do' },
  'in-progress': { color: '#3182CE', label: 'In Progress' },
  review: { color: '#805AD5', label: 'Review' },
  done: { color: '#38A169', label: 'Done' },
  blocked: { color: '#E53E3E', label: 'Blocked' },
};

const MILESTONE_STATUS_CONFIG: Record<MilestoneStatus, { color: string; icon: string }> = {
  pending: { color: BRAND.ancientStone, icon: '○' },
  'in-progress': { color: BRAND.cenoteTurquoise, icon: '◐' },
  completed: { color: '#38A169', icon: '●' },
  overdue: { color: '#E53E3E', icon: '⚠' },
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

function formatDateShort(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function getDaysRemaining(endDate: Date): number {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getProgressColor(progress: number): string {
  if (progress >= 80) return '#38A169';
  if (progress >= 50) return BRAND.sacredGold;
  if (progress >= 25) return '#DD6B20';
  return '#E53E3E';
}

function calculateProjectProgress(phases: ProjectPhase[]): number {
  if (phases.length === 0) return 0;
  const totalProgress = phases.reduce((sum, phase) => sum + phase.progress, 0);
  return Math.round(totalProgress / phases.length);
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  // Project list
  projectList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },

  projectListHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },

  projectListTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  projectListActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  viewToggle: {
    display: 'flex',
    backgroundColor: BRAND.softSand,
    borderRadius: '8px',
    padding: '4px',
  },

  viewToggleButton: {
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: 500,
    color: BRAND.ancientStone,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  viewToggleButtonActive: {
    backgroundColor: '#ffffff',
    color: BRAND.uiSlate,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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

  // Grid view
  projectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },

  // Project card
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  projectCardHover: {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
  },

  projectCardHeader: {
    padding: '16px 20px',
    borderBottom: `1px solid ${BRAND.ancientStone}08`,
  },

  projectCardTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },

  projectName: {
    fontSize: '16px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    margin: 0,
  },

  projectStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: 500,
    borderRadius: '100px',
  },

  projectDescription: {
    fontSize: '13px',
    color: BRAND.ancientStone,
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  },

  projectCardBody: {
    padding: '16px 20px',
  },

  projectProgress: {
    marginBottom: '16px',
  },

  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
    fontSize: '12px',
  },

  progressLabel: {
    color: BRAND.ancientStone,
  },

  progressValue: {
    fontWeight: 600,
    color: BRAND.uiSlate,
  },

  progressBar: {
    height: '6px',
    backgroundColor: `${BRAND.ancientStone}15`,
    borderRadius: '3px',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s',
  },

  projectMeta: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '16px',
    marginBottom: '16px',
  },

  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  metaIcon: {
    fontSize: '14px',
  },

  projectTeam: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  teamAvatars: {
    display: 'flex',
    alignItems: 'center',
  },

  teamAvatar: {
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

  teamAvatarFirst: {
    marginLeft: 0,
  },

  teamMore: {
    backgroundColor: BRAND.ancientStone,
    color: '#ffffff',
  },

  priorityBadge: {
    padding: '3px 8px',
    fontSize: '11px',
    fontWeight: 600,
    borderRadius: '4px',
    textTransform: 'uppercase' as const,
  },

  // Project detail
  projectDetail: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },

  detailHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '24px',
    padding: '24px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
  },

  detailHeaderInfo: {
    flex: 1,
  },

  detailTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: BRAND.uiSlate,
    margin: '0 0 8px',
  },

  detailDescription: {
    fontSize: '14px',
    color: BRAND.ancientStone,
    lineHeight: 1.6,
    marginBottom: '16px',
  },

  detailTags: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },

  tag: {
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: 500,
    color: BRAND.ancientStone,
    backgroundColor: BRAND.softSand,
    borderRadius: '100px',
  },

  detailStats: {
    display: 'flex',
    gap: '24px',
  },

  statCard: {
    padding: '16px 24px',
    backgroundColor: BRAND.softSand,
    borderRadius: '8px',
    textAlign: 'center' as const,
    minWidth: '100px',
  },

  statValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: BRAND.uiSlate,
    marginBottom: '4px',
  },

  statLabel: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    textTransform: 'uppercase' as const,
  },

  // Phases/Timeline
  phasesSection: {
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

  phasesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },

  phaseItem: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    backgroundColor: BRAND.softSand,
    borderRadius: '8px',
    borderLeft: '4px solid',
  },

  phaseIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
  },

  phaseContent: {
    flex: 1,
  },

  phaseName: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '4px',
  },

  phaseDates: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    marginBottom: '8px',
  },

  phaseProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  phaseProgressBar: {
    flex: 1,
    height: '6px',
    backgroundColor: '#ffffff',
    borderRadius: '3px',
    overflow: 'hidden',
  },

  phaseProgressFill: {
    height: '100%',
    borderRadius: '3px',
  },

  phaseProgressValue: {
    fontSize: '12px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    minWidth: '40px',
    textAlign: 'right' as const,
  },

  // Milestones
  milestonesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },

  milestoneItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}15`,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  milestoneItemHover: {
    borderColor: BRAND.sacredGold,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },

  milestoneIcon: {
    fontSize: '16px',
  },

  milestoneContent: {
    flex: 1,
  },

  milestoneTitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    marginBottom: '2px',
  },

  milestoneDate: {
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  milestoneTasks: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  // Tasks list
  tasksList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  taskRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}10`,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  taskRowHover: {
    borderColor: BRAND.sacredGold,
    backgroundColor: BRAND.softSand,
  },

  taskStatus: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },

  taskContent: {
    flex: 1,
    minWidth: 0,
  },

  taskTitle: {
    fontSize: '14px',
    color: BRAND.uiSlate,
    marginBottom: '2px',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  taskMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
    color: BRAND.ancientStone,
  },

  taskAssignee: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  taskAssigneeAvatar: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: BRAND.softSand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '9px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    overflow: 'hidden',
  },

  taskPriority: {
    padding: '2px 6px',
    fontSize: '10px',
    fontWeight: 600,
    borderRadius: '3px',
    textTransform: 'uppercase' as const,
  },

  // Team overview
  teamOverview: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },

  teamMemberCard: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: `1px solid ${BRAND.ancientStone}15`,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  teamMemberCardHover: {
    borderColor: BRAND.sacredGold,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },

  memberAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: BRAND.softSand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '12px',
    overflow: 'hidden',
  },

  memberName: {
    fontSize: '14px',
    fontWeight: 600,
    color: BRAND.uiSlate,
    marginBottom: '4px',
    textAlign: 'center' as const,
  },

  memberRole: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    marginBottom: '12px',
    textAlign: 'center' as const,
  },

  memberStats: {
    display: 'flex',
    gap: '16px',
  },

  memberStat: {
    textAlign: 'center' as const,
  },

  memberStatValue: {
    fontSize: '16px',
    fontWeight: 700,
    color: BRAND.uiSlate,
  },

  memberStatLabel: {
    fontSize: '10px',
    color: BRAND.ancientStone,
    textTransform: 'uppercase' as const,
  },

  // Timeline view
  timelineView: {
    position: 'relative' as const,
    padding: '20px 0',
  },

  timelineHeader: {
    display: 'flex',
    borderBottom: `1px solid ${BRAND.ancientStone}15`,
    marginBottom: '20px',
  },

  timelineMonth: {
    flex: 1,
    padding: '8px',
    fontSize: '12px',
    fontWeight: 500,
    color: BRAND.ancientStone,
    textAlign: 'center' as const,
    borderRight: `1px solid ${BRAND.ancientStone}10`,
  },

  timelineBody: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },

  timelinePhase: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative' as const,
  },

  timelinePhaseName: {
    width: '120px',
    fontSize: '13px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    flexShrink: 0,
  },

  timelinePhaseBar: {
    flex: 1,
    position: 'relative' as const,
    height: '32px',
  },

  timelinePhaseProgress: {
    position: 'absolute' as const,
    height: '100%',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '8px',
    fontSize: '11px',
    fontWeight: 500,
    color: '#ffffff',
  },

  timelineMilestone: {
    position: 'absolute' as const,
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: BRAND.sacredGold,
    border: '2px solid #ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    transform: 'translateX(-50%)',
    zIndex: 1,
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
// PROJECT CARD COMPONENT
// ============================================================

export function ProjectCard({
  project,
  variant = 'detailed',
  onClick,
  className,
}: ProjectCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  const statusConfig = STATUS_CONFIG[project.status];
  const priorityConfig = PRIORITY_CONFIG[project.priority];
  const daysRemaining = getDaysRemaining(project.endDate);
  const progressColor = getProgressColor(project.progress);

  return (
    <div
      style={{
        ...styles.projectCard,
        ...(isHovered && styles.projectCardHover),
      }}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.projectCardHeader}>
        <div style={styles.projectCardTitle}>
          <h3 style={styles.projectName}>{project.name}</h3>
          <div
            style={{
              ...styles.projectStatus,
              backgroundColor: `${statusConfig.color}15`,
              color: statusConfig.color,
            }}
          >
            <span>{statusConfig.icon}</span>
            <span>{statusConfig.label}</span>
          </div>
        </div>
        {project.description && (
          <p style={styles.projectDescription}>{project.description}</p>
        )}
      </div>

      <div style={styles.projectCardBody}>
        <div style={styles.projectProgress}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>Progress</span>
            <span style={styles.progressValue}>{project.progress}%</span>
          </div>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${project.progress}%`,
                backgroundColor: progressColor,
              }}
            />
          </div>
        </div>

        <div style={styles.projectMeta}>
          <div style={styles.metaItem}>
            <span style={styles.metaIcon}>📅</span>
            <span>{formatDateShort(project.startDate)} - {formatDateShort(project.endDate)}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaIcon}>⏳</span>
            <span>{daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}</span>
          </div>
          {project.phases.length > 0 && (
            <div style={styles.metaItem}>
              <span style={styles.metaIcon}>📊</span>
              <span>{project.phases.length} phases</span>
            </div>
          )}
        </div>

        <div style={styles.projectTeam}>
          <div style={styles.teamAvatars}>
            {project.team.slice(0, 4).map((member, index) => (
              <div
                key={member.id}
                style={{
                  ...styles.teamAvatar,
                  ...(index === 0 && styles.teamAvatarFirst),
                }}
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  member.name.charAt(0).toUpperCase()
                )}
              </div>
            ))}
            {project.team.length > 4 && (
              <div style={{ ...styles.teamAvatar, ...styles.teamMore }}>
                +{project.team.length - 4}
              </div>
            )}
          </div>
          <span
            style={{
              ...styles.priorityBadge,
              backgroundColor: `${priorityConfig.color}15`,
              color: priorityConfig.color,
            }}
          >
            {priorityConfig.label}
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TASK ROW COMPONENT
// ============================================================

export function TaskRow({
  task,
  onClick,
  onStatusChange,
  showProject = false,
  className,
}: TaskRowProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  const statusConfig = TASK_STATUS_CONFIG[task.status];
  const priorityConfig = PRIORITY_CONFIG[task.priority];

  return (
    <div
      style={{
        ...styles.taskRow,
        ...(isHovered && styles.taskRowHover),
      }}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ ...styles.taskStatus, backgroundColor: statusConfig.color }} />
      
      <div style={styles.taskContent}>
        <div style={styles.taskTitle}>{task.title}</div>
        <div style={styles.taskMeta}>
          {task.assignee && (
            <div style={styles.taskAssignee}>
              <div style={styles.taskAssigneeAvatar}>
                {task.assignee.avatar ? (
                  <img
                    src={task.assignee.avatar}
                    alt={task.assignee.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  task.assignee.name.charAt(0).toUpperCase()
                )}
              </div>
              <span>{task.assignee.name}</span>
            </div>
          )}
          {task.dueDate && (
            <span>📅 {formatDateShort(task.dueDate)}</span>
          )}
          {task.comments !== undefined && task.comments > 0 && (
            <span>💬 {task.comments}</span>
          )}
        </div>
      </div>

      <span
        style={{
          ...styles.taskPriority,
          backgroundColor: `${priorityConfig.color}15`,
          color: priorityConfig.color,
        }}
      >
        {priorityConfig.label}
      </span>
    </div>
  );
}

// ============================================================
// MILESTONE CARD COMPONENT
// ============================================================

export function MilestoneCard({
  milestone,
  onClick,
  onUpdateStatus,
  className,
}: MilestoneCardProps): JSX.Element {
  const [isHovered, setIsHovered] = useState(false);

  const statusConfig = MILESTONE_STATUS_CONFIG[milestone.status];
  const completedTasks = milestone.tasks.filter((t) => t.status === 'done').length;

  return (
    <div
      style={{
        ...styles.milestoneItem,
        ...(isHovered && styles.milestoneItemHover),
      }}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ ...styles.milestoneIcon, color: statusConfig.color }}>
        {statusConfig.icon}
      </span>
      
      <div style={styles.milestoneContent}>
        <div style={styles.milestoneTitle}>{milestone.title}</div>
        <div style={styles.milestoneDate}>
          📅 Due: {formatDate(milestone.dueDate)}
        </div>
      </div>

      <div style={styles.milestoneTasks}>
        <span>✓ {completedTasks}/{milestone.tasks.length}</span>
      </div>
    </div>
  );
}

// ============================================================
// TEAM OVERVIEW COMPONENT
// ============================================================

export function TeamOverview({
  team,
  tasks,
  onMemberClick,
  className,
}: TeamOverviewProps): JSX.Element {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const memberStats = useMemo(() => {
    const stats = new Map<string, { assigned: number; completed: number }>();
    
    team.forEach((member) => {
      stats.set(member.id, { assigned: 0, completed: 0 });
    });

    tasks.forEach((task) => {
      if (task.assignee) {
        const current = stats.get(task.assignee.id) || { assigned: 0, completed: 0 };
        current.assigned++;
        if (task.status === 'done') {
          current.completed++;
        }
        stats.set(task.assignee.id, current);
      }
    });

    return stats;
  }, [team, tasks]);

  return (
    <div style={styles.teamOverview} className={className}>
      {team.map((member) => {
        const stats = memberStats.get(member.id) || { assigned: 0, completed: 0 };
        const isHovered = hoveredId === member.id;

        return (
          <div
            key={member.id}
            style={{
              ...styles.teamMemberCard,
              ...(isHovered && styles.teamMemberCardHover),
            }}
            onClick={() => onMemberClick?.(member)}
            onMouseEnter={() => setHoveredId(member.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div style={styles.memberAvatar}>
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                member.name.charAt(0).toUpperCase()
              )}
            </div>
            <div style={styles.memberName}>{member.name}</div>
            <div style={styles.memberRole}>{member.role}</div>
            <div style={styles.memberStats}>
              <div style={styles.memberStat}>
                <div style={styles.memberStatValue}>{stats.assigned}</div>
                <div style={styles.memberStatLabel}>Assigned</div>
              </div>
              <div style={styles.memberStat}>
                <div style={styles.memberStatValue}>{stats.completed}</div>
                <div style={styles.memberStatLabel}>Done</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// PROJECT LIST COMPONENT
// ============================================================

export function ProjectList({
  projects,
  view = 'grid',
  onProjectClick,
  onCreateProject,
  showFilters = true,
  className,
}: ProjectListProps): JSX.Element {
  const [currentView, setCurrentView] = useState(view);
  const [createHovered, setCreateHovered] = useState(false);

  if (projects.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📁</div>
        <div style={styles.emptyText}>No projects yet</div>
        {onCreateProject && (
          <button
            style={{
              ...styles.createButton,
              ...(createHovered && styles.createButtonHover),
            }}
            onClick={onCreateProject}
            onMouseEnter={() => setCreateHovered(true)}
            onMouseLeave={() => setCreateHovered(false)}
          >
            ➕ Create Project
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={styles.projectList} className={className}>
      <div style={styles.projectListHeader}>
        <span style={styles.projectListTitle}>Projects ({projects.length})</span>
        <div style={styles.projectListActions}>
          <div style={styles.viewToggle}>
            {(['grid', 'list'] as const).map((v) => (
              <button
                key={v}
                style={{
                  ...styles.viewToggleButton,
                  ...(currentView === v && styles.viewToggleButtonActive),
                }}
                onClick={() => setCurrentView(v)}
              >
                {v === 'grid' ? '⊞' : '☰'}
              </button>
            ))}
          </div>
          {onCreateProject && (
            <button
              style={{
                ...styles.createButton,
                ...(createHovered && styles.createButtonHover),
              }}
              onClick={onCreateProject}
              onMouseEnter={() => setCreateHovered(true)}
              onMouseLeave={() => setCreateHovered(false)}
            >
              ➕ New Project
            </button>
          )}
        </div>
      </div>

      <div style={currentView === 'grid' ? styles.projectGrid : styles.projectList}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            variant={currentView === 'grid' ? 'detailed' : 'compact'}
            onClick={() => onProjectClick?.(project)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PROJECT DETAIL COMPONENT
// ============================================================

export function ProjectDetail({
  project,
  onUpdateProject,
  onAddTask,
  onAddMilestone,
  className,
}: ProjectDetailProps): JSX.Element {
  const statusConfig = STATUS_CONFIG[project.status];
  const priorityConfig = PRIORITY_CONFIG[project.priority];
  const daysRemaining = getDaysRemaining(project.endDate);

  const allTasks = project.phases.flatMap((phase) =>
    phase.milestones.flatMap((milestone) => milestone.tasks)
  );

  const taskStats = {
    total: allTasks.length,
    completed: allTasks.filter((t) => t.status === 'done').length,
    inProgress: allTasks.filter((t) => t.status === 'in-progress').length,
    blocked: allTasks.filter((t) => t.status === 'blocked').length,
  };

  return (
    <div style={styles.projectDetail} className={className}>
      {/* Header */}
      <div style={styles.detailHeader}>
        <div style={styles.detailHeaderInfo}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={styles.detailTitle}>{project.name}</h1>
            <div
              style={{
                ...styles.projectStatus,
                backgroundColor: `${statusConfig.color}15`,
                color: statusConfig.color,
              }}
            >
              <span>{statusConfig.icon}</span>
              <span>{statusConfig.label}</span>
            </div>
          </div>
          {project.description && (
            <p style={styles.detailDescription}>{project.description}</p>
          )}
          {project.tags && project.tags.length > 0 && (
            <div style={styles.detailTags}>
              {project.tags.map((tag) => (
                <span key={tag} style={styles.tag}>#{tag}</span>
              ))}
            </div>
          )}
        </div>

        <div style={styles.detailStats}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{project.progress}%</div>
            <div style={styles.statLabel}>Complete</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{taskStats.total}</div>
            <div style={styles.statLabel}>Tasks</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{daysRemaining}</div>
            <div style={styles.statLabel}>Days Left</div>
          </div>
        </div>
      </div>

      {/* Phases */}
      <div style={styles.phasesSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Phases ({project.phases.length})</span>
        </div>
        <div style={styles.sectionContent}>
          <div style={styles.phasesList}>
            {project.phases.map((phase, index) => (
              <div
                key={phase.id}
                style={{
                  ...styles.phaseItem,
                  borderLeftColor: phase.color || BRAND.cenoteTurquoise,
                }}
              >
                <div style={styles.phaseIcon}>
                  {index + 1}
                </div>
                <div style={styles.phaseContent}>
                  <div style={styles.phaseName}>{phase.name}</div>
                  <div style={styles.phaseDates}>
                    {formatDateShort(phase.startDate)} → {formatDateShort(phase.endDate)}
                  </div>
                  <div style={styles.phaseProgress}>
                    <div style={styles.phaseProgressBar}>
                      <div
                        style={{
                          ...styles.phaseProgressFill,
                          width: `${phase.progress}%`,
                          backgroundColor: phase.color || BRAND.cenoteTurquoise,
                        }}
                      />
                    </div>
                    <span style={styles.phaseProgressValue}>{phase.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div style={styles.phasesSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Team ({project.team.length})</span>
        </div>
        <div style={styles.sectionContent}>
          <TeamOverview team={project.team} tasks={allTasks} />
        </div>
      </div>

      {/* Recent Tasks */}
      <div style={styles.phasesSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>Recent Tasks</span>
        </div>
        <div style={styles.sectionContent}>
          <div style={styles.tasksList}>
            {allTasks.slice(0, 5).map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  ProjectStatus,
  Priority,
  MilestoneStatus,
  TaskStatus,
  TeamMember,
  ProjectTask,
  Milestone,
  ProjectPhase,
  ProjectBudget,
  ProjectRisk,
  Project,
  ProjectListProps,
  ProjectCardProps,
  ProjectDetailProps,
  MilestoneCardProps,
  TaskRowProps,
  TimelineViewProps,
  TeamOverviewProps,
};

export {
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  TASK_STATUS_CONFIG,
  MILESTONE_STATUS_CONFIG,
  formatDate,
  formatDateShort,
  getDaysRemaining,
  getProgressColor,
  calculateProjectProgress,
};

export default {
  ProjectList,
  ProjectCard,
  ProjectDetail,
  TaskRow,
  MilestoneCard,
  TeamOverview,
};
