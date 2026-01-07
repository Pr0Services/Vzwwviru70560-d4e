/**
 * CHE·NU - Methodology Selector
 * Permet de sélectionner une méthodologie de travail
 */

import React from 'react';

interface Methodology {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const methodologies: Methodology[] = [
  { id: 'agile', name: 'Agile', description: 'Développement itératif', icon: '🔄' },
  { id: 'waterfall', name: 'Waterfall', description: 'Approche séquentielle', icon: '💧' },
  { id: 'kanban', name: 'Kanban', description: 'Flux continu', icon: '📋' },
  { id: 'scrum', name: 'Scrum', description: 'Sprints et cérémonies', icon: '🏃' },
];

interface MethodologySelectorProps {
  selected?: string;
  onSelect?: (id: string) => void;
}

export const MethodologySelector: React.FC<MethodologySelectorProps> = ({
  selected,
  onSelect
}) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      padding: '16px'
    }}>
      {methodologies.map(m => (
        <div
          key={m.id}
          onClick={() => onSelect?.(m.id)}
          style={{
            padding: '20px',
            backgroundColor: selected === m.id ? '#3b82f6' : '#374151',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: selected === m.id ? '2px solid #60a5fa' : '2px solid transparent'
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>{m.icon}</div>
          <div style={{ 
            color: '#f9fafb', 
            fontWeight: 600, 
            fontSize: '16px',
            marginBottom: '4px'
          }}>
            {m.name}
          </div>
          <div style={{ color: '#9ca3af', fontSize: '13px' }}>
            {m.description}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MethodologySelector;
