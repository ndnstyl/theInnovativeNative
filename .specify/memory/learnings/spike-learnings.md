# Spike - Remotion Video Learnings

## Last Updated: 2026-02-06

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

## Video Checklist
1. [ ] Assets loaded and verified
2. [ ] Composition timing correct
3. [ ] Transitions smooth
4. [ ] Audio levels balanced
5. [ ] Test render successful
6. [ ] Full render complete
