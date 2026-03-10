import React from 'react';
import Link from 'next/link';
import { sanitizeHtml } from '@/lib/sanitize';
import { timeAgo } from '@/lib/utils';
import LikeButton from './LikeButton';
import type { FeedPost } from '@/types/feed';

interface PostCardProps {
  post: FeedPost;
  onPostDeleted?: () => void;
}

function truncateHtml(html: string, maxLen: number): { text: string; truncated: boolean } {
  const div = typeof document !== 'undefined' ? document.createElement('div') : null;
  if (!div) return { text: html.slice(0, maxLen), truncated: html.length > maxLen };
  div.innerHTML = html;
  const text = div.textContent || '';
  return { text: text.slice(0, maxLen), truncated: text.length > maxLen };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { text, truncated } = truncateHtml(post.body_html, 300);

  return (
    <article className="post-card">
      <div className="post-card__header">
        <Link href={`/members/${post.author_username || post.author_id}`}>
          <div className="post-card__avatar">
            {post.author_avatar_url ? (
              <img src={post.author_avatar_url} alt="" />
            ) : (
              <span>{post.author_display_name.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </Link>
        <div className="post-card__meta">
          <Link href={`/members/${post.author_username || post.author_id}`} className="post-card__author">
            {post.author_display_name}
          </Link>
          <span className="post-card__time">{timeAgo(post.created_at)}</span>
          {post.edited_at && <span className="post-card__edited">(edited)</span>}
        </div>
        {post.category_name && (
          <span className="post-card__category">{post.category_name}</span>
        )}
        {post.pinned_position && (
          <span className="post-card__pinned">
            <i className="fa-solid fa-thumbtack"></i> Pinned
          </span>
        )}
      </div>

      {post.title && <h3 className="post-card__title">{post.title}</h3>}

      <div className="post-card__body">
        {truncated ? (
          <>
            <p>{text}...</p>
            <Link href={`/community/posts/${post.id}`} className="post-card__read-more">
              Read more
            </Link>
          </>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.body_html) }} />
        )}
      </div>

      <div className="post-card__footer">
        <LikeButton
          targetType="post"
          targetId={post.id}
          initialCount={post.like_count}
          initialLiked={post.is_liked || false}
        />
        <Link href={`/community/posts/${post.id}`} className="post-card__comment-btn">
          <i className="fa-regular fa-comment"></i>
          <span>{post.comment_count}</span>
        </Link>
      </div>
    </article>
  );
};

export default PostCard;
