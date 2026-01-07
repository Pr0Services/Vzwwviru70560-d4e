/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — AGENT BUILDER HOOK
 * Phase 8: Advanced AI Features
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback, useEffect } from 'react';

export interface AgentTemplate {
  template_id: string;
  name: string;
  description: string;
  level: string;
  base_prompt: string;
  capabilities: string[];
  max_tokens: number;
  temperature: number;
  category: string;
  tags: string[];
  downloads: number;
  rating: number;
  tokens_per_execution: number;
}

export function useAgentBuilder() {
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/ai/templates', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch templates');

      const data = await response.json();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const createAgent = useCallback(async (
    templateId: string,
    name: string,
    config: unknown
  ) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/ai/agents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: templateId,
          name,
          ...config,
        }),
      });

      if (!response.ok) throw new Error('Failed to create agent');

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const estimateCost = useCallback((maxTokens: number) => {
    // $0.02 per 1K tokens (approximation)
    return (maxTokens / 1000) * 0.02;
  }, []);

  return {
    templates,
    isLoading,
    error,
    createAgent,
    estimateCost,
  };
}
