import React, { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getValidToken } from '@/lib/auth-token';
import { sanitizeHtml } from '@/lib/sanitize';

const POST_COOLDOWN_MS = 10_000; // 10 seconds between posts
import RichTextEditor from '@/components/community/shared/RichTextEditor';
import type { JSONContent } from '@tiptap/react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

interface PostComposerProps {
  communityId: string;
  categories: { id: string; name: string }[];
  onPostCreated: () => void;
}

const PostComposer: React.FC<PostComposerProps> = ({ communityId, categories, onPostCreated }) => {
  const { session } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const lastPostTime = useRef<number>(0);
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
    if (!session?.user?.id) return;

    const now = Date.now();
    const elapsed = now - lastPostTime.current;
    if (elapsed < POST_COOLDOWN_MS) {
      const remaining = Math.ceil((POST_COOLDOWN_MS - elapsed) / 1000);
      setError(`Please wait ${remaining} seconds before posting again.`);
      return;
    }

    const token = getValidToken();
    if (!token) {
      setError('Session expired. Please sign in again.');
      return;
    }

    const sanitized = sanitizeHtml(bodyHtml);
    if (!sanitized.replace(/<[^>]*>/g, '').trim()) {
      setError('Post cannot be empty');
      return;
    }
    if (sanitized.length > 50000) {
      setError('Post is too long. Maximum 50,000 characters allowed.');
      return;
    }
    if (!categoryId) {
      setError('Please select a category');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          community_id: communityId,
          author_id: session.user.id,
          category_id: categoryId,
          body,
          body_html: sanitized,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `HTTP ${res.status}`);
      }

      lastPostTime.current = Date.now();
      setBody('');
      setBodyHtml('');
      setCategoryId('');
      setExpanded(false);
      onPostCreated();
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('Rate limit exceeded') || msg.includes('54000')) {
        setError('You\'re posting too quickly. Please wait a few minutes.');
      } else {
        setError(msg || 'Failed to create post');
      }
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
          aria-label="Post category"
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

      {error && <div className="post-composer__error" role="alert" aria-live="polite">{error}</div>}
    </form>
  );
};

export default PostComposer;
