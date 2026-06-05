# Version Control & Logging SOP

**Version**: 1.1.0
**Created**: 2026-03-30
**Owner**: Drew (PM)
**Last Reviewed**: 2026-03-30
**Status**: Active

---

## TL;DR

Every agent session must capture thoughts to OB1, link commits to decisions, version all learnings, and maintain a changelog. If OB1 cannot answer "what happened and why" for any given week, the logging failed. This SOP is the bridge between the existing agent-logging-sop (Airtable time/task tracking) and the OB1 brain (persistent semantic memory). Together they guarantee that no work is invisible and no decision is lost.

**Reference SOPs**:
- `agent-logging-sop.md` -- Airtable time + task tracking (still mandatory)
- `ob1-brain SKILL.md` -- OB1 capture/query protocol
- [[constitution]] Section VII.VI -- Shutdown Protocol

---

## Definition of Done

Every session is considered properly logged when ALL of the following are true:

- [ ] Session thought captured in OB1 (content + tags + importance + source)
- [ ] Git commits tagged with OB1 thought IDs where applicable
- [ ] Learnings files updated with version date and change description
- [ ] Airtable time entry + task logged (per agent-logging-sop)
- [ ] Changelog entry added for non-trivial changes

If any checkbox is unchecked at session end, the session is non-compliant. Treat this the same as a missing Airtable entry.

---

## 1. Session Capture Protocol

### 1.1 Session Start

Before writing a single line of code or making any change:

1. **Query OB1 for relevant context**:
   ```sql
   -- Full-text search for project + domain keywords
   SELECT * FROM search_thoughts_fts('{project-name} {key-terms}');

   -- Recent decisions for the project
   SELECT content, tags, importance, created_at
   FROM thoughts
   WHERE thought_type = 'decision'
     AND tags @> ARRAY['{project-id}']
   ORDER BY created_at DESC
   LIMIT 5;

   -- Recent gotchas/learnings (importance >= 7)
   SELECT content, tags, importance, created_at
   FROM thoughts
   WHERE thought_type = 'learning'
     AND importance >= 7
   ORDER BY created_at DESC
   LIMIT 10;
   ```

2. **Load foundational documents**:
   - `.specify/memory/constitution.md`
   - `.specify/memory/learnings/shared-learnings.md`
   - `.specify/memory/learnings/{agent}-learnings.md`

3. **Check Airtable for assigned tasks**:
   - Query Tasks table filtered by agent + status = "In Progress" or "Assigned"

4. **Record session start time** (for accurate hours calculation at session end).

### 1.2 During Session

Capture thoughts in real time. Do NOT batch everything to session end -- context is richest at the moment of discovery.

#### For every DECISION made:
```sql
SELECT capture_thought(
  p_content := '{what was decided and WHY -- include the alternatives considered and why they were rejected}',
  p_metadata := '{"session_date": "{date}", "agent": "{agent}", "project": "{project-id}"}'::jsonb,
  p_source := 'agent',
  p_thought_type := 'decision',
  p_tags := ARRAY['{domain}', '{project-id}', '{agent}', '{key-concepts}'],
  p_importance := 8  -- 8-10 for architectural/strategic decisions
);
```

#### For every BUG FOUND:
```sql
SELECT capture_thought(
  p_content := '{what broke, root cause analysis, how it was fixed, and how to prevent recurrence}',
  p_metadata := '{"session_date": "{date}", "agent": "{agent}", "project": "{project-id}", "severity": "{critical|high|medium|low}"}'::jsonb,
  p_source := 'agent',
  p_thought_type := 'learning',
  p_tags := ARRAY['bug', '{domain}', '{affected-systems}', '{project-id}', '{agent}'],
  p_importance := 7  -- 7-9; bugs that recur or took >1 hour to diagnose get higher importance
);
```

#### For every PATTERN DISCOVERED:
```sql
SELECT capture_thought(
  p_content := '{the pattern, when to use it, anti-patterns to avoid, and a concrete example}',
  p_metadata := '{"session_date": "{date}", "agent": "{agent}", "project": "{project-id}"}'::jsonb,
  p_source := 'agent',
  p_thought_type := 'learning',
  p_tags := ARRAY['pattern', '{domain}', '{technology}', '{project-id}', '{agent}'],
  p_importance := 6  -- 6-8; patterns validated across multiple sessions get promoted
);
```

