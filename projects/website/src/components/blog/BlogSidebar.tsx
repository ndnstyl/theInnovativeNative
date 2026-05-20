import Link from "next/link";
import { BlogPost, BlogCategory, BlogTag } from "@/types/blog";

interface BlogSidebarProps {
  categories: BlogCategory[];
  tags: BlogTag[];
  recentPosts: BlogPost[];
}

const BlogSidebar = ({ categories, tags, recentPosts }: BlogSidebarProps) => {
  return (
    <aside className="blog-sidebar">
      {/* Categories */}
      <div className="sidebar-widget">
        <h4 className="sidebar-widget__title">Categories</h4>
        <ul className="sidebar-widget__list">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/blog?category=${encodeURIComponent(category.name)}`}
                className="sidebar-widget__link"
              >
                <span>{category.name}</span>
                <span className="count">({category.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts */}
      <div className="sidebar-widget">
        <h4 className="sidebar-widget__title">Recent Posts</h4>
        <ul className="sidebar-widget__posts">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="recent-post">
                <span className="recent-post__title">{post.title}</span>
                <span className="recent-post__date">{post.dateFormatted}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div className="sidebar-widget">
        <h4 className="sidebar-widget__title">Topics</h4>
        <div className="sidebar-widget__tags">
          {tags.slice(0, 15).map((tag) => (
            <Link
              key={tag.slug}
              href={`/blog?tag=${encodeURIComponent(tag.name)}`}
              className="tag"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .blog-sidebar {
          position: sticky;
          top: 100px;
        }

        .sidebar-widget {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .sidebar-widget__title {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar-widget__list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-widget__list li {
          margin-bottom: 8px;
        }

        .sidebar-widget__list li:last-child {
          margin-bottom: 0;
        }

        .sidebar-widget__link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .sidebar-widget__link:hover {
          background: rgba(0, 255, 255, 0.1);
          color: #00ffff;
        }

        .sidebar-widget__link .count {
          font-size: 12px;
          opacity: 0.6;
        }

        .sidebar-widget__posts {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .sidebar-widget__posts li {
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .sidebar-widget__posts li:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .recent-post {
          display: block;
          text-decoration: none;
        }

        .recent-post__title {
          display: block;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.4;
          margin-bottom: 4px;
          transition: color 0.2s ease;
        }

        .recent-post:hover .recent-post__title {
          color: #00ffff;
        }

        .recent-post__date {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .sidebar-widget__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .tag:hover {
          background: rgba(0, 255, 255, 0.1);
          color: #00ffff;
        }
      `}</style>
    </aside>
  );
};

export default BlogSidebar;
