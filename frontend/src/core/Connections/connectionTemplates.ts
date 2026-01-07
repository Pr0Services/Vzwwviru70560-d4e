/**
 * CHE·NU™ — SYSTÈME DE CONNEXIONS RÉUTILISABLES
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * PHILOSOPHIE: Une connexion créée une fois = applicable à tous les contextes
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Basé sur l'analyse de 60 scénarios et 6 profils utilisateurs
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES DE BASE
// ═══════════════════════════════════════════════════════════════════════════

export type SphereId = 
  | 'personal' 
  | 'business' 
  | 'government' 
  | 'design_studio' 
  | 'community' 
  | 'social' 
  | 'entertainment' 
  | 'my_team';

export type ConnectionTrigger = 
  | 'manual'           // Utilisateur déclenche
  | 'scheduled'        // Planifié (quotidien, hebdo, mensuel)
  | 'event-driven'     // Quand un événement se produit
  | 'threshold'        // Quand un seuil est atteint
  | 'real-time';       // Synchronisation continue

export type DataFlowDirection = 
  | 'unidirectional'   // A → B
  | 'bidirectional'    // A ↔ B
  | 'aggregation'      // Multiple → One
  | 'distribution';    // One → Multiple

export type AutomationLevel = 
  | 'automatic'        // Aucune intervention requise
  | 'suggested'        // Suggéré à l'utilisateur
  | 'approval-required'// Nécessite approbation
  | 'manual';          // Toujours manuel

// ═══════════════════════════════════════════════════════════════════════════
// INTERFACE CONNEXION TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════

export interface ConnectionTemplate {
  id: string;
  
  // Identification
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  
  // Sphères impliquées
  fromSphere: SphereId;
  toSphere: SphereId;
  
  // Caractéristiques
  direction: DataFlowDirection;
  trigger: ConnectionTrigger;
  automationLevel: AutomationLevel;
  
  // Données transférées
  dataElements: DataElement[];
  
  // Gouvernance
  requiresEncoding: boolean;
  tokenCost: 'low' | 'medium' | 'high';
  auditRequired: boolean;
  
  // Applicabilité
  applicableProfiles: string[];  // IDs des profils qui peuvent utiliser
  applicableScenarios: string[]; // IDs des scénarios concernés
  frequency: number;             // Combien de scénarios utilisent cette connexion
  
  // Configuration
  defaultConfig: ConnectionConfig;
  
  // Tags pour recherche
  tags: string[];
}

export interface DataElement {
  id: string;
  name: string;
  nameFr: string;
  dataType: 'text' | 'number' | 'date' | 'file' | 'reference' | 'computed';
  required: boolean;
  transformations?: string[]; // Encodage, formatage, etc.
}

export interface ConnectionConfig {
  schedule?: string;           // Cron expression si scheduled
  threshold?: number;          // Valeur seuil si threshold-based
  batchSize?: number;          // Nombre d'items par batch
  retryPolicy?: {
    maxRetries: number;
    backoffMs: number;
  };
  notifications: {
    onSuccess: boolean;
    onFailure: boolean;
    onApprovalNeeded: boolean;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// CONNEXIONS TEMPLATES RÉUTILISABLES
// ═══════════════════════════════════════════════════════════════════════════

export const CONNECTION_TEMPLATES: ConnectionTemplate[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // BUSINESS → GOVERNMENT (Fréquence: 42 scénarios)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'tpl-income-tax-filing',
    name: 'Income to Tax Filing',
    nameFr: 'Revenus vers Déclaration fiscale',
    description: 'Aggregate income data for tax return preparation',
    descriptionFr: 'Agréger les données de revenus pour préparation de déclaration',
    fromSphere: 'business',
    toSphere: 'government',
    direction: 'aggregation',
    trigger: 'scheduled',
    automationLevel: 'suggested',
    dataElements: [
      { id: 'gross-income', name: 'Gross Income', nameFr: 'Revenu brut', dataType: 'number', required: true },
      { id: 'expenses', name: 'Business Expenses', nameFr: 'Dépenses d\'affaires', dataType: 'number', required: true },
      { id: 'tax-category', name: 'Tax Categories', nameFr: 'Catégories fiscales', dataType: 'reference', required: true },
      { id: 'receipts', name: 'Receipt References', nameFr: 'Références de reçus', dataType: 'reference', required: false }
    ],
    requiresEncoding: true,
    tokenCost: 'medium',
    auditRequired: true,
    applicableProfiles: ['marie-musician', 'jonathan-contractor', 'sarah-doctor', 'alex-event-planner', 'emilie-ecommerce', 'marc-farmer'],
    applicableScenarios: ['scenario-001', 'scenario-011', 'scenario-012', 'scenario-017', 'scenario-041'],
    frequency: 42,
    defaultConfig: {
      schedule: '0 0 1 * *', // Monthly
      notifications: { onSuccess: false, onFailure: true, onApprovalNeeded: true }
    },
    tags: ['tax', 'income', 'filing', 'compliance', 'annual']
  },

  {
    id: 'tpl-sales-tax-remittance',
    name: 'Sales to Tax Remittance',
    nameFr: 'Ventes vers Remise de taxes',
    description: 'Calculate and prepare sales tax (GST/HST/PST) remittance',
    descriptionFr: 'Calculer et préparer les remises de taxes de vente (TPS/TVH/TVQ)',
    fromSphere: 'business',
    toSphere: 'government',
    direction: 'aggregation',
    trigger: 'scheduled',
    automationLevel: 'suggested',
    dataElements: [
      { id: 'taxable-sales', name: 'Taxable Sales', nameFr: 'Ventes taxables', dataType: 'number', required: true },
      { id: 'tax-collected', name: 'Tax Collected', nameFr: 'Taxes perçues', dataType: 'number', required: true },
      { id: 'itc-claimed', name: 'Input Tax Credits', nameFr: 'CTI réclamés', dataType: 'number', required: true },
      { id: 'net-tax', name: 'Net Tax Owing', nameFr: 'Taxe nette due', dataType: 'computed', required: true }
    ],
    requiresEncoding: true,
    tokenCost: 'low',
    auditRequired: true,
    applicableProfiles: ['jonathan-contractor', 'emilie-ecommerce', 'alex-event-planner'],
    applicableScenarios: ['scenario-043'],
    frequency: 25,
    defaultConfig: {
      schedule: '0 0 1 */3 *', // Quarterly
      notifications: { onSuccess: true, onFailure: true, onApprovalNeeded: true }
    },
    tags: ['gst', 'hst', 'sales-tax', 'remittance', 'quarterly']
  },

  {
    id: 'tpl-permit-application',
    name: 'Project to Permit Application',
    nameFr: 'Projet vers Demande de permis',
    description: 'Generate permit applications from project details',
    descriptionFr: 'Générer des demandes de permis à partir des détails du projet',
    fromSphere: 'business',
    toSphere: 'government',
    direction: 'unidirectional',
    trigger: 'event-driven',
    automationLevel: 'approval-required',
    dataElements: [
      { id: 'project-type', name: 'Project Type', nameFr: 'Type de projet', dataType: 'reference', required: true },
      { id: 'location', name: 'Project Location', nameFr: 'Emplacement du projet', dataType: 'text', required: true },
      { id: 'scope', name: 'Work Scope', nameFr: 'Portée des travaux', dataType: 'text', required: true },
      { id: 'drawings', name: 'Technical Drawings', nameFr: 'Dessins techniques', dataType: 'file', required: false }
    ],
    requiresEncoding: false,
    tokenCost: 'high',
    auditRequired: true,
    applicableProfiles: ['jonathan-contractor'],
    applicableScenarios: ['scenario-019', 'scenario-046'],
    frequency: 15,
    defaultConfig: {
      notifications: { onSuccess: true, onFailure: true, onApprovalNeeded: true }
    },
    tags: ['permit', 'construction', 'municipal', 'application']
  },

  {
    id: 'tpl-license-renewal',
    name: 'CE Credits to License Renewal',
    nameFr: 'Crédits FC vers Renouvellement de licence',
    description: 'Compile CE credits for professional license renewal',
    descriptionFr: 'Compiler les crédits de FC pour renouvellement de licence',
    fromSphere: 'community',
    toSphere: 'government',
    direction: 'aggregation',
    trigger: 'scheduled',
    automationLevel: 'suggested',
    dataElements: [
      { id: 'credits-earned', name: 'Credits Earned', nameFr: 'Crédits obtenus', dataType: 'number', required: true },
      { id: 'credit-categories', name: 'Credit Categories', nameFr: 'Catégories de crédits', dataType: 'reference', required: true },
      { id: 'certificates', name: 'Certificates', nameFr: 'Certificats', dataType: 'file', required: true },
      { id: 'renewal-deadline', name: 'Renewal Deadline', nameFr: 'Date limite', dataType: 'date', required: true }
    ],
    requiresEncoding: true,
    tokenCost: 'low',
    auditRequired: true,
    applicableProfiles: ['sarah-doctor', 'marie-musician'],
    applicableScenarios: ['scenario-035', 'scenario-042'],
    frequency: 18,
    defaultConfig: {
      schedule: '0 0 1 * *', // Monthly check
      notifications: { onSuccess: false, onFailure: true, onApprovalNeeded: true }
    },
    tags: ['license', 'renewal', 'ce-credits', 'professional', 'compliance']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BUSINESS → PERSONAL (Fréquence: 38 scénarios)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'tpl-appointment-sync',
    name: 'Business Appointments to Personal Calendar',
    nameFr: 'Rendez-vous d\'affaires vers Calendrier personnel',
    description: 'Sync business appointments to personal calendar for work-life visibility',
    descriptionFr: 'Synchroniser les rendez-vous d\'affaires au calendrier personnel',
    fromSphere: 'business',
    toSphere: 'personal',
    direction: 'unidirectional',
    trigger: 'real-time',
    automationLevel: 'automatic',
    dataElements: [
      { id: 'event-title', name: 'Event Title', nameFr: 'Titre de l\'événement', dataType: 'text', required: true },
      { id: 'start-time', name: 'Start Time', nameFr: 'Heure de début', dataType: 'date', required: true },
      { id: 'end-time', name: 'End Time', nameFr: 'Heure de fin', dataType: 'date', required: true },
      { id: 'location', name: 'Location', nameFr: 'Lieu', dataType: 'text', required: false }
    ],
    requiresEncoding: false,
    tokenCost: 'low',
    auditRequired: false,
    applicableProfiles: ['all'],
    applicableScenarios: ['scenario-002', 'scenario-007', 'scenario-012'],
    frequency: 38,
    defaultConfig: {
      notifications: { onSuccess: false, onFailure: true, onApprovalNeeded: false }
    },
    tags: ['calendar', 'sync', 'appointments', 'work-life-balance']
  },

  {
    id: 'tpl-income-tracking',
    name: 'Business Income to Personal Finance',
    nameFr: 'Revenus d\'affaires vers Finances personnelles',
    description: 'Track business income in personal financial overview',
    descriptionFr: 'Suivre les revenus d\'affaires dans l\'aperçu financier personnel',
    fromSphere: 'business',
    toSphere: 'personal',
    direction: 'aggregation',
    trigger: 'event-driven',
    automationLevel: 'automatic',
    dataElements: [
      { id: 'income-amount', name: 'Income Amount', nameFr: 'Montant du revenu', dataType: 'number', required: true },
      { id: 'income-date', name: 'Income Date', nameFr: 'Date du revenu', dataType: 'date', required: true },
      { id: 'source', name: 'Income Source', nameFr: 'Source du revenu', dataType: 'reference', required: true },
      { id: 'category', name: 'Category', nameFr: 'Catégorie', dataType: 'reference', required: true }
    ],
    requiresEncoding: true,
    tokenCost: 'low',
    auditRequired: false,
    applicableProfiles: ['marie-musician', 'jonathan-contractor', 'sarah-doctor', 'alex-event-planner', 'emilie-ecommerce'],
    applicableScenarios: ['scenario-001', 'scenario-002', 'scenario-011'],
    frequency: 35,
    defaultConfig: {
      notifications: { onSuccess: false, onFailure: true, onApprovalNeeded: false }
    },
    tags: ['income', 'finance', 'tracking', 'personal']
  },

  {
    id: 'tpl-deadline-reminder',
    name: 'Business Deadlines to Personal Reminders',
    nameFr: 'Échéances d\'affaires vers Rappels personnels',
    description: 'Create personal reminders for important business deadlines',
    descriptionFr: 'Créer des rappels personnels pour les échéances d\'affaires importantes',
    fromSphere: 'business',
    toSphere: 'personal',
    direction: 'unidirectional',
    trigger: 'event-driven',
    automationLevel: 'automatic',
    dataElements: [
      { id: 'deadline-name', name: 'Deadline Name', nameFr: 'Nom de l\'échéance', dataType: 'text', required: true },
      { id: 'due-date', name: 'Due Date', nameFr: 'Date d\'échéance', dataType: 'date', required: true },
      { id: 'reminder-lead', name: 'Reminder Lead Time', nameFr: 'Délai de rappel', dataType: 'number', required: true },
      { id: 'priority', name: 'Priority', nameFr: 'Priorité', dataType: 'reference', required: true }
    ],
    requiresEncoding: false,
    tokenCost: 'low',
    auditRequired: false,
    applicableProfiles: ['all'],
    applicableScenarios: ['scenario-019', 'scenario-041', 'scenario-043'],
    frequency: 30,
    defaultConfig: {
      notifications: { onSuccess: false, onFailure: false, onApprovalNeeded: false }
    },
    tags: ['deadline', 'reminder', 'calendar', 'planning']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STUDIO → BUSINESS (Fréquence: 28 scénarios)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'tpl-work-invoice',
    name: 'Creative Work to Invoice',
    nameFr: 'Œuvre créative vers Facture',
    description: 'Generate invoice from completed creative work',
    descriptionFr: 'Générer une facture à partir d\'une œuvre créative complétée',
    fromSphere: 'design_studio',
    toSphere: 'business',
    direction: 'unidirectional',
    trigger: 'event-driven',
    automationLevel: 'suggested',
    dataElements: [
      { id: 'work-id', name: 'Work Reference', nameFr: 'Référence de l\'œuvre', dataType: 'reference', required: true },
      { id: 'client', name: 'Client', nameFr: 'Client', dataType: 'reference', required: true },
      { id: 'amount', name: 'Amount', nameFr: 'Montant', dataType: 'number', required: true },
      { id: 'description', name: 'Work Description', nameFr: 'Description du travail', dataType: 'text', required: true },
      { id: 'deliverables', name: 'Deliverables', nameFr: 'Livrables', dataType: 'file', required: false }
    ],
    requiresEncoding: true,
    tokenCost: 'medium',
    auditRequired: true,
    applicableProfiles: ['marie-musician', 'alex-event-planner'],
    applicableScenarios: ['scenario-001', 'scenario-002', 'scenario-003', 'scenario-007'],
    frequency: 28,
    defaultConfig: {
      notifications: { onSuccess: true, onFailure: true, onApprovalNeeded: true }
    },
    tags: ['invoice', 'creative', 'billing', 'work']
  },

  {
    id: 'tpl-royalty-tracking',
    name: 'Creative Works to Royalty Tracker',
    nameFr: 'Œuvres créatives vers Suivi des redevances',
    description: 'Link creative works to royalty income tracking',
    descriptionFr: 'Lier les œuvres créatives au suivi des revenus de redevances',
    fromSphere: 'design_studio',
    toSphere: 'business',
    direction: 'bidirectional',
    trigger: 'event-driven',
    automationLevel: 'automatic',
    dataElements: [
      { id: 'work-id', name: 'Work ID', nameFr: 'ID de l\'œuvre', dataType: 'reference', required: true },
      { id: 'platform', name: 'Platform', nameFr: 'Plateforme', dataType: 'reference', required: true },
      { id: 'streams', name: 'Streams/Uses', nameFr: 'Écoutes/Utilisations', dataType: 'number', required: true },
      { id: 'revenue', name: 'Revenue', nameFr: 'Revenus', dataType: 'number', required: true },
      { id: 'period', name: 'Period', nameFr: 'Période', dataType: 'date', required: true }
    ],
    requiresEncoding: true,
    tokenCost: 'medium',
    auditRequired: true,
    applicableProfiles: ['marie-musician'],
    applicableScenarios: ['scenario-005', 'scenario-008'],
    frequency: 12,
    defaultConfig: {
      schedule: '0 0 * * 0', // Weekly
      notifications: { onSuccess: false, onFailure: true, onApprovalNeeded: false }
    },
    tags: ['royalty', 'streaming', 'income', 'tracking', 'music']
  },

  {
    id: 'tpl-project-billing',
    name: 'Project Milestones to Progress Billing',
    nameFr: 'Jalons de projet vers Facturation d\'avancement',
    description: 'Generate progress billing from project milestone completion',
    descriptionFr: 'Générer la facturation d\'avancement à partir des jalons complétés',
    fromSphere: 'design_studio',
    toSphere: 'business',
    direction: 'unidirectional',
    trigger: 'event-driven',
    automationLevel: 'approval-required',
    dataElements: [
      { id: 'project-id', name: 'Project ID', nameFr: 'ID du projet', dataType: 'reference', required: true },
      { id: 'milestone', name: 'Milestone', nameFr: 'Jalon', dataType: 'reference', required: true },
      { id: 'completion-percent', name: 'Completion %', nameFr: '% de complétion', dataType: 'number', required: true },
      { id: 'billing-amount', name: 'Billing Amount', nameFr: 'Montant à facturer', dataType: 'computed', required: true },
      { id: 'holdback', name: 'Holdback', nameFr: 'Retenue', dataType: 'number', required: false }
    ],
    requiresEncoding: true,
    tokenCost: 'medium',
    auditRequired: true,
    applicableProfiles: ['jonathan-contractor'],
    applicableScenarios: ['scenario-011', 'scenario-019'],
    frequency: 15,
    defaultConfig: {
      notifications: { onSuccess: true, onFailure: true, onApprovalNeeded: true }
    },
    tags: ['progress-billing', 'milestone', 'construction', 'project']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ENTERTAINMENT → SOCIAL (Fréquence: 22 scénarios)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'tpl-event-promotion',
    name: 'Event to Social Announcement',
    nameFr: 'Événement vers Annonce sociale',
    description: 'Create social media posts from event details',
    descriptionFr: 'Créer des publications sociales à partir des détails d\'événement',
    fromSphere: 'entertainment',
    toSphere: 'social',
    direction: 'unidirectional',
    trigger: 'event-driven',
    automationLevel: 'suggested',
    dataElements: [
      { id: 'event-name', name: 'Event Name', nameFr: 'Nom de l\'événement', dataType: 'text', required: true },
      { id: 'date-time', name: 'Date/Time', nameFr: 'Date/Heure', dataType: 'date', required: true },
      { id: 'location', name: 'Location', nameFr: 'Lieu', dataType: 'text', required: true },
      { id: 'description', name: 'Description', nameFr: 'Description', dataType: 'text', required: true },
      { id: 'image', name: 'Event Image', nameFr: 'Image de l\'événement', dataType: 'file', required: false },
      { id: 'ticket-link', name: 'Ticket Link', nameFr: 'Lien de billets', dataType: 'text', required: false }
    ],
    requiresEncoding: true,
    tokenCost: 'medium',
    auditRequired: false,
    applicableProfiles: ['marie-musician', 'alex-event-planner'],
    applicableScenarios: ['scenario-002', 'scenario-021', 'scenario-052', 'scenario-053'],
    frequency: 22,
    defaultConfig: {
      notifications: { onSuccess: true, onFailure: true, onApprovalNeeded: true }
    },
    tags: ['event', 'social', 'promotion', 'announcement']
  },

  {
    id: 'tpl-content-share',
    name: 'New Release to Social Share',
    nameFr: 'Nouvelle sortie vers Partage social',
    description: 'Share new creative releases on social platforms',
    descriptionFr: 'Partager les nouvelles sorties créatives sur les réseaux sociaux',
    fromSphere: 'design_studio',
    toSphere: 'social',
    direction: 'distribution',
    trigger: 'event-driven',
    automationLevel: 'suggested',
    dataElements: [
      { id: 'release-title', name: 'Release Title', nameFr: 'Titre de la sortie', dataType: 'text', required: true },
      { id: 'release-type', name: 'Release Type', nameFr: 'Type de sortie', dataType: 'reference', required: true },
      { id: 'platforms', name: 'Target Platforms', nameFr: 'Plateformes cibles', dataType: 'reference', required: true },
      { id: 'caption', name: 'Caption', nameFr: 'Légende', dataType: 'text', required: true },
      { id: 'media', name: 'Media Assets', nameFr: 'Médias', dataType: 'file', required: true },
      { id: 'links', name: 'Streaming Links', nameFr: 'Liens streaming', dataType: 'text', required: false }
    ],
    requiresEncoding: true,
    tokenCost: 'medium',
    auditRequired: false,
    applicableProfiles: ['marie-musician'],
    applicableScenarios: ['scenario-005', 'scenario-053', 'scenario-058'],
    frequency: 20,
    defaultConfig: {
      notifications: { onSuccess: true, onFailure: true, onApprovalNeeded: true }
    },
    tags: ['release', 'social', 'share', 'content', 'music']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COMMUNITY → BUSINESS (Fréquence: 25 scénarios)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'tpl-membership-payment',
    name: 'Membership to Payment Tracking',
    nameFr: 'Adhésion vers Suivi de paiement',
    description: 'Track membership and subscription payments',
    descriptionFr: 'Suivre les paiements d\'adhésion et d\'abonnement',
    fromSphere: 'community',
    toSphere: 'business',
    direction: 'unidirectional',
    trigger: 'event-driven',
    automationLevel: 'automatic',
    dataElements: [
      { id: 'member-id', name: 'Member ID', nameFr: 'ID du membre', dataType: 'reference', required: true },
      { id: 'amount', name: 'Amount', nameFr: 'Montant', dataType: 'number', required: true },
      { id: 'period', name: 'Period', nameFr: 'Période', dataType: 'date', required: true },
      { id: 'payment-date', name: 'Payment Date', nameFr: 'Date de paiement', dataType: 'date', required: true }
    ],
    requiresEncoding: false,
    tokenCost: 'low',
    auditRequired: true,
    applicableProfiles: ['alex-event-planner', 'marc-farmer'],
    applicableScenarios: ['scenario-031', 'scenario-032', 'scenario-035', 'scenario-037'],
    frequency: 25,
    defaultConfig: {
      notifications: { onSuccess: false, onFailure: true, onApprovalNeeded: false }
    },
    tags: ['membership', 'payment', 'subscription', 'tracking']
  },

  {
    id: 'tpl-donation-receipt',
    name: 'Donation to Tax Receipt',
    nameFr: 'Don vers Reçu fiscal',
    description: 'Generate tax receipts for charitable donations',
    descriptionFr: 'Générer des reçus fiscaux pour les dons de charité',
    fromSphere: 'community',
    toSphere: 'business',
    direction: 'unidirectional',
    trigger: 'event-driven',
    automationLevel: 'suggested',
    dataElements: [
      { id: 'donor', name: 'Donor Information', nameFr: 'Information du donateur', dataType: 'reference', required: true },
      { id: 'amount', name: 'Donation Amount', nameFr: 'Montant du don', dataType: 'number', required: true },
      { id: 'date', name: 'Donation Date', nameFr: 'Date du don', dataType: 'date', required: true },
      { id: 'receipt-number', name: 'Receipt Number', nameFr: 'Numéro de reçu', dataType: 'computed', required: true }
    ],
    requiresEncoding: false,
    tokenCost: 'low',
    auditRequired: true,
    applicableProfiles: [],
    applicableScenarios: ['scenario-031', 'scenario-034'],
    frequency: 8,
    defaultConfig: {
      notifications: { onSuccess: true, onFailure: true, onApprovalNeeded: false }
    },
    tags: ['donation', 'receipt', 'tax', 'charity', 'nonprofit']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GOVERNMENT → PERSONAL (Fréquence: 18 scénarios)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'tpl-gov-deadline-calendar',
    name: 'Government Deadlines to Calendar',
    nameFr: 'Échéances gouvernementales vers Calendrier',
    description: 'Add government deadlines (tax, permits, renewals) to personal calendar',
    descriptionFr: 'Ajouter les échéances gouvernementales au calendrier personnel',
    fromSphere: 'government',
    toSphere: 'personal',
    direction: 'unidirectional',
    trigger: 'event-driven',
    automationLevel: 'automatic',
    dataElements: [
      { id: 'deadline-type', name: 'Deadline Type', nameFr: 'Type d\'échéance', dataType: 'reference', required: true },
      { id: 'due-date', name: 'Due Date', nameFr: 'Date d\'échéance', dataType: 'date', required: true },
      { id: 'description', name: 'Description', nameFr: 'Description', dataType: 'text', required: true },
      { id: 'reminder-days', name: 'Reminder Days Before', nameFr: 'Jours de rappel avant', dataType: 'number', required: true }
    ],
    requiresEncoding: false,
    tokenCost: 'low',
    auditRequired: false,
    applicableProfiles: ['all'],
    applicableScenarios: ['scenario-041', 'scenario-042', 'scenario-043'],
    frequency: 18,
    defaultConfig: {
      notifications: { onSuccess: false, onFailure: true, onApprovalNeeded: false }
    },
    tags: ['deadline', 'calendar', 'government', 'reminder', 'compliance']
  },

  {
    id: 'tpl-inspection-schedule',
    name: 'Inspection to Calendar',
    nameFr: 'Inspection vers Calendrier',
    description: 'Add scheduled inspections to personal calendar',
    descriptionFr: 'Ajouter les inspections planifiées au calendrier personnel',
    fromSphere: 'government',
    toSphere: 'personal',
    direction: 'unidirectional',
    trigger: 'event-driven',
    automationLevel: 'automatic',
    dataElements: [
      { id: 'inspection-type', name: 'Inspection Type', nameFr: 'Type d\'inspection', dataType: 'reference', required: true },
      { id: 'date-time', name: 'Date/Time', nameFr: 'Date/Heure', dataType: 'date', required: true },
      { id: 'location', name: 'Location', nameFr: 'Lieu', dataType: 'text', required: true },
      { id: 'inspector', name: 'Inspector', nameFr: 'Inspecteur', dataType: 'text', required: false },
      { id: 'project-ref', name: 'Project Reference', nameFr: 'Référence du projet', dataType: 'reference', required: true }
    ],
    requiresEncoding: false,
    tokenCost: 'low',
    auditRequired: false,
    applicableProfiles: ['jonathan-contractor', 'marc-farmer'],
    applicableScenarios: ['scenario-019', 'scenario-045', 'scenario-048'],
    frequency: 12,
    defaultConfig: {
      notifications: { onSuccess: true, onFailure: true, onApprovalNeeded: false }
    },
    tags: ['inspection', 'calendar', 'scheduling', 'compliance']
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// FONCTIONS UTILITAIRES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Trouver les templates applicables à un profil utilisateur
 */
export function getTemplatesForProfile(profileId: string): ConnectionTemplate[] {
  return CONNECTION_TEMPLATES.filter(t => 
    t.applicableProfiles.includes(profileId) || t.applicableProfiles.includes('all')
  );
}

/**
 * Trouver les templates entre deux sphères
 */
export function getTemplatesBetweenSpheres(from: SphereId, to: SphereId): ConnectionTemplate[] {
  return CONNECTION_TEMPLATES.filter(t => t.fromSphere === from && t.toSphere === to);
}

/**
 * Trouver les templates par tag
 */
export function getTemplatesByTag(tag: string): ConnectionTemplate[] {
  return CONNECTION_TEMPLATES.filter(t => t.tags.includes(tag));
}

/**
 * Obtenir les templates les plus utilisés
 */
export function getMostUsedTemplates(limit: number = 10): ConnectionTemplate[] {
  return [...CONNECTION_TEMPLATES]
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, limit);
}

