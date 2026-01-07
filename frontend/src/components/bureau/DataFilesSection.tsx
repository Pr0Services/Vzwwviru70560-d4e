/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — DATA FILES SECTION                                    ║
 * ║              Bureau Section L2-4: 📁 Données/Fichiers                        ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  FEATURES:                                                                   ║
 * ║  - File browser                                                              ║
 * ║  - Upload                                                                    ║
 * ║  - Search                                                                    ║
 * ║  - DataSpaces integration                                                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
import { CHENU_COLORS } from '../../types';
import { BUREAU_SECTIONS } from '../../types/bureau.types';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type FileType = 'document' | 'image' | 'video' | 'audio' | 'data' | 'archive' | 'code' | 'other';
type ViewMode = 'grid' | 'list';

interface DataFile {
  id: string;
  name: string;
  type: FileType;
  size: number;
  sphereId: string;
  dataSpaceId?: string;
  createdAt: Date;
  modifiedAt: Date;
  path: string;
  isStarred: boolean;
  tags: string[];
}

interface DataSpace {
  id: string;
  name: string;
  sphereId: string;
  fileCount: number;
  totalSize: number;
  color: string;
}

interface DataFilesSectionProps {
  sphereId: string;
  onOpenFile?: (file: DataFile) => void;
  onOpenDataSpace?: (dataSpace: DataSpace) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const SECTION_CONFIG = BUREAU_SECTIONS.datafiles;

const FILE_TYPE_CONFIG: Record<FileType, { icon: string; color: string }> = {
  document: { icon: '📄', color: '#3b82f6' },
  image: { icon: '🖼️', color: '#ec4899' },
  video: { icon: '🎬', color: '#ef4444' },
  audio: { icon: '🎵', color: '#8b5cf6' },
  data: { icon: '📊', color: CHENU_COLORS.jungleEmerald },
  archive: { icon: '📦', color: CHENU_COLORS.earthEmber },
  code: { icon: '💻', color: CHENU_COLORS.cenoteTurquoise },
  other: { icon: '📎', color: CHENU_COLORS.ancientStone },
};

// Mock data
const MOCK_DATASPACES: DataSpace[] = [
  { id: 'ds-1', name: 'Documents Projet', sphereId: 'business', fileCount: 24, totalSize: 156000000, color: '#3b82f6' },
  { id: 'ds-2', name: 'Assets Marketing', sphereId: 'business', fileCount: 89, totalSize: 890000000, color: '#ec4899' },
  { id: 'ds-3', name: 'Données Analytiques', sphereId: 'business', fileCount: 12, totalSize: 45000000, color: CHENU_COLORS.jungleEmerald },
];

const MOCK_FILES: DataFile[] = [
  { id: 'f-1', name: 'Rapport_Q4_2025.pdf', type: 'document', size: 2500000, sphereId: 'business', dataSpaceId: 'ds-1', createdAt: new Date(), modifiedAt: new Date(), path: '/documents/', isStarred: true, tags: ['rapport', 'Q4'] },
  { id: 'f-2', name: 'Présentation_Investisseurs.pptx', type: 'document', size: 15000000, sphereId: 'business', dataSpaceId: 'ds-1', createdAt: new Date(), modifiedAt: new Date(), path: '/documents/', isStarred: true, tags: ['présentation'] },
  { id: 'f-3', name: 'analytics_export.csv', type: 'data', size: 450000, sphereId: 'business', dataSpaceId: 'ds-3', createdAt: new Date(), modifiedAt: new Date(), path: '/data/', isStarred: false, tags: ['analytics'] },
  { id: 'f-4', name: 'logo_hd.png', type: 'image', size: 1200000, sphereId: 'business', dataSpaceId: 'ds-2', createdAt: new Date(), modifiedAt: new Date(), path: '/assets/', isStarred: false, tags: ['logo', 'branding'] },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles = {
  container: {
    padding: '20px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '18px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
  },
  headerActions: {
    display: 'flex',
    gap: '8px',
  },
  uploadBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: CHENU_COLORS.sacredGold,
    color: '#000',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  viewToggle: {
    display: 'flex',
    backgroundColor: CHENU_COLORS.ancientStone + '22',
    borderRadius: '8px',
    padding: '2px',
  },
  viewBtn: (isActive: boolean) => ({
    padding: '6px 10px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: isActive ? CHENU_COLORS.softSand : 'transparent',
    color: isActive ? '#000' : CHENU_COLORS.ancientStone,
    fontSize: '14px',
    cursor: 'pointer',
  }),
  searchBar: {
    display: 'flex',
    gap: '8px',
  },
  searchInput: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}33`,
    backgroundColor: '#111113',
    color: CHENU_COLORS.softSand,
    fontSize: '14px',
    outline: 'none',
  },
  dataSpacesRow: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto' as const,
    paddingBottom: '8px',
  },
  dataSpaceCard: (color: string) => ({
    minWidth: '180px',
    padding: '14px',
    borderRadius: '10px',
    backgroundColor: '#111113',
    border: `1px solid ${color}33`,
    cursor: 'pointer',
  }),
  dataSpaceName: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.softSand,
    marginBottom: '8px',
  },
  dataSpaceStats: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  sectionLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: CHENU_COLORS.ancientStone,
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  filesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '12px',
  },
  filesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  fileCardGrid: {
    backgroundColor: '#111113',
    borderRadius: '10px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    padding: '16px',
    textAlign: 'center' as const,
    cursor: 'pointer',
  },
  fileCardList: {
    backgroundColor: '#111113',
    borderRadius: '8px',
    border: `1px solid ${CHENU_COLORS.ancientStone}22`,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  fileIcon: (color: string) => ({
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    backgroundColor: color + '22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    margin: '0 auto 10px',
  }),
  fileIconSmall: (color: string) => ({
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    backgroundColor: color + '22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  }),
  fileName: {
    fontSize: '13px',
    color: CHENU_COLORS.softSand,
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  fileSize: {
    fontSize: '11px',
    color: CHENU_COLORS.ancientStone,
  },
  starBtn: (isStarred: boolean) => ({
    position: 'absolute' as const,
    top: '8px',
    right: '8px',
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    color: isStarred ? CHENU_COLORS.sacredGold : CHENU_COLORS.ancientStone,
    cursor: 'pointer',
    fontSize: '14px',
  }),
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    color: CHENU_COLORS.ancientStone,
    gap: '16px',
    padding: '40px',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const DataFilesSection: React.FC<DataFilesSectionProps> = ({
  sphereId,
  onOpenFile,
  onOpenDataSpace,
}) => {
  const [files, setFiles] = useState<DataFile[]>(MOCK_FILES);
  const [dataSpaces] = useState<DataSpace[]>(MOCK_DATASPACES);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter files
  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files;
    return files.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [files, searchQuery]);

  const starredFiles = useMemo(() => filteredFiles.filter(f => f.isStarred), [filteredFiles]);
  const recentFiles = useMemo(() => 
    filteredFiles.filter(f => !f.isStarred).slice(0, 8), 
    [filteredFiles]
  );

  // Handlers
  const handleOpenFile = useCallback((file: DataFile) => {
    if (onOpenFile) onOpenFile(file);
  }, [onOpenFile]);

  const handleToggleStar = useCallback((fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, isStarred: !f.isStarred } : f
    ));
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const renderFileCard = (file: DataFile) => {
    const config = FILE_TYPE_CONFIG[file.type];
    
    if (viewMode === 'grid') {
      return (
        <motion.div
          key={file.id}
          style={{ ...styles.fileCardGrid, position: 'relative' }}
          whileHover={{ scale: 1.02, borderColor: CHENU_COLORS.sacredGold + '44' }}
          onClick={() => handleOpenFile(file)}
        >
          <button 
            style={styles.starBtn(file.isStarred)}
            onClick={(e) => handleToggleStar(file.id, e)}
          >
            {file.isStarred ? '⭐' : '☆'}
          </button>
          <div style={styles.fileIcon(config.color)}>{config.icon}</div>
          <div style={styles.fileName} title={file.name}>{file.name}</div>
          <div style={styles.fileSize}>{formatSize(file.size)}</div>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={file.id}
        style={styles.fileCardList}
        whileHover={{ backgroundColor: '#151517', borderColor: CHENU_COLORS.sacredGold + '44' }}
        onClick={() => handleOpenFile(file)}
      >
        <div style={styles.fileIconSmall(config.color)}>{config.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={styles.fileName}>{file.name}</div>
          <div style={styles.fileSize}>{formatSize(file.size)} • {file.path}</div>
        </div>
        <button 
          style={{ ...styles.starBtn(file.isStarred), position: 'relative' }}
          onClick={(e) => handleToggleStar(file.id, e)}
        >
          {file.isStarred ? '⭐' : '☆'}
        </button>
      </motion.div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span>{SECTION_CONFIG.icon}</span>
          <span>{SECTION_CONFIG.nameFr}</span>
        </div>
        <div style={styles.headerActions}>
          <div style={styles.viewToggle}>
            <button 
              style={styles.viewBtn(viewMode === 'grid')}
              onClick={() => setViewMode('grid')}
            >
              ▦
            </button>
            <button 
              style={styles.viewBtn(viewMode === 'list')}
              onClick={() => setViewMode('list')}
            >
              ≡
            </button>
          </div>
          <motion.button
            style={styles.uploadBtn}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ⬆️ Upload
          </motion.button>
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchBar}>
        <input
          style={styles.searchInput}
          placeholder="🔍 Rechercher fichiers, tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* DataSpaces */}
      <div>
        <div style={styles.sectionLabel}>💾 DataSpaces</div>
        <div style={styles.dataSpacesRow}>
          {dataSpaces.map((ds) => (
            <motion.div
              key={ds.id}
              style={styles.dataSpaceCard(ds.color)}
              whileHover={{ scale: 1.02, borderColor: ds.color }}
              onClick={() => onOpenDataSpace?.(ds)}
            >
              <div style={styles.dataSpaceName}>{ds.name}</div>
              <div style={styles.dataSpaceStats}>
                <span>{ds.fileCount} fichiers</span>
                <span>{formatSize(ds.totalSize)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Starred Files */}
      {starredFiles.length > 0 && (
        <div>
          <div style={styles.sectionLabel}>⭐ Favoris ({starredFiles.length})</div>
          <div style={viewMode === 'grid' ? styles.filesGrid : styles.filesList}>
            {starredFiles.map(renderFileCard)}
          </div>
        </div>
      )}

      {/* Recent Files */}
      {recentFiles.length > 0 && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={styles.sectionLabel}>🕐 Récents ({recentFiles.length})</div>
          <div style={viewMode === 'grid' ? styles.filesGrid : styles.filesList}>
            {recentFiles.map(renderFileCard)}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <div style={styles.emptyState}>
          <span style={{ fontSize: '48px' }}>📁</span>
          <p style={{ fontSize: '16px', color: CHENU_COLORS.softSand }}>
            Aucun fichier trouvé
          </p>
          <p>Uploadez des fichiers ou créez un DataSpace</p>
        </div>
      )}
    </div>
  );
};

export default DataFilesSection;
