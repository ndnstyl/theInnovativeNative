import { GetStaticProps, GetStaticPaths } from "next";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/common/SEO";
import BlogSidebar from "@/components/blog/BlogSidebar";
import ShareButtons from "@/components/blog/ShareButtons";
import {
  getPostBySlug,
  getAllPostSlugs,
  getAllCategories,
  getAllTags,
  getRecentPosts,
  getRelatedPosts,
  getAdjacentPosts,
} from "@/lib/blog";
import { BlogPost, BlogCategory, BlogTag } from "@/types/blog";

interface BlogPostPageProps {
  post: BlogPost;
  categories: BlogCategory[];
  tags: BlogTag[];
  recentPosts: BlogPost[];
  relatedPosts: BlogPost[];
  prevPost: BlogPost | null;
  nextPost: BlogPost | null;
}

export default function BlogPostPage({
  post,
  categories,
  tags,
  recentPosts,
  relatedPosts,
  prevPost,
  nextPost,
}: BlogPostPageProps) {
  const postUrl = `https://theinnovativenative.com/blog/${post.slug}`;

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        type="article"
        publishedTime={post.date}
        author={post.author}
        url={`/blog/${post.slug}`}
        keywords={[...post.categories, ...post.tags]}
      />

      <Layout header={1} footer={1} video={false}>
        {/* Article Header */}
        <section className="section blog-post-header">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-10">
                {/* Breadcrumb */}
                <nav
                  style={{
                    marginBottom: "30px",
                    fontSize: "14px",
                    color: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  <Link
                    href="/blog"
                    style={{ color: "#00ffff", textDecoration: "none" }}
                  >
                    Blog
                  </Link>
                  <span style={{ margin: "0 10px" }}>/</span>
                  <span>{post.categories[0] || "Article"}</span>
                </nav>

                {/* Categories */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  {post.categories.map((category) => (
                    <Link
                      key={category}
                      href={`/blog?category=${encodeURIComponent(category)}`}
                      style={{
                        padding: "6px 14px",
                        background: "rgba(0, 255, 255, 0.1)",
                        borderRadius: "4px",
                        fontSize: "13px",
                        color: "#00ffff",
                        textDecoration: "none",
                      }}
                    >
                      {category}
                    </Link>
                  ))}
                </div>

                {/* Title */}
                <h1
                  style={{
                    fontSize: "clamp(28px, 5vw, 48px)",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    color: "#fff",
                    marginBottom: "24px",
                  }}
                >
                  {post.title}
                </h1>

                {/* Meta */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "20px",
                    color: "rgba(255, 255, 255, 0.6)",
                    fontSize: "14px",
                  }}
                >
                  <span>
                    <i
                      className="fa-regular fa-user"
                      style={{ marginRight: "8px" }}
                    ></i>
                    {post.author}
                  </span>
                  <span>
                    <i
                      className="fa-regular fa-calendar"
                      style={{ marginRight: "8px" }}
                    ></i>
                    {post.dateFormatted}
                  </span>
                  <span>
                    <i
                      className="fa-regular fa-clock"
                      style={{ marginRight: "8px" }}
                    ></i>
                    {post.readingTime} min read
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="section blog-post-content">
          <div className="container">
            <div className="row">
              {/* Main Content */}
              <div className="col-12 col-lg-8">
                <article
                  className="blog-article"
                  dangerouslySetInnerHTML={{ __html: post.content || "" }}
                />

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div
                    style={{
                      marginTop: "40px",
                      paddingTop: "30px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        Tags:
                      </span>
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog?tag=${encodeURIComponent(tag)}`}
                          style={{
                            padding: "4px 12px",
                            background: "rgba(255, 255, 255, 0.05)",
                            borderRadius: "4px",
                            fontSize: "13px",
                            color: "rgba(255, 255, 255, 0.7)",
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share */}
                <div
                  style={{
                    marginTop: "30px",
                    paddingTop: "30px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <ShareButtons url={postUrl} title={post.title} />
                </div>

                {/* Previous/Next Navigation */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    marginTop: "40px",
                    paddingTop: "40px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {prevPost ? (
                    <Link
                      href={`/blog/${prevPost.slug}`}
                      style={{
                        padding: "20px",
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: "8px",
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          color: "rgba(255, 255, 255, 0.5)",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        <i
                          className="fa-solid fa-arrow-left"
                          style={{ marginRight: "6px" }}
                        ></i>
                        Previous
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#fff",
                          lineHeight: 1.4,
                        }}
                      >
                        {prevPost.title}
                      </span>
                    </Link>
                  ) : (
                    <div></div>
                  )}

                  {nextPost ? (
                    <Link
                      href={`/blog/${nextPost.slug}`}
                      style={{
                        padding: "20px",
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: "8px",
                        textDecoration: "none",
                        textAlign: "right",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          color: "rgba(255, 255, 255, 0.5)",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        Next
                        <i
                          className="fa-solid fa-arrow-right"
                          style={{ marginLeft: "6px" }}
                        ></i>
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#fff",
                          lineHeight: 1.4,
                        }}
                      >
                        {nextPost.title}
                      </span>
                    </Link>
                  ) : (
                    <div></div>
                  )}
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div style={{ marginTop: "60px" }}>
                    <h3
                      style={{
                        fontSize: "24px",
                        fontWeight: 600,
                        color: "#fff",
                        marginBottom: "30px",
                      }}
                    >
                      Related Articles
                    </h3>
                    <div className="row gaper">
                      {relatedPosts.map((relatedPost) => (
                        <div
                          key={relatedPost.slug}
                          className="col-12 col-md-4"
                        >
                          <Link
                            href={`/blog/${relatedPost.slug}`}
                            style={{
                              display: "block",
                              padding: "20px",
                              background: "rgba(255, 255, 255, 0.02)",
                              borderRadius: "8px",
                              textDecoration: "none",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                              transition: "all 0.2s ease",
                              height: "100%",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "12px",
                                color: "rgba(255, 255, 255, 0.5)",
                                display: "block",
                                marginBottom: "8px",
                              }}
                            >
                              {relatedPost.dateFormatted}
                            </span>
                            <span
                              style={{
                                fontSize: "15px",
                                fontWeight: 500,
                                color: "#fff",
                                lineHeight: 1.4,
                              }}
                            >
                              {relatedPost.title}
                            </span>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="col-12 col-lg-4">
                <BlogSidebar
                  categories={categories}
                  tags={tags}
                  recentPosts={recentPosts}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Article Styles */}
        <style jsx global>{`
          .blog-article {
            color: rgba(255, 255, 255, 0.85);
            font-size: 17px;
            line-height: 1.8;
          }

          .blog-article h1,
          .blog-article h2,
          .blog-article h3,
          .blog-article h4,
          .blog-article h5,
          .blog-article h6 {
            color: #fff;
            font-weight: 600;
            margin-top: 40px;
            margin-bottom: 20px;
            line-height: 1.3;
          }

          .blog-article h2 {
            font-size: 28px;
          }

          .blog-article h3 {
            font-size: 24px;
          }

          .blog-article h4 {
            font-size: 20px;
          }

          .blog-article p {
            margin-bottom: 20px;
          }

          .blog-article a {
            color: #00ffff;
            text-decoration: none;
            border-bottom: 1px solid rgba(0, 255, 255, 0.3);
            transition: border-color 0.2s ease;
          }

          .blog-article a:hover {
            border-color: #00ffff;
          }

          .blog-article ul,
          .blog-article ol {
            margin-bottom: 20px;
            padding-left: 24px;
          }

          .blog-article li {
            margin-bottom: 10px;
          }

          .blog-article blockquote {
            margin: 30px 0;
            padding: 20px 30px;
            background: rgba(0, 255, 255, 0.05);
            border-left: 4px solid #00ffff;
            border-radius: 0 8px 8px 0;
            font-style: italic;
            color: rgba(255, 255, 255, 0.9);
          }

          .blog-article hr {
            margin: 40px 0;
            border: none;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .blog-article strong {
            color: #fff;
            font-weight: 600;
          }

          .blog-article code {
            background: rgba(255, 255, 255, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.9em;
          }

          .blog-article pre {
            background: rgba(0, 0, 0, 0.3);
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin-bottom: 20px;
          }

          .blog-article pre code {
            background: none;
            padding: 0;
          }

          .blog-article img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 20px 0;
          }
        `}</style>
      </Layout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllPostSlugs();

  return {
    paths: slugs.map((slug) => ({
      params: { slug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({
  params,
}) => {
  const slug = params?.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  const categories = getAllCategories();
  const tags = getAllTags();
  const recentPosts = getRecentPosts(5);
  const relatedPosts = getRelatedPosts(slug, 3);
  const { prev, next } = getAdjacentPosts(slug);

  return {
    props: {
      post,
      categories,
      tags,
      recentPosts,
      relatedPosts,
      prevPost: prev,
      nextPost: next,
    },
  };
};
