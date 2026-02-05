# Neo - n8n Workflows Learnings

## Last Updated: 2026-02-04

## Critical Mistakes (NEVER REPEAT)
- [GLOBAL] Never test workflows with Apify HTTP nodes
- [GLOBAL] Only the user tests n8n workflows

## Domain Patterns
- **Workflow Design**: Keep workflows modular and reusable
- **Error Handling**: Always add error branches for critical nodes
- **Webhooks**: Verify webhook URLs before deployment

## Quick Reference
- MCP Integration: n8n-mcp
- Reports to: Drew (routed through project leads)
- KPIs: 5+ workflows/week, <5% error rate, 95%+ execution success

## Integration Gotchas
- n8n: Rate limits vary by integration
- Webhooks: Test with small payloads first
- Database nodes: Check for existing data before migrations

## Successful Approaches
- None recorded yet - document as patterns emerge

## Common Node Patterns
- HTTP Request: Always set timeout
- Set: Use for data transformation
- IF: Keep conditions simple
- Error Trigger: Add to all critical workflows
