/**
 * CHE·NU™ Backstage Intelligence Module
 * Invisible cognitive layer for context analysis, intent detection, and routing
 * 
 * @module backstage
 * @version 33.0
 */

export { default as BackstagePanel } from './BackstagePanel';

// Types
export interface IntentResult {
  primary_intent: string;
  confidence: number;
  entities: { type: string; value: string }[];
  suggested_actions: string[];
}

export interface ClassificationResult {
  category: string;
  subcategory?: string;
  domains: string[];
  tags: string[];
  language?: string;
  sentiment?: string;
}

export interface RoutingResult {
  sphere: string;
  domain: string;
  agents: string[];
}

export interface BackstageContext {
  id: string;
  contextType: 'workspace' | 'thread' | 'meeting' | 'workflow';
  contextData: Record<string, any>;
  detectedIntent?: IntentResult;
  suggestedAgents: string[];
  suggestedDataspaces: string[];
  createdAt: string;
  expiresAt?: string;
}

// Constants
export const INTENTS = [
  'create', 'update', 'delete', 'search', 'analyze',
  'estimate', 'plan', 'schedule', 'report', 'help'
] as const;

export const DOMAINS = [
  'immobilier', 'construction', 'finance', 'creative', 'enterprise', 'general'
] as const;
