export interface N8nTemplate {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  price: {
    suggested: number;
    minimum: number;
    currency: string;
  };
  categories: string[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  images: string[];
  stripeBuyButtonId: string;
  stripePublishableKey: string;
  jsonFile: string;
  walkthrough: {
    overview: string;
    features: string[];
    requirements: string[];
    setupSteps: { title: string; description: string }[];
    useCases: { title: string; description: string }[];
    troubleshooting: { question: string; answer: string }[];
  };
  meta: {
    downloads: number;
    rating: number;
    lastUpdated: string;
    version: string;
  };
}

// Pilot product data
export const templates: N8nTemplate[] = [
  {
    id: 'ultimate-social-scraper',
    slug: 'ultimate-social-scraper',
    title: 'The Ultimate Social Scraper',
    tagline: 'Scrape profiles, posts, and engagement data from major social platforms',
    description: 'A comprehensive n8n workflow that automates social media data collection across multiple platforms. Extract profiles, posts, comments, and engagement metrics with configurable schedules and output formats.',
    price: {
      suggested: 25,
      minimum: 0,
      currency: 'USD',
    },
    categories: ['scraping', 'social-media'],
    tags: ['apify', 'scraping', 'social media', 'data collection', 'automation'],
    difficulty: 'intermediate',
    thumbnail: '/n8n-templates/thumbnails/ultimate-social-scraper.svg',
    images: [
      '/n8n-templates/screenshots/ultimate-social-scraper.png',
    ],
    stripeBuyButtonId: 'buy_btn_1SywSKI4n1kMt7iRH4IIz3Eg',
    stripePublishableKey: '***REDACTED***',
    jsonFile: '/n8n-templates/json/a7f3x9k2-ultimate-social-scraper.json',
    walkthrough: {
      overview: 'The Ultimate Social Scraper is a production-ready n8n workflow designed to extract data from major social media platforms. It handles rate limiting, pagination, and data normalization automatically, so you can focus on analyzing the results rather than wrestling with APIs.',
      features: [
        'Multi-platform support: LinkedIn, Twitter/X, Instagram, Facebook, TikTok',
        'Configurable scraping schedules (hourly, daily, weekly)',
        'Automatic rate limiting and retry logic',
        'Data normalization across platforms',
        'Export to Google Sheets, Airtable, or CSV',
        'Webhook triggers for real-time scraping',
        'Built-in proxy rotation support',
        'Error notifications via Slack or email',
      ],
      requirements: [
        'n8n instance (self-hosted or cloud)',
        'Apify account (free tier works for testing)',
        'Basic understanding of n8n workflows',
        'API credentials for target platforms (where applicable)',
      ],
      setupSteps: [
        {
          title: 'Import the Workflow',
          description: 'Download the JSON file and import it into your n8n instance via Settings → Import Workflow.',
        },
        {
          title: 'Configure Credentials',
          description: 'Set up your Apify API key and any platform-specific credentials in n8n\'s credential manager.',
        },
        {
          title: 'Set Your Targets',
          description: 'Edit the configuration node to specify which profiles, hashtags, or keywords to scrape.',
        },
        {
          title: 'Choose Your Output',
          description: 'Connect your preferred output destination — Google Sheets, Airtable, webhook, or local file.',
        },
        {
          title: 'Activate & Monitor',
          description: 'Turn on the workflow and monitor the first run. Check the execution log for any credential or permission issues.',
        },
      ],
      useCases: [
        {
          title: 'Competitor Analysis',
          description: 'Track competitor social media activity, engagement rates, and content strategy across platforms.',
        },
        {
          title: 'Lead Generation',
          description: 'Build targeted prospect lists from social media profiles matching your ideal customer profile.',
        },
        {
          title: 'Content Research',
          description: 'Discover trending topics, hashtags, and high-performing content formats in your niche.',
        },
        {
          title: 'Brand Monitoring',
          description: 'Track mentions, sentiment, and engagement around your brand or specific keywords.',
        },
      ],
      troubleshooting: [
        {
          question: 'The workflow fails with a 429 error',
          answer: 'This means you\'re hitting rate limits. Increase the delay between requests in the configuration node, or enable proxy rotation.',
        },
        {
          question: 'Apify actors are timing out',
          answer: 'Reduce the number of pages/profiles per run, or increase the actor timeout in the Apify node settings.',
        },
        {
          question: 'Data is missing fields',
          answer: 'Some platforms restrict certain data points. Check the platform\'s API documentation for available fields and ensure your credentials have the necessary permissions.',
        },
        {
          question: 'The schedule trigger isn\'t firing',
          answer: 'Ensure the workflow is activated (not just saved). Check that your n8n instance timezone matches your expected schedule.',
        },
      ],
    },
    meta: {
      downloads: 0,
      rating: 5,
      lastUpdated: '2026-02-09',
      version: '1.0.0',
    },
  },
];

// Helper functions
export function getTemplateBySlug(slug: string): N8nTemplate | undefined {
  return templates.find((t) => t.slug === slug);
}

export function getAllTemplateSlugs(): string[] {
  return templates.map((t) => t.slug);
}

export function getRelatedTemplates(currentSlug: string, limit: number = 3): N8nTemplate[] {
  const current = getTemplateBySlug(currentSlug);
  if (!current) return [];
  return templates
    .filter((t) => t.slug !== currentSlug && t.categories.some((c) => current.categories.includes(c)))
    .slice(0, limit);
}
