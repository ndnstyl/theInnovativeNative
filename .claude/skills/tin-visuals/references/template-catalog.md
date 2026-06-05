# TIN Visual Kit — Template Catalog

All templates live in `remotion-videos/src/InnovativeNative/` (polished) and `remotion-videos/src/InnovativeNative/patterns/` (pattern-interrupts). Registered compositions are in `remotion-videos/src/Root.tsx`.

---

## Polished Templates (TIN-*-16x9 and TIN-*-9x16)

### TitleCard
**Composition IDs**: `TIN-TitleCard-16x9`, `TIN-TitleCard-9x16`  
**Default duration**: 180 frames (6s @ 30fps)

Props interface:
```ts
{
  title: string;
  subtitle?: string;
  eyebrow?: string;
  transitionIn?: 'fade' | 'dip' | 'none';
  transitionOut?: 'fade' | 'dip' | 'none';
  durationFrames?: number;
  brandSlug?: string;
}
```

When to use: chapter openers, section intros, module titles, video intros.

Example invocations:
```json
{ "title": "Your Data Stack Is Lying to You", "eyebrow": "Chapter 1" }
{ "title": "The CFO Monday View", "subtitle": "One dashboard that tells the whole story", "transitionIn": "dip" }
```

---

### StatCard
**Composition IDs**: `TIN-StatCard-16x9`, `TIN-StatCard-9x16`  
**Default duration**: 180 frames (6s @ 30fps)

Props interface:
```ts
{
  value: string;
  label: string;
  footnote?: string;
  transitionIn?: 'fade' | 'dip' | 'none';
  transitionOut?: 'fade' | 'dip' | 'none';
  durationFrames?: number;
  brandSlug?: string;
}
```

Numeric values animate count-up (integers and percentages detected automatically).

When to use: single headline stat, conversion rates, revenue figures, benchmark numbers.

Example invocations:
```json
{ "value": "64%", "label": "of ad spend goes unattributed in multi-channel campaigns" }
{ "value": "3.2x", "label": "ROAS lift when MER and platform data are reconciled", "footnote": "Median across 12 accounts" }
```

---

### CalloutCard
**Composition IDs**: `TIN-CalloutCard-16x9`, `TIN-CalloutCard-9x16`  
**Default duration**: 180 frames (6s @ 30fps)

Props interface:
```ts
{
  text: string;
  attribution?: string;
  transitionIn?: 'fade' | 'dip' | 'none';
  transitionOut?: 'fade' | 'dip' | 'none';
  durationFrames?: number;
  brandSlug?: string;
}
```

When to use: pull quotes, key principles, memorable soundbites with optional source attribution.

Example invocations:
```json
{ "text": "If your attribution model can't survive a Meta outage, it's not an attribution model.", "attribution": "— Mike, TIN" }
{ "text": "MER is the one number that doesn't lie." }
```

---

### BulletReveal
**Composition IDs**: `TIN-BulletReveal-16x9`, `TIN-BulletReveal-9x16`  
**Default duration**: 240 frames (8s @ 30fps)

Props interface:
```ts
{
  title?: string;
  items: string[];
  transitionIn?: 'fade' | 'dip' | 'none';
  transitionOut?: 'fade' | 'dip' | 'none';
  durationFrames?: number;
  brandSlug?: string;
}
```

Items stagger-reveal one at a time. Ideal for 3-6 items.

When to use: list of steps, key takeaways, pros/cons, framework components.

Example invocations:
```json
{ "title": "5 Questions Every Data Audit Starts With", "items": ["Who owns the pixel?", "What's your MER baseline?", "Is GA4 server-side?", "Do you have a canonical ID graph?", "What's in the 'direct' bucket?"] }
{ "items": ["Acquisition", "Retention", "Expansion"] }
```

---

### WorkflowMap
**Composition IDs**: `TIN-WorkflowMap-16x9`, `TIN-WorkflowMap-9x16`  
**Default duration**: 240 frames (8s @ 30fps)

