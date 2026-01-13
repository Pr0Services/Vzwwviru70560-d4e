/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — QUICK CAPTURE SECTION                           ║
 * ║                    Capture rapide d'idées, notes, tâches                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useRef, useEffect } from 'react';

interface QuickCaptureProps {
  sphereId: string;
  sphereName: string;
  sphereColor: string;
}

interface CaptureItem {
  id: string;
  type: 'note' | 'task' | 'idea' | 'reminder';
  content: string;
  createdAt: Date;
  tags: string[];
  priority?: 'low' | 'medium' | 'high';
}

const CAPTURE_TYPES = [
  { id: 'note', icon: '📝', label: 'Note', shortcut: 'N' },
  { id: 'task', icon: '✅', label: 'Tâche', shortcut: 'T' },
  { id: 'idea', icon: '💡', label: 'Idée', shortcut: 'I' },
  { id: 'reminder', icon: '⏰', label: 'Rappel', shortcut: 'R' },
];

export const QuickCaptureSection: React.FC<QuickCaptureProps> = ({
  sphereId,
  sphereName,
  sphereColor,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedType, setSelectedType] = useState<CaptureItem['type']>('note');
  const [recentCaptures, setRecentCaptures] = useState<CaptureItem[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'n': e.preventDefault(); setSelectedType('note'); break;
          case 't': e.preventDefault(); setSelectedType('task'); break;
          case 'i': e.preventDefault(); setSelectedType('idea'); break;
          case 'r': e.preventDefault(); setSelectedType('reminder'); break;
          case 'enter': e.preventDefault(); handleCapture(); break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputValue]);

  const handleCapture = () => {
    if (!inputValue.trim()) return;

    const newCapture: CaptureItem = {
      id: Date.now().toString(),
      type: selectedType,
      content: inputValue.trim(),
      createdAt: new Date(),
      tags: extractTags(inputValue),
      priority: extractPriority(inputValue),
    };

    setRecentCaptures(prev => [newCapture, ...prev.slice(0, 9)]);
    setInputValue('');
    inputRef.current?.focus();
  };

  const extractTags = (text: string): string[] => {
    const matches = text.match(/#\w+/g) || [];
    return matches.map(tag => tag.slice(1));
  };

  const extractPriority = (text: string): CaptureItem['priority'] | undefined => {
    if (text.includes('!!!') || text.toLowerCase().includes('urgent')) return 'high';
    if (text.includes('!!')) return 'medium';
    if (text.includes('!')) return 'low';
    return undefined;
  };

  const getTypeIcon = (type: CaptureItem['type']) => {
    return CAPTURE_TYPES.find(t => t.id === type)?.icon || '📝';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="quick-capture">
      {/* Main Input Area */}
      <div className="capture-input-area">
        <div className="input-header">
          <h2>⚡ Capture Rapide</h2>
          <span className="sphere-badge" style={{ background: sphereColor }}>
            {sphereName}
          </span>
        </div>

        {/* Type Selector */}
        <div className="type-selector">
          {CAPTURE_TYPES.map(type => (
            <button
              key={type.id}
              className={`type-btn ${selectedType === type.id ? 'active' : ''}`}
              onClick={() => setSelectedType(type.id as CaptureItem['type'])}
              title={`${type.label} (Ctrl+${type.shortcut})`}
            >
              <span className="type-icon">{type.icon}</span>
              <span className="type-label">{type.label}</span>
            </button>
          ))}
        </div>

        {/* Main Input */}
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Capturez votre ${CAPTURE_TYPES.find(t => t.id === selectedType)?.label.toLowerCase()}... (Ctrl+Enter pour sauvegarder)`}
            className="capture-input"
            rows={4}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleCapture();
              }
            }}
          />
          
          {/* Action Buttons */}
          <div className="input-actions">
            <button 
              className={`voice-btn ${isRecording ? 'recording' : ''}`}
              onClick={() => setIsRecording(!isRecording)}
              title="Capture vocale"
            >
              🎤
            </button>
            <button 
              className="capture-btn"
              onClick={handleCapture}
              disabled={!inputValue.trim()}
              style={{ background: inputValue.trim() ? sphereColor : undefined }}
            >
              Capturer ⚡
            </button>
          </div>
        </div>

        {/* Quick Tags */}
        <div className="quick-tags">
          <span className="tags-label">Tags rapides:</span>
          {['urgent', 'review', 'idea', 'followup', sphereId].map(tag => (
            <button
              key={tag}
              className="tag-btn"
              onClick={() => setInputValue(prev => prev + ` #${tag}`)}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Captures */}
      <div className="recent-captures">
        <h3>📋 Captures récentes</h3>
        
        {recentCaptures.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>Aucune capture récente</p>
            <p className="empty-hint">Commencez à capturer vos idées ci-dessus</p>
          </div>
        ) : (
          <div className="captures-list">
            {recentCaptures.map(capture => (
              <div key={capture.id} className="capture-card">
                <div className="capture-header">
                  <span className="capture-type">{getTypeIcon(capture.type)}</span>
                  <span className="capture-time">{formatTime(capture.createdAt)}</span>
                  {capture.priority && (
                    <span className={`priority-badge ${capture.priority}`}>
                      {capture.priority === 'high' ? '🔴' : capture.priority === 'medium' ? '🟠' : '🟢'}
                    </span>
                  )}
                </div>
                <p className="capture-content">{capture.content}</p>
                {capture.tags.length > 0 && (
                  <div className="capture-tags">
                    {capture.tags.map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="shortcuts-help">
        <div className="shortcut"><kbd>Ctrl</kbd>+<kbd>N</kbd> Note</div>
        <div className="shortcut"><kbd>Ctrl</kbd>+<kbd>T</kbd> Tâche</div>
        <div className="shortcut"><kbd>Ctrl</kbd>+<kbd>I</kbd> Idée</div>
        <div className="shortcut"><kbd>Ctrl</kbd>+<kbd>Enter</kbd> Sauvegarder</div>
      </div>

      <style>{`
        .quick-capture {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 24px;
          height: 100%;
        }

        .capture-input-area {
          background: #121614;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #2a2a2a;
        }

        .input-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .input-header h2 {
          font-size: 24px;
          color: #e8e4dc;
          margin: 0;
        }

        .sphere-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #000;
        }

        .type-selector {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .type-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #2a2a2a;
          background: transparent;
          color: #a8a29e;
          cursor: pointer;
          transition: all 0.2s;
        }

        .type-btn:hover {
          background: #1e2420;
          border-color: #3a3a3a;
        }

        .type-btn.active {
          background: ${sphereColor}20;
          border-color: ${sphereColor};
          color: ${sphereColor};
        }

        .type-icon { font-size: 20px; }
        .type-label { font-size: 14px; }

        .input-container {
          position: relative;
        }

        .capture-input {
          width: 100%;
          padding: 16px;
          border-radius: 8px;
          border: 2px solid #2a2a2a;
          background: #0a0a0a;
          color: #e8e4dc;
          font-size: 16px;
          resize: none;
          transition: border-color 0.2s;
        }

        .capture-input:focus {
          outline: none;
          border-color: ${sphereColor};
        }

        .capture-input::placeholder {
          color: #6b6560;
        }

        .input-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 12px;
        }

        .voice-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid #2a2a2a;
          background: transparent;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .voice-btn:hover { background: #1e2420; }
        .voice-btn.recording {
          background: #ef4444;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .capture-btn {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          background: #2a2a2a;
          color: #000;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .capture-btn:hover:not(:disabled) {
          transform: scale(1.02);
        }

        .capture-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          color: #6b6560;
        }

        .quick-tags {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          flex-wrap: wrap;
        }

        .tags-label {
          font-size: 12px;
          color: #6b6560;
        }

        .tag-btn {
          padding: 4px 10px;
          border-radius: 12px;
          border: 1px solid #2a2a2a;
          background: transparent;
          color: #a8a29e;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tag-btn:hover {
          background: #1e2420;
          border-color: ${sphereColor};
          color: ${sphereColor};
        }

        .recent-captures {
          background: #121614;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #2a2a2a;
          overflow-y: auto;
        }

        .recent-captures h3 {
          font-size: 16px;
          color: #e8e4dc;
          margin: 0 0 16px 0;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #6b6560;
        }

        .empty-icon { font-size: 48px; display: block; margin-bottom: 12px; }
        .empty-hint { font-size: 12px; margin-top: 8px; }

        .captures-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .capture-card {
          padding: 12px;
          border-radius: 8px;
          background: #0a0a0a;
          border: 1px solid #2a2a2a;
        }

        .capture-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .capture-type { font-size: 16px; }
        .capture-time { font-size: 11px; color: #6b6560; margin-left: auto; }
        .priority-badge { font-size: 12px; }

        .capture-content {
          font-size: 14px;
          color: #e8e4dc;
          margin: 0;
          line-height: 1.5;
        }

        .capture-tags {
          display: flex;
          gap: 6px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .tag {
          font-size: 11px;
          color: ${sphereColor};
          background: ${sphereColor}15;
          padding: 2px 8px;
          border-radius: 10px;
        }

        .shortcuts-help {
          grid-column: 1 / -1;
          display: flex;
          justify-content: center;
          gap: 24px;
          padding: 12px;
          background: #121614;
          border-radius: 8px;
          border: 1px solid #2a2a2a;
        }

        .shortcut {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #6b6560;
        }

        kbd {
          padding: 2px 6px;
          border-radius: 4px;
          background: #2a2a2a;
          border: 1px solid #3a3a3a;
          font-family: monospace;
          font-size: 11px;
        }

        @media (max-width: 900px) {
          .quick-capture {
            grid-template-columns: 1fr;
          }
          .recent-captures {
            max-height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default QuickCaptureSection;
