// Feed types for 011-community-feed
// Maps to actual deployed schema (posts.body = Tiptap JSON string, posts.body_html = sanitized HTML)

export interface FeedPost {
  id: string;
  community_id: string;
  author_id: string;
  category_id: string | null;
  title: string | null;
  body: string; // Tiptap JSON (stringified)
  body_html: string; // Sanitized HTML for display
  pinned_position: number | null;
  like_count: number;
  comment_count: number;
  edited_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  author_display_name: string;
  author_avatar_url: string | null;
  author_username: string | null;
  author_level: number;
  category_name: string | null;
  // Recent commenters for AvatarStack
  recent_commenters: { url: string | null; name: string }[];
  last_comment_at: string | null;
  // Client-side state
  is_liked?: boolean;
}

export interface FeedComment {
  id: string;
  post_id: string;
  author_id: string;
  parent_comment_id: string | null;
  body: string;
  body_html: string;
  like_count: number;
  deleted_at: string | null;
  created_at: string;
  // Joined fields
  author_display_name: string;
  author_avatar_url: string | null;
  author_username: string | null;
  // Threading
  replies?: FeedComment[];
  // Client-side state
  is_liked?: boolean;
}

export interface FeedAttachment {
  id: string;
  post_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  display_mode: 'inline' | 'download';
  optimized_path: string | null;
}

export interface FeedPoll {
  id: string;
  post_id: string;
  question: string;
  total_votes: number;
  options: FeedPollOption[];
}

export interface FeedPollOption {
  id: string;
  poll_id: string;
  option_text: string;
  vote_count: number;
  display_order: number;
}

export interface FeedCategory {
  id: string;
  community_id: string;
  name: string;
  description: string | null;
  display_order: number;
  post_count: number;
}

export type FeedSort = 'recent' | 'popular';

export interface CreatePostPayload {
  community_id: string;
  author_id: string;
  category_id: string;
  title?: string;
  body: string; // Tiptap JSON string
  body_html: string; // Sanitized HTML
}

export interface CreateCommentPayload {
  post_id: string;
  author_id: string;
  parent_comment_id?: string;
  body: string;
  body_html: string;
}

export interface MentionItem {
  id: string;
  label: string;
  avatar_url: string | null;
}
