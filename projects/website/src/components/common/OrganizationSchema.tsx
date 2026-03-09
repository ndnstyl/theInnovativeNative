import React from 'react';
import Head from 'next/head';

const SITE_URL = 'https://theinnovativenative.com';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The Innovative Native',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  description: 'AI systems consulting — we build and deploy AI infrastructure that replaces fragmented SaaS stacks.',
  founder: {
    '@type': 'Person',
    name: 'Mike Soto',
    jobTitle: 'AI Systems Builder',
    url: `${SITE_URL}/professionalExperience`,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    url: SITE_URL,
  },
  sameAs: [],
  areaServed: 'US',
  knowsAbout: [
    'AI Systems Integration',
    'n8n Workflow Automation',
    'Business Process Automation',
    'AI Consulting',
  ],
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Mike Soto',
  jobTitle: 'AI Systems Builder',
  url: `${SITE_URL}/professionalExperience`,
  worksFor: {
    '@type': 'Organization',
    name: 'The Innovative Native',
  },
  knowsAbout: [
    'AI Systems',
    'n8n Automation',
    'Business Process Engineering',
    'AI Infrastructure Deployment',
  ],
};

const OrganizationSchema: React.FC = () => (
  <Head>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  </Head>
);

export default OrganizationSchema;
