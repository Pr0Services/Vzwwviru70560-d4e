import { ThreadType, ThreadAgent, ThreadVisualization, KnowledgeThread, ThreadEndpoint, ThreadVisibility } from './types';

export const THREAD_TYPES: { type: ThreadType; name: string; icon: string; desc: string }[] = [
  { type: 'reference', name: 'Reference', icon: '🔗', desc: 'artifact → artifact' },
  { type: 'context', name: 'Context', icon: '📍', desc: 'meeting → meeting' },
  { type: 'agent', name: 'Agent', icon: '🤖', desc: 'agent → outcome' },
  { type: 'sphere', name: 'Sphere', icon: '🌐', desc: 'sphere A → B' },
];

export const THREAD_AGENTS: ThreadAgent[] = [
  { type: 'thread_registrar', name: 'Thread Registrar', icon: '📝', responsibility: 'Validates structure, logs creation', constraint: 'Structure only', active: true },
  { type: 'thread_guard', name: 'Thread Guard', icon: '🛡️', responsibility: 'Enforces explicit reason', constraint: 'Blocks implicit inference', active: true },
  { type: 'thread_renderer', name: 'Thread Renderer', icon: '🎨', responsibility: 'Visual display', constraint: 'No semantic interpretation', active: true },
];

export const DEFAULT_VISUALIZATION: ThreadVisualization = {
  line_style: 'thin',
  color_grading: false,
  hover_highlight: true,
  type_toggle: { reference: true, context: true, agent: true, sphere: true },
};

export function createThread(
  type: ThreadType,
  source: ThreadEndpoint,
  target: ThreadEndpoint,
  reason: string,
  createdBy: string,
  visibility: ThreadVisibility = 'private'
): KnowledgeThread {
  if (!reason || reason.trim().length === 0) {
    throw new Error('Thread reason is REQUIRED - no silent threads allowed');
  }
  const timestamp = Date.now();
  return {
    id: `thread_${timestamp}_${Math.random().toString(36).slice(2)}`,
    type,
    source,
    target,
    created_by: createdBy,
    reason,
    timestamp,
    visibility,
    hash: `sha256_${timestamp}`,
    unlinked: false,
  };
}

export function unlinkThread(thread: KnowledgeThread): KnowledgeThread {
  return { ...thread, unlinked: true, unlinked_at: new Date().toISOString() };
}