Props interface:
```ts
{
  steps: Array<{ n: number; label: string }>;
  transitionIn?: 'fade' | 'dip' | 'none';
  transitionOut?: 'fade' | 'dip' | 'none';
  durationFrames?: number;
  brandSlug?: string;
}
```

Steps animate in sequence with connecting arrows. Max ~5 steps for 16x9 legibility.

When to use: process flows, sequential systems, numbered frameworks.

Example invocations:
```json
{ "steps": [{"n":1,"label":"Raw Data"},{"n":2,"label":"Normalize"},{"n":3,"label":"Canonical Schema"},{"n":4,"label":"Dashboard"}] }
{ "steps": [{"n":1,"label":"Install Pixels"},{"n":2,"label":"Verify Events"},{"n":3,"label":"Test Attribution"}] }
```

---

### ComparisonSplit
**Composition IDs**: `TIN-ComparisonSplit-16x9`, `TIN-ComparisonSplit-9x16`  
**Default duration**: 210 frames (7s @ 30fps)

Props interface:
```ts
{
  left: { label: string; value: string };
  right: { label: string; value: string };
  vs?: string;
  transitionIn?: 'fade' | 'dip' | 'none';
  transitionOut?: 'fade' | 'dip' | 'none';
  durationFrames?: number;
  brandSlug?: string;
}
```

Left panel uses accent color; right uses text color. `vs` defaults to `'VS'`.

When to use: before/after, platform vs. reality, two competing metrics.

Example invocations:
```json
{ "left": {"label":"Platform ROAS","value":"4.1x"}, "right": {"label":"True MER","value":"1.8x"}, "vs": "vs" }
{ "left": {"label":"Reported","value":"$42K"}, "right": {"label":"Actual","value":"$31K"} }
```

---

### LowerThird
**Composition IDs**: `TIN-LowerThird-16x9`, `TIN-LowerThird-9x16`  
**Default duration**: 150 frames (5s @ 30fps)

Props interface:
```ts
{
  name: string;
  title: string;
  transitionIn?: 'fade' | 'dip' | 'none';
  transitionOut?: 'fade' | 'dip' | 'none';
  durationFrames?: number;
  brandSlug?: string;
}
```

Slides in from left, holds, slides out. Transparent background — composites over video.

When to use: speaker name tags, interview source IDs, contributor credits.

Example invocations:
```json
{ "name": "Mike", "title": "Founder — The Innovative Native" }
{ "name": "Chris Garzon", "title": "CEO — DEA" }
```

---

### EndCard
**Composition IDs**: `TIN-EndCard-16x9`, `TIN-EndCard-9x16`  
**Default duration**: 240 frames (8s @ 30fps)

Props interface:
```ts
{
  customMessage?: string;
  ctaText?: string;
  ctaUrl?: string;
  showSubscribe?: boolean;
  transitionIn?: 'fade' | 'dip' | 'none';
  transitionOut?: 'fade' | 'dip' | 'none';
  durationFrames?: number;
  brandSlug?: string;
}
```

Defaults: message from `brand.json.video_overlay.cta_default_fallback`, `ctaText='Learn More'`, `ctaUrl='https://theInnovativeNative.com'`, `showSubscribe=true`.

When to use: video outro, CTA close, lead magnet plug.

Example invocations:
```json
{ "customMessage": "Get the free data audit checklist", "ctaText": "Download", "ctaUrl": "https://tinn.me/audit" }
{ "showSubscribe": false, "ctaText": "Book a call", "ctaUrl": "https://cal.com/tin" }
```

---

### BarChart
**Composition IDs**: `TIN-BarChart-16x9`, `TIN-BarChart-9x16`  
**Default duration**: 240 frames (8s @ 30fps)

Props interface:
```ts
{
  title?: string;
  bars: Array<{ label: string; v: number }>;
  unit?: string;
  maxValue?: number;
  transitionIn?: 'fade' | 'dip' | 'none';
  transitionOut?: 'fade' | 'dip' | 'none';
  durationFrames?: number;
  brandSlug?: string;
}
```

