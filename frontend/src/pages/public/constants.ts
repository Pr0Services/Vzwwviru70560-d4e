/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — PUBLIC PAGES CONSTANTS                          ║
 * ║                    Constantes partagées pour les pages publiques             ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// COULEURS CHE·NU
// ═══════════════════════════════════════════════════════════════════════════════

export const COLORS = {
  // Primaires
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  
  // UI
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  
  // États
  success: '#4ADE80',
  error: '#FF6B6B',
  warning: '#FFB800',
  info: '#3B82F6',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SPHÈRES
// ═══════════════════════════════════════════════════════════════════════════════

export const SPHERES = [
  { id: 'personal', name: 'Personnel', nameFr: 'Personnel', emoji: '🏠', color: '#3EB4A2' },
  { id: 'business', name: 'Business', nameFr: 'Entreprise', emoji: '💼', color: '#D8B26A' },
  { id: 'government', name: 'Government', nameFr: 'Gouvernement', emoji: '🏛️', color: '#8D8371' },
  { id: 'design_studio', name: 'Creative Studio', nameFr: 'Studio Créatif', emoji: '🎨', color: '#7A593A' },
  { id: 'community', name: 'Community', nameFr: 'Communauté', emoji: '👥', color: '#3F7249' },
  { id: 'social', name: 'Social & Media', nameFr: 'Social & Média', emoji: '📱', color: '#2F4C39' },
  { id: 'entertainment', name: 'Entertainment', nameFr: 'Divertissement', emoji: '🎬', color: '#E9E4D6' },
  { id: 'my_team', name: 'My Team', nameFr: 'Mon Équipe', emoji: '🤝', color: '#5ED8FF' },
  { id: 'scholars', name: 'Scholars', nameFr: 'Scholars', emoji: '🎓', color: '#9B59B6' },
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// PRICING
// ═══════════════════════════════════════════════════════════════════════════════

export const PRICING_TIERS = {
  // Particuliers
  free: {
    id: 'free',
    name: 'Découverte',
    price: 0,
    billing: 'Gratuit pour toujours',
    requests: 75,
    spheres: 3,
    agents: 1,
    storage: '1 GB',
    features: ['75 requêtes/mois', '3 sphères', '1 agent', '1 GB stockage'],
  },
  base: {
    id: 'base',
    name: 'Base',
    price: 9.99,
    billing: '/mois',
    requests: 200,
    spheres: 6,
    agents: 3,
    storage: '5 GB',
    features: ['200 requêtes/mois', '6 sphères', '3 agents', '5 GB stockage'],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 39.99,
    billing: '/mois',
    requests: 1000,
    spheres: 9,
    agents: 10,
    storage: '25 GB',
    popular: true,
    features: ['1,000 requêtes/mois', '9 sphères', '10 agents', '25 GB stockage', 'API accès'],
  },
  // Entreprises
  team: {
    id: 'my_team',
    name: 'Team',
    price: 99,
    billing: '/mois',
    requests: 5000,
    users: 15,
    agents: 25,
    storage: '100 GB',
    features: ['15 utilisateurs', '5,000 requêtes/mois', '25 agents', '100 GB stockage'],
  },
  business: {
    id: 'business',
    name: 'Business',
    price: 299,
    billing: '/mois',
    requests: 20000,
    users: 50,
    agents: 100,
    storage: '500 GB',
    features: ['50 utilisateurs', '20,000 requêtes/mois', '100 agents', '500 GB stockage', 'SSO'],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 599,
    billing: '/mois',
    requests: 75000,
    users: 200,
    agents: 500,
    storage: '2 TB',
    features: ['200 utilisateurs', '75,000 requêtes/mois', '500 agents', '2 TB stockage', 'SLA 99.9%'],
  },
  mega: {
    id: 'mega',
    name: 'Mega Enterprise',
    price: 999,
    billing: '/mois',
    requests: 200000,
    users: 'Illimité',
    agents: 'Illimité',
    storage: '10 TB',
    features: ['Utilisateurs illimités', '200,000 requêtes/mois', 'Agents illimités', '10 TB', 'On-premise'],
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACTS
// ═══════════════════════════════════════════════════════════════════════════════

export const CONTACT_EMAILS = {
  support: 'support@che-nu.com',
  privacy: 'privacy@che-nu.com',
  legal: 'legal@che-nu.com',
  security: 'security@che-nu.com',
  invest: 'invest@che-nu.com',
  press: 'press@che-nu.com',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SOCIAL LINKS
// ═══════════════════════════════════════════════════════════════════════════════

export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/chenu_ai',
  linkedin: 'https://linkedin.com/company/chenu',
  github: 'https://github.com/chenu',
  discord: 'https://discord.gg/chenu',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// COMPANY INFO
// ═══════════════════════════════════════════════════════════════════════════════

export const COMPANY = {
  name: 'CHE·NU Inc.',
  legalName: 'CHE·NU Inc.',
  tagline: 'Governed Intelligence Operating System',
  taglineFr: 'Système d\'Exploitation à Intelligence Gouvernée',
  founded: 2024,
  location: 'Montréal, Québec, Canada',
  website: 'https://che-nu.com',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// STATS / METRICS
// ═══════════════════════════════════════════════════════════════════════════════

export const METRICS = {
  agents: 226,
  spheres: 9,
  bureauSections: 10,
  targetUsers2026: 70000,
  projectedARR: 5200000,
  grossMargin: 0.75,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// BUREAU SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const BUREAU_SECTIONS = [
  { id: 'dashboard', name: 'Dashboard', nameFr: 'Tableau de bord' },
  { id: 'notes', name: 'Notes', nameFr: 'Notes' },
  { id: 'tasks', name: 'Tasks', nameFr: 'Tâches' },
  { id: 'projects', name: 'Projects', nameFr: 'Projets' },
  { id: 'threads', name: 'Threads', nameFr: 'Fils' },
  { id: 'meetings', name: 'Meetings', nameFr: 'Réunions' },
  { id: 'data', name: 'Data', nameFr: 'Données' },
  { id: 'agents', name: 'Agents', nameFr: 'Agents' },
  { id: 'reports', name: 'Reports', nameFr: 'Rapports' },
  { id: 'budget', name: 'Budget', nameFr: 'Budget' },
] as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ACCESSIBILITY HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export const A11Y = {
  skipToContent: 'Aller au contenu principal',
  mainNavigation: 'Navigation principale',
  footerNavigation: 'Navigation pied de page',
  openMenu: 'Ouvrir le menu',
  closeMenu: 'Fermer le menu',
  loading: 'Chargement en cours...',
  required: 'Champ requis',
} as const;

export default {
  COLORS,
  SPHERES,
  PRICING_TIERS,
  CONTACT_EMAILS,
  SOCIAL_LINKS,
  COMPANY,
  METRICS,
  BUREAU_SECTIONS,
  A11Y,
};
