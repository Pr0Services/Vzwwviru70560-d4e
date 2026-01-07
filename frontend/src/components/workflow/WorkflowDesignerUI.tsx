/* ═══════════════════════════════════════════════════════════════════════════════
   CHE·NU™ — WORKFLOW DESIGNER UI
   Chat-like interface for AI workflow design
   ═══════════════════════════════════════════════════════════════════════════════ */

import React, { useState, useRef, useEffect } from 'react';
import type { Workflow } from './types';
import { designWorkflow, analyzeIntent, type IntentAnalysis, type Locale } from './WorkflowDesignerAgent';

// ════════════════════════════════════════════════════════════════════════════════
// PALETTE CHE·NU
// ════════════════════════════════════════════════════════════════════════════════

const COLORS = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
  background: '#0c0a09',
  cardBg: '#111113',
  border: 'rgba(141, 131, 113, 0.2)',
};

// ════════════════════════════════════════════════════════════════════════════════
// LOCALIZED STRINGS
// ════════════════════════════════════════════════════════════════════════════════

const STRINGS: Record<Locale, Record<string, string>> = {
  en: {
    title: 'Workflow Designer',
    subtitle: 'Describe what you want to automate',
    placeholder: 'Example: "Every morning, summarize my unread emails and create a task for urgent ones"',
    designing: 'Designing your workflow...',
    analyze: 'Analyzing...',
    generate: 'Generate Workflow',
    edit: 'Edit in Builder',
    activate: 'Activate',
    newDesign: 'New Design',
    detectedTriggers: 'Detected triggers',
    detectedActions: 'Detected actions',
    needsAI: 'AI processing needed',
    complexity: 'Complexity',
    estimatedCost: 'Est. cost/run',
    suggestions: 'Suggestions',
    preview: 'Preview',
    welcome: 'Hi! I\'m your Workflow Designer. Tell me what you want to automate, and I\'ll create a workflow for you.',
    examples: 'Try these examples:',
    example1: '"Send me a notification when a file is uploaded"',
    example2: '"Every day at 9am, summarize my tasks"',
    example3: '"When a meeting ends, create a summary and send it to participants"',
  },
  fr: {
    title: 'Concepteur de Workflow',
    subtitle: 'Décrivez ce que vous voulez automatiser',
    placeholder: 'Exemple: "Chaque matin, résumer mes emails non lus et créer une tâche pour les urgents"',
    designing: 'Conception de votre workflow...',
    analyze: 'Analyse...',
    generate: 'Générer le Workflow',
    edit: 'Modifier dans le Builder',
    activate: 'Activer',
    newDesign: 'Nouveau design',
    detectedTriggers: 'Déclencheurs détectés',
    detectedActions: 'Actions détectées',
    needsAI: 'Traitement IA nécessaire',
    complexity: 'Complexité',
    estimatedCost: 'Coût est./exéc.',
    suggestions: 'Suggestions',
    preview: 'Aperçu',
    welcome: 'Bonjour! Je suis votre Concepteur de Workflow. Dites-moi ce que vous voulez automatiser, et je créerai un workflow pour vous.',
    examples: 'Essayez ces exemples:',
    example1: '"M\'envoyer une notification quand un fichier est uploadé"',
    example2: '"Chaque jour à 9h, résumer mes tâches"',
    example3: '"Quand une réunion se termine, créer un résumé et l\'envoyer aux participants"',
  },
  es: {
    title: 'Diseñador de Flujo de Trabajo',
    subtitle: 'Describe lo que quieres automatizar',
    placeholder: 'Ejemplo: "Cada mañana, resumir mis correos no leídos y crear una tarea para los urgentes"',
    designing: 'Diseñando su flujo de trabajo...',
    analyze: 'Analizando...',
    generate: 'Generar Flujo de Trabajo',
    edit: 'Editar en el Constructor',
    activate: 'Activar',
    newDesign: 'Nuevo diseño',
    detectedTriggers: 'Disparadores detectados',
    detectedActions: 'Acciones detectadas',
    needsAI: 'Procesamiento IA necesario',
    complexity: 'Complejidad',
    estimatedCost: 'Costo est./ejec.',
    suggestions: 'Sugerencias',
    preview: 'Vista previa',
    welcome: '¡Hola! Soy su Diseñador de Flujo de Trabajo. Dígame qué quiere automatizar y crearé un flujo de trabajo para usted.',
    examples: 'Pruebe estos ejemplos:',
    example1: '"Enviarme una notificación cuando se suba un archivo"',
    example2: '"Cada día a las 9am, resumir mis tareas"',
    example3: '"Cuando termine una reunión, crear un resumen y enviarlo a los participantes"',
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    backgroundColor: COLORS.background,
  },
  
  header: {
    padding: '20px 24px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: COLORS.softSand,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  
  subtitle: {
    fontSize: '13px',
    color: COLORS.ancientStone,
    marginTop: '4px',
  },
  
  chatArea: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  
  welcomeCard: {
    padding: '20px',
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
  },
  
  welcomeText: {
    fontSize: '14px',
    color: COLORS.softSand,
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  
  examplesTitle: {
    fontSize: '12px',
    fontWeight: 600,
    color: COLORS.ancientStone,
    marginBottom: '10px',
  },
  
  exampleItem: {
    padding: '10px 14px',
    backgroundColor: COLORS.background,
    borderRadius: '8px',
    fontSize: '12px',
    color: COLORS.cenoteTurquoise,
    marginBottom: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    border: `1px solid transparent`,
  },
  
  analysisCard: {
    padding: '16px',
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${COLORS.border}`,
  },
  
  analysisGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginTop: '12px',
  },
  
  analysisStat: {
    padding: '10px 12px',
    backgroundColor: COLORS.background,
    borderRadius: '8px',
  },
  
  statLabel: {
    fontSize: '10px',
    fontWeight: 600,
    color: COLORS.ancientStone,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  
  statValue: {
    fontSize: '13px',
    color: COLORS.softSand,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap' as const,
  },
  
  badge: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 500,
  },
  
  resultCard: {
    padding: '20px',
    backgroundColor: COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${COLORS.jungleEmerald}40`,
  },
  
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  
  resultIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: `${COLORS.jungleEmerald}30`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  
  resultTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: COLORS.softSand,
  },
  
  resultDescription: {
    fontSize: '13px',
    color: COLORS.ancientStone,
  },
  
  resultActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px',
  },
  
  inputArea: {
    padding: '16px 24px 24px',
    borderTop: `1px solid ${COLORS.border}`,
  },
  
  inputWrapper: {
    display: 'flex',
    gap: '12px',
  },
  
  textarea: {
    flex: 1,
    padding: '14px 16px',
    fontSize: '14px',
    backgroundColor: COLORS.cardBg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '12px',
    color: COLORS.softSand,
    resize: 'none' as const,
    outline: 'none',
    minHeight: '52px',
    maxHeight: '120px',
    fontFamily: 'inherit',
  },
  
  submitButton: {
    padding: '14px 20px',
    fontSize: '14px',
    fontWeight: 600,
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.15s ease',
  },
  
  actionButton: {
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: 500,
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.15s ease',
  },
  
  loadingDots: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
  
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: COLORS.sacredGold,
    animation: 'pulse 1.4s infinite ease-in-out',
  },
};

