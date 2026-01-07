// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU V44 — IA LABS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
//
// 🧪 IA LABS — Interface de Templates & Skills
//
// Features:
// 1. Template Browser avec preview modules
// 2. Template Import avec customization
// 3. Skills Library avec directives
// 4. Methodologies Guide
// 5. My Team Agents Dashboard
// 6. Recommendations Engine
//
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface TemplateModule {
  id: string;
  name: string;
  type: string;
  description: string;
  content: Record<string, any>;
  parameters: Array<{
    name: string;
    type: string;
    options?: string[];
    default?: any;
    required?: boolean;
  }>;
  steps?: string[];
  bestPractices?: string[];
  antiPatterns?: string[];
  colorPalette?: string[];
  features?: string[];
}

interface Template {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  modules: Record<string, TemplateModule>;
  tags: string[];
  featured: boolean;
  usageCount: number;
}

interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  level: string;
  directives: Array<{
    id: string;
    name: string;
    type: string;
    instruction: string;
    rationale?: string;
    priority: number;
  }>;
  tags: string[];
}

interface Methodology {
  id: string;
  name: string;
  slug: string;
  description: string;
  steps: Array<{
    name: string;
    phase: string;
    description: string;
    actions: string[];
    estimatedTime: string;
  }>;
  objectives: string[];
}

interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  capabilities: string[];
  status: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA (Replace with API calls)
// ═══════════════════════════════════════════════════════════════════════════════

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Professional Presentation',
    slug: 'professional-presentation',
    category: 'presentation',
    description: 'Template complet pour présentations professionnelles avec modules décomposables',
    tags: ['presentation', 'business', 'powerpoint'],
    featured: true,
    usageCount: 156,
    modules: {
      technique: {
        id: 't1',
        name: 'Structure de présentation',
        type: 'technique',
        description: 'Comment structurer une présentation efficace',
        content: {},
        parameters: [
          { name: 'structure_type', type: 'select', options: ['problem-solution', 'chronological', 'comparison'], default: 'problem-solution' }
        ],
        steps: [
          '1. Définir l\'objectif principal',
          '2. Identifier l\'audience cible',
          '3. Créer le message clé',
          '4. Structurer en 3 parties',
          '5. 1 idée = 1 slide'
        ],
        bestPractices: [
          'Commencer par un hook accrocheur',
          'Utiliser des visuels impactants',
          'Terminer par un call-to-action'
        ],
        antiPatterns: [
          '❌ Surcharger les slides de texte',
          '❌ Trop d\'animations',
          '❌ Lire les slides mot à mot'
        ]
      },
      style: {
        id: 't2',
        name: 'Style visuel professionnel',
        type: 'style',
        description: 'Guide de style pour présentations business',
        content: {},
        parameters: [
          { name: 'color_scheme', type: 'select', options: ['corporate-blue', 'modern-green', 'elegant-gray'], default: 'corporate-blue' }
        ],
        colorPalette: ['#1a365d', '#2b6cb0', '#4299e1', '#63b3ed', '#ffffff']
      },
      dimension: {
        id: 't3',
        name: 'Dimensions recommandées',
        type: 'dimension',
        description: 'Taille et durée optimales',
        content: { optimal: 10, unit: 'slides' },
        parameters: [
          { name: 'presentation_length', type: 'select', options: ['pitch', 'standard', 'detailed'], default: 'standard' }
        ]
      },
      characteristic: {
        id: 't4',
        name: 'Caractéristiques clés',
        type: 'characteristic',
        description: 'Éléments essentiels',
        content: {},
        parameters: [],
        features: [
          'Slide de titre impactant',
          'Agenda/sommaire',
          'Call-to-action final'
        ]
      }
    }
  }
];

const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'Professional Writing',
    slug: 'professional-writing',
    category: 'communication',
    description: 'Compétence en rédaction professionnelle',
    level: 'intermediate',
    tags: ['writing', 'communication'],
    directives: [
      { id: 'd1', name: 'Clarté avant tout', type: 'mandatory', instruction: 'Phrases courtes (max 20 mots)', rationale: 'Améliore la compréhension', priority: 100 },
      { id: 'd2', name: 'Structure pyramidale', type: 'recommended', instruction: 'Commencer par la conclusion', rationale: 'Le lecteur occupé veut l\'essentiel', priority: 90 },
      { id: 'd3', name: 'Voix active', type: 'recommended', instruction: 'Privilégier la voix active', priority: 80 }
    ]
  }
];

