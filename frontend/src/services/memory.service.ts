/**
 * CHE·NU — Memory Service
 */

import { AgentMemory, MemorySettings, MemoryStats, MemoryType, MemoryCategory } from '../types/memory.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class MemoryService {
  private getHeaders() {
    const token = localStorage.getItem('chenu_access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // CRUD Operations
  // ═══════════════════════════════════════════════════════════════

  async store(memory: Partial<AgentMemory>): Promise<AgentMemory> {
    const response = await fetch(`${API_URL}/memory`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(memory),
    });
    if (!response.ok) throw new Error('Failed to store memory');
    return response.json();
  }

  async get(id: string): Promise<AgentMemory | null> {
    const response = await fetch(`${API_URL}/memory/${id}`, {
      headers: this.getHeaders(),
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to get memory');
    return response.json();
  }

  async update(id: string, updates: Partial<AgentMemory>): Promise<AgentMemory> {
    const response = await fetch(`${API_URL}/memory/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update memory');
    return response.json();
  }

  async delete(id: string): Promise<void> {
    await fetch(`${API_URL}/memory/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // Query Operations
  // ═══════════════════════════════════════════════════════════════

  async recall(query: string, options?: {
    type?: MemoryType;
    category?: MemoryCategory;
    sphere?: string;
    limit?: number;
  }): Promise<AgentMemory[]> {
    const params = new URLSearchParams({ query, ...options as any });
    const response = await fetch(`${API_URL}/memory/recall?${params}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to recall memories');
    return response.json();
  }

  async search(embedding: number[], topK = 10): Promise<AgentMemory[]> {
    const response = await fetch(`${API_URL}/memory/search`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ embedding, top_k: topK }),
    });
    if (!response.ok) throw new Error('Failed to search memories');
    return response.json();
  }

  async list(options?: {
    type?: MemoryType;
    category?: MemoryCategory;
    sphere?: string;
    agent_id?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ memories: AgentMemory[]; total: number }> {
    const params = new URLSearchParams(options as any);
    const response = await fetch(`${API_URL}/memory?${params}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to list memories');
    return response.json();
  }

  // ═══════════════════════════════════════════════════════════════
  // Maintenance Operations
  // ═══════════════════════════════════════════════════════════════

  async consolidate(): Promise<{ merged: number; removed: number }> {
    const response = await fetch(`${API_URL}/memory/consolidate`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to consolidate memories');
    return response.json();
  }

  async prune(threshold: number): Promise<{ removed: number }> {
    const response = await fetch(`${API_URL}/memory/prune`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ threshold }),
    });
    if (!response.ok) throw new Error('Failed to prune memories');
    return response.json();
  }

  async clearAll(scope?: { type?: MemoryType; category?: MemoryCategory; sphere?: string }): Promise<{ removed: number }> {
    const response = await fetch(`${API_URL}/memory/clear`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(scope || {}),
    });
    if (!response.ok) throw new Error('Failed to clear memories');
    return response.json();
  }

  // ═══════════════════════════════════════════════════════════════
  // Settings & Stats
  // ═══════════════════════════════════════════════════════════════

  async getSettings(): Promise<MemorySettings> {
    const response = await fetch(`${API_URL}/memory/settings`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get memory settings');
    return response.json();
  }

  async updateSettings(settings: Partial<MemorySettings>): Promise<MemorySettings> {
    const response = await fetch(`${API_URL}/memory/settings`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error('Failed to update memory settings');
    return response.json();
  }

  async getStats(): Promise<MemoryStats> {
    const response = await fetch(`${API_URL}/memory/stats`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to get memory stats');
    return response.json();
  }

  // ═══════════════════════════════════════════════════════════════
  // Export Operations
  // ═══════════════════════════════════════════════════════════════

  async exportAll(format: 'json' | 'csv' = 'json'): Promise<Blob> {
    const response = await fetch(`${API_URL}/memory/export?format=${format}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to export memories');
    return response.blob();
  }

  async downloadExport(format: 'json' | 'csv' = 'json'): Promise<void> {
    const blob = await this.exportAll(format);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chenu-memories-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const memoryService = new MemoryService();
export default memoryService;
