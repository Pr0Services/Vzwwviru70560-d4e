/**
 * CHE·NU - PTC List
 * Liste des Pre-Task Checks
 */

import React from 'react';

interface PTCItem {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: string;
}

const mockPTCs: PTCItem[] = [
  { 
    id: '1', 
    name: 'Validation Budget', 
    description: 'Vérifier le budget avant exécution',
    priority: 'high',
    status: 'completed',
    createdAt: '2024-01-15'
  },
  { 
    id: '2', 
    name: 'Permissions Agent', 
    description: 'Vérifier les permissions de l\'agent',
    priority: 'critical',
    status: 'in_progress',
    createdAt: '2024-01-16'
  },
  { 
    id: '3', 
    name: 'Scope Check', 
    description: 'Vérifier le scope de la tâche',
    priority: 'normal',
    status: 'pending',
    createdAt: '2024-01-17'
  },
];

const priorityColors = {
  low: '#6b7280',
  normal: '#3b82f6',
  high: '#f59e0b',
  critical: '#ef4444'
};

const statusColors = {
  pending: '#9ca3af',
  in_progress: '#f59e0b',
  completed: '#22c55e',
  failed: '#ef4444'
};

const statusLabels = {
  pending: 'En attente',
  in_progress: 'En cours',
  completed: 'Complété',
  failed: 'Échoué'
};

interface PTCListProps {
  onSelect?: (id: string) => void;
}

export const PTCList: React.FC<PTCListProps> = ({ onSelect }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {mockPTCs.map(ptc => (
        <div
          key={ptc.id}
          onClick={() => onSelect?.(ptc.id)}
          style={{
            padding: '16px',
            backgroundColor: '#374151',
            borderRadius: '8px',
            borderLeft: `4px solid ${priorityColors[ptc.priority]}`,
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '8px'
          }}>
            <div>
              <div style={{ color: '#f9fafb', fontWeight: 500, marginBottom: '4px' }}>
                {ptc.name}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '13px' }}>
                {ptc.description}
              </div>
            </div>
            <span style={{
              padding: '4px 10px',
              backgroundColor: statusColors[ptc.status],
              color: 'white',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 500
            }}>
              {statusLabels[ptc.status]}
            </span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid #4b5563'
          }}>
            <span style={{ color: '#6b7280', fontSize: '12px' }}>
              Créé le {ptc.createdAt}
            </span>
            <span style={{
              padding: '2px 8px',
              backgroundColor: '#1f2937',
              color: priorityColors[ptc.priority],
              borderRadius: '4px',
              fontSize: '11px',
              textTransform: 'uppercase'
            }}>
              {ptc.priority}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PTCList;
