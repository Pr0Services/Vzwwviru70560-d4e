/**
 * CHE·NU™ — PROFILS UTILISATEURS COMPLETS
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * UTILISATEURS MULTI-SPHÈRES
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Ces profils représentent des utilisateurs RÉELS avec des besoins
 * couvrant PLUSIEURS sphères. Ils permettent de:
 * 
 * 1. Tester si notre structure répond aux besoins réels
 * 2. Identifier les APIs nécessaires
 * 3. Voir les connexions inter-sphères requises
 * 4. Détecter les gaps et angles morts
 * 5. Préconcevoir des systèmes optimisés par profil
 */

import { SphereId } from './circumstantialScenarios';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface CompleteUserProfile {
  id: string;
  
  // Identité du profil
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  
  // Sphères utilisées
  activeSpheres: SphereWithUsage[];
  
  // Besoins spécifiques
  specificNeeds: SpecificNeed[];
  
  // Données critiques
  criticalData: CriticalDataPoint[];
  
  // Connexions inter-sphères requises
  requiredConnections: SphereConnection[];
  
  // APIs et intégrations nécessaires
  requiredIntegrations: RequiredIntegration[];
  
  // Interfaces d'exécution
  executionInterfaces: ExecutionInterface[];
  
  // Import/Export requirements
  dataFlows: DataFlowRequirement[];
  
  // Structure de bureau personnalisée suggérée
  suggestedBureauCustomization: BureauCustomization[];
  
  // Gaps identifiés dans notre architecture
  identifiedGaps: IdentifiedGap[];
}

export interface SphereWithUsage {
  sphereId: SphereId;
  usageLevel: 'primary' | 'secondary' | 'occasional';
  mainUseCases: string[];
  estimatedTimePercent: number;
}

export interface SpecificNeed {
  id: string;
  need: string;
  needFr: string;
  sphere: SphereId;
  priority: 'critical' | 'important' | 'nice-to-have';
  currentSolution?: string; // Comment ils font actuellement
  proposedSolution: string; // Comment CHE·NU résoudrait
}

export interface CriticalDataPoint {
  id: string;
  dataName: string;
  dataNameFr: string;
  sphere: SphereId;
  dataType: string;
  updateFrequency: string;
  sharedWith: SphereId[]; // Autres sphères qui ont besoin de cette donnée
}

export interface SphereConnection {
  id: string;
  fromSphere: SphereId;
  toSphere: SphereId;
  connectionType: 'data-sync' | 'trigger' | 'reference' | 'aggregate';
  description: string;
  descriptionFr: string;
  frequency: 'real-time' | 'daily' | 'weekly' | 'on-demand' | 'event-driven';
  dataElements: string[];
}

export interface RequiredIntegration {
  id: string;
  name: string;
  type: 'api' | 'import' | 'export' | 'webhook' | 'oauth';
  provider: string;
  sphere: SphereId;
  purpose: string;
  purposeFr: string;
  priority: 'essential' | 'important' | 'optional';
}

export interface ExecutionInterface {
  id: string;
  name: string;
  nameFr: string;
  type: 'form' | 'wizard' | 'dashboard' | 'calculator' | 'generator' | 'tracker';
  sphere: SphereId;
  description: string;
}

export interface DataFlowRequirement {
  id: string;
  name: string;
  direction: 'import' | 'export' | 'sync';
  format: string[];
  source: string;
  destination: string;
  frequency: string;
}

export interface BureauCustomization {
  sphereId: SphereId;
  customSections?: string[];
  prioritizedViews: string[];
  hiddenSections?: string[];
  customAgents?: string[];
}

