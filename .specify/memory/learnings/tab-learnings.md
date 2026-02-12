# Tab - Airtable Operations Learnings

## Last Updated: 2026-02-11

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
- **Airtable Metadata API view limitation**: API can READ view IDs but CANNOT CREATE views programmatically. Views must be created through Airtable UI or Scripting extensions. Document view specifications for manual creation instead of attempting API automation.

## Successful Approaches
- **Direct Airtable REST API**: Use when MCP unavailable for more reliable operations
- **Batch Record Creation**: Create multiple KPI baseline records in single API calls for efficiency
- **Pain Point Import (2026-02-06)**: Successfully imported 42 competitor pain points across 5 API batches, respecting 10-record batch limits

## Session Learnings (2026-02-06 - Cerebro Research)
- Lock-in messaging dominates legal AI pain points - users frustrated by multi-year contracts
- 17% Lexis hallucination rate (Stanford study) is powerful competitive stat for ad copy
- Mid-market whitespace is real - Harvey AI targets BigLaw only at $1K+/user/month
- Practice-specific research needs more work (bankruptcy/criminal coverage is thin)
- Reddit API workaround effective when WebSearch blocked
- Source field in Competitor Pain Points table is single-select - some sources (eesel.ai, Legally Disrupted) not in dropdown options

## Session Learnings (2026-02-06 - ROI Calculator Spec)
- **Deliverable**: Created comprehensive ROI Calculator specification for Stan Store Law Firm Funnel
- **Format**: Google Sheets spec with 3 tabs (Input, Phase-by-Phase ROI, Summary Dashboard)
- **Complexity**: 50+ formulas documented, 4 implementation phases, 3 practice-area benchmarks
- **Structure Approach**: CSV-ready tables + explicit Google Sheets formulas (ready to paste)
- **User-Friendliness**: Named ranges for clarity, conditional formatting specs, test case with expected results
- **Practice Areas**: Bankruptcy, Criminal Defense, Administrative Law (each with realistic baseline values)
- **ROI Calculation Pattern**: Phase-specific improvements with cumulative annual projection
- **Documentation Quality**: Full CEO instructions for Google Sheets implementation, maintenance notes, disclaimer text
- **File Location**: /Users/makwa/theinnovativenative/deliverables/002-stan-store-lawfirm-funnel/assets/roi-calculator-spec.md
- **Next Steps**: User builds Google Sheets from spec, uploads to Google Drive, logs deliverable URL to Airtable

## Session Learnings (2026-02-11 - BowTie Bullies Data Ops)
- **Character Sheets table missing**: Table ID `tbl8pQ9WlCikdesYf` referenced in task instructions does not exist in base `appTO7OCRB2XbAlak`. Verified by listing all 25 tables via metadata API. Likely was planned but never created, or was in a different base. Always verify table existence before assuming "existing" tables are present.
- **MCP param format**: airtable-mcp uses camelCase params (`baseId`, `tableId`, `maxRecords`) not snake_case. First attempt with `base_id` failed with validation error.
- **Deliverables Type field gap**: No "Music Track" select option exists. Music tracks created without Type assignment. Schema update needed to add "Music Track" option to Type field.
- **Mood field pre-populated**: All 5 mood options (Somber, Tense, Reflective, Defiant, Triumphant) were already configured in Deliverables table from prior schema work. No field creation needed.
- **Placeholder record pattern**: When upstream dependency (T008 Creative) not complete, create Draft status placeholders with descriptive Notes. Allows downstream pipeline refs while marking incomplete.
- **Dashboard views**: Documented 5 view specifications for Video Analytics table. Airtable view API limitation confirmed again - must create via UI.

## Common Operations
- Create: Validate required fields first
- Update: Check record exists before update
- Delete: Always confirm before bulk delete
- Sync: Use modified time for incremental syncs
