/**
 * CHE·NU — Threads Service
 */

import api from './api';

export interface Message {
  id: string;
  thread_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model_used?: string;
  tokens_input?: number;
  tokens_output?: number;
  processing_time_ms?: number;
  attachments?: Attachment[];
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'audio';
  name: string;
  url: string;
  size?: number;
  mime_type?: string;
}

export interface Thread {
  id: string;
  user_id: string;
  sphere_id?: string;
  title?: string;
  model: string;
  message_count: number;
  is_pinned: boolean;
  is_archived: boolean;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ThreadDetail extends Thread {
  messages: Message[];
  system_prompt?: string;
}

export interface ThreadListResponse {
  threads: Thread[];
  total: number;
  page: number;
  page_size: number;
}

export interface CreateThreadRequest {
  title?: string;
  sphere_id?: string;
  model?: string;
  system_prompt?: string;
  initial_message?: string;
}

export interface ChatRequest {
  message: string;
  attachments?: Attachment[];
  stream?: boolean;
}

export interface ChatResponse {
  message: Message;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  tier: string;
  max_tokens: number;
  supports_vision: boolean;
  supports_tools: boolean;
}

class ThreadsService {
  async getModels(): Promise<LLMModel[]> {
    return api.get<LLMModel[]>('/threads/models');
  }

  async list(params?: {
    sphere_id?: string;
    is_archived?: boolean;
    page?: number;
    page_size?: number;
  }): Promise<ThreadListResponse> {
    const queryParams: Record<string, string> = {};
    if (params?.sphere_id) queryParams.sphere_id = params.sphere_id;
    if (params?.is_archived !== undefined) queryParams.is_archived = String(params.is_archived);
    if (params?.page) queryParams.page = String(params.page);
    if (params?.page_size) queryParams.page_size = String(params.page_size);
    
    return api.get<ThreadListResponse>('/threads', queryParams);
  }

  async get(threadId: string): Promise<ThreadDetail> {
    return api.get<ThreadDetail>(`/threads/${threadId}`);
  }

  async create(data: CreateThreadRequest): Promise<Thread> {
    return api.post<Thread>('/threads', data);
  }

  async update(threadId: string, data: Partial<Thread>): Promise<Thread> {
    return api.patch<Thread>(`/threads/${threadId}`, data);
  }

  async delete(threadId: string): Promise<void> {
    await api.delete(`/threads/${threadId}`);
  }

  async chat(threadId: string, data: ChatRequest): Promise<ChatResponse> {
    return api.post<ChatResponse>(`/threads/${threadId}/chat`, data);
  }

  async *streamChat(threadId: string, message: string): AsyncGenerator<string> {
    yield* api.stream(`/threads/${threadId}/chat/stream`, {
      message,
      stream: true,
    });
  }

  async addFeedback(
    threadId: string,
    messageId: string,
    rating: 'positive' | 'negative',
    comment?: string
  ): Promise<void> {
    await api.post(`/threads/${threadId}/messages/${messageId}/feedback`, {
      message_id: messageId,
      rating,
      comment,
    });
  }
}

export const threadsService = new ThreadsService();
export default threadsService;
