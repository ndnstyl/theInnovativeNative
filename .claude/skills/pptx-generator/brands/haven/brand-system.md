# A Slice of Haven — Brand System

> Warm, authentic kitchen lifestyle content that makes everyday home organization feel exciting, achievable, and share-worthy.

---

## Brand Philosophy

### Core Principles

1. **Warm Authenticity**
   Content feels like getting a recommendation from your best friend who just found the perfect kitchen hack. No polished infomercial energy — this is real, relatable, and genuine. The viewer should feel like Haven is talking directly to them in her kitchen.

2. **Aspirational Accessibility**
   Products are affordable ($15-30 range), the kitchen is clean but lived-in, and the message is always "you can have this too." Never intimidating, never luxury-gatekeeping. The aesthetic says "your home can look this good" not "look what I have."

3. **Visual Comfort**
   Warm tones, natural light, soft textures. The palette is inspired by honey, terracotta, warm wood, and cream — the colors of a kitchen that feels like home. Every frame should feel inviting.

4. **Product as Hero, Context as Story**
   The product is always clearly visible and purposeful, but it lives within a scene that tells a story. A spice rack isn't just organized — it's the reason dinner comes together effortlessly.

---

## Haven Avatar — Character Identity

### Physical Description (Canonical Reference)
- **Hair**: Medium-length curly/coily sandy blonde hair with golden highlights, natural texture
- **Skin**: Warm medium-brown complexion
- **Eyes**: Piercing green, expressive
- **Chin**: Very faint cleft chin
- **Lips**: Full lips
- **Build**: Average/athletic build
- **Age appearance**: Mid-20s to early 30s
- **Expression default**: Warm, confident, approachable — slight knowing smile

### Wardrobe System
| Context | Outfit | Notes |
|---------|--------|-------|
| Kitchen casual | Pink/blush tank top + jeans | Primary look (matches reference images) |
| Kitchen active | Apron over casual top | Cooking/organizing scenes |
| Lifestyle | Navy wrap dress + beige trench | "Going out" / elevated context |
| Seasonal | Cozy sweater + leggings | Fall/winter content |
| Bedroom/Closet | Soft loungewear/pajamas | Cozy, at-home organizing |
| Living Space | Casual oversized knit + jeans | Relaxed weekend organizing |

### Outfit-to-Room Mapping (MANDATORY)

| Room | Primary Outfit | Alternate | Never |
|------|---------------|-----------|-------|
| Kitchen | Pink tank + jeans | Apron over casual | Formal/lifestyle |
| Bedroom | Soft loungewear | Cozy sweater + leggings | Tank top/jeans |
| Living Space | Oversized knit + jeans | Seasonal sweater | Apron/sleepwear |
| Any (elevated) | Navy wrap dress | Lifestyle outfit | Apron/loungewear |

Always match outfit to room context. Never show Haven in an apron outside the kitchen or loungewear outside bedroom.

### Avatar Hand Styling
- **Nails**: Natural, clean, light polish (never decorative/distracting)
- **Jewelry**: Minimal (one ring max, no bracelets that jingle/distract)
- **Visibility**: Hands visible in product demo shots (shows authenticity)
- **Hands off-screen**: For close-up product shots (product is hero)

### Reference Images
Located in `cinema_knowledge/`:
- `Gemini_Generated_Image_ldehz9ldehz9ldeh.jpg` — Front face close-up (primary consistency anchor)
- `Gemini_Generated_Image_mzngjjmzngjjmzng.png` — 3/4 profile (side angle reference)
- `Gemini_Generated_Image_snx956snx956snx9.png` — Full body front (body proportion reference)
- `Gemini_Generated_Image_15fp7x15fp7x15fp.png` — Styled outfit (lifestyle variant reference)

### Consistency Markers (for Gemini prompts)
These must appear in EVERY avatar generation prompt:
```
Consistent character: young woman, mid-20s, warm medium-brown skin,
curly/coily sandy blonde hair with golden highlights shoulder-length,
piercing green eyes, very faint cleft chin, full lips, natural makeup, warm confident expression.
```

### Negative Prompt (always include)
```
Negative: straight hair, dark hair, pale skin, brown eyes, dark eyes, amber eyes,
heavy makeup, exaggerated expressions, cartoonish, anime style,
different person, inconsistent features
```

---

## Room System — Character Sheets

