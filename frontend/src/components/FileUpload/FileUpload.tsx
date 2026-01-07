// CHE·NU™ File Upload System
// Comprehensive file upload with drag & drop, progress, validation

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
  ChangeEvent,
  DragEvent,
} from 'react';

// ============================================================
// TYPES
// ============================================================

type UploadStatus = 'idle' | 'pending' | 'uploading' | 'success' | 'error';

interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: UploadStatus;
  progress: number;
  error?: string;
  url?: string;
  thumbnail?: string;
  metadata?: Record<string, any>;
}

interface UploadConfig {
  endpoint: string;
  method?: 'POST' | 'PUT';
  headers?: Record<string, string>;
  fieldName?: string;
  withCredentials?: boolean;
  timeout?: number;
  additionalData?: Record<string, any>;
}

interface ValidationConfig {
  maxSize?: number;
  maxFiles?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  validateFile?: (file: File) => Promise<string | null>;
}

interface FileUploaderProps {
  config: UploadConfig;
  validation?: ValidationConfig;
  multiple?: boolean;
  disabled?: boolean;
  autoUpload?: boolean;
  showPreview?: boolean;
  showProgress?: boolean;
  accept?: string;
  maxConcurrent?: number;
  onFileSelect?: (files: FileItem[]) => void;
  onUploadStart?: (file: FileItem) => void;
  onUploadProgress?: (file: FileItem, progress: number) => void;
  onUploadSuccess?: (file: FileItem, response: unknown) => void;
  onUploadError?: (file: FileItem, error: Error) => void;
  onRemove?: (file: FileItem) => void;
  children?: ReactNode;
  className?: string;
  dropzoneClassName?: string;
}

interface UploadState {
  files: FileItem[];
  isDragging: boolean;
  isUploading: boolean;
  uploadQueue: string[];
}

// ============================================================
// BRAND COLORS (Memory Prompt)
// ============================================================

const BRAND = {
  sacredGold: '#D8B26A',
  ancientStone: '#8D8371',
  jungleEmerald: '#3F7249',
  cenoteTurquoise: '#3EB4A2',
  shadowMoss: '#2F4C39',
  earthEmber: '#7A593A',
  uiSlate: '#1E1F22',
  softSand: '#E9E4D6',
};

// ============================================================
// UTILITIES
// ============================================================

function generateId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
}

function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

async function createImageThumbnail(file: File, maxSize: number = 100): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL(file.type));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function validateFile(
  file: File,
  validation: ValidationConfig
): Promise<string | null> {
  // Check file size
  if (validation.maxSize && file.size > validation.maxSize) {
    return `File size exceeds ${formatFileSize(validation.maxSize)}`;
  }

  // Check file type
  if (validation.allowedTypes && validation.allowedTypes.length > 0) {
    const typeAllowed = validation.allowedTypes.some((type) => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', '/'));
      }
      return file.type === type;
    });
    if (!typeAllowed) {
      return `File type ${file.type} is not allowed`;
    }
  }

  // Check file extension
  if (validation.allowedExtensions && validation.allowedExtensions.length > 0) {
    const ext = getFileExtension(file.name);
    if (!validation.allowedExtensions.includes(ext)) {
      return `File extension .${ext} is not allowed`;
    }
  }

  // Check image dimensions
  if (isImageFile(file)) {
    const { minWidth, maxWidth, minHeight, maxHeight } = validation;
    if (minWidth || maxWidth || minHeight || maxHeight) {
      try {
        const { width, height } = await getImageDimensions(file);
        
        if (minWidth && width < minWidth) {
          return `Image width must be at least ${minWidth}px`;
        }
        if (maxWidth && width > maxWidth) {
          return `Image width must be at most ${maxWidth}px`;
        }
        if (minHeight && height < minHeight) {
          return `Image height must be at least ${minHeight}px`;
        }
        if (maxHeight && height > maxHeight) {
          return `Image height must be at most ${maxHeight}px`;
        }
      } catch {
        return 'Could not read image dimensions';
      }
    }
  }

  // Custom validation
  if (validation.validateFile) {
    const customError = await validation.validateFile(file);
    if (customError) return customError;
  }

  return null;
}

// ============================================================
// UPLOAD FUNCTION
// ============================================================

