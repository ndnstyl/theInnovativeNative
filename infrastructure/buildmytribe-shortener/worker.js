/**
 * buildmytribe.ai — Branded Short URL Worker
 *
 * Cloudflare Worker that maps short vanity slugs to full resource URLs on
 * theinnovativenative.com. Every post in the PI lawyer content campaign
 * (weeks 3 and 4 of the Apr 2026 calendar) uses this domain for upgrade CTAs.
 *
 * SECURITY (non-negotiable, feature 036 FR-032):
 *   - STRICT WHITELIST ONLY. Unknown slugs return HTTP 404.
 *   - Destinations are hardcoded in REDIRECT_MAP below. The Worker MUST NOT
 *     accept any user-supplied URL as a destination. No pass-through, no
 *     query-param-derived destinations, no default fallback redirects.
 *   - This prevents the open-redirect attack class that would let phishers
 *     weaponize buildmytribe.ai as a trust-laundering domain.
 *
 * BEHAVIOR:
 *   - Root (`buildmytribe.ai/`) → 301 to theinnovativenative.com/resources
 *   - Known slug → 301 to full destination, query string preserved for UTMs
 *   - Unknown slug → 404 with a plain-text body
 *
 * UPDATES:
 *   When new lead magnets ship, add entries to REDIRECT_MAP and redeploy.
 *   Source of truth: infrastructure/buildmytribe-shortener/redirect-map.json
 *
 * DEPLOY:
 *   See DEPLOY.md in this directory.
 */

const ROOT_DESTINATION = 'https://theinnovativenative.com/resources';

const REDIRECT_MAP = Object.freeze({
  // Tier 1 — existing magnets (6)
  'math':     'https://theinnovativenative.com/resources/442-intake-math',
  'tools':    'https://theinnovativenative.com/resources/5-ai-tools-pi',
  'policy':   'https://theinnovativenative.com/resources/ai-governance-template-pi',
  'heppner':  'https://theinnovativenative.com/resources/heppner-one-pager',
  'risk':     'https://theinnovativenative.com/resources/ai-tool-risk-chart',
  'colossus': 'https://theinnovativenative.com/resources/insurance-ai-colossus',

  // Tier 1 — new magnet (Phase 2.0 sample, Day 16 upgrade CTA)
  'demand':   'https://theinnovativenative.com/resources/demand-letter-matrix',

  // Tier 2 queued — uncomment as each magnet + landing page deploys
  // 'wrapper':   'https://theinnovativenative.com/resources/rag-vs-wrapper-checklist',
  // 'automate':  'https://theinnovativenative.com/resources/5-pi-automations-guide',
  // 'cms':       'https://theinnovativenative.com/resources/cms-dashboard-guide',
  // 'discovery': 'https://theinnovativenative.com/resources/discovery-ai-overview',

  // Tier 3 queued
  // 'cost':  'https://theinnovativenative.com/resources/governance-audit-framework',
  // 'audit': 'https://theinnovativenative.com/resources/5-pattern-audit-workbook',
});

export default {
  async fetch(request) {
    const url = new URL(request.url);
    // Strip leading slash; reject multi-segment paths (no /foo/bar slugs).
    const rawPath = url.pathname.replace(/^\/+/, '');
    const path = rawPath.replace(/\/+$/, ''); // also strip trailing slash

    // Root → redirect to the resources hub
    if (!path) {
      return buildRedirect(ROOT_DESTINATION, url.search);
    }

    // Nested paths are not allowed (whitelist lookup is by flat slug)
    if (path.includes('/')) {
      return notFound(path);
    }

    // Slug validation: lowercase alphanumerics and hyphens only
    if (!/^[a-z0-9][a-z0-9-]*$/.test(path)) {
      return notFound(path);
    }

    const destination = REDIRECT_MAP[path];
    if (!destination) {
      return notFound(path);
    }

    return buildRedirect(destination, url.search);
  },
};

/**
 * Build a 301 response with the destination URL. If a query string is present
 * on the incoming request, append it to the destination so UTM params flow
 * through from buildmytribe.ai to theinnovativenative.com.
 */
function buildRedirect(destination, incomingSearch) {
  let target = destination;
  if (incomingSearch) {
    // Preserve UTMs. If the destination already has a query string,
    // concatenate with '&'; otherwise attach with '?'.
    const separator = destination.includes('?') ? '&' : '?';
    // incomingSearch starts with '?' — strip it for clean concatenation.
    const query = incomingSearch.startsWith('?')
      ? incomingSearch.slice(1)
      : incomingSearch;
    target = destination + separator + query;
  }

  return new Response(null, {
    status: 301,
    headers: {
      Location: target,
      'Cache-Control': 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer-when-downgrade',
    },
  });
}

/**
 * 404 response. Plain text, no HTML, minimal information disclosure.
 * Does not redirect, does not hint at other valid slugs.
 */
function notFound(path) {
  return new Response(
    `Not Found\n\nThe short link "${path}" does not exist. Visit https://theinnovativenative.com/resources for the full resource list.\n`,
    {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    }
  );
}
