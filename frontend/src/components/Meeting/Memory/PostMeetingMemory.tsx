/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — POST-MEETING MEMORY UI
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * RÈGLE FONDAMENTALE:
 * Aucun meeting n'écrit directement en mémoire.
 * Tout passe par le Memory Governance Agent
 * et requiert une validation utilisateur.
 * 
 * CE QUI N'EST JAMAIS STOCKÉ:
 * - Conversation brute
 * - Spéculation des agents
 * - Hypothèses non validées
 * - Bruit de raisonnement intermédiaire
 * 
 * Seul le SENS survit.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import {
  PostMeetingMemoryEntry,
  MemoryEntryState,
  MemoryDestination,
  MemoryLocation,
  NEVER_STORED,
  MEMORY_RULES
} from '../../../canonical/MEMORY_POST_MEETING_CANONICAL';
import { MeetingType } from '../../../canonical/MEETING_TYPES_CANONICAL';
import { SphereId } from '../../../canonical/SPHERES_CANONICAL_V2';

interface PostMeetingMemoryProps {
  meetingId: string;
  meetingType: MeetingType;
  meetingTitle: string;
  proposedEntries: PostMeetingMemoryEntry[];
  onValidateEntries: (entryIds: string[]) => void;
  onRejectEntry: (entryId: string) => void;
  onEditEntry: (entryId: string, newContent: string) => void;
  onChangeDestination: (entryId: string, newDestination: MemoryLocation) => void;
  onClose: () => void;
  language?: 'en' | 'fr';
}

