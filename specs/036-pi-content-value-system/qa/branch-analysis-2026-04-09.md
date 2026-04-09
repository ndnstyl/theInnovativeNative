# Git Branch Analysis — 2026-04-09

**Analyst**: CEO direct execution (Claude, P1)
**Context**: Feature 036 session, user requested branch/merge analysis
**Scope**: All local branches vs main, remote sync status, merge recommendations

---

## 🚨 Headline Findings

1. **Main is abandoned.** `main` has only 2 commits: `7401120 Complete site rebuild with interactive resume and portfolio` and `48b4cec Initial commit from Create Next App`. Main has not received a merge in months.

2. **20+ commits of completed work are trapped in feature branches.** The most advanced state is `a7022cc feat: community feed UX — modal, pins, emoji, accessibility` on branches 034 and 036. That represents feature 008 (website clarity) → feature 031 (Skool UI) → feature 032 (AI community agents) → feature 033 (trading system scaffolding) → feature 034 (community feed UX), all stacked.

3. **Only 3 branches are pushed to origin**: `main`, `Cerebro`, and the auto-tracked `origin/HEAD → origin/main`. **11+ feature branches exist only locally.** If this laptop burns, the work is gone.

4. **Branch tree is linear, not parallel.** Each feature branch rebased or merged forward, so 034 contains the work of 008, 009, 010, 011, 030, 031, 032, 033 — one big stack. This is good news for consolidation: a single merge of 034 into main catches up everything up to that point.

5. **Feature 036 is branched from 034 at HEAD.** It inherits all the stacked work + my current session's uncommitted 036 files.

---

## Branch Inventory

| Branch | HEAD | Age | Status | Relationship to main | Remote |
|--------|------|-----|--------|----------------------|--------|
| `main` | `7401120` | Anchor | Stable, old | — | ✅ origin/main |
| `Cerebro` | `9c9ef94` | Old | Cleanup state | Ahead of main | ✅ origin/Cerebro |
| `001-n8n-nextjs-blog-migration` | `7401120` | Old | **Identical to main** | Same as main | ❌ local only |
| `001-neo-workflow-management` | `9c9ef94` | Old | Cleanup state | Ahead of main | ❌ local only |
| `002-stan-store-lawfirm-funnel` | `9c9ef94` | Old | Cleanup state (the PI lawyer funnel — this feature is what feature 036 builds on!) | Ahead of main | ❌ local only |
| `003-haven-ugc-broll` | `9c9ef94` | Old | Cleanup state | Ahead of main | ❌ local only |
| `005-bowtie-video-pipeline` | `8d3d670` | Old | QA remediation done | Ahead of main | ❌ local only |
| `006-ai-assisted-editing-pp2026` | `e64740d` | Old | Mid-feature | Ahead of main | ❌ local only |
| `007-brand-timelapse` | `f71f86c` | Old | Script cleanup | Ahead of main | ❌ local only |
| `008-website-clarity-overhaul` | `a311215` | Recent | Test infra added | Ahead of main ~8 commits | ❌ local only |
| `009-classroom-landing` | `a311215` | Recent | Same as 008 | Ahead of main ~8 commits | ❌ local only |
| `010-classroom-lms` | `a311215` | Recent | Same as 008 | Ahead of main ~8 commits | ❌ local only |
| `011-cerebro-reply-monitor` | `a311215` | Recent | Same as 008 | Ahead of main ~8 commits | ❌ local only |
| `030-error-handling` | `a311215` | Recent | Same as 008 | Ahead of main ~8 commits | ❌ local only |
| `031-skool-ui-overhaul` | `6a704ff` | Recent | Skool UI shipped | Ahead of main ~15 commits | ❌ local only |
| `032-ai-community-agents` | `4653abe` | Recent | **37 E2E tests passing** | Ahead of main ~18 commits | ❌ local only |
| `033-ai-trading-system` | `4653abe` | Recent | Same HEAD as 032 | Ahead of main ~18 commits | ❌ local only |
| `034-community-feed-ux` | `a7022cc` | **Most recent** | Community feed UX shipped | Ahead of main ~20 commits | ❌ local only |
| `036-pi-content-value-system` | `a7022cc` + uncommitted | **Current** | Feature 036 WIP | Ahead of main ~20 commits + WIP | ❌ local only |

