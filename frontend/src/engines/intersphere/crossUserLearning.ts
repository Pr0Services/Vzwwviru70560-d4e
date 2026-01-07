/**
 * CHE·NU™ — CROSS-USER LEARNING SYSTEM
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Apprend des patterns d'un utilisateur pour améliorer les recommandations
 * de TOUS les utilisateurs similaires
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * PHILOSOPHIE: Ce qui fonctionne pour Marie → Bénéficie à tous les artistes
 */

import { SphereId, ConnectionTemplate, CONNECTION_TEMPLATES } from './connectionTemplates';
import { UserProfile, UserArchetype } from './userConnectionMatcher';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UsagePattern {
  id: string;
  templateId: string;
  
  // Qui l'utilise
  archetype: UserArchetype;
  activeSpheres: SphereId[];
  
  // Comment c'est utilisé
  averageFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  averageTokensPerUse: number;
  averageTimePerUse: number;  // minutes
  
  // Performance
  successRate: number;        // 0-100
  userSatisfaction: number;   // 0-5
  
  // Patterns de données
  commonInputPatterns: DataPattern[];
  commonOutputPatterns: DataPattern[];
  
  // Contexte temporel
  preferredDayOfWeek?: number[];   // 0=Sunday
  preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';
  
  // Stats
  totalUsers: number;
  totalExecutions: number;
  lastUpdated: Date;
}

export interface DataPattern {
  field: string;
  pattern: 'constant' | 'incremental' | 'seasonal' | 'random';
  commonValues?: string[];
  range?: { min: number; max: number };
}

export interface LearningInsight {
  id: string;
  type: 'discovery' | 'optimization' | 'warning' | 'trend';
  
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  
  // Applicabilité
  applicableArchetypes: UserArchetype[];
  applicableTemplates: string[];
  
  // Impact
  impactLevel: 'low' | 'medium' | 'high';
  confidence: number;  // 0-100
  
  // Action suggérée
  suggestedAction?: string;
  
  // Données
  dataPoints: number;
  createdAt: Date;
}

export interface ArchetypeProfile {
  archetype: UserArchetype;
  
  // Patterns d'usage
  mostUsedConnections: Array<{ templateId: string; usagePercent: number }>;
  preferredWorkflows: string[];
  
  // Caractéristiques communes
  averageActiveSpheres: number;
  commonSpheresCombinations: SphereId[][];
  
  // Performance
  averageSuccessRate: number;
  averageTokenUsage: number;
  
  // Insights
  insights: LearningInsight[];
  
  // Stats
  totalUsers: number;
  dataPoints: number;
  lastUpdated: Date;
}

// ═══════════════════════════════════════════════════════════════════════════
// DONNÉES D'APPRENTISSAGE INITIALES (basées sur les 60 scénarios)
// ═══════════════════════════════════════════════════════════════════════════

