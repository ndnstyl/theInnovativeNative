# Spike - Remotion Video Learnings

## Last Updated: 2026-02-11

## Critical Mistakes (NEVER REPEAT)
- [Initial setup] No mistakes recorded yet

## Domain Patterns
- **Compositions**: Plan duration and transitions before coding
- **Assets**: Verify all assets load before full render
- **Exports**: Test with short segments before full export

## Quick Reference
- MCP Integration: None (uses Remotion framework)
- Reports to: Drew (routed through project leads)
- KPIs: 3+ videos/week, 100% export success

## Integration Gotchas
- Remotion: Check audio/video sync
- Assets: Preload assets to avoid render failures
- Memory: Long videos can cause memory issues

## Successful Approaches
- **AAVE orthography for TTS**: Spell words how character says them → TTS reads naturally. See creative-learnings.md for full details.
- **Note**: Spike is DEPRECATED — consolidated into Creative. See `.claude/skills/workers/creative/SKILL.md`

## Session: Cerebro Legal RAG Frontend (2026-02-06)

### Components Created
Created full component structure for Cerebro Legal RAG interface:

**File Structure**:
```
websiteStuff/src/components/cerebro/
├── CerebroApp.tsx           # Main layout with split panels
├── types/
│   └── cerebro.types.ts     # Full TypeScript interfaces
├── hooks/
│   └── useCerebroQuery.ts   # n8n webhook integration
├── Header/
│   └── PracticeAreaSelector.tsx  # Practice area dropdown
├── SearchPanel/
│   ├── ResultCard.tsx       # Search result display
│   └── AuthorityBadge.tsx   # Authority level badges
├── ChatPanel/
│   ├── ChatMessage.tsx      # AI/User messages
│   └── InlineCitation.tsx   # Clickable citations
└── InputBar/
    └── InputBar.tsx         # Query input with mode toggle
```

### Patterns Applied
1. **Inline Styles for Portability**: Used inline styles alongside Tailwind for color values to ensure components work even without custom Tailwind config
2. **No External UUID Dependency**: Created simple `generateId()` function instead of importing uuid package
3. **Accessible Components**: All interactive elements have aria-labels, keyboard navigation, focus indicators
4. **Citation Highlighting**: Click citation in chat -> highlights and scrolls to result in left panel

### Environment Integration
- Webhook URL configurable via `NEXT_PUBLIC_CEREBRO_WEBHOOK_URL` env var
- Falls back to `/webhook/cerebro-query` for same-origin deployment

### Color System (from spec)
```css
--cerebro-primary: #1a365d;    /* Deep blue */
--cerebro-secondary: #2b6cb0;  /* Medium blue */
--cerebro-accent: #d69e2e;     /* Gold */
--badge-scotus: #d69e2e;
--badge-circuit: #2b6cb0;
--badge-district: #38a169;
--badge-agency: #805ad5;
--badge-statute: #dd6b20;
```

### Skills Gap
- None - React/TypeScript component creation is core competency

## Session: BowTie Video Pipeline — Render Bug Fixes & New Compositions (2026-02-11)

### IntroSequence Render Bug Fix
- **Bug**: `interpolate()` crashed with "inputRange must be strictly monotonically non-decreasing" error
- **Root Cause**: Duplicate values in `inputRange` array — e.g., two identical frame numbers when start/end of adjacent keyframes coincide
- **Fix**: Ensure every value in `inputRange` is strictly greater than the previous. When two keyframes share a boundary frame, offset the second by +1 frame
- **Rule**: ALWAYS validate `inputRange` arrays have no duplicate or decreasing values before render. Remotion does NOT tolerate `[0, 30, 30, 60]` — must be `[0, 30, 31, 60]`

### StatCallout Composition Pattern
- Animated stat counter with unit label — uses `interpolate()` for number counting + scale entrance
- Accept `stat`, `label`, `unit` props for reuse across episodes
- Timing: fade in → count up → hold → fade out within allocated frames

### QuoteCard Composition Pattern
- Full-screen quote with attribution — text entrance via opacity + translateY
- Background uses brand gradient with FilmGrainOverlay for texture
- Quote mark decorative element scales in before text for visual hierarchy

### CaptionTrack Integration
- SRT-style caption data parsed into frame-accurate subtitle overlay
- Positioned in lower-third safe zone with semi-transparent background pill
- Syncs to VO audio timing via frame offsets calculated from SRT timestamps
- Word-level highlighting optional (requires word-level timestamps from TTS)

### Note
Spike is DEPRECATED — consolidated into Creative. Remotion-specific learnings still logged here as technical reference. See `.claude/skills/workers/creative/SKILL.md`.

---

## Video Checklist
1. [ ] Assets loaded and verified
2. [ ] Composition timing correct
3. [ ] Transitions smooth
4. [ ] Audio levels balanced
5. [ ] Test render successful
6. [ ] Full render complete
