/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — OCW ENGINE STORE                            ║
 * ║                    Orchestrated Collaborative Workspace                       ║
 * ║                    Task C7: Nouveaux Engines                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * OCW ENGINE FEATURES:
 * - Multi-user workspaces
 * - Real-time collaboration
 * - Agent orchestration
 * - Shared resources
 * - Project management
 * - Team coordination
 */

import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type WorkspaceType = 'project' | 'team' | 'department' | 'organization' | 'temporary'
export type WorkspaceVisibility = 'private' | 'members' | 'organization' | 'public'
export type MemberRole = 'owner' | 'admin' | 'editor' | 'viewer' | 'guest'
export type ResourceType = 'document' | 'thread' | 'datafile' | 'agent' | 'meeting' | 'task' | 'link'
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'cancelled'
export type ActivityType = 'create' | 'update' | 'delete' | 'comment' | 'assign' | 'complete' | 'share'

export interface Workspace {
  id: string
  name: string
  description?: string
  type: WorkspaceType
  visibility: WorkspaceVisibility
  owner_id: string
  sphere_id: string
  icon: string
  color: string
  settings: WorkspaceSettings
  stats: WorkspaceStats
  created_at: string
  updated_at: string
  archived_at?: string
}

export interface WorkspaceSettings {
  allow_guest_access: boolean
  require_approval_to_join: boolean
  default_member_role: MemberRole
  enable_ai_agents: boolean
  enable_governance: boolean
  max_members: number
  retention_days?: number
  notification_level: 'all' | 'mentions' | 'none'
}

export interface WorkspaceStats {
  member_count: number
  resource_count: number
  task_count: number
  active_agent_count: number
  last_activity_at: string
}

export interface WorkspaceMember {
  id: string
  workspace_id: string
  identity_id: string
  name: string
  email: string
  avatar?: string
  role: MemberRole
  permissions: MemberPermissions
  joined_at: string
  last_active_at: string
  is_online: boolean
}

export interface MemberPermissions {
  can_invite: boolean
  can_remove_members: boolean
  can_edit_settings: boolean
  can_create_resources: boolean
  can_delete_resources: boolean
  can_manage_agents: boolean
  can_approve_checkpoints: boolean
}

export interface SharedResource {
  id: string
  workspace_id: string
  type: ResourceType
  resource_id: string
  name: string
  description?: string
  icon: string
  shared_by: string
  shared_at: string
  access_count: number
  last_accessed_at?: string
  permissions: ResourcePermissions
}

export interface ResourcePermissions {
  can_view: MemberRole[]
  can_edit: MemberRole[]
  can_delete: MemberRole[]
  can_share: MemberRole[]
}

export interface WorkspaceTask {
  id: string
  workspace_id: string
  title: string
  description?: string
  status: TaskStatus
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee_ids: string[]
  reporter_id: string
  due_date?: string
  estimated_hours?: number
  logged_hours: number
  labels: string[]
  parent_task_id?: string
  subtask_ids: string[]
  comments: TaskComment[]
  attachments: string[]
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface TaskComment {
  id: string
  author_id: string
  author_name: string
  content: string
  timestamp: string
  is_edited: boolean
}

export interface WorkspaceActivity {
  id: string
  workspace_id: string
  type: ActivityType
  actor_id: string
  actor_name: string
  target_type: ResourceType | 'workspace' | 'member' | 'task'
  target_id: string
  target_name: string
  details?: Record<string, unknown>
  timestamp: string
}

export interface AgentAssignment {
  id: string
  workspace_id: string
  agent_id: string
  agent_name: string
  assigned_by: string
  role: string
  permissions: string[]
  token_budget: number
  tokens_used: number
  is_active: boolean
  assigned_at: string
}

export interface CollaborationSession {
  id: string
  workspace_id: string
  resource_id: string
  resource_type: ResourceType
  participants: SessionParticipant[]
  started_at: string
  ended_at?: string
}

export interface SessionParticipant {
  identity_id: string
  name: string
  avatar?: string
  cursor_position?: { x: number; y: number }
  is_active: boolean
  joined_at: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE STATE
// ═══════════════════════════════════════════════════════════════════════════════

interface OCWState {
  // Data
  workspaces: Record<string, Workspace>
  members: Record<string, WorkspaceMember[]>
  resources: Record<string, SharedResource[]>
  tasks: Record<string, WorkspaceTask[]>
  activities: Record<string, WorkspaceActivity[]>
  agent_assignments: Record<string, AgentAssignment[]>
  active_sessions: Record<string, CollaborationSession>
  
