// ============================================================
// CHE·NU - Integrations Service
// ============================================================

import { api } from './api'
import type { IntegrationStatus, IntegrationSummary, LLMModel, LLMProvider, ChatMessage, ChatResponse } from '@/types'

export const integrationsService = {
  // Status
  async getStatus(): Promise<Record<string, IntegrationStatus[]>> {
    return api.get('/integrations/status')
  },

  async getSummary(): Promise<IntegrationSummary> {
    return api.get('/integrations/summary')
  },

  // LLM
  async getLLMModels(): Promise<{ models: LLMModel[] }> {
    return api.get('/integrations/llm/models')
  },

  async getLLMProviders(): Promise<{ providers: LLMProvider[] }> {
    return api.get('/integrations/llm/providers')
  },

  async chat(messages: ChatMessage[], model?: string): Promise<ChatResponse> {
    return api.post('/integrations/llm/chat', {
      messages,
      model: model || 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
    })
  },

  async recommendModel(taskType: string, budget: string): Promise<{ recommended: LLMModel | null }> {
    return api.post(`/integrations/llm/recommend?task_type=${taskType}&budget=${budget}`)
  },

  // Voice
  async getVoices(provider: string = 'elevenlabs'): Promise<{ voices: { id: string; name: string }[] }> {
    return api.get(`/integrations/voice/voices?provider=${provider}`)
  },

  async textToSpeech(text: string, provider: string = 'elevenlabs'): Promise<Blob> {
    const response = await fetch(`/api/v1/integrations/voice/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, provider }),
    })
    return response.blob()
  },

  // Creative
  async generateImage(prompt: string, provider: string = 'dalle'): Promise<{ images: string[] }> {
    return api.post('/integrations/creative/generate-image', {
      prompt,
      provider,
      size: '1024x1024',
    })
  },
}
