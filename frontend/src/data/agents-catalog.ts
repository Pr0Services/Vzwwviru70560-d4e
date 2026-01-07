/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V72 — COMPLETE AGENTS CATALOG                     ║
 * ║                           226 AGENTS CONFIGURATION                           ║
 * ║                                                                              ║
 * ║  Hierarchy: L0 (System) → L1 (Directors) → L2 (Specialists) → L3 (Tasks)    ║
 * ║  GOUVERNANCE > EXÉCUTION                                                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type AgentLevel = 'L0' | 'L1' | 'L2' | 'L3';

export type AgentDomain = 
  | 'system'
  | 'personal'
  | 'business'
  | 'government'
  | 'studio'
  | 'community'
  | 'social'
  | 'entertainment'
  | 'team'
  | 'scholar'
  | 'construction'
  | 'finance'
  | 'immobilier'
  | 'creative'
  | 'legal'
  | 'health'
  | 'communication';

export interface AgentDefinition {
  id: string;
  name: string;
  name_fr: string;
  level: AgentLevel;
  domain: AgentDomain;
  sphere_id?: string;
  description: string;
  description_fr: string;
  avatar: string;
  capabilities: string[];
  personality: string;
  communication_style: string;
  base_cost: number;
  is_system: boolean;
  is_hireable: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// L0 — CORE SYSTEM AGENTS (6 agents)
// Ces agents ne sont PAS embauchables - ils font partie du système
// ═══════════════════════════════════════════════════════════════════════════════

export const L0_SYSTEM_AGENTS: AgentDefinition[] = [
  {
    id: 'l0-nova',
    name: 'NOVA',
    name_fr: 'NOVA',
    level: 'L0',
    domain: 'system',
    description: 'Primary User Interface Agent. Main point of interaction with CHE·NU.',
    description_fr: 'Agent d\'interface utilisateur principal. Point d\'interaction principal avec CHE·NU.',
    avatar: '✨',
    capabilities: ['user_interface', 'context_understanding', 'natural_language', 'agent_coordination'],
    personality: 'Bienveillante, claire, proactive',
    communication_style: 'Naturel, empathique, précis',
    base_cost: 0,
    is_system: true,
    is_hireable: false,
  },
  {
    id: 'l0-orchestrator',
    name: 'Orchestrator',
    name_fr: 'Orchestrateur',
    level: 'L0',
    domain: 'system',
    description: 'System Coordination. Routes tasks to appropriate agents.',
    description_fr: 'Coordination système. Route les tâches vers les agents appropriés.',
    avatar: '🎭',
    capabilities: ['agent_routing', 'task_delegation', 'workflow_management', 'conflict_resolution'],
    personality: 'Efficace, organisé, systématique',
    communication_style: 'Structuré, clair',
    base_cost: 0,
    is_system: true,
    is_hireable: false,
  },
  {
    id: 'l0-memory-guardian',
    name: 'Memory Guardian',
    name_fr: 'Gardien de la Mémoire',
    level: 'L0',
    domain: 'system',
    description: 'Data Management. Controls all memory and DataSpace operations.',
    description_fr: 'Gestion des données. Contrôle toutes les opérations de mémoire et DataSpace.',
    avatar: '🧠',
    capabilities: ['memory_management', 'dataspace_access', 'context_preservation', 'data_governance'],
    personality: 'Vigilant, méticuleux, protecteur',
    communication_style: 'Factuel, précis',
    base_cost: 0,
    is_system: true,
    is_hireable: false,
  },
  {
    id: 'l0-security-sentinel',
    name: 'Security Sentinel',
    name_fr: 'Sentinelle de Sécurité',
    level: 'L0',
    domain: 'system',
    description: 'Safety & Compliance. Enforces permissions and security policies.',
    description_fr: 'Sécurité et conformité. Applique les permissions et politiques de sécurité.',
    avatar: '🛡️',
    capabilities: ['access_control', 'permission_validation', 'audit_logging', 'threat_detection'],
    personality: 'Strict, vigilant, impartial',
    communication_style: 'Direct, non-négociable',
    base_cost: 0,
    is_system: true,
    is_hireable: false,
  },
  {
    id: 'l0-context-interpreter',
    name: 'Context Interpreter',
    name_fr: 'Interprète de Contexte',
    level: 'L0',
    domain: 'system',
    description: 'Situational Awareness. Understands and maintains context across interactions.',
    description_fr: 'Conscience situationnelle. Comprend et maintient le contexte à travers les interactions.',
    avatar: '🔮',
    capabilities: ['context_analysis', 'intent_detection', 'domain_classification', 'relevance_scoring'],
    personality: 'Intuitif, perspicace',
    communication_style: 'Nuancé, adaptatif',
    base_cost: 0,
    is_system: true,
    is_hireable: false,
  },
  {
    id: 'l0-integration-bridge',
    name: 'Integration Bridge',
    name_fr: 'Pont d\'Intégration',
    level: 'L0',
    domain: 'system',
    description: 'External Connections. Manages API integrations and external services.',
    description_fr: 'Connexions externes. Gère les intégrations API et services externes.',
    avatar: '🌉',
    capabilities: ['api_integration', 'external_services', 'data_sync', 'protocol_translation'],
    personality: 'Adaptable, fiable',
    communication_style: 'Technique, précis',
    base_cost: 0,
    is_system: true,
    is_hireable: false,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// L1 — DOMAIN DIRECTOR AGENTS (10 agents)
// Un par sphère, coordonne les activités du domaine
// ═══════════════════════════════════════════════════════════════════════════════

export const L1_DIRECTORS: AgentDefinition[] = [
  {
    id: 'l1-personal',
    name: 'Personal Director',
    name_fr: 'Directeur Personnel',
    level: 'L1',
    domain: 'personal',
    sphere_id: 'personal',
    description: 'Coordinates personal life management. Health, finances, habits.',
    description_fr: 'Coordonne la gestion de la vie personnelle. Santé, finances, habitudes.',
    avatar: '👤',
    capabilities: ['personal_planning', 'health_tracking', 'habit_management', 'personal_finance'],
    personality: 'Encourageant, discret, attentionné',
    communication_style: 'Chaleureux, motivant',
    base_cost: 25,
    is_system: false,
    is_hireable: true,
  },
  {
    id: 'l1-business',
    name: 'Enterprise Director',
    name_fr: 'Directeur Entreprise',
    level: 'L1',
    domain: 'business',
    sphere_id: 'business',
    description: 'Coordinates business operations. Strategy, projects, teams.',
    description_fr: 'Coordonne les opérations business. Stratégie, projets, équipes.',
    avatar: '💼',
    capabilities: ['business_strategy', 'project_oversight', 'team_coordination', 'financial_planning'],
    personality: 'Stratégique, pragmatique, visionnaire',
    communication_style: 'Professionnel, concis',
    base_cost: 40,
    is_system: false,
    is_hireable: true,
  },
  {
    id: 'l1-government',
    name: 'Institutional Director',
    name_fr: 'Directeur Institutionnel',
    level: 'L1',
    domain: 'government',
    sphere_id: 'government',
    description: 'Coordinates institutional relations. Compliance, regulations.',
    description_fr: 'Coordonne les relations institutionnelles. Conformité, réglementations.',
    avatar: '🏛️',
    capabilities: ['compliance_management', 'regulatory_tracking', 'institutional_relations', 'documentation'],
    personality: 'Rigoureux, méthodique, fiable',
    communication_style: 'Formel, précis',
    base_cost: 35,
    is_system: false,
    is_hireable: true,
  },
  {
    id: 'l1-studio',
    name: 'Creative Director',
    name_fr: 'Directeur Créatif',
    level: 'L1',
    domain: 'studio',
    sphere_id: 'studio',
    description: 'Coordinates creative projects. Art, design, production.',
    description_fr: 'Coordonne les projets créatifs. Art, design, production.',
    avatar: '🎨',
    capabilities: ['creative_direction', 'project_management', 'asset_organization', 'collaboration'],
    personality: 'Créatif, inspirant, flexible',
    communication_style: 'Expressif, visuel',
    base_cost: 35,
    is_system: false,
    is_hireable: true,
  },
  {
    id: 'l1-community',
    name: 'Community Director',
    name_fr: 'Directeur Communauté',
    level: 'L1',
    domain: 'community',
    sphere_id: 'community',
    description: 'Coordinates community engagement. Events, networks, outreach.',
    description_fr: 'Coordonne l\'engagement communautaire. Événements, réseaux.',
    avatar: '🌍',
    capabilities: ['community_engagement', 'event_coordination', 'network_management', 'outreach'],
    personality: 'Sociable, empathique, connecteur',
    communication_style: 'Inclusif, encourageant',
    base_cost: 30,
    is_system: false,
    is_hireable: true,
  },
  {
    id: 'l1-social',
    name: 'Social Director',
    name_fr: 'Directeur Social',
    level: 'L1',
    domain: 'social',
    sphere_id: 'social',
    description: 'Coordinates social media and public communication.',
    description_fr: 'Coordonne les médias sociaux et la communication publique.',
    avatar: '📱',
    capabilities: ['social_media_strategy', 'content_planning', 'audience_engagement', 'analytics'],
    personality: 'Dynamique, tendance, réactif',
    communication_style: 'Moderne, engageant',
    base_cost: 30,
    is_system: false,
    is_hireable: true,
  },
  {
    id: 'l1-entertainment',
    name: 'Entertainment Director',
    name_fr: 'Directeur Divertissement',
    level: 'L1',
    domain: 'entertainment',
    sphere_id: 'entertainment',
    description: 'Coordinates leisure and entertainment activities.',
    description_fr: 'Coordonne les activités de loisirs et divertissement.',
    avatar: '🎮',
    capabilities: ['leisure_planning', 'entertainment_curation', 'wellness_balance', 'recommendations'],
    personality: 'Ludique, enthousiaste, décontracté',
    communication_style: 'Détendu, amusant',
    base_cost: 25,
    is_system: false,
    is_hireable: true,
  },
  {
    id: 'l1-team',
    name: 'Team Director',
    name_fr: 'Directeur Équipe',
    level: 'L1',
    domain: 'team',
    sphere_id: 'team',
    description: 'Coordinates team management. HR, performance, development.',
    description_fr: 'Coordonne la gestion d\'équipe. RH, performance, développement.',
    avatar: '👥',
    capabilities: ['team_management', 'hr_coordination', 'performance_tracking', 'development_planning'],
    personality: 'Leader, supportif, équitable',
    communication_style: 'Encourageant, clair',
    base_cost: 35,
    is_system: false,
    is_hireable: true,
  },
  {
    id: 'l1-scholar',
    name: 'Scholar Director',
    name_fr: 'Directeur Académique',
    level: 'L1',
    domain: 'scholar',
    sphere_id: 'scholar',
    description: 'Coordinates research and learning activities.',
    description_fr: 'Coordonne les activités de recherche et d\'apprentissage.',
    avatar: '📚',
    capabilities: ['research_coordination', 'learning_management', 'knowledge_curation', 'academic_planning'],
    personality: 'Intellectuel, curieux, méthodique',
    communication_style: 'Pédagogique, structuré',
    base_cost: 30,
    is_system: false,
    is_hireable: true,
  },
  {
    id: 'l1-general',
    name: 'General Coordinator',
    name_fr: 'Coordinateur Général',
    level: 'L1',
    domain: 'system',
    description: 'Cross-sphere coordination and priority management.',
    description_fr: 'Coordination inter-sphères et gestion des priorités.',
    avatar: '🔄',
    capabilities: ['cross_sphere_coordination', 'priority_management', 'conflict_resolution', 'overview'],
    personality: 'Équilibré, vue d\'ensemble',
    communication_style: 'Synthétique, objectif',
    base_cost: 30,
    is_system: false,
    is_hireable: true,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// L2 — SPECIALIST AGENTS (150 agents)
// Expertise approfondie dans des domaines spécifiques
// ═══════════════════════════════════════════════════════════════════════════════

export const L2_SPECIALISTS: AgentDefinition[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // CONSTRUCTION DOMAIN (15 agents)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'l2-construction-estimator', name: 'Construction Estimator', name_fr: 'Estimateur Construction', level: 'L2', domain: 'construction', description: 'Cost estimation and budgeting', description_fr: 'Estimation des coûts et budgétisation', avatar: '📊', capabilities: ['cost_estimation', 'material_calculation', 'labor_pricing', 'budget_analysis'], personality: 'Précis, analytique', communication_style: 'Factuel, détaillé', base_cost: 60, is_system: false, is_hireable: true },
  { id: 'l2-construction-scheduler', name: 'Construction Scheduler', name_fr: 'Planificateur Construction', level: 'L2', domain: 'construction', description: 'Project scheduling and timeline', description_fr: 'Planification et échéancier de projet', avatar: '📅', capabilities: ['scheduling', 'timeline_management', 'resource_allocation', 'dependency_tracking'], personality: 'Organisé, prévoyant', communication_style: 'Structuré, précis', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-construction-safety', name: 'Safety Officer', name_fr: 'Agent de Sécurité', level: 'L2', domain: 'construction', description: 'Safety compliance and CNESST', description_fr: 'Conformité sécurité et CNESST', avatar: '⚠️', capabilities: ['safety_audit', 'cnesst_compliance', 'risk_assessment', 'incident_reporting'], personality: 'Vigilant, strict', communication_style: 'Direct, non-négociable', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-construction-materials', name: 'Materials Expert', name_fr: 'Expert Matériaux', level: 'L2', domain: 'construction', description: 'Material selection and procurement', description_fr: 'Sélection et approvisionnement matériaux', avatar: '🧱', capabilities: ['material_selection', 'supplier_management', 'quality_assessment', 'cost_optimization'], personality: 'Expert, pragmatique', communication_style: 'Technique, précis', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-construction-rbq', name: 'RBQ Compliance', name_fr: 'Conformité RBQ', level: 'L2', domain: 'construction', description: 'RBQ regulations and permits', description_fr: 'Réglementations RBQ et permis', avatar: '📋', capabilities: ['rbq_compliance', 'permit_management', 'code_verification', 'inspection_prep'], personality: 'Méticuleux, rigoureux', communication_style: 'Formel, précis', base_cost: 60, is_system: false, is_hireable: true },
  { id: 'l2-construction-ccq', name: 'CCQ Coordinator', name_fr: 'Coordinateur CCQ', level: 'L2', domain: 'construction', description: 'CCQ labor relations and compliance', description_fr: 'Relations de travail CCQ et conformité', avatar: '👷', capabilities: ['ccq_compliance', 'labor_relations', 'union_coordination', 'workforce_planning'], personality: 'Diplomate, équitable', communication_style: 'Professionnel, clair', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-construction-quality', name: 'Quality Inspector', name_fr: 'Inspecteur Qualité', level: 'L2', domain: 'construction', description: 'Quality control and inspection', description_fr: 'Contrôle qualité et inspection', avatar: '🔍', capabilities: ['quality_inspection', 'defect_detection', 'standards_verification', 'reporting'], personality: 'Attentif, exigeant', communication_style: 'Détaillé, objectif', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-construction-architect', name: 'Architectural Liaison', name_fr: 'Liaison Architecturale', level: 'L2', domain: 'construction', description: 'Architect coordination and design review', description_fr: 'Coordination architecte et revue design', avatar: '📐', capabilities: ['design_review', 'architect_coordination', 'blueprint_analysis', 'modification_tracking'], personality: 'Créatif, analytique', communication_style: 'Visuel, technique', base_cost: 60, is_system: false, is_hireable: true },
  { id: 'l2-construction-electrical', name: 'Electrical Specialist', name_fr: 'Spécialiste Électrique', level: 'L2', domain: 'construction', description: 'Electrical systems and compliance', description_fr: 'Systèmes électriques et conformité', avatar: '⚡', capabilities: ['electrical_planning', 'code_compliance', 'load_calculation', 'system_design'], personality: 'Technique, prudent', communication_style: 'Précis, sécuritaire', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-construction-plumbing', name: 'Plumbing Specialist', name_fr: 'Spécialiste Plomberie', level: 'L2', domain: 'construction', description: 'Plumbing systems and compliance', description_fr: 'Systèmes de plomberie et conformité', avatar: '🔧', capabilities: ['plumbing_design', 'code_compliance', 'system_sizing', 'drainage_planning'], personality: 'Pratique, méthodique', communication_style: 'Technique, clair', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-construction-hvac', name: 'HVAC Specialist', name_fr: 'Spécialiste CVAC', level: 'L2', domain: 'construction', description: 'HVAC systems design and efficiency', description_fr: 'Conception systèmes CVAC et efficacité', avatar: '🌡️', capabilities: ['hvac_design', 'energy_efficiency', 'load_calculation', 'system_optimization'], personality: 'Analytique, innovant', communication_style: 'Technique, pédagogique', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-construction-foundation', name: 'Foundation Expert', name_fr: 'Expert Fondations', level: 'L2', domain: 'construction', description: 'Foundation and structural analysis', description_fr: 'Analyse fondations et structure', avatar: '🏗️', capabilities: ['foundation_analysis', 'soil_assessment', 'structural_design', 'load_bearing'], personality: 'Rigoureux, prudent', communication_style: 'Technique, détaillé', base_cost: 65, is_system: false, is_hireable: true },
  { id: 'l2-construction-renovation', name: 'Renovation Specialist', name_fr: 'Spécialiste Rénovation', level: 'L2', domain: 'construction', description: 'Renovation planning and execution', description_fr: 'Planification et exécution rénovation', avatar: '🔨', capabilities: ['renovation_planning', 'heritage_preservation', 'modernization', 'cost_optimization'], personality: 'Créatif, pragmatique', communication_style: 'Inspirant, réaliste', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-construction-contractor', name: 'Contractor Manager', name_fr: 'Gestionnaire Sous-traitants', level: 'L2', domain: 'construction', description: 'Subcontractor coordination', description_fr: 'Coordination des sous-traitants', avatar: '🤝', capabilities: ['contractor_selection', 'bid_analysis', 'performance_tracking', 'dispute_resolution'], personality: 'Négociateur, équitable', communication_style: 'Professionnel, direct', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-construction-green', name: 'Green Building Expert', name_fr: 'Expert Construction Verte', level: 'L2', domain: 'construction', description: 'Sustainable construction and LEED', description_fr: 'Construction durable et LEED', avatar: '🌱', capabilities: ['leed_certification', 'sustainable_materials', 'energy_modeling', 'green_standards'], personality: 'Engagé, innovant', communication_style: 'Inspirant, éducatif', base_cost: 60, is_system: false, is_hireable: true },

  // ─────────────────────────────────────────────────────────────────────────────
  // FINANCE DOMAIN (15 agents)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'l2-finance-analyst', name: 'Financial Analyst', name_fr: 'Analyste Financier', level: 'L2', domain: 'finance', description: 'Financial analysis and forecasting', description_fr: 'Analyse financière et prévisions', avatar: '📈', capabilities: ['financial_analysis', 'forecasting', 'ratio_analysis', 'trend_identification'], personality: 'Analytique, rigoureux', communication_style: 'Factuel, précis', base_cost: 60, is_system: false, is_hireable: true },
  { id: 'l2-finance-budget', name: 'Budget Manager', name_fr: 'Gestionnaire Budget', level: 'L2', domain: 'finance', description: 'Budget planning and tracking', description_fr: 'Planification et suivi budgétaire', avatar: '💰', capabilities: ['budget_planning', 'expense_tracking', 'variance_analysis', 'cost_control'], personality: 'Prudent, organisé', communication_style: 'Clair, structuré', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-finance-tax', name: 'Tax Specialist', name_fr: 'Spécialiste Fiscal', level: 'L2', domain: 'finance', description: 'Tax planning and compliance', description_fr: 'Planification fiscale et conformité', avatar: '📑', capabilities: ['tax_planning', 'deduction_optimization', 'compliance', 'filing_preparation'], personality: 'Méticuleux, à jour', communication_style: 'Précis, légal', base_cost: 65, is_system: false, is_hireable: true },
  { id: 'l2-finance-investment', name: 'Investment Advisor', name_fr: 'Conseiller Investissement', level: 'L2', domain: 'finance', description: 'Investment analysis and portfolio', description_fr: 'Analyse investissement et portefeuille', avatar: '📊', capabilities: ['investment_analysis', 'portfolio_management', 'risk_assessment', 'market_research'], personality: 'Stratégique, prudent', communication_style: 'Équilibré, informatif', base_cost: 70, is_system: false, is_hireable: true },
  { id: 'l2-finance-accounting', name: 'Accounting Expert', name_fr: 'Expert Comptable', level: 'L2', domain: 'finance', description: 'Accounting and bookkeeping', description_fr: 'Comptabilité et tenue de livres', avatar: '📒', capabilities: ['bookkeeping', 'reconciliation', 'financial_statements', 'audit_preparation'], personality: 'Précis, organisé', communication_style: 'Méthodique, détaillé', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-finance-payroll', name: 'Payroll Specialist', name_fr: 'Spécialiste Paie', level: 'L2', domain: 'finance', description: 'Payroll processing and compliance', description_fr: 'Traitement paie et conformité', avatar: '💵', capabilities: ['payroll_processing', 'deduction_management', 'compliance', 'reporting'], personality: 'Rigoureux, fiable', communication_style: 'Précis, confidentiel', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-finance-credit', name: 'Credit Analyst', name_fr: 'Analyste Crédit', level: 'L2', domain: 'finance', description: 'Credit assessment and management', description_fr: 'Évaluation et gestion du crédit', avatar: '💳', capabilities: ['credit_analysis', 'risk_assessment', 'loan_evaluation', 'credit_optimization'], personality: 'Analytique, prudent', communication_style: 'Factuel, objectif', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-finance-insurance', name: 'Insurance Advisor', name_fr: 'Conseiller Assurance', level: 'L2', domain: 'finance', description: 'Insurance planning and claims', description_fr: 'Planification assurance et réclamations', avatar: '🛡️', capabilities: ['coverage_analysis', 'policy_comparison', 'claims_assistance', 'risk_mitigation'], personality: 'Protecteur, détaillé', communication_style: 'Clair, rassurant', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-finance-retirement', name: 'Retirement Planner', name_fr: 'Planificateur Retraite', level: 'L2', domain: 'finance', description: 'Retirement planning and RRSP/TFSA', description_fr: 'Planification retraite et REER/CELI', avatar: '🏖️', capabilities: ['retirement_planning', 'rrsp_optimization', 'pension_analysis', 'income_projection'], personality: 'Prévoyant, rassurant', communication_style: 'Pédagogique, encourageant', base_cost: 60, is_system: false, is_hireable: true },
  { id: 'l2-finance-cashflow', name: 'Cash Flow Manager', name_fr: 'Gestionnaire Trésorerie', level: 'L2', domain: 'finance', description: 'Cash flow optimization', description_fr: 'Optimisation des flux de trésorerie', avatar: '💸', capabilities: ['cash_flow_analysis', 'liquidity_management', 'payment_scheduling', 'forecasting'], personality: 'Vigilant, proactif', communication_style: 'Clair, actionnable', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-finance-grants', name: 'Grants Specialist', name_fr: 'Spécialiste Subventions', level: 'L2', domain: 'finance', description: 'Government grants and subsidies', description_fr: 'Subventions gouvernementales', avatar: '🏦', capabilities: ['grant_identification', 'application_preparation', 'eligibility_assessment', 'compliance'], personality: 'Persévérant, détaillé', communication_style: 'Optimiste, structuré', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-finance-audit', name: 'Internal Auditor', name_fr: 'Auditeur Interne', level: 'L2', domain: 'finance', description: 'Internal audit and controls', description_fr: 'Audit interne et contrôles', avatar: '🔎', capabilities: ['audit_planning', 'control_testing', 'risk_identification', 'recommendation'], personality: 'Objectif, méthodique', communication_style: 'Factuel, constructif', base_cost: 60, is_system: false, is_hireable: true },
  { id: 'l2-finance-procurement', name: 'Procurement Specialist', name_fr: 'Spécialiste Approvisionnement', level: 'L2', domain: 'finance', description: 'Purchasing and vendor management', description_fr: 'Achats et gestion fournisseurs', avatar: '🛒', capabilities: ['vendor_selection', 'negotiation', 'contract_management', 'cost_optimization'], personality: 'Négociateur, stratégique', communication_style: 'Professionnel, direct', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-finance-reporting', name: 'Financial Reporter', name_fr: 'Rapporteur Financier', level: 'L2', domain: 'finance', description: 'Financial reporting and dashboards', description_fr: 'Rapports financiers et tableaux de bord', avatar: '📋', capabilities: ['report_generation', 'dashboard_creation', 'kpi_tracking', 'visualization'], personality: 'Clair, visuel', communication_style: 'Synthétique, visuel', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-finance-crypto', name: 'Crypto Advisor', name_fr: 'Conseiller Crypto', level: 'L2', domain: 'finance', description: 'Cryptocurrency and blockchain', description_fr: 'Cryptomonnaies et blockchain', avatar: '₿', capabilities: ['crypto_analysis', 'wallet_management', 'tax_compliance', 'market_tracking'], personality: 'Innovant, prudent', communication_style: 'Moderne, éducatif', base_cost: 65, is_system: false, is_hireable: true },

  // ─────────────────────────────────────────────────────────────────────────────
  // CREATIVE DOMAIN (15 agents)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'l2-creative-designer', name: 'Graphic Designer', name_fr: 'Designer Graphique', level: 'L2', domain: 'creative', description: 'Visual design and branding', description_fr: 'Design visuel et image de marque', avatar: '🎨', capabilities: ['graphic_design', 'branding', 'layout', 'visual_identity'], personality: 'Créatif, perfectionniste', communication_style: 'Visuel, inspirant', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-creative-writer', name: 'Content Writer', name_fr: 'Rédacteur Contenu', level: 'L2', domain: 'creative', description: 'Content creation and copywriting', description_fr: 'Création de contenu et copywriting', avatar: '✍️', capabilities: ['copywriting', 'content_creation', 'storytelling', 'editing'], personality: 'Créatif, articulé', communication_style: 'Éloquent, engageant', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-creative-video', name: 'Video Producer', name_fr: 'Producteur Vidéo', level: 'L2', domain: 'creative', description: 'Video production and editing', description_fr: 'Production et montage vidéo', avatar: '🎬', capabilities: ['video_production', 'editing', 'storyboarding', 'post_production'], personality: 'Dynamique, attentif', communication_style: 'Visuel, narratif', base_cost: 60, is_system: false, is_hireable: true },
  { id: 'l2-creative-audio', name: 'Audio Engineer', name_fr: 'Ingénieur Audio', level: 'L2', domain: 'creative', description: 'Audio production and sound design', description_fr: 'Production audio et design sonore', avatar: '🎵', capabilities: ['audio_production', 'sound_design', 'mixing', 'mastering'], personality: 'Technique, artistique', communication_style: 'Précis, créatif', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-creative-3d', name: '3D Artist', name_fr: 'Artiste 3D', level: 'L2', domain: 'creative', description: '3D modeling and animation', description_fr: 'Modélisation et animation 3D', avatar: '🎮', capabilities: ['3d_modeling', 'animation', 'rendering', 'texturing'], personality: 'Technique, créatif', communication_style: 'Visuel, détaillé', base_cost: 65, is_system: false, is_hireable: true },
  { id: 'l2-creative-ux', name: 'UX Designer', name_fr: 'Designer UX', level: 'L2', domain: 'creative', description: 'User experience design', description_fr: 'Design d\'expérience utilisateur', avatar: '🖱️', capabilities: ['ux_research', 'wireframing', 'prototyping', 'usability_testing'], personality: 'Empathique, analytique', communication_style: 'Utilisateur-centré, clair', base_cost: 60, is_system: false, is_hireable: true },
  { id: 'l2-creative-ui', name: 'UI Designer', name_fr: 'Designer UI', level: 'L2', domain: 'creative', description: 'User interface design', description_fr: 'Design d\'interface utilisateur', avatar: '📱', capabilities: ['ui_design', 'component_design', 'design_systems', 'responsive_design'], personality: 'Détaillé, cohérent', communication_style: 'Visuel, structuré', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-creative-photo', name: 'Photographer', name_fr: 'Photographe', level: 'L2', domain: 'creative', description: 'Photography and image editing', description_fr: 'Photographie et retouche image', avatar: '📷', capabilities: ['photography', 'photo_editing', 'composition', 'lighting'], personality: 'Observateur, artistique', communication_style: 'Visuel, patient', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-creative-illustration', name: 'Illustrator', name_fr: 'Illustrateur', level: 'L2', domain: 'creative', description: 'Illustration and concept art', description_fr: 'Illustration et concept art', avatar: '🖌️', capabilities: ['illustration', 'concept_art', 'character_design', 'digital_painting'], personality: 'Imaginatif, expressif', communication_style: 'Visuel, narratif', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-creative-motion', name: 'Motion Designer', name_fr: 'Designer Motion', level: 'L2', domain: 'creative', description: 'Motion graphics and animation', description_fr: 'Motion graphics et animation', avatar: '✨', capabilities: ['motion_graphics', 'animation', 'visual_effects', 'kinetic_typography'], personality: 'Dynamique, précis', communication_style: 'Visuel, énergique', base_cost: 60, is_system: false, is_hireable: true },
  { id: 'l2-creative-brand', name: 'Brand Strategist', name_fr: 'Stratège de Marque', level: 'L2', domain: 'creative', description: 'Brand strategy and positioning', description_fr: 'Stratégie et positionnement de marque', avatar: '🎯', capabilities: ['brand_strategy', 'positioning', 'messaging', 'brand_guidelines'], personality: 'Stratégique, visionnaire', communication_style: 'Persuasif, clair', base_cost: 65, is_system: false, is_hireable: true },
  { id: 'l2-creative-social', name: 'Social Media Creator', name_fr: 'Créateur Médias Sociaux', level: 'L2', domain: 'creative', description: 'Social media content creation', description_fr: 'Création contenu médias sociaux', avatar: '📲', capabilities: ['social_content', 'trend_analysis', 'engagement_strategy', 'platform_optimization'], personality: 'Tendance, créatif', communication_style: 'Moderne, engageant', base_cost: 45, is_system: false, is_hireable: true },
  { id: 'l2-creative-music', name: 'Music Composer', name_fr: 'Compositeur Musical', level: 'L2', domain: 'creative', description: 'Music composition and arrangement', description_fr: 'Composition et arrangement musical', avatar: '🎼', capabilities: ['composition', 'arrangement', 'scoring', 'music_production'], personality: 'Artistique, émotionnel', communication_style: 'Expressif, technique', base_cost: 60, is_system: false, is_hireable: true },
  { id: 'l2-creative-ar', name: 'AR/VR Designer', name_fr: 'Designer AR/VR', level: 'L2', domain: 'creative', description: 'Augmented and virtual reality', description_fr: 'Réalité augmentée et virtuelle', avatar: '🥽', capabilities: ['ar_design', 'vr_experience', 'spatial_design', 'immersive_content'], personality: 'Innovant, expérimentateur', communication_style: 'Immersif, technique', base_cost: 70, is_system: false, is_hireable: true },
  { id: 'l2-creative-game', name: 'Game Designer', name_fr: 'Designer Jeux', level: 'L2', domain: 'creative', description: 'Game design and mechanics', description_fr: 'Design de jeux et mécaniques', avatar: '🎲', capabilities: ['game_design', 'mechanics_design', 'level_design', 'balancing'], personality: 'Ludique, analytique', communication_style: 'Engageant, stratégique', base_cost: 60, is_system: false, is_hireable: true },

  // ─────────────────────────────────────────────────────────────────────────────
  // IMMOBILIER DOMAIN (12 agents)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'l2-immo-property-manager', name: 'Property Manager', name_fr: 'Gestionnaire Immobilier', level: 'L2', domain: 'immobilier', description: 'Property oversight and management', description_fr: 'Supervision et gestion immobilière', avatar: '🏠', capabilities: ['property_oversight', 'document_management', 'value_tracking', 'deadline_management'], personality: 'Méticuleux, proactif', communication_style: 'Professionnel, clair', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-immo-maintenance', name: 'Maintenance Coordinator', name_fr: 'Coordonnateur Maintenance', level: 'L2', domain: 'immobilier', description: 'Maintenance scheduling and coordination', description_fr: 'Planification et coordination maintenance', avatar: '🔧', capabilities: ['maintenance_scheduling', 'contractor_coordination', 'warranty_tracking', 'preventive_maintenance'], personality: 'Efficace, systématique', communication_style: 'Technique, clair', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-immo-renovation', name: 'Renovation Advisor', name_fr: 'Conseiller Rénovation', level: 'L2', domain: 'immobilier', description: 'Renovation planning and ROI analysis', description_fr: 'Planification rénovation et analyse ROI', avatar: '🏗️', capabilities: ['renovation_planning', 'permit_identification', 'roi_analysis', 'contractor_recommendation'], personality: 'Créatif, pragmatique', communication_style: 'Inspirant, réaliste', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-immo-tenant', name: 'Tenant Communication', name_fr: 'Communication Locataires', level: 'L2', domain: 'immobilier', description: 'Tenant relations and communication', description_fr: 'Relations et communication locataires', avatar: '🗣️', capabilities: ['tenant_communication', 'lease_support', 'complaint_handling', 'community_management'], personality: 'Diplomatique, empathique', communication_style: 'Chaleureux, professionnel', base_cost: 45, is_system: false, is_hireable: true },
  { id: 'l2-immo-lease', name: 'Lease Specialist', name_fr: 'Spécialiste Baux', level: 'L2', domain: 'immobilier', description: 'Lease management and compliance', description_fr: 'Gestion des baux et conformité', avatar: '📄', capabilities: ['lease_management', 'contract_review', 'renewal_tracking', 'legal_compliance'], personality: 'Détaillé, rigoureux', communication_style: 'Précis, formel', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-immo-valuation', name: 'Property Valuator', name_fr: 'Évaluateur Immobilier', level: 'L2', domain: 'immobilier', description: 'Property valuation and market analysis', description_fr: 'Évaluation immobilière et analyse marché', avatar: '💲', capabilities: ['property_valuation', 'market_analysis', 'comparable_analysis', 'trend_forecasting'], personality: 'Analytique, objectif', communication_style: 'Factuel, détaillé', base_cost: 60, is_system: false, is_hireable: true },
  { id: 'l2-immo-insurance', name: 'Property Insurance', name_fr: 'Assurance Immobilière', level: 'L2', domain: 'immobilier', description: 'Property insurance management', description_fr: 'Gestion assurance immobilière', avatar: '🛡️', capabilities: ['insurance_management', 'claims_processing', 'coverage_optimization', 'risk_assessment'], personality: 'Protecteur, détaillé', communication_style: 'Rassurant, précis', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-immo-tax', name: 'Property Tax Specialist', name_fr: 'Spécialiste Taxes Foncières', level: 'L2', domain: 'immobilier', description: 'Property tax optimization', description_fr: 'Optimisation taxes foncières', avatar: '🏛️', capabilities: ['tax_assessment_review', 'appeal_preparation', 'exemption_identification', 'payment_scheduling'], personality: 'Méticuleux, stratégique', communication_style: 'Technique, clair', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-immo-mortgage', name: 'Mortgage Advisor', name_fr: 'Conseiller Hypothécaire', level: 'L2', domain: 'immobilier', description: 'Mortgage planning and optimization', description_fr: 'Planification et optimisation hypothécaire', avatar: '🏦', capabilities: ['mortgage_analysis', 'refinancing_evaluation', 'amortization_optimization', 'lender_comparison'], personality: 'Analytique, patient', communication_style: 'Pédagogique, rassurant', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-immo-inspection', name: 'Inspection Coordinator', name_fr: 'Coordonnateur Inspections', level: 'L2', domain: 'immobilier', description: 'Property inspection management', description_fr: 'Gestion des inspections immobilières', avatar: '🔍', capabilities: ['inspection_scheduling', 'report_analysis', 'defect_tracking', 'compliance_verification'], personality: 'Attentif, méthodique', communication_style: 'Détaillé, objectif', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-immo-utilities', name: 'Utilities Manager', name_fr: 'Gestionnaire Services', level: 'L2', domain: 'immobilier', description: 'Utility management and optimization', description_fr: 'Gestion et optimisation services publics', avatar: '💡', capabilities: ['utility_tracking', 'consumption_analysis', 'provider_comparison', 'efficiency_recommendations'], personality: 'Économe, analytique', communication_style: 'Pratique, clair', base_cost: 45, is_system: false, is_hireable: true },
  { id: 'l2-immo-portfolio', name: 'Portfolio Analyst', name_fr: 'Analyste Portefeuille', level: 'L2', domain: 'immobilier', description: 'Real estate portfolio analysis', description_fr: 'Analyse portefeuille immobilier', avatar: '📊', capabilities: ['portfolio_analysis', 'performance_tracking', 'diversification_strategy', 'roi_optimization'], personality: 'Stratégique, analytique', communication_style: 'Synthétique, visuel', base_cost: 60, is_system: false, is_hireable: true },

  // ─────────────────────────────────────────────────────────────────────────────
  // LEGAL DOMAIN (10 agents)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'l2-legal-contract', name: 'Contract Specialist', name_fr: 'Spécialiste Contrats', level: 'L2', domain: 'legal', description: 'Contract review and drafting', description_fr: 'Révision et rédaction de contrats', avatar: '📝', capabilities: ['contract_review', 'drafting', 'negotiation_support', 'risk_identification'], personality: 'Méticuleux, prudent', communication_style: 'Précis, légal', base_cost: 65, is_system: false, is_hireable: true },
  { id: 'l2-legal-compliance', name: 'Compliance Officer', name_fr: 'Agent Conformité', level: 'L2', domain: 'legal', description: 'Regulatory compliance management', description_fr: 'Gestion conformité réglementaire', avatar: '⚖️', capabilities: ['compliance_monitoring', 'policy_development', 'audit_preparation', 'training'], personality: 'Rigoureux, à jour', communication_style: 'Formel, éducatif', base_cost: 60, is_system: false, is_hireable: true },
  { id: 'l2-legal-ip', name: 'IP Specialist', name_fr: 'Spécialiste PI', level: 'L2', domain: 'legal', description: 'Intellectual property protection', description_fr: 'Protection propriété intellectuelle', avatar: '©️', capabilities: ['ip_protection', 'trademark_management', 'patent_support', 'copyright_compliance'], personality: 'Protecteur, vigilant', communication_style: 'Technique, précis', base_cost: 70, is_system: false, is_hireable: true },
  { id: 'l2-legal-privacy', name: 'Privacy Officer', name_fr: 'Agent Protection Données', level: 'L2', domain: 'legal', description: 'Data privacy and GDPR compliance', description_fr: 'Protection données et conformité', avatar: '🔒', capabilities: ['privacy_compliance', 'gdpr_management', 'data_protection', 'policy_implementation'], personality: 'Vigilant, méthodique', communication_style: 'Clair, sécuritaire', base_cost: 60, is_system: false, is_hireable: true },
  { id: 'l2-legal-corporate', name: 'Corporate Legal', name_fr: 'Juridique Entreprise', level: 'L2', domain: 'legal', description: 'Corporate legal matters', description_fr: 'Affaires juridiques entreprise', avatar: '🏢', capabilities: ['corporate_governance', 'shareholder_matters', 'regulatory_filings', 'board_support'], personality: 'Professionnel, discret', communication_style: 'Formel, confidentiel', base_cost: 70, is_system: false, is_hireable: true },
  { id: 'l2-legal-employment', name: 'Employment Law', name_fr: 'Droit du Travail', level: 'L2', domain: 'legal', description: 'Employment law compliance', description_fr: 'Conformité droit du travail', avatar: '👔', capabilities: ['employment_compliance', 'policy_review', 'dispute_support', 'hr_legal_guidance'], personality: 'Équitable, protecteur', communication_style: 'Clair, équilibré', base_cost: 60, is_system: false, is_hireable: true },
  { id: 'l2-legal-tax', name: 'Tax Law Specialist', name_fr: 'Spécialiste Droit Fiscal', level: 'L2', domain: 'legal', description: 'Tax law and planning', description_fr: 'Droit fiscal et planification', avatar: '📊', capabilities: ['tax_law', 'structure_optimization', 'dispute_resolution', 'international_tax'], personality: 'Analytique, stratégique', communication_style: 'Technique, précis', base_cost: 70, is_system: false, is_hireable: true },
  { id: 'l2-legal-dispute', name: 'Dispute Resolution', name_fr: 'Résolution Litiges', level: 'L2', domain: 'legal', description: 'Dispute resolution and mediation', description_fr: 'Résolution de litiges et médiation', avatar: '🤝', capabilities: ['dispute_analysis', 'mediation_support', 'negotiation_strategy', 'settlement_evaluation'], personality: 'Diplomate, patient', communication_style: 'Calme, objectif', base_cost: 65, is_system: false, is_hireable: true },
  { id: 'l2-legal-real-estate', name: 'Real Estate Legal', name_fr: 'Juridique Immobilier', level: 'L2', domain: 'legal', description: 'Real estate legal matters', description_fr: 'Affaires juridiques immobilières', avatar: '🏡', capabilities: ['property_transactions', 'title_review', 'zoning_compliance', 'lease_legal'], personality: 'Méticuleux, protecteur', communication_style: 'Précis, rassurant', base_cost: 65, is_system: false, is_hireable: true },
  { id: 'l2-legal-notary', name: 'Notary Liaison', name_fr: 'Liaison Notaire', level: 'L2', domain: 'legal', description: 'Notary coordination and documents', description_fr: 'Coordination notaire et documents', avatar: '✒️', capabilities: ['notary_coordination', 'document_preparation', 'authentication_support', 'will_estate'], personality: 'Formel, fiable', communication_style: 'Officiel, précis', base_cost: 55, is_system: false, is_hireable: true },

  // ─────────────────────────────────────────────────────────────────────────────
  // HEALTH DOMAIN (10 agents)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'l2-health-wellness', name: 'Wellness Coach', name_fr: 'Coach Bien-être', level: 'L2', domain: 'health', description: 'Wellness and lifestyle guidance', description_fr: 'Guidance bien-être et style de vie', avatar: '🧘', capabilities: ['wellness_planning', 'habit_tracking', 'stress_management', 'lifestyle_optimization'], personality: 'Encourageant, holistique', communication_style: 'Motivant, bienveillant', base_cost: 45, is_system: false, is_hireable: true },
  { id: 'l2-health-nutrition', name: 'Nutrition Advisor', name_fr: 'Conseiller Nutrition', level: 'L2', domain: 'health', description: 'Nutrition guidance and meal planning', description_fr: 'Conseils nutrition et planification repas', avatar: '🥗', capabilities: ['meal_planning', 'nutrition_tracking', 'dietary_guidance', 'recipe_suggestions'], personality: 'Informatif, encourageant', communication_style: 'Pratique, motivant', base_cost: 45, is_system: false, is_hireable: true },
  { id: 'l2-health-fitness', name: 'Fitness Coach', name_fr: 'Coach Fitness', level: 'L2', domain: 'health', description: 'Fitness planning and tracking', description_fr: 'Planification et suivi fitness', avatar: '💪', capabilities: ['workout_planning', 'progress_tracking', 'form_guidance', 'goal_setting'], personality: 'Motivant, énergique', communication_style: 'Encourageant, direct', base_cost: 45, is_system: false, is_hireable: true },
  { id: 'l2-health-sleep', name: 'Sleep Specialist', name_fr: 'Spécialiste Sommeil', level: 'L2', domain: 'health', description: 'Sleep optimization and tracking', description_fr: 'Optimisation et suivi sommeil', avatar: '😴', capabilities: ['sleep_tracking', 'routine_optimization', 'environment_advice', 'habit_formation'], personality: 'Calme, patient', communication_style: 'Doux, pédagogique', base_cost: 45, is_system: false, is_hireable: true },
  { id: 'l2-health-mental', name: 'Mental Health Support', name_fr: 'Support Santé Mentale', level: 'L2', domain: 'health', description: 'Mental wellness support', description_fr: 'Support bien-être mental', avatar: '🧠', capabilities: ['mood_tracking', 'coping_strategies', 'mindfulness_guidance', 'resource_connection'], personality: 'Empathique, supportif', communication_style: 'Chaleureux, sans jugement', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-health-medical', name: 'Medical Coordinator', name_fr: 'Coordonnateur Médical', level: 'L2', domain: 'health', description: 'Medical appointment and record management', description_fr: 'Gestion rendez-vous et dossiers médicaux', avatar: '🏥', capabilities: ['appointment_management', 'record_organization', 'medication_tracking', 'provider_coordination'], personality: 'Organisé, discret', communication_style: 'Confidentiel, précis', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-health-preventive', name: 'Preventive Health', name_fr: 'Santé Préventive', level: 'L2', domain: 'health', description: 'Preventive care and screening reminders', description_fr: 'Soins préventifs et rappels dépistage', avatar: '🩺', capabilities: ['screening_reminders', 'preventive_guidance', 'risk_assessment', 'health_education'], personality: 'Proactif, informatif', communication_style: 'Éducatif, encourageant', base_cost: 45, is_system: false, is_hireable: true },
  { id: 'l2-health-medication', name: 'Medication Manager', name_fr: 'Gestionnaire Médicaments', level: 'L2', domain: 'health', description: 'Medication tracking and reminders', description_fr: 'Suivi médicaments et rappels', avatar: '💊', capabilities: ['medication_tracking', 'reminder_management', 'interaction_checking', 'refill_alerts'], personality: 'Vigilant, fiable', communication_style: 'Précis, rassurant', base_cost: 45, is_system: false, is_hireable: true },
  { id: 'l2-health-insurance', name: 'Health Insurance Navigator', name_fr: 'Navigateur Assurance Santé', level: 'L2', domain: 'health', description: 'Health insurance and RAMQ navigation', description_fr: 'Navigation assurance santé et RAMQ', avatar: '📋', capabilities: ['coverage_analysis', 'claim_assistance', 'provider_search', 'ramq_navigation'], personality: 'Patient, détaillé', communication_style: 'Clair, supportif', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-health-family', name: 'Family Health Coordinator', name_fr: 'Coordonnateur Santé Famille', level: 'L2', domain: 'health', description: 'Family health management', description_fr: 'Gestion santé familiale', avatar: '👨‍👩‍👧', capabilities: ['family_health_tracking', 'vaccination_schedules', 'pediatric_reminders', 'elder_care_support'], personality: 'Attentionné, organisé', communication_style: 'Chaleureux, pratique', base_cost: 50, is_system: false, is_hireable: true },

  // ─────────────────────────────────────────────────────────────────────────────
  // COMMUNICATION DOMAIN (10 agents)
  // ─────────────────────────────────────────────────────────────────────────────
  { id: 'l2-comm-email', name: 'Email Manager', name_fr: 'Gestionnaire Courriel', level: 'L2', domain: 'communication', description: 'Email management and drafting', description_fr: 'Gestion et rédaction courriel', avatar: '📧', capabilities: ['email_drafting', 'inbox_management', 'follow_up_tracking', 'template_creation'], personality: 'Efficace, professionnel', communication_style: 'Clair, adaptatif', base_cost: 40, is_system: false, is_hireable: true },
  { id: 'l2-comm-meeting', name: 'Meeting Facilitator', name_fr: 'Facilitateur Réunions', level: 'L2', domain: 'communication', description: 'Meeting planning and facilitation', description_fr: 'Planification et facilitation réunions', avatar: '📅', capabilities: ['meeting_scheduling', 'agenda_creation', 'notes_taking', 'action_tracking'], personality: 'Organisé, facilitateur', communication_style: 'Structuré, inclusif', base_cost: 45, is_system: false, is_hireable: true },
  { id: 'l2-comm-presentation', name: 'Presentation Coach', name_fr: 'Coach Présentation', level: 'L2', domain: 'communication', description: 'Presentation creation and coaching', description_fr: 'Création et coaching présentation', avatar: '🎤', capabilities: ['presentation_design', 'speech_coaching', 'visual_storytelling', 'audience_engagement'], personality: 'Dynamique, encourageant', communication_style: 'Engageant, constructif', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-comm-translation', name: 'Translation Specialist', name_fr: 'Spécialiste Traduction', level: 'L2', domain: 'communication', description: 'Translation and localization', description_fr: 'Traduction et localisation', avatar: '🌐', capabilities: ['translation', 'localization', 'cultural_adaptation', 'terminology_management'], personality: 'Précis, culturellement sensible', communication_style: 'Fidèle, adaptatif', base_cost: 50, is_system: false, is_hireable: true },
  { id: 'l2-comm-pr', name: 'PR Specialist', name_fr: 'Spécialiste RP', level: 'L2', domain: 'communication', description: 'Public relations and media', description_fr: 'Relations publiques et médias', avatar: '📰', capabilities: ['press_releases', 'media_relations', 'crisis_communication', 'reputation_management'], personality: 'Stratégique, réactif', communication_style: 'Professionnel, mesuré', base_cost: 60, is_system: false, is_hireable: true },
  { id: 'l2-comm-internal', name: 'Internal Communications', name_fr: 'Communications Internes', level: 'L2', domain: 'communication', description: 'Internal company communications', description_fr: 'Communications internes entreprise', avatar: '📢', capabilities: ['internal_messaging', 'newsletter_creation', 'policy_communication', 'engagement_initiatives'], personality: 'Inclusif, clair', communication_style: 'Accessible, engageant', base_cost: 45, is_system: false, is_hireable: true },
  { id: 'l2-comm-customer', name: 'Customer Communications', name_fr: 'Communications Client', level: 'L2', domain: 'communication', description: 'Customer communication management', description_fr: 'Gestion communications client', avatar: '💬', capabilities: ['customer_correspondence', 'response_templates', 'tone_management', 'satisfaction_follow_up'], personality: 'Empathique, résolutif', communication_style: 'Client-centré, professionnel', base_cost: 45, is_system: false, is_hireable: true },
  { id: 'l2-comm-technical', name: 'Technical Writer', name_fr: 'Rédacteur Technique', level: 'L2', domain: 'communication', description: 'Technical documentation', description_fr: 'Documentation technique', avatar: '📖', capabilities: ['technical_writing', 'documentation', 'user_guides', 'api_documentation'], personality: 'Précis, pédagogique', communication_style: 'Clair, structuré', base_cost: 55, is_system: false, is_hireable: true },
  { id: 'l2-comm-speech', name: 'Speechwriter', name_fr: 'Rédacteur Discours', level: 'L2', domain: 'communication', description: 'Speech and keynote writing', description_fr: 'Rédaction discours et allocutions', avatar: '🎙️', capabilities: ['speech_writing', 'keynote_creation', 'talking_points', 'message_crafting'], personality: 'Éloquent, stratégique', communication_style: 'Persuasif, inspirant', base_cost: 60, is_system: false, is_hireable: true },
  { id: 'l2-comm-crisis', name: 'Crisis Communications', name_fr: 'Communications de Crise', level: 'L2', domain: 'communication', description: 'Crisis communication management', description_fr: 'Gestion communications de crise', avatar: '🚨', capabilities: ['crisis_response', 'stakeholder_communication', 'message_control', 'reputation_protection'], personality: 'Calme, décisif', communication_style: 'Mesuré, autoritaire', base_cost: 70, is_system: false, is_hireable: true },

  // Additional specialists to reach ~150 (abbreviated for space)
  // ... more agents would be added here to reach the full 150 L2 specialists
];

// ═══════════════════════════════════════════════════════════════════════════════
// L3 — TASK AGENTS (60 agents)
// Assistants focalisés pour des opérations spécifiques
// ═══════════════════════════════════════════════════════════════════════════════

export const L3_TASK_AGENTS: AgentDefinition[] = [
  // Document & File Tasks
  { id: 'l3-document-creator', name: 'Document Creator', name_fr: 'Créateur Documents', level: 'L3', domain: 'system', description: 'Creates formatted documents', description_fr: 'Crée des documents formatés', avatar: '📄', capabilities: ['document_creation', 'formatting', 'template_use'], personality: 'Précis', communication_style: 'Fonctionnel', base_cost: 20, is_system: false, is_hireable: true },
  { id: 'l3-file-organizer', name: 'File Organizer', name_fr: 'Organisateur Fichiers', level: 'L3', domain: 'system', description: 'Organizes and categorizes files', description_fr: 'Organise et catégorise les fichiers', avatar: '📁', capabilities: ['file_organization', 'categorization', 'tagging'], personality: 'Méthodique', communication_style: 'Efficace', base_cost: 15, is_system: false, is_hireable: true },
  { id: 'l3-pdf-processor', name: 'PDF Processor', name_fr: 'Processeur PDF', level: 'L3', domain: 'system', description: 'Processes and extracts PDF content', description_fr: 'Traite et extrait contenu PDF', avatar: '📑', capabilities: ['pdf_extraction', 'ocr', 'conversion'], personality: 'Technique', communication_style: 'Précis', base_cost: 20, is_system: false, is_hireable: true },
  { id: 'l3-spreadsheet', name: 'Spreadsheet Assistant', name_fr: 'Assistant Tableur', level: 'L3', domain: 'system', description: 'Creates and manages spreadsheets', description_fr: 'Crée et gère les tableurs', avatar: '📊', capabilities: ['spreadsheet_creation', 'formula_building', 'data_organization'], personality: 'Analytique', communication_style: 'Structuré', base_cost: 20, is_system: false, is_hireable: true },

  // Research & Analysis Tasks
  { id: 'l3-research-assistant', name: 'Research Assistant', name_fr: 'Assistant Recherche', level: 'L3', domain: 'system', description: 'Conducts research and summarizes', description_fr: 'Effectue recherches et résumés', avatar: '🔍', capabilities: ['research', 'summarization', 'source_evaluation'], personality: 'Curieux', communication_style: 'Informatif', base_cost: 25, is_system: false, is_hireable: true },
  { id: 'l3-data-entry', name: 'Data Entry', name_fr: 'Saisie Données', level: 'L3', domain: 'system', description: 'Accurate data entry and verification', description_fr: 'Saisie et vérification données', avatar: '⌨️', capabilities: ['data_entry', 'verification', 'cleanup'], personality: 'Précis', communication_style: 'Méthodique', base_cost: 15, is_system: false, is_hireable: true },
  { id: 'l3-comparison', name: 'Comparison Analyst', name_fr: 'Analyste Comparaison', level: 'L3', domain: 'system', description: 'Compares options and products', description_fr: 'Compare options et produits', avatar: '⚖️', capabilities: ['comparison_analysis', 'pros_cons', 'recommendation'], personality: 'Objectif', communication_style: 'Équilibré', base_cost: 20, is_system: false, is_hireable: true },

  // Scheduling & Planning Tasks
  { id: 'l3-scheduler', name: 'Scheduler', name_fr: 'Planificateur', level: 'L3', domain: 'system', description: 'Schedules appointments and events', description_fr: 'Planifie rendez-vous et événements', avatar: '📅', capabilities: ['scheduling', 'conflict_detection', 'reminder_setting'], personality: 'Organisé', communication_style: 'Clair', base_cost: 15, is_system: false, is_hireable: true },
  { id: 'l3-reminder', name: 'Reminder Agent', name_fr: 'Agent Rappels', level: 'L3', domain: 'system', description: 'Sets and manages reminders', description_fr: 'Configure et gère les rappels', avatar: '⏰', capabilities: ['reminder_creation', 'follow_up', 'notification'], personality: 'Fiable', communication_style: 'Ponctuel', base_cost: 10, is_system: false, is_hireable: true },
  { id: 'l3-deadline-tracker', name: 'Deadline Tracker', name_fr: 'Suivi Échéances', level: 'L3', domain: 'system', description: 'Tracks and alerts on deadlines', description_fr: 'Suit et alerte sur les échéances', avatar: '🎯', capabilities: ['deadline_tracking', 'priority_sorting', 'alert_management'], personality: 'Vigilant', communication_style: 'Urgent quand nécessaire', base_cost: 15, is_system: false, is_hireable: true },

  // Communication Tasks
  { id: 'l3-email-drafter', name: 'Email Drafter', name_fr: 'Rédacteur Courriel', level: 'L3', domain: 'communication', description: 'Drafts professional emails', description_fr: 'Rédige courriels professionnels', avatar: '✉️', capabilities: ['email_drafting', 'tone_adjustment', 'follow_up'], personality: 'Professionnel', communication_style: 'Adaptatif', base_cost: 15, is_system: false, is_hireable: true },
  { id: 'l3-message-summarizer', name: 'Message Summarizer', name_fr: 'Résumeur Messages', level: 'L3', domain: 'communication', description: 'Summarizes long messages/threads', description_fr: 'Résume messages/fils longs', avatar: '📝', capabilities: ['summarization', 'key_point_extraction', 'action_identification'], personality: 'Concis', communication_style: 'Synthétique', base_cost: 15, is_system: false, is_hireable: true },
  { id: 'l3-translator', name: 'Quick Translator', name_fr: 'Traducteur Rapide', level: 'L3', domain: 'communication', description: 'Quick translation between languages', description_fr: 'Traduction rapide entre langues', avatar: '🌍', capabilities: ['translation', 'language_detection', 'context_preservation'], personality: 'Précis', communication_style: 'Fidèle', base_cost: 20, is_system: false, is_hireable: true },

  // Calculation Tasks
  { id: 'l3-calculator', name: 'Calculator', name_fr: 'Calculateur', level: 'L3', domain: 'finance', description: 'Performs calculations', description_fr: 'Effectue des calculs', avatar: '🧮', capabilities: ['calculation', 'conversion', 'formula_application'], personality: 'Précis', communication_style: 'Factuel', base_cost: 10, is_system: false, is_hireable: true },
  { id: 'l3-unit-converter', name: 'Unit Converter', name_fr: 'Convertisseur Unités', level: 'L3', domain: 'system', description: 'Converts between units', description_fr: 'Convertit entre unités', avatar: '📐', capabilities: ['unit_conversion', 'currency_conversion', 'measurement'], personality: 'Exact', communication_style: 'Direct', base_cost: 10, is_system: false, is_hireable: true },
  { id: 'l3-expense-tracker', name: 'Expense Tracker', name_fr: 'Suivi Dépenses', level: 'L3', domain: 'finance', description: 'Tracks and categorizes expenses', description_fr: 'Suit et catégorise les dépenses', avatar: '💳', capabilities: ['expense_logging', 'categorization', 'reporting'], personality: 'Méticuleux', communication_style: 'Clair', base_cost: 15, is_system: false, is_hireable: true },

  // Creative Tasks
  { id: 'l3-image-describer', name: 'Image Describer', name_fr: 'Descripteur Images', level: 'L3', domain: 'creative', description: 'Describes and analyzes images', description_fr: 'Décrit et analyse les images', avatar: '🖼️', capabilities: ['image_description', 'content_analysis', 'accessibility'], personality: 'Observateur', communication_style: 'Détaillé', base_cost: 15, is_system: false, is_hireable: true },
  { id: 'l3-proofreader', name: 'Proofreader', name_fr: 'Correcteur', level: 'L3', domain: 'creative', description: 'Proofreads and corrects text', description_fr: 'Relit et corrige le texte', avatar: '✓', capabilities: ['proofreading', 'grammar_check', 'style_consistency'], personality: 'Attentif', communication_style: 'Constructif', base_cost: 15, is_system: false, is_hireable: true },
  { id: 'l3-name-generator', name: 'Name Generator', name_fr: 'Générateur Noms', level: 'L3', domain: 'creative', description: 'Generates names and titles', description_fr: 'Génère noms et titres', avatar: '💡', capabilities: ['name_generation', 'brainstorming', 'availability_check'], personality: 'Créatif', communication_style: 'Inspirant', base_cost: 15, is_system: false, is_hireable: true },

  // Construction Tasks
  { id: 'l3-quote-analyzer', name: 'Quote Analyzer', name_fr: 'Analyseur Soumissions', level: 'L3', domain: 'construction', description: 'Analyzes contractor quotes', description_fr: 'Analyse soumissions entrepreneurs', avatar: '📋', capabilities: ['quote_comparison', 'cost_breakdown', 'value_assessment'], personality: 'Analytique', communication_style: 'Objectif', base_cost: 25, is_system: false, is_hireable: true },
  { id: 'l3-material-calculator', name: 'Material Calculator', name_fr: 'Calculateur Matériaux', level: 'L3', domain: 'construction', description: 'Calculates material quantities', description_fr: 'Calcule quantités matériaux', avatar: '🧱', capabilities: ['quantity_calculation', 'waste_estimation', 'cost_projection'], personality: 'Précis', communication_style: 'Technique', base_cost: 20, is_system: false, is_hireable: true },
  { id: 'l3-permit-checker', name: 'Permit Checker', name_fr: 'Vérificateur Permis', level: 'L3', domain: 'construction', description: 'Checks permit requirements', description_fr: 'Vérifie exigences de permis', avatar: '📜', capabilities: ['permit_identification', 'requirement_listing', 'timeline_estimation'], personality: 'Rigoureux', communication_style: 'Clair', base_cost: 20, is_system: false, is_hireable: true },

  // Immobilier Tasks
  { id: 'l3-rent-calculator', name: 'Rent Calculator', name_fr: 'Calculateur Loyer', level: 'L3', domain: 'immobilier', description: 'Calculates rent and increases', description_fr: 'Calcule loyer et augmentations', avatar: '🏠', capabilities: ['rent_calculation', 'tal_compliance', 'increase_projection'], personality: 'Exact', communication_style: 'Légal', base_cost: 20, is_system: false, is_hireable: true },
  { id: 'l3-lease-reminder', name: 'Lease Reminder', name_fr: 'Rappel Baux', level: 'L3', domain: 'immobilier', description: 'Tracks lease dates and renewals', description_fr: 'Suit dates baux et renouvellements', avatar: '📅', capabilities: ['lease_tracking', 'renewal_alerts', 'deadline_management'], personality: 'Vigilant', communication_style: 'Ponctuel', base_cost: 15, is_system: false, is_hireable: true },
  { id: 'l3-inspection-reporter', name: 'Inspection Reporter', name_fr: 'Rapporteur Inspection', level: 'L3', domain: 'immobilier', description: 'Creates inspection reports', description_fr: 'Crée rapports d\'inspection', avatar: '🔍', capabilities: ['report_creation', 'photo_organization', 'defect_documentation'], personality: 'Détaillé', communication_style: 'Objectif', base_cost: 20, is_system: false, is_hireable: true },

  // Finance Tasks  
  { id: 'l3-receipt-scanner', name: 'Receipt Scanner', name_fr: 'Scanneur Reçus', level: 'L3', domain: 'finance', description: 'Scans and categorizes receipts', description_fr: 'Numérise et catégorise reçus', avatar: '🧾', capabilities: ['receipt_scanning', 'data_extraction', 'categorization'], personality: 'Méticuleux', communication_style: 'Efficace', base_cost: 15, is_system: false, is_hireable: true },
  { id: 'l3-invoice-creator', name: 'Invoice Creator', name_fr: 'Créateur Factures', level: 'L3', domain: 'finance', description: 'Creates professional invoices', description_fr: 'Crée factures professionnelles', avatar: '📃', capabilities: ['invoice_creation', 'calculation', 'formatting'], personality: 'Professionnel', communication_style: 'Formel', base_cost: 20, is_system: false, is_hireable: true },
  { id: 'l3-payment-reminder', name: 'Payment Reminder', name_fr: 'Rappel Paiements', level: 'L3', domain: 'finance', description: 'Tracks and reminds payments', description_fr: 'Suit et rappelle paiements', avatar: '💰', capabilities: ['payment_tracking', 'reminder_sending', 'overdue_alerts'], personality: 'Persistant', communication_style: 'Professionnel', base_cost: 15, is_system: false, is_hireable: true },

  // More L3 task agents would continue here...
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLETE CATALOG
// ═══════════════════════════════════════════════════════════════════════════════

export const ALL_AGENTS: AgentDefinition[] = [
  ...L0_SYSTEM_AGENTS,
  ...L1_DIRECTORS,
  ...L2_SPECIALISTS,
  ...L3_TASK_AGENTS,
];

// ═══════════════════════════════════════════════════════════════════════════════
// STATS & HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export const AGENT_STATS = {
  // Current implementation: 131 agents
  // Target: 226 agents (will be expanded when complete list is finalized)
  total: ALL_AGENTS.length,
  target: 226,
  by_level: {
    L0: L0_SYSTEM_AGENTS.length,  // 6 system agents (not hireable)
    L1: L1_DIRECTORS.length,       // 10 domain directors
    L2: L2_SPECIALISTS.length,     // ~87 specialists (target: 150)
    L3: L3_TASK_AGENTS.length,     // ~28 task agents (target: 60)
  },
  hireable: ALL_AGENTS.filter(a => a.is_hireable).length,
  system: ALL_AGENTS.filter(a => a.is_system).length,
};

export function getAgentsByLevel(level: AgentLevel): AgentDefinition[] {
  return ALL_AGENTS.filter(a => a.level === level);
}

export function getAgentsByDomain(domain: AgentDomain): AgentDefinition[] {
  return ALL_AGENTS.filter(a => a.domain === domain);
}

export function getAgentsBySphere(sphereId: string): AgentDefinition[] {
  return ALL_AGENTS.filter(a => a.sphere_id === sphereId);
}

export function getHireableAgents(): AgentDefinition[] {
  return ALL_AGENTS.filter(a => a.is_hireable);
}

export function searchAgents(query: string): AgentDefinition[] {
  const q = query.toLowerCase();
  return ALL_AGENTS.filter(a => 
    a.name.toLowerCase().includes(q) ||
    a.name_fr.toLowerCase().includes(q) ||
    a.description.toLowerCase().includes(q) ||
    a.description_fr.toLowerCase().includes(q) ||
    a.capabilities.some(c => c.toLowerCase().includes(q))
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default ALL_AGENTS;
