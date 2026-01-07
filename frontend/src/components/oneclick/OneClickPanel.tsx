/**
 * CHE·NU™ OneClick Engine
 * Natural language command processing with workflow automation
 * 
 * @module oneclick
 * @version 33.0
 */

import React, { useState, useRef, useEffect } from 'react';

// Types
interface OneClickWorkflow {
  id: string;
  name: string;
  description: string;
  category: 'document' | 'analysis' | 'creation' | 'automation' | 'communication';
  triggerPatterns: string[];
  estimatedTime: string;
  tokenCost: number;
  requiredInputs: string[];
  outputs: string[];
  icon: string;
}

interface OneClickExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt: string;
  completedAt?: string;
  results?: unknown;
  error?: string;
}

interface IntentMatch {
  workflow: OneClickWorkflow;
  confidence: number;
  matchedPatterns: string[];
}

interface OneClickPanelProps {
  sphereId: string;
  dataspaceId?: string;
  onExecute?: (workflowId: string, inputs: Record<string, any>) => void;
  onClose?: () => void;
}

// Mock workflows
const mockWorkflows: OneClickWorkflow[] = [
  {
    id: 'wf-estimate',
    name: 'Créer Estimation',
    description: 'Génère une estimation de coûts à partir de documents ou descriptions',
    category: 'document',
    triggerPatterns: ['estimate', 'estimation', 'coût', 'budget', 'chiffrer'],
    estimatedTime: '2-5 min',
    tokenCost: 150,
    requiredInputs: ['description', 'documents'],
    outputs: ['spreadsheet', 'summary'],
    icon: '💰'
  },
  {
    id: 'wf-report',
    name: 'Générer Rapport',
    description: 'Crée un rapport professionnel à partir de données et notes',
    category: 'document',
    triggerPatterns: ['report', 'rapport', 'document', 'résumé', 'synthèse'],
    estimatedTime: '3-8 min',
    tokenCost: 200,
    requiredInputs: ['topic', 'data_sources'],
    outputs: ['document', 'presentation'],
    icon: '📄'
  },
  {
    id: 'wf-analyze',
    name: 'Analyser Données',
    description: 'Analyse des données et génère des insights',
    category: 'analysis',
    triggerPatterns: ['analyze', 'analyser', 'étudier', 'comprendre', 'insight'],
    estimatedTime: '1-3 min',
    tokenCost: 100,
    requiredInputs: ['data'],
    outputs: ['analysis', 'charts'],
    icon: '📊'
  },
  {
    id: 'wf-organize',
    name: 'Organiser Portfolio',
    description: 'Organise et structure les documents et données',
    category: 'automation',
    triggerPatterns: ['organize', 'organiser', 'ranger', 'structurer', 'classer'],
    estimatedTime: '1-2 min',
    tokenCost: 50,
    requiredInputs: ['target'],
    outputs: ['organized_structure'],
    icon: '📁'
  },
  {
    id: 'wf-email',
    name: 'Rédiger Communication',
    description: 'Rédige emails, lettres ou communications professionnelles',
    category: 'communication',
    triggerPatterns: ['email', 'écrire', 'rédiger', 'lettre', 'message', 'communiquer'],
    estimatedTime: '30s-2 min',
    tokenCost: 30,
    requiredInputs: ['context', 'recipient'],
    outputs: ['draft'],
    icon: '✉️'
  },
  {
    id: 'wf-pitch',
    name: 'Préparer Pitch',
    description: 'Crée une présentation investisseur ou client',
    category: 'creation',
    triggerPatterns: ['pitch', 'présentation', 'investor', 'deck', 'slides'],
    estimatedTime: '5-10 min',
    tokenCost: 300,
    requiredInputs: ['business_context', 'audience'],
    outputs: ['presentation', 'script'],
    icon: '🎯'
  },
  {
    id: 'wf-contract',
    name: 'Générer Contrat',
    description: 'Crée un contrat ou bail à partir de templates',
    category: 'document',
    triggerPatterns: ['contract', 'contrat', 'bail', 'lease', 'agreement'],
    estimatedTime: '2-4 min',
    tokenCost: 120,
    requiredInputs: ['type', 'parties', 'terms'],
    outputs: ['contract_draft'],
    icon: '📜'
  },
  {
    id: 'wf-schedule',
    name: 'Planifier Tâches',
    description: 'Crée un planning et des tâches à partir d\'objectifs',
    category: 'automation',
    triggerPatterns: ['schedule', 'planifier', 'plan', 'tâches', 'tasks', 'timeline'],
    estimatedTime: '1-2 min',
    tokenCost: 40,
    requiredInputs: ['goals', 'deadline'],
    outputs: ['tasks', 'timeline'],
    icon: '📅'
  },
];

