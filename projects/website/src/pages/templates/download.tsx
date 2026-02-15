import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import DownloadButton from '@/components/templates/DownloadButton';
import { getTemplateBySlug, N8nTemplate } from '@/data/templates';

const TemplateDownload = () => {
  const router = useRouter();
  const { template_id, session_id } = router.query;
  const [template, setTemplate] = useState<N8nTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (template_id) {
      const found = getTemplateBySlug(template_id as string);
      if (found) setTemplate(found);
    }
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [template_id]);

  return (
    <>
      <Head>
        <title>Download Your Template | The Innovative Native</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="template-download">
        <div className="template-download__container">
          {isLoading ? (
            <div style={{ padding: '60px 40px', textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48,
                border: '3px solid rgba(0,255,255,0.2)',
                borderTopColor: '#00FFFF',
                borderRadius: '50%',
                margin: '0 auto 20px',
                animation: 'spin 1s linear infinite',
              }} />
              <p style={{ color: '#757575' }}>Preparing your download...</p>
            </div>
          ) : template ? (
            <div className="template-download__content">
              <div className="template-download__icon">
                <i className="fa-solid fa-check"></i>
              </div>
              <h1 className="template-download__title">Thank You!</h1>
              <p className="template-download__subtitle">
                Your purchase of <strong style={{ color: '#fff' }}>{template.title}</strong> is complete.
              </p>

              <DownloadButton jsonFile={template.jsonFile} templateTitle={template.title} />

              <div className="template-download__disclaimers">
                <h4>Before You Import</h4>
                <ul>
                  <li><i className="fa-solid fa-triangle-exclamation"></i> Requires a running n8n instance (self-hosted or cloud)</li>
                  <li><i className="fa-solid fa-triangle-exclamation"></i> You must configure your own API credentials</li>
                  <li><i className="fa-solid fa-triangle-exclamation"></i> This is a workflow template, not a managed service</li>
                  <li><i className="fa-solid fa-triangle-exclamation"></i> Basic n8n knowledge is assumed</li>
                </ul>
              </div>

              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 24, fontSize: 14, color: '#757575' }}>
                <Link href="/templates/terms" style={{ color: '#00FFFF', textDecoration: 'none' }}>Terms of Service</Link>
                <Link href="/templates/refund-policy" style={{ color: '#00FFFF', textDecoration: 'none' }}>Refund Policy</Link>
              </div>

              {session_id && (
                <p style={{ fontSize: 12, color: '#757575', marginTop: 24, fontFamily: 'monospace', opacity: 0.7 }}>
                  Reference: {session_id}
                </p>
              )}

              <div style={{ marginTop: 32 }}>
                <Link href="/templates" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  color: '#00FFFF', textDecoration: 'none', fontSize: 14,
                }}>
                  <i className="fa-solid fa-arrow-left"></i>
                  Browse More Templates
                </Link>
              </div>
            </div>
          ) : (
            <div className="template-download__content">
              <div className="template-download__icon" style={{ background: 'rgba(248,113,113,0.15)', borderColor: '#f87171', color: '#f87171' }}>
                <i className="fa-solid fa-exclamation"></i>
              </div>
              <h1 className="template-download__title">Template Not Found</h1>
              <p className="template-download__subtitle">
                We couldn&apos;t find the template you&apos;re looking for. Please check your purchase confirmation email.
              </p>
              <div style={{ marginTop: 32 }}>
                <Link href="/templates" className="btn btn--primary">
                  Browse Templates
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="template-download__glow"></div>
      </div>

      <style jsx>{`
        .template-download {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, var(--quaternary-color) 0%, var(--black) 100%);
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
        }

        .template-download__container {
          max-width: 600px;
          width: 100%;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .template-download__content {
          background: rgba(14, 14, 14, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 48px 40px;
          backdrop-filter: blur(10px);
        }

        .template-download__icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin: 0 auto 24px;
          font-size: 36px;
          background: rgba(0, 255, 255, 0.15);
          border: 2px solid var(--primary-color);
          color: var(--primary-color);
        }

        .template-download__title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--white);
          margin-bottom: 12px;
        }

        .template-download__subtitle {
          font-size: 1.125rem;
          color: var(--secondary-color);
          margin-bottom: 32px;
          line-height: 1.5;
        }

        .template-download__disclaimers {
          background: rgba(255, 193, 7, 0.05);
          border: 1px solid rgba(255, 193, 7, 0.2);
          border-radius: 12px;
          padding: 24px;
          margin-top: 32px;
          text-align: left;
        }

        .template-download__disclaimers h4 {
          font-size: 14px;
          font-weight: 700;
          color: #ffc107;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
        }

        .template-download__disclaimers ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .template-download__disclaimers li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
        }

        .template-download__disclaimers i {
          color: #ffc107;
          font-size: 16px;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .template-download__glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: rgba(0, 255, 255, 0.1);
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .template-download__content {
            padding: 32px 24px;
          }

          .template-download__title {
            font-size: 1.5rem;
          }

          .template-download__icon {
            width: 64px;
            height: 64px;
            font-size: 28px;
          }
        }
      `}</style>
    </>
  );
};

export default TemplateDownload;
