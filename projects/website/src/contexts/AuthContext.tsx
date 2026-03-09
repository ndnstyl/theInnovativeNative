import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import type { Database, Profile, CommunityMember } from '@/types/supabase';
import type { Role, MembershipStatus } from '@/types/members';

interface AuthContextType {
  supabaseClient: SupabaseClient<Database>;
  session: Session | null;
  isLoading: boolean;
  profile: Profile | null;
  role: Role | null;
  membershipStatus: MembershipStatus | null;
  isOnboarded: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient<Database> | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const fetchProfileAndRole = useCallback(async (client: SupabaseClient<Database>, userId: string) => {
    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError || !profileData) {
        console.error('Error fetching profile:', profileError);
        setProfile(null);
        setRole(null);
        setMembershipStatus(null);
        setIsOnboarded(false);
        return;
      }

      setProfile(profileData);
      setMembershipStatus((profileData.membership_status as MembershipStatus) || null);
      setIsOnboarded(profileData.onboarding_complete ?? false);

      // Fetch role from community_members (single community for v1)
      const { data: memberData } = await client
        .from('community_members')
        .select('role')
        .eq('member_id', userId)
        .is('deleted_at', null)
        .limit(1)
        .single();

      if (memberData) {
        setRole(memberData.role as Role);
      } else {
        // Auto-create community_members row for new sign-ups
        // Get the first community (single community v1)
        const { data: community } = await client
          .from('communities')
          .select('id')
          .limit(1)
          .single();

        if (community) {
          const { error: insertError } = await client
            .from('community_members')
            .insert({
              community_id: community.id,
              member_id: userId,
              role: 'member',
            });

          if (!insertError) {
            setRole('member');
          }
        }
      }
    } catch (err) {
      console.error('Error in fetchProfileAndRole:', err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (supabaseClient && session?.user?.id) {
      await fetchProfileAndRole(supabaseClient, session.user.id);
    }
  }, [supabaseClient, session, fetchProfileAndRole]);

  useEffect(() => {
    const { getSupabaseBrowserClient } = require('@/lib/supabase');
    const client = getSupabaseBrowserClient();
    setSupabaseClient(client);

    // Get initial session
    client.auth.getSession().then(async ({ data: { session: s } }: { data: { session: Session | null } }) => {
      setSession(s);
      if (s?.user?.id) {
        await fetchProfileAndRole(client, s.user.id);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = client.auth.onAuthStateChange(
      async (_event: string, s: Session | null) => {
        setSession(s);
        if (s?.user?.id) {
          await fetchProfileAndRole(client, s.user.id);
        } else {
          setProfile(null);
          setRole(null);
          setMembershipStatus(null);
          setIsOnboarded(false);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfileAndRole]);

  // During SSR/SSG, render children without auth context
  if (!supabaseClient) {
    return <>{children}</>;
  }

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
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return {
      supabaseClient: null as unknown as SupabaseClient<Database>,
      session: null,
      isLoading: true,
      profile: null,
      role: null,
      membershipStatus: null,
      isOnboarded: false,
      refreshProfile: async () => {},
    };
  }
  return context;
}
