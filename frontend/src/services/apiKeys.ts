/**
 * CHE·NU — API Keys Service
 * 
 * Service pour gérer les clés API utilisateur
 */

import { api } from './api';

export interface APIKeyConfig {
  id: string;
  provider: string;
  name?: string;
  key_preview: string;
  status: 'active' | 'invalid' | 'expired' | 'unchecked';
  is_enabled: boolean;
  last_verified?: string;
  last_used?: string;
  usage_count: number;
  created_at: string;
}

export interface APIKeyProvider {
  id: string;
  name: string;
  category: 'llm' | 'voice' | 'image' | 'other';
  description: string;
  docs_url: string;
  key_prefix?: string;
}

export interface CreateAPIKeyRequest {
  provider: string;
  key: string;
  name?: string;
}

export interface UpdateAPIKeyRequest {
  key?: string;
  name?: string;
  is_enabled?: boolean;
}

export interface VerifyAPIKeyResponse {
  provider: string;
  is_valid: boolean;
  status: string;
  message: string;
  verified_at: string;
}

export const apiKeysService = {
  /**
   * Liste toutes les clés API configurées
   */
  async listKeys(): Promise<APIKeyConfig[]> {
    return api.get('/api-keys/');
  },

  /**
   * Liste tous les providers supportés
   */
  async listProviders(): Promise<{ providers: APIKeyProvider[] }> {
    return api.get('/api-keys/providers');
  },

  /**
   * Récupère une clé API spécifique
   */
  async getKey(provider: string): Promise<APIKeyConfig> {
    return api.get(`/api-keys/${provider}`);
  },

  /**
   * Crée une nouvelle clé API
   */
  async createKey(data: CreateAPIKeyRequest): Promise<APIKeyConfig> {
    return api.post('/api-keys/', data);
  },

  /**
   * Met à jour une clé API
   */
  async updateKey(provider: string, data: UpdateAPIKeyRequest): Promise<APIKeyConfig> {
    return api.put(`/api-keys/${provider}`, data);
  },

  /**
   * Supprime une clé API
   */
  async deleteKey(provider: string): Promise<void> {
    return api.delete(`/api-keys/${provider}`);
  },

  /**
   * Vérifie la validité d'une clé API
   */
  async verifyKey(provider: string): Promise<VerifyAPIKeyResponse> {
    return api.post(`/api-keys/${provider}/verify`);
  },

  /**
   * Récupère les statistiques d'utilisation
   */
  async getUsage(provider: string): Promise<{
    provider: string;
    usage_count: number;
    last_used?: string;
    total_tokens: number;
    total_cost: number;
  }> {
    return api.get(`/api-keys/${provider}/usage`);
  },
};

export default apiKeysService;
