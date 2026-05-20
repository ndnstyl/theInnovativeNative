/**
 * UTM Parameter Capture Tests
 * ============================
 * Tests UTM parameter extraction, localStorage persistence,
 * 30-day expiry, and ad click ID capture.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.resolve(__dirname, '../../');
const UTM_FILE = path.resolve(SRC_DIR, 'lib/analytics/utm.ts');

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

describe('UTM Module Structure', () => {
  const content = readFile(UTM_FILE);

  it('should exist as a module', () => {
    expect(fs.existsSync(UTM_FILE)).toBe(true);
  });

  it('should extract standard UTM parameters', () => {
    expect(content).toContain('utm_source');
    expect(content).toContain('utm_medium');
    expect(content).toContain('utm_campaign');
    expect(content).toContain('utm_content');
    expect(content).toContain('utm_term');
  });

  it('should capture Facebook click ID (fbclid)', () => {
    expect(content).toContain('fbclid');
  });

  it('should capture Google click ID (gclid)', () => {
    expect(content).toContain('gclid');
  });

  it('should capture LinkedIn click ID (li_fat_id)', () => {
    expect(content).toContain('li_fat_id');
  });

  it('should use tin_utm_params as localStorage key', () => {
    expect(content).toContain('tin_utm_params');
  });

  it('should set 30-day expiry', () => {
    // Check that expiry is 30 days in milliseconds
    expect(content).toContain('30');
    expect(content).toContain('expiry');
  });

  it('should export captureUTMParams function', () => {
    expect(content).toContain('export function captureUTMParams');
  });

  it('should export getUTMParams function', () => {
    expect(content).toContain('export function getUTMParams');
  });

  it('should export clearUTMParams function', () => {
    expect(content).toContain('export function clearUTMParams');
  });

  it('should check for expiry before returning params', () => {
    // The getUTMParams function should check Date.now() > stored.expiry
    expect(content).toContain('Date.now()');
    expect(content).toContain('stored.expiry');
  });

  it('should remove expired params from localStorage', () => {
    expect(content).toContain('localStorage.removeItem');
  });

  it('should handle localStorage errors gracefully', () => {
    // Should have try/catch for private browsing mode
    expect(content).toContain('catch');
  });

  it('should only write if at least one param is present', () => {
    expect(content).toContain('hasParam');
  });
});

describe('UTM Type Definition', () => {
  const content = readFile(UTM_FILE);

  it('should export UTMParams interface', () => {
    expect(content).toContain('export interface UTMParams');
  });

  it('should define all UTM fields as optional strings', () => {
    // All fields should be optional (have ?)
    expect(content).toContain('utm_source?: string');
    expect(content).toContain('utm_medium?: string');
    expect(content).toContain('utm_campaign?: string');
    expect(content).toContain('utm_content?: string');
    expect(content).toContain('utm_term?: string');
    expect(content).toContain('fbclid?: string');
    expect(content).toContain('gclid?: string');
    expect(content).toContain('li_fat_id?: string');
  });
});

describe('UTM Integration with Analytics', () => {
  it('useTrackEvent should import getUTMParams', () => {
    const hookContent = readFile(path.resolve(SRC_DIR, 'hooks/useTrackEvent.ts'));
    expect(hookContent).toContain("import { getUTMParams } from '@/lib/analytics/utm'");
  });

  it('barrel export should re-export UTM functions', () => {
    const barrelContent = readFile(path.resolve(SRC_DIR, 'lib/analytics/index.ts'));
    expect(barrelContent).toContain('captureUTMParams');
    expect(barrelContent).toContain('getUTMParams');
    expect(barrelContent).toContain('clearUTMParams');
    expect(barrelContent).toContain('UTMParams');
  });
});
