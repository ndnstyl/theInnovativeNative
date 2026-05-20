export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  dateFormatted: string;
  author: string;
  excerpt: string;
  content?: string;
  categories: string[];
  tags: string[];
  readingTime: number;
  featuredImage?: string;
  originalUrl?: string;
}

export interface BlogCategory {
  name: string;
  slug: string;
  count: number;
}

export interface BlogTag {
  name: string;
  slug: string;
  count: number;
}

export interface BlogPagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