### 1.3 Session End (MANDATORY -- NEVER SKIP)

This is the non-negotiable shutdown sequence. Every item must be completed before the session closes.

#### Step 1: Capture Session Summary Thought
```sql
SELECT capture_thought(
  p_content := 'Session summary: {what was done}. Decisions: {key decisions with rationale}. Learnings: {new patterns or gotchas}. Blockers: {what is stuck}. Commits: {commit hashes if any}. Next actions: {what should happen next}.',
  p_metadata := '{"session_date": "{date}", "agent": "{agent}", "project": "{project-id}", "duration_hours": {hours}, "commits": ["{hash1}", "{hash2}"]}'::jsonb,
  p_source := 'agent',
  p_thought_type := 'note',
  p_tags := ARRAY['session-log', '{date}', '{agent}', '{project-id}'],
  p_importance := 5  -- 5-7; sessions with major decisions or multi-day saga progress get 7
);
```

#### Step 2: Update Learnings Files
- If new patterns or gotchas were discovered, update `.specify/memory/learnings/{agent}-learnings.md`
- If the learning has cross-agent impact, also update `.specify/memory/learnings/shared-learnings.md`
- Follow the Learnings Versioning Protocol (Section 4 below)

#### Step 3: Log Airtable Time Entry + Task
- Per agent-logging-sop.md -- this step is unchanged
- Include commit hashes in the Description field when applicable

#### Step 4: Note Git Commits
- If git commits were made during the session, include commit hashes in the session summary thought
- If a commit represents a significant decision, ensure it has its own dedicated decision thought (Section 2)

---

## 2. Git-to-OB1 Linking Protocol

Git log tells WHAT changed. OB1 tells WHY it changed. Together they form a complete audit trail.

### 2.1 Commit Message Standards

Commit messages should reference the decision or reason, not just the what:
```
fix: resolve auth hang on static export by switching to REST fetch

Supabase JS auth module hangs during SSR in static export mode.
Direct REST API calls with localStorage token management avoid the issue entirely.
```

NOT:
```
fix auth
```

### 2.2 Post-Commit Thought Capture

After significant commits (anything beyond trivial formatting or typos), capture a thought:

```sql
SELECT capture_thought(
  p_content := '[GIT {short-hash}] {why this change was made, what problem it solves, what alternative approaches were rejected}',
  p_metadata := '{"commit_hash": "{full-hash}", "branch": "{branch-name}", "files_changed": {count}, "session_date": "{date}", "agent": "{agent}"}'::jsonb,
  p_source := 'git-commit',
  p_thought_type := 'decision',
  p_tags := ARRAY['git', 'commit', '{branch}', '{project-id}', '{domain}'],
  p_importance := 7  -- Scale: 5-6 for routine, 7-8 for feature/fix, 9-10 for architecture
);
```

### 2.3 What "Significant" Means

Capture a git-linked thought for commits that:
- Fix a bug that took >15 minutes to diagnose
- Introduce a new architectural pattern
- Change a dependency or integration point
- Represent a decision between alternatives
- Modify security, auth, or data handling logic

Do NOT capture thoughts for:
- Formatting/linting fixes
- Typo corrections
- Version bumps with no functional change
- Merge commits with no conflict resolution

### 2.4 Branch-Level Summaries

When a feature branch is merged to main, capture a summary thought:
```sql
SELECT capture_thought(
  p_content := '[BRANCH {branch-name} -> main] Summary: {what the branch accomplished}, {total commits}, {key decisions made during the branch lifecycle}',
  p_metadata := '{"branch": "{branch-name}", "merge_commit": "{hash}", "total_commits": {n}, "session_date": "{date}", "agent": "{agent}"}'::jsonb,
  p_source := 'git-commit',
  p_thought_type := 'note',
  p_tags := ARRAY['git', 'merge', '{project-id}', '{domain}'],
  p_importance := 6
);
```

---

## 3. Learnings Versioning Protocol

Learnings are the institutional memory that prevents the same mistake from being made twice. They must be versioned, never deleted, and periodically reviewed.

### 3.1 File Requirements

Every learnings file (`.specify/memory/learnings/*.md`) must have YAML frontmatter with an `updated` field:

