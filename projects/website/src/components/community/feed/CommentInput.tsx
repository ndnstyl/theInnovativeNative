import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useComments } from '@/hooks/useComments';
import { sanitizeHtml } from '@/lib/sanitize';
import RichTextEditor from '@/components/community/shared/RichTextEditor';
import type { JSONContent } from '@tiptap/react';

interface CommentInputProps {
  postId: string;
  parentId?: string;
  onSubmit: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ postId, parentId, onSubmit }) => {
  const { session } = useAuth();
  const { addComment, loading } = useComments(postId);
  const [body, setBody] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');

  const handleChange = useCallback((_json: JSONContent, html: string) => {
    setBody(JSON.stringify(_json));
    setBodyHtml(html);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    const sanitized = sanitizeHtml(bodyHtml);
    if (!sanitized.replace(/<[^>]*>/g, '').trim()) return;

    const result = await addComment({
      post_id: postId,
      author_id: session.user.id,
      parent_comment_id: parentId,
      body,
      body_html: sanitized,
    });

    if (result) {
      setBody('');
      setBodyHtml('');
      onSubmit();
    }
  };

  return (
    <form className="comment-input" onSubmit={handleSubmit}>
      <RichTextEditor
        onChange={handleChange}
        placeholder={parentId ? 'Write a reply...' : 'Write a comment...'}
        showToolbar={false}
      />
      <button type="submit" className="btn btn--primary btn--sm" disabled={loading}>
        {loading ? '...' : parentId ? 'Reply' : 'Comment'}
      </button>
    </form>
  );
};

export default CommentInput;
