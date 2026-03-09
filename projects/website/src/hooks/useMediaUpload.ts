import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const FILE_MAX_SIZE = 25 * 1024 * 1024; // 25MB
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const FILE_TYPES = [
  'application/pdf', 'application/zip',
  'text/csv', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_TYPES = [...IMAGE_TYPES, ...FILE_TYPES];

interface UploadResult {
  path: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export function useMediaUpload() {
  const { supabaseClient } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Unsupported file type: ${file.type}`;
    }
    const maxSize = IMAGE_TYPES.includes(file.type) ? IMAGE_MAX_SIZE : FILE_MAX_SIZE;
    if (file.size > maxSize) {
      const label = IMAGE_TYPES.includes(file.type) ? '10MB' : '25MB';
      return `File too large. Max ${label}.`;
    }
    return null;
  };

  const upload = useCallback(async (file: File, postId: string): Promise<UploadResult | null> => {
    if (!supabaseClient) return null;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      const ext = file.name.split('.').pop() || '';
      const timestamp = Date.now();
      const path = `${postId}/${timestamp}-${file.name}`;

      const { error: uploadError } = await supabaseClient.storage
        .from('post-attachments')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      return {
        path,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      };
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  }, [supabaseClient]);

  return { upload, uploading, error, validateFile };
}
