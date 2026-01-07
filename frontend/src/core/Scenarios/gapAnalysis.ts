/**
 * CHE·NU™ — ANALYSE DES GAPS & VALIDATION D'ARCHITECTURE
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * ANALYSE CRITIQUE BASÉE SUR 60 SCÉNARIOS RÉELS
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Ce document identifie:
 * 1. Les gaps dans notre architecture actuelle
 * 2. Les connexions inter-sphères les plus fréquentes
 * 3. Les APIs et intégrations essentielles
 * 4. Les spécialisations de bureau nécessaires
 * 5. Les améliorations à apporter
 */

// ═══════════════════════════════════════════════════════════════════════════
// 1. GAPS ARCHITECTURAUX IDENTIFIÉS
// ═══════════════════════════════════════════════════════════════════════════

export interface ArchitecturalGap {
  id: string;
  title: string;
  titleFr: string;
  description: string;
  descriptionFr: string;
  severity: 'blocker' | 'major' | 'minor';
  affectedSpheres: string[];
  affectedProfiles: string[];
  scenariosAffected: string[];
  currentState: string;
  proposedSolution: string;
  proposedSolutionFr: string;
  implementationPriority: 1 | 2 | 3;
}

export const IDENTIFIED_GAPS: ArchitecturalGap[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // GAPS BLOQUANTS (BLOCKERS)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'gap-001',
    title: 'No Asset/Fleet Management',
    titleFr: 'Pas de gestion d\'actifs/flotte',
    description: 'Standard bureau doesn\'t support tracking vehicles, equipment, machinery with maintenance schedules, depreciation, utilization',
    descriptionFr: 'Le bureau standard ne supporte pas le suivi des véhicules, équipement, machinerie avec calendriers d\'entretien, dépréciation, utilisation',
    severity: 'blocker',
    affectedSpheres: ['business', 'government'],
    affectedProfiles: ['jonathan-contractor', 'restaurant-owner', 'farmer', 'transport-company'],
    scenariosAffected: ['scenario-015', 'scenario-019', 'scenario-020'],
    currentState: 'No dedicated section in Business bureau for physical assets',
    proposedSolution: 'Add "Assets & Fleet" section to Business bureau with: inventory, maintenance scheduling, cost tracking, depreciation calculation, utilization reports',
    proposedSolutionFr: 'Ajouter section "Actifs & Flotte" au bureau Business avec: inventaire, planification d\'entretien, suivi des coûts, calcul de dépréciation, rapports d\'utilisation',
    implementationPriority: 1
  },

  {
    id: 'gap-002',
    title: 'No Progress Billing Support',
    titleFr: 'Pas de support pour facturation d\'avancement',
    description: 'Standard invoicing doesn\'t support construction/project progress billing with holdbacks, milestones, percentage completion',
    descriptionFr: 'La facturation standard ne supporte pas la facturation d\'avancement en construction/projets avec retenues, jalons, pourcentage de complétion',
    severity: 'blocker',
    affectedSpheres: ['business'],
    affectedProfiles: ['jonathan-contractor', 'architect', 'interior-designer'],
    scenariosAffected: ['scenario-011', 'scenario-019'],
    currentState: 'Only simple invoice creation available',
    proposedSolution: 'Add Progress Billing mode to Invoice system: milestone-based billing, percentage completion, holdback tracking, change orders',
    proposedSolutionFr: 'Ajouter mode Facturation d\'avancement: facturation par jalons, pourcentage de complétion, suivi des retenues, ordres de changement',
    implementationPriority: 1
  },

  {
    id: 'gap-003',
    title: 'No Medical/Professional Billing Codes',
    titleFr: 'Pas de codes de facturation médicale/professionnelle',
    description: 'Healthcare and other regulated professionals need billing with specific codes (RAMQ, OHIP, CPT, ICD)',
    descriptionFr: 'Les professionnels de santé et autres réglementés ont besoin de facturation avec codes spécifiques (RAMQ, OHIP, CPT, ICD)',
    severity: 'blocker',
    affectedSpheres: ['business', 'government'],
    affectedProfiles: ['sarah-doctor', 'dentist', 'physiotherapist', 'psychologist'],
    scenariosAffected: ['scenario-047'],
    currentState: 'No code-based billing system',
    proposedSolution: 'Add Professional Billing module with: code libraries by profession, claim submission, rejection handling, remittance reconciliation',
    proposedSolutionFr: 'Ajouter module Facturation professionnelle: bibliothèques de codes par profession, soumission de réclamations, gestion des rejets, réconciliation des paiements',
    implementationPriority: 1
  },

  {
    id: 'gap-004',
    title: 'No Royalty/Licensing Tracking',
    titleFr: 'Pas de suivi des redevances/licences',
    description: 'Creators need to track royalties from multiple sources (streaming, sync, publishing) with PRO reconciliation',
    descriptionFr: 'Les créateurs doivent suivre les redevances de multiples sources (streaming, synchro, édition) avec réconciliation PRO',
    severity: 'blocker',
    affectedSpheres: ['business', 'design_studio', 'government'],
    affectedProfiles: ['marie-musician', 'author', 'photographer', 'filmmaker'],
    scenariosAffected: ['scenario-005', 'scenario-008'],
    currentState: 'No royalty tracking capability',
    proposedSolution: 'Add Royalty Tracker to Business bureau: multi-platform import, PRO statement reconciliation, split tracking, projections',
    proposedSolutionFr: 'Ajouter Suivi des redevances au bureau Business: import multi-plateforme, réconciliation des relevés PRO, suivi des parts, projections',
    implementationPriority: 1
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAPS MAJEURS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'gap-005',
    title: 'No CE/CME Credit Tracking',
    titleFr: 'Pas de suivi des crédits de formation continue',
    description: 'Licensed professionals need to track continuing education credits by category for license renewal',
    descriptionFr: 'Les professionnels licenciés doivent suivre les crédits de formation continue par catégorie pour le renouvellement de licence',
    severity: 'major',
    affectedSpheres: ['government', 'community'],
    affectedProfiles: ['sarah-doctor', 'lawyer', 'accountant', 'engineer', 'real-estate-agent'],
    scenariosAffected: ['scenario-035', 'scenario-042'],
    currentState: 'No credit tracking system',
    proposedSolution: 'Add CE/CME Tracker to Government bureau: credit categories, requirements by license, gap analysis, renewal planning',
    proposedSolutionFr: 'Ajouter Suivi FC/FMC au bureau Government: catégories de crédits, exigences par licence, analyse des écarts, planification du renouvellement',
    implementationPriority: 1
  },

  {
    id: 'gap-006',
    title: 'No Gig/Booking Pipeline',
    titleFr: 'Pas de pipeline de réservation/spectacles',
    description: 'Performers and service providers need specialized CRM for inquiries, negotiations, bookings, contracts, payments',
    descriptionFr: 'Les artistes et prestataires de services ont besoin d\'un CRM spécialisé pour demandes, négociations, réservations, contrats, paiements',
    severity: 'major',
    affectedSpheres: ['business'],
    affectedProfiles: ['marie-musician', 'wedding-photographer', 'dj', 'caterer', 'speaker'],
    scenariosAffected: ['scenario-002', 'scenario-007', 'scenario-008'],
    currentState: 'Generic CRM doesn\'t fit performance/booking workflow',
    proposedSolution: 'Add Gig Pipeline module: stages (Inquiry → Negotiate → Confirm → Advance → Perform → Collect), rider/tech requirements, contract generation',
    proposedSolutionFr: 'Ajouter module Pipeline de spectacles: étapes (Demande → Négociation → Confirmation → Avance → Performance → Paiement), exigences techniques, génération de contrats',
    implementationPriority: 1
  },

  {
    id: 'gap-007',
    title: 'No Split/Co-ownership Tracking',
    titleFr: 'Pas de suivi des parts/copropriété',
    description: 'Creators need to track ownership splits on creative works with co-writers, producers, collaborators',
    descriptionFr: 'Les créateurs doivent suivre les parts de propriété sur les œuvres créatives avec co-auteurs, producteurs, collaborateurs',
    severity: 'major',
    affectedSpheres: ['design_studio', 'business', 'government'],
    affectedProfiles: ['marie-musician', 'author', 'filmmaker', 'game-developer'],
    scenariosAffected: ['scenario-001', 'scenario-003', 'scenario-005'],
    currentState: 'No split sheet or co-ownership management',
    proposedSolution: 'Add Split Sheet module to Studio: ownership percentages, agreement tracking, automatic royalty distribution calculation',
    proposedSolutionFr: 'Ajouter module Split Sheet au Studio: pourcentages de propriété, suivi des ententes, calcul automatique de distribution des redevances',
    implementationPriority: 2
  },

  {
    id: 'gap-008',
    title: 'No Grant/Funding Application Tracker',
    titleFr: 'Pas de suivi des demandes de subventions/financement',
    description: 'Artists and nonprofits need to track grant opportunities, deadlines, applications, status',
    descriptionFr: 'Les artistes et OBNL doivent suivre les opportunités de subventions, échéances, demandes, statut',
    severity: 'major',
    affectedSpheres: ['government', 'business'],
    affectedProfiles: ['marie-musician', 'filmmaker', 'nonprofit-founder', 'researcher'],
    scenariosAffected: ['scenario-003', 'scenario-031'],
    currentState: 'No grant tracking capability',
    proposedSolution: 'Add Grant Tracker to Government bureau: opportunity database, deadline calendar, application templates, status tracking',
    proposedSolutionFr: 'Ajouter Suivi de subventions au bureau Government: base de données d\'opportunités, calendrier des échéances, modèles de demande, suivi du statut',
    implementationPriority: 2
  },

  {
    id: 'gap-009',
    title: 'No Professional Corporation Management',
    titleFr: 'Pas de gestion de société professionnelle',
    description: 'Incorporated professionals need to manage salary vs dividend optimization, retained earnings, corporate year-end',
    descriptionFr: 'Les professionnels incorporés doivent gérer l\'optimisation salaire vs dividendes, bénéfices non répartis, fin d\'année corporative',
    severity: 'major',
    affectedSpheres: ['business', 'personal', 'government'],
    affectedProfiles: ['sarah-doctor', 'lawyer', 'accountant', 'consultant'],
    scenariosAffected: ['scenario-012', 'scenario-017', 'scenario-018'],
    currentState: 'No professional corporation specific features',
    proposedSolution: 'Add Prof Corp Dashboard: retained earnings tracking, salary/dividend optimizer, corporate tax calendar, owner draw management',
    proposedSolutionFr: 'Ajouter Tableau de bord Société pro: suivi des bénéfices non répartis, optimiseur salaire/dividendes, calendrier fiscal corporatif, gestion des retraits du propriétaire',
    implementationPriority: 2
  },

  {
    id: 'gap-010',
    title: 'No Permit/License Tracking by Project',
    titleFr: 'Pas de suivi des permis/licences par projet',
    description: 'Contractors and project managers need to track permits linked to specific projects with inspection scheduling',
    descriptionFr: 'Les entrepreneurs et gestionnaires de projets doivent suivre les permis liés à des projets spécifiques avec planification des inspections',
    severity: 'major',
    affectedSpheres: ['government', 'business'],
    affectedProfiles: ['jonathan-contractor', 'architect', 'electrician', 'plumber'],
    scenariosAffected: ['scenario-019', 'scenario-043'],
    currentState: 'No project-linked permit tracking',
    proposedSolution: 'Add Permit Tracker to Government bureau: project linkage, expiration alerts, inspection calendar, compliance checklist',
    proposedSolutionFr: 'Ajouter Suivi des permis au bureau Government: lien avec projets, alertes d\'expiration, calendrier d\'inspections, liste de conformité',
    implementationPriority: 2
  },

  {
    id: 'gap-011',
    title: 'No Safety Training Matrix',
    titleFr: 'Pas de matrice de formation en sécurité',
    description: 'Employers need to track employee safety certifications, training expiry, compliance status',
    descriptionFr: 'Les employeurs doivent suivre les certifications de sécurité des employés, expiration des formations, statut de conformité',
    severity: 'major',
    affectedSpheres: ['government', 'business', 'community'],
    affectedProfiles: ['jonathan-contractor', 'restaurant-owner', 'manufacturer'],
    scenariosAffected: ['scenario-015', 'scenario-045'],
    currentState: 'No safety training tracking',
    proposedSolution: 'Add Safety Compliance module: training matrix by employee, certification expiry alerts, incident reporting, compliance dashboard',
    proposedSolutionFr: 'Ajouter module Conformité sécurité: matrice de formation par employé, alertes d\'expiration de certification, rapports d\'incidents, tableau de bord de conformité',
    implementationPriority: 2
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAPS MINEURS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'gap-012',
    title: 'No Teaching/Student Management',
    titleFr: 'Pas de gestion d\'enseignement/étudiants',
    description: 'Teachers and tutors need to manage students, schedules, lesson plans, payments',
    descriptionFr: 'Les enseignants et tuteurs doivent gérer les étudiants, horaires, plans de cours, paiements',
    severity: 'minor',
    affectedSpheres: ['business', 'community'],
    affectedProfiles: ['marie-musician', 'music-teacher', 'tutor', 'coach'],
    scenariosAffected: ['scenario-016'],
    currentState: 'No student/teaching specific features',
    proposedSolution: 'Add Teaching Studio section: student profiles, recurring lessons, lesson plans, payment tracking, progress notes',
    proposedSolutionFr: 'Ajouter section Studio d\'enseignement: profils d\'étudiants, leçons récurrentes, plans de cours, suivi des paiements, notes de progrès',
    implementationPriority: 3
  },

  {
    id: 'gap-013',
    title: 'No Subcontractor/Vendor Pool',
    titleFr: 'Pas de bassin de sous-traitants/fournisseurs',
    description: 'No clear place to manage network of subcontractors with rates, availability, insurance status',
    descriptionFr: 'Pas de place claire pour gérer le réseau de sous-traitants avec tarifs, disponibilité, statut d\'assurance',
    severity: 'minor',
    affectedSpheres: ['business', 'community'],
    affectedProfiles: ['jonathan-contractor', 'event-planner', 'filmmaker'],
    scenariosAffected: ['scenario-019', 'scenario-003'],
    currentState: 'Subcontractors don\'t fit cleanly in either Business or Community',
    proposedSolution: 'Add Contractor Pool bridging Community (network) and Business (assignments): profiles, rates, availability, insurance verification',
    proposedSolutionFr: 'Ajouter Bassin de sous-traitants reliant Community (réseau) et Business (assignations): profils, tarifs, disponibilité, vérification d\'assurance',
    implementationPriority: 3
  },

  {
    id: 'gap-014',
    title: 'No Event RSVP/Registration Management',
    titleFr: 'Pas de gestion des inscriptions/RSVP d\'événements',
    description: 'Event organizers need to manage registrations, RSVPs, ticket sales, attendee communication',
    descriptionFr: 'Les organisateurs d\'événements doivent gérer les inscriptions, RSVP, ventes de billets, communication avec les participants',
    severity: 'minor',
    affectedSpheres: ['entertainment', 'community', 'business'],
    affectedProfiles: ['conference-organizer', 'meetup-organizer', 'wedding-planner'],
    scenariosAffected: ['scenario-021', 'scenario-040', 'scenario-052'],
    currentState: 'No event registration system',
    proposedSolution: 'Add Event Registration to Entertainment bureau: RSVP tracking, ticket tiers, attendee database, check-in system',
    proposedSolutionFr: 'Ajouter Inscription d\'événements au bureau Entertainment: suivi des RSVP, niveaux de billets, base de données participants, système d\'enregistrement',
    implementationPriority: 3
  },

  {
    id: 'gap-015',
    title: 'No Donation/Receipt Management for Nonprofits',
    titleFr: 'Pas de gestion des dons/reçus pour OBNL',
    description: 'Nonprofits need to track donations, issue tax receipts, manage donor relationships',
    descriptionFr: 'Les OBNL doivent suivre les dons, émettre des reçus fiscaux, gérer les relations avec les donateurs',
    severity: 'minor',
    affectedSpheres: ['community', 'business', 'government'],
    affectedProfiles: ['nonprofit-founder', 'church-leader', 'charity-worker'],
    scenariosAffected: ['scenario-031', 'scenario-034'],
    currentState: 'No donation management system',
    proposedSolution: 'Add Donor Management module: donation tracking, automated receipts, campaign management, donor CRM',
    proposedSolutionFr: 'Ajouter module Gestion des donateurs: suivi des dons, reçus automatisés, gestion des campagnes, CRM donateurs',
    implementationPriority: 3
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// 2. CONNEXIONS INTER-SPHÈRES LES PLUS FRÉQUENTES
// ═══════════════════════════════════════════════════════════════════════════

export interface FrequentConnection {
  id: string;
  fromSphere: string;
  toSphere: string;
  connectionName: string;
  connectionNameFr: string;
  frequency: number; // Nombre de scénarios utilisant cette connexion
  dataTypes: string[];
  automationRecommendation: 'automatic' | 'suggested' | 'manual';
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export const FREQUENT_CONNECTIONS: FrequentConnection[] = [
  {
    id: 'conn-business-government',
    fromSphere: 'business',
    toSphere: 'government',
    connectionName: 'Business to Government Compliance',
    connectionNameFr: 'Business vers Conformité gouvernementale',
    frequency: 42,
    dataTypes: ['tax-data', 'permits', 'licenses', 'regulatory-filings', 'safety-records'],
    automationRecommendation: 'suggested',
    priority: 'critical'
  },
  {
    id: 'conn-business-personal',
    fromSphere: 'business',
    toSphere: 'personal',
    connectionName: 'Business to Personal Calendar/Finances',
    connectionNameFr: 'Business vers Calendrier/Finances personnelles',
    frequency: 38,
    dataTypes: ['appointments', 'income', 'owner-draws', 'work-life-balance'],
    automationRecommendation: 'automatic',
    priority: 'critical'
  },
  {
    id: 'conn-studio-business',
    fromSphere: 'design_studio',
    toSphere: 'business',
    connectionName: 'Creative Work to Monetization',
    connectionNameFr: 'Travail créatif vers Monétisation',
    frequency: 28,
    dataTypes: ['invoices', 'royalties', 'licensing', 'project-billing'],
    automationRecommendation: 'suggested',
    priority: 'high'
  },
  {
    id: 'conn-community-business',
    fromSphere: 'community',
    toSphere: 'business',
    connectionName: 'Community to Business Operations',
    connectionNameFr: 'Community vers Opérations d\'affaires',
    frequency: 25,
    dataTypes: ['fees', 'donations', 'member-payments', 'volunteer-hours'],
    automationRecommendation: 'automatic',
    priority: 'high'
  },
  {
    id: 'conn-entertainment-social',
    fromSphere: 'entertainment',
    toSphere: 'social',
    connectionName: 'Events to Social Promotion',
    connectionNameFr: 'Événements vers Promotion sociale',
    frequency: 22,
    dataTypes: ['event-details', 'promotional-content', 'announcements'],
    automationRecommendation: 'suggested',
    priority: 'high'
  },
  {
    id: 'conn-studio-social',
    fromSphere: 'design_studio',
    toSphere: 'social',
    connectionName: 'Creative Content to Social Share',
    connectionNameFr: 'Contenu créatif vers Partage social',
    frequency: 20,
    dataTypes: ['portfolio-pieces', 'releases', 'behind-scenes'],
    automationRecommendation: 'suggested',
    priority: 'medium'
  },
  {
    id: 'conn-government-personal',
    fromSphere: 'government',
    toSphere: 'personal',
    connectionName: 'Government Deadlines to Calendar',
    connectionNameFr: 'Échéances gouvernementales vers Calendrier',
    frequency: 18,
    dataTypes: ['deadlines', 'renewals', 'appointments', 'inspections'],
    automationRecommendation: 'automatic',
    priority: 'high'
  },
  {
    id: 'conn-community-personal',
    fromSphere: 'community',
    toSphere: 'personal',
    connectionName: 'Community Events to Personal Calendar',
    connectionNameFr: 'Événements communautaires vers Calendrier personnel',
    frequency: 16,
    dataTypes: ['meetings', 'events', 'volunteer-shifts'],
    automationRecommendation: 'automatic',
    priority: 'medium'
  },
  {
    id: 'conn-studio-government',
    fromSphere: 'design_studio',
    toSphere: 'government',
    connectionName: 'Creative Works to IP Registration',
    connectionNameFr: 'Œuvres créatives vers Enregistrement PI',
    frequency: 12,
    dataTypes: ['copyrights', 'trademarks', 'patents', 'grants'],
    automationRecommendation: 'manual',
    priority: 'medium'
  },
  {
    id: 'conn-entertainment-business',
    fromSphere: 'entertainment',
    toSphere: 'business',
    connectionName: 'Events to Revenue/Expenses',
    connectionNameFr: 'Événements vers Revenus/Dépenses',
    frequency: 15,
    dataTypes: ['ticket-sales', 'vendor-payments', 'sponsorship-revenue'],
    automationRecommendation: 'automatic',
    priority: 'high'
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// 3. APIS ET INTÉGRATIONS ESSENTIELLES IDENTIFIÉES
// ═══════════════════════════════════════════════════════════════════════════

export interface EssentialIntegration {
  id: string;
  name: string;
  category: string;
  providers: string[];
  affectedSpheres: string[];
  affectedProfiles: string[];
  priority: 'essential' | 'important' | 'nice-to-have';
  integrationType: 'api' | 'import' | 'export' | 'oauth' | 'webhook';
}

export const ESSENTIAL_INTEGRATIONS: EssentialIntegration[] = [
  // FINANCIAL
  { id: 'int-banking', name: 'Bank Transaction Feed', category: 'Financial', providers: ['Plaid', 'Yodlee', 'Direct Bank APIs'], affectedSpheres: ['business', 'personal'], affectedProfiles: ['all'], priority: 'essential', integrationType: 'api' },
  { id: 'int-accounting', name: 'Accounting Software', category: 'Financial', providers: ['QuickBooks', 'Xero', 'Wave', 'Sage'], affectedSpheres: ['business', 'government'], affectedProfiles: ['all-business'], priority: 'essential', integrationType: 'api' },
  { id: 'int-payroll', name: 'Payroll Processing', category: 'Financial', providers: ['Ceridian', 'ADP', 'Gusto', 'Square Payroll'], affectedSpheres: ['business', 'government'], affectedProfiles: ['employers'], priority: 'essential', integrationType: 'api' },
  { id: 'int-payment', name: 'Payment Processing', category: 'Financial', providers: ['Stripe', 'Square', 'PayPal'], affectedSpheres: ['business'], affectedProfiles: ['all-business'], priority: 'essential', integrationType: 'api' },
  
  // GOVERNMENT
  { id: 'int-tax-filing', name: 'Tax E-Filing', category: 'Government', providers: ['CRA', 'IRS', 'State/Provincial'], affectedSpheres: ['government', 'business'], affectedProfiles: ['all'], priority: 'essential', integrationType: 'export' },
  { id: 'int-health-billing', name: 'Healthcare Billing', category: 'Government', providers: ['RAMQ', 'OHIP', 'Medicare'], affectedSpheres: ['business', 'government'], affectedProfiles: ['healthcare'], priority: 'essential', integrationType: 'api' },
  { id: 'int-permits', name: 'Municipal Permits', category: 'Government', providers: ['City APIs', 'e-Permits'], affectedSpheres: ['government', 'business'], affectedProfiles: ['construction', 'restaurants'], priority: 'important', integrationType: 'api' },
  
  // CREATIVE
  { id: 'int-streaming', name: 'Streaming Analytics', category: 'Creative', providers: ['Spotify for Artists', 'Apple Music', 'YouTube'], affectedSpheres: ['design_studio', 'social'], affectedProfiles: ['musicians', 'podcasters'], priority: 'essential', integrationType: 'api' },
  { id: 'int-pro', name: 'PRO Royalties', category: 'Creative', providers: ['SOCAN', 'BMI', 'ASCAP', 'SACEM'], affectedSpheres: ['business', 'government'], affectedProfiles: ['musicians', 'composers'], priority: 'essential', integrationType: 'import' },
  { id: 'int-distribution', name: 'Music/Content Distribution', category: 'Creative', providers: ['DistroKid', 'CD Baby', 'TuneCore'], affectedSpheres: ['entertainment', 'business'], affectedProfiles: ['musicians'], priority: 'important', integrationType: 'api' },
  
  // SOCIAL
  { id: 'int-social-publish', name: 'Social Media Publishing', category: 'Social', providers: ['Meta', 'Twitter/X', 'LinkedIn', 'TikTok'], affectedSpheres: ['social'], affectedProfiles: ['all-social'], priority: 'important', integrationType: 'oauth' },
  { id: 'int-social-analytics', name: 'Social Media Analytics', category: 'Social', providers: ['Meta Business', 'Twitter Analytics'], affectedSpheres: ['social'], affectedProfiles: ['influencers', 'marketers'], priority: 'important', integrationType: 'api' },
  
  // CALENDARS & PRODUCTIVITY
  { id: 'int-calendar', name: 'Calendar Sync', category: 'Productivity', providers: ['Google Calendar', 'Outlook', 'Apple Calendar'], affectedSpheres: ['personal', 'business'], affectedProfiles: ['all'], priority: 'essential', integrationType: 'oauth' },
  { id: 'int-email', name: 'Email Integration', category: 'Productivity', providers: ['Gmail', 'Outlook', 'IMAP'], affectedSpheres: ['personal', 'business'], affectedProfiles: ['all'], priority: 'essential', integrationType: 'oauth' },
  { id: 'int-storage', name: 'Cloud Storage', category: 'Productivity', providers: ['Google Drive', 'Dropbox', 'OneDrive'], affectedSpheres: ['design_studio', 'business'], affectedProfiles: ['all'], priority: 'important', integrationType: 'oauth' },
  
  // INDUSTRY-SPECIFIC
  { id: 'int-real-estate', name: 'Real Estate MLS', category: 'Industry', providers: ['Realtor.ca', 'MLS', 'Zillow'], affectedSpheres: ['business'], affectedProfiles: ['real-estate'], priority: 'essential', integrationType: 'api' },
  { id: 'int-emr', name: 'Electronic Medical Records', category: 'Industry', providers: ['Oscar', 'Accuro', 'Telus Health'], affectedSpheres: ['business'], affectedProfiles: ['healthcare'], priority: 'essential', integrationType: 'api' },
  { id: 'int-legal', name: 'Legal Case Management', category: 'Industry', providers: ['Clio', 'PracticePanther'], affectedSpheres: ['business'], affectedProfiles: ['lawyers'], priority: 'important', integrationType: 'api' }
];

// ═══════════════════════════════════════════════════════════════════════════
// 4. RÉSUMÉ EXÉCUTIF
// ═══════════════════════════════════════════════════════════════════════════

export const EXECUTIVE_SUMMARY = {
  totalScenariosAnalyzed: 60,
  totalGapsIdentified: 15,
  blockerGaps: 4,
  majorGaps: 7,
  minorGaps: 4,
  
  topPriorityFixes: [
    'Add Assets & Fleet Management to Business bureau',
    'Add Progress Billing mode to Invoice system',
    'Add Professional Billing module with code libraries',
    'Add Royalty Tracker with multi-platform support',
    'Add CE/CME Credit Tracker for licensed professionals'
  ],
  
  mostUsedConnections: [
    'Business ↔ Government (tax, permits, compliance)',
    'Business ↔ Personal (calendar, income)',
    'Studio ↔ Business (invoicing, royalties)',
    'Community ↔ Business (fees, donations)',
    'Entertainment ↔ Social (promotion)'
  ],
  
  criticalIntegrations: [
    'Bank Transaction Feed (Plaid/Yodlee)',
    'Accounting Software (QuickBooks/Xero)',
    'Calendar Sync (Google/Outlook)',
    'Tax E-Filing (CRA/IRS)',
    'Payment Processing (Stripe/Square)'
  ],
  
  recommendedBureauAdditions: {
    business: ['Assets & Fleet', 'Progress Billing', 'Royalty Tracker', 'Gig Pipeline'],
    government: ['Permit Tracker', 'CE/CME Credits', 'Grant Tracker', 'Safety Compliance'],
    studio: ['Split Sheet', 'Song/Work Catalog with versions'],
    community: ['Volunteer Management', 'Donor Management'],
    entertainment: ['Event Registration', 'Venue Management']
  }
};