export interface IdentifiedGap {
  id: string;
  description: string;
  descriptionFr: string;
  severity: 'blocker' | 'major' | 'minor';
  affectedSpheres: SphereId[];
  proposedSolution: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// PROFIL 1: JONATHAN - ENTREPRENEUR EN CONSTRUCTION
// ═══════════════════════════════════════════════════════════════════════════

export const PROFILE_JONATHAN_CONTRACTOR: CompleteUserProfile = {
  id: 'profile-jonathan-contractor',
  name: 'Jonathan - Construction Company Owner',
  nameFr: 'Jonathan - Propriétaire d\'entreprise de construction',
  description: 'Runs a construction company with employees, vehicles, equipment, and both commercial and residential projects',
  descriptionFr: 'Dirige une entreprise de construction avec employés, véhicules, équipement et projets commerciaux et résidentiels',
  
  activeSpheres: [
    {
      sphereId: 'business',
      usageLevel: 'primary',
      mainUseCases: ['Estimates', 'Invoicing', 'Bookkeeping', 'Client management', 'Project tracking', 'Payroll'],
      estimatedTimePercent: 50
    },
    {
      sphereId: 'personal',
      usageLevel: 'secondary',
      mainUseCases: ['Personal budget', 'Family calendar', 'Personal investments'],
      estimatedTimePercent: 15
    },
    {
      sphereId: 'government',
      usageLevel: 'secondary',
      mainUseCases: ['Permits', 'Licenses', 'Taxes', 'Worker safety compliance'],
      estimatedTimePercent: 15
    },
    {
      sphereId: 'community',
      usageLevel: 'occasional',
      mainUseCases: ['Subcontractor network', 'Supplier relationships'],
      estimatedTimePercent: 10
    },
    {
      sphereId: 'my_team',
      usageLevel: 'secondary',
      mainUseCases: ['Estimating AI', 'Scheduling AI', 'Bookkeeping AI'],
      estimatedTimePercent: 10
    }
  ],
  
  specificNeeds: [
    // BUSINESS NEEDS
    {
      id: 'need-estimates',
      need: 'Create detailed project estimates with material costs, labor, and margins',
      needFr: 'Créer des estimations détaillées avec coûts matériaux, main d\'œuvre et marges',
      sphere: 'business',
      priority: 'critical',
      currentSolution: 'Excel spreadsheets, manual calculations',
      proposedSolution: 'Estimate Builder with material database, labor rates, and automatic margin calculation'
    },
    {
      id: 'need-project-tracking',
      need: 'Track multiple projects with phases, milestones, and budget vs actual',
      needFr: 'Suivre plusieurs projets avec phases, jalons et budget vs réel',
      sphere: 'business',
      priority: 'critical',
      currentSolution: 'Paper notes, basic project management app',
      proposedSolution: 'Project Dashboard with Gantt view, budget tracking, photo documentation'
    },
    {
      id: 'need-payroll',
      need: 'Process biweekly payroll for 8 employees with different pay rates',
      needFr: 'Traiter la paie bihebdomadaire pour 8 employés avec taux différents',
      sphere: 'business',
      priority: 'critical',
      currentSolution: 'Accountant does it, expensive',
      proposedSolution: 'Integrated payroll with time tracking, automatic deductions, direct deposit'
    },
    {
      id: 'need-invoicing',
      need: 'Generate progress invoices based on project completion percentage',
      needFr: 'Générer des factures d\'avancement basées sur le pourcentage de complétion',
      sphere: 'business',
      priority: 'critical',
      currentSolution: 'Manual invoice creation',
      proposedSolution: 'Project-linked invoicing with automatic progress calculation'
    },
    {
      id: 'need-vehicle-tracking',
      need: 'Track 3 company vehicles - maintenance, fuel, insurance, depreciation',
      needFr: 'Suivre 3 véhicules - entretien, carburant, assurance, dépréciation',
      sphere: 'business',
      priority: 'important',
      currentSolution: 'Shoebox of receipts',
      proposedSolution: 'Vehicle Fleet Manager with maintenance schedules, expense tracking'
    },
    {
      id: 'need-equipment',
      need: 'Track heavy equipment - maintenance, utilization, depreciation',
      needFr: 'Suivre l\'équipement lourd - entretien, utilisation, dépréciation',
      sphere: 'business',
      priority: 'important',
      currentSolution: 'Memory and paper notes',
      proposedSolution: 'Equipment Registry with maintenance alerts, utilization reports'
    },
    // GOVERNMENT NEEDS
    {
      id: 'need-permits',
      need: 'Track building permits per project with expiration and inspection dates',
      needFr: 'Suivre les permis de construction par projet avec expirations et inspections',
      sphere: 'government',
      priority: 'critical',
      currentSolution: 'Physical permit board in office',
      proposedSolution: 'Permit Tracker linked to projects with calendar integration'
    },
    {
      id: 'need-safety-compliance',
      need: 'Track OSHA/CNESST compliance, safety training, incident reports',
      needFr: 'Suivre la conformité SST, formations de sécurité, rapports d\'incidents',
      sphere: 'government',
      priority: 'critical',
      currentSolution: 'Paper binder',
      proposedSolution: 'Safety Compliance Module with training tracking, digital incident forms'
    },
    {
      id: 'need-contractor-license',
      need: 'Manage contractor license renewal, insurance certificates',
      needFr: 'Gérer le renouvellement de licence d\'entrepreneur, certificats d\'assurance',
      sphere: 'government',
      priority: 'critical',
      currentSolution: 'Calendar reminders',
      proposedSolution: 'License & Certification Manager with auto-renewal reminders'
    },
    // PERSONAL NEEDS
    {
      id: 'need-separation',
      need: 'Clear separation between business and personal finances',
      needFr: 'Séparation claire entre finances personnelles et d\'entreprise',
      sphere: 'personal',
      priority: 'critical',
      currentSolution: 'Separate bank accounts, still gets confusing',
      proposedSolution: 'Sphere separation with clear business/personal context switching'
    },
    {
      id: 'need-personal-budget',
      need: 'Personal and family budget tracking',
      needFr: 'Suivi du budget personnel et familial',
      sphere: 'personal',
      priority: 'important',
      currentSolution: 'Wife manages, informal',
      proposedSolution: 'Personal Budget Dashboard, separate from business'
    }
  ],
  
  criticalData: [
    // CLIENT DATA
    {
      id: 'data-clients',
      dataName: 'Client Database',
      dataNameFr: 'Base de données clients',
      sphere: 'business',
      dataType: 'hierarchy',
      updateFrequency: 'frequent',
      sharedWith: ['government'] // For permits linked to client properties
    },
    // PROJECT DATA
    {
      id: 'data-projects',
      dataName: 'Active Projects',
      dataNameFr: 'Projets actifs',
      sphere: 'business',
      dataType: 'hierarchy',
      updateFrequency: 'daily',
      sharedWith: ['government', 'personal'] // Permits, personal calendar
    },
    // EMPLOYEE DATA
    {
      id: 'data-employees',
      dataName: 'Employee Records',
      dataNameFr: 'Dossiers employés',
      sphere: 'business',
      dataType: 'hierarchy',
      updateFrequency: 'weekly',
      sharedWith: ['government'] // Tax remittances, safety training
    },
    // VEHICLE DATA
    {
      id: 'data-vehicles',
      dataName: 'Vehicle Fleet',
      dataNameFr: 'Flotte de véhicules',
      sphere: 'business',
      dataType: 'hierarchy',
      updateFrequency: 'monthly',
      sharedWith: ['government'] // Registration, insurance
    },
    // EQUIPMENT DATA
    {
      id: 'data-equipment',
      dataName: 'Heavy Equipment',
      dataNameFr: 'Équipement lourd',
      sphere: 'business',
      dataType: 'hierarchy',
      updateFrequency: 'monthly',
      sharedWith: ['government'] // Safety certifications
    },
    // FINANCIAL DATA
    {
      id: 'data-financials',
      dataName: 'Business Financials',
      dataNameFr: 'Finances d\'entreprise',
      sphere: 'business',
      dataType: 'hierarchy',
      updateFrequency: 'real-time',
      sharedWith: ['government', 'personal'] // Taxes, owner's draw
    }
  ],
  
  requiredConnections: [
    {
      id: 'conn-project-permit',
      fromSphere: 'business',
      toSphere: 'government',
      connectionType: 'reference',
      description: 'Link projects to required permits',
      descriptionFr: 'Lier les projets aux permis requis',
      frequency: 'event-driven',
      dataElements: ['project-id', 'property-address', 'permit-type', 'permit-status']
    },
    {
      id: 'conn-employee-safety',
      fromSphere: 'business',
      toSphere: 'government',
      connectionType: 'data-sync',
      description: 'Sync employee records with safety training records',
      descriptionFr: 'Synchroniser les dossiers employés avec les formations sécurité',
      frequency: 'weekly',
      dataElements: ['employee-id', 'training-completed', 'certification-expiry']
    },
    {
      id: 'conn-project-calendar',
      fromSphere: 'business',
      toSphere: 'personal',
      connectionType: 'trigger',
      description: 'Project milestones appear on personal calendar',
      descriptionFr: 'Jalons de projets apparaissent sur le calendrier personnel',
      frequency: 'event-driven',
      dataElements: ['project-name', 'milestone', 'date', 'location']
    },
    {
      id: 'conn-payroll-tax',
      fromSphere: 'business',
      toSphere: 'government',
      connectionType: 'aggregate',
      description: 'Payroll data feeds into tax remittances',
      descriptionFr: 'Données de paie alimentent les versements fiscaux',
      frequency: 'weekly',
      dataElements: ['total-wages', 'deductions', 'employer-contributions']
    },
    {
      id: 'conn-profit-personal',
      fromSphere: 'business',
      toSphere: 'personal',
      connectionType: 'data-sync',
      description: 'Owner draws/dividends reflected in personal finances',
      descriptionFr: 'Retraits du propriétaire reflétés dans les finances personnelles',
      frequency: 'on-demand',
      dataElements: ['draw-amount', 'date', 'tax-implications']
    },
    {
      id: 'conn-subcontractor-network',
      fromSphere: 'community',
      toSphere: 'business',
      connectionType: 'reference',
      description: 'Subcontractor availability and rates',
      descriptionFr: 'Disponibilité et tarifs des sous-traitants',
      frequency: 'on-demand',
      dataElements: ['subcontractor-id', 'trade', 'rate', 'availability', 'insurance-valid']
    }
  ],
  
  requiredIntegrations: [
    {
      id: 'int-quickbooks',
      name: 'QuickBooks',
      type: 'api',
      provider: 'Intuit',
      sphere: 'business',
      purpose: 'Accounting sync',
      purposeFr: 'Synchronisation comptable',
      priority: 'essential'
    },
    {
      id: 'int-bank-feed',
      name: 'Bank Transaction Feed',
      type: 'api',
      provider: 'Various banks',
      sphere: 'business',
      purpose: 'Automatic transaction import',
      purposeFr: 'Import automatique des transactions',
      priority: 'essential'
    },
    {
      id: 'int-permit-portal',
      name: 'Municipal Permit Portal',
      type: 'api',
      provider: 'City/Municipality',
      sphere: 'government',
      purpose: 'Permit status tracking',
      purposeFr: 'Suivi du statut des permis',
      priority: 'important'
    },
    {
      id: 'int-payroll-processor',
      name: 'Payroll Processor',
      type: 'api',
      provider: 'Ceridian/ADP',
      sphere: 'business',
      purpose: 'Payroll processing',
      purposeFr: 'Traitement de la paie',
      priority: 'essential'
    },
    {
      id: 'int-fuel-cards',
      name: 'Fuel Card Integration',
      type: 'import',
      provider: 'Petro-Canada/Shell',
      sphere: 'business',
      purpose: 'Automatic fuel expense import',
      purposeFr: 'Import automatique des dépenses de carburant',
      priority: 'important'
    },
    {
      id: 'int-material-suppliers',
      name: 'Supplier Catalogs',
      type: 'api',
      provider: 'Home Depot Pro/Rona',
      sphere: 'business',
      purpose: 'Real-time material pricing for estimates',
      purposeFr: 'Prix des matériaux en temps réel pour les estimations',
      priority: 'important'
    },
    {
      id: 'int-cra-efile',
      name: 'CRA E-file',
      type: 'export',
      provider: 'Canada Revenue Agency',
      sphere: 'government',
      purpose: 'Tax filing and remittances',
      purposeFr: 'Déclarations fiscales et versements',
      priority: 'essential'
    }
  ],
  
  executionInterfaces: [
    {
      id: 'ui-estimate-builder',
      name: 'Estimate Builder',
      nameFr: 'Constructeur d\'estimation',
      type: 'wizard',
      sphere: 'business',
      description: 'Step-by-step project estimate creation with templates, material database, labor rates'
    },
    {
      id: 'ui-project-dashboard',
      name: 'Project Dashboard',
      nameFr: 'Tableau de bord projets',
      type: 'dashboard',
      sphere: 'business',
      description: 'Overview of all projects with status, budget, timeline, photos'
    },
    {
      id: 'ui-payroll-run',
      name: 'Payroll Run',
      nameFr: 'Traitement de paie',
      type: 'wizard',
      sphere: 'business',
      description: 'Biweekly payroll processing with time import, deduction calculation'
    },
    {
      id: 'ui-invoice-generator',
      name: 'Invoice Generator',
      nameFr: 'Générateur de factures',
      type: 'generator',
      sphere: 'business',
      description: 'Create invoices from projects with progress billing support'
    },
    {
      id: 'ui-vehicle-tracker',
      name: 'Vehicle & Equipment Tracker',
      nameFr: 'Suivi véhicules & équipement',
      type: 'tracker',
      sphere: 'business',
      description: 'Maintenance schedules, expense tracking, utilization reports'
    },
    {
      id: 'ui-permit-tracker',
      name: 'Permit Tracker',
      nameFr: 'Suivi des permis',
      type: 'tracker',
      sphere: 'government',
      description: 'Track permits by project with inspection scheduling'
    },
    {
      id: 'ui-safety-compliance',
      name: 'Safety Compliance Center',
      nameFr: 'Centre de conformité sécurité',
      type: 'dashboard',
      sphere: 'government',
      description: 'Training records, certifications, incident reports, compliance status'
    },
    {
      id: 'ui-profit-calculator',
      name: 'Profit & Cash Flow Calculator',
      nameFr: 'Calculateur profit et flux de trésorerie',
      type: 'calculator',
      sphere: 'business',
      description: 'Real-time P&L, cash flow projections, job costing'
    }
  ],
  
  dataFlows: [
    {
      id: 'flow-bank-import',
      name: 'Bank Transactions Import',
      direction: 'import',
      format: ['OFX', 'QFX', 'CSV'],
      source: 'Bank',
      destination: 'Business > Bookkeeping',
      frequency: 'Daily'
    },
    {
      id: 'flow-estimate-export',
      name: 'Estimate to PDF',
      direction: 'export',
      format: ['PDF'],
      source: 'Business > Estimates',
      destination: 'Client email',
      frequency: 'On-demand'
    },
    {
      id: 'flow-payroll-export',
      name: 'Payroll to Accounting',
      direction: 'export',
      format: ['Journal Entry'],
      source: 'Business > Payroll',
      destination: 'Business > Bookkeeping',
      frequency: 'Biweekly'
    },
    {
      id: 'flow-tax-export',
      name: 'Tax Data Export',
      direction: 'export',
      format: ['XML', 'EFILE'],
      source: 'Business > Financials',
      destination: 'Government > Tax Filing',
      frequency: 'Quarterly/Annual'
    },
    {
      id: 'flow-time-import',
      name: 'Employee Time Import',
      direction: 'import',
      format: ['CSV', 'API'],
      source: 'Time tracking app',
      destination: 'Business > Payroll',
      frequency: 'Daily'
    }
  ],
  
  suggestedBureauCustomization: [
    {
      sphereId: 'business',
      prioritizedViews: ['Projects', 'Estimates', 'Invoices', 'Payroll', 'Fleet'],
      customSections: ['Job Costing', 'Material Inventory', 'Subcontractor Pool'],
      customAgents: ['Estimating Assistant', 'Collection Reminder', 'Maintenance Scheduler']
    },
    {
      sphereId: 'government',
      prioritizedViews: ['Permits', 'Safety Compliance', 'License Renewals'],
      customSections: ['Inspection Calendar', 'Training Matrix'],
      customAgents: ['Permit Status Checker', 'Compliance Auditor']
    },
    {
      sphereId: 'personal',
      prioritizedViews: ['Personal Budget', 'Family Calendar', 'Investments'],
      hiddenSections: ['Dating', 'Social Events'],
      customAgents: ['Owner Draw Advisor']
    }
  ],
  
  identifiedGaps: [
    {
      id: 'gap-job-costing',
      description: 'Need detailed job costing module linking estimates to actuals',
      descriptionFr: 'Besoin d\'un module de coût de revient liant estimations aux réels',
      severity: 'major',
      affectedSpheres: ['business'],
      proposedSolution: 'Add Job Costing section to Business bureau with estimate-to-actual tracking'
    },
    {
      id: 'gap-vehicle-fleet',
      description: 'Vehicle and equipment tracking not part of standard bureau structure',
      descriptionFr: 'Suivi de véhicules et équipement non inclus dans la structure standard',
      severity: 'major',
      affectedSpheres: ['business', 'government'],
      proposedSolution: 'Add Fleet/Assets section to Business bureau, link to Government for registration'
    },
    {
      id: 'gap-progress-billing',
      description: 'Standard invoicing doesn\'t support construction progress billing',
      descriptionFr: 'Facturation standard ne supporte pas la facturation d\'avancement',
      severity: 'major',
      affectedSpheres: ['business'],
      proposedSolution: 'Add Progress Billing mode to Invoice system with holdback tracking'
    },
    {
      id: 'gap-subcontractor-management',
      description: 'No clear place for subcontractor pool management',
      descriptionFr: 'Pas de place claire pour la gestion du bassin de sous-traitants',
      severity: 'minor',
      affectedSpheres: ['business', 'community'],
      proposedSolution: 'Bridge between Community (network) and Business (work assignments)'
    },
    {
      id: 'gap-safety-training',
      description: 'Need employee safety training tracking with certification expiry',
      descriptionFr: 'Besoin de suivi des formations sécurité avec expiration des certifications',
      severity: 'major',
      affectedSpheres: ['government', 'business'],
      proposedSolution: 'Safety Compliance module in Government with employee data from Business'
    },
    {
      id: 'gap-material-pricing',
      description: 'Need real-time material pricing for accurate estimates',
      descriptionFr: 'Besoin de prix des matériaux en temps réel pour estimations précises',
      severity: 'minor',
      affectedSpheres: ['business'],
      proposedSolution: 'Material Database with supplier API integrations'
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// PROFIL 2: MARIE - ARTISTE MUSICIENNE INDÉPENDANTE
// ═══════════════════════════════════════════════════════════════════════════

export const PROFILE_MARIE_MUSICIAN: CompleteUserProfile = {
  id: 'profile-marie-musician',
  name: 'Marie - Independent Musician',
  nameFr: 'Marie - Musicienne indépendante',
  description: 'Singer-songwriter who performs, records, teaches music, and manages her own career',
  descriptionFr: 'Auteure-compositrice-interprète qui performe, enregistre, enseigne la musique et gère sa carrière',
  
  activeSpheres: [
    {
      sphereId: 'design_studio',
      usageLevel: 'primary',
      mainUseCases: ['Song compositions', 'Recording projects', 'Sheet music', 'Album artwork'],
      estimatedTimePercent: 35
    },
    {
      sphereId: 'business',
      usageLevel: 'primary',
      mainUseCases: ['Gig bookings', 'Teaching schedule', 'Invoicing', 'Royalty tracking'],
      estimatedTimePercent: 25
    },
    {
      sphereId: 'social',
      usageLevel: 'secondary',
      mainUseCases: ['Fan engagement', 'Content promotion', 'Live announcements'],
      estimatedTimePercent: 15
    },
    {
      sphereId: 'government',
      usageLevel: 'secondary',
      mainUseCases: ['Copyright registration', 'SOCAN/BMI', 'Grants', 'Taxes'],
      estimatedTimePercent: 10
    },
    {
      sphereId: 'entertainment',
      usageLevel: 'secondary',
      mainUseCases: ['Concert calendar', 'Festival submissions', 'Venue research'],
      estimatedTimePercent: 10
    },
    {
      sphereId: 'community',
      usageLevel: 'occasional',
      mainUseCases: ['Musician network', 'Collaborations', 'Student community'],
      estimatedTimePercent: 5
    }
  ],
  
  specificNeeds: [
    {
      id: 'need-song-catalog',
      need: 'Manage song catalog with lyrics, chords, recordings, versions',
      needFr: 'Gérer le catalogue de chansons avec paroles, accords, enregistrements, versions',
      sphere: 'design_studio',
      priority: 'critical',
      currentSolution: 'Scattered files, Dropbox folders',
      proposedSolution: 'Song Catalog with metadata, versions, master recordings, publishing info'
    },
    {
      id: 'need-gig-booking',
      need: 'Track gig inquiries, bookings, contracts, payments',
      needFr: 'Suivre les demandes de spectacles, réservations, contrats, paiements',
      sphere: 'business',
      priority: 'critical',
      currentSolution: 'Email inbox, spreadsheet',
      proposedSolution: 'Gig Pipeline with stages, contracts, rider, technical requirements'
    },
    {
      id: 'need-royalties',
      need: 'Track royalties from streaming, radio, sync licensing',
      needFr: 'Suivre les redevances de streaming, radio, synchronisation',
      sphere: 'business',
      priority: 'critical',
      currentSolution: 'Wait for PRO statements, lose track',
      proposedSolution: 'Royalty Tracker with platform import, PRO statement reconciliation'
    },
    {
      id: 'need-teaching',
      need: 'Manage music students, schedules, lesson plans, payments',
      needFr: 'Gérer les élèves de musique, horaires, plans de cours, paiements',
      sphere: 'business',
      priority: 'important',
      currentSolution: 'Paper calendar, cash payments',
      proposedSolution: 'Teaching Studio with student profiles, recurring lessons, invoicing'
    },
    {
      id: 'need-copyright',
      need: 'Register copyrights, track publishing splits with co-writers',
      needFr: 'Enregistrer les droits d\'auteur, suivre les parts avec co-auteurs',
      sphere: 'government',
      priority: 'important',
      currentSolution: 'Never registered, informal agreements',
      proposedSolution: 'Copyright Registry linked to song catalog, co-writer split agreements'
    },
    {
      id: 'need-grants',
      need: 'Apply for arts grants (FACTOR, CAC, provincial)',
      needFr: 'Demander des subventions artistiques (FACTOR, CAC, provincial)',
      sphere: 'government',
      priority: 'important',
      currentSolution: 'Miss deadlines, overwhelmed by applications',
      proposedSolution: 'Grant Tracker with deadlines, templates, status tracking'
    },
    {
      id: 'need-social-content',
      need: 'Plan and schedule social media content across platforms',
      needFr: 'Planifier et programmer le contenu sur les réseaux sociaux',
      sphere: 'social',
      priority: 'important',
      currentSolution: 'Post randomly when remember',
      proposedSolution: 'Content Calendar with multi-platform scheduling'
    }
  ],
  
  criticalData: [
    {
      id: 'data-songs',
      dataName: 'Song Catalog',
      dataNameFr: 'Catalogue de chansons',
      sphere: 'design_studio',
      dataType: 'hierarchy',
      updateFrequency: 'frequent',
      sharedWith: ['government', 'business'] // Copyright, royalties
    },
    {
      id: 'data-gigs',
      dataName: 'Gig Calendar',
      dataNameFr: 'Calendrier de spectacles',
      sphere: 'business',
      dataType: 'hierarchy',
      updateFrequency: 'frequent',
      sharedWith: ['personal', 'entertainment', 'social']
    },
    {
      id: 'data-students',
      dataName: 'Student Roster',
      dataNameFr: 'Liste des élèves',
      sphere: 'business',
      dataType: 'hierarchy',
      updateFrequency: 'weekly',
      sharedWith: ['personal']
    },
    {
      id: 'data-royalties',
      dataName: 'Royalty Statements',
      dataNameFr: 'Relevés de redevances',
      sphere: 'business',
      dataType: 'hierarchy',
      updateFrequency: 'monthly',
      sharedWith: ['government']
    }
  ],
  
  requiredConnections: [
    {
      id: 'conn-song-copyright',
      fromSphere: 'design_studio',
      toSphere: 'government',
      connectionType: 'reference',
      description: 'Link songs to copyright registrations',
      descriptionFr: 'Lier les chansons aux enregistrements de droits d\'auteur',
      frequency: 'event-driven',
      dataElements: ['song-id', 'copyright-number', 'co-writers', 'splits']
    },
    {
      id: 'conn-song-royalties',
      fromSphere: 'design_studio',
      toSphere: 'business',
      connectionType: 'reference',
      description: 'Link songs to royalty income',
      descriptionFr: 'Lier les chansons aux revenus de redevances',
      frequency: 'monthly',
      dataElements: ['song-id', 'platform', 'streams', 'revenue']
    },
    {
      id: 'conn-gig-social',
      fromSphere: 'business',
      toSphere: 'social',
      connectionType: 'trigger',
      description: 'Auto-create social posts for confirmed gigs',
      descriptionFr: 'Créer automatiquement des publications pour les spectacles confirmés',
      frequency: 'event-driven',
      dataElements: ['gig-name', 'venue', 'date', 'ticket-link']
    },
    {
      id: 'conn-content-platforms',
      fromSphere: 'design_studio',
      toSphere: 'social',
      connectionType: 'data-sync',
      description: 'Share new releases on social platforms',
      descriptionFr: 'Partager les nouvelles sorties sur les réseaux sociaux',
      frequency: 'event-driven',
      dataElements: ['release-artwork', 'link', 'promo-text']
    }
  ],
  
  requiredIntegrations: [
    {
      id: 'int-distrokid',
      name: 'DistroKid/CD Baby',
      type: 'api',
      provider: 'DistroKid',
      sphere: 'entertainment',
      purpose: 'Music distribution stats',
      purposeFr: 'Statistiques de distribution musicale',
      priority: 'essential'
    },
    {
      id: 'int-spotify-artists',
      name: 'Spotify for Artists',
      type: 'api',
      provider: 'Spotify',
      sphere: 'social',
      purpose: 'Streaming analytics',
      purposeFr: 'Analytiques de streaming',
      priority: 'essential'
    },
    {
      id: 'int-socan',
      name: 'SOCAN/BMI/ASCAP',
      type: 'import',
      provider: 'PROs',
      sphere: 'government',
      purpose: 'Royalty statements import',
      purposeFr: 'Import des relevés de redevances',
      priority: 'essential'
    },
    {
      id: 'int-instagram',
      name: 'Instagram/Meta',
      type: 'api',
      provider: 'Meta',
      sphere: 'social',
      purpose: 'Content scheduling',
      purposeFr: 'Programmation de contenu',
      priority: 'important'
    },
    {
      id: 'int-bandcamp',
      name: 'Bandcamp',
      type: 'api',
      provider: 'Bandcamp',
      sphere: 'business',
      purpose: 'Direct sales tracking',
      purposeFr: 'Suivi des ventes directes',
      priority: 'important'
    }
  ],
  
  executionInterfaces: [
    {
      id: 'ui-song-catalog',
      name: 'Song Catalog',
      nameFr: 'Catalogue de chansons',
      type: 'dashboard',
      sphere: 'design_studio',
      description: 'All songs with lyrics, recordings, versions, publishing info'
    },
    {
      id: 'ui-gig-pipeline',
      name: 'Gig Pipeline',
      nameFr: 'Pipeline de spectacles',
      type: 'tracker',
      sphere: 'business',
      description: 'Inquiry → Negotiation → Confirmed → Completed → Paid'
    },
    {
      id: 'ui-royalty-dashboard',
      name: 'Royalty Dashboard',
      nameFr: 'Tableau de bord redevances',
      type: 'dashboard',
      sphere: 'business',
      description: 'All royalty income by song, platform, period'
    },
    {
      id: 'ui-content-calendar',
      name: 'Social Content Calendar',
      nameFr: 'Calendrier de contenu social',
      type: 'dashboard',
      sphere: 'social',
      description: 'Plan and schedule content across all platforms'
    },
    {
      id: 'ui-grant-tracker',
      name: 'Grant Application Tracker',
      nameFr: 'Suivi des demandes de subventions',
      type: 'tracker',
      sphere: 'government',
      description: 'Track grant opportunities, deadlines, applications, status'
    },
    {
      id: 'ui-teaching-studio',
      name: 'Teaching Studio',
      nameFr: 'Studio d\'enseignement',
      type: 'dashboard',
      sphere: 'business',
      description: 'Students, schedules, lesson plans, payments'
    }
  ],
  
  dataFlows: [
    {
      id: 'flow-spotify-import',
      name: 'Spotify Stats Import',
      direction: 'import',
      format: ['API'],
      source: 'Spotify for Artists',
      destination: 'Social > Analytics',
      frequency: 'Daily'
    },
    {
      id: 'flow-pro-import',
      name: 'PRO Statement Import',
      direction: 'import',
      format: ['PDF', 'CSV'],
      source: 'SOCAN/BMI',
      destination: 'Business > Royalties',
      frequency: 'Quarterly'
    },
    {
      id: 'flow-setlist-export',
      name: 'Setlist Export',
      direction: 'export',
      format: ['PDF'],
      source: 'Studio > Songs',
      destination: 'Gig documentation',
      frequency: 'Per gig'
    }
  ],
  
  suggestedBureauCustomization: [
    {
      sphereId: 'design_studio',
      prioritizedViews: ['Song Catalog', 'Recording Projects', 'Collaborations'],
      customSections: ['Lyric Notebook', 'Demo Recordings', 'Album Projects'],
      customAgents: ['Co-writer Split Calculator', 'Release Planner']
    },
    {
      sphereId: 'business',
      prioritizedViews: ['Gig Pipeline', 'Royalties', 'Teaching'],
      customSections: ['Merch Inventory', 'Sync Licensing'],
      customAgents: ['Gig Contract Generator', 'Royalty Reconciler']
    }
  ],
  
  identifiedGaps: [
    {
      id: 'gap-song-versions',
      description: 'Need to track song versions (demo, acoustic, album, live)',
      descriptionFr: 'Besoin de suivre les versions des chansons (démo, acoustique, album, live)',
      severity: 'major',
      affectedSpheres: ['design_studio'],
      proposedSolution: 'Song entity with version tracking and master designation'
    },
    {
      id: 'gap-split-sheets',
      description: 'No standard way to manage co-writer splits',
      descriptionFr: 'Pas de façon standard de gérer les parts des co-auteurs',
      severity: 'major',
      affectedSpheres: ['design_studio', 'government', 'business'],
      proposedSolution: 'Split Sheet module linked to songs, copyright, and royalty distribution'
    },
    {
      id: 'gap-gig-pipeline',
      description: 'Standard CRM doesn\'t fit gig booking workflow',
      descriptionFr: 'CRM standard ne convient pas au flux de réservation de spectacles',
      severity: 'major',
      affectedSpheres: ['business'],
      proposedSolution: 'Specialized Gig Pipeline with stages: Inquiry → Negotiate → Confirm → Advance → Perform → Collect'
    },
    {
      id: 'gap-royalty-reconciliation',
      description: 'Need to reconcile PRO statements with song catalog',
      descriptionFr: 'Besoin de réconcilier les relevés PRO avec le catalogue de chansons',
      severity: 'major',
      affectedSpheres: ['business', 'government'],
      proposedSolution: 'Royalty module that matches statements to songs, flags discrepancies'
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// PROFIL 3: SARAH - MÉDECIN DE FAMILLE EN PRATIQUE PRIVÉE
// ═══════════════════════════════════════════════════════════════════════════

export const PROFILE_SARAH_DOCTOR: CompleteUserProfile = {
  id: 'profile-sarah-doctor',
  name: 'Sarah - Family Doctor Private Practice',
  nameFr: 'Sarah - Médecin de famille en pratique privée',
  description: 'Family physician with private practice, incorporated, balancing clinic, family and investments',
  descriptionFr: 'Médecin de famille avec pratique privée incorporée, équilibrant clinique, famille et investissements',
  
  activeSpheres: [
    {
      sphereId: 'business',
      usageLevel: 'primary',
      mainUseCases: ['Practice management', 'Billing (RAMQ/OHIP)', 'Staff management', 'Supplies'],
      estimatedTimePercent: 40
    },
    {
      sphereId: 'government',
      usageLevel: 'primary',
      mainUseCases: ['Medical license', 'CME credits', 'Billing codes', 'Tax planning'],
      estimatedTimePercent: 25
    },
    {
      sphereId: 'personal',
      usageLevel: 'secondary',
      mainUseCases: ['Family schedule', 'Personal finances', 'Kids activities'],
      estimatedTimePercent: 20
    },
    {
      sphereId: 'my_team',
      usageLevel: 'secondary',
      mainUseCases: ['Billing AI', 'Schedule optimizer', 'CME tracker'],
      estimatedTimePercent: 10
    },
    {
      sphereId: 'community',
      usageLevel: 'occasional',
      mainUseCases: ['Medical association', 'Peer network'],
      estimatedTimePercent: 5
    }
  ],
  
  specificNeeds: [
    {
      id: 'need-billing',
      need: 'Submit billing codes to provincial health insurance correctly',
      needFr: 'Soumettre les codes de facturation à l\'assurance maladie correctement',
      sphere: 'business',
      priority: 'critical',
      currentSolution: 'EMR billing module, often miss codes',
      proposedSolution: 'Billing Assistant AI that suggests optimal codes, tracks submissions'
    },
    {
      id: 'need-cme',
      need: 'Track CME credits across multiple categories for license renewal',
      needFr: 'Suivre les crédits de FMC par catégorie pour le renouvellement de licence',
      sphere: 'government',
      priority: 'critical',
      currentSolution: 'Paper folder, hope it adds up',
      proposedSolution: 'CME Tracker linked to license requirements, gap alerts'
    },
    {
      id: 'need-incorporation',
      need: 'Manage professional corporation with salary vs dividend optimization',
      needFr: 'Gérer la société professionnelle avec optimisation salaire vs dividendes',
      sphere: 'business',
      priority: 'critical',
      currentSolution: 'Accountant handles, don\'t understand',
      proposedSolution: 'Corp Dashboard showing retained earnings, optimal draw strategies'
    },
    {
      id: 'need-schedule',
      need: 'Balance clinic days with OR days, teaching, and family',
      needFr: 'Équilibrer jours de clinique avec jours au bloc, enseignement et famille',
      sphere: 'personal',
      priority: 'important',
      currentSolution: 'Multiple calendars, constant conflicts',
      proposedSolution: 'Unified calendar with work-life balance scoring'
    },
    {
      id: 'need-investments',
      need: 'Track professional corporation investments and RRSP/TFSA',
      needFr: 'Suivre les investissements de la société et REER/CELI',
      sphere: 'personal',
      priority: 'important',
      currentSolution: 'Check accounts occasionally',
      proposedSolution: 'Investment Dashboard for both corp and personal'
    }
  ],
  
  criticalData: [
    {
      id: 'data-billing',
      dataName: 'Billing Records',
      dataNameFr: 'Registres de facturation',
      sphere: 'business',
      dataType: 'hierarchy',
      updateFrequency: 'daily',
      sharedWith: ['government']
    },
    {
      id: 'data-cme',
      dataName: 'CME Credits',
      dataNameFr: 'Crédits de FMC',
      sphere: 'government',
      dataType: 'hierarchy',
      updateFrequency: 'monthly',
      sharedWith: []
    },
    {
      id: 'data-license',
      dataName: 'Medical License',
      dataNameFr: 'Permis médical',
      sphere: 'government',
      dataType: 'text',
      updateFrequency: 'yearly',
      sharedWith: ['business']
    }
  ],
  
  requiredConnections: [
    {
      id: 'conn-billing-ramq',
      fromSphere: 'business',
      toSphere: 'government',
      connectionType: 'data-sync',
      description: 'Submit billing claims to RAMQ/OHIP',
      descriptionFr: 'Soumettre les réclamations à la RAMQ/OHIP',
      frequency: 'daily',
      dataElements: ['patient-id', 'billing-codes', 'date', 'fees']
    },
    {
      id: 'conn-corp-personal',
      fromSphere: 'business',
      toSphere: 'personal',
      connectionType: 'data-sync',
      description: 'Corp dividends to personal finances',
      descriptionFr: 'Dividendes de la société vers finances personnelles',
      frequency: 'monthly',
      dataElements: ['dividend-amount', 'tax-implications']
    }
  ],
  
  requiredIntegrations: [
    {
      id: 'int-emr',
      name: 'EMR System',
      type: 'api',
      provider: 'Oscar/Accuro/Telus',
      sphere: 'business',
      purpose: 'Patient billing sync',
      purposeFr: 'Synchronisation facturation patients',
      priority: 'essential'
    },
    {
      id: 'int-ramq',
      name: 'RAMQ/OHIP Portal',
      type: 'api',
      provider: 'Provincial health',
      sphere: 'government',
      purpose: 'Billing submission and remittance',
      purposeFr: 'Soumission de facturation et paiement',
      priority: 'essential'
    },
    {
      id: 'int-cme-tracker',
      name: 'CFPC/RCPSC CME',
      type: 'import',
      provider: 'Medical colleges',
      sphere: 'government',
      purpose: 'CME credit tracking',
      purposeFr: 'Suivi des crédits de FMC',
      priority: 'essential'
    }
  ],
  
  executionInterfaces: [
    {
      id: 'ui-billing-dashboard',
      name: 'Billing Dashboard',
      nameFr: 'Tableau de bord facturation',
      type: 'dashboard',
      sphere: 'business',
      description: 'Daily billing, pending claims, remittances, rejections'
    },
    {
      id: 'ui-cme-tracker',
      name: 'CME Credit Tracker',
      nameFr: 'Suivi des crédits FMC',
      type: 'tracker',
      sphere: 'government',
      description: 'Credits by category, requirements, gaps, upcoming opportunities'
    },
    {
      id: 'ui-corp-dashboard',
      name: 'Professional Corporation Dashboard',
      nameFr: 'Tableau de bord de la société professionnelle',
      type: 'dashboard',
      sphere: 'business',
      description: 'Retained earnings, salary/dividend mix, tax projections'
    }
  ],
  
  dataFlows: [
    {
      id: 'flow-billing-submit',
      name: 'Billing Submission',
      direction: 'export',
      format: ['HL7', 'XML'],
      source: 'Business > Billing',
      destination: 'RAMQ/OHIP',
      frequency: 'Daily'
    },
    {
      id: 'flow-remittance',
      name: 'Remittance Import',
      direction: 'import',
      format: ['XML'],
      source: 'RAMQ/OHIP',
      destination: 'Business > Revenue',
      frequency: 'Weekly'
    }
  ],
  
  suggestedBureauCustomization: [
    {
      sphereId: 'business',
      prioritizedViews: ['Billing', 'Revenue', 'Corporation', 'Staff'],
      customSections: ['Rejected Claims', 'Code Optimizer'],
      customAgents: ['Billing Code Suggester', 'Revenue Forecaster']
    },
    {
      sphereId: 'government',
      prioritizedViews: ['License', 'CME Credits', 'RAMQ Status'],
      customSections: ['CME Planner'],
      customAgents: ['CME Gap Analyzer', 'License Renewal Reminder']
    }
  ],
  
  identifiedGaps: [
    {
      id: 'gap-medical-billing',
      description: 'Standard invoicing not suitable for medical billing codes',
      descriptionFr: 'Facturation standard non adaptée aux codes de facturation médicale',
      severity: 'blocker',
      affectedSpheres: ['business', 'government'],
      proposedSolution: 'Medical Billing module with code library, claim tracking, rejection handling'
    },
    {
      id: 'gap-cme-categories',
      description: 'Need to track CME by specific categories (MainPro+, etc.)',
      descriptionFr: 'Besoin de suivre la FMC par catégories spécifiques (MainPro+, etc.)',
      severity: 'major',
      affectedSpheres: ['government'],
      proposedSolution: 'CME module with category tracking and credit type mapping'
    },
    {
      id: 'gap-prof-corp',
      description: 'Professional corporation management needs specialized features',
      descriptionFr: 'Gestion de société professionnelle nécessite fonctions spécialisées',
      severity: 'major',
      affectedSpheres: ['business', 'personal'],
      proposedSolution: 'Professional Corp module with salary/dividend optimization, corporate year-end planning'
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT DE TOUS LES PROFILS
// ═══════════════════════════════════════════════════════════════════════════

export const ALL_USER_PROFILES: CompleteUserProfile[] = [
  PROFILE_JONATHAN_CONTRACTOR,
  PROFILE_MARIE_MUSICIAN,
  PROFILE_SARAH_DOCTOR
];

// Count
export const PROFILE_COUNT = ALL_USER_PROFILES.length;