### Kitchen (Primary Room)
**Style**: Modern farmhouse with warm touches
- **Cabinets**: White shaker-style with brushed gold/brass hardware
- **Countertops**: Light quartz or butcher block
- **Backsplash**: White subway tile
- **Appliances**: Stainless steel (visible but not dominant)
- **Lighting**: Under-cabinet warm LED + pendant lights
- **Floor**: Light wood or light tile
- **Accent elements**: Small potted herbs, wooden cutting board, glass canisters

**Kitchen Prompt Template**:
```
Modern farmhouse kitchen, white shaker cabinets with brass hardware,
light quartz countertops, white subway tile backsplash, warm pendant
lighting, natural light from window, clean and organized but lived-in,
light wood flooring, warm ambient atmosphere.
```

### Bedroom / Closet (Active)
**Style**: Cozy neutral sanctuary
- **Bed**: King/queen with cream/ivory linen bedding, layered throws in soft beige and warm gray
- **Headboard**: Upholstered in natural linen or warm wood panel
- **Nightstand**: Warm wood (walnut or oak) with brass/gold hardware
- **Lighting**: Warm bedside lamp with linen shade + soft ambient string lights or warm sconces
- **Rug**: Neutral textured rug (jute or cream wool) on light hardwood floor
- **Closet area**: Open closet/wardrobe with organized shelves, woven baskets, warm wood hangers
- **Accent elements**: Small potted plant, candle, stack of books, woven basket
- **Window**: Sheer cream curtains with warm natural light filtering through
- **Wall color**: Warm white or soft greige

**Bedroom Prompt Template**:
```
Cozy bedroom sanctuary, cream linen bedding layered with warm beige throws,
upholstered headboard in natural linen, warm walnut nightstand with brass
hardware, soft ambient lamplight, sheer cream curtains filtering warm natural
light, light hardwood floor with textured jute rug, minimal warm decor,
candle and small potted plant on nightstand, serene and inviting atmosphere.
```

**Closet Prompt Template**:
```
Organized walk-in closet area, warm wood shelving with brass hardware,
woven storage baskets, neatly arranged clothing on warm wood hangers,
soft ambient lighting, cream walls, light hardwood floor, organized
accessories and folded items, clean and satisfying visual organization.
```

### Living Space (Active)
**Style**: Comfortable modern with warm accents
- **Sofa**: Neutral linen or bouclé sofa (cream, warm beige, or soft gray) with warm-toned throw pillows (terracotta, mustard, rust)
- **Coffee table**: Warm wood (walnut or oak) with rounded edges, or woven rattan
- **Side table**: Matching warm wood or brass accent table
- **Lighting**: Floor lamp with warm shade + natural window light
- **Rug**: Large textured area rug (cream, jute, or warm geometric pattern)
- **Plants**: 2-3 potted plants (fiddle leaf fig, monstera, or trailing pothos)
- **Shelving**: Open wood shelving with curated decor (books, ceramic vases, woven baskets)
- **Blanket**: Chunky knit or waffle-weave throw draped on sofa arm
- **Floor**: Light hardwood or light wood-look tile
- **Wall color**: Warm white with one warm accent wall (optional soft terracotta or warm greige)

**Living Space Prompt Template**:
```
Comfortable modern living room, neutral linen sofa with warm terracotta
and mustard throw pillows, warm walnut coffee table, large jute area rug,
floor lamp with warm light, fiddle leaf fig plant in corner, open wood
shelving with books and ceramic vases, chunky knit throw draped on sofa
arm, warm natural light from large window, light hardwood floor, open
and airy feeling with warm inviting atmosphere.
```

---

## Color System

### Primary Palette — Warm Kitchen Tones

| Name | Hex | Use |
|------|-----|-----|
| Terracotta | `#D4956A` | Primary accent, CTA buttons, highlight overlays |
| Warm Brown | `#8B6F47` | Secondary accent, text emphasis |
| Peach Glow | `#E8B898` | Soft backgrounds, caption backgrounds |

### Theme Base (Light — default for UGC)

```
Background:     #FFF8F0  (warm cream)
Background Alt: #FFF1E6  (soft peach)
Surface:        #FFFFFF  (clean white)
Text Primary:   #2C1810  (deep warm brown)
Text Secondary: #6B4D3A  (medium warm brown)
```

### Video Overlay Colors

