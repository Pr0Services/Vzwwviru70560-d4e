/**
 * CHE·NU Encoding System Demo
 * Interactive showcase of the semantic encoding system
 */

import React, { useState } from 'react';
import {
  SemanticEncoding,
  computeEQSFull,
  optimizeEncodingFull,
  toBinary,
  fromBinary,
  validateEncoding,
  estimateTokens,
  createThread,
  findCompatibleAgents,
  getPreset,
  listPresets,
} from '../sdk/core/encoding';

// Demo scenarios
const DEMO_SCENARIOS = [
  {
    id: 'quick-summary',
    name: 'Quick Document Summary',
    human: 'Summarize the key points from the quarterly report, focusing on revenue trends and major achievements.',
    preset: 'quick-summary',
  },
  {
    id: 'meeting-analysis',
    name: 'Meeting Notes Analysis',
    human: 'Review the project kickoff meeting notes. Extract all decisions made, action items assigned, and identify any risks discussed.',
    preset: 'meeting-analysis',
  },
  {
    id: 'compliance-check',
    name: 'Construction Compliance',
    human: 'Verify that the submitted building plans comply with RBQ requirements for commercial construction in Quebec. Flag any deviations from CCQ standards.',
    preset: 'construction-compliance',
  },
  {
    id: 'financial-review',
    name: 'Financial Analysis',
    human: 'Analyze the P&L statements for Q3. Compare against Q2 and identify significant variances. Highlight any risk indicators.',
    preset: 'financial-analysis',
  },
];

