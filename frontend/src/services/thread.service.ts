/**
 * CHE·NU — Thread Service
 */

import { Thread, Message, Attachment, LLMModel, LLMProvider } from '../types/thread.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// LLM Models disponibles
export const LLM_MODELS: LLMModel[] = [
  // Premium Tier
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic', tier: 'premium', context_window: 200000, description: 'Meilleur équilibre performance/coût' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic', tier: 'premium', context_window: 200000, description: 'Plus intelligent' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', tier: 'premium', context_window: 128000, description: 'Multimodal avancé' },
  { id: 'gpt-o1', name: 'GPT o1', provider: 'openai', tier: 'premium', context_window: 128000, description: 'Raisonnement profond' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'google', tier: 'premium', context_window: 1000000, description: 'Contexte géant' },
  
  // Standard Tier
  { id: 'mistral-large', name: 'Mistral Large', provider: 'mistral', tier: 'standard', context_window: 32000, description: 'Open-weight performant' },
  { id: 'command-r-plus', name: 'Command R+', provider: 'cohere', tier: 'standard', context_window: 128000, description: 'Spécialisé RAG' },
  
  // Speed Tier
  { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', provider: 'groq', tier: 'speed', context_window: 128000, description: 'Ultra rapide' },
  { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', provider: 'groq', tier: 'speed', context_window: 32000, description: 'MoE rapide' },
  
  // Local Tier
  { id: 'llama-3.2', name: 'Llama 3.2', provider: 'ollama', tier: 'local', context_window: 128000, description: 'Local privé' },
  { id: 'codellama', name: 'CodeLlama', provider: 'ollama', tier: 'local', context_window: 16000, description: 'Spécialisé code' },
  
  // Search
  { id: 'sonar-pro', name: 'Sonar Pro', provider: 'perplexity', tier: 'standard', context_window: 200000, description: 'Recherche web intégrée' },
];

class ThreadService {
  private getHeaders() {
    const token = localStorage.getItem('chenu_access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async createThread(data: Partial<Thread>): Promise<Thread> {
    const response = await fetch(`${API_URL}/threads`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create thread');
    return response.json();
  }

  async getThread(id: string): Promise<Thread> {
    const response = await fetch(`${API_URL}/threads/${id}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get thread');
    return response.json();
  }

  async listThreads(params?: { sphere_id?: string; status?: string }): Promise<Thread[]> {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_URL}/threads?${query}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to list threads');
    return response.json();
  }

  async archiveThread(id: string): Promise<void> {
    await fetch(`${API_URL}/threads/${id}/archive`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
  }

  async deleteThread(id: string): Promise<void> {
    await fetch(`${API_URL}/threads/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
  }

  async getMessages(threadId: string): Promise<Message[]> {
    const response = await fetch(`${API_URL}/threads/${threadId}/messages`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get messages');
    return response.json();
  }

  async sendMessage(threadId: string, content: string, attachments?: File[]): Promise<Message> {
    const formData = new FormData();
    formData.append('content', content);
    if (attachments) {
      attachments.forEach(file => formData.append('attachments', file));
    }

    const token = localStorage.getItem('chenu_access_token');
    const response = await fetch(`${API_URL}/threads/${threadId}/messages`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  }

  async sendMessageStream(
    threadId: string,
    content: string,
    onChunk: (text: string) => void,
    onComplete: (message: Message) => void,
    onError: (error: Error) => void,
  ): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/threads/${threadId}/messages/stream`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullContent += chunk;
        onChunk(fullContent);
      }

      // Parse final message from response
      onComplete({
        id: crypto.randomUUID(),
        thread_id: threadId,
        role: 'assistant',
        content: fullContent,
        content_type: 'markdown',
        attachments: [],
        status: 'sent',
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      onError(error as Error);
    }
  }

  async provideFeedback(messageId: string, rating: 'positive' | 'negative', comment?: string): Promise<void> {
    await fetch(`${API_URL}/messages/${messageId}/feedback`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ rating, comment }),
    });
  }

  getAvailableModels(tier?: string): LLMModel[] {
    if (tier) {
      return LLM_MODELS.filter(m => m.tier === tier);
    }
    return LLM_MODELS;
  }

  getModelByProvider(provider: LLMProvider): LLMModel[] {
    return LLM_MODELS.filter(m => m.provider === provider);
  }
}

export const threadService = new ThreadService();
export default threadService;
