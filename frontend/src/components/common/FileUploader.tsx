/**
 * CHE·NU™ V75 — FileUploader Component
 * =====================================
 * Drag & drop file upload with progress
 */

import React, { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFileUpload } from '../../hooks/api/useFileUpload';
import {
  formatFileSize,
  getFileIcon,
  isImageFile,
  validateFile,
  UploadedFile,
} from '../../services/fileUpload';

// =============================================================================
// TYPES
// =============================================================================

interface FileUploaderProps {
  threadId?: string;
  sphereId?: string;
  folder?: string;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  onUpload?: (files: UploadedFile[]) => void;
  onError?: (error: string) => void;
  className?: string;
  compact?: boolean;
}

interface PreviewFile {
  file: File;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress?: number;
  result?: UploadedFile;
  error?: string;
}

// =============================================================================
// ICONS
// =============================================================================

const UploadIcon = () => (
  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const FileIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

// =============================================================================
// COMPONENT
// =============================================================================

export const FileUploader: React.FC<FileUploaderProps> = ({
  threadId,
  sphereId,
  folder,
  multiple = true,
  accept,
  maxFiles = 10,
  onUpload,
  onError,
  className = '',
  compact = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { upload, isUploading } = useFileUpload({
    threadId,
    sphereId,
    folder,
    onSuccess: (file) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.status === 'uploading' ? { ...f, status: 'success', result: file } : f
        )
      );
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const newFiles = Array.from(fileList).slice(0, maxFiles - files.length);

      // Create previews
      const previewFiles: PreviewFile[] = newFiles.map((file) => {
        const validation = validateFile(file);
        return {
          file,
          preview: isImageFile(file.type) ? URL.createObjectURL(file) : undefined,
          status: validation.valid ? 'pending' : 'error',
          error: validation.error,
        };
      });

      setFiles((prev) => [...prev, ...previewFiles]);

      // Upload valid files
      const validFiles = previewFiles.filter((f) => f.status === 'pending');
      const uploadedFiles: UploadedFile[] = [];

      for (const pf of validFiles) {
        setFiles((prev) =>
          prev.map((f) => (f.file === pf.file ? { ...f, status: 'uploading' } : f))
        );

        const result = await upload(pf.file);

        if (result.success && result.file) {
          uploadedFiles.push(result.file);
          setFiles((prev) =>
            prev.map((f) =>
              f.file === pf.file ? { ...f, status: 'success', result: result.file } : f
            )
          );
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.file === pf.file ? { ...f, status: 'error', error: result.error } : f
            )
          );
        }
      }

      if (uploadedFiles.length > 0) {
        onUpload?.(uploadedFiles);
      }
    },
    [files.length, maxFiles, upload, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const fileList = e.dataTransfer.files;
      if (fileList.length > 0) {
        processFiles(fileList);
      }
    },
    [processFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files;
      if (fileList && fileList.length > 0) {
        processFiles(fileList);
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [processFiles]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const file = prev[index];
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const clearAll = useCallback(() => {
    files.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setFiles([]);
  }, [files]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className={className}>
      {/* Drop Zone */}
      <motion.div
        className={`
          relative border-2 border-dashed rounded-xl transition-colors cursor-pointer
          ${isDragging 
            ? 'border-cyan-400 bg-cyan-400/10' 
            : 'border-white/20 hover:border-white/40 bg-white/5'
          }
          ${compact ? 'p-4' : 'p-8'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <motion.div
            className={`text-white/40 ${isDragging ? 'text-cyan-400' : ''}`}
            animate={{ y: isDragging ? -5 : 0 }}
          >
            <UploadIcon />
          </motion.div>

          {!compact && (
            <>
              <p className="mt-4 text-white font-medium">
                {isDragging ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}
              </p>
              <p className="mt-1 text-sm text-white/50">
                ou cliquez pour parcourir
              </p>
              <p className="mt-2 text-xs text-white/30">
                Max {maxFiles} fichiers • 50 MB par fichier
              </p>
            </>
          )}

          {compact && (
            <p className="mt-2 text-sm text-white/50">
              {isDragging ? 'Déposez ici' : 'Cliquez ou déposez'}
            </p>
          )}
        </div>
      </motion.div>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {/* Clear All Button */}
            {files.length > 1 && (
              <div className="flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAll();
                  }}
                  className="text-xs text-white/40 hover:text-white/60"
                >
                  Tout effacer
                </button>
              </div>
            )}

            {/* Files */}
            {files.map((file, index) => (
              <motion.div
                key={`${file.file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
              >
                {/* Preview/Icon */}
                <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white/40">
                      <FileIcon />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{file.file.name}</p>
                  <p className="text-xs text-white/40">
                    {formatFileSize(file.file.size)}
                  </p>

                  {/* Progress Bar */}
                  {file.status === 'uploading' && (
                    <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-cyan-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${file.progress || 50}%` }}
                      />
                    </div>
                  )}

                  {/* Error */}
                  {file.status === 'error' && (
                    <p className="text-xs text-red-400 mt-1">{file.error}</p>
                  )}
                </div>

                {/* Status/Actions */}
                <div className="flex-shrink-0">
                  {file.status === 'uploading' && (
                    <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  )}
                  {file.status === 'success' && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                      <CheckIcon />
                    </div>
                  )}
                  {(file.status === 'pending' || file.status === 'error') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/60"
                    >
                      <XIcon />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;
