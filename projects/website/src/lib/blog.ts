import fs from 'fs';
import path from 'path';
import { BlogPost, BlogCategory, BlogTag, BlogPagination } from '@/types/blog';

const POSTS_JSON_PATH = path.join(process.cwd(), 'content/blog/posts.json');
const POSTS_FULL_JSON_PATH = path.join(process.cwd(), 'content/blog/posts-full.json');
const POSTS_PER_PAGE = 9;

// Get all posts (without content)
export function getAllPosts(): BlogPost[] {
  const fileContents = fs.readFileSync(POSTS_JSON_PATH, 'utf-8');
  return JSON.parse(fileContents);
}

// Get all posts with full content
export function getAllPostsWithContent(): BlogPost[] {
  const fileContents = fs.readFileSync(POSTS_FULL_JSON_PATH, 'utf-8');
  return JSON.parse(fileContents);
}

// Get a single post by slug
export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPostsWithContent();
  return posts.find(post => post.slug === slug) || null;
}

// Get all post slugs (for static paths)
export function getAllPostSlugs(): string[] {
  const posts = getAllPosts();
  return posts.map(post => post.slug);
}

// Get paginated posts
export function getPaginatedPosts(page: number = 1): {
  posts: BlogPost[];
  pagination: BlogPagination;
} {
  const allPosts = getAllPosts();
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, endIndex);

  return {
    posts,
    pagination: {
      currentPage,
      totalPages,
      totalPosts,
      postsPerPage: POSTS_PER_PAGE,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  };
}

// Get posts by category
export function getPostsByCategory(category: string): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter(post =>
    post.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
  );
}

// Get posts by tag
export function getPostsByTag(tag: string): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter(post =>
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

// Get all categories with counts
export function getAllCategories(): BlogCategory[] {
  const posts = getAllPosts();
  const categoryCounts: Record<string, number> = {};

  posts.forEach(post => {
    post.categories.forEach(cat => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
  });

  return Object.entries(categoryCounts)
    .map(([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

// Get all tags with counts
export function getAllTags(): BlogTag[] {
  const posts = getAllPosts();
  const tagCounts: Record<string, number> = {};

  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

// Get recent posts
export function getRecentPosts(limit: number = 5): BlogPost[] {
  const posts = getAllPosts();
  return posts.slice(0, limit);
}

// Get related posts (same category, excluding current)
export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];

  const posts = getAllPosts();
  const relatedPosts = posts
    .filter(post => post.slug !== currentSlug)
    .filter(post =>
      post.categories.some(cat => currentPost.categories.includes(cat))
    )
    .slice(0, limit);

  // If not enough related posts, fill with recent posts
  if (relatedPosts.length < limit) {
    const additionalPosts = posts
      .filter(post => post.slug !== currentSlug && !relatedPosts.includes(post))
      .slice(0, limit - relatedPosts.length);
    return [...relatedPosts, ...additionalPosts];
  }

  return relatedPosts;
}

// Get adjacent posts (prev/next)
export function getAdjacentPosts(currentSlug: string): {
  prev: BlogPost | null;
  next: BlogPost | null;
} {
  const posts = getAllPosts();
  const currentIndex = posts.findIndex(post => post.slug === currentSlug);

  return {
    prev: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    next: currentIndex > 0 ? posts[currentIndex - 1] : null,
  };
}

// Search posts (client-side)
export function searchPosts(query: string): BlogPost[] {
  if (!query.trim()) return [];

  const posts = getAllPosts();
  const lowerQuery = query.toLowerCase();

  return posts.filter(post =>
    post.title.toLowerCase().includes(lowerQuery) ||
    post.excerpt.toLowerCase().includes(lowerQuery) ||
    post.categories.some(cat => cat.toLowerCase().includes(lowerQuery)) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