export const EncodingDemo: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState(DEMO_SCENARIOS[0]);
  const [encoding, setEncoding] = useState<SemanticEncoding | null>(null);
  const [results, setResults] = useState<{
    validation?: ReturnType<typeof validateEncoding>;
    eqs?: ReturnType<typeof computeEQSFull>;
    optimized?: ReturnType<typeof optimizeEncodingFull>;
    binary?: string;
    agents?: ReturnType<typeof findCompatibleAgents>;
    thread?: ReturnType<typeof createThread>;
  }>({});
  const [step, setStep] = useState(0);

  const runDemo = () => {
    setStep(0);
    setResults({});

    // Get preset
    const preset = getPreset(selectedScenario.preset);
    if (!preset) return;

    setEncoding(preset.encoding);

    // Step by step execution
    const steps = [
      // Step 1: Validate
      () => {
        const validation = validateEncoding(preset.encoding);
        setResults(prev => ({ ...prev, validation }));
        setStep(1);
      },
      // Step 2: Compute EQS
      () => {
        const tokens = estimateTokens(selectedScenario.human);
        const eqs = computeEQSFull(tokens, 50, preset.encoding);
        setResults(prev => ({ ...prev, eqs }));
        setStep(2);
      },
      // Step 3: Optimize
      () => {
        const optimized = optimizeEncodingFull(preset.encoding);
        setResults(prev => ({ ...prev, optimized }));
        setStep(3);
      },
      // Step 4: Binary encode
      () => {
        const binary = toBinary(results.optimized?.optimized || preset.encoding);
        setResults(prev => ({ ...prev, binary }));
        setStep(4);
      },
      // Step 5: Find agents
      () => {
        const agents = findCompatibleAgents(
          results.optimized?.optimized || preset.encoding,
          selectedScenario.preset.includes('construction') ? 'construction' : undefined
        );
        setResults(prev => ({ ...prev, agents }));
        setStep(5);
      },
      // Step 6: Create thread
      () => {
        const thread = createThread({
          human: selectedScenario.human,
          encoding: results.optimized?.optimized || preset.encoding,
          sphereId: selectedScenario.preset.includes('construction') ? 'construction' : 'general',
        });
        setResults(prev => ({ ...prev, thread }));
        setStep(6);
      },
    ];

    // Execute steps with delays
    steps.forEach((stepFn, i) => {
      setTimeout(stepFn, i * 800);
    });
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>🏠 CHE·NU Encoding System Demo</h1>
        <p style={{ color: '#666', marginTop: 8 }}>
          Interactive demonstration of the Semantic Encoding System
        </p>
      </div>

      {/* Scenario Selection */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 12,
        marginBottom: 24,
      }}>
        {DEMO_SCENARIOS.map(scenario => (
          <button
            key={scenario.id}
            onClick={() => setSelectedScenario(scenario)}
            style={{
              padding: 16,
              border: selectedScenario.id === scenario.id
                ? '2px solid #3b82f6'
                : '1px solid #e0e0e0',
              borderRadius: 8,
              background: selectedScenario.id === scenario.id ? '#eff6ff' : '#fff',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{scenario.name}</div>
            <div style={{
              fontSize: 12,
              color: '#666',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {scenario.human}
            </div>
          </button>
        ))}
      </div>

      {/* Run Button */}
      <button
        onClick={runDemo}
        style={{
          padding: '12px 32px',
          fontSize: 14,
          fontWeight: 600,
          border: 'none',
          borderRadius: 8,
          background: '#22c55e',
          color: '#fff',
          cursor: 'pointer',
          marginBottom: 24,
        }}
      >
        ▶ Run Demo
      </button>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Step 1: Validation */}
        <StepCard
          number={1}
          title="Validation"
          active={step >= 1}
          completed={step > 1}
        >
          {results.validation && (
            <div>
              <StatusBadge success={results.validation.valid}>
                {results.validation.valid ? '✓ Valid' : '✗ Invalid'}
              </StatusBadge>
              {results.validation.errors.length > 0 && (
                <ul style={{ margin: '8px 0', paddingLeft: 16 }}>
                  {results.validation.errors.map((e, i) => (
                    <li key={i} style={{ color: '#dc2626', fontSize: 12 }}>{e}</li>
                  ))}
                </ul>
              )}
              {results.validation.warnings.length > 0 && (
                <ul style={{ margin: '8px 0', paddingLeft: 16 }}>
                  {results.validation.warnings.map((w, i) => (
                    <li key={i} style={{ color: '#f59e0b', fontSize: 12 }}>{w}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </StepCard>

        {/* Step 2: EQS */}
        <StepCard
          number={2}
          title="EQS Computation"
          active={step >= 2}
          completed={step > 2}
        >
          {results.eqs && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 12,
              }}>
                <span style={{ fontSize: 32 }}>{results.eqs.emoji}</span>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{results.eqs.score}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{results.eqs.grade}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {Object.entries(results.eqs.breakdown).map(([key, value]) => (
                  <div key={key} style={{
                    padding: 8,
                    background: '#f5f5f5',
                    borderRadius: 6,
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{value}</div>
                    <div style={{ fontSize: 10, color: '#666' }}>{key}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </StepCard>

        {/* Step 3: Optimization */}
        <StepCard
          number={3}
          title="Optimization"
          active={step >= 3}
          completed={step > 3}
        >
          {results.optimized && (
            <div>
              <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>
                {results.optimized.changes.length} changes, ~{results.optimized.tokensReduced} tokens saved
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12 }}>
                {results.optimized.changes.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
              {results.optimized.changes.length === 0 && (
                <div style={{ fontSize: 12, color: '#22c55e' }}>Already optimal!</div>
              )}
            </div>
          )}
        </StepCard>

        {/* Step 4: Binary */}
        <StepCard
          number={4}
          title="Binary Encoding"
          active={step >= 4}
          completed={step > 4}
        >
          {results.binary && (
            <div>
              <code style={{
                display: 'block',
                padding: 12,
                background: '#1e1e1e',
                color: '#22c55e',
                borderRadius: 6,
                fontSize: 16,
                fontFamily: 'monospace',
                letterSpacing: 2,
              }}>
                {results.binary}
              </code>
              <div style={{ marginTop: 8, fontSize: 11, color: '#666' }}>
                {results.binary.length} characters (vs ~{JSON.stringify(encoding).length} JSON)
              </div>
            </div>
          )}
        </StepCard>

        {/* Step 5: Agent Matching */}
        <StepCard
          number={5}
          title="Agent Matching"
          active={step >= 5}
          completed={step > 5}
        >
          {results.agents && (
            <div>
              <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>
                {results.agents.length} compatible agents found
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {results.agents.slice(0, 5).map(agent => (
                  <span
                    key={agent.id}
                    style={{
                      padding: '4px 8px',
                      background: '#eff6ff',
                      borderRadius: 4,
                      fontSize: 12,
                    }}
                  >
                    {agent.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </StepCard>

        {/* Step 6: Thread Created */}
        <StepCard
          number={6}
          title="Thread Created"
          active={step >= 6}
          completed={step >= 6}
        >
          {results.thread && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
                marginBottom: 12,
              }}>
                <InfoBox label="Thread ID" value={results.thread.id} />
                <InfoBox label="State" value={results.thread.state} />
                <InfoBox label="EQS" value={results.thread.eqs.toString()} />
              </div>
              <div style={{
                padding: 8,
                background: '#f5f5f5',
                borderRadius: 6,
                fontSize: 11,
                fontFamily: 'monospace',
                wordBreak: 'break-all',
              }}>
                Binary: {results.thread.binary}
              </div>
            </div>
          )}
        </StepCard>
      </div>

      {/* Current Encoding Display */}
      {encoding && (
        <div style={{ marginTop: 24 }}>
          <h3>Current Encoding</h3>
          <pre style={{
            padding: 16,
            background: '#f5f5f5',
            borderRadius: 8,
            fontSize: 12,
            overflow: 'auto',
          }}>
            {JSON.stringify(results.optimized?.optimized || encoding, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// Step Card Component
const StepCard: React.FC<{
  number: number;
  title: string;
  active: boolean;
  completed: boolean;
  children: React.ReactNode;
}> = ({ number, title, active, completed, children }) => (
  <div style={{
    border: active ? '2px solid #3b82f6' : '1px solid #e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    opacity: active ? 1 : 0.5,
    transition: 'all 0.3s',
  }}>
    <div style={{
      padding: '10px 16px',
      background: completed ? '#22c55e' : active ? '#3b82f6' : '#f5f5f5',
      color: active || completed ? '#fff' : '#333',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}>
      <span style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 600,
      }}>
        {completed ? '✓' : number}
      </span>
      <span style={{ fontWeight: 600 }}>{title}</span>
    </div>
    {active && (
      <div style={{ padding: 16 }}>
        {children}
      </div>
    )}
  </div>
);

// Status Badge
const StatusBadge: React.FC<{ success: boolean; children: React.ReactNode }> = ({
  success,
  children,
}) => (
  <span style={{
    padding: '4px 8px',
    background: success ? '#dcfce7' : '#fee2e2',
    color: success ? '#166534' : '#dc2626',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
  }}>
    {children}
  </span>
);

// Info Box
const InfoBox: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{
    padding: 8,
    background: '#f5f5f5',
    borderRadius: 6,
    textAlign: 'center',
  }}>
    <div style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 12, fontWeight: 600, wordBreak: 'break-all' }}>{value}</div>
  </div>
);

export default EncodingDemo;
