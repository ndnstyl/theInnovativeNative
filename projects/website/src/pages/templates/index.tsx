import { GetStaticProps } from 'next';
import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/layout/Layout';
import TemplateCard from '@/components/templates/TemplateCard';
import CategoryFilter from '@/components/templates/CategoryFilter';
import { templates, N8nTemplate } from '@/data/templates';
import { templateCategories, TemplateCategory } from '@/data/template-categories';

interface TemplatesPageProps {
  allTemplates: N8nTemplate[];
  categories: TemplateCategory[];
}

export default function TemplatesPage({ allTemplates, categories }: TemplatesPageProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const filteredTemplates = activeCategory === 'all'
    ? allTemplates
    : allTemplates.filter(t => t.categories.includes(activeCategory));

  return (
    <>
      <Head>
        <title>n8n Workflow Templates | The Innovative Native</title>
        <meta name="description" content="Production-ready n8n workflow templates. Scraping, lead generation, AI automation, and more. Import, configure, deploy." />
        <meta property="og:title" content="n8n Workflow Templates | The Innovative Native" />
        <meta property="og:description" content="Production-ready n8n workflow templates for automation professionals." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://theinnovativenative.com/templates" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "n8n Workflow Templates",
          "description": "Production-ready n8n workflow templates",
          "url": "https://theinnovativenative.com/templates",
          "numberOfItems": allTemplates.length,
        }) }} />
      </Head>
      <Layout header={1} footer={1} video={false}>
        <section className="templates-hero">
          <div className="container">
            <div className="templates-hero__content">
              <h1 className="templates-hero__title">n8n Workflow Templates</h1>
              <p className="templates-hero__subtitle">
                Production-ready automation workflows. Import, configure, and deploy.
              </p>
              <div className="templates-hero__stats">
                <div className="templates-hero__stat">
                  <span className="templates-hero__stat-number">{allTemplates.length}</span>
                  <span className="templates-hero__stat-label">Templates</span>
                </div>
                <div className="templates-hero__stat">
                  <span className="templates-hero__stat-number">{categories.length - 1}</span>
                  <span className="templates-hero__stat-label">Categories</span>
                </div>
                <div className="templates-hero__stat">
                  <span className="templates-hero__stat-number">$0</span>
                  <span className="templates-hero__stat-label">Minimum Price</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            <div className="template-grid" style={{ marginTop: 32 }}>
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))
              ) : (
                <div className="template-grid__empty">
                  <i className="fa-solid fa-box-open" style={{ fontSize: 48, marginBottom: 16, display: 'block', opacity: 0.3 }}></i>
                  <p>No templates found in this category yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <style jsx>{`
          .templates-hero {
            padding: 180px 0 60px;
            background: linear-gradient(180deg, rgba(0, 255, 255, 0.05) 0%, transparent 100%);
          }

          .templates-hero__content {
            text-align: center;
            max-width: 800px;
            margin: 0 auto;
          }

          .templates-hero__title {
            font-size: clamp(32px, 5vw, 56px);
            font-weight: 800;
            color: var(--white);
            margin-bottom: 16px;
            line-height: 1.1;
          }

          .templates-hero__subtitle {
            font-size: clamp(16px, 3vw, 20px);
            color: var(--secondary-color);
            margin-bottom: 40px;
            line-height: 1.5;
          }

          .templates-hero__stats {
            display: flex;
            justify-content: center;
            gap: 48px;
            flex-wrap: wrap;
          }

          .templates-hero__stat {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }

          .templates-hero__stat-number {
            font-size: 36px;
            font-weight: 800;
            color: var(--primary-color);
            line-height: 1;
          }

          .templates-hero__stat-label {
            font-size: 14px;
            color: var(--secondary-color);
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .template-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 24px;
          }

          .template-grid__empty {
            grid-column: 1 / -1;
            padding: 80px 20px;
            text-align: center;
            color: var(--secondary-color);
          }

          @media (max-width: 768px) {
            .templates-hero {
              padding: 140px 0 40px;
            }

            .templates-hero__stats {
              gap: 32px;
            }

            .template-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps<TemplatesPageProps> = async () => {
  return {
    props: {
      allTemplates: templates,
      categories: templateCategories,
    },
  };
};
