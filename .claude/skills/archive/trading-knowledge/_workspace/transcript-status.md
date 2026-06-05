# Transcript Status

- Videos kept (filter output): 50
- Transcripts successfully downloaded via yt-dlp android client: 50
- Fallback-only (title+description): 0
- Failed: 0

**Method:** yt-dlp with `--extractor-args "youtube:player_client=android"` bypassed the SABR/PO-token issue that blocked the default web client. All 50 kept videos had auto-captions available.

**Post-processing:** VTT → TXT via Python. Stripped WEBVTT headers, timestamps, inline `<c>` tags, deduped consecutive repeat lines (YouTube auto-caption artifact).

**Size:** ~157,671 words total across 50 transcripts.
- Smallest: RuFZwxVcWoE (080 Options Stocks for Less) — 1,529 words
- Largest: OW3OYda8S1Q (072 Options Trade Live) — 6,161 words

**Coverage:**
- Playlist 1 (recession): 4/4
- Playlist 2: 46/46 of filtered set

No captions failed. This is the cleanest possible outcome given that the previous research agent had trouble — the android player client trick worked.
