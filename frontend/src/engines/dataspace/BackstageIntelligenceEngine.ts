/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — BACKSTAGE INTELLIGENCE ENGINE                         ║
 * ║              The Invisible Cognitive Layer                                   ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "Invisible competence - works behind the scenes without demanding          ║
 * ║   attention or recognition."                                                ║
 * ║                                                                              ║
 * ║  Backstage Intelligence is NOT an agent. It observes, prepares, classifies, ║
 * ║  routes, validates, and optimizes - but never generates visible content.    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type SphereId = 
  | 'personal' | 'business' | 'government' | 'creative_studio'
  | 'community' | 'social_media' | 'entertainment' | 'my_team' | 'scholar';

export type DomainId = 
  | 'construction' | 'immobilier' | 'finance' | 'health' | 'creative'
  | 'legal' | 'education' | 'operations' | 'hr' | 'general';

export type ContentType = 
  | 'document' | 'media' | 'task' | 'meeting' | 'thread'
  | 'note' | 'diagram' | 'xr_asset' | 'unknown';

export type RiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT ANALYSIS TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ContextAnalysis {
  timestamp: string;
  
  // Detected context
  detected_sphere: SphereId | null;
  detected_domains: DomainId[];
  detected_intent: IntentAnalysis;
  
  // Relevance
  related_threads: string[];
  related_dataspaces: string[];
  
  // Identity
  active_identity: string;
  identity_permissions: string[];
  
  // Confidence
  confidence_score: number;
}

export interface IntentAnalysis {
  primary_action: string;
  secondary_actions: string[];
  entities: ExtractedEntity[];
  sentiment: 'positive' | 'neutral' | 'negative' | 'unknown';
  urgency: 'immediate' | 'soon' | 'normal' | 'low';
}

