/**
 * CHE·NU Encoding Studio Page
 * Main page for semantic encoding operations
 * 
 * Features:
 * - Thread search & filtering
 * - Preset selector
 * - Scope Lock governance
 * - Budget tracking
 * - Execution stub
 * - Agent compatibility
 */

import React, { useState, useMemo } from 'react';
import {
  SemanticEncoding,
  AgentEncodingSpec,
  ThreadSummary,
  ExecutionResult,
} from '../../../../sdk/core/encoding/encoding_types';
import {
  computeEQSFull,
  optimizeEncodingFull,
  toBinary,
  estimateTokens,
  createThread,
  DEFAULT_ENCODING_AGENTS,
} from '../../../../sdk/core/encoding';
import { EncodingForm } from '../components/EncodingForm';
import { EQSDisplay } from '../components/EQSDisplay';
import { PresetSelector } from '../components/PresetSelector';
import { AgentSelector } from '../components/AgentSelector';
import { ScopeLock } from '../components/ScopeLock';
import { ExecutionStub } from '../components/ExecutionStub';
import { Budget, DEFAULT_BUDGET, BudgetConfig } from '../components/Budget';
import { ThreadSidebar } from '../components/ThreadSidebar';

const DEFAULT_ENCODING: SemanticEncoding = {
  ACT: 'SUM',
  SRC: 'DOC',
  SCOPE: 'SEL',
  MODE: 'ANA',
  FOCUS: ['RISK', 'NEXT'],
  TRACE: 1,
};

interface EncodingStudioPageProps {
  sphereId?: string;
  projectId?: string;
  onThreadCreated?: (threadId: string) => void;
}

