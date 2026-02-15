import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import TemplateSidebar from '@/components/templates/TemplateSidebar';
import TemplateWalkthrough from '@/components/templates/TemplateWalkthrough';
import RelatedTemplates from '@/components/templates/RelatedTemplates';
import StripeBuyButton from '@/components/templates/StripeBuyButton';
import { N8nTemplate, getTemplateBySlug, getAllTemplateSlugs, getRelatedTemplates } from '@/data/templates';

interface TemplateDetailProps {
  template: N8nTemplate;
  relatedTemplates: N8nTemplate[];
}

export default function TemplateDetailPage({ template, relatedTemplates }: TemplateDetailProps) {
  const priceDisplay = template.price.minimum === 0 ? 'Pay what you want' : `$${template.price.suggested}`;

  return (
    <>
      <Head>
        <title>{template.title} | n8n Templates | The Innovative Native</title>
        <meta name="description" content={template.description} />
        <meta property="og:title" content={`${template.title} - n8n Workflow Template`} />
        <meta property="og:description" content={template.tagline} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://theinnovativenative.com/templates/${template.slug}`} />
        <meta property="product:price:amount" content={String(template.price.suggested)} />
        <meta property="product:price:currency" content={template.price.currency} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareSourceCode",
          "name": template.title,
          "description": template.description,
          "programmingLanguage": "n8n Workflow JSON",
          "codeRepository": "https://theinnovativenative.com/templates",
          "offers": {
            "@type": "Offer",
            "price": template.price.suggested,
            "priceCurrency": template.price.currency,
            "availability": "https://schema.org/InStock",
          },
          "author": {
            "@type": "Person",
            "name": "Michael Soto",
          },
        }) }} />
      </Head>
      <Layout header={1} footer={1} video={false}>
        <section className="template-detail">
          <div className="container">
            <div className="template-detail__layout">
              <div className="template-detail__main">
                <div className="template-hero">
                  <nav className="template-hero__breadcrumb">
                    <Link href="/templates">Templates</Link>
                    <span style={{ margin: '0 10px' }}>/</span>
                    <span>{template.title}</span>
                  </nav>
                  <div className="template-hero__categories">
                    {template.categories.map((cat) => (
                      <span key={cat} className="template-card__category">
                        {cat.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                  <h1 className="template-hero__title">{template.title}</h1>
                  <p className="template-hero__tagline">{template.tagline}</p>
                  <div className="template-hero__meta">
                    <span className="template-hero__meta-item">
                      <i className="fa-solid fa-code-branch"></i>
                      v{template.meta.version}
                    </span>
                    <span className="template-hero__meta-item">
                      <i className="fa-solid fa-calendar"></i>
                      Updated {template.meta.lastUpdated}
                    </span>
                    <span className="template-hero__meta-item">
                      <i className="fa-solid fa-signal"></i>
                      {template.difficulty}
                    </span>
                  </div>
                </div>

                {/* Workflow Screenshot */}
                {template.images.length > 0 && (
                  <div className="template-screenshots">
                    <h2 className="template-screenshots__title">Workflow Preview</h2>
                    <div className="template-screenshots__grid">
                      {template.images.map((img, i) => (
                        <div key={i} className="template-screenshots__item">
                          <img src={img} alt={`${template.title} - Preview ${i + 1}`} loading="lazy" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <TemplateWalkthrough template={template} />
                <RelatedTemplates templates={relatedTemplates} />
              </div>

              <TemplateSidebar template={template} />
            </div>
          </div>
        </section>

        <div className="template-mobile-bar">
          <div className="template-mobile-bar__inner">
            <span className="template-mobile-bar__price">
              {priceDisplay}
            </span>
            <StripeBuyButton
              buyButtonId={template.stripeBuyButtonId}
              publishableKey={template.stripePublishableKey}
            />
          </div>
        </div>

        <style jsx>{`
          .template-detail {
            padding: 180px 0 80px;
          }

          .template-detail__layout {
            display: grid;
            grid-template-columns: 1fr 380px;
            gap: 48px;
            align-items: start;
          }

          .template-detail__main {
            min-width: 0;
          }

          .template-hero {
            margin-bottom: 48px;
          }

          .template-hero__breadcrumb {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.5);
            margin-bottom: 20px;
          }

          .template-hero__breadcrumb a {
            color: var(--primary-color);
            text-decoration: none;
            transition: opacity 0.2s;
          }

          .template-hero__breadcrumb a:hover {
            opacity: 0.8;
          }

          .template-hero__categories {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 16px;
          }

          .template-card__category {
            padding: 6px 12px;
            background: rgba(0, 255, 255, 0.1);
            border-radius: 4px;
            font-size: 12px;
            color: var(--primary-color);
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .template-hero__title {
            font-size: clamp(28px, 5vw, 42px);
            font-weight: 800;
            color: var(--white);
            margin-bottom: 16px;
            line-height: 1.2;
          }

          .template-hero__tagline {
            font-size: 18px;
            color: var(--secondary-color);
            margin-bottom: 24px;
            line-height: 1.6;
          }

          .template-hero__meta {
            display: flex;
            gap: 24px;
            flex-wrap: wrap;
          }

          .template-hero__meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
          }

          .template-hero__meta-item i {
            color: var(--primary-color);
          }

          .template-mobile-bar {
            display: none;
          }

          @media (max-width: 1024px) {
            .template-detail__layout {
              grid-template-columns: 1fr;
              gap: 32px;
            }

            .template-mobile-bar {
              display: block;
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              background: rgba(14, 14, 14, 0.95);
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              padding: 16px;
              z-index: 100;
              backdrop-filter: blur(10px);
            }

            .template-mobile-bar__inner {
              max-width: 1200px;
              margin: 0 auto;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 16px;
            }

            .template-mobile-bar__price {
              font-size: 18px;
              font-weight: 700;
              color: var(--primary-color);
            }
          }

          @media (max-width: 768px) {
            .template-detail {
              padding: 140px 0 100px;
            }

            .template-hero__meta {
              gap: 16px;
            }
          }
        `}</style>
      </Layout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllTemplateSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<TemplateDetailProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const template = getTemplateBySlug(slug);
  if (!template) return { notFound: true };
  const related = getRelatedTemplates(slug, 3);
  return { props: { template, relatedTemplates: related } };
};
