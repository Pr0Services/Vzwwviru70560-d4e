/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — AGENT INTERVIEW BUILDER
 * ═══════════════════════════════════════════════════════════════════════════════
 * Wizard interactif pour créer des agents IA personnalisés:
 * - Interview guidée étape par étape
 * - Templates par département (Construction, Finance, HR, etc.)
 * - Personnalité et ton configurables
 * - Compétences et outils sélectionnables
 * - Aperçu et test en direct
 * - Export de configuration
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo, useCallback } from 'react';

const tokens = {
  colors: {
    sacredGold: '#D8B26A', cenoteTurquoise: '#3EB4A2', jungleEmerald: '#3F7249',
    ancientStone: '#8D8371', earthEmber: '#7A593A', darkSlate: '#1A1A1A',
    error: '#C45C4A', warning: '#FF9F43', info: '#54A0FF', purple: '#9B59B6',
    bg: { primary: '#0f1217', secondary: '#161B22', tertiary: '#1E242C', card: 'rgba(22, 27, 34, 0.95)' },
    text: { primary: '#E9E4D6', secondary: '#A0998A', muted: '#6B6560' },
    border: 'rgba(216, 178, 106, 0.15)',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
};

// ─────────────────────────────────────────────────────────────────────────────
// DEPARTMENT TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────

const DEPARTMENTS = {
  construction: {
    id: 'construction',
    name: 'Construction',
    icon: '🏗️',
    color: tokens.colors.earthEmber,
    description: 'Gestion de chantiers, estimations, inspections',
    roles: [
      { id: 'estimator', name: 'Estimateur', icon: '📊', description: 'Calcul des coûts et soumissions' },
      { id: 'site-manager', name: 'Gestionnaire de chantier', icon: '👷', description: 'Coordination des travaux sur site' },
      { id: 'inspector', name: 'Inspecteur', icon: '🔍', description: 'Contrôle qualité et conformité' },
      { id: 'safety', name: 'Agent SST', icon: '⛑️', description: 'Santé et sécurité au travail' },
      { id: 'planner', name: 'Planificateur', icon: '📅', description: 'Échéanciers et ressources' },
      { id: 'procurement', name: 'Approvisionnement', icon: '📦', description: 'Achats et fournisseurs' },
    ],
    skills: ['Estimation', 'Lecture de plans', 'Normes RBQ', 'Code du bâtiment', 'Gestion de projet', 'Coordination', 'SST/CNESST', 'Contrôle qualité'],
    tools: ['AutoCAD', 'Procore', 'MS Project', 'Excel avancé', 'BIM/Revit', 'GPS/Arpentage'],
  },
  finance: {
    id: 'finance',
    name: 'Finance',
    icon: '💰',
    color: tokens.colors.jungleEmerald,
    description: 'Comptabilité, facturation, analyse financière',
    roles: [
      { id: 'accountant', name: 'Comptable', icon: '📒', description: 'Tenue de livres et rapports' },
      { id: 'invoicing', name: 'Facturation', icon: '🧾', description: 'Création et suivi des factures' },
      { id: 'payroll', name: 'Paie', icon: '💵', description: 'Gestion de la paie CCQ' },
      { id: 'analyst', name: 'Analyste financier', icon: '📈', description: 'Analyses et prévisions' },
      { id: 'collections', name: 'Recouvrement', icon: '📞', description: 'Suivi des comptes clients' },
      { id: 'controller', name: 'Contrôleur', icon: '🎯', description: 'Contrôle budgétaire' },
    ],
    skills: ['Comptabilité', 'Fiscalité QC', 'Analyse financière', 'Budgétisation', 'CCQ/Paie', 'Rapports TPS/TVQ', 'Crédit/Recouvrement'],
    tools: ['QuickBooks', 'Sage', 'Excel avancé', 'Power BI', 'Maestro'],
  },
  hr: {
    id: 'hr',
    name: 'Ressources Humaines',
    icon: '👥',
    color: tokens.colors.purple,
    description: 'Recrutement, formation, gestion du personnel',
    roles: [
      { id: 'recruiter', name: 'Recruteur', icon: '🎯', description: 'Acquisition de talents' },
      { id: 'trainer', name: 'Formateur', icon: '🎓', description: 'Formation et développement' },
      { id: 'benefits', name: 'Avantages sociaux', icon: '🏥', description: 'Assurances et REER' },
      { id: 'relations', name: 'Relations de travail', icon: '🤝', description: 'Syndicats et conventions' },
      { id: 'onboarding', name: 'Intégration', icon: '🚀', description: 'Accueil des nouveaux' },
      { id: 'compliance', name: 'Conformité', icon: '📋', description: 'Normes du travail' },
    ],
    skills: ['Recrutement', 'Formation', 'Droit du travail QC', 'CCQ', 'CNESST', 'Gestion de conflits', 'Évaluation performance'],
    tools: ['LinkedIn Recruiter', 'BambooHR', 'ADP', 'Teams', 'Zoom'],
  },
  sales: {
    id: 'sales',
    name: 'Ventes',
    icon: '📈',
    color: tokens.colors.cenoteTurquoise,
    description: 'Développement des affaires, soumissions, négociation',
    roles: [
      { id: 'rep', name: 'Représentant', icon: '🤝', description: 'Développement clientèle' },
      { id: 'estimator-sales', name: 'Estimateur-vendeur', icon: '📊', description: 'Soumissions et closing' },
      { id: 'account-mgr', name: 'Gestionnaire de comptes', icon: '👔', description: 'Suivi clients existants' },
      { id: 'lead-gen', name: 'Génération de leads', icon: '🎣', description: 'Prospection et qualification' },
      { id: 'proposals', name: 'Propositions', icon: '📝', description: 'Rédaction d\'offres' },
    ],
    skills: ['Négociation', 'Présentation', 'CRM', 'Soumissions', 'Closing', 'Prospection', 'Relation client'],
    tools: ['Salesforce', 'HubSpot', 'Pipedrive', 'DocuSign', 'Calendly'],
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing',
    icon: '📣',
    color: tokens.colors.warning,
    description: 'Communication, branding, marketing digital',
    roles: [
      { id: 'content', name: 'Créateur de contenu', icon: '✍️', description: 'Rédaction et médias' },
      { id: 'social', name: 'Réseaux sociaux', icon: '📱', description: 'Gestion des communautés' },
      { id: 'seo', name: 'SEO/SEM', icon: '🔍', description: 'Référencement et ads' },
      { id: 'brand', name: 'Image de marque', icon: '🎨', description: 'Identité visuelle' },
      { id: 'events', name: 'Événements', icon: '🎪', description: 'Salons et promotions' },
    ],
    skills: ['Rédaction', 'Réseaux sociaux', 'SEO', 'Google Ads', 'Design graphique', 'Vidéo', 'Analytics'],
    tools: ['Canva', 'Hootsuite', 'Google Analytics', 'Mailchimp', 'Adobe Suite'],
  },
  operations: {
    id: 'operations',
    name: 'Opérations',
    icon: '⚙️',
    color: tokens.colors.ancientStone,
    description: 'Logistique, équipements, processus',
    roles: [
      { id: 'logistics', name: 'Logistique', icon: '🚚', description: 'Transport et livraisons' },
      { id: 'equipment', name: 'Équipements', icon: '🔧', description: 'Gestion du parc' },
      { id: 'inventory', name: 'Inventaire', icon: '📦', description: 'Stocks et matériaux' },
      { id: 'quality', name: 'Qualité', icon: '✅', description: 'Processus et ISO' },
      { id: 'maintenance', name: 'Maintenance', icon: '🛠️', description: 'Entretien préventif' },
    ],
    skills: ['Logistique', 'Gestion inventaire', 'Lean/5S', 'ISO 9001', 'Planification', 'Maintenance'],
    tools: ['SAP', 'Oracle', 'Fleet management', 'CMMS', 'GPS tracking'],
  },
  legal: {
    id: 'legal',
    name: 'Juridique',
    icon: '⚖️',
    color: tokens.colors.info,
    description: 'Contrats, conformité, litiges',
    roles: [
      { id: 'contracts', name: 'Contrats', icon: '📜', description: 'Rédaction et révision' },
      { id: 'compliance-legal', name: 'Conformité', icon: '✅', description: 'Réglementations' },
      { id: 'disputes', name: 'Litiges', icon: '⚔️', description: 'Gestion des conflits' },
      { id: 'permits', name: 'Permis', icon: '📋', description: 'Licences et autorisations' },
    ],
    skills: ['Droit de la construction', 'Contrats', 'Hypothèques légales', 'Médiation', 'RBQ', 'Municipalités'],
    tools: ['Jurisprudence', 'CanLII', 'DocuSign', 'Contract management'],
  },
  creative: {
    id: 'creative',
    name: 'Studio Créatif',
    icon: '🎨',
    color: '#E91E63',
    description: 'Design, 3D, visualisation, branding',
    roles: [
      { id: 'designer', name: 'Designer graphique', icon: '🖼️', description: 'Visuels et identité' },
      { id: '3d-artist', name: 'Artiste 3D', icon: '🎮', description: 'Modélisation et rendus' },
      { id: 'video', name: 'Vidéaste', icon: '🎬', description: 'Production vidéo' },
      { id: 'ux', name: 'UX Designer', icon: '📐', description: 'Expérience utilisateur' },
      { id: 'illustrator', name: 'Illustrateur', icon: '✏️', description: 'Illustrations techniques' },
    ],
    skills: ['Design graphique', 'Modélisation 3D', 'Animation', 'UX/UI', 'Branding', 'Vidéo'],
    tools: ['Photoshop', 'Illustrator', 'Blender', 'SketchUp', 'Premiere Pro', 'Figma'],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PERSONALITY TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────

const PERSONALITIES = [
  { id: 'professional', name: 'Professionnel', icon: '👔', description: 'Formel, précis, efficace', tone: 'Vouvoiement, langage technique approprié, réponses structurées' },
  { id: 'friendly', name: 'Amical', icon: '😊', description: 'Chaleureux, accessible, encourageant', tone: 'Tutoiement possible, ton conversationnel, empathique' },
  { id: 'expert', name: 'Expert', icon: '🎓', description: 'Technique, détaillé, pédagogue', tone: 'Explications approfondies, références aux normes, éducatif' },
  { id: 'efficient', name: 'Efficace', icon: '⚡', description: 'Direct, concis, orienté action', tone: 'Réponses courtes, listes, priorise l\'essentiel' },
  { id: 'coach', name: 'Coach', icon: '🏆', description: 'Motivant, supportif, développement', tone: 'Questions ouvertes, encouragements, développement personnel' },
  { id: 'analytical', name: 'Analytique', icon: '🔬', description: 'Données, métriques, objectif', tone: 'Basé sur les faits, chiffres, analyse rigoureuse' },
];

const LANGUAGES = [
  { id: 'fr', name: 'Français', flag: '🇫🇷' },
  { id: 'en', name: 'English', flag: '🇬🇧' },
  { id: 'fr-en', name: 'Bilingue FR/EN', flag: '🇨🇦' },
];

const LLM_PROVIDERS = [
  { id: 'claude', name: 'Claude (Anthropic)', icon: '🟣', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] },
  { id: 'openai', name: 'GPT (OpenAI)', icon: '🟢', models: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'] },
  { id: 'gemini', name: 'Gemini (Google)', icon: '🔵', models: ['gemini-pro', 'gemini-ultra'] },
  { id: 'ollama', name: 'Ollama (Local)', icon: '🟠', models: ['llama3', 'mistral', 'codellama'] },
];

// ─────────────────────────────────────────────────────────────────────────────
// INTERVIEW STEPS
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 'welcome', title: 'Bienvenue', icon: '👋' },
  { id: 'department', title: 'Département', icon: '🏢' },
  { id: 'role', title: 'Rôle', icon: '👤' },
  { id: 'identity', title: 'Identité', icon: '🎭' },
  { id: 'personality', title: 'Personnalité', icon: '💭' },
  { id: 'skills', title: 'Compétences', icon: '🛠️' },
  { id: 'tools', title: 'Outils', icon: '🔧' },
  { id: 'context', title: 'Contexte', icon: '📋' },
  { id: 'llm', title: 'Modèle IA', icon: '🤖' },
  { id: 'review', title: 'Révision', icon: '✅' },
  { id: 'test', title: 'Test', icon: '🧪' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const ProgressBar = ({ currentStep, steps }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs, padding: tokens.spacing.md, overflowX: 'auto' }}>
    {steps.map((step, i) => {
      const isActive = i === currentStep;
      const isComplete = i < currentStep;
      return (
        <React.Fragment key={step.id}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: tokens.spacing.xs,
            padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
            backgroundColor: isActive ? tokens.colors.sacredGold : isComplete ? tokens.colors.jungleEmerald : tokens.colors.bg.tertiary,
            borderRadius: tokens.radius.full,
            color: isActive || isComplete ? tokens.colors.darkSlate : tokens.colors.text.muted,
            fontSize: 11, fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap',
          }}>
            <span>{step.icon}</span>
            <span style={{ display: i === currentStep ? 'inline' : 'none' }}>{step.title}</span>
          </div>
          {i < steps.length - 1 && <div style={{ width: 20, height: 2, backgroundColor: isComplete ? tokens.colors.jungleEmerald : tokens.colors.border }} />}
        </React.Fragment>
      );
    })}
  </div>
);

