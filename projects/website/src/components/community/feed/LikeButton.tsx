import React from 'react';
import { useLikes } from '@/hooks/useLikes';

interface LikeButtonProps {
  targetType: 'post' | 'comment';
  targetId: string;
  initialCount: number;
  initialLiked: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ targetType, targetId, initialCount, initialLiked }) => {
  const { isLiked, likeCount, toggleLike, loading } = useLikes({
    targetType,
    targetId,
    initialCount,
    initialLiked,
  });

  return (
    <button
      className={`like-button ${isLiked ? 'like-button--liked' : ''}`}
      onClick={toggleLike}
      disabled={loading}
      aria-label={isLiked ? 'Unlike' : 'Like'}
      aria-pressed={isLiked}
    >
      <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`}></i>
      <span>{likeCount}</span>
    </button>
  );
};

export default LikeButton;
