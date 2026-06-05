# Remotion Integration

## Directory layout
```
.claude/skills/3d-icon-forge/library/
  index.json
  a-glass-tile/
    brain-cyan-hero.png
    brain-cyan-supporting.png
    ...
  b-techsy-machine/
  c-cripsy-orbit/
  d-destly-interface/
```

## index.json structure
```json
{
  "version": "1.0.0",
  "updated": "2026-04-15",
  "assets": [
    {
      "id": "a-brain-cyan-hero",
      "style": "a-glass-tile",
      "subject": "brain",
      "variant": "cyan",
      "scale": "hero",
      "path": "library/a-glass-tile/brain-cyan-hero.png",
      "width": 2048,
      "height": 2048,
      "tags": ["cognition", "thinking", "intelligence", "ai"]
    }
  ]
}
```

## Importing into a Remotion composition

### Approach 1: Static import
```tsx
import {staticFile} from 'remotion';
import iconIndex from '@/../.claude/skills/3d-icon-forge/library/index.json';

const brain = iconIndex.assets.find(a => a.id === 'a-brain-cyan-hero');
const src = staticFile(brain.path);

export const Explainer = () => (
  <Img src={src} style={{width: 400, height: 400}} />
);
```

### Approach 2: Tag-based lookup
```tsx
function findIcon(tag: string, style?: string, variant: string = 'cyan') {
  return iconIndex.assets.find(a =>
    a.tags.includes(tag) &&
    (!style || a.style === style) &&
    a.variant === variant
  );
}

const icon = findIcon('cognition', 'c-cripsy-orbit');
```

## Remotion public/ symlink (recommended)
Remotion looks up `staticFile()` paths relative to `public/`. Symlink the library once per video project:

```bash
# From your Remotion project root:
ln -s ../../.claude/skills/3d-icon-forge/library ./public/icons-3d
```

Then reference as `staticFile('icons-3d/a-glass-tile/brain-cyan-hero.png')`.

## Animation patterns per style

| Style | Suggested animation |
|-------|-------------------|
| **A — Glass Tile** | Scale-in with spring, 100ms → 600ms, slight Y-axis wobble on settle |
| **B — Techsy Machine** | Assemble: base slides up first, glass feature rotates in from above, cubes float in last |
| **C — Cripsy Orbit** | Subject scale-in, orbital debris fade in with staggered delays (50ms each) |
| **D — Destly Interface** | Panel-by-panel slide + fade, 80ms stagger, ends in parallax hover |

## Rendering performance
- Hero (2048²) PNGs are ~400-600KB each. Pre-process to WebP for Remotion if rendering > 30s videos.
- Micro (512²) PNGs are ~80KB — fine for any length.
- Remotion's `delayRender` is unnecessary for these — they're local files.

## Naming convention enforcement
All IDs follow: `<style-prefix>-<subject-slug>-<variant>-<scale>`
- `a-brain-cyan-hero`
- `b-workflow-cyan-supporting`
- `c-rocket-magenta-hero` (note: only ONE magenta-rare per explainer)

Bake script enforces this naming — don't manually rename files or index.json will desync.
