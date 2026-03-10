// =============================================================================
// Navigation Data Tests
// Validates structure and business rules for site-wide navigation.
// =============================================================================

const { navItems } = require('@/data/navigation');

describe('navItems', () => {
  it('exports an array', () => {
    expect(Array.isArray(navItems)).toBe(true);
  });

  it('has exactly 5 items', () => {
    expect(navItems).toHaveLength(5);
  });

  it('each item has label, href, isCta, and children fields', () => {
    for (const item of navItems) {
      expect(typeof item.label).toBe('string');
      expect(typeof item.href).toBe('string');
      expect(typeof item.isCta).toBe('boolean');
      expect(item).toHaveProperty('children');
    }
  });

  it('all labels are non-empty and under 30 characters', () => {
    for (const item of navItems) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.label.length).toBeLessThan(30);
    }
  });
});

describe('CTA item', () => {
  const ctaItems = navItems.filter((item: any) => item.isCta === true);

  it('exactly one item is marked as CTA', () => {
    expect(ctaItems).toHaveLength(1);
  });

  it('is the last item in the array', () => {
    const lastItem = navItems[navItems.length - 1];
    expect(lastItem.isCta).toBe(true);
  });

  it('CTA has an external URL (starts with https://)', () => {
    expect(ctaItems[0].href.startsWith('https://')).toBe(true);
  });
});

describe('non-CTA items', () => {
  const nonCtaItems = navItems.filter((item: any) => item.isCta === false);

  it('there are exactly 4 non-CTA items', () => {
    expect(nonCtaItems).toHaveLength(4);
  });

  it('each non-CTA item has an internal path (starts with / or /#)', () => {
    for (const item of nonCtaItems) {
      const isInternal = item.href.startsWith('/') || item.href.startsWith('/#');
      expect(isInternal).toBe(true);
    }
  });

  it('no non-CTA item has an external URL', () => {
    for (const item of nonCtaItems) {
      expect(item.href.startsWith('https://')).toBe(false);
      expect(item.href.startsWith('http://')).toBe(false);
    }
  });
});

describe('brand voice compliance', () => {
  const bannedWords = [
    'diagnose',
    'diagnosis',
    'diagnostic',
    'structural correction',
    'fractional CMO',
    'consulting firm',
    'McKinsey',
    'deliverables',
    'stakeholders',
    'synergy',
  ];

  it('no banned consultant language in labels', () => {
    for (const item of navItems) {
      const label = item.label.toLowerCase();
      for (const word of bannedWords) {
        expect(label).not.toContain(word.toLowerCase());
      }
    }
  });
});
