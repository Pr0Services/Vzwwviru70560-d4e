/**
 * CHE·NU™ — Studio de Création UI Components
 * Sprint 4: Studio Sphere - Task 4.5
 * 
 * Components:
 * - ProjectGallery
 * - AssetLibrary
 * - MoodBoard Canvas
 * - TaskBoard (Kanban)
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Project {
  id: string;
  name: string;
  description?: string;
  project_type: string;
  status: string;
  progress_percent: number;
  cover_image?: string;
  color: string;
  due_date?: string;
  client_name?: string;
  task_count: number;
  asset_count: number;
}

interface Asset {
  id: string;
  filename: string;
  title?: string;
  asset_type: string;
  thumbnail_url?: string;
  file_url?: string;
  file_size?: number;
  width?: number;
  height?: number;
  is_favorite: boolean;
  tags: string[];
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  assignee_id?: string;
  tags: string[];
}

interface BoardElement {
  id: string;
  element_type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string;
  asset_id?: string;
  style: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT GALLERY COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface ProjectGalleryProps {
  projects: Project[];
  onSelect: (project: Project) => void;
  onCreate: () => void;
  onEdit: (project: Project) => void;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  projects,
  onSelect,
  onCreate,
  onEdit,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = useMemo(() => {
    let result = projects;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter(p => p.status === filterStatus);
    }

    if (filterType !== 'all') {
      result = result.filter(p => p.project_type === filterType);
    }

    return result;
  }, [projects, searchTerm, filterStatus, filterType]);

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      video: '🎬',
      audio: '🎵',
      graphic: '🎨',
      web: '🌐',
      writing: '✍️',
      photography: '📷',
      animation: '🎞️',
      '3d': '🧊',
      game: '🎮',
      general: '📁',
    };
    return icons[type] || '📁';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      concept: '#6B7280',
      planning: '#3B82F6',
      in_progress: '#F59E0B',
      review: '#8B5CF6',
      revision: '#EF4444',
      completed: '#22C55E',
      archived: '#4B5563',
    };
    return colors[status] || '#6B7280';
  };

  return (
    <div className="project-gallery">
      {/* Header */}
      <div className="gallery-header">
        <h2>🎨 Creative Projects</h2>
        <button className="btn btn--primary" onClick={onCreate}>
          + New Project
        </button>
      </div>

      {/* Filters */}
      <div className="gallery-filters">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="gallery-search"
        />
        
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="concept">Concept</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="completed">Completed</option>
        </select>

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="video">Video</option>
          <option value="graphic">Graphic</option>
          <option value="web">Web</option>
          <option value="photography">Photography</option>
        </select>

        <div className="view-toggle">
          <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>⊞</button>
          <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>☰</button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className={`gallery-content ${viewMode}`}>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => onSelect(project)}
          >
            {/* Cover Image */}
            <div 
              className="project-card__cover"
              style={{ 
                backgroundColor: project.cover_image ? 'transparent' : project.color,
                backgroundImage: project.cover_image ? `url(${project.cover_image})` : undefined,
              }}
            >
              {!project.cover_image && (
                <span className="type-icon">{getTypeIcon(project.project_type)}</span>
              )}
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(project.status) }}
              >
                {project.status.replace('_', ' ')}
              </span>
            </div>

            {/* Info */}
            <div className="project-card__info">
              <h3>{project.name}</h3>
              {project.client_name && (
                <p className="client">👤 {project.client_name}</p>
              )}
              
              {/* Progress */}
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${project.progress_percent}%` }}
                />
              </div>
              <span className="progress-text">{project.progress_percent}%</span>

              {/* Meta */}
              <div className="project-card__meta">
                <span>📋 {project.task_count}</span>
                <span>🖼️ {project.asset_count}</span>
                {project.due_date && (
                  <span className="due-date">📅 {new Date(project.due_date).toLocaleDateString()}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="project-card__actions">
              <button onClick={(e) => { e.stopPropagation(); onEdit(project); }}>✏️</button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .project-gallery {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .gallery-header h2 { margin: 0; }
        .gallery-filters {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          flex-wrap: wrap;
        }
        .gallery-search {
          flex: 1;
          min-width: 200px;
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: inherit;
        }
        .gallery-filters select {
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
        .gallery-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }
        .gallery-content.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .gallery-content.list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .project-card {
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .gallery-content.list .project-card {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .project-card__cover {
          height: 160px;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .gallery-content.list .project-card__cover {
          width: 120px;
          height: 80px;
          flex-shrink: 0;
        }
        .type-icon {
          font-size: 3rem;
          opacity: 0.3;
        }
        .status-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: capitalize;
          color: white;
        }
        .project-card__info {
          padding: 1rem;
        }
        .project-card__info h3 {
          margin: 0 0 0.25rem;
          font-size: 1.1rem;
        }
        .project-card__info .client {
          margin: 0 0 0.75rem;
          font-size: 0.875rem;
          color: #888;
        }
        .progress-bar {
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.25rem;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8B5CF6, #D8B26A);
          transition: width 0.3s;
        }
        .progress-text {
          font-size: 0.75rem;
          color: #888;
        }
        .project-card__meta {
          display: flex;
          gap: 1rem;
          margin-top: 0.75rem;
          font-size: 0.875rem;
          color: #888;
        }
        .due-date {
          margin-left: auto;
        }
        .project-card__actions {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          display: flex;
          gap: 0.25rem;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .project-card:hover .project-card__actions {
          opacity: 1;
        }
        .project-card__actions button {
          padding: 0.5rem;
          background: rgba(0,0,0,0.5);
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASSET LIBRARY COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface AssetLibraryProps {
  assets: Asset[];
  selectedIds: string[];
  onSelect: (asset: Asset, multi?: boolean) => void;
  onUpload: () => void;
  onDelete: (ids: string[]) => void;
  onFavorite: (id: string) => void;
}

export const AssetLibrary: React.FC<AssetLibraryProps> = ({
  assets,
  selectedIds,
  onSelect,
  onUpload,
  onDelete,
  onFavorite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewSize, setViewSize] = useState<'small' | 'medium' | 'large'>('medium');

  const filteredAssets = useMemo(() => {
    let result = assets;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(a => 
        a.filename.toLowerCase().includes(term) ||
        a.title?.toLowerCase().includes(term) ||
        a.tags.some(t => t.toLowerCase().includes(term))
      );
    }

    if (filterType !== 'all') {
      result = result.filter(a => a.asset_type === filterType);
    }

    return result;
  }, [assets, searchTerm, filterType]);

  const getAssetIcon = (type: string) => {
    const icons: Record<string, string> = {
      image: '🖼️',
      video: '🎬',
      audio: '🎵',
      document: '📄',
      font: '🔤',
      '3d_model': '🧊',
      archive: '📦',
    };
    return icons[type] || '📁';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const gridSizes = {
    small: '120px',
    medium: '180px',
    large: '260px',
  };

  return (
    <div className="asset-library">
      {/* Header */}
      <div className="library-header">
        <h2>🖼️ Asset Library</h2>
        <div className="header-actions">
          {selectedIds.length > 0 && (
            <button className="btn btn--danger" onClick={() => onDelete(selectedIds)}>
              Delete ({selectedIds.length})
            </button>
          )}
          <button className="btn btn--primary" onClick={onUpload}>
            + Upload
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="library-filters">
        <input
          type="text"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="library-search"
        />
        
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="audio">Audio</option>
          <option value="document">Documents</option>
          <option value="font">Fonts</option>
        </select>

        <div className="size-toggle">
          <button className={viewSize === 'small' ? 'active' : ''} onClick={() => setViewSize('small')}>S</button>
          <button className={viewSize === 'medium' ? 'active' : ''} onClick={() => setViewSize('medium')}>M</button>
          <button className={viewSize === 'large' ? 'active' : ''} onClick={() => setViewSize('large')}>L</button>
        </div>
      </div>

      {/* Stats */}
      <div className="library-stats">
        <span>{filteredAssets.length} assets</span>
        <span className="separator">•</span>
        <span>{filteredAssets.filter(a => a.is_favorite).length} favorites</span>
      </div>

      {/* Assets Grid */}
      <div 
        className="library-content"
        style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${gridSizes[viewSize]}, 1fr))` }}
      >
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className={`asset-item ${selectedIds.includes(asset.id) ? 'selected' : ''}`}
            onClick={(e) => onSelect(asset, e.ctrlKey || e.metaKey)}
          >
            {/* Thumbnail */}
            <div className="asset-item__thumb">
              {asset.thumbnail_url ? (
                <img src={asset.thumbnail_url} alt={asset.title || asset.filename} />
              ) : (
                <span className="type-icon">{getAssetIcon(asset.asset_type)}</span>
              )}
              
              {/* Favorite */}
              <button 
                className={`favorite-btn ${asset.is_favorite ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); onFavorite(asset.id); }}
              >
                {asset.is_favorite ? '❤️' : '🤍'}
              </button>

              {/* Dimensions */}
              {asset.width && asset.height && (
                <span className="dimensions">{asset.width}×{asset.height}</span>
              )}
            </div>

            {/* Info */}
            <div className="asset-item__info">
              <p className="filename">{asset.title || asset.filename}</p>
              <p className="meta">
                <span>{asset.asset_type}</span>
                <span>{formatFileSize(asset.file_size)}</span>
              </p>
            </div>

            {/* Selection indicator */}
            <div className="selection-indicator">✓</div>
          </div>
        ))}
      </div>

      <style>{`
        .asset-library {
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
        .library-header h2 { margin: 0; }
        .header-actions {
          display: flex;
          gap: 0.5rem;
        }
        .library-filters {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .library-search {
          flex: 1;
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
        .size-toggle {
          display: flex;
          gap: 2px;
        }
        .size-toggle button {
          padding: 0.5rem 0.75rem;
          background: rgba(255,255,255,0.1);
          border: none;
          cursor: pointer;
          color: #888;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .size-toggle button.active {
          background: rgba(255,255,255,0.2);
          color: #fff;
        }
        .library-stats {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          color: #888;
        }
        .separator { color: #444; margin: 0 0.5rem; }
        .library-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: grid;
          gap: 1rem;
          align-content: start;
        }
        .asset-item {
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .asset-item:hover {
          background: rgba(255,255,255,0.06);
        }
        .asset-item.selected {
          outline: 2px solid #8B5CF6;
        }
        .asset-item__thumb {
          aspect-ratio: 1;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .asset-item__thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .type-icon {
          font-size: 2.5rem;
          opacity: 0.5;
        }
        .favorite-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          padding: 0.25rem;
          background: rgba(0,0,0,0.5);
          border: none;
          border-radius: 50%;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .asset-item:hover .favorite-btn, .favorite-btn.active {
          opacity: 1;
        }
        .dimensions {
          position: absolute;
          bottom: 0.5rem;
          right: 0.5rem;
          padding: 0.125rem 0.375rem;
          background: rgba(0,0,0,0.7);
          border-radius: 4px;
          font-size: 0.625rem;
        }
        .asset-item__info {
          padding: 0.75rem;
        }
        .filename {
          margin: 0;
          font-size: 0.875rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .meta {
          margin: 0.25rem 0 0;
          font-size: 0.75rem;
          color: #888;
          display: flex;
          justify-content: space-between;
        }
        .selection-indicator {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          width: 24px;
          height: 24px;
          background: #8B5CF6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.875rem;
          opacity: 0;
          transform: scale(0.5);
          transition: all 0.2s;
        }
        .asset-item.selected .selection-indicator {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MOOD BOARD CANVAS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface MoodBoardProps {
  elements: BoardElement[];
  width: number;
  height: number;
  backgroundColor: string;
  onElementMove: (id: string, x: number, y: number) => void;
  onElementResize: (id: string, width: number, height: number) => void;
  onElementSelect: (id: string | null) => void;
  onAddElement: (element: Partial<BoardElement>) => void;
  selectedId: string | null;
}

export const MoodBoard: React.FC<MoodBoardProps> = ({
  elements,
  width,
  height,
  backgroundColor,
  onElementMove,
  onElementResize,
  onElementSelect,
  onAddElement,
  selectedId,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    onElementSelect(elementId);
    
    const element = elements.find(el => el.id === elementId);
    if (element) {
      setDragging(elementId);
      setDragOffset({
        x: e.clientX / zoom - element.x,
        y: e.clientY / zoom - element.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const newX = e.clientX / zoom - dragOffset.x;
      const newY = e.clientY / zoom - dragOffset.y;
      onElementMove(dragging, Math.max(0, newX), Math.max(0, newY));
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleCanvasClick = () => {
    onElementSelect(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const assetData = e.dataTransfer.getData('asset');
    if (assetData) {
      const asset = JSON.parse(assetData);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;
        onAddElement({
          element_type: 'image',
          x,
          y,
          width: 200,
          height: 200,
          asset_id: asset.id,
          content: asset.thumbnail_url || asset.file_url,
        });
      }
    }
  };

  return (
    <div className="mood-board">
      {/* Toolbar */}
      <div className="board-toolbar">
        <button onClick={() => onAddElement({ element_type: 'text', x: 100, y: 100, content: 'New text' })}>
          T Text
        </button>
        <button onClick={() => onAddElement({ element_type: 'sticky', x: 100, y: 100, width: 200, height: 200 })}>
          📝 Sticky
        </button>
        <button onClick={() => onAddElement({ element_type: 'shape', x: 100, y: 100, width: 100, height: 100 })}>
          ◻️ Shape
        </button>
        <span className="separator" />
        <button onClick={() => setZoom(z => Math.max(0.25, z - 0.25))}>−</button>
        <span className="zoom-level">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(2, z + 0.25))}>+</button>
        <button onClick={() => setZoom(1)}>Fit</button>
      </div>

      {/* Canvas */}
      <div 
        className="board-canvas-container"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={canvasRef}
          className="board-canvas"
          style={{
            width: width * zoom,
            height: height * zoom,
            backgroundColor,
            transform: `translate(${pan.x}px, ${pan.y}px)`,
          }}
          onClick={handleCanvasClick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {elements.map((element) => (
            <div
              key={element.id}
              className={`board-element ${selectedId === element.id ? 'selected' : ''}`}
              style={{
                left: element.x * zoom,
                top: element.y * zoom,
                width: element.width ? element.width * zoom : 'auto',
                height: element.height ? element.height * zoom : 'auto',
                ...element.style,
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
            >
              {element.element_type === 'image' && (
                <img 
                  src={element.content} 
                  alt="" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  draggable={false}
                />
              )}
              {element.element_type === 'text' && (
                <span style={element.text_style}>{element.content}</span>
              )}
              {element.element_type === 'sticky' && (
                <div className="sticky-note" style={{ backgroundColor: element.style?.backgroundColor || '#FFEB3B' }}>
                  {element.content}
                </div>
              )}
              {element.element_type === 'shape' && (
                <div className="shape" style={{ 
                  width: '100%', 
                  height: '100%', 
                  backgroundColor: element.style?.backgroundColor || '#8B5CF6',
                  borderRadius: element.style?.borderRadius || 0,
                }} />
              )}

              {/* Resize handles */}
              {selectedId === element.id && (
                <>
                  <div className="resize-handle nw" />
                  <div className="resize-handle ne" />
                  <div className="resize-handle sw" />
                  <div className="resize-handle se" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .mood-board {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #0a0a0a;
        }
        .board-toolbar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .board-toolbar button {
          padding: 0.5rem 0.75rem;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 6px;
          color: inherit;
          cursor: pointer;
          font-size: 0.875rem;
        }
        .board-toolbar button:hover {
          background: rgba(255,255,255,0.2);
        }
        .board-toolbar .separator {
          width: 1px;
          height: 24px;
          background: rgba(255,255,255,0.1);
          margin: 0 0.5rem;
        }
        .zoom-level {
          min-width: 50px;
          text-align: center;
          font-size: 0.875rem;
          color: #888;
        }
        .board-canvas-container {
          flex: 1;
          overflow: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .board-canvas {
          position: relative;
          box-shadow: 0 4px 24px rgba(0,0,0,0.5);
          border-radius: 4px;
        }
        .board-element {
          position: absolute;
          cursor: move;
          user-select: none;
        }
        .board-element.selected {
          outline: 2px solid #8B5CF6;
        }
        .sticky-note {
          width: 100%;
          height: 100%;
          padding: 1rem;
          border-radius: 4px;
          box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
          font-family: 'Comic Sans MS', cursive;
          color: #333;
        }
        .resize-handle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #8B5CF6;
          border: 2px solid white;
          border-radius: 2px;
        }
        .resize-handle.nw { top: -5px; left: -5px; cursor: nwse-resize; }
        .resize-handle.ne { top: -5px; right: -5px; cursor: nesw-resize; }
        .resize-handle.sw { bottom: -5px; left: -5px; cursor: nesw-resize; }
        .resize-handle.se { bottom: -5px; right: -5px; cursor: nwse-resize; }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TASK BOARD (KANBAN) COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface TaskBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: string) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (status: string) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onTaskMove,
  onTaskClick,
  onAddTask,
}) => {
  const columns = [
    { id: 'todo', label: 'To Do', color: '#6B7280' },
    { id: 'in_progress', label: 'In Progress', color: '#F59E0B' },
    { id: 'review', label: 'Review', color: '#8B5CF6' },
    { id: 'done', label: 'Done', color: '#22C55E' },
  ];

  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (draggedTask) {
      onTaskMove(draggedTask, columnId);
      setDraggedTask(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: '#EF4444',
      high: '#F59E0B',
      medium: '#3B82F6',
      low: '#6B7280',
    };
    return colors[priority] || '#6B7280';
  };

  return (
    <div className="task-board">
      {columns.map((column) => {
        const columnTasks = tasks.filter(t => t.status === column.id);
        
        return (
          <div
            key={column.id}
            className="task-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="column-header">
              <span className="column-color" style={{ backgroundColor: column.color }} />
              <h3>{column.label}</h3>
              <span className="task-count">{columnTasks.length}</span>
              <button className="add-btn" onClick={() => onAddTask(column.id)}>+</button>
            </div>

            {/* Tasks */}
            <div className="column-content">
              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-card ${draggedTask === task.id ? 'dragging' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onClick={() => onTaskClick(task)}
                >
                  {/* Priority indicator */}
                  <span 
                    className="priority-indicator"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  />

                  {/* Content */}
                  <h4>{task.title}</h4>
                  {task.description && (
                    <p className="task-desc">{task.description}</p>
                  )}

                  {/* Tags */}
                  {task.tags.length > 0 && (
                    <div className="task-tags">
                      {task.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="task-footer">
                    {task.due_date && (
                      <span className="due-date">
                        📅 {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <style>{`
        .task-board {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          height: 100%;
          overflow-x: auto;
        }
        .task-column {
          flex: 0 0 300px;
          display: flex;
          flex-direction: column;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          max-height: 100%;
        }
        .column-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .column-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }
        .column-header h3 {
          margin: 0;
          font-size: 0.9rem;
          flex: 1;
        }
        .task-count {
          padding: 0.125rem 0.5rem;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          font-size: 0.75rem;
        }
        .add-btn {
          padding: 0.25rem 0.5rem;
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          font-size: 1.25rem;
        }
        .add-btn:hover {
          color: #fff;
        }
        .column-content {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .task-card {
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 0.75rem;
          cursor: grab;
          transition: all 0.2s;
          position: relative;
        }
        .task-card:hover {
          background: rgba(255,255,255,0.08);
        }
        .task-card.dragging {
          opacity: 0.5;
        }
        .priority-indicator {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          border-radius: 8px 0 0 8px;
        }
        .task-card h4 {
          margin: 0 0 0.25rem;
          font-size: 0.9rem;
          padding-left: 0.5rem;
        }
        .task-desc {
          margin: 0 0 0.5rem;
          font-size: 0.8rem;
          color: #888;
          padding-left: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .task-tags {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
          padding-left: 0.5rem;
        }
        .tag {
          padding: 0.125rem 0.375rem;
          background: rgba(139, 92, 246, 0.2);
          border-radius: 4px;
          font-size: 0.7rem;
          color: #a78bfa;
        }
        .task-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-left: 0.5rem;
        }
        .due-date {
          font-size: 0.75rem;
          color: #888;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  ProjectGallery,
  AssetLibrary,
  MoodBoard,
  TaskBoard,
};
