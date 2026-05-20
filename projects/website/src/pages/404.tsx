import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function Custom404() {
  return (
    <Layout header={1} footer={1} video={false}>
      <Head>
        <title>Page Not Found | The Innovative Native</title>
        <meta name="robots" content="noindex" />
      </Head>
      <section className="error-page">
        <div className="error-page__content">
          <div className="error-page__code">404</div>
          <h1 className="error-page__title">Page not found</h1>
          <p className="error-page__message">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="error-page__links">
            <Link href="/" className="error-page__link error-page__link--primary">
              Go Home
            </Link>
            <Link href="/classroom" className="error-page__link">
              Classroom
            </Link>
            <Link href="/blog" className="error-page__link">
              Blog
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
