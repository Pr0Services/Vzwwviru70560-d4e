/**
 * CHE·NU™ — USER CONNECTION MATCHER
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Système intelligent de recommandation de connexions par profil utilisateur
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Philosophie: Apprendre d'un utilisateur → Bénéficier à tous les similaires
 */

import { 
  ConnectionTemplate, 
  SphereId, 
  CONNECTION_TEMPLATES,
  CONNECTION_STATS 
} from './connectionTemplates';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type UserArchetype = 
  | 'freelancer-creative'      // Marie, artistes, designers
  | 'entrepreneur-service'     // Jonathan, consultants, contractors
  | 'professional-licensed'    // Sarah, avocats, comptables, ingénieurs
  | 'event-organizer'          // Alex, planificateurs, producteurs
  | 'ecommerce-retail'         // Émilie, boutiques, vendeurs
  | 'producer-agriculture'     // Marc, agriculteurs, producteurs
  | 'nonprofit-community'      // Associations, OBNL
  | 'corporate-employee'       // Employés, gestionnaires
  | 'student-academic'         // Étudiants, chercheurs
  | 'retiree-investor';        // Retraités, investisseurs

export interface UserProfile {
  id: string;
  name: string;
  archetype: UserArchetype;
  activeSpheres: SphereId[];
  
  // Caractéristiques business
  hasEmployees: boolean;
  annualRevenue?: 'under-30k' | '30k-100k' | '100k-500k' | '500k-plus';
  isIncorporated: boolean;
  requiresLicense: boolean;
  
  // Caractéristiques fiscales
  collectsSalesTax: boolean;
  hasMultipleIncomeStreams: boolean;
  claimsCECredits: boolean;
  
  // Préférences
  automationPreference: 'minimal' | 'balanced' | 'maximum';
  notificationPreference: 'all' | 'important' | 'critical-only';
}

export interface ConnectionRecommendation {
  template: ConnectionTemplate;
  relevanceScore: number;       // 0-100
  priority: 'essential' | 'recommended' | 'optional';
  reason: string;
  reasonFr: string;
  estimatedSavings: {
    timePerMonth: number;       // minutes
    tokensPerMonth: number;
  };
  setupComplexity: 'simple' | 'moderate' | 'complex';
}

export interface UserConnectionPlan {
  userId: string;
  archetype: UserArchetype;
  recommendations: ConnectionRecommendation[];
  totalPotentialSavings: {
    timePerMonth: number;
    tokensPerMonth: number;
  };
  suggestedOrder: string[];     // Template IDs in suggested setup order
}

// ═══════════════════════════════════════════════════════════════════════════
// ARCHETYPE → CONNECTIONS MAPPING
// ═══════════════════════════════════════════════════════════════════════════

