/**
 * CHE·NU™ Knowledge Threads - Utility Functions
 * 
 * Pure functions for:
 * - Data transformations
 * - Formatting
 * - Validation
 * - Export
 * 
 * @version 1.0.0
 */

import type {
  KnowledgeThread,
  ThreadSummary,
  LinkedEntity,
  LinkType,
  LinkedEntityType,
  ThreadTimelineEvent,
  ThreadCreationForm,
  UnresolvedElement,
} from './knowledge-threads.types';
import { LINK_TYPE_META, ENTITY_TYPE_META } from './knowledge-threads.types';

// ============================================================================
// ID GENERATION
// ============================================================================

/**
 * Generate a unique thread ID
 */
export function generateThreadId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `thread_${timestamp}_${random}`;
}

/**
 * Generate a unique link ID
 */
export function generateLinkId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `link_${timestamp}_${random}`;
}

/**
 * Generate a unique event ID
 */
export function generateEventId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `evt_${timestamp}_${random}`;
}

// ============================================================================
// DATE / TIME FORMATTING
// ============================================================================

/**
 * Format date for display
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'relative') {
    return formatRelativeTime(d);
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('fr-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return d.toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Format relative time (e.g., "il y a 2 jours")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  
  if (seconds < 60) return 'à l\'instant';
  if (minutes < 60) return `il y a ${minutes}m`;
  if (hours < 24) return `il y a ${hours}h`;
  if (days === 1) return 'hier';
  if (days < 7) return `il y a ${days} jours`;
  if (weeks < 4) return `il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  return `il y a ${months} mois`;
}

// ============================================================================
// THREAD ANALYSIS
// ============================================================================

/**
 * Calculate thread activity level
 */
