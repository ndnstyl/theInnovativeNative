import React from 'react';
import Link from 'next/link';
import { sanitizeHtml } from '@/lib/sanitize';
import { timeAgo } from '@/lib/utils';
import LikeButton from './LikeButton';
import CommentInput from './CommentInput';
import type { FeedComment } from '@/types/feed';

interface CommentThreadProps {
  comments: FeedComment[];
  postId: string;
  hasMore: boolean;
  onLoadMore: () => void;
  onCommentAdded: () => void;
}

const SingleComment: React.FC<{
  comment: FeedComment;
  postId: string;
  isReply?: boolean;
  onCommentAdded: () => void;
}> = ({ comment, postId, isReply, onCommentAdded }) => {
  const [showReply, setShowReply] = React.useState(false);

  if (comment.deleted_at) {
    return (
      <div className={`comment ${isReply ? 'comment--reply' : ''}`}>
        <p className="comment__deleted">Comment deleted by moderator</p>
      </div>
    );
  }

  return (
    <div className={`comment ${isReply ? 'comment--reply' : ''}`}>
      <div className="comment__header">
        <Link href={`/members/${comment.author_username || comment.author_id}`}>
          <div className="comment__avatar">
            {comment.author_avatar_url ? (
              <img src={comment.author_avatar_url} alt="" />
            ) : (
              <span>{comment.author_display_name.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </Link>
        <Link href={`/members/${comment.author_username || comment.author_id}`} className="comment__author">
          {comment.author_display_name}
        </Link>
        <span className="comment__time">{timeAgo(comment.created_at)}</span>
      </div>

      <div
        className="comment__body"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.body_html) }}
      />

      <div className="comment__actions">
        <LikeButton
          targetType="comment"
          targetId={comment.id}
          initialCount={comment.like_count}
          initialLiked={comment.is_liked || false}
        />
        {!isReply && (
          <button
            className="comment__reply-btn"
            onClick={() => setShowReply(!showReply)}
          >
            <i className="fa-regular fa-comment"></i> Reply
          </button>
        )}
      </div>

      {showReply && (
        <CommentInput
          postId={postId}
          parentId={comment.id}
          onSubmit={() => { setShowReply(false); onCommentAdded(); }}
        />
      )}
    </div>
  );
};

const CommentThread: React.FC<CommentThreadProps> = ({
  comments, postId, hasMore, onLoadMore, onCommentAdded,
}) => {
  return (
    <div className="comment-thread">
      {comments.map(comment => (
        <div key={comment.id}>
          <SingleComment
            comment={comment}
            postId={postId}
            onCommentAdded={onCommentAdded}
          />
          {comment.replies?.map(reply => (
            <SingleComment
              key={reply.id}
              comment={reply}
              postId={postId}
              isReply
              onCommentAdded={onCommentAdded}
            />
          ))}
        </div>
      ))}

      {hasMore && (
        <button className="comment-thread__load-more" onClick={onLoadMore}>
          Show more comments
        </button>
      )}
    </div>
  );
};

export default CommentThread;
