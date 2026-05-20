import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Dedicated Supabase client for Law Firm RAG (Cerebro)
// Separate instance from the community platform
let lfrInstance: SupabaseClient | null = null;

const getLfrUrl = () => {
  const url = process.env.NEXT_PUBLIC_LFR_SUPABASE_URL;
  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_LFR_SUPABASE_URL environment variable');
  }
  return url;
};

const getLfrAnonKey = () => {
  const key = process.env.NEXT_PUBLIC_LFR_SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error('Missing NEXT_PUBLIC_LFR_SUPABASE_ANON_KEY environment variable');
  }
  return key;
};

export const getLfrSupabaseClient = () => {
  if (!lfrInstance) {
    lfrInstance = createClient(getLfrUrl(), getLfrAnonKey());
  }
  return lfrInstance;
};

export const lfrSupabase = {
  get client() {
    return getLfrSupabaseClient();
  },
};