**Note**: No `035` branch exists locally — the `035-harness-autonomy` was only in `.specify/features/` as a spec kit, not branched.

---

## Stale Branches (safe to delete after consolidation)

These branches are redundant or identical to more advanced branches:

| Branch | Why stale | Safe to delete? |
|--------|-----------|-----------------|
| `001-n8n-nextjs-blog-migration` | Identical to main (no divergence) | ✅ Yes |
| `008-website-clarity-overhaul` through `030-error-handling` | All at `a311215`, superseded by 034 which contains this commit | ⚠️ After merging 034 to main |
| `031-skool-ui-overhaul` | At `6a704ff`, superseded by 034 | ⚠️ After merging 034 |
| `032-ai-community-agents` | At `4653abe`, superseded by 034 | ⚠️ After merging 034 |
| `033-ai-trading-system` | At `4653abe`, superseded by 034 **BUT** this branch name suggests separate domain work (trading system). Double-check with Mike before deleting. | ❓ Confirm with Mike |
| `Cerebro` branch on origin | Contains early cleanup state, behind main's community work | ⚠️ Review before deleting |
| `001-neo-workflow-management`, `002-stan-store-lawfirm-funnel`, `003-haven-ugc-broll` | All at older `9c9ef94` — old feature branches | ⚠️ Confirm with Mike; 002 especially since feature 036 works on its PI content |
| `005-bowtie-video-pipeline`, `006-ai-assisted-editing-pp2026`, `007-brand-timelapse` | Various mid-feature states — unclear if superseded | ❓ Confirm with Mike |

---

## 🟢 What Needs to Be Merged (recommended order)

### Option A: Single fast-forward merge (recommended)

Because 034 contains all the stacked work linearly:

```bash
# From repo root
git checkout main
git merge --ff-only 034-community-feed-ux
# This catches main up to 034's HEAD — all 20+ commits come along for the ride
```

**Pros**: One step. Clean history. Catches main up to the most advanced committed state in one go.

**Cons**: Does NOT include feature 036 WIP (my current session). That requires a separate step.

### Option B: Merge 034, then merge 036 on top

```bash
# Step 1: commit feature 036 work (I'll do this below)
# Step 2: merge 034 to main first
git checkout main
git merge --ff-only 034-community-feed-ux

# Step 3: rebase 036 onto the new main
git checkout 036-pi-content-value-system
git rebase main  # no-op because 036 branched from 034 = same commits
# Now 036 is identical to main + 036-specific commits

# Step 4: merge 036 to main when ready (after Tier 1 deploy approval)
git checkout main
git merge --ff-only 036-pi-content-value-system  # OR no-ff if you want a merge commit
```

**Pros**: Staged. Gives Mike a review checkpoint between 034's work and 036's work. Each merge can be separately reviewed.

**Cons**: Two steps, but low risk because the merges are fast-forwards (no conflicts possible).

### Option C: No merge yet, keep working

**Not recommended.** The longer main stays behind, the higher the risk of conflict buildup with any parallel work. Also: nothing is pushed to remote, so a laptop failure loses everything.

### My Recommendation: **Option B, executed in this order:**

