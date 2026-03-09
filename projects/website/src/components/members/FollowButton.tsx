import React from 'react';
import { useFollow } from '@/hooks/useFollow';
import { useAuth } from '@/contexts/AuthContext';

interface FollowButtonProps {
  targetUserId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ targetUserId }) => {
  const { session } = useAuth();
  const { isFollowing, toggleFollow, isLoading } = useFollow(targetUserId);

  // Don't render for own profile
  if (!session || session.user.id === targetUserId) return null;

  return (
    <button
      className={`follow-btn ${isFollowing ? 'follow-btn--following' : ''}`}
      onClick={toggleFollow}
      disabled={isLoading}
      aria-label={isFollowing ? 'Unfollow' : 'Follow'}
    >
      {isFollowing ? 'Following' : 'Follow'}

      <style jsx>{`
        .follow-btn {
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          border: 1px solid #333;
          color: #fff;
        }
        .follow-btn:hover {
          border-color: #00FFFF;
          color: #00FFFF;
        }
        .follow-btn--following {
          background-color: #00FFFF;
          color: #000;
          border-color: #00FFFF;
        }
        .follow-btn--following:hover {
          background-color: transparent;
          color: #ff4444;
          border-color: #ff4444;
        }
        .follow-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </button>
  );
};

export default FollowButton;