export const INITIAL_ARCHETYPE_PROFILES: ArchetypeProfile[] = [
  {
    archetype: 'freelancer-creative',
    mostUsedConnections: [
      { templateId: 'tpl-work-invoice', usagePercent: 95 },
      { templateId: 'tpl-income-tracking', usagePercent: 90 },
      { templateId: 'tpl-content-share', usagePercent: 85 },
      { templateId: 'tpl-income-tax-filing', usagePercent: 80 },
      { templateId: 'tpl-royalty-tracking', usagePercent: 65 },
      { templateId: 'tpl-appointment-sync', usagePercent: 60 }
    ],
    preferredWorkflows: ['wf-gig-to-payment', 'wf-release-promotion'],
    averageActiveSpheres: 5.5,
    commonSpheresCombinations: [
      ['personal', 'business', 'design_studio', 'social', 'entertainment'],
      ['personal', 'business', 'design_studio', 'community', 'social'],
      ['personal', 'business', 'design_studio', 'government', 'entertainment']
    ],
    averageSuccessRate: 87,
    averageTokenUsage: 450,
    insights: [
      {
        id: 'insight-fc-1',
        type: 'discovery',
        title: 'Gig invoicing pattern detected',
        titleFr: 'Pattern de facturation de contrats détecté',
        description: 'Most freelancer-creatives invoice immediately after project completion',
        descriptionFr: 'La plupart des créatifs freelance facturent immédiatement après la complétion du projet',
        applicableArchetypes: ['freelancer-creative'],
        applicableTemplates: ['tpl-work-invoice'],
        impactLevel: 'high',
        confidence: 92,
        suggestedAction: 'Auto-trigger invoice generation on project.completed event',
        dataPoints: 145,
        createdAt: new Date('2025-01-01')
      },
      {
        id: 'insight-fc-2',
        type: 'optimization',
        title: 'Social sharing timing matters',
        titleFr: 'Le timing du partage social compte',
        description: 'Posts shared between 6-8 PM get 40% more engagement',
        descriptionFr: 'Les publications partagées entre 18h-20h ont 40% plus d\'engagement',
        applicableArchetypes: ['freelancer-creative'],
        applicableTemplates: ['tpl-content-share', 'tpl-event-promotion'],
        impactLevel: 'medium',
        confidence: 78,
        suggestedAction: 'Schedule social posts for evening hours',
        dataPoints: 89,
        createdAt: new Date('2025-01-15')
      }
    ],
    totalUsers: 450,
    dataPoints: 12500,
    lastUpdated: new Date()
  },
  
  {
    archetype: 'entrepreneur-service',
    mostUsedConnections: [
      { templateId: 'tpl-project-billing', usagePercent: 92 },
      { templateId: 'tpl-sales-tax-remittance', usagePercent: 88 },
      { templateId: 'tpl-permit-application', usagePercent: 75 },
      { templateId: 'tpl-deadline-reminder', usagePercent: 85 },
      { templateId: 'tpl-income-tax-filing', usagePercent: 95 },
      { templateId: 'tpl-appointment-sync', usagePercent: 70 }
    ],
    preferredWorkflows: ['wf-project-milestone', 'wf-quarterly-tax'],
    averageActiveSpheres: 5,
    commonSpheresCombinations: [
      ['personal', 'business', 'government', 'my_team'],
      ['personal', 'business', 'government', 'design_studio', 'my_team'],
      ['personal', 'business', 'government', 'community']
    ],
    averageSuccessRate: 91,
    averageTokenUsage: 520,
    insights: [
      {
        id: 'insight-es-1',
        type: 'discovery',
        title: 'Progress billing pattern',
        titleFr: 'Pattern de facturation d\'avancement',
        description: 'Service entrepreneurs prefer 30/40/30 billing milestones',
        descriptionFr: 'Les entrepreneurs de service préfèrent les jalons 30/40/30',
        applicableArchetypes: ['entrepreneur-service'],
        applicableTemplates: ['tpl-project-billing'],
        impactLevel: 'high',
        confidence: 85,
        suggestedAction: 'Suggest 30/40/30 milestone structure for new projects',
        dataPoints: 234,
        createdAt: new Date('2025-02-01')
      },
      {
        id: 'insight-es-2',
        type: 'warning',
        title: 'Permit delays impact cash flow',
        titleFr: 'Les délais de permis impactent le cash flow',
        description: 'Average permit delay is 3 weeks - plan cash flow accordingly',
        descriptionFr: 'Le délai moyen de permis est de 3 semaines - planifier le cash flow en conséquence',
        applicableArchetypes: ['entrepreneur-service'],
        applicableTemplates: ['tpl-permit-application'],
        impactLevel: 'high',
        confidence: 88,
        dataPoints: 156,
        createdAt: new Date('2025-02-15')
      }
    ],
    totalUsers: 320,
    dataPoints: 9800,
    lastUpdated: new Date()
  },
  
  {
    archetype: 'professional-licensed',
    mostUsedConnections: [
      { templateId: 'tpl-license-renewal', usagePercent: 98 },
      { templateId: 'tpl-appointment-sync', usagePercent: 92 },
      { templateId: 'tpl-income-tax-filing', usagePercent: 90 },
      { templateId: 'tpl-income-tracking', usagePercent: 85 },
      { templateId: 'tpl-deadline-reminder', usagePercent: 88 }
    ],
    preferredWorkflows: ['wf-ce-credit-tracking'],
    averageActiveSpheres: 4.5,
    commonSpheresCombinations: [
      ['personal', 'business', 'government', 'community'],
      ['personal', 'business', 'government', 'my_team'],
      ['personal', 'business', 'community', 'social']
    ],
    averageSuccessRate: 94,
    averageTokenUsage: 380,
    insights: [
      {
        id: 'insight-pl-1',
        type: 'discovery',
        title: 'CE credit tracking critical',
        titleFr: 'Suivi des crédits FC critique',
        description: '78% of professionals track CE credits manually - automation opportunity',
        descriptionFr: '78% des professionnels suivent les crédits FC manuellement - opportunité d\'automatisation',
        applicableArchetypes: ['professional-licensed'],
        applicableTemplates: ['tpl-license-renewal'],
        impactLevel: 'high',
        confidence: 95,
        suggestedAction: 'Enable automatic CE credit tracking from conference registrations',
        dataPoints: 189,
        createdAt: new Date('2025-01-20')
      }
    ],
    totalUsers: 280,
    dataPoints: 7500,
    lastUpdated: new Date()
  },
  
  {
    archetype: 'event-organizer',
    mostUsedConnections: [
      { templateId: 'tpl-event-promotion', usagePercent: 98 },
      { templateId: 'tpl-membership-payment', usagePercent: 85 },
      { templateId: 'tpl-sales-tax-remittance', usagePercent: 72 },
      { templateId: 'tpl-appointment-sync', usagePercent: 90 },
      { templateId: 'tpl-income-tracking', usagePercent: 80 }
    ],
    preferredWorkflows: ['wf-event-launch'],
    averageActiveSpheres: 5.5,
    commonSpheresCombinations: [
      ['personal', 'business', 'entertainment', 'social', 'community'],
      ['personal', 'business', 'entertainment', 'social', 'government'],
      ['personal', 'business', 'entertainment', 'community', 'my_team']
    ],
    averageSuccessRate: 86,
    averageTokenUsage: 520,
    insights: [
      {
        id: 'insight-eo-1',
        type: 'trend',
        title: 'Multi-channel promotion essential',
        titleFr: 'Promotion multi-canal essentielle',
        description: 'Events promoted on 3+ channels have 2.5x higher attendance',
        descriptionFr: 'Les événements promus sur 3+ canaux ont 2,5x plus de participation',
        applicableArchetypes: ['event-organizer'],
        applicableTemplates: ['tpl-event-promotion', 'tpl-content-share'],
        impactLevel: 'high',
        confidence: 82,
        suggestedAction: 'Enable distribution to multiple social platforms',
        dataPoints: 112,
        createdAt: new Date('2025-03-01')
      }
    ],
    totalUsers: 180,
    dataPoints: 4200,
    lastUpdated: new Date()
  },
  
  {
    archetype: 'ecommerce-retail',
    mostUsedConnections: [
      { templateId: 'tpl-sales-tax-remittance', usagePercent: 98 },
      { templateId: 'tpl-income-tax-filing', usagePercent: 95 },
      { templateId: 'tpl-income-tracking', usagePercent: 92 },
      { templateId: 'tpl-content-share', usagePercent: 78 },
      { templateId: 'tpl-deadline-reminder', usagePercent: 85 }
    ],
    preferredWorkflows: ['wf-quarterly-tax'],
    averageActiveSpheres: 5,
    commonSpheresCombinations: [
      ['personal', 'business', 'government', 'social', 'entertainment'],
      ['personal', 'business', 'government', 'social', 'my_team'],
      ['personal', 'business', 'government', 'community', 'social']
    ],
    averageSuccessRate: 89,
    averageTokenUsage: 480,
    insights: [
      {
        id: 'insight-er-1',
        type: 'optimization',
        title: 'Sales tax automation saves hours',
        titleFr: 'L\'automatisation des taxes de vente économise des heures',
        description: 'Automated sales tax calculation saves average 4 hours per quarter',
        descriptionFr: 'Le calcul automatisé des taxes de vente économise en moyenne 4 heures par trimestre',
        applicableArchetypes: ['ecommerce-retail'],
        applicableTemplates: ['tpl-sales-tax-remittance'],
        impactLevel: 'high',
        confidence: 91,
        suggestedAction: 'Enable automatic sales tax calculation from transaction data',
        dataPoints: 178,
        createdAt: new Date('2025-02-20')
      }
    ],
    totalUsers: 220,
    dataPoints: 6100,
    lastUpdated: new Date()
  },
  
  {
    archetype: 'producer-agriculture',
    mostUsedConnections: [
      { templateId: 'tpl-income-tax-filing', usagePercent: 95 },
      { templateId: 'tpl-permit-application', usagePercent: 80 },
      { templateId: 'tpl-inspection-schedule', usagePercent: 88 },
      { templateId: 'tpl-deadline-reminder', usagePercent: 90 },
      { templateId: 'tpl-sales-tax-remittance', usagePercent: 65 }
    ],
    preferredWorkflows: ['wf-quarterly-tax'],
    averageActiveSpheres: 4.5,
    commonSpheresCombinations: [
      ['personal', 'business', 'government', 'community'],
      ['personal', 'business', 'government', 'entertainment'],
      ['personal', 'business', 'government', 'my_team']
    ],
    averageSuccessRate: 88,
    averageTokenUsage: 420,
    insights: [
      {
        id: 'insight-pa-1',
        type: 'discovery',
        title: 'Seasonal pattern detected',
        titleFr: 'Pattern saisonnier détecté',
        description: 'Agricultural businesses have distinct seasonal activity peaks',
        descriptionFr: 'Les entreprises agricoles ont des pics d\'activité saisonniers distincts',
        applicableArchetypes: ['producer-agriculture'],
        applicableTemplates: ['tpl-income-tracking', 'tpl-income-tax-filing'],
        impactLevel: 'medium',
        confidence: 89,
        suggestedAction: 'Adjust connection schedules based on seasonal patterns',
        dataPoints: 98,
        createdAt: new Date('2025-03-15')
      }
    ],
    totalUsers: 95,
    dataPoints: 2800,
    lastUpdated: new Date()
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// CROSS-USER LEARNING ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export class CrossUserLearningEngine {
  private archetypeProfiles: Map<UserArchetype, ArchetypeProfile> = new Map();
  private usagePatterns: Map<string, UsagePattern> = new Map();
  
  constructor() {
    // Initialiser avec les profils de base
    for (const profile of INITIAL_ARCHETYPE_PROFILES) {
      this.archetypeProfiles.set(profile.archetype, profile);
    }
    logger.debug('🧠 Cross-User Learning Engine initialized with', INITIAL_ARCHETYPE_PROFILES.length, 'archetype profiles');
  }
  
  /**
   * Enregistrer une exécution de connexion pour apprentissage
   */
  recordExecution(
    userId: string,
    profile: UserProfile,
    templateId: string,
    success: boolean,
    tokensUsed: number,
    durationMs: number
  ): void {
    // Mettre à jour le profil de l'archétype
    const archetypeProfile = this.archetypeProfiles.get(profile.archetype);
    if (archetypeProfile) {
      archetypeProfile.dataPoints++;
      archetypeProfile.lastUpdated = new Date();
      
      // Mettre à jour le taux de succès
      const oldRate = archetypeProfile.averageSuccessRate;
      const newRate = success ? oldRate + 0.01 : oldRate - 0.01;
      archetypeProfile.averageSuccessRate = Math.max(0, Math.min(100, newRate));
      
      // Mettre à jour l'usage de tokens
      archetypeProfile.averageTokenUsage = 
        (archetypeProfile.averageTokenUsage * 0.99) + (tokensUsed * 0.01);
    }
    
    // Mettre à jour le pattern d'usage
    const patternKey = `${profile.archetype}:${templateId}`;
    let pattern = this.usagePatterns.get(patternKey);
    
    if (!pattern) {
      pattern = this.createNewPattern(templateId, profile);
      this.usagePatterns.set(patternKey, pattern);
    }
    
    pattern.totalExecutions++;
    pattern.successRate = (pattern.successRate * 0.95) + ((success ? 100 : 0) * 0.05);
    pattern.averageTokensPerUse = (pattern.averageTokensPerUse * 0.9) + (tokensUsed * 0.1);
    pattern.lastUpdated = new Date();
  }
  
  /**
   * Obtenir les recommandations basées sur l'apprentissage cross-user
   */
  getLearnedRecommendations(profile: UserProfile): Array<{
    templateId: string;
    confidence: number;
    reason: string;
    reasonFr: string;
  }> {
    const recommendations: Array<{
      templateId: string;
      confidence: number;
      reason: string;
      reasonFr: string;
    }> = [];
    
    // Obtenir le profil de l'archétype
    const archetypeProfile = this.archetypeProfiles.get(profile.archetype);
    if (!archetypeProfile) return recommendations;
    
    // Recommander les connexions les plus utilisées par cet archétype
    for (const conn of archetypeProfile.mostUsedConnections) {
      const template = CONNECTION_TEMPLATES.find(t => t.id === conn.templateId);
      if (!template) continue;
      
      // Vérifier que les sphères sont actives
      if (!profile.activeSpheres.includes(template.fromSphere) ||
          !profile.activeSpheres.includes(template.toSphere)) {
        continue;
      }
      
      recommendations.push({
        templateId: conn.templateId,
        confidence: conn.usagePercent,
        reason: `${conn.usagePercent}% of similar ${profile.archetype} users use this`,
        reasonFr: `${conn.usagePercent}% des utilisateurs ${profile.archetype} similaires utilisent ceci`
      });
    }
    
    return recommendations;
  }
  
  /**
   * Obtenir les insights applicables à un utilisateur
   */
  getApplicableInsights(profile: UserProfile): LearningInsight[] {
    const insights: LearningInsight[] = [];
    
    // Collecter les insights de l'archétype
    const archetypeProfile = this.archetypeProfiles.get(profile.archetype);
    if (archetypeProfile) {
      insights.push(...archetypeProfile.insights);
    }
    
    // Ajouter les insights d'archétypes similaires (si pertinents)
    for (const [archetype, arcProfile] of this.archetypeProfiles) {
      if (archetype === profile.archetype) continue;
      
      // Vérifier la similarité des sphères
      const commonSpheres = profile.activeSpheres.filter(s => 
        arcProfile.commonSpheresCombinations.some(combo => combo.includes(s))
      );
      
      if (commonSpheres.length >= 3) {
        // Ajouter les insights à haute confiance
        const relevantInsights = arcProfile.insights
          .filter(i => i.confidence >= 85)
          .filter(i => i.applicableTemplates.some(tid => {
            const template = CONNECTION_TEMPLATES.find(t => t.id === tid);
            return template && 
                   profile.activeSpheres.includes(template.fromSphere) &&
                   profile.activeSpheres.includes(template.toSphere);
          }));
        
        insights.push(...relevantInsights);
      }
    }
    
    return insights;
  }
  
  /**
   * Détecter de nouveaux patterns à partir des données
   */
  detectNewPatterns(): LearningInsight[] {
    const newInsights: LearningInsight[] = [];
    
    // Analyser les patterns d'usage pour chaque archétype
    for (const [archetype, profile] of this.archetypeProfiles) {
      // Détecter les connexions avec un taux de succès élevé
      const highSuccessPatterns = Array.from(this.usagePatterns.values())
        .filter(p => p.archetype === archetype && p.successRate > 90);
      
      if (highSuccessPatterns.length > 0) {
        const avgSuccess = highSuccessPatterns.reduce((s, p) => s + p.successRate, 0) / highSuccessPatterns.length;
        
        newInsights.push({
          id: `auto-insight-${Date.now()}`,
          type: 'discovery',
          title: `High success pattern detected for ${archetype}`,
          titleFr: `Pattern de succès élevé détecté pour ${archetype}`,
          description: `${highSuccessPatterns.length} connections show ${avgSuccess.toFixed(1)}% success rate`,
          descriptionFr: `${highSuccessPatterns.length} connexions montrent un taux de succès de ${avgSuccess.toFixed(1)}%`,
          applicableArchetypes: [archetype],
          applicableTemplates: highSuccessPatterns.map(p => p.templateId),
          impactLevel: 'medium',
          confidence: Math.round(avgSuccess),
          dataPoints: highSuccessPatterns.reduce((s, p) => s + p.totalExecutions, 0),
          createdAt: new Date()
        });
      }
    }
    
    return newInsights;
  }
  
  /**
   * Obtenir les statistiques globales d'apprentissage
   */
  getGlobalStats(): {
    totalUsers: number;
    totalDataPoints: number;
    archetypesCovered: number;
    totalInsights: number;
    averageConfidence: number;
  } {
    let totalUsers = 0;
    let totalDataPoints = 0;
    let totalInsights = 0;
    let totalConfidence = 0;
    let insightCount = 0;
    
    for (const profile of this.archetypeProfiles.values()) {
      totalUsers += profile.totalUsers;
      totalDataPoints += profile.dataPoints;
      totalInsights += profile.insights.length;
      
      for (const insight of profile.insights) {
        totalConfidence += insight.confidence;
        insightCount++;
      }
    }
    
    return {
      totalUsers,
      totalDataPoints,
      archetypesCovered: this.archetypeProfiles.size,
      totalInsights,
      averageConfidence: insightCount > 0 ? Math.round(totalConfidence / insightCount) : 0
    };
  }
  
  /**
   * Créer un nouveau pattern d'usage
   */
  private createNewPattern(templateId: string, profile: UserProfile): UsagePattern {
    const template = CONNECTION_TEMPLATES.find(t => t.id === templateId);
    
    return {
      id: `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      templateId,
      archetype: profile.archetype,
      activeSpheres: profile.activeSpheres,
      averageFrequency: 'monthly',
      averageTokensPerUse: template?.tokenCost === 'high' ? 200 : template?.tokenCost === 'medium' ? 50 : 10,
      averageTimePerUse: 5,
      successRate: 85,
      userSatisfaction: 4,
      commonInputPatterns: [],
      commonOutputPatterns: [],
      totalUsers: 1,
      totalExecutions: 0,
      lastUpdated: new Date()
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT SINGLETON
// ═══════════════════════════════════════════════════════════════════════════

export const crossUserLearning = new CrossUserLearningEngine();
