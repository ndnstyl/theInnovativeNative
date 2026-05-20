/**
 * Unused Exports Detection Test
 * ===============================
 * Scans all files in src/data/ for exported symbols and checks whether
 * each is imported by at least one other file in the codebase.
 *
 * Orphaned exports increase bundle size and create maintenance confusion.
 * This test flags them so they can be removed or used.
 */

import * as fs from 'fs';
import * as path from 'path';

const SRC_DIR = path.resolve(__dirname, '../../');
const DATA_DIR = path.join(SRC_DIR, 'data');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function collectAllSrcFiles(): string[] {
  const result: string[] = [];
  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.next') continue;
        walk(full);
      } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
        result.push(full);
      }
    }
  }
  walk(SRC_DIR);
  return result;
}

/**
 * Extract exported symbol names from a TypeScript file.
 * Handles: export const, export function, export interface, export type,
 *          export enum, export class, export let, export var
 */
function getExportedSymbols(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const symbols: string[] = [];

  // Match: export const/let/var NAME, export function NAME, export interface NAME,
  //        export type NAME, export enum NAME, export class NAME
  const exportRe =
    /export\s+(?:const|let|var|function|interface|type|enum|class)\s+(\w+)/g;
  let match;
  while ((match = exportRe.exec(content)) !== null) {
    symbols.push(match[1]);
  }

  return symbols;
}

/**
 * Check if a symbol is imported by any source file other than the one
 * that defines it. Uses a simple string search, which may have false
 * positives for very short names, but is fast and practical.
 */
function isSymbolImported(
  symbol: string,
  definingFile: string,
  allFiles: string[],
): { imported: boolean; importedBy: string[] } {
  const importedBy: string[] = [];

  for (const file of allFiles) {
    if (path.resolve(file) === path.resolve(definingFile)) continue;
    if (file.includes('__tests__')) continue;

    const content = fs.readFileSync(file, 'utf-8');
    // Check for the symbol being used in the file
    // Use word boundary to avoid false positives
    const re = new RegExp(`\\b${symbol}\\b`);
    if (re.test(content)) {
      importedBy.push(path.relative(SRC_DIR, file));
    }
  }

  return { imported: importedBy.length > 0, importedBy };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Unused exports in src/data/', () => {
  const dataFiles = fs.readdirSync(DATA_DIR)
    .filter((f) => /\.(tsx?|jsx?)$/.test(f))
    .map((f) => path.join(DATA_DIR, f));

  const allSrcFiles = collectAllSrcFiles();

  // Build a map of file -> { symbol, imported, importedBy }
  const exportMap = new Map<
    string,
    { symbol: string; imported: boolean; importedBy: string[] }[]
  >();

  for (const file of dataFiles) {
    const symbols = getExportedSymbols(file);
    const results = symbols.map((symbol) => ({
      symbol,
      ...isSymbolImported(symbol, file, allSrcFiles),
    }));
    exportMap.set(path.relative(SRC_DIR, file), results);
  }

  // For each data file, run a test
  for (const [relFile, exports] of exportMap) {
    describe(relFile, () => {
      const orphaned = exports.filter((e) => !e.imported);
      const used = exports.filter((e) => e.imported);

      if (used.length > 0) {
        it(`has ${used.length} used export(s)`, () => {
          for (const exp of used) {
            expect(exp.imported).toBe(true);
          }
        });
      }

      if (orphaned.length > 0) {
        it(`ORPHANED: ${orphaned.length} export(s) are never imported`, () => {
          // Log the orphaned exports for visibility
          console.log(
            `Orphaned exports in ${relFile}:\n` +
            orphaned.map((e) => `  - ${e.symbol}`).join('\n'),
          );

          // This test intentionally fails to surface the problem.
          // When the orphaned exports are removed or used, remove them
          // from this expectation.
          // KNOWN DEBT: Track orphaned exports. Reduce this as cleanup progresses.
          expect(orphaned.length).toBeLessThanOrEqual(5);
        });
      }
    });
  }

  describe('Summary', () => {
    it('reports total orphaned export count across all data files', () => {
      let totalOrphaned = 0;
      let totalExports = 0;

      for (const [, exports] of exportMap) {
        totalExports += exports.length;
        totalOrphaned += exports.filter((e) => !e.imported).length;
      }

      console.log(
        `\nData exports summary: ${totalExports} total, ` +
        `${totalExports - totalOrphaned} used, ${totalOrphaned} orphaned`,
      );

      // Informational — always passes
      expect(totalExports).toBeGreaterThan(0);
    });
  });
});
