/**
 * CHE·NU™ V75 — File Upload Service
 * ==================================
 * Handle file uploads with progress tracking
 */

import { apiClient } from './apiClient';

// =============================================================================
// TYPES
// =============================================================================

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadedFile {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  thumbnail_url?: string;
  created_at: string;
}

export interface UploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  threadId?: string;
  sphereId?: string;
  folder?: string;
  tags?: string[];
}

export interface UploadResult {
  success: boolean;
  file?: UploadedFile;
  error?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
const ALLOWED_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // Text
  'text/plain',
  'text/markdown',
  'text/csv',
  // Code
  'application/json',
  'application/xml',
  'text/html',
  'text/css',
  'text/javascript',
  'application/javascript',
  // Archives
  'application/zip',
  'application/x-rar-compressed',
  // Audio/Video
  'audio/mpeg',
  'audio/wav',
  'video/mp4',
  'video/webm',
];

// =============================================================================
// VALIDATION
// =============================================================================

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Fichier trop volumineux. Maximum: ${MAX_FILE_SIZE / 1024 / 1024} MB`,
    };
  }

  // Check type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Type de fichier non supporté: ${file.type}`,
    };
  }

  return { valid: true };
}

// =============================================================================
// UPLOAD FUNCTIONS
// =============================================================================

/**
 * Upload a single file
 */
export async function uploadFile(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const { onProgress, threadId, sphereId, folder, tags } = options;

  // Validate
  const validation = validateFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  
  if (threadId) formData.append('thread_id', threadId);
  if (sphereId) formData.append('sphere_id', sphereId);
  if (folder) formData.append('folder', folder);
  if (tags) formData.append('tags', JSON.stringify(tags));

  try {
    const response = await apiClient.post<{ success: boolean; data: UploadedFile }>(
      '/files/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
            });
          }
        },
      }
    );

    if (response.data.success) {
      return { success: true, file: response.data.data };
    }
    
    return { success: false, error: 'Upload failed' };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Upload failed',
    };
  }
}

/**
 * Upload multiple files
 */
export async function uploadFiles(
  files: File[],
  options: UploadOptions = {}
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const file of files) {
    const result = await uploadFile(file, options);
    results.push(result);
  }

  return results;
}

/**
 * Get file URL
 */
export function getFileUrl(fileId: string): string {
  return `/api/v1/files/${fileId}`;
}

/**
 * Get thumbnail URL
 */
export function getThumbnailUrl(fileId: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  return `/api/v1/files/${fileId}/thumbnail?size=${size}`;
}

/**
 * Delete file
 */
export async function deleteFile(fileId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await apiClient.delete(`/files/${fileId}`);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Delete failed',
    };
  }
}

/**
 * List files
 */
export async function listFiles(params: {
  threadId?: string;
  sphereId?: string;
  folder?: string;
  page?: number;
  limit?: number;
}): Promise<{ files: UploadedFile[]; total: number }> {
  try {
    const response = await apiClient.get<{
      success: boolean;
      data: { files: UploadedFile[]; total: number };
    }>('/files', { params });
    
    return response.data.data;
  } catch (error) {
    return { files: [], total: 0 };
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file icon based on mime type
 */
export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.startsWith('video/')) return 'Video';
  if (mimeType.startsWith('audio/')) return 'Music';
  if (mimeType === 'application/pdf') return 'FileText';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'Table';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'Presentation';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'FileText';
  if (mimeType.includes('zip') || mimeType.includes('rar')) return 'Archive';
  if (mimeType.startsWith('text/') || mimeType.includes('json')) return 'FileCode';
  return 'File';
}

/**
 * Check if file is an image
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Check if file is a video
 */
export function isVideoFile(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}

export default {
  uploadFile,
  uploadFiles,
  deleteFile,
  listFiles,
  validateFile,
  getFileUrl,
  getThumbnailUrl,
  formatFileSize,
  getFileIcon,
  isImageFile,
  isVideoFile,
};
