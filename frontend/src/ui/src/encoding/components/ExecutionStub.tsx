/**
 * CHE·NU Execution Stub Component
 * Simulates agent execution without actual LLM call
 */

import React, { useState } from 'react';
import {
  SemanticEncoding,
  AgentEncodingSpec,
  ExecutionResult,
} from '../../../../sdk/core/encoding';
import { checkCompatibility } from '../../../../sdk/core/encoding';

interface ExecutionStubProps {
  encoding: SemanticEncoding;
  agent?: AgentEncodingSpec | null;
  human: string;
  locked: boolean;
  onExecute?: (result: ExecutionResult) => void;
}

export const ExecutionStub: React.FC<ExecutionStubProps> = ({
  encoding,
  agent,
  human,
  locked,
  onExecute,
}) => {
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);

  // Check if execution is allowed
  const canExecute = (() => {
    if (!agent) return { ok: false, reason: 'Aucun agent sélectionné' };
    if (!human.trim()) return { ok: false, reason: 'Aucun texte fourni' };

    const compat = checkCompatibility(encoding, agent);
    if (!compat.compatible) {
      return { ok: false, reason: compat.issues[0]?.message || 'Agent incompatible' };
    }

    if (encoding.SCOPE === 'LOCK' && !locked) {
      return { ok: false, reason: 'SCOPE LOCK requiert le verrouillage activé' };
    }

    return { ok: true };
  })();

  const handleExecute = async () => {
    if (!canExecute.ok || !agent) return;

    setExecuting(true);
    setResult(null);

    // Simulate execution delay
    const startTime = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));
    const duration = Date.now() - startTime;

    // Generate mock result
    const mockResult: ExecutionResult = {
      success: true,
      threadId: `thread_${Date.now()}`,
      agentId: agent.id,
      encoding,
      timestamp: new Date().toISOString(),
      duration,
      tokensUsed: Math.floor(150 + Math.random() * 200),
      output: generateMockOutput(encoding, agent, human),
      trace: encoding.TRACE === 1 ? generateMockTrace(encoding, agent) : undefined,
    };

    setResult(mockResult);
    setExecuting(false);
    onExecute?.(mockResult);
  };

  return (
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 16,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          background: '#f5f5f5',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>⚡ Exécution</div>
          <div style={{ fontSize: 11, color: '#666' }}>
            {agent ? `Agent: ${agent.name}` : 'Aucun agent sélectionné'}
          </div>
        </div>

        <button
          onClick={handleExecute}
          disabled={!canExecute.ok || executing}
          style={{
            padding: '8px 16px',
            fontSize: 12,
            fontWeight: 600,
            border: 'none',
            borderRadius: 6,
            background: canExecute.ok ? '#22c55e' : '#9ca3af',
            color: '#fff',
            cursor: canExecute.ok && !executing ? 'pointer' : 'not-allowed',
          }}
        >
          {executing ? 'Exécution...' : '▶ Exécuter (Stub)'}
        </button>
      </div>

      {/* Status / Error */}
      {!canExecute.ok && (
        <div
          style={{
            padding: '8px 16px',
            fontSize: 12,
            color: '#dc2626',
            background: '#fef2f2',
          }}
        >
          ⚠️ {canExecute.reason}
        </div>
      )}

      {/* Executing animation */}
      {executing && (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <div
            style={{
              width: 40,
              height: 40,
              margin: '0 auto 12px',
              border: '3px solid #e0e0e0',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style>
            {`@keyframes spin { to { transform: rotate(360deg); } }`}
          </style>
          <div style={{ fontSize: 13, color: '#666' }}>
            Exécution de {agent?.name}...
          </div>
        </div>
      )}

      {/* Result */}
      {result && !executing && (
        <div style={{ padding: 16 }}>
          {/* Meta */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              marginBottom: 12,
              fontSize: 11,
              color: '#666',
            }}
          >
            <span>✓ {result.duration}ms</span>
            <span>📊 {result.tokensUsed} tokens</span>
            <span>🕐 {new Date(result.timestamp).toLocaleTimeString()}</span>
          </div>

          {/* Output */}
          <div
            style={{
              padding: 12,
              background: '#f5f5f5',
              borderRadius: 6,
              fontSize: 13,
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              maxHeight: 200,
              overflow: 'auto',
            }}
          >
            {result.output}
          </div>

          {/* Trace */}
          {result.trace && (
            <details style={{ marginTop: 12 }}>
              <summary
                style={{
                  fontSize: 11,
                  color: '#666',
                  cursor: 'pointer',
                }}
              >
                🔍 Trace ({result.trace.length} étapes)
              </summary>
              <ul
                style={{
                  margin: '8px 0 0 0',
                  padding: '0 0 0 16px',
                  fontSize: 11,
                  color: '#666',
                }}
              >
                {result.trace.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
};

// Mock output generator
function generateMockOutput(
  encoding: SemanticEncoding,
  agent: AgentEncodingSpec,
  human: string
): string {
  const outputs: Record<string, string> = {
    SUM: `**Résumé**\n\nPoints clés du contenu fourni:\n\n1. Sujet principal: ${human.slice(0, 50)}...\n2. Éléments importants identifiés\n3. Prochaines étapes recommandées\n\n[Sortie stub - exécution réelle requiert LLM]`,
    ANA: `**Rapport d'analyse**\n\n**Risques identifiés:**\n- Délais potentiels\n- Contraintes de ressources\n\n**Décisions requises:**\n- Approbation phase 2\n- Allocation budget\n\n**Recommandations:**\n- Procéder avec prudence\n- Planifier revue parties prenantes\n\n[Sortie stub - exécution réelle requiert LLM]`,
    EXT: `**Informations extraites**\n\n- Élément 1: ${human.slice(0, 30)}...\n- Élément 2: Donnée clé\n- Élément 3: Détail de support\n\n[Sortie stub - exécution réelle requiert LLM]`,
    STR: `**Sortie structurée**\n\n## Section 1\n- Point A\n- Point B\n\n## Section 2\n- Point C\n- Point D\n\n[Sortie stub - exécution réelle requiert LLM]`,
    CMP: `**Résultats comparaison**\n\n| Aspect | Option A | Option B |\n|--------|----------|----------|\n| Coût | Moyen | Élevé |\n| Temps | Rapide | Lent |\n| Risque | Faible | Moyen |\n\n[Sortie stub - exécution réelle requiert LLM]`,
    VER: `**Vérification**\n\n✓ Conformité RBQ: OK\n✓ Conformité CNESST: OK\n⚠ CCQ: Vérification requise\n\n[Sortie stub - exécution réelle requiert LLM]`,
  };

  return outputs[encoding.ACT] || `[Sortie stub pour ${encoding.ACT}]`;
}

// Mock trace generator
function generateMockTrace(
  encoding: SemanticEncoding,
  agent: AgentEncodingSpec
): string[] {
  return [
    `[${new Date().toISOString()}] Agent ${agent.id} initialisé`,
    `[+100ms] Parsing encodage: ACT=${encoding.ACT}, SCOPE=${encoding.SCOPE}`,
    `[+150ms] Validation compatibilité: OK`,
    `[+200ms] Traitement entrée (source ${encoding.SRC})`,
    `[+500ms] Application focus: ${encoding.FOCUS?.join(', ') || 'aucun'}`,
    `[+800ms] Génération sortie`,
    `[+1200ms] Contrôle qualité: PASS`,
    `[+1500ms] Exécution terminée`,
  ];
}

export default ExecutionStub;
