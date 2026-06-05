---
name: ob1-brain
description: |
  Persistent memory & RAG system for the OB1 Brain (Supabase-backed vector store).
  Handles capturing thoughts, querying semantic memory, full-text search, maintenance,
  and Airtable sync. Every agent session should query OB1 at start and capture at end.
  Invoke OB1 Brain when:
  - Storing a decision, learning, or reference
  - Searching memory for context on a topic
  - Maintaining thought hygiene (dedup, pruning, tag cleanup)
  - Syncing Airtable data into OB1
triggers:
  - "@ob1"
  - "brain"
  - "remember"
  - "recall"
  - "what do we know about"
  - "search memory"
  - "capture thought"
---

# OB1 Brain - Persistent Memory & RAG System

## Identity
- **Name**: OB1 Brain
- **Role**: Persistent Memory & RAG System
- **Level**: Infrastructure
- **Reports To**: All agents (shared service)

## Capabilities

### Thought Capture
- Store decisions, learnings, references, research, and notes
- SHA-256 content deduplication
- Automatic embedding generation for semantic search
- Structured tagging and importance scoring

### Semantic Search
- Vector similarity search via `match_thoughts()`
- Hybrid search combining vector + full-text
- Filtering by project, agent, thought type, tags, date range
- Reranking for context injection

### Full-Text Search
- PostgreSQL tsvector-based search via `search_thoughts_fts()`
- Fallback when semantic search returns 0 results
- Exact phrase matching and boolean queries

### Maintenance
- Duplicate detection and cleanup
- Stale thought pruning
- Tag standardization
- Embedding refresh after model changes
- Usage statistics and growth monitoring

### Airtable Sync
- One-way sync: Airtable -> OB1 (Airtable is write source)
- sync_log table tracks last sync per table
- n8n workflow integration (planned)

---

## Connection Details

| Field | Value |
|-------|-------|
| Supabase Project | mihnndoucbaftcwujstz |
| URL | https://mihnndoucbaftcwujstz.supabase.co |
| Region | us-west-2 |
| Management API | https://api.supabase.com/v1/projects/mihnndoucbaftcwujstz/database/query |
| Access Token | `$env:OB1_SUPABASE_ACCESS_TOKEN` (in projects/website/.env.local) |
| DB Direct | postgresql://postgres@db.mihnndoucbaftcwujstz.supabase.co:5432/postgres |
| MCP Server | `supabase` in MCP config |
| Plan | Free tier (500MB database, 1GB storage, 2GB bandwidth) |

---

## Thought Schema

```sql
CREATE TABLE thoughts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content         text NOT NULL,
  embedding       vector(1536),
  metadata        jsonb DEFAULT '{}',
  source          text,
  agent_id        uuid,
  project_id      uuid,
  thought_type    text NOT NULL,
  content_hash    text NOT NULL,          -- SHA-256 for dedup
  tags            text[] DEFAULT '{}',
  importance      numeric(3,1) DEFAULT 5, -- 1-10 scale
  accessed_count  int DEFAULT 0,
  last_accessed_at timestamptz,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);
```

---

## Core Functions

### match_thoughts() - Semantic Search
```sql
SELECT * FROM match_thoughts(
  query_embedding := '[0.1, 0.2, ...]'::vector,  -- 1536-dim embedding
  match_threshold := 0.7,                          -- cosine similarity cutoff
  match_count := 5,                                -- max results
  filter_project_id := NULL,                       -- optional project filter
  filter_agent_id := NULL,                         -- optional agent filter
  filter_thought_type := NULL                      -- optional type filter
);
```

### search_thoughts_fts() - Full-Text Search
```sql
SELECT * FROM search_thoughts_fts('supabase auth static export');
```

### capture_thought() - Insert with Dedup
```sql
SELECT capture_thought(
  p_content := 'Static export + Supabase auth hangs. Use direct REST fetch with localStorage tokens.',
  p_metadata := '{"session": "2026-03-29", "context": "auth debug"}'::jsonb,
  p_source := 'agent-session',
  p_thought_type := 'learning',
  p_tags := ARRAY['supabase', 'auth', 'static-export', '031-skool-ui-overhaul'],
  p_importance := 9
);
```

### thought_stats() - Aggregate Statistics
```sql
SELECT * FROM thought_stats();
-- Returns: total_thoughts, by_type counts, avg_importance, storage_size
```

---

## Thought Types

| Type | Description | Typical Importance | Examples |
|------|-------------|-------------------|----------|
| `decision` | Strategic decisions, pivots, architecture choices | 8-10 | "Switched from NextAuth to Supabase Auth for community platform" |
| `learning` | Lessons learned, gotchas, patterns | 7-9 | "Supabase JS auth hangs on static export" |
| `reference` | API keys, credentials, connection strings | 8-10 | "A2 Hosting SSH: port 7822, key at ~/.ssh/a2hosting_tin" |
| `research` | Deep research findings, competitive intel | 7-10 | "Law firm pain points: billing inefficiency, client intake delays" |
| `note` | General observations, session logs | 3-7 | "Session focused on classroom grid layout refinement" |

