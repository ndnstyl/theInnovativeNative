/**
 * WordPress XML Parser
 *
 * Parses WordPress export XML and converts to JSON + Markdown files.
 *
 * Usage: node scripts/parse-wordpress-xml.js
 */

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Configuration
const XML_PATH = path.join(__dirname, '../blog/buildmytribeai.WordPress.2026-02-02.xml');
const OUTPUT_JSON = path.join(__dirname, '../content/blog/posts.json');
const OUTPUT_DIR = path.join(__dirname, '../content/blog/posts');

// Helper: Strip WordPress Gutenberg block comments
function stripGutenbergBlocks(content) {
  if (!content) return '';

  // Remove block comments like <!-- wp:paragraph --> and <!-- /wp:paragraph -->
  let cleaned = content.replace(/<!--\s*\/?wp:[^>]+-->/g, '');

  // Remove empty paragraphs
  cleaned = cleaned.replace(/<p>\s*<\/p>/g, '');

  // Clean up extra whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

// Helper: Extract text content for excerpt
function extractExcerpt(content, maxLength = 160) {
  if (!content) return '';

  // Strip HTML tags
  const text = content.replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) return text;

  // Truncate at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}

// Helper: Calculate reading time
function calculateReadingTime(content) {
  if (!content) return 1;

  const text = content.replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(w => w.length > 0).length;
  const minutes = Math.ceil(words / 200); // Average reading speed
  return Math.max(1, minutes);
}

// Helper: Format date
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Helper: Extract slug from URL
function extractSlug(url) {
  if (!url) return '';
  const match = url.match(/\/([^\/]+)\/?$/);
  return match ? match[1] : '';
}

// Helper: Get CDATA content
function getCDATA(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value[0] || '';
  return '';
}

// Parse WordPress XML
async function parseWordPressXML() {
  console.log('Reading WordPress XML...');
  const xmlContent = fs.readFileSync(XML_PATH, 'utf-8');

  console.log('Parsing XML...');
  const parser = new xml2js.Parser({
    explicitArray: false,
    mergeAttrs: true
  });

  const result = await parser.parseStringPromise(xmlContent);
  const channel = result.rss.channel;
  const items = Array.isArray(channel.item) ? channel.item : [channel.item];

  console.log(`Found ${items.length} items in XML`);

  // Filter to only published posts
  const posts = items.filter(item => {
    const postType = getCDATA(item['wp:post_type']);
    const status = getCDATA(item['wp:status']);
    return postType === 'post' && status === 'publish';
  });

  console.log(`Found ${posts.length} published posts`);

  // Process each post
  const processedPosts = posts.map((item, index) => {
    const title = getCDATA(item.title);
    const link = getCDATA(item.link);
    const slug = getCDATA(item['wp:post_name']) || extractSlug(link);
    const pubDate = getCDATA(item.pubDate);
    const content = getCDATA(item['content:encoded']);
    const author = getCDATA(item['dc:creator']);

    // Extract categories and tags
    const categories = [];
    const tags = [];

    if (item.category) {
      const cats = Array.isArray(item.category) ? item.category : [item.category];
      cats.forEach(cat => {
        const name = getCDATA(cat._) || getCDATA(cat);
        const domain = cat.domain;

        if (domain === 'category' && name && !categories.includes(name)) {
          categories.push(name);
        } else if (domain === 'post_tag' && name && !tags.includes(name)) {
          tags.push(name);
        }
      });
    }

    // Clean content
    const cleanedContent = stripGutenbergBlocks(content);

    return {
      id: index + 1,
      title,
      slug,
      date: new Date(pubDate).toISOString(),
      dateFormatted: formatDate(pubDate),
      author: author === 'ndnstyl' ? 'Mike Soto' : author,
      excerpt: extractExcerpt(cleanedContent),
      content: cleanedContent,
      categories,
      tags,
      readingTime: calculateReadingTime(cleanedContent),
      originalUrl: link.replace('buildmytribe.ai', 'theinnovativenative.com'),
    };
  });

  // Sort by date (newest first)
  processedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return processedPosts;
}

// Generate JSON index
function generateJSON(posts) {
  // Create index without full content (for listing pages)
  const index = posts.map(({ content, ...rest }) => rest);

  const outputDir = path.dirname(OUTPUT_JSON);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(index, null, 2));
  console.log(`Generated: ${OUTPUT_JSON}`);

  // Also save full posts for reference
  const fullPath = OUTPUT_JSON.replace('.json', '-full.json');
  fs.writeFileSync(fullPath, JSON.stringify(posts, null, 2));
  console.log(`Generated: ${fullPath}`);
}

// Generate individual Markdown files
function generateMarkdownFiles(posts) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  posts.forEach(post => {
    const frontmatter = `---
title: "${post.title.replace(/"/g, '\\"')}"
slug: "${post.slug}"
date: "${post.date}"
dateFormatted: "${post.dateFormatted}"
author: "${post.author}"
excerpt: "${post.excerpt.replace(/"/g, '\\"')}"
categories: ${JSON.stringify(post.categories)}
tags: ${JSON.stringify(post.tags)}
readingTime: ${post.readingTime}
---

${post.content}
`;

    const filePath = path.join(OUTPUT_DIR, `${post.slug}.md`);
    fs.writeFileSync(filePath, frontmatter);
    console.log(`Generated: ${filePath}`);
  });
}

// Generate redirect rules
function generateRedirects(posts) {
  const redirects = posts.map(post => {
    // Old URL: buildmytribe.ai/slug/
    // New URL: theinnovativenative.com/blog/slug
    return `RewriteRule ^${post.slug}/?$ /blog/${post.slug} [R=301,L]`;
  });

  const htaccessContent = `# WordPress to Next.js Blog Redirects
# Generated: ${new Date().toISOString()}
# Old domain: buildmytribe.ai
# New domain: theinnovativenative.com

RewriteEngine On

# Redirect old domain to new domain
RewriteCond %{HTTP_HOST} ^buildmytribe\\.ai$ [NC]
RewriteRule ^(.*)$ https://theinnovativenative.com/$1 [R=301,L]

# Redirect old blog post URLs to new /blog/ path
${redirects.join('\n')}
`;

  const htaccessPath = path.join(__dirname, '../public/.htaccess-redirects');
  fs.writeFileSync(htaccessPath, htaccessContent);
  console.log(`Generated redirect rules: ${htaccessPath}`);
}

// Main
async function main() {
  try {
    console.log('Starting WordPress XML parser...\n');

    const posts = await parseWordPressXML();

    console.log('\nGenerating output files...');
    generateJSON(posts);
    generateMarkdownFiles(posts);
    generateRedirects(posts);

    console.log('\n✓ Done!');
    console.log(`\nSummary:`);
    console.log(`- ${posts.length} blog posts processed`);
    console.log(`- Categories: ${[...new Set(posts.flatMap(p => p.categories))].join(', ')}`);
    console.log(`- Tags: ${[...new Set(posts.flatMap(p => p.tags))].slice(0, 10).join(', ')}...`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
