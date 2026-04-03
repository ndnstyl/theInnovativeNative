import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ClassroomLayout from '@/components/layout/ClassroomLayout';

const pageTitle = 'About | BuildMyTribe.AI';
const pageDescription =
  'AI automation community for entrepreneurs who want systems, not hype. Free and paid courses, community feed, and 1:1 coaching from Mike Soto.';

const AboutPage = () => {
  return (
    <ClassroomLayout title="About">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href="https://theinnovativenative.com/about" />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="https://theinnovativenative.com/images/og-default.jpg" />
        <meta property="og:url" content="https://theinnovativenative.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Innovative Native" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://theinnovativenative.com/images/og-default.jpg" />
      </Head>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px' }}>
        {/* Hero */}
        <section style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
            BuildMyTribe.AI
          </h1>
          <p style={{ fontSize: 18, color: '#00FFFF', fontWeight: 500, marginBottom: 16 }}>
            Where builders trade chaos for clarity.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#ccc' }}>
            An AI automation community for entrepreneurs who want systems, not hype.
            No fluff courses. No motivational padding. Just the workflows, templates,
            and thinking models that actually move the needle.
          </p>
        </section>

        {/* What You Get */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
            What You Get
          </h2>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#00FFFF', marginBottom: 6 }}>
              Free Courses
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, color: '#ccc', lineHeight: 1.8 }}>
              <li><strong>Brand Vibe</strong> &mdash; Find your voice and build a brand that doesn&apos;t sound like everyone else.</li>
              <li><strong>AI Glossary</strong> &mdash; Plain-language reference for every term you&apos;ll hit in this space.</li>
            </ul>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#00FFFF', marginBottom: 6 }}>
              Paid Courses ($99/ea)
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, color: '#ccc', lineHeight: 1.8 }}>
              <li><strong>Chaos to Clarity</strong> &mdash; Turn scattered ops into repeatable systems in a weekend.</li>
              <li><strong>n8n Templates</strong> &mdash; Production-ready automation workflows you can deploy today.</li>
              <li><strong>YouTube Workflows</strong> &mdash; End-to-end system for consistent publishing without burnout.</li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#00FFFF', marginBottom: 6 }}>
              Community + Coaching
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, color: '#ccc', lineHeight: 1.8 }}>
              <li><strong>Community Feed</strong> &mdash; Ask questions, share wins, get feedback from builders doing the same work.</li>
              <li><strong>1:1 Coaching</strong> &mdash; Direct access to Mike for system audits and growth strategy ($99).</li>
            </ul>
          </div>
        </section>

        {/* About Mike */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>
            About Mike Soto
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#ccc', marginBottom: 12 }}>
            Growth strategist based in Las Vegas. 20 years of pattern recognition
            across marketing, operations, and technology. AI-first systems builder.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#ccc', marginBottom: 12 }}>
            I build systems that survive contact with reality. Most teams don&apos;t
            need more effort &mdash; they need less guessing. That&apos;s what this
            community is for.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#ccc' }}>
            Everything here is built on the same tools and workflows I use daily.
            Nothing theoretical. If it&apos;s in a course, it&apos;s running in
            production somewhere.
          </p>
        </section>

        {/* CTA */}
        <section
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            paddingTop: 16,
            borderTop: '1px solid #333',
          }}
        >
          <Link
            href="/auth/invite"
            className="btn btn--primary"
            style={{ fontSize: 15, padding: '12px 28px' }}
          >
            Join Free
          </Link>
          <Link
            href="/classroom"
            className="btn btn--secondary"
            style={{ fontSize: 15, padding: '12px 28px' }}
          >
            Browse Courses
          </Link>
        </section>
      </div>
    </ClassroomLayout>
  );
};

export default AboutPage;
