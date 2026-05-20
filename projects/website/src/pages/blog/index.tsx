import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/common/SEO";
import BlogCard from "@/components/blog/BlogCard";
import BlogSidebar from "@/components/blog/BlogSidebar";
import {
  getAllPosts,
  getAllCategories,
  getAllTags,
  getRecentPosts,
  getPostsByCategory,
  getPostsByTag,
} from "@/lib/blog";
import { BlogPost, BlogCategory, BlogTag } from "@/types/blog";

interface BlogIndexProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  tags: BlogTag[];
  recentPosts: BlogPost[];
}

export default function BlogIndex({
  posts,
  categories,
  tags,
  recentPosts,
}: BlogIndexProps) {
  const router = useRouter();
  const { category, tag } = router.query;

  // Filter posts based on query params
  let filteredPosts = posts;
  let filterLabel = "";

  if (category && typeof category === "string") {
    filteredPosts = posts.filter((post) =>
      post.categories.some(
        (cat) => cat.toLowerCase() === category.toLowerCase()
      )
    );
    filterLabel = `Category: ${category}`;
  } else if (tag && typeof tag === "string") {
    filteredPosts = posts.filter((post) =>
      post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
    filterLabel = `Tag: ${tag}`;
  }

  const clearFilter = () => {
    router.push("/blog", undefined, { shallow: true });
  };

  return (
    <>
      <SEO
        title="Blog"
        description="Insights on AI automation, growth systems, n8n workflows, and building systems that survive contact with reality."
        url="/blog"
        keywords={["AI automation", "n8n", "growth marketing", "automation"]}
      />

      <Layout header={1} footer={1} video={false}>
        {/* Banner */}
        <section className="blog-banner section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-8 text-center">
                <span className="sub-title">
                  INSIGHTS
                  <span className="icon-wrapper">
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </span>
                <h1 className="title title-anim">Blog</h1>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.7)",
                    marginTop: "20px",
                  }}
                >
                  Thoughts on AI automation, growth systems, and building
                  infrastructure that works.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="section blog-content">
          <div className="container">
            <div className="row">
              {/* Main Content */}
              <div className="col-12 col-lg-8">
                {filterLabel && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "30px",
                      padding: "16px 20px",
                      background: "rgba(0, 255, 255, 0.05)",
                      borderRadius: "8px",
                      border: "1px solid rgba(0, 255, 255, 0.1)",
                    }}
                  >
                    <span style={{ color: "#fff" }}>
                      Filtering by: <strong>{filterLabel}</strong>
                      <span
                        style={{
                          marginLeft: "12px",
                          color: "rgba(255, 255, 255, 0.5)",
                        }}
                      >
                        ({filteredPosts.length} posts)
                      </span>
                    </span>
                    <button
                      onClick={clearFilter}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#00ffff",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      Clear filter
                    </button>
                  </div>
                )}

                {filteredPosts.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "60px 20px",
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    <p>No posts found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="row gaper">
                    {filteredPosts.map((post) => (
                      <div key={post.slug} className="col-12 col-md-6">
                        <BlogCard post={post} />
                      </div>
                    ))}
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
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps<BlogIndexProps> = async () => {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();
  const recentPosts = getRecentPosts(5);

  return {
    props: {
      posts,
      categories,
      tags,
      recentPosts,
    },
  };
};