// Category colors
const categoryColors: Record<string, string> = {
  document: 'bg-blue-500',
  analysis: 'bg-purple-500',
  creation: 'bg-pink-500',
  automation: 'bg-emerald-500',
  communication: 'bg-amber-500',
};

// Components
const WorkflowCard: React.FC<{
  workflow: OneClickWorkflow;
  confidence?: number;
  onSelect: () => void;
  selected?: boolean;
}> = ({ workflow, confidence, onSelect, selected }) => (
  <div 
    onClick={onSelect}
    className={`p-4 rounded-xl border transition-all cursor-pointer ${
      selected 
        ? 'bg-amber-900/30 border-amber-500' 
        : 'bg-slate-800 border-slate-700 hover:border-slate-600'
    }`}
  >
    <div className="flex items-start gap-3">
      <span className="text-3xl">{workflow.icon}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{workflow.name}</h3>
          {confidence !== undefined && (
            <span className={`text-xs px-2 py-0.5 rounded ${
              confidence > 0.8 ? 'bg-emerald-500' : confidence > 0.5 ? 'bg-amber-500' : 'bg-slate-500'
            }`}>
              {Math.round(confidence * 100)}%
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400 mt-1">{workflow.description}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
          <span>⏱️ {workflow.estimatedTime}</span>
          <span>🪙 {workflow.tokenCost} tokens</span>
          <span className={`${categoryColors[workflow.category]} px-2 py-0.5 rounded capitalize`}>
            {workflow.category}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const ExecutionProgress: React.FC<{
  execution: OneClickExecution;
  workflow: OneClickWorkflow;
}> = ({ execution, workflow }) => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
    <div className="flex items-center gap-3 mb-4">
      <span className="text-2xl">{workflow.icon}</span>
      <div>
        <h3 className="font-semibold">{workflow.name}</h3>
        <p className="text-sm text-slate-400">
          {execution.status === 'running' ? 'En cours...' : 
           execution.status === 'completed' ? 'Terminé' :
           execution.status === 'failed' ? 'Échec' : 'En attente'}
        </p>
      </div>
      {execution.status === 'running' && (
        <div className="ml-auto animate-spin text-amber-400">⚙️</div>
      )}
      {execution.status === 'completed' && (
        <span className="ml-auto text-emerald-400">✅</span>
      )}
      {execution.status === 'failed' && (
        <span className="ml-auto text-red-400">❌</span>
      )}
    </div>
    
    {/* Progress bar */}
    <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
      <div 
        className={`h-full transition-all ${
          execution.status === 'completed' ? 'bg-emerald-500' :
          execution.status === 'failed' ? 'bg-red-500' : 'bg-amber-500'
        }`}
        style={{ width: `${execution.progress}%` }}
      ></div>
    </div>
    <div className="text-xs text-slate-400">
      {execution.progress}% complété
    </div>
    
    {/* Results */}
    {execution.status === 'completed' && execution.results && (
      <div className="mt-4 pt-4 border-t border-slate-700">
        <h4 className="text-sm font-semibold mb-2">Résultats</h4>
        <div className="flex flex-wrap gap-2">
          {workflow.outputs.map(output => (
            <button key={output} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm">
              📥 {output}
            </button>
          ))}
        </div>
      </div>
    )}
    
    {/* Error */}
    {execution.status === 'failed' && execution.error && (
      <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-sm text-red-300">
        {execution.error}
      </div>
    )}
  </div>
);

// Main Component
const OneClickPanel: React.FC<OneClickPanelProps> = ({
  sphereId,
  dataspaceId,
  onExecute,
  onClose
}) => {
  const [prompt, setPrompt] = useState('');
  const [matches, setMatches] = useState<IntentMatch[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<OneClickWorkflow | null>(null);
  const [execution, setExecution] = useState<OneClickExecution | null>(null);
  const [showAllWorkflows, setShowAllWorkflows] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Intent detection (simple pattern matching, would be ML in production)
  const detectIntent = (text: string): IntentMatch[] => {
    const words = text.toLowerCase().split(/\s+/);
    const results: IntentMatch[] = [];
    
    for (const workflow of mockWorkflows) {
      let matchCount = 0;
      const matchedPatterns: string[] = [];
      
      for (const pattern of workflow.triggerPatterns) {
        if (words.some(w => w.includes(pattern) || pattern.includes(w))) {
          matchCount++;
          matchedPatterns.push(pattern);
        }
      }
      
      if (matchCount > 0) {
        const confidence = Math.min(matchCount / 2, 1);
        results.push({ workflow, confidence, matchedPatterns });
      }
    }
    
    return results.sort((a, b) => b.confidence - a.confidence);
  };
  
  // Handle prompt change
  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrompt(value);
    
    if (value.length >= 3) {
      const detected = detectIntent(value);
      setMatches(detected);
      if (detected.length > 0 && !selectedWorkflow) {
        setSelectedWorkflow(detected[0].workflow);
      }
    } else {
      setMatches([]);
    }
  };
  
  // Execute workflow
  const handleExecute = () => {
    if (!selectedWorkflow) return;
    
    // Create execution
    const exec: OneClickExecution = {
      id: `exec-${Date.now()}`,
      workflowId: selectedWorkflow.id,
      status: 'running',
      progress: 0,
      startedAt: new Date().toISOString()
    };
    setExecution(exec);
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setExecution(prev => prev ? {
          ...prev,
          status: 'completed',
          progress: 100,
          completedAt: new Date().toISOString(),
          results: { success: true }
        } : null);
      } else {
        setExecution(prev => prev ? { ...prev, progress: Math.round(progress) } : null);
      }
    }, 500);
    
    onExecute?.(selectedWorkflow.id, { prompt });
  };
  
  // Reset
  const handleReset = () => {
    setPrompt('');
    setMatches([]);
    setSelectedWorkflow(null);
    setExecution(null);
    inputRef.current?.focus();
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>⚡</span>
            <span>OneClick Engine</span>
          </h1>
          <p className="text-slate-400">Décrivez ce que vous voulez faire en langage naturel</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg">
            ✕
          </button>
        )}
      </div>
      
      {/* Main Input */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💬</span>
          <input
            ref={inputRef}
            type="text"
            value={prompt}
            onChange={handlePromptChange}
            placeholder="Ex: Créer une estimation pour le projet de rénovation..."
            className="flex-1 bg-transparent text-lg placeholder-slate-500 outline-none"
            disabled={!!execution}
          />
          {prompt && !execution && (
            <button onClick={handleReset} className="p-2 hover:bg-slate-700 rounded">
              ✕
            </button>
          )}
        </div>
        
        {/* Quick suggestions */}
        {!prompt && (
          <div className="mt-4 flex flex-wrap gap-2">
            {['Créer estimation', 'Générer rapport', 'Analyser données', 'Organiser portfolio'].map(suggestion => (
              <button
                key={suggestion}
                onClick={() => {
                  setPrompt(suggestion);
                  handlePromptChange({ target: { value: suggestion } } as any);
                }}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-full text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Execution in progress */}
      {execution && selectedWorkflow && (
        <div className="mb-6">
          <ExecutionProgress execution={execution} workflow={selectedWorkflow} />
          {execution.status === 'completed' && (
            <button 
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg"
            >
              Nouvelle commande
            </button>
          )}
        </div>
      )}
      
      {/* Matched workflows */}
      {!execution && matches.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">
            🎯 Workflows suggérés ({matches.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.slice(0, 4).map(match => (
              <WorkflowCard
                key={match.workflow.id}
                workflow={match.workflow}
                confidence={match.confidence}
                selected={selectedWorkflow?.id === match.workflow.id}
                onSelect={() => setSelectedWorkflow(match.workflow)}
              />
            ))}
          </div>
          
          {/* Execute button */}
          {selectedWorkflow && (
            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={handleExecute}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl font-semibold flex items-center gap-2"
              >
                <span>▶️</span>
                Exécuter "{selectedWorkflow.name}"
              </button>
              <span className="text-slate-400">
                🪙 {selectedWorkflow.tokenCost} tokens • ⏱️ {selectedWorkflow.estimatedTime}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* All workflows */}
      <div>
        <button
          onClick={() => setShowAllWorkflows(!showAllWorkflows)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
        >
          <span>{showAllWorkflows ? '▼' : '▶'}</span>
          <span>Tous les workflows ({mockWorkflows.length})</span>
        </button>
        
        {showAllWorkflows && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockWorkflows.map(workflow => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                selected={selectedWorkflow?.id === workflow.id}
                onSelect={() => {
                  setSelectedWorkflow(workflow);
                  setPrompt(workflow.name);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OneClickPanel;