const StepContainer = ({ title, subtitle, children }) => (
  <div style={{ padding: tokens.spacing.xl, maxWidth: 800, margin: '0 auto' }}>
    <h2 style={{ margin: 0, marginBottom: tokens.spacing.xs, color: tokens.colors.text.primary, fontSize: 24 }}>{title}</h2>
    {subtitle && <p style={{ margin: 0, marginBottom: tokens.spacing.lg, color: tokens.colors.text.secondary }}>{subtitle}</p>}
    {children}
  </div>
);

const OptionCard = ({ selected, onClick, icon, title, description, color, badge }) => (
  <div
    onClick={onClick}
    style={{
      padding: tokens.spacing.md,
      backgroundColor: selected ? `${color || tokens.colors.sacredGold}15` : tokens.colors.bg.tertiary,
      border: `2px solid ${selected ? (color || tokens.colors.sacredGold) : tokens.colors.border}`,
      borderRadius: tokens.radius.lg,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: tokens.spacing.md }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
          <span style={{ fontWeight: 600, color: tokens.colors.text.primary }}>{title}</span>
          {badge && <span style={{ padding: '2px 6px', backgroundColor: tokens.colors.sacredGold, color: tokens.colors.darkSlate, borderRadius: tokens.radius.sm, fontSize: 9, fontWeight: 600 }}>{badge}</span>}
        </div>
        <p style={{ margin: 0, marginTop: tokens.spacing.xs, fontSize: 13, color: tokens.colors.text.secondary }}>{description}</p>
      </div>
      {selected && <span style={{ color: color || tokens.colors.sacredGold, fontSize: 20 }}>✓</span>}
    </div>
  </div>
);

const ChipSelector = ({ options, selected, onToggle, multi = false }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.spacing.sm }}>
    {options.map(opt => {
      const isSelected = multi ? selected.includes(opt) : selected === opt;
      return (
        <button
          key={opt}
          onClick={() => onToggle(opt)}
          style={{
            padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
            backgroundColor: isSelected ? tokens.colors.sacredGold : tokens.colors.bg.tertiary,
            color: isSelected ? tokens.colors.darkSlate : tokens.colors.text.secondary,
            border: `1px solid ${isSelected ? tokens.colors.sacredGold : tokens.colors.border}`,
            borderRadius: tokens.radius.full,
            fontSize: 13, fontWeight: isSelected ? 600 : 400, cursor: 'pointer',
          }}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

const TextInput = ({ label, value, onChange, placeholder, multiline = false }) => (
  <div style={{ marginBottom: tokens.spacing.md }}>
    {label && <label style={{ display: 'block', marginBottom: tokens.spacing.xs, fontSize: 13, fontWeight: 500, color: tokens.colors.text.secondary }}>{label}</label>}
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{
          width: '100%', padding: tokens.spacing.md,
          backgroundColor: tokens.colors.bg.tertiary, border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.lg, color: tokens.colors.text.primary, fontSize: 14,
          resize: 'vertical', outline: 'none', boxSizing: 'border-box',
        }}
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: tokens.spacing.md,
          backgroundColor: tokens.colors.bg.tertiary, border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.lg, color: tokens.colors.text.primary, fontSize: 14,
          outline: 'none', boxSizing: 'border-box',
        }}
      />
    )}
  </div>
);