  // UI State
  current_workspace_id: string | null
  is_loading: boolean
  error: string | null
  online_members: Set<string>
  
  // Workspace CRUD
  createWorkspace: (data: Omit<Workspace, 'id' | 'created_at' | 'updated_at' | 'stats'>) => Workspace
  updateWorkspace: (id: string, data: Partial<Workspace>) => void
  deleteWorkspace: (id: string) => boolean
  archiveWorkspace: (id: string) => void
  getWorkspace: (id: string) => Workspace | undefined
  getWorkspacesByType: (type: WorkspaceType) => Workspace[]
  getWorkspacesBySphere: (sphereId: string) => Workspace[]
  
  // Member Management
  addMember: (workspaceId: string, data: Omit<WorkspaceMember, 'id' | 'workspace_id' | 'joined_at' | 'last_active_at' | 'is_online'>) => WorkspaceMember
  removeMember: (workspaceId: string, memberId: string) => void
  updateMemberRole: (workspaceId: string, memberId: string, role: MemberRole) => void
  getMembers: (workspaceId: string) => WorkspaceMember[]
  setMemberOnline: (memberId: string, online: boolean) => void
  
  // Resource Sharing
  shareResource: (workspaceId: string, data: Omit<SharedResource, 'id' | 'workspace_id' | 'shared_at' | 'access_count'>) => SharedResource
  unshareResource: (workspaceId: string, resourceId: string) => void
  updateResourcePermissions: (workspaceId: string, resourceId: string, permissions: ResourcePermissions) => void
  getResources: (workspaceId: string, type?: ResourceType) => SharedResource[]
  accessResource: (workspaceId: string, resourceId: string) => void
  
  // Task Management
  createTask: (workspaceId: string, data: Omit<WorkspaceTask, 'id' | 'workspace_id' | 'created_at' | 'updated_at' | 'logged_hours' | 'subtask_ids' | 'comments' | 'attachments'>) => WorkspaceTask
  updateTask: (workspaceId: string, taskId: string, data: Partial<WorkspaceTask>) => void
  deleteTask: (workspaceId: string, taskId: string) => void
  moveTask: (workspaceId: string, taskId: string, newStatus: TaskStatus) => void
  assignTask: (workspaceId: string, taskId: string, assigneeIds: string[]) => void
  addTaskComment: (workspaceId: string, taskId: string, content: string, authorId: string, authorName: string) => void
  getTasks: (workspaceId: string, status?: TaskStatus) => WorkspaceTask[]
  getTasksByAssignee: (workspaceId: string, assigneeId: string) => WorkspaceTask[]
  
  // Agent Orchestration
  assignAgent: (workspaceId: string, data: Omit<AgentAssignment, 'id' | 'workspace_id' | 'assigned_at' | 'tokens_used' | 'is_active'>) => AgentAssignment
  unassignAgent: (workspaceId: string, agentId: string) => void
  updateAgentBudget: (workspaceId: string, agentId: string, budget: number) => void
  getAssignedAgents: (workspaceId: string) => AgentAssignment[]
  
  // Activity Tracking
  logActivity: (workspaceId: string, activity: Omit<WorkspaceActivity, 'id' | 'workspace_id' | 'timestamp'>) => void
  getActivities: (workspaceId: string, limit?: number) => WorkspaceActivity[]
  
