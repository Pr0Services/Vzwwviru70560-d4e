// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU — CHAT & VOCAL API + HOOKS
// CANONICAL BLOCK — COPY/PASTE SAFE
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  Message,
  MessageType,
  MessagePriority,
  Thread,
  AgentInbox,
  AgentTask,
  VoiceSession,
  VoiceState,
  VoiceConfig,
  SendMessageRequest,
  SendMessageResponse,
  GetMessagesRequest,
  GetMessagesResponse,
  ChatEvent,
} from './types';
import { DEFAULT_CHAT_CONFIG } from './types';

/* =========================================================
   1. API CLIENT
========================================================= */

const API_BASE = '/api/chat';

export const chatApi = {
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return response.json();
  },

  async getMessages(request: GetMessagesRequest): Promise<GetMessagesResponse> {
    const params = new URLSearchParams({
      threadId: request.threadId,
      ...(request.limit && { limit: String(request.limit) }),
      ...(request.before && { before: request.before }),
      ...(request.after && { after: request.after }),
    });
    const response = await fetch(`${API_BASE}/messages?${params}`);
    return response.json();
  },

  async markAsRead(messageIds: string[]): Promise<void> {
    await fetch(`${API_BASE}/messages/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageIds }),
    });
  },

  async getThread(threadId: string): Promise<Thread> {
    const response = await fetch(`${API_BASE}/threads/${threadId}`);
    return response.json();
  },

  async getAgentInbox(agentId: string): Promise<AgentInbox> {
    const response = await fetch(`${API_BASE}/agents/${agentId}/inbox`);
    return response.json();
  },

  async getAgentTasks(agentId: string): Promise<AgentTask[]> {
    const response = await fetch(`${API_BASE}/agents/${agentId}/tasks`);
    return response.json();
  },
};

/* =========================================================
   2. HOOKS: useAgentMailbox
========================================================= */

export function useAgentMailbox(agentId: string) {
  const [inbox, setInbox] = useState<AgentInbox | null>(null);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [inboxData, tasksData] = await Promise.all([
        chatApi.getAgentInbox(agentId),
        chatApi.getAgentTasks(agentId),
      ]);
      setInbox(inboxData);
      setTasks(tasksData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { inbox, tasks, loading, error, refresh };
}

/* =========================================================
   3. HOOKS: useTeamMailboxes
========================================================= */

export function useTeamMailboxes(agentIds: string[]) {
  const [inboxes, setInboxes] = useState<AgentInbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (agentIds.length === 0) {
      setInboxes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await Promise.all(agentIds.map(id => chatApi.getAgentInbox(id)));
      setInboxes(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [agentIds.join(',')]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { inboxes, loading, error, refresh };
}

/* =========================================================
   4. HOOKS: useVoiceRecording
========================================================= */

export function useVoiceRecording(config: VoiceConfig = DEFAULT_CHAT_CONFIG.voiceConfig) {
  const [session, setSession] = useState<VoiceSession>({
    id: '',
    state: 'idle',
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported = typeof window !== 'undefined' && (
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );

  const start = useCallback(() => {
    if (!isSupported) {
      setSession(s => ({
        ...s,
        state: 'error',
        error: { code: 'NOT_SUPPORTED', message: 'Voice recognition not supported' },
      }));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = config.language;
    recognition.continuous = config.continuous;
    recognition.interimResults = config.interimResults;

    recognition.onstart = () => {
      setSession({
        id: crypto.randomUUID(),
        state: 'listening',
        startedAt: Date.now(),
      });
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = Array.from(event.results);
      const lastResult = results[results.length - 1];
      
      if (lastResult.isFinal) {
        setSession(s => ({
          ...s,
          state: 'confirming',
          transcript: lastResult[0].transcript,
          confidence: lastResult[0].confidence,
        }));
      } else {
        setSession(s => ({
          ...s,
          transcript: lastResult[0].transcript,
        }));
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setSession(s => ({
        ...s,
        state: 'error',
        error: { code: event.error, message: event.message || 'Recognition error' },
      }));
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [config, isSupported]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const cancel = useCallback(() => {
    recognitionRef.current?.abort();
    setSession({ id: '', state: 'idle' });
  }, []);

  const confirm = useCallback((): string | null => {
    const transcript = session.transcript;
    setSession({ id: '', state: 'idle' });
    return transcript || null;
  }, [session.transcript]);

  return { session, start, stop, cancel, confirm, isSupported };
}

/* =========================================================
   5. HOOKS: useTaskQueue
========================================================= */

export function useTaskQueue(agentId: string) {
  const [queue, setQueue] = useState<AgentTask[]>([]);
  const [processing, setProcessing] = useState<AgentTask | null>(null);

  useEffect(() => {
    chatApi.getAgentTasks(agentId).then(tasks => {
      const pending = tasks.filter(t => t.status === 'pending');
      const inProgress = tasks.find(t => t.status === 'in_progress');
      setQueue(pending);
      setProcessing(inProgress || null);
    });
  }, [agentId]);

  const processNext = useCallback(async () => {
    if (queue.length === 0 || processing) return;
    
    const next = queue[0];
    setQueue(q => q.slice(1));
    setProcessing(next);
  }, [queue, processing]);

  const complete = useCallback(async (success: boolean, output?: string) => {
    if (!processing) return;
    setProcessing(null);
  }, [processing]);

  return { queue, processing, processNext, complete };
}

/* =========================================================
   6. UTILITIES
========================================================= */

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

export function extractDeadline(text: string): number | null {
  const patterns = [
    /pour\s+(demain|aujourd'hui)/i,
    /avant\s+(\d{1,2}[h:]\d{2})/i,
    /d'ici\s+(\d+)\s+(heure|jour|semaine)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const now = Date.now();
      if (match[1] === 'demain') return now + 24 * 60 * 60 * 1000;
      if (match[1] === "aujourd'hui") return now + 12 * 60 * 60 * 1000;
    }
  }
  return null;
}

export function extractPriority(text: string): MessagePriority {
  if (/urgent|asap|immédiat/i.test(text)) return 'urgent';
  if (/important|priorit/i.test(text)) return 'high';
  if (/quand.*poss|pas.*pressé/i.test(text)) return 'low';
  return 'normal';
}

export function detectMessageType(text: string): MessageType {
  if (/\?$/m.test(text)) return 'QUESTION';
  if (/^(fais|fait|créer|crée|génère|analyse|prépare|envoie)/i.test(text)) return 'TASK';
  if (/^(décision|je décide|on décide|validé|approuvé)/i.test(text)) return 'DECISION';
  if (/^(note|fyi|info|pour info)/i.test(text)) return 'NOTE';
  return 'NOTE';
}

/* =========================================================
   7. INDEX EXPORT
========================================================= */

export const index = {
  chatApi,
  useAgentMailbox,
  useTeamMailboxes,
  useVoiceRecording,
  useTaskQueue,
  formatDuration,
  extractDeadline,
  extractPriority,
  detectMessageType,
};

export default index;