### Importance Scale
| Range | Label | Criteria |
|-------|-------|----------|
| 1-3 | Routine | Session logs, minor observations, temporary notes |
| 4-6 | Notable | Useful context, moderate learnings, status updates |
| 7-9 | Important | Key decisions, critical gotchas, architecture patterns |
| 10 | Critical | Rules that prevent data loss, security findings, hard-won lessons (3-day sagas) |

---

## Query Protocol (SESSION START)

Before starting any work, query OB1 for relevant context:

```sql
-- 1. Full-text search for project name + key terms
SELECT * FROM search_thoughts_fts('skool ui overhaul classroom');

-- 2. Filter by project_id if known
SELECT * FROM match_thoughts(
  query_embedding := embed('classroom grid layout'),
  match_threshold := 0.7,
  match_count := 5,
  filter_project_id := 'project-uuid-here'
);

-- 3. Get latest strategic decisions
SELECT content, tags, importance, created_at
FROM thoughts
WHERE thought_type = 'decision'
ORDER BY created_at DESC
LIMIT 5;

-- 4. Get recent gotchas/learnings
SELECT content, tags, importance, created_at
FROM thoughts
WHERE thought_type = 'learning'
  AND importance >= 7
ORDER BY created_at DESC
LIMIT 10;
```

**Key rule:** Don't dump 20 thoughts into context. Use rerank to select the top 3-5 most relevant results.

---

## Capture Protocol (SESSION END)

Before ending ANY agent session, capture a thought with:

### Required Fields
```json
{
  "content": "Session summary: Built classroom grid layout with course cards. Learning: GSAP ScrollTrigger conflicts with Bootstrap grid on mobile. Decision: Use CSS Grid instead of Bootstrap for classroom layout.",
  "thought_type": "note",
  "tags": ["031-skool-ui-overhaul", "classroom", "css-grid", "gsap", "builder"],
  "importance": 6,
  "source": "agent-session",
  "metadata": {
    "session_date": "2026-03-30",
    "agent": "builder",
    "project": "031-skool-ui-overhaul",
    "commit": "abc1234",
    "duration_hours": 1.5
  }
}
```

### What to Capture
1. **Session summary** -- what was done
2. **Learnings** -- what was new or surprising
3. **Decisions** -- what was decided and why
4. **Blockers** -- what is stuck and needs follow-up

### Tag Format
```
[domain, project-id, agent, key-concepts...]
```
Examples:
- `['supabase', '031-skool-ui-overhaul', 'builder', 'auth', 'static-export']`
- `['n8n', '008-tiny-home-timelapse', 'neo', 'kie-ai', 'veo3', 'callback']`
- `['deploy', 'website', 'deploy', 'rsync', 'cloudflare']`

---

## Version Control Integration

Every git commit that represents a decision or learning should have a corresponding OB1 thought:

```json
{
  "content": "[GIT] abc1234 -- Switched classroom layout from Bootstrap grid to CSS Grid for better responsive control on mobile viewports",
  "thought_type": "decision",
  "tags": ["git", "commit", "031-skool-ui-overhaul", "css-grid", "classroom"],
  "importance": 7,
  "source": "git-commit"
}
```

This creates a searchable semantic log of WHY changes were made, not just WHAT changed.

---

## Maintenance Operations

### Dedup Audit
```sql
-- Find exact duplicate content
SELECT content_hash, COUNT(*) as dupes
FROM thoughts
GROUP BY content_hash
HAVING COUNT(*) > 1
ORDER BY dupes DESC;

-- Remove duplicates (keep oldest)
DELETE FROM thoughts a
USING thoughts b
WHERE a.content_hash = b.content_hash
  AND a.created_at > b.created_at;
```

### Stale Thought Pruning
```sql
-- Find candidates for pruning
SELECT id, content, importance, accessed_count, created_at
FROM thoughts
WHERE importance < 3
  AND accessed_count = 0
  AND created_at < NOW() - INTERVAL '90 days'
ORDER BY created_at ASC;

-- Prune (after review)
DELETE FROM thoughts
WHERE importance < 3
  AND accessed_count = 0
  AND created_at < NOW() - INTERVAL '90 days';
```

### Tag Cleanup
```sql
-- Find all unique tags
SELECT DISTINCT unnest(tags) AS tag, COUNT(*) AS usage
FROM thoughts
GROUP BY tag
ORDER BY usage DESC;

-- Standardize a tag (e.g., rename 'n8n-workflow' -> 'n8n')
UPDATE thoughts
SET tags = array_replace(tags, 'n8n-workflow', 'n8n')
WHERE 'n8n-workflow' = ANY(tags);
```

