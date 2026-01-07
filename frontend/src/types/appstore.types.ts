/**
 * CHE·NU™ — App Store Types
 * Types pour l'intégration d'applications
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORIES & STATUS
// ═══════════════════════════════════════════════════════════════════════════════

export type AppCategory = 
  | 'productivity'
  | 'communication'
  | 'finance'
  | 'creative'
  | 'ai_tools'
  | 'data'
  | 'security'
  | 'automation'
  | 'social'
  | 'entertainment';

export type AppStatus = 
  | 'available'
  | 'installed'
  | 'connected'
  | 'updating'
  | 'error';

// ═══════════════════════════════════════════════════════════════════════════════
// APP TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ChenuApp {
  id: string;
  name: string;
  description: string;
  category: AppCategory;
  icon: string;
  developer: string;
  version: string;
  rating: number;
  reviews: number;
  price: 'free' | number;
  features: string[];
  permissions: string[];
  sphereCompatibility: string[];
  status: AppStatus;
}

export interface AppConnection {
  appId: string;
  connectedAt: string;
  lastSync: string;
  status: 'active' | 'paused' | 'error';
  credentials?: {
    type: 'oauth' | 'api_key' | 'basic';
    expiresAt?: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORY CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

export interface CategoryConfig {
  id: AppCategory;
  name: string;
  nameFr: string;
  icon: string;
  color: string;
}

export const CATEGORY_CONFIG: Record<AppCategory, CategoryConfig> = {
  productivity: { id: 'productivity', name: 'Productivity', nameFr: 'Productivité', icon: '⚡', color: '#3EB4A2' },
  communication: { id: 'communication', name: 'Communication', nameFr: 'Communication', icon: '💬', color: '#3498DB' },
  finance: { id: 'finance', name: 'Finance', nameFr: 'Finance', icon: '💰', color: '#D8B26A' },
  creative: { id: 'creative', name: 'Creative', nameFr: 'Créatif', icon: '🎨', color: '#E74C3C' },
  ai_tools: { id: 'ai_tools', name: 'AI Tools', nameFr: 'Outils IA', icon: '🤖', color: '#9B59B6' },
  data: { id: 'data', name: 'Data', nameFr: 'Données', icon: '📊', color: '#1ABC9C' },
  security: { id: 'security', name: 'Security', nameFr: 'Sécurité', icon: '🔒', color: '#2C3E50' },
  automation: { id: 'automation', name: 'Automation', nameFr: 'Automatisation', icon: '⚙️', color: '#F39C12' },
  social: { id: 'social', name: 'Social', nameFr: 'Social', icon: '👥', color: '#E91E63' },
  entertainment: { id: 'entertainment', name: 'Entertainment', nameFr: 'Divertissement', icon: '🎬', color: '#673AB7' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// APP CATALOG
// ═══════════════════════════════════════════════════════════════════════════════

export const APP_CATALOG: ChenuApp[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Cloud storage and file sync',
    category: 'productivity',
    icon: '📁',
    developer: 'Google',
    version: '1.0.0',
    rating: 4.8,
    reviews: 15420,
    price: 'free',
    features: ['File sync', 'Collaboration', 'Backup'],
    permissions: ['files', 'offline'],
    sphereCompatibility: ['personal', 'business', 'team'],
    status: 'available',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'All-in-one workspace',
    category: 'productivity',
    icon: '📝',
    developer: 'Notion Labs',
    version: '2.0.0',
    rating: 4.7,
    reviews: 8930,
    price: 'free',
    features: ['Notes', 'Databases', 'Wiki'],
    permissions: ['files', 'calendar'],
    sphereCompatibility: ['personal', 'business', 'my_team', 'scholar'],
    status: 'available',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team communication',
    category: 'communication',
    icon: '💬',
    developer: 'Salesforce',
    version: '4.5.0',
    rating: 4.6,
    reviews: 12500,
    price: 'free',
    features: ['Messaging', 'Channels', 'Video calls'],
    permissions: ['notifications', 'contacts'],
    sphereCompatibility: ['business', 'team'],
    status: 'available',
  },
  {
    id: 'openai',
    name: 'OpenAI API',
    description: 'AI models integration',
    category: 'ai_tools',
    icon: '🤖',
    developer: 'OpenAI',
    version: '4.0.0',
    rating: 4.9,
    reviews: 5200,
    price: 'free',
    features: ['GPT-4', 'DALL-E', 'Whisper'],
    permissions: ['api_access'],
    sphereCompatibility: ['personal', 'business', 'design_studio', 'team'],
    status: 'available',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Accounting and invoicing',
    category: 'finance',
    icon: '💵',
    developer: 'Intuit',
    version: '3.0.0',
    rating: 4.5,
    reviews: 7800,
    price: 29.99,
    features: ['Invoicing', 'Reports', 'Tax prep'],
    permissions: ['finance', 'reports'],
    sphereCompatibility: ['business'],
    status: 'available',
  },
];
