/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — AGENT BUILDER
 * Phase 8: Advanced AI Features
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { useAgentBuilder } from '../hooks/useAgentBuilder';

export const AgentBuilder: React.FC = () => {
  const { templates, createAgent, estimateCost } = useAgentBuilder();
  const [step, setStep] = useState<'select' | 'configure' | 'preview'>('select');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const [config, setConfig] = useState({
    name: '',
    description: '',
    system_prompt: '',
    max_tokens: 2000,
    temperature: 0.5,
    capabilities: [] as string[],
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.template_id === templateId);
    if (template) {
      setConfig({
        name: '',
        description: template.description,
        system_prompt: template.base_prompt,
        max_tokens: template.max_tokens,
        temperature: template.temperature,
        capabilities: Array.from(template.capabilities),
      });
    }
    setStep('configure');
  };

  const handleCreate = async () => {
    if (!selectedTemplate) return;
    await createAgent(selectedTemplate, config.name, config);
  };

  const cost = selectedTemplate ? estimateCost(config.max_tokens) : null;

  return (
    <div className="agent-builder">
      {/* Progress Steps */}
      <div className="steps">
        <div className={`step ${step === 'select' ? 'active' : step !== 'select' ? 'completed' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">Choisir Template</span>
        </div>
        <div className={`step ${step === 'configure' ? 'active' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">Configurer</span>
        </div>
        <div className={`step ${step === 'preview' ? 'active' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Aperçu</span>
        </div>
      </div>

      {/* Step 1: Select Template */}
      {step === 'select' && (
        <div className="template-selection">
          <h2>Choisir un Template d'Agent</h2>
          <div className="templates-grid">
            {templates.map((template) => (
              <div
                key={template.template_id}
                className="template-card"
                onClick={() => handleTemplateSelect(template.template_id)}
              >
                <div className="template-header">
                  <h3>{template.name}</h3>
                  <span className="level-badge">{template.level.toUpperCase()}</span>
                </div>
                <p>{template.description}</p>
                <div className="template-stats">
                  <span>⬇️ {template.downloads}</span>
                  <span>⭐ {template.rating}</span>
                  <span>🪙 ~{template.tokens_per_execution} tokens</span>
                </div>
                <div className="template-tags">
                  {template.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Configure */}
      {step === 'configure' && (
        <div className="agent-config">
          <h2>Configurer l'Agent</h2>

          <div className="form-group">
            <label>Nom de l'agent</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              placeholder="Mon Assistant Personnel"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Prompt Système</label>
            <textarea
              value={config.system_prompt}
              onChange={(e) => setConfig({ ...config, system_prompt: e.target.value })}
              rows={8}
              className="prompt-editor"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Max Tokens: {config.max_tokens}</label>
              <input
                type="range"
                min="500"
                max="8000"
                step="100"
                value={config.max_tokens}
                onChange={(e) => setConfig({ ...config, max_tokens: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-group">
              <label>Temperature: {config.temperature}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          {cost && (
            <div className="cost-estimate">
              <h4>💰 Estimation Coût</h4>
              <p>~${cost.toFixed(3)} par exécution</p>
            </div>
          )}

          <div className="button-group">
            <button className="btn-secondary" onClick={() => setStep('select')}>
              Retour
            </button>
            <button className="btn-primary" onClick={() => setStep('preview')}>
              Aperçu
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 'preview' && (
        <div className="agent-preview">
          <h2>Aperçu de l'Agent</h2>

          <div className="preview-card">
            <h3>{config.name || 'Sans nom'}</h3>
            <p>{config.description}</p>

            <div className="preview-specs">
              <div className="spec">
                <span className="spec-label">Max Tokens</span>
                <span className="spec-value">{config.max_tokens}</span>
              </div>
              <div className="spec">
                <span className="spec-label">Temperature</span>
                <span className="spec-value">{config.temperature}</span>
              </div>
              <div className="spec">
                <span className="spec-label">Capacités</span>
                <span className="spec-value">{config.capabilities.length}</span>
              </div>
            </div>

            <div className="prompt-preview">
              <h4>Prompt Système</h4>
              <pre>{config.system_prompt}</pre>
            </div>
          </div>

          <div className="button-group">
            <button className="btn-secondary" onClick={() => setStep('configure')}>
              Modifier
            </button>
            <button className="btn-primary" onClick={handleCreate}>
              Créer l'Agent
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .agent-builder {
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .steps {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-bottom: 48px;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e9e4d6;
          color: #8d8371;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
        }

        .step.active .step-number {
          background: #d8b26a;
          color: white;
        }

        .step.completed .step-number {
          background: #3f7249;
          color: white;
        }

        .step-label {
          font-size: 14px;
          color: #8d8371;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .template-card {
          background: white;
          border: 2px solid #e9e4d6;
          border-radius: 12px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .template-card:hover {
          border-color: #d8b26a;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .template-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .template-header h3 {
          font-size: 18px;
          color: #1e1f22;
          margin: 0;
        }

        .level-badge {
          padding: 4px 8px;
          background: #3eb4a2;
          color: white;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
        }

        .template-stats {
          display: flex;
          gap: 16px;
          margin: 16px 0;
          font-size: 13px;
          color: #8d8371;
        }

        .template-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .tag {
          padding: 4px 8px;
          background: #e9e4d6;
          border-radius: 4px;
          font-size: 11px;
          color: #2f4c39;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2f4c39;
        }

        .form-group input[type="text"],
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e9e4d6;
          border-radius: 8px;
          font-size: 16px;
        }

        .prompt-editor {
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 14px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        input[type="range"] {
          width: 100%;
        }

        .cost-estimate {
          background: #e9e4d6;
          padding: 16px;
          border-radius: 8px;
          margin: 24px 0;
        }

        .cost-estimate h4 {
          margin: 0 0 8px;
          color: #1e1f22;
        }

        .button-group {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
        }

        .btn-primary,
        .btn-secondary {
          padding: 12px 32px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #d8b26a;
          color: white;
        }

        .btn-primary:hover {
          background: #c9a159;
        }

        .btn-secondary {
          background: transparent;
          color: #8d8371;
          border: 2px solid #8d8371;
        }

        .preview-card {
          background: white;
          border: 2px solid #e9e4d6;
          border-radius: 12px;
          padding: 32px;
        }

        .preview-specs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin: 24px 0;
        }

        .spec {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .spec-label {
          font-size: 12px;
          color: #8d8371;
          text-transform: uppercase;
        }

        .spec-value {
          font-size: 20px;
          font-weight: 700;
          color: #1e1f22;
        }

        .prompt-preview pre {
          background: #e9e4d6;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};