### Embedding Refresh
If the embedding model changes (e.g., Cohere updates embed-v4.0), ALL existing embeddings become incomparable. Must re-embed entire corpus:

```sql
-- Find thoughts with missing or outdated embeddings
SELECT id, content FROM thoughts WHERE embedding IS NULL;

-- After re-embedding, rebuild the HNSW index for accuracy
REINDEX INDEX thoughts_embedding_idx;
```

### Statistics
```sql
-- Overall stats
SELECT * FROM thought_stats();

-- Size check (free tier: 500MB limit)
SELECT pg_size_pretty(pg_database_size('postgres'));

-- Thoughts by type
SELECT thought_type, COUNT(*), AVG(importance)::numeric(3,1) as avg_importance
FROM thoughts
GROUP BY thought_type
ORDER BY COUNT(*) DESC;

-- Growth rate (thoughts per week)
SELECT date_trunc('week', created_at) AS week, COUNT(*)
FROM thoughts
GROUP BY week
ORDER BY week DESC
LIMIT 10;
```

---

## Removal & Deletion Operations

OB1 is not write-only. Broken patterns, disproven learnings, and stale decisions MUST be deleted. A knowledge system that only grows rots from the inside.

### Thought Lifecycle

```
CAPTURED → ACTIVE → [QUESTIONED] → (improved → ACTIVE | failed → DELETED)
```

### Delete a Thought

```sql
-- Step 1: Verify the thought exists and confirm it's the right one
SELECT id, content, thought_type, tags, importance, created_at
FROM thoughts WHERE id = '{thought-id}';

-- Step 2: Capture WHY it's being deleted (MANDATORY before deletion)
SELECT capture_thought(
  p_content := '[DELETED] Thought {thought-id}: "{first 100 chars of content}...". Deleted because: {reason}. Lesson: {what we now know instead}.',
  p_metadata := '{"deleted_thought_id": "{thought-id}", "deletion_date": "{date}", "agent": "{agent}", "original_importance": {n}}'::jsonb,
  p_source := 'agent',
  p_thought_type := 'decision',
  p_tags := ARRAY['deleted', 'removal-loop', '{domain}', '{original-tags}'],
  p_importance := 9
);

-- Step 3: Delete
DELETE FROM thoughts WHERE id = '{thought-id}';
```

### Mark a Thought as Questioned

When an agent follows a thought and it causes failure:

```sql
-- Tag it as questioned and demote importance
UPDATE thoughts
SET tags = array_append(tags, 'questioned'),
    importance = GREATEST(importance - 2, 1),
    metadata = metadata || '{"questioned_date": "{date}", "questioned_by": "{agent}", "questioned_reason": "{reason}"}'::jsonb,
    updated_at = now()
WHERE id = '{thought-id}';
```

### Bulk Prune Stale Thoughts

```sql
-- Find deletion candidates: low importance, never accessed, old
SELECT id, content, thought_type, importance, accessed_count, created_at
FROM thoughts
WHERE importance < 2
  AND accessed_count = 0
  AND created_at < NOW() - INTERVAL '60 days'
ORDER BY created_at ASC;

-- After review, delete confirmed stale thoughts
DELETE FROM thoughts
WHERE importance < 2
  AND accessed_count = 0
  AND created_at < NOW() - INTERVAL '60 days';
```

### Resolve Contradictory Thoughts

When two thoughts in the same domain give conflicting advice:

```sql
-- Find potential conflicts: same tags, different content
SELECT a.id as id_a, b.id as id_b,
       LEFT(a.content, 100) as content_a,
       LEFT(b.content, 100) as content_b,
       a.tags, a.importance as imp_a, b.importance as imp_b,
       a.created_at as created_a, b.created_at as created_b
FROM thoughts a
JOIN thoughts b ON a.tags && b.tags
  AND a.id < b.id
  AND a.thought_type = b.thought_type
WHERE a.thought_type = 'learning'
ORDER BY a.created_at DESC
LIMIT 20;
```

Resolution: Keep the correct one (verify against current reality), delete the wrong one with a deletion thought explaining the resolution.

### Skill Deletion Protocol

When a skill is deleted via the removal cycle:

1. Capture a deletion thought with the skill name, path, and failure analysis
2. `rm -rf .claude/skills/{category}/{skill-name}/`
3. Remove any references to the skill from other skills' "Related Skills" sections
4. If the capability is still needed, rebuild from scratch (new directory, new content)
5. Run /toughlove on the rebuilt skill before marking it ACTIVE

### Critical Deletion Rules

