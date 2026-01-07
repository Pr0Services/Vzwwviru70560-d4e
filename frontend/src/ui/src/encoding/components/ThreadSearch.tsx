/**
 * CHE·NU Thread Search Component
 * Search and filter threads
 */

import React, { useState } from 'react';
import { ThreadState } from '../../../../sdk/core/encoding';

export interface ThreadQuery {
  text: string;
  sphereId?: string;
  state?: ThreadState;
}

interface ThreadSearchProps {
  onChange: (query: ThreadQuery) => void;
  spheres?: string[];
}

export const ThreadSearch: React.FC<ThreadSearchProps> = ({
  onChange,
  spheres = ['construction', 'finance', 'hr', 'marketing', 'operations'],
}) => {
  const [text, setText] = useState('');
  const [sphereId, setSphereId] = useState('');
  const [state, setState] = useState<ThreadState | ''>('');

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px 8px',
    fontSize: 12,
    border: '1px solid #ddd',
    borderRadius: 4,
    background: '#fff',
  };

  const handleTextChange = (value: string) => {
    setText(value);
    onChange({ text: value, sphereId: sphereId || undefined, state: state || undefined });
  };

  const handleSphereChange = (value: string) => {
    setSphereId(value);
    onChange({ text, sphereId: value || undefined, state: state || undefined });
  };

  const handleStateChange = (value: string) => {
    const s = value as ThreadState | '';
    setState(s);
    onChange({ text, sphereId: sphereId || undefined, state: s || undefined });
  };

  const handleQuickFilter = (tag: string) => {
    let newText = '';
    if (tag === 'today') {
      newText = new Date().toISOString().split('T')[0];
    } else if (tag === 'high-eqs') {
      newText = 'eqs:>70';
    } else if (tag === 'pending') {
      setState('proposed');
      onChange({ text, sphereId: sphereId || undefined, state: 'proposed' });
      return;
    }
    setText(newText);
    onChange({ text: newText, sphereId: sphereId || undefined, state: state || undefined });
  };

  return (
    <div style={{ marginBottom: 12 }}>
      {/* Text search */}
      <input
        placeholder="🔍 Rechercher threads..."
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        style={{ ...inputStyle, marginBottom: 6 }}
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6 }}>
        <select
          value={sphereId}
          onChange={(e) => handleSphereChange(e.target.value)}
          style={{ ...inputStyle, flex: 1 }}
        >
          <option value="">Toutes les sphères</option>
          {spheres.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={state}
          onChange={(e) => handleStateChange(e.target.value)}
          style={{ ...inputStyle, flex: 1 }}
        >
          <option value="">Tous les états</option>
          <option value="draft">Draft</option>
          <option value="analyzed">Analyzed</option>
          <option value="proposed">Proposed</option>
          <option value="accepted">Accepted</option>
          <option value="executed">Executed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Quick filters */}
      <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
        {['today', 'high-eqs', 'pending'].map((tag) => (
          <button
            key={tag}
            onClick={() => handleQuickFilter(tag)}
            style={{
              padding: '2px 6px',
              fontSize: 10,
              border: '1px solid #e0e0e0',
              borderRadius: 4,
              background: '#f5f5f5',
              cursor: 'pointer',
            }}
          >
            {tag === 'today' && "Aujourd'hui"}
            {tag === 'high-eqs' && 'EQS élevé'}
            {tag === 'pending' && 'En attente'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThreadSearch;
