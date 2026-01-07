/**
 * CHE·NU Encoding Form Component
 * Form for editing semantic encodings
 */

import React from 'react';
import {
  SemanticEncoding,
  ENCODING_ACTIONS,
  ENCODING_SOURCES,
  ENCODING_SCOPES,
  ENCODING_MODES,
  ENCODING_FOCUS_AREAS,
} from '../../../../sdk/core/encoding/encoding_types';

interface EncodingFormProps {
  value: SemanticEncoding;
  onChange: (encoding: SemanticEncoding) => void;
  disabled?: boolean;
  compact?: boolean;
}

export const EncodingForm: React.FC<EncodingFormProps> = ({
  value,
  onChange,
  disabled = false,
  compact = false,
}) => {
  const updateField = <K extends keyof SemanticEncoding>(
    key: K,
    fieldValue: SemanticEncoding[K]
  ) => {
    onChange({ ...value, [key]: fieldValue });
  };

  const toggleFocus = (focus: string) => {
    const current = value.FOCUS || [];
    if (current.includes(focus as any)) {
      updateField('FOCUS', current.filter((f) => f !== focus) as any);
    } else {
      updateField('FOCUS', [...current, focus] as any);
    }
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: compact ? '6px 8px' : '8px 12px',
    fontSize: compact ? 12 : 13,
    border: '1px solid #e0e0e0',
    borderRadius: 6,
    background: disabled ? '#f5f5f5' : '#fff',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 8 : 12 }}>
      {/* Core Fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {/* ACT */}
        <div>
          <label style={labelStyle}>ACT (Action)</label>
          <select
            style={selectStyle}
            value={value.ACT}
            onChange={(e) => updateField('ACT', e.target.value as any)}
            disabled={disabled}
          >
            {ENCODING_ACTIONS.map((act) => (
              <option key={act} value={act}>{act}</option>
            ))}
          </select>
        </div>

        {/* SRC */}
        <div>
          <label style={labelStyle}>SRC (Source)</label>
          <select
            style={selectStyle}
            value={value.SRC}
            onChange={(e) => updateField('SRC', e.target.value as any)}
            disabled={disabled}
          >
            {ENCODING_SOURCES.map((src) => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>
        </div>

        {/* SCOPE */}
        <div>
          <label style={labelStyle}>SCOPE</label>
          <select
            style={selectStyle}
            value={value.SCOPE}
            onChange={(e) => updateField('SCOPE', e.target.value as any)}
            disabled={disabled}
          >
            {ENCODING_SCOPES.map((scope) => (
              <option key={scope} value={scope}>{scope}</option>
            ))}
          </select>
        </div>

        {/* MODE */}
        <div>
          <label style={labelStyle}>MODE</label>
          <select
            style={selectStyle}
            value={value.MODE}
            onChange={(e) => updateField('MODE', e.target.value as any)}
            disabled={disabled}
          >
            {ENCODING_MODES.map((mode) => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
        </div>
      </div>

      {/* FOCUS */}
      <div>
        <label style={labelStyle}>FOCUS (click to toggle)</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {ENCODING_FOCUS_AREAS.map((focus) => {
            const active = value.FOCUS?.includes(focus);
            return (
              <button
                key={focus}
                type="button"
                disabled={disabled}
                onClick={() => toggleFocus(focus)}
                style={{
                  padding: compact ? '4px 6px' : '6px 10px',
                  fontSize: compact ? 10 : 11,
                  fontWeight: 500,
                  border: active ? '1px solid #3b82f6' : '1px solid #e0e0e0',
                  borderRadius: 4,
                  background: active ? '#eff6ff' : '#fff',
                  color: active ? '#1d4ed8' : '#666',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.6 : 1,
                }}
              >
                {focus}
              </button>
            );
          })}
        </div>
      </div>

      {/* Flags */}
      {!compact && (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={value.RW === 1}
              onChange={(e) => updateField('RW', e.target.checked ? 1 : 0)}
              disabled={disabled}
            />
            RW (Rewrite)
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={value.UNC === 1}
              onChange={(e) => updateField('UNC', e.target.checked ? 1 : 0)}
              disabled={disabled}
            />
            UNC (Uncertainty)
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={value.SENS === 1}
              onChange={(e) => updateField('SENS', e.target.checked ? 1 : 0)}
              disabled={disabled}
            />
            SENS (Sensitive)
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={value.TRACE === 1}
              onChange={(e) => updateField('TRACE', e.target.checked ? 1 : 0)}
              disabled={disabled}
            />
            TRACE
          </label>
        </div>
      )}
    </div>
  );
};

export default EncodingForm;
