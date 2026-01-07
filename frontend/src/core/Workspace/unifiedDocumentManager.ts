/**
 * CHE·NU™ — UNIFIED DOCUMENT MANAGER
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Gestionnaire unifié de documents avec gouvernance et versioning
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * FEATURES:
 * - Unified file system across spheres
 * - Version control (Git-like)
 * - Smart folders with AI organization
 * - Cross-document linking
 * - Token-governed access
 * - Real-time collaboration
 * - Automatic backups
 * - AI-powered search
 */

import { enhancedPhotoEditor } from './enhancedPhotoEditor';
import { enhancedPDFEditor } from './enhancedPDFEditor';
import { enhancedSpreadsheetEditor } from './enhancedSpreadsheetEditor';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type DocumentType = 
  | 'photo'
  | 'pdf'
  | 'spreadsheet'
  | 'document'      // Word-like
  | 'presentation'
  | 'drawing'
  | 'audio'
  | 'video'
  | 'archive'
  | 'code'
  | 'data'
  | 'other';

export type DocumentStatus = 
  | 'draft'
  | 'in-review'
  | 'approved'
  | 'published'
  | 'archived'
  | 'deleted';

export interface Document {
  id: string;
  
  // Identity
  name: string;
  type: DocumentType;
  mimeType: string;
  extension: string;
  
  // Location
  sphereId: string;
  folderId: string;
  path: string;
  
  // Content
  size: number;
  thumbnail?: string;
  preview?: string;
  
  // Versioning
  version: number;
  versionHistory: DocumentVersion[];
  
  // Status
  status: DocumentStatus;
  locked: boolean;
  lockedBy?: string;
  lockedAt?: Date;
  
  // Collaboration
  owner: string;
  collaborators: Collaborator[];
  sharedWith: ShareLink[];
  
  // AI Metadata
  aiTags: string[];
  aiSummary?: string;
  aiCategory?: string;
  
  // Links
  linkedDocuments: string[];
  linkedThreads: string[];
  linkedTransactions: string[];
  
  // Governance
  governance: DocumentGovernance;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  accessedAt: Date;
}

export interface DocumentVersion {
  version: number;
  createdAt: Date;
  createdBy: string;
  size: number;
  comment?: string;
  checksum: string;
  restorable: boolean;
}

export interface Collaborator {
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'commenter' | 'viewer';
  addedAt: Date;
  lastAccess?: Date;
}

export interface ShareLink {
  id: string;
  url: string;
  permission: 'view' | 'comment' | 'edit';
  password?: boolean;
  expiresAt?: Date;
  accessCount: number;
  maxAccess?: number;
  createdAt: Date;
}

export interface DocumentGovernance {
  // Access control
  accessLevel: 'private' | 'sphere' | 'organization' | 'public';
  
  // Retention
  retentionPolicy?: {
    deleteAfterDays?: number;
    archiveAfterDays?: number;
    requireApprovalForDelete: boolean;
  };
  
  // Compliance
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
  complianceTags: string[];
  
  // Audit
  auditEnabled: boolean;
  auditLog: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'share' | 'download' | 'restore';
  userId: string;
  userName: string;
  timestamp: Date;
  details?: string;
  ipAddress?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// FOLDER TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Folder {
  id: string;
  name: string;
  
  // Location
  sphereId: string;
  parentId: string | null;
  path: string;
  
  // Contents
  documentIds: string[];
  subfolderIds: string[];
  
  // Smart folder
  isSmartFolder: boolean;
  smartCriteria?: SmartFolderCriteria;
  
  // Display
  color?: string;
  icon?: string;
  pinned: boolean;
  
  // Governance
  inheritedPermissions: boolean;
  permissions?: FolderPermissions;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface SmartFolderCriteria {
  type?: DocumentType[];
  status?: DocumentStatus[];
  dateRange?: { from?: Date; to?: Date };
  tags?: string[];
  owner?: string[];
  searchQuery?: string;
  minSize?: number;
  maxSize?: number;
}

export interface FolderPermissions {
  canView: string[];
  canEdit: string[];
  canDelete: string[];
  canShare: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// SEARCH TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SearchQuery {
  text?: string;
  type?: DocumentType[];
  sphereId?: string[];
  folderId?: string[];
  status?: DocumentStatus[];
  tags?: string[];
  owner?: string[];
  dateRange?: { from?: Date; to?: Date };
  sizeRange?: { min?: number; max?: number };
  hasLinks?: boolean;
  sortBy?: 'relevance' | 'name' | 'date' | 'size' | 'type';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  documents: Document[];
  total: number;
  facets: {
    types: Array<{ type: DocumentType; count: number }>;
    spheres: Array<{ sphereId: string; count: number }>;
    tags: Array<{ tag: string; count: number }>;
  };
  suggestions?: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// TEMPLATE TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface DocumentTemplate {
  id: string;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  
  type: DocumentType;
  category: string;
  
