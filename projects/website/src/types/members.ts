import type { Profile, CommunityMember } from './supabase';

// Role hierarchy: owner > admin > moderator > member
export type Role = 'owner' | 'admin' | 'moderator' | 'member';

export type MembershipStatus = 'pending' | 'approved' | 'declined' | 'removed' | 'banned';

export interface SocialLink {
  label: string;
  url: string;
}

export interface OnboardingFormData {
  display_name: string;
  username: string;
  bio: string;
  avatar_url: string | null;
}

// Profile + role for directory cards
export interface MemberCardData {
  id: string;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: Role;
  level: number;
  joined_at: string;
  last_active_at: string | null;
}

// Full profile for profile pages
export interface MemberProfileData {
  id: string;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  social_links: SocialLink[];
  role: Role;
  level: number;
  xp_total: number;
  membership_status: string;
  onboarding_complete: boolean;
  last_active_at: string | null;
  username_changed_at: string | null;
  joined_at: string;
  created_at: string;
  follower_count: number;
  following_count: number;
  is_following: boolean;
}

// Role hierarchy for comparison
export const ROLE_HIERARCHY: Record<Role, number> = {
  owner: 4,
  admin: 3,
  moderator: 2,
  member: 1,
};
