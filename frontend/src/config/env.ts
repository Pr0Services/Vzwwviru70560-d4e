/**
 * CHE·NU — Environment Configuration
 */

export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws',
  },
  
  app: {
    name: 'CHE·NU',
    version: '1.0.0',
    description: 'Chez Nous - Votre maison numérique',
  },
  
  features: {
    nova: true,
    multiLLM: true,
    memory: true,
    spheres: true,
    externalConnections: true,
  },
  
  llm: {
    defaultModel: 'claude-3-5-sonnet',
    defaultProvider: 'anthropic',
  },
  
  storage: {
    tokenKey: 'chenu_access_token',
    refreshKey: 'chenu_refresh_token',
    userKey: 'chenu_user',
    prefsKey: 'chenu_preferences',
  },
  
  ui: {
    sidebarWidth: 260,
    headerHeight: 60,
    novaPanelWidth: 400,
  },
};

export default config;
