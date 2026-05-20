#!/usr/bin/env node
/**
 * Regenerates content/blog/posts.json (index) + posts-full.json (with content)
 * from the markdown files in content/blog/posts/.
 *
 * Runs as a prebuild step so the website always reflects the current posts on disk.
 * The upstream n8n workflow (SEO - Blog to GitHub, id 35okkSwMNRTfOkkL) commits
 * new markdown files to main — CI then rebuilds and this script picks them up.
 *
 * No runtime deps (project static-export constraint): hand-rolled frontmatter parser.
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const POSTS_DIR = path.join(__dirname, '..', 'content', 'blog', 'posts');
const OUT_INDEX = path.join(__dirname, '..', 'content', 'blog', 'posts.json');
const OUT_FULL = path.join(__dirname, '..', 'content', 'blog', 'posts-full.json');
const WPM = 200;

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
  if (!match) throw new Error('No frontmatter block found');
  const fmRaw = match[1];
  const content = match[2];
  const fm = {};
  for (const line of fmRaw.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const m = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    } else if (val.startsWith('[') && val.endsWith(']')) {
      try { val = JSON.parse(val); } catch { val = []; }
    } else if (/^-?\d+$/.test(val)) {
      val = parseInt(val, 10);
    } else if (val === 'true' || val === 'false') {
      val = val === 'true';
    }
    fm[key] = val;
  }
  return { fm, content };
}

function computeReadingTime(htmlContent) {
  const text = String(htmlContent || '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / WPM));
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`[build-posts-json] Posts directory not found: ${POSTS_DIR}`);
    process.exit(1);
  }
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md')).sort();
  const records = [];
  const skipped = [];

  for (const file of files) {
    const fullPath = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(fullPath, 'utf-8');
    let parsed;
    try {
      parsed = parseFrontmatter(raw);
    } catch (e) {
      skipped.push({ file, reason: e.message });
      continue;
    }
    const { fm, content } = parsed;
    const slug = fm.slug || file.replace(/\.md$/, '');
    const readingTime = computeReadingTime(content);
    const date = fm.date || new Date().toISOString();
    const htmlContent = marked.parse(content.trim(), { breaks: true, gfm: true });
    records.push({
      title: fm.title || slug,
      slug,
      date,
      dateFormatted: fm.dateFormatted || formatDate(date),
      author: fm.author || 'Mike Soto',
      excerpt: fm.excerpt || '',
      categories: Array.isArray(fm.categories) ? fm.categories : [],
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      readingTime,
      content: htmlContent,
    });
  }

  records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  records.forEach((r, i) => { r.id = i + 1; });

  const indexOrdered = records.map(r => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    date: r.date,
    dateFormatted: r.dateFormatted,
    author: r.author,
    excerpt: r.excerpt,
    categories: r.categories,
    tags: r.tags,
    readingTime: r.readingTime,
  }));
  const fullOrdered = records.map(r => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    date: r.date,
    dateFormatted: r.dateFormatted,
    author: r.author,
    excerpt: r.excerpt,
    categories: r.categories,
    tags: r.tags,
    readingTime: r.readingTime,
    content: r.content,
  }));

  fs.writeFileSync(OUT_INDEX, JSON.stringify(indexOrdered, null, 2) + '\n');
  fs.writeFileSync(OUT_FULL, JSON.stringify(fullOrdered, null, 2) + '\n');

  const zeroRT = records.filter(r => r.readingTime === 0).length;
  const emptyCats = records.filter(r => r.categories.length === 0).length;

  console.log(`[build-posts-json] ${records.length} posts written (skipped: ${skipped.length})`);
  if (skipped.length) console.log(`[build-posts-json] skipped:`, skipped);
  if (zeroRT) console.warn(`[build-posts-json] WARN: ${zeroRT} posts have readingTime=0 (content missing?)`);
  if (emptyCats) console.warn(`[build-posts-json] WARN: ${emptyCats} posts have no categories (frontmatter missing?)`);

  if (records.length === 0) process.exit(1);
}

main();
