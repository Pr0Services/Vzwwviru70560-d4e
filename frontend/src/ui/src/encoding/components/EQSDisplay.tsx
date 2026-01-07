/**
 * CHE·NU EQS Display Component
 * Visual display of Encoding Quality Score
 */

import React from 'react';
import { EQSResult } from '../../../../sdk/core/encoding/encoding_types';
import { getEQSColor } from '../../../../sdk/core/encoding';

interface EQSDisplayProps {
  eqs: EQSResult | null;
  tokens?: { human: number; encoded: number };
  savings?: { percentage: number; tokensReduced: number };
  compact?: boolean;
}

export const EQSDisplay: React.FC<EQSDisplayProps> = ({
  eqs,
  tokens,
  savings,
  compact = false,
}) => {
  if (!eqs) {
    return (
      <div style={{
        padding: compact ? '8px 12px' : '12px 16px',
        background: '#f5f5f5',
        borderRadius: 8,
        fontSize: 12,
        color: '#999',
      }}>
        Enter content to see EQS
      </div>
    );
  }

  const color = getEQSColor(eqs.score);

  return (
    <div style={{
      padding: compact ? '8px 12px' : '12px 16px',
      background: '#f8fafc',
      borderRadius: 8,
      border: '1px solid #e2e8f0',
    }}>
      {/* Main Score */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: compact ? 8 : 12,
      }}>
        <div style={{
          fontSize: compact ? 24 : 32,
          fontWeight: 700,
          color,
        }}>
          {eqs.emoji} {eqs.score}
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase' }}>
            EQS
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color }}>
            {eqs.grade}
          </div>
        </div>

        {/* Savings */}
        {savings && savings.percentage > 0 && (
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#666' }}>Savings</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#22c55e' }}>
              -{savings.percentage}%
            </div>
          </div>
        )}
      </div>

      {/* Breakdown */}
      {!compact && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>Breakdown</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            <BreakdownItem label="Compression" value={eqs.breakdown.compression} />
            <BreakdownItem label="Scope" value={eqs.breakdown.scopeControl} />
            <BreakdownItem label="Focus" value={eqs.breakdown.focusClarity} />
            <BreakdownItem label="Risk" value={eqs.breakdown.riskManagement} />
          </div>
        </div>
      )}

      {/* Tokens */}
      {tokens && (
        <div style={{
          display: 'flex',
          gap: 16,
          fontSize: 11,
          color: '#666',
          paddingTop: 8,
          borderTop: '1px solid #e2e8f0',
        }}>
          <span>📊 Human: ~{tokens.human} tokens</span>
          <span>📝 Encoded: ~{tokens.encoded} tokens</span>
        </div>
      )}

      {/* Suggestions */}
      {!compact && eqs.suggestions.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Suggestions</div>
          <ul style={{
            margin: 0,
            padding: '0 0 0 16px',
            fontSize: 11,
            color: '#666',
          }}>
            {eqs.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface BreakdownItemProps {
  label: string;
  value: number;
}

const BreakdownItem: React.FC<BreakdownItemProps> = ({ label, value }) => {
  const color = value >= 80 ? '#22c55e' : value >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{
      padding: 8,
      background: '#fff',
      borderRadius: 6,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color }}>{value}</div>
    </div>
  );
};

export default EQSDisplay;
