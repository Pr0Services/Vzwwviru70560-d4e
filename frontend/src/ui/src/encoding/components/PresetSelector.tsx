/**
 * CHE·NU Preset Selector Component
 * Quick preset selection for encodings
 */

import React, { useState } from 'react';
import { SemanticEncoding, EncodingPreset } from '../../../../sdk/core/encoding/encoding_types';
import { ENCODING_PRESETS } from '../../../../sdk/core/encoding';

interface PresetSelectorProps {
  onSelect: (encoding: SemanticEncoding) => void;
  sphereId?: string;
  expertMode?: boolean;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  onSelect,
  sphereId,
  expertMode = true,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'expert'>('all');

  // Filter presets
  const filteredPresets = ENCODING_PRESETS.filter((p) => {
    // Expert mode filter
    if (!expertMode && p.level === 'expert') return false;
    // Level filter
    if (filter !== 'all' && p.level !== filter) return false;
    // Sphere filter
    if (sphereId && p.sphereIds && !p.sphereIds.includes(sphereId)) return false;
    return true;
  });

  const displayedPresets = expanded ? filteredPresets : filteredPresets.slice(0, 4);

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#666',
          textTransform: 'uppercase',
        }}>
          ⚡ Quick Presets
        </span>

        {/* Level filter */}
        <div style={{ display: 'flex', gap: 4 }}>
          {(['all', 'beginner', 'intermediate', 'expert'] as const).map((level) => {
            if (!expertMode && level === 'expert') return null;
            return (
              <button
                key={level}
                onClick={() => setFilter(level)}
                style={{
                  padding: '2px 6px',
                  fontSize: 10,
                  border: filter === level ? '1px solid #3b82f6' : '1px solid #e0e0e0',
                  borderRadius: 4,
                  background: filter === level ? '#eff6ff' : '#fff',
                  color: filter === level ? '#1d4ed8' : '#666',
                  cursor: 'pointer',
                }}
              >
                {level === 'all' ? 'All' : level.charAt(0).toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Presets grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 6,
      }}>
        {displayedPresets.map((preset) => (
          <PresetCard key={preset.id} preset={preset} onSelect={onSelect} />
        ))}
      </div>

      {/* Show more */}
      {filteredPresets.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: '100%',
            marginTop: 8,
            padding: 6,
            fontSize: 11,
            color: '#666',
            border: '1px dashed #e0e0e0',
            borderRadius: 4,
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          {expanded ? 'Show less ↑' : `Show ${filteredPresets.length - 4} more ↓`}
        </button>
      )}
    </div>
  );
};

interface PresetCardProps {
  preset: EncodingPreset;
  onSelect: (encoding: SemanticEncoding) => void;
}

const PresetCard: React.FC<PresetCardProps> = ({ preset, onSelect }) => {
  const levelColors = {
    beginner: { bg: '#dcfce7', text: '#166534' },
    intermediate: { bg: '#fef3c7', text: '#92400e' },
    expert: { bg: '#ede9fe', text: '#5b21b6' },
  };

  const { bg, text } = levelColors[preset.level];

  return (
    <button
      onClick={() => onSelect(preset.encoding)}
      title={preset.description}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        padding: 10,
        textAlign: 'left',
        border: '1px solid #e0e0e0',
        borderRadius: 6,
        background: '#fff',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      <span style={{ fontSize: 18 }}>{preset.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginBottom: 2,
        }}>
          <span style={{ fontWeight: 600, fontSize: 12 }}>{preset.label}</span>
          <span style={{
            padding: '1px 4px',
            fontSize: 8,
            fontWeight: 500,
            borderRadius: 3,
            background: bg,
            color: text,
            textTransform: 'uppercase',
          }}>
            {preset.level.charAt(0)}
          </span>
        </div>
        <div style={{
          fontSize: 10,
          color: '#666',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {preset.description}
        </div>
      </div>
    </button>
  );
};

export default PresetSelector;
