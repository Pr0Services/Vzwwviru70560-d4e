/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — PERMISSION ENGINE                                     ║
 * ║              Core Engine 4/6                                                 ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "Governance is ALWAYS enforced before execution."                          ║
 * ║  "Governance is not a restriction. Governance is empowerment."              ║
 * ║  "Tree Laws ensure AI safety and human control."                            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type PermissionAction = 
  | 'create' | 'read' | 'update' | 'delete'
  | 'execute' | 'share' | 'export' | 'import'
  | 'approve' | 'delegate' | 'audit';

export type ResourceType = 
  | 'sphere' | 'bureau' | 'dataspace' | 'thread'
  | 'agent' | 'document' | 'meeting' | 'budget'
  | 'system' | 'api';

export type Role = 
  | 'owner'           // Full control
  | 'admin'           // Administrative access
  | 'manager'         // Can manage resources
  | 'contributor'     // Can create and edit
  | 'viewer'          // Read-only access
  | 'guest';          // Limited access

export interface Permission {
  id: string;
  action: PermissionAction;
  resource_type: ResourceType;
  resource_id?: string; // Specific resource or '*' for all
  granted: boolean;
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  type: 'time_range' | 'budget_limit' | 'approval_required' | 'scope_restriction';
  params: Record<string, any>;
}

export interface RoleDefinition {
  role: Role;
  permissions: Permission[];
  inherits_from?: Role;
}

export interface UserPermissions {
  user_id: string;
  global_role: Role;
  sphere_roles: Map<string, Role>;
  explicit_permissions: Permission[];
  denied_permissions: Permission[];
}

// Tree Laws Types
export interface TreeLaw {
  id: string;
  name: string;
  description: string;
  level: 'root' | 'branch' | 'leaf';
  rule: string;
  enforcement: 'strict' | 'advisory';
  applies_to: ResourceType[];
}

