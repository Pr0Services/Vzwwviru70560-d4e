/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — DATASPACE ENGINE                                      ║
 * ║              Core Infrastructure Engine                                       ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "A DataSpace is a structured, intelligent, governed container that serves  ║
 * ║   as a self-contained micro-environment."                                   ║
 * ║  "Every entity in CHE·NU exists within a DataSpace."                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import {
  DataSpace,
  DataSpaceType,
  DataSpaceStatus,
  DataSpaceMetadata,
  DataSpacePermissions,
  DataSpaceRole,
  DataSpaceDocument,
  DataSpaceMedia,
  DataSpaceTask,
  DataSpaceDiagram,
  DataSpaceXRScene,
  DataSpaceAgentMemory,
  DataSpaceLifecycle,
  LifecyclePhase,
  DataSpaceHierarchy,
  TemporalLayer,
  DataSpaceChange,
  DataSpaceCreationRequest,
  DataSpaceQuery,
  DataSpaceQueryResult,
  DataSpaceTemplate,
  CreationMethod,
} from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

function computeHash(data: unknown): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_TEMPLATES: Record<DataSpaceType, DataSpaceTemplate> = {
  project: {
    id: 'tpl_project',
    name: 'Project DataSpace',
    description: 'Container for all project-related information',
    type: 'project',
    recommended_children: [
      { name: 'Planning', type: 'generic', description: 'Project planning documents' },
      { name: 'Resources', type: 'generic', description: 'Project resources and assets' },
      { name: 'Deliverables', type: 'generic', description: 'Project deliverables' },
    ],
    default_documents: [
      { name: 'Project Brief', template_content: '# Project Brief\n\n## Overview\n\n## Objectives\n\n## Timeline\n\n## Resources' },
    ],
    default_tasks: [
      { title: 'Define project scope', description: 'Document the project scope and objectives' },
      { title: 'Create timeline', description: 'Establish project milestones and deadlines' },
    ],
    auto_features: ['progress_tracking', 'milestone_notifications', 'dependency_visualization'],
  },
  meeting: {
    id: 'tpl_meeting',
    name: 'Meeting DataSpace',
    description: 'Complete meeting lifecycle management',
    type: 'meeting',
    recommended_children: [],
    default_documents: [
      { name: 'Agenda', template_content: '# Meeting Agenda\n\n## Topics\n\n1. \n2. \n3. \n\n## Notes\n\n## Action Items' },
    ],
    default_tasks: [],
    auto_features: ['pre_meeting_brief', 'real_time_transcription', 'post_meeting_summary', 'action_extraction'],
  },
  property_personal: {
    id: 'tpl_property_personal',
    name: 'Personal Property DataSpace',
    description: 'Personal property management',
    type: 'property_personal',
    recommended_children: [
      { name: 'Mortgage/Finance', type: 'generic', description: 'Financial documents' },
      { name: 'Insurance', type: 'generic', description: 'Insurance policies' },
      { name: 'Maintenance', type: 'generic', description: 'Maintenance records' },
      { name: 'Renovations', type: 'generic', description: 'Renovation projects' },
    ],
    default_documents: [
      { name: 'Property Details', template_content: '# Property Details\n\n## Address\n\n## Purchase Info\n\n## Features' },
    ],
    default_tasks: [],
    auto_features: ['payment_reminders', 'insurance_renewal_alerts', 'maintenance_scheduling', 'value_tracking'],
  },
  property_building: {
    id: 'tpl_property_building',
    name: 'Building DataSpace',
    description: 'Multi-unit property management for landlords',
    type: 'property_building',
    recommended_children: [
      { name: 'Tenant Management', type: 'generic', description: 'Tenant records' },
      { name: 'Maintenance', type: 'generic', description: 'Building maintenance' },
      { name: 'Finances', type: 'generic', description: 'Financial tracking' },
      { name: 'Compliance', type: 'generic', description: 'TAL and legal compliance' },
    ],
    default_documents: [
      { name: 'Building Profile', template_content: '# Building Profile\n\n## Address\n\n## Units\n\n## Systems' },
    ],
    default_tasks: [],
    auto_features: ['rent_collection_tracking', 'vacancy_alerts', 'lease_expiration', 'financial_reporting', 'tal_compliance'],
  },
  document: {
    id: 'tpl_document',
    name: 'Document DataSpace',
    description: 'Organized document collection',
    type: 'document',
    recommended_children: [],
    default_documents: [],
    default_tasks: [],
    auto_features: ['smart_categorization', 'duplicate_detection', 'cross_reference', 'compliance_checking'],
  },
  creative_asset: {
    id: 'tpl_creative',
    name: 'Creative Asset DataSpace',
    description: 'Creative project assets',
    type: 'creative_asset',
    recommended_children: [
      { name: 'Concepts', type: 'generic', description: 'Initial concepts' },
      { name: 'Assets', type: 'generic', description: 'Final assets' },
      { name: 'Revisions', type: 'generic', description: 'Revision history' },
    ],
    default_documents: [],
    default_tasks: [],
    auto_features: ['version_tracking', 'asset_tagging', 'format_conversion', 'xr_preview'],
  },
  construction_site: {
    id: 'tpl_construction',
    name: 'Construction Site DataSpace',
    description: 'Construction project management',
    type: 'construction_site',
    recommended_children: [
      { name: 'Planning', type: 'generic', description: 'Blueprints and permits' },
      { name: 'Estimation', type: 'generic', description: 'Cost estimates' },
      { name: 'Execution', type: 'generic', description: 'Daily logs and progress' },
      { name: 'Compliance', type: 'generic', description: 'RBQ and CNESST' },
      { name: 'Finance', type: 'generic', description: 'Invoices and payments' },
    ],
    default_documents: [],
    default_tasks: [
      { title: 'Obtain permits', description: 'Apply for necessary construction permits' },
      { title: 'Create timeline', description: 'Establish construction schedule' },
    ],
    auto_features: ['progress_tracking', 'material_tracking', 'compliance_alerts', 'photo_documentation'],
  },
  business_entity: {
    id: 'tpl_business',
    name: 'Business Entity DataSpace',
    description: 'Business/company management',
    type: 'business_entity',
    recommended_children: [
      { name: 'Operations', type: 'generic', description: 'Daily operations' },
      { name: 'Finance', type: 'generic', description: 'Financial management' },
      { name: 'HR', type: 'generic', description: 'Human resources' },
      { name: 'Compliance', type: 'generic', description: 'Legal compliance' },
    ],
    default_documents: [],
    default_tasks: [],
    auto_features: ['kpi_tracking', 'financial_reports', 'compliance_monitoring'],
  },
  workflow: {
    id: 'tpl_workflow',
    name: 'Workflow DataSpace',
    description: 'Automated process container',
    type: 'workflow',
    recommended_children: [],
    default_documents: [],
    default_tasks: [],
    auto_features: ['automation_triggers', 'step_tracking', 'notification_rules'],
  },
  archive: {
    id: 'tpl_archive',
    name: 'Archive DataSpace',
    description: 'Long-term storage',
    type: 'archive',
    recommended_children: [],
    default_documents: [],
    default_tasks: [],
    auto_features: ['compression', 'retention_policies', 'search_indexing'],
  },
  xr_space: {
    id: 'tpl_xr',
    name: 'XR Space DataSpace',
    description: 'Virtual/AR environment',
    type: 'xr_space',
    recommended_children: [],
    default_documents: [],
    default_tasks: [],
    auto_features: ['spatial_mapping', 'multi_user', 'object_interaction'],
  },
  generic: {
    id: 'tpl_generic',
    name: 'Generic DataSpace',
    description: 'Default container',
    type: 'generic',
    recommended_children: [],
    default_documents: [],
    default_tasks: [],
    auto_features: [],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATASPACE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class DataSpaceEngine {
  private dataspaces: Map<string, DataSpace> = new Map();
  private hierarchyIndex: Map<string, Set<string>> = new Map(); // sphere_id -> dataspace_ids
  private typeIndex: Map<DataSpaceType, Set<string>> = new Map();
  private subscribers: Map<string, Array<(ds: DataSpace) => void>> = new Map();
  
  constructor() {
    this.initializeIndices();
  }
  
  private initializeIndices(): void {
    const types: DataSpaceType[] = [
      'project', 'meeting', 'property_personal', 'property_building',
      'document', 'creative_asset', 'construction_site', 'business_entity',
      'workflow', 'archive', 'xr_space', 'generic'
    ];
    types.forEach(t => this.typeIndex.set(t, new Set()));
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CREATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Create a new DataSpace
   */
  async create(request: DataSpaceCreationRequest, userId: string): Promise<DataSpace> {
    const id = generateId('ds');
    const timestamp = now();
    
    // Auto-detect type if not provided
    const type = request.type || this.detectType(request);
    
    // Get template
    const template = DEFAULT_TEMPLATES[type];
    
    // Create hierarchy
    const hierarchy: DataSpaceHierarchy = {
      sphere_id: request.sphere_id,
      domain_id: request.domain_id || this.inferDomain(request.sphere_id, type),
      dataspace_id: id,
      sub_dataspace_id: request.parent_id ? id : undefined,
    };
    
    // Create permissions
    const permissions: DataSpacePermissions = {
      owner_id: userId,
      roles: new Map([[userId, 'owner']]),
      can_share: true,
      can_export: true,
      can_delete: true,
      agent_access: {
        can_read: true,
        can_write_limited: true,
      },
      elevation_requests: [],
    };
    
    // Create metadata
    const metadata: DataSpaceMetadata = {
      owner_id: userId,
      identity_id: userId,
      sphere_id: request.sphere_id,
      domain_id: hierarchy.domain_id,
      type,
      permissions,
      parent_id: request.parent_id,
      children_ids: [],
      linked_dataspaces: [],
      tags: [],
      custom_fields: {},
      status: 'active',
      created_at: timestamp,
      created_by: userId,
      updated_at: timestamp,
      updated_by: userId,
      version: 1,
    };
    
    // Create lifecycle
    const lifecycle: DataSpaceLifecycle = {
      dataspace_id: id,
      current_phase: 'creation',
      phase_history: [{
        phase: 'creation',
        entered_at: timestamp,
      }],
    };
    
    // Create agent memory
    const agentMemory: DataSpaceAgentMemory = {
      dataspace_id: id,
      rules: [],
      templates: [],
      knowledge: [],
      preferences: [],
    };
    
    // Create DataSpace
    const dataspace: DataSpace = {
      id,
      name: request.name,
      description: request.description,
      type,
      hierarchy,
      metadata,
      documents: [],
      media: [],
      tasks: [],
      diagrams: [],
      xr_scenes: [],
      thread_ids: [],
      children: [],
      temporal_layers: [],
      current_version: 1,
      agent_memory: agentMemory,
      lifecycle,
      stats: {
        total_documents: 0,
        total_media: 0,
        total_tasks: 0,
        total_threads: 0,
        storage_bytes: 0,
        last_activity: timestamp,
      },
    };
    
    // Apply template
    await this.applyTemplate(dataspace, template);
    
    // Process initial content
    if (request.initial_content) {
      await this.processInitialContent(dataspace, request.initial_content);
    }
    
    // Update lifecycle
    await this.advanceLifecycle(dataspace, 'content_ingestion');
    
    // Store
    this.dataspaces.set(id, dataspace);
    this.updateIndices(dataspace);
    
    // Update parent if exists
    if (request.parent_id) {
      const parent = this.dataspaces.get(request.parent_id);
      if (parent) {
        parent.children.push(dataspace);
        parent.metadata.children_ids.push(id);
      }
    }
    
    // Notify subscribers
    this.notifySubscribers(id, dataspace);
    
    return dataspace;
  }
  
  /**
   * Create from template
   */
  async createFromTemplate(
    templateId: string,
    name: string,
    sphereId: string,
    userId: string
  ): Promise<DataSpace> {
    const template = Object.values(DEFAULT_TEMPLATES).find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    
    return this.create({
      method: 'one_click',
      name,
      type: template.type,
      sphere_id: sphereId,
      domain_id: template.domain_id,
    }, userId);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // READ
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get DataSpace by ID
   */
  get(id: string): DataSpace | null {
    return this.dataspaces.get(id) || null;
  }
  
  /**
   * Query DataSpaces
   */
  query(query: DataSpaceQuery): DataSpaceQueryResult {
    let results = Array.from(this.dataspaces.values());
    
    // Apply filters
    if (query.sphere_id) {
      results = results.filter(ds => ds.hierarchy.sphere_id === query.sphere_id);
    }
    
    if (query.domain_id) {
      results = results.filter(ds => ds.hierarchy.domain_id === query.domain_id);
    }
    
    if (query.type) {
      results = results.filter(ds => ds.type === query.type);
    }
    
    if (query.status) {
      results = results.filter(ds => ds.metadata.status === query.status);
    }
    
    if (query.owner_id) {
      results = results.filter(ds => ds.metadata.owner_id === query.owner_id);
    }
    
    if (query.search_text) {
      const lower = query.search_text.toLowerCase();
      results = results.filter(ds => 
        ds.name.toLowerCase().includes(lower) ||
        ds.description?.toLowerCase().includes(lower)
      );
    }
    
    if (query.tags && query.tags.length > 0) {
      results = results.filter(ds => 
        query.tags!.some(t => ds.metadata.tags.includes(t))
      );
    }
    
    if (query.created_after) {
      const after = new Date(query.created_after).getTime();
      results = results.filter(ds => new Date(ds.metadata.created_at).getTime() >= after);
    }
    
    if (query.created_before) {
      const before = new Date(query.created_before).getTime();
      results = results.filter(ds => new Date(ds.metadata.created_at).getTime() <= before);
    }
    
    // Sort
    const sortBy = query.sort_by || 'updated_at';
    const sortOrder = query.sort_order || 'desc';
    
    results.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created_at':
          comparison = new Date(a.metadata.created_at).getTime() - new Date(b.metadata.created_at).getTime();
          break;
        case 'updated_at':
          comparison = new Date(a.metadata.updated_at).getTime() - new Date(b.metadata.updated_at).getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    const total = results.length;
    
    // Pagination
    const offset = query.offset || 0;
    const limit = query.limit || 50;
    results = results.slice(offset, offset + limit);
    
    // Include children if requested
    if (!query.include_children) {
      results = results.map(ds => ({ ...ds, children: [] }));
    }
    
    return {
      dataspaces: results,
      total_count: total,
      has_more: offset + results.length < total,
    };
  }
  
  /**
   * Get DataSpaces by sphere
   */
  getBySphere(sphereId: string): DataSpace[] {
    const ids = this.hierarchyIndex.get(sphereId);
    if (!ids) return [];
    
    return Array.from(ids)
      .map(id => this.dataspaces.get(id)!)
      .filter(Boolean);
  }
  
  /**
   * Get children of a DataSpace
   */
  getChildren(parentId: string): DataSpace[] {
    const parent = this.dataspaces.get(parentId);
    return parent?.children || [];
  }
  
  /**
   * Get DataSpace hierarchy path
   */
  getPath(id: string): DataSpace[] {
    const path: DataSpace[] = [];
    let current = this.dataspaces.get(id);
    
    while (current) {
      path.unshift(current);
      current = current.metadata.parent_id 
        ? this.dataspaces.get(current.metadata.parent_id) 
        : undefined;
    }
    
    return path;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // UPDATE
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Update DataSpace metadata
   */
  update(id: string, updates: Partial<Pick<DataSpace, 'name' | 'description' | 'icon' | 'color'>>, userId: string): DataSpace | null {
    const ds = this.dataspaces.get(id);
    if (!ds) return null;
    
    // Create temporal layer
    this.createTemporalLayer(ds, 'update', 'metadata', { before: { name: ds.name, description: ds.description }, after: updates }, userId);
    
    // Apply updates
    if (updates.name !== undefined) ds.name = updates.name;
    if (updates.description !== undefined) ds.description = updates.description;
    if (updates.icon !== undefined) ds.icon = updates.icon;
    if (updates.color !== undefined) ds.color = updates.color;
    
    ds.metadata.updated_at = now();
    ds.metadata.updated_by = userId;
    ds.metadata.version++;
    ds.current_version++;
    ds.stats.last_activity = now();
    
    this.notifySubscribers(id, ds);
    return ds;
  }
  
  /**
   * Add tags to DataSpace
   */
  addTags(id: string, tags: string[], userId: string): DataSpace | null {
    const ds = this.dataspaces.get(id);
    if (!ds) return null;
    
    const newTags = tags.filter(t => !ds.metadata.tags.includes(t));
    ds.metadata.tags.push(...newTags);
    ds.metadata.updated_at = now();
    ds.metadata.updated_by = userId;
    
    return ds;
  }
  
  /**
   * Link DataSpaces
   */
  link(sourceId: string, targetId: string): boolean {
    const source = this.dataspaces.get(sourceId);
    const target = this.dataspaces.get(targetId);
    
    if (!source || !target) return false;
    
    // Check same identity (Critical Rule: No Cross-Identity Access)
    if (source.metadata.identity_id !== target.metadata.identity_id) {
      logger.error('Cannot link DataSpaces across different identities');
      return false;
    }
    
    if (!source.metadata.linked_dataspaces.includes(targetId)) {
      source.metadata.linked_dataspaces.push(targetId);
    }
    if (!target.metadata.linked_dataspaces.includes(sourceId)) {
      target.metadata.linked_dataspaces.push(sourceId);
    }
    
    return true;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CONTENT MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Add document to DataSpace
   */
  addDocument(id: string, doc: Omit<DataSpaceDocument, 'id' | 'created_at' | 'version'>, userId: string): DataSpaceDocument | null {
    const ds = this.dataspaces.get(id);
    if (!ds) return null;
    
    const document: DataSpaceDocument = {
      ...doc,
      id: generateId('doc'),
      created_at: now(),
      version: 1,
    };
    
    ds.documents.push(document);
    ds.stats.total_documents++;
    ds.stats.storage_bytes += doc.size_bytes;
    ds.stats.last_activity = now();
    ds.metadata.updated_at = now();
    ds.metadata.updated_by = userId;
    
    this.createTemporalLayer(ds, 'create', 'document', { after: document }, userId);
    
    return document;
  }
  
  /**
   * Add media to DataSpace
   */
  addMedia(id: string, media: Omit<DataSpaceMedia, 'id' | 'created_at'>, userId: string): DataSpaceMedia | null {
    const ds = this.dataspaces.get(id);
    if (!ds) return null;
    
    const mediaItem: DataSpaceMedia = {
      ...media,
      id: generateId('media'),
      created_at: now(),
    };
    
    ds.media.push(mediaItem);
    ds.stats.total_media++;
    ds.stats.storage_bytes += media.size_bytes;
    ds.stats.last_activity = now();
    ds.metadata.updated_at = now();
    ds.metadata.updated_by = userId;
    
    return mediaItem;
  }
  
  /**
   * Add task to DataSpace
   */
  addTask(id: string, task: Omit<DataSpaceTask, 'id' | 'created_at' | 'status'>, userId: string): DataSpaceTask | null {
    const ds = this.dataspaces.get(id);
    if (!ds) return null;
    
    const newTask: DataSpaceTask = {
      ...task,
      id: generateId('task'),
      created_at: now(),
      status: 'pending',
    };
    
    ds.tasks.push(newTask);
    ds.stats.total_tasks++;
    ds.stats.last_activity = now();
    ds.metadata.updated_at = now();
    ds.metadata.updated_by = userId;
    
    return newTask;
  }
  
  /**
   * Update task status
   */
  updateTaskStatus(dataspaceId: string, taskId: string, status: DataSpaceTask['status'], userId: string): DataSpaceTask | null {
    const ds = this.dataspaces.get(dataspaceId);
    if (!ds) return null;
    
    const task = ds.tasks.find(t => t.id === taskId);
    if (!task) return null;
    
    task.status = status;
    if (status === 'completed') {
      task.completed_at = now();
    }
    
    ds.stats.last_activity = now();
    ds.metadata.updated_at = now();
    ds.metadata.updated_by = userId;
    
    return task;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Archive DataSpace
   */
  archive(id: string, userId: string): boolean {
    const ds = this.dataspaces.get(id);
    if (!ds) return false;
    
    ds.metadata.status = 'archived';
    ds.metadata.archived_at = now();
    ds.metadata.updated_at = now();
    ds.metadata.updated_by = userId;
    
    this.advanceLifecycle(ds, 'archiving');
    
    return true;
  }
  
  /**
   * Restore archived DataSpace
   */
  restore(id: string, userId: string): boolean {
    const ds = this.dataspaces.get(id);
    if (!ds || ds.metadata.status !== 'archived') return false;
    
    ds.metadata.status = 'active';
    ds.metadata.archived_at = undefined;
    ds.metadata.updated_at = now();
    ds.metadata.updated_by = userId;
    
    this.advanceLifecycle(ds, 'evolution');
    
    return true;
  }
  
  /**
   * Soft delete DataSpace
   */
  softDelete(id: string, userId: string): boolean {
    const ds = this.dataspaces.get(id);
    if (!ds) return false;
    
    ds.metadata.status = 'deleted';
    ds.metadata.updated_at = now();
    ds.metadata.updated_by = userId;
    
    this.advanceLifecycle(ds, 'deletion');
    
    return true;
  }
  
  /**
   * Hard delete DataSpace (permanent)
   */
  hardDelete(id: string): boolean {
    const ds = this.dataspaces.get(id);
    if (!ds) return false;
    
    // Remove from indices
    this.hierarchyIndex.get(ds.hierarchy.sphere_id)?.delete(id);
    this.typeIndex.get(ds.type)?.delete(id);
    
    // Remove from parent
    if (ds.metadata.parent_id) {
      const parent = this.dataspaces.get(ds.metadata.parent_id);
      if (parent) {
        parent.children = parent.children.filter(c => c.id !== id);
        parent.metadata.children_ids = parent.metadata.children_ids.filter(cid => cid !== id);
      }
    }
    
    // Remove linked references
    ds.metadata.linked_dataspaces.forEach(linkedId => {
      const linked = this.dataspaces.get(linkedId);
      if (linked) {
        linked.metadata.linked_dataspaces = linked.metadata.linked_dataspaces.filter(l => l !== id);
      }
    });
    
    // Delete
    this.dataspaces.delete(id);
    
    return true;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TEMPORAL LAYERS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get DataSpace at specific version
   */
  getAtVersion(id: string, version: number): DataSpace | null {
    const ds = this.dataspaces.get(id);
    if (!ds) return null;
    
    if (version >= ds.current_version) {
      return ds;
    }
    
    // Reconstruct from temporal layers
    // In production, this would replay changes backwards
    logger.warn('Version reconstruction not fully implemented');
    return ds;
  }
  
  /**
   * Get change history
   */
  getHistory(id: string): TemporalLayer[] {
    const ds = this.dataspaces.get(id);
    return ds?.temporal_layers || [];
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SUBSCRIPTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Subscribe to DataSpace changes
   */
  subscribe(id: string, callback: (ds: DataSpace) => void): () => void {
    if (!this.subscribers.has(id)) {
      this.subscribers.set(id, []);
    }
    this.subscribers.get(id)!.push(callback);
    
    return () => {
      const subs = this.subscribers.get(id);
      if (subs) {
        const index = subs.indexOf(callback);
        if (index !== -1) subs.splice(index, 1);
      }
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TEMPLATES
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get available templates
   */
  getTemplates(): DataSpaceTemplate[] {
    return Object.values(DEFAULT_TEMPLATES);
  }
  
  /**
   * Get template by type
   */
  getTemplateByType(type: DataSpaceType): DataSpaceTemplate {
    return DEFAULT_TEMPLATES[type];
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get engine statistics
   */
  getStats(): {
    total_dataspaces: number;
    by_type: Record<string, number>;
    by_sphere: Record<string, number>;
    by_status: Record<string, number>;
    total_storage_bytes: number;
  } {
    const byType: Record<string, number> = {};
    const bySphere: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    let totalStorage = 0;
    
    this.dataspaces.forEach(ds => {
      byType[ds.type] = (byType[ds.type] || 0) + 1;
      bySphere[ds.hierarchy.sphere_id] = (bySphere[ds.hierarchy.sphere_id] || 0) + 1;
      byStatus[ds.metadata.status] = (byStatus[ds.metadata.status] || 0) + 1;
      totalStorage += ds.stats.storage_bytes;
    });
    
    return {
      total_dataspaces: this.dataspaces.size,
      by_type: byType,
      by_sphere: bySphere,
      by_status: byStatus,
      total_storage_bytes: totalStorage,
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER METHODS
  // ═══════════════════════════════════════════════════════════════════════════
  
  private detectType(request: DataSpaceCreationRequest): DataSpaceType {
    const name = request.name.toLowerCase();
    const desc = (request.description || '').toLowerCase();
    const combined = `${name} ${desc}`;
    
    if (combined.includes('meeting') || combined.includes('réunion')) return 'meeting';
    if (combined.includes('project') || combined.includes('projet')) return 'project';
    if (combined.includes('property') || combined.includes('propriété')) return 'property_personal';
    if (combined.includes('building') || combined.includes('immeuble')) return 'property_building';
    if (combined.includes('construction') || combined.includes('chantier')) return 'construction_site';
    if (combined.includes('creative') || combined.includes('design')) return 'creative_asset';
    if (combined.includes('vr') || combined.includes('xr')) return 'xr_space';
    
    return 'generic';
  }
  
  private inferDomain(sphereId: string, type: DataSpaceType): string {
    const domainMap: Record<string, Record<DataSpaceType, string>> = {
      personal: {
        property_personal: 'maison',
        project: 'projets',
        meeting: 'reunions',
        generic: 'general',
      } as any,
      business: {
        property_building: 'immobilier',
        construction_site: 'construction',
        business_entity: 'entreprise',
        project: 'projets',
        meeting: 'reunions',
        generic: 'operations',
      } as any,
    };
    
    return domainMap[sphereId]?.[type] || 'general';
  }
  
  private async applyTemplate(ds: DataSpace, template: DataSpaceTemplate): Promise<void> {
    // Add default documents
    template.default_documents.forEach(doc => {
      ds.documents.push({
        id: generateId('doc'),
        name: doc.name,
        format: 'md',
        size_bytes: doc.template_content.length,
        version: 1,
        content_hash: computeHash(doc.template_content),
        created_at: now(),
        updated_at: now(),
        created_by: ds.metadata.owner_id,
        tags: [],
      });
    });
    
    // Add default tasks
    template.default_tasks.forEach(task => {
      ds.tasks.push({
        id: generateId('task'),
        title: task.title,
        description: task.description,
        status: 'pending',
        priority: 'normal',
        subtasks: [],
        dependencies: [],
        domain_tags: [],
        created_at: now(),
      });
    });
    
    // Create recommended children structure (as metadata, not actual DataSpaces)
    ds.metadata.custom_fields.recommended_children = template.recommended_children;
    ds.metadata.custom_fields.auto_features = template.auto_features;
  }
  
  private async processInitialContent(ds: DataSpace, content: string): Promise<void> {
    // Simple content processing - in production would use AI
    if (content.length > 0) {
      ds.documents.push({
        id: generateId('doc'),
        name: 'Initial Content',
        format: 'txt',
        size_bytes: content.length,
        version: 1,
        content_hash: computeHash(content),
        created_at: now(),
        updated_at: now(),
        created_by: ds.metadata.owner_id,
        tags: ['imported'],
        extracted_text: content,
      });
      ds.stats.total_documents++;
    }
  }
  
  private async advanceLifecycle(ds: DataSpace, phase: LifecyclePhase): Promise<void> {
    // Close current phase
    const currentPhaseEntry = ds.lifecycle.phase_history.find(
      p => p.phase === ds.lifecycle.current_phase && !p.exited_at
    );
    if (currentPhaseEntry) {
      currentPhaseEntry.exited_at = now();
    }
    
    // Enter new phase
    ds.lifecycle.current_phase = phase;
    ds.lifecycle.phase_history.push({
      phase,
      entered_at: now(),
    });
  }
  
  private createTemporalLayer(
    ds: DataSpace,
    changeType: DataSpaceChange['type'],
    entityType: DataSpaceChange['entity_type'],
    data: { before?: unknown; after?: unknown },
    userId: string
  ): void {
    const layer: TemporalLayer = {
      id: generateId('layer'),
      dataspace_id: ds.id,
      version: ds.current_version + 1,
      timestamp: now(),
      changes: [{
        type: changeType,
        entity_type: entityType,
        entity_id: ds.id,
        before: data.before,
        after: data.after,
        timestamp: now(),
      }],
      snapshot_hash: computeHash(ds),
      created_by: userId,
    };
    
    ds.temporal_layers.push(layer);
  }
  
  private updateIndices(ds: DataSpace): void {
    // Update hierarchy index
    if (!this.hierarchyIndex.has(ds.hierarchy.sphere_id)) {
      this.hierarchyIndex.set(ds.hierarchy.sphere_id, new Set());
    }
    this.hierarchyIndex.get(ds.hierarchy.sphere_id)!.add(ds.id);
    
    // Update type index
    this.typeIndex.get(ds.type)?.add(ds.id);
  }
  
  private notifySubscribers(id: string, ds: DataSpace): void {
    const subs = this.subscribers.get(id);
    if (subs) {
      subs.forEach(cb => cb(ds));
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default DataSpaceEngine;
