/**
 * CHE·NU™ — PROFILS UTILISATEURS COMPLETS (PARTIE 2)
 * 
 * Profils supplémentaires couvrant d'autres cas d'usage multi-sphères
 */

import { CompleteUserProfile } from './completeUserProfiles';

// ═══════════════════════════════════════════════════════════════════════════
// PROFIL 4: ALEX - ORGANISATEUR D'ÉVÉNEMENTS
// ═══════════════════════════════════════════════════════════════════════════

export const PROFILE_ALEX_EVENT_PLANNER: CompleteUserProfile = {
  id: 'profile-alex-event-planner',
  name: 'Alex - Event Planner & Producer',
  nameFr: 'Alex - Organisateur et producteur d\'événements',
  description: 'Runs event planning company doing weddings, corporate events, festivals with team and vendors',
  descriptionFr: 'Dirige une entreprise d\'organisation d\'événements (mariages, corporatif, festivals) avec équipe et fournisseurs',
  
  activeSpheres: [
    {
      sphereId: 'entertainment',
      usageLevel: 'primary',
      mainUseCases: ['Event planning', 'Venue management', 'Schedule coordination', 'Program creation'],
      estimatedTimePercent: 35
    },
    {
      sphereId: 'business',
      usageLevel: 'primary',
      mainUseCases: ['Client contracts', 'Vendor management', 'Invoicing', 'Budget tracking'],
      estimatedTimePercent: 30
    },
    {
      sphereId: 'community',
      usageLevel: 'secondary',
      mainUseCases: ['Vendor network', 'Volunteer coordination', 'Guest management'],
      estimatedTimePercent: 15
    },
    {
      sphereId: 'social',
      usageLevel: 'secondary',
      mainUseCases: ['Event promotion', 'Client testimonials', 'Portfolio sharing'],
      estimatedTimePercent: 10
    },
    {
      sphereId: 'government',
      usageLevel: 'occasional',
      mainUseCases: ['Event permits', 'Liquor licenses', 'Insurance certificates'],
      estimatedTimePercent: 5
    },
    {
      sphereId: 'my_team',
      usageLevel: 'occasional',
      mainUseCases: ['Quote generator AI', 'Vendor matcher AI', 'Timeline optimizer'],
      estimatedTimePercent: 5
    }
  ],
  
  specificNeeds: [
    {
      id: 'need-event-timeline',
      need: 'Create detailed event timelines with tasks, vendors, and run-of-show',
      needFr: 'Créer des calendriers d\'événements détaillés avec tâches, fournisseurs et déroulement',
      sphere: 'entertainment',
      priority: 'critical',
      currentSolution: 'Excel spreadsheets, lots of manual coordination',
      proposedSolution: 'Event Timeline Builder with task assignment, vendor linking, run-of-show generator'
    },
    {
      id: 'need-vendor-management',
      need: 'Manage vendor relationships, contracts, payments across multiple events',
      needFr: 'Gérer les relations fournisseurs, contrats, paiements à travers plusieurs événements',
      sphere: 'business',
      priority: 'critical',
      currentSolution: 'Scattered contracts, manual tracking',
      proposedSolution: 'Vendor Portal with contract management, payment schedules, performance tracking'
    },
    {
      id: 'need-guest-management',
      need: 'Track RSVPs, dietary requirements, seating, transportation',
      needFr: 'Suivre les RSVP, exigences alimentaires, placement, transport',
      sphere: 'community',
      priority: 'critical',
      currentSolution: 'Multiple spreadsheets, error-prone',
      proposedSolution: 'Guest Management System with RSVP tracking, meal choices, seating chart builder'
    },
    {
      id: 'need-permits',
      need: 'Track required permits by venue and event type',
      needFr: 'Suivre les permis requis par lieu et type d\'événement',
      sphere: 'government',
      priority: 'important',
      currentSolution: 'Hope I remember them all',
      proposedSolution: 'Permit Checklist by event type with deadline tracking'
    },
    {
      id: 'need-budget-tracking',
      need: 'Track event budgets with actual vs estimated, client payments',
      needFr: 'Suivre les budgets d\'événements avec réel vs estimé, paiements clients',
      sphere: 'business',
      priority: 'critical',
      currentSolution: 'Excel budget sheets',
      proposedSolution: 'Event Budget Tracker with category breakdown, vendor payments, client invoicing'
    }
  ],
  
  criticalData: [
    {
      id: 'data-events',
      dataName: 'Active Events',
      dataNameFr: 'Événements actifs',
      sphere: 'entertainment',
      dataType: 'hierarchy',
      updateFrequency: 'daily',
      sharedWith: ['business', 'community', 'government']
    },
    {
      id: 'data-vendors',
      dataName: 'Vendor Database',
      dataNameFr: 'Base de données fournisseurs',
      sphere: 'community',
      dataType: 'hierarchy',
      updateFrequency: 'frequent',
      sharedWith: ['business', 'entertainment']
    },
    {
      id: 'data-clients',
      dataName: 'Client Database',
      dataNameFr: 'Base de données clients',
      sphere: 'business',
      dataType: 'hierarchy',
      updateFrequency: 'frequent',
      sharedWith: ['entertainment']
    }
  ],
  
  requiredConnections: [
    {
      id: 'conn-event-budget',
      fromSphere: 'entertainment',
      toSphere: 'business',
      connectionType: 'data-sync',
      description: 'Event details to budget and invoicing',
      descriptionFr: 'Détails d\'événement vers budget et facturation',
      frequency: 'real-time',
      dataElements: ['event-id', 'vendor-costs', 'client-payments', 'expenses']
    },
    {
      id: 'conn-event-vendor',
      fromSphere: 'entertainment',
      toSphere: 'community',
      connectionType: 'reference',
      description: 'Event vendor assignments',
      descriptionFr: 'Assignations de fournisseurs aux événements',
      frequency: 'event-driven',
      dataElements: ['vendor-id', 'service-type', 'timing', 'requirements']
    },
    {
      id: 'conn-event-permit',
      fromSphere: 'entertainment',
      toSphere: 'government',
      connectionType: 'trigger',
      description: 'Event triggers permit requirements',
      descriptionFr: 'Événement déclenche les exigences de permis',
      frequency: 'event-driven',
      dataElements: ['venue', 'event-type', 'attendance', 'alcohol']
    }
  ],
  
  requiredIntegrations: [
    {
      id: 'int-venue-software',
      name: 'Venue Management',
      type: 'api',
      provider: 'Tripleseat/Social Tables',
      sphere: 'entertainment',
      purpose: 'Floor plans and seating',
      purposeFr: 'Plans de salle et placement',
      priority: 'essential'
    },
    {
      id: 'int-rsvp',
      name: 'RSVP Management',
      type: 'api',
      provider: 'RSVPify/Splash',
      sphere: 'community',
      purpose: 'Guest management',
      purposeFr: 'Gestion des invités',
      priority: 'essential'
    },
    {
      id: 'int-contracts',
      name: 'Contract Signing',
      type: 'api',
      provider: 'DocuSign/HelloSign',
      sphere: 'business',
      purpose: 'Vendor and client contracts',
      purposeFr: 'Contrats fournisseurs et clients',
      priority: 'important'
    }
  ],
  
  executionInterfaces: [
    {
      id: 'ui-event-dashboard',
      name: 'Event Dashboard',
      nameFr: 'Tableau de bord événement',
      type: 'dashboard',
      sphere: 'entertainment',
      description: 'Overview of all events with status, timeline, tasks'
    },
    {
      id: 'ui-timeline-builder',
      name: 'Event Timeline Builder',
      nameFr: 'Constructeur de calendrier',
      type: 'wizard',
      sphere: 'entertainment',
      description: 'Create detailed event timeline with vendors, tasks, run-of-show'
    },
    {
      id: 'ui-vendor-portal',
      name: 'Vendor Management Portal',
      nameFr: 'Portail de gestion des fournisseurs',
      type: 'dashboard',
      sphere: 'community',
      description: 'All vendors with contracts, availability, ratings'
    },
    {
      id: 'ui-seating-chart',
      name: 'Seating Chart Builder',
      nameFr: 'Constructeur de plan de table',
      type: 'form',
      sphere: 'community',
      description: 'Drag-and-drop seating with dietary/relationship notes'
    }
  ],
  
  dataFlows: [
    {
      id: 'flow-rsvp-import',
      name: 'RSVP Import',
      direction: 'import',
      format: ['CSV', 'API'],
      source: 'RSVP platform',
      destination: 'Community > Guests',
      frequency: 'Real-time'
    },
    {
      id: 'flow-vendor-invoice',
      name: 'Vendor Invoice Processing',
      direction: 'import',
      format: ['PDF', 'CSV'],
      source: 'Vendor emails',
      destination: 'Business > Payables',
      frequency: 'As received'
    },
    {
      id: 'flow-client-proposal',
      name: 'Client Proposal Export',
      direction: 'export',
      format: ['PDF'],
      source: 'Entertainment > Events',
      destination: 'Client email',
      frequency: 'On-demand'
    }
  ],
  
  suggestedBureauCustomization: [
    {
      sphereId: 'entertainment',
      prioritizedViews: ['Active Events', 'Timeline', 'Run of Show', 'Venue Calendar'],
      customSections: ['Event Templates', 'Checklist Library'],
      customAgents: ['Timeline Optimizer', 'Vendor Recommender']
    },
    {
      sphereId: 'community',
      prioritizedViews: ['Vendor Database', 'Guest Lists', 'Volunteer Schedule'],
      customSections: ['Seating Charts', 'Dietary Tracking'],
      customAgents: ['Vendor Matcher', 'Seating Optimizer']
    },
    {
      sphereId: 'business',
      prioritizedViews: ['Event Budgets', 'Client Contracts', 'Vendor Payments'],
      customSections: ['Quote Builder', 'Payment Schedule'],
      customAgents: ['Quote Generator', 'Payment Reminder']
    }
  ],
  
  identifiedGaps: [
    {
      id: 'gap-event-timeline',
      description: 'No event-specific timeline/run-of-show builder',
      descriptionFr: 'Pas de constructeur de calendrier/déroulement spécifique aux événements',
      severity: 'major',
      affectedSpheres: ['entertainment'],
      proposedSolution: 'Add Event Timeline section with Gantt-style view, task assignment, run-of-show export'
    },
    {
      id: 'gap-seating',
      description: 'No seating chart functionality',
      descriptionFr: 'Pas de fonctionnalité de plan de table',
      severity: 'minor',
      affectedSpheres: ['community', 'entertainment'],
      proposedSolution: 'Add Seating Chart builder with drag-drop, relationship constraints'
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// PROFIL 5: ÉMILIE - PROPRIÉTAIRE DE BOUTIQUE EN LIGNE
// ═══════════════════════════════════════════════════════════════════════════

export const PROFILE_EMILIE_ECOMMERCE: CompleteUserProfile = {
  id: 'profile-emilie-ecommerce',
  name: 'Émilie - E-commerce Store Owner',
  nameFr: 'Émilie - Propriétaire de boutique en ligne',
  description: 'Runs online boutique selling handmade jewelry with inventory, orders, shipping, and social marketing',
  descriptionFr: 'Gère une boutique en ligne de bijoux faits main avec inventaire, commandes, expédition et marketing social',
  
  activeSpheres: [
    {
      sphereId: 'business',
      usageLevel: 'primary',
      mainUseCases: ['Order processing', 'Inventory management', 'Shipping', 'Accounting'],
      estimatedTimePercent: 40
    },
    {
      sphereId: 'design_studio',
      usageLevel: 'primary',
      mainUseCases: ['Product design', 'Photography', 'Packaging design'],
      estimatedTimePercent: 25
    },
    {
      sphereId: 'social',
      usageLevel: 'secondary',
      mainUseCases: ['Instagram marketing', 'Influencer partnerships', 'Content creation'],
      estimatedTimePercent: 20
    },
    {
      sphereId: 'government',
      usageLevel: 'occasional',
      mainUseCases: ['Sales tax filing', 'Business registration', 'Import duties'],
      estimatedTimePercent: 5
    },
    {
      sphereId: 'personal',
      usageLevel: 'occasional',
      mainUseCases: ['Work-life balance', 'Personal finances separation'],
      estimatedTimePercent: 5
    },
    {
      sphereId: 'my_team',
      usageLevel: 'occasional',
      mainUseCases: ['Product description AI', 'Social caption AI', 'Customer service AI'],
      estimatedTimePercent: 5
    }
  ],
  
  specificNeeds: [
    {
      id: 'need-inventory',
      need: 'Track inventory across multiple sales channels (website, Etsy, markets)',
      needFr: 'Suivre l\'inventaire à travers plusieurs canaux (site web, Etsy, marchés)',
      sphere: 'business',
      priority: 'critical',
      currentSolution: 'Separate tracking per platform, overselling happens',
      proposedSolution: 'Unified Inventory with multi-channel sync, low stock alerts'
    },
    {
      id: 'need-order-fulfillment',
      need: 'Process orders efficiently with packing slips, shipping labels',
      needFr: 'Traiter les commandes efficacement avec bordereaux, étiquettes',
      sphere: 'business',
      priority: 'critical',
      currentSolution: 'Manual label printing, easy to miss orders',
      proposedSolution: 'Order Fulfillment Queue with batch shipping, tracking sync'
    },
    {
      id: 'need-product-photos',
      need: 'Organize product photography with variants, lifestyle shots',
      needFr: 'Organiser la photographie de produits avec variantes, photos lifestyle',
      sphere: 'design_studio',
      priority: 'important',
      currentSolution: 'Folders on computer, hard to find right photos',
      proposedSolution: 'Product Asset Library linked to inventory items'
    },
    {
      id: 'need-social-content',
      need: 'Plan and schedule social content with product links',
      needFr: 'Planifier et programmer le contenu social avec liens produits',
      sphere: 'social',
      priority: 'important',
      currentSolution: 'Post when I remember, inconsistent',
      proposedSolution: 'Content Calendar with product tagging, scheduled posting'
    },
    {
      id: 'need-sales-tax',
      need: 'Track and file sales tax for multiple jurisdictions',
      needFr: 'Suivre et déclarer les taxes de vente pour plusieurs juridictions',
      sphere: 'government',
      priority: 'critical',
      currentSolution: 'Spreadsheet, scary at tax time',
      proposedSolution: 'Sales Tax Tracker with automatic calculation, filing reminders'
    }
  ],
  
  criticalData: [
    {
      id: 'data-products',
      dataName: 'Product Catalog',
      dataNameFr: 'Catalogue de produits',
      sphere: 'business',
      dataType: 'hierarchy',
      updateFrequency: 'frequent',
      sharedWith: ['design_studio', 'social']
    },
    {
      id: 'data-orders',
      dataName: 'Orders',
      dataNameFr: 'Commandes',
      sphere: 'business',
      dataType: 'hierarchy',
      updateFrequency: 'real-time',
      sharedWith: ['personal'] // For scheduling
    },
    {
      id: 'data-customers',
      dataName: 'Customer Database',
      dataNameFr: 'Base de données clients',
      sphere: 'business',
      dataType: 'hierarchy',
      updateFrequency: 'frequent',
      sharedWith: ['social']
    }
  ],
  
  requiredConnections: [
    {
      id: 'conn-product-social',
      fromSphere: 'business',
      toSphere: 'social',
      connectionType: 'reference',
      description: 'Link products to social posts',
      descriptionFr: 'Lier les produits aux publications sociales',
      frequency: 'on-demand',
      dataElements: ['product-id', 'photos', 'price', 'link']
    },
    {
      id: 'conn-product-studio',
      fromSphere: 'business',
      toSphere: 'design_studio',
      connectionType: 'data-sync',
      description: 'Sync product photos from studio',
      descriptionFr: 'Synchroniser les photos de produits depuis le studio',
      frequency: 'event-driven',
      dataElements: ['product-id', 'photo-variants', 'lifestyle-shots']
    },
    {
      id: 'conn-sales-tax',
      fromSphere: 'business',
      toSphere: 'government',
      connectionType: 'aggregate',
      description: 'Aggregate sales by tax jurisdiction',
      descriptionFr: 'Agréger les ventes par juridiction fiscale',
      frequency: 'daily',
      dataElements: ['sales-by-state', 'tax-collected', 'period']
    }
  ],
  
  requiredIntegrations: [
    {
      id: 'int-shopify',
      name: 'E-commerce Platform',
      type: 'api',
      provider: 'Shopify/WooCommerce/Etsy',
      sphere: 'business',
      purpose: 'Order and inventory sync',
      purposeFr: 'Synchronisation commandes et inventaire',
      priority: 'essential'
    },
    {
      id: 'int-shipping',
      name: 'Shipping Provider',
      type: 'api',
      provider: 'ShipStation/Canada Post/USPS',
      sphere: 'business',
      purpose: 'Shipping labels and tracking',
      purposeFr: 'Étiquettes d\'expédition et suivi',
      priority: 'essential'
    },
    {
      id: 'int-instagram',
      name: 'Instagram Shopping',
      type: 'oauth',
      provider: 'Meta',
      sphere: 'social',
      purpose: 'Product tagging and shop',
      purposeFr: 'Étiquetage produits et boutique',
      priority: 'essential'
    },
    {
      id: 'int-taxjar',
      name: 'Sales Tax Automation',
      type: 'api',
      provider: 'TaxJar/Avalara',
      sphere: 'government',
      purpose: 'Tax calculation and filing',
      purposeFr: 'Calcul et déclaration des taxes',
      priority: 'important'
    }
  ],
  
  executionInterfaces: [
    {
      id: 'ui-order-queue',
      name: 'Order Fulfillment Queue',
      nameFr: 'File d\'attente des commandes',
      type: 'dashboard',
      sphere: 'business',
      description: 'All pending orders with batch actions, shipping label printing'
    },
    {
      id: 'ui-inventory',
      name: 'Multi-Channel Inventory',
      nameFr: 'Inventaire multi-canal',
      type: 'dashboard',
      sphere: 'business',
      description: 'Unified inventory across all sales channels with sync status'
    },
    {
      id: 'ui-product-library',
      name: 'Product Asset Library',
      nameFr: 'Bibliothèque d\'actifs produits',
      type: 'dashboard',
      sphere: 'design_studio',
      description: 'All product photos organized by product with variant tagging'
    },
    {
      id: 'ui-content-calendar',
      name: 'Social Content Calendar',
      nameFr: 'Calendrier de contenu social',
      type: 'dashboard',
      sphere: 'social',
      description: 'Plan and schedule posts with product linking'
    }
  ],
  
  dataFlows: [
    {
      id: 'flow-order-import',
      name: 'Order Import',
      direction: 'import',
      format: ['API'],
      source: 'Shopify/Etsy',
      destination: 'Business > Orders',
      frequency: 'Real-time'
    },
    {
      id: 'flow-inventory-sync',
      name: 'Inventory Sync',
      direction: 'sync',
      format: ['API'],
      source: 'Business > Inventory',
      destination: 'All sales channels',
      frequency: 'Real-time'
    },
    {
      id: 'flow-tracking-export',
      name: 'Tracking Number Export',
      direction: 'export',
      format: ['API'],
      source: 'ShipStation',
      destination: 'Sales channels',
      frequency: 'Event-driven'
    }
  ],
  
  suggestedBureauCustomization: [
    {
      sphereId: 'business',
      prioritizedViews: ['Order Queue', 'Inventory', 'Shipping', 'Sales Dashboard'],
      customSections: ['Product Variants', 'Supplier Orders'],
      customAgents: ['Low Stock Alert', 'Order Batch Processor', 'Product Description Writer']
    },
    {
      sphereId: 'design_studio',
      prioritizedViews: ['Product Photography', 'Packaging Design', 'Brand Assets'],
      customSections: ['Photo Shoot Planning'],
      customAgents: ['Photo Background Remover']
    },
    {
      sphereId: 'social',
      prioritizedViews: ['Content Calendar', 'Analytics', 'Influencer Partnerships'],
      customSections: ['User Generated Content'],
      customAgents: ['Caption Writer', 'Hashtag Suggester']
    }
  ],
  
  identifiedGaps: [
    {
      id: 'gap-multi-channel-inventory',
      description: 'No unified multi-channel inventory management',
      descriptionFr: 'Pas de gestion d\'inventaire multi-canal unifié',
      severity: 'major',
      affectedSpheres: ['business'],
      proposedSolution: 'Add Multi-Channel Inventory Hub with platform connectors, sync status, unified stock levels'
    },
    {
      id: 'gap-product-variants',
      description: 'Product variants (size, color) not well supported',
      descriptionFr: 'Variantes de produits (taille, couleur) mal supportées',
      severity: 'major',
      affectedSpheres: ['business', 'design_studio'],
      proposedSolution: 'Enhanced Product Catalog with variant management, per-variant photos, inventory'
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// PROFIL 6: MARC - AGRICULTEUR MODERNE
// ═══════════════════════════════════════════════════════════════════════════

export const PROFILE_MARC_FARMER: CompleteUserProfile = {
  id: 'profile-marc-farmer',
  name: 'Marc - Modern Farmer',
  nameFr: 'Marc - Agriculteur moderne',
  description: 'Runs diversified farm with crops, livestock, direct sales, and agritourism activities',
  descriptionFr: 'Gère une ferme diversifiée avec cultures, élevage, ventes directes et activités agrotouristiques',
  
  activeSpheres: [
    {
      sphereId: 'business',
      usageLevel: 'primary',
      mainUseCases: ['Crop planning', 'Livestock tracking', 'Sales management', 'Equipment maintenance'],
      estimatedTimePercent: 40
    },
    {
      sphereId: 'government',
      usageLevel: 'secondary',
      mainUseCases: ['Agricultural subsidies', 'Environmental compliance', 'Food safety', 'Land use'],
      estimatedTimePercent: 20
    },
    {
      sphereId: 'community',
      usageLevel: 'secondary',
      mainUseCases: ['Farmers market', 'CSA members', 'Farm workers', 'Cooperative'],
      estimatedTimePercent: 15
    },
    {
      sphereId: 'entertainment',
      usageLevel: 'occasional',
      mainUseCases: ['Farm tours', 'Events', 'Education programs'],
      estimatedTimePercent: 10
    },
    {
      sphereId: 'personal',
      usageLevel: 'occasional',
      mainUseCases: ['Family schedule', 'Personal vs farm finances'],
      estimatedTimePercent: 5
    },
    {
      sphereId: 'my_team',
      usageLevel: 'occasional',
      mainUseCases: ['Weather AI', 'Crop planning AI', 'Market price AI'],
      estimatedTimePercent: 10
    }
  ],
  
  specificNeeds: [
    {
      id: 'need-crop-planning',
      need: 'Plan crop rotations, planting schedules, harvest timing across fields',
      needFr: 'Planifier les rotations de cultures, calendriers de plantation, récoltes par champ',
      sphere: 'business',
      priority: 'critical',
      currentSolution: 'Notebooks and memory',
      proposedSolution: 'Crop Planning Module with field mapping, rotation history, weather integration'
    },
    {
      id: 'need-livestock',
      need: 'Track livestock with health records, breeding, movements',
      needFr: 'Suivre le bétail avec dossiers de santé, reproduction, mouvements',
      sphere: 'business',
      priority: 'critical',
      currentSolution: 'Paper records, sometimes lost',
      proposedSolution: 'Livestock Registry with individual animal records, health tracking, breeding calendar'
    },
    {
      id: 'need-equipment',
      need: 'Track farm equipment maintenance, fuel, utilization',
      needFr: 'Suivre l\'entretien de l\'équipement agricole, carburant, utilisation',
      sphere: 'business',
      priority: 'important',
      currentSolution: 'Maintenance when it breaks',
      proposedSolution: 'Equipment Fleet Manager with preventive maintenance schedules'
    },
    {
      id: 'need-subsidies',
      need: 'Apply for and track agricultural subsidies and programs',
      needFr: 'Demander et suivre les subventions et programmes agricoles',
      sphere: 'government',
      priority: 'critical',
      currentSolution: 'Miss some programs, paperwork is overwhelming',
      proposedSolution: 'Subsidy Tracker with program matching, application deadlines, compliance tracking'
    },
    {
      id: 'need-direct-sales',
      need: 'Manage CSA subscriptions, farmers market sales, on-farm sales',
      needFr: 'Gérer les abonnements ASC, ventes au marché, ventes à la ferme',
      sphere: 'community',
      priority: 'important',
      currentSolution: 'Spreadsheet for CSA, cash box at market',
      proposedSolution: 'Farm Sales Hub with CSA management, market inventory, customer database'
    },
    {
      id: 'need-traceability',
      need: 'Maintain traceability records for food safety compliance',
      needFr: 'Maintenir les registres de traçabilité pour la conformité alimentaire',
      sphere: 'government',
      priority: 'critical',
      currentSolution: 'Paper binder, hope inspector doesn\'t ask hard questions',
      proposedSolution: 'Traceability Module with lot tracking, harvest records, distribution logs'
    }
  ],
  
  criticalData: [
    {
      id: 'data-fields',
      dataName: 'Field Records',
      dataNameFr: 'Registres des champs',
      sphere: 'business',
      dataType: 'hierarchy',
      updateFrequency: 'daily',
      sharedWith: ['government']
    },
    {
      id: 'data-livestock',
      dataName: 'Livestock Records',
      dataNameFr: 'Registres du bétail',
      sphere: 'business',
      dataType: 'hierarchy',
      updateFrequency: 'frequent',
      sharedWith: ['government']
    },
    {
      id: 'data-equipment',
      dataName: 'Equipment Registry',
      dataNameFr: 'Registre de l\'équipement',
      sphere: 'business',
      dataType: 'hierarchy',
      updateFrequency: 'weekly',
      sharedWith: []
    },
    {
      id: 'data-csa-members',
      dataName: 'CSA Members',
      dataNameFr: 'Membres ASC',
      sphere: 'community',
      dataType: 'hierarchy',
      updateFrequency: 'weekly',
      sharedWith: ['business']
    }
  ],
  
  requiredConnections: [
    {
      id: 'conn-field-subsidy',
      fromSphere: 'business',
      toSphere: 'government',
      connectionType: 'data-sync',
      description: 'Field data for subsidy applications',
      descriptionFr: 'Données de champs pour demandes de subventions',
      frequency: 'event-driven',
      dataElements: ['field-id', 'crop', 'acreage', 'practices']
    },
    {
      id: 'conn-livestock-compliance',
      fromSphere: 'business',
      toSphere: 'government',
      connectionType: 'data-sync',
      description: 'Livestock data for traceability',
      descriptionFr: 'Données du bétail pour traçabilité',
      frequency: 'event-driven',
      dataElements: ['animal-id', 'movements', 'health-records']
    },
    {
      id: 'conn-harvest-sales',
      fromSphere: 'business',
      toSphere: 'community',
      connectionType: 'trigger',
      description: 'Harvest availability to sales channels',
      descriptionFr: 'Disponibilité des récoltes vers canaux de vente',
      frequency: 'event-driven',
      dataElements: ['product', 'quantity', 'harvest-date']
    }
  ],
  
  requiredIntegrations: [
    {
      id: 'int-weather',
      name: 'Weather Data',
      type: 'api',
      provider: 'Environment Canada/NOAA',
      sphere: 'business',
      purpose: 'Planning and alerts',
      purposeFr: 'Planification et alertes',
      priority: 'essential'
    },
    {
      id: 'int-agri-programs',
      name: 'Agricultural Programs Portal',
      type: 'api',
      provider: 'Provincial Agriculture',
      sphere: 'government',
      purpose: 'Subsidy applications',
      purposeFr: 'Demandes de subventions',
      priority: 'important'
    },
    {
      id: 'int-market-prices',
      name: 'Market Prices',
      type: 'api',
      provider: 'Commodity exchanges',
      sphere: 'business',
      purpose: 'Pricing decisions',
      purposeFr: 'Décisions de prix',
      priority: 'important'
    }
  ],
  
  executionInterfaces: [
    {
      id: 'ui-crop-planner',
      name: 'Crop Planning Calendar',
      nameFr: 'Calendrier de planification des cultures',
      type: 'dashboard',
      sphere: 'business',
      description: 'Visual field planner with rotation, planting, harvest schedules'
    },
    {
      id: 'ui-livestock-registry',
      name: 'Livestock Registry',
      nameFr: 'Registre du bétail',
      type: 'tracker',
      sphere: 'business',
      description: 'Individual animal records with health, breeding, movements'
    },
    {
      id: 'ui-equipment-fleet',
      name: 'Equipment Fleet Manager',
      nameFr: 'Gestionnaire de flotte d\'équipement',
      type: 'tracker',
      sphere: 'business',
      description: 'All farm equipment with maintenance schedules, costs'
    },
    {
      id: 'ui-csa-manager',
      name: 'CSA Subscription Manager',
      nameFr: 'Gestionnaire d\'abonnements ASC',
      type: 'dashboard',
      sphere: 'community',
      description: 'Member management, share contents, pickup scheduling'
    },
    {
      id: 'ui-traceability',
      name: 'Traceability Dashboard',
      nameFr: 'Tableau de bord traçabilité',
      type: 'dashboard',
      sphere: 'government',
      description: 'Lot tracking from field/animal to customer'
    }
  ],
  
  dataFlows: [
    {
      id: 'flow-weather-import',
      name: 'Weather Data Import',
      direction: 'import',
      format: ['API'],
      source: 'Weather service',
      destination: 'Business > Planning',
      frequency: 'Hourly'
    },
    {
      id: 'flow-traceability-export',
      name: 'Traceability Report Export',
      direction: 'export',
      format: ['PDF', 'CSV'],
      source: 'Government > Traceability',
      destination: 'Inspector/Buyer',
      frequency: 'On-demand'
    }
  ],
  
  suggestedBureauCustomization: [
    {
      sphereId: 'business',
      prioritizedViews: ['Crop Calendar', 'Livestock', 'Equipment', 'Weather'],
      customSections: ['Field Maps', 'Harvest Planning', 'Input Costs'],
      customAgents: ['Weather Alert', 'Planting Optimizer', 'Price Alert']
    },
    {
      sphereId: 'government',
      prioritizedViews: ['Subsidies', 'Traceability', 'Compliance', 'Land Records'],
      customSections: ['Organic Certification', 'Environmental Compliance'],
      customAgents: ['Program Matcher', 'Compliance Checker']
    },
    {
      sphereId: 'community',
      prioritizedViews: ['CSA Members', 'Market Sales', 'Farm Workers'],
      customSections: ['Pickup Schedule', 'Share Contents'],
      customAgents: ['CSA Share Planner']
    }
  ],
  
  identifiedGaps: [
    {
      id: 'gap-crop-planning',
      description: 'No agricultural crop planning with rotation history',
      descriptionFr: 'Pas de planification agricole avec historique de rotation',
      severity: 'blocker',
      affectedSpheres: ['business'],
      proposedSolution: 'Add Crop Planning Module with field mapping, crop database, rotation tracking, weather integration'
    },
    {
      id: 'gap-livestock',
      description: 'No livestock registry with individual animal tracking',
      descriptionFr: 'Pas de registre de bétail avec suivi individuel des animaux',
      severity: 'blocker',
      affectedSpheres: ['business', 'government'],
      proposedSolution: 'Add Livestock Module with animal registry, health records, breeding, movement tracking'
    },
    {
      id: 'gap-traceability',
      description: 'No food traceability/lot tracking system',
      descriptionFr: 'Pas de système de traçabilité alimentaire/suivi de lots',
      severity: 'major',
      affectedSpheres: ['business', 'government'],
      proposedSolution: 'Add Traceability Module linking production to sales with lot numbers'
    }
  ]
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT DE TOUS LES PROFILS SUPPLÉMENTAIRES
// ═══════════════════════════════════════════════════════════════════════════

export const ADDITIONAL_USER_PROFILES: CompleteUserProfile[] = [
  PROFILE_ALEX_EVENT_PLANNER,
  PROFILE_EMILIE_ECOMMERCE,
  PROFILE_MARC_FARMER
];

// Total des profils
export const TOTAL_PROFILES_COUNT = 6; // 3 + 3
