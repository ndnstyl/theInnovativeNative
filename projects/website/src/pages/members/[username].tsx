import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ClassroomLayout from '@/components/layout/ClassroomLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import ProfileHeader from '@/components/members/ProfileHeader';
import ProfileActivity from '@/components/members/ProfileActivity';
import RoleManagement from '@/components/members/RoleManagement';
import ActivityChart from '@/components/members/ActivityChart';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { useFollow } from '@/hooks/useFollow';
import { useLastActive } from '@/hooks/useLastActive';
import type { MemberProfileData, Role } from '@/types/members';

const MemberProfilePage = () => {
  const router = useRouter();
  const { username } = router.query;
  const { supabaseClient, session } = useAuth();
  const { canManageRoles } = useRole();
  useLastActive();

  const [member, setMember] = useState<MemberProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isAgent, setIsAgent] = useState(false);

  const { followerCount, followingCount, isFollowing } = useFollow(member?.id || '');

  useEffect(() => {
    if (!username || typeof username !== 'string') return;

    const fetchMember = async () => {
      setIsLoading(true);

      // Fetch profile by username
      const { data: profile, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !profile) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      // Fetch role from community_members
      const { data: memberData } = await supabaseClient
        .from('community_members')
        .select('role, joined_at')
        .eq('member_id', profile.id)
        .is('deleted_at', null)
        .single();

      const memberProfile: MemberProfileData = {
        id: profile.id,
        display_name: profile.display_name,
        username: profile.username,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        social_links: (profile.social_links as any) || [],
        role: (memberData?.role as Role) || 'member',
        level: profile.level,
        xp_total: profile.xp_total,
        membership_status: profile.membership_status,
        onboarding_complete: profile.onboarding_complete,
        last_active_at: profile.last_active_at,
        username_changed_at: profile.username_changed_at,
        joined_at: memberData?.joined_at || profile.created_at,
        created_at: profile.created_at,
        follower_count: 0,
        following_count: 0,
        is_following: false,
      };

      // Check if this is an AI agent profile
      setIsAgent(!!(profile as any).is_agent);

      setMember(memberProfile);
      setIsLoading(false);
    };

    fetchMember();
  }, [supabaseClient, username]);

  // Update follow data when it changes
  useEffect(() => {
    if (member) {
      setMember(prev => prev ? {
        ...prev,
        follower_count: followerCount,
        following_count: followingCount,
        is_following: isFollowing,
      } : null);
    }
  }, [followerCount, followingCount, isFollowing]);

  if (notFound) {
    return (
      <ClassroomLayout title="Not Found">
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <i className="fa-solid fa-user-slash" style={{ fontSize: 48, color: '#333', marginBottom: 16 }}></i>
            <h2 style={{ color: '#fff', marginBottom: 8 }}>Member not found</h2>
            <p style={{ color: '#757575' }}>This profile doesn&apos;t exist or has been removed.</p>
          </div>
        </div>
      </ClassroomLayout>
    );
  }

  return (
    <ClassroomLayout title={member?.display_name || 'Profile'}>
      <ProtectedRoute>
        <Head>
          <title>{member?.display_name || 'Profile'} | The Innovative Native</title>
        </Head>
        <div className="member-profile-page">
          {isLoading ? (
            <div className="member-profile-page__loading">
              <div className="member-profile-page__spinner" />
              <p>Loading profile...</p>
            </div>
          ) : member ? (
            <>
              {isAgent && (
                <div className="agent-profile-banner" role="status" aria-label="AI Team Member profile">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 0a1 1 0 011 1v1.07A6.002 6.002 0 0113.93 7H15a1 1 0 110 2h-1.07A6.002 6.002 0 019 13.93V15a1 1 0 11-2 0v-1.07A6.002 6.002 0 012.07 9H1a1 1 0 010-2h1.07A6.002 6.002 0 017 2.07V1a1 1 0 011-1zm0 4a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 110 4 2 2 0 010-4z"/>
                  </svg>
                  <span>This is an AI community team member at BuildMyTribe. {member.bio}</span>
                </div>
              )}

              <ProfileHeader member={member} />

              {!isAgent && canManageRoles && session?.user?.id !== member.id && (
                <RoleManagement
                  targetMemberId={member.id}
                  currentRole={member.role}
                  memberStatus={member.membership_status}
                />
              )}

              <ActivityChart userId={member.id} />
              <ProfileActivity userId={member.id} />
            </>
          ) : null}
        </div>
      </ProtectedRoute>
    </ClassroomLayout>
  );
};

export default MemberProfilePage;
