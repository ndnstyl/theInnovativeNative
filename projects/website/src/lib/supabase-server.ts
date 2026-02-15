import { createServerClient as createSupabaseServerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import type { Database } from '@/types/supabase';
import { serialize, parse } from 'cookie';

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

// Create a Supabase server client for API routes
export const createServerClient = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  return createSupabaseServerClient<Database>(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          const cookies = parse(req.headers.cookie || '');
          return Object.entries(cookies).map(([name, value]) => ({
            name,
            value: value || '',
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.setHeader('Set-Cookie', serialize(name, value, {
              ...options,
              path: options?.path || '/',
            }));
          });
        },
      },
    }
  );
};

// Create a Supabase server client for getServerSideProps
export const createServerPropsClient = (
  context: GetServerSidePropsContext
) => {
  return createSupabaseServerClient<Database>(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          const cookies = parse(context.req.headers.cookie || '');
          return Object.entries(cookies).map(([name, value]) => ({
            name,
            value: value || '',
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            context.res.setHeader('Set-Cookie', serialize(name, value, {
              ...options,
              path: options?.path || '/',
            }));
          });
        },
      },
    }
  );
};

// Create an admin client with service role key (use with caution - bypasses RLS)
// Only use this for server-side operations that need elevated privileges
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables for admin client');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
