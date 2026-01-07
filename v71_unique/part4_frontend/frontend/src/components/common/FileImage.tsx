/**
 * CHE·NU™ File Upload, Image & Drag/Drop Components
 * 
 * Components for file handling, image display, and drag-drop interactions.
 * 
 * @version V72.0
 * @phase Phase 1 - Fondations
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// FILE UPLOAD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface FileInfo {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
  url?: string;
}

export interface FileUploadProps {
  onUpload: (files: File[]) => void | Promise<void>;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes
  maxFiles?: number;
  disabled?: boolean;
  children?: React.ReactNode;
  variant?: 'default' | 'compact' | 'button';
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  disabled = false,
  children,
  variant = 'default',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: File[]): File[] => {
    setError(null);
    
    if (!multiple && files.length > 1) {
      files = [files[0]];
    }
    
    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      files = files.slice(0, maxFiles);
    }
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setError(`File ${file.name} exceeds ${formatFileSize(maxSize)} limit`);
        return false;
      }
      return true;
    });
    
    return validFiles;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validFiles = validateFiles(Array.from(files));
    if (validFiles.length > 0) {
      onUpload(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  if (variant === 'button') {
    return (
      <>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: 'none' }}
          disabled={disabled}
        />
        <button
          className={`file-upload-button ${disabled ? 'file-upload-button--disabled' : ''}`}
          onClick={handleClick}
          disabled={disabled}
        >
          {children || (
            <>
              <span className="file-upload-button__icon">📁</span>
              Choose File{multiple ? 's' : ''}
            </>
          )}
        </button>
        {error && <span className="file-upload__error">{error}</span>}
      </>
    );
  }

  return (
    <div className={`file-upload file-upload--${variant}`}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        style={{ display: 'none' }}
        disabled={disabled}
      />
      
      <div
        className={`
          file-upload__dropzone
          ${isDragOver ? 'file-upload__dropzone--active' : ''}
          ${disabled ? 'file-upload__dropzone--disabled' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {children || (
          <>
            <div className="file-upload__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="file-upload__text">
              <span className="file-upload__cta">Click to upload</span> or drag and drop
            </p>
            <p className="file-upload__hint">
              {accept ? accept.replace(/,/g, ', ') : 'All files supported'}
              {maxSize && ` • Max ${formatFileSize(maxSize)}`}
            </p>
          </>
        )}
      </div>
      
      {error && <span className="file-upload__error">{error}</span>}
    </div>
  );
};

// File List Component
export interface FileListProps {
  files: FileInfo[];
  onRemove?: (id: string) => void;
  showProgress?: boolean;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onRemove,
  showProgress = true,
}) => {
  if (files.length === 0) return null;

  return (
    <ul className="file-list">
      {files.map((file) => (
        <li key={file.id} className={`file-list__item file-list__item--${file.status}`}>
          <div className="file-list__icon">
            {getFileIcon(file.file.type)}
          </div>
          
          <div className="file-list__info">
            <span className="file-list__name">{file.file.name}</span>
            <span className="file-list__size">{formatFileSize(file.file.size)}</span>
          </div>
          
          {showProgress && file.status === 'uploading' && (
            <div className="file-list__progress">
              <div 
                className="file-list__progress-bar"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          )}
          
          {file.status === 'complete' && (
            <span className="file-list__status file-list__status--complete">✓</span>
          )}
          
          {file.status === 'error' && (
            <span className="file-list__status file-list__status--error" title={file.error}>
              ✕
            </span>
          )}
          
          {onRemove && (
            <button
              className="file-list__remove"
              onClick={() => onRemove(file.id)}
              aria-label="Remove file"
            >
              ×
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// IMAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export interface ImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  aspectRatio?: string;
  fallback?: string;
  placeholder?: 'blur' | 'skeleton';
  blurDataUrl?: string;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'full';
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  objectFit = 'cover',
  aspectRatio,
  fallback = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23e5e7eb"><rect width="24" height="24"/><text x="12" y="16" text-anchor="middle" fill="%239ca3af" font-size="8">?</text></svg>',
  placeholder = 'skeleton',
  blurDataUrl,
  onLoad,
  onError,
  className = '',
  rounded = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setImageSrc(fallback);
    onError?.();
  };

  const roundedClass = rounded === true ? 'image--rounded-md' 
    : rounded ? `image--rounded-${rounded}` 
    : '';

  return (
    <div 
      className={`image-container ${roundedClass} ${className}`}
      style={{
        width,
        height,
        aspectRatio,
      }}
    >
      {isLoading && placeholder === 'skeleton' && (
        <div className="image-skeleton" />
      )}
      
      {isLoading && placeholder === 'blur' && blurDataUrl && (
        <img
          src={blurDataUrl}
          alt=""
          className="image-blur-placeholder"
          aria-hidden="true"
        />
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        className={`image ${isLoading ? 'image--loading' : ''} ${hasError ? 'image--error' : ''}`}
        style={{ objectFit }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

// Gallery Component
export interface GalleryProps {
  images: { src: string; alt: string; thumbnail?: string }[];
  columns?: number;
  gap?: number;
  onImageClick?: (index: number) => void;
}

export const Gallery: React.FC<GalleryProps> = ({
  images,
  columns = 3,
  gap = 8,
  onImageClick,
}) => {
  return (
    <div 
      className="gallery"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}
    >
      {images.map((image, index) => (
        <button
          key={index}
          className="gallery__item"
          onClick={() => onImageClick?.(index)}
        >
          <Image
            src={image.thumbnail || image.src}
            alt={image.alt}
            aspectRatio="1"
            rounded="md"
          />
        </button>
      ))}
    </div>
  );
};

// Lightbox Component
export interface LightboxProps {
  images: { src: string; alt: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(Math.max(0, currentIndex - 1));
      if (e.key === 'ArrowRight') onNavigate(Math.min(images.length - 1, currentIndex + 1));
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox__close" onClick={onClose}>×</button>
      
      <button
        className="lightbox__nav lightbox__nav--prev"
        onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
        disabled={currentIndex === 0}
      >
        ‹
      </button>
      
      <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
        <img src={currentImage.src} alt={currentImage.alt} className="lightbox__image" />
      </div>
      
      <button
        className="lightbox__nav lightbox__nav--next"
        onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
        disabled={currentIndex === images.length - 1}
      >
        ›
      </button>
      
      <div className="lightbox__counter">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// DRAG & DROP COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export interface DraggableItem {
  id: string;
  [key: string]: any;
}

export interface DraggableListProps<T extends DraggableItem> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode;
  direction?: 'vertical' | 'horizontal';
}

export function DraggableList<T extends DraggableItem>({
  items,
  onReorder,
  renderItem,
  direction = 'vertical',
}: DraggableListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    onReorder(newItems);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className={`draggable-list draggable-list--${direction}`}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`
            draggable-list__item
            ${draggedIndex === index ? 'draggable-list__item--dragging' : ''}
            ${dragOverIndex === index ? 'draggable-list__item--drag-over' : ''}
          `}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
        >
          <div className="draggable-list__handle">⋮⋮</div>
          {renderItem(item, index, draggedIndex === index)}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎬';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
  if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
  return '📁';
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════

export const FileImageStyles: React.FC = () => (
  <style>{`
    /* File Upload */
    .file-upload {
      width: 100%;
    }

    .file-upload__dropzone {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px;
      border: 2px dashed var(--color-border, #e5e7eb);
      border-radius: var(--radius-lg, 12px);
      background: var(--color-bg-secondary, #f9fafb);
      cursor: pointer;
      transition: all var(--transition-fast, 0.15s);
    }

    .file-upload--compact .file-upload__dropzone {
      padding: 16px;
    }

    .file-upload__dropzone:hover {
      border-color: var(--color-primary, #6366f1);
      background: rgba(99, 102, 241, 0.05);
    }

    .file-upload__dropzone--active {
      border-color: var(--color-primary, #6366f1);
      background: rgba(99, 102, 241, 0.1);
    }

    .file-upload__dropzone--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .file-upload__icon {
      color: var(--color-text-tertiary, #9ca3af);
      margin-bottom: 12px;
    }

    .file-upload__text {
      font-size: 14px;
      color: var(--color-text-secondary, #6b7280);
      margin: 0;
    }

    .file-upload__cta {
      color: var(--color-primary, #6366f1);
      font-weight: 500;
    }

    .file-upload__hint {
      font-size: 12px;
      color: var(--color-text-tertiary, #9ca3af);
      margin: 8px 0 0;
    }

    .file-upload__error {
      display: block;
      margin-top: 8px;
      font-size: 13px;
      color: var(--color-error, #ef4444);
    }

    .file-upload-button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      background: white;
      font-size: 14px;
      cursor: pointer;
      transition: all var(--transition-fast, 0.15s);
    }

    .file-upload-button:hover {
      border-color: var(--color-primary, #6366f1);
      color: var(--color-primary, #6366f1);
    }

    .file-upload-button--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* File List */
    .file-list {
      list-style: none;
      margin: 12px 0 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .file-list__item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      background: white;
    }

    .file-list__icon {
      font-size: 20px;
    }

    .file-list__info {
      flex: 1;
      min-width: 0;
    }

    .file-list__name {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-primary, #111827);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .file-list__size {
      font-size: 12px;
      color: var(--color-text-tertiary, #9ca3af);
    }

    .file-list__progress {
      width: 100px;
      height: 4px;
      background: var(--color-bg-tertiary, #e5e7eb);
      border-radius: var(--radius-full, 9999px);
      overflow: hidden;
    }

    .file-list__progress-bar {
      height: 100%;
      background: var(--color-primary, #6366f1);
      transition: width 0.2s;
    }

    .file-list__status {
      font-size: 16px;
    }

    .file-list__status--complete { color: var(--color-success, #22c55e); }
    .file-list__status--error { color: var(--color-error, #ef4444); }

    .file-list__remove {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border: none;
      background: transparent;
      color: var(--color-text-tertiary, #9ca3af);
      font-size: 18px;
      cursor: pointer;
      border-radius: var(--radius-sm, 4px);
    }

    .file-list__remove:hover {
      color: var(--color-error, #ef4444);
      background: rgba(239, 68, 68, 0.1);
    }

    /* Image */
    .image-container {
      position: relative;
      overflow: hidden;
      background: var(--color-bg-tertiary, #e5e7eb);
    }

    .image-container.image--rounded-sm { border-radius: var(--radius-sm, 4px); }
    .image-container.image--rounded-md { border-radius: var(--radius-md, 8px); }
    .image-container.image--rounded-lg { border-radius: var(--radius-lg, 12px); }
    .image-container.image--rounded-full { border-radius: 50%; }

    .image {
      width: 100%;
      height: 100%;
      display: block;
      transition: opacity var(--transition-normal, 0.2s);
    }

    .image--loading {
      opacity: 0;
    }

    .image-skeleton {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        var(--color-bg-tertiary, #e5e7eb) 0%,
        var(--color-bg-secondary, #f4f4f5) 50%,
        var(--color-bg-tertiary, #e5e7eb) 100%
      );
      background-size: 200% 100%;
      animation: skeleton-pulse 1.5s ease-in-out infinite;
    }

    .image-blur-placeholder {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(20px);
      transform: scale(1.1);
    }

    /* Gallery */
    .gallery__item {
      position: relative;
      border: none;
      padding: 0;
      background: none;
      cursor: pointer;
      overflow: hidden;
      border-radius: var(--radius-md, 8px);
    }

    .gallery__item:hover .image {
      transform: scale(1.05);
    }

    .gallery__item .image {
      transition: transform var(--transition-normal, 0.2s);
    }

    /* Lightbox */
    .lightbox {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.9);
    }

    .lightbox__close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 24px;
      border-radius: 50%;
      cursor: pointer;
      transition: background var(--transition-fast, 0.15s);
    }

    .lightbox__close:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .lightbox__nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 32px;
      border-radius: 50%;
      cursor: pointer;
      transition: background var(--transition-fast, 0.15s);
    }

    .lightbox__nav:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.2);
    }

    .lightbox__nav:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .lightbox__nav--prev { left: 16px; }
    .lightbox__nav--next { right: 16px; }

    .lightbox__content {
      max-width: 90vw;
      max-height: 90vh;
    }

    .lightbox__image {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
    }

    .lightbox__counter {
      position: absolute;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      padding: 8px 16px;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      font-size: 14px;
      border-radius: var(--radius-full, 9999px);
    }

    /* Draggable List */
    .draggable-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .draggable-list--horizontal {
      flex-direction: row;
    }

    .draggable-list__item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: white;
      border: 1px solid var(--color-border, #e5e7eb);
      border-radius: var(--radius-md, 8px);
      cursor: grab;
      transition: all var(--transition-fast, 0.15s);
    }

    .draggable-list__item:hover {
      border-color: var(--color-primary, #6366f1);
    }

    .draggable-list__item--dragging {
      opacity: 0.5;
      cursor: grabbing;
    }

    .draggable-list__item--drag-over {
      border-color: var(--color-primary, #6366f1);
      background: rgba(99, 102, 241, 0.05);
    }

    .draggable-list__handle {
      color: var(--color-text-tertiary, #9ca3af);
      cursor: grab;
      user-select: none;
    }

    @keyframes skeleton-pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Dark mode */
    [data-theme="dark"] .file-upload__dropzone {
      border-color: #333;
      background: #1a1a1a;
    }

    [data-theme="dark"] .file-upload__dropzone:hover {
      background: rgba(99, 102, 241, 0.1);
    }

    [data-theme="dark"] .file-upload-button {
      background: #1a1a1a;
      border-color: #333;
      color: #f9fafb;
    }

    [data-theme="dark"] .file-list__item {
      background: #1a1a1a;
      border-color: #333;
    }

    [data-theme="dark"] .file-list__name {
      color: #f9fafb;
    }

    [data-theme="dark"] .image-container {
      background: #333;
    }

    [data-theme="dark"] .draggable-list__item {
      background: #1a1a1a;
      border-color: #333;
    }
  `}</style>
);

export default {
  FileUpload,
  FileList,
  Image,
  Gallery,
  Lightbox,
  DraggableList,
  FileImageStyles,
};
