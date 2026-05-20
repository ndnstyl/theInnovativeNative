import { useCallback } from 'react';
import { useToast } from '@/components/common/ToastProvider';
import { logger } from '@/lib/logger';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Returns an authenticated fetch function that reads the access token
 * from localStorage and injects it into request headers.
 *
 * This bypasses the Supabase JS client's auth module which doesn't
 * initialize properly on static export sites.
 *
 * Usage:
 *   const { authFetch } = useAuthenticatedFetch();
 *   const res = await authFetch('/rest/v1/profiles?id=eq.123', { method: 'PATCH', body: '...' });
 */
export function useAuthenticatedFetch() {
  const { showToast } = useToast();

  const getAccessToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];
      const stored = localStorage.getItem(`sb-${projectRef}-auth-token`);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed?.access_token || null;
      }
    } catch (err) {
      logger.warn('useAuthenticatedFetch', 'getAccessToken', 'Failed to read token from localStorage');
    }
    return null;
  }, []);

  const authFetch = useCallback(async (
    path: string,
    options: RequestInit = {},
    context?: { source?: string; action?: string; silent?: boolean }
  ): Promise<Response> => {
    // Block if offline
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const msg = "Can't complete this action while offline.";
      if (!context?.silent) showToast(msg, 'warning');
      throw new Error(msg);
    }

    const token = getAccessToken();
    const url = path.startsWith('http') ? path : `${SUPABASE_URL}${path}`;
    const headers = new Headers(options.headers);

    headers.set('apikey', ANON_KEY);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!headers.get('Content-Type') && options.body) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const res = await fetch(url, { ...options, headers });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        const errorMsg = `Request failed (${res.status})${body ? `: ${body.slice(0, 100)}` : ''}`;
        logger.error(context?.source || 'authFetch', context?.action || 'request', errorMsg, { url: path, status: res.status });
        if (!context?.silent) {
          showToast(res.status === 401 ? 'Session expired. Please sign in again.' : 'Something went wrong. Try again.', 'error');
        }
      }

      return res;
    } catch (err) {
      logger.error(context?.source || 'authFetch', context?.action || 'request', err, { url: path });
      if (!context?.silent) {
        showToast('Network error. Check your connection and try again.', 'error');
      }
      throw err;
    }
  }, [getAccessToken, showToast]);

  return { authFetch, getAccessToken };
}
