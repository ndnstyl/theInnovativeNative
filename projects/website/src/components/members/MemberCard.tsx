import React from 'react';
import Link from 'next/link';
import type { MemberCardData } from '@/types/members';
import RoleBadge from './RoleBadge';
import LevelBadge from './LevelBadge';

interface MemberCardProps {
  member: MemberCardData;
}

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const href = member.username ? `/members/${member.username}` : '#';
  const bioExcerpt = member.bio && member.bio.length > 80
    ? member.bio.slice(0, 80) + '...'
    : member.bio;

  return (
    <Link href={href} className="member-card">
      <div className="member-card__avatar">
        {member.avatar_url ? (
          <img src={member.avatar_url} alt={member.display_name} />
        ) : (
          <span className="member-card__initials">
            {getInitials(member.display_name)}
          </span>
        )}
        {member.level > 0 && (
          <span className="member-card__level-overlay">
            <LevelBadge level={member.level} size={16} />
          </span>
        )}
      </div>
      <div className="member-card__info">
        <div className="member-card__name-row">
          <span className="member-card__name">{member.display_name}</span>
          <RoleBadge role={member.role} />
        </div>
        {member.username && (
          <span className="member-card__username">@{member.username}</span>
        )}
        {bioExcerpt && (
          <p className="member-card__bio">{bioExcerpt}</p>
        )}
        <span className="member-card__meta">
          Joined {getRelativeTime(member.joined_at)}
        </span>
      </div>
    </Link>
  );
};

export default MemberCard;
