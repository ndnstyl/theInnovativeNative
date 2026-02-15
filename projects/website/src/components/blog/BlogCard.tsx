import Link from "next/link";
import { BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <article className="blog-card fade-top">
      <Link href={`/blog/${post.slug}`} className="blog-card__link">
        <div className="blog-card__content">
          <div className="blog-card__meta">
            <span className="blog-card__date">{post.dateFormatted}</span>
            <span className="blog-card__divider">|</span>
            <span className="blog-card__reading-time">
              {post.readingTime} min read
            </span>
          </div>

          <h3 className="blog-card__title">{post.title}</h3>

          <p className="blog-card__excerpt">{post.excerpt}</p>

          <div className="blog-card__categories">
            {post.categories.slice(0, 2).map((category, idx) => (
              <span key={idx} className="blog-card__category">
                {category}
              </span>
            ))}
          </div>

          <span className="blog-card__cta">
            Read More <i className="fa-solid fa-arrow-right"></i>
          </span>
        </div>
      </Link>

      <style jsx>{`
        .blog-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          height: 100%;
        }

        .blog-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0, 255, 255, 0.3);
          box-shadow: 0 10px 40px rgba(0, 255, 255, 0.1);
        }

        .blog-card__link {
          display: block;
          text-decoration: none;
          color: inherit;
          height: 100%;
        }

        .blog-card__content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .blog-card__meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 12px;
        }

        .blog-card__divider {
          opacity: 0.3;
        }

        .blog-card__title {
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          line-height: 1.4;
          margin-bottom: 12px;
          transition: color 0.3s ease;
        }

        .blog-card:hover .blog-card__title {
          color: #00ffff;
        }

        .blog-card__excerpt {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 16px;
          flex-grow: 1;
        }

        .blog-card__categories {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }

        .blog-card__category {
          padding: 4px 10px;
          background: rgba(0, 255, 255, 0.1);
          border-radius: 4px;
          font-size: 12px;
          color: #00ffff;
        }

        .blog-card__cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #00ffff;
          transition: gap 0.3s ease;
        }

        .blog-card:hover .blog-card__cta {
          gap: 12px;
        }
      `}</style>
    </article>
  );
};

export default BlogCard;