async function uploadFile(
  file: File,
  config: UploadConfig,
  onProgress: (progress: number) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    // Add file to form data
    formData.append(config.fieldName || 'file', file);

    // Add additional data
    if (config.additionalData) {
      Object.entries(config.additionalData).forEach(([key, value]) => {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      });
    }

    // Progress handler
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        onProgress(progress);
      }
    });

    // Load handler
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch {
          resolve(xhr.responseText);
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    // Error handler
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    // Timeout handler
    xhr.addEventListener('timeout', () => {
      reject(new Error('Upload timed out'));
    });

    // Configure request
    xhr.open(config.method || 'POST', config.endpoint);

    // Set headers
    if (config.headers) {
      Object.entries(config.headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
    }

    // Set credentials
    if (config.withCredentials) {
      xhr.withCredentials = true;
    }

    // Set timeout
    if (config.timeout) {
      xhr.timeout = config.timeout;
    }

    // Send request
    xhr.send(formData);
  });
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },

  dropzone: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    border: `2px dashed ${BRAND.ancientStone}40`,
    borderRadius: '12px',
    backgroundColor: BRAND.softSand,
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center' as const,
  },

  dropzoneDragging: {
    borderColor: BRAND.cenoteTurquoise,
    backgroundColor: `${BRAND.cenoteTurquoise}10`,
  },

  dropzoneDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  dropzoneIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    color: BRAND.ancientStone,
  },

  dropzoneText: {
    fontSize: '16px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    marginBottom: '8px',
  },

  dropzoneSubtext: {
    fontSize: '14px',
    color: BRAND.ancientStone,
  },

  dropzoneBrowse: {
    color: BRAND.sacredGold,
    fontWeight: 600,
    cursor: 'pointer',
  },

  fileList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  fileItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: `1px solid ${BRAND.ancientStone}20`,
  },

  fileItemError: {
    borderColor: '#E53E3E',
    backgroundColor: '#FFF5F5',
  },

  fileItemSuccess: {
    borderColor: BRAND.jungleEmerald,
    backgroundColor: '#F0FFF4',
  },

  thumbnail: {
    width: '48px',
    height: '48px',
    borderRadius: '4px',
    objectFit: 'cover' as const,
    backgroundColor: BRAND.softSand,
  },

  thumbnailPlaceholder: {
    width: '48px',
    height: '48px',
    borderRadius: '4px',
    backgroundColor: BRAND.softSand,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: BRAND.ancientStone,
  },

  fileInfo: {
    flex: 1,
    minWidth: 0,
  },

  fileName: {
    fontSize: '14px',
    fontWeight: 500,
    color: BRAND.uiSlate,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  fileMeta: {
    fontSize: '12px',
    color: BRAND.ancientStone,
    display: 'flex',
    gap: '8px',
    marginTop: '4px',
  },

  progressBar: {
    width: '100%',
    height: '4px',
    backgroundColor: BRAND.softSand,
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '8px',
  },

  progressFill: {
    height: '100%',
    backgroundColor: BRAND.cenoteTurquoise,
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },

  errorText: {
    fontSize: '12px',
    color: '#E53E3E',
    marginTop: '4px',
  },

  statusIcon: {
    fontSize: '20px',
    flexShrink: 0,
  },

  removeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    color: BRAND.ancientStone,
    fontSize: '18px',
    lineHeight: 1,
    borderRadius: '4px',
    transition: 'all 0.2s',
    flexShrink: 0,
  },

  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },

  button: {
    padding: '10px 20px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
  },

  primaryButton: {
    backgroundColor: BRAND.sacredGold,
    color: '#ffffff',
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    color: BRAND.uiSlate,
    border: `1px solid ${BRAND.ancientStone}40`,
  },
};

// ============================================================
// FILE TYPE ICONS
// ============================================================

function getFileIcon(type: string, extension: string): string {
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('video/')) return '🎬';
  if (type.startsWith('audio/')) return '🎵';
  if (type === 'application/pdf') return '📄';
  if (type.includes('spreadsheet') || ['xlsx', 'xls', 'csv'].includes(extension)) return '📊';
  if (type.includes('document') || ['doc', 'docx'].includes(extension)) return '📝';
  if (type.includes('presentation') || ['ppt', 'pptx'].includes(extension)) return '📽️';
  if (type.includes('zip') || type.includes('archive') || ['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return '📦';
  if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'go', 'rs'].includes(extension)) return '💻';
  if (['json', 'xml', 'yaml', 'yml'].includes(extension)) return '📋';
  return '📁';
}

// ============================================================
// COMPONENT
// ============================================================

