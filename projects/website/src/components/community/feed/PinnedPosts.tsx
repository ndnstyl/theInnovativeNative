import React from 'react';
import PostCard from './PostCard';
import type { FeedPost } from '@/types/feed';

interface PinnedPostsProps {
  posts: FeedPost[];
}

const PinnedPosts: React.FC<PinnedPostsProps> = ({ posts }) => {
  const pinned = posts
    .filter(p => p.pinned_position !== null)
    .sort((a, b) => (a.pinned_position || 0) - (b.pinned_position || 0));

  if (pinned.length === 0) return null;

  return (
    <div className="pinned-posts">
      {pinned.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PinnedPosts;
