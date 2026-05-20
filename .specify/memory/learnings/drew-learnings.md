# Drew - Project Manager Learnings

## Last Updated: 2026-02-04

## DREW'S PRIMARY RESPONSIBILITY: DOCUMENTATION OWNERSHIP

**Documentation is EVERYTHING. Without .md files, work cannot be tracked or continued.**

### Spec Kit Model (MANDATORY for every feature/project)

Every feature MUST have these files in `.specify/features/<project-name>/`:

| File | Purpose | Created When |
|------|---------|--------------|
| `spec.md` | User stories, requirements, success criteria | Before any work starts |
| `plan.md` | Implementation approach, timeline, dependencies | After spec approved |
| `tasks.md` | Detailed task breakdown with IDs, agents, status | After plan approved |

### Why This Matters

1. **Session Continuity**: Sessions crash. Context gets lost. .md files persist.
2. **Delegation**: Agents can't work without documented tasks
3. **Progress Tracking**: No file = no proof of work
4. **Handoffs**: Another session/agent must pick up exactly where left off

### Drew's Documentation Duties

- [ ] Verify spec kit exists BEFORE delegating work
- [ ] Update tasks.md status after every agent completes
- [ ] Ensure agents document their deliverables in project files
- [ ] Weekly audit: all active projects have complete spec kits

**FAILURE TO MAINTAIN DOCUMENTATION = PROJECT FAILURE**

---

## Critical Mistakes (NEVER REPEAT)
- [2026-02-04] Delegated work without verifying spec kit files existed first

## Domain Patterns
- **Task Routing**: All requests except exceptions flow through PM
- **Health Checks**: Run weekly minimum, daily preferred
- **Escalation**: Follow matrix thresholds exactly
- **Content Campaign Planning**: Start with existing assets audit before planning new content

## Quick Reference
- 9 active projects, each targeting 4 hours/week
- Health score < 60 = critical escalation
- Weekly status reports due Friday
- Time log entries required for all work
- Law Firm RAG marketing assets: `/law_firm_RAG/marketing/MARKETING_ASSETS.md`
- Remotion video project: `/remotion-videos/`

## Integration Gotchas
- None recorded yet

## Successful Approaches
- **Content Campaign Planning**: Audit existing assets first, then identify gaps. Law Firm RAG already had LinkedIn posts, video scripts, cold email templates, and slide deck content ready in MARKETING_ASSETS.md
- **Agent Coordination**: Set task dependencies to prevent blockers. Example: Muse waits for Chris's posts before creating graphics

## Project Health Thresholds
- Green: 80-100
- Yellow: 60-79
- Red: 0-59 (requires escalation)

## Content Campaign Checklist
1. Load constitution and learnings
2. Read project lead's skill file
3. Check registry.json for project details
4. Audit existing marketing assets
5. Review brand system (brand.json, tone-of-voice.md, brand-system.md)
6. Create comprehensive plan with task breakdown
7. Set up task tracking with dependencies
8. Log time and report completion