export const PostMeetingMemory: React.FC<PostMeetingMemoryProps> = ({
  meetingId,
  meetingType,
  meetingTitle,
  proposedEntries,
  onValidateEntries,
  onRejectEntry,
  onEditEntry,
  onChangeDestination,
  onClose,
  language = 'fr'
}) => {
  const [entries, setEntries] = useState<PostMeetingMemoryEntry[]>(proposedEntries);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const labels = {
    en: {
      title: 'POST-MEETING MEMORY',
      subtitle: 'What should be remembered?',
      from: 'From meeting',
      proposed: 'Proposed Entries',
      validate: 'Validate Selected',
      rejectAll: 'Reject All',
      close: 'Close',
      edit: 'Edit',
      reject: 'Reject',
      save: 'Save',
      cancel: 'Cancel',
      destination: 'Destination',
      noEntries: 'No memory entries proposed',
      warning: 'Only validated entries will be stored. Rejected entries are discarded.',
      types: {
        summary: 'Summary',
        decision: 'Decision',
        rejected_proposal: 'Rejected Proposal',
        open_question: 'Open Question'
      },
      destinations: {
        personal: 'Personal Memory',
        team: 'Team Memory'
      },
      status: {
        draft: 'Draft',
        approved: 'Approved',
        archived: 'Archived'
      }
    },
    fr: {
      title: 'MÉMOIRE POST-MEETING',
      subtitle: 'Que faut-il retenir?',
      from: 'Du meeting',
      proposed: 'Entrées proposées',
      validate: 'Valider la sélection',
      rejectAll: 'Tout rejeter',
      close: 'Fermer',
      edit: 'Modifier',
      reject: 'Rejeter',
      save: 'Enregistrer',
      cancel: 'Annuler',
      destination: 'Destination',
      noEntries: 'Aucune entrée mémoire proposée',
      warning: 'Seules les entrées validées seront stockées. Les entrées rejetées sont supprimées.',
      types: {
        summary: 'Résumé',
        decision: 'Décision',
        rejected_proposal: 'Proposition rejetée',
        open_question: 'Question ouverte'
      },
      destinations: {
        personal: 'Mémoire Personnelle',
        team: 'Mémoire Équipe'
      },
      status: {
        draft: 'Brouillon',
        approved: 'Approuvé',
        archived: 'Archivé'
      }
    }
  };

  const t = labels[language];

  const toggleEntrySelection = (entryId: string) => {
    setSelectedEntries(prev =>
      prev.includes(entryId)
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    );
  };

  const selectAll = () => {
    const draftEntries = entries.filter(e => e.state === 'draft').map(e => e.id);
    setSelectedEntries(draftEntries);
  };

  const deselectAll = () => {
    setSelectedEntries([]);
  };

  const handleValidate = () => {
    if (selectedEntries.length === 0) return;

    // Update local state
    setEntries(prev =>
      prev.map(e =>
        selectedEntries.includes(e.id)
          ? { ...e, state: 'approved' as MemoryEntryState, validatedAt: Date.now() }
          : e
      )
    );

    // Callback
    onValidateEntries(selectedEntries);
    setSelectedEntries([]);
  };

  const handleReject = (entryId: string) => {
    setEntries(prev => prev.filter(e => e.id !== entryId));
    onRejectEntry(entryId);
  };

  const handleRejectAll = () => {
    entries.forEach(e => {
      if (e.state === 'draft') {
        onRejectEntry(e.id);
      }
    });
    setEntries(prev => prev.filter(e => e.state !== 'draft'));
  };

  const startEditing = (entry: PostMeetingMemoryEntry) => {
    setEditingEntry(entry.id);
    setEditContent(entry.userModifiedContent || entry.content);
  };

  const saveEdit = () => {
    if (!editingEntry) return;

    setEntries(prev =>
      prev.map(e =>
        e.id === editingEntry
          ? { ...e, userModifiedContent: editContent }
          : e
      )
    );

    onEditEntry(editingEntry, editContent);
    setEditingEntry(null);
    setEditContent('');
  };

  const cancelEdit = () => {
    setEditingEntry(null);
    setEditContent('');
  };

  const getTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
      summary: '📝',
      decision: '⚖️',
      rejected_proposal: '❌',
      open_question: '❓'
    };
    return icons[type] || '📄';
  };

  const getDestinationIcon = (dest: MemoryDestination): string => {
    if (dest === 'personal') return '🏠';
    if (dest === 'my_team') return '🤝';
    return '🌐';
  };

  const draftEntries = entries.filter(e => e.state === 'draft');
  const approvedEntries = entries.filter(e => e.state === 'approved');

  return (
    <div
      className="post-meeting-memory"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#1E1F22',
        color: '#E9E4D6'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          borderBottom: '1px solid #3A3B3E',
          background: '#2A2B2E'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🧠</span>
          <div>
            <h2 style={{ margin: 0, color: '#D8B26A', fontSize: '18px' }}>
              {t.title}
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#8D8371', fontSize: '13px' }}>
              {t.subtitle}
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            background: '#1E1F22',
            borderRadius: '8px',
            fontSize: '13px'
          }}
        >
          <span style={{ color: '#8D8371' }}>{t.from}:</span>
          <span style={{ marginLeft: '8px', color: '#E9E4D6' }}>{meetingTitle}</span>
        </div>

        {/* Warning */}
        <div
          style={{
            marginTop: '12px',
            padding: '10px 12px',
            background: 'rgba(216,178,106,0.1)',
            borderLeft: '3px solid #D8B26A',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#D8B26A'
          }}
        >
          ⚠️ {t.warning}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {/* Draft Entries */}
        {draftEntries.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}
            >
              <h4 style={{ margin: 0, color: '#8D8371', fontSize: '12px' }}>
                {t.proposed} ({draftEntries.length})
              </h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={selectAll}
                  style={{
                    padding: '4px 8px',
                    background: 'transparent',
                    border: '1px solid #3A3B3E',
                    borderRadius: '4px',
                    color: '#8D8371',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Tout sélectionner
                </button>
                <button
                  onClick={deselectAll}
                  style={{
                    padding: '4px 8px',
                    background: 'transparent',
                    border: '1px solid #3A3B3E',
                    borderRadius: '4px',
                    color: '#8D8371',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Désélectionner
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {draftEntries.map(entry => (
                <div
                  key={entry.id}
                  style={{
                    padding: '16px',
                    background: selectedEntries.includes(entry.id) ? '#2F4C39' : '#2A2B2E',
                    border: `1px solid ${selectedEntries.includes(entry.id) ? '#3F7249' : '#3A3B3E'}`,
                    borderRadius: '8px'
                  }}
                >
                  {editingEntry === entry.id ? (
                    // Edit Mode
                    <div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        style={{
                          width: '100%',
                          minHeight: '100px',
                          padding: '12px',
                          background: '#1E1F22',
                          border: '1px solid #3A3B3E',
                          borderRadius: '6px',
                          color: '#E9E4D6',
                          fontSize: '14px',
                          resize: 'vertical'
                        }}
                      />
                      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                        <button
                          onClick={saveEdit}
                          style={{
                            padding: '8px 16px',
                            background: '#3F7249',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#fff',
                            cursor: 'pointer'
                          }}
                        >
                          {t.save}
                        </button>
                        <button
                          onClick={cancelEdit}
                          style={{
                            padding: '8px 16px',
                            background: 'transparent',
                            border: '1px solid #3A3B3E',
                            borderRadius: '6px',
                            color: '#E9E4D6',
                            cursor: 'pointer'
                          }}
                        >
                          {t.cancel}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            checked={selectedEntries.includes(entry.id)}
                            onChange={() => toggleEntrySelection(entry.id)}
                            style={{ accentColor: '#D8B26A' }}
                          />
                          <span style={{ fontSize: '16px' }}>{getTypeIcon(entry.type)}</span>
                          <span style={{ fontWeight: 500, fontSize: '14px' }}>
                            {t.types[entry.type as keyof typeof t.types]}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            background: '#1E1F22',
                            borderRadius: '4px',
                            fontSize: '11px',
                            color: '#8D8371'
                          }}
                        >
                          {getDestinationIcon(entry.proposedDestination.destination)}
                          <span>
                            {t.destinations[entry.proposedDestination.destination as keyof typeof t.destinations] ||
                              entry.proposedDestination.destination}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: '12px',
                          padding: '12px',
                          background: '#1E1F22',
                          borderRadius: '6px',
                          fontSize: '14px',
                          lineHeight: 1.5
                        }}
                      >
                        {entry.userModifiedContent || entry.content}
                      </div>

                      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => startEditing(entry)}
                          style={{
                            padding: '6px 12px',
                            background: 'transparent',
                            border: '1px solid #3A3B3E',
                            borderRadius: '6px',
                            color: '#E9E4D6',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          ✏️ {t.edit}
                        </button>
                        <button
                          onClick={() => handleReject(entry.id)}
                          style={{
                            padding: '6px 12px',
                            background: 'transparent',
                            border: '1px solid #7A593A',
                            borderRadius: '6px',
                            color: '#7A593A',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          × {t.reject}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Entries */}
        {approvedEntries.length > 0 && (
          <div>
            <h4 style={{ margin: '0 0 12px 0', color: '#3F7249', fontSize: '12px' }}>
              ✓ {language === 'fr' ? 'Entrées validées' : 'Approved Entries'} ({approvedEntries.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {approvedEntries.map(entry => (
                <div
                  key={entry.id}
                  style={{
                    padding: '12px',
                    background: '#1E1F22',
                    border: '1px solid #3F7249',
                    borderRadius: '8px',
                    opacity: 0.8
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>✓</span>
                    <span style={{ fontSize: '14px' }}>
                      {t.types[entry.type as keyof typeof t.types]}
                    </span>
                    <span style={{ color: '#8D8371', fontSize: '12px' }}>
                      → {entry.proposedDestination.destination}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Entries */}
        {entries.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              color: '#8D8371'
            }}
          >
            {t.noEntries}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid #3A3B3E',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          background: '#2A2B2E'
        }}
      >
        {draftEntries.length > 0 && (
          <>
            <button
              onClick={handleValidate}
              disabled={selectedEntries.length === 0}
              style={{
                padding: '10px 20px',
                background: selectedEntries.length > 0 ? '#3F7249' : '#3A3B3E',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                cursor: selectedEntries.length > 0 ? 'pointer' : 'not-allowed',
                fontWeight: 500
              }}
            >
              ✓ {t.validate} ({selectedEntries.length})
            </button>
            <button
              onClick={handleRejectAll}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid #7A593A',
                borderRadius: '8px',
                color: '#7A593A',
                cursor: 'pointer'
              }}
            >
              {t.rejectAll}
            </button>
          </>
        )}
        <button
          onClick={onClose}
          style={{
            padding: '10px 20px',
            background: '#1E1F22',
            border: '1px solid #3A3B3E',
            borderRadius: '8px',
            color: '#E9E4D6',
            cursor: 'pointer'
          }}
        >
          {t.close}
        </button>
      </div>
    </div>
  );
};

export default PostMeetingMemory;
