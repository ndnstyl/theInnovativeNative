/**
 * flatten-dynamic-routes.js
 *
 * Next.js static export creates literal bracket-named directories:
 *   out/classroom/[courseSlug]/[lessonSlug].html
 *
 * Apache treats these as real directories, breaking rewrite rules and
 * exposing template paths as navigable URLs. This script runs after
 * `next build` and flattens bracket directories into sibling .html files
 * so only the shell files exist on the server — no bracket directories.
 *
 * Before:
 *   classroom/[courseSlug].html
 *   classroom/[courseSlug]/[lessonSlug].html
 *   classroom/admin/[courseSlug]/edit.html
 *   classroom/admin/[courseSlug]/lessons/[lessonSlug].html
 *   members/[username].html
 *   members/[username]/edit.html
 *
 * After:
 *   classroom/[courseSlug].html           (unchanged — no dir conflict)
 *   classroom/_lesson.html               (moved from bracket dir)
 *   classroom/admin/_edit.html            (moved)
 *   classroom/admin/_lesson-edit.html     (moved)
 *   members/_profile.html                (moved from [username].html)
 *   members/_profile-edit.html           (moved from [username]/edit.html)
 *   (bracket directories deleted)
 */

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'out');

const moves = [
  // classroom lesson shell
  {
    from: 'classroom/[courseSlug]/[lessonSlug].html',
    to: 'classroom/_lesson.html',
  },
  // classroom admin edit shell
  {
    from: 'classroom/admin/[courseSlug]/edit.html',
    to: 'classroom/admin/_edit.html',
  },
  // classroom admin lesson edit shell
  {
    from: 'classroom/admin/[courseSlug]/lessons/[lessonSlug].html',
    to: 'classroom/admin/_lesson-edit.html',
  },
  // members profile shell (file, not directory)
  {
    from: 'members/[username].html',
    to: 'members/_profile.html',
  },
  // members profile edit (inside bracket directory)
  {
    from: 'members/[username]/edit.html',
    to: 'members/_profile-edit.html',
  },
  // templates: SSG generates real files, no flattening needed
  // community calendar event shell
  {
    from: 'community/calendar/[id].html',
    to: 'community/calendar/_event.html',
  },
  // messages conversation shell
  {
    from: 'messages/[conversationId].html',
    to: 'messages/_conversation.html',
  },
];

let changed = 0;

for (const { from, to } of moves) {
  const src = path.join(OUT, from);
  const dst = path.join(OUT, to);

  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.renameSync(src, dst);
    console.log(`  moved: ${from} → ${to}`);
    changed++;
  }
}

// Remove all empty directories inside bracket-named dirs, then the bracket dirs themselves.
// Runs multiple passes until stable — handles arbitrary nesting depth.
function pruneEmptyDirs(dir) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return;
  for (const name of fs.readdirSync(dir)) {
    pruneEmptyDirs(path.join(dir, name));
  }
  // After recursing into children, remove this dir if it's bracket-named and now empty
  if (path.basename(dir).startsWith('[') && fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
    console.log(`  removed empty dir: ${path.relative(OUT, dir)}/`);
    changed++;
  }
}

// Also remove non-bracket dirs that sit inside bracket parents and are now empty
// (e.g. classroom/admin/[courseSlug]/lessons/ after lesson file moved out)
function pruneEmptyChildDirs(dir) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      pruneEmptyChildDirs(full);
      if (fs.readdirSync(full).length === 0) {
        fs.rmdirSync(full);
        console.log(`  removed empty dir: ${path.relative(OUT, full)}/`);
        changed++;
      }
    }
  }
}

// First pass: remove empty non-bracket dirs inside bracket parents
pruneEmptyChildDirs(OUT);
// Second pass: remove bracket dirs that are now empty
pruneEmptyDirs(OUT);

console.log(`flatten-dynamic-routes: ${changed} changes`);
