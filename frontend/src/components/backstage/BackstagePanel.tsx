/**
 * CHE·NU™ Backstage Intelligence
 * Invisible cognitive layer for context analysis, intent detection, and routing
 * 
 * @module backstage
 * @version 33.0
 */

import React, { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface IntentResult {
  primary_intent: string;
  confidence: number;
  entities: { type: string; value: string }[];
  suggested_actions: string[];
}

interface ClassificationResult {
  category: string;
  subcategory?: string;
  domains: string[];
  tags: string[];
  language?: string;
  sentiment?: string;
}

interface RoutingResult {
  sphere: string;
  domain: string;
  agents: string[];
}

interface BackstageContext {
  id: string;
  contextType: 'workspace' | 'thread' | 'meeting' | 'workflow';
  contextData: Record<string, any>;
  detectedIntent?: IntentResult;
  suggestedAgents: string[];
  suggestedDataspaces: string[];
  createdAt: string;
  expiresAt?: string;
}

interface BackstagePreparation {
  id: string;
  preparationType: 'template' | 'data_fetch' | 'agent_warmup' | 'prediction';
  status: 'pending' | 'ready' | 'used' | 'failed';
  preparationData: Record<string, any>;
  createdAt: string;
}

interface BackstagePanelProps {
  sessionId: string;
  identityId: string;
  onRouting?: (routing: RoutingResult) => void;
  onAgentSuggestion?: (agents: string[]) => void;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const INTENT_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  create: { label: 'Créer', icon: '➕', color: 'emerald' },
  update: { label: 'Modifier', icon: '✏️', color: 'blue' },
  delete: { label: 'Supprimer', icon: '🗑️', color: 'red' },
  search: { label: 'Rechercher', icon: '🔍', color: 'purple' },
  analyze: { label: 'Analyser', icon: '📊', color: 'amber' },
  estimate: { label: 'Estimer', icon: '💰', color: 'yellow' },
  plan: { label: 'Planifier', icon: '📅', color: 'indigo' },
  schedule: { label: 'Rendez-vous', icon: '🗓️', color: 'cyan' },
  report: { label: 'Rapport', icon: '📄', color: 'slate' },
  help: { label: 'Aide', icon: '❓', color: 'gray' },
  unknown: { label: 'Inconnu', icon: '❔', color: 'slate' },
};

const DOMAIN_LABELS: Record<string, { label: string; icon: string }> = {
  immobilier: { label: 'Immobilier', icon: '🏠' },
  construction: { label: 'Construction', icon: '🏗️' },
  finance: { label: 'Finance', icon: '💰' },
  creative: { label: 'Créatif', icon: '🎨' },
  enterprise: { label: 'Entreprise', icon: '💼' },
  general: { label: 'Général', icon: '📁' },
};

const SPHERE_LABELS: Record<string, { label: string; icon: string }> = {
  personal: { label: 'Personnel', icon: '🏠' },
  business: { label: 'Business', icon: '💼' },
  studio: { label: 'Studio', icon: '🎨' },
  community: { label: 'Communauté', icon: '👥' },
};

// ═══════════════════════════════════════════════════════════════
// MOCK FUNCTIONS (would be API calls in production)
// ═══════════════════════════════════════════════════════════════

const analyzeIntent = (text: string): IntentResult => {
  const lowerText = text.toLowerCase();
  const intents = [
    { pattern: /créer|create|nouveau|new|ajouter|add/, intent: 'create' },
    { pattern: /modifier|edit|update|changer|change/, intent: 'update' },
    { pattern: /supprimer|delete|remove|enlever/, intent: 'delete' },
    { pattern: /rechercher|search|trouver|find|chercher/, intent: 'search' },
    { pattern: /analyser|analyze|évaluer|evaluate/, intent: 'analyze' },
    { pattern: /estimer|estimate|calculer|calculate/, intent: 'estimate' },
    { pattern: /planifier|plan|organiser|organize/, intent: 'plan' },
    { pattern: /réunion|meeting|rendez-vous|appointment/, intent: 'schedule' },
    { pattern: /rapport|report|résumé|summary/, intent: 'report' },
    { pattern: /aide|help|comment|how/, intent: 'help' },
  ];
  
  let primaryIntent = 'unknown';
  let confidence = 0.3;
  
  for (const { pattern, intent } of intents) {
    if (pattern.test(lowerText)) {
      primaryIntent = intent;
      confidence = 0.75 + Math.random() * 0.2;
      break;
    }
  }
  
  const entities: { type: string; value: string }[] = [];
  const amountMatch = text.match(/\$?\d+[\d,]*\.?\d*/g);
  if (amountMatch) entities.push(...amountMatch.map(v => ({ type: 'amount', value: v })));
  const dateMatch = text.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/g);
  if (dateMatch) entities.push(...dateMatch.map(v => ({ type: 'date', value: v })));
  
  const suggestedActions = primaryIntent === 'create' 
    ? ['open_form', 'select_template'] 
    : primaryIntent === 'search' 
      ? ['show_results', 'filter_options'] 
      : primaryIntent === 'analyze' 
        ? ['generate_report', 'show_insights'] 
        : [];
  
  return { primary_intent: primaryIntent, confidence, entities, suggested_actions: suggestedActions };
};