  // Content
  content: unknown;
  thumbnail: string;
  
  // Domain
  domain?: 'construction' | 'immobilier' | 'finance' | 'legal' | 'general';
  
  // Usage
  usageCount: number;
  rating: number;
  
  // Metadata
  createdBy: string;
  isBuiltIn: boolean;
  createdAt: Date;
}

export const DOCUMENT_TEMPLATES: Omit<DocumentTemplate, 'content' | 'thumbnail'>[] = [
  // Construction
  { id: 'tpl-soumission', name: 'Construction Estimate', nameFr: 'Soumission de construction', description: 'Detailed construction estimate template', descriptionFr: 'Modèle de soumission détaillée', type: 'spreadsheet', category: 'estimates', domain: 'construction', usageCount: 0, rating: 4.8, createdBy: 'system', isBuiltIn: true, createdAt: new Date() },
  { id: 'tpl-progress-billing', name: 'Progress Billing', nameFr: 'Facturation progressive', description: 'Progress billing template with holdback', descriptionFr: 'Facturation progressive avec retenue', type: 'spreadsheet', category: 'billing', domain: 'construction', usageCount: 0, rating: 4.7, createdBy: 'system', isBuiltIn: true, createdAt: new Date() },
  { id: 'tpl-change-order', name: 'Change Order', nameFr: 'Ordre de changement', description: 'Construction change order form', descriptionFr: 'Formulaire d\'ordre de changement', type: 'pdf', category: 'forms', domain: 'construction', usageCount: 0, rating: 4.6, createdBy: 'system', isBuiltIn: true, createdAt: new Date() },
  { id: 'tpl-rfi', name: 'RFI Form', nameFr: 'Demande d\'information', description: 'Request for Information form', descriptionFr: 'Formulaire de demande d\'information', type: 'pdf', category: 'forms', domain: 'construction', usageCount: 0, rating: 4.5, createdBy: 'system', isBuiltIn: true, createdAt: new Date() },
  
  // Immobilier
  { id: 'tpl-property-analysis', name: 'Property Analysis', nameFr: 'Analyse de propriété', description: 'Complete property investment analysis', descriptionFr: 'Analyse complète d\'investissement immobilier', type: 'spreadsheet', category: 'analysis', domain: 'immobilier', usageCount: 0, rating: 4.9, createdBy: 'system', isBuiltIn: true, createdAt: new Date() },
  { id: 'tpl-rental-comparison', name: 'Rental Comparison', nameFr: 'Comparaison de loyers', description: 'Market rental comparison sheet', descriptionFr: 'Comparaison des loyers du marché', type: 'spreadsheet', category: 'analysis', domain: 'immobilier', usageCount: 0, rating: 4.7, createdBy: 'system', isBuiltIn: true, createdAt: new Date() },
  { id: 'tpl-lease-agreement', name: 'Lease Agreement', nameFr: 'Bail de location', description: 'Standard lease agreement template', descriptionFr: 'Modèle de bail standard', type: 'pdf', category: 'contracts', domain: 'immobilier', usageCount: 0, rating: 4.8, createdBy: 'system', isBuiltIn: true, createdAt: new Date() },
  { id: 'tpl-property-photos', name: 'Property Photo Set', nameFr: 'Photos de propriété', description: 'Optimized property listing photos', descriptionFr: 'Photos optimisées pour annonce', type: 'photo', category: 'media', domain: 'immobilier', usageCount: 0, rating: 4.6, createdBy: 'system', isBuiltIn: true, createdAt: new Date() },
  
  // Finance
  { id: 'tpl-budget', name: 'Annual Budget', nameFr: 'Budget annuel', description: 'Complete annual budget template', descriptionFr: 'Modèle de budget annuel complet', type: 'spreadsheet', category: 'budgets', domain: 'finance', usageCount: 0, rating: 4.8, createdBy: 'system', isBuiltIn: true, createdAt: new Date() },
  { id: 'tpl-cashflow', name: 'Cash Flow Projection', nameFr: 'Projection de trésorerie', description: '12-month cash flow projection', descriptionFr: 'Projection de trésorerie 12 mois', type: 'spreadsheet', category: 'projections', domain: 'finance', usageCount: 0, rating: 4.7, createdBy: 'system', isBuiltIn: true, createdAt: new Date() },
  { id: 'tpl-invoice', name: 'Professional Invoice', nameFr: 'Facture professionnelle', description: 'Professional invoice template', descriptionFr: 'Modèle de facture professionnelle', type: 'pdf', category: 'billing', domain: 'finance', usageCount: 0, rating: 4.9, createdBy: 'system', isBuiltIn: true, createdAt: new Date() },
  
  // General
  { id: 'tpl-meeting-notes', name: 'Meeting Notes', nameFr: 'Notes de réunion', description: 'Structured meeting notes template', descriptionFr: 'Modèle de notes de réunion', type: 'document', category: 'meetings', domain: 'general', usageCount: 0, rating: 4.5, createdBy: 'system', isBuiltIn: true, createdAt: new Date() },
  { id: 'tpl-project-plan', name: 'Project Plan', nameFr: 'Plan de projet', description: 'Project planning template', descriptionFr: 'Modèle de planification de projet', type: 'spreadsheet', category: 'planning', domain: 'general', usageCount: 0, rating: 4.6, createdBy: 'system', isBuiltIn: true, createdAt: new Date() }
];

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED DOCUMENT MANAGER
// ═══════════════════════════════════════════════════════════════════════════

export class UnifiedDocumentManager {
  private documents: Map<string, Document> = new Map();
  private folders: Map<string, Folder> = new Map();
  private templates: Map<string, DocumentTemplate> = new Map();
  