- **NEVER delete without capturing a deletion thought first.** The deletion itself is a learning.
- **NEVER delete thoughts with importance >= 8 without /toughlove review.** High-importance thoughts represent hard-won knowledge — make sure the deletion is justified.
- **ALWAYS verify before deleting.** A thought that looks wrong may be context-dependent. Check if it's still referenced by active skills or SOPs.
- **Deletion is irreversible.** There is no trash can. Once deleted from OB1, it's gone. The deletion thought is the only record.

---

## Sync with Airtable

| Field | Value |
|-------|-------|
| Direction | Airtable -> OB1 (Airtable is write source, OB1 is read/search layer) |
| Tracking Table | sync_log (last_synced_at per source table) |
| Automation | n8n workflow (planned) |

### Sync Pattern
1. Check `sync_log` for last sync timestamp per Airtable table
2. Fetch records modified since last sync from Airtable
3. Upsert into thoughts (using content_hash for dedup)
4. Update `sync_log` with current timestamp

---

## Critical Rules

### NEVER
- Dump more than 5 thoughts into agent context (use rerank to select best matches)
- Set importance to 10 for routine observations (enforces distribution)
- Store thoughts longer than 2000 characters (split into multiple with shared tags)
- Skip the capture protocol at session end
- Trust old thoughts at face value without checking recency (a "bug" thought from 3 days ago may be resolved)
- Run raw DELETE on thoughts without a WHERE clause
- Expose the management API access token in client-side code

### ALWAYS
- Query OB1 at session start for relevant context
- Capture a thought at session end (session summary + learnings + decisions + blockers)
- Use content_hash dedup (automatic via capture_thought function)
- Tag every thought with at minimum: [domain, project-id, agent]
- Use FTS as fallback when semantic search returns 0 results
- Monitor free tier usage (500MB database limit)
- Include metadata with session_date and agent name

---

## Edge Cases

### Duplicate Thoughts
- **Problem**: `content_hash` prevents exact duplicates, but semantically similar thoughts accumulate over time
- **Fix**: Run periodic dedup audit. For near-duplicates, merge content into the higher-importance thought and delete the other.

### Embedding Model Changes
- **Problem**: If Cohere updates embed-v4.0, ALL existing embeddings become incomparable with new embeddings
- **Fix**: Re-embed entire corpus. This is an expensive operation -- plan downtime for semantic search during re-embed.
- **Mitigate**: Store model version in metadata so you know which embeddings are stale.

### Null Embeddings
- **Problem**: Thoughts captured via direct SQL (bypassing the embedding pipeline) won't appear in semantic search
- **Fix**: They still appear in FTS. Run a periodic sweep to find and embed null-embedding thoughts.

### Token Budget for Context Injection
- **Problem**: Injecting too many thoughts wastes context window tokens
- **Fix**: Query broadly, then rerank and select top 3-5. Include only content and tags, not full metadata.

### Stale Thoughts
- **Problem**: A thought saying "auth is broken" from 3 days ago may already be resolved
- **Fix**: Always check `created_at` and `updated_at`. Prefer recent thoughts. Cross-reference with git log for resolution.

### Thought Importance Inflation
- **Problem**: If everything is importance 10, nothing is important
- **Fix**: Enforce distribution -- most thoughts should be 4-6. Only genuine critical lessons (data loss prevention, security findings, multi-day debugging sagas) get 9-10.

### Large Content
- **Problem**: Single thoughts over 2000 characters degrade search quality
- **Fix**: Split into multiple thoughts with shared tags and a linking tag (e.g., `['research-series-001']`).

### Missing agent_id/project_id
- **Problem**: Many early thoughts have null FK references
- **Fix**: Use tags for filtering instead of FK joins. Tags are the reliable filter dimension.

### Concurrent Captures
- **Problem**: Two agents capturing simultaneously
- **Fix**: UUID primary keys prevent conflicts. Near-duplicates may occur -- periodic dedup handles this.

### Query Returning 0 Results
- **Problem**: Semantic search returns nothing, but relevant info exists
- **Fix**: Try FTS as fallback, then broaden tag filters, then search with fewer/different terms. Zero results does NOT mean no relevant info.

---

## Related Skills

- **Supabase Database** (`infrastructure/supabase-database`) -- Schema management for OB1 instance
- **Airtable API** (`infrastructure/airtable-api`) -- Source of truth for sync
- **MCP Client** (`mcp-client`) -- Supabase MCP server for direct queries

---

## Shutdown Protocol (MANDATORY)

### 1. Capture Session Thought
Use the capture protocol above. This is non-negotiable.

### 2. Log Time Entry to Airtable
```
Table: Time Entries
Fields: Entry Date, Agent, Project, Hours, Description, Tokens Used
```

### 3. Update Learnings
- Document new OB1 patterns/gotchas in learnings files

### 4. Report Completion

**FAILURE TO COMPLETE SHUTDOWN PROTOCOL IS A CRITICAL VIOLATION**
