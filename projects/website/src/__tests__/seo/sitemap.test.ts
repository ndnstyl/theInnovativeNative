import * as fs from 'fs';
import * as path from 'path';

const PUBLIC_DIR = path.resolve(__dirname, '../../../public');

describe('sitemap.xml', () => {
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  let sitemapContent: string;

  beforeAll(() => {
    sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  });

  it('exists in public/', () => {
    expect(fs.existsSync(sitemapPath)).toBe(true);
  });

  it('is valid XML with urlset root element', () => {
    expect(sitemapContent).toMatch(/^<\?xml version="1\.0"/);
    expect(sitemapContent).toContain('<urlset');
    expect(sitemapContent).toContain('</urlset>');
  });

  it('uses the correct domain', () => {
    expect(sitemapContent).toContain('https://theinnovativenative.com');
    expect(sitemapContent).not.toContain('http://localhost');
  });

  // Required public pages
  const requiredPublicPages = [
    '/',
    '/classroom',
    '/community',
    '/members',
    '/community/calendar',
    '/community/leaderboard',
    '/templates',
    '/blog',
    '/careers',
    '/portfolio',
  ];

  requiredPublicPages.forEach((page) => {
    it(`contains public page: ${page}`, () => {
      // For root, match exact loc ending with /
      if (page === '/') {
        expect(sitemapContent).toContain(
          '<loc>https://theinnovativenative.com/</loc>'
        );
      } else {
        expect(sitemapContent).toContain(
          `<loc>https://theinnovativenative.com${page}</loc>`
        );
      }
    });
  });

  // Required course pages
  const requiredCoursePages = [
    '/classroom/brand-vibe-start-here',
    '/classroom/chaos-to-clarity-ai-first-systems-that-scale',
    '/classroom/n8n-templates',
    '/classroom/glossary-resources',
    '/classroom/youtube-workflows',
    '/classroom/11-coaching',
  ];

  requiredCoursePages.forEach((page) => {
    it(`contains course page: ${page}`, () => {
      expect(sitemapContent).toContain(
        `<loc>https://theinnovativenative.com${page}</loc>`
      );
    });
  });

  it('has lastmod set to 2026-04-02', () => {
    expect(sitemapContent).toContain('<lastmod>2026-04-02</lastmod>');
  });

  it('has changefreq values', () => {
    expect(sitemapContent).toContain('<changefreq>weekly</changefreq>');
    expect(sitemapContent).toContain('<changefreq>monthly</changefreq>');
  });

  it('has priority values between 0.0 and 1.0', () => {
    const priorities = sitemapContent.match(/<priority>([\d.]+)<\/priority>/g);
    expect(priorities).not.toBeNull();
    priorities!.forEach((match) => {
      const value = parseFloat(match.replace(/<\/?priority>/g, ''));
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    });
  });
});

describe('robots.txt', () => {
  const robotsPath = path.join(PUBLIC_DIR, 'robots.txt');
  let robotsContent: string;

  beforeAll(() => {
    robotsContent = fs.readFileSync(robotsPath, 'utf-8');
  });

  it('exists in public/', () => {
    expect(fs.existsSync(robotsPath)).toBe(true);
  });

  it('allows all crawlers', () => {
    expect(robotsContent).toContain('User-agent: *');
    expect(robotsContent).toContain('Allow: /');
  });

  const disallowedPaths = ['/api/', '/checkout/', '/settings/', '/auth/', '/admin/'];

  disallowedPaths.forEach((disallowed) => {
    it(`disallows ${disallowed}`, () => {
      expect(robotsContent).toContain(`Disallow: ${disallowed}`);
    });
  });

  it('references the sitemap', () => {
    expect(robotsContent).toContain(
      'Sitemap: https://theinnovativenative.com/sitemap.xml'
    );
  });
});
