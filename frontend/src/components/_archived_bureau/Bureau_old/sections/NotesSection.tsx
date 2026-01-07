/**
 * CHE·NU™ — Notes Section
 * Notes rapides et idées
 */

import React, { useState } from 'react';
import { SphereId } from '../../../canonical/SPHERES_CANONICAL_V2';

interface Note {
  id: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  pinned: boolean;
  color?: string;
}

interface NotesSectionProps {
  sphereId: SphereId;
  userId: string;
  language?: 'en' | 'fr';
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  sphereId,
  userId,
  language = 'fr'
}) => {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', content: 'Première note de test', createdAt: Date.now(), updatedAt: Date.now(), pinned: true },
    { id: '2', content: 'Deuxième note avec plus de contenu pour voir comment ça s\'affiche', createdAt: Date.now() - 3600000, updatedAt: Date.now(), pinned: false },
    { id: '3', content: 'Troisième note', createdAt: Date.now() - 7200000, updatedAt: Date.now(), pinned: false }
  ]);
  const [newNote, setNewNote] = useState('');

  const labels = {
    en: {
      title: 'Notes',
      placeholder: 'Write a quick note...',
      add: 'Add',
      pinned: 'Pinned',
      recent: 'Recent'
    },
    fr: {
      title: 'Notes',
      placeholder: 'Écrire une note rapide...',
      add: 'Ajouter',
      pinned: 'Épinglées',
      recent: 'Récentes'
    }
  };

  const t = labels[language];

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const note: Note = {
      id: `note-${Date.now()}`,
      content: newNote,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      pinned: false
    };
    
    setNotes(prev => [note, ...prev]);
    setNewNote('');
  };

  const pinnedNotes = notes.filter(n => n.pinned);
  const recentNotes = notes.filter(n => !n.pinned);

  return (
    <div className="notes-section">
      {/* Add Note */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
            placeholder={t.placeholder}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: '#2A2B2E',
              border: '1px solid #3A3B3E',
              borderRadius: '8px',
              color: '#E9E4D6',
              fontSize: '14px'
            }}
          />
          <button
            onClick={handleAddNote}
            style={{
              padding: '12px 24px',
              background: '#D8B26A',
              border: 'none',
              borderRadius: '8px',
              color: '#1E1F22',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {t.add}
          </button>
        </div>
      </div>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#D8B26A' }}>
            📌 {t.pinned}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {pinnedNotes.map(note => (
              <div
                key={note.id}
                style={{
                  padding: '16px',
                  background: '#2F4C39',
                  borderRadius: '8px',
                  border: '1px solid #3F7249'
                }}
              >
                <p style={{ margin: 0, color: '#E9E4D6', fontSize: '13px' }}>{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Notes */}
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#8D8371' }}>
          {t.recent}
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recentNotes.map(note => (
            <div
              key={note.id}
              style={{
                padding: '12px 16px',
                background: '#2A2B2E',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <p style={{ margin: 0, color: '#E9E4D6', fontSize: '13px' }}>{note.content}</p>
              <span style={{ color: '#8D8371', fontSize: '11px' }}>
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesSection;
