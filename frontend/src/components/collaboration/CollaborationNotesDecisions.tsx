// CHE·NU™ Collaboration Notes & Decisions
// Objectif: Mémoire collective
// ✔ Ultra important pour éviter les débats cycliques

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';
import { CollaborationNote, NoteCategory, NOTE_CATEGORY_CONFIG } from './collaboration.types';

interface CollaborationNotesDecisionsProps {
  collaborationId: string;
  canContribute: boolean;
}

const styles = {
  container: {
    display: 'flex',
    gap: '24px',
    height: '100%',
  },
  
  // Left Panel - Notes List
  leftPanel: {
    width: '340px',
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#111113',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  
  // Category Tabs
  categoryTabs: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
    padding: '16px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  categoryTab: (isActive: boolean, color: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: isActive ? color + '22' : 'transparent',
    color: isActive ? color : CHENU_COLORS.ancientStone,
    border: `1px solid ${isActive ? color + '44' : CHENU_COLORS.ancientStone + '22'}`,
    borderRadius: '8px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  }),
  
  // Notes List
  notesList: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '12px',
  },
  noteItem: (isSelected: boolean) => ({
    padding: '14px',
    backgroundColor: isSelected ? CHENU_COLORS.sacredGold + '11' : '#0a0a0b',
    borderRadius: '10px',
    marginBottom: '8px',
    cursor: 'pointer',
    border: `1px solid ${isSelected ? CHENU_COLORS.sacredGold + '33' : 'transparent'}`,
    transition: 'all 0.15s ease',
  }),
  noteItemHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  noteItemTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    flex: 1,
  },
  noteItemCategory: (color: string) => ({
    padding: '2px 8px',
    backgroundColor: color + '22',
    color: color,
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: 500,
  }),
  noteItemPreview: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
    lineHeight: 1.4,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
  },
  noteItemMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '10px',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  pinnedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: CHENU_COLORS.sacredGold,
  },
  
  // Right Panel - Note Detail
  rightPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#111113',
    borderRadius: '14px',
    overflow: 'hidden',
  },
  detailHeader: {
    padding: '20px 24px',
    borderBottom: `1px solid ${CHENU_COLORS.ancientStone}22`,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  detailTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '8px',
  },
  detailMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  detailActions: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    padding: '8px 14px',
    backgroundColor: 'transparent',
    border: `1px solid ${CHENU_COLORS.ancientStone}44`,
    borderRadius: '8px',
    color: CHENU_COLORS.softSand,
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  detailContent: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto' as const,
  },
  contentText: {
    fontSize: '14px',
    lineHeight: 1.8,
    color: CHENU_COLORS.softSand,
    whiteSpace: 'pre-wrap' as const,
  },
  tagsSection: {
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  tagsLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    marginBottom: '10px',
  },
  tagsList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
  },
  tag: {
    padding: '4px 10px',
    backgroundColor: '#0a0a0b',
    borderRadius: '6px',
    fontSize: '12px',
    color: CHENU_COLORS.softSand,
  },
  
  // Empty state
  emptyDetail: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    color: CHENU_COLORS.ancientStone,
    textAlign: 'center' as const,
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5,
  },
  
  // Add Note Button
  addNoteBtn: {
    margin: '12px',
    padding: '12px',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
};

