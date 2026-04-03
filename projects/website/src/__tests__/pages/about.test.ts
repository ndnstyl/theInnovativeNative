/**
 * About Page Tests
 * ================
 * Validates the About page exists, has correct structure, content,
 * navigation links, and is wired into the ClassroomLayout.
 */

import * as fs from 'fs';
import * as path from 'path';

const ABOUT_PAGE = path.resolve(__dirname, '../../pages/about.tsx');
const CLASSROOM_LAYOUT = path.resolve(
  __dirname,
  '../../components/layout/ClassroomLayout.tsx',
);
const NAV_DATA = path.resolve(__dirname, '../../data/navigation.ts');

// Read file content once for all static analysis tests
let aboutContent: string;
let classroomLayoutContent: string;
let navDataContent: string;

beforeAll(() => {
  aboutContent = fs.readFileSync(ABOUT_PAGE, 'utf-8');
  classroomLayoutContent = fs.readFileSync(CLASSROOM_LAYOUT, 'utf-8');
  navDataContent = fs.readFileSync(NAV_DATA, 'utf-8');
});

describe('About page — file existence', () => {
  it('src/pages/about.tsx exists', () => {
    expect(fs.existsSync(ABOUT_PAGE)).toBe(true);
  });
});

describe('About page — layout', () => {
  it('imports ClassroomLayout', () => {
    expect(aboutContent).toMatch(/import\s+.*ClassroomLayout/);
  });

  it('uses ClassroomLayout as wrapper', () => {
    expect(aboutContent).toMatch(/<ClassroomLayout/);
  });
});

describe('About page — Head meta tags', () => {
  it('imports Head from next/head', () => {
    expect(aboutContent).toMatch(/import\s+Head\s+from\s+['"]next\/head['"]/);
  });

  it('has a <title> tag', () => {
    expect(aboutContent).toMatch(/<title>/);
  });

  it('has a meta description', () => {
    expect(aboutContent).toMatch(/meta\s+name=["']description["']/);
  });

  it('has og:title meta tag', () => {
    expect(aboutContent).toMatch(/og:title/);
  });

  it('has og:description meta tag', () => {
    expect(aboutContent).toMatch(/og:description/);
  });
});

describe('About page — key content', () => {
  it('contains "BuildMyTribe"', () => {
    expect(aboutContent).toContain('BuildMyTribe');
  });

  it('contains "Mike Soto"', () => {
    expect(aboutContent).toContain('Mike Soto');
  });

  it('contains community description language', () => {
    // Should describe what the community is about
    expect(aboutContent).toMatch(/automation|systems|entrepreneurs/i);
  });

  it('contains course offerings', () => {
    expect(aboutContent).toContain('Brand Vibe');
    expect(aboutContent).toContain('Chaos to Clarity');
  });

  it('contains tagline', () => {
    expect(aboutContent).toMatch(/chaos.*clarity/i);
  });
});

describe('About page — CTA links', () => {
  it('has a link to /auth/invite (join)', () => {
    expect(aboutContent).toMatch(/\/auth\/invite/);
  });

  it('has a link to /classroom', () => {
    expect(aboutContent).toMatch(/\/classroom/);
  });
});

describe('About page — no ProtectedRoute (public page)', () => {
  it('does not wrap content in ProtectedRoute', () => {
    expect(aboutContent).not.toMatch(/<ProtectedRoute/);
  });
});

describe('About page — has default export', () => {
  it('exports a default function', () => {
    expect(aboutContent).toMatch(/export\s+default\b/);
  });
});

describe('Navigation — About link in ClassroomLayout', () => {
  it('ClassroomLayout has an About link', () => {
    expect(classroomLayoutContent).toMatch(/About/);
    expect(classroomLayoutContent).toMatch(/\/about/);
  });
});

describe('Navigation — About link in site nav data', () => {
  it('navigation data has About entry pointing to /about', () => {
    expect(navDataContent).toMatch(/["']About["']/);
    expect(navDataContent).toMatch(/["']\/about["']/);
  });
});
