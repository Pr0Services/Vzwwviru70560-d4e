// CHE·NU™ Notes Component — Bureau Notes Section

import React, { useState } from 'react';
import { CHENU_COLORS } from '../../types';

// ============================================================
// TYPES
// ============================================================

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_pinned: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// MOCK DATA
// ============================================================

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Q4 Strategy Ideas',
    content: 'Focus on three key areas:\n1. Revenue expansion through new markets\n2. Product feature velocity\n3. Team scaling and culture',
    tags: ['strategy', 'q4', 'planning'],
    is_pinned: true,
    is_archived: false,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    title: 'Meeting Notes - Team Sync',
    content: 'Discussed project timelines, resource allocation, and upcoming milestones. Action items assigned to team leads.',
    tags: ['meeting', 'team'],
    is_pinned: false,
    is_archived: false,
    created_at: '2024-01-12T09:00:00Z',
    updated_at: '2024-01-12T10:30:00Z',
  },
  {
    id: '3',
    title: 'Product Roadmap Draft',
    content: 'Phase 1: Core features\nPhase 2: Integrations\nPhase 3: Advanced analytics\nPhase 4: Mobile app',
    tags: ['product', 'roadmap'],
    is_pinned: true,
    is_archived: false,
    created_at: '2024-01-08T14:00:00Z',
    updated_at: '2024-01-14T16:00:00Z',
  },
];

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    padding: '0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  createButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  noteCard: (isPinned: boolean) => ({
    padding: '20px',
    backgroundColor: '#111113',
    borderRadius: '12px',
    border: `1px solid ${isPinned ? CHENU_COLORS.sacredGold + '44' : CHENU_COLORS.ancientStone}22`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }),
  noteHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  noteTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    margin: 0,
  },
  pinIcon: {
    fontSize: '14px',
    color: CHENU_COLORS.sacredGold,
  },
  noteContent: {
    fontSize: '14px',
    color: CHENU_COLORS.ancientStone,
    lineHeight: 1.5,
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
    marginBottom: '12px',
  },
  tag: {
    padding: '4px 10px',
    backgroundColor: '#0a0a0b',
    borderRadius: '12px',
    fontSize: '11px',
    color: CHENU_COLORS.softSand,
  },
  noteFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteDate: {
    fontSize: '12px',
    color: CHENU_COLORS.ancientStone,
  },
  noteActions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    padding: '6px 10px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: CHENU_COLORS.ancientStone,
    fontSize: '12px',
    cursor: 'pointer',
  },
  searchBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  searchInput: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    backgroundColor: '#0a0a0b',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    outline: 'none',
  },
  filterButton: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    backgroundColor: '#0a0a0b',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    cursor: 'pointer',
  },
  // Editor Modal
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#111113',
    borderRadius: '16px',
    padding: '24px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: CHENU_COLORS.ancientStone,
    fontSize: '20px',
    cursor: 'pointer',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    backgroundColor: '#0a0a0b',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  textarea: {
    width: '100%',
    minHeight: '200px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    backgroundColor: '#0a0a0b',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '20px',
  },
  cancelButton: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}44`,
    backgroundColor: 'transparent',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

// ============================================================
// COMPONENTS
// ============================================================

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onPin: () => void;
  onArchive: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onClick, onPin, onArchive }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={styles.noteCard(note.is_pinned)} onClick={onClick}>
      <div style={styles.noteHeader}>
        <h3 style={styles.noteTitle}>{note.title}</h3>
        {note.is_pinned && <span style={styles.pinIcon}>📌</span>}
      </div>
      
      <p style={styles.noteContent}>{note.content}</p>
      
      {note.tags.length > 0 && (
        <div style={styles.tagsContainer}>
          {note.tags.map((tag, idx) => (
            <span key={idx} style={styles.tag}>#{tag}</span>
          ))}
        </div>
      )}
      
      <div style={styles.noteFooter}>
        <span style={styles.noteDate}>Updated {formatDate(note.updated_at)}</span>
        <div style={styles.noteActions} onClick={(e) => e.stopPropagation()}>
          <button style={styles.actionButton} onClick={onPin}>
            {note.is_pinned ? '📌' : '📍'}
          </button>
          <button style={styles.actionButton} onClick={onArchive}>🗃️</button>
        </div>
      </div>
    </div>
  );
};

interface NoteEditorProps {
  note?: Note;
  onSave: (data: Partial<Note>) => void;
  onClose: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onClose }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tagsInput, setTagsInput] = useState(note?.tags.join(', ') || '');

  const handleSave = () => {
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    onSave({
      title,
      content,
      tags,
    });
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{note ? 'Edit Note' : 'New Note'}</h2>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Title</label>
          <input
            type="text"
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            autoFocus
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Content</label>
          <textarea
            style={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tags (comma separated)</label>
          <input
            type="text"
            style={styles.input}
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="tag1, tag2, tag3"
          />
        </div>

        <div style={styles.modalActions}>
          <button style={styles.cancelButton} onClick={onClose}>Cancel</button>
          <button style={styles.saveButton} onClick={handleSave}>
            {note ? 'Update' : 'Create'} Note
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const NotesSection: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [filter, setFilter] = useState<'all' | 'pinned'>('all');

  const filteredNotes = notes
    .filter(note => !note.is_archived)
    .filter(note => filter === 'all' || note.is_pinned)
    .filter(note => 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

  const handleCreateNote = () => {
    setEditingNote(undefined);
    setShowEditor(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleSaveNote = (data: Partial<Note>) => {
    if (editingNote) {
      setNotes(notes.map(n => 
        n.id === editingNote.id 
          ? { ...n, ...data, updated_at: new Date().toISOString() }
          : n
      ));
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: data.title || 'Untitled',
        content: data.content || '',
        tags: data.tags || [],
        is_pinned: false,
        is_archived: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
    }
    setShowEditor(false);
  };

  const handlePinNote = (noteId: string) => {
    setNotes(notes.map(n => 
      n.id === noteId ? { ...n, is_pinned: !n.is_pinned } : n
    ));
  };

  const handleArchiveNote = (noteId: string) => {
    setNotes(notes.map(n => 
      n.id === noteId ? { ...n, is_archived: true } : n
    ));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Notes</h2>
        <button style={styles.createButton} onClick={handleCreateNote}>
          + New Note
        </button>
      </div>

      <div style={styles.searchBar}>
        <input
          type="text"
          style={styles.searchInput}
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          style={{
            ...styles.filterButton,
            backgroundColor: filter === 'pinned' ? CHENU_COLORS.sacredGold + '22' : '#0a0a0b',
            borderColor: filter === 'pinned' ? CHENU_COLORS.sacredGold : undefined,
          }}
          onClick={() => setFilter(filter === 'all' ? 'pinned' : 'all')}
        >
          📌 Pinned
        </button>
      </div>

      <div style={styles.grid}>
        {filteredNotes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => handleEditNote(note)}
            onPin={() => handlePinNote(note.id)}
            onArchive={() => handleArchiveNote(note.id)}
          />
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: CHENU_COLORS.ancientStone }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>📝</p>
          <p>No notes found</p>
          <button 
            style={{ ...styles.createButton, marginTop: '16px' }}
            onClick={handleCreateNote}
          >
            Create your first note
          </button>
        </div>
      )}

      {showEditor && (
        <NoteEditor
          note={editingNote}
          onSave={handleSaveNote}
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};

export default NotesSection;
export { NoteCard, NoteEditor };
