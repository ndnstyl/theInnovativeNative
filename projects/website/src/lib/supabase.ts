import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Create a singleton Supabase client for browser usage
let supabaseInstance: SupabaseClient<Database> | null = null;

const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  return url;
};

const getSupabaseAnonKey = () => {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }
  return key;
};

export const getSupabaseBrowserClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseBrowserClient<Database>(
      getSupabaseUrl(),
      getSupabaseAnonKey()
    );
  }
  return supabaseInstance;
};

// Helper to create a new client instance (useful for when you need a fresh instance)
export const createBrowserClient = () => {
  return createSupabaseBrowserClient<Database>(
    getSupabaseUrl(),
    getSupabaseAnonKey()
  );
};

// Re-export for convenience (lazy initialization)
export const supabase = {
  get client() {
    return getSupabaseBrowserClient();
  }
};
