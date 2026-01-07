/**
 * CHE·NU™ — PROJECT SIMULATOR
 * 
 * ════════════════════════════════════════════════════════════════════════════
 * Simulation de projets réels pour tester les features workspace
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Scenarios: PDF, Excel, Invoice, Photo, Documents
 */

import { FeatureCategory } from './workspaceBenchmarker';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ProjectSimulation {
  id: string;
  name: string;
  nameFr: string;
  category: FeatureCategory;
  complexity: 'simple' | 'medium' | 'complex' | 'professional';
  
  // Scénario détaillé
  scenario: {
    context: string;
    contextFr: string;
    userProfile: string;
    goal: string;
    goalFr: string;
  };
  
  // Workflow steps
  steps: SimulationStep[];
  
  // Inputs requis
  inputs: {
    type: string;
    description: string;
    example: string;
  }[];
  
  // Outputs attendus
  expectedOutputs: {
    type: string;
    format: string;
    qualityCriteria: string[];
  }[];
  
  // Métriques de comparaison
  industryBenchmark: {
    tool: string;
    timeMinutes: number;
    stepsRequired: number;
    skillLevel: 'beginner' | 'intermediate' | 'expert';
  };
  
  // Objectifs CHE·NU
  chenuTarget: {
    timeMinutes: number;
    stepsRequired: number;
    aiAssistance: string[];
  };
  
  // Résultats de simulation
  results?: SimulationResults;
}

export interface SimulationStep {
  order: number;
  action: string;
  actionFr: string;
  workspaceMode: string;
  aiAssistAvailable: boolean;
  estimatedTimeSeconds: number;
  potentialIssues: string[];
}

export interface SimulationResults {
  completed: boolean;
  actualTimeMinutes: number;
  qualityScore: number;           // 0-100
  errorCount: number;
  userFrustrationPoints: string[];
  successHighlights: string[];
  comparisonToIndustry: 'faster' | 'same' | 'slower';
  overallVerdict: 'superior' | 'competitive' | 'needs-work';
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT SIMULATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const PROJECT_SIMULATIONS: ProjectSimulation[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // PDF CREATION SIMULATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  {
    id: 'sim-pdf-proposal',
    name: 'Create Client Proposal PDF',
    nameFr: 'Créer une proposition client en PDF',
    category: 'pdf-creation',
    complexity: 'professional',
    scenario: {
      context: 'A contractor needs to create a professional 10-page renovation proposal for a client with cost breakdown, timeline, and terms.',
      contextFr: 'Un entrepreneur doit créer une proposition de rénovation professionnelle de 10 pages avec ventilation des coûts, échéancier et conditions.',
      userProfile: 'Jonathan - General Contractor',
      goal: 'Generate a polished, branded proposal PDF that wins the contract',
      goalFr: 'Générer un PDF de proposition soigné et brandé qui gagne le contrat'
    },
    steps: [
      { order: 1, action: 'Select proposal template', actionFr: 'Sélectionner le modèle de proposition', workspaceMode: 'Document', aiAssistAvailable: true, estimatedTimeSeconds: 30, potentialIssues: ['Template not domain-specific enough'] },
      { order: 2, action: 'Import project data from thread', actionFr: 'Importer les données du projet depuis le fil', workspaceMode: 'Document', aiAssistAvailable: true, estimatedTimeSeconds: 60, potentialIssues: ['Data mapping errors'] },
      { order: 3, action: 'AI generates cost breakdown section', actionFr: 'L\'IA génère la section de ventilation des coûts', workspaceMode: 'Document', aiAssistAvailable: true, estimatedTimeSeconds: 120, potentialIssues: ['Calculations need verification'] },
      { order: 4, action: 'Add timeline with Gantt', actionFr: 'Ajouter l\'échéancier avec Gantt', workspaceMode: 'Timeline', aiAssistAvailable: true, estimatedTimeSeconds: 180, potentialIssues: ['Complex dependency handling'] },
      { order: 5, action: 'Insert terms and conditions', actionFr: 'Insérer les termes et conditions', workspaceMode: 'Document', aiAssistAvailable: true, estimatedTimeSeconds: 60, potentialIssues: ['Legal compliance'] },
      { order: 6, action: 'Review and finalize', actionFr: 'Réviser et finaliser', workspaceMode: 'Document', aiAssistAvailable: true, estimatedTimeSeconds: 180, potentialIssues: ['Formatting inconsistencies'] },
      { order: 7, action: 'Export to PDF', actionFr: 'Exporter en PDF', workspaceMode: 'Document', aiAssistAvailable: false, estimatedTimeSeconds: 30, potentialIssues: ['Font embedding', 'Image quality'] }
    ],
    inputs: [
      { type: 'project-data', description: 'Project scope from thread', example: 'Kitchen renovation, 3 phases, $45K budget' },
      { type: 'client-info', description: 'Client contact details', example: 'Jean Tremblay, 123 Rue Principale' },
      { type: 'brand-assets', description: 'Company logo and colors', example: 'Logo.png, #2C5F2D brand color' }
    ],
    expectedOutputs: [
      { 
        type: 'pdf', 
        format: 'PDF/A', 
        qualityCriteria: [
          'Professional layout with consistent branding',
          'Accurate cost calculations',
          'Clear timeline visualization',
          'Print-ready quality (300 DPI)',
          'Embedded fonts',
          'Table of contents with links'
        ]
      }
    ],
    industryBenchmark: {
      tool: 'Microsoft Word + Adobe Acrobat',
      timeMinutes: 120,
      stepsRequired: 25,
      skillLevel: 'intermediate'
    },
    chenuTarget: {
      timeMinutes: 25,
      stepsRequired: 7,
      aiAssistance: [
        'Auto-populate from thread data',
        'Generate cost breakdown',
        'Suggest timeline based on similar projects',
        'Format check before export'
      ]
    }
  },
  
