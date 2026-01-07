/**
 * CHE·NU — Constants & Configuration
 */

export const APP_NAME = 'CHE·NU';
export const APP_TAGLINE = 'Chez Nous — Votre Maison Numérique';
export const APP_VERSION = '27.0.0';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

// Colors
export const COLORS = {
  // Base
  bg: '#0D1210',
  bgSecondary: '#121816',
  card: '#151A18',
  cardHover: '#1E2422',
  border: '#2A3530',
  
  // Brand
  sand: '#D8B26A',
  sage: '#3F7249',
  sageLight: '#4A8654',
  sageDark: '#2D5233',
  cyan: '#00E5FF',
  
  // Text
  text: '#E8E4DD',
  textSecondary: '#B8B4AD',
  muted: '#888888',
  
  // Status
  success: '#4ADE80',
  error: '#FF6B6B',
  warning: '#F39C12',
  info: '#00E5FF',
};

// Spheres
export const SPHERES = [
  { id: 'personal', name: 'Personal', icon: '👤', color: '#4A90D9', description: 'Gestion personnelle, finances, tâches' },
  { id: 'enterprise', name: 'Enterprise', icon: '🏢', color: '#2ECC71', description: 'Multi-entreprises, départements' },
  { id: 'creative', name: 'Creative Studio', icon: '🎨', color: '#9B59B6', description: 'Production créative, contenu' },
  { id: 'architecture', name: 'Architecture', icon: '📐', color: '#E67E22', description: 'Design architectural, BIM' },
  { id: 'social', name: 'Social Media', icon: '📱', color: '#E74C3C', description: 'Réseaux sociaux, posts' },
  { id: 'community', name: 'Community', icon: '🏘️', color: '#1ABC9C', description: 'Marketplace, forum, groupes' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#F39C12', description: 'Streaming, médias' },
  { id: 'ai-labs', name: 'AI Labs', icon: '🧪', color: '#00E5FF', description: 'Laboratoire IA, agents' },
  { id: 'design', name: 'Design Studio', icon: '🎭', color: '#8E44AD', description: 'Systèmes visuels, UI/UX' },
];

// LLM Providers
export const LLM_PROVIDERS = {
  anthropic: { name: 'Anthropic', color: '#D4A76C' },
  openai: { name: 'OpenAI', color: '#10A37F' },
  google: { name: 'Google', color: '#4285F4' },
  mistral: { name: 'Mistral', color: '#FF7000' },
  cohere: { name: 'Cohere', color: '#39594D' },
  groq: { name: 'Groq', color: '#F55036' },
  ollama: { name: 'Ollama', color: '#000000' },
  perplexity: { name: 'Perplexity', color: '#1FB8CD' },
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  ONBOARDING: '/onboarding',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  AI_LABS: '/ai-labs',
  SPHERE: (id: string) => `/sphere/${id}`,
  THREAD: (id: string) => `/thread/${id}`,
  TOOL: (id: string) => `/tools/${id}`,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH: 'chenu-auth',
  UI: 'chenu-ui',
  ACCESS_TOKEN: 'chenu_access_token',
  REFRESH_TOKEN: 'chenu_refresh_token',
  TOKEN_EXPIRES: 'chenu_token_expires',
};

// Keyboard Shortcuts
export const SHORTCUTS = {
  SEARCH: 'mod+k',
  NOVA: 'mod+j',
  NEW_THREAD: 'mod+n',
  SETTINGS: 'mod+,',
};
