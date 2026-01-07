/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — CONTEXT ENGINE                                        ║
 * ║              Core Engine 2/6                                                 ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  "Context is everything. CHE·NU operates by CONTEXT, not by features."      ║
 * ║  "Contexts are called SPHERES. Each SPHERE opens a complete BUREAU."        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SPHERE DEFINITIONS (FROZEN - 9 SPHERES EXACTEMENT)
// ═══════════════════════════════════════════════════════════════════════════════

export type SphereId = 
  | 'personal'           // 🏠 Personnel
  | 'business'           // 💼 Entreprises
  | 'government'         // 🏛️ Gouvernement & Institutions
  | 'creative_studio'    // 🎨 Creative Studio
  | 'community'          // 👥 Community
  | 'social_media'       // 📱 Social & Media
  | 'entertainment'      // 🎬 Entertainment
  | 'my_team'            // 🤝 My Team
  | 'scholar';           // 📚 Scholar

export interface Sphere {
  id: SphereId;
  name: string;
  icon: string;
  color: string;
  description: string;
  scope: {
    included: string[];
    excluded: string[];
  };
  bureau: Bureau;
  agents: string[];
  is_active: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUREAU DEFINITIONS (FROZEN - 10 SECTIONS MAX)
// ═══════════════════════════════════════════════════════════════════════════════

export type BureauSectionId = 
  | 'dashboard'          // 1. Vue d'ensemble
  | 'notes'              // 2. Notes
  | 'tasks'              // 3. Tâches
  | 'projects'           // 4. Projets
  | 'threads'            // 5. Threads (.chenu)
  | 'meetings'           // 6. Réunions
  | 'data'               // 7. Data / Database
  | 'agents'             // 8. Agents
  | 'reports'            // 9. Reports / History
  | 'budget';            // 10. Budget & Governance

export interface BureauSection {
  id: BureauSectionId;
  name: string;
  icon: string;
  enabled: boolean;
  permissions: string[];
  order: number;
}

export interface Bureau {
  sphere_id: SphereId;
  sections: BureauSection[];
  active_section: BureauSectionId;
  layout: 'default' | 'compact' | 'expanded';
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT STATE
// ═══════════════════════════════════════════════════════════════════════════════

export interface ContextState {
  user_id: string;
  session_id: string;
  
  // Active context
  active_sphere: SphereId | null;
  active_section: BureauSectionId | null;
  active_dataspace: string | null;
  active_thread: string | null;
  
  // Navigation history
  navigation_history: Array<{
    sphere: SphereId;
    section: BureauSectionId;
    timestamp: string;
  }>;
  
  // Context metadata
  context_started_at: string;
  last_activity_at: string;
  
