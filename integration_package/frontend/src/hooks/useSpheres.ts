/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — useSpheres Hook                             ║
 * ║                                                                              ║
 * ║  Hook for accessing the 9 spheres                                            ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useMemo, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type SphereId = 
  | 'personal'
  | 'business'
  | 'government'
  | 'studio'
  | 'community'
  | 'social'
  | 'entertainment'
  | 'team'
  | 'scholar';

export type BureauSectionType = 
  | 'QuickCapture'
  | 'ResumeWorkspace'
  | 'Threads'
  | 'DataFiles'
  | 'ActiveAgents'
  | 'Meetings';

export interface BureauSection {
  id: string;
  type: BureauSectionType;
  name: string;
  icon: string;
  description: string;
}

export interface Sphere {
  id: SphereId;
  name: string;
  name_fr: string;
  icon: string;
  color: string;
  description: string;
  description_fr: string;
  sections: BureauSection[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERES DATA (9 Spheres - Frozen Architecture)
// ═══════════════════════════════════════════════════════════════════════════════

const BUREAU_SECTIONS: BureauSection[] = [
  { id: 'quick-capture', type: 'QuickCapture', name: 'Quick Capture', icon: '⚡', description: 'Capture rapide d\'idées et notes' },
  { id: 'resume-workspace', type: 'ResumeWorkspace', name: 'Resume Workspace', icon: '📂', description: 'Reprendre le travail en cours' },
  { id: 'threads', type: 'Threads', name: 'Threads', icon: '🧵', description: 'Fils de discussion et projets' },
  { id: 'data-files', type: 'DataFiles', name: 'DataFiles', icon: '📁', description: 'Fichiers et documents' },
  { id: 'active-agents', type: 'ActiveAgents', name: 'Active Agents', icon: '🤖', description: 'Agents actifs dans cette sphère' },
  { id: 'meetings', type: 'Meetings', name: 'Meetings', icon: '📅', description: 'Réunions et rendez-vous' },
];

export const SPHERES: Sphere[] = [
  {
    id: 'personal',
    name: 'Personal',
    name_fr: 'Personnel',
    icon: '👤',
    color: '#3EB4A2',
    description: 'Personal life management',
    description_fr: 'Gestion de la vie personnelle',
    sections: BUREAU_SECTIONS,
  },
  {
    id: 'business',
    name: 'Business',
    name_fr: 'Entreprise',
    icon: '💼',
    color: '#D8B26A',
    description: 'Business and professional activities',
    description_fr: 'Activités professionnelles et d\'entreprise',
    sections: BUREAU_SECTIONS,
  },
  {
    id: 'government',
    name: 'Government & Institutions',
    name_fr: 'Gouvernement & Institutions',
    icon: '🏛️',
    color: '#8D8371',
    description: 'Government and institutional relations',
    description_fr: 'Relations gouvernementales et institutionnelles',
    sections: BUREAU_SECTIONS,
  },
  {
    id: 'studio',
    name: 'Creative Studio',
    name_fr: 'Studio Créatif',
    icon: '🎨',
    color: '#9B6B9E',
    description: 'Creative projects and design',
    description_fr: 'Projets créatifs et design',
    sections: BUREAU_SECTIONS,
  },
  {
    id: 'community',
    name: 'Community',
    name_fr: 'Communauté',
    icon: '🌍',
    color: '#3F7249',
    description: 'Community engagement and networks',
    description_fr: 'Engagement communautaire et réseaux',
    sections: BUREAU_SECTIONS,
  },
  {
    id: 'social',
    name: 'Social & Media',
    name_fr: 'Social & Médias',
    icon: '📱',
    color: '#5B8DEE',
    description: 'Social media and public presence',
    description_fr: 'Médias sociaux et présence publique',
    sections: BUREAU_SECTIONS,
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    name_fr: 'Divertissement',
    icon: '🎮',
    color: '#E85D75',
    description: 'Leisure and entertainment',
    description_fr: 'Loisirs et divertissement',
    sections: BUREAU_SECTIONS,
  },
  {
    id: 'team',
    name: 'My Team',
    name_fr: 'Mon Équipe',
    icon: '👥',
    color: '#FF9F43',
    description: 'Team management and collaboration',
    description_fr: 'Gestion d\'équipe et collaboration',
    sections: BUREAU_SECTIONS,
  },
  {
    id: 'scholar',
    name: 'Scholar',
    name_fr: 'Académique',
    icon: '📚',
    color: '#6C5CE7',
    description: 'Research, learning and knowledge',
    description_fr: 'Recherche, apprentissage et connaissances',
    sections: BUREAU_SECTIONS,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseSpheresReturn {
  spheres: Sphere[];
  getSphere: (id: SphereId) => Sphere | undefined;
  getSphereColor: (id: SphereId) => string;
  getSphereIcon: (id: SphereId) => string;
  getSphereName: (id: SphereId, lang?: 'en' | 'fr') => string;
  activeSphere: Sphere | null;
  setActiveSphere: (id: SphereId | null) => void;
}

export function useSpheres(): UseSpheresReturn {
  const [activeSphereId, setActiveSphereId] = useState<SphereId | null>(null);

  const getSphere = useCallback((id: SphereId) => {
    return SPHERES.find(s => s.id === id);
  }, []);

  const getSphereColor = useCallback((id: SphereId) => {
    return getSphere(id)?.color || '#666';
  }, [getSphere]);

  const getSphereIcon = useCallback((id: SphereId) => {
    return getSphere(id)?.icon || '📂';
  }, [getSphere]);

  const getSphereName = useCallback((id: SphereId, lang: 'en' | 'fr' = 'fr') => {
    const sphere = getSphere(id);
    return lang === 'fr' ? sphere?.name_fr || id : sphere?.name || id;
  }, [getSphere]);

  const activeSphere = useMemo(() => {
    return activeSphereId ? getSphere(activeSphereId) || null : null;
  }, [activeSphereId, getSphere]);

  const setActiveSphere = useCallback((id: SphereId | null) => {
    setActiveSphereId(id);
  }, []);

  return {
    spheres: SPHERES,
    getSphere,
    getSphereColor,
    getSphereIcon,
    getSphereName,
    activeSphere,
    setActiveSphere,
  };
}

export default useSpheres;
export { SPHERES, BUREAU_SECTIONS };
