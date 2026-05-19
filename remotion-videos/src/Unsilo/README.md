# Unsilo - How to Unf*ck Your Data (Marketing Blueprint)

Animated overlay graphics for the YouTube video at the same title. Each scene composites over Mike's face-cam B-roll footage - backgrounds are transparent (radial dark overlay, not a filled AbsoluteFill).

## Scene map

| ID | File | Script beat |
|----|------|-------------|
| S01 | S01FiveQuestions | 0:00-0:45 cold open - the 5 diagnostic questions + clock |
| S02 | S02StackMap | 2:30-7:00 the 24-silo ring diagram |
| S03 | S03MerBreakdown | 7:00-12:00 MER formula + question mark inputs |
| S04 | S04RoasOverAttr | 7:00-12:00 $300 reported vs $100 real over-attribution punch |
| S05 | S05KnifeFight | 12:00-16:00 marketing vs revops definitions conflict |
| S06 | S0664Gap | 12:00-16:00 216 MQLs vs 78 SQLs bar chart |
| S07 | S07FourTabAudit | 16:00-19:00 spreadsheet with 4 tabs |
| S08 | S08IdentifierGraph | 16:00-19:00 5-node ID resolution graph |
| S09 | S09FiveLayerSpine | 19:00-23:00 CAPTURE to ACTIVATE stack |
| S10 | S10CanonicalSchema | 19:00-23:00 5 warehouse tables |
| S11 | S11EightKpis | 23:00-25:30 4x2 KPI card grid |
| S12 | S12CfoMondayView | 25:30-27:30 CFO dashboard table |

## Render commands

Single scene (H.264 for editing):
```
npm run unsilo:s01-16x9   # 1920x1080, 30fps, h264
npm run unsilo:s01-9x16   # 1080x1920 vertical cut
```

ProRes 4444 (for After Effects composite with transparency):
```
npm run unsilo:s01-prores  # yuva444p10le, true alpha channel
```

All 24 H.264 outputs in sequence:
```
npm run unsilo:all-h264
```

## Duration

180 frames = 6 seconds at 30fps per scene. Reveal animations span 0-4.5s (135 frames), 1.5s hold at the end. Extend by editing the `durationInFrames` value in Root.tsx per scene as needed.

## Transparency note

The SceneFrame uses a radial dark overlay (not a filled background) to keep text legible over footage. To get true alpha for After Effects/Premiere compositing, render with the ProRes command above - the `yuva444p10le` pixel format carries the alpha channel. The H.264 renders will show a black background in QuickTime since MP4 does not carry alpha.

## Brand rules enforced

- Cyan (#00FFFF) primary - structure, titles, all main drawing
- Magenta (#FF00FF) RARE - warnings, broken numbers, punchlines only (1-2 per scene)
- No em dashes in any on-screen text
- Fonts: Caveat (hand labels), JetBrains Mono (technical), Space Grotesk (titles)
