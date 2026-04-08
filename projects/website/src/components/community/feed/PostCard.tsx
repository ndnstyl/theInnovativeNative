import React from 'react';
import Link from 'next/link';
import { sanitizeHtml } from '@/lib/sanitize';
import { timeAgo } from '@/lib/utils';
import LikeButton from './LikeButton';
import PostActionsMenu from './PostActionsMenu';
import LevelBadge from '@/components/common/LevelBadge';
import AvatarStack from '@/components/common/AvatarStack';
import type { FeedPost } from '@/types/feed';

interface PostCardProps {
  post: FeedPost;
  onPostClick?: (postId: string) => void;
  onPostDeleted?: () => void;
  onPinChanged?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostClick, onPostDeleted, onPinChanged }) => {
  const handleCardClick = () => {
    if (onPostClick) {
      onPostClick(post.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      className="post-card"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      style={{ cursor: 'pointer' }}
    >
      <div className="post-card__header">
        <Link href={`/members/${post.author_username || post.author_id}`} onClick={(e) => e.stopPropagation()}>
          <div className="post-card__avatar">
            {post.author_avatar_url ? (
              <img src={post.author_avatar_url} alt="" />
            ) : (
              <span>{post.author_display_name.charAt(0).toUpperCase()}</span>
            )}
            <LevelBadge level={post.author_level || 1} size="sm" />
          </div>
        </Link>
        <div className="post-card__meta">
          <div className="post-card__meta-top">
            <Link href={`/members/${post.author_username || post.author_id}`} className="post-card__author" onClick={(e) => e.stopPropagation()}>
              {post.author_display_name}
            </Link>
            {post.author_is_agent && (
              <span className="post-card__ai-badge">AI Team</span>
            )}
            <span className="post-card__time">{timeAgo(post.created_at)}</span>
            {post.edited_at && <span className="post-card__edited">(edited)</span>}
          </div>
          <div className="post-card__meta-tags">
            {post.category_name && (
              <span className="post-card__category">{post.category_name}</span>
            )}
            {post.pinned_position != null && (
              <span className="post-card__pinned">
                <i className="fa-solid fa-thumbtack"></i> Pinned
              </span>
            )}
          </div>
        </div>
        <PostActionsMenu post={post} onPinChanged={onPinChanged} onPostDeleted={onPostDeleted} />
      </div>

      {post.title && <h3 className="post-card__title">{post.title}</h3>}

      <div className="post-card__body post-card__body--clamp">
        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.body_html) }} />
      </div>

      <div className="post-card__footer">
        <div className="post-card__actions" onClick={(e) => e.stopPropagation()}>
          <LikeButton
            targetType="post"
            targetId={post.id}
            initialCount={post.like_count}
            initialLiked={post.is_liked || false}
          />
          <button className="post-card__comment-btn" onClick={handleCardClick}>
            <i className="fa-regular fa-comment"></i>
            <span>{post.comment_count}</span>
          </button>
        </div>

        {post.recent_commenters && post.recent_commenters.length > 0 && (
          <div className="post-card__commenters">
            <AvatarStack avatars={post.recent_commenters} maxVisible={4} size={24} />
            {post.last_comment_at && (
              <span className="post-card__last-comment">
                Last comment {timeAgo(post.last_comment_at)}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