const mockAgents: Agent[] = [
  { id: '1', name: 'Methodology Agent', slug: 'methodology-agent', description: 'Guide méthodologique', category: 'core', icon: '🧠', color: '#8b5cf6', capabilities: ['Analyser le contexte', 'Recommander des méthodologies'], status: 'active' },
  { id: '2', name: 'Skills Architect', slug: 'skills-architect', description: 'Gestion des compétences', category: 'core', icon: '🎯', color: '#10b981', capabilities: ['Transformer skills en directives'], status: 'active' },
  { id: '3', name: 'Suggestion Engine', slug: 'suggestion-engine', description: 'Recommandations proactives', category: 'advanced', icon: '🔮', color: '#7c3aed', capabilities: ['Générer des suggestions contextuelles'], status: 'active' }
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const ModuleTypeIcon: React.FC<{ type: string }> = ({ type }) => {
  const icons: Record<string, string> = {
    technique: '⚙️',
    style: '🎨',
    dimension: '📐',
    characteristic: '✨',
    structure: '🏗️',
    content: '📝',
    criteria: '✅'
  };
  return <span>{icons[type] || '📦'}</span>;
};

const DirectiveTypeBadge: React.FC<{ type: string }> = ({ type }) => {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    mandatory: { bg: '#fee2e2', text: '#dc2626', label: 'Obligatoire' },
    recommended: { bg: '#fef3c7', text: '#d97706', label: 'Recommandé' },
    optional: { bg: '#dcfce7', text: '#16a34a', label: 'Optionnel' },
    conditional: { bg: '#dbeafe', text: '#2563eb', label: 'Conditionnel' }
  };
  const style = styles[type] || styles.optional;
  
  return (
    <span style={{
      backgroundColor: style.bg,
      color: style.text,
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 500
    }}>
      {style.label}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE IMPORT MODAL
// ═══════════════════════════════════════════════════════════════════════════════

const TemplateImportModal: React.FC<{
  template: Template;
  onClose: () => void;
  onImport: (config: Record<string, any>) => void;
}> = ({ template, onClose, onImport }) => {
  const [selectedModule, setSelectedModule] = useState<string | null>(
    Object.keys(template.modules)[0]
  );
  const [customConfig, setCustomConfig] = useState<Record<string, Record<string, any>>>({});

  const handleParameterChange = (moduleKey: string, paramName: string, value: any) => {
    setCustomConfig(prev => ({
      ...prev,
      [moduleKey]: {
        ...(prev[moduleKey] || {}),
        [paramName]: value
      }
    }));
  };

  const handleImport = () => {
    onImport(customConfig);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ color: '#f1f5f9', margin: 0, fontSize: '20px' }}>
              📥 Importer: {template.name}
            </h2>
            <p style={{ color: '#94a3b8', margin: '4px 0 0 0', fontSize: '14px' }}>
              Personnalisez chaque module avant l'import
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Module List */}
          <div style={{
            width: '280px',
            borderRight: '1px solid #334155',
            overflowY: 'auto',
            padding: '16px'
          }}>
            <h3 style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Modules ({Object.keys(template.modules).length})
            </h3>
            {Object.entries(template.modules).map(([key, module]) => (
              <div
                key={key}
                onClick={() => setSelectedModule(key)}
                style={{
                  padding: '12px',
                  backgroundColor: selectedModule === key ? '#334155' : 'transparent',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  border: selectedModule === key ? '1px solid #3b82f6' : '1px solid transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ModuleTypeIcon type={module.type} />
                  <span style={{ color: '#f1f5f9', fontWeight: 500 }}>{module.name}</span>
                </div>
                <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0 24px' }}>
                  {module.type}
                </p>
              </div>
            ))}
          </div>

          {/* Module Details */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {selectedModule && template.modules[selectedModule] && (
              <ModuleDetailView
                module={template.modules[selectedModule]}
                moduleKey={selectedModule}
                customConfig={customConfig[selectedModule] || {}}
                onParameterChange={(param, value) => handleParameterChange(selectedModule, param, value)}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ color: '#94a3b8', fontSize: '14px' }}>
            {Object.keys(customConfig).length > 0 && (
              <span>✏️ {Object.keys(customConfig).length} module(s) personnalisé(s)</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: '#334155',
                color: '#f1f5f9',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
            <button
              onClick={handleImport}
              style={{
                padding: '10px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              📥 Importer Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE DETAIL VIEW
// ═══════════════════════════════════════════════════════════════════════════════

const ModuleDetailView: React.FC<{
  module: TemplateModule;
  moduleKey: string;
  customConfig: Record<string, any>;
  onParameterChange: (param: string, value: any) => void;
}> = ({ module, moduleKey, customConfig, onParameterChange }) => {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '32px' }}><ModuleTypeIcon type={module.type} /></span>
          <div>
            <h3 style={{ color: '#f1f5f9', margin: 0, fontSize: '18px' }}>{module.name}</h3>
            <span style={{
              color: '#3b82f6',
              fontSize: '12px',
              backgroundColor: '#1e3a5f',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              {module.type.toUpperCase()}
            </span>
          </div>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>{module.description}</p>
      </div>

      {/* Parameters */}
      {module.parameters && module.parameters.length > 0 && (
        <div style={{
          backgroundColor: '#0f172a',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <h4 style={{ color: '#f1f5f9', fontSize: '14px', marginBottom: '16px' }}>
            ⚙️ Paramètres personnalisables
          </h4>
          {module.parameters.map((param) => (
            <div key={param.name} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '6px' }}>
                {param.name.replace(/_/g, ' ').toUpperCase()}
                {param.required && <span style={{ color: '#ef4444' }}> *</span>}
              </label>
              {param.type === 'select' ? (
                <select
                  value={customConfig[param.name] ?? param.default ?? ''}
                  onChange={(e) => onParameterChange(param.name, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#f1f5f9',
                    fontSize: '14px'
                  }}
                >
                  {param.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : param.type === 'boolean' ? (
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f5f9' }}>
                  <input
                    type="checkbox"
                    checked={customConfig[param.name] ?? param.default ?? false}
                    onChange={(e) => onParameterChange(param.name, e.target.checked)}
                  />
                  Activé
                </label>
              ) : (
                <input
                  type={param.type === 'number' ? 'number' : 'text'}
                  value={customConfig[param.name] ?? param.default ?? ''}
                  onChange={(e) => onParameterChange(param.name, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#f1f5f9',
                    fontSize: '14px'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Steps */}
      {module.steps && module.steps.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#f1f5f9', fontSize: '14px', marginBottom: '12px' }}>
            📋 Étapes
          </h4>
          <div style={{ backgroundColor: '#0f172a', borderRadius: '8px', padding: '16px' }}>
            {module.steps.map((step, index) => (
              <div key={index} style={{
                padding: '8px 0',
                borderBottom: index < module.steps!.length - 1 ? '1px solid #1e293b' : 'none',
                color: '#e2e8f0',
                fontSize: '14px'
              }}>
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Practices */}
      {module.bestPractices && module.bestPractices.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#10b981', fontSize: '14px', marginBottom: '12px' }}>
            ✅ Bonnes pratiques
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {module.bestPractices.map((practice, index) => (
              <div key={index} style={{
                padding: '10px 12px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '6px',
                color: '#6ee7b7',
                fontSize: '14px',
                borderLeft: '3px solid #10b981'
              }}>
                {practice}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Anti-Patterns */}
      {module.antiPatterns && module.antiPatterns.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#ef4444', fontSize: '14px', marginBottom: '12px' }}>
            ⚠️ À éviter
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {module.antiPatterns.map((pattern, index) => (
              <div key={index} style={{
                padding: '10px 12px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '6px',
                color: '#fca5a5',
                fontSize: '14px',
                borderLeft: '3px solid #ef4444'
              }}>
                {pattern}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Color Palette */}
      {module.colorPalette && module.colorPalette.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: '#f1f5f9', fontSize: '14px', marginBottom: '12px' }}>
            🎨 Palette de couleurs
          </h4>
          <div style={{ display: 'flex', gap: '8px' }}>
            {module.colorPalette.map((color, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: color,
                  borderRadius: '8px',
                  border: color === '#ffffff' ? '1px solid #334155' : 'none'
                }} />
                <span style={{ color: '#64748b', fontSize: '10px' }}>{color}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {module.features && module.features.length > 0 && (
        <div>
          <h4 style={{ color: '#f1f5f9', fontSize: '14px', marginBottom: '12px' }}>
            ✨ Caractéristiques
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {module.features.map((feature, index) => (
              <span key={index} style={{
                padding: '6px 12px',
                backgroundColor: '#334155',
                borderRadius: '20px',
                color: '#e2e8f0',
                fontSize: '13px'
              }}>
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

const IALabsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'templates' | 'skills' | 'methodologies' | 'agents'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templates] = useState<Template[]>(mockTemplates);
  const [skills] = useState<Skill[]>(mockSkills);
  const [agents] = useState<Agent[]>(mockAgents);

  const handleImportTemplate = (config: Record<string, any>) => {
    console.log('Importing template with config:', config);
    alert('Template importé avec succès! 🎉');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#f1f5f9'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#1e293b',
        borderBottom: '1px solid #334155',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '32px' }}>🧪</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px' }}>IA Labs</h1>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px' }}>
              Templates, Skills & Méthodologies
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>
            {templates.length} templates • {skills.length} skills • {agents.length} agents
          </span>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        backgroundColor: '#1e293b',
        padding: '0 24px',
        display: 'flex',
        gap: '4px'
      }}>
        {[
          { key: 'templates', label: '📋 Templates', count: templates.length },
          { key: 'skills', label: '🎯 Skills', count: skills.length },
          { key: 'methodologies', label: '📊 Méthodologies', count: 3 },
          { key: 'agents', label: '🤖 Agents My Team', count: agents.length }
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveSection(item.key as any)}
            style={{
              padding: '12px 20px',
              backgroundColor: activeSection === item.key ? '#334155' : 'transparent',
              color: activeSection === item.key ? '#f1f5f9' : '#94a3b8',
              border: 'none',
              borderBottom: activeSection === item.key ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {item.label}
            <span style={{
              backgroundColor: '#0f172a',
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: '12px'
            }}>
              {item.count}
            </span>
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ padding: '24px' }}>
        {/* Templates Section */}
        {activeSection === 'templates' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>📋 Templates Importables</h2>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                Sélectionnez un template et personnalisez chaque module avant l'import
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {templates.map((template) => (
                <div
                  key={template.id}
                  style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #334155'
                  }}
                >
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px' }}>{template.name}</h3>
                        <span style={{
                          color: '#3b82f6',
                          fontSize: '12px',
                          backgroundColor: '#1e3a5f',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}>
                          {template.category}
                        </span>
                      </div>
                      {template.featured && (
                        <span style={{ fontSize: '16px' }}>⭐</span>
                      )}
                    </div>
                    
                    <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px' }}>
                      {template.description}
                    </p>
                    
                    {/* Modules Preview */}
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ color: '#64748b', fontSize: '12px' }}>
                        {Object.keys(template.modules).length} modules:
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                        {Object.entries(template.modules).map(([key, module]) => (
                          <span
                            key={key}
                            style={{
                              padding: '4px 10px',
                              backgroundColor: '#0f172a',
                              borderRadius: '4px',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <ModuleTypeIcon type={module.type} />
                            {key}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {template.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            padding: '2px 8px',
                            backgroundColor: '#334155',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: '#94a3b8'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setSelectedTemplate(template)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      📥 Voir & Importer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>🎯 Skills Library</h2>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                Compétences transformables en directives précises applicables
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #334155'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px' }}>{skill.name}</h3>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>{skill.category}</span>
                        <span style={{
                          fontSize: '11px',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: skill.level === 'advanced' ? '#7c3aed' : '#3b82f6',
                          color: 'white'
                        }}>
                          {skill.level}
                        </span>
                      </div>
                    </div>
                    <span style={{
                      backgroundColor: '#0f172a',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}>
                      {skill.directives.length} directives
                    </span>
                  </div>
                  
                  <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px' }}>
                    {skill.description}
                  </p>
                  
                  {/* Directives Preview */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {skill.directives.slice(0, 3).map((directive) => (
                      <div
                        key={directive.id}
                        style={{
                          padding: '10px 12px',
                          backgroundColor: '#0f172a',
                          borderRadius: '6px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 500 }}>{directive.name}</span>
                          <DirectiveTypeBadge type={directive.type} />
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
                          {directive.instruction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agents Section */}
        {activeSection === 'agents' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>🤖 Agents My Team</h2>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                15 agents spécialisés pour la productivité d'équipe
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #334155',
                    borderLeft: `4px solid ${agent.color}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '28px' }}>{agent.icon}</span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '15px' }}>{agent.name}</h3>
                      <span style={{
                        fontSize: '11px',
                        color: '#94a3b8',
                        backgroundColor: '#0f172a',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        {agent.category}
                      </span>
                    </div>
                    <span style={{
                      marginLeft: 'auto',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: agent.status === 'active' ? '#22c55e' : '#64748b'
                    }} />
                  </div>
                  
                  <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '12px' }}>
                    {agent.description}
                  </p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {agent.capabilities.slice(0, 3).map((cap, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '3px 8px',
                          backgroundColor: '#0f172a',
                          borderRadius: '4px',
                          fontSize: '11px',
                          color: '#94a3b8'
                        }}
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Methodologies Section */}
        {activeSection === 'methodologies' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>📊 Méthodologies</h2>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                Processus structurés avec conditions d'application
              </p>
            </div>
            
            <div style={{
              backgroundColor: '#1e293b',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '48px' }}>🚧</span>
              <h3 style={{ marginTop: '16px' }}>Coming Soon</h3>
              <p style={{ color: '#94a3b8' }}>
                Interface méthodologies en cours de développement
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Template Import Modal */}
      {selectedTemplate && (
        <TemplateImportModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onImport={handleImportTemplate}
        />
      )}
    </div>
  );
};

export default IALabsPage;
