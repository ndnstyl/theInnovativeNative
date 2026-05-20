import React, { useEffect, useCallback, useState, useRef } from 'react';
import Link from 'next/link';
import { sanitizeHtml } from '@/lib/sanitize';
import { timeAgo } from '@/lib/utils';
import { usePostDetail } from '@/hooks/usePostDetail';
import LikeButton from './LikeButton';
import LevelBadge from '@/components/common/LevelBadge';
import CommentThread from './CommentThread';
import CommentInput from './CommentInput';

interface PostModalProps {
  postId: string | null;
  onClose: () => void;
  onCommentCountChange?: (postId: string, newCount: number) => void;
}

const FOCUSABLE_SELECTORS =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const PostModal: React.FC<PostModalProps> = ({ postId, onClose, onCommentCountChange }) => {
  const { post, comments, loading, error, hasMoreComments, loadMoreComments, refetchComments } = usePostDetail(postId);
  const [localCommentCount, setLocalCommentCount] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  // Sync local comment count with post data when post loads
  useEffect(() => {
    if (post) {
      setLocalCommentCount(post.comment_count);
    }
  }, [post]);

  // Capture trigger element and move focus into modal when it opens
  useEffect(() => {
    if (postId) {
      triggerRef.current = document.activeElement;
      const modal = modalRef.current;
      if (modal) {
        const firstFocusable = modal.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          modal.focus();
        }
      }
    } else {
      const trigger = triggerRef.current;
      if (trigger && trigger instanceof HTMLElement) {
        trigger.focus();
      }
      triggerRef.current = null;
    }
  }, [postId]);

  // Escape key closes modal + focus trap
  useEffect(() => {
    if (!postId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const modal = modalRef.current;
      if (!modal) return;

      const focusable = Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(
        el => !el.closest('[hidden]') && el.offsetParent !== null,
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [postId, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (postId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [postId]);

  // Backdrop click closes modal
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  // Comment added handler — refetch comments, increment local count, notify parent
  const handleCommentAdded = useCallback(() => {
    refetchComments();
    setLocalCommentCount(prev => {
      const newCount = prev + 1;
      if (postId && onCommentCountChange) {
        onCommentCountChange(postId, newCount);
      }
      return newCount;
    });
  }, [postId, refetchComments, onCommentCountChange]);

  if (!postId) return null;

  return (
    <div
      className="post-modal-overlay"
      onClick={handleBackdropClick}
    >
      <div
        className="post-modal"
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        {...(loading || error || !post
          ? { 'aria-label': loading ? 'Loading post' : 'Post detail' }
          : post.title
            ? { 'aria-labelledby': 'post-modal-title' }
            : { 'aria-label': 'Post detail' }
        )}
      >
        {/* Mobile back bar */}
        <div className="post-modal__mobile-header">
          <button className="post-modal__back-btn" onClick={onClose} aria-label="Go back">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <span className="post-modal__mobile-title">Post</span>
        </div>

        {/* Desktop close button */}
        <button className="post-modal__close" onClick={onClose} aria-label="Close modal">
          <i className="fa-solid fa-xmark"></i>
        </button>

        {loading ? (
          <div className="post-modal__loading">
            <div className="spinner" />
            <p>Loading post...</p>
          </div>
        ) : error || !post ? (
          <div className="post-modal__error">
            <i className="fa-solid fa-exclamation-triangle" style={{ fontSize: 36, color: '#333' }}></i>
            <h3>Post not found</h3>
            <p>{error || 'This post may have been deleted.'}</p>
          </div>
        ) : (
          <div className="post-modal__scroll">
            {/* Header: avatar + name + level + category + time */}
            <div className="post-modal__header">
              <Link href={`/members/${post.author_username || post.author_id}`}>
                <div className="post-modal__avatar">
                  {post.author_avatar_url ? (
                    <img src={post.author_avatar_url} alt="" />
                  ) : (
                    <span>{post.author_display_name.charAt(0).toUpperCase()}</span>
                  )}
                  <LevelBadge level={post.author_level || 1} size="sm" />
                </div>
              </Link>
              <div className="post-modal__meta">
                <div className="post-modal__meta-top">
                  <Link href={`/members/${post.author_username || post.author_id}`} className="post-modal__author">
                    {post.author_display_name}
                  </Link>
                  <span className="post-modal__time">{timeAgo(post.created_at)}</span>
                  {post.edited_at && <span className="post-modal__edited">(edited)</span>}
                </div>
                {post.category_name && (
                  <span className="post-modal__category">{post.category_name}</span>
                )}
              </div>
            </div>

            {/* Title */}
            {post.title && <h2 id="post-modal-title" className="post-modal__title">{post.title}</h2>}

            {/* Body */}
            <div
              className="post-modal__body"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.body_html) }}
            />

            {/* Footer: likes + comment count */}
            <div className="post-modal__footer">
              <LikeButton
                targetType="post"
                targetId={post.id}
                initialCount={post.like_count}
                initialLiked={post.is_liked || false}
              />
              <span className="post-modal__comment-count">
                <i className="fa-regular fa-comment"></i> {localCommentCount} comments
              </span>
            </div>

            {/* Comments section */}
            <div className="post-modal__comments">
              <CommentInput postId={post.id} onSubmit={handleCommentAdded} />
              <CommentThread
                comments={comments}
                postId={post.id}
                hasMore={hasMoreComments}
                onLoadMore={loadMoreComments}
                onCommentAdded={handleCommentAdded}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostModal;