const classifyContent = (content: string): ClassificationResult => {
  const lowerContent = content.toLowerCase();
  const domains: string[] = [];
  
  if (/immobilier|property|propriété|loyer|rent|tenant|locataire/.test(lowerContent)) domains.push('immobilier');
  if (/construction|chantier|rénovation|matériaux|rbq|ccq/.test(lowerContent)) domains.push('construction');
  if (/finance|budget|investissement|revenu|dépense/.test(lowerContent)) domains.push('finance');
  if (/créatif|design|art|vidéo|script|storyboard/.test(lowerContent)) domains.push('creative');
  if (/entreprise|business|client|projet|équipe/.test(lowerContent)) domains.push('enterprise');
  
  if (domains.length === 0) domains.push('general');
  
  let category = 'general';
  if (/contrat|contract|accord|agreement/.test(lowerContent)) category = 'contract';
  else if (/facture|invoice|paiement|payment/.test(lowerContent)) category = 'financial';
  else if (/rapport|report|analyse|analysis/.test(lowerContent)) category = 'report';
  else if (/note|memo|mémo/.test(lowerContent)) category = 'note';
  else if (/tâche|task|todo|à faire/.test(lowerContent)) category = 'task';
  
  const tags: string[] = [];
  if (/urgent|priorité|priority|asap/.test(lowerContent)) tags.push('urgent');
  if (/confidentiel|confidential|privé|private/.test(lowerContent)) tags.push('confidential');
  if (/draft|brouillon/.test(lowerContent)) tags.push('draft');
  
  return { 
    category, 
    domains, 
    tags, 
    language: /[àéèêëïîôùûç]/.test(content) ? 'fr' : 'en' 
  };
};

const suggestRouting = (intent: IntentResult, classification: ClassificationResult): RoutingResult => {
  const domain = classification.domains[0] || 'general';
  const sphereMap: Record<string, string> = {
    'immobilier': 'business',
    'construction': 'business',
    'finance': 'business',
    'creative': 'design_studio',
    'enterprise': 'business',
    'general': 'personal'
  };
  const agentMap: Record<string, string[]> = {
    'create': ['assistant', 'specialist'],
    'analyze': ['analyst', 'specialist'],
    'estimate': ['estimator', 'calculator'],
    'schedule': ['scheduler', 'assistant'],
    'report': ['reporter', 'analyst'],
    'search': ['searcher', 'assistant']
  };
  
  return {
    sphere: sphereMap[domain] || 'personal',
    domain,
    agents: agentMap[intent.primary_intent] || ['assistant']
  };
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

const ConfidenceMeter: React.FC<{ confidence: number }> = ({ confidence }) => {
  const percentage = Math.round(confidence * 100);
  const color = percentage > 80 ? 'emerald' : percentage > 60 ? 'amber' : 'red';
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-${color}-500 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`text-xs text-${color}-400`}>{percentage}%</span>
    </div>
  );
};

