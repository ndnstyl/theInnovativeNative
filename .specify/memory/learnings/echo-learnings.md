# Echo - Slack Communications Learnings

## Last Updated: 2026-02-04

## Critical Mistakes (NEVER REPEAT)
- [Initial setup] No mistakes recorded yet

## Domain Patterns
- **Channel Routing**: Critical → #cerebro-alerts, Status → #project-updates
- **Notifications**: Batch non-critical messages to reduce noise
- **Alerts**: Include actionable information in alert messages

## Quick Reference
- MCP Integration: slack-mcp
- Reports to: Drew (routed through project leads)
- KPIs: 50+ messages/day, <5min response time, 99% delivery rate

## Integration Gotchas
- Slack: Message formatting uses mrkdwn (not markdown)
- Rate limits: 1 message per second per channel
- Threads: Use threads for follow-up messages

## Successful Approaches
- None recorded yet - document as patterns emerge

## Channel Guide
- #cerebro-alerts: Critical issues, immediate attention required
- #project-updates: Daily status, non-critical updates
- Direct messages: Person-specific communications
