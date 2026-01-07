/**
 * ============================================================
 * CHE·NU — WORKSURFACE TEXT VIEW
 * SAFE · REPRESENTATIONAL · NON-AUTONOMOUS
 * ============================================================
 * 
 * Text editor view for WorkSurface
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CHENU_COLORS } from './worksurfaceStyles';

// ============================================================
// TYPES
// ============================================================

export interface WorkSurfaceTextViewProps {
  textBlocks: string[];
  onInput: (text: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  showLineNumbers?: boolean;
  monospace?: boolean;
}

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: CHENU_COLORS.cardBg,
    borderRadius: '12px',
    border: `1px solid ${CHENU_COLORS.borderColor}`,
    overflow: 'hidden',
  },
  header: {
    padding: '12px 16px',
    borderBottom: `1px solid ${CHENU_COLORS.borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.textPrimary,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stats: {
    fontSize: '11px',
    color: CHENU_COLORS.textMuted,
    display: 'flex',
    gap: '12px',
  },
  contentArea: {
    padding: '20px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  textBlock: {
    marginBottom: '16px',
    padding: '12px 16px',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '8px',
    borderLeft: `3px solid ${CHENU_COLORS.cenoteTurquoise}`,
  },
  textContent: {
    fontSize: '14px',
    lineHeight: 1.8,
    color: CHENU_COLORS.textSecondary,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  textContentMono: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
    fontSize: '13px',
  },
  lineNumber: {
    display: 'inline-block',
    width: '30px',
    color: CHENU_COLORS.textMuted,
    fontSize: '11px',
    textAlign: 'right',
    marginRight: '12px',
    userSelect: 'none',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: CHENU_COLORS.textMuted,
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '14px',
    marginBottom: '8px',
  },
  emptyHint: {
    fontSize: '12px',
    opacity: 0.7,
  },
  inputArea: {
    padding: '16px',
    borderTop: `1px solid ${CHENU_COLORS.borderColor}`,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    padding: '12px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: `1px solid ${CHENU_COLORS.borderColor}`,
    borderRadius: '8px',
    color: CHENU_COLORS.textPrimary,
    fontSize: '14px',
    fontFamily: "'Inter', sans-serif",
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  textareaFocused: {
    borderColor: CHENU_COLORS.cenoteTurquoise,
  },
  inputActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '12px',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  buttonPrimary: {
    backgroundColor: CHENU_COLORS.cenoteTurquoise,
    color: CHENU_COLORS.uiSlate,
  },
  buttonSecondary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: CHENU_COLORS.textSecondary,
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

// ============================================================
// COMPONENT
// ============================================================

export const WorkSurfaceTextView: React.FC<WorkSurfaceTextViewProps> = ({
  textBlocks,
  onInput,
  readOnly = false,
  placeholder = 'Type or paste content here...',
  showLineNumbers = false,
  monospace = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate stats
  const totalWords = textBlocks.join(' ').split(/\s+/).filter(w => w).length;
  const totalChars = textBlocks.join('').length;
  const totalLines = textBlocks.reduce((sum, block) => sum + block.split('\n').length, 0);

  // Handle submit
  const handleSubmit = useCallback(() => {
    const trimmed = inputText.trim();
    if (trimmed) {
      onInput(trimmed);
      setInputText('');
      textareaRef.current?.focus();
    }
  }, [inputText, onInput]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  // Render text with optional line numbers
  const renderTextWithLineNumbers = (text: string, blockIndex: number) => {
    if (!showLineNumbers) {
      return <span style={{ ...styles.textContent, ...(monospace ? styles.textContentMono : {}) }}>{text}</span>;
    }

    const lines = text.split('\n');
    let lineOffset = 0;
    for (let i = 0; i < blockIndex; i++) {
      lineOffset += textBlocks[i].split('\n').length;
    }

    return (
      <div>
        {lines.map((line, i) => (
          <div key={i} style={{ display: 'flex' }}>
            <span style={styles.lineNumber}>{lineOffset + i + 1}</span>
            <span style={{ ...styles.textContent, ...(monospace ? styles.textContentMono : {}) }}>{line || ' '}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>📝</span>
          <span>Text Editor</span>
        </div>
        <div style={styles.stats}>
          <span>{textBlocks.length} block{textBlocks.length !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>{totalWords} word{totalWords !== 1 ? 's' : ''}</span>
          <span>•</span>
          <span>{totalChars} char{totalChars !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Content Area */}
      <div style={styles.contentArea}>
        {textBlocks.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📝</div>
            <div style={styles.emptyText}>No content yet</div>
            <div style={styles.emptyHint}>Start typing below to add content</div>
          </div>
        ) : (
          textBlocks.map((block, index) => (
            <div key={index} style={styles.textBlock}>
              {renderTextWithLineNumbers(block, index)}
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      {!readOnly && (
        <div style={styles.inputArea}>
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            style={{
              ...styles.textarea,
              ...(monospace ? styles.textContentMono : {}),
              ...(isFocused ? styles.textareaFocused : {}),
            }}
          />
          <div style={styles.inputActions}>
            <button
              onClick={() => setInputText('')}
              style={{
                ...styles.button,
                ...styles.buttonSecondary,
                ...(inputText ? {} : styles.buttonDisabled),
              }}
              disabled={!inputText}
            >
              Clear
            </button>
            <button
              onClick={handleSubmit}
              style={{
                ...styles.button,
                ...styles.buttonPrimary,
                ...(inputText.trim() ? {} : styles.buttonDisabled),
              }}
              disabled={!inputText.trim()}
            >
              ➕ Add Content
              <span style={{ fontSize: '10px', opacity: 0.7 }}>(Ctrl+Enter)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkSurfaceTextView;
