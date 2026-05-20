# Features Directory

This directory contains feature specifications following the Spec Kit model.

## Structure

Each feature should have its own folder with:

```
.specify/features/<feature-name>/
├── spec.md     # User stories, requirements, success criteria
├── plan.md     # Implementation approach, timeline, dependencies
└── tasks.md    # Task breakdown with IDs, agents, status checkboxes
```

## Creating a New Feature

1. Create a new folder: `.specify/features/my-feature/`
2. Use the SpecKit commands to generate spec files:
   - `/speckit.specify` - Create the specification
   - `/speckit.plan` - Generate implementation plan
   - `/speckit.tasks` - Generate task breakdown

## Note

Personal/proprietary feature specs are excluded from git tracking.
Only this README is committed to preserve the folder structure.