1. **Now (this session)**: Commit feature 036 work to branch 036-pi-content-value-system (I do this below). The branch now has `a7022cc + feat(036) Tier 1 partial` as its HEAD.
2. **Today or tomorrow (Mike's call)**: `git merge --ff-only 034-community-feed-ux` into main. Push main to origin (`git push origin main`).
3. **After Mike tests n8n v50 and approves the Tier 1 deploy**: merge 036 into main, push, deploy.

After those merges, all 11+ local feature branches can be deleted in batch:

```bash
git branch -d 001-n8n-nextjs-blog-migration 008-website-clarity-overhaul \
              009-classroom-landing 010-classroom-lms 011-cerebro-reply-monitor \
              030-error-handling 031-skool-ui-overhaul 032-ai-community-agents
# Keep 033-ai-trading-system until Mike confirms it's consolidated
# Keep 034 until 036 is merged (safety net)
# Keep 005, 006, 007 and the 001/002/003 branches until Mike reviews them individually
```

---

## ⚠️ Risks with Current Branch State

| Risk | Severity | Mitigation |
|------|----------|-----------|
| **Laptop failure = total work loss** | 🔴 HIGH | Push 034 (or 036 after commit) to origin immediately. Even without merging to main, a backup on GitHub prevents total loss. |
| **Conflict buildup if parallel work begins** | 🟡 MEDIUM | Merge 034 → main soon so new branches start from a recent base. |
| **Branch names drift from work** (e.g., 002-stan-store-lawfirm-funnel sitting at old state while feature 036 does the lawyer work) | 🟡 MEDIUM | Delete stale branches after consolidation. |
| **No CI/CD validation of 034's work against main** | 🟡 MEDIUM | Once merged, GitHub Actions (if configured) validates. Also run `npm run build` + Playwright locally before merging. |
| **`001-n8n-nextjs-blog-migration` identical to main** | 🟢 LOW | Wasted branch slot. Safe to delete. |

---

## CI/CD Status (from this session's checks)

- ✅ **TypeScript**: `npx tsc --noEmit` exit 0 (no errors)
- ⏳ **Lint**: Not run in this session. Queued in Step 5 of speckit-fullloop.
- ⏳ **Full build** (`npm run build`): Not run yet in this session. Queued for pre-deploy (T035).
- ✅ **Playwright E2E** (existing 37 site-health tests): Presumed passing per last commit `4653abe test: add 37 E2E site health tests — 100% passing` but not re-run in this session yet.
- ⏳ **New Playwright `resources.spec.ts`**: Not authored yet (T016 — was tabled, being resumed).

**Remote push status**: No feature branches are on origin. `git push origin 036-pi-content-value-system` is a recommended action after the commit.

---

## Action Items

### For Mike (decide and execute)

1. **Approve Option B merge strategy** (or pick A/C).
2. **Push 036 to origin** immediately after commit (`git push -u origin 036-pi-content-value-system`) — laptop insurance.
3. **Execute the 034 → main fast-forward merge** at your convenience (today or tomorrow).
4. **Review individual stale branches** (002, 003, 005-007, 033, Cerebro) — decide which to delete vs keep.
5. **Consider opening GitHub PRs** for 034 and 036 instead of direct merges, if you want a review record.

### For the autonomous run (me, now)

1. ✅ Write this branch analysis — done
2. ⏳ Commit feature 036 work to the 036 branch
3. ⏳ Run full CI/CD: `npm run build`, lint, Playwright
4. ⏳ Continue remaining Tier 1 tasks (landing page, hub, nav, Day 15/16 rewrites via subagents)
5. ⏳ Produce final T038 Mike approval summary

---

## Appendix: Recommended git push command (for Mike)

```bash
# Push feature 036 to origin for backup (can be done before commit completes)
git push -u origin 036-pi-content-value-system

# Push 034 to origin for backup
git checkout 034-community-feed-ux
git push -u origin 034-community-feed-ux

# Optional: batch push of feature branches for backup
for br in 008-website-clarity-overhaul 009-classroom-landing 010-classroom-lms \
          011-cerebro-reply-monitor 030-error-handling 031-skool-ui-overhaul \
          032-ai-community-agents 033-ai-trading-system 034-community-feed-ux \
          036-pi-content-value-system; do
  git push -u origin "$br" 2>&1 | tail -1
done
```

Then the fast-forward merge to main:

```bash
git checkout main
git merge --ff-only 034-community-feed-ux
git push origin main  # now origin/main has all the stacked feature work
```
