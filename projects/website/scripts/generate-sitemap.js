/**
 * Static sitemap generator for theinnovativenative.com
 * Run: node scripts/generate-sitemap.js
 * Outputs: public/sitemap.xml
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://theinnovativenative.com';
const TODAY = new Date().toISOString().split('T')[0];

// Public pages with their priorities and change frequencies
const pages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/law-firm-rag', priority: '0.9', changefreq: 'monthly' },
  { path: '/haven-blueprint', priority: '0.9', changefreq: 'monthly' },
  { path: '/visionspark-re', priority: '0.9', changefreq: 'monthly' },
  { path: '/portfolio', priority: '0.7', changefreq: 'monthly' },
  { path: '/professionalExperience', priority: '0.6', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/templates', priority: '0.7', changefreq: 'monthly' },
  { path: '/community', priority: '0.7', changefreq: 'daily' },
  { path: '/members', priority: '0.5', changefreq: 'weekly' },
  { path: '/community/calendar', priority: '0.6', changefreq: 'weekly' },
  { path: '/community/leaderboard', priority: '0.5', changefreq: 'daily' },
];

// Scan blog posts directory for dynamic routes
const blogDir = path.join(__dirname, '..', 'src', 'data', 'blogs');
if (fs.existsSync(blogDir)) {
  const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.ts') || f.endsWith('.json'));
  // Blog slugs are handled by getStaticPaths — they'll be in the build output
}

function generateSitemap() {
  const urls = pages.map(page => `
  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`;

  const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(outPath, sitemap.trim());
  console.log(`Sitemap generated: ${outPath} (${pages.length} URLs)`);
}

generateSitemap();
