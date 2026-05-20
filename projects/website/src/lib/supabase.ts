import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { getValidToken } from '@/lib/auth-token';

let supabaseInstance: SupabaseClient<Database> | null = null;

const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  return url;
};

const getSupabaseAnonKey = () => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return key;
};

export const getSupabaseBrowserClient = () => {
  if (!supabaseInstance) {
    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey();

    // Inject a VALID (non-expired) auth token into every request.
    // If the token is expired, DON'T inject it — let the Supabase auth module's
    // autoRefreshToken handle it. This prevents the custom fetch from defeating
    // the SDK's built-in token refresh mechanism.
    const customFetch = (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof window !== 'undefined') {
        const token = getValidToken();
        if (token) {
          const headers = new Headers(init?.headers);
          const existing = headers.get('Authorization');
          if (!existing || existing === `Bearer ${key}`) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          return fetch(input, { ...init, headers });
        }
      }
      return fetch(input, init);
    };

    supabaseInstance = createClient<Database>(url, key, {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        fetch: customFetch,
      },
    });
  }
  return supabaseInstance;
};

/** @deprecated Use getSupabaseBrowserClient() directly */
export const createBrowserClient = getSupabaseBrowserClient;
