/**
 * CHE·NU™ - ENCODING PANEL
 * 
 * Visual interface for the encoding system
 * Shows encoding metrics, quality scores, and allows mode selection
 */

import React, { useState, useCallback, useMemo } from 'react';
import { 
  EncodingService, 
  EncodingMode, 
  EncodingResult,
  useEncoding 
} from '../../services/encoding/encodingService';

// ═══════════════════════════════════════════════════════════════
// ENCODING MODE SELECTOR
// ═══════════════════════════════════════════════════════════════

interface ModeSelectorProps {
  currentMode: EncodingMode;
  onChange: (mode: EncodingMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onChange }) => {
  const modes: { id: EncodingMode; name: string; description: string; icon: string }[] = [
    { id: 'standard', name: 'Standard', description: '~30% reduction, high quality', icon: '📦' },
    { id: 'compressed', name: 'Compressed', description: '~50% reduction, good quality', icon: '🗜️' },
    { id: 'minimal', name: 'Minimal', description: '~70% reduction, basic quality', icon: '⚡' },
    { id: 'verbose', name: 'Verbose', description: '~10% reduction, max quality', icon: '📝' },
  ];

  return (
    <div className="mode-selector">
      <h4>Encoding Mode</h4>
      <div className="modes-grid">
        {modes.map((mode) => (
          <button
            key={mode.id}
            className={`mode-btn ${currentMode === mode.id ? 'active' : ''}`}
            onClick={() => onChange(mode.id)}
          >
            <span className="mode-icon">{mode.icon}</span>
            <span className="mode-name">{mode.name}</span>
            <span className="mode-desc">{mode.description}</span>
          </button>
        ))}
      </div>

      <style>{`
        .mode-selector h4 {
          color: #888;
          font-size: 12px;
          text-transform: uppercase;
          margin: 0 0 12px;
        }

        .modes-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .mode-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid #222;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .mode-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: #333;
        }

        .mode-btn.active {
          background: rgba(216, 178, 106, 0.1);
          border-color: #D8B26A;
        }

        .mode-icon {
          font-size: 20px;
          margin-bottom: 6px;
        }

        .mode-name {
          color: #fff;
          font-size: 13px;
          font-weight: 600;
        }

        .mode-desc {
          color: #666;
          font-size: 11px;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// METRICS DISPLAY
// ═══════════════════════════════════════════════════════════════

interface MetricsDisplayProps {
  result: EncodingResult | null;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="metrics-empty">
        <span className="icon">📊</span>
        <p>Encode text to see metrics</p>
      </div>
    );
  }

  const { metrics } = result;
  const qualityColor = metrics.qualityScore >= 80 ? '#3F7249' : 
                       metrics.qualityScore >= 60 ? '#f39c12' : '#e74c3c';

  return (
    <div className="metrics-display">
      <div className="metrics-grid">
        <div className="metric">
          <span className="metric-label">Original</span>
          <span className="metric-value">{metrics.originalTokens}</span>
          <span className="metric-unit">tokens</span>
        </div>
        <div className="metric">
          <span className="metric-label">Encoded</span>
          <span className="metric-value highlight">{metrics.encodedTokens}</span>
          <span className="metric-unit">tokens</span>
        </div>
        <div className="metric">
          <span className="metric-label">Saved</span>
          <span className="metric-value success">{metrics.tokenReduction}</span>
          <span className="metric-unit">tokens ({metrics.reductionPercent}%)</span>
        </div>
        <div className="metric">
          <span className="metric-label">Quality</span>
          <span className="metric-value" style={{ color: qualityColor }}>
            {metrics.qualityScore}%
          </span>
          <span className="metric-unit">fidelity</span>
        </div>
      </div>

      <div className="quality-bar">
        <div 
          className="quality-fill" 
          style={{ 
            width: `${metrics.qualityScore}%`,
            backgroundColor: qualityColor,
          }} 
        />
      </div>

      <div className="applied-rules">
        <span className="rules-label">Applied rules: </span>
        {result.appliedRules.length > 0 ? (
          result.appliedRules.map((rule, i) => (
            <span key={rule} className="rule-tag">
              {rule}{i < result.appliedRules.length - 1 ? ', ' : ''}
            </span>
          ))
        ) : (
          <span className="no-rules">None</span>
        )}
      </div>

      <style>{`
        .metrics-empty {
          text-align: center;
          padding: 32px;
          color: #666;
        }

        .metrics-empty .icon {
          font-size: 32px;
          display: block;
          margin-bottom: 8px;
          opacity: 0.5;
        }

        .metrics-display {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 16px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 16px;
        }

        .metric {
          text-align: center;
        }

        .metric-label {
          display: block;
          font-size: 11px;
          color: #666;
          margin-bottom: 4px;
        }

        .metric-value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
        }

        .metric-value.highlight {
          color: #D8B26A;
        }

        .metric-value.success {
          color: #3F7249;
        }

        .metric-unit {
          display: block;
          font-size: 10px;
          color: #555;
        }

        .quality-bar {
          height: 6px;
          background: #222;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .quality-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .applied-rules {
          font-size: 11px;
          color: #666;
        }

        .rules-label {
          color: #888;
        }

        .rule-tag {
          color: #3EB4A2;
        }

        .no-rules {
          color: #555;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// PREVIEW PANEL
// ═══════════════════════════════════════════════════════════════

interface PreviewPanelProps {
  original: string;
  encoded: string;
  showDiff?: boolean;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ original, encoded, showDiff = true }) => {
  const [activeTab, setActiveTab] = useState<'original' | 'encoded' | 'diff'>('encoded');

  return (
    <div className="preview-panel">
      <div className="preview-tabs">
        <button 
          className={activeTab === 'original' ? 'active' : ''} 
          onClick={() => setActiveTab('original')}
        >
          Original
        </button>
        <button 
          className={activeTab === 'encoded' ? 'active' : ''} 
          onClick={() => setActiveTab('encoded')}
        >
          Encoded
        </button>
        {showDiff && (
          <button 
            className={activeTab === 'diff' ? 'active' : ''} 
            onClick={() => setActiveTab('diff')}
          >
            Compare
          </button>
        )}
      </div>

      <div className="preview-content">
        {activeTab === 'original' && (
          <pre className="preview-text original">{original || 'No input yet'}</pre>
        )}
        {activeTab === 'encoded' && (
          <pre className="preview-text encoded">{encoded || 'No encoding yet'}</pre>
        )}
        {activeTab === 'diff' && (
          <div className="diff-view">
            <div className="diff-column">
              <span className="diff-label">Before ({original.length} chars)</span>
              <pre>{original}</pre>
            </div>
            <div className="diff-arrow">→</div>
            <div className="diff-column">
              <span className="diff-label">After ({encoded.length} chars)</span>
              <pre>{encoded}</pre>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .preview-panel {
          background: #111;
          border: 1px solid #222;
          border-radius: 12px;
          overflow: hidden;
        }

        .preview-tabs {
          display: flex;
          border-bottom: 1px solid #222;
        }

        .preview-tabs button {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: none;
          color: #666;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .preview-tabs button:hover {
          background: rgba(255, 255, 255, 0.02);
          color: #888;
        }

        .preview-tabs button.active {
          background: rgba(216, 178, 106, 0.1);
          color: #D8B26A;
        }

        .preview-content {
          padding: 16px;
          max-height: 200px;
          overflow-y: auto;
        }

        .preview-text {
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .preview-text.original {
          color: #888;
        }

        .preview-text.encoded {
          color: #3EB4A2;
        }

        .diff-view {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .diff-column {
          flex: 1;
        }

        .diff-label {
          display: block;
          font-size: 11px;
          color: #666;
          margin-bottom: 8px;
        }

        .diff-column pre {
          margin: 0;
          font-size: 12px;
          line-height: 1.5;
          color: #ccc;
          background: rgba(0, 0, 0, 0.3);
          padding: 8px;
          border-radius: 6px;
          overflow: auto;
        }

        .diff-arrow {
          color: #D8B26A;
          font-size: 24px;
          padding-top: 20px;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN ENCODING PANEL
// ═══════════════════════════════════════════════════════════════

interface EncodingPanelProps {
  onEncode?: (result: EncodingResult) => void;
  compact?: boolean;
}

export const EncodingPanel: React.FC<EncodingPanelProps> = ({ onEncode, compact = false }) => {
  const { mode, setMode, encode, lastResult, averageMetrics } = useEncoding();
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEncode = useCallback(() => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    // Small delay for UX
    setTimeout(() => {
      const result = encode(inputText);
      onEncode?.(result);
      setIsProcessing(false);
    }, 100);
  }, [inputText, encode, onEncode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleEncode();
    }
  };

  return (
    <div className={`encoding-panel ${compact ? 'compact' : ''}`}>
      <header className="panel-header">
        <div className="header-info">
          <h2>📦 Encoding System</h2>
          <p>Reduce tokens, clarify intent, improve efficiency</p>
        </div>
        {averageMetrics.count > 0 && (
          <div className="avg-stats">
            <span>Avg. reduction: {averageMetrics.reductionPercent}%</span>
            <span>Sessions: {averageMetrics.count}</span>
          </div>
        )}
      </header>

      <div className="panel-content">
        <ModeSelector currentMode={mode} onChange={setMode} />

        <div className="input-section">
          <label>Input Text</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter text to encode... (Ctrl+Enter to encode)"
            rows={4}
          />
          <button 
            className="encode-btn" 
            onClick={handleEncode}
            disabled={!inputText.trim() || isProcessing}
          >
            {isProcessing ? '⏳ Processing...' : '🔄 Encode'}
          </button>
        </div>

        <MetricsDisplay result={lastResult} />

        {lastResult && (
          <PreviewPanel
            original={lastResult.original}
            encoded={lastResult.encoded}
          />
        )}
      </div>

      <style>{`
        .encoding-panel {
          background: #0a0a0a;
          border-radius: 16px;
          overflow: hidden;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: #111;
          border-bottom: 1px solid #222;
        }

        .header-info h2 {
          margin: 0 0 4px;
          color: #D8B26A;
          font-size: 18px;
        }

        .header-info p {
          margin: 0;
          color: #666;
          font-size: 13px;
        }

        .avg-stats {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          font-size: 11px;
          color: #666;
        }

        .panel-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-section label {
          font-size: 12px;
          color: #888;
          text-transform: uppercase;
        }

        .input-section textarea {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 10px;
          padding: 14px;
          color: #fff;
          font-size: 14px;
          resize: vertical;
          min-height: 100px;
          font-family: inherit;
        }

        .input-section textarea:focus {
          outline: none;
          border-color: #D8B26A;
        }

        .input-section textarea::placeholder {
          color: #555;
        }

        .encode-btn {
          align-self: flex-end;
          padding: 12px 24px;
          background: linear-gradient(135deg, #D8B26A, #7A593A);
          border: none;
          border-radius: 8px;
          color: #1a1a1a;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .encode-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(216, 178, 106, 0.3);
        }

        .encode-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .encoding-panel.compact .panel-header {
          padding: 12px 16px;
        }

        .encoding-panel.compact .panel-content {
          padding: 16px;
        }
      `}</style>
    </div>
  );
};

export default EncodingPanel;
