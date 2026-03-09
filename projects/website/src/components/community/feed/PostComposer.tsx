import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import RichTextEditor from '@/components/community/shared/RichTextEditor';
import { sanitizeHtml } from '@/lib/sanitize';
import type { JSONContent } from '@tiptap/react';

interface PostComposerProps {
  communityId: string;
  categories: { id: string; name: string }[];
  onPostCreated: () => void;
}

const PostComposer: React.FC<PostComposerProps> = ({ communityId, categories, onPostCreated }) => {
  const { supabaseClient, session } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [body, setBody] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((_json: JSONContent, html: string) => {
    setBody(JSON.stringify(_json));
    setBodyHtml(html);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseClient || !session?.user?.id) return;

    const sanitized = sanitizeHtml(bodyHtml);
    if (!sanitized.replace(/<[^>]*>/g, '').trim()) {
      setError('Post cannot be empty');
      return;
    }
    if (!categoryId) {
      setError('Please select a category');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabaseClient
        .from('posts')
        .insert({
          community_id: communityId,
          author_id: session.user.id,
          category_id: categoryId,
          body,
          body_html: sanitized,
        });

      if (insertError) throw insertError;

      setBody('');
      setBodyHtml('');
      setCategoryId('');
      setExpanded(false);
      onPostCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  if (!expanded) {
    return (
      <div className="post-composer post-composer--collapsed" onClick={() => setExpanded(true)}>
        <div className="post-composer__placeholder">
          <i className="fa-regular fa-pen-to-square"></i>
          <span>Share something with the community...</span>
        </div>
      </div>
    );
  }

  return (
    <form className="post-composer" onSubmit={handleSubmit}>
      <RichTextEditor
        onChange={handleChange}
        placeholder="Share something with the community..."
      />

      <div className="post-composer__actions">
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="post-composer__category-select"
          required
        >
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <div className="post-composer__buttons">
          <button
            type="button"
            className="post-composer__cancel"
            onClick={() => setExpanded(false)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={submitting}
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {error && <div className="post-composer__error">{error}</div>}
    </form>
  );
};

export default PostComposer;
