import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { sanitizeHtml } from '@/lib/sanitize';
import { timeAgo } from '@/lib/utils';
import { usePost } from '@/hooks/usePost';
import LikeButton from './LikeButton';
import CommentThread from './CommentThread';
import CommentInput from './CommentInput';
import AttachmentDisplay from './AttachmentDisplay';
import PollDisplay from './PollDisplay';
import type { FeedPost } from '@/types/feed';

interface PostDetailProps {
  postId: string;
}

const PostDetail: React.FC<PostDetailProps> = ({ postId }) => {
  const { post, comments, attachments, poll, loading, error, hasMoreComments, loadMoreComments } = usePost(postId);
  const [commentKey, setCommentKey] = useState(0);

  const handleCommentAdded = useCallback(() => {
    setCommentKey(prev => prev + 1);
  }, []);

  if (loading) {
    return (
      <div className="post-detail__loading">
        <div className="spinner" />
        <p>Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail__error">
        <i className="fa-solid fa-exclamation-triangle" style={{ fontSize: 36, color: '#333' }}></i>
        <h3>Post not found</h3>
        <Link href="/community">Back to feed</Link>
      </div>
    );
  }

  return (
    <div className="post-detail">
      <Link href="/community" className="post-detail__back">
        <i className="fa-solid fa-arrow-left"></i> Back to feed
      </Link>

      <article className="post-detail__content">
        <div className="post-detail__header">
          <Link href={`/members/${post.author_username || post.author_id}`}>
            <div className="post-detail__avatar">
              {post.author_avatar_url ? (
                <img src={post.author_avatar_url} alt="" />
              ) : (
                <span>{post.author_display_name.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </Link>
          <div>
            <Link href={`/members/${post.author_username || post.author_id}`} className="post-detail__author">
              {post.author_display_name}
            </Link>
            <span className="post-detail__time">{timeAgo(post.created_at)}</span>
            {post.edited_at && <span className="post-detail__edited">(edited)</span>}
          </div>
          {post.category_name && (
            <span className="post-detail__category">{post.category_name}</span>
          )}
        </div>

        {post.title && <h1 className="post-detail__title">{post.title}</h1>}

        <div
          className="post-detail__body"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.body_html) }}
        />

        {attachments.length > 0 && <AttachmentDisplay attachments={attachments} />}
        {poll && <PollDisplay poll={poll} />}

        <div className="post-detail__footer">
          <LikeButton
            targetType="post"
            targetId={post.id}
            initialCount={post.like_count}
            initialLiked={post.is_liked || false}
          />
          <span className="post-detail__comment-count">
            <i className="fa-regular fa-comment"></i> {post.comment_count} comments
          </span>
        </div>
      </article>

      <div className="post-detail__comments">
        <CommentInput postId={postId} onSubmit={handleCommentAdded} />
        <CommentThread
          key={commentKey}
          comments={comments}
          postId={postId}
          hasMore={hasMoreComments}
          onLoadMore={loadMoreComments}
          onCommentAdded={handleCommentAdded}
        />
      </div>
    </div>
  );
};

export default PostDetail;
