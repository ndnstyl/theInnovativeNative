import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLessonComments } from '@/hooks/useLessonComments';
import { sanitizeHtml } from '@/lib/sanitize';
import type { LessonCommentWithAuthor } from '@/types/supabase';

interface LessonCommentsProps {
  lessonId: string;
}

/**
 * Threaded lesson comments section.
 */
const LessonComments: React.FC<LessonCommentsProps> = ({ lessonId }) => {
  const { session, profile } = useAuth();
  const { comments, loading, addComment, deleteComment } = useLessonComments(lessonId);

  if (loading) {
    return (
      <div className="classroom-comments">
        <h4 className="classroom-comments__heading">Discussion</h4>
        <p className="classroom-comments__loading">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="classroom-comments">
      <h4 className="classroom-comments__heading">
        <i className="fa-regular fa-comments"></i>
        Discussion ({comments.length})
      </h4>

      {session && <CommentForm onSubmit={(body, html) => addComment(body, html)} />}

      <div className="classroom-comments__list">
        {comments.map((comment) => (
          <CommentThread
            key={comment.id}
            comment={comment}
            currentUserId={session?.user?.id}
            onReply={(body, html) => addComment(body, html, comment.id)}
            onDelete={deleteComment}
          />
        ))}
      </div>

      {comments.length === 0 && (
        <p className="classroom-comments__empty">
          No comments yet. Be the first to start a discussion!
        </p>
      )}
    </div>
  );
};

// ---------- Comment Form ----------
interface CommentFormProps {
  onSubmit: (body: string, bodyHtml: string) => Promise<boolean>;
  placeholder?: string;
  autoFocus?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  placeholder = 'Add a comment...',
  autoFocus = false,
}) => {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    const html = `<p>${sanitizeHtml(text.replace(/\n/g, '<br>'))}</p>`;
    const success = await onSubmit(text.trim(), html);
    if (success) setText('');
    setSubmitting(false);
  };

  return (
    <form className="classroom-comments__form" onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={2}
        autoFocus={autoFocus}
      />
      <button type="submit" disabled={submitting || !text.trim()}>
        {submitting ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
};

// ---------- Comment Thread ----------
interface CommentThreadProps {
  comment: LessonCommentWithAuthor;
  currentUserId?: string;
  onReply: (body: string, bodyHtml: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  depth?: number;
}

const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  currentUserId,
  onReply,
  onDelete,
  depth = 0,
}) => {
  const [showReply, setShowReply] = useState(false);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className={`classroom-comments__thread ${depth > 0 ? 'classroom-comments__thread--reply' : ''}`}>
      <div className="classroom-comments__comment">
        <div className="classroom-comments__avatar">
          {comment.author.avatar_url ? (
            <img src={comment.author.avatar_url} alt={comment.author.display_name} />
          ) : (
            <span>{comment.author.display_name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="classroom-comments__body">
          <div className="classroom-comments__meta">
            <strong>{comment.author.display_name}</strong>
            <span>{timeAgo(comment.created_at)}</span>
          </div>
          <div
            className="classroom-comments__text"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.body_html) }}
          />
          <div className="classroom-comments__actions">
            {depth < 2 && (
              <button type="button" onClick={() => setShowReply(!showReply)}>
                Reply
              </button>
            )}
            {currentUserId === comment.author_id && (
              <button type="button" onClick={() => onDelete(comment.id)}>
                Delete
              </button>
            )}
          </div>
          {showReply && (
            <CommentForm
              onSubmit={async (body, html) => {
                const ok = await onReply(body, html);
                if (ok) setShowReply(false);
                return ok;
              }}
              placeholder="Reply..."
              autoFocus
            />
          )}
        </div>
      </div>

      {comment.replies?.map((reply) => (
        <CommentThread
          key={reply.id}
          comment={reply}
          currentUserId={currentUserId}
          onReply={onReply}
          onDelete={onDelete}
          depth={depth + 1}
        />
      ))}
    </div>
  );
};

export default LessonComments;