// ════════════════════════════════════════════════════════════════════════════════
// PROPS
// ════════════════════════════════════════════════════════════════════════════════

interface WorkflowDesignerUIProps {
  onWorkflowGenerated: (workflow: Workflow) => void;
  onEditWorkflow: (workflow: Workflow) => void;
  locale?: Locale;
}

// ════════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export const WorkflowDesignerUI: React.FC<WorkflowDesignerUIProps> = ({
  onWorkflowGenerated,
  onEditWorkflow,
  locale = 'fr',
}) => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<IntentAnalysis | null>(null);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<Workflow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  
  const strings = STRINGS[locale];
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);
  
  // Scroll to bottom on new content
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [analysis, generatedWorkflow]);
  
  // Handle input change with live analysis
  const handleInputChange = (value: string) => {
    setInput(value);
    
    // Live analysis after typing stops
    if (value.length > 20) {
      const timer = setTimeout(() => {
        setAnalysis(analyzeIntent(value));
      }, 500);
      return () => clearTimeout(timer);
    }
  };
  
  // Handle generate
  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await designWorkflow({
        description: input,
        locale,
      });
      
      if (result.success && result.workflow) {
        setGeneratedWorkflow(result.workflow);
        setSuggestions(result.suggestions || []);
        setEstimatedCost(result.estimatedTokenCost || null);
        onWorkflowGenerated(result.workflow);
      } else {
        setError(result.explanation);
        setSuggestions(result.suggestions || []);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle example click
  const handleExampleClick = (example: string) => {
    // Remove quotes from example
    const cleanExample = example.replace(/^"|"$/g, '');
    setInput(cleanExample);
    setAnalysis(analyzeIntent(cleanExample));
  };
  
  // Handle new design
  const handleNewDesign = () => {
    setInput('');
    setAnalysis(null);
    setGeneratedWorkflow(null);
    setError(null);
    setSuggestions([]);
    setEstimatedCost(null);
  };
  
  // Get complexity color
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return COLORS.jungleEmerald;
      case 'medium': return COLORS.sacredGold;
      case 'complex': return COLORS.earthEmber;
      default: return COLORS.ancientStone;
    }
  };
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          🤖 {strings.title}
        </div>
        <div style={styles.subtitle}>{strings.subtitle}</div>
      </div>
      
      {/* Chat Area */}
      <div ref={chatAreaRef} style={styles.chatArea}>
        {/* Welcome Card */}
        {!analysis && !generatedWorkflow && (
          <div style={styles.welcomeCard}>
            <div style={styles.welcomeText}>{strings.welcome}</div>
            <div style={styles.examplesTitle}>{strings.examples}</div>
            {[strings.example1, strings.example2, strings.example3].map((example, idx) => (
              <div
                key={idx}
                style={styles.exampleItem}
                onClick={() => handleExampleClick(example)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORS.cenoteTurquoise;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                {example}
              </div>
            ))}
          </div>
        )}
        
        {/* Analysis Card */}
        {analysis && !generatedWorkflow && (
          <div style={styles.analysisCard}>
            <div style={{ fontSize: '13px', color: COLORS.softSand, marginBottom: '4px' }}>
              "{input}"
            </div>
            <div style={styles.analysisGrid}>
              <div style={styles.analysisStat}>
                <div style={styles.statLabel}>{strings.detectedTriggers}</div>
                <div style={styles.statValue}>
                  {analysis.triggers.map(t => (
                    <span
                      key={t}
                      style={{
                        ...styles.badge,
                        backgroundColor: `${COLORS.jungleEmerald}30`,
                        color: COLORS.jungleEmerald,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div style={styles.analysisStat}>
                <div style={styles.statLabel}>{strings.detectedActions}</div>
                <div style={styles.statValue}>
                  {analysis.actions.length > 0 ? analysis.actions.map(a => (
                    <span
                      key={a}
                      style={{
                        ...styles.badge,
                        backgroundColor: `${COLORS.cenoteTurquoise}30`,
                        color: COLORS.cenoteTurquoise,
                      }}
                    >
                      {a}
                    </span>
                  )) : '—'}
                </div>
              </div>
              <div style={styles.analysisStat}>
                <div style={styles.statLabel}>{strings.needsAI}</div>
                <div style={styles.statValue}>
                  {analysis.aiAgentNeeded ? '✅ Yes' : '❌ No'}
                </div>
              </div>
              <div style={styles.analysisStat}>
                <div style={styles.statLabel}>{strings.complexity}</div>
                <div style={styles.statValue}>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: `${getComplexityColor(analysis.complexity)}30`,
                      color: getComplexityColor(analysis.complexity),
                    }}
                  >
                    {analysis.complexity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Error */}
        {error && (
          <div style={{
            ...styles.analysisCard,
            borderColor: '#C53030',
          }}>
            <div style={{ color: '#FC8181', fontSize: '14px' }}>⚠️ {error}</div>
            {suggestions.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <div style={styles.statLabel}>{strings.suggestions}</div>
                {suggestions.map((s, i) => (
                  <div key={i} style={{ fontSize: '13px', color: COLORS.ancientStone, marginTop: '4px' }}>
                    • {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Generated Workflow */}
        {generatedWorkflow && (
          <div style={styles.resultCard}>
            <div style={styles.resultHeader}>
              <div style={styles.resultIcon}>✅</div>
              <div>
                <div style={styles.resultTitle}>
                  {locale === 'fr' && generatedWorkflow.nameFr 
                    ? generatedWorkflow.nameFr 
                    : locale === 'es' && (generatedWorkflow as any).nameEs
                    ? (generatedWorkflow as any).nameEs
                    : generatedWorkflow.name}
                </div>
                <div style={styles.resultDescription}>
                  {generatedWorkflow.nodes.length} nodes • {generatedWorkflow.edges.length} connections
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
              {estimatedCost && (
                <div style={{ fontSize: '12px', color: COLORS.ancientStone }}>
                  💰 {strings.estimatedCost}: {estimatedCost} tokens
                </div>
              )}
            </div>
            
            {/* Mini preview of nodes */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px',
              marginBottom: '16px',
            }}>
              {generatedWorkflow.nodes.map(node => (
                <div
                  key={node.id}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: `${node.color}20`,
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: COLORS.softSand,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {node.icon} {locale === 'fr' && node.labelFr 
                    ? node.labelFr 
                    : locale === 'es' && (node as any).labelEs
                    ? (node as any).labelEs
                    : node.label}
                </div>
              ))}
            </div>
            
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={styles.statLabel}>💡 {strings.suggestions}</div>
                {suggestions.map((s, i) => (
                  <div key={i} style={{ fontSize: '12px', color: COLORS.ancientStone, marginTop: '4px' }}>
                    • {s}
                  </div>
                ))}
              </div>
            )}
            
            {/* Actions */}
            <div style={styles.resultActions}>
              <button
                style={{
                  ...styles.actionButton,
                  backgroundColor: COLORS.sacredGold,
                  color: COLORS.uiSlate,
                }}
                onClick={() => onEditWorkflow(generatedWorkflow)}
              >
                ✏️ {strings.edit}
              </button>
              <button
                style={{
                  ...styles.actionButton,
                  backgroundColor: COLORS.jungleEmerald,
                  color: COLORS.softSand,
                }}
              >
                ▶️ {strings.activate}
              </button>
              <button
                style={{
                  ...styles.actionButton,
                  backgroundColor: COLORS.background,
                  color: COLORS.softSand,
                  border: `1px solid ${COLORS.border}`,
                }}
                onClick={handleNewDesign}
              >
                🔄 {strings.newDesign}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div style={styles.inputArea}>
        <div style={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            style={styles.textarea}
            placeholder={strings.placeholder}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            disabled={isGenerating}
          />
          <button
            style={{
              ...styles.submitButton,
              backgroundColor: isGenerating ? COLORS.ancientStone : COLORS.sacredGold,
              color: COLORS.uiSlate,
              opacity: !input.trim() || isGenerating ? 0.6 : 1,
              cursor: !input.trim() || isGenerating ? 'not-allowed' : 'pointer',
            }}
            onClick={handleGenerate}
            disabled={!input.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <span style={styles.loadingDots}>
                  <span style={{ ...styles.dot, animationDelay: '0s' }} />
                  <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
                  <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
                </span>
              </>
            ) : (
              <>
                ✨ {strings.generate}
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export default WorkflowDesignerUI;