const ARCHETYPE_ESSENTIAL_CONNECTIONS: Record<UserArchetype, string[]> = {
  'freelancer-creative': [
    'tpl-income-tax-filing',
    'tpl-work-invoice',
    'tpl-royalty-tracking',
    'tpl-content-share',
    'tpl-appointment-sync',
    'tpl-income-tracking'
  ],
  'entrepreneur-service': [
    'tpl-income-tax-filing',
    'tpl-sales-tax-remittance',
    'tpl-permit-application',
    'tpl-project-billing',
    'tpl-appointment-sync',
    'tpl-deadline-reminder'
  ],
  'professional-licensed': [
    'tpl-income-tax-filing',
    'tpl-license-renewal',
    'tpl-appointment-sync',
    'tpl-income-tracking',
    'tpl-deadline-reminder'
  ],
  'event-organizer': [
    'tpl-income-tax-filing',
    'tpl-sales-tax-remittance',
    'tpl-event-promotion',
    'tpl-membership-payment',
    'tpl-appointment-sync'
  ],
  'ecommerce-retail': [
    'tpl-income-tax-filing',
    'tpl-sales-tax-remittance',
    'tpl-income-tracking',
    'tpl-deadline-reminder',
    'tpl-content-share'
  ],
  'producer-agriculture': [
    'tpl-income-tax-filing',
    'tpl-sales-tax-remittance',
    'tpl-permit-application',
    'tpl-inspection-schedule',
    'tpl-deadline-reminder'
  ],
  'nonprofit-community': [
    'tpl-donation-receipt',
    'tpl-membership-payment',
    'tpl-event-promotion',
    'tpl-gov-deadline-calendar'
  ],
  'corporate-employee': [
    'tpl-appointment-sync',
    'tpl-deadline-reminder',
    'tpl-gov-deadline-calendar'
  ],
  'student-academic': [
    'tpl-deadline-reminder',
    'tpl-gov-deadline-calendar',
    'tpl-license-renewal'
  ],
  'retiree-investor': [
    'tpl-income-tax-filing',
    'tpl-income-tracking',
    'tpl-gov-deadline-calendar'
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// MATCHER CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class UserConnectionMatcher {
  
  /**
   * Générer un plan de connexions complet pour un utilisateur
   */
  generateConnectionPlan(profile: UserProfile): UserConnectionPlan {
    const recommendations: ConnectionRecommendation[] = [];
    
    // 1. Obtenir les connexions essentielles pour l'archétype
    const essentialIds = ARCHETYPE_ESSENTIAL_CONNECTIONS[profile.archetype] || [];
    
    // 2. Évaluer chaque template
    for (const template of CONNECTION_TEMPLATES) {
      const recommendation = this.evaluateTemplate(template, profile, essentialIds);
      if (recommendation) {
        recommendations.push(recommendation);
      }
    }
    
    // 3. Trier par score de pertinence
    recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // 4. Calculer les économies totales
    const totalSavings = recommendations.reduce(
      (acc, r) => ({
        timePerMonth: acc.timePerMonth + r.estimatedSavings.timePerMonth,
        tokensPerMonth: acc.tokensPerMonth + r.estimatedSavings.tokensPerMonth
      }),
      { timePerMonth: 0, tokensPerMonth: 0 }
    );
    
    // 5. Suggérer l'ordre de setup (essentiels d'abord, puis par complexité)
    const suggestedOrder = recommendations
      .filter(r => r.priority === 'essential')
      .sort((a, b) => {
        const complexityOrder = { simple: 0, moderate: 1, complex: 2 };
        return complexityOrder[a.setupComplexity] - complexityOrder[b.setupComplexity];
      })
      .map(r => r.template.id)
      .concat(
        recommendations
          .filter(r => r.priority === 'recommended')
          .map(r => r.template.id)
      );
    
    return {
      userId: profile.id,
      archetype: profile.archetype,
      recommendations,
      totalPotentialSavings: totalSavings,
      suggestedOrder
    };
  }
  
  /**
   * Évaluer un template pour un profil spécifique
   */
  private evaluateTemplate(
    template: ConnectionTemplate,
    profile: UserProfile,
    essentialIds: string[]
  ): ConnectionRecommendation | null {
    
    // Vérifier que les sphères sont actives
    if (!profile.activeSpheres.includes(template.fromSphere) ||
        !profile.activeSpheres.includes(template.toSphere)) {
      return null;
    }
    
    // Calculer le score de pertinence
    let relevanceScore = 50; // Base
    
    // Bonus si essentiel pour l'archétype
    if (essentialIds.includes(template.id)) {
      relevanceScore += 30;
    }
    
    // Bonus basés sur les caractéristiques du profil
    relevanceScore += this.calculateProfileBonus(template, profile);
    
    // Ajuster selon la fréquence d'utilisation globale
    relevanceScore += Math.min(20, template.frequency / 3);
    
    // Plafonner à 100
    relevanceScore = Math.min(100, relevanceScore);
    
    // Déterminer la priorité
    const priority = this.determinePriority(relevanceScore, essentialIds.includes(template.id));
    
    // Estimer les économies
    const estimatedSavings = this.estimateSavings(template, profile);
    
    // Déterminer la complexité de setup
    const setupComplexity = this.determineComplexity(template);
    
    // Générer la raison
    const { reason, reasonFr } = this.generateReason(template, profile, priority);
    
    return {
      template,
      relevanceScore,
      priority,
      reason,
      reasonFr,
      estimatedSavings,
      setupComplexity
    };
  }
  
  /**
   * Calculer bonus basé sur le profil
   */
  private calculateProfileBonus(template: ConnectionTemplate, profile: UserProfile): number {
    let bonus = 0;
    
    // Tax-related templates pour ceux qui ont plusieurs sources de revenus
    if (template.tags.includes('tax') && profile.hasMultipleIncomeStreams) {
      bonus += 10;
    }
    
    // Sales tax pour ceux qui collectent
    if (template.tags.includes('sales-tax') && profile.collectsSalesTax) {
      bonus += 15;
    }
    
    // CE credits pour professionnels licenciés
    if (template.tags.includes('ce-credits') && profile.claimsCECredits) {
      bonus += 15;
    }
    
    // Permit pour entrepreneurs de service
    if (template.tags.includes('permit') && profile.archetype === 'entrepreneur-service') {
      bonus += 10;
    }
    
    // Automation preference
    if (profile.automationPreference === 'maximum' && 
        template.automationLevel === 'automatic') {
      bonus += 5;
    }
    
    return bonus;
  }
  
  /**
   * Déterminer la priorité
   */
  private determinePriority(
    score: number, 
    isEssential: boolean
  ): 'essential' | 'recommended' | 'optional' {
    if (isEssential || score >= 80) return 'essential';
    if (score >= 60) return 'recommended';
    return 'optional';
  }
  
  /**
   * Estimer les économies de temps et tokens
   */
  private estimateSavings(
    template: ConnectionTemplate, 
    profile: UserProfile
  ): { timePerMonth: number; tokensPerMonth: number } {
    // Estimation basée sur le trigger
    const baseTimeSavings: Record<string, number> = {
      'real-time': 30,      // 30 min/mois économisés
      'event-driven': 45,
      'scheduled': 60,
      'threshold': 20,
      'manual': 10
    };
    
    const baseTokenSavings: Record<string, number> = {
      low: 100,
      medium: 300,
      high: 800
    };
    
    // Ajuster selon automation preference
    const automationMultiplier = {
      minimal: 0.5,
      balanced: 1.0,
      maximum: 1.5
    };
    
    const multiplier = automationMultiplier[profile.automationPreference];
    
    return {
      timePerMonth: Math.round(baseTimeSavings[template.trigger] * multiplier),
      tokensPerMonth: Math.round(baseTokenSavings[template.tokenCost] * multiplier)
    };
  }
  
  /**
   * Déterminer la complexité de setup
   */
  private determineComplexity(template: ConnectionTemplate): 'simple' | 'moderate' | 'complex' {
    const requiredElements = template.dataElements.filter(e => e.required).length;
    const hasFiles = template.dataElements.some(e => e.dataType === 'file');
    
    if (requiredElements <= 2 && !hasFiles) return 'simple';
    if (requiredElements <= 4 || template.automationLevel === 'approval-required') return 'moderate';
    return 'complex';
  }
  
  /**
   * Générer la raison de recommandation
   */
  private generateReason(
    template: ConnectionTemplate,
    profile: UserProfile,
    priority: 'essential' | 'recommended' | 'optional'
  ): { reason: string; reasonFr: string } {
    const reasons: Record<string, { en: string; fr: string }> = {
      'tpl-income-tax-filing': {
        en: 'Automatically aggregate income for tax filing - saves hours during tax season',
        fr: 'Agrège automatiquement les revenus pour les impôts - économise des heures'
      },
      'tpl-sales-tax-remittance': {
        en: 'Automate GST/HST calculations - never miss a remittance deadline',
        fr: 'Automatise les calculs TPS/TVH - ne manquez jamais une échéance'
      },
      'tpl-appointment-sync': {
        en: 'Keep personal and business calendars in sync automatically',
        fr: 'Synchronise automatiquement les calendriers personnel et professionnel'
      },
      'tpl-work-invoice': {
        en: 'Generate invoices directly from completed creative work',
        fr: 'Génère les factures directement à partir du travail créatif complété'
      },
      'tpl-license-renewal': {
        en: 'Track CE credits and never miss a license renewal',
        fr: 'Suivez les crédits de FC et ne manquez jamais un renouvellement'
      }
    };
    
    const defaultReason = {
      en: `Connects ${template.fromSphere} to ${template.toSphere} - ${priority} for your profile`,
      fr: `Connecte ${template.fromSphere} à ${template.toSphere} - ${priority} pour votre profil`
    };
    
    const specific = reasons[template.id] || defaultReason;
    
    return {
      reason: specific.en,
      reasonFr: specific.fr
    };
  }
  
  /**
   * Trouver des utilisateurs similaires pour cross-learning
   */
  findSimilarProfiles(profile: UserProfile, allProfiles: UserProfile[]): UserProfile[] {
    return allProfiles.filter(p => {
      if (p.id === profile.id) return false;
      
      // Même archétype = très similaire
      if (p.archetype === profile.archetype) return true;
      
      // Sphères actives en commun (au moins 4)
      const commonSpheres = p.activeSpheres.filter(s => profile.activeSpheres.includes(s));
      if (commonSpheres.length >= 4) return true;
      
      // Caractéristiques business similaires
      if (p.collectsSalesTax === profile.collectsSalesTax &&
          p.requiresLicense === profile.requiresLicense &&
          p.hasMultipleIncomeStreams === profile.hasMultipleIncomeStreams) {
        return true;
      }
      
      return false;
    });
  }
  
  /**
   * Apprendre des connexions populaires parmi des profils similaires
   */
  learnFromSimilarUsers(
    profile: UserProfile,
    similarProfiles: UserProfile[],
    usageData: Map<string, Map<string, number>> // userId -> templateId -> usageCount
  ): string[] {
    const templatePopularity = new Map<string, number>();
    
    for (const similar of similarProfiles) {
      const userUsage = usageData.get(similar.id);
      if (userUsage) {
        for (const [templateId, count] of userUsage) {
          const current = templatePopularity.get(templateId) || 0;
          templatePopularity.set(templateId, current + count);
        }
      }
    }
    
    // Retourner les top 5 templates les plus utilisés par profils similaires
    return Array.from(templatePopularity.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([templateId]) => templateId);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Créer un profil utilisateur à partir des données de base
 */
export function createUserProfile(
  id: string,
  name: string,
  archetype: UserArchetype,
  activeSpheres: SphereId[],
  options?: Partial<Omit<UserProfile, 'id' | 'name' | 'archetype' | 'activeSpheres'>>
): UserProfile {
  return {
    id,
    name,
    archetype,
    activeSpheres,
    hasEmployees: options?.hasEmployees ?? false,
    annualRevenue: options?.annualRevenue,
    isIncorporated: options?.isIncorporated ?? false,
    requiresLicense: options?.requiresLicense ?? false,
    collectsSalesTax: options?.collectsSalesTax ?? false,
    hasMultipleIncomeStreams: options?.hasMultipleIncomeStreams ?? false,
    claimsCECredits: options?.claimsCECredits ?? false,
    automationPreference: options?.automationPreference ?? 'balanced',
    notificationPreference: options?.notificationPreference ?? 'important'
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT SINGLETON
// ═══════════════════════════════════════════════════════════════════════════

export const userConnectionMatcher = new UserConnectionMatcher();