export function calculateActivityLevel(
  thread: KnowledgeThread
): 'high' | 'medium' | 'low' | 'dormant' {
  const lastActivity = new Date(thread.last_activity_at);
  const now = new Date();
  const daysSinceActivity = Math.floor(
    (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceActivity <= 3) return 'high';
  if (daysSinceActivity <= 14) return 'medium';
  if (daysSinceActivity <= 30) return 'low';
  return 'dormant';
}

/**
 * Extract unresolved elements from thread
 */
export function extractUnresolvedElements(
  thread: KnowledgeThread
): UnresolvedElement[] {
  return thread.linked_entities
    .filter(e => e.link_type === 'QUESTION' && !e.is_resolved)
    .map(e => ({
      id: e.id,
      type: 'question' as const,
      title: e.display_title || 'Question sans titre',
      raised_at: e.timestamp,
      raised_by: e.linked_by,
      entity_id: e.entity_id,
    }));
}

/**
 * Get sphere coverage from linked entities
 */
export function getSphereCoverage(entities: LinkedEntity[]): string[] {
  const spheres = new Set<string>();
  
  for (const entity of entities) {
    if (entity.sphere_origin) {
      spheres.add(entity.sphere_origin);
    }
  }
  
  return Array.from(spheres).sort();
}

/**
 * Group entities by link type
 */
export function groupEntitiesByLinkType(
  entities: LinkedEntity[]
): Record<LinkType, LinkedEntity[]> {
  const groups: Record<LinkType, LinkedEntity[]> = {} as any;
  
  for (const entity of entities) {
    if (!groups[entity.link_type]) {
      groups[entity.link_type] = [];
    }
    groups[entity.link_type].push(entity);
  }
  
  return groups;
}

/**
 * Group entities by entity type
 */
export function groupEntitiesByType(
  entities: LinkedEntity[]
): Record<LinkedEntityType, LinkedEntity[]> {
  const groups: Record<LinkedEntityType, LinkedEntity[]> = {} as any;
  
  for (const entity of entities) {
    if (!groups[entity.entity_type]) {
      groups[entity.entity_type] = [];
    }
    groups[entity.entity_type].push(entity);
  }
  
  return groups;
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate thread creation form
 */
export function validateThreadForm(form: ThreadCreationForm): string[] {
  const errors: string[] = [];
  
  if (!form.title.trim()) {
    errors.push('Le titre est requis');
  } else if (form.title.length < 3) {
    errors.push('Le titre doit avoir au moins 3 caractères');
  } else if (form.title.length > 100) {
    errors.push('Le titre ne peut pas dépasser 100 caractères');
  }
  
  if (!form.description?.trim()) {
    errors.push('Le contexte de création est requis');
  } else if (form.description.length < 10) {
    errors.push('Le contexte doit avoir au moins 10 caractères');
  }
  
  return errors;
}

/**
 * Validate link creation
 */
export function validateLink(
  entityType: LinkedEntityType | null,
  linkType: LinkType | null
): string[] {
  const errors: string[] = [];
  
  if (!entityType) {
    errors.push('Sélectionnez un élément à lier');
  }
  
  if (!linkType) {
    errors.push('Choisissez la nature du lien');
  }
  
  return errors;
}

// ============================================================================
// TRANSFORMATIONS
// ============================================================================

/**
 * Create thread summary from full thread
 */
export function toThreadSummary(thread: KnowledgeThread): ThreadSummary {
  return {
    id: thread.id,
    title: thread.title,
    description: thread.description,
    status: thread.status,
    owner: thread.owner,
    owner_name: thread.owner_name,
    created_at: thread.created_at,
    last_activity_at: thread.last_activity_at,
    entity_count: thread.entity_count,
    unresolved_count: thread.unresolved_count,
    activity_level: thread.activity_level,
    color: thread.color,
    icon: thread.icon,
    sphere_coverage: thread.sphere_coverage,
  };
}

/**
 * Create timeline event for entity link
 */
export function createLinkEvent(
  entity: LinkedEntity,
  actorId: string,
  actorName: string
): ThreadTimelineEvent {
  return {
    id: generateEventId(),
    event_type: 'linked',
    timestamp: new Date().toISOString(),
    actor_type: 'human',
    actor_id: actorId,
    actor_name: actorName,
    description: `A lié "${entity.display_title}" comme ${LINK_TYPE_META[entity.link_type]?.label}`,
    entity_reference: {
      type: entity.entity_type,
      id: entity.entity_id,
      title: entity.display_title || entity.entity_id,
    },
  };
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

/**
 * Export thread to Markdown
 */
export function exportToMarkdown(thread: KnowledgeThread): string {
  const lines: string[] = [];
  
  lines.push(`# ${thread.icon || '🧵'} ${thread.title}`);
  lines.push('');
  lines.push(`**Status:** ${thread.status}`);
  lines.push(`**Créé le:** ${formatDate(thread.created_at, 'long')}`);
  lines.push(`**Dernière activité:** ${formatDate(thread.last_activity_at, 'long')}`);
  lines.push(`**Propriétaire:** ${thread.owner_name || thread.owner}`);
  lines.push('');
  
  if (thread.description) {
    lines.push('## Contexte');
    lines.push(thread.description);
    lines.push('');
  }
  
  lines.push('## Sphères Touchées');
  lines.push(thread.sphere_coverage.join(', '));
  lines.push('');
  
  // Group entities by link type
  const groups = groupEntitiesByLinkType(thread.linked_entities);
  
  lines.push('## Éléments Liés');
  lines.push('');
  
  for (const [linkType, entities] of Object.entries(groups)) {
    const meta = LINK_TYPE_META[linkType as LinkType];
    lines.push(`### ${meta?.icon || ''} ${meta?.label || linkType}`);
    lines.push('');
    
    for (const entity of entities) {
      const entityMeta = ENTITY_TYPE_META[entity.entity_type];
      lines.push(`- ${entityMeta?.icon || '📎'} **${entity.display_title}** (${entity.sphere_origin || 'Unknown'})`);
      if (entity.reason) {
        lines.push(`  - _${entity.reason}_`);
      }
    }
    lines.push('');
  }
  
  // Timeline summary
  lines.push('## Historique');
  lines.push('');
  lines.push(`${thread.timeline.length} événements enregistrés.`);
  lines.push('');
  
  // Stats
  lines.push('## Statistiques');
  lines.push('');
  lines.push(`- Éléments liés: ${thread.entity_count}`);
  lines.push(`- Questions ouvertes: ${thread.unresolved_count}`);
  lines.push(`- Agents liés: ${thread.agents_linked.length}`);
  lines.push('');
  
  lines.push('---');
  lines.push('_Exporté depuis CHE·NU™ Knowledge Threads_');
  
  return lines.join('\n');
}

/**
 * Export thread to JSON
 */
export function exportToJSON(thread: KnowledgeThread): string {
  return JSON.stringify({
    version: '1.0',
    exported_at: new Date().toISOString(),
    thread,
  }, null, 2);
}

// ============================================================================
// SEARCH & FILTER
// ============================================================================

/**
 * Search threads by query
 */
export function searchThreads(
  threads: ThreadSummary[],
  query: string
): ThreadSummary[] {
  if (!query.trim()) return threads;
  
  const lowerQuery = query.toLowerCase();
  
  return threads.filter(t =>
    t.title.toLowerCase().includes(lowerQuery) ||
    t.description?.toLowerCase().includes(lowerQuery) ||
    t.sphere_coverage.some(s => s.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Sort threads
 */
export function sortThreads(
  threads: ThreadSummary[],
  sortBy: 'recent' | 'created' | 'activity' | 'name',
  order: 'asc' | 'desc' = 'desc'
): ThreadSummary[] {
  const sorted = [...threads];
  
  sorted.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'recent':
        comparison = new Date(b.last_activity_at).getTime() - 
                    new Date(a.last_activity_at).getTime();
        break;
      case 'created':
        comparison = new Date(b.created_at).getTime() - 
                    new Date(a.created_at).getTime();
        break;
      case 'activity':
        const activityOrder = { high: 3, medium: 2, low: 1, dormant: 0 };
        comparison = activityOrder[b.activity_level] - activityOrder[a.activity_level];
        break;
      case 'name':
        comparison = a.title.localeCompare(b.title);
        break;
    }
    
    return order === 'desc' ? comparison : -comparison;
  });
  
  return sorted;
}

// ============================================================================
// TEXT UTILITIES
// ============================================================================

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ============================================================================
// COLOR UTILITIES
// ============================================================================

/**
 * Get activity color
 */
export function getActivityColor(level: string): string {
  switch (level) {
    case 'high': return '#22C55E';
    case 'medium': return '#EAB308';
    case 'low': return '#F97316';
    case 'dormant': return '#6B7280';
    default: return '#6B7280';
  }
}

/**
 * Adjust color brightness
 */
export function adjustBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return '#' + (0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // ID Generation
  generateThreadId,
  generateLinkId,
  generateEventId,
  // Date/Time
  formatDate,
  formatRelativeTime,
  // Analysis
  calculateActivityLevel,
  extractUnresolvedElements,
  getSphereCoverage,
  groupEntitiesByLinkType,
  groupEntitiesByType,
  // Validation
  validateThreadForm,
  validateLink,
  // Transformations
  toThreadSummary,
  createLinkEvent,
  // Export
  exportToMarkdown,
  exportToJSON,
  // Search
  searchThreads,
  sortThreads,
  // Text
  truncate,
  capitalize,
  // Color
  getActivityColor,
  adjustBrightness,
};