export interface ExtractedEntity {
  type: 'person' | 'organization' | 'date' | 'amount' | 'location' | 'project' | 'task' | 'property';
  value: string;
  confidence: number;
  position?: { start: number; end: number };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLASSIFICATION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Classification {
  content_type: ContentType;
  document_category?: string;
  domains: DomainId[];
  tags: string[];
  suggested_dataspace?: string;
  confidence: number;
}

export interface RoutingSuggestion {
  target_type: 'dataspace' | 'thread' | 'sphere' | 'domain';
  target_id: string;
  target_name: string;
  confidence: number;
  reason: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RISK DETECTION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface RiskAssessment {
  overall_risk: RiskLevel;
  risks: DetectedRisk[];
  requires_approval: boolean;
  blocked: boolean;
  block_reason?: string;
}

export interface DetectedRisk {
  type: RiskType;
  level: RiskLevel;
  description: string;
  mitigation?: string;
  affected_entities: string[];
}

export type RiskType = 
  | 'permission_gap'
  | 'identity_conflict'
  | 'cross_sphere_violation'
  | 'data_leakage'
  | 'incomplete_workflow'
  | 'agent_overreach'
  | 'logic_inconsistency'
  | 'budget_exceeded'
  | 'sensitive_data';

// ═══════════════════════════════════════════════════════════════════════════════
// OPTIMIZATION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface OptimizationHint {
  type: 'cache_context' | 'preload_template' | 'prepare_summary' | 'prebuild_report';
  priority: 'high' | 'medium' | 'low';
  target_id: string;
  data?: unknown;
}

export interface PreparedContext {
  context_id: string;
  prepared_at: string;
  expires_at: string;
  content: {
    summaries: string[];
    related_items: string[];
    suggested_actions: string[];
    preloaded_data: unknown;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BACKSTAGE INTELLIGENCE ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class BackstageIntelligenceEngine {
  private contextCache: Map<string, PreparedContext> = new Map();
  private classificationCache: Map<string, Classification> = new Map();
  private pendingOptimizations: OptimizationHint[] = [];
  
  // Domain keywords for classification
  private domainKeywords: Record<DomainId, string[]> = {
    construction: ['chantier', 'construction', 'rénovation', 'permit', 'rbq', 'cnesst', 'blueprint', 'contractor'],
    immobilier: ['property', 'propriété', 'tenant', 'locataire', 'lease', 'bail', 'rent', 'loyer', 'building', 'immeuble', 'tal'],
    finance: ['budget', 'invoice', 'facture', 'payment', 'paiement', 'tax', 'impôt', 'revenue', 'expense', 'cost'],
    health: ['health', 'santé', 'medical', 'doctor', 'appointment', 'prescription', 'wellness'],
    creative: ['design', 'art', 'creative', 'branding', 'logo', 'video', 'photo', 'animation'],
    legal: ['contract', 'contrat', 'legal', 'juridique', 'compliance', 'regulation', 'law'],
    education: ['course', 'cours', 'training', 'formation', 'certification', 'learning', 'study'],
    operations: ['process', 'workflow', 'operation', 'procedure', 'system', 'automation'],
    hr: ['employee', 'employé', 'hiring', 'recruitment', 'payroll', 'team', 'équipe'],
    general: [],
  };
  
  // Sphere keywords
  private sphereKeywords: Record<SphereId, string[]> = {
    personal: ['personal', 'personnel', 'family', 'famille', 'home', 'maison', 'private', 'privé'],
    business: ['business', 'entreprise', 'company', 'commercial', 'client', 'professional'],
    government: ['government', 'gouvernement', 'tax', 'impôt', 'permit', 'official', 'administration'],
    creative_studio: ['design', 'creative', 'art', 'studio', 'portfolio', 'branding'],
    community: ['community', 'communauté', 'local', 'association', 'volunteer', 'bénévolat'],
    social_media: ['social', 'media', 'post', 'follower', 'content', 'platform'],
    entertainment: ['entertainment', 'game', 'jeu', 'movie', 'film', 'music', 'travel', 'voyage'],
    my_team: ['team', 'équipe', 'collaboration', 'member', 'role', 'permission'],
    scholar: ['study', 'research', 'academic', 'course', 'learning', 'documentation'],
  };
  
  constructor() {}
  
  // ═══════════════════════════════════════════════════════════════════════════
  // A. CONTEXT ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Analyze context from user input and current state
   */
  analyzeContext(input: {
    text?: string;
    files?: Array<{ name: string; type: string; content?: string }>;
    current_sphere?: SphereId;
    current_dataspace?: string;
    user_id: string;
    session_context?: unknown;
  }): ContextAnalysis {
    const timestamp = new Date().toISOString();
    
    // Combine all text for analysis
    const combinedText = [
      input.text || '',
      ...(input.files?.map(f => f.name) || []),
      ...(input.files?.map(f => f.content || '') || []),
    ].join(' ').toLowerCase();
    
    // Detect sphere
    const detectedSphere = this.detectSphere(combinedText, input.current_sphere);
    
    // Detect domains
    const detectedDomains = this.detectDomains(combinedText);
    
    // Extract intent
    const detectedIntent = this.extractIntent(input.text || '');
    
    // Find related items
    const relatedThreads = this.findRelatedThreads(combinedText);
    const relatedDataspaces = this.findRelatedDataspaces(combinedText);
    
    // Calculate confidence
    const confidence = this.calculateContextConfidence(detectedSphere, detectedDomains, detectedIntent);
    
    return {
      timestamp,
      detected_sphere: detectedSphere,
      detected_domains: detectedDomains,
      detected_intent: detectedIntent,
      related_threads: relatedThreads,
      related_dataspaces: relatedDataspaces,
      active_identity: input.user_id,
      identity_permissions: [], // Would be populated from permission engine
      confidence_score: confidence,
    };
  }
  
  private detectSphere(text: string, currentSphere?: SphereId): SphereId | null {
    if (!text) return currentSphere || null;
    
    let bestMatch: SphereId | null = null;
    let bestScore = 0;
    
    for (const [sphere, keywords] of Object.entries(this.sphereKeywords) as [SphereId, string[]][]) {
      const score = keywords.filter(k => text.includes(k)).length;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = sphere;
      }
    }
    
    return bestScore > 0 ? bestMatch : (currentSphere || null);
  }
  
  private detectDomains(text: string): DomainId[] {
    if (!text) return ['general'];
    
    const detected: DomainId[] = [];
    
    for (const [domain, keywords] of Object.entries(this.domainKeywords) as [DomainId, string[]][]) {
      if (domain === 'general') continue;
      const matches = keywords.filter(k => text.includes(k)).length;
      if (matches > 0) {
        detected.push(domain);
      }
    }
    
    return detected.length > 0 ? detected : ['general'];
  }
  
  private extractIntent(text: string): IntentAnalysis {
    const lower = text.toLowerCase();
    
    // Detect primary action
    let primaryAction = 'unknown';
    const actionPatterns: Record<string, string[]> = {
      'create': ['create', 'créer', 'add', 'ajouter', 'new', 'nouveau'],
      'read': ['show', 'afficher', 'find', 'trouver', 'search', 'chercher', 'view', 'voir'],
      'update': ['update', 'modifier', 'edit', 'éditer', 'change', 'changer'],
      'delete': ['delete', 'supprimer', 'remove', 'enlever'],
      'analyze': ['analyze', 'analyser', 'review', 'réviser', 'check', 'vérifier'],
      'schedule': ['schedule', 'planifier', 'book', 'réserver', 'meeting', 'réunion'],
      'send': ['send', 'envoyer', 'share', 'partager', 'notify', 'notifier'],
    };
    
    for (const [action, patterns] of Object.entries(actionPatterns)) {
      if (patterns.some(p => lower.includes(p))) {
        primaryAction = action;
        break;
      }
    }
    
    // Extract entities
    const entities = this.extractEntities(text);
    
    // Detect urgency
    let urgency: IntentAnalysis['urgency'] = 'normal';
    if (lower.includes('urgent') || lower.includes('asap') || lower.includes('immédiat')) {
      urgency = 'immediate';
    } else if (lower.includes('soon') || lower.includes('bientôt') || lower.includes('today') || lower.includes("aujourd'hui")) {
      urgency = 'soon';
    }
    
    return {
      primary_action: primaryAction,
      secondary_actions: [],
      entities,
      sentiment: 'neutral',
      urgency,
    };
  }
  
  private extractEntities(text: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    
    // Date patterns
    const datePattern = /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{4}[\/\-]\d{2}[\/\-]\d{2})\b/g;
    let match;
    while ((match = datePattern.exec(text)) !== null) {
      entities.push({
        type: 'date',
        value: match[1],
        confidence: 0.9,
        position: { start: match.index, end: match.index + match[0].length },
      });
    }
    
    // Amount patterns (currency)
    const amountPattern = /\$\s*[\d,]+(?:\.\d{2})?|\d+(?:\.\d{2})?\s*(?:\$|CAD|USD|EUR)/gi;
    while ((match = amountPattern.exec(text)) !== null) {
      entities.push({
        type: 'amount',
        value: match[0],
        confidence: 0.85,
        position: { start: match.index, end: match.index + match[0].length },
      });
    }
    
    return entities;
  }
  
