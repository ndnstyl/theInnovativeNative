---
name: speckit.fullloop
description: Workflow recipe that chains the speckit pipeline (specify → plan → toughlove → tasks → implement → test → iterate) by delegating each phase to the appropriate subagent. NOT an alternative executor — it orchestrates implementer/reviewer/deployer rather than replacing them.
user_invocable: true
---

# Full Loop Pipeline (Workflow Recipe)

This skill is a **chained workflow**, not an agent. It scripts the order of `/speckit.*`, `/toughlove`, build, deploy, and test commands. Code changes still go through the **implementer** subagent; reviews still go through **reviewer**; git/deploy still goes through **deployer**. The orchestrator owns delegation — this skill is the playbook the orchestrator follows when the user asks for full-loop execution.

## Input
The feature description (same as /speckit.specify input).

## Pipeline Steps

### Step 1: Specify
Run `/speckit.specify` with the feature description. Generate spec.md + checklists.

### Step 2: Plan
Run `/speckit.plan` on the feature directory. Generate plan.md, research.md, data-model.md, contracts/, quickstart.md.

### Step 3: Toughlove (Pre-Implementation)
Run `/toughlove` on the spec kit. Focus on:
- Mobile-first gaps
- Missing edge cases
- Data model accuracy (query actual DB to verify)
- Accessibility gaps
- Performance gaps
- Implementability

Fix ALL critical and high issues. Update spec/plan/data-model as needed.

### Step 4: Tasks
Run `/speckit.tasks` to generate tasks.md.

### Step 5: Implement
Run `/speckit.implement` to execute all tasks phase by phase.
After EACH phase:
1. Run `npm run build` — fix any TypeScript errors
2. Check for lint errors
3. Verify no regressions in existing E2E tests

### Step 6: Deploy + Test
1. Build: `npm run build`
2. Deploy: rsync to A2 Hosting
3. Fix directory indexes
4. Run: `npx playwright test e2e/ --reporter=list`
5. If tests fail → fix → redeploy → retest (max 3 iterations)

### Step 7: Toughlove (Post-Implementation)
Run `/toughlove` on the implemented code. Grade A-F.
- If grade < A-: identify issues, fix them, redeploy, retest
- Iterate until A- or better
- Max 3 toughlove iterations

### Step 8: Log
Log everything to:
- .specify/features/{feature}/qa/ — toughlove reports
- .specify/memory/learnings/shared-learnings.md — new patterns
- Memory files — key decisions and findings

## Autonomy Rules
- Run on loop without asking user unless:
  - A CRITICAL blocker requires user input (e.g., missing credentials, ambiguous scope)
  - TypeScript build fails 3x on the same error
  - E2E tests fail 3x on the same test
- Report progress at each phase boundary
- Always run `npm run build` after modifying code — never deploy broken builds
- Always run E2E tests after deploy — never call it done without green tests

## Exit Criteria
- All tasks in tasks.md marked [X]
- `npm run build` passes with 0 errors
- All E2E tests pass (30+)
- Toughlove grade: A- or better
- Deployed to production
- All findings logged