/**
 * Calculer le coût token estimé pour une connexion
 */
export function estimateTokenCost(template: ConnectionTemplate): number {
  const baseCost = { low: 10, medium: 50, high: 200 };
  return baseCost[template.tokenCost] * template.dataElements.length;
}

// ═══════════════════════════════════════════════════════════════════════════
// STATISTIQUES
// ═══════════════════════════════════════════════════════════════════════════

export const CONNECTION_STATS = {
  totalTemplates: CONNECTION_TEMPLATES.length,
  
  byFromSphere: {
    business: CONNECTION_TEMPLATES.filter(t => t.fromSphere === 'business').length,
    studio: CONNECTION_TEMPLATES.filter(t => t.fromSphere === 'design_studio').length,
    community: CONNECTION_TEMPLATES.filter(t => t.fromSphere === 'community').length,
    government: CONNECTION_TEMPLATES.filter(t => t.fromSphere === 'government').length,
    entertainment: CONNECTION_TEMPLATES.filter(t => t.fromSphere === 'entertainment').length,
  },
  
  byAutomationLevel: {
    automatic: CONNECTION_TEMPLATES.filter(t => t.automationLevel === 'automatic').length,
    suggested: CONNECTION_TEMPLATES.filter(t => t.automationLevel === 'suggested').length,
    approvalRequired: CONNECTION_TEMPLATES.filter(t => t.automationLevel === 'approval-required').length,
    manual: CONNECTION_TEMPLATES.filter(t => t.automationLevel === 'manual').length,
  },
  
  totalFrequency: CONNECTION_TEMPLATES.reduce((sum, t) => sum + t.frequency, 0),
  averageFrequency: CONNECTION_TEMPLATES.reduce((sum, t) => sum + t.frequency, 0) / CONNECTION_TEMPLATES.length
};