  // XR Mode
  xr_mode_active: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class ContextEngine {
  private spheres: Map<SphereId, Sphere> = new Map();
  private contextState: ContextState;
  private subscribers: Array<(state: ContextState) => void> = [];
  
  constructor(userId: string, sessionId: string) {
    this.contextState = this.createInitialState(userId, sessionId);
    this.initializeSpheres();
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  private createInitialState(userId: string, sessionId: string): ContextState {
    return {
      user_id: userId,
      session_id: sessionId,
      active_sphere: null,
      active_section: null,
      active_dataspace: null,
      active_thread: null,
      navigation_history: [],
      context_started_at: new Date().toISOString(),
      last_activity_at: new Date().toISOString(),
      xr_mode_active: false,
    };
  }
  
  private initializeSpheres(): void {
    const sphereDefinitions: Omit<Sphere, 'bureau'>[] = [
      {
        id: 'personal',
        name: 'Personnel',
        icon: '🏠',
        color: '#76E6C7',
        description: 'Espace privé: santé, bien-être, famille, objectifs personnels',
        scope: {
          included: ['santé', 'bien-être', 'famille', 'notes personnelles', 'journal', 'finances personnelles', 'objectifs', 'habitudes'],
          excluded: ['données professionnelles', 'metrics de performance externe'],
        },
        agents: ['personal.organizer', 'personal.wellness', 'personal.goals'],
        is_active: true,
      },
      {
        id: 'business',
        name: 'Entreprises',
        icon: '💼',
        color: '#5BA9FF',
        description: 'Gestion multi-entreprise: projets, clients, CRM, finances entreprise',
        scope: {
          included: ['multi-entreprises', 'domaines', 'départements', 'projets', 'clients', 'CRM', 'finances entreprise', 'opérations'],
          excluded: ['données personnelles santé', 'vie privée'],
        },
        agents: ['business.organizer', 'business.strategy', 'business.crm', 'business.operations', 'business.finance'],
        is_active: true,
      },
      {
        id: 'government',
        name: 'Gouvernement & Institutions',
        icon: '🏛️',
        color: '#D08FFF',
        description: 'Administration publique, démarches gouvernementales, conformité',
        scope: {
          included: ['impôts', 'SAAQ', 'RAMQ', 'immigration', 'services municipaux', 'permis', 'subventions', 'conformité'],
          excluded: ['opinions politiques'],
        },
        agents: ['government.organizer', 'government.compliance', 'government.filing'],
        is_active: true,
      },
      {
        id: 'creative_studio',
        name: 'Studio de création',
        icon: '🎨',
        color: '#FF8BAA',
        description: 'Expression artistique: design, contenu, médias, branding',
        scope: {
          included: ['design graphique', 'écriture', 'photo', 'vidéo', 'musique', '3D', 'animation', 'AI Art', 'branding'],
          excluded: ['metrics commerciaux imposés', 'jugement de style'],
        },
        agents: ['creative.organizer', 'creative.muse', 'creative.critic', 'creative.curator'],
        is_active: true,
      },
      {
        id: 'community',
        name: 'Community',
        icon: '👥',
        color: '#22C55E',
        description: 'Communauté locale et relations EN PERSONNE',
        scope: {
          included: ['relations interpersonnelles', 'groupes locaux', 'associations', 'voisinage', 'networking', 'bénévolat'],
          excluded: ['surveillance', 'tracking comportemental'],
        },
        agents: ['community.organizer', 'community.relationships', 'community.events'],
        is_active: true,
      },
      {
        id: 'social_media',
        name: 'Social & Media',
        icon: '📱',
        color: '#F59E0B',
        description: 'Présence en ligne et réseaux sociaux NUMÉRIQUES',
        scope: {
          included: ['réseaux sociaux', 'contenu en ligne', 'followers', 'analytics'],
          excluded: ['dark patterns', 'mécaniques addictives'],
        },
        agents: ['social.manager', 'social.analytics', 'social.scheduler'],
        is_active: true,
      },
      {
        id: 'entertainment',
        name: 'Entertainment',
        icon: '🎬',
        color: '#FFB04D',
        description: 'Loisirs, jeux, voyages, streaming, hobbies',
        scope: {
          included: ['jeux vidéo', 'films', 'séries', 'musique', 'voyages', 'sports', 'restaurants', 'hobbies'],
          excluded: ['mécaniques addictives', 'gambling', 'dark patterns'],
        },
        agents: ['entertainment.curator', 'entertainment.tracker', 'entertainment.documenter'],
        is_active: true,
      },
      {
        id: 'my_team',
        name: 'My Team',
        icon: '🤝',
        color: '#5ED8FF',
        description: 'Gestion d\'équipe, RH, collaboration, permissions. Inclut IA Labs & Skills',
        scope: {
          included: ['équipe', 'RH', 'collaboration', 'permissions', 'IA Labs', 'Skills & Tools'],
          excluded: ['données personnelles des membres'],
        },
        agents: ['team.organizer', 'team.hr', 'team.permissions', 'lab.experimenter', 'skills.manager'],
        is_active: true,
      },
      {
        id: 'scholar',
        name: 'Scholar',
        icon: '📚',
        color: '#8B5CF6',
        description: 'Apprentissage, recherche, documentation, formation',
        scope: {
          included: ['cours', 'recherche', 'documentation', 'certifications', 'bibliothèque', 'notes de cours'],
          excluded: [],
        },
        agents: ['scholar.organizer', 'scholar.researcher', 'scholar.tutor'],
        is_active: true,
      },
    ];
    
    sphereDefinitions.forEach(def => {
      const sphere: Sphere = {
        ...def,
        bureau: this.createDefaultBureau(def.id),
      };
      this.spheres.set(def.id, sphere);
    });
  }
  
  private createDefaultBureau(sphereId: SphereId): Bureau {
    const sections: BureauSection[] = [
      { id: 'dashboard', name: 'Dashboard', icon: '📊', enabled: true, permissions: ['read'], order: 1 },
      { id: 'notes', name: 'Notes', icon: '📝', enabled: true, permissions: ['read', 'write'], order: 2 },
      { id: 'tasks', name: 'Tasks', icon: '✅', enabled: true, permissions: ['read', 'write'], order: 3 },
      { id: 'projects', name: 'Projects', icon: '📁', enabled: true, permissions: ['read', 'write'], order: 4 },
      { id: 'threads', name: 'Threads (.chenu)', icon: '🧵', enabled: true, permissions: ['read', 'write'], order: 5 },
      { id: 'meetings', name: 'Meetings', icon: '📅', enabled: true, permissions: ['read', 'write'], order: 6 },
      { id: 'data', name: 'Data', icon: '🗄️', enabled: true, permissions: ['read'], order: 7 },
      { id: 'agents', name: 'Agents', icon: '🤖', enabled: true, permissions: ['read'], order: 8 },
      { id: 'reports', name: 'Reports', icon: '📈', enabled: true, permissions: ['read'], order: 9 },
      { id: 'budget', name: 'Budget & Governance', icon: '💰', enabled: true, permissions: ['read'], order: 10 },
    ];
    
    return {
      sphere_id: sphereId,
      sections,
      active_section: 'dashboard',
      layout: 'default',
    };
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SPHERE NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Switch to a different sphere
   */
  switchSphere(sphereId: SphereId): Sphere | null {
    const sphere = this.spheres.get(sphereId);
    if (!sphere || !sphere.is_active) return null;
    
    // Update context state
    this.contextState.active_sphere = sphereId;
    this.contextState.active_section = sphere.bureau.active_section;
    this.contextState.last_activity_at = new Date().toISOString();
    
    // Add to navigation history
    this.contextState.navigation_history.push({
      sphere: sphereId,
      section: sphere.bureau.active_section,
      timestamp: new Date().toISOString(),
    });
    
    // Keep history manageable
    if (this.contextState.navigation_history.length > 100) {
      this.contextState.navigation_history = this.contextState.navigation_history.slice(-50);
    }
    
    this.notifySubscribers();
    return sphere;
  }
  
  /**
   * Switch to a different section within the current sphere
   */
  switchSection(sectionId: BureauSectionId): BureauSection | null {
    if (!this.contextState.active_sphere) return null;
    
    const sphere = this.spheres.get(this.contextState.active_sphere);
    if (!sphere) return null;
    
    const section = sphere.bureau.sections.find(s => s.id === sectionId);
    if (!section || !section.enabled) return null;
    
    sphere.bureau.active_section = sectionId;
    this.contextState.active_section = sectionId;
    this.contextState.last_activity_at = new Date().toISOString();
    
    this.notifySubscribers();
    return section;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CONTEXT QUERIES
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Get all available spheres
   */
  getAllSpheres(): Sphere[] {
    return Array.from(this.spheres.values());
  }
  
  /**
   * Get active spheres only
   */
  getActiveSpheres(): Sphere[] {
    return Array.from(this.spheres.values()).filter(s => s.is_active);
  }
  
  /**
   * Get current sphere
   */
  getCurrentSphere(): Sphere | null {
    if (!this.contextState.active_sphere) return null;
    return this.spheres.get(this.contextState.active_sphere) || null;
  }
  
  /**
   * Get current bureau
   */
  getCurrentBureau(): Bureau | null {
    const sphere = this.getCurrentSphere();
    return sphere?.bureau || null;
  }
  
  /**
   * Get current context state
   */
  getContextState(): ContextState {
    return { ...this.contextState };
  }
  
  /**
   * Check if a sphere contains a specific scope item
   */
  isInScope(sphereId: SphereId, item: string): boolean {
    const sphere = this.spheres.get(sphereId);
    if (!sphere) return false;
    
    const lowerItem = item.toLowerCase();
    
    // Check excluded first
    if (sphere.scope.excluded.some(e => lowerItem.includes(e.toLowerCase()))) {
      return false;
    }
    
    // Check included
    return sphere.scope.included.some(i => lowerItem.includes(i.toLowerCase()));
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // XR MODE
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Toggle XR mode
   */
  toggleXRMode(): boolean {
    this.contextState.xr_mode_active = !this.contextState.xr_mode_active;
    this.contextState.last_activity_at = new Date().toISOString();
    this.notifySubscribers();
    return this.contextState.xr_mode_active;
  }
  
  /**
   * Check if XR mode is active
   */
  isXRModeActive(): boolean {
    return this.contextState.xr_mode_active;
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // DATASPACE & THREAD CONTEXT
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Set active dataspace
   */
  setActiveDataspace(dataspaceId: string | null): void {
    this.contextState.active_dataspace = dataspaceId;
    this.contextState.last_activity_at = new Date().toISOString();
    this.notifySubscribers();
  }
  
  /**
   * Set active thread
   */
  setActiveThread(threadId: string | null): void {
    this.contextState.active_thread = threadId;
    this.contextState.last_activity_at = new Date().toISOString();
    this.notifySubscribers();
  }
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SUBSCRIPTION
  // ═══════════════════════════════════════════════════════════════════════════
  
  /**
   * Subscribe to context changes
   */
  subscribe(callback: (state: ContextState) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== callback);
    };
  }
  
  private notifySubscribers(): void {
    const state = this.getContextState();
    this.subscribers.forEach(cb => cb(state));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const SPHERE_ORDER: SphereId[] = [
  'personal',
  'business',
  'government',
  'creative_studio',
  'community',
  'social_media',
  'entertainment',
  'my_team',
  'scholar',
];

export const BUREAU_SECTION_ORDER: BureauSectionId[] = [
  'dashboard',
  'notes',
  'tasks',
  'projects',
  'threads',
  'meetings',
  'data',
  'agents',
  'reports',
  'budget',
];

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default ContextEngine;
