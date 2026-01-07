/**
 * CHE·NU - PTC Creator
 * Créer une nouvelle Pre-Task Check
 */

import React, { useState } from 'react';

interface PTCCreatorProps {
  onSubmit?: (data: { name: string; description: string; priority: string }) => void;
  onCancel?: () => void;
}

export const PTCCreator: React.FC<PTCCreatorProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ name, description, priority });
  };

  return (
    <form onSubmit={handleSubmit} style={{
      padding: '20px',
      backgroundColor: '#374151',
      borderRadius: '12px',
      marginBottom: '16px'
    }}>
      <h3 style={{ color: '#f9fafb', marginBottom: '16px', fontSize: '16px' }}>
        Nouvelle Vérification
      </h3>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', color: '#d1d5db', marginBottom: '6px', fontSize: '13px' }}>
          Nom
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la vérification..."
          style={{
            width: '100%',
            padding: '10px 12px',
            backgroundColor: '#1f2937',
            border: '1px solid #4b5563',
            borderRadius: '6px',
            color: '#f9fafb',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', color: '#d1d5db', marginBottom: '6px', fontSize: '13px' }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description détaillée..."
          rows={3}
          style={{
            width: '100%',
            padding: '10px 12px',
            backgroundColor: '#1f2937',
            border: '1px solid #4b5563',
            borderRadius: '6px',
            color: '#f9fafb',
            fontSize: '14px',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', color: '#d1d5db', marginBottom: '6px', fontSize: '13px' }}>
          Priorité
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            backgroundColor: '#1f2937',
            border: '1px solid #4b5563',
            borderRadius: '6px',
            color: '#f9fafb',
            fontSize: '14px'
          }}
        >
          <option value="low">Basse</option>
          <option value="normal">Normale</option>
          <option value="high">Haute</option>
          <option value="critical">Critique</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              border: '1px solid #4b5563',
              borderRadius: '6px',
              color: '#d1d5db',
              cursor: 'pointer'
            }}
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          style={{
            padding: '8px 20px',
            backgroundColor: '#3b82f6',
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Créer
        </button>
      </div>
    </form>
  );
};

export default PTCCreator;