export interface GovernanceCheckResult {
  allowed: boolean;
  reason: string;
  required_approvals?: string[];
  violated_laws?: TreeLaw[];
  cost_estimate?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TREE LAWS (AI SAFETY & GOVERNANCE RULES)
// ═══════════════════════════════════════════════════════════════════════════════

const TREE_LAWS: TreeLaw[] = [
  // ROOT LAWS (Inviolable)
  {
    id: 'ROOT_001',
    name: 'Human Control Primacy',
    description: 'AI actions must always be subject to human oversight and control',
    level: 'root',
    rule: 'No autonomous AI execution without human governance pathway',
    enforcement: 'strict',
    applies_to: ['agent', 'system', 'api'],
  },
  {
    id: 'ROOT_002',
    name: 'Data Sovereignty',
    description: 'Users own and control their data absolutely',
    level: 'root',
    rule: 'User data cannot be accessed, shared, or processed without explicit consent',
    enforcement: 'strict',
    applies_to: ['dataspace', 'document', 'thread'],
  },
  {
    id: 'ROOT_003',
    name: 'Transparency Mandate',
    description: 'All AI actions must be auditable and explainable',
    level: 'root',
    rule: 'Every AI operation must produce audit trail entries',
    enforcement: 'strict',
    applies_to: ['agent', 'system'],
  },
  
  // BRANCH LAWS (Important governance)
  {
    id: 'BRANCH_001',
    name: 'Budget Enforcement',
    description: 'Token budgets must be respected',
    level: 'branch',
    rule: 'Operations cannot exceed allocated budget without approval',
    enforcement: 'strict',
    applies_to: ['thread', 'agent', 'meeting'],
  },
  {
    id: 'BRANCH_002',
    name: 'Scope Containment',
    description: 'Operations must stay within defined scope',
    level: 'branch',
    rule: 'Cross-sphere access requires explicit permission',
    enforcement: 'strict',
    applies_to: ['sphere', 'dataspace', 'agent'],
  },
  {
    id: 'BRANCH_003',
    name: 'Agent Hierarchy',
    description: 'Agents must respect hierarchy levels',
    level: 'branch',
    rule: 'L3 agents cannot invoke L0 capabilities directly',
    enforcement: 'strict',
    applies_to: ['agent'],
  },
  
  // LEAF LAWS (Best practices)
  {
    id: 'LEAF_001',
    name: 'Minimal Data Access',
    description: 'Access only the data needed for the task',
    level: 'leaf',
    rule: 'Prefer narrow data queries over broad access',
    enforcement: 'advisory',
    applies_to: ['dataspace', 'document'],
  },
  {
    id: 'LEAF_002',
    name: 'Graceful Degradation',
    description: 'Prefer partial completion over failure',
    level: 'leaf',
    rule: 'If budget is exceeded, return partial results with explanation',
    enforcement: 'advisory',
    applies_to: ['agent', 'thread'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PERMISSION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class PermissionEngine {
  private roleDefinitions: Map<Role, RoleDefinition> = new Map();
  private userPermissions: Map<string, UserPermissions> = new Map();
  private treeLaws: TreeLaw[] = TREE_LAWS;
  private pendingApprovals: Map<string, ApprovalRequest> = new Map();
  
  constructor() {
    this.initializeRoleDefinitions();
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  private initializeRoleDefinitions(): void {
    // Owner - Full control
    this.roleDefinitions.set('owner', {
      role: 'owner',
      permissions: this.createFullPermissions(),
    });
    
    // Admin - Almost full control
    this.roleDefinitions.set('admin', {
      role: 'admin',
      permissions: this.createAdminPermissions(),
      inherits_from: 'manager',
    });
    
    // Manager - Can manage resources
    this.roleDefinitions.set('manager', {
      role: 'manager',
      permissions: this.createManagerPermissions(),
      inherits_from: 'contributor',
    });
    
    // Contributor - Can create and edit
    this.roleDefinitions.set('contributor', {
      role: 'contributor',
      permissions: this.createContributorPermissions(),
      inherits_from: 'viewer',
    });
    
    // Viewer - Read only
    this.roleDefinitions.set('viewer', {
      role: 'viewer',
      permissions: this.createViewerPermissions(),
    });
    
    // Guest - Limited access
    this.roleDefinitions.set('guest', {
      role: 'guest',
      permissions: this.createGuestPermissions(),
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PERMISSION CHECKING
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Check if a user can perform an action on a resource
   */
  checkPermission(
    userId: string,
    action: PermissionAction,
    resourceType: ResourceType,
    resourceId?: string,
    context?: { sphereId?: string; budget?: number }
  ): GovernanceCheckResult {
    // Check Tree Laws first
    const lawViolations = this.checkTreeLaws(action, resourceType, context);
    if (lawViolations.length > 0) {
      const strictViolations = lawViolations.filter(l => l.enforcement === 'strict');
      if (strictViolations.length > 0) {
        return {
          allowed: false,
          reason: `Tree Law violation: ${strictViolations[0].name}`,
          violated_laws: strictViolations,
        };
      }
    }
    
    // Get user permissions
    const userPerms = this.userPermissions.get(userId);
    if (!userPerms) {
      return {
        allowed: false,
        reason: 'User not found in permission system',
      };
    }
    
    // Check explicit denials first
    const isDenied = this.isExplicitlyDenied(userPerms, action, resourceType, resourceId);
    if (isDenied) {
      return {
        allowed: false,
        reason: 'Action explicitly denied for this user',
      };
    }
    
    // Check explicit permissions
    const isExplicitlyAllowed = this.isExplicitlyAllowed(userPerms, action, resourceType, resourceId);
    if (isExplicitlyAllowed) {
      return { allowed: true, reason: 'Explicitly permitted' };
    }
    
    // Check role-based permissions
    const effectiveRole = context?.sphereId 
      ? userPerms.sphere_roles.get(context.sphereId) || userPerms.global_role
      : userPerms.global_role;
    
    const roleAllowed = this.checkRolePermission(effectiveRole, action, resourceType);
    if (roleAllowed) {
      return { allowed: true, reason: `Permitted by role: ${effectiveRole}` };
    }
    
    return {
      allowed: false,
      reason: `Insufficient permissions for ${action} on ${resourceType}`,
    };
  }
  
  /**
   * Full governance check including budget and approval requirements
   */
  governanceCheck(
    userId: string,
    action: PermissionAction,
    resourceType: ResourceType,
    resourceId?: string,
    context?: {
      sphereId?: string;
      budget?: number;
      estimatedCost?: number;
      agentLevel?: 'L0' | 'L1' | 'L2' | 'L3';
    }
  ): GovernanceCheckResult {
    // Basic permission check
    const permCheck = this.checkPermission(userId, action, resourceType, resourceId, context);
    if (!permCheck.allowed) {
      return permCheck;
    }
    
    // Budget check
    if (context?.budget && context?.estimatedCost) {
      if (context.estimatedCost > context.budget) {
        return {
          allowed: false,
          reason: 'Estimated cost exceeds available budget',
          cost_estimate: context.estimatedCost,
        };
      }
    }
    
    // Agent level restrictions
    if (context?.agentLevel && resourceType === 'system') {
      if (context.agentLevel === 'L3' || context.agentLevel === 'L2') {
        return {
          allowed: false,
          reason: 'Agent level insufficient for system resource access',
          required_approvals: ['L0 Agent or Human'],
        };
      }
    }
    
    // Check if approval is required
    const requiresApproval = this.requiresApproval(action, resourceType, context);
    if (requiresApproval.required) {
      return {
        allowed: true, // Conditionally allowed
        reason: 'Action requires approval',
        required_approvals: requiresApproval.approvers,
      };
    }
    
    return { allowed: true, reason: 'All governance checks passed' };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // USER MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Register a user with initial permissions
   */
  registerUser(userId: string, globalRole: Role = 'viewer'): UserPermissions {
    const userPerms: UserPermissions = {
      user_id: userId,
      global_role: globalRole,
      sphere_roles: new Map(),
      explicit_permissions: [],
      denied_permissions: [],
    };
    
    this.userPermissions.set(userId, userPerms);
    return userPerms;
  }
  
  /**
   * Set user's role for a specific sphere
   */
  setSphereRole(userId: string, sphereId: string, role: Role): void {
    const userPerms = this.userPermissions.get(userId);
    if (userPerms) {
      userPerms.sphere_roles.set(sphereId, role);
    }
  }
  
  /**
   * Grant explicit permission
   */
  grantPermission(userId: string, permission: Omit<Permission, 'id'>): void {
    const userPerms = this.userPermissions.get(userId);
    if (userPerms) {
      userPerms.explicit_permissions.push({
        ...permission,
        id: this.generateId('perm'),
        granted: true,
      });
    }
  }
  
  /**
   * Deny explicit permission
   */
  denyPermission(userId: string, permission: Omit<Permission, 'id'>): void {
    const userPerms = this.userPermissions.get(userId);
    if (userPerms) {
      userPerms.denied_permissions.push({
        ...permission,
        id: this.generateId('perm'),
        granted: false,
      });
    }
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // APPROVAL SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Request approval for an action
   */
  requestApproval(params: {
    requesterId: string;
    action: PermissionAction;
    resourceType: ResourceType;
    resourceId?: string;
    reason: string;
  }): string {
    const request: ApprovalRequest = {
      id: this.generateId('approval'),
      ...params,
      status: 'pending',
      created_at: new Date().toISOString(),
      approvers_required: this.determineApprovers(params.resourceType),
      approvals: [],
    };
    
    this.pendingApprovals.set(request.id, request);
    return request.id;
  }
  
  /**
   * Approve a pending request
   */
  approve(approvalId: string, approverId: string, notes?: string): boolean {
    const request = this.pendingApprovals.get(approvalId);
    if (!request || request.status !== 'pending') return false;
    
    request.approvals.push({
      approver_id: approverId,
      approved: true,
      timestamp: new Date().toISOString(),
      notes,
    });
    
    // Check if all required approvals received
    if (request.approvals.length >= request.approvers_required.length) {
      request.status = 'approved';
    }
    
    return true;
  }
  
  /**
   * Reject a pending request
   */
  reject(approvalId: string, rejecterId: string, reason: string): boolean {
    const request = this.pendingApprovals.get(approvalId);
    if (!request || request.status !== 'pending') return false;
    
    request.approvals.push({
      approver_id: rejecterId,
      approved: false,
      timestamp: new Date().toISOString(),
      notes: reason,
    });
    
    request.status = 'rejected';
    return true;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TREE LAWS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get all Tree Laws
   */
  getTreeLaws(): TreeLaw[] {
    return [...this.treeLaws];
  }
  
  /**
   * Check Tree Laws for an action
   */
  private checkTreeLaws(
    action: PermissionAction,
    resourceType: ResourceType,
    context?: unknown
  ): TreeLaw[] {
    return this.treeLaws.filter(law => {
      if (!law.applies_to.includes(resourceType)) return false;
      
      // Specific law checks
      switch (law.id) {
        case 'BRANCH_001': // Budget Enforcement
          if (context?.budget && context?.estimatedCost) {
            return context.estimatedCost > context.budget;
          }
          return false;
          
        case 'BRANCH_003': // Agent Hierarchy
          if (context?.agentLevel === 'L3' && resourceType === 'system') {
            return true;
          }
          return false;
          
        default:
          return false;
      }
    });
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════════════════════════
  
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  
  private isExplicitlyDenied(
    userPerms: UserPermissions,
    action: PermissionAction,
    resourceType: ResourceType,
    resourceId?: string
  ): boolean {
    return userPerms.denied_permissions.some(p => 
      p.action === action &&
      p.resource_type === resourceType &&
      (!resourceId || p.resource_id === '*' || p.resource_id === resourceId)
    );
  }
  
  private isExplicitlyAllowed(
    userPerms: UserPermissions,
    action: PermissionAction,
    resourceType: ResourceType,
    resourceId?: string
  ): boolean {
    return userPerms.explicit_permissions.some(p =>
      p.granted &&
      p.action === action &&
      p.resource_type === resourceType &&
      (!resourceId || p.resource_id === '*' || p.resource_id === resourceId)
    );
  }
  
  private checkRolePermission(role: Role, action: PermissionAction, resourceType: ResourceType): boolean {
    const roleDef = this.roleDefinitions.get(role);
    if (!roleDef) return false;
    
    const hasPermission = roleDef.permissions.some(p =>
      p.granted && p.action === action && p.resource_type === resourceType
    );
    
    if (hasPermission) return true;
    
    // Check inherited role
    if (roleDef.inherits_from) {
      return this.checkRolePermission(roleDef.inherits_from, action, resourceType);
    }
    
    return false;
  }
  
  private requiresApproval(
    action: PermissionAction,
    resourceType: ResourceType,
    context?: unknown
  ): { required: boolean; approvers: string[] } {
    // Delete always requires approval
    if (action === 'delete' && ['sphere', 'dataspace', 'thread'].includes(resourceType)) {
      return { required: true, approvers: ['owner', 'admin'] };
    }
    
    // High budget operations require approval
    if (context?.estimatedCost && context.estimatedCost > 1000) {
      return { required: true, approvers: ['budget_manager'] };
    }
    
    return { required: false, approvers: [] };
  }
  
  private determineApprovers(resourceType: ResourceType): string[] {
    switch (resourceType) {
      case 'system':
        return ['system_admin'];
      case 'budget':
        return ['budget_manager', 'owner'];
      default:
        return ['manager'];
    }
  }
  
  // Permission creation helpers
  private createFullPermissions(): Permission[] {
    const actions: PermissionAction[] = ['create', 'read', 'update', 'delete', 'execute', 'share', 'export', 'import', 'approve', 'delegate', 'audit'];
    const resources: ResourceType[] = ['sphere', 'bureau', 'dataspace', 'thread', 'agent', 'document', 'meeting', 'budget', 'system', 'api'];
    
    return actions.flatMap(action => 
      resources.map(resource => ({
        id: `perm_${action}_${resource}`,
        action,
        resource_type: resource,
        resource_id: '*',
        granted: true,
      }))
    );
  }
  
  private createAdminPermissions(): Permission[] {
    return this.createFullPermissions().filter(p => 
      p.resource_type !== 'system' || p.action === 'read'
    );
  }
  
  private createManagerPermissions(): Permission[] {
    const allowedActions: PermissionAction[] = ['create', 'read', 'update', 'share', 'export'];
    return this.createFullPermissions().filter(p => allowedActions.includes(p.action));
  }
  
  private createContributorPermissions(): Permission[] {
    const allowedActions: PermissionAction[] = ['create', 'read', 'update'];
    return this.createFullPermissions().filter(p => allowedActions.includes(p.action));
  }
  
  private createViewerPermissions(): Permission[] {
    return this.createFullPermissions().filter(p => p.action === 'read');
  }
  
  private createGuestPermissions(): Permission[] {
    return this.createFullPermissions().filter(p => 
      p.action === 'read' && ['document', 'dataspace'].includes(p.resource_type)
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADDITIONAL TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface ApprovalRequest {
  id: string;
  requesterId: string;
  action: PermissionAction;
  resourceType: ResourceType;
  resourceId?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  approvers_required: string[];
  approvals: Array<{
    approver_id: string;
    approved: boolean;
    timestamp: string;
    notes?: string;
  }>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { TREE_LAWS };
export default PermissionEngine;
