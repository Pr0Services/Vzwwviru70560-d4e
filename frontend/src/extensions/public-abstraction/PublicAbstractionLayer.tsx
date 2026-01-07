/**
 * CHE·NU™ PUBLIC ABSTRACTION LAYER — MAIN COMPONENT
 * 
 * The public-facing interface that makes CHE·NU
 * understandable, shareable, and presentable
 * without exposing internal cognitive complexity.
 * 
 * What public sees: outcomes, clarity, responsibility, stability
 * What public never sees: Mega-Tree, agents, cognitive mechanics
 * 
 * @version 1.0
 * @status V51-extension
 * @base V51 (FROZEN)
 */

import React, { useState, useCallback, useMemo } from 'react';
import type {
  PublicAbstractionLayerProps,
  AbstractionLevel,
  PublicSpace,
  PublicDecision,
  PublicThread,
  TrustSignalDisplay,
} from './public-abstraction.types';
import {
  ABSTRACTION_LEVELS,
  TRUST_SIGNAL_DISPLAYS,
  PUBLIC_COMMUNICATION_GUIDELINES,
} from './public-abstraction.types';
import { usePublicAbstraction } from './hooks';

// ═══════════════════════════════════════════════════════════════════════════════
// TRUST SIGNALS DISPLAY
// ═══════════════════════════════════════════════════════════════════════════════

interface TrustSignalsProps {
  signals: TrustSignalDisplay[];
  compact?: boolean;
}