  {
    id: 'sim-pdf-report',
    name: 'Generate Monthly Financial Report PDF',
    nameFr: 'Générer un rapport financier mensuel en PDF',
    category: 'pdf-creation',
    complexity: 'medium',
    scenario: {
      context: 'A property manager needs to generate a monthly financial report for a property portfolio with income, expenses, and charts.',
      contextFr: 'Un gestionnaire immobilier doit générer un rapport financier mensuel pour un portfolio de propriétés avec revenus, dépenses et graphiques.',
      userProfile: 'Marc - Property Manager (Enterprise)',
      goal: 'Create a comprehensive report with charts and executive summary',
      goalFr: 'Créer un rapport complet avec graphiques et sommaire exécutif'
    },
    steps: [
      { order: 1, action: 'Select financial report template', actionFr: 'Sélectionner le modèle de rapport financier', workspaceMode: 'Document', aiAssistAvailable: true, estimatedTimeSeconds: 20, potentialIssues: [] },
      { order: 2, action: 'Pull data from Immobilier DataSpace', actionFr: 'Extraire les données du DataSpace Immobilier', workspaceMode: 'Dashboard', aiAssistAvailable: true, estimatedTimeSeconds: 45, potentialIssues: ['Data freshness'] },
      { order: 3, action: 'AI generates executive summary', actionFr: 'L\'IA génère le sommaire exécutif', workspaceMode: 'Document', aiAssistAvailable: true, estimatedTimeSeconds: 90, potentialIssues: ['Tone appropriateness'] },
      { order: 4, action: 'Auto-generate charts from data', actionFr: 'Génération automatique des graphiques', workspaceMode: 'Spreadsheet', aiAssistAvailable: true, estimatedTimeSeconds: 60, potentialIssues: ['Chart type selection'] },
      { order: 5, action: 'Compile and format', actionFr: 'Compiler et formater', workspaceMode: 'Document', aiAssistAvailable: true, estimatedTimeSeconds: 90, potentialIssues: ['Page breaks'] },
      { order: 6, action: 'Export to PDF with TOC', actionFr: 'Exporter en PDF avec table des matières', workspaceMode: 'Document', aiAssistAvailable: false, estimatedTimeSeconds: 20, potentialIssues: [] }
    ],
    inputs: [
      { type: 'date-range', description: 'Report period', example: 'November 2025' },
      { type: 'property-selection', description: 'Properties to include', example: 'All 12 properties in portfolio' }
    ],
    expectedOutputs: [
      { 
        type: 'pdf', 
        format: 'PDF', 
        qualityCriteria: [
          'Executive summary on first page',
          'Clear financial tables',
          'Professional charts (bar, pie, line)',
          'Property-by-property breakdown',
          'Comparison to previous period'
        ]
      }
    ],
    industryBenchmark: {
      tool: 'Excel + Word + PDF export',
      timeMinutes: 90,
      stepsRequired: 20,
      skillLevel: 'intermediate'
    },
    chenuTarget: {
      timeMinutes: 15,
      stepsRequired: 6,
      aiAssistance: [
        'Auto-pull data from DataSpace',
        'Generate executive summary',
        'Suggest relevant charts',
        'Highlight anomalies and trends'
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SPREADSHEET SIMULATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  {
    id: 'sim-excel-budget',
    name: 'Create Project Budget Spreadsheet',
    nameFr: 'Créer un budget de projet en tableur',
    category: 'spreadsheet',
    complexity: 'professional',
    scenario: {
      context: 'An event planner needs to create a detailed budget for a 500-person corporate event with multiple cost categories and contingency.',
      contextFr: 'Un planificateur d\'événements doit créer un budget détaillé pour un événement corporatif de 500 personnes avec plusieurs catégories de coûts et contingence.',
      userProfile: 'Alex - Event Planner',
      goal: 'Build a comprehensive budget with formulas, categories, and variance tracking',
      goalFr: 'Construire un budget complet avec formules, catégories et suivi des écarts'
    },
    steps: [
      { order: 1, action: 'Create budget from template', actionFr: 'Créer le budget à partir d\'un modèle', workspaceMode: 'Spreadsheet', aiAssistAvailable: true, estimatedTimeSeconds: 30, potentialIssues: ['Template customization'] },
      { order: 2, action: 'Define cost categories', actionFr: 'Définir les catégories de coûts', workspaceMode: 'Spreadsheet', aiAssistAvailable: true, estimatedTimeSeconds: 120, potentialIssues: ['Category granularity'] },
      { order: 3, action: 'Enter estimated costs', actionFr: 'Saisir les coûts estimés', workspaceMode: 'Spreadsheet', aiAssistAvailable: true, estimatedTimeSeconds: 300, potentialIssues: ['Data entry errors'] },
      { order: 4, action: 'Add formulas for totals and percentages', actionFr: 'Ajouter les formules pour totaux et pourcentages', workspaceMode: 'Spreadsheet', aiAssistAvailable: true, estimatedTimeSeconds: 180, potentialIssues: ['Formula errors'] },
      { order: 5, action: 'Create variance columns', actionFr: 'Créer les colonnes d\'écart', workspaceMode: 'Spreadsheet', aiAssistAvailable: true, estimatedTimeSeconds: 120, potentialIssues: ['Conditional formatting'] },
      { order: 6, action: 'Add contingency calculation', actionFr: 'Ajouter le calcul de contingence', workspaceMode: 'Spreadsheet', aiAssistAvailable: true, estimatedTimeSeconds: 60, potentialIssues: [] },
      { order: 7, action: 'Generate summary chart', actionFr: 'Générer le graphique sommaire', workspaceMode: 'Spreadsheet', aiAssistAvailable: true, estimatedTimeSeconds: 90, potentialIssues: ['Chart configuration'] }
    ],
    inputs: [
      { type: 'event-details', description: 'Event specifications', example: '500 attendees, 2-day conference, downtown venue' },
      { type: 'vendor-quotes', description: 'Quotes from suppliers', example: 'Catering: $75/person, AV: $8,000' }
    ],
    expectedOutputs: [
      { 
        type: 'spreadsheet', 
        format: 'XLSX', 
        qualityCriteria: [
          'Proper category hierarchy',
          'Working formulas for all calculations',
          'Conditional formatting for over-budget items',
          'Summary dashboard with charts',
          'Print-ready layout'
        ]
      }
    ],
    industryBenchmark: {
      tool: 'Microsoft Excel',
      timeMinutes: 60,
      stepsRequired: 15,
      skillLevel: 'intermediate'
    },
    chenuTarget: {
      timeMinutes: 20,
      stepsRequired: 7,
      aiAssistance: [
        'Suggest category structure based on event type',
        'Auto-generate formulas from natural language',
        'Recommend contingency percentage',
        'Highlight potential budget issues'
      ]
    }
  },
  
  {
    id: 'sim-excel-analysis',
    name: 'Analyze Sales Data with Pivot',
    nameFr: 'Analyser les données de vente avec pivot',
    category: 'spreadsheet',
    complexity: 'complex',
    scenario: {
      context: 'An e-commerce owner needs to analyze 12 months of sales data to identify trends, top products, and seasonal patterns.',
      contextFr: 'Un propriétaire e-commerce doit analyser 12 mois de données de vente pour identifier les tendances, meilleurs produits et patterns saisonniers.',
      userProfile: 'Émilie - E-commerce Owner',
      goal: 'Extract actionable insights from raw sales data',
      goalFr: 'Extraire des insights actionnables des données de vente brutes'
    },
    steps: [
      { order: 1, action: 'Import sales data CSV', actionFr: 'Importer le CSV de ventes', workspaceMode: 'Spreadsheet', aiAssistAvailable: true, estimatedTimeSeconds: 30, potentialIssues: ['Encoding issues', 'Date format'] },
      { order: 2, action: 'Clean and format data', actionFr: 'Nettoyer et formater les données', workspaceMode: 'Spreadsheet', aiAssistAvailable: true, estimatedTimeSeconds: 120, potentialIssues: ['Missing values', 'Duplicates'] },
      { order: 3, action: 'Create pivot table by product', actionFr: 'Créer tableau croisé par produit', workspaceMode: 'Spreadsheet', aiAssistAvailable: true, estimatedTimeSeconds: 180, potentialIssues: ['Pivot configuration'] },
      { order: 4, action: 'Add time-based analysis', actionFr: 'Ajouter l\'analyse temporelle', workspaceMode: 'Spreadsheet', aiAssistAvailable: true, estimatedTimeSeconds: 150, potentialIssues: ['Date grouping'] },
      { order: 5, action: 'Generate trend visualization', actionFr: 'Générer la visualisation de tendances', workspaceMode: 'Spreadsheet', aiAssistAvailable: true, estimatedTimeSeconds: 120, potentialIssues: [] },
      { order: 6, action: 'AI identifies insights', actionFr: 'L\'IA identifie les insights', workspaceMode: 'Spreadsheet', aiAssistAvailable: true, estimatedTimeSeconds: 60, potentialIssues: [] }
    ],
    inputs: [
      { type: 'csv', description: '12 months sales data', example: 'sales_2025.csv - 15,000 rows' }
    ],
    expectedOutputs: [
      { 
        type: 'analysis', 
        format: 'XLSX + Dashboard', 
        qualityCriteria: [
          'Clean pivot tables',
          'Monthly trend line chart',
          'Top 10 products ranking',
          'Seasonal pattern identification',
          'AI-generated insights summary'
        ]
      }
    ],
    industryBenchmark: {
      tool: 'Microsoft Excel',
      timeMinutes: 45,
      stepsRequired: 12,
      skillLevel: 'expert'
    },
    chenuTarget: {
      timeMinutes: 12,
      stepsRequired: 6,
      aiAssistance: [
        'Auto-detect data types and clean',
        'Suggest pivot configurations',
        'Auto-generate relevant charts',
        'Provide written insights summary'
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INVOICE SIMULATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  {
    id: 'sim-invoice-project',
    name: 'Generate Invoice from Completed Project',
    nameFr: 'Générer une facture à partir d\'un projet complété',
    category: 'invoice',
    complexity: 'medium',
    scenario: {
      context: 'A musician needs to invoice a client for a completed composition project including licensing fees and revisions.',
      contextFr: 'Un musicien doit facturer un client pour un projet de composition complété incluant frais de licence et révisions.',
      userProfile: 'Marie - Independent Musician',
      goal: 'Create a professional invoice with line items, taxes, and payment terms',
      goalFr: 'Créer une facture professionnelle avec détails, taxes et conditions de paiement'
    },
    steps: [
      { order: 1, action: 'AI pulls data from completed thread', actionFr: 'L\'IA extrait les données du fil complété', workspaceMode: 'Document', aiAssistAvailable: true, estimatedTimeSeconds: 30, potentialIssues: [] },
      { order: 2, action: 'Select invoice template', actionFr: 'Sélectionner le modèle de facture', workspaceMode: 'Document', aiAssistAvailable: true, estimatedTimeSeconds: 15, potentialIssues: [] },
      { order: 3, action: 'Review auto-populated line items', actionFr: 'Réviser les items auto-remplis', workspaceMode: 'Document', aiAssistAvailable: true, estimatedTimeSeconds: 60, potentialIssues: ['Missing items'] },
      { order: 4, action: 'Add taxes (GST/QST)', actionFr: 'Ajouter les taxes (TPS/TVQ)', workspaceMode: 'Document', aiAssistAvailable: true, estimatedTimeSeconds: 20, potentialIssues: ['Tax rate accuracy'] },
      { order: 5, action: 'Set payment terms', actionFr: 'Définir les conditions de paiement', workspaceMode: 'Document', aiAssistAvailable: true, estimatedTimeSeconds: 15, potentialIssues: [] },
      { order: 6, action: 'Generate and send', actionFr: 'Générer et envoyer', workspaceMode: 'Document', aiAssistAvailable: false, estimatedTimeSeconds: 30, potentialIssues: [] }
    ],
    inputs: [
      { type: 'thread-reference', description: 'Completed project thread', example: 'Thread: "Commercial jingle for XYZ Corp"' },
      { type: 'client-info', description: 'Client billing details', example: 'XYZ Corp, AP Department' }
    ],
    expectedOutputs: [
      { 
        type: 'invoice', 
        format: 'PDF', 
        qualityCriteria: [
          'Professional branded layout',
          'Accurate line item descriptions',
          'Correct tax calculations',
          'Clear payment instructions',
          'Invoice number sequence maintained'
        ]
      }
    ],
    industryBenchmark: {
      tool: 'FreshBooks',
      timeMinutes: 15,
      stepsRequired: 10,
      skillLevel: 'beginner'
    },
    chenuTarget: {
      timeMinutes: 5,
      stepsRequired: 6,
      aiAssistance: [
        'Auto-populate from thread',
        'Suggest line items based on project type',
        'Calculate taxes automatically',
        'Track invoice status'
      ]
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PHOTO EDITING SIMULATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  
  {
    id: 'sim-photo-property',
    name: 'Enhance Property Listing Photos',
    nameFr: 'Améliorer les photos d\'annonce immobilière',
    category: 'photo-editing',
    complexity: 'medium',
    scenario: {
      context: 'A property manager needs to enhance 10 photos of a rental unit for the listing - adjust lighting, straighten, and optimize for web.',
      contextFr: 'Un gestionnaire immobilier doit améliorer 10 photos d\'un logement locatif - ajuster l\'éclairage, redresser et optimiser pour le web.',
      userProfile: 'Marc - Property Manager',
      goal: 'Create professional-looking listing photos quickly',
      goalFr: 'Créer des photos d\'annonce professionnelles rapidement'
    },
    steps: [
      { order: 1, action: 'Upload batch of photos', actionFr: 'Téléverser le lot de photos', workspaceMode: 'Media', aiAssistAvailable: true, estimatedTimeSeconds: 30, potentialIssues: ['Large file sizes'] },
      { order: 2, action: 'AI auto-enhance all photos', actionFr: 'L\'IA améliore automatiquement toutes les photos', workspaceMode: 'Media', aiAssistAvailable: true, estimatedTimeSeconds: 60, potentialIssues: ['Over-processing'] },
      { order: 3, action: 'Review and adjust individual photos', actionFr: 'Réviser et ajuster les photos individuelles', workspaceMode: 'Media', aiAssistAvailable: true, estimatedTimeSeconds: 180, potentialIssues: ['Limited manual controls'] },
      { order: 4, action: 'Crop and straighten where needed', actionFr: 'Recadrer et redresser au besoin', workspaceMode: 'Media', aiAssistAvailable: true, estimatedTimeSeconds: 120, potentialIssues: [] },
      { order: 5, action: 'Batch export for web', actionFr: 'Export en lot pour le web', workspaceMode: 'Media', aiAssistAvailable: false, estimatedTimeSeconds: 30, potentialIssues: ['Compression quality'] }
    ],
    inputs: [
      { type: 'images', description: '10 property photos', example: 'iPhone photos, various lighting conditions' }
    ],
    expectedOutputs: [
      { 
        type: 'images', 
        format: 'JPEG (web-optimized)', 
        qualityCriteria: [
          'Consistent brightness across set',
          'Straight vertical lines',
          'Natural color balance',
          'Web-optimized file size (<500KB each)',
          'Consistent aspect ratio'
        ]
      }
    ],
    industryBenchmark: {
      tool: 'Adobe Lightroom',
      timeMinutes: 30,
      stepsRequired: 15,
      skillLevel: 'intermediate'
    },
    chenuTarget: {
      timeMinutes: 8,
      stepsRequired: 5,
      aiAssistance: [
        'One-click batch enhancement',
        'Auto-straighten architecture',
        'Smart color correction',
        'Optimal web export settings'
      ]
    }
  },
  
  {
    id: 'sim-photo-headshot',
    name: 'Professional Headshot Retouching',
    nameFr: 'Retouche de photo portrait professionnel',
    category: 'photo-editing',
    complexity: 'professional',
    scenario: {
      context: 'A professional needs to retouch their business headshot - remove background, enhance lighting, and create versions for different platforms.',
      contextFr: 'Un professionnel doit retoucher sa photo portrait - retirer le fond, améliorer l\'éclairage et créer des versions pour différentes plateformes.',
      userProfile: 'Sarah - Medical Professional',
      goal: 'Create a polished professional headshot for LinkedIn, website, and print',
      goalFr: 'Créer une photo portrait professionnelle soignée pour LinkedIn, site web et impression'
    },
    steps: [
      { order: 1, action: 'Upload original photo', actionFr: 'Téléverser la photo originale', workspaceMode: 'Media', aiAssistAvailable: true, estimatedTimeSeconds: 15, potentialIssues: [] },
      { order: 2, action: 'AI remove background', actionFr: 'L\'IA retire le fond', workspaceMode: 'Media', aiAssistAvailable: true, estimatedTimeSeconds: 30, potentialIssues: ['Hair edge detection'] },
      { order: 3, action: 'Apply professional background', actionFr: 'Appliquer un fond professionnel', workspaceMode: 'Media', aiAssistAvailable: true, estimatedTimeSeconds: 30, potentialIssues: ['Color matching'] },
      { order: 4, action: 'AI skin smoothing and enhancement', actionFr: 'Lissage et amélioration de la peau par IA', workspaceMode: 'Media', aiAssistAvailable: true, estimatedTimeSeconds: 45, potentialIssues: ['Unnatural look'] },
      { order: 5, action: 'Adjust lighting and contrast', actionFr: 'Ajuster l\'éclairage et le contraste', workspaceMode: 'Media', aiAssistAvailable: true, estimatedTimeSeconds: 60, potentialIssues: [] },
      { order: 6, action: 'Export multiple sizes', actionFr: 'Exporter en plusieurs tailles', workspaceMode: 'Media', aiAssistAvailable: true, estimatedTimeSeconds: 30, potentialIssues: [] }
    ],
    inputs: [
      { type: 'image', description: 'Original headshot', example: 'High-res JPEG from smartphone' }
    ],
    expectedOutputs: [
      { 
        type: 'images', 
        format: 'PNG + JPEG', 
        qualityCriteria: [
          'Clean background removal',
          'Natural skin appearance',
          'Professional lighting',
          'LinkedIn-ready (400x400)',
          'Website-ready (800x800)',
          'Print-ready (300 DPI)'
        ]
      }
    ],
    industryBenchmark: {
      tool: 'Adobe Photoshop',
      timeMinutes: 45,
      stepsRequired: 20,
      skillLevel: 'expert'
    },
    chenuTarget: {
      timeMinutes: 8,
      stepsRequired: 6,
      aiAssistance: [
        'One-click background removal',
        'Professional background presets',
        'Natural skin enhancement',
        'Multi-format export presets'
      ]
    }
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT SIMULATOR CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class ProjectSimulator {
  private simulations: Map<string, ProjectSimulation> = new Map();
  
  constructor() {
    for (const sim of PROJECT_SIMULATIONS) {
      this.simulations.set(sim.id, sim);
    }
    logger.debug('🎬 Project Simulator initialized with', this.simulations.size, 'simulations');
  }
  
  /**
   * Exécuter une simulation (simulation mode)
   */
  runSimulation(simulationId: string): SimulationResults {
    const sim = this.simulations.get(simulationId);
    if (!sim) {
      throw new Error(`Simulation not found: ${simulationId}`);
    }
    
    // Calculer le temps total estimé
    const totalTimeSeconds = sim.steps.reduce((sum, s) => sum + s.estimatedTimeSeconds, 0);
    const actualTimeMinutes = totalTimeSeconds / 60;
    
    // Calculer le score de qualité basé sur les issues potentielles
    const totalIssues = sim.steps.reduce((sum, s) => sum + s.potentialIssues.length, 0);
    const aiAssistedSteps = sim.steps.filter(s => s.aiAssistAvailable).length;
    const qualityScore = Math.max(60, 100 - (totalIssues * 5) + (aiAssistedSteps * 2));
    
    // Comparer à l'industrie
    let comparison: SimulationResults['comparisonToIndustry'];
    if (actualTimeMinutes < sim.industryBenchmark.timeMinutes * 0.7) {
      comparison = 'faster';
    } else if (actualTimeMinutes < sim.industryBenchmark.timeMinutes * 1.1) {
      comparison = 'same';
    } else {
      comparison = 'slower';
    }
    
    // Verdict global
    let verdict: SimulationResults['overallVerdict'];
    if (comparison === 'faster' && qualityScore >= 85) {
      verdict = 'superior';
    } else if (comparison !== 'slower' && qualityScore >= 70) {
      verdict = 'competitive';
    } else {
      verdict = 'needs-work';
    }
    
    const results: SimulationResults = {
      completed: true,
      actualTimeMinutes: Math.round(actualTimeMinutes * 10) / 10,
      qualityScore: Math.round(qualityScore),
      errorCount: totalIssues,
      userFrustrationPoints: sim.steps.flatMap(s => s.potentialIssues),
      successHighlights: sim.chenuTarget.aiAssistance,
      comparisonToIndustry: comparison,
      overallVerdict: verdict
    };
    
    return results;
  }
  
  /**
   * Exécuter toutes les simulations et générer un rapport
   */
  runAllSimulations(): {
    results: Array<{ simulation: ProjectSimulation; results: SimulationResults }>;
    summary: {
      totalSimulations: number;
      superior: number;
      competitive: number;
      needsWork: number;
      averageTimeSavings: number;
      averageQuality: number;
    };
  } {
    const allResults: Array<{ simulation: ProjectSimulation; results: SimulationResults }> = [];
    
    for (const sim of this.simulations.values()) {
      const results = this.runSimulation(sim.id);
      allResults.push({ simulation: sim, results });
    }
    
    const superior = allResults.filter(r => r.results.overallVerdict === 'superior').length;
    const competitive = allResults.filter(r => r.results.overallVerdict === 'competitive').length;
    const needsWork = allResults.filter(r => r.results.overallVerdict === 'needs-work').length;
    
    const timeSavings = allResults.map(r => {
      const industry = r.simulation.industryBenchmark.timeMinutes;
      const chenu = r.results.actualTimeMinutes;
      return ((industry - chenu) / industry) * 100;
    });
    
    const avgTimeSavings = timeSavings.reduce((a, b) => a + b, 0) / timeSavings.length;
    const avgQuality = allResults.reduce((sum, r) => sum + r.results.qualityScore, 0) / allResults.length;
    
    return {
      results: allResults,
      summary: {
        totalSimulations: allResults.length,
        superior,
        competitive,
        needsWork,
        averageTimeSavings: Math.round(avgTimeSavings),
        averageQuality: Math.round(avgQuality)
      }
    };
  }
  
  /**
   * Obtenir les priorités d'amélioration
   */
  getImprovementPriorities(): Array<{
    simulation: string;
    category: FeatureCategory;
    issues: string[];
    priority: 'critical' | 'high' | 'medium' | 'low';
  }> {
    const priorities: Array<{
      simulation: string;
      category: FeatureCategory;
      issues: string[];
      priority: 'critical' | 'high' | 'medium' | 'low';
    }> = [];
    
    for (const sim of this.simulations.values()) {
      const results = this.runSimulation(sim.id);
      
      let priority: 'critical' | 'high' | 'medium' | 'low';
      if (results.overallVerdict === 'needs-work') {
        priority = 'critical';
      } else if (results.qualityScore < 80) {
        priority = 'high';
      } else if (results.errorCount > 3) {
        priority = 'medium';
      } else {
        priority = 'low';
      }
      
      if (priority !== 'low') {
        priorities.push({
          simulation: sim.name,
          category: sim.category,
          issues: results.userFrustrationPoints,
          priority
        });
      }
    }
    
    return priorities.sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return order[a.priority] - order[b.priority];
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const projectSimulator = new ProjectSimulator();