| Element | Background | Text | Notes |
|---------|-----------|------|-------|
| Hook text | None (shadow) | `#FFFFFF` | Bold white with drop shadow |
| Caption bar | `#D4956A` @ 85% | `#FFFFFF` | Terracotta pill shape |
| CTA bar | `#2C1810` @ 90% | `#FFFFFF` | Dark brown, high contrast |
| Feature callout | `#FFFFFF` @ 80% | `#2C1810` | White card on scene |
| Price tag | `#8B6F47` | `#FFFFFF` | Warm brown badge |

---

## Typography

### Font Stack

- **Heading**: Playfair Display — Elegant serif for titles, headlines
- **Body/UGC Overlay**: Inter — Clean sans-serif for all video text overlays
- **Code**: JetBrains Mono — Technical content only

### Video Text Rules

| Element | Font | Weight | Size (1080w) | Max Lines |
|---------|------|--------|-------------|-----------|
| Hook text | Inter | 800 (ExtraBold) | 64-72px | 2 |
| Caption | Inter | 700 (Bold) | 48-56px | 1 |
| Feature text | Inter | 600 (SemiBold) | 40-48px | 2 |
| CTA text | Inter | 700 (Bold) | 52-60px | 2 |
| Price | Inter | 800 (ExtraBold) | 56px | 1 |
| Subtitle/SRT | Inter | 700 (Bold) | 44px | 2-3 words |

### Text Shadow (for video overlays)
```
Shadow: 2px 2px 8px rgba(0,0,0,0.6)
```
Apply to ALL text on video to ensure readability regardless of background.

---

## Photography & Image Direction

### UGC Style
- **Lighting**: Natural window light preferred, warm and soft
- **Mood**: Inviting, lived-in, achievable
- **Composition**: Products at eye-level or slightly above, in-context always
- **Color temperature**: Warm (5500K-6500K), never cool/blue
- **Depth of field**: Shallow when product is hero, wider for room context