  private findRelatedThreads(text: string): string[] {
    // In production, would search thread database
    return [];
  }
  
  private findRelatedDataspaces(text: string): string[] {
    // In production, would search dataspace database
    return [];
  }
  
  private calculateContextConfidence(
    sphere: SphereId | null,
    domains: DomainId[],
    intent: IntentAnalysis
  ): number {
    let confidence = 0.5; // Base
    
    if (sphere) confidence += 0.15;
    if (domains.length > 0 && !domains.includes('general')) confidence += 0.15;
    if (intent.primary_action !== 'unknown') confidence += 0.1;
    if (intent.entities.length > 0) confidence += 0.1;
    
    return Math.min(confidence, 1);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // B. CLASSIFICATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Classify content
   */
  classify(content: {
    text?: string;
    filename?: string;
    mimeType?: string;
    metadata?: Record<string, any>;
  }): Classification {
    // Generate cache key
    const cacheKey = JSON.stringify(content);
    if (this.classificationCache.has(cacheKey)) {
      return this.classificationCache.get(cacheKey)!;
    }
    
    // Detect content type
    const contentType = this.detectContentType(content);
    
    // Detect domains
    const combinedText = `${content.text || ''} ${content.filename || ''}`.toLowerCase();
    const domains = this.detectDomains(combinedText);
    
    // Generate tags
    const tags = this.generateTags(content, domains);
    
    // Detect document category
    const documentCategory = contentType === 'document' 
      ? this.detectDocumentCategory(content) 
      : undefined;
    
    const classification: Classification = {
      content_type: contentType,
      document_category: documentCategory,
      domains,
      tags,
      confidence: this.calculateClassificationConfidence(content),
    };
    
    // Cache result
    this.classificationCache.set(cacheKey, classification);
    
    return classification;
  }
  
  private detectContentType(content: {
    filename?: string;
    mimeType?: string;
  }): ContentType {
    const filename = (content.filename || '').toLowerCase();
    const mimeType = content.mimeType || '';
    
    // Document types
    if (filename.endsWith('.pdf') || filename.endsWith('.docx') || filename.endsWith('.doc') ||
        filename.endsWith('.xlsx') || filename.endsWith('.xls') || filename.endsWith('.txt') ||
        filename.endsWith('.md') || mimeType.includes('document') || mimeType.includes('pdf')) {
      return 'document';
    }
    
    // Media types
    if (filename.endsWith('.jpg') || filename.endsWith('.png') || filename.endsWith('.mp4') ||
        filename.endsWith('.mp3') || mimeType.includes('image') || mimeType.includes('video') ||
        mimeType.includes('audio')) {
      return 'media';
    }
    
    // Diagram types
    if (filename.endsWith('.mermaid') || filename.endsWith('.drawio')) {
      return 'diagram';
    }
    
    // XR types
    if (filename.endsWith('.obj') || filename.endsWith('.fbx') || filename.endsWith('.gltf')) {
      return 'xr_asset';
    }
    
    return 'unknown';
  }
  
  private detectDocumentCategory(content: { filename?: string; text?: string }): string {
    const filename = (content.filename || '').toLowerCase();
    const text = (content.text || '').toLowerCase();
    
    if (filename.includes('invoice') || filename.includes('facture') || text.includes('total due')) {
      return 'invoice';
    }
    if (filename.includes('contract') || filename.includes('contrat') || text.includes('agreement')) {
      return 'contract';
    }
    if (filename.includes('lease') || filename.includes('bail')) {
      return 'lease';
    }
    if (filename.includes('report') || filename.includes('rapport')) {
      return 'report';
    }
    if (filename.includes('meeting') || filename.includes('agenda')) {
      return 'meeting_notes';
    }
    
    return 'general';
  }
  
  private generateTags(content: unknown, domains: DomainId[]): string[] {
    const tags: string[] = [];
    
    // Add domain tags
    domains.forEach(d => tags.push(`domain:${d}`));
    
    // Add type-based tags
    if (content.filename) {
      const ext = content.filename.split('.').pop()?.toLowerCase();
      if (ext) tags.push(`format:${ext}`);
    }
    
    return tags;
  }
  
  private calculateClassificationConfidence(content: unknown): number {
    let confidence = 0.5;
    
    if (content.filename) confidence += 0.2;
    if (content.mimeType) confidence += 0.15;
    if (content.text && content.text.length > 50) confidence += 0.15;
    
    return Math.min(confidence, 1);
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // C. ROUTING SUGGESTIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Suggest routing destinations for content
   */
  suggestRouting(
    content: Classification,
    context: ContextAnalysis
  ): RoutingSuggestion[] {
    const suggestions: RoutingSuggestion[] = [];
    
    // Suggest sphere if detected
    if (context.detected_sphere) {
      suggestions.push({
        target_type: 'sphere',
        target_id: context.detected_sphere,
        target_name: this.getSphereDisplayName(context.detected_sphere),
        confidence: context.confidence_score,
        reason: `Content matches ${context.detected_sphere} sphere context`,
      });
    }
    
    // Suggest domains
    content.domains.forEach(domain => {
      suggestions.push({
        target_type: 'domain',
        target_id: domain,
        target_name: this.getDomainDisplayName(domain),
        confidence: content.confidence * 0.9,
        reason: `Content classified as ${domain} domain`,
      });
    });
    
    // Suggest related dataspaces
    context.related_dataspaces.forEach(dsId => {
      suggestions.push({
        target_type: 'dataspace',
        target_id: dsId,
        target_name: dsId, // Would lookup actual name
        confidence: 0.7,
        reason: 'Related to existing dataspace',
      });
    });
    
    // Sort by confidence
    suggestions.sort((a, b) => b.confidence - a.confidence);
    
    return suggestions;
  }
  
  private getSphereDisplayName(sphere: SphereId): string {
    const names: Record<SphereId, string> = {
      personal: 'Personnel',
      business: 'Entreprises',
      government: 'Gouvernement & Institutions',
      creative_studio: 'Studio de création',
      community: 'Community',
      social_media: 'Social & Media',
      entertainment: 'Entertainment',
      my_team: 'My Team',
      scholar: 'Scholar',
    };
    return names[sphere] || sphere;
  }
  
  private getDomainDisplayName(domain: DomainId): string {
    const names: Record<DomainId, string> = {
      construction: 'Construction',
      immobilier: 'Immobilier',
      finance: 'Finance',
      health: 'Santé',
      creative: 'Créatif',
      legal: 'Juridique',
      education: 'Éducation',
      operations: 'Opérations',
      hr: 'Ressources Humaines',
      general: 'Général',
    };
    return names[domain] || domain;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // D. RISK DETECTION
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Assess risks for an operation
   */
  assessRisk(operation: {
    action: string;
    source_sphere?: SphereId;
    target_sphere?: SphereId;
    source_identity?: string;
    target_identity?: string;
    data_types?: string[];
    requires_budget?: number;
    available_budget?: number;
  }): RiskAssessment {
    const risks: DetectedRisk[] = [];
    
    // Check cross-sphere violation
    if (operation.source_sphere && operation.target_sphere && 
        operation.source_sphere !== operation.target_sphere) {
      risks.push({
        type: 'cross_sphere_violation',
        level: 'medium',
        description: `Operation crosses sphere boundary: ${operation.source_sphere} → ${operation.target_sphere}`,
        mitigation: 'Ensure proper permissions for cross-sphere access',
        affected_entities: [operation.source_sphere, operation.target_sphere],
      });
    }
    
    // Check identity conflict (CRITICAL)
    if (operation.source_identity && operation.target_identity &&
        operation.source_identity !== operation.target_identity) {
      risks.push({
        type: 'identity_conflict',
        level: 'critical',
        description: 'Operation attempts to cross identity boundaries',
        mitigation: 'Data cannot move between different identities',
        affected_entities: [operation.source_identity, operation.target_identity],
      });
    }
    
    // Check budget exceeded
    if (operation.requires_budget && operation.available_budget &&
        operation.requires_budget > operation.available_budget) {
      risks.push({
        type: 'budget_exceeded',
        level: 'high',
        description: `Required budget (${operation.requires_budget}) exceeds available (${operation.available_budget})`,
        mitigation: 'Request additional budget or reduce scope',
        affected_entities: [],
      });
    }
    
    // Check sensitive data
    const sensitiveTypes = ['personal', 'financial', 'health', 'legal'];
    if (operation.data_types?.some(t => sensitiveTypes.includes(t))) {
      risks.push({
        type: 'sensitive_data',
        level: 'medium',
        description: 'Operation involves sensitive data types',
        mitigation: 'Ensure proper handling and logging of sensitive data',
        affected_entities: operation.data_types.filter(t => sensitiveTypes.includes(t)),
      });
    }
    
    // Calculate overall risk
    const riskLevels: Record<RiskLevel, number> = {
      none: 0, low: 1, medium: 2, high: 3, critical: 4
    };
    
    const maxRisk = risks.reduce((max, r) => 
      riskLevels[r.level] > riskLevels[max] ? r.level : max, 
      'none' as RiskLevel
    );
    
    // Check if blocked (critical risks block)
    const blocked = risks.some(r => r.level === 'critical');
    
    // Check if requires approval (high risks require approval)
    const requiresApproval = risks.some(r => r.level === 'high' || r.level === 'critical');
    
    return {
      overall_risk: maxRisk,
      risks,
      requires_approval: requiresApproval,
      blocked,
      block_reason: blocked ? risks.find(r => r.level === 'critical')?.description : undefined,
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // E. OPTIMIZATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Prepare context for upcoming operations
   */
  prepareContext(params: {
    user_id: string;
    sphere_id?: SphereId;
    dataspace_id?: string;
    likely_actions?: string[];
  }): PreparedContext {
    const contextId = `ctx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = new Date();
    
    const prepared: PreparedContext = {
      context_id: contextId,
      prepared_at: now.toISOString(),
      expires_at: new Date(now.getTime() + 5 * 60 * 1000).toISOString(), // 5 min TTL
      content: {
        summaries: [],
        related_items: [],
        suggested_actions: this.suggestActions(params.likely_actions || []),
        preloaded_data: {},
      },
    };
    
    // Cache prepared context
    this.contextCache.set(contextId, prepared);
    
    // Schedule cleanup
    setTimeout(() => {
      this.contextCache.delete(contextId);
    }, 5 * 60 * 1000);
    
    return prepared;
  }
  
  /**
   * Queue optimization hint
   */
  queueOptimization(hint: OptimizationHint): void {
    this.pendingOptimizations.push(hint);
    
    // Process high priority immediately
    if (hint.priority === 'high') {
      this.processOptimizations();
    }
  }
  
  /**
   * Process pending optimizations
   */
  processOptimizations(): void {
    // Sort by priority
    this.pendingOptimizations.sort((a, b) => {
      const priorities = { high: 3, medium: 2, low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    });
    
    // Process each (in production, would be async)
    while (this.pendingOptimizations.length > 0) {
      const hint = this.pendingOptimizations.shift()!;
      this.executeOptimization(hint);
    }
  }
  
  private executeOptimization(hint: OptimizationHint): void {
    switch (hint.type) {
      case 'cache_context':
        // Pre-load context data
        break;
      case 'preload_template':
        // Pre-build template
        break;
      case 'prepare_summary':
        // Generate summary
        break;
      case 'prebuild_report':
        // Prepare report structure
        break;
    }
  }
  
  private suggestActions(likelyActions: string[]): string[] {
    const suggestions: string[] = [];
    
    if (likelyActions.includes('meeting')) {
      suggestions.push('Prepare meeting agenda template');
      suggestions.push('Review related threads');
    }
    
    if (likelyActions.includes('document')) {
      suggestions.push('Check for similar documents');
      suggestions.push('Suggest categorization');
    }
    
    return suggestions;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // STATISTICS
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get engine statistics
   */
  getStats(): {
    cached_contexts: number;
    cached_classifications: number;
    pending_optimizations: number;
  } {
    return {
      cached_contexts: this.contextCache.size,
      cached_classifications: this.classificationCache.size,
      pending_optimizations: this.pendingOptimizations.length,
    };
  }
  
  /**
   * Clear caches
   */
  clearCaches(): void {
    this.contextCache.clear();
    this.classificationCache.clear();
    this.pendingOptimizations = [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default BackstageIntelligenceEngine;
