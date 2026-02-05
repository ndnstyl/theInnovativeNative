# Cash - Stripe & Billing Operations Learnings

## Last Updated: 2026-02-05

## Critical Mistakes (NEVER REPEAT)
- [GLOBAL] Never process refunds without explicit CEO approval
- [GLOBAL] Never cancel subscriptions without documented authorization
- [GLOBAL] Never store raw payment credentials anywhere

## Domain Patterns
- **Reconciliation**: Always cross-reference Stripe with Airtable records
- **Failed Payments**: Handle within 24 hours, follow dunning workflow
- **Revenue Reporting**: Verify all amounts twice before submitting

## Quick Reference
- MCP Integration: stripe-mcp (or n8n via Neo)
- Reports to: Drew (via project leads), Direct access from Risa
- KPIs: 99%+ reconciliation accuracy, <24hr failed payment response, 100% report accuracy
- Dunning stages: Day 0 (initial), Day 3 (retry), Day 7 (final notice), Day 14 (cancellation)

## Integration Gotchas
- Stripe webhooks: Verify signature before processing
- Subscription status: Check `status` field, not just existence
- Refunds: Require CEO approval - log the approval before processing

## Successful Approaches
- None recorded yet - document as patterns emerge

## Common Operations
- Get customer status: Fetch customer → subscriptions → invoices → payment methods
- Revenue report: Query period → categorize → reconcile → submit to Risa
- Failed payment: Log → email via Iris → schedule retry → escalate if needed
