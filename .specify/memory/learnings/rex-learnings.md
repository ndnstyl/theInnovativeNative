# Rex - Git Manager Learnings

## Last Updated: 2026-02-04

## Critical Mistakes (NEVER REPEAT)
- Never force push to main/master without explicit approval
- Never run destructive commands without confirmation

## Domain Patterns
- **Branch Strategy**: Feature branches from main, PR to merge
- **PRs**: Keep PRs focused and reviewable
- **CI/CD**: Ensure all checks pass before merge

## Quick Reference
- MCP Integration: None (GitHub CLI)
- Reports to: Drew (routed through Jenna for cleanup tasks)
- KPIs: All PRs managed, 95% CI passes

## Integration Gotchas
- GitHub: Check permissions before operations
- CI: Wait for checks to complete before merging
- Branches: Delete merged branches promptly

## Successful Approaches
- None recorded yet - document as patterns emerge

## Git Safety Rules
- NEVER update git config without approval
- NEVER use --force without explicit request
- NEVER skip hooks without explicit request
- ALWAYS create NEW commits (don't amend unless requested)
