# Cal - Calendar Operations Learnings

## Last Updated: 2026-02-05

## Critical Mistakes (NEVER REPEAT)
- [GLOBAL] Never create, modify, or delete calendar events without explicit CEO approval
- [GLOBAL] Never ignore detected scheduling conflicts
- [GLOBAL] Never share calendar details externally

## Domain Patterns
- **Conflict Detection**: Check hard conflicts, soft conflicts (buffer <15min), and travel conflicts
- **Notification Routing**: Critical conflicts → Echo (#cerebro-alerts) + Iris (email)
- **Availability Checks**: Apply minimum duration filter to free slots

## Quick Reference
- MCP Integration: google-calendar-mcp (or n8n via Neo)
- Reports to: Drew (via project leads), Direct access from Jenna
- KPIs: 100% conflict detection, <5% false positives, <5min notification latency
- Default buffer time: 15 minutes between events

## Integration Gotchas
- Google Calendar API: OAuth tokens expire - handle refresh gracefully
- Time zones: Always verify timezone consistency in conflict detection
- Recurring events: Check all instances, not just the series

## Successful Approaches
- None recorded yet - document as patterns emerge

## Common Operations
- Conflict check: Fetch events → sort by time → compare pairs → apply buffer → report
- Availability check: Fetch events → find gaps → filter by duration → return windows
- Daily scan: Today + 7 days → identify conflicts → summarize to Jenna