const TrustSignals: React.FC<TrustSignalsProps> = ({ signals, compact = false }) => {
  if (compact) {
    return (
      <div className="chenu-trust-signals-compact">
        {signals.map(signal => (
          <span 
            key={signal.id} 
            className="trust-signal-icon"
            title={`${signal.title}: ${signal.description}`}
          >
            {signal.icon}
          </span>
        ))}
      </div>
    );
  }
  
  return (
    <div className="chenu-trust-signals">
      <h4 className="trust-signals-title">Your Guarantees</h4>
      <div className="trust-signals-grid">
        {signals.map(signal => (
          <div 
            key={signal.id} 
            className={`trust-signal trust-signal--${signal.emphasis}`}
          >
            <span className="trust-signal-icon">{signal.icon}</span>
            <div className="trust-signal-content">
              <span className="trust-signal-title">{signal.title}</span>
              <span className="trust-signal-description">{signal.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ABSTRACTION LEVEL SELECTOR
// ═══════════════════════════════════════════════════════════════════════════════

interface LevelSelectorProps {
  currentLevel: AbstractionLevel;
  onLevelChange: (level: AbstractionLevel) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ currentLevel, onLevelChange }) => {
  const levels: AbstractionLevel[] = ['conceptual', 'functional', 'experience', 'technical'];
  
  return (
    <div className="chenu-level-selector">
      <span className="level-selector-label">Detail Level:</span>
      <div className="level-selector-options">
        {levels.map(level => {
          const def = ABSTRACTION_LEVELS[level];
          return (
            <button
              key={level}
              className={`level-option ${currentLevel === level ? 'level-option--active' : ''}`}
              onClick={() => onLevelChange(level)}
              title={def.description}
            >
              {def.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC SPACE CARD
// ═══════════════════════════════════════════════════════════════════════════════

interface SpaceCardProps {
  space: PublicSpace;
  onClick?: (space: PublicSpace) => void;
  level: AbstractionLevel;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space, onClick, level }) => {
  const showDetails = level !== 'conceptual';
  
  return (
    <div 
      className="chenu-space-card"
      onClick={() => onClick?.(space)}
      style={{ borderColor: space.color }}
    >
      <div className="space-card-header">
        <span className="space-icon">{space.icon}</span>
        <span className="space-name">{space.name}</span>
      </div>
      
      <p className="space-description">{space.description}</p>
      
      {showDetails && (
        <div className="space-details">
          <span className="space-activity">{space.activity_summary}</span>
          <span className={`space-load space-load--${space.mental_load}`}>
            {space.mental_load === 'low' ? '🟢' : space.mental_load === 'moderate' ? '🟡' : '🟠'}
            {' '}{space.mental_load} load
          </span>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC DECISION CARD
// ═══════════════════════════════════════════════════════════════════════════════

interface DecisionCardProps {
  decision: PublicDecision;
  onClick?: (decision: PublicDecision) => void;
  level: AbstractionLevel;
}

const DecisionCard: React.FC<DecisionCardProps> = ({ decision, onClick, level }) => {
  const showRationale = level === 'experience' || level === 'technical';
  
  return (
    <div 
      className="chenu-decision-card"
      onClick={() => onClick?.(decision)}
    >
      <div className="decision-card-header">
        <span className="decision-title">{decision.title}</span>
        {decision.reversible && (
          <span className="decision-reversible" title="This decision can be changed">
            ↩️
          </span>
        )}
      </div>
      
      <p className="decision-summary">{decision.summary}</p>
      
      {showRationale && (
        <div className="decision-rationale">
          <span className="rationale-label">Why:</span>
          <span className="rationale-text">{decision.rationale}</span>
        </div>
      )}
      
      <div className="decision-meta">
        <span className="decision-owner">by {decision.made_by}</span>
        <span className="decision-date">
          {new Date(decision.made_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC THREAD CARD
// ═══════════════════════════════════════════════════════════════════════════════

interface ThreadCardProps {
  thread: PublicThread;
  onClick?: (thread: PublicThread) => void;
  level: AbstractionLevel;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, onClick, level }) => {
  const showEvolution = level === 'experience' || level === 'technical';
  
  return (
    <div 
      className="chenu-thread-card"
      onClick={() => onClick?.(thread)}
    >
      <div className="thread-card-header">
        <span className="thread-title">{thread.title}</span>
        <span className={`thread-status thread-status--${thread.status}`}>
          {thread.status}
        </span>
      </div>
      
      <p className="thread-summary">{thread.summary}</p>
      
      {showEvolution && (
        <div className="thread-evolution">
          <span className="evolution-label">Evolution:</span>
          <span className="evolution-text">{thread.evolution}</span>
        </div>
      )}
      
      <div className="thread-meta">
        <span className="thread-decisions">{thread.decisions} decisions</span>
        <span className="thread-updated">
          Updated {new Date(thread.last_updated).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MENTAL LOAD INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════

interface MentalLoadIndicatorProps {
  current: 'low' | 'moderate' | 'high';
  trend: 'decreasing' | 'stable' | 'increasing';
  suggestion?: string;
  level: AbstractionLevel;
}

const MentalLoadIndicator: React.FC<MentalLoadIndicatorProps> = ({
  current,
  trend,
  suggestion,
  level,
}) => {
  // Only show at experience or technical level
  if (level === 'conceptual' || level === 'functional') {
    return null;
  }
  
  const loadIcon = current === 'low' ? '🟢' : current === 'moderate' ? '🟡' : '🟠';
  const trendIcon = trend === 'decreasing' ? '↓' : trend === 'increasing' ? '↑' : '→';
  
  return (
    <div className="chenu-mental-load">
      <div className="mental-load-header">
        <span className="mental-load-icon">{loadIcon}</span>
        <span className="mental-load-label">Mental Load</span>
        <span className="mental-load-trend">{trendIcon}</span>
      </div>
      
      <div className="mental-load-level">
        {current.charAt(0).toUpperCase() + current.slice(1)}
      </div>
      
      {suggestion && (
        <p className="mental-load-suggestion">{suggestion}</p>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// KEY MESSAGES
// ═══════════════════════════════════════════════════════════════════════════════

interface KeyMessagesProps {
  level: AbstractionLevel;
}

const KeyMessages: React.FC<KeyMessagesProps> = ({ level }) => {
  // Show messages based on level
  const messages = useMemo(() => {
    switch (level) {
      case 'conceptual':
        return [
          'Human always in control',
          'Nothing happens silently',
          'Clarity over speed',
        ];
      case 'functional':
        return [
          'Every decision has an owner',
          'Everything can be undone',
          'Understanding over automation',
        ];
      case 'experience':
      case 'technical':
        return PUBLIC_COMMUNICATION_GUIDELINES.key_messages;
    }
  }, [level]);
  
  return (
    <div className="chenu-key-messages">
      {messages.map((message, idx) => (
        <span key={idx} className="key-message">
          ✓ {message}
        </span>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PUBLIC ABSTRACTION LAYER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const PublicAbstractionLayer: React.FC<PublicAbstractionLayerProps> = ({
  level: initialLevel,
  user_id,
  show_trust_signals = true,
  xr_enabled = false,
  onLevelChange,
  onSpaceSelect,
  onDecisionSelect,
  onThreadSelect,
  className = '',
}) => {
  const {
    level,
    trust,
    dashboard,
    xr,
  } = usePublicAbstraction({
    user_id,
    initial_level: initialLevel,
    xr_enabled,
  });
  
  // Handle level change with callback
  const handleLevelChange = useCallback((newLevel: AbstractionLevel) => {
    level.setLevel(newLevel);
    onLevelChange?.(newLevel);
  }, [level, onLevelChange]);
  
  // Render loading state
  if (dashboard.isLoading) {
    return (
      <div className={`chenu-public-abstraction chenu-public-abstraction--loading ${className}`}>
        <div className="loading-spinner" />
        <p>Loading your view...</p>
      </div>
    );
  }
  
  // Render error state
  if (dashboard.error) {
    return (
      <div className={`chenu-public-abstraction chenu-public-abstraction--error ${className}`}>
        <p className="error-message">{dashboard.error}</p>
        <button onClick={dashboard.refresh}>Try Again</button>
      </div>
    );
  }
  
  const data = dashboard.dashboard;
  if (!data) return null;
  
  return (
    <div className={`chenu-public-abstraction chenu-public-abstraction--${level.level} ${className}`}>
      {/* Header */}
      <header className="public-abstraction-header">
        <div className="header-title">
          <h1>CHE·NU</h1>
          <span className="header-tagline">A place for human thinking</span>
        </div>
        
        <LevelSelector 
          currentLevel={level.level} 
          onLevelChange={handleLevelChange}
        />
      </header>
      
      {/* Trust Signals */}
      {show_trust_signals && (
        <TrustSignals 
          signals={trust.primarySignals}
          compact={level.level === 'conceptual'}
        />
      )}
      
      {/* Key Messages */}
      <KeyMessages level={level.level} />
      
      {/* Main Content */}
      <main className="public-abstraction-main">
        {/* Spaces Section */}
        <section className="spaces-section">
          <h2>Your Spaces</h2>
          <div className="spaces-grid">
            {data.spaces.map(space => (
              <SpaceCard
                key={space.id}
                space={space}
                onClick={onSpaceSelect}
                level={level.level}
              />
            ))}
          </div>
        </section>
        
        {/* Mental Load - only at experience/technical level */}
        {data.mental_load && (
          <MentalLoadIndicator
            current={data.mental_load.current}
            trend={data.mental_load.trend}
            suggestion={data.mental_load.suggestion}
            level={level.level}
          />
        )}
        
        {/* Decisions Section */}
        {level.level !== 'conceptual' && data.recent_decisions.length > 0 && (
          <section className="decisions-section">
            <h2>Recent Decisions</h2>
            <div className="decisions-list">
              {data.recent_decisions.map(decision => (
                <DecisionCard
                  key={decision.id}
                  decision={decision}
                  onClick={onDecisionSelect}
                  level={level.level}
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Threads Section */}
        {(level.level === 'experience' || level.level === 'technical') && 
          data.active_threads.length > 0 && (
          <section className="threads-section">
            <h2>Active Threads</h2>
            <div className="threads-list">
              {data.active_threads.map(thread => (
                <ThreadCard
                  key={thread.id}
                  thread={thread}
                  onClick={onThreadSelect}
                  level={level.level}
                />
              ))}
            </div>
          </section>
        )}
        
        {/* XR Spaces - only if enabled and at right level */}
        {xr.showXROptions && (
          <section className="xr-section">
            <h2>Reflection Spaces</h2>
            <p className="xr-description">
              Optional immersive spaces for focused thinking.
              XR is never required — always your choice.
            </p>
            <div className="xr-options">
              <button className="xr-option">
                🏛️ Reflection Room
              </button>
              <button className="xr-option">
                ⚖️ Decision Room
              </button>
            </div>
          </section>
        )}
        
        {/* Assistants Section - only at technical level */}
        {level.level === 'technical' && data.assistants.length > 0 && (
          <section className="assistants-section">
            <h2>Your Assistants</h2>
            <div className="assistants-list">
              {data.assistants.map(assistant => (
                <div key={assistant.id} className="assistant-card">
                  <div className="assistant-header">
                    <span className="assistant-name">{assistant.name}</span>
                    <span className={`assistant-trust assistant-trust--${assistant.trust}`}>
                      {assistant.trust}
                    </span>
                  </div>
                  <p className="assistant-role">{assistant.role}</p>
                  <div className="assistant-capabilities">
                    <span className="capability-label">Can:</span>
                    {assistant.capabilities.map((cap, idx) => (
                      <span key={idx} className="capability">✓ {cap}</span>
                    ))}
                  </div>
                  <div className="assistant-limitations">
                    <span className="limitation-label">Cannot:</span>
                    {assistant.limitations.map((lim, idx) => (
                      <span key={idx} className="limitation">✗ {lim}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer className="public-abstraction-footer">
        <p className="footer-promise">
          CHE·NU does not promise optimization. It promises clarity.
        </p>
      </footer>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES (would be in separate CSS file)
// ═══════════════════════════════════════════════════════════════════════════════

export const PUBLIC_ABSTRACTION_STYLES = `
.chenu-public-abstraction {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #fafafa;
  color: #333;
  min-height: 100vh;
  padding: 2rem;
}

.chenu-public-abstraction--conceptual {
  --accent-color: #4a7c59;
}

.chenu-public-abstraction--functional {
  --accent-color: #5a6c7a;
}

.chenu-public-abstraction--experience {
  --accent-color: #6a5a8a;
}

.chenu-public-abstraction--technical {
  --accent-color: #7a5a6a;
}

.public-abstraction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.header-title h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.header-tagline {
  font-size: 0.875rem;
  color: #666;
}

.chenu-trust-signals {
  background: #f0f4f0;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.trust-signals-title {
  margin: 0 0 1rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #666;
}

.trust-signals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.trust-signal {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.trust-signal-icon {
  font-size: 1.5rem;
}

.trust-signal-title {
  display: block;
  font-weight: 500;
}

.trust-signal-description {
  display: block;
  font-size: 0.875rem;
  color: #666;
}

.chenu-key-messages {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.key-message {
  font-size: 0.875rem;
  color: var(--accent-color);
}

.spaces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.chenu-space-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.chenu-space-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.space-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.space-icon {
  font-size: 1.5rem;
}

.space-name {
  font-weight: 600;
}

.space-description {
  font-size: 0.875rem;
  color: #666;
  margin: 0.5rem 0;
}

.space-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #888;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
}

.chenu-decision-card,
.chenu-thread-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
}

.chenu-decision-card:hover,
.chenu-thread-card:hover {
  background: #fafafa;
}

.decision-card-header,
.thread-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.decision-title,
.thread-title {
  font-weight: 500;
}

.decision-reversible {
  font-size: 0.875rem;
}

.thread-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: #f0f0f0;
}

.thread-status--active {
  background: #e0f0e0;
  color: #4a7c59;
}

.decision-rationale,
.thread-evolution {
  font-size: 0.875rem;
  color: #666;
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: #fafafa;
  border-radius: 4px;
}

.rationale-label,
.evolution-label {
  font-weight: 500;
  margin-right: 0.5rem;
}

.decision-meta,
.thread-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #888;
  margin-top: 0.75rem;
}

.chenu-mental-load {
  background: #f8f8f0;
  padding: 1rem;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.mental-load-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mental-load-level {
  font-weight: 500;
  margin-top: 0.5rem;
}

.mental-load-suggestion {
  font-size: 0.875rem;
  color: #666;
  margin: 0.5rem 0 0;
}

.xr-section {
  background: linear-gradient(135deg, #f0f0fa 0%, #faf0f0 100%);
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.xr-description {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1rem;
}

.xr-options {
  display: flex;
  gap: 1rem;
}

.xr-option {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.xr-option:hover {
  background: #fafafa;
  border-color: #999;
}

.public-abstraction-footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
  text-align: center;
}

.footer-promise {
  font-style: italic;
  color: #666;
}

.level-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.level-selector-label {
  font-size: 0.875rem;
  color: #666;
}

.level-selector-options {
  display: flex;
  gap: 0.5rem;
}

.level-option {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.level-option:hover {
  border-color: var(--accent-color);
}

.level-option--active {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}
`;

export default PublicAbstractionLayer;