Bars animate upward; highest bar uses primary accent color. `unit` appends to count-up values (e.g., `'%'`, `'x'`).

When to use: comparative metrics, channel breakdowns, performance benchmarks.

Example invocations:
```json
{ "title": "Revenue by Channel", "bars": [{"label":"Meta","v":42},{"label":"Google","v":31},{"label":"Email","v":18},{"label":"Organic","v":9}], "unit":"%" }
{ "bars": [{"label":"Q1","v":1.4},{"label":"Q2","v":2.1},{"label":"Q3","v":3.2},{"label":"Q4","v":2.8}], "unit":"x" }
```

---

### Timeline
**Composition IDs**: `TIN-Timeline-16x9`, `TIN-Timeline-9x16`  
**Default duration**: 240 frames (8s @ 30fps)

Props interface:
```ts
{
  events: Array<{ date: string; label: string }>;
  transitionIn?: 'fade' | 'dip' | 'none';
  transitionOut?: 'fade' | 'dip' | 'none';
  durationFrames?: number;
  brandSlug?: string;
}
```

Horizontal timeline with alternating above/below labels. Line draws left-to-right, dots stagger in.

When to use: historical milestones, product roadmap, content series arc.

Example invocations:
```json
{ "events": [{"date":"Jan","label":"Audit"},{"date":"Feb","label":"Clean"},{"date":"Mar","label":"Model"},{"date":"Apr","label":"Dashboard"}] }
{ "events": [{"date":"2020","label":"Spray & Pray"},{"date":"2022","label":"GA4 Migration"},{"date":"2024","label":"Canonical ID"}] }
```

---

### ProcessDiagram
**Composition IDs**: `TIN-ProcessDiagram-16x9`, `TIN-ProcessDiagram-9x16`  
**Default duration**: 210 frames (7s @ 30fps)

Props interface:
```ts
{
  input: string;
  transform: string;
  output: string;
  inputLabel?: string;
  transformLabel?: string;
  outputLabel?: string;
  transitionIn?: 'fade' | 'dip' | 'none';
  transitionOut?: 'fade' | 'dip' | 'none';
  durationFrames?: number;
  brandSlug?: string;
}
```

Three-node input → transform → output diagram. Transform node is highlighted with accent border. Labels default to `'Input'`, `'Process'`, `'Output'`.

When to use: data transformation, funnel abstraction, system architecture.

Example invocations:
```json
{ "input": "Raw Events", "transform": "Canonical Schema", "output": "MER Dashboard", "inputLabel": "Source", "transformLabel": "Normalize", "outputLabel": "Insight" }
{ "input": "Ad Click", "transform": "Multi-Touch Attribution", "output": "True ROAS" }
```

---

### IconGrid
**Composition IDs**: `TIN-IconGrid-16x9`, `TIN-IconGrid-9x16`  
**Default duration**: 210 frames (7s @ 30fps)

Props interface:
```ts
{
  title?: string;
  items: Array<{ icon: string; label: string }>;
  transitionIn?: 'fade' | 'dip' | 'none';
  transitionOut?: 'fade' | 'dip' | 'none';
  durationFrames?: number;
  brandSlug?: string;
}
```

`icon` is a static file path relative to `remotion-videos/public/` (e.g., `'icons/techsy/stripe.png'`). Max 9 items (truncated). Grid auto-calculates columns (1→3, 2→2, 3→3, 4→2x2, 5-6→3x2, 7-9→3x3).

When to use: tech stack overview, tool ecosystem, integration list.

Example invocations:
```json
{ "title": "Your Current Stack", "items": [{"icon":"icons/techsy/meta.png","label":"Meta Ads"},{"icon":"icons/techsy/google.png","label":"Google"},{"icon":"icons/techsy/ga4.png","label":"GA4"}] }
{ "items": [{"icon":"icons/techsy/stripe.png","label":"Stripe"},{"icon":"icons/techsy/klaviyo.png","label":"Klaviyo"}] }
```

