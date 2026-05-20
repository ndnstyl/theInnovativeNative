// UTM parameter capture and persistence
// Extracts UTM params and ad click IDs from the URL,
// stores them in localStorage with a 30-day expiry.

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  li_fat_id?: string;
}

const STORAGE_KEY = 'tin_utm_params';
const EXPIRY_DAYS = 30;

const UTM_KEYS: (keyof UTMParams)[] = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
  'li_fat_id',
];

interface StoredUTM {
  params: UTMParams;
  expiry: number;
}

/**
 * Capture UTM parameters from the current URL and persist them.
 * Only writes if at least one UTM param or click ID is present.
 * Overwrites previous values when new UTM params arrive.
 */
export function captureUTMParams(): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  const params: UTMParams = {};
  let hasParam = false;

  for (const key of UTM_KEYS) {
    const value = url.searchParams.get(key);
    if (value) {
      params[key] = value;
      hasParam = true;
    }
  }

  if (!hasParam) return;

  const stored: StoredUTM = {
    params,
    expiry: Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // localStorage unavailable (private browsing, storage full)
  }
}

/**
 * Retrieve stored UTM params. Returns empty object if expired or absent.
 */
export function getUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {};

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const stored: StoredUTM = JSON.parse(raw);

    // Check expiry
    if (Date.now() > stored.expiry) {
      localStorage.removeItem(STORAGE_KEY);
      return {};
    }

    return stored.params;
  } catch {
    return {};
  }
}

/**
 * Clear stored UTM params.
 */
export function clearUTMParams(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export { STORAGE_KEY, EXPIRY_DAYS };