```yaml
---
type: "learning"
agent: "AgentName"
project: null
created: 2026-MM-DD
updated: 2026-MM-DD
tags: []
status: "active"
---
```

### 3.2 Entry Format

When adding a new learning, use this structure:

```markdown
### {YYYY-MM-DD} -- {Title}
**Context**: {When and why this was discovered -- what task, what went wrong or right}
**Learning**: {The actual lesson in clear, actionable language}
**Impact**: {What this changes going forward -- new rules, new patterns, things to avoid}
```

Example:
```markdown
### 2026-03-29 -- Supabase Auth Hangs on Static Export
**Context**: 3-day debugging saga during auth system overhaul. Supabase JS auth module hangs indefinitely when Next.js is configured with `output: 'export'`.
**Learning**: Use direct REST fetch with localStorage token management instead of the Supabase JS auth helpers for any auth-critical operations in static export builds.
**Impact**: All future auth work on the community platform must use the REST pattern. The Supabase JS auth helpers are only safe in SSR/SSG mode.
```

### 3.3 Versioning Rules

- **NEVER delete old learnings.** If a learning is outdated, mark it as:
  ```
  [SUPERSEDED by {YYYY-MM-DD} entry: {title of replacement entry}]
  ```
- Always update the `updated` field in YAML frontmatter when adding new entries.
- Add a change description comment if the update is significant:
  ```markdown
  <!-- 2026-03-30: Added 3 new patterns from Skool UI overhaul session -->
  ```

### 3.4 Monthly Review Cycle

On the first working session of each month:

1. **Scan all learnings files** for entries older than 30 days
2. **Validate**: Is the learning still accurate? Has the underlying system changed?
3. **Promote**: Learnings validated across multiple sessions get importance bumped to 9-10 in OB1
4. **Demote**: Learnings that have been disproven or are no longer relevant get `[SUPERSEDED]` tag
5. **Cross-reference**: Ensure all high-importance learnings also exist as OB1 thoughts (bidirectional sync)

---

## 4. Changelog Protocol

Changelogs provide a human-readable record of what changed at the project level. They complement git log (too granular) and OB1 thoughts (too semantic) with a middle ground.

### 4.1 Location

Each project directory that sees active development should maintain a `CHANGELOG.md`:
```
projects/{project-name}/CHANGELOG.md
```

### 4.2 Format

