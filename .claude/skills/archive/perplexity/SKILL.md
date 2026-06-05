---
name: perplexity
description: Deep web research via Perplexity AI search API. Use for current events, competitor analysis, market research, technical deep-dives, and any query needing real-time web results with citations.
triggers:
  - "perplexity"
  - "deep search"
  - "web research"
  - "search the web for"
  - "find recent info"
  - "what's the latest on"
---

# Perplexity — Deep Web Research

## What this skill does
Runs structured web searches via the Perplexity API, returning cited results with URLs. Use when `WebSearch` isn't deep enough or you need multi-page synthesis with source attribution.

## Python SDK Usage

```python
import os
from perplexity import Perplexity

client = Perplexity(api_key=os.environ["PERPLEXITY_API_KEY"])

search = client.search.create(
    query="<your query here>",
    max_results=10,
    max_tokens=25000,
    max_tokens_per_page=2048
)

for result in search.results:
    print(f"{result.title}: {result.url}")
```

## MCP Usage
If the `perplexity` MCP server is connected, use the MCP tools directly (search via ToolSearch for `perplexity`).

## When to use
- Real-time web research needing citations
- Competitor/market analysis
- Technical documentation lookups
- Current events or recent announcements
- Any query where recency matters more than training data

## Env
- `PERPLEXITY_API_KEY` — set in `~/.claude/.mcp.json` under the `perplexity` server entry
