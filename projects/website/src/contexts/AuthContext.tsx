import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import type { Database, Profile } from '@/types/supabase';
import type { Role, MembershipStatus } from '@/types/members';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { getStoredAuth, isTokenExpired, getValidToken } from '@/lib/auth-token';
import { logger } from '@/lib/logger';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

interface AuthContextType {
  supabaseClient: SupabaseClient<Database>;
  session: Session | null;
  isLoading: boolean;
  profile: Profile | null;
  role: Role | null;
  membershipStatus: MembershipStatus | null;
  isOnboarded: boolean;
  refreshProfile: () => Promise<void>;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Direct REST fetch with AbortController timeout. Never hangs. */
async function restGet<T>(path: string, token: string | null, timeoutMs = 8000): Promise<{ data: T | null; error: string | null }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${token || SUPABASE_ANON_KEY}`,
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { data: null, error: `${res.status}: ${body}` };
    }
    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { data: null, error: 'Request timed out' };
    }
    return { data: null, error: err instanceof Error ? err.message : 'Network error' };
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabaseClient] = useState(() => getSupabaseBrowserClient());
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const profileFetchedRef = useRef(false);

  /** Fetch profile via direct REST — NEVER uses the Supabase client's auth module. */
  const fetchProfile = useCallback(async (userId: string, token?: string): Promise<boolean> => {
    const accessToken = token || getValidToken();

    try {
      const { data: profiles, error: profileErr } = await restGet<Profile[]>(
        `profiles?id=eq.${userId}&select=id,display_name,username,avatar_url,bio,location,website,social_links,membership_status,onboarding_complete,last_active_at,username_changed_at,level,xp_total,created_at,updated_at`,
        accessToken
      );

      if (!mountedRef.current) return false;

      if (profileErr) {
        logger.warn('AuthContext', 'fetchProfile', profileErr);
        setAuthError(`Profile load failed: ${profileErr}`);
        return false;
      }

      if (!profiles || profiles.length === 0) {
        // No profile row — new user, trigger didn't fire yet
        setProfile(null);
        setIsOnboarded(false);
        setAuthError(null);
        return true;
      }

      const profileData = profiles[0];
      setProfile(profileData);
      setMembershipStatus((profileData.membership_status as MembershipStatus) || null);
      setIsOnboarded(profileData.onboarding_complete ?? false);
      setAuthError(null);
      profileFetchedRef.current = true;

      // Fetch role (non-blocking)
      const { data: members } = await restGet<{ role: string }[]>(
        `community_members?member_id=eq.${userId}&deleted_at=is.null&select=role&limit=1`,
        accessToken
      );
      if (mountedRef.current && members && members.length > 0) {
        setRole(members[0].role as Role);
      }

      return true;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return false;
      logger.error('AuthContext', 'fetchProfile', err);
      setAuthError('Failed to load profile');
      return false;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.user?.id) {
      await fetchProfile(session.user.id);
    }
  }, [session, fetchProfile]);

  useEffect(() => {
    mountedRef.current = true;
    profileFetchedRef.current = false;

    const done = () => {
      if (mountedRef.current) setIsLoading(false);
    };

    // Safety net
    const timeout = setTimeout(done, 6000);

    const initAuth = async () => {
      const stored = getStoredAuth();

      if (stored) {
        if (isTokenExpired(stored)) {
          logger.info('AuthContext', 'initAuth', 'Token expired, attempting refresh');
          try {
            const { data, error } = await supabaseClient.auth.refreshSession({
              refresh_token: stored.refresh_token,
            });
            if (error || !data.session) {
              logger.warn('AuthContext', 'initAuth', 'Refresh failed: ' + (error?.message || 'no session'));
              setSession(null);
              clearTimeout(timeout);
              done();
              return;
            }
            setSession(data.session);
            await fetchProfile(data.session.user.id, data.session.access_token);
            clearTimeout(timeout);
            done();
            return;
          } catch (err) {
            logger.error('AuthContext', 'initAuth', err);
            setSession(null);
            clearTimeout(timeout);
            done();
            return;
          }
        }

        // Token is valid
        const restoredSession: Session = {
          access_token: stored.access_token,
          refresh_token: stored.refresh_token,
          expires_in: stored.expires_at ? stored.expires_at - Math.floor(Date.now() / 1000) : 3600,
          expires_at: stored.expires_at,
          token_type: 'bearer',
          user: stored.user as unknown as Session['user'],
        };
        setSession(restoredSession);

        // Fetch profile with the STORED token directly — never touches auth module
        await fetchProfile(stored.user.id, stored.access_token);
        clearTimeout(timeout);
        done();
        return;
      }

      // No stored session
      setTimeout(() => {
        if (mountedRef.current && !profileFetchedRef.current) {
          clearTimeout(timeout);
          done();
        }
      }, 1500);
    };

    initAuth();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mountedRef.current) return;

        if (newSession) {
          setSession(newSession);
          if (newSession.user?.id && !profileFetchedRef.current) {
            await fetchProfile(newSession.user.id, newSession.access_token);
          } else if (event === 'SIGNED_IN' && newSession.user?.id) {
            await fetchProfile(newSession.user.id, newSession.access_token);
          }
          done();
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setProfile(null);
          setRole(null);
          setMembershipStatus(null);
          setIsOnboarded(false);
          setAuthError(null);
          done();
        } else if (event === 'INITIAL_SESSION') {
          done();
        }
      }
    );

    return () => {
      mountedRef.current = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{
      supabaseClient,
      session,
      isLoading,
      profile,
      role,
      membershipStatus,
      isOnboarded,
      refreshProfile,
      authError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