Follow [Keep a Changelog](https://keepachangelog.com) conventions:

```markdown
# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Added
- New feature description (commit: {hash}, OB1: {thought-tag})

### Changed
- Changed behavior description

### Fixed
- Bug fix description (commit: {hash})

### Removed
- Removed feature description

### Security
- Security fix description

### Deprecated
- Feature that will be removed in future

## [{version}] - {YYYY-MM-DD}

### Added
- ...
```

### 4.3 When to Update

Add a changelog entry when:
- A new feature or capability is added
- User-visible behavior changes
- A bug is fixed that was reported or caused user impact
- A security issue is addressed
- A dependency is upgraded with breaking changes
- Something is deprecated or removed

Do NOT add entries for:
- Internal refactoring with no behavior change
- Test-only changes
- Documentation-only changes (unless it is a user-facing doc)

### 4.4 Linking

Link changelog entries to both git commits and OB1 thoughts where possible:
```markdown
### Fixed
- Auth module no longer hangs on static export pages (commit: abc1234, see OB1 tag: auth-static-export-fix)
```

---

## 5. OB1 Growth Metrics

OB1 is only valuable if it is growing, accurate, and used. These metrics track its health.

### 5.1 Weekly Metrics

Track every Friday (Drew's weekly review):

| Metric | How to Measure | Target |
|--------|---------------|--------|
| New thoughts captured | `SELECT COUNT(*) FROM thoughts WHERE created_at > NOW() - INTERVAL '7 days'` | >= 10/week |
| Thought type distribution | `SELECT thought_type, COUNT(*) FROM thoughts WHERE created_at > NOW() - INTERVAL '7 days' GROUP BY thought_type` | No single type > 60% |
| Average importance | `SELECT AVG(importance) FROM thoughts WHERE created_at > NOW() - INTERVAL '7 days'` | 4.0 - 7.0 |
| Query frequency | Track via accessed_count increments | >= 5 queries/week |
| Session capture rate | Sessions with OB1 thought / total sessions | 100% |

### 5.2 Monthly Review

| Activity | Query | Action |
|----------|-------|--------|
| Stale thoughts | `SELECT * FROM thoughts WHERE importance < 3 AND accessed_count = 0 AND created_at < NOW() - INTERVAL '90 days'` | Review and prune |
| Importance distribution | `SELECT importance, COUNT(*) FROM thoughts GROUP BY importance ORDER BY importance` | Rebalance if skewed |
| Tag health | `SELECT unnest(tags) AS tag, COUNT(*) FROM thoughts GROUP BY tag ORDER BY COUNT(*) DESC` | Standardize duplicates |
| Blind spots | Review project registry vs thoughts per project | Capture missing context |
| Search quality | Manual: run 5 known-answer queries, check relevance | Tune thresholds |

### 5.3 Quarterly Review

| Activity | Details |
|----------|---------|
| Prune stale thoughts | Delete: importance < 3 AND accessed_count = 0 AND age > 90 days |
| Re-embed if model changed | If Cohere or embedding provider updated, re-embed entire corpus |
| Archive old session logs | Move session-log thoughts older than 90 days to importance 1 |
| Validate high-importance thoughts | Review all importance >= 9 thoughts -- still accurate? |
| Growth trajectory | Compare quarter-over-quarter thought counts and search quality |

---

## 6. Failure Modes & Recovery

### 6.1 Session Ended Without Capture

**Symptom**: Agent session completed work but no OB1 thought exists for that timeframe.

**Recovery**:
1. Create a retroactive thought with `[RETROACTIVE]` prefix in content
2. Add `retroactive` tag
3. Set importance = original importance + 1 (penalty for the gap -- this incentivizes real-time capture)
4. Reconstruct from: git log, Airtable time entries, learnings file diffs

```sql
SELECT capture_thought(
  p_content := '[RETROACTIVE] Session {date} by {agent}: {reconstructed summary from git log and Airtable entries}',
  p_metadata := '{"session_date": "{date}", "agent": "{agent}", "retroactive": true, "original_session": "{approximate timeframe}"}'::jsonb,
  p_source := 'agent',
  p_thought_type := 'note',
  p_tags := ARRAY['session-log', 'retroactive', '{date}', '{agent}', '{project-id}'],
  p_importance := 6  -- original would have been 5, +1 penalty
);
```

### 6.2 OB1 Unreachable

**Symptom**: Supabase management API returns errors or timeouts.

**Recovery**:
1. Buffer thoughts to `.specify/memory/ob1-buffer.md` using the same format:
   ```markdown
   ## Buffered Thought - {timestamp}
   - **Type**: {thought_type}
   - **Content**: {content}
   - **Tags**: {comma-separated tags}
   - **Importance**: {1-10}
   - **Source**: {source}
   - **Metadata**: {JSON metadata}
   ```
2. On next session where OB1 is reachable, sync all buffered thoughts
3. Clear the buffer file after successful sync
4. Add `buffered` tag to synced thoughts so they can be identified

### 6.3 Duplicate Thoughts Accumulating

**Symptom**: Similar thoughts with slightly different wording clogging search results.

**Recovery**:
1. Run monthly dedup query:
   ```sql
   SELECT content_hash, COUNT(*) as dupes
   FROM thoughts
   GROUP BY content_hash
   HAVING COUNT(*) > 1
   ORDER BY dupes DESC;
   ```
2. For exact duplicates: keep the oldest (it has the original timestamp), delete the rest
3. For near-duplicates (same concept, different wording): merge content into the higher-importance thought, add merged tags, delete the lower-importance one

### 6.4 Stale Thoughts Misleading Agents

**Symptom**: Agent reads a thought saying "auth is broken" from 5 days ago, but it was fixed 4 days ago.

**Recovery**:
1. Add `[STALE]` prefix to content and `stale` tag to thoughts older than 30 days that reference volatile state (bugs, workarounds, temporary decisions)
2. When querying OB1, always check `created_at` -- prefer recent thoughts
3. Cross-reference git log for resolution commits

### 6.5 Embedding Model Changed

**Symptom**: Semantic search returns poor results because old embeddings are incompatible with new model.

**Recovery**:
1. Document the migration in a thought:
   ```sql
   SELECT capture_thought(
     p_content := '[MIGRATION] Embedding model changed from {old} to {new}. Re-embedding entire corpus. Semantic search may be degraded until complete.',
     p_metadata := '{"old_model": "{old}", "new_model": "{new}", "total_thoughts": {count}}'::jsonb,
     p_source := 'agent',
     p_thought_type := 'note',
     p_tags := ARRAY['ob1', 'migration', 'embedding'],
     p_importance := 9
   );
   ```
2. Re-embed all thoughts (batch process)
3. Rebuild HNSW index: `REINDEX INDEX thoughts_embedding_idx;`
4. Run validation queries against known-answer sets
5. Fall back to FTS during re-embedding window

### 6.6 Agent Doesn't Know Its Session Context

**Symptom**: Agent invoked without clear context about what happened previously.

**Recovery**:
1. Query OB1 for recent session logs by project:
   ```sql
   SELECT content, created_at FROM thoughts
   WHERE tags @> ARRAY['session-log', '{project-id}']
   ORDER BY created_at DESC LIMIT 3;
   ```
2. Check git log for recent commits on the branch
3. Check Airtable for recent tasks assigned to this agent/project

---

## 7. Compliance Enforcement

### 7.1 Audit Process

Drew (PM) audits session logs weekly as part of the Friday review:

| Check | Query/Method | Severity |
|-------|-------------|----------|
| Missing session captures | Compare Airtable time entries vs OB1 session-log thoughts for same date/agent | Critical |
| Missing git-linked thoughts | Compare git log (commits with decisions) vs OB1 git-tagged thoughts | High |
| Stale learnings files | Check `updated` frontmatter field -- flag if > 14 days stale for active agents | Medium |
| Missing changelog entries | Compare git log (features/fixes) vs project CHANGELOG.md | Medium |

### 7.2 Compliance Scoring

| Rate | Grade | Action |
|------|-------|--------|
| 100% | Compliant | No action needed |
| 90-99% | Minor gap | Agent self-corrects with retroactive capture |
| 75-89% | Significant gap | Drew flags in weekly report, agent prioritizes catch-up |
| < 75% | Critical violation | Same severity as missing Airtable entries -- escalation |

### 7.3 Health Monitors

Set up alerts (can be n8n cron or manual check) for:

- Any project with 0 thoughts captured in 7 days (while that project has Airtable time entries)
- Any agent with Airtable time entries but no corresponding session-log thoughts
- OB1 total storage approaching 400MB (free tier: 500MB limit)
- Thought count growth rate dropping below 5/week across all agents

---

## 8. Removal & Pruning Protocol

The knowledge system MUST delete, not just accumulate. A broken pattern left alive is worse than no pattern — agents will follow it, fail, and lose time. Write-only memory rots. This section defines the removal loop.

### 8.1 The Principle

**If something creates more problems than it solves, it gets deleted.** Not deprecated, not tagged [STALE], not pushed to the bottom of the file — **deleted**. The deletion itself is captured as a learning so we know what was tried and why it failed.

### 8.2 What Gets Deleted

| Target | Trigger | Gate |
|--------|---------|------|
| **OB1 Thought** | Agent follows it and it causes failure | Verify the failure, then DELETE the thought + capture a replacement learning |
| **Skill (SKILL.md)** | Skill guidance causes more issues than it solves | /toughlove review → improve → if fails twice → DELETE entire skill dir → rebuild from scratch |
| **Learning Entry** | Learning is factually wrong or outdated beyond repair | Verify incorrectness, DELETE entry (not just [SUPERSEDED]) → capture why it was wrong |
| **SOP Section** | Process doesn't work in practice | /toughlove review → attempt to fix → if unfixable → DELETE section → rewrite from observed reality |
| **Pattern** | Pattern fails in new contexts or was based on flawed assumptions | Remove from patterns library → capture an anti-pattern thought explaining why |

### 8.3 The Removal Cycle

```
OBSERVE → QUESTION → TOUGHLOVE → IMPROVE → TEST → (pass? keep : TOUGHLOVE AGAIN) → (pass? keep : DELETE → REBUILD)
```

**Step-by-step:**

1. **OBSERVE**: An agent follows a skill/thought/learning and it causes a failure or suboptimal outcome.

2. **QUESTION**: Tag the suspect knowledge with `[QUESTIONED]` and importance -2 (temporary demotion). Capture a thought:
   ```sql
   SELECT capture_thought(
     p_content := '[QUESTIONED] Skill/thought "{name}" caused {failure description}. Questioning whether this pattern is valid. Evidence: {what went wrong}.',
     p_metadata := '{"target_type": "{skill|thought|learning|sop}", "target_path": "{path or thought ID}", "failure_date": "{date}", "agent": "{agent}"}'::jsonb,
     p_source := 'agent',
     p_thought_type := 'learning',
     p_tags := ARRAY['questioned', 'removal-candidate', '{domain}', '{target-name}'],
     p_importance := 8
   );
   ```

3. **TOUGHLOVE (Round 1)**: Run `/toughlove` adversarial review on the target.
   - Grade the skill/thought/learning/SOP objectively
   - Identify specific defects (wrong assumptions, missing edge cases, broken patterns)
   - Produce a remediation plan with concrete fixes

4. **IMPROVE**: Apply the toughlove fixes. This is the only chance to save the target.
   - Skills: Rewrite the broken sections, add missing edge cases
   - Thoughts: Update content, adjust importance, fix tags
   - Learnings: Rewrite with correct information
   - SOPs: Fix the broken process steps

5. **TEST**: Validate the improvement works in practice.
   - Skills: Use the skill in the next relevant session. Did it produce better outcomes?
   - Thoughts: Query the updated thought. Is the new guidance correct?
   - Learnings: Apply the corrected learning. Does it hold up?
   - SOPs: Follow the updated process. Does it work end-to-end?

6. **TOUGHLOVE (Round 2)**: If the improvement fails, run toughlove again.
   - If it passes: **KEEP.** Remove `[QUESTIONED]` tag, restore importance, capture success thought.
   - If it fails again: **PROCEED TO DELETE.**

7. **DELETE**: Complete removal.
   - For OB1 thoughts: `DELETE FROM thoughts WHERE id = '{thought-id}';`
   - For skills: `rm -rf .claude/skills/{category}/{skill-name}/`
   - For learnings: Remove the entry from the `.md` file entirely
   - For SOPs: Remove the file or section entirely
   - **ALWAYS capture a deletion thought** (see 8.4 below)

8. **REBUILD** (if the capability is still needed):
   - Start from scratch with fresh context — do NOT iterate on the broken version
   - Use the deletion thought as input: "what went wrong" becomes "what to avoid"
   - Run /toughlove on the rebuilt version before considering it active
   - The rebuild gets a new name/path to signal it's a fresh start, not a patch

### 8.4 Deletion Thought (MANDATORY)

Every deletion MUST be captured as a thought. This is how OB1 learns from failures:

```sql
SELECT capture_thought(
  p_content := '[DELETED] {type}: {name/path}. Reason: {why it was deleted}. Failure mode: {what specifically broke}. Attempts to fix: {what was tried in rounds 1-2}. Lesson: {what we now know to be true instead}. Replacement: {new skill/thought/learning path if rebuilt, or "none — capability not needed"}.',
  p_metadata := '{"deleted_type": "{skill|thought|learning|sop}", "deleted_path": "{original path or thought ID}", "deletion_date": "{date}", "toughlove_rounds": 2, "agent": "{agent}", "original_created": "{date the deleted thing was created}"}'::jsonb,
  p_source := 'agent',
  p_thought_type := 'decision',
  p_tags := ARRAY['deleted', 'removal-loop', '{domain}', '{original-name}'],
  p_importance := 9
);
```

### 8.5 Skill Lifecycle States

Skills are not just "active" or "deprecated." They have a lifecycle:

```
DRAFT → ACTIVE → [QUESTIONED] → IMPROVING → ACTIVE (if fixed)
                                            → DELETED (if unfixable) → REBUILT (new skill)
```

| State | Meaning | Action |
|-------|---------|--------|
| `DRAFT` | New skill, not yet validated | Run /toughlove before first use |
| `ACTIVE` | Validated, in production use | Normal operations |
| `QUESTIONED` | Caused a failure, under review | Tagged in frontmatter, toughlove in progress |
| `IMPROVING` | Toughlove fixes applied, being tested | One more failure = deletion |
| `DELETED` | Removed from filesystem | Deletion thought captured in OB1 |
| `REBUILT` | New skill replacing a deleted one | Fresh start, new path, toughlove-validated |

Update skill YAML frontmatter to track state:
```yaml
---
name: skill-name
status: active  # draft | active | questioned | improving | deleted
questioned_date: null  # set when status changes to questioned
questioned_reason: null  # what failed
toughlove_rounds: 0  # increment on each review
---
```

### 8.6 Automated Pruning Triggers

Don't wait for manual observation. Set up proactive checks:

| Check | Frequency | Action |
|-------|-----------|--------|
| Thoughts with `[STALE]` tag older than 60 days | Monthly | Delete if never accessed since tagged |
| Thoughts with importance < 2 AND accessed_count = 0 AND age > 60 days | Monthly | Delete without review |
| Skills not invoked in 90 days (check git blame + session logs) | Quarterly | Run /toughlove — keep or delete |
| Learnings that contradict newer learnings (same domain, conflicting advice) | Monthly | Resolve conflict: keep the correct one, delete the wrong one |
| SOPs that no agent references in session logs | Quarterly | Verify still relevant — delete if orphaned |
| Deprecated skills (Iris, Neo, Spike) still existing | Immediately | DELETE now — they are dead weight |

### 8.7 Deletion vs Deprecation — When to Use Each

| Scenario | Action | Why |
|----------|--------|-----|
| Skill consolidated into another (Neo → Builder) | **DELETE** the old skill | Redirects add confusion. Delete and update references. |
| Learning was wrong from the start | **DELETE** the learning | [SUPERSEDED] implies it was once correct. It wasn't. Delete it. |
| Thought encodes a bug that was fixed | **DELETE** the thought | Keeping it pollutes search results with stale problem descriptions. |
| SOP section describes a process that changed | **UPDATE** the section | The SOP structure is still valid, just the content needs refreshing. |
| Skill is partially useful but has major gaps | **IMPROVE** via toughlove | Don't delete good foundations — fix the gaps. |
| Skill fundamentally misunderstands the domain | **DELETE and REBUILD** | You can't patch a broken mental model. Start fresh. |

### 8.8 The Constitutional Rule

**If an agent follows a skill, thought, or learning and it causes a failure, the agent who discovers the failure is REQUIRED to initiate the removal cycle (Section 8.3).** This is not optional. Leaving broken knowledge in the system is a compliance violation equivalent to not logging time.

**The sequence**:
1. Capture a `[QUESTIONED]` thought (immediate)
2. Tag the target (immediate)
3. Open toughlove review (before next use of the target)
4. Complete the improve-or-delete cycle (within 48 hours)

Ignoring a known-bad pattern is worse than creating it in the first place.

---

## 9. Anti-Patterns (NEVER DO)

| Anti-Pattern | Why It's Bad | Do This Instead |
|-------------|-------------|-----------------|
| Dump entire conversation into a single thought | Too long (>2000 chars), unfocused, degrades search quality | Extract specific decisions, learnings, and patterns as separate thoughts |
| Use generic tags like "misc" or "other" | Useless for retrieval -- these tags match everything and nothing | Use specific domain/technology/project tags |
| Set all thoughts to importance 10 | Destroys the signal -- if everything is critical, nothing is | Follow the importance scale: most thoughts should be 4-6, only genuine critical lessons get 9-10 |
| Skip capture because "it was a short session" | Even 5-minute sessions produce signal (a quick decision is still a decision) | Capture a concise note with the key outcome |
| Capture implementation details that belong in code comments | OB1 is for decisions and patterns, not line-by-line code explanations | Put implementation details in code comments, put the WHY in OB1 |
| Capture thoughts without checking for existing duplicates | Clutters the knowledge base and wastes storage | Query first, then capture only if the insight is genuinely new |
| Use thoughts as a TODO list | OB1 is memory, not a task manager -- Airtable is for tasks | Log tasks in Airtable, log the reasoning behind tasks in OB1 |
| Store credentials or PII in thought content | Security risk -- thoughts are queryable by all agents | Reference `.env.local` or credential storage by name, never by value |
| Mark broken knowledge as [SUPERSEDED] instead of deleting | Agents still find and follow superseded entries — partial visibility is worse than no visibility | DELETE wrong knowledge. Capture a deletion thought. Rebuild from scratch if needed. |
| Leave [QUESTIONED] tags unresolved for weeks | Questioned knowledge in limbo poisons agent decisions — they don't know whether to follow it or not | Resolve within 48 hours: toughlove → improve → verify, or delete. No middle ground. |
| Iterate endlessly on broken patterns | After 2 rounds of toughlove-and-fix, the mental model is wrong. More patches won't help. | Delete. Start from scratch. Use the deletion thought as the anti-pattern guide. |
| Delete without capturing why | The deletion itself is the most valuable learning — what was tried, why it failed, what to do instead | ALWAYS capture a deletion thought (importance 9) before removing anything. |

---

## 10. Integration with Existing SOPs

This SOP does NOT replace existing protocols. It extends them:

| Existing SOP | What It Covers | What This SOP Adds |
|-------------|----------------|-------------------|
| `agent-logging-sop.md` | Airtable time entries + task records | OB1 thought capture + git linking + learnings versioning |
| OB1 Brain `SKILL.md` | How to use OB1 (capture, query, maintain) | When and why to capture (the protocol, not the tool) |
| [[constitution]] Shutdown Protocol | Mandatory logging before session end | Expanded shutdown checklist with OB1 + learnings + changelog |

### Combined Shutdown Checklist (Complete)

Before ending ANY session, complete ALL items:

1. [ ] OB1 session summary thought captured (this SOP, Section 1.3)
2. [ ] OB1 decision thoughts captured for significant decisions (this SOP, Section 1.2)
3. [ ] Git commits linked to OB1 thoughts where applicable (this SOP, Section 2)
4. [ ] Learnings files updated if new patterns discovered (this SOP, Section 3)
5. [ ] Changelog updated for non-trivial changes (this SOP, Section 4)
6. [ ] Airtable time entry logged (agent-logging-sop, Section 3.1)
7. [ ] Airtable task record created if applicable (agent-logging-sop, Section 3.2)

---

## 11. Quick Reference Card

### Session Start
```
1. Query OB1: search_thoughts_fts('{project} {keywords}')
2. Load: constitution + shared-learnings + {agent}-learnings
3. Check Airtable for assigned tasks
4. Record start time
```

### During Session
```
Decision made?  -> capture_thought(type='decision', importance=8-10)
Bug found?      -> capture_thought(type='learning', importance=7-9, tag='bug')
Pattern found?  -> capture_thought(type='learning', importance=6-8, tag='pattern')
Git commit?     -> capture_thought(type='decision', tag='git', source='git-commit')
```

### Session End
```
1. capture_thought(type='note', tag='session-log')
2. Update {agent}-learnings.md (+ shared-learnings.md if cross-agent)
3. Log Airtable time entry + task
4. Update CHANGELOG.md if non-trivial changes
5. Verify: all 7 checklist items complete
```

### OB1 Connection
```
API: https://api.supabase.com/v1/projects/mihnndoucbaftcwujstz/database/query
Auth: Bearer sbp_e6b8246c09662d4e3fdf62692c0d4ac10c352969
MCP: supabase server in MCP config
```

---

## Related Documents

- `.specify/sops/agent-logging-sop.md` -- Airtable time + task logging
- `.claude/skills/infrastructure/ob1-brain/SKILL.md` -- OB1 Brain skill definition
- `.claude/skills/infrastructure/session-logger/SKILL.md` -- Session Logger skill (implements this SOP)
- `.specify/memory/constitution.md` -- Constitution (source of truth for all rules)
- `.specify/memory/learnings/shared-learnings.md` -- Cross-agent learnings
- `.specify/templates/learnings-template.md` -- Template for new learnings files

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-03-30 | Session Logger | Initial SOP creation -- covers session capture, git linking, learnings versioning, changelog, OB1 growth metrics, failure recovery, compliance enforcement |
| 1.1.0 | 2026-03-30 | Session Logger | Added Section 8: Removal & Pruning Protocol — complete deletion lifecycle (observe → question → toughlove → improve → delete → rebuild), skill lifecycle states, automated pruning triggers, deletion thought requirements. Added 4 removal anti-patterns to Section 9. |
