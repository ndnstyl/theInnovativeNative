// Supabase Storage utilities

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

export type StorageBucket = 'avatars' | 'post-attachments' | 'course-content' | 'event-covers' | 'community-assets';

export function getPublicUrl(bucket: StorageBucket, path: string): string {
  if (!path) return '';
  // If path is already a full URL, return as-is
  if (path.startsWith('http')) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export function getAvatarUrl(path: string | null, fallback?: string): string {
  if (!path) return fallback || '';
  return getPublicUrl('avatars', path);
}

export const BUCKET_LIMITS: Record<StorageBucket, { maxSize: number; types: string[] }> = {
  avatars: {
    maxSize: 5 * 1024 * 1024, // 5MB
    types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
  'post-attachments': {
    maxSize: 25 * 1024 * 1024, // 25MB
    types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'application/zip', 'text/csv'],
  },
  'course-content': {
    maxSize: 100 * 1024 * 1024, // 100MB
    types: ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'application/pdf'],
  },
  'event-covers': {
    maxSize: 5 * 1024 * 1024,
    types: ['image/jpeg', 'image/png', 'image/webp'],
  },
  'community-assets': {
    maxSize: 10 * 1024 * 1024,
    types: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  },
};

export function validateUpload(bucket: StorageBucket, file: File): string | null {
  const limits = BUCKET_LIMITS[bucket];
  if (!limits.types.includes(file.type)) {
    return `Unsupported file type: ${file.type}`;
  }
  if (file.size > limits.maxSize) {
    const mb = Math.round(limits.maxSize / (1024 * 1024));
    return `File too large. Max ${mb}MB.`;
  }
  return null;
}
