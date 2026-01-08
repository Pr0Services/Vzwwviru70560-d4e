/**
 * CHE·NU™ V75 — useFileUpload Hook
 * =================================
 */

import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  uploadFile,
  uploadFiles,
  deleteFile,
  listFiles,
  validateFile,
  UploadProgress,
  UploadedFile,
  UploadOptions,
  UploadResult,
} from '../services/fileUpload';

// =============================================================================
// TYPES
// =============================================================================

interface UseFileUploadOptions {
  threadId?: string;
  sphereId?: string;
  folder?: string;
  onSuccess?: (file: UploadedFile) => void;
  onError?: (error: string) => void;
}

interface FileUploadState {
  isUploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
}

// =============================================================================
// HOOK
// =============================================================================

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { threadId, sphereId, folder, onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const [state, setState] = useState<FileUploadState>({
    isUploading: false,
    progress: null,
    error: null,
  });

  const handleProgress = useCallback((progress: UploadProgress) => {
    setState((prev) => ({ ...prev, progress }));
  }, []);

  const upload = useCallback(
    async (file: File, tags?: string[]): Promise<UploadResult> => {
      // Validate first
      const validation = validateFile(file);
      if (!validation.valid) {
        setState((prev) => ({ ...prev, error: validation.error || 'Invalid file' }));
        onError?.(validation.error || 'Invalid file');
        return { success: false, error: validation.error };
      }

      setState({ isUploading: true, progress: null, error: null });

      const result = await uploadFile(file, {
        threadId,
        sphereId,
        folder,
        tags,
        onProgress: handleProgress,
      });

      if (result.success && result.file) {
        setState({ isUploading: false, progress: null, error: null });
        queryClient.invalidateQueries({ queryKey: ['files'] });
        onSuccess?.(result.file);
      } else {
        setState({ isUploading: false, progress: null, error: result.error || 'Upload failed' });
        onError?.(result.error || 'Upload failed');
      }

      return result;
    },
    [threadId, sphereId, folder, handleProgress, onSuccess, onError, queryClient]
  );

  const uploadMultiple = useCallback(
    async (files: File[], tags?: string[]): Promise<UploadResult[]> => {
      setState({ isUploading: true, progress: null, error: null });

      const results = await uploadFiles(files, {
        threadId,
        sphereId,
        folder,
        tags,
      });

      const successCount = results.filter((r) => r.success).length;
      const failedCount = results.length - successCount;

      if (failedCount > 0) {
        setState({
          isUploading: false,
          progress: null,
          error: `${failedCount} fichier(s) ont échoué`,
        });
      } else {
        setState({ isUploading: false, progress: null, error: null });
      }

      queryClient.invalidateQueries({ queryKey: ['files'] });
      return results;
    },
    [threadId, sphereId, folder, queryClient]
  );

  const remove = useCallback(
    async (fileId: string): Promise<boolean> => {
      const result = await deleteFile(fileId);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['files'] });
      }
      return result.success;
    },
    [queryClient]
  );

  const reset = useCallback(() => {
    setState({ isUploading: false, progress: null, error: null });
  }, []);

  return {
    ...state,
    upload,
    uploadMultiple,
    remove,
    reset,
  };
}

// =============================================================================
// useFiles - List files query
// =============================================================================

export function useFiles(params: {
  threadId?: string;
  sphereId?: string;
  folder?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: ['files', queryParams],
    queryFn: () => listFiles(queryParams),
    enabled,
  });
}

// =============================================================================
// useDeleteFile - Delete mutation
// =============================================================================

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export default useFileUpload;
