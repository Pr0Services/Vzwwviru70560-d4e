/**
 * CHE·NU™ — Scholar UI Components
 * Sprint 3: Scholar Sphere - Task 3.6
 * 
 * Components:
 * - Reference Library
 * - Note Editor (Markdown/LaTeX)
 * - Flashcard Viewer
 * - Study Dashboard
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Author {
  name: string;
  orcid?: string;
  affiliation?: string;
}

interface Reference {
  id: string;
  reference_type: string;
  title: string;
  authors: Author[];
  year?: number;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  abstract?: string;
  keywords: string[];
  user_tags: string[];
  user_rating?: number;
  read_status: 'unread' | 'reading' | 'read' | 'to_read';
  pdf_url?: string;
  created_at: string;
}

interface Note {
  id: string;
  title: string;
  content?: string;
  content_html?: string;
  note_type: string;
  tags: string[];
  is_favorite: boolean;
  is_pinned: boolean;
  updated_at?: string;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  front_html?: string;
  back_html?: string;
  status: 'new' | 'learning' | 'review' | 'suspended';
  ease_factor: number;
  interval_days: number;
}

interface Deck {
  id: string;
  name: string;
  description?: string;
  color: string;
  card_count: number;
  due_count: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// REFERENCE LIBRARY COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface ReferenceLibraryProps {
  references: Reference[];
  onSelect: (ref: Reference) => void;
  onEdit: (ref: Reference) => void;
  onDelete: (id: string) => void;
  onImport: () => void;
}

export const ReferenceLibrary: React.FC<ReferenceLibraryProps> = ({
  references,
  onSelect,
  onEdit,
  onDelete,
  onImport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'year' | 'created'>('created');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const filteredRefs = useMemo(() => {
    let result = references;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(term) ||
        r.authors.some(a => a.name.toLowerCase().includes(term)) ||
        r.keywords.some(k => k.toLowerCase().includes(term)) ||
        r.doi?.toLowerCase().includes(term)
      );
    }

    if (filterType !== 'all') {
      result = result.filter(r => r.reference_type === filterType);
    }

    if (filterStatus !== 'all') {
      result = result.filter(r => r.read_status === filterStatus);
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return (b.year || 0) - (a.year || 0);
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [references, searchTerm, filterType, filterStatus, sortBy]);

  const formatAuthors = (authors: Author[]): string => {
    if (!authors.length) return '';
    if (authors.length === 1) return authors[0].name;
    if (authors.length === 2) return `${authors[0].name} & ${authors[1].name}`;
    return `${authors[0].name} et al.`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read': return '✅';
      case 'reading': return '📖';
      case 'to_read': return '📌';
      default: return '○';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return '📄';
      case 'book': return '📚';
      case 'conference': return '🎤';
      case 'thesis': return '🎓';
      case 'website': return '🌐';
      default: return '📑';
    }
  };

  return (
    <div className="reference-library">
      {/* Header */}
      <div className="library-header">
        <h2>📚 Reference Library</h2>
        <button className="btn btn--primary" onClick={onImport}>
          + Import
        </button>
      </div>

      {/* Filters */}
      <div className="library-filters">
        <input
          type="text"
          placeholder="Search references..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="library-search"
        />
        
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="article">Articles</option>
          <option value="book">Books</option>
          <option value="conference">Conference</option>
          <option value="thesis">Thesis</option>
          <option value="website">Website</option>
        </select>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="reading">Reading</option>
          <option value="read">Read</option>
          <option value="to_read">To Read</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
          <option value="created">Recently Added</option>
          <option value="year">Year</option>
          <option value="title">Title</option>
        </select>

        <div className="view-toggle">
          <button 
            className={viewMode === 'list' ? 'active' : ''} 
            onClick={() => setViewMode('list')}
          >
            ☰
          </button>
          <button 
            className={viewMode === 'grid' ? 'active' : ''} 
            onClick={() => setViewMode('grid')}
          >
            ⊞
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="library-stats">
        <span>{filteredRefs.length} references</span>
        <span className="separator">•</span>
        <span>{filteredRefs.filter(r => r.read_status === 'read').length} read</span>
      </div>

      {/* Reference List */}
      <div className={`library-content ${viewMode}`}>
        {filteredRefs.map((ref) => (
          <div
            key={ref.id}
            className="reference-item"
            onClick={() => onSelect(ref)}
          >
            <div className="reference-item__icon">
              {getTypeIcon(ref.reference_type)}
            </div>
            
            <div className="reference-item__content">
              <h4 className="reference-item__title">{ref.title}</h4>
              <p className="reference-item__authors">
                {formatAuthors(ref.authors)}
                {ref.year && ` (${ref.year})`}
              </p>
              {ref.journal && (
                <p className="reference-item__journal">{ref.journal}</p>
              )}
              {ref.user_tags.length > 0 && (
                <div className="reference-item__tags">
                  {ref.user_tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="reference-item__meta">
              <span className="status">{getStatusIcon(ref.read_status)}</span>
              {ref.user_rating && (
                <span className="rating">{'⭐'.repeat(ref.user_rating)}</span>
              )}
              {ref.pdf_url && <span className="pdf">PDF</span>}
            </div>

            <div className="reference-item__actions">
              <button onClick={(e) => { e.stopPropagation(); onEdit(ref); }}>✏️</button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(ref.id); }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .reference-library {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .library-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .library-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }
        .library-filters {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          flex-wrap: wrap;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .library-search {
          flex: 1;
          min-width: 200px;
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: inherit;
        }
        .library-filters select {
          padding: 0.5rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: inherit;
        }
        .view-toggle {
          display: flex;
          gap: 2px;
        }
        .view-toggle button {
          padding: 0.5rem;
          background: rgba(255,255,255,0.1);
          border: none;
          cursor: pointer;
          color: #888;
        }
        .view-toggle button.active {
          background: rgba(255,255,255,0.2);
          color: #fff;
        }
        .library-stats {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          color: #888;
        }
        .separator {
          color: #444;
          margin: 0 0.5rem;
        }
        .library-content {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem;
        }
        .library-content.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }
        .reference-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .library-content.grid .reference-item {
          flex-direction: column;
          margin-bottom: 0;
        }
        .reference-item:hover {
          background: rgba(255,255,255,0.06);
        }
        .reference-item__icon {
          font-size: 1.5rem;
          min-width: 40px;
          text-align: center;
        }
        .reference-item__content {
          flex: 1;
          min-width: 0;
        }
        .reference-item__title {
          margin: 0 0 0.25rem;
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.3;
        }
        .reference-item__authors, .reference-item__journal {
          margin: 0;
          font-size: 0.875rem;
          color: #888;
        }
        .reference-item__journal {
          font-style: italic;
          color: #aaa;
        }
        .reference-item__tags {
          display: flex;
          gap: 0.25rem;
          margin-top: 0.5rem;
        }
        .tag {
          padding: 0.125rem 0.5rem;
          background: rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          font-size: 0.75rem;
          color: #a78bfa;
        }
        .reference-item__meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
          font-size: 0.875rem;
        }
        .reference-item__meta .pdf {
          padding: 0.125rem 0.375rem;
          background: #EF4444;
          border-radius: 4px;
          font-size: 0.625rem;
          font-weight: 600;
        }
        .reference-item__actions {
          display: flex;
          gap: 0.25rem;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .reference-item:hover .reference-item__actions {
          opacity: 1;
        }
        .reference-item__actions button {
          padding: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// NOTE EDITOR COMPONENT (Markdown/LaTeX)
// ═══════════════════════════════════════════════════════════════════════════════

interface NoteEditorProps {
  note?: Note;
  onSave: (note: Partial<Note>) => void;
  onCancel: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      id: note?.id,
      title: title.trim(),
      content,
      tags,
    });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selected + after + content.substring(end);
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  return (
    <div className="note-editor">
      {/* Header */}
      <div className="note-editor__header">
        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="note-editor__title"
        />
        <div className="note-editor__actions">
          <button onClick={onCancel}>Cancel</button>
          <button className="btn btn--primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="note-editor__toolbar">
        <button onClick={() => insertMarkdown('**', '**')} title="Bold">B</button>
        <button onClick={() => insertMarkdown('*', '*')} title="Italic">I</button>
        <button onClick={() => insertMarkdown('# ')} title="Heading">H</button>
        <button onClick={() => insertMarkdown('- ')} title="List">•</button>
        <button onClick={() => insertMarkdown('1. ')} title="Numbered">1.</button>
        <button onClick={() => insertMarkdown('[', '](url)')} title="Link">🔗</button>
        <button onClick={() => insertMarkdown('```\n', '\n```')} title="Code">{'</>'}</button>
        <button onClick={() => insertMarkdown('$', '$')} title="Inline Math">∑</button>
        <button onClick={() => insertMarkdown('$$\n', '\n$$')} title="Block Math">∫</button>
        <span className="toolbar-separator" />
        <button 
          onClick={() => setPreviewMode(!previewMode)}
          className={previewMode ? 'active' : ''}
        >
          {previewMode ? 'Edit' : 'Preview'}
        </button>
      </div>

      {/* Content */}
      <div className="note-editor__content">
        {previewMode ? (
          <div 
            className="note-editor__preview"
            dangerouslySetInnerHTML={{ __html: note?.content_html || content }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here... Supports Markdown and LaTeX ($..$ for inline, $$...$$ for block)"
            className="note-editor__textarea"
          />
        )}
      </div>

      {/* Tags */}
      <div className="note-editor__tags">
        <span className="tags-label">Tags:</span>
        {tags.map(tag => (
          <span key={tag} className="tag" onClick={() => handleRemoveTag(tag)}>
            {tag} ×
          </span>
        ))}
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add tag..."
          className="tag-input"
        />
      </div>

      {/* Footer hints */}
      <div className="note-editor__hints">
        <span>Markdown supported</span>
        <span>•</span>
        <span>LaTeX: $x^2$ or $$\sum_{i=1}^n$$</span>
      </div>

      <style>{`
        .note-editor {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--color-ui-slate, #1E1F22);
        }
        .note-editor__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .note-editor__title {
          flex: 1;
          padding: 0.5rem;
          background: transparent;
          border: none;
          font-size: 1.25rem;
          font-weight: 600;
          color: inherit;
        }
        .note-editor__actions {
          display: flex;
          gap: 0.5rem;
        }
        .note-editor__actions button {
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 8px;
          color: inherit;
          cursor: pointer;
        }
        .note-editor__toolbar {
          display: flex;
          gap: 0.25rem;
          padding: 0.5rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .note-editor__toolbar button {
          padding: 0.5rem 0.75rem;
          background: rgba(255,255,255,0.05);
          border: none;
          border-radius: 4px;
          color: #888;
          cursor: pointer;
          font-family: monospace;
        }
        .note-editor__toolbar button:hover, .note-editor__toolbar button.active {
          background: rgba(255,255,255,0.15);
          color: #fff;
        }
        .toolbar-separator {
          width: 1px;
          background: rgba(255,255,255,0.1);
          margin: 0 0.5rem;
        }
        .note-editor__content {
          flex: 1;
          overflow: hidden;
        }
        .note-editor__textarea {
          width: 100%;
          height: 100%;
          padding: 1rem;
          background: transparent;
          border: none;
          color: inherit;
          font-family: 'SF Mono', Consolas, monospace;
          font-size: 0.95rem;
          line-height: 1.6;
          resize: none;
        }
        .note-editor__preview {
          padding: 1rem;
          overflow-y: auto;
          height: 100%;
          line-height: 1.6;
        }
        .note-editor__tags {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          flex-wrap: wrap;
        }
        .tags-label {
          color: #888;
          font-size: 0.875rem;
        }
        .tag {
          padding: 0.25rem 0.5rem;
          background: rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          font-size: 0.8rem;
          color: #a78bfa;
          cursor: pointer;
        }
        .tag:hover {
          background: rgba(139, 92, 246, 0.3);
        }
        .tag-input {
          padding: 0.25rem 0.5rem;
          background: transparent;
          border: 1px dashed rgba(255,255,255,0.2);
          border-radius: 12px;
          font-size: 0.8rem;
          color: inherit;
          width: 100px;
        }
        .note-editor__hints {
          display: flex;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          color: #666;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// FLASHCARD VIEWER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface FlashcardViewerProps {
  cards: Flashcard[];
  onAnswer: (cardId: string, rating: 0 | 1 | 2 | 3) => void;
  onComplete: () => void;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  cards,
  onAnswer,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleAnswer = (rating: 0 | 1 | 2 | 3) => {
    onAnswer(currentCard.id, rating);
    
    setStats(prev => ({
      correct: prev.correct + (rating >= 2 ? 1 : 0),
      incorrect: prev.incorrect + (rating < 2 ? 1 : 0),
    }));

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      onComplete();
    }
  };

  if (!currentCard) {
    return (
      <div className="flashcard-complete">
        <h2>🎉 Session Complete!</h2>
        <div className="stats">
          <div className="stat correct">
            <span className="value">{stats.correct}</span>
            <span className="label">Correct</span>
          </div>
          <div className="stat incorrect">
            <span className="value">{stats.incorrect}</span>
            <span className="label">Incorrect</span>
          </div>
        </div>
        <button className="btn btn--primary" onClick={onComplete}>
          Finish
        </button>
      </div>
    );
  }

  return (
    <div className="flashcard-viewer">
      {/* Progress */}
      <div className="flashcard-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span>{currentIndex + 1} / {cards.length}</span>
      </div>

      {/* Card */}
      <div 
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <div 
              className="flashcard-content"
              dangerouslySetInnerHTML={{ __html: currentCard.front_html || currentCard.front }}
            />
            <p className="flashcard-hint">Click to reveal answer</p>
          </div>
          <div className="flashcard-back">
            <div 
              className="flashcard-content"
              dangerouslySetInnerHTML={{ __html: currentCard.back_html || currentCard.back }}
            />
          </div>
        </div>
      </div>

      {/* Answer buttons */}
      {isFlipped && (
        <div className="flashcard-buttons">
          <button className="btn-again" onClick={() => handleAnswer(0)}>
            Again
            <span className="interval">{"<1m"}</span>
          </button>
          <button className="btn-hard" onClick={() => handleAnswer(1)}>
            Hard
            <span className="interval">1d</span>
          </button>
          <button className="btn-good" onClick={() => handleAnswer(2)}>
            Good
            <span className="interval">3d</span>
          </button>
          <button className="btn-easy" onClick={() => handleAnswer(3)}>
            Easy
            <span className="interval">7d</span>
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="flashcard-stats">
        <span className="correct">✓ {stats.correct}</span>
        <span className="incorrect">✗ {stats.incorrect}</span>
      </div>

      <style>{`
        .flashcard-viewer {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          height: 100%;
        }
        .flashcard-progress {
          width: 100%;
          max-width: 600px;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .progress-bar {
          flex: 1;
          height: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8B5CF6, #D8B26A);
          transition: width 0.3s;
        }
        .flashcard {
          width: 100%;
          max-width: 600px;
          height: 400px;
          perspective: 1000px;
          cursor: pointer;
        }
        .flashcard-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flashcard.flipped .flashcard-inner {
          transform: rotateY(180deg);
        }
        .flashcard-front, .flashcard-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: rgba(255,255,255,0.05);
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .flashcard-back {
          transform: rotateY(180deg);
          background: rgba(139, 92, 246, 0.1);
        }
        .flashcard-content {
          font-size: 1.5rem;
          text-align: center;
          line-height: 1.6;
        }
        .flashcard-hint {
          position: absolute;
          bottom: 1rem;
          color: #666;
          font-size: 0.875rem;
        }
        .flashcard-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
        .flashcard-buttons button {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: transform 0.2s;
        }
        .flashcard-buttons button:hover {
          transform: translateY(-2px);
        }
        .flashcard-buttons .interval {
          font-size: 0.75rem;
          opacity: 0.7;
          margin-top: 0.25rem;
        }
        .btn-again { background: #EF4444; color: white; }
        .btn-hard { background: #F59E0B; color: white; }
        .btn-good { background: #22C55E; color: white; }
        .btn-easy { background: #3B82F6; color: white; }
        .flashcard-stats {
          display: flex;
          gap: 2rem;
          margin-top: 2rem;
          font-size: 1rem;
        }
        .flashcard-stats .correct { color: #22C55E; }
        .flashcard-stats .incorrect { color: #EF4444; }
        .flashcard-complete {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
        }
        .flashcard-complete h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
        }
        .flashcard-complete .stats {
          display: flex;
          gap: 3rem;
          margin-bottom: 2rem;
        }
        .flashcard-complete .stat {
          display: flex;
          flex-direction: column;
        }
        .flashcard-complete .value {
          font-size: 3rem;
          font-weight: 700;
        }
        .flashcard-complete .label {
          color: #888;
        }
        .flashcard-complete .correct .value { color: #22C55E; }
        .flashcard-complete .incorrect .value { color: #EF4444; }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STUDY DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface StudyDashboardProps {
  decks: Deck[];
  todayStats: {
    cards_studied: number;
    time_minutes: number;
    streak_days: number;
  };
  onStartDeck: (deckId: string) => void;
  onCreateDeck: () => void;
}

export const StudyDashboard: React.FC<StudyDashboardProps> = ({
  decks,
  todayStats,
  onStartDeck,
  onCreateDeck,
}) => {
  const totalDue = decks.reduce((sum, d) => sum + d.due_count, 0);

  return (
    <div className="study-dashboard">
      {/* Header Stats */}
      <div className="dashboard-header">
        <h2>📖 Study Dashboard</h2>
        <div className="header-stats">
          <div className="stat">
            <span className="value">{todayStats.cards_studied}</span>
            <span className="label">Cards Today</span>
          </div>
          <div className="stat">
            <span className="value">{todayStats.time_minutes}m</span>
            <span className="label">Time</span>
          </div>
          <div className="stat streak">
            <span className="value">🔥 {todayStats.streak_days}</span>
            <span className="label">Day Streak</span>
          </div>
        </div>
      </div>

      {/* Due Today */}
      {totalDue > 0 && (
        <div className="due-banner">
          <span>📚 {totalDue} cards due today</span>
          <button className="btn btn--primary">Study All</button>
        </div>
      )}

      {/* Decks Grid */}
      <div className="decks-section">
        <div className="section-header">
          <h3>Your Decks</h3>
          <button onClick={onCreateDeck}>+ New Deck</button>
        </div>
        
        <div className="decks-grid">
          {decks.map((deck) => (
            <div 
              key={deck.id} 
              className="deck-card"
              style={{ borderColor: deck.color }}
              onClick={() => onStartDeck(deck.id)}
            >
              <div className="deck-card__header" style={{ backgroundColor: deck.color }}>
                <h4>{deck.name}</h4>
              </div>
              <div className="deck-card__body">
                <p className="deck-card__description">{deck.description}</p>
                <div className="deck-card__stats">
                  <span>{deck.card_count} cards</span>
                  {deck.due_count > 0 && (
                    <span className="due">{deck.due_count} due</span>
                  )}
                </div>
              </div>
              <button className="deck-card__study">
                Study Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .study-dashboard {
          padding: 1.5rem;
          overflow-y: auto;
          height: 100%;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }
        .dashboard-header h2 {
          margin: 0;
        }
        .header-stats {
          display: flex;
          gap: 2rem;
        }
        .header-stats .stat {
          text-align: center;
        }
        .header-stats .value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
        }
        .header-stats .label {
          font-size: 0.75rem;
          color: #888;
        }
        .header-stats .streak .value {
          color: #F59E0B;
        }
        .due-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }
        .decks-section {
          margin-top: 1rem;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .section-header h3 {
          margin: 0;
          font-size: 1rem;
          color: #888;
        }
        .section-header button {
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 8px;
          color: inherit;
          cursor: pointer;
        }
        .decks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        .deck-card {
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          border: 2px solid;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
        }
        .deck-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .deck-card__header {
          padding: 1.25rem;
          color: white;
        }
        .deck-card__header h4 {
          margin: 0;
          font-size: 1.1rem;
        }
        .deck-card__body {
          padding: 1rem 1.25rem;
        }
        .deck-card__description {
          margin: 0 0 0.75rem;
          font-size: 0.875rem;
          color: #888;
        }
        .deck-card__stats {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
        }
        .deck-card__stats .due {
          color: #F59E0B;
          font-weight: 500;
        }
        .deck-card__study {
          width: 100%;
          padding: 0.75rem;
          background: rgba(255,255,255,0.05);
          border: none;
          border-top: 1px solid rgba(255,255,255,0.1);
          color: inherit;
          cursor: pointer;
          font-weight: 500;
        }
        .deck-card:hover .deck-card__study {
          background: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  ReferenceLibrary,
  NoteEditor,
  FlashcardViewer,
  StudyDashboard,
};
