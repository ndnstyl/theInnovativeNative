# Animation Cookbook

Source: `remotion-videos/src/lib/animations.ts`

---

## Core Helpers

### `clamp(v, min = 0, max = 1)`
Clamps a number between min and max. Used internally by all helpers to guard against interpolation overshoot.

### `easeOut(t)`
Cubic ease-out: decelerates into the final value. Input is [0,1], output is [0,1]. Makes things feel like they snap into place.  
Use when: elements sliding in, bars growing, anything that should feel snappy.

### `easeInOut(t)`
Cubic ease-in-out: slow start, fast middle, slow end. Feels mechanical and deliberate.  
Use when: camera moves, panning, slow reveals where equal deceleration matters.

### `fadeIn({ frame, startFrame?, durationFrames? })`
Returns opacity 0→1 ramp starting at `startFrame` (default: 0) over `durationFrames` (default: 15 frames).

### `fadeOut({ frame, endFrame, durationFrames? })`
Returns opacity 1→0 ramp ending at `endFrame` over `durationFrames` (default: 15 frames).

### `fadeInOut({ frame, totalFrames, fadeFrames? })`
Symmetric fade in and out. Returns `Math.min(fadeIn, fadeOut)`. Ideal for overlays and pattern-interrupts.  
Default `fadeFrames`: 15 (applied to both ends).

### `dipToBlack({ frame, midFrame, halfDurationFrames? })`
Returns black-overlay opacity that peaks at 1.0 at `midFrame`. Used by `TemplateFrame` for `transitionIn/Out='dip'`.  
`halfDurationFrames` default: 10 frames on each side.

### `brandSpring({ frame, fps, from?, to?, delay? })`
Remotion spring with brand-tuned config: `damping=18, stiffness=200, mass=1`. Snappy but not bouncy.  
Maps spring result to `[from, to]`. Default: `from=0, to=1`.  
Use when: elements scale in, appear with physical weight, logo pops.

### `staggerReveal({ frame, index, staggerFrames?, rampFrames?, startFrame? })`
Per-index reveal. Delays start by `index * staggerFrames` from `startFrame`, then ramps from 0→1 over `rampFrames`.  
Defaults: `staggerFrames=6`, `rampFrames=12`, `startFrame=0`.  
Use when: bullet lists, bar charts, grid items, any sequential reveal.

---

## TemplateFrame Transitions

Controlled by `transitionIn` and `transitionOut` props on every polished template.

| Value | Behavior |
|-------|----------|
| `'fade'` | Opacity 0→1 in over 12 frames; 1→0 out over 12 frames (default) |
| `'dip'` | Black overlay dips to full black at frame 0 (midFrame=0). Use for hard cuts from black. |
| `'none'` | No transition — element appears/disappears instantly |

**Combining**: `transitionIn='dip'` + `transitionOut='fade'` is common for scene-opening cards that fade out naturally.

---

## Usage Patterns

### Standard template open/close
```ts
transitionIn="fade"   // default — soft in
transitionOut="fade"  // default — soft out
```

### Pattern interrupt (no TemplateFrame — uses AbsoluteFill + fadeInOut directly)
```ts
const opacity = fadeInOut({ frame, totalFrames: durationInFrames, fadeFrames: 6 });
```

### Sequential bullet reveal
```ts
const opacity = staggerReveal({ frame, index: i, staggerFrames: 10, rampFrames: 14, startFrame: 20 });
const translateX = (1 - opacity) * -24;  // slide in from left
```

### Spring scale-in (logo, number)
```ts
const scale = brandSpring({ frame, fps, from: 0.96, to: 1.0, delay: 0 });
// Bouncing version (grows then returns):
const scale = frame < durationInFrames / 2
  ? brandSpring({ frame, fps, from: 1.0, to: 1.05, delay: 3 })
  : brandSpring({ frame: durationInFrames - frame, fps, from: 1.0, to: 1.05, delay: 3 });
```

### Bar chart grow
```ts
const growT = easeOut(Math.min(1, rawT / BAR_ANIM));
const barHeight = growT * barAreaHeight * (bar.v / ceiling);
```

### Count-up number
```ts
const progress = clamp(interpolate(frame, [0, COUNT_UP_FRAMES], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
const displayValue = Math.round(parsed.num * progress).toString();
```

---

## Frame Budget Reference (30fps)

| Duration | Frames |
|----------|--------|
| 0.5s | 15 |
| 1s | 30 |
| 1.5s | 45 |
| 2s | 60 |
| 5s | 150 |
| 6s | 180 |
| 7s | 210 |
| 8s | 240 |
