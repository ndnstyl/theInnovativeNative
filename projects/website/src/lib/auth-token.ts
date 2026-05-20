/**
 * Single source of truth for reading/validating auth tokens from localStorage.
 * Every part of the app that needs the auth token MUST use this module.
 * No more duplicate localStorage parsing with inconsistent validation.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const PROJECT_REF = SUPABASE_URL.replace('https://', '').split('.')[0];
export const STORAGE_KEY = `sb-${PROJECT_REF}-auth-token`;

export interface StoredAuth {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: {
    id: string;
    email: string;
    [key: string]: unknown;
  };
}

/** Read and validate the stored auth data. Returns null if missing, corrupt, or expired. */
export function getStoredAuth(): StoredAuth | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    // Validate required fields — only access_token and user are truly required
    if (
      typeof parsed?.access_token !== 'string' ||
      !parsed?.access_token ||
      typeof parsed?.user?.id !== 'string' ||
      typeof parsed?.user?.email !== 'string'
    ) {
      return null;
    }

    return {
      access_token: parsed.access_token,
      refresh_token: parsed.refresh_token || '',
      expires_at: typeof parsed.expires_at === 'number' ? parsed.expires_at : 0,
      user: parsed.user,
    };
  } catch {
    return null;
  }
}

/** Check if the stored token is expired (with 60-second buffer for clock skew) */
export function isTokenExpired(auth: StoredAuth): boolean {
  if (!auth.expires_at) return true; // No expiry info = treat as expired
  const now = Math.floor(Date.now() / 1000);
  return now >= auth.expires_at - 60; // 60-second buffer
}

/** Get a valid (non-expired) access token, or null */
export function getValidToken(): string | null {
  const auth = getStoredAuth();
  if (!auth) return null;
  if (isTokenExpired(auth)) return null;
  return auth.access_token;
}

/** Get stored user ID regardless of token expiry (for display purposes only) */
export function getStoredUserId(): string | null {
  const auth = getStoredAuth();
  return auth?.user?.id || null;
}
