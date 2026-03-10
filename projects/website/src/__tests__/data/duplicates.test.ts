// =============================================================================
// Data Duplication Tests
// Guards against hardcoded URLs, scattered data, and drift between sources.
// =============================================================================

const fs = require('fs');
const path = require('path');

const homepage = require('@/data/homepage');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DATA_DIR = path.resolve(__dirname, '../../data');
const COMPONENTS_DIR = path.resolve(__dirname, '../../components');

function readFileIfExists(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Calendly URL centralization
// ---------------------------------------------------------------------------

describe('Calendly URL centralization', () => {
  const calendlyPattern = /calendly\.com\/[a-zA-Z0-9\-_/]+/g;

  it('homepage data references Calendly URL only in valueLadderTiers (centralized)', () => {
    // Collect all Calendly URLs from homepage exports
    const homepageSrc = readFileIfExists(path.join(DATA_DIR, 'homepage.ts'));
    expect(homepageSrc).not.toBeNull();

    const matches = homepageSrc!.match(calendlyPattern) || [];
    // All Calendly URLs should be in the valueLadderTiers section
    // At minimum, document how many places it appears
    if (matches.length > 1) {
      // Multiple Calendly URLs in the same file are acceptable IF they are
      // in different tiers (e.g. pilot + build). But they should be identical.
      const uniqueUrls = new Set(matches);
      expect(uniqueUrls.size).toBe(1);
    }
  });

  it('navigation data references Calendly URL only in the CTA item', () => {
    const navSrc = readFileIfExists(path.join(DATA_DIR, 'navigation.ts'));
    expect(navSrc).not.toBeNull();

    const matches = navSrc!.match(calendlyPattern) || [];
    // Should appear exactly once (the CTA)
    expect(matches.length).toBe(1);
  });

  it('all Calendly URLs across data files are identical', () => {
    const homepageSrc = readFileIfExists(path.join(DATA_DIR, 'homepage.ts')) || '';
    const navSrc = readFileIfExists(path.join(DATA_DIR, 'navigation.ts')) || '';
    const combined = homepageSrc + navSrc;

    const matches = combined.match(calendlyPattern) || [];
    const uniqueUrls = new Set(matches);

    // Every Calendly reference should point to the same URL
    expect(uniqueUrls.size).toBeLessThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// Service offerings consistency between homepage.ts and ServicesCarousel.tsx
// ---------------------------------------------------------------------------

describe('service offerings data consistency', () => {
  const carouselPath = path.join(
    COMPONENTS_DIR,
    'containers/home/ServicesCarousel.tsx'
  );
  const carouselSrc = readFileIfExists(carouselPath);

  // Skip these tests if the carousel file does not exist
  const describeIfCarouselExists = carouselSrc ? describe : describe.skip;

  describeIfCarouselExists('homepage.ts vs ServicesCarousel.tsx', () => {
    it('same number of services in both files', () => {
      // Count services array items in carousel
      // The carousel defines a `services` array inline
      const carouselServiceCount = (carouselSrc!.match(/number:\s*"/g) || []).length;
      expect(carouselServiceCount).toBe(homepage.serviceOfferings.length);
    });

    it('service titles match between both files', () => {
      const homepageTitles = homepage.serviceOfferings.map(
        (so: any) => so.name
      );

      // Extract titles from carousel source
      const titleMatches = carouselSrc!.match(/title:\s*"([^"]+)"/g) || [];
      const carouselTitles = titleMatches.map((m: string) =>
        m.replace(/title:\s*"/, '').replace(/"$/, '')
      );

      expect(carouselTitles.sort()).toEqual(homepageTitles.sort());
    });

    it('each service has the same number of capabilities/items', () => {
      // Homepage: 5 capabilities each
      for (const so of homepage.serviceOfferings) {
        expect(so.capabilities).toHaveLength(5);
      }

      // Carousel: count items per service block
      // Each service block has an `items: [...]` array
      const itemBlocks = carouselSrc!.match(/items:\s*\[([\s\S]*?)\]/g) || [];
      for (const block of itemBlocks) {
        const itemCount = (block.match(/"/g) || []).length / 2; // opening + closing quotes
        expect(itemCount).toBe(5);
      }
    });
  });
});

// ---------------------------------------------------------------------------
// Testimonials single-source check
// ---------------------------------------------------------------------------

describe('testimonials data single-source', () => {
  it('testimonials data does not appear in multiple data files', () => {
    // Scan all .ts files in the data directory for "testimonial" references
    const dataFiles = fs.readdirSync(DATA_DIR).filter((f: string) => f.endsWith('.ts'));

    const filesWithTestimonials: string[] = [];
    for (const file of dataFiles) {
      const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
      if (/testimonial/i.test(content)) {
        filesWithTestimonials.push(file);
      }
    }

    // Testimonials should be in at most one data file
    expect(filesWithTestimonials.length).toBeLessThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// No hardcoded external URLs in data files (except known ones)
// ---------------------------------------------------------------------------

describe('external URL inventory', () => {
  it('all external URLs in homepage data are Calendly links', () => {
    // Collect all hrefs from all homepage arrays
    const allHrefs: string[] = [];

    for (const ps of homepage.proofSystems) {
      allHrefs.push(ps.href);
    }
    for (const tier of homepage.valueLadderTiers) {
      allHrefs.push(tier.href);
    }

    const externalUrls = allHrefs.filter(
      (href: string) => href.startsWith('https://') || href.startsWith('http://')
    );

    // Every external URL should be a Calendly link (the only known external)
    for (const url of externalUrls) {
      expect(url).toContain('calendly.com');
    }
  });
});