---

## Pattern Interrupt Templates (Pattern-*-16x9 only)

### Pattern-NumberFlash-16x9
**Composition ID**: `Pattern-NumberFlash-16x9`  
**Default duration**: 45 frames (1.5s @ 30fps)

Props interface:
```ts
{ value?: string; label?: string; }
```

Defaults: `value='100%'`. Giant number bounces to scale. Background is brand `background` color.

When to use: shocking stat, quick proof point, pattern break mid-explanation.

Example invocations:
```json
{ "value": "64%", "label": "of spend untracked" }
{ "value": "3.2x", "label": "ROAS lift" }
```

---

### Pattern-IconFlash-16x9
**Composition ID**: `Pattern-IconFlash-16x9`  
**Default duration**: 45 frames (1.5s @ 30fps)

Props interface:
```ts
{ icon?: string; label?: string; }
```

Defaults: `icon='icons/techsy/stripe.png'`, `label='Tool'`. Icon 320x320 centered, label below.

When to use: tool callout, platform flash, quick branding moment.

Example invocations:
```json
{ "icon": "icons/techsy/meta.png", "label": "Meta Ads" }
{ "icon": "icons/techsy/ga4.png", "label": "GA4" }
```

---

### Pattern-QuoteBurst-16x9
**Composition ID**: `Pattern-QuoteBurst-16x9`  
**Default duration**: 60 frames (2s @ 30fps)

Props interface:
```ts
{ text?: string; emphasis?: string; }
```

Defaults: `text='Clarity compounds.'`. If `emphasis` matches a substring of `text`, that word renders in accent cyan.

When to use: mic-drop principle, memorable quote, key insight flash.

Example invocations:
```json
{ "text": "MER is the one number that doesn't lie.", "emphasis": "MER" }
{ "text": "Clarity compounds." }
```

---

### Pattern-WordFlash-16x9
**Composition ID**: `Pattern-WordFlash-16x9`  
**Default duration**: 30 frames (1s @ 30fps)

Props interface:
```ts
{ word?: string; position?: 'top' | 'center' | 'bottom'; }
```

Defaults: `word='SCALE'`, `position='center'`. Transparent background — overlays over footage. Giant word with cyan glow.

When to use: transition emphasis word, action word overlay, motivational flash.

Example invocations:
```json
{ "word": "AUDIT", "position": "center" }
{ "word": "NOW", "position": "bottom" }
```

---

### Pattern-BracketHighlight-16x9
**Composition ID**: `Pattern-BracketHighlight-16x9`  
**Default duration**: 60 frames (2s @ 30fps)

Props interface:
```ts
{ x?: number; y?: number; width?: number; height?: number; color?: 'cyan' | 'magenta'; }
```

Defaults: `x=760`, `y=390`, `width=400`, `height=300`, `color='cyan'`. Draws corner brackets (transparent background) around a screen region. Pulses subtly.

When to use: highlight a specific area in a screen recording or slide, focus attention on dashboard element.

Example invocations:
```json
{ "x": 600, "y": 300, "width": 500, "height": 250, "color": "cyan" }
{ "x": 1100, "y": 500, "width": 300, "height": 200, "color": "magenta" }
```

---

### Pattern-BumperFlash-16x9
**Composition ID**: `Pattern-BumperFlash-16x9`  
**Default duration**: 30 frames (1s @ 30fps)

Props interface:
```ts
{ direction?: 'left' | 'right' | 'up' | 'down'; }
```

Defaults: `direction='left'`. Cyan wipe covers then reveals frame. "TIN" monogram appears during full-cover. Transparent before/after — composites as transition.

When to use: scene transition wipe, brand bumper between sections.

Example invocations:
```json
{ "direction": "left" }
{ "direction": "up" }
```