  constructor() {
    logger.debug('📁 Unified Document Manager initialized');
    this.initializeTemplates();
    this.initializeRootFolders();
  }
  
  private initializeTemplates(): void {
    for (const tpl of DOCUMENT_TEMPLATES) {
      this.templates.set(tpl.id, {
        ...tpl,
        content: {},
        thumbnail: ''
      });
    }
    logger.debug(`   Templates loaded: ${this.templates.size}`);
  }
  
  private initializeRootFolders(): void {
    // Create root folders for each sphere
    const spheres = [
      { id: 'personal', name: 'Personal', nameFr: 'Personnel' },
      { id: 'business', name: 'Business', nameFr: 'Affaires' },
      { id: 'government', name: 'Government', nameFr: 'Gouvernement' },
      { id: 'design_studio', name: 'Studio', nameFr: 'Studio' },
      { id: 'community', name: 'Community', nameFr: 'Communauté' },
      { id: 'social', name: 'Social', nameFr: 'Social' },
      { id: 'entertainment', name: 'Entertainment', nameFr: 'Divertissement' },
      { id: 'my_team', name: 'My Team', nameFr: 'Mon Équipe' }
    ];
    
    for (const sphere of spheres) {
      const rootFolder: Folder = {
        id: `root-${sphere.id}`,
        name: sphere.name,
        sphereId: sphere.id,
        parentId: null,
        path: `/${sphere.id}`,
        documentIds: [],
        subfolderIds: [],
        isSmartFolder: false,
        pinned: false,
        inheritedPermissions: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.folders.set(rootFolder.id, rootFolder);
    }
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // DOCUMENT OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Créer un nouveau document
   */
  async createDocument(config: {
    name: string;
    type: DocumentType;
    sphereId: string;
    folderId: string;
    content?: unknown;
    templateId?: string;
    owner: string;
  }): Promise<Document> {
    // Get template if specified
    let content = config.content;
    if (config.templateId) {
      const template = this.templates.get(config.templateId);
      if (template) {
        content = template.content;
      }
    }
    
    const extension = this.getExtensionForType(config.type);
    const mimeType = this.getMimeTypeForType(config.type);
    
    const doc: Document = {
      id: `doc-${Date.now()}`,
      name: config.name,
      type: config.type,
      mimeType,
      extension,
      sphereId: config.sphereId,
      folderId: config.folderId,
      path: `${this.getFolderPath(config.folderId)}/${config.name}.${extension}`,
      size: 0,
      version: 1,
      versionHistory: [{
        version: 1,
        createdAt: new Date(),
        createdBy: config.owner,
        size: 0,
        comment: 'Initial version',
        checksum: this.generateChecksum(),
        restorable: true
      }],
      status: 'draft',
      locked: false,
      owner: config.owner,
      collaborators: [{
        userId: config.owner,
        name: 'Owner',
        email: '',
        role: 'owner',
        addedAt: new Date()
      }],
      sharedWith: [],
      aiTags: [],
      linkedDocuments: [],
      linkedThreads: [],
      linkedTransactions: [],
      governance: {
        accessLevel: 'private',
        classification: 'internal',
        complianceTags: [],
        auditEnabled: true,
        auditLog: [{
          id: `audit-${Date.now()}`,
          action: 'create',
          userId: config.owner,
          userName: 'Owner',
          timestamp: new Date()
        }]
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      accessedAt: new Date()
    };
    
    this.documents.set(doc.id, doc);
    
    // Add to folder
    const folder = this.folders.get(config.folderId);
    if (folder) {
      folder.documentIds.push(doc.id);
      folder.updatedAt = new Date();
    }
    
    // AI tagging
    await this.aiTagDocument(doc.id);
    
    return doc;
  }
  
  /**
   * Mettre à jour un document
   */
  async updateDocument(
    documentId: string,
    updates: Partial<Pick<Document, 'name' | 'status' | 'aiTags'>>,
    userId: string,
    comment?: string
  ): Promise<Document | null> {
    const doc = this.documents.get(documentId);
    if (!doc) return null;
    
    // Check lock
    if (doc.locked && doc.lockedBy !== userId) {
      throw new Error('Document is locked by another user');
    }
    
    // Apply updates
    Object.assign(doc, updates);
    
    // Create new version
    doc.version++;
    doc.versionHistory.push({
      version: doc.version,
      createdAt: new Date(),
      createdBy: userId,
      size: doc.size,
      comment,
      checksum: this.generateChecksum(),
      restorable: true
    });
    
    // Keep only last 50 versions
    if (doc.versionHistory.length > 50) {
      doc.versionHistory = doc.versionHistory.slice(-50);
    }
    
    doc.updatedAt = new Date();
    
    // Audit
    this.addAuditEntry(doc, 'update', userId, 'Updated document');
    
    return doc;
  }
  
  /**
   * Supprimer un document (soft delete)
   */
  deleteDocument(documentId: string, userId: string): boolean {
    const doc = this.documents.get(documentId);
    if (!doc) return false;
    
    // Check governance
    if (doc.governance.retentionPolicy?.requireApprovalForDelete) {
      doc.status = 'in-review';
      this.addAuditEntry(doc, 'delete', userId, 'Deletion requested - pending approval');
      return true;
    }
    
    doc.status = 'deleted';
    doc.updatedAt = new Date();
    this.addAuditEntry(doc, 'delete', userId, 'Moved to trash');
    
    // Remove from folder
    const folder = this.folders.get(doc.folderId);
    if (folder) {
      folder.documentIds = folder.documentIds.filter(id => id !== documentId);
    }
    
    return true;
  }
  
  /**
   * Restaurer une version précédente
   */
  async restoreVersion(documentId: string, version: number, userId: string): Promise<boolean> {
    const doc = this.documents.get(documentId);
    if (!doc) return false;
    
    const targetVersion = doc.versionHistory.find(v => v.version === version);
    if (!targetVersion || !targetVersion.restorable) return false;
    
    // Create new version from old
    doc.version++;
    doc.versionHistory.push({
      version: doc.version,
      createdAt: new Date(),
      createdBy: userId,
      size: targetVersion.size,
      comment: `Restored from version ${version}`,
      checksum: targetVersion.checksum,
      restorable: true
    });
    
    doc.updatedAt = new Date();
    this.addAuditEntry(doc, 'restore', userId, `Restored from version ${version}`);
    
    return true;
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // FOLDER OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Créer un dossier
   */
  createFolder(config: {
    name: string;
    sphereId: string;
    parentId: string;
    color?: string;
    icon?: string;
  }): Folder {
    const parentFolder = this.folders.get(config.parentId);
    const parentPath = parentFolder ? parentFolder.path : `/${config.sphereId}`;
    
    const folder: Folder = {
      id: `folder-${Date.now()}`,
      name: config.name,
      sphereId: config.sphereId,
      parentId: config.parentId,
      path: `${parentPath}/${config.name}`,
      documentIds: [],
      subfolderIds: [],
      isSmartFolder: false,
      color: config.color,
      icon: config.icon,
      pinned: false,
      inheritedPermissions: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.folders.set(folder.id, folder);
    
    // Add to parent
    if (parentFolder) {
      parentFolder.subfolderIds.push(folder.id);
      parentFolder.updatedAt = new Date();
    }
    
    return folder;
  }
  
  /**
   * Créer un Smart Folder
   */
  createSmartFolder(config: {
    name: string;
    sphereId: string;
    parentId: string;
    criteria: SmartFolderCriteria;
  }): Folder {
    const folder = this.createFolder({
      name: config.name,
      sphereId: config.sphereId,
      parentId: config.parentId,
      icon: '🔍'
    });
    
    folder.isSmartFolder = true;
    folder.smartCriteria = config.criteria;
    
    // Populate with matching documents
    this.refreshSmartFolder(folder.id);
    
    return folder;
  }
  
  /**
   * Rafraîchir un Smart Folder
   */
  refreshSmartFolder(folderId: string): void {
    const folder = this.folders.get(folderId);
    if (!folder || !folder.isSmartFolder || !folder.smartCriteria) return;
    
    const criteria = folder.smartCriteria;
    const matches = this.searchDocuments({
      type: criteria.type,
      status: criteria.status,
      dateRange: criteria.dateRange,
      tags: criteria.tags,
      owner: criteria.owner,
      text: criteria.searchQuery
    });
    
    folder.documentIds = matches.documents.map(d => d.id);
    folder.updatedAt = new Date();
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // SEARCH
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Recherche avancée
   */
  searchDocuments(query: SearchQuery): SearchResult {
    let results = Array.from(this.documents.values());
    
    // Filter by text (name and AI tags)
    if (query.text) {
      const searchText = query.text.toLowerCase();
      results = results.filter(d => 
        d.name.toLowerCase().includes(searchText) ||
        d.aiTags.some(t => t.toLowerCase().includes(searchText)) ||
        d.aiSummary?.toLowerCase().includes(searchText)
      );
    }
    
    // Filter by type
    if (query.type?.length) {
      results = results.filter(d => query.type!.includes(d.type));
    }
    
    // Filter by sphere
    if (query.sphereId?.length) {
      results = results.filter(d => query.sphereId!.includes(d.sphereId));
    }
    
    // Filter by folder
    if (query.folderId?.length) {
      results = results.filter(d => query.folderId!.includes(d.folderId));
    }
    
    // Filter by status
    if (query.status?.length) {
      results = results.filter(d => query.status!.includes(d.status));
    }
    
    // Filter by tags
    if (query.tags?.length) {
      results = results.filter(d => 
        query.tags!.some(t => d.aiTags.includes(t))
      );
    }
    
    // Filter by owner
    if (query.owner?.length) {
      results = results.filter(d => query.owner!.includes(d.owner));
    }
    
    // Filter by date
    if (query.dateRange) {
      if (query.dateRange.from) {
        results = results.filter(d => d.updatedAt >= query.dateRange!.from!);
      }
      if (query.dateRange.to) {
        results = results.filter(d => d.updatedAt <= query.dateRange!.to!);
      }
    }
    
    // Filter by size
    if (query.sizeRange) {
      if (query.sizeRange.min !== undefined) {
        results = results.filter(d => d.size >= query.sizeRange!.min!);
      }
      if (query.sizeRange.max !== undefined) {
        results = results.filter(d => d.size <= query.sizeRange!.max!);
      }
    }
    
    // Filter by links
    if (query.hasLinks) {
      results = results.filter(d => 
        d.linkedDocuments.length > 0 || 
        d.linkedThreads.length > 0 ||
        d.linkedTransactions.length > 0
      );
    }
    
    const total = results.length;
    
    // Sort
    const sortBy = query.sortBy || 'date';
    const sortOrder = query.sortOrder || 'desc';
    results.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    // Paginate
    if (query.offset) {
      results = results.slice(query.offset);
    }
    if (query.limit) {
      results = results.slice(0, query.limit);
    }
    
    // Calculate facets
    const allResults = Array.from(this.documents.values());
    const facets = {
      types: this.calculateFacet(allResults, 'type'),
      spheres: this.calculateFacet(allResults, 'sphereId'),
      tags: this.calculateTagFacet(allResults)
    };
    
    return { documents: results, total, facets };
  }
  
  /**
   * AI Search (semantic)
   */
  async aiSearch(naturalQuery: string): Promise<SearchResult> {
    // Parse natural language query
    await this.simulateProcessing(200);
    
    // Extract entities from query
    const query: SearchQuery = {};
    
    const lowerQuery = naturalQuery.toLowerCase();
    
    // Detect type
    if (lowerQuery.includes('photo') || lowerQuery.includes('image')) {
      query.type = ['photo'];
    } else if (lowerQuery.includes('pdf') || lowerQuery.includes('document')) {
      query.type = ['pdf', 'document'];
    } else if (lowerQuery.includes('excel') || lowerQuery.includes('spreadsheet') || lowerQuery.includes('budget')) {
      query.type = ['spreadsheet'];
    }
    
    // Detect time
    if (lowerQuery.includes('today') || lowerQuery.includes('aujourd\'hui')) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      query.dateRange = { from: today };
    } else if (lowerQuery.includes('this week') || lowerQuery.includes('cette semaine')) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query.dateRange = { from: weekAgo };
    } else if (lowerQuery.includes('this month') || lowerQuery.includes('ce mois')) {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query.dateRange = { from: monthAgo };
    }
    
    // Use remaining as text search
    query.text = naturalQuery;
    
    const result = this.searchDocuments(query);
    
    // Add AI suggestions
    result.suggestions = [
      'Try filtering by sphere',
      'Add date range for better results',
      'Use specific document type'
    ];
    
    return result;
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // SHARING & COLLABORATION
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Partager un document
   */
  shareDocument(
    documentId: string,
    userId: string,
    config: {
      permission: 'view' | 'comment' | 'edit';
      password?: string;
      expiresAt?: Date;
      maxAccess?: number;
    }
  ): ShareLink | null {
    const doc = this.documents.get(documentId);
    if (!doc) return null;
    
    const shareLink: ShareLink = {
      id: `share-${Date.now()}`,
      url: `https://chenu.app/d/${doc.id}/${this.generateShareToken()}`,
      permission: config.permission,
      password: config.password ? true : false,
      expiresAt: config.expiresAt,
      accessCount: 0,
      maxAccess: config.maxAccess,
      createdAt: new Date()
    };
    
    doc.sharedWith.push(shareLink);
    this.addAuditEntry(doc, 'share', userId, `Created share link with ${config.permission} permission`);
    
    return shareLink;
  }
  
  /**
   * Ajouter un collaborateur
   */
  addCollaborator(
    documentId: string,
    userId: string,
    collaborator: Omit<Collaborator, 'addedAt'>
  ): boolean {
    const doc = this.documents.get(documentId);
    if (!doc) return false;
    
    // Check if already collaborator
    if (doc.collaborators.some(c => c.userId === collaborator.userId)) {
      return false;
    }
    
    doc.collaborators.push({
      ...collaborator,
      addedAt: new Date()
    });
    
    this.addAuditEntry(doc, 'share', userId, `Added collaborator: ${collaborator.email}`);
    
    return true;
  }
  
  /**
   * Verrouiller un document
   */
  lockDocument(documentId: string, userId: string): boolean {
    const doc = this.documents.get(documentId);
    if (!doc || doc.locked) return false;
    
    doc.locked = true;
    doc.lockedBy = userId;
    doc.lockedAt = new Date();
    
    return true;
  }
  
  /**
   * Déverrouiller un document
   */
  unlockDocument(documentId: string, userId: string): boolean {
    const doc = this.documents.get(documentId);
    if (!doc || !doc.locked) return false;
    
    // Only locker or owner can unlock
    if (doc.lockedBy !== userId && doc.owner !== userId) {
      return false;
    }
    
    doc.locked = false;
    doc.lockedBy = undefined;
    doc.lockedAt = undefined;
    
    return true;
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // LINKING
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Lier à un thread
   */
  linkToThread(documentId: string, threadId: string): boolean {
    const doc = this.documents.get(documentId);
    if (!doc) return false;
    
    if (!doc.linkedThreads.includes(threadId)) {
      doc.linkedThreads.push(threadId);
      doc.updatedAt = new Date();
    }
    
    return true;
  }
  
  /**
   * Lier à une transaction
   */
  linkToTransaction(documentId: string, transactionId: string): boolean {
    const doc = this.documents.get(documentId);
    if (!doc) return false;
    
    if (!doc.linkedTransactions.includes(transactionId)) {
      doc.linkedTransactions.push(transactionId);
      doc.updatedAt = new Date();
    }
    
    return true;
  }
  
  /**
   * Lier à un autre document
   */
  linkDocuments(documentId1: string, documentId2: string): boolean {
    const doc1 = this.documents.get(documentId1);
    const doc2 = this.documents.get(documentId2);
    if (!doc1 || !doc2) return false;
    
    if (!doc1.linkedDocuments.includes(documentId2)) {
      doc1.linkedDocuments.push(documentId2);
    }
    if (!doc2.linkedDocuments.includes(documentId1)) {
      doc2.linkedDocuments.push(documentId1);
    }
    
    doc1.updatedAt = new Date();
    doc2.updatedAt = new Date();
    
    return true;
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // AI FEATURES
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * AI Tag Document
   */
  async aiTagDocument(documentId: string): Promise<string[]> {
    const doc = this.documents.get(documentId);
    if (!doc) return [];
    
    await this.simulateProcessing(200);
    
    // Generate tags based on document type and name
    const tags: string[] = [];
    
    // Type-based tags
    tags.push(doc.type);
    
    // Name analysis
    const nameLower = doc.name.toLowerCase();
    if (nameLower.includes('invoice') || nameLower.includes('facture')) tags.push('invoice', 'billing');
    if (nameLower.includes('contract') || nameLower.includes('contrat')) tags.push('contract', 'legal');
    if (nameLower.includes('report') || nameLower.includes('rapport')) tags.push('report');
    if (nameLower.includes('budget')) tags.push('budget', 'finance');
    if (nameLower.includes('estimate') || nameLower.includes('soumission')) tags.push('estimate', 'construction');
    if (nameLower.includes('photo') || nameLower.includes('image')) tags.push('media');
    
    doc.aiTags = [...new Set(tags)];
    
    return doc.aiTags;
  }
  
  /**
   * AI Summarize Document
   */
  async aiSummarizeDocument(documentId: string): Promise<string> {
    const doc = this.documents.get(documentId);
    if (!doc) return '';
    
    await this.simulateProcessing(300);
    
    // Generate summary based on metadata
    const summary = `${doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} document "${doc.name}" ` +
      `created ${this.formatDate(doc.createdAt)}. ` +
      `Version ${doc.version}, ${doc.status} status. ` +
      (doc.aiTags.length > 0 ? `Tags: ${doc.aiTags.join(', ')}.` : '');
    
    doc.aiSummary = summary;
    
    return summary;
  }
  
  /**
   * AI Suggest Organization
   */
  async aiSuggestOrganization(sphereId: string): Promise<{
    suggestedFolders: string[];
    documentMoves: Array<{ documentId: string; suggestedFolder: string; reason: string }>;
  }> {
    await this.simulateProcessing(400);
    
    const docs = Array.from(this.documents.values())
      .filter(d => d.sphereId === sphereId);
    
    // Analyze tags and suggest folders
    const tagCounts = new Map<string, number>();
    for (const doc of docs) {
      for (const tag of doc.aiTags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }
    
    // Suggest folders for common tags
    const suggestedFolders = Array.from(tagCounts.entries())
      .filter(([_, count]) => count >= 3)
      .map(([tag]) => tag.charAt(0).toUpperCase() + tag.slice(1));
    
    // Suggest moves
    const documentMoves: Array<{ documentId: string; suggestedFolder: string; reason: string }> = [];
    for (const doc of docs.slice(0, 10)) {
      if (doc.aiTags.length > 0) {
        documentMoves.push({
          documentId: doc.id,
          suggestedFolder: doc.aiTags[0].charAt(0).toUpperCase() + doc.aiTags[0].slice(1),
          reason: `Document tagged as "${doc.aiTags[0]}"`
        });
      }
    }
    
    return { suggestedFolders, documentMoves };
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // TEMPLATES
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Obtenir les templates
   */
  getTemplates(filter?: {
    type?: DocumentType;
    domain?: string;
    category?: string;
  }): DocumentTemplate[] {
    let templates = Array.from(this.templates.values());
    
    if (filter?.type) {
      templates = templates.filter(t => t.type === filter.type);
    }
    if (filter?.domain) {
      templates = templates.filter(t => t.domain === filter.domain);
    }
    if (filter?.category) {
      templates = templates.filter(t => t.category === filter.category);
    }
    
    return templates.sort((a, b) => b.rating - a.rating);
  }
  
  /**
   * Créer un document depuis un template
   */
  async createFromTemplate(
    templateId: string,
    config: {
      name: string;
      sphereId: string;
      folderId: string;
      owner: string;
    }
  ): Promise<Document | null> {
    const template = this.templates.get(templateId);
    if (!template) return null;
    
    return this.createDocument({
      name: config.name,
      type: template.type,
      sphereId: config.sphereId,
      folderId: config.folderId,
      owner: config.owner,
      templateId
    });
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // STATISTICS
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Obtenir les statistiques
   */
  getStatistics(sphereId?: string): {
    totalDocuments: number;
    totalSize: number;
    byType: Array<{ type: DocumentType; count: number; size: number }>;
    byStatus: Array<{ status: DocumentStatus; count: number }>;
    recentActivity: Document[];
  } {
    let docs = Array.from(this.documents.values());
    
    if (sphereId) {
      docs = docs.filter(d => d.sphereId === sphereId);
    }
    
    const totalDocuments = docs.length;
    const totalSize = docs.reduce((sum, d) => sum + d.size, 0);
    
    // By type
    const typeMap = new Map<DocumentType, { count: number; size: number }>();
    for (const doc of docs) {
      const current = typeMap.get(doc.type) || { count: 0, size: 0 };
      typeMap.set(doc.type, {
        count: current.count + 1,
        size: current.size + doc.size
      });
    }
    const byType = Array.from(typeMap.entries()).map(([type, data]) => ({
      type,
      ...data
    }));
    
    // By status
    const statusMap = new Map<DocumentStatus, number>();
    for (const doc of docs) {
      statusMap.set(doc.status, (statusMap.get(doc.status) || 0) + 1);
    }
    const byStatus = Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count
    }));
    
    // Recent activity
    const recentActivity = [...docs]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 10);
    
    return {
      totalDocuments,
      totalSize,
      byType,
      byStatus,
      recentActivity
    };
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  
  private getExtensionForType(type: DocumentType): string {
    const extensions: Record<DocumentType, string> = {
      'photo': 'jpg',
      'pdf': 'pdf',
      'spreadsheet': 'xlsx',
      'document': 'docx',
      'presentation': 'pptx',
      'drawing': 'svg',
      'audio': 'mp3',
      'video': 'mp4',
      'archive': 'zip',
      'code': 'ts',
      'data': 'json',
      'other': 'bin'
    };
    return extensions[type] || 'bin';
  }
  
  private getMimeTypeForType(type: DocumentType): string {
    const mimeTypes: Record<DocumentType, string> = {
      'photo': 'image/jpeg',
      'pdf': 'application/pdf',
      'spreadsheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'document': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'presentation': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'drawing': 'image/svg+xml',
      'audio': 'audio/mpeg',
      'video': 'video/mp4',
      'archive': 'application/zip',
      'code': 'text/typescript',
      'data': 'application/json',
      'other': 'application/octet-stream'
    };
    return mimeTypes[type] || 'application/octet-stream';
  }
  
  private getFolderPath(folderId: string): string {
    const folder = this.folders.get(folderId);
    return folder?.path || '/';
  }
  
  private generateChecksum(): string {
    return Math.random().toString(36).substring(2, 15);
  }
  
  private generateShareToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
  
  private addAuditEntry(doc: Document, action: AuditEntry['action'], userId: string, details?: string): void {
    if (!doc.governance.auditEnabled) return;
    
    doc.governance.auditLog.push({
      id: `audit-${Date.now()}`,
      action,
      userId,
      userName: 'User',
      timestamp: new Date(),
      details
    });
    
    // Keep only last 100 entries
    if (doc.governance.auditLog.length > 100) {
      doc.governance.auditLog = doc.governance.auditLog.slice(-100);
    }
  }
  
  private calculateFacet(docs: Document[], field: keyof Document): Array<{ [key: string]: unknown; count: number }> {
    const counts = new Map<string, number>();
    for (const doc of docs) {
      const value = String(doc[field]);
      counts.set(value, (counts.get(value) || 0) + 1);
    }
    return Array.from(counts.entries()).map(([value, count]) => ({
      [field]: value,
      count
    }));
  }
  
  private calculateTagFacet(docs: Document[]): Array<{ tag: string; count: number }> {
    const counts = new Map<string, number>();
    for (const doc of docs) {
      for (const tag of doc.aiTags) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }
  
  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-CA');
  }
  
  private async simulateProcessing(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const unifiedDocumentManager = new UnifiedDocumentManager();
