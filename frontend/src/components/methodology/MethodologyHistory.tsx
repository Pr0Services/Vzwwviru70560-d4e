/**
 * CHE·NU - Methodology History
 * Historique des méthodologies utilisées
 */

import React from 'react';

interface HistoryItem {
  id: string;
  methodology: string;
  project: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'paused';
}

const mockHistory: HistoryItem[] = [
  { id: '1', methodology: 'Agile', project: 'CHE·NU v2', startDate: '2024-01-01', status: 'active' },
  { id: '2', methodology: 'Kanban', project: 'Documentation', startDate: '2023-10-01', endDate: '2023-12-15', status: 'completed' },
  { id: '3', methodology: 'Scrum', project: 'Mobile App', startDate: '2023-08-01', status: 'paused' },
];

const statusColors = {
  active: '#22c55e',
  completed: '#3b82f6',
  paused: '#f59e0b'
};

export const MethodologyHistory: React.FC = () => {
  return (
    <div style={{ padding: '16px' }}>
      <h3 style={{ color: '#f9fafb', marginBottom: '16px' }}>Historique</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {mockHistory.map(item => (
          <div
            key={item.id}
            style={{
              padding: '16px',
              backgroundColor: '#374151',
              borderRadius: '8px',
              borderLeft: `4px solid ${statusColors[item.status]}`
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ color: '#f9fafb', fontWeight: 500 }}>
                {item.methodology}
              </span>
              <span style={{
                padding: '2px 8px',
                backgroundColor: statusColors[item.status],
                color: 'white',
                borderRadius: '4px',
                fontSize: '11px',
                textTransform: 'uppercase'
              }}>
                {item.status}
              </span>
            </div>
            <div style={{ color: '#9ca3af', fontSize: '13px' }}>
              {item.project}
            </div>
            <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
              {item.startDate} {item.endDate ? `→ ${item.endDate}` : '→ En cours'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MethodologyHistory;