  // Collaboration Sessions
  startSession: (workspaceId: string, resourceId: string, resourceType: ResourceType, identityId: string, name: string) => CollaborationSession
  joinSession: (sessionId: string, identityId: string, name: string) => void
  leaveSession: (sessionId: string, identityId: string) => void
  updateCursor: (sessionId: string, identityId: string, position: { x: number; y: number }) => void
  endSession: (sessionId: string) => void
  getActiveSession: (resourceId: string) => CollaborationSession | undefined
  
  // UI Actions
  setCurrentWorkspace: (id: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

const getDefaultPermissions = (role: MemberRole): MemberPermissions => {
  const permissions: Record<MemberRole, MemberPermissions> = {
    owner: {
      can_invite: true, can_remove_members: true, can_edit_settings: true,
      can_create_resources: true, can_delete_resources: true, can_manage_agents: true, can_approve_checkpoints: true,
    },
    admin: {
      can_invite: true, can_remove_members: true, can_edit_settings: true,
      can_create_resources: true, can_delete_resources: true, can_manage_agents: true, can_approve_checkpoints: true,
    },
    editor: {
      can_invite: true, can_remove_members: false, can_edit_settings: false,
      can_create_resources: true, can_delete_resources: false, can_manage_agents: false, can_approve_checkpoints: false,
    },
    viewer: {
      can_invite: false, can_remove_members: false, can_edit_settings: false,
      can_create_resources: false, can_delete_resources: false, can_manage_agents: false, can_approve_checkpoints: false,
    },
    guest: {
      can_invite: false, can_remove_members: false, can_edit_settings: false,
      can_create_resources: false, can_delete_resources: false, can_manage_agents: false, can_approve_checkpoints: false,
    },
  }
  return permissions[role]
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const initialState = {
  workspaces: {},
  members: {},
  resources: {},
  tasks: {},
  activities: {},
  agent_assignments: {},
  active_sessions: {},
  current_workspace_id: null,
  is_loading: false,
  error: null,
  online_members: new Set<string>(),
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORE IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════════

export const useOCWEngineStore = create<OCWState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,
      
      // ─────────────────────────────────────────────────────────────────────────
      // Workspace CRUD
      // ─────────────────────────────────────────────────────────────────────────
      
      createWorkspace: (data) => {
        const id = `workspace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const now = new Date().toISOString()
        
        const workspace: Workspace = {
          ...data,
          id,
          stats: {
            member_count: 1,
            resource_count: 0,
            task_count: 0,
            active_agent_count: 0,
            last_activity_at: now,
          },
          created_at: now,
          updated_at: now,
        }
        
        set(state => ({
          workspaces: { ...state.workspaces, [id]: workspace },
          members: { ...state.members, [id]: [] },
          resources: { ...state.resources, [id]: [] },
          tasks: { ...state.tasks, [id]: [] },
          activities: { ...state.activities, [id]: [] },
          agent_assignments: { ...state.agent_assignments, [id]: [] },
        }))
        
        // Workspace created - use logger if needed
        // logger.debug('Workspace created:', id)
        return workspace
      },
      
      updateWorkspace: (id, data) => {
        set(state => ({
          workspaces: {
            ...state.workspaces,
            [id]: { ...state.workspaces[id], ...data, updated_at: new Date().toISOString() },
          },
        }))
      },
      
      deleteWorkspace: (id) => {
        if (!get().workspaces[id]) return false
        set(state => {
          const { [id]: _, ...workspaces } = state.workspaces
          const { [id]: __, ...members } = state.members
          const { [id]: ___, ...resources } = state.resources
          const { [id]: ____, ...tasks } = state.tasks
          const { [id]: _____, ...activities } = state.activities
          const { [id]: ______, ...agent_assignments } = state.agent_assignments
          return { workspaces, members, resources, tasks, activities, agent_assignments }
        })
        return true
      },
      
      archiveWorkspace: (id) => {
        set(state => ({
          workspaces: {
            ...state.workspaces,
            [id]: { ...state.workspaces[id], archived_at: new Date().toISOString() },
          },
        }))
      },
      
      getWorkspace: (id) => get().workspaces[id],
      getWorkspacesByType: (type) => Object.values(get().workspaces).filter(w => w.type === type && !w.archived_at),
      getWorkspacesBySphere: (sphereId) => Object.values(get().workspaces).filter(w => w.sphere_id === sphereId && !w.archived_at),
      
      // ─────────────────────────────────────────────────────────────────────────
      // Member Management
      // ─────────────────────────────────────────────────────────────────────────
      
      addMember: (workspaceId, data) => {
        const id = `member_${Date.now()}`
        const now = new Date().toISOString()
        
        const member: WorkspaceMember = {
          ...data,
          id,
          workspace_id: workspaceId,
          permissions: getDefaultPermissions(data.role),
          joined_at: now,
          last_active_at: now,
          is_online: false,
        }
        
        set(state => ({
          members: {
            ...state.members,
            [workspaceId]: [...(state.members[workspaceId] || []), member],
          },
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              stats: {
                ...state.workspaces[workspaceId].stats,
                member_count: (state.members[workspaceId]?.length || 0) + 1,
              },
            },
          },
        }))
        
        return member
      },
      
      removeMember: (workspaceId, memberId) => {
        set(state => ({
          members: {
            ...state.members,
            [workspaceId]: (state.members[workspaceId] || []).filter(m => m.id !== memberId),
          },
        }))
      },
      
      updateMemberRole: (workspaceId, memberId, role) => {
        set(state => ({
          members: {
            ...state.members,
            [workspaceId]: (state.members[workspaceId] || []).map(m =>
              m.id === memberId ? { ...m, role, permissions: getDefaultPermissions(role) } : m
            ),
          },
        }))
      },
      
      getMembers: (workspaceId) => get().members[workspaceId] || [],
      
      setMemberOnline: (memberId, online) => {
        set(state => {
          const newOnline = new Set(state.online_members)
          if (online) newOnline.add(memberId)
          else newOnline.delete(memberId)
          return { online_members: newOnline }
        })
      },
      
      // ─────────────────────────────────────────────────────────────────────────
      // Resource Sharing
      // ─────────────────────────────────────────────────────────────────────────
      
      shareResource: (workspaceId, data) => {
        const id = `resource_${Date.now()}`
        const resource: SharedResource = {
          ...data,
          id,
          workspace_id: workspaceId,
          shared_at: new Date().toISOString(),
          access_count: 0,
        }
        
        set(state => ({
          resources: {
            ...state.resources,
            [workspaceId]: [...(state.resources[workspaceId] || []), resource],
          },
        }))
        
        return resource
      },
      
      unshareResource: (workspaceId, resourceId) => {
        set(state => ({
          resources: {
            ...state.resources,
            [workspaceId]: (state.resources[workspaceId] || []).filter(r => r.id !== resourceId),
          },
        }))
      },
      
      updateResourcePermissions: (workspaceId, resourceId, permissions) => {
        set(state => ({
          resources: {
            ...state.resources,
            [workspaceId]: (state.resources[workspaceId] || []).map(r =>
              r.id === resourceId ? { ...r, permissions } : r
            ),
          },
        }))
      },
      
      getResources: (workspaceId, type) => {
        const resources = get().resources[workspaceId] || []
        return type ? resources.filter(r => r.type === type) : resources
      },
      
      accessResource: (workspaceId, resourceId) => {
        set(state => ({
          resources: {
            ...state.resources,
            [workspaceId]: (state.resources[workspaceId] || []).map(r =>
              r.id === resourceId
                ? { ...r, access_count: r.access_count + 1, last_accessed_at: new Date().toISOString() }
                : r
            ),
          },
        }))
      },
      
      // ─────────────────────────────────────────────────────────────────────────
      // Task Management
      // ─────────────────────────────────────────────────────────────────────────
      
      createTask: (workspaceId, data) => {
        const id = `task_${Date.now()}`
        const now = new Date().toISOString()
        
        const task: WorkspaceTask = {
          ...data,
          id,
          workspace_id: workspaceId,
          logged_hours: 0,
          subtask_ids: [],
          comments: [],
          attachments: [],
          created_at: now,
          updated_at: now,
        }
        
        set(state => ({
          tasks: {
            ...state.tasks,
            [workspaceId]: [...(state.tasks[workspaceId] || []), task],
          },
        }))
        
        return task
      },
      
      updateTask: (workspaceId, taskId, data) => {
        set(state => ({
          tasks: {
            ...state.tasks,
            [workspaceId]: (state.tasks[workspaceId] || []).map(t =>
              t.id === taskId ? { ...t, ...data, updated_at: new Date().toISOString() } : t
            ),
          },
        }))
      },
      
      deleteTask: (workspaceId, taskId) => {
        set(state => ({
          tasks: {
            ...state.tasks,
            [workspaceId]: (state.tasks[workspaceId] || []).filter(t => t.id !== taskId),
          },
        }))
      },
      
      moveTask: (workspaceId, taskId, newStatus) => {
        const completedAt = newStatus === 'done' ? new Date().toISOString() : undefined
        set(state => ({
          tasks: {
            ...state.tasks,
            [workspaceId]: (state.tasks[workspaceId] || []).map(t =>
              t.id === taskId ? { ...t, status: newStatus, completed_at: completedAt, updated_at: new Date().toISOString() } : t
            ),
          },
        }))
      },
      
      assignTask: (workspaceId, taskId, assigneeIds) => {
        set(state => ({
          tasks: {
            ...state.tasks,
            [workspaceId]: (state.tasks[workspaceId] || []).map(t =>
              t.id === taskId ? { ...t, assignee_ids: assigneeIds, updated_at: new Date().toISOString() } : t
            ),
          },
        }))
      },
      
      addTaskComment: (workspaceId, taskId, content, authorId, authorName) => {
        const comment: TaskComment = {
          id: `comment_${Date.now()}`,
          author_id: authorId,
          author_name: authorName,
          content,
          timestamp: new Date().toISOString(),
          is_edited: false,
        }
        
        set(state => ({
          tasks: {
            ...state.tasks,
            [workspaceId]: (state.tasks[workspaceId] || []).map(t =>
              t.id === taskId ? { ...t, comments: [...t.comments, comment] } : t
            ),
          },
        }))
      },
      
      getTasks: (workspaceId, status) => {
        const tasks = get().tasks[workspaceId] || []
        return status ? tasks.filter(t => t.status === status) : tasks
      },
      
      getTasksByAssignee: (workspaceId, assigneeId) => {
        return (get().tasks[workspaceId] || []).filter(t => t.assignee_ids.includes(assigneeId))
      },
      
      // ─────────────────────────────────────────────────────────────────────────
      // Agent Orchestration
      // ─────────────────────────────────────────────────────────────────────────
      
      assignAgent: (workspaceId, data) => {
        const id = `assignment_${Date.now()}`
        const assignment: AgentAssignment = {
          ...data,
          id,
          workspace_id: workspaceId,
          tokens_used: 0,
          is_active: true,
          assigned_at: new Date().toISOString(),
        }
        
        set(state => ({
          agent_assignments: {
            ...state.agent_assignments,
            [workspaceId]: [...(state.agent_assignments[workspaceId] || []), assignment],
          },
        }))
        
        return assignment
      },
      
      unassignAgent: (workspaceId, agentId) => {
        set(state => ({
          agent_assignments: {
            ...state.agent_assignments,
            [workspaceId]: (state.agent_assignments[workspaceId] || []).filter(a => a.agent_id !== agentId),
          },
        }))
      },
      
      updateAgentBudget: (workspaceId, agentId, budget) => {
        set(state => ({
          agent_assignments: {
            ...state.agent_assignments,
            [workspaceId]: (state.agent_assignments[workspaceId] || []).map(a =>
              a.agent_id === agentId ? { ...a, token_budget: budget } : a
            ),
          },
        }))
      },
      
      getAssignedAgents: (workspaceId) => get().agent_assignments[workspaceId] || [],
      
      // ─────────────────────────────────────────────────────────────────────────
      // Activity Tracking
      // ─────────────────────────────────────────────────────────────────────────
      
      logActivity: (workspaceId, activity) => {
        const fullActivity: WorkspaceActivity = {
          ...activity,
          id: `activity_${Date.now()}`,
          workspace_id: workspaceId,
          timestamp: new Date().toISOString(),
        }
        
        set(state => ({
          activities: {
            ...state.activities,
            [workspaceId]: [fullActivity, ...(state.activities[workspaceId] || [])].slice(0, 100),
          },
          workspaces: {
            ...state.workspaces,
            [workspaceId]: {
              ...state.workspaces[workspaceId],
              stats: {
                ...state.workspaces[workspaceId].stats,
                last_activity_at: fullActivity.timestamp,
              },
            },
          },
        }))
      },
      
      getActivities: (workspaceId, limit = 50) => {
        return (get().activities[workspaceId] || []).slice(0, limit)
      },
      
      // ─────────────────────────────────────────────────────────────────────────
      // Collaboration Sessions
      // ─────────────────────────────────────────────────────────────────────────
      
      startSession: (workspaceId, resourceId, resourceType, identityId, name) => {
        const id = `session_${Date.now()}`
        const now = new Date().toISOString()
        
        const session: CollaborationSession = {
          id,
          workspace_id: workspaceId,
          resource_id: resourceId,
          resource_type: resourceType,
          participants: [{
            identity_id: identityId,
            name,
            is_active: true,
            joined_at: now,
          }],
          started_at: now,
        }
        
        set(state => ({
          active_sessions: { ...state.active_sessions, [resourceId]: session },
        }))
        
        return session
      },
      
      joinSession: (sessionId, identityId, name) => {
        set(state => {
          const session = Object.values(state.active_sessions).find(s => s.id === sessionId)
          if (!session) return state
          
          return {
            active_sessions: {
              ...state.active_sessions,
              [session.resource_id]: {
                ...session,
                participants: [
                  ...session.participants,
                  { identity_id: identityId, name, is_active: true, joined_at: new Date().toISOString() },
                ],
              },
            },
          }
        })
      },
      
      leaveSession: (sessionId, identityId) => {
        set(state => {
          const session = Object.values(state.active_sessions).find(s => s.id === sessionId)
          if (!session) return state
          
          const updatedParticipants = session.participants.filter(p => p.identity_id !== identityId)
          
          if (updatedParticipants.length === 0) {
            const { [session.resource_id]: _, ...active_sessions } = state.active_sessions
            return { active_sessions }
          }
          
          return {
            active_sessions: {
              ...state.active_sessions,
              [session.resource_id]: { ...session, participants: updatedParticipants },
            },
          }
        })
      },
      
      updateCursor: (sessionId, identityId, position) => {
        set(state => {
          const session = Object.values(state.active_sessions).find(s => s.id === sessionId)
          if (!session) return state
          
          return {
            active_sessions: {
              ...state.active_sessions,
              [session.resource_id]: {
                ...session,
                participants: session.participants.map(p =>
                  p.identity_id === identityId ? { ...p, cursor_position: position } : p
                ),
              },
            },
          }
        })
      },
      
      endSession: (sessionId) => {
        set(state => {
          const session = Object.values(state.active_sessions).find(s => s.id === sessionId)
          if (!session) return state
          
          const { [session.resource_id]: _, ...active_sessions } = state.active_sessions
          return { active_sessions }
        })
      },
      
      getActiveSession: (resourceId) => get().active_sessions[resourceId],
      
      // ─────────────────────────────────────────────────────────────────────────
      // UI Actions
      // ─────────────────────────────────────────────────────────────────────────
      
      setCurrentWorkspace: (id) => set({ current_workspace_id: id }),
      setLoading: (loading) => set({ is_loading: loading }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    })),
    { name: 'chenu-ocw-engine' }
  )
)

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type { OCWState }
export default useOCWEngineStore