export function FileUploader({
  config,
  validation = {},
  multiple = true,
  disabled = false,
  autoUpload = false,
  showPreview = true,
  showProgress = true,
  accept,
  maxConcurrent = 3,
  onFileSelect,
  onUploadStart,
  onUploadProgress,
  onUploadSuccess,
  onUploadError,
  onRemove,
  children,
  className,
  dropzoneClassName,
}: FileUploaderProps): JSX.Element {
  const [state, setState] = useState<UploadState>({
    files: [],
    isDragging: false,
    isUploading: false,
    uploadQueue: [],
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const activeUploads = useRef<Set<string>>(new Set());

  // Process selected files
  const processFiles = useCallback(async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);

    // Check max files
    if (validation.maxFiles) {
      const totalFiles = state.files.length + files.length;
      if (totalFiles > validation.maxFiles) {
        alert(`Maximum ${validation.maxFiles} files allowed`);
        return;
      }
    }

    const newFiles: FileItem[] = [];

    for (const file of files) {
      // Validate file
      const error = await validateFile(file, validation);

      // Create thumbnail for images
      let thumbnail: string | undefined;
      if (showPreview && isImageFile(file) && !error) {
        try {
          thumbnail = await createImageThumbnail(file);
        } catch {
          // Ignore thumbnail errors
        }
      }

      const fileItem: FileItem = {
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: error ? 'error' : 'pending',
        progress: 0,
        error: error || undefined,
        thumbnail,
      };

      newFiles.push(fileItem);
    }

    setState((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
    }));

    onFileSelect?.(newFiles);

    // Auto upload if enabled
    if (autoUpload) {
      const validFiles = newFiles.filter((f) => f.status === 'pending');
      setState((prev) => ({
        ...prev,
        uploadQueue: [...prev.uploadQueue, ...validFiles.map((f) => f.id)],
      }));
    }
  }, [state.files, validation, showPreview, autoUpload, onFileSelect]);

  // Handle file input change
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  }, [processFiles]);

  // Handle drag events
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setState((prev) => ({ ...prev, isDragging: true }));
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: false }));

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }, [disabled, processFiles]);

  // Upload single file
  const uploadSingleFile = useCallback(async (fileId: string) => {
    const fileItem = state.files.find((f) => f.id === fileId);
    if (!fileItem || fileItem.status !== 'pending') return;

    // Mark as uploading
    setState((prev) => ({
      ...prev,
      files: prev.files.map((f) =>
        f.id === fileId ? { ...f, status: 'uploading' as UploadStatus, progress: 0 } : f
      ),
    }));

    activeUploads.current.add(fileId);
    onUploadStart?.(fileItem);

    try {
      const response = await uploadFile(
        fileItem.file,
        config,
        (progress) => {
          setState((prev) => ({
            ...prev,
            files: prev.files.map((f) =>
              f.id === fileId ? { ...f, progress } : f
            ),
          }));
          onUploadProgress?.(fileItem, progress);
        }
      );

      setState((prev) => ({
        ...prev,
        files: prev.files.map((f) =>
          f.id === fileId
            ? { ...f, status: 'success' as UploadStatus, progress: 100, url: response.url }
            : f
        ),
      }));

      onUploadSuccess?.(fileItem, response);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        files: prev.files.map((f) =>
          f.id === fileId
            ? { ...f, status: 'error' as UploadStatus, error: (error as Error).message }
            : f
        ),
      }));

      onUploadError?.(fileItem, error as Error);
    } finally {
      activeUploads.current.delete(fileId);
    }
  }, [state.files, config, onUploadStart, onUploadProgress, onUploadSuccess, onUploadError]);

  // Process upload queue
  useEffect(() => {
    const processQueue = async () => {
      const pendingUploads = state.uploadQueue.filter(
        (id) => !activeUploads.current.has(id)
      );

      const availableSlots = maxConcurrent - activeUploads.current.size;
      const toUpload = pendingUploads.slice(0, availableSlots);

      for (const fileId of toUpload) {
        uploadSingleFile(fileId);
      }

      // Remove uploaded files from queue
      if (toUpload.length > 0) {
        setState((prev) => ({
          ...prev,
          uploadQueue: prev.uploadQueue.filter((id) => !toUpload.includes(id)),
        }));
      }
    };

    if (state.uploadQueue.length > 0) {
      processQueue();
    }
  }, [state.uploadQueue, maxConcurrent, uploadSingleFile]);

  // Remove file
  const removeFile = useCallback((fileId: string) => {
    const file = state.files.find((f) => f.id === fileId);
    setState((prev) => ({
      ...prev,
      files: prev.files.filter((f) => f.id !== fileId),
      uploadQueue: prev.uploadQueue.filter((id) => id !== fileId),
    }));
    if (file) {
      onRemove?.(file);
    }
  }, [state.files, onRemove]);

  // Upload all pending files
  const uploadAll = useCallback(() => {
    const pendingFiles = state.files.filter((f) => f.status === 'pending');
    setState((prev) => ({
      ...prev,
      uploadQueue: [...prev.uploadQueue, ...pendingFiles.map((f) => f.id)],
    }));
  }, [state.files]);

  // Clear all files
  const clearAll = useCallback(() => {
    setState({
      files: [],
      isDragging: false,
      isUploading: false,
      uploadQueue: [],
    });
  }, []);

  // Render file item
  const renderFileItem = (file: FileItem) => {
    const ext = getFileExtension(file.name);
    const icon = getFileIcon(file.type, ext);

    return (
      <div
        key={file.id}
        style={{
          ...styles.fileItem,
          ...(file.status === 'error' && styles.fileItemError),
          ...(file.status === 'success' && styles.fileItemSuccess),
        }}
      >
        {showPreview && file.thumbnail ? (
          <img src={file.thumbnail} alt={file.name} style={styles.thumbnail} />
        ) : (
          <div style={styles.thumbnailPlaceholder}>{icon}</div>
        )}

        <div style={styles.fileInfo}>
          <div style={styles.fileName}>{file.name}</div>
          <div style={styles.fileMeta}>
            <span>{formatFileSize(file.size)}</span>
            <span>•</span>
            <span>{ext.toUpperCase()}</span>
          </div>
          {showProgress && file.status === 'uploading' && (
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${file.progress}%` }} />
            </div>
          )}
          {file.error && <div style={styles.errorText}>{file.error}</div>}
        </div>

        <span style={styles.statusIcon}>
          {file.status === 'pending' && '⏳'}
          {file.status === 'uploading' && '⬆️'}
          {file.status === 'success' && '✅'}
          {file.status === 'error' && '❌'}
        </span>

        <button
          style={styles.removeButton}
          onClick={() => removeFile(file.id)}
          disabled={file.status === 'uploading'}
        >
          ×
        </button>
      </div>
    );
  };

  const pendingCount = state.files.filter((f) => f.status === 'pending').length;
  const hasFiles = state.files.length > 0;

  return (
    <div style={styles.container} className={className}>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      <div
        style={{
          ...styles.dropzone,
          ...(state.isDragging && styles.dropzoneDragging),
          ...(disabled && styles.dropzoneDisabled),
        }}
        className={dropzoneClassName}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {children || (
          <>
            <div style={styles.dropzoneIcon}>📤</div>
            <div style={styles.dropzoneText}>
              Drag and drop files here, or{' '}
              <span style={styles.dropzoneBrowse}>browse</span>
            </div>
            <div style={styles.dropzoneSubtext}>
              {validation.maxSize && `Max file size: ${formatFileSize(validation.maxSize)}`}
              {validation.maxFiles && ` • Max ${validation.maxFiles} files`}
            </div>
          </>
        )}
      </div>

      {hasFiles && (
        <div style={styles.fileList}>
          {state.files.map(renderFileItem)}
        </div>
      )}

      {hasFiles && !autoUpload && (
        <div style={styles.actions}>
          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={clearAll}
          >
            Clear All
          </button>
          <button
            style={{
              ...styles.button,
              ...styles.primaryButton,
              opacity: pendingCount === 0 ? 0.5 : 1,
            }}
            onClick={uploadAll}
            disabled={pendingCount === 0}
          >
            Upload {pendingCount > 0 && `(${pendingCount})`}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// HOOK
// ============================================================

export function useFileUpload(config: UploadConfig, validation?: ValidationConfig) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const addFiles = useCallback(async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    const newFiles: FileItem[] = [];

    for (const file of filesArray) {
      const error = validation ? await validateFile(file, validation) : null;

      newFiles.push({
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: error ? 'error' : 'pending',
        progress: 0,
        error: error || undefined,
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
    return newFiles;
  }, [validation]);

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const uploadFile = useCallback(async (fileId: string): Promise<any> => {
    const fileItem = files.find((f) => f.id === fileId);
    if (!fileItem || fileItem.status !== 'pending') return null;

    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: 'uploading' as UploadStatus } : f))
    );
    setIsUploading(true);

    try {
      const response = await uploadFile(fileItem.file, config, (progress) => {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
        );
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: 'success' as UploadStatus, url: response.url } : f
        )
      );

      return response;
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: 'error' as UploadStatus, error: (error as Error).message }
            : f
        )
      );
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [files, config]);

  const uploadAll = useCallback(async () => {
    const pending = files.filter((f) => f.status === 'pending');
    const results = await Promise.allSettled(pending.map((f) => uploadFile(f.id)));
    return results;
  }, [files, uploadFile]);

  const clear = useCallback(() => {
    setFiles([]);
  }, []);

  return {
    files,
    isUploading,
    addFiles,
    removeFile,
    uploadFile,
    uploadAll,
    clear,
  };
}

// ============================================================
// EXPORTS
// ============================================================

export type {
  UploadStatus,
  FileItem,
  UploadConfig,
  ValidationConfig,
  FileUploaderProps,
  UploadState,
};

export { formatFileSize, getFileExtension, isImageFile };
export default FileUploader;