// Mock data
const MOCK_NOTES: CollaborationNote[] = [
  {
    id: '1',
    collaboration_id: '1',
    category: 'decision',
    title: 'Collaboration dans Business Sphere',
    content: `Décision prise lors du meeting du 27 décembre 2025.

Le module Collaboration sera placé dans la sphère Business, au niveau projet, plutôt que comme un espace global isolé.

**Raisons:**
- C'est le business de Jonathan, il contrôle qui entre
- Les collaborateurs ont accès seulement au projet invité
- Système d'invitation propre (utilisateurs CHE·NU + email)
- Reste dans la logique des sphères existantes
- Scalable - d'autres utilisateurs pourront avoir leurs propres Collaborations

**Impact:**
- Navigation: Business → Projects → CHE·NU → Collaboration
- Permissions héritées du projet parent
- Isolation des données par projet`,
    tags: ['architecture', 'navigation', 'permissions'],
    pinned: true,
    created_by: 'Jonathan',
    created_at: '2025-12-27T15:00:00Z',
    updated_at: '2025-12-27T15:00:00Z',
  },
  {
    id: '2',
    collaboration_id: '1',
    category: 'decision',
    title: 'Agents désactivés par défaut',
    content: `Dans CHE·NU · Collaboration:
- Agents désactivés par défaut
- Autorisés uniquement pour:
  - Prise de notes
  - Synthèse
  - Rappel de décisions
- ❌ Jamais pour décider
- ❌ Jamais pour envoyer des messages externes

👉 L'humain reste central.`,
    tags: ['agents', 'governance', 'human-sovereignty'],
    pinned: true,
    created_by: 'Jonathan',
    created_at: '2025-12-26T10:00:00Z',
    updated_at: '2025-12-26T10:00:00Z',
  },
  {
    id: '3',
    collaboration_id: '1',
    category: 'design_choice',
    title: 'Structure des 5 sections',
    content: `Le Collaboration Space a 5 sections internes:

1. **Overview** - Contexte rapide
   - Vision courte
   - Objectifs actuels
   - Prochain meeting
   - Dernières décisions
   ❌ Pas de graphiques
   ❌ Pas de stats business

2. **Meetings** - Décisions synchrones
   - Upcoming / Past
   - Context → Agenda → Notes → Decisions → Action items

3. **Working Sessions** - Travail réel
   - Active / Planned / Completed
   - Goal → Scope → Participants → Notes → Outputs
   👉 Une session = un objectif clair

4. **Notes & Decisions** - Mémoire collective
   - Decisions log
   - Design choices
   - Rejected options
   - Open questions
   ✔ Évite les débats cycliques

5. **Vision & Principles** - Stabilité idéologique
   - Mission
   - Values
   - Design principles
   - Ethical boundaries
   - Non-negotiables`,
    tags: ['ui', 'structure', 'navigation'],
    pinned: false,
    created_by: 'Jonathan',
    created_at: '2025-12-27T11:00:00Z',
    updated_at: '2025-12-27T11:00:00Z',
  },
  {
    id: '4',
    collaboration_id: '1',
    category: 'rejected_option',
    title: 'Collaboration comme onglet global',
    content: `Option rejetée: Avoir Collaboration comme un onglet/espace global au même niveau que les sphères.

**Problèmes:**
- Casse la logique des 9 sphères
- Pas clair qui contrôle l'espace
- Permissions complexes
- Pas scalable pour plusieurs projets

**Alternative choisie:** Collaboration dans Business → Projects`,
    tags: ['rejected', 'architecture'],
    pinned: false,
    created_by: 'Jonathan',
    created_at: '2025-12-27T14:30:00Z',
    updated_at: '2025-12-27T14:30:00Z',
  },
  {
    id: '5',
    collaboration_id: '1',
    category: 'open_question',
    title: 'Permissions cross-project?',
    content: `Question ouverte: Est-ce qu'un collaborateur invité sur un projet pourrait avoir accès à d'autres projets du même owner?

**Options:**
1. Non, strictement isolé par projet
2. Oui, si explicitement partagé
3. Rôle "Organization Contributor" qui donne accès à tous les projets

À discuter au prochain meeting.`,
    tags: ['permissions', 'to-discuss'],
    pinned: false,
    created_by: 'Claude',
    created_at: '2025-12-28T09:00:00Z',
    updated_at: '2025-12-28T09:00:00Z',
  },
];

