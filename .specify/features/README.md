# Features Directory — MOVED

> **As of 2026-06-05, feature spec kits live in the visible top-level [`/specs`](../../specs/) directory**, not here.
>
> They were surfaced out of `.specify/features/` so they are reachable in Finder without "Show Hidden Files." This also aligns with the Spec Kit CLI (`.specify/scripts/bash/common.sh`), which already writes new features to `/specs`.

## Where things are now

| What | Location |
|------|----------|
| Active + historical spec kits | `/specs/<feature-name>/` |
| Stale / superseded / completed kits | `.specify/archive/2026-06/` |

## Creating a New Feature

The Spec Kit commands already target `/specs` automatically:
- `/speckit.specify` — Create the specification
- `/speckit.plan` — Generate implementation plan
- `/speckit.tasks` — Generate task breakdown

## Note

Personal/proprietary feature specs remain excluded from git tracking
(`/specs` and `.specify/features/` are both gitignored). Only this README is
committed to preserve the folder structure and the redirect note above.