const AgentPreview = ({ agent }) => {
  const dept = DEPARTMENTS[agent.department];
  const role = dept?.roles.find(r => r.id === agent.role);
  const personality = PERSONALITIES.find(p => p.id === agent.personality);
  
  return (
    <div style={{ padding: tokens.spacing.lg, backgroundColor: tokens.colors.bg.tertiary, borderRadius: tokens.radius.xl, border: `1px solid ${tokens.colors.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md, marginBottom: tokens.spacing.lg }}>
        <div style={{
          width: 64, height: 64, borderRadius: tokens.radius.xl,
          background: `linear-gradient(135deg, ${dept?.color || tokens.colors.sacredGold}, ${tokens.colors.bg.secondary})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, border: `3px solid ${tokens.colors.sacredGold}`,
        }}>
          {role?.icon || '🤖'}
        </div>
        <div>
          <h3 style={{ margin: 0, color: tokens.colors.text.primary, fontSize: 20 }}>{agent.name || 'Nouvel Agent'}</h3>
          <div style={{ color: tokens.colors.text.secondary, fontSize: 13 }}>{role?.name || 'Rôle non défini'} • {dept?.name || 'Département'}</div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: tokens.spacing.md }}>
        <div>
          <div style={{ fontSize: 11, color: tokens.colors.text.muted, marginBottom: tokens.spacing.xs }}>PERSONNALITÉ</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xs, color: tokens.colors.text.primary }}>
            {personality?.icon} {personality?.name || '-'}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: tokens.colors.text.muted, marginBottom: tokens.spacing.xs }}>LANGUE</div>
          <div style={{ color: tokens.colors.text.primary }}>{LANGUAGES.find(l => l.id === agent.language)?.name || '-'}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: tokens.colors.text.muted, marginBottom: tokens.spacing.xs }}>COMPÉTENCES</div>
          <div style={{ color: tokens.colors.text.primary }}>{agent.skills?.length || 0} sélectionnées</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: tokens.colors.text.muted, marginBottom: tokens.spacing.xs }}>MODÈLE IA</div>
          <div style={{ color: tokens.colors.text.primary }}>{agent.model || '-'}</div>
        </div>
      </div>
    </div>
  );
};

