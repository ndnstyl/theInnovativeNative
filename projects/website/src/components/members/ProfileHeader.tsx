import React from 'react';
import Link from 'next/link';
import type { MemberProfileData, SocialLink } from '@/types/members';
import { useAuth } from '@/contexts/AuthContext';
import { useMemberStats } from '@/hooks/useMemberStats';
import RoleBadge from './RoleBadge';
import LevelBadge from './LevelBadge';
import FollowButton from './FollowButton';
import ProgressionDisplay from '@/components/gamification/ProgressionDisplay';

interface ProfileHeaderProps {
  member: MemberProfileData;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getRelativeTime(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 5) return 'Online now';
  if (minutes < 60) return `Active ${minutes}m ago`;
  if (hours < 24) return `Active ${hours}h ago`;
  if (days < 30) return `Active ${days}d ago`;
  return `Active ${formatDate(dateStr)}`;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ member }) => {
  const { session } = useAuth();
  const isOwnProfile = session?.user?.id === member.id;
  const socialLinks = (member.social_links || []) as SocialLink[];
  const { stats, level, nextLevel } = useMemberStats(member.id);

  return (
    <div className="profile-header">
      <div className="profile-header__avatar">
        {member.avatar_url ? (
          <img src={member.avatar_url} alt={member.display_name} />
        ) : (
          <span className="profile-header__initials">
            {getInitials(member.display_name)}
          </span>
        )}
      </div>

      <div className="profile-header__info">
        <div className="profile-header__name-row">
          <h1>{member.display_name}</h1>
          <RoleBadge role={member.role} />
          <LevelBadge level={member.level} size={32} />
        </div>

        {stats && level && (
          <div className="profile-header__points">
            <span>{stats.total_points.toLocaleString()} points</span>
          </div>
        )}

        {member.username && (
          <span className="profile-header__username">@{member.username}</span>
        )}

        <div className="profile-header__meta">
          <span>Member since {formatDate(member.joined_at || member.created_at)}</span>
          <span className="profile-header__dot">·</span>
          <span>{getRelativeTime(member.last_active_at)}</span>
        </div>

        <div className="profile-header__stats">
          <span><strong>{member.follower_count}</strong> followers</span>
          <span className="profile-header__dot">·</span>
          <span><strong>{member.following_count}</strong> following</span>
        </div>

        {stats && level && (
          <ProgressionDisplay
            currentPoints={stats.total_points}
            currentLevel={level}
            nextLevel={nextLevel}
          />
        )}

        {member.bio && <p className="profile-header__bio">{member.bio}</p>}

        {socialLinks.length > 0 && (
          <div className="profile-header__social">
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-header__social-link"
              >
                <i className="fa-solid fa-link"></i>
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="profile-header__actions">
          {isOwnProfile ? (
            <Link href={`/members/${member.username}/edit`} className="btn btn--outline btn--sm">
              <i className="fa-solid fa-pen"></i> Edit Profile
            </Link>
          ) : (
            <FollowButton targetUserId={member.id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
