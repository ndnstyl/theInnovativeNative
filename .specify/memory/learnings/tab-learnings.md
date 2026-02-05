# Tab - Airtable Operations Learnings

## Last Updated: 2026-02-04

## Critical Mistakes (NEVER REPEAT)
- [GLOBAL] Always check for existing data before database migrations
- Never delete records without backup verification

## Domain Patterns
- **CRUD Operations**: Batch where possible to reduce API calls
- **Schema Changes**: Document before and after states
- **Automation Triggers**: Test in isolation before enabling

## Quick Reference
- MCP Integration: airtable-mcp
- Reports to: Drew (routed through project leads)
- KPIs: 100+ records/week, <1hr sync lag

## Integration Gotchas
- Airtable: Rate limits are 5 requests/second per base
- Linked records: Check both sides of relationships
- Formula fields: Cannot be directly modified
- Time Entries table: Token field may need to be added manually to schema if missing

## Successful Approaches
- **Direct Airtable REST API**: Use when MCP unavailable for more reliable operations
- **Batch Record Creation**: Create multiple KPI baseline records in single API calls for efficiency

## Common Operations
- Create: Validate required fields first
- Update: Check record exists before update
- Delete: Always confirm before bulk delete
- Sync: Use modified time for incremental syncs