const IntentCard: React.FC<{ intent: IntentResult }> = ({ intent }) => {
  const info = INTENT_LABELS[intent.primary_intent] || INTENT_LABELS.unknown;
  
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-slate-400">Intent Détecté</h3>
        <ConfidenceMeter confidence={intent.confidence} />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{info.icon}</span>
        <div>
          <div className="font-semibold text-lg">{info.label}</div>
          <div className="text-xs text-slate-500">{intent.primary_intent}</div>
        </div>
      </div>
      
      {intent.entities.length > 0 && (
        <div className="mb-3">
          <div className="text-xs text-slate-400 mb-1">Entités détectées:</div>
          <div className="flex flex-wrap gap-1">
            {intent.entities.map((entity, i) => (
              <span key={i} className="px-2 py-0.5 bg-slate-700 rounded text-xs">
                {entity.type}: {entity.value}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {intent.suggested_actions.length > 0 && (
        <div>
          <div className="text-xs text-slate-400 mb-1">Actions suggérées:</div>
          <div className="flex flex-wrap gap-2">
            {intent.suggested_actions.map(action => (
              <button 
                key={action}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-500 rounded text-xs"
              >
                {action.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ClassificationCard: React.FC<{ classification: ClassificationResult }> = ({ classification }) => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
    <h3 className="font-semibold text-sm text-slate-400 mb-3">Classification</h3>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-xs text-slate-500 mb-1">Catégorie</div>
        <div className="font-medium capitalize">{classification.category}</div>
      </div>
      <div>
        <div className="text-xs text-slate-500 mb-1">Langue</div>
        <div className="font-medium">{classification.language === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}</div>
      </div>
    </div>
    
    {classification.domains.length > 0 && (
      <div className="mt-3">
        <div className="text-xs text-slate-500 mb-1">Domaines</div>
        <div className="flex flex-wrap gap-1">
          {classification.domains.map(domain => {
            const info = DOMAIN_LABELS[domain] || { label: domain, icon: '📁' };
            return (
              <span key={domain} className="px-2 py-1 bg-blue-900/50 border border-blue-700/50 rounded text-xs">
                {info.icon} {info.label}
              </span>
            );
          })}
        </div>
      </div>
    )}
    
    {classification.tags.length > 0 && (
      <div className="mt-3">
        <div className="text-xs text-slate-500 mb-1">Tags</div>
        <div className="flex flex-wrap gap-1">
          {classification.tags.map(tag => (
            <span 
              key={tag} 
              className={`px-2 py-0.5 rounded text-xs ${
                tag === 'urgent' ? 'bg-red-500' : 
                tag === 'confidential' ? 'bg-purple-500' : 'bg-slate-600'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

const RoutingCard: React.FC<{ routing: RoutingResult; onApply?: () => void }> = ({ routing, onApply }) => {
  const sphereInfo = SPHERE_LABELS[routing.sphere] || { label: routing.sphere, icon: '📁' };
  const domainInfo = DOMAIN_LABELS[routing.domain] || { label: routing.domain, icon: '📁' };
  
  return (
    <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/30 rounded-xl border border-amber-700/50 p-4">
      <h3 className="font-semibold text-sm text-amber-400 mb-3">🧭 Routage Suggéré</h3>
      
      <div className="flex items-center gap-4 mb-3">
        <div className="text-center">
          <span className="text-2xl block">{sphereInfo.icon}</span>
          <div className="text-xs text-slate-400">{sphereInfo.label}</div>
        </div>
        <span className="text-slate-500">→</span>
        <div className="text-center">
          <span className="text-2xl block">{domainInfo.icon}</span>
          <div className="text-xs text-slate-400">{domainInfo.label}</div>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="text-xs text-slate-400 mb-1">Agents suggérés</div>
        <div className="flex flex-wrap gap-1">
          {routing.agents.map(agent => (
            <span key={agent} className="px-2 py-1 bg-slate-700 rounded text-xs">
              🤖 {agent}
            </span>
          ))}
        </div>
      </div>
      
      {onApply && (
        <button 
          onClick={onApply}
          className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium"
        >
          Appliquer le routage
        </button>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const BackstagePanel: React.FC<BackstagePanelProps> = ({
  sessionId,
  identityId,
  onRouting,
  onAgentSuggestion
}) => {
  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [intent, setIntent] = useState<IntentResult | null>(null);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [routing, setRouting] = useState<RoutingResult | null>(null);
  const [contexts, setContexts] = useState<BackstageContext[]>([]);
  
  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setAnalyzing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const intentResult = analyzeIntent(inputText);
    const classificationResult = classifyContent(inputText);
    const routingResult = suggestRouting(intentResult, classificationResult);
    
    setIntent(intentResult);
    setClassification(classificationResult);
    setRouting(routingResult);
    
    onAgentSuggestion?.(routingResult.agents);
    
    setAnalyzing(false);
  };
  
  const handleApplyRouting = () => {
    if (routing) {
      onRouting?.(routing);
    }
  };
  
  const handleClear = () => {
    setInputText('');
    setIntent(null);
    setClassification(null);
    setRouting(null);
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>🧠</span>
          <span>Backstage Intelligence</span>
        </h1>
        <p className="text-slate-400">Couche cognitive invisible pour l'analyse de contexte et le routage</p>
      </div>
      
      {/* Input Section */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-slate-400">📝</span>
          <span className="text-sm text-slate-400">Entrez du texte pour analyse</span>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ex: Créer une estimation pour le projet de rénovation de la cuisine..."
          className="w-full h-24 bg-slate-700/50 rounded-lg p-3 text-sm resize-none outline-none focus:ring-2 focus:ring-amber-500/50"
        />
        <div className="flex justify-end gap-2 mt-2">
          {(intent || classification) && (
            <button 
              onClick={handleClear}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
            >
              Effacer
            </button>
          )}
          <button 
            onClick={handleAnalyze}
            disabled={!inputText.trim() || analyzing}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg text-sm flex items-center gap-2"
          >
            {analyzing ? (
              <>
                <span className="animate-spin">⚙️</span>
                Analyse...
              </>
            ) : (
              <>
                <span>🔍</span>
                Analyser
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Results Grid */}
      {(intent || classification || routing) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {intent && <IntentCard intent={intent} />}
          {classification && <ClassificationCard classification={classification} />}
          {routing && <RoutingCard routing={routing} onApply={handleApplyRouting} />}
        </div>
      )}
      
      {/* Contexts History */}
      {contexts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">📚 Contextes Récents</h2>
          <div className="space-y-2">
            {contexts.map(ctx => (
              <div key={ctx.id} className="bg-slate-800 rounded-lg border border-slate-700 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{ctx.contextType}</span>
                  <span className="text-xs text-slate-500">
                    {new Date(ctx.createdAt).toLocaleString('fr-CA')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Info Footer */}
      <div className="mt-8 text-center text-sm text-slate-500">
        <p>🔒 Le Backstage Intelligence opère de manière invisible pour optimiser votre expérience</p>
        <p className="mt-1">Analyse • Classification • Routage • Préparation</p>
      </div>
    </div>
  );
};

export default BackstagePanel;
