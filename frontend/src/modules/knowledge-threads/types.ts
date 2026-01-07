/**
 * CHE·NU — KNOWLEDGE THREADS (INTER-SPHERE)
 * Types & Interfaces - CORE.v1.0
 * 
 * Thread = POINTER, not narrative
 * LINK facts. NEVER interpret.
 */

export type ThreadType = 'reference' | 'context' | 'agent' | 'sphere';
export type ThreadObjectType = 'meeting' | 'decision' | 'artifact' | 'agent';
export type ThreadVisibility = 'private' | 'shared' | 'public';

export interface ThreadEndpoint {
  id: string;
  object_type: ThreadObjectType;
  title?: string;
  sphere?: string;
}

export interface KnowledgeThread {
  id: string;
  type: ThreadType;
  source: ThreadEndpoint;
  target: ThreadEndpoint;
  created_by: string;
  reason: string;  // REQUIRED - explicit explanation
  timestamp: number;
  visibility: ThreadVisibility;
  hash: string;
  unlinked: boolean;
  unlinked_at?: string;
}

export type ThreadNavigationAction = 'follow_forward' | 'follow_backward' | 'expand_network' | 'isolate_path' | 'open_linked_replays';

export interface ThreadVisualization {
  line_style: 'thin' | 'normal';
  color_grading: boolean;  // Always false
  hover_highlight: boolean;
  type_toggle: Record<ThreadType, boolean>;
}

export type ThreadAgentType = 'thread_registrar' | 'thread_guard' | 'thread_renderer';

export interface ThreadAgent {
  type: ThreadAgentType;
  name: string;
  icon: string;
  responsibility: string;
  constraint: string;
  active: boolean;
}

export const THREAD_NEVER_FROM: string[] = [
  'Sentiment analysis',
  'Pattern guessing', 
  'Hidden correlations',
  'Inferred relationships',
];

export interface KnowledgeThreadsState {
  threads: KnowledgeThread[];
  visualization: ThreadVisualization;
  agents: ThreadAgent[];
  selected_thread: string | null;
  expanded_network: string[];
  type_filter: ThreadType | null;
  is_loading: boolean;
  error: string | null;
}
