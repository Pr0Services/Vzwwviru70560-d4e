/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — DATA & FILES SECTION                            ║
 * ║                    📁 Données & Fichiers — Gestion documentaire             ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  Interface pour gérer les données et fichiers:                               ║
 * ║  • Upload et téléchargement                                                  ║
 * ║  • Organisation par dossiers                                                 ║
 * ║  • Recherche et filtres                                                      ║
 * ║  • Prévisualisation                                                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useRef } from 'react';

interface DataFilesSectionProps {
  sphereId: string;
  sphereName: string;
  sphereColor: string;
}

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
  size?: number;
  modifiedAt: Date;
  createdBy?: string;
  shared: boolean;
  starred: boolean;
  parentId: string | null;
}

export const DataFilesSection: React.FC<DataFilesSectionProps> = ({
  sphereId,
  sphereName,
  sphereColor,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files] = useState<FileItem[]>([
    { id: 'f1', name: 'Projets 2025', type: 'folder', modifiedAt: new Date(), shared: true, starred: true, parentId: null },
    { id: 'f2', name: 'Documents légaux', type: 'folder', modifiedAt: new Date(Date.now() - 86400000), shared: false, starred: false, parentId: null },
    { id: 'f3', name: 'Rapport Annuel 2024.pdf', type: 'document', size: 2450000, modifiedAt: new Date(Date.now() - 172800000), shared: true, starred: true, parentId: null },
    { id: 'f4', name: 'Logo CHE-NU.png', type: 'image', size: 156000, modifiedAt: new Date(Date.now() - 259200000), shared: false, starred: false, parentId: null },
    { id: 'f5', name: 'Présentation Investisseurs.pptx', type: 'document', size: 5600000, modifiedAt: new Date(Date.now() - 345600000), shared: true, starred: false, parentId: null },
    { id: 'f6', name: 'Vidéo Demo.mp4', type: 'video', size: 125000000, modifiedAt: new Date(Date.now() - 432000000), shared: false, starred: false, parentId: null },
    { id: 'f7', name: 'Archive Q3.zip', type: 'archive', size: 45000000, modifiedAt: new Date(Date.now() - 518400000), shared: false, starred: false, parentId: null },
  ]);

  const currentFiles = files
    .filter(f => f.parentId === currentFolder)
    .filter(f => searchQuery === '' || f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      // Folders first
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return b.modifiedAt.getTime() - a.modifiedAt.getTime();
      if (sortBy === 'size') return (b.size || 0) - (a.size || 0);
      return 0;
    });

  const getFileIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'folder': return '📁';
      case 'document': return '📄';
      case 'image': return '🖼️';
      case 'video': return '🎬';
      case 'audio': return '🎵';
      case 'archive': return '📦';
      default: return '📎';
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const totalSize = files.reduce((sum, f) => sum + (f.size || 0), 0);
  const usedPercentage = (totalSize / (5 * 1024 * 1024 * 1024)) * 100; // 5GB limit

  return (
    <div className="datafiles-section">
      {/* Header */}
      <div className="section-header">
        <div className="header-title">
          <span className="header-icon">📁</span>
          <h2>Données & Fichiers</h2>
          <span className="sphere-badge" style={{ background: sphereColor }}>
            {sphereName}
          </span>
        </div>
        <div className="header-actions">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            multiple
            onChange={(e) => console.log('Files:', e.target.files)}
          />
          <button className="upload-btn" onClick={handleUpload} style={{ background: sphereColor }}>
            ⬆️ Upload
          </button>
          <button className="new-folder-btn">📁 Nouveau dossier</button>
        </div>
      </div>

      {/* Storage Info */}
      <div className="storage-info">
        <div className="storage-bar">
          <div className="storage-used" style={{ width: `${usedPercentage}%`, background: sphereColor }} />
        </div>
        <span className="storage-text">
          {formatSize(totalSize)} utilisés sur 5 GB ({usedPercentage.toFixed(1)}%)
        </span>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button 
            className="breadcrumb-item"
            onClick={() => setCurrentFolder(null)}
          >
            🏠 Racine
          </button>
          {/* TODO: Add folder hierarchy */}
        </div>

        {/* Search */}
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* View & Sort */}
        <div className="view-options">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="name">Nom</option>
            <option value="date">Date</option>
            <option value="size">Taille</option>
          </select>
          
          <div className="view-toggle">
            <button 
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              ⊞
            </button>
            <button 
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Selection Actions */}
      {selectedItems.length > 0 && (
        <div className="selection-bar" style={{ background: sphereColor }}>
          <span>{selectedItems.length} sélectionné(s)</span>
          <div className="selection-actions">
            <button>📥 Télécharger</button>
            <button>📤 Partager</button>
            <button>📋 Copier</button>
            <button>🗑️ Supprimer</button>
          </div>
          <button className="clear-selection" onClick={() => setSelectedItems([])}>
            ✕
          </button>
        </div>
      )}

      {/* File Grid/List */}
      {currentFiles.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📂</span>
          <p>Ce dossier est vide</p>
          <button className="empty-btn" onClick={handleUpload} style={{ background: sphereColor }}>
            Ajouter des fichiers
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="files-grid">
          {currentFiles.map(file => (
            <div
              key={file.id}
              className={`file-card ${selectedItems.includes(file.id) ? 'selected' : ''}`}
              onClick={() => file.type === 'folder' ? setCurrentFolder(file.id) : toggleSelect(file.id)}
              style={{ '--accent': sphereColor } as React.CSSProperties}
            >
              {file.starred && <span className="star-badge">⭐</span>}
              {file.shared && <span className="share-badge">👥</span>}
              
              <div className="file-icon">{getFileIcon(file.type)}</div>
              <div className="file-name">{file.name}</div>
              <div className="file-meta">
                {file.type === 'folder' ? (
                  <span>{files.filter(f => f.parentId === file.id).length} éléments</span>
                ) : (
                  <span>{formatSize(file.size)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="files-list">
          <div className="list-header">
            <span className="col-name">Nom</span>
            <span className="col-size">Taille</span>
            <span className="col-date">Modifié</span>
            <span className="col-actions"></span>
          </div>
          {currentFiles.map(file => (
            <div
              key={file.id}
              className={`list-item ${selectedItems.includes(file.id) ? 'selected' : ''}`}
              onClick={() => file.type === 'folder' ? setCurrentFolder(file.id) : toggleSelect(file.id)}
              style={{ '--accent': sphereColor } as React.CSSProperties}
            >
              <div className="col-name">
                <span className="file-icon">{getFileIcon(file.type)}</span>
                <span className="file-name">{file.name}</span>
                {file.starred && <span className="star-inline">⭐</span>}
                {file.shared && <span className="share-inline">👥</span>}
              </div>
              <div className="col-size">{formatSize(file.size)}</div>
              <div className="col-date">{formatDate(file.modifiedAt)}</div>
              <div className="col-actions">
                <button className="action-btn">⋮</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .datafiles-section {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon { font-size: 28px; }

        .header-title h2 {
          font-size: 24px;
          font-weight: 600;
          color: #e8e4dc;
          margin: 0;
        }

        .sphere-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          color: #000;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .upload-btn, .new-folder-btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .upload-btn {
          color: #000;
        }

        .new-folder-btn {
          background: #2a2a2a;
          color: #e8e4dc;
        }

        .storage-info {
          background: #1e2420;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .storage-bar {
          height: 8px;
          background: #2a2a2a;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .storage-used {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s;
        }

        .storage-text {
          font-size: 13px;
          color: #6b6560;
        }

        .toolbar {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          padding: 12px;
          background: #1e2420;
          border-radius: 12px;
        }

        .breadcrumb {
          display: flex;
          gap: 8px;
        }

        .breadcrumb-item {
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          background: #2a2a2a;
          color: #a8a29e;
          cursor: pointer;
          font-size: 13px;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #121614;
          border-radius: 8px;
          padding: 8px 12px;
        }

        .search-icon { color: #6b6560; }

        .search-box input {
          flex: 1;
          background: transparent;
          border: none;
          color: #e8e4dc;
          outline: none;
        }

        .view-options {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .view-options select {
          background: #2a2a2a;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          color: #e8e4dc;
          cursor: pointer;
        }

        .view-toggle {
          display: flex;
          background: #2a2a2a;
          border-radius: 6px;
          overflow: hidden;
        }

        .view-toggle button {
          padding: 8px 12px;
          border: none;
          background: transparent;
          color: #6b6560;
          cursor: pointer;
        }

        .view-toggle button.active {
          background: #4ade80;
          color: #000;
        }

        .selection-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 16px;
          color: #000;
        }

        .selection-actions {
          display: flex;
          gap: 8px;
          flex: 1;
        }

        .selection-actions button {
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          background: rgba(0,0,0,0.2);
          color: #000;
          cursor: pointer;
          font-size: 13px;
        }

        .clear-selection {
          background: none;
          border: none;
          color: #000;
          cursor: pointer;
          font-size: 18px;
        }

        .files-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
        }

        .file-card {
          background: #1e2420;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px solid transparent;
          position: relative;
        }

        .file-card:hover {
          background: #252a27;
          border-color: var(--accent);
        }

        .file-card.selected {
          border-color: var(--accent);
          background: rgba(74, 222, 128, 0.1);
        }

        .star-badge, .share-badge {
          position: absolute;
          font-size: 12px;
        }

        .star-badge { top: 8px; left: 8px; }
        .share-badge { top: 8px; right: 8px; }

        .file-card .file-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .file-card .file-name {
          font-size: 14px;
          font-weight: 500;
          color: #e8e4dc;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-card .file-meta {
          font-size: 12px;
          color: #6b6560;
        }

        .files-list {
          background: #1e2420;
          border-radius: 12px;
          overflow: hidden;
        }

        .list-header {
          display: grid;
          grid-template-columns: 1fr 100px 120px 50px;
          gap: 16px;
          padding: 12px 16px;
          background: #1a1f1c;
          font-size: 12px;
          font-weight: 600;
          color: #6b6560;
          text-transform: uppercase;
        }

        .list-item {
          display: grid;
          grid-template-columns: 1fr 100px 120px 50px;
          gap: 16px;
          padding: 12px 16px;
          border-bottom: 1px solid #252a27;
          cursor: pointer;
          transition: background 0.2s;
        }

        .list-item:hover { background: #252a27; }

        .list-item.selected {
          background: rgba(74, 222, 128, 0.1);
        }

        .list-item .col-name {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .list-item .file-icon { font-size: 20px; }

        .list-item .file-name {
          color: #e8e4dc;
          font-size: 14px;
        }

        .star-inline, .share-inline {
          font-size: 12px;
        }

        .col-size, .col-date {
          color: #6b6560;
          font-size: 13px;
          display: flex;
          align-items: center;
        }

        .col-actions .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: #6b6560;
          cursor: pointer;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: #6b6560;
        }

        .empty-icon {
          font-size: 64px;
          display: block;
          margin-bottom: 16px;
        }

        .empty-btn {
          margin-top: 16px;
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          color: #000;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .toolbar { flex-wrap: wrap; }
          .files-grid { grid-template-columns: repeat(2, 1fr); }
          .list-header, .list-item { grid-template-columns: 1fr 80px; }
          .col-date, .col-actions { display: none; }
        }
      `}</style>
    </div>
  );
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
}

export default DataFilesSection;
