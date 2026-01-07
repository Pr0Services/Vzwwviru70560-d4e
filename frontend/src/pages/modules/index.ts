/**
 * CHE·NU V26 - Module Pages Index
 * Status: SAFE • NON-AUTONOMOUS • REPRESENTATIONAL
 * 
 * ❤️ With love, for humanity.
 */

// Core Modules
export { NovaPage, default as Nova } from './NovaPage';
export { ForumPage } from './ForumPage';
export { SocialPage } from './SocialPage';
export { StreamingPage } from './StreamingPage';
export { CheLearnPage } from './CheLearnPage';
export { IALaboratoryPage, default as IALaboratory } from './IALaboratoryPage';
export { IALearningPage } from './IALearningPage';

// NEW: Specialized Modules (v26)
export { default as ConstructionPage } from './ConstructionPage';
export { default as ScholarPage } from './ScholarPage';
export { default as EntertainmentPage } from './EntertainmentPage';
export { default as XRImmersivePage } from './XRImmersivePage';

/**
 * Module Registry for routing
 */
export const MODULE_REGISTRY = {
  nova: {
    path: '/nova',
    component: 'NovaPage',
    icon: '✨',
    label: 'Nova AI',
    category: 'core',
  },
  forum: {
    path: '/forum',
    component: 'ForumPage',
    icon: '💬',
    label: 'Forum',
    category: 'social',
  },
  social: {
    path: '/social',
    component: 'SocialPage',
    icon: '👥',
    label: 'Social',
    category: 'social',
  },
  streaming: {
    path: '/streaming',
    component: 'StreamingPage',
    icon: '📺',
    label: 'Streaming',
    category: 'entertainment',
  },
  chelearn: {
    path: '/chelearn',
    component: 'CheLearnPage',
    icon: '📚',
    label: 'CheLearn',
    category: 'education',
  },
  ialab: {
    path: '/ia-lab',
    component: 'IALaboratoryPage',
    icon: '🧪',
    label: 'IA Laboratory',
    category: 'ai',
  },
  construction: {
    path: '/construction',
    component: 'ConstructionPage',
    icon: '🏗️',
    label: 'Construction QC',
    category: 'specialized',
  },
  scholar: {
    path: '/scholar',
    component: 'ScholarPage',
    icon: '📚',
    label: 'Scholar',
    category: 'education',
  },
  entertainment: {
    path: '/entertainment',
    component: 'EntertainmentPage',
    icon: '🎬',
    label: 'Entertainment',
    category: 'entertainment',
  },
  xr: {
    path: '/xr',
    component: 'XRImmersivePage',
    icon: '🌌',
    label: 'XR Immersive',
    category: 'xr',
  },
} as const;
