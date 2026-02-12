# Pattern: UK Local Business Enrichment

**Category**: enrichment
**Source Workflow**: UK Local Services - Premium Enrichment
**Source Workflow ID**: 4ps5viE4lArxFXas
**Extracted**: 2026-02-05
**Extracted By**: Neo

---

## Use Case

Batch data enrichment pipeline that:
1. Fetches businesses from Airtable that need enrichment
2. Scrapes contact details from business websites using Apify
3. Merges and validates enriched data
4. Updates Airtable records with new information
5. Logs enrichment results for tracking

Best for: Lead enrichment, business data augmentation, CRM data quality improvement.

---

## Key Nodes

| Node Name | Node Type | Purpose |
|-----------|-----------|---------|
| Webhook Trigger | n8n-nodes-base.webhook | Initiates enrichment batch |
| Get Batch Config | n8n-nodes-base.airtable | Retrieves batch settings |
| Get Businesses for Premium Enrichment | n8n-nodes-base.airtable | Fetches records needing enrichment |
| Has Businesses? | n8n-nodes-base.if | Guards empty batch processing |
| Contact Details Scraper | @apify/n8n-nodes-apify.apify | Scrapes websites for contact info |
| Merge and Prepare Updates | n8n-nodes-base.code | Combines scraped data with existing |
| Has Updates? | n8n-nodes-base.if | Checks if new data was found |
| Update Business | n8n-nodes-base.airtable | Updates Airtable with enriched data |
| Create Enrichment Record | n8n-nodes-base.airtable | Logs enrichment attempt |
| Aggregate Stats | n8n-nodes-base.code | Calculates batch statistics |
| Trigger Data Quality | n8n-nodes-base.executeWorkflow | Triggers validation workflow |

---

## Configuration

### Required Credentials
- **Airtable**: For reading/writing business records
- **Apify**: For web scraping (Contact Details Scraper actor)

### Environment Variables
- `AIRTABLE_BASE_ID`: Target Airtable base
- `APIFY_TOKEN`: Apify API token

### Key Parameters
```json
{
  "airtableFilter": {
    "filterByFormula": "AND({Enrichment Status}='Pending', {Website}!='')",
    "description": "Only enrich records with websites that haven't been enriched"
  },
  "apifyActor": {
    "actorId": "apify/contact-details-scraper",
    "description": "Extracts email, phone, social links from websites"
  },
  "batchSize": {
    "value": 50,
    "description": "Number of records to process per run (rate limit friendly)"
  }
}
```

---

## Reusable JSON

Copy this JSON snippet for the core enrichment pattern:

```json
{
  "nodes": [
    {
      "parameters": {
        "operation": "list",
        "application": "{{ $env.AIRTABLE_BASE_ID }}",
        "table": "Businesses",
        "limit": 50,
        "filterByFormula": "AND({Enrichment Status}='Pending', {Website}!='')"
      },
      "name": "Get Businesses for Enrichment",
      "type": "n8n-nodes-base.airtable",
      "typeVersion": 2.1
    },
    {
      "parameters": {
        "conditions": {
          "conditions": [
            {
              "leftValue": "={{ $json.records.length }}",
              "rightValue": 0,
              "operator": { "type": "number", "operation": "gt" }
            }
          ]
        }
      },
      "name": "Has Businesses?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2
    },
    {
      "parameters": {
        "operation": "update",
        "application": "{{ $env.AIRTABLE_BASE_ID }}",
        "table": "Businesses",
        "id": "={{ $json.id }}",
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "Email": "={{ $json.enrichedEmail }}",
            "Phone": "={{ $json.enrichedPhone }}",
            "Enrichment Status": "Complete",
            "Enriched Date": "={{ $now.toISO() }}"
          }
        }
      },
      "name": "Update Business",
      "type": "n8n-nodes-base.airtable",
      "typeVersion": 2.1
    }
  ]
}
```

---

## Gotchas

- **Apify rate limits**: Free tier has limited monthly runs - use batch processing
- **Website availability**: Many small business websites are offline - handle 404s gracefully
- **Data quality**: Scraped data needs validation - emails may be contact forms, not addresses
- **filterByFormula syntax**: Use `{Field Name}='value'` NOT `={Field Name}='value'`
- **Duplicate prevention**: Always check if record was already enriched before processing
- **GDPR compliance**: Ensure data enrichment complies with privacy regulations

---

## Related Patterns

- [UK Local Services Discovery](./uk-local-discovery.md) - Finding new businesses
- [UK Local Services Scoring](./uk-local-scoring.md) - Rating enriched businesses

---

## Changelog

| Date | Change | By |
|------|--------|-----|
| 2026-02-05 | Initial extraction from UK Local Services pipeline | Neo |
