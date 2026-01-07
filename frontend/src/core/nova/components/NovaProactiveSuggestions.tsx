/**
 * CHE·NU™ — Nova Proactive Suggestions
 * Suggestions proactives de Nova (stub)
 */
import React from 'react';

export interface Suggestion {
  id: string;
  text: string;
  action: () => void;
  priority: 'low' | 'medium' | 'high';
}

export interface NovaProactiveSuggestionsProps {
  suggestions?: Suggestion[];
  isVisible?: boolean;
  onDismiss?: () => void;
}

export const NovaProactiveSuggestions: React.FC<NovaProactiveSuggestionsProps> = ({
  suggestions = [],
  isVisible = true,
  onDismiss,
}) => {
  if (!isVisible || suggestions.length === 0) return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      right: '24px',
      background: '#2A2B2E',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 1000,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ color: '#D8B26A' }}>💡 Suggestions Nova</span>
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>✕</button>
      </div>
      {suggestions.map(s => (
        <button
          key={s.id}
          onClick={s.action}
          style={{
            display: 'block',
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            background: '#3A3B3E',
            border: 'none',
            borderRadius: '4px',
            color: '#E9E4D6',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          {s.text}
        </button>
      ))}
    </div>
  );
};

export default NovaProactiveSuggestions;