### Product Photography
- Product always in-context (inside cabinet, on counter, being used)
- Hands in frame when demonstrating (Haven's hands)
- Before/after compositions for organization products
- Close-up detail shots for features
- Never isolated on white background (that's Amazon's job)

### Banned Visuals
- Cool/blue color temperatures
- Harsh direct flash
- Cluttered messy backgrounds (even for "before" shots, keep it real not disgusting)
- Text overlapping product in ways that obscure it
- Generic stock photo compositions

---

## Video Structure Templates

### B-Roll (30s, no voice)
```
[0-3s]   Hook: Bold text overlay on product hero shot
[3-8s]   Product detail: slow Ken Burns on features
[8-15s]  Product-in-context: installed/being used in kitchen
[15-22s] Feature callouts: text overlays on detail shots
[22-27s] Lifestyle shot: organized kitchen, satisfied feel
[27-30s] CTA: "Link in bio" + product name + price
```

### Talking Head (30s, with voice)
```
[0-3s]   Hook: Haven + bold text ("Wait till you see this")
[3-8s]   Haven talking: voiceover segment 1 (the problem)
[8-12s]  Product cutaway: voiceover segment 2 (the solution)
[12-18s] Demo: Haven using product + voiceover segment 3
[18-25s] Results: organized space + voiceover segment 4
[25-30s] CTA: Haven + text overlay + product shot
```

### Cinematic (30s, voice + music)
```
[0-2s]   Mood: atmospheric kitchen shot, music rises
[2-5s]   Hook: Haven enters frame, text overlay
[5-12s]  Story: montage of "the problem" (messy cabinet)
[12-15s] Reveal: product introduction, music shift
[15-22s] Transformation: quick-cut installation montage
[22-27s] Result: beauty shots of organized space
[27-30s] CTA: product + price + "link in bio"
```

---

## FFMPEG Video Specs

### Ken Burns Effect Parameters
- **Zoom range**: 1.0x to 1.15x (subtle, not nauseating)
- **Pan direction**: Varies per scene (left-right, top-bottom, center-out)
- **Duration per scene**: 3-5 seconds
- **Easing**: Smooth ease-in-out

### Transitions
- **Primary**: Crossfade (1.0s) — smooth, warm
- **Accent**: Wipe-right (0.5s) — for before/after reveals
- **Quick-cut**: Hard cut (0s) — for montage sequences only

### Audio Mix
| Layer | Volume | Notes |
|-------|--------|-------|
| Music (B-Roll) | 0.4 | Ambient, upbeat |
| Music (Talking Head) | 0.15 | Ducked under voice |
| Voice | 1.0 | Primary, never ducked |
| SFX (optional) | 0.3 | Subtle transitions |

### Caption/Subtitle Styling (SRT burn-in)
```
Font: Inter Bold
Size: 44px
Color: #FFFFFF
Background: #D4956A @ 85% opacity
Padding: 8px 16px
Border Radius: 8px (via box styling)
Position: Center, 70% from top
Max words: 2-3 per caption frame
Animation: Pop-in scale (0.8 → 1.0, 150ms)
```

---

## Content Framing (MANDATORY)

Haven is a **home organization enthusiast and content creator**, NOT a product expert or interior designer.

### Emotional Storytelling Arc

Every video follows a 3-beat emotional progression:

| Beat | Scene | Emotion | Haven's Energy | Lighting |
|------|-------|---------|---------------|----------|
| 1 | Opener | DISCOVERY | Curious, anticipation | Loop lighting, soft |
| 2 | Product | VALIDATION | Confident, engaged | Butterfly, product-lit |
| 3 | Close | SATISFACTION | Warm, content | Broad, slightly brighter |

**Visual Callbacks**: Opener shows the "problem" (messy cabinet), Product shows the solution, Close shows the result (same space, now organized). This before→during→after arc is what makes the content satisfying.

### Soft CTA vs Hard CTA

**Soft CTA (DEFAULT — use for all Haven content)**:
- "Link in bio if you want this one"
- "I'll leave the link if you're curious"
- "This one's been in my kitchen for 3 weeks — link below"
- Tone: peer recommendation, not sales pitch
- Viewer keeps decision ownership

**Hard CTA (NEVER use in video — only in captions if needed)**:
- "Buy now before it sells out" — NO
- "Use my code for 20% off" — NO
- "Don't miss this deal" — NO

**Why**: Soft CTA creates trust through assumed viewer intelligence. Hard CTA breaks the "best friend recommendation" positioning.

### Product Category Guardrails

**Approved Categories**:
- **Primary**: Kitchen organization, storage, access (spice racks, dividers, containers, labels)
- **Secondary**: Home organization beyond kitchen (closet, bedroom, bathroom)
- **Tertiary** (rare, needs approval): Small appliances, kitchen accessories, decor

**Product Exclusion Rules** (NEVER feature):
- Luxury high-end ($300+) products (breaks aspirational accessibility)
- Commercial/professional organizing systems
- Cheaply-made/flimsy products (erodes trust)
- Products requiring expert installation
- Anything marketed to "professional organizers"

**Price Positioning**:
- **Sweet spot**: $10-$50 (impulse-friendly, quality-considered)
- **Upper limit**: $80-$100 (sparingly, requires "worth it" language)
- Always mention price in narration ("under $25," "less than a coffee")

**Quality Threshold**: 4.0+ star rating on Amazon, 50+ reviews, no major durability complaints.

### Camera Angles by Product Type

| Product Size | Primary Angle | Secondary | Purpose |
|-------------|--------------|-----------|---------|
| Small (spice rack, divider) | Medium shot | Close-up detail | Shows Haven + product clearly |
| Large (closet system) | Wide shot | Medium shot | Shows room context |
| Detail features | Close-up | Over-shoulder | Shows quality, durability |
| Installation demo | Over-shoulder | Medium shot | Shows Haven's hands working |

### Voice Rules
- "I found this amazing organizer" — YES (personal discovery)
- "This is the best spice rack on the market" — NO (expert claim)
- "My cabinet went from chaos to this" — YES (personal experience)
- "Professional organizers recommend" — NO (false authority)
- "I've been using this for 2 weeks and..." — YES (authentic review)
- "Studies show organized homes..." — NO (academic authority)

### Attribution Hooks (from constitution)
- "So I was reorganizing my kitchen and..."
- "Okay but why did nobody tell me about this sooner"
- "POV: you finally organize that one cabinet"
- "Things in my kitchen that just make sense"
- "Under $25 finds that changed my kitchen"

---

## Platform-Specific Adjustments

### Instagram Reels
- Hook in first 1.5 seconds (thumb-stopping)
- Text safe zone: 15% margin all sides
- CTA: "Link in bio" (no clickable links)
- Hashtag strategy in caption, not in video
- Trending audio consideration (music selection)

### TikTok
- Hook in first 1 second (even faster)
- Bottom 20% reserved for UI overlay (username, captions)
- "TikTok made me buy it" framing works well
- Faster pacing acceptable (2-3s per scene vs 4-5s)
- Text-to-speech style captions (2-3 word pop-ups)

---

*Last updated: 2026-02-09 (v2 — storytelling arc, guardrails, outfit mapping added)*
