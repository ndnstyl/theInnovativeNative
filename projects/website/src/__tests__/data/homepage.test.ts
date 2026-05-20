// =============================================================================
// Homepage Data Tests
// Validates structure, content, and business rules for all homepage exports.
// =============================================================================

const {
  verticals,
  proofSystems,
  valueLadderTiers,
  serviceOfferings,
} = require('@/data/homepage');

// ---------------------------------------------------------------------------
// Verticals
// ---------------------------------------------------------------------------

describe('verticals', () => {
  it('exports an array', () => {
    expect(Array.isArray(verticals)).toBe(true);
  });

  it('has exactly 4 verticals', () => {
    expect(verticals).toHaveLength(4);
  });

  it.each([
    ['id', 'string'],
    ['name', 'string'],
    ['avatar', 'string'],
    ['painPoint', 'string'],
    ['icon', 'string'],
  ])('each vertical has "%s" of type %s', (key, type) => {
    for (const v of verticals) {
      expect(typeof v[key]).toBe(type);
      expect(v[key].length).toBeGreaterThan(0);
    }
  });

  it('has no duplicate IDs', () => {
    const ids = verticals.map((v: any) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ---------------------------------------------------------------------------
// Proof Systems
// ---------------------------------------------------------------------------

describe('proofSystems', () => {
  it('exports an array with at least 1 item', () => {
    expect(Array.isArray(proofSystems)).toBe(true);
    expect(proofSystems.length).toBeGreaterThanOrEqual(1);
  });

  it.each([
    ['id', 'string'],
    ['name', 'string'],
    ['vertical', 'string'],
    ['description', 'string'],
    ['outcome', 'string'],
    ['price', 'string'],
    ['href', 'string'],
    ['status', 'string'],
  ])('each proof system has "%s" of type %s', (key, type) => {
    for (const ps of proofSystems) {
      expect(typeof ps[key]).toBe(type);
      expect(ps[key].length).toBeGreaterThan(0);
    }
  });

  it('each status is a valid enum value', () => {
    const validStatuses = ['live', 'coming-soon', 'beta'];
    for (const ps of proofSystems) {
      expect(validStatuses).toContain(ps.status);
    }
  });

  it('each href starts with /', () => {
    for (const ps of proofSystems) {
      expect(ps.href.startsWith('/')).toBe(true);
    }
  });

  it('each price matches a valid format (e.g. "$X" or "From $X" or "Free")', () => {
    const pricePattern = /^(Free|\$[\d,]+(\s+\w+)?|From \$[\d,]+)$/;
    for (const ps of proofSystems) {
      expect(ps.price).toMatch(pricePattern);
    }
  });

  it('has no duplicate IDs', () => {
    const ids = proofSystems.map((ps: any) => ps.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('each vertical references an existing vertical ID', () => {
    const verticalIds = new Set(verticals.map((v: any) => v.id));
    for (const ps of proofSystems) {
      expect(verticalIds.has(ps.vertical)).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Value Ladder Tiers
// ---------------------------------------------------------------------------

describe('valueLadderTiers', () => {
  it('exports an array', () => {
    expect(Array.isArray(valueLadderTiers)).toBe(true);
  });

  it('has exactly 4 tiers', () => {
    expect(valueLadderTiers).toHaveLength(4);
  });

  it.each([
    ['id', 'string'],
    ['name', 'string'],
    ['priceRange', 'string'],
    ['description', 'string'],
    ['cta', 'string'],
    ['href', 'string'],
  ])('each tier has "%s" of type %s', (key, type) => {
    for (const tier of valueLadderTiers) {
      expect(typeof tier[key]).toBe(type);
      expect(tier[key].length).toBeGreaterThan(0);
    }
  });

  it('each tier has a numeric order field', () => {
    for (const tier of valueLadderTiers) {
      expect(typeof tier.order).toBe('number');
    }
  });

  it('orders are sequential from 1 to 4', () => {
    const orders = valueLadderTiers.map((t: any) => t.order).sort((a: number, b: number) => a - b);
    expect(orders).toEqual([1, 2, 3, 4]);
  });

  it('has no duplicate IDs', () => {
    const ids = valueLadderTiers.map((t: any) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all hrefs are valid (start with /, #, or https://)', () => {
    for (const tier of valueLadderTiers) {
      const valid =
        tier.href.startsWith('/') ||
        tier.href.startsWith('#') ||
        tier.href.startsWith('https://');
      expect(valid).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// Service Offerings
// ---------------------------------------------------------------------------

describe('serviceOfferings', () => {
  it('exports an array', () => {
    expect(Array.isArray(serviceOfferings)).toBe(true);
  });

  it('has exactly 3 offerings', () => {
    expect(serviceOfferings).toHaveLength(3);
  });

  it.each([
    ['id', 'string'],
    ['name', 'string'],
    ['description', 'string'],
    ['icon', 'string'],
  ])('each offering has "%s" of type %s', (key, type) => {
    for (const so of serviceOfferings) {
      expect(typeof so[key]).toBe(type);
      expect(so[key].length).toBeGreaterThan(0);
    }
  });

  it('each offering has exactly 5 capabilities', () => {
    for (const so of serviceOfferings) {
      expect(Array.isArray(so.capabilities)).toBe(true);
      expect(so.capabilities).toHaveLength(5);
    }
  });

  it('each capability is a non-empty string', () => {
    for (const so of serviceOfferings) {
      for (const cap of so.capabilities) {
        expect(typeof cap).toBe('string');
        expect(cap.length).toBeGreaterThan(0);
      }
    }
  });

  it('does not use banned consultant language in descriptions', () => {
    const banned = ['diagnose', 'structural correction', 'fractional CMO'];
    for (const so of serviceOfferings) {
      const combined = [so.description, ...so.capabilities].join(' ').toLowerCase();
      for (const word of banned) {
        expect(combined).not.toContain(word.toLowerCase());
      }
    }
  });

  it('has no duplicate IDs', () => {
    const ids = serviceOfferings.map((so: any) => so.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ---------------------------------------------------------------------------
// Cross-export uniqueness
// ---------------------------------------------------------------------------

describe('cross-export ID uniqueness', () => {
  it('no duplicate IDs across verticals, proofSystems, valueLadderTiers, serviceOfferings', () => {
    const allIds = [
      ...verticals.map((v: any) => v.id),
      ...proofSystems.map((ps: any) => ps.id),
      ...valueLadderTiers.map((t: any) => t.id),
      ...serviceOfferings.map((so: any) => so.id),
    ];
    expect(new Set(allIds).size).toBe(allIds.length);
  });
});