const TestChat = ({ agent }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Bonjour! Je suis ${agent.name || 'votre assistant'}. Comment puis-je vous aider aujourd'hui?` }
  ]);
  const [input, setInput] = useState('');
  
  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `[Mode test] Je comprends votre demande concernant "${input}". En tant que ${DEPARTMENTS[agent.department]?.roles.find(r => r.id === agent.role)?.name || 'assistant'}, je suis là pour vous aider avec expertise et professionnalisme.`
      }]);
    }, 1000);
    setInput('');
  };
  
  return (
    <div style={{ border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.lg, overflow: 'hidden' }}>
      <div style={{ padding: tokens.spacing.sm, backgroundColor: tokens.colors.bg.tertiary, borderBottom: `1px solid ${tokens.colors.border}`, display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
        <span>🧪</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: tokens.colors.text.primary }}>Test de conversation</span>
        <span style={{ fontSize: 11, color: tokens.colors.text.muted }}>(simulation)</span>
      </div>
      <div style={{ height: 200, overflowY: 'auto', padding: tokens.spacing.md }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: tokens.spacing.sm, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <div style={{
              display: 'inline-block', padding: tokens.spacing.sm, maxWidth: '80%',
              backgroundColor: msg.role === 'user' ? tokens.colors.sacredGold : tokens.colors.bg.tertiary,
              color: msg.role === 'user' ? tokens.colors.darkSlate : tokens.colors.text.primary,
              borderRadius: tokens.radius.lg, fontSize: 13,
            }}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: tokens.spacing.sm, borderTop: `1px solid ${tokens.colors.border}`, display: 'flex', gap: tokens.spacing.sm }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Testez votre agent..."
          style={{ flex: 1, padding: tokens.spacing.sm, backgroundColor: tokens.colors.bg.tertiary, border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.md, color: tokens.colors.text.primary, fontSize: 13, outline: 'none' }}
        />
        <button onClick={handleSend} style={{ padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`, backgroundColor: tokens.colors.sacredGold, border: 'none', borderRadius: tokens.radius.md, color: tokens.colors.darkSlate, fontWeight: 600, cursor: 'pointer' }}>Envoyer</button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const AgentInterviewBuilder = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [agent, setAgent] = useState({
    department: null,
    role: null,
    name: '',
    description: '',
    personality: null,
    language: 'fr',
    skills: [],
    tools: [],
    context: '',
    instructions: '',
    provider: 'claude',
    model: 'claude-3-sonnet',
  });
  
  const updateAgent = useCallback((updates) => {
    setAgent(prev => ({ ...prev, ...updates }));
  }, []);
  
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  
  const selectedDept = DEPARTMENTS[agent.department];
  
  const generateSystemPrompt = useMemo(() => {
    const dept = DEPARTMENTS[agent.department];
    const role = dept?.roles.find(r => r.id === agent.role);
    const personality = PERSONALITIES.find(p => p.id === agent.personality);
    
    return `Tu es ${agent.name || 'un assistant'}, ${role?.description || 'un agent IA'} spécialisé dans le département ${dept?.name || ''}.

PERSONNALITÉ: ${personality?.name || 'Professionnel'}
${personality?.tone || ''}

COMPÉTENCES: ${agent.skills.join(', ') || 'Générales'}

OUTILS MAÎTRISÉS: ${agent.tools.join(', ') || 'Aucun spécifique'}

CONTEXTE SPÉCIFIQUE:
${agent.context || 'Aucun contexte additionnel.'}

INSTRUCTIONS PARTICULIÈRES:
${agent.instructions || 'Suivre les meilleures pratiques du domaine.'}

LANGUE: ${LANGUAGES.find(l => l.id === agent.language)?.name || 'Français'}

Tu travailles pour Pro-Service, une entreprise de construction basée au Québec. Tu dois respecter les normes RBQ, CCQ et CNESST applicables.`;
  }, [agent]);
  
  const handleExport = () => {
    const config = {
      ...agent,
      systemPrompt: generateSystemPrompt,
      createdAt: new Date().toISOString(),
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-${agent.name?.toLowerCase().replace(/\s+/g, '-') || 'new'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'welcome':
        return (
          <StepContainer title="Créons votre Agent IA 🤖" subtitle="Je vais vous guider étape par étape pour configurer un agent parfaitement adapté à vos besoins.">
            <div style={{ textAlign: 'center', padding: tokens.spacing.xl }}>
              <div style={{ fontSize: 80, marginBottom: tokens.spacing.lg }}>🧙‍♂️</div>
              <p style={{ color: tokens.colors.text.secondary, fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
                En quelques questions, nous allons définir le département, le rôle, la personnalité et les compétences de votre nouvel agent.
              </p>
              <button onClick={nextStep} style={{ marginTop: tokens.spacing.xl, padding: `${tokens.spacing.md}px ${tokens.spacing.xl}px`, backgroundColor: tokens.colors.sacredGold, border: 'none', borderRadius: tokens.radius.lg, color: tokens.colors.darkSlate, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
                Commencer l'interview ➜
              </button>
            </div>
          </StepContainer>
        );
        
      case 'department':
        return (
          <StepContainer title="Dans quel département travaillera l'agent?" subtitle="Choisissez le domaine d'expertise principal.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: tokens.spacing.md }}>
              {Object.values(DEPARTMENTS).map(dept => (
                <OptionCard
                  key={dept.id}
                  selected={agent.department === dept.id}
                  onClick={() => updateAgent({ department: dept.id, role: null, skills: [], tools: [] })}
                  icon={dept.icon}
                  title={dept.name}
                  description={dept.description}
                  color={dept.color}
                />
              ))}
            </div>
          </StepContainer>
        );
        
      case 'role':
        return (
          <StepContainer title={`Quel rôle dans ${selectedDept?.name}?`} subtitle="Sélectionnez la spécialisation de l'agent.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: tokens.spacing.md }}>
              {selectedDept?.roles.map(role => (
                <OptionCard
                  key={role.id}
                  selected={agent.role === role.id}
                  onClick={() => updateAgent({ role: role.id })}
                  icon={role.icon}
                  title={role.name}
                  description={role.description}
                  color={selectedDept.color}
                />
              ))}
            </div>
          </StepContainer>
        );
        
      case 'identity':
        return (
          <StepContainer title="Donnez une identité à votre agent" subtitle="Comment souhaitez-vous l'appeler?">
            <TextInput label="Nom de l'agent" value={agent.name} onChange={(v) => updateAgent({ name: v })} placeholder="Ex: Sophie, Max, Assistant Estimation..." />
            <TextInput label="Description courte" value={agent.description} onChange={(v) => updateAgent({ description: v })} placeholder="Une phrase décrivant son rôle principal..." />
            <div style={{ marginBottom: tokens.spacing.md }}>
              <label style={{ display: 'block', marginBottom: tokens.spacing.sm, fontSize: 13, fontWeight: 500, color: tokens.colors.text.secondary }}>Langue de communication</label>
              <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => updateAgent({ language: lang.id })}
                    style={{
                      padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
                      backgroundColor: agent.language === lang.id ? tokens.colors.sacredGold : tokens.colors.bg.tertiary,
                      color: agent.language === lang.id ? tokens.colors.darkSlate : tokens.colors.text.secondary,
                      border: `1px solid ${agent.language === lang.id ? tokens.colors.sacredGold : tokens.colors.border}`,
                      borderRadius: tokens.radius.md, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: tokens.spacing.xs,
                    }}
                  >
                    <span>{lang.flag}</span> {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </StepContainer>
        );
        
      case 'personality':
        return (
          <StepContainer title="Quelle personnalité pour l'agent?" subtitle="Définissez le ton et le style de communication.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: tokens.spacing.md }}>
              {PERSONALITIES.map(p => (
                <OptionCard
                  key={p.id}
                  selected={agent.personality === p.id}
                  onClick={() => updateAgent({ personality: p.id })}
                  icon={p.icon}
                  title={p.name}
                  description={p.tone}
                />
              ))}
            </div>
          </StepContainer>
        );
        
      case 'skills':
        return (
          <StepContainer title="Quelles compétences?" subtitle="Sélectionnez les domaines d'expertise (plusieurs choix possibles).">
            <ChipSelector
              options={selectedDept?.skills || []}
              selected={agent.skills}
              onToggle={(skill) => updateAgent({ skills: agent.skills.includes(skill) ? agent.skills.filter(s => s !== skill) : [...agent.skills, skill] })}
              multi
            />
            <div style={{ marginTop: tokens.spacing.lg }}>
              <TextInput label="Compétences additionnelles (séparées par virgule)" value={agent.customSkills || ''} onChange={(v) => updateAgent({ customSkills: v })} placeholder="Ex: Négociation fournisseurs, Gestion de crise..." />
            </div>
          </StepContainer>
        );
        
      case 'tools':
        return (
          <StepContainer title="Quels outils maîtrise-t-il?" subtitle="Logiciels et plateformes que l'agent connaît.">
            <ChipSelector
              options={selectedDept?.tools || []}
              selected={agent.tools}
              onToggle={(tool) => updateAgent({ tools: agent.tools.includes(tool) ? agent.tools.filter(t => t !== tool) : [...agent.tools, tool] })}
              multi
            />
            <div style={{ marginTop: tokens.spacing.lg }}>
              <TextInput label="Outils additionnels (séparés par virgule)" value={agent.customTools || ''} onChange={(v) => updateAgent({ customTools: v })} placeholder="Ex: Notion, Slack, Airtable..." />
            </div>
          </StepContainer>
        );
        
      case 'context':
        return (
          <StepContainer title="Contexte et instructions" subtitle="Informations spécifiques que l'agent doit connaître.">
            <TextInput label="Contexte de l'entreprise" value={agent.context} onChange={(v) => updateAgent({ context: v })} placeholder="Ex: Nous sommes spécialisés en rénovation résidentielle haut de gamme sur la Rive-Sud..." multiline />
            <TextInput label="Instructions particulières" value={agent.instructions} onChange={(v) => updateAgent({ instructions: v })} placeholder="Ex: Toujours mentionner les délais RBQ, proposer des alternatives écologiques..." multiline />
          </StepContainer>
        );
        
      case 'llm':
        return (
          <StepContainer title="Quel modèle IA utiliser?" subtitle="Choisissez le fournisseur et le modèle.">
            <div style={{ display: 'grid', gap: tokens.spacing.md, marginBottom: tokens.spacing.lg }}>
              {LLM_PROVIDERS.map(provider => (
                <OptionCard
                  key={provider.id}
                  selected={agent.provider === provider.id}
                  onClick={() => updateAgent({ provider: provider.id, model: provider.models[0] })}
                  icon={provider.icon}
                  title={provider.name}
                  description={`Modèles: ${provider.models.join(', ')}`}
                  badge={provider.id === 'claude' ? 'Recommandé' : null}
                />
              ))}
            </div>
            {agent.provider && (
              <div>
                <label style={{ display: 'block', marginBottom: tokens.spacing.sm, fontSize: 13, fontWeight: 500, color: tokens.colors.text.secondary }}>Modèle spécifique</label>
                <div style={{ display: 'flex', gap: tokens.spacing.sm, flexWrap: 'wrap' }}>
                  {LLM_PROVIDERS.find(p => p.id === agent.provider)?.models.map(model => (
                    <button
                      key={model}
                      onClick={() => updateAgent({ model })}
                      style={{
                        padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
                        backgroundColor: agent.model === model ? tokens.colors.sacredGold : tokens.colors.bg.tertiary,
                        color: agent.model === model ? tokens.colors.darkSlate : tokens.colors.text.secondary,
                        border: `1px solid ${agent.model === model ? tokens.colors.sacredGold : tokens.colors.border}`,
                        borderRadius: tokens.radius.md, fontSize: 13, cursor: 'pointer',
                      }}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </StepContainer>
        );
        
      case 'review':
        return (
          <StepContainer title="Révision de l'agent" subtitle="Vérifiez la configuration avant de continuer.">
            <AgentPreview agent={agent} />
            <div style={{ marginTop: tokens.spacing.lg, padding: tokens.spacing.md, backgroundColor: tokens.colors.bg.tertiary, borderRadius: tokens.radius.lg, border: `1px solid ${tokens.colors.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: tokens.colors.text.muted, marginBottom: tokens.spacing.sm }}>SYSTEM PROMPT GÉNÉRÉ</div>
              <pre style={{ margin: 0, fontSize: 12, color: tokens.colors.text.secondary, whiteSpace: 'pre-wrap', fontFamily: 'monospace', maxHeight: 200, overflowY: 'auto' }}>
                {generateSystemPrompt}
              </pre>
            </div>
          </StepContainer>
        );
        
      case 'test':
        return (
          <StepContainer title="Testez votre agent!" subtitle="Vérifiez que l'agent répond comme prévu.">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: tokens.spacing.lg }}>
              <AgentPreview agent={agent} />
              <TestChat agent={agent} />
            </div>
            <div style={{ marginTop: tokens.spacing.xl, display: 'flex', justifyContent: 'center', gap: tokens.spacing.md }}>
              <button onClick={handleExport} style={{ padding: `${tokens.spacing.md}px ${tokens.spacing.xl}px`, backgroundColor: tokens.colors.bg.tertiary, border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.lg, color: tokens.colors.text.primary, fontSize: 14, cursor: 'pointer' }}>
                📥 Exporter JSON
              </button>
              <button onClick={() => onComplete?.(agent)} style={{ padding: `${tokens.spacing.md}px ${tokens.spacing.xl}px`, backgroundColor: tokens.colors.jungleEmerald, border: 'none', borderRadius: tokens.radius.lg, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                ✅ Créer l'agent
              </button>
            </div>
          </StepContainer>
        );
        
      default:
        return null;
    }
  };
  
  const canProceed = () => {
    switch (STEPS[currentStep].id) {
      case 'department': return !!agent.department;
      case 'role': return !!agent.role;
      case 'identity': return !!agent.name;
      case 'personality': return !!agent.personality;
      case 'llm': return !!agent.model;
      default: return true;
    }
  };
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: tokens.colors.bg.primary, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: tokens.spacing.md, borderBottom: `1px solid ${tokens.colors.border}`, backgroundColor: tokens.colors.bg.secondary, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
          <span style={{ fontSize: 24 }}>🤖</span>
          <span style={{ fontWeight: 600, color: tokens.colors.text.primary, fontSize: 18 }}>Agent Interview Builder</span>
        </div>
        <button onClick={onCancel} style={{ padding: `${tokens.spacing.xs}px ${tokens.spacing.md}px`, backgroundColor: 'transparent', border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.md, color: tokens.colors.text.muted, cursor: 'pointer' }}>
          ✕ Annuler
        </button>
      </div>
      
      {/* Progress */}
      <ProgressBar currentStep={currentStep} steps={STEPS} />
      
      {/* Content */}
      {renderStep()}
      
      {/* Navigation */}
      {currentStep > 0 && currentStep < STEPS.length - 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: tokens.spacing.xl, maxWidth: 800, margin: '0 auto' }}>
          <button onClick={prevStep} style={{ padding: `${tokens.spacing.md}px ${tokens.spacing.xl}px`, backgroundColor: tokens.colors.bg.tertiary, border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.lg, color: tokens.colors.text.secondary, fontSize: 14, cursor: 'pointer' }}>
            ← Précédent
          </button>
          <button onClick={nextStep} disabled={!canProceed()} style={{ padding: `${tokens.spacing.md}px ${tokens.spacing.xl}px`, backgroundColor: canProceed() ? tokens.colors.sacredGold : tokens.colors.bg.tertiary, border: 'none', borderRadius: tokens.radius.lg, color: canProceed() ? tokens.colors.darkSlate : tokens.colors.text.muted, fontSize: 14, fontWeight: 600, cursor: canProceed() ? 'pointer' : 'not-allowed' }}>
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
};

export default AgentInterviewBuilder;