const CollaborationNotesDecisions: React.FC<CollaborationNotesDecisionsProps> = ({
  collaborationId,
  canContribute,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory | 'all'>('all');
  const [selectedNote, setSelectedNote] = useState<CollaborationNote | null>(MOCK_NOTES[0]);
  
  const filteredNotes = selectedCategory === 'all'
    ? MOCK_NOTES
    : MOCK_NOTES.filter(n => n.category === selectedCategory);
  
  // Sort: pinned first, then by date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div style={styles.container}>
      {/* Left Panel - Notes List */}
      <div style={styles.leftPanel}>
        {/* Category Tabs */}
        <div style={styles.categoryTabs}>
          <button
            style={styles.categoryTab(selectedCategory === 'all', CHENU_COLORS.softSand)}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {(Object.entries(NOTE_CATEGORY_CONFIG) as [NoteCategory, typeof NOTE_CATEGORY_CONFIG[NoteCategory]][]).map(([key, config]) => (
            <button
              key={key}
              style={styles.categoryTab(selectedCategory === key, config.color)}
              onClick={() => setSelectedCategory(key)}
            >
              <span>{config.icon}</span>
              <span>{config.name}</span>
            </button>
          ))}
        </div>
        
        {/* Notes List */}
        <div style={styles.notesList}>
          {sortedNotes.map(note => {
            const categoryConfig = NOTE_CATEGORY_CONFIG[note.category];
            return (
              <div
                key={note.id}
                style={styles.noteItem(selectedNote?.id === note.id)}
                onClick={() => setSelectedNote(note)}
              >
                <div style={styles.noteItemHeader}>
                  <div style={styles.noteItemTitle}>{note.title}</div>
                  <span style={styles.noteItemCategory(categoryConfig.color)}>
                    {categoryConfig.icon}
                  </span>
                </div>
                <div style={styles.noteItemPreview}>
                  {note.content.split('\n')[0].substring(0, 100)}...
                </div>
                <div style={styles.noteItemMeta}>
                  {note.pinned && (
                    <span style={styles.pinnedBadge}>
                      <span>📌</span>
                      <span>Pinned</span>
                    </span>
                  )}
                  <span>{formatDate(note.created_at)}</span>
                  <span>by {note.created_by}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Add Note Button */}
        {canContribute && (
          <button style={styles.addNoteBtn}>
            <span>+</span>
            <span>Add Note</span>
          </button>
        )}
      </div>
      
      {/* Right Panel - Note Detail */}
      <div style={styles.rightPanel}>
        {selectedNote ? (
          <>
            <div style={styles.detailHeader}>
              <div>
                <div style={styles.detailTitle}>{selectedNote.title}</div>
                <div style={styles.detailMeta}>
                  <span style={{
                    padding: '4px 10px',
                    backgroundColor: NOTE_CATEGORY_CONFIG[selectedNote.category].color + '22',
                    color: NOTE_CATEGORY_CONFIG[selectedNote.category].color,
                    borderRadius: '6px',
                  }}>
                    {NOTE_CATEGORY_CONFIG[selectedNote.category].icon} {NOTE_CATEGORY_CONFIG[selectedNote.category].name}
                  </span>
                  <span>Created {formatDate(selectedNote.created_at)}</span>
                  <span>by {selectedNote.created_by}</span>
                </div>
              </div>
              {canContribute && (
                <div style={styles.detailActions}>
                  <button style={styles.actionBtn}>
                    <span>📌</span>
                    <span>{selectedNote.pinned ? 'Unpin' : 'Pin'}</span>
                  </button>
                  <button style={styles.actionBtn}>
                    <span>✏️</span>
                    <span>Edit</span>
                  </button>
                </div>
              )}
            </div>
            
            <div style={styles.detailContent}>
              <div style={styles.contentText}>{selectedNote.content}</div>
              
              {selectedNote.tags.length > 0 && (
                <div style={styles.tagsSection}>
                  <div style={styles.tagsLabel}>Tags</div>
                  <div style={styles.tagsList}>
                    {selectedNote.tags.map(tag => (
                      <span key={tag} style={styles.tag}>#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={styles.emptyDetail}>
            <div style={styles.emptyIcon}>📋</div>
            <div>Select a note to view details</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationNotesDecisions;