export const EncodingStudioPage: React.FC<EncodingStudioPageProps> = ({
  sphereId = 'construction',
  projectId,
  onThreadCreated,
}) => {
  // State
  const [human, setHuman] = useState('');
  const [encoding, setEncoding] = useState<SemanticEncoding>(DEFAULT_ENCODING);
  const [optimizedEncoding, setOptimizedEncoding] = useState<SemanticEncoding | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentEncodingSpec | null>(null);
  const [expertMode, setExpertMode] = useState(true);
  const [scopeLocked, setScopeLocked] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [budget, setBudget] = useState<BudgetConfig>({ ...DEFAULT_BUDGET, sphereId });
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(undefined);

  // Computed values
  const activeEncoding = optimizedEncoding ?? encoding;
  const humanTokens = estimateTokens(human);

  const eqs = useMemo(() => {
    if (!human) return null;
    return computeEQSFull(humanTokens, 50, activeEncoding);
  }, [human, activeEncoding, humanTokens]);

  const binary = useMemo(() => {
    return optimizedEncoding ? toBinary(optimizedEncoding) : null;
  }, [optimizedEncoding]);

  // Handlers
  const handleOptimize = () => {
    const result = optimizeEncodingFull(encoding);
    setOptimizedEncoding(result.optimized);
    setStatus({ type: 'success', message: `Optimisé! ${result.changes.length} changements, ${result.tokensReduced} tokens économisés` });
  };

  const handleSave = () => {
    try {
      const thread = createThread({
        human,
        encoding,
        optimized: optimizedEncoding ?? undefined,
        sphereId,
        projectId,
      });
      
      // Add to threads list
      const summary: ThreadSummary = {
        id: thread.id,
        state: thread.state,
        eqs: thread.eqs,
        versions: thread.versions.length,
        sphereId: thread.sphereId,
        created_at: thread.created_at,
        updated_at: thread.updated_at,
      };
      setThreads(prev => [summary, ...prev]);
      setSelectedThreadId(thread.id);
      
      setStatus({ type: 'success', message: `Thread sauvegardé: ${thread.id}` });
      onThreadCreated?.(thread.id);
    } catch (e: unknown) {
      setStatus({ type: 'error', message: e.message });
    }
  };

  const handleReset = () => {
    setHuman('');
    setEncoding(DEFAULT_ENCODING);
    setOptimizedEncoding(null);
    setSelectedAgent(null);
    setScopeLocked(false);
    setStatus(null);
    setSelectedThreadId(undefined);
  };

  const handleExecution = (result: ExecutionResult) => {
    // Update budget
    setBudget(prev => ({
      ...prev,
      used: prev.used + result.tokensUsed,
    }));
    setStatus({ type: 'success', message: `Exécuté: ${result.tokensUsed} tokens utilisés` });
  };

  const handleThreadSelect = (thread: ThreadSummary) => {
    setSelectedThreadId(thread.id);
    // In a real app, we'd load the full thread data here
    setStatus({ type: 'info', message: `Thread sélectionné: ${thread.id}` });
  };

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      background: '#f5f5f5',
    }}>
      {/* Sidebar */}
      <ThreadSidebar
        threads={threads}
        onSelect={handleThreadSelect}
        selectedId={selectedThreadId}
        sphereId={sphereId}
      />

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '12px 20px',
          background: '#fff',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              🏠 CHE·NU Encoding Studio
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
              Semantic Encoding System v1.1
              {sphereId && <span> • {sphereId}</span>}
              {projectId && <span> • {projectId}</span>}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={expertMode}
                onChange={(e) => setExpertMode(e.target.checked)}
              />
              Mode Expert
            </label>
            <button
              onClick={handleReset}
              style={{
                padding: '6px 12px',
                fontSize: 12,
                border: '1px solid #e0e0e0',
                borderRadius: 6,
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Status */}
        {status && (
          <div style={{
            padding: '8px 20px',
            fontSize: 12,
            background: status.type === 'error' ? '#fee2e2' : status.type === 'success' ? '#dcfce7' : '#e0f2fe',
            color: status.type === 'error' ? '#dc2626' : status.type === 'success' ? '#166534' : '#0369a1',
          }}>
            {status.message}
          </div>
        )}

        {/* Main Content - 3 Panes */}
        <div style={{
          flex: 1,
          display: 'flex',
          gap: 12,
          padding: 12,
          overflow: 'hidden',
        }}>
          {/* Pane 1: Human Input */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            borderRadius: 8,
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 16px',
              background: '#f8fafc',
              borderBottom: '1px solid #e0e0e0',
              fontWeight: 600,
              fontSize: 14,
            }}>
              L0 — Human Intent
            </div>
            <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
              {/* Budget */}
              <Budget
                config={budget}
                estimatedTokens={humanTokens + 50}
                onConfigChange={setBudget}
              />

              <textarea
                value={human}
                onChange={(e) => setHuman(e.target.value)}
                placeholder="Écrivez votre intention en langage naturel..."
                disabled={scopeLocked}
                style={{
                  width: '100%',
                  height: 180,
                  padding: 12,
                  fontSize: 13,
                  border: '1px solid #e0e0e0',
                  borderRadius: 6,
                  resize: 'vertical',
                  background: scopeLocked ? '#f5f5f5' : '#fff',
                }}
              />

              <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
                📊 ~{humanTokens} tokens
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                  onClick={handleOptimize}
                  disabled={!human || scopeLocked}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: 6,
                    background: human && !scopeLocked ? '#3b82f6' : '#d1d5db',
                    color: '#fff',
                    cursor: human && !scopeLocked ? 'pointer' : 'not-allowed',
                  }}
                >
                  ⚡ Optimiser
                </button>
                <button
                  onClick={handleSave}
                  disabled={!human}
                  style={{
                    padding: '10px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    border: '1px solid #22c55e',
                    borderRadius: 6,
                    background: '#f0fdf4',
                    color: '#166534',
                    cursor: human ? 'pointer' : 'not-allowed',
                    opacity: human ? 1 : 0.5,
                  }}
                >
                  💾 Sauvegarder
                </button>
              </div>
            </div>
          </div>

          {/* Pane 2: Encoding */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            borderRadius: 8,
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 16px',
              background: '#f8fafc',
              borderBottom: '1px solid #e0e0e0',
              fontWeight: 600,
              fontSize: 14,
            }}>
              L1 — Semantic Encoding
            </div>
            <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
              {/* Scope Lock */}
              {expertMode && (
                <ScopeLock
                  encoding={encoding}
                  onChange={setEncoding}
                  locked={scopeLocked}
                  onLockChange={setScopeLocked}
                />
              )}

              {/* Presets */}
              <PresetSelector
                onSelect={setEncoding}
                sphereId={sphereId}
                expertMode={expertMode}
              />

              {/* Encoding Form */}
              <EncodingForm
                value={encoding}
                onChange={setEncoding}
                disabled={scopeLocked}
              />

              {/* Agent Selector */}
              {expertMode && (
                <AgentSelector
                  encoding={activeEncoding}
                  selected={selectedAgent}
                  onSelect={setSelectedAgent}
                  sphereId={sphereId}
                />
              )}
            </div>
          </div>

          {/* Pane 3: Results & Execution */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            borderRadius: 8,
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 16px',
              background: '#f8fafc',
              borderBottom: '1px solid #e0e0e0',
              fontWeight: 600,
              fontSize: 14,
            }}>
              Results & Execution
            </div>
            <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
              {/* EQS Display */}
              <EQSDisplay
                eqs={eqs}
                tokens={{ human: humanTokens, encoded: 50 }}
              />

              {/* Execution Stub */}
              {expertMode && (
                <ExecutionStub
                  encoding={activeEncoding}
                  agent={selectedAgent}
                  human={human}
                  locked={scopeLocked}
                  onExecute={handleExecution}
                />
              )}

              {/* Optimized Encoding */}
              {optimizedEncoding && (
                <div style={{ marginTop: 16 }}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#666',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                  }}>
                    Encodage Optimisé
                  </div>
                  <pre style={{
                    padding: 12,
                    background: '#f5f5f5',
                    borderRadius: 6,
                    fontSize: 11,
                    overflow: 'auto',
                  }}>
                    {JSON.stringify(optimizedEncoding, null, 2)}
                  </pre>
                </div>
              )}

              {/* Binary */}
              {binary && (
                <div style={{ marginTop: 16 }}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#666',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                  }}>
                    L2 — Binary
                  </div>
                  <code style={{
                    display: 'block',
                    padding: 12,
                    background: '#1e1e1e',
                    color: '#22c55e',
                    borderRadius: 6,
                    fontSize: 12,
                    fontFamily: 'monospace',
                    wordBreak: 'break-all',
                  }}>
                    {binary}
                  </code>
                </div>
              )}

              {/* Selected Agent */}
              {selectedAgent && (
                <div style={{ marginTop: 16 }}>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#666',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                  }}>
                    Agent Prêt
                  </div>
                  <div style={{
                    padding: 12,
                    background: '#f0fdf4',
                    borderRadius: 6,
                    fontSize: 12,
                  }}>
                    Agent: <strong>{selectedAgent.name}</strong>
                    <br />
                    Level: {selectedAgent.encodingLevel}
                    <br />
                    Actions: {selectedAgent.actions.join(', ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncodingStudioPage;
