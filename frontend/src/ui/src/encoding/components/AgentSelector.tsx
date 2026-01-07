/**
 * CHE·NU Agent Selector Component
 * Select compatible agents for encoding execution
 */

import React from 'react';
import {
  SemanticEncoding,
  AgentEncodingSpec,
} from '../../../../sdk/core/encoding/encoding_types';
import { checkCompatibility, DEFAULT_ENCODING_AGENTS } from '../../../../sdk/core/encoding';

interface AgentSelectorProps {
  encoding: SemanticEncoding;
  agents?: AgentEncodingSpec[];
  selected?: AgentEncodingSpec | null;
  onSelect: (agent: AgentEncodingSpec) => void;
  sphereId?: string;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  encoding,
  agents = DEFAULT_ENCODING_AGENTS,
  selected,
  onSelect,
  sphereId,
}) => {
  // Filter by sphere if provided
  const filteredAgents = sphereId
    ? agents.filter((a) => !a.sphereIds || a.sphereIds.includes(sphereId))
    : agents;

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: '#666',
        marginBottom: 8,
        textTransform: 'uppercase',
      }}>
        🤖 Select Agent
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filteredAgents.map((agent) => {
          const compat = checkCompatibility(encoding, agent);
          const isSelected = selected?.id === agent.id;

          return (
            <button
              key={agent.id}
              disabled={!compat.compatible}
              onClick={() => onSelect(agent)}
              title={compat.compatible ? agent.description : compat.issues.map((i) => i.message).join(', ')}
              style={{
                textAlign: 'left',
                padding: 12,
                border: isSelected ? '2px solid #3b82f6' : '1px solid #e0e0e0',
                borderRadius: 6,
                background: isSelected ? '#eff6ff' : compat.compatible ? '#fff' : '#f5f5f5',
                opacity: compat.compatible ? 1 : 0.5,
                cursor: compat.compatible ? 'pointer' : 'not-allowed',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 4,
              }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>
                  {agent.name}
                </span>
                {compat.compatible ? (
                  <span style={{ color: '#22c55e', fontSize: 11 }}>
                    ✓ Compatible ({compat.score})
                  </span>
                ) : (
                  <span style={{ color: '#dc2626', fontSize: 11 }}>
                    ✗ Incompatible
                  </span>
                )}
              </div>

              <div style={{ fontSize: 11, color: '#666' }}>
                <span style={{ marginRight: 8 }}>
                  ACT: {agent.actions.join(', ')}
                </span>
                <span>
                  SCOPE: {agent.scopes.join(', ')}
                </span>
              </div>

              {!compat.compatible && compat.issues.length > 0 && (
                <div style={{
                  marginTop: 6,
                  fontSize: 10,
                  color: '#dc2626',
                  fontStyle: 'italic',
                }}>
                  {compat.issues[0].message}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div style={{
          marginTop: 12,
          padding: '8px 12px',
          background: '#f0fdf4',
          borderRadius: 6,
          fontSize: 12,
        }}>
          Selected: <strong>{selected.name}</strong>
          {selected.description && (
            <div style={{ marginTop: 4, color: '#666', fontSize: 11 }}>
              {selected.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentSelector;
